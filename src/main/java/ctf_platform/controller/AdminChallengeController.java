package ctf_platform.controller;

import ctf_platform.entity.Challenge;
import ctf_platform.repository.ChallengeRepository;
import ctf_platform.repository.SubmissionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/challenges")
@CrossOrigin(origins = "*")
public class AdminChallengeController {

    private final ChallengeRepository challengeRepository;
    private final SubmissionRepository submissionRepository;

    private final Path uploadDirectory =
            Paths.get("uploads", "challenges")
                    .toAbsolutePath()
                    .normalize();

    public AdminChallengeController(
            ChallengeRepository challengeRepository,
            SubmissionRepository submissionRepository) {

        this.challengeRepository = challengeRepository;
        this.submissionRepository = submissionRepository;

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create challenge upload directory",
                    e
            );
        }
    }

    @PostMapping
    public ResponseEntity<Challenge> addChallenge(
            @RequestBody Challenge challenge) {

        challenge.setFileName(null);
        challenge.setStoredFileName(null);

        Challenge savedChallenge =
                challengeRepository.save(challenge);

        return ResponseEntity.ok(savedChallenge);
    }

    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {

        return ResponseEntity.ok(
                challengeRepository.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChallenge(
            @PathVariable Long id) {

        return challengeRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateChallenge(
            @PathVariable Long id,
            @RequestBody Challenge challengeDetails) {

        return challengeRepository.findById(id)
                .map(challenge -> {

                    challenge.setTitle(challengeDetails.getTitle());
                    challenge.setDescription(challengeDetails.getDescription());
                    challenge.setCategory(challengeDetails.getCategory());
                    challenge.setDifficulty(challengeDetails.getDifficulty());
                    challenge.setPoints(challengeDetails.getPoints());
                    challenge.setFlag(challengeDetails.getFlag());

                    Challenge updatedChallenge =
                            challengeRepository.save(challenge);

                    return ResponseEntity.ok(updatedChallenge);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/file")
    public ResponseEntity<?> uploadChallengeFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please select a file");
        }

        Challenge challenge =
                challengeRepository.findById(id).orElse(null);

        if (challenge == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null ||
                    originalFileName.trim().isEmpty()) {
                originalFileName = "challenge-file";
            }

            originalFileName =
                    Paths.get(originalFileName)
                            .getFileName()
                            .toString();

            String storedFileName =
                    UUID.randomUUID() + "_" + originalFileName;

            Path targetLocation =
                    uploadDirectory
                            .resolve(storedFileName)
                            .normalize();

            if (!targetLocation.startsWith(uploadDirectory)) {
                return ResponseEntity
                        .badRequest()
                        .body("Invalid file name");
            }

            if (challenge.getStoredFileName() != null) {
                Path oldFile =
                        uploadDirectory
                                .resolve(challenge.getStoredFileName())
                                .normalize();

                if (oldFile.startsWith(uploadDirectory)) {
                    Files.deleteIfExists(oldFile);
                }
            }

            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );

            challenge.setFileName(originalFileName);
            challenge.setStoredFileName(storedFileName);

            challengeRepository.save(challenge);

            return ResponseEntity.ok(
                    "Challenge file uploaded successfully"
            );

        } catch (IOException e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Could not upload challenge file");
        }
    }

    @DeleteMapping("/{id}/file")
    public ResponseEntity<?> deleteChallengeFile(
            @PathVariable Long id) {

        Challenge challenge =
                challengeRepository.findById(id).orElse(null);

        if (challenge == null) {
            return ResponseEntity.notFound().build();
        }

        if (challenge.getStoredFileName() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("This challenge does not have a file");
        }

        try {
            Path filePath =
                    uploadDirectory
                            .resolve(challenge.getStoredFileName())
                            .normalize();

            if (!filePath.startsWith(uploadDirectory)) {
                return ResponseEntity
                        .badRequest()
                        .body("Invalid stored file path");
            }

            Files.deleteIfExists(filePath);

            challenge.setFileName(null);
            challenge.setStoredFileName(null);

            challengeRepository.save(challenge);

            return ResponseEntity.ok(
                    "Challenge file deleted successfully"
            );

        } catch (IOException e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Could not delete challenge file");
        }
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(
            @PathVariable Long id) {

        Challenge challenge =
                challengeRepository.findById(id).orElse(null);

        if (challenge == null) {
            return ResponseEntity.notFound().build();
        }

        /*
         * IMPORTANT:
         * submissions.challenge_id references challenges.id.
         * Delete those child rows first to avoid the MySQL
         * foreign-key constraint error.
         */
        submissionRepository.deleteByChallengeId(id);

        /*
         * Delete the physical attachment if the challenge has one.
         */
        if (challenge.getStoredFileName() != null) {
            try {
                Path filePath =
                        uploadDirectory
                                .resolve(challenge.getStoredFileName())
                                .normalize();

                if (!filePath.startsWith(uploadDirectory)) {
                    return ResponseEntity
                            .badRequest()
                            .body("Invalid stored file path");
                }

                Files.deleteIfExists(filePath);

            } catch (IOException e) {
                return ResponseEntity
                        .internalServerError()
                        .body("Could not delete challenge file");
            }
        }

        challengeRepository.delete(challenge);

        return ResponseEntity.ok(
                "Challenge deleted successfully"
        );
    }
}

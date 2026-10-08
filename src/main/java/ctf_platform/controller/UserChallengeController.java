package ctf_platform.controller;

import ctf_platform.entity.Challenge;
import ctf_platform.repository.ChallengeRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class UserChallengeController {

    private final ChallengeRepository challengeRepository;

    private final Path uploadDirectory =
            Paths.get("uploads", "challenges")
                    .toAbsolutePath()
                    .normalize();

    public UserChallengeController(
            ChallengeRepository challengeRepository) {

        this.challengeRepository = challengeRepository;
    }


    // =========================
    // VIEW ALL CHALLENGES
    // =========================

    @GetMapping
    public ResponseEntity<List<ChallengeResponse>>
    getAllChallenges() {

        List<ChallengeResponse> challenges =
                challengeRepository.findAll()
                        .stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(challenges);
    }


    // =========================
    // VIEW ONE CHALLENGE
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getChallenge(
            @PathVariable Long id) {

        return challengeRepository
                .findById(id)
                .map(challenge ->
                        ResponseEntity.ok(
                                convertToResponse(challenge)
                        )
                )
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // =========================
    // DOWNLOAD CHALLENGE FILE
    // =========================

    @GetMapping("/{id}/file")
    public ResponseEntity<?> downloadChallengeFile(
            @PathVariable Long id) {

        Challenge challenge =
                challengeRepository
                        .findById(id)
                        .orElse(null);

        if (challenge == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (challenge.getStoredFileName() == null ||
                challenge.getFileName() == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        try {

            Path filePath =
                    uploadDirectory
                            .resolve(
                                    challenge.getStoredFileName()
                            )
                            .normalize();

            if (!filePath.startsWith(uploadDirectory)) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid file path");
            }

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String contentType =
                    Files.probeContentType(filePath);

            if (contentType == null) {

                contentType =
                        "application/octet-stream";
            }

            ContentDisposition disposition =
                    ContentDisposition
                            .attachment()
                            .filename(
                                    challenge.getFileName()
                            )
                            .build();

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            disposition.toString()
                    )
                    .body(resource);

        } catch (MalformedURLException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Could not download challenge file"
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Could not download challenge file"
                    );
        }
    }


    // =========================
    // REMOVE FLAG FROM RESPONSE
    // =========================

    private ChallengeResponse convertToResponse(
            Challenge challenge) {

        return new ChallengeResponse(
                challenge.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getCategory(),
                challenge.getDifficulty(),
                challenge.getPoints(),
                challenge.getFileName()
        );
    }


    // =========================
    // RESPONSE CLASS
    // =========================

    public static class ChallengeResponse {

        private Long id;
        private String title;
        private String description;
        private String category;
        private String difficulty;
        private int points;

        private String fileName;

        public ChallengeResponse(
                Long id,
                String title,
                String description,
                String category,
                String difficulty,
                int points,
                String fileName) {

            this.id = id;
            this.title = title;
            this.description = description;
            this.category = category;
            this.difficulty = difficulty;
            this.points = points;
            this.fileName = fileName;
        }

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }

        public String getCategory() {
            return category;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public int getPoints() {
            return points;
        }

        public String getFileName() {
            return fileName;
        }

        public boolean isHasFile() {
            return fileName != null &&
                    !fileName.trim().isEmpty();
        }
    }
}
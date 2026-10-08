package ctf_platform.controller;

import ctf_platform.entity.Challenge;
import ctf_platform.entity.Submission;
import ctf_platform.entity.User;
import ctf_platform.repository.ChallengeRepository;
import ctf_platform.repository.SubmissionRepository;
import ctf_platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    public SubmissionController(
            SubmissionRepository submissionRepository,
            ChallengeRepository challengeRepository,
            UserRepository userRepository) {

        this.submissionRepository = submissionRepository;
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // SUBMIT FLAG
    // =========================

    @PostMapping("/{challengeId}")
    public ResponseEntity<?> submitFlag(
            @PathVariable Long challengeId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        // Get logged-in username
        String username = authentication.getName();

        // Find user
        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        // Find challenge
        Challenge challenge = challengeRepository
                .findById(challengeId)
                .orElse(null);

        if (challenge == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        // Get submitted flag
        String submittedFlag = request.get("flag");

        if (submittedFlag == null ||
                submittedFlag.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Flag is required");
        }

        // Check if already solved
        boolean alreadySolved =
                submissionRepository
                        .existsByUserIdAndChallengeIdAndCorrectTrue(
                                user.getId(),
                                challenge.getId()
                        );

        if (alreadySolved) {

            return ResponseEntity
                    .badRequest()
                    .body("You have already solved this challenge");
        }

        // Check flag
        boolean correct =
                challenge.getFlag().equals(submittedFlag.trim());

        // Create submission
        Submission submission = new Submission();

        submission.setUser(user);
        submission.setChallenge(challenge);
        submission.setCorrect(correct);
        submission.setSubmittedAt(LocalDateTime.now());

        // =========================
        // CORRECT FLAG
        // =========================

        if (correct) {

            int points = challenge.getPoints();

            submission.setPointsAwarded(points);

            // Add points to user's score
            user.setScore(
                    user.getScore() + points
            );

            userRepository.save(user);
            submissionRepository.save(submission);

            Map<String, Object> response =
                    new HashMap<>();

            response.put("message",
                    "Correct flag! Challenge solved.");

            response.put("correct", true);
            response.put("pointsAwarded", points);
            response.put("totalScore", user.getScore());

            return ResponseEntity.ok(response);
        }


        // =========================
        // WRONG FLAG
        // =========================

        submission.setPointsAwarded(0);

        submissionRepository.save(submission);

        Map<String, Object> response =
                new HashMap<>();

        response.put("message", "Incorrect flag!");
        response.put("correct", false);
        response.put("pointsAwarded", 0);
        response.put("totalScore", user.getScore());

        return ResponseEntity.ok(response);
    }


    // =========================
    // VIEW MY SUBMISSIONS
    // =========================

    @GetMapping("/my")
    public ResponseEntity<?> getMySubmissions(
            Authentication authentication) {

        String username = authentication.getName();

        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        List<Submission> submissions =
                submissionRepository
                        .findByUserId(user.getId());

        return ResponseEntity.ok(submissions);
    }
}
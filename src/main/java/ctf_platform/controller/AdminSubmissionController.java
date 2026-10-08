package ctf_platform.controller;

import ctf_platform.entity.Submission;
import ctf_platform.repository.SubmissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/submissions")
@CrossOrigin(origins = "*")
public class AdminSubmissionController {

    private final SubmissionRepository submissionRepository;

    public AdminSubmissionController(
            SubmissionRepository submissionRepository) {

        this.submissionRepository = submissionRepository;
    }

    // GET ALL SUBMISSIONS
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSubmissions() {

        List<Submission> submissions =
                submissionRepository.findAll();

        List<Map<String, Object>> submissionList =
                new ArrayList<>();

        for (Submission submission : submissions) {

            Map<String, Object> submissionData =
                    new HashMap<>();

            submissionData.put(
                    "id",
                    submission.getId()
            );

            submissionData.put(
                    "username",
                    submission.getUser().getUsername()
            );

            submissionData.put(
                    "challengeId",
                    submission.getChallenge().getId()
            );

            submissionData.put(
                    "challengeTitle",
                    submission.getChallenge().getTitle()
            );

            submissionData.put(
                    "correct",
                    submission.isCorrect()
            );

            submissionData.put(
                    "pointsAwarded",
                    submission.getPointsAwarded()
            );

            submissionData.put(
                    "submittedAt",
                    submission.getSubmittedAt()
            );

            submissionList.add(submissionData);
        }

        return ResponseEntity.ok(submissionList);
    }

    // GET ONE SUBMISSION
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmission(
            @PathVariable Long id) {

        return submissionRepository.findById(id)
                .map(submission -> {

                    Map<String, Object> submissionData =
                            new HashMap<>();

                    submissionData.put(
                            "id",
                            submission.getId()
                    );

                    submissionData.put(
                            "username",
                            submission.getUser().getUsername()
                    );

                    submissionData.put(
                            "challengeId",
                            submission.getChallenge().getId()
                    );

                    submissionData.put(
                            "challengeTitle",
                            submission.getChallenge().getTitle()
                    );

                    submissionData.put(
                            "correct",
                            submission.isCorrect()
                    );

                    submissionData.put(
                            "pointsAwarded",
                            submission.getPointsAwarded()
                    );

                    submissionData.put(
                            "submittedAt",
                            submission.getSubmittedAt()
                    );

                    return ResponseEntity.ok(
                            submissionData
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
}
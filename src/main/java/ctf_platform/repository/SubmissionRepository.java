package ctf_platform.repository;

import ctf_platform.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository
        extends JpaRepository<Submission, Long> {

    boolean existsByUserIdAndChallengeIdAndCorrectTrue(
            Long userId,
            Long challengeId
    );

    List<Submission> findByUserId(Long userId);

    void deleteByUserId(Long userId);

    void deleteByChallengeId(Long challengeId);
}

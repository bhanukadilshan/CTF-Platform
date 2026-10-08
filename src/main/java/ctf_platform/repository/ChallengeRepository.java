package ctf_platform.repository;

import ctf_platform.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository
        extends JpaRepository<Challenge, Long> {
}
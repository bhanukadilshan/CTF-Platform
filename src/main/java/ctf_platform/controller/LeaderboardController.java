package ctf_platform.controller;

import ctf_platform.entity.User;
import ctf_platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final UserRepository userRepository;

    public LeaderboardController(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    // =========================
    // VIEW LEADERBOARD
    // =========================

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {

        List<User> users =
                userRepository.findAllByOrderByScoreDesc();

        List<Map<String, Object>> leaderboard =
                new ArrayList<>();

        int rank = 1;

        for (User user : users) {

            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                continue;
            }

            Map<String, Object> player =
                    new HashMap<>();

            player.put("rank", rank);
            player.put("username", user.getUsername());
            player.put("score", user.getScore());

            leaderboard.add(player);

            rank++;
        }

        return ResponseEntity.ok(leaderboard);
    }
}
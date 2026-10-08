package ctf_platform.controller;

import ctf_platform.entity.User;
import ctf_platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    // =========================
    // USER PROFILE
    // =========================

    @GetMapping("/profile")
    public ResponseEntity<?> profile(
            Authentication authentication) {

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow();

        Map<String, Object> profile =
                new HashMap<>();

        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());

        return ResponseEntity.ok(profile);
    }
}
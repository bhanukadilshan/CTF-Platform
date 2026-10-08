package ctf_platform.controller;

import ctf_platform.entity.User;
import ctf_platform.repository.UserRepository;
import ctf_platform.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        user.setScore(0);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("username", savedUser.getUsername());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());
        response.put("score", savedUser.getScore());
        response.put("active", savedUser.isActive());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        Optional<User> userOptional =
                userRepository.findByUsername(loginUser.getUsername());

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid username or password");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(
                loginUser.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid username or password");
        }

        if (!user.isActive()) {
            return ResponseEntity
                    .status(403)
                    .body("Your account has been suspended. Please contact the administrator.");
        }

        String token =
                jwtService.generateToken(
                        user.getUsername(),
                        user.getRole()
                );

        return ResponseEntity.ok(token);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (username == null ||
                oldPassword == null ||
                newPassword == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Username, old password and new password are required");
        }

        if (newPassword.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("New password cannot be empty");
        }

        Optional<User> userOptional =
                userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        User user = userOptional.get();

        if (!user.isActive()) {
            return ResponseEntity
                    .status(403)
                    .body("Your account has been suspended.");
        }

        if (!passwordEncoder.matches(
                oldPassword,
                user.getPassword())) {

            return ResponseEntity
                    .badRequest()
                    .body("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || newPassword == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Email and new password are required");
        }

        if (newPassword.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("New password cannot be empty");
        }

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("No account found with this email");
        }

        User user = userOptional.get();

        if (!user.isActive()) {
            return ResponseEntity
                    .status(403)
                    .body("Your account has been suspended. Please contact the administrator.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        response.put("username", user.getUsername());

        return ResponseEntity.ok(response);
    }
}

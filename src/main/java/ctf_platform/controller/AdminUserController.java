package ctf_platform.controller;

import ctf_platform.entity.User;
import ctf_platform.repository.SubmissionRepository;
import ctf_platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public AdminUserController(
            UserRepository userRepository,
            SubmissionRepository submissionRepository) {

        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {

        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = new ArrayList<>();

        for (User user : users) {
            userList.add(toUserData(user));
        }

        return ResponseEntity.ok(userList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {

        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(toUserData(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Admin accounts cannot be suspended");
        }

        if (!user.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("User is already suspended");
        }

        user.setActive(false);
        userRepository.save(user);

        return ResponseEntity.ok(toUserData(user));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Admin accounts are already protected");
        }

        if (user.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body("User is already active");
        }

        user.setActive(true);
        userRepository.save(user);

        return ResponseEntity.ok(toUserData(user));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity
                    .badRequest()
                    .body("Admin accounts cannot be deleted");
        }

        // Submissions reference users through a foreign key.
        // Remove them before deleting the user.
        submissionRepository.deleteByUserId(id);

        userRepository.delete(user);

        return ResponseEntity.ok("User deleted successfully");
    }

    private Map<String, Object> toUserData(User user) {

        Map<String, Object> userData = new HashMap<>();

        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        userData.put("score", user.getScore());
        userData.put("active", user.isActive());

        return userData;
    }
}

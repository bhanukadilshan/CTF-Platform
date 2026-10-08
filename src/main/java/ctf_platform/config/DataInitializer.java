package ctf_platform.config;

import ctf_platform.entity.User;
import ctf_platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@example.com");
                admin.setRole("ADMIN");
                admin.setActive(true);
                admin.setScore(0);
                userRepository.save(admin);
                System.out.println("========== ADMIN USER CREATED ==========");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
                System.out.println("========================================");
            }
        };
    }
}

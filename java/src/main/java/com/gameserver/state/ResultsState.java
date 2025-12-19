package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;
import com.gameserver.model.Question;
import com.gameserver.model.PasswordQuestion;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ResultsState extends State {
    
    public ResultsState() {
        super("results");
    }

    @Override
    public GameResponse handleAction(GameContext context, GameAction action) {
        switch (action.getActionType()) {
            case "GET_RESULTS":
                Map<String, Object> results = calculateResults(context);
                
                return GameResponse.builder()
                        .gameState("results")
                        .message("Oyun tamamlandı! Sonuçlarınız:")
                        .userName(context.getUserName())
                        .score(context.getScore())
                        .totalQuestions(getTotalQuestions(context))
                        .results(results)
                        .passwordAnalysis(context.getPasswordAnalysis())
                        .gameMode(context.getGameMode())
                        .build();
                        
            case "RESTART_GAME":
                context.reset();
                context.transitionTo(context.getStates().get("welcome"));
                
                return GameResponse.builder()
                        .gameState("welcome")
                        .message("Oyun sıfırlandı. Yeni oyun başlatabilirsiniz.")
                        .build();
                        
            default:
                return GameResponse.builder()
                        .gameState("results")
                        .message("Geçersiz aksiyon")
                        .build();
        }
    }
    
    private Map<String, Object> calculateResults(GameContext context) {
        Map<String, Object> results = new HashMap<>();
        String gameMode = context.getGameMode();
        
        if ("MIXED".equals(gameMode)) {
            // Karışık mod: phishing ve password sorularını ayrı ayrı hesapla
            return calculateMixedResults(context);
        }
        
        // Seçilen rastgele soruları kullan
        List<Question> selectedQuestions = context.getSelectedPhishingQuestions();
        List<PasswordQuestion> selectedPasswordQuestions = context.getSelectedPasswordQuestions();
        
        int totalQuestions;
        if (selectedQuestions != null && !selectedQuestions.isEmpty()) {
            totalQuestions = selectedQuestions.size();
        } else if (selectedPasswordQuestions != null && !selectedPasswordQuestions.isEmpty()) {
            totalQuestions = selectedPasswordQuestions.size();
        } else {
            totalQuestions = context.getQuestions().size();
        }
        
        int correctAnswers = context.getScore();
        double percentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0;
        
        String grade;
        String feedback;
        
        if (percentage >= 90) {
            grade = "A+";
            feedback = "Mükemmel! Siber güvenlik konusunda çok iyisiniz.";
        } else if (percentage >= 80) {
            grade = "A";
            feedback = "Çok iyi! Siber güvenlik farkındalığınız yüksek.";
        } else if (percentage >= 70) {
            grade = "B";
            feedback = "İyi! Biraz daha dikkatli olursanız mükemmel olacaksınız.";
        } else if (percentage >= 60) {
            grade = "C";
            feedback = "Orta seviye. Siber güvenlik konusunda daha fazla bilgi edinmenizi öneriyoruz.";
        } else {
            grade = "D";
            feedback = "Siber güvenlik konusunda daha fazla eğitim almanız gerekiyor.";
        }
        
        results.put("totalQuestions", totalQuestions);
        results.put("correctAnswers", correctAnswers);
        results.put("percentage", Math.round(percentage));
        results.put("grade", grade);
        results.put("feedback", feedback);
        
        // Gelişim önerileri ekle
        List<String> recommendations = generateRecommendations(context, percentage);
        results.put("recommendations", recommendations);
        
        return results;
    }
    
    private Map<String, Object> calculateMixedResults(GameContext context) {
        Map<String, Object> results = new HashMap<>();
        
        // Rastgele seçilmiş soruları kullan
        List<Question> phishingQuestions = context.getSelectedPhishingQuestions();
        List<PasswordQuestion> passwordQuestions = context.getSelectedPasswordQuestions();
        
        // Fallback: eğer seçilmiş sorular yoksa, eski mantığı kullan
        if (phishingQuestions == null || phishingQuestions.isEmpty()) {
            List<Question> allPhishing = context.getQuestions();
            phishingQuestions = allPhishing.subList(0, Math.min(5, allPhishing.size()));
        }
        if (passwordQuestions == null || passwordQuestions.isEmpty()) {
            List<PasswordQuestion> allPassword = context.getPasswordQuestions();
            passwordQuestions = allPassword.subList(0, Math.min(5, allPassword.size()));
        }
        
        List<String> allAnswers = context.getAnswers();
        
        int phishingCorrect = 0;
        int phishingTotal = phishingQuestions.size();
        
        // Phishing cevaplarını kontrol et (ilk 5 cevap)
        for (int i = 0; i < phishingTotal && i < allAnswers.size(); i++) {
            String userAnswer = allAnswers.get(i);
            String correctAnswer = phishingQuestions.get(i).getCorrectAnswer();
            if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                phishingCorrect++;
            }
        }
        
        int passwordCorrect = 0;
        int passwordTotal = passwordQuestions.size();
        
        // Password cevaplarını kontrol et (5. cevaptan sonraki 5 cevap)
        int passwordStartIndex = phishingTotal;
        for (int i = 0; i < passwordTotal && (passwordStartIndex + i) < allAnswers.size(); i++) {
            String userAnswer = allAnswers.get(passwordStartIndex + i);
            String correctAnswer = passwordQuestions.get(i).getCorrectAnswer();
            if (userAnswer != null && userAnswer.equals(correctAnswer)) {
                passwordCorrect++;
            }
        }
        
        // Toplam istatistikler
        int totalCorrect = phishingCorrect + passwordCorrect;
        int totalQuestions = phishingTotal + passwordTotal;
        double totalPercentage = totalQuestions > 0 ? (double) totalCorrect / totalQuestions * 100 : 0;
        
        String grade;
        String feedback;
        
        if (totalPercentage >= 90) {
            grade = "A+";
            feedback = "Mükemmel! Siber güvenlik konusunda çok iyisiniz.";
        } else if (totalPercentage >= 80) {
            grade = "A";
            feedback = "Çok iyi! Siber güvenlik farkındalığınız yüksek.";
        } else if (totalPercentage >= 70) {
            grade = "B";
            feedback = "İyi! Biraz daha dikkatli olursanız mükemmel olacaksınız.";
        } else if (totalPercentage >= 60) {
            grade = "C";
            feedback = "Orta seviye. Siber güvenlik konusunda daha fazla bilgi edinmenizi öneriyoruz.";
        } else {
            grade = "D";
            feedback = "Siber güvenlik konusunda daha fazla eğitim almanız gerekiyor.";
        }
        
        results.put("totalQuestions", totalQuestions);
        results.put("correctAnswers", totalCorrect);
        results.put("percentage", Math.round(totalPercentage));
        results.put("grade", grade);
        results.put("feedback", feedback);
        
        // Ayrı istatistikler
        Map<String, Object> phishingStats = new HashMap<>();
        phishingStats.put("correct", phishingCorrect);
        phishingStats.put("total", phishingTotal);
        phishingStats.put("incorrect", phishingTotal - phishingCorrect);
        phishingStats.put("percentage", phishingTotal > 0 ? Math.round((double) phishingCorrect / phishingTotal * 100) : 0);
        results.put("phishingStats", phishingStats);
        
        Map<String, Object> passwordStats = new HashMap<>();
        passwordStats.put("correct", passwordCorrect);
        passwordStats.put("total", passwordTotal);
        passwordStats.put("incorrect", passwordTotal - passwordCorrect);
        passwordStats.put("percentage", passwordTotal > 0 ? Math.round((double) passwordCorrect / passwordTotal * 100) : 0);
        results.put("passwordStats", passwordStats);
        
        // Gelişim önerileri ekle
        List<String> recommendations = generateRecommendations(context, totalPercentage);
        results.put("recommendations", recommendations);
        
        return results;
    }
    
    private List<String> generateRecommendations(GameContext context, double percentage) {
        List<String> recommendations = new ArrayList<>();
        
        // Yanlış cevaplanan soruları analiz et
        List<String> wrongAnswers = analyzeWrongAnswers(context);
        
        // Phishing testi sonuçlarına göre öneriler
        if (percentage < 50) {
            recommendations.add("E-posta güvenliği konusunda temel eğitim almanızı öneriyoruz");
            recommendations.add("Şüpheli e-postaları tanıma becerilerinizi geliştirin");
            recommendations.add("Gönderen adreslerini her zaman kontrol edin");
        } else if (percentage < 75) {
            recommendations.add("E-posta güvenliği konusunda daha dikkatli olun");
            recommendations.add("Phishing e-postalarını tanıma becerilerinizi geliştirin");
        } else {
            recommendations.add("E-posta güvenliği konusunda iyi durumdasınız");
            recommendations.add("Bilginizi başkalarıyla paylaşarak farkındalık yaratın");
        }
        
        // Yanlış cevaplara göre spesifik öneriler
        recommendations.addAll(generateSpecificRecommendations(wrongAnswers, context));
        
        // Şifre güvenliği analizi
        Map<String, Object> passwordAnalysis = context.getPasswordAnalysis();
        if (passwordAnalysis != null) {
            String strength = (String) passwordAnalysis.get("strength");
            
            if ("Çok Zayıf".equals(strength) || "Zayıf".equals(strength)) {
                recommendations.add("Güçlü ve benzersiz şifreler kullanın");
                recommendations.add("Şifre yöneticisi kullanmayı düşünün");
                recommendations.add("İki faktörlü kimlik doğrulama aktif edin");
            } else if ("Orta".equals(strength)) {
                recommendations.add("Şifre güvenliğinizi daha da artırabilirsiniz");
                recommendations.add("Düzenli olarak şifrelerinizi güncelleyin");
            } else {
                recommendations.add("Şifre güvenliği konusunda mükemmel durumdasınız");
            }
        }
        
        // Genel öneriler
        if (percentage < 60) {
            recommendations.add("Siber güvenlik farkındalığınızı artırın");
            recommendations.add("Güvenlik eğitimleri almayı düşünün");
            recommendations.add("Güncel siber güvenlik haberlerini takip edin");
        } else if (percentage < 80) {
            recommendations.add("Siber güvenlik bilginizi sürekli güncelleyin");
            recommendations.add("Pratik yaparak becerilerinizi geliştirin");
        } else {
            recommendations.add("Mükemmel! Siber güvenlik konusunda örnek bir kullanıcısınız");
            recommendations.add("Bilginizi başkalarıyla paylaşarak toplumsal farkındalık yaratın");
        }
        
        return recommendations;
    }
    
    private List<String> analyzeWrongAnswers(GameContext context) {
        List<String> wrongAnswers = new ArrayList<>();
        List<String> userAnswers = context.getAnswers();
        
        // Seçilen rastgele soruları kullan
        List<Question> questions = context.getSelectedPhishingQuestions();
        if (questions == null || questions.isEmpty()) {
            questions = context.getQuestions();
        }
        
        for (int i = 0; i < userAnswers.size() && i < questions.size(); i++) {
            String userAnswer = userAnswers.get(i);
            String correctAnswer = questions.get(i).getCorrectAnswer();
            
            if (userAnswer != null && !userAnswer.equals(correctAnswer)) {
                wrongAnswers.add("Soru " + (i + 1) + ": " + userAnswer + " (Doğru: " + correctAnswer + ")");
            }
        }
        
        return wrongAnswers;
    }
    
    private List<String> generateSpecificRecommendations(List<String> wrongAnswers, GameContext context) {
        List<String> specificRecommendations = new ArrayList<>();
        List<String> userAnswers = context.getAnswers();
        
        // Seçilen rastgele soruları kullan
        List<Question> questions = context.getSelectedPhishingQuestions();
        if (questions == null || questions.isEmpty()) {
            questions = context.getQuestions();
        }
        
        // Her yanlış cevap için spesifik öneri
        for (int i = 0; i < userAnswers.size() && i < questions.size(); i++) {
            String userAnswer = userAnswers.get(i);
            String correctAnswer = questions.get(i).getCorrectAnswer();
            Question question = questions.get(i);
            
            if (!userAnswer.equals(correctAnswer)) {
                // E-posta içeriğine göre spesifik öneriler
                if (question.getEmail().getFrom().contains("paypa1") || 
                    question.getEmail().getFrom().contains("paypal")) {
                    specificRecommendations.add("PayPal gibi finansal servislerden gelen e-postalarda domain adını dikkatli kontrol edin");
                }
                
                if (question.getEmail().getUrgency().equals("high")) {
                    specificRecommendations.add("Acil aksiyon gerektiren e-postalar genellikle phishing'dir, dikkatli olun");
                }
                
                if (question.getEmail().isHasLink()) {
                    specificRecommendations.add("E-postalardaki linklere tıklamadan önce gönderen adresini doğrulayın");
                }
                
                if (question.getEmail().getFrom().contains("@yourcompany.com")) {
                    specificRecommendations.add("Şirket içi e-postaları bile doğrulayın, sahte olabilir");
                }
                
                // Yanlış cevap türüne göre öneriler
                if (userAnswer.contains("Güvenli") && correctAnswer.contains("Şüpheli")) {
                    specificRecommendations.add("E-postaları 'güvenli' olarak işaretlemeden önce daha dikkatli analiz edin");
                }
                
                if (userAnswer.contains("Şüpheli") && correctAnswer.contains("Güvenli")) {
                    specificRecommendations.add("Güvenilir kaynaklardan gelen e-postaları da tanımayı öğrenin");
                }
            }
        }
        
        // Tekrarları kaldır
        return specificRecommendations.stream().distinct().collect(Collectors.toList());
    }
    
    private int getTotalQuestions(GameContext context) {
        List<Question> selectedPhishing = context.getSelectedPhishingQuestions();
        List<PasswordQuestion> selectedPassword = context.getSelectedPasswordQuestions();
        
        if (selectedPhishing != null && !selectedPhishing.isEmpty()) {
            return selectedPhishing.size();
        } else if (selectedPassword != null && !selectedPassword.isEmpty()) {
            return selectedPassword.size();
        } else {
            return context.getQuestions().size();
        }
    }
}

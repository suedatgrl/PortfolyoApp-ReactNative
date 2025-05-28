// screens/HomeScreen.js
import React from "react";
import { ScrollView, View, Text, StyleSheet, Linking } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>Latife Süeda Tuğrul</Text>
        <Text style={styles.title}>Computer Engineer</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.text} onPress={() => Linking.openURL("tel:+905332355964")}>
          📞 +90 533 235 5964
        </Text>
        <Text style={styles.text} onPress={() => Linking.openURL("mailto:tugrulsueda1@gmail.com")}>
          ✉ tugrulsueda1@gmail.com
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://linkedin.com/in/sueda-tugrul")}
        >
          🔗 linkedin.com/in/sueda-tugrul
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://github.com/suedatgrl")}
        >
          🔗 github.com/suedatgrl
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Skills</Text>
        {[
          "React Native",
          "Angular, Vue3",
          "Java, Spring Boot, JPA, Hibernate",
          "C#, .NET, WinForms",
          "Python (ML / LSTM / CNN)",
          "MySQL, MongoDB"
        ].map((skill, i) => (
          <Text key={i} style={styles.text}>• {skill}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Projects</Text>
        {[  
          "Job Portal (Java/Spring Boot + React/Vue, JWT auth, Hibernate ORM)",
          "Time Series Toolbox (Flask + React + TensorFlow; ARIMA, LSTM, XGBoost)",
          "Personal Portfolio App (React Native + Node.js + MongoDB)"
        ].map((proj, i) => (
          <Text key={i} style={styles.text}>• {proj}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Experience</Text>
        <Text style={styles.text}>• Türksat – Candidate Engineer (12/2024-05/2025)</Text>
        <Text style={styles.text}>  Desktop simulation app (WinForms, C#, TCP/IP), encryption & OOP enhancements.</Text>
        <Text style={styles.text}>• EHSİM – Intern (06/2024-08/2024): MySQL / MSSQL work.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Education</Text>
        <Text style={styles.text}>• B.Sc. Computer Engineering, Ankara University (2020-2025) – GPA: 3.35</Text>
        <Text style={styles.text}>• Nevşehir Science High School (2016-2020) – Grade: 89.56%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f2f5",
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 18,
    color: "#777",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  link: {
    fontSize: 16,
    color: "#1e90ff",
    marginBottom: 6,
    textDecorationLine: "underline",
  }
});

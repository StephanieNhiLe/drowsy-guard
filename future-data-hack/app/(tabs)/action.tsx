import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import DrowsinessMeter from "@/components/DrowsinessMeter";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Action() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileIcon} />
        <View>
          <Text style={styles.headerTitle}>Driver's Assistant</Text>
          <Text style={styles.subTitle}>Assessing Driver Alertness</Text>
        </View>
      </View>

      {/* Alert Box */}
      <View style={styles.alertBox}>
        <View style={styles.alertHeader}>
          <Icon name="warning" size={20} color="#fff" />
          <Text style={styles.alertText}>Drowsy Detected</Text>
        </View>
        <Text style={styles.alertMessage}>
          Warning: Early Signs of Fatigue/Distraction
        </Text>
        <Text style={styles.alertDetails}>
          Frequent Yawning, Increased Blink Rate, Difficulty Focusing
        </Text>
      </View>

      {/* Nearest Assistance */}
      <View style={styles.assistanceContainer}>
        <View style={styles.assistanceBox}>
          <Text style={styles.assistanceLabel}>Recommended</Text>
          <Text style={styles.assistanceTitle}>Rest Stop</Text>
          <Text style={styles.assistanceDetails}>Rest Break Recommended</Text>
          <Text style={styles.assistanceDistance}>5 miles ahead</Text>
        </View>
        <View style={styles.assistanceBox}>
          <Text style={styles.assistanceTitle}>Gas Station</Text>
          <Text style={styles.assistanceDetails}>Refuel Needed</Text>
          <Text style={styles.assistanceDistance}>10 miles ahead</Text>
        </View>
      </View>

      {/* Recommended Actions */}
      <View style={styles.recommendedActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="sms" size={20} color="#000" />
          <Text style={styles.actionText}>Text Emergency Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="phone" size={20} color="#000" />
          <Text style={styles.actionText}>Call Assistance Service</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.bottomButton}>
        <Text style={styles.bottomButtonText}>Take Recommended Action</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    marginRight: 10,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  subTitle: {
    color: "#666",
  },
  alertBox: {
    backgroundColor: "#FFBABA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  alertText: {
    fontWeight: "bold",
    color: "#FF0000",
    marginLeft: 10,
  },
  alertMessage: {
    fontWeight: "bold",
    color: "#FF0000",
  },
  alertDetails: {
    color: "#666",
  },
  assistanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  assistanceBox: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  assistanceLabel: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  assistanceTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  assistanceDetails: {
    color: "#666",
    marginBottom: 10,
  },
  assistanceDistance: {
    fontWeight: "bold",
    color: "#000",
  },
  recommendedActions: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  actionText: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "#000",
  },
  bottomButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

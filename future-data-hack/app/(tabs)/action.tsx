import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import DrowsinessMeter from "@/components/DrowsinessMeter";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Action() {
  const assisstances = [
    {
      isrecommended: true,
      image: "Rest stop",
      title: "Rest break recommended",
      distance: "5 miles ahead",
    },
    {
      isrecommended: false,
      image: "Rest stop",
      title: "Rest break recommended",
      distance: "5 miles ahead",
    },
  ];
  return (
    <View style={{ padding: 10 }}>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: "grey",
            marginRight: 10,
          }}
        />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Driver's Assisstant
          </Text>
          <Text>Assessing Driver Alertness</Text>
        </View>
      </View>
      <DrowsinessMeter />
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          {" "}
          Nearest Assistance
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {assisstances.map((as) => {
            return (
              <View
                style={{
                  borderRadius: 10,
                  position: "relative",
                  borderColor: "grey",
                  width: 200,
                  height: 300,
                  borderWidth: 1,
                  marginRight: 20,
                  overflow: "hidden",
                }}
              >
                {as.isrecommended && (
                  <Text
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      color: "black",
                      zIndex: 1,
                    }}
                  >
                    Recommended
                  </Text>
                )}
                <View
                  style={{
                    backgroundColor: "grey",
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>{as.image}</Text>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ marginBottom: 10 }}>{as.title}</Text>
                  <Text style={{ fontSize: 20, fontWeight: 400 }}>
                    {as.distance}
                  </Text>
                </View>
              </View>
            );
          })}
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
    marginTop: 20,
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

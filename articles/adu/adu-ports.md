# Ports Used With Azure Device Update (ADU)

## Ports

ADU uses a variety of network ports for different purposes.

Purpose|Port Number |
---|---
Download from Networks/CDNs  | 80 (HTTP Protocol)
Download from MCC/CDNs | 80 (HTTP Protocol)
ADU Agent Connection to Azure IoT Hub  | 8883 (MQTT Protocol)

**NOTE**: The ADU agent can be modified to use any of the supported Azure IoT
Hub protocols.
[Learn more](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-protocols#:~:text=Table%202%20%20%20,%201%20more%20rows) about the current list of supported protocols.

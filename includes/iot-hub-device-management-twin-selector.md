> [AZURE.SELECTOR]
- [Linux](../articles/iot-hub/iot-hub-device-management-get-started.md)
- [Windows](../articles/iot-hub/iot-hub-device-management-get-started-node.md)

## Introduction

Azure IoT Hub device management introduces the device twin, a service side representation of a physical device. Below is a diagram showing the different components of the device twin.

![][img-twin]

In this tutorial, we focus on the device properties. To learn more about the other components, see [Overview of Azure IoT Hub device management][lnk-dm-overview].

Device properties are a predefined dictionary of properties that describe the physical device. The physical device is the master of each device property and is the authoritative store of each corresponding value. An 'eventually consistent' representation of these properties is stored in the device twin in the cloud. The coherence and freshness are subject to synchronization settings, described below. Some examples of device properties include firmware version, battery level, and manufacturer name.

## Device properties synchronization

The physical device is the authoritative source for device properties. Selected values on the physical device are automatically synchronized to the device twin in IoT Hub through the *observe/notify* pattern described by LWM2M.

When the physical device connects to IoT Hub, the service initiates *observes* on the selected device properties. Then, the physical device *notifies* IoT Hub of changes to the device properties. To implement hysteresis, **pmin** (the minimum time between notifies) is set to 5 minutes. This means that for each property the physical device does not notify IoT Hub more often than once per 5 minutes, even if there is a change. To ensure freshness, **pmax** (the maximum time between notifies) is set to 6 hours. This means that for each property the physical device notifies IoT Hub at least once per 6 hours even if the property has not changed in that period.

When the physical device disconnects, the synchronization stops. Synchronization restarts when the device reconnects to the service. You can always check the last update time for a property to ensure freshness.

The complete list of device properties that are automatically observed is listed below:

![][img-observed]

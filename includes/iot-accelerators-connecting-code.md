---
 title: include file
 description: include file
 services: iot-suite
 author: dominicbetts
 ms.service: iot-suite
 ms.topic: include
 ms.date: 09/17/2018
 ms.author: dobett
 ms.custom: include file
---

### Code walkthrough

This section describes some of the key parts of the sample code and explains how they relate to the Remote Monitoring solution accelerator.

The following snippet shows how the reported properties that describe the capabilities of the device are defined. These properties include:

- The location of the device to enable the solution accelerator to add the device to the map.
- The current firmware version.
- The list of methods the device supports.
- The schema of the telemetry messages sent by the device.

[!code-cpp[Define data structures for Chiller](~/iot-samples-c/samples/solutions/remote_monitoring_client/remote_monitoring.c?name=datadefinition "Define data structures for Chiller")]

The sample includes a **serializeToJson** function that serializes this data structure using the Parson library.

The sample includes several callback functions that print information to the console as the client interacts with the solution accelerator:

- **connection_status_callback**
- **send_confirm_callback**
- **reported_state_callback**
- **device_method_callback**

The following snippet shows the **device_method_callback** function. This function determines the action to take when a method call is received from the solution accelerator. The function receives a reference to the **Chiller** data structure in the **userContextCallback** parameter. The value of **userContextCallback** is set when the callback function is configured in the **main** function:

[!code-cpp[Device method callback](~/iot-samples-c/samples/solutions/remote_monitoring_client/remote_monitoring.c?name=devicemethodcallback "Device method callback")]

When the solution accelerator calls the firmware update method, the sample deserializes the JSON payload and starts a background thread to complete the update process. The following snippet shows the **do_firmware_update** that runs on the thread:

[!code-cpp[Firmware update thread](~/iot-samples-c/samples/solutions/remote_monitoring_client/remote_monitoring.c?name=firmwareupdate "Firmware update thread")]

The following snippet shows how the client sends a telemetry message to the solution accelerator. The message properties include the message schema to help the solution accelerator display the telemetry on the dashboard:

[!code-cpp[Send telemetry](~/iot-samples-c/samples/solutions/remote_monitoring_client/remote_monitoring.c?name=sendmessage "Send telemetry")]

The **main** function in the sample:

- Initializes and shuts down the SDK subsystem.
- Initializes the **Chiller** data structure.
- Sends the reported properties to the solution accelerator.
- Configures the device method callback function.
- Sends simulated telemetry values to the solution accelerator.

[!code-cpp[Main](~/iot-samples-c/samples/solutions/remote_monitoring_client/remote_monitoring.c?name=main "Main")]

---
title: Azure Percept speech module interface workflow
description: Describes the workflow and available methods for the Azure Percept speech module 
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: conceptual
ms.date: 7/19/2021
ms.custom: template-concept
---

# Azure Percept speech module interface workflow

This article describes how the Azure Percept speech module interacts with IoT Hub. It does so via Module Twin and Module methods. Furthermore, it lists the direct method calls used to invoke the speech module.

## Speech module interaction with IoT hub via Module Twin and Module method
- IoT Hub uses Module Twin to deploy speech module settings and the settings are saved in the properties. The speech module can update device information and telemetry to IoT hub by Module Twin reported properties.
- IoT Hub can send control requests to speech module via the Module method.
- IoT Hub can get speech module status via the Module method.

For more details, please refer to [Understand and use module twins in IoT Hub](../iot-hub/iot-hub-devguide-module-twins.md).


## Speech module states
- **IoTInitialized**: Indicates IoT module is initialized and the network between speech module and edge Hub module is connected.
- **Authenticating**: Azure Audio device authentication is processing.
- **Authenticated**: Azure Audio device authentication is finished. If failed, IoT hub will get an error message.
- **MicDiscovering**: Start to enumerate microphone array via ALSA interface.
- **MicDiscovered**: Enum microphone array is finished. If failed, IoT hub will get an error message.
- **SpeechConfigured**: CC configuring is finished. If failed, IoT hub will get an error message.
- **SpeechStarted**: Indicates bot is configured and is running.
- **SpeechStopped**: Indicates bot is stopped.
- **DeviceRemoved**: Indicates Azure Audio device is removed.


## Speech bot states
Querying speech bot states is only supported under the **SpeechStarted** speech module state.
- **Ready**: KWS is ready and waiting for voice activation.
- **Listening**: bot is listening to the voice input.
- **Thinking**: bot is waiting for response.
- **Speaking**: bot gets response and speaking the response.

## Interaction between IoT Hub and the speech module 
This section describes how IoT Hub interacts with the speech module. As the diagram shows, there are three types of messages.
- Deployment with needed properties and update with reported properties
- Module method invoke
- Update telemetry

:::image type="content" source="media/speech-module-interface-workflow/speech-module-diagram.png" alt-text="Diagram that shows the interaction between IoT Hub and the speech module":::

IoT Hub invokes the module method with two parameters:
- The module method name (case sensitive)
- The method payload

The speech module responds with:
- A status code
    - **0** = idle
    - **102** = processing
    - **200** = success
    - **202** = pending
    - **500** = failure
    - **501** = not present
- A status payload

Here's an example using the module method GetModuleState:
1. Invoke the method with these parameters:
    - String: "GetModuleState"
    - Unspecified
1. Response:
    - Status code: 200
    - Payload: "DeviceRemoved"

## Next steps
Try to apply these concepts when [configuring a voice assistant application using Azure IoT Hub](./how-to-configure-voice-assistant.md).
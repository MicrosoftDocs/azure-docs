---
title: Custom security alerts for IoT Hub
description: Learn about customizable security alerts and recommended remediation using Defender for IoT Hub's features and service.
ms.topic: conceptual
ms.date: 01/01/2023
---

# Defender for IoT Hub custom security alerts

Defender for IoT continuously analyzes your IoT solution using advanced analytics and threat intelligence to alert you to malicious activity.

Create custom alerts based on your knowledge of each expected device's behavior. These alerts act as the most efficient indicators of any potential changes to your organizational deployment, or landscape.

The following lists of Defender for IoT alerts are definable by you based on your expected IoT Hub behavior. For more information about how to customize each alert, see [create custom alerts](quickstart-create-custom-alerts.md).

## Built-in custom alerts in the IoT Hub

### Low severity

| Alert name | Severity | Data source | Description | Alert Type |
|--|--|--|--|--|
| Custom alert - The number of cloud to device messages in AMQP protocol is outside the allowed range | Low | IoT Hub | The number of cloud to device messages (AMQP protocol) within a specific time window is outside the currently configured and allowable range. | IoT_CA_AmqpC2DMessagesNotInAllowedRange |
| Custom alert - The number of rejected cloud to device messages in AMQP protocol is outside the allowed range | Low | IoT Hub | The number of cloud to device messages (AMQP protocol) rejected by the device, within a specific time window is outside the currently configured and allowable range. | IoT_CA_AmqpC2DRejectedMessagesNotInAllowedRange |
| Custom alert - The number of device to cloud messages in AMQP protocol is outside the allowed range | Low | IoT Hub | The amount of device to cloud messages (AMQP protocol) within a specific time window is outside the currently configured and allowable range. | IoT_CA_AmqpD2CMessagesNotInAllowedRange |
| Custom alert - The number of direct method invokes are outside the allowed range | Low | IoT Hub | The amount of direct method invokes within a specific time window is outside the currently configured and allowable range. | IoT_CA_DirectMethodInvokesNotInAllowedRange |
| Custom alert - The number of file uploads is outside the allowed range | Low | IoT Hub | The amount of file uploads within a specific time window is outside the currently configured and allowable range. | IoT_CA_FileUploadsNotInAllowedRange |
| Custom alert - The number of cloud to device messages in HTTP protocol is outside the allowed range | Low | IoT Hub | The amount of cloud to device messages (HTTP protocol) in a time window isn't in the configured allowed range | IoT_CA_HttpC2DMessagesNotInAllowedRange |
| Custom alert - The number of rejected cloud to device messages in HTTP protocol isn't in the allowed range | Low | IoT Hub | The amount of cloud to device messages (HTTP protocol) within a specific time window is outside the currently configured and allowable range. | IoT_CA_HttpC2DRejectedMessagesNotInAllowedRange |
| Custom alert - The number of device to cloud messages in HTTP protocol is outside the allowed range | Low | IoT Hub | The amount of device to cloud messages (HTTP protocol) within a specific time window is outside the currently configured and allowable range. | IoT_CA_HttpD2CMessagesNotInAllowedRange |
| Custom alert - The number of cloud to device messages in MQTT protocol is outside the allowed range | Low | IoT Hub | The amount of cloud to device messages (MQTT protocol) within a specific time window is outside the currently configured and allowable range. | IoT_CA_MqttC2DMessagesNotInAllowedRange |
| Custom alert - The number of rejected cloud to device messages in MQTT protocol is outside the allowed range | Low | IoT Hub | The amount of cloud to device messages (MQTT protocol) rejected by the device within a specific time window is outside the currently configured and allowable range. | IoT_CA_MqttC2DRejectedMessagesNotInAllowedRange |
| Custom alert - The number of device to cloud messages in MQTT protocol is outside the allowed range | Low | IoT Hub | The amount of device to cloud messages (MQTT protocol) within a specific time window is outside the currently configured and allowable range. | IoT_CA_MqttD2CMessagesNotInAllowedRange |
| Custom alert - The number of command queue purges that are outside of the allowed range | Low | IoT Hub | The amount of command queue purges within a specific time window is outside the currently configured and allowable range. | IoT_CA_QueuePurgesNotInAllowedRange |
| Custom alert - The number of module twin updates is outside the allowed range | Low | IoT Hub | The number of module twin updates within a specific time window is outside the currently configured and allowable range. | IoT_CA_TwinUpdatesNotInAllowedRange |
| Custom alert - The number of unauthorized operations is outside the allowed range | Low | IoT Hub | The number of unauthorized operations within a specific time window is outside the currently configured and allowable range. | IoT_CA_UnauthorizedOperationsNotInAllowedRange |

## Next steps

- Learn how to [customize an alert](quickstart-create-custom-alerts.md)
- Defender for IoT service [Overview](overview.md)

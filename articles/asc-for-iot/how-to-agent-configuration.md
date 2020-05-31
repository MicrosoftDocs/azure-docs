---
title: Configure security agents
description: Learn how to configure Azure Security Center for IoT security agents for use with the Azure Security Center for IoT security service.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: f95c445a-4f0d-4198-9c6c-d01446473bd0
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/18/2020
ms.author: mlottner
---

# Tutorial: Configure security agents

This article explains Azure Security Center for IoT security agents, and details how to change and configure them.

> [!div class="checklist"]
> * Configure security agents
> * Change agent behavior by editing twin properties
> * Discover default configuration

## Agents

Azure Security Center for IoT security agents collect data from IoT devices and perform security actions to mitigate the detected vulnerabilities. Security agent configuration is controllable using a set of module twin properties you can customize. In general, secondary updates to these properties are infrequent.

Azure Security Center for IoT's security agent twin configuration object is a JSON format object. The configuration object is a set of controllable properties that you can define to control the behavior of the agent.

These configurations help you customize the agent for each scenario required. For example, automatically excluding some events, or keeping power consumption to a minimal level are possible by configuring these properties.

Use the Azure Security Center for IoT security agent configuration [schema](https://aka.ms/iot-security-github-module-schema) to make changes.

## Configuration objects

Properties related to every Azure Security Center for IoT security agent are located in the agent configuration object, within the desired properties section, of the **azureiotsecurity** module.

To modify the configuration, create and modify this object inside the **azureiotsecurity** module twin identity.

If the agent configuration object does not exist in the **azureiotsecurity** module twin, all security agent property values are set to default.

```json
"desired": {
  "ms_iotn:urn_azureiot_Security_SecurityAgentConfiguration": {
  }
}
```

## Configuration schema and validation

Make sure to validate your agent configuration against this [schema](https://aka.ms/iot-security-github-module-schema). An agent will not launch if the configuration object does not match the schema.

If, while the agent is running, the configuration object is changed to a non-valid configuration (the configuration does not match the schema), the agent will ignore the invalid configuration and will continue using the current configuration.

### Configuration validation

Azure Security Center for IoT security agent reports its current configuration inside the reported properties section of the **azureiotsecurity** module twin identity.
The agent reports all the available properties, if a property was not set by the user, the agent reports the default configuration.

In order to validate your configuration, compare the values set on the desired section with the values reported in the reported section.

If there is a mismatch between the desired and the reported properties, then the agent was not able to parse the configuration.

Validate your desired properties against the [schema](https://aka.ms/iot-security-github-module-schema), fix the errors and set your desired properties again!

> [!NOTE]
> A configuration error alert will be fired from the agent in case that the agent was not able to parse the desired configuration.
> Compare the reported and desired section to understand if the alert still applies

## Editing a property

All custom properties must be set inside the agent configuration object within the **azureiotsecurity** module twin.
To use a default property value, remove the property from the configuration object.

### Setting a property

1. In your IoT Hub, locate and select the device you wish to change.

1. Click on your device, and then on **azureiotsecurity** module.

1. Click on **Module Identity Twin**.

1. Edit the properties you wish to change in the security module.

   For example, to configure connection events as high priority and collect high priority events every 7 minutes, use the following configuration.

    ```json
    "desired": {
        "ms_iotn:urn_azureiot_Security_SecurityAgentConfiguration": {
            "highPriorityMessageFrequency": {
                "value": "PT7M"
            },
            "eventPriorityConnectionCreate": {
                "value": "High"
            }
        }
    }
    ```

1. Click **Save**.

### Using a default value

To use a default property value, remove the property from the configuration object.

## Default properties

The following table contains the controllable properties of Azure Security Center for IoT security agents.

Default values are available in the proper schema in [GitHub](https\://aka.ms/iot-security-module-default).

| Name| Status | Valid values| Default values| Description |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------|
|highPriorityMessageFrequency|Required: false |Valid values: Duration in ISO 8601 Format |Default value: PT7M |Max time interval before high priority messages are sent.|
|lowPriorityMessageFrequency |Required: false|Valid values: Duration in ISO 8601 Format |Default value: PT5H |Max time before low-priority messages are sent.|
|snapshotFrequency |Require: false|Valid values: Duration in ISO 8601 Format |Default value PT13H |Time interval for the creation of device status snapshots.|
|maxLocalCacheSizeInBytes |Required: false |Valid values: |Default value: 2560000, larger than 8192 | Maximum storage (in bytes) allowed for the message cache of an agent. Maximum amount of space allowed to store messages on the device, before messages are sent.|
|maxMessageSizeInBytes |Required: false |Valid values: A positive number, larger than 8192, less than 262144 |Default value: 204800 |Maximum allowed size of an agent to cloud message. This setting controls the amount of maximum data sent in each message. |
|eventPriority${EventName} |Required: false |Valid values: High, Low, Off |Default values: |Priority of every agent-generated event |

### Supported security events

|Event name| PropertyName | Default Value| Snapshot Event| Details Status  |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------|
|Diagnostic event|eventPriorityDiagnostic| Off| False| Agent related diagnostic events. Use this event for verbose logging.|
|Configuration error |eventPriorityConfigurationError |Low |False |Agent failed to parse the configuration. Verify the configuration against the schema.|
|Dropped events statistics |eventPriorityDroppedEventsStatistics |Low |True|Agent related event statistics. |
|Connected hardware|eventPriorityConnectedHardware |Low |True |Snapshot of all hardware connected to the device.|
|Listening ports|eventPriorityListeningPorts |High |True |Snapshot of all open listening ports on the device.|
|Process create |eventPriorityProcessCreate |Low |False |Audits process creation on the device.|
|Process terminate|eventPriorityProcessTerminate |Low |False |Audits process termination on the device.|
|System information |eventPrioritySystemInformation |Low |True |A snapshot of system information (for example: OS or CPU).|
|Local users| eventPriorityLocalUsers |High |True|A snapshot of the registered local users within the system. |
|Login|  eventPriorityLogin |High|False|Audit the login events to the device (local and remote logins).|
|Connection create |eventPriorityConnectionCreate|Low|False|Audits TCP connections created to and from the device. |
|Firewall configuration| eventPriorityFirewallConfiguration|Low|True|Snapshot of device firewall configuration (firewall rules). |
|OS baseline| eventPriorityOSBaseline| Low|True|Snapshot of device OS baseline check.|
|

## Next steps

- [Understand Azure Security Center for IoT recommendations](concept-recommendations.md)
- [Explore Azure Security Center for IoT alerts](concept-security-alerts.md)
- [Access raw security data](how-to-security-data-access.md)

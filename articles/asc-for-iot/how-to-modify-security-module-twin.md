---
title: How to instructions to modify a ASC for IoT module twin in ASC for IoT Preview| Microsoft Docs
description: Learn how to modify a ASC for IoT security module twin for ASC for IoT.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 1bc5dc86-0f33-4625-b3d3-f9b6c1a54e14
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---

# Modify an ASC for IoT module twin

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to modify the configuration of an existing **AzureIoTSecurity module twin** for an existing device. 

See [Create an ASC for IoT module](quickstart-create-security-twin.md) to learn how to make a new security module for a new device.  

## Modification considerations

> [!IMPORTANT]
> Each configuration in the twin configuration overrides the default configuration. 
>If a specific configuration is no longer present in the twin configuration, the default configuration is used. 

## Configuration schema and validation 

Make sure to validate your agent configuration against this [schema](https://github.com/Azure/asc-for-iot/schema/security_module_twin). An agent will not launch if the configuration object does not match the schema.

 
If, while the agent is running, the configuration object is changed to a non-valid configuration (the configuration does not match the schema), the agent will ignore the invalid configuration and will continue using the current configuration. 

## Edit a property  

Set all custom properties inside the agent configuration object within the AzureIoTSecurity module twin. 

To set a property, add the property key to the configuration object with the desired value. To use a default property value, remove the property from the configuration object:

```json
"desired": { //AzureIoTSecurity Module Identity Twin – desired properties section  
  "azureiot*com^securityAgentConfiguration^1*0*0": { //ASC for IoT Agent 
      // configuration section  
    "hubResourceId": "/subscriptions/82392767-31d3-4bd2-883d-9b60596f5f42/resourceGroups/myResourceGroup/providers/Microsoft.Devices/IotHubs/myIotHub",     
    "lowPriorityMessageFrequency": "PT1H",     
    "highPriorityMessageFrequency": "PT7M",    
    "eventPriorityFirewallConfiguration": "High",     
    "eventPriorityConnectionCreate": "Off" 
  } 
}, 
```

## Properties 
The following table contains all of the configurable properties that control ASC for IoT agents. 
          

| Name| Status | Valid values| Default values| Description |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------|
|highPriorityMessageFrequency|Required: false |Valid values: Duration in ISO 8601 Format |Default value: PT7M |Max time before high priority messages are sent.|
|lowPriorityMessageFrequency |Required: false|Valid values: Duration in ISO 8601 Format |Default value: PT5H |Max time before low priority messages are sent.| 
|snapshotFrequency |Require: false|Valid values:Duration in ISO 8601 Format |Default value PT13H |Time interval for the creation of device status snapshots.| 
|maxLocalCacheSizeInBytes |Required: false |Valid values: |Default value: 2560000, larger than 8192 | Maximum storage (in bytes) allowed for the message cache of an agent. Maximum amount of space allowed to store messages on the device, before messages are sent.| 
|maxMessageSizeInBytes |Required: false |Valid values: A positive number, larger than 8192, less than 262144 |Default value: 204800 |Maximum allowed size of an agent to cloud message. This setting controls the amount of maximum data sent in each message. |
|eventPriority${EventName} |Required: false |Valid values: High, Low, Off |Default values: |Priority of every agent generated event. | 
|

### Events

The following list of events are all of the events the ASC for IoT agent can collect from your devices. Use the AzureIotSecurity module twin to configure which of these events are collected and decide their priority in your solution. 
 
|Event name| PropertyName | Default value| Snapshot event| Detail status  |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------|
|Diagnostic event|eventPriorityDiagnostic| Off| False| Agent related diagnostic events. Use this event for verbose logging.| 
Configuration error |eventPriorityConfigurationError |Low |False |Agent failed to parse the configuration. Verify the configuration against the schema.| 
|Dropped events statistics |eventPriorityDroppedEventsStatistics |Low |True|Agent related event statistics. |
|Message statistics|eventPriorityMessageStatistics |Low |True |Agent related message statistics. |
|Connected hardware|eventPriorityConnectedHardware |Low |True |Snapshot of all hardware connected to the device.|
|Listening ports|eventPriorityListeningPorts |High |True |Snapshot of all open listening ports on the device.|
| Process create |eventPriorityProcessCreate |Low |False |Audits process creation on the device.|
| Process terminate|eventPriorityProcessTerminate |Low |False |Audits process termination on the device.| 
 System information |eventPrioritySystemInformation |Low |True |A snapshot of system information such as OS or CPU.|
|Local users| eventPriorityLocalUsers |High |True|A snapshot of the registered local users within the system. |
|Login|  eventPriorityLogin |High|False|Audits the login events to the device (local and remote logins).|
|Connection create |eventPriorityConnectionCreate|Low|False|Audits TCP connections created to and from the device. |
|Firewall configuration| eventPriorityFirewallConfiguration|Low|True|Snapshot of device firewall configuration (firewall rules). |
|OS baseline| eventPriorityOSBaseline| Low|True|Snapshot of device OS baseline check.| 
|


## Next steps

- Read the ASC for IoT [Overview](overview.md)
- Learn about ASC for IoT [Architecture](architecture.md)
- Understand and explore [ASC for IoT alerts](concept-security-alerts.md)
- Discover how to access your [security data](how-to-security-data-access.md)

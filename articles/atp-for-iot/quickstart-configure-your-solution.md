---
title: Configure your IoT solution Preview| Microsoft Docs
description: Learn how to configure your end-to-end IoT solution using ATP for IoT.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: ae2207e8-ac5b-4793-8efc-0517f4661222
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/05/2019
ms.author: mlottner

---
# Quickstart: Configure your IoT solution

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to perform initial configuration of your IoT security solution using ATP for IoT. 

## ATP for IoT

ATP for IoT aims to enable Azure IoT customers to achieve more, by providing a comprehensive security service that provides end-to-end security for a complete IoT solution.
Including the ability to monitor your entire IoT solution in one dashboard, surfacing all of your IoT devices, IoT platforms and backend resources in Azure.

Once onboarded to your IoT Hub, ATP for IoT automatically identifies other Azure services, also connected to your IoT hub and related to your IoT solution.

In addition to automatic relationship detection, you can also pick and choose which other Azure resources to tag as part of your IoT solution. Your selections allow you to add entire subscriptions, resource groups, or single resources.

After defining all of the resource relationships, ATP for IoT leverages Azure Security Center to provide you security recommendations and alerts for these resources.

ATP for IoT agents collect data from IoT devices and perform security actions to mitigate  detected vulnerabilities. Security agent configuration is controllable using a set of customer defined twin properties. In general, secondary updates to these properties are infrequent.  

ATP for IoT’s security agent twin configuration object is a .json format object you create inside the AzureIoTSecurity module twin. The configuration object is a set of controllable properties that you can define to control the behavior of the agent. 
These configurations help you customize the agent to each scenario required. For example, automatically excluding some events, or keeping power consumption to a minimal level are possible by configuring these properties.  
Use the ATP for IoT security agent configuration schema to make changes.  

## Configuration objects 

Each ATP for IoT agent related property is located inside the agent configuration object, within the desired properties section of the ATP for IoT module. 

To modify the configuration, create this object inside the ATP for IoT module twin identity. 
If the agent configuration object does not exist in the ATP for IoT module twin, all security agent property values are set to default. 

```json
"desired": { //AzureIoTSecurity Module Identity Twin – desired properties section  
  "azureiot*com^securityAgentConfiguration^1*0*0": { //Agent configuration object 
… 
} 
}
```

## Editing a property 

All custom properties must be set inside the agent configuration object within the ATP for IoT module twin. 

Setting a property overrides the default value. 
To set a property, add the property key to the configuration object with the desired value. 

To use a default property value, remove the property from the configuration object 
```json
"desired": { //AzureIoTSecurity Module Identity Twin – desired properties section  
  "azureiot*com^securityAgentConfiguration^1*0*0": { //ATP for IoT Agent 
      // configuration section  
    "hubResourceId": "/subscriptions/82392767-31d3-4bd2-883d-9b60596f5f42/resourceGroups/myResourceGroup/providers/Microsoft.Devices/IotHubs/myIotHub",     
    "lowPriorityMessageFrequency": "PT1H",     
    "highPriorityMessageFrequency": "PT7M",    
    "eventPriorityFirewallConfiguration": "High",     
    "eventPriorityConnectionCreate": "High" 
  } 
}, 
```

## Default properties 

Set of controllable properties that control the ATP for IoT security agents. 
          

| Name| Status | Valid values| Default values| Description |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------|
|highPriorityMessageFrequency|Required: false |Valid values: Duration in ISO 8601 Format |Default value: PT7M |Max time before high priority messages are sent.|
|lowPriorityMessageFrequency |Required: false|Valid values: Duration in ISO 8601 Format |Default value: PT5H |Max time before low priority messages are sent.| 
|snapshotFrequency |Require: false|Valid values:Duration in ISO 8601 Format |Default value PT13H |Time interval for the creation of device status snapshots.| 
|maxLocalCacheSizeInBytes |Required: false |Valid values: |Default value: 2560000, larger than 8192 | Maximum storage (in bytes) allowed for the message cache of an agent. Maximum amount of space allowed to store messages on the device, before messages are sent.| 
|maxMessageSizeInBytes |Required: false |Valid values: A positive number, larger than 8192, less than 262144 |Default value: 204800 |Maximum allowed size of an agent to cloud message. This setting controls the amount of maximum data sent in each message. |
|eventPriority${EventName} |Required: false |Valid values: High, Low, Off |Default values: |Priority of every agent generated event | 

### Events

|Event name| PropertyName | Default Value| Snapshot Event| Details Status  |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------|
|Diagnostic event|eventPriorityDiagnostic| Off| False| Agent related diagnostic events. Use this event for verbose logging.| 
Configuration error |eventPriorityConfigurationError |Low |False |Agent failed to parse the configuration. Verify the configuration against the schema.| 
|Dropped events statistics |eventPriorityDroppedEventsStatistics |Low |True|Agent related event statistics. |
|Message statistics|eventPriorityMessageStatistics |Low |True |Agent related message statistics. |
|Connected hardware|eventPriorityConnectedHardware |Low |True |Snapshot of all hardware connected to the device.|
|Listening ports|eventPriorityListeningPorts |High |True |Snapshot of all open listening ports on the device.|
| Process create |eventPriorityProcessCreate |Low |False |Audits process creation on the device.|
| Process terminate|eventPriorityProcessTerminate |Low |False |Audits process termination on the device.| 
 System information |eventPrioritySystemInformation |Low |True |A snapshot of system information (for example: OS or CPU).| 
|Local users| eventPriorityLocalUsers |High |True|A snapshot of the registered local users within the system. |
|Login|  eventPriorityLogin |High|False|Audit the login events to the device (local and remote logins).|
|Connection create |eventPriorityConnectionCreate|Low|False|Audits TCP connections created to and from the device. |
|Firewall configuration| eventPriorityFirewallConfiguration|Low|True|Snapshot of device firewall configuration (firewall rules). |
|OS baseline| eventPriorityOSBaseline| Low|True|Snapshot of device OS baseline check.| 

Make sure to validate your agent configuration changes against this [schema](https://github.com/Azure/Azure-Security-IoT-Preview/tree/master/schemas/security_module_twin). The agent will not launch if the configuration object does not match the schema.
 



## See Also
- [ATP for IoT overview](overview.md)
- [Service prerequisites](service-prerequisites.md)
- [Getting started](quickstart-getting-started.md)
- [Understanding security alerts](concept-security-alerts.md)
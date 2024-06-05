---
title: Overview of Event Hubs emulator
description: This article provides an overview of Azure Event Hubs emulator.
ms.topic: article
ms.author: Saglodha
ms.date: 05/06/2024
---


# Overview of Event Hubs emulator

Azure Event Hubs emulator is designed to offer a local development experience for Azure Event Hubs, enabling you to develop and test code against our services in isolation, free from cloud interference.

### Benefits of emulator

The primary advantages of using the emulator are:

- Local Development: The Emulator provides a local development experience, enabling developers to work offline and avoid network latency.
- Cost-Efficiency: With the Emulator, developers can test their applications without incurring any cloud usage costs.
- Isolated Testing Environment: You can test your code in isolation, ensuring that the tests aren't impacted by other activities in the cloud.
- Optimized Inner Development loop: Developers can use the Emulator to quickly prototype and test their applications before deploying them to the cloud.

>[!NOTE]
> Event Hubs emulator is licensed under End user License Agreement. For more details, refer [here.](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EMULATOR_EULA.md)

### Features of Emulator

This section highlights different features provided with Emulator:

- Containerized Deployment: The Emulator runs as a Docker container (Linux-based).
- Cross-Platform Compatibility: It can be used on any platform, including Windows, macOS, and Linux.
- Managing Entity Configuration: Users can manage number of event hubs, partition count etc. using JSON supplied Configuration.
- Streaming Support: The Emulator supports streaming messages using AMQP (Advanced Message Queuing Protocol).
- Observability: It provides observability features, including console and file logging.

### Known Limitations

Current version of emulator has the following limitations:

- It can't stream messages using Kafka protocol.  
- It doesn't support  on fly management operations using Client side SDK. 

> [!NOTE]
> In case of container restart,data and entities are not persisted in emulator.

### Difference between emulator and Event hubs cloud service?

Since Emulator is only meant for development and test purpose, there are functional differences between emulator and cloud service. Here are the high-level features that aren't supported in the Event Hubs emulator:

-  Azure Goodness – VNet Integration/ Microsoft Entra ID integration/ Activity Logs/ UI Portal etc.
-  Event Hubs Capture
-  Resource Governance features like Application Groups
-  Auto scale capabilities
-  Geo DR capabilities
-  Schema Registry Integration.
-  Visual Metrics/ Alerts

>[!CAUTION]
>The emulator is intended solely for development and testing scenarios.Any kind of Production use is strictly discouraged. There is no official support provided for emulator.
> Any issues/suggestions should be reported via GitHub issues on emulator Installer [repository.](https://github.com/Azure/azure-event-hubs-emulator-installer/issues).

### Managing Quotas and Configuration

Like our cloud service, Azure Event Hubs emulator provides below quotas for usage: 

| Property| Value| User Configurable within limits
| ----|----|----|
Number of supported namespaces| 1 |No| 
Maximum number of Event Hubs within namespace| 10| Yes| 
Maximum number of consumer groups within event hub| 20 |Yes| 
Maximum number of partitions in event hub |32 |Yes 
Maximum size of event being published to event hub (batch/nonbatch) |1 MB |No
Minimum event retention time | 1 hr | No


### Making configuration changes

You could use config.json to configure quotas associated with Event Hubs. By default, emulator would run with following [configuration](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EventHub-Emulator/Config/Config.json). Under the configuration file, you could make following edits as per needs: 

- **Entities**: You could add more entities (event hubs), with customized partition count and consumer groups count as per supported quotas.
- **Logging**: Emulator supports Logging in file or console or both. You could set as per your personal preference.

>[!IMPORTANT]
> Any changes in JSON configuration must be supplied before running emulator and isn't honoured on fly. For subsequent changes to take effect, container restart is required.
>You cannot rename the preset namespace ("name") in configuration file. 

### Drill through available logs
During testing phase, logs help in debugging unexpected failures. For this reason, Emulator supports logging in forms of Console and File. Follow below steps to review the logs: 
- **Console Logs**: On docker desktop UI, click on the container name to open Console Logs.
- **File Logs**: These would be present at /home/app/EmulatorLogs within the container.

### Next Steps

For instructions on how to develop locally with Event Hubs emulator, see [test locally with event hubs emulator](test-locally-with-event-hub-emulator.md).


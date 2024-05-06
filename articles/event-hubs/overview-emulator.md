# Overview of Event Hubs emulator

## What is Event Hubs emulator?

Azure Event Hubs emulator is designed to offer a local development experience for Azure Event Hubs, enabling you to develop and test code against our services in isolation, free from cloud interference.

### Benefits of emulator

The primary advantages of using the emulator are:

- Local Development: The Emulator provides a local development experience, enabling developers to work offline and avoid network latency.
- Cost-Efficiency: With the Emulator, developers can test their applications without incurring any cloud usage costs.
- Isolated Testing Environment: The Emulator allows developers to test their code in isolation, ensuring that their tests are not affected by other activities in the cloud.
- Optimized Inner Development loop: Developers can use the Emulator to quickly prototype and test their applications before deploying them to the cloud.

>[!NOTE]
> Event Hubs emulator is licensed under End user License Agreement. For more details, refer: < Public GitHub Repo >

### What’s provided?
Below section highlights what’s being offered with Emulator:
- Containerization support (Linux Containers)
- Cross Platform Support (Linux/Windows/MacOS)
- Event-Hub configuration through user supplied JSON
- Send and Receive Support with AMQP Protocol 
- Observability support – Console/ File Logging

### Known Limitations
- Kafka Support
- SDK Support for on fly management operations

> [!NOTE]
> In case of container restart,data and entities are not persisted in emulator.

### What’s different than cloud service?

Since Emulator is aimed at fulfilling different user needs, there are some features which are not supported with Emulator and are only available in our cloud services. Below are high level features which aren’t supported in event hubs emulator: 
1. Azure Goodness – VNet Integration/ Entra ID integration/ Activity Logs/ UI Portal etc.
2. Event Hubs Capture
3. Resource Governance features like Application Groups
4. Auto scale capabilities
5. Geo DR capabilities
6. Schema Registry Integration.
7. Visual Metrics/ Alerts

>[!CAUTION]
>The emulator is intended solely for development and testing scenarios.Any kind of Production use is strictly discouraged. There is no official support provided for emulator.
> Any issues/suggestions should be reported via GitHub issues on emulator GitHub project.

### Managing Quotas and Configuration

Like our cloud service, Azure Event Hubs emulator provides below quotas for usage: 

| Property| Value| User Configurable within limits
| ----|----|----|
Number of supported namespaces| 1 |No| 
Maximum number of Event Hubs within namespace| 10| Yes| 
Maximum number of consumer groups within event hub| 20 |Yes| 
Maximum number of partitions in event hub |32 |Yes 
Maximum size of event being published to event hub (be it batch/ non-batch) |1 MB |No
Maximum event retention time | 1hr | No


## Making configuration changes
Event Hubs emulator provides Config.Json to provide you with interface to configure quotas associated with Event Hubs. 

By default, emulator would run with following [configuration](EventHub/Common/Config.json).Under the configuration file, you could make following edits as per needs: 
- **Entities**: You could add additional entities (event hubs) , with customized partition count and consumer groups count as per supported quotas.
- **Logging**: Emulator supports Logging in file or console or both. You could set as per your personal preference.

Note: You cannot create more than one namespace or change the namespace name in config file.

>[!IMPORTANT]
> Any changes in above configuration must be supplied before running emulator and isn't honoured on fly. For changes to take effect, container restart is required.

## Drill through available logs
During testing phase,logs need to be reviewed to debug unexpected failures. For this reason, Emulator supports logging in forms of Console and File. Follow below steps to look at the logs: 
- **Console Logs**: On docker desktop UI, click on the container name and the console logs will open.
- **File Logs**: Present at /home/app/EmulatorLogs within the container.



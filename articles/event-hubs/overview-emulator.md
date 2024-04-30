# Overview of Event Hubs emulator

## What is Event Hubs emulator?

Azure Event Hubs is a cloud native data streaming service that can stream millions of events per second, with low latency, from any source to any destination. The Emulator is designed to offer a local development experience for Azure Event Hubs, enabling you to develop and test code against our services in isolation, free from cloud interference.

## Benefits of emulator

The Event Hubs Emulator serves as a crucial tool for developers, providing a local development experience that mirrors the Azure Event Hubs cloud service. This emulator allows developers to write, test, and debug code in an isolated environment, free from potential disruptions or latencies that may occur in the cloud.

The primary advantages of using the emulator are:

- Local Development: The Emulator provides a local development experience, enabling developers to work offline and avoid network latency.
- Cost-Efficiency: With the Emulator, developers can test their applications without incurring any cloud usage costs.
- Isolated Testing Environment: The Emulator allows developers to test their code in isolation, ensuring that their tests are not affected by other activities in the cloud.
- Rapid Prototyping: Developers can use the Emulator to quickly prototype and test their applications before deploying them to the cloud.

## What’s provided?
Below section highlights what’s being offered with Emulator:
- Containerization support (Linux Containers)
- Cross Platform Support (Linux/Windows)
- Event-Hub configuration through user supplied JSON
- Send and Receive Support with AMQP Protocol 
- Observability support – Console/ File Logging

## Known Limitations
- Kafka Support
- On fly SDK Support for management Operations


## What’s different than cloud service?

Since Emulator is aimed at fulfilling different needs, there are some features which are not supported with Emulator and are only available in our cloud services. Below are high level features which aren’t supported in event hubs emulator: 
1. Azure Goodness – VNet Integration/ Entra ID integration/ Activity Logs/ UI Portal etc.
2. Event Hubs Capture
3. Resource Governance features like Application Groups
4. Auto scale capabilities
5. Geo DR capabilities
6. Schema Registry Integration.
7. Visual Metrics/ Alerts
8. Official Support 

## Legal aspects 

Event Hubs emulator is licensed under End user License Agreement. For more details, refer: < Public GitHub Repo >

### Managing Quotas and Configuration

Like our cloud service, Azure Event Hubs emulator provides below quotas for usage: 
|Property| Value| User Configurable within limits
| ---|----|----|
Number of supported namespaces| 1 |No| 
Maximum number of Event Hubs within namespace| 10| Yes| 
Maximum number of consumer groups within event hub| 20 |Yes| 
Maximum number of partitions in event hub |32 |Yes 
Maximum size of event being published to event hub (be it batch/ non-batch) |1 MB |No
Maximum retention period | 1 Hour| No

## Making configuration changes
Event Hubs emulator provides Config.Json to provide you with interface to configure quotas associated with Event Hubs. Its worthy to remember that *this configuration needs to be set before creating the container and isn’t honoured on fly.*

By default, emulator would run with following [configuration](EventHub/Common/Config.json).Under the configuration file, you could make following edits as per needs: 
- **Entities**: You could add additional entities (event hubs) , with customized partition count and consumer groups count as per supported quotas.
- **Logging**: Emulator supports Logging in file or console or both. You could set as per your personal preference.
Note: You cannot create more than one namespace or change the namespace name in config file.


## Drill through available logs
During testing phase, there are times when logs need to be reviews to debug unexpected failures. For this reason, Emulator supports logging in forms of Console and File. Follow below steps to look at the logs: 
- **Console Logs**: On docker desktop UI, click on the container name and the console logs will open.
- **File Logs**: Present at /home/app/EmulatorLogs within the container.

Note

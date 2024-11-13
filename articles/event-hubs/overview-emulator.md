---
title: Overview of the Azure Event Hubs emulator
description: This article describes benefits, features, limitations, and other overview information for the Azure Event Hubs emulator.
ms.topic: article
ms.author: Saglodha
ms.date: 05/06/2024
---


# Overview of the Azure Event Hubs emulator

The Azure Event Hubs emulator offers a local development experience for the Event Hubs service. You can use the emulator to develop and test code against the service in isolation, free from cloud interference.

## Benefits

The primary advantages of using the emulator are:

- **Local development**: The emulator provides a local development experience, so you can work offline and avoid network latency.
- **Cost efficiency**: With the emulator, you can test your applications without incurring any cloud usage costs.
- **Isolated testing environment**: You can test your code in isolation, to help ensure that other activities in the cloud don't affect the tests.
- **Optimized inner development loop**: You can use the emulator to quickly prototype and test your applications before deploying them to the cloud.

> [!NOTE]
> The Event Hubs emulator is available under the [Microsoft Software License Terms](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EMULATOR_EULA.md).

## Features

The emulator provides these features:

- **Containerized deployment**: It runs as a Docker container (Linux based).
- **Cross-platform compatibility**: You can use it on any platform, including Windows, macOS, and Linux.
- **Configurability**: You can manage the number of event hubs, partitions, and other entities by using the JSON supplied configuration.
- **Streaming support**: It supports streaming messages by using the Advanced Message Queuing Protocol (AMQP).
- **Observability**: It provides observability features, including console and file logging.

## Known limitations

The current version of the emulator has the following limitations:

- It can't stream messages by using the Kafka protocol.  
- It doesn't support on-the-fly management operations through a client-side SDK.

> [!NOTE]
> After a container restart, data and entities don't persist in the emulator.

## Differences from the cloud service

Because the Event Hubs emulator is meant only for development and test purposes, there are functional differences between the emulator and the cloud service.

The emulator doesn't support these high-level features:

- Azure features like virtual network integration, Microsoft Entra ID integration, activity logs, and a UI portal
- Event Hubs capture
- Resource governance features like application groups
- Autoscale capabilities
- Geo-disaster recovery capabilities
- Schema registry integration
- Visual metrics and alerts

> [!NOTE]
> The emulator is intended solely for development and test scenarios. We discourage any kind of production use. We don't provide any official support for the emulator.
>
> Report any problems or suggestions in the emulator's [GitHub installer repository](https://github.com/Azure/azure-event-hubs-emulator-installer/issues).

## Usage quotas

Like the Event Hubs cloud service, the emulator provides the following quotas for usage:

| Property| Value| User configurable within limits
| ----|----|----
| Number of supported namespaces| 1 |No
| Maximum number of event hubs in a namespace| 10| Yes
| Maximum number of consumer groups in an event hub| 20 |Yes
| Maximum number of partitions in an event hub |32 |Yes
| Maximum size of an event being published to an event hub (batch/nonbatch) |1 MB |No
| Minimum event retention time | 1 h | No

## Quota configuration changes

By default, the emulator runs with the [config.json](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EventHub-Emulator/Config/Config.json) configuration file. You can configure the quotas associated with Event Hubs by editing this file in the following ways, based on your needs:

- **Entities**: You can add more entities (event hubs), with a customized number of partitions and consumer groups, in accordance with supported quotas.
- **Logging**: The emulator supports logging on a console, in a file, or both. You can choose according to your personal preference.

> [!IMPORTANT]
> You must supply any changes in JSON configuration before you run the emulator. Changes aren't honored on the fly. For changes to take effect, you must restart the container.
>
> You can't rename the preset namespace (`name`) in the configuration file.

## Logs for debugging

During testing, console or file logs help you debug unexpected failures. To review the logs:

- **Console logs**: On the Docker desktop UI, select the container name.
- **File logs**: In the container, go to */home/app/EmulatorLogs*.

## Related content

[Test locally by using the Azure Event Hubs emulator](test-locally-with-event-hub-emulator.md)

---
title: Azure Event Hubs Emulator Overview
description: Learn about the Azure Event Hubs emulator, a local development tool for testing Event Hubs apps offline with cost efficiency and isolated environments.
#customer intent: As a developer, I want to understand the Azure Event Hubs emulator so that I can test Event Hubs applications locally.  
ms.topic: concept-article
author: spelluru
ms.author: spelluru
ms.date: 08/25/2026
ai-usage: ai-assisted
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/25/2025
---


# Azure Event Hubs emulator overview

The **Azure Event Hubs emulator** is a local development tool that helps you test and prototype Event Hubs applications in an offline, cost-effective, and isolated environment. The emulator simulates the Event Hubs service locally, which enables faster development cycles, eliminates cloud-related costs, and provides a controlled testing environment. This article provides an overview of the emulator's benefits, features, limitations, and usage guidelines to help you get started.

## Benefits

The primary advantages of using the emulator are:  

- **Local development**: The emulator provides a local development experience, so you can work offline and avoid network latency.  
- **Cost efficiency**: By using the emulator, you can test your applications without incurring any cloud usage costs.  
- **Isolated testing environment**: You can test your code in isolation, to help ensure that other activities in the cloud don't affect the tests.  
- **Optimized inner development loop**: Use the emulator to quickly prototype and test your applications before deploying them to the cloud.   


## Features

The emulator provides these features:  

- **Containerized deployment**: It runs as a Docker container (Linux based).  
- **Cross-platform compatibility**: Use it on any platform, including Windows, macOS, and Linux.  
- **Configurability**: Manage the number of event hubs, partitions, and other entities by using the JSON supplied configuration.  
- **Streaming support**: It supports streaming events by using Kafka and Advanced Message Queuing Protocol (AMQP).  
- **Observability**: It provides observability features, including console and file logging.

## Known limitations

The current version of the emulator has the following limitations:

- When you use Kafka, only producer and consumer APIs are compatible with the Event Hubs emulator.
- Under Kafka configuration, `securityProtocol` and `saslmechanism` can only have the following values:
  ```
    SecurityProtocol = SecurityProtocol.SaslPlaintext,
    SaslMechanism = SaslMechanism.Plain
  ```

- It doesn't support on-the-fly management operations through a client-side SDK.
- A `$Default` consumer group is created automatically when the emulator runs. You can't create a `$Default` consumer group through the supplied configuration.

> [!NOTE]
> After a container restart, data and entities don't persist in the emulator.

## Differences between the emulator and cloud service

Because the Event Hubs emulator is meant only for development and test purposes, functional differences exist between the emulator and the cloud service.

The emulator doesn't support these high-level features:

- Azure features like virtual network integration, Microsoft Entra ID integration, activity logs, and a UI portal
- Event Hubs Capture
- Resource governance features like application groups
- Autoscale capabilities
- Geo-disaster recovery capabilities
- Schema registry integration
- Visual metrics and alerts

> [!NOTE]
> The emulator is intended solely for development and test scenarios. Don't use it for production. Microsoft doesn't provide official support for the emulator.
>
> Report any problems or suggestions in the emulator's [GitHub installer repository](https://github.com/Azure/azure-event-hubs-emulator-installer/issues).

## Usage quotas

Like Event Hubs on Azure, the emulator provides the following quotas for usage:

| Property | Value | User configurable within limits |
| --- | --- | --- |
| Number of supported namespaces | 1 | No |
| Maximum number of event hubs in a namespace | 10 | Yes |
| Maximum number of consumer groups in an event hub | 20 | Yes |
| Maximum number of partitions in an event hub | 32 | Yes |
| Maximum size of an event being published to an event hub (batch/nonbatch) | 1 MB | No |
| Minimum event retention time | 1 hour | No |

The emulator enforces these limits. While some values are configurable by using `config.json`, you can't exceed the listed maximums. Make any configuration changes before you start the emulator.

## Quota configuration changes

By default, the emulator runs with the [config.json](https://github.com/Azure/azure-event-hubs-emulator-installer/blob/main/EventHub-Emulator/Config/Config.json) configuration file. You can configure the quotas associated with Event Hubs by editing this file in the following ways, based on your needs:

- **Entities**: You can add more entities (event hubs), with a customized number of partitions and consumer groups, in accordance with supported quotas.
- **Logging**: The emulator supports logging on a console, in a file, or both. You can choose according to your personal preference.

> [!IMPORTANT]
> You must supply any changes in JSON configuration before you run the emulator. Changes aren't honored on the fly. For changes to take effect, you must restart the container.
>
> You can't rename the preset namespace (`name`) in the configuration file.

## Logs for debugging

During testing, console or file logs help you debug unexpected failures. To review the logs, use the following steps:

- **Console logs**: On the Docker desktop UI, select the container name.
- **File logs**: In the container, go to */home/app/EmulatorLogs*.

## Related content

- [Test locally by using the Azure Event Hubs emulator](test-locally-with-event-hub-emulator.md)
- [Azure Event Hubs emulator installer (GitHub)](https://github.com/Azure/azure-event-hubs-emulator-installer)
- [What is Azure Event Hubs?](event-hubs-about.md)

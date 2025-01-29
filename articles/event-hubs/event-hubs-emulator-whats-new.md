---
title: What's new with Event Hubs emulator
titleSuffix: Azure Event Hubs
description: View the updates for the latest version and previous versions of the Azure Event Hubs emulator.
author: Sannidhya
ms.author: saglodha
ms.topic: article
ms.date: 07/01/2024
---


# What's new with Event Hubs emulator

This article provides a detailed overview of the enhancements introduced in the latest version of the Azure Event Hubs emulator, along with information about previous versions.

> [!NOTE]
> The emulator is intended solely for development and test purpose. Any kind of production use is strictly discouraged. We don't provide any official support for the emulator.
>
> Kindly report any problems or suggestions in the emulator's [GitHub installer repository](https://github.com/Azure/azure-event-hubs-emulator-installer/issues).


## Latest version ``2.0.1``

> *Released November 19th, 2024*

This release introduces Apache Kafka support in Event Hubs emulator. 
- The producer and consumer APIs are now compatible with the Event Hubs emulator.

## Previous releases

### ``1.2.4`` (July 1st,2024)

This release provides enhanced connectivity fixes for Emulator. 
 
  - When the emulator container and interacting application are running natively on local machine, use following connection string:

  `"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

  - Applications (Containerized/Non-containerized) on the different machine and same local network can interact with Emulator using the IPv4 address of the machine. Use following connection string:

  `"Endpoint=sb://192.168.y.z;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

  - Application containers on the same bridge network can interact with Emulator using its alias or IP. Following connection string assumes the name of Emulator container is "eventhubs-emulator":

  `Endpoint=sb://eventhubs-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

  - Application containers on the different bridge network can interact with Emulator using the "host.docker.internal" as host. Use following connection string:

  `"Endpoint=sb://host.docker.internal;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

- Fixes emulator not accepting connections for initial few seconds after launch.
- Namespace name and type are now optional parameters in user supplied JSON configuration. 

### ``1.2.3`` (21st May,2024)

- Initial Launch

## Next steps

- [Learn more about the Azure Event Hubs emulator](overview-emulator.md)
- [Get started using the Azure Event Hubs emulator for development](test-locally-with-event-hub-emulator.md)

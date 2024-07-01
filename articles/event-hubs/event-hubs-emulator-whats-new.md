---
title: What's new with Event Hubs Emulator
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

## Latest version ``1.2.4`` 

> *Released July 1st, 2024*

This release provides enhanced connectivity fixes for Emulator. Details are below:
 
  - When emulator container and interacting application is running natively on local machine, use following connection string:

  `"Endpoint=sb://localhost;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

  - To connect emulator via local IP of host machine and any application on same network, use following connection string:

  `"Endpoint=sb://192.168.y.z;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

  - To connect emulator and application via same docker bridge network, use following connection string:

  `Endpoint=sb://eventhubs-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

  - To connect application and emulator running in different docker bridge network, use following connection string:

  `"Endpoint=sb://eventhubs-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;"`

- Fixes emulator not accepting connections for initial few seconds after launch.
- Namespace name and type are now optional parameters in user supplied JSON configuration. 

## Previous releases

### ``1.2.3`` (21st May,2024)

- Initial Launch

## Next steps

- [Learn more about the Azure Event Hubs emulator](overview-emulator.md)
- [Get started using the Azure Event Hubs emulator for development](test-locally-with-event-hub-emulator.md)

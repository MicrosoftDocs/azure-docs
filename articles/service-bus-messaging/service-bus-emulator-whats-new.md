---
title: What's new with Service Bus emulator
titleSuffix: Azure Service Bus
description: View the updates for the latest version and previous versions of the Azure Service Bus emulator.
author: Sannidhya
ms.author: saglodha
ms.topic: article
ms.date: 11/18/2024
---


# What's new with Service Bus emulator

This article provides a detailed overview of the enhancements introduced in the latest version of the Azure Service Bus emulator, along with information about previous versions.

> [!NOTE]
> The emulator is intended solely for development and test purpose. Any kind of production use is strictly discouraged. We don't provide any official support for the emulator.
>
> Kindly report any problems or suggestions in the emulator's [GitHub installer repository](https://github.com/Azure/azure-service-bus-emulator-installer/issues).

## Latest version ``1.1.2``

> *Released March 11th, 2025*

This release introduces new features, bug fixes for Service Bus emulator. The details are as follows:

- SQL Actions and Filters are now compatible with Service bus emulator.
- Provides Health check API in Service Bus emulator. It can be accessed at *http://localhost:5300/health*
- Provides user configurable health check interval for SQL.
- Added support for updating LockDuration to a minimum of 5 seconds.
- Other bug fixes.

## Previous releases

### ``1.0.1`` (19th November,2024)

- Initial Launch

## Next steps

- [Learn more about the Azure Service Bus emulator](overview-emulator.md)
- [Get started using the Azure Service Bus emulator for development](test-locally-with-service-bus-emulator.md)

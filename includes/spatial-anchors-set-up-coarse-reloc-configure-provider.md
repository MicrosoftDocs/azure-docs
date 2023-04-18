---
author: pamistel
ms.author: pamistel
ms.date: 01/28/2021
ms.service: azure-spatial-anchors
ms.topic: include
---

## Configure the sensor fingerprint provider

We'll start by creating and configuring a sensor fingerprint provider. The sensor fingerprint provider will take care of reading the platform-specific sensors on your device and converting their readings into a common representation consumed by the cloud spatial anchor session.

> [!IMPORTANT]
> [Make sure to check here](../articles/spatial-anchors/concepts/coarse-reloc.md#platform-availability) if the sensors you are enabling are available on your platform.
---
author: msftradford
ms.author: parkerra
ms.date: 11/20/2020
ms.service: azure-spatial-anchors
ms.topic: include
---

## Configure the sensor fingerprint provider

We'll start by creating and configuring a sensor fingerprint provider. The sensor fingerprint provider will take care of reading the platform-specific sensors on your device and converting their readings into a common representation consumed by the cloud spatial anchor session.

> [!WARNING]
> [Make sure to check here](../articles/spatial-anchors/concepts/coarse-reloc.md#platform-availability) if the sensors you are enabling are available on your platform.
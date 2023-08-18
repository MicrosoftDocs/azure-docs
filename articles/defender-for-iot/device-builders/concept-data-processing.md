---
title: Data processing and residency
description: Microsoft Defender for IoT data processing, and residency can occur in regions that are different than the IoT Hub's region.
ms.date: 01/12/2023
ms.topic: conceptual
---

# Data processing and residency

Microsoft Defender for IoT is a separate service, which adds an extra layer of threat protection to the Azure IoT Hub, IoT Edge, and your devices. Defender for IoT may process, and store your data within a different geographic location than your IoT Hub.

Mapping between the IoT Hub, and Microsoft Defender for IoT's regions is as follows:

- For a Hub located in Europe, the data is stored in the *West Europe* region.

- For a Hub located outside Europe, the data is stored in the *East US* region.

Microsoft Defender for IoT, uses the device twin, unmasked IP addresses, and additional configuration data as part of its security detection logic by default. To disable the device twin, and unmask the IP address collection, navigate to the data collection's settings page.

:::image type="content" source="media/concept-data-processing/data-collection-settings.png" alt-text="Screenshot of the data collections setting page.":::

## Next steps

Learn how to [customize your Defender for IoT solution](concept-micro-agent-configuration.md).

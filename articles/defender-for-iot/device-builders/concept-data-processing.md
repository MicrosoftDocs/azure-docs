---
title: Data processing and residency
description: 
ms.date: 12/13/2021
ms.topic: conceptual
---

# Data processing and residency

> [!NOTE]
> Microsoft Defender for IoT data processing and residency may take place in a region that is different than the IoT Hub region. Microsoft Defender for IoT uses the device twin, unmasked IP addresses, and additional configuration data as part of its security detection logic.

Microsoft Defender for IoT data processing, and residency can occur in regions that are different than the IoT Hub's region. Mapping between the IoT Hub, and the Microsoft Defender for IoT's regions is as follows:

- For a Hub located in Europe, the data is stored in the *West Europe* region.

- For a Hub located outside Europe, the data is stored in the *East US* region.

Microsoft Defender for IoT, uses the device twin, unmasked IP addresses, and additional configuration data as part of its security detection logic by default. To disable the device twin, and unmask the IP address collection, navigate to the data collection's settings page.

:::image type="content" source="media/concept-data-processing/data-collection-settings.png" alt-text="Screenshot of the data collections setting page.":::

## Next steps

Learn how to [customize your Defender for IoT solution](concept-micro-agent-configuration.md).

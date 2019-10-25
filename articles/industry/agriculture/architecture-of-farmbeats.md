---
title: Azure FarmBeats Architecture
description: Describes the architecture of Azure FarmBeats
author: uhabiba04
ms.topic: article
ms.date: 11/25/2019
ms.author: v-umha
ms.service: backup
---

# Integration patterns

Azure FarmBeats is a business-to-business offering available in Azure Marketplace that enables (a) aggregation of agriculture datasets across providers, and (b) generation of actionable insights by building Artificial Intelligence (AI) or Machine Learning (ML) models by fusing the datasets.

![Project Farm Beats](./media/architecture-for-farmbeats/farmbeats-architecture.png)

The following sections describe the integration pattern for Azure FarmBeats.

## Why integrate with Azure FarmBeats?

This section is focused on Partners who want to integrate their data systems (like sensors, drones, weather stations) into Azure FarmBeats.

Azure FarmBeats is an extensible offering, which enables agribusinesses to add their different historical and real-time agriculture datasets into a single platform. Azure FarmBeats helps an agribusiness to normalize, contextualize, and aggregate the data in the context of a farm.

By becoming a data partner with Azure FarmBeats, you can open your systems to wider adoption, and reach out to more customers with your data offerings. Azure FarmBeats provides an extensible API layer called the Data hub, which helps you ingest data from your devices systematically and into a standardized schema.

Once the data is available within your customers’ Azure FarmBeats instance, your customers can build richer analytics and tools on top of your data.


## Next steps

To know more, click [sensor data integration](sensor-partner-integration.md#get-sensor-data-from-sensor-partners) or [imagery partner integration](imagery-partner-integration.md#imagery-partner-integration)

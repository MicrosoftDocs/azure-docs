---
title: Azure region relocation documentation
description:  Learn how to plan, execute, scale, and deliver the relocation of your Azure services into a new region. 
author: anaharris-ms
ms.topic: overview
ms.date: 11/28/2023
ms.author: anaharris
ms.service: reliability
ms.subservice: availability-zones
ms.custom: subject-reliability
---

# Azure region relocation documentation

As Microsoft continues to expand Azure global infrastructure and launch new Azure regions worldwide, Azure customers continue to have an increasing number of region relocation options for their business-critical data and apps.

Business drivers and requirements for relocating to a new Azure region include:

- **Respond to data residency and security requirements**. Move business-critical resources to an Azure region that's compliant with data residency and security requirements.

- **Align to a region launch**. Move resources to a newly introduced Azure region not previously available.

- **Align for services/features**. Move resources to take advantage of cloud services or features in a specific region.

- **Respond to business developments**. Move resources to a region in response to business changes, such as mergers or acquisitions.

- **Align for proximity**. Move resources to a region local to your business.

- **Respond to deployment requirements**. Move resources deployed in error or move in response to capacity needs.

- **Respond to decommissioning**. Move resources due to decommissioning of regions.

:::image type="content" source="media/relocation/azure-regions.png" alt-text="Picture of a world map that illustrates the many regions and availability zones within regions that are available.":::

The Azure region relocation documentation provides guidance to help you facilitate the relocation of your Azure services into a new region. Use this guide to help plan, execute, scale, and deliver your Azure cloud relocation project.

The Azure region relocation documentation provides a technical framework for assessing, preparing, and piloting Azure relocation for specific Azure services.

## Relocation strategies

There are three possible relocation strategies that you can use to relocate your Azure services, depending on the nature of the service you are relocating:

- [Azure Resource Mover (ARM)](./relocation-strategy-resource-mover.md). Use Azure Resource Mover for moving resources across regions.

- [Service redeployment](). Use redeployment to relocate a stateless Azure service.

- [Redeployment with data migration](). Use redeployment with data migration to relocate a stateful Azure service.
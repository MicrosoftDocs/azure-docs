---
title: Azure Migrate supported geographies
description: Provides a list of regions where Azure Migrate is supported
ms.topic: concept-article
ms.date: 04/17/2025
monikerRange: migrate
# Customer intent: "As a cloud architect, I want to understand the supported geographies for Azure Migrate, so that I can plan and execute migration projects while ensuring compliance with data residency requirements."
---

# Supported geographies 

<!--#### [Azure Public cloud](#tab/public)-->
This article provides detailed information on the geographies where Azure Migrate is supported, including the specific regions where metadata is stored for different types of Azure clouds. 

## Public cloud

You can create a project in many geographies in the public cloud.

- Although you can only create projects in these geographies, you can assess or migrate servers for other target locations.
- The project geography is only used to store the discovered metadata. 
- When you create a project, you select a geography. The project and related resources are created in one of the regions in the geography. The region is allocated by the Azure Migrate service. Azure Migrate doesn't move or store customer data outside of the region allocated.

**Geography** | **Metadata storage location**
--- | ---
Africa | South Africa or North Africa
Asia Pacific | East Asia
Australia | Australia East or Australia Southeast
Brazil | Brazil South
Canada | Canada Central or Canada East
Europe | North Europe or West Europe
France | France Central
Germany | Germany West Central
India | Central India or South India
Italy | North Italy
Japan |  Japan East or Japan West
Jio India | Jio India West 
Korea | Korea Central
Norway | Norway East
Sweden | Sweden Central
Switzerland | Switzerland North
United Arab Emirates | UAE North
United Kingdom | UK South or UK West
United States | Central US or West US 2

> [!NOTE]
> For Switzerland geography, Switzerland West is only available for REST API users and needs an approved subscription.

<!--#### [Azure for US Government](#tab/gov)--->

## Azure Government

**Task** | **Geography** | **Details**
--- | --- | ---
Create project | United States | Metadata is stored in US Gov Arizona, US Gov Virginia
Target assessment | United States | Target regions: US Gov Arizona, US Gov Virginia, US Gov Texas
Target replication | United States | Target regions: US DoD Central, US DoD East, US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia

<!--#### [Azure operated by 21Vianet](#tab/21via)-->

## Azure operated by 21Vianet

**Geography** | **Metadata storage location**
--- | ---
Microsoft Azure operated by 21Vianet | China North 2

## Next steps

[Review](migrate-support-matrix.md) the Azure Migrate Support Matrix for more information.

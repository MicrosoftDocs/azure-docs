---
title: Discovery methods in Azure Migrate 
description: Azure Migrate offers modes for discovering resources
ms.topic: conceptual
author: habibaum
ms.author: v-uhabiba
ms.manager: molir
ms.service: azure-migrate
ms.date: 05/28/2025
ms.custom: engagement-fy24
---

# Discovery methods in Azure Migrate 

This article explains the two main discovery methods that Azure Migrate uses to find on-premises and cloud-based resources. Each approach serves specific purposes and suits different scenarios. The following are the two methods:

1. Appliance-Based Discovery
1. Import-Based Discovery

## Prerequisites

Before you begin, make sure you create an Azure Migrate project by following the steps in [Quickstart: Create an Azure Migrate project using portal](quickstart-create-project.md)

## Appliance-based discovery

The appliance-based discovery method involves deploying a virtual appliance that scans your environment to collect metadata about resources. This approach is ideal for scenarios where detailed, automated, and continuous discovery are required. 

**Key features**: 

- Continuous collection of configuration and performance data.  
- Supports discovering workloads such as SQL databases, webapps, and MySQL. 
- Discover software inventory and enable dependency analysis.  

## Guidance to choose the right appliance

**VMware environments**: For VMware-based infrastructures, we recommend to deploy VMware stack of Azure Migrate appliance. This appliance also supports agentless migrations.


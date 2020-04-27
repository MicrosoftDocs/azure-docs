---
title: Provision autoscale throughput in Azure Cosmos DB
description: Learn how to provision autoscale throughput at the container and database level in Azure Cosmos DB using Azure portal, CLI, PowerShell and various other SDKs. 
author: deborahc
ms.author: dech
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/26/2020
---

This article explains how to provision autoscale throughput on a database or container (collection, graph, or table) in Azure Cosmos DB. You can enable autoscale on a single container, or provision autoscale throughput on a database and share it among all the containers in the database. You can configure autoscale for new databases and containers using Azure Portal, ARM, or Azure Cosmos DB .NET V3 SDK.

## Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB explorer.](https://cosmos.azure.com/)

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **New Container.** Enter a name for your database, container, and a partition key. Under **Throughput**, select the **autoscale** option, and set the [maximum throughput (RU/s)](provision-throughput-autopilot.md#how-autoscale-provisioned-throughput-works) that you want the database or container to scale to.

   ![Creating a container and configuring autoscale provisioned throughput](./media/how-to-provision-autoscale-throughput/create-new-autoscale-container.png)


1. Select **OK**.

You can create a shared throughput database with autoscale by selecting the **Provision database throughput** option.

## Azure Cosmos DB .NET V3 SDK


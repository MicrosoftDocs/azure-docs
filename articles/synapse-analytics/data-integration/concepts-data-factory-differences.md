---
title: Differences from Azure Data Factory
description: Learn how the data integration capabilities of Azure Synapse Analytics differ from those of Azure Data Factory
services: synapse-analytics 
author: djpmsft
ms.service: synapse-analytics 
ms.topic: conceptual
ms.date: 09/23/2020
ms.author: daperlov
ms.reviewer: jrasnick
---

# Data integration in Azure Synapse Analytics versus Azure Data Factory

In Azure Synapse Analytics, the data integration capabilities such as Synapse pipelines and data flows are based upon those of Azure Data Factory. For more information, see [what is Azure Data Factory](../../data-factory/introduction.md). Almost all of the capabilities are identical or similar and documentation is shared between the two services. This article highlights and identifies the current differences between Azure Data Factory and Azure Synapse.

To see if an Azure Data Factory feature or article applies to Azure Synapse, check the moniker at the top of the article.

![Applies to moniker](../media/concepts-data-factory-differences/applies-to-moniker.png "Applies to moniker")

## Features in Azure Data Factory not planned for Azure Synapse

The following features are available in Azure Data Factory, but aren't planned for Azure Synapse.

* The ability to lift and shift SSIS packages.
* Snowflake as a sink in the copy activity and mapping data flow.
* The mapping data flow time to live setting of the Azure integration runtime.

## Azure Synapse features not supported in Azure Data Factory

The following features are available in Azure Synapse, but aren't planned for Azure Data Factory.

* Spark job monitoring of mapping data flows is only available in Synapse. In Synapse, the Spark engine is contained in the user's subscription so users can view detailed Spark logs. In Azure Data Factory, job execution occurs on an Azure Data Factory-managed Spark cluster. 

## Azure Data Factory features that behave differently in Synapse

The following features either behave differently or don't currently exist in Azure Synapse. 

* Wrangling data flows
* The solution template gallery
* Git integration and a native CI/CD solution
* Integration with Azure monitor
* Renaming of resources after publish
* Hybrid integration runtime configuration within a Synapse workspace. A user can't have both a managed VNet IR and an Azure IR.
* Integration runtime sharing between Synapse workspaces

## Next steps

Get started with data integration in your Synapse workspace by learning how to [ingest data into a Azure Data Lake Storage gen2 account](data-integration-data-lake.md).

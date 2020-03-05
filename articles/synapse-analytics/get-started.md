---
title: Getting Started Tutorial 
description: Steps by steps to quickly understand basic concepts in Synapse
services: synapse analytics
author: julieMSFT
ms.author: jrasnick
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: quickstart
ms.date: 02/20/2020 
---

# Getting Started Tutorial with Azure Synapse Analytics
We recommend this tutorial for anyone starting with Azure Synapse Analytics. It should guide, beginners to experts, through all the necessary steps to understand basic but core principles.

![Action cards](./media/get-started-synapse-analytics/action-cards.png)

## Overview
This tutorial uses a stripped down version of the New-York City cabs (Green and Yellow cabs, For Hire Vehicles) and holiday data. 

## Create and configure a workspace
<!--- Jose --->

## Create resources
<!--- Jose --->

## Add users into the workspace
<!--- Optional Saveen --->

## Adding an additional storage account
<!--- Arnaud --->
In Synapse, you can connect to workspace and analyze with SQL and Spark multiple storage accounts and databases.

Such connection happens through linked services. Currently supported external data stores are:

| External data store | Type | Actions | Supported By | 
|---|------|-----|-----|
| ADLSg2 | Storage account | Read/Write | SQL on-demand, SQL pool, Spark |
| Blob Storage | Storage account | Read/Write | SQL on-demand, SQL pool, Spark |
| Cosmos DB | Database | Coming soon | SQL on-demand, Spark |

For the rest of that tutorial, we assume that you have created a Data Lake Storage account called **Tutorial_ADLSg2**. To add a new external data store and make it visible in the **Data** section, follow the directions:

1. Select **Data** to access the Data object explorer.
2. Select plus **+**.
3. Select **external data store**.
4. Select the supported storage account that you want to access. Note that this action will create a linked service in the workspace.
5. Select **Azure Data Lake Storage Gen2**.
6. Select **Continue**.
7. Enter the name of the linked service in the **Name** section.
8. Select the account and authentication methods.
9. Select **Create**.
10. The external data store you connected to the workspace should be visible after you select the **refresh** icon.

## Bring data to the lake
<!--- Arnaud --->
I need to work on that

## Explore
<!--- Arnaud --->

## Prep and Transform
<!--- Euan --->

## Create tables
<!--- Euan --->

## Analyze
### Analyze with a notebook
<!--- Euan --->

### Analyze with SQL script
<!--- Josh --->

### Analyze with Power BI
<!--- Josh --->

## Serve via Power BI
<!--- Josh --->

## Serve via SQL pool
<!--- Matthew --->

## Operationalize code using pipeline
<!--- Matthew --->

## Monitor
<!--- Matthew --->

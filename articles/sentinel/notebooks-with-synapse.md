---
title: Integrate Azure Sentinel notebooks with Azure Synapse for big data analytics
description: This article describes how run big data queries in Azure Synapse with Azure Sentinel notebooks.
services: sentinel
author: batamig
ms.author: bagol
ms.assetid: 1721d0da-c91e-4c96-82de-5c7458df566b
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.custom: mvc
ms.date: 10/06/2021
---

# Integrate notebooks with Azure Synapse (Public preview)

> [!IMPORTANT]
> Azure Sentinel notebook integration with Azure Synapse is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Integrating Azure Sentinel notebooks with Azure Synapse Analytics enables you to run parallel data processing from inside Azure Sentinel, using a big data analytics platform.

While KQL and Log Analytics are the primary tools and solutions for querying and analyzing data in Azure Sentinel, Azure Synapse provides extra features for big data analysis, with a built-in data lake and the Apache Spark distributed computing processing engine.

Integrating with Azure Synapse provides:

- Streaming and processing functionality for advanced batch analytics on big data.
- Analysis support for data in Azure Data Lake storage, for lower cost, long-term retention, and more.

For example, you may want to use notebooks with Azure Synapse to hunt for anomalous behaviors from network firewall logs to detect potential network beaconing, or to build machine learning or batch learning models on top of data collected from a Log Analytics workspace.

## Prerequisites

### Required roles and permissions

To use Azure Synapse with Azure Sentinel notebooks, you must have the following roles and permissions:

|Type  |Details  |
|---------|---------|
|**Azure Sentinel**     |- The **Azure Sentinel Contributor** role, in order to save and launch notebooks from Azure Sentinel         |
|**Azure Machine Learning**     |- A resource group-level **Owner** or **Contributor** role, to create a new Azure Machine Learning workspace if needed. <br>- A **Contributor** role on the Azure Machine Learning workspace where you run your Azure Sentinel notebooks.         |
|**Azure Synapse**     | - A resource group-level **Owner** role, to create a new Azure Synapse workspace if needed.<br>- A **Contributor** role on the Azure Synapse workspace you want to use to run your queries. <br>- An Azure Synapse **Contributor** role on Synapse Studio        |
|**Azure Data Lake**     | - An Azure Log Analytics **Contributor** role, to export data from a Log Analytics workspace<br>- An Azure Blob Storage Contributor role, to query data from a data lake |
|     |         |



1. In the Azure Sentinel **Notebooks** page, select **Configure Azure Synapse** to create a new Synapse workspace.

1. In the search box, enter **Synapse** to locate the notebooks that work with Synapse. For example, use the **Guided Hunting - Advanced Analytics with AM + Synapse** workbook to WHAT? TBD.

1. At the bottom-right, select **Clone notebook**. In the **Clone notebook pane** that appears, enter a meaningful name for your notebook and select your AML and Synapse workspaces.

1. After your notebook is deployed, select **Launch Notebook** to open it.

For example, the **Guided Hunting - Advanced Analytics with AM + Synapse** includes the following code, which uses PySpark in a Synapse session:

```python
from pyspark.swl import SparkSession

spark = SparkSession \
    .builder \
    .appName("Spark_Data_Analysis") \
    .config("spark.sql.caseSensitive", "True") \
    .getOrCreate()
```

**To manage or select your Synapse workspace**

To manage or select a different Synapse workspace than the one you're currently signed in to, select Configure Azure Synapse > Manage Synapse workspace.

Then in the **Select workspace** page, make sure your Azure Active Directory and Subscription values are correct, and select your Synapse workspace from the *Workspace name** dropdown.

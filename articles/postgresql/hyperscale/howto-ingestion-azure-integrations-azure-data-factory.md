---
title: Azure Data Factory
description: Step-by-step guide for using Azure Data Factory for ingestion on Hyperscale Citus
ms.author: suvishod
author: sudhanshuvishodia
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/27/2022
---

# What is Azure Data Factory(ADF)?

[Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/introduction) is the cloud-based ETL and data integration service that allows you to create data-driven workflows for orchestrating data movement and transforming data at scale. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores running on-premises, in Azure or other cloud providers for analytics and reporting.
The sink support for Hyperscale (Citus) allows you to bring your data (relational, NoSQL, data lake files) to your favourite open-source database for storage, processing, and reporting.

![Dataflow diagram for Azure Data Factory.](../media/howto-ingestion-azure-integrations-azure-data-factory/architecture.png)

## ADF for realtime ingestion to Hyperscale (Citus)

Some of the key factors for choosing Azure Data Factory for ingestion with Hyperscale (Citus) are:

* **Easy-to-use**- Offers a code free visual environment for orchestrating and automating data movement.
* **Powerful**- Use the full capacity of underlying network bandwidth, up to 5 GB/s throughput.
* **Built-in Connectors**- Integrate all your data with more than 90 built-in connectors.
* **Cost Effective**- Enjoy a pay-as-you-go, fully managed serverless cloud service that scales on demand.

## Steps to setup ADF with Hyperscale (Citus)

In this tutorial, we will create a data pipeline by using the Azure Data Factory user interface (UI). The pipeline in this data factory copies data from Azure Blob storage to a database in Hyperscale (Citus). For a list of data stores supported as sources and sinks, see the [supported data stores](https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) table.

In Azure Data Factory, you can use the **Copy** activity to copy data among data stores located on-premises and in the cloud to Hyperscale Citus. If you are new to Azure Data Factory, here is a quick guide on how to get started:

1. Once ADF is provisioned, go to your data factory. You will see the Data Factory home page as shown in the following image:

![Landing page of Azure Data Factory.](../media/howto-ingestion-azure-integrations-azure-data-factory/ADF_Home.png)

2. On the home page, select **Orchestrate**.

![Orchestrate page of Azure Data Factory.](../media/howto-ingestion-azure-integrations-azure-data-factory/ADF_Orchestrate.png)

3. In the General panel under **Properties**, specify the name of pipeline. 
4. In the **Activities** toolbox, expand the **Move and Transform** category, and drag and drop the **Copy Data** activity to the pipeline designer surface. Specify the activity name.

![Orchestrate page of Azure Data Factory.](../media/howto-ingestion-azure-integrations-azure-data-factory/ADF_Pipeline_COPY.png)

5. Configure **Source**





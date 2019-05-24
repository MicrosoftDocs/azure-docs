---
title: Ingest and transform data from SQL Server to Azure SQL Database | Microsoft Docs
description: This tutorial provides step-by-step instructions for transforming data coming from on-prem SQL Server using ADF with Mapping Data Flows.
services: data-factory
author: kromerm
ms.service: data-factory
ms.workload: data-services
ms.date: 05/23/2019
ms.author: makromer
---

# Transform data from on-prem SQL Server and send it to Azure SQL Database

Azure Data Factory is a cloud-based data integration and ETL service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores, process/transform the data at scale with a code-free interface.

In this tutorial, you create a Data Factory pipeline that copies data from SQL Server on-prem to Azure Blob for transformation using Mapping Data Flows. You'll then land the transformed data in Azure SQL Database.

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure Storage and Azure SQL Database linked services.
> * Create Azure BLob and Azure SQL Database datasets.
> * Create a pipeline contains a Copy activity.
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.

This tutorial uses .NET SDK. You can use other mechanisms to interact with Azure Data Factory, refer to samples under "Quickstarts".

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

* **Azure Storage account**. You use the blob storage as **source** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one.
* **Azure SQL Database**. You use the database as **sink** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article for steps to create one.
* **Visual Studio** 2015, or 2017. The walkthrough in this article uses Visual Studio 2017.
* **Download and install [Azure .NET SDK](http://azure.microsoft.com/downloads/)**.
* **Create an application in Azure Active Directory** following [this instruction](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application). Make note of the following values that you use in later steps: **application ID**, **authentication key**, and **tenant ID**. Assign application to "**Contributor**" role by following instructions in the same article.

### Create a blob and a SQL table

Now, prepare your Azure Blob and Azure SQL Database for the tutorial by performing the following steps:

#### Create a source blob



## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. You learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Create Azure Storage and Azure SQL Database linked services.
> * Create Azure Blob and Azure SQL Database datasets.
> * Create a pipeline contains a Copy activity.
> * Start a pipeline run.
> * Monitor the pipeline and activity runs.


Advance to the following tutorial to learn about copying data from on-premises to cloud: 

> [!div class="nextstepaction"]
>[Copy data from on-premises to cloud](tutorial-hybrid-copy-powershell.md)

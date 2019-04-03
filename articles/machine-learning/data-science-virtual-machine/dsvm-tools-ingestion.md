---
title: Data Science Virtual Machine data ingestion tools - Azure | Microsoft Docs
description: Learn about the data ingestion tools and utilities pre-installed in the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/11/2017
ms.author: gokuma

---

# Data Science Virtual Machine data ingestion tools

One of the first technical steps in a data science or AI project is to identify the datasets to be used and bring them into your analytics environment. The Data Science Virtual Machine (DSVM) provides tools and libraries to bring in data from different sources into an analytical data storage locally on the DSVM or in a data platform on the cloud or on-premises. 

Here are some data movement tools we have provided on the DSVM. 

## AdlCopy

|    |           |
| ------------- | ------------- |
| What is it?   | A tool to copy data from Azure storage blobs into Azure Data Lake Store. It can also copy data between two Azure Data Lake Store accounts.      |
| Supported DSVM Versions      | Windows      |
| Typical Uses      | Importing multiple blobs from Azure storage into Azure Data Lake Store.      |
|  How to use / run it?    |   Open a command prompt, then type `adlcopy` to get help.    |
| Links to Samples      | [Using AdlCopy](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob)      |
| Related Tools on the DSVM      | AzCopy, Azure Command Line     |

## Azure Command Line

|    |           |
| ------------- | ------------- |
| What is it?   | A management tool for Azure. It also contains command verbs to move data from Azure data platforms like Azure storage blobs, Azure Data Lake Storage     |
| Supported DSVM Versions      | Windows, Linux     |
| Typical Uses      | Importing, exporting data to and from Azure storage, Azure Data Lake Store      |
|  How to use / run it?    |   Open a command prompt, then type `az` to get help.    |
| Links to Samples      | [Using Azure CLI](https://docs.microsoft.com/cli/azure)     |
| Related Tools on the DSVM      | AzCopy, AdlCopy      |


## AzCopy

|    |           |
| ------------- | ------------- |
| What is it?   | A tool to copy data to and from local files, Azure storage blobs, files, and tables.      |
| Supported DSVM Versions      | Windows      |
| Typical Uses      | Copying files to blob storage, copying blobs between accounts.      |
|  How to use / run it?    |   Open a command prompt, then type `azcopy` to get help.    |
| Links to Samples      | [AzCopy on Windows](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy)      |
| Related Tools on the DSVM      | AdlCopy     |


## Azure Cosmos DB Data Migration tool

|    |           |
| ------------- | ------------- |
| What is it?   | Tool to import data from various sources, including JSON files, CSV files, SQL, MongoDB, Azure Table storage, Amazon DynamoDB, and Azure Cosmos DB SQL API collections into Azure Cosmos DB.      |
| Supported DSVM Versions      | Windows      |
| Typical Uses      | Importing files from a VM to CosmosDB, importing data from Azure table storage to CosmosDB, or importing data from a SQL Server database to CosmosDB.     |
|  How to use / run it?    |   To use the command line version, Open a command prompt, then type `dt`. To use the GUI tool, open a command prompt, then type `dtui`.    |
| Links to Samples      | [CosmosDB Import Data](https://docs.microsoft.com/azure/cosmos-db/import-data)      |
| Related Tools on the DSVM      | AzCopy, AdlCopy      |


## bcp

|    |           |
| ------------- | ------------- |
| What is it?   | SQL Server tool to copy data between SQL Server and a data file.      |
| Supported DSVM Versions      | Windows      |
| Typical Uses      | Importing a CSV file into a SQL Server table, exporting a SQL Server table to a file.      |
|  How to use / run it?    |   Open a command prompt, then type `bcp` to get help.    |
| Links to Samples      | [Bulk Copy Utility](https://docs.microsoft.com/sql/tools/bcp-utility)      |
| Related Tools on the DSVM      | SQL Server, sqlcmd      |

## blobfuse

|    |           |
| ------------- | ------------- |
| What is it?   | A tool to mount an Azure blob container in the Linux file system.      |
| Supported DSVM Versions      | Linux      |
| Typical Uses      | Reading and writing to blobs in a container      |
|  How to use / run it?    |   Run _blobfuse_ at a terminal.    |
| Links to Samples      | [blobfuse on GitHub](https://github.com/Azure/azure-storage-fuse)      |
| Related Tools on the DSVM      | Azure Command Line      |


## Microsoft Data Management Gateway

|    |           |
| ------------- | ------------- |
| What is it?   | A tool to connect on-premises data sources to cloud services for consumption.      |
| Supported DSVM Versions      | Windows      |
| Typical Uses      | Connecting a VM to an on-premises data source.      |
|  How to use / run it?    |   Start "Microsoft Data Management Gateway" from the Start Menu.    |
| Links to Samples      | [Data Management Gateway](https://msdn.microsoft.com/library/dn879362.aspx)      |
| Related Tools on the DSVM      | AzCopy, AdlCopy, bcp    |

---
title: Data ingestion tools
titleSuffix: Azure Data Science Virtual Machine
description: Learn about the data ingestion tools and utilities that are preinstalled on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-azurecli

author: timoklimmer
ms.author: tklimmer
ms.topic: conceptual
ms.reviewer: franksolomon
ms.date: 04/19/2024
---

# Data Science Virtual Machine data ingestion tools

At an early stage in a data science or AI project, you must identify the needed datasets, and then bring them into your analytics environment. The Data Science Virtual Machine (DSVM) provides tools and libraries to bring data from different sources into local analytical data storage resources on the DSVM. The DSVM can also bring data into a data platform located either on the cloud or on-premises.

The DSVM offers these data movement tools:

## Azure CLI

| Category | Value |
|--|--|
| What is it? | A management tool for Azure. It offers command verbs to move data from Azure data platforms - for example, Azure Blob storage and Azure Data Lake Store |
| Supported DSVM versions | Windows, Linux |
| Typical uses | Import and export data between Azure Storage and Azure Data Lake Store |
| How to use / run it? | Open a command prompt, and type `az` to get help. |
| Links to samples | [Using Azure CLI](/cli/azure) |

## AzCopy

| Category | Value |
|--|--|
| What is it? | A tool to copy data between local files, Azure Blob storage, files, and tables |
| Supported DSVM versions | Windows |
| Typical uses | Copy files to Azure Blob storage<br>Copy blobs between accounts |
| How to use / run it? | Open a command prompt, and type `azcopy` to get help. |
| Links to samples | [AzCopy on Windows](../../storage/common/storage-use-azcopy-v10.md) |

## Azure Cosmos DB Data Migration tool

| Category | Value |
| ------------- | ------------- |
| What is it? | Tool to import data from various sources into Azure Cosmos DB, a NoSQL database in the cloud. These sources include JSON files<br>CSV files<br>SQL<br>MongoDB<br>Azure Table storage<br>Amazon DynamoDB<br>Azure Cosmos DB for NoSQL collections |
| Supported DSVM versions | Windows |
| Typical uses | Import files from a VM to Azure Cosmos DB<br>import data from Azure table storage to Azure Cosmos DB<br>import data from a Microsoft SQL Server database to Azure Cosmos DB |
| How to use / run it? | To use the command-line version, open a command prompt and type `dt`. To use the GUI tool, open a command prompt and type `dtui` |
| Links to samples | [Import data into Azure Cosmos DB](../../cosmos-db/import-data.md) |

## Azure Storage Explorer

| Category | Value |
|--|--|
| What is it? | Graphical User Interface to interact with files stored in the Azure cloud |
| Supported DSVM versions | Windows |
| Typical uses | Import data to and export data from the DSVM |
| How to use / run it? | Search for "Azure Storage Explorer" in the Start menu |
| Links to samples | [Azure Storage Explorer](vm-do-ten-things.md#access-azure-data-and-analytics-services) |

## bcp

| Category | Value |
|--|--|
| What is it? | SQL Server tool to copy data between SQL Server and a data file |
| Supported DSVM versions | Windows |
| Typical uses | Import a CSV file into a SQL Server table<br>Export a SQL Server table to a file |
| How to use / run it? | Open a command prompt, and type `bcp` to get help |
| Links to samples | [bcp utility](/sql/tools/bcp-utility) |

## blobfuse

| Category | Value |
|--|--|
| What is it? | A tool to mount an Azure Blob storage container in the Linux file system |
| Supported DSVM versions | Linux |
| Typical uses | Read from and write to blobs in a container |
| How to use and run it? | Run _blobfuse_ at a terminal |
| Links to samples | [blobfuse on GitHub](https://github.com/Azure/azure-storage-fuse) |
---
title: Data ingestion tools
titleSuffix: Azure Data Science Virtual Machine 
description: Learn about the data ingestion tools and utilities that are preinstalled on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: ignite-2022, devx-track-azurecli

author: timoklimmer
ms.author: tklimmer
ms.topic: conceptual
ms.date: 05/12/2021
---

# Data Science Virtual Machine data ingestion tools

As one of the first technical steps in a data science or AI project, you must identify the datasets to be used and bring them into your analytics environment. The Data Science Virtual Machine (DSVM) provides tools and libraries to bring data from different sources into analytical data storage locally on the DSVM, or into a data platform either on the cloud or on-premises.

Here are some data movement tools that are available in the DSVM.

## Azure CLI

| Category | Value |
|--|--|
| What is it? | A management tool for Azure. It also contains command verbs to move data from Azure data platforms like Azure Blob storage and Azure Data Lake Store. |
| Supported DSVM versions | Windows, Linux |
| Typical uses | Importing and exporting data to and from Azure Storage and Azure Data Lake Store. |
| How to use / run it? | Open a command prompt and type `az` to get help. |
| Links to samples | [Using Azure CLI](/cli/azure) |


## AzCopy

| Category | Value |
|--|--|
| What is it? | A tool to copy data to and from local files, Azure Blob storage, files, and tables. |
| Supported DSVM versions | Windows |
| Typical uses | Copying files to Azure Blob storage and copying blobs between accounts. |
| How to use / run it? | Open a command prompt and type `azcopy` to get help. |
| Links to samples | [AzCopy on Windows](../../storage/common/storage-use-azcopy-v10.md) |


## Azure Cosmos DB Data Migration tool

|--|--|
| ------------- | ------------- |
| What is it? | Tool to import data from various sources into Azure Cosmos DB, a NoSQL database in the cloud. These sources include JSON files, CSV files, SQL, MongoDB, Azure Table storage, Amazon DynamoDB, and Azure Cosmos DB for NoSQL collections. |
| Supported DSVM versions | Windows |
| Typical uses | Importing files from a VM to Azure Cosmos DB, importing data from Azure table storage to Azure Cosmos DB, and importing data from a Microsoft SQL Server database to Azure Cosmos DB. |
| How to use / run it? | To use the command-line version, open a command prompt and type `dt`. To use the GUI tool, open a command prompt and type `dtui`. |
| Links to samples | [Import data into Azure Cosmos DB](../../cosmos-db/import-data.md) |

## Azure Storage Explorer

| Category | Value |
|--|--|
| What is it? | Graphical User Interface for interacting with files stored in the Azure cloud. |
| Supported DSVM versions | Windows |
| Typical uses | Importing and exporting data from the DSVM. |
| How to use / run it? | Search for "Azure Storage Explorer" in the Start menu. |
| Links to samples | [Azure Storage Explorer](vm-do-ten-things.md#access-azure-data-and-analytics-services) |

## bcp

| Category | Value |
|--|--|
| What is it? | SQL Server tool to copy data between SQL Server and a data file. |
| Supported DSVM versions | Windows |
| Typical uses | Importing a CSV file into a SQL Server table and exporting a SQL Server table to a file. |
| How to use / run it? | Open a command prompt and type `bcp` to get help. |
| Links to samples | [bcp utility](/sql/tools/bcp-utility) |

## blobfuse

| Category | Value |
|--|--|
| What is it? | A tool to mount an Azure Blob storage container in the Linux file system. |
| Supported DSVM versions | Linux |
| Typical uses | Reading and writing to blobs in a container. |
| How to use and run it? | Run _blobfuse_ at a terminal. |
| Links to samples | [blobfuse on GitHub](https://github.com/Azure/azure-storage-fuse) |

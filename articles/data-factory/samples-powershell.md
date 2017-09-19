---
title: Azure PowerShell Samples for Azure Data Factory | Microsoft Docs
description: Azure PowerShell Samples - Scripts to help you create and manage data factories. 
services: data-factory
author: spelluru
manager: jhubbard
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/16/2017
ms.author: spelluru
---

# Azure PowerShell samples for Azure Data Factory

The following table includes links to sample Azure PowerShell scripts for Azure Cosmos DB.

| |  |
|---|---|
|**Copy data**||
|[Copy blobs from a folder to another folder in an Azure Blob Storage](scripts/copy-azure-blob-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script copies blobs from a folder in Azure Blob Storage to another folder in the same Blob Storage. |
|**Transform data**||
|[Transform data using a Spark cluster](scripts/transform-data-spark-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script transforms data by running a program on a Spark cluster. |
|**Lift and shift SSIS packages to Azure**||
|[Create Azure-SSIS integration runtime](scripts/deploy-azure-ssis-integration-runtime-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell scripts provisions an Azure-SSIS integration runtime that runs SQL Server Integration Services (SSIS) packages in Azure. |

## Next steps
The pipeline in this sample copies data from one location to another location in an Azure blob storage. Go through the following tutorials to learn about using Data Factory in slightly complex scenarios. 

Tutorial | Description
-------- | -----------
[Tutorial: copy data from an on-premises SQL Server to an Azure blob storage](tutorial-copy-onprem-data-to-cloud-powershell.md) | Shows you how to copy data from an on-premises SQL Server database to an Azure blob storage. 
[Tutorial: transform data using Spark](tutorial-transform-data-using-spark-powershell.md) | Shows you how to transform data in the cloud by using a Spark cluster on Azure

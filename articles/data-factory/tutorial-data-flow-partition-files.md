---
title: Partition large files in ADF Mapping Data Flows | Microsoft Docs
description: Learn how to partition large files automatically using Azure Data Factory Mapping Data Flows
services: data-factory
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: tutorial
ms.date: 03/20/2010
author: kromerm
ms.author: makromer
---

# Partition large files in ADF Mapping Data Flows
This tutorial provides steps for a simple Mapping Data Flow pattern that takes a [large CSV text file](https://www.kaggle.com/wendykan/lending-club-loan-data) with 887,380 rows and creates 20 partitions so that each file contains 44k rows. 

In this tutorial, you complete the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Create a data flow.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

- **Azure subscription**. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 
- **Azure SQL Database server**. If you don't already have a database server, create one in the Azure portal before you get started. Azure Data Factory creates the SSIS Catalog (SSISDB database) on this database server. We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to the SSISDB database without crossing Azure regions. 
- Based on the selected database server, SSISDB can be created on your behalf as a single database, part of an elastic pool, or in a Managed Instance and accessible in public network or by joining a virtual network. If you use Azure SQL Database with virtual network service endpoints/Managed Instance to host SSISDB or require access to on-premises data, you need to join your Azure-SSIS IR to a virtual network, see [Create Azure-SSIS IR in a virtual network](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). 
- Confirm that the **Allow access to Azure services** setting is enabled for the database server. This is not applicable when you use Azure SQL Database with virtual network service endpoints/Managed Instance to host SSISDB. For more information, see [Secure your Azure SQL database](../sql-database/sql-database-security-tutorial.md#create-firewall-rules). To enable this setting by using PowerShell, see [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule). 
- Add the IP address of the client machine, or a range of IP addresses that includes the IP address of client machine, to the client IP address list in the firewall settings for the database server. For more information, see [Azure SQL Database server-level and database-level firewall rules](../sql-database/sql-database-firewall-configure.md). 
- You can connect to the database server using SQL authentication with your server admin credentials or Azure Active Directory (AAD) authentication with the managed identity for your Azure Data Factory (ADF).  For the latter, you need to add the managed identity for your ADF into an AAD group with access permissions to the database server, see [Create Azure-SSIS IR with AAD authentication](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). 
- Confirm that your Azure SQL Database server does not have an SSIS Catalog (SSISDB database). The provisioning of an Azure-SSIS IR does not support using an existing SSIS Catalog. 

> [!NOTE]
> - For a list of Azure regions in which Data Factory and Azure-SSIS Integration Runtime are currently available, see [ADF + SSIS IR availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-factory&regions=all). 

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers. 
1. Sign in to the [Azure portal](https://portal.azure.com/). 
1. Select **New** on the left menu, select **Data + Analytics**, and then select **Data Factory**. 

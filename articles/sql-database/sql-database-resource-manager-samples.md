---
title: Azure Resource Manager templates for SQL Database | Microsoft Docs
description: Use Azure resource Manager templates to create and configure Azure SQL Database. 
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: overview-samples
ms.devlang: 
ms.topic: sample
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer:
manager: craigg
ms.date: 02/04/2019
---

# Azure Resource Manager templates for Azure SQL Database

Azure Resource Manager templates enable you to define your infrastructure as code and deploy your solutions to Azure cloud.

## Single database & elastic pool

The following table includes links to Azure Resource Manager templates for Azure SQL Database.

| |  |
|---|---|
| [Single database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sql-database-transparent-encryption-create) | This Azure Resource Manager template creates a single Azure SQL Database with logical server and configures firewall rules. |
| [Logical server](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-logical-server) | This Azure Resource Manager template creates a logical server for Azure SQL Database. |
| [Elastic pool](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-elastic-pool-create) | This template allows you to deploy a new SQL Elastic Pool with its new associated SQL Server and new SQL Databases to assign to it. |
| [Import data from blob storage using ADF V2](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-v2-blob-to-sql-copy) | This Azure Resource Manager template creates Azure Data Factory V2 that copies data from Azure Blob Storage to SQL Database.|
| [HDInsight cluster with a SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-linux-with-sql-database) | This template allows you to create a HDInsight cluster, a SQL Database server, a SQL Database, and two tables. This template is used by the Use Sqoop with Hadoop in HDInsight article, https://docs.microsoft.com/en-us/azure/hdinsight/hadoop/hdinsight-use-sqoop |
| [Azure Logic App that runs a SQL Stored Procedure on a schedule](https://github.com/Azure/azure-quickstart-templates/tree/master/101-logic-app-sql-proc) | This template allows you to create a Logic App that will run a SQL stored procedure on schedule. Any arguments for the procedure can be put into the body section of the template.|

## Managed Instance

The following table includes links to Azure Resource Manager templates for Azure SQL Database - Managed Instance.

| |  |
|---|---|
| [Managed Instance in a new VNet](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sqlmi-new-vnet) | This Azure Resource Manager template creates a new configured Azure VNet and Managed Instance in the VNet. |
| [Network environment for Managed Instance](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-managed-instance-azure-environment) | This deployment will create a configured Azure Virtual Network with two subnets - one that will be dedicated to your SQL Managed Instances, and the another one where you can place other resources (for example VMs, App Service environments, etc.). This is a properly configured networking environment where you can deploy Azure SQL Database Managed Instances. |
| [Managed Instance with P2S connection](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sqlmi-new-vnet-w-point-to-site-vpn) | This deployment will create an Azure Virtual Network with two subnets ManagedInstance and GatewaySubnet. Managed Instance will be deployed in ManagedInstance subnet. Virtual network gateway will be created in GatewaySubnet subnet and configured for Point-to-Site VPN conncetions. |
| [Managed Instance with Virtual machine](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sqlmi-new-vnet-w-jumpbox) | This deployment will create an Azure Virtual Network with two subnets ManagedInstance and Management. Managed Instance will be deployed in ManagedInstance subnet. Virtual machine with the latest version of SQL Server Management Studio (SSMS) will be deployed in Management subnet. |


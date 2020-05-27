---
title: Azure Resource Manager templates
titleSuffix: Azure SQL Database & SQL Managed Instance
description: Use Azure Resource Manager templates to create and configure Azure SQL Database and Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: overview-samples sqldbrb=2
ms.devlang: 
ms.topic: sample
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
ms.date: 02/04/2019
---

# Azure Resource Manager templates for Azure SQL Database & SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Azure Resource Manager templates enable you to define your infrastructure as code and deploy your solutions to Azure cloud for your Azure SQL Database and Azure SQL Managed Instance.

## [Azure SQL Database](#tab/single-database)

The following table includes links to Azure Resource Manager templates for Azure SQL Database.

| |  |
|---|---|
| [SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sql-database-transparent-encryption-create) | This Azure Resource Manager template creates a single database in Azure SQL Database and configures server-level IP firewall rules. |
| [Server](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-logical-server) | This Azure Resource Manager template creates a server for Azure SQL Database. |
| [Elastic pool](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-elastic-pool-create) | This template allows you to deploy an elastic pool and to assign databases to it. |
| [Failover groups](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-with-failover-group) | This template creates two servers, a single database, and a failover group in Azure SQL Database.|
| [Threat Detection](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sql-threat-detection-db-policy-multiple-databases) | This template allows you to deploy a server and a set of databases with Threat Detection enabled, with an email address for alerts for each database. Threat Detection is part of the SQL Advanced Threat Protection (ATP) offering and provides a layer of security that responds to potential threats over servers and databases.|
| [Auditing to Azure Blob Storage](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sql-auditing-server-policy-to-blob-storage) | This template allows you to deploy a server with auditing enabled to write audit logs to a blob storage. Auditing for Azure SQL Database tracks database events and writes them to an audit log that can be placed in your Azure storage account, OMS workspace, or Event Hubs.|
| [Auditing to Azure Event Hub](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sql-auditing-server-policy-to-eventhub) | This template allows you to deploy a server with auditing enabled to write audit logs to an existing Event Hub. In order to send audit events to Event Hub, set auditing settings with `Enabled` `State` and set `IsAzureMonitorTargetEnabled` as `true`. Also, configure Diagnostic Settings with `SQLSecurityAuditEvents` log category on the `master` database (for serve level auditing). Auditing tracks database events and writes them to an audit log that can be placed in your Azure storage account, OMS workspace, or Event Hubs.|
| [Azure Web App with SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-sql-database) | This sample creates a free Azure Web App and a database in Azure SQL Database at the "Basic" service level.|
| [Azure Web App and Redis Cache with SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-redis-cache-sql-database) | This template creates a Web App, Redis Cache, and SQL Database in the same resource group, and creates two connection strings in the Web App for the SQL Database and Redis Cache.|
| [Import data from blob storage using ADF V2](https://github.com/Azure/azure-quickstart-templates/tree/master/101-data-factory-v2-blob-to-sql-copy) | This Azure Resource Manager template creates Azure Data Factory V2 that copies data from Azure Blob Storage to SQL Database.|
| [HDInsight cluster with a SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-linux-with-sql-database) | This template allows you to create a HDInsight cluster, a logical SQL server, a database, and two tables. This template is used by the [Use Sqoop with Hadoop in HDInsight article](https://docs.microsoft.com/azure/hdinsight/hadoop/hdinsight-use-sqoop) |
| [Azure Logic App that runs a SQL Stored Procedure on a schedule](https://github.com/Azure/azure-quickstart-templates/tree/master/101-logic-app-sql-proc) | This template allows you to create a Logic App that will run a SQL stored procedure on schedule. Any arguments for the procedure can be put into the body section of the template.|

## [Azure SQL Managed Instance](#tab/managed-instance)

The following table includes links to Azure Resource Manager templates for Azure SQL Managed Instance.

| |  |
|---|---|
| [SQL Managed Instance in a new VNet](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sqlmi-new-vnet) | This Azure Resource Manager template creates a new configured Azure VNet and SQL Managed Instance in the VNet. |
| [Network environment for SQL Managed Instance](https://github.com/Azure/azure-quickstart-templates/tree/master/101-sql-managed-instance-azure-environment) | This deployment will create a configured Azure Virtual Network with two subnets - one that will be dedicated to your SQL Managed Instances, and another one where you can place other resources (for example VMs, App Service environments, etc.). This template will create a properly configured networking environment where you can deploy SQL Managed Instances. |
| [SQL Managed Instance with P2S connection](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sqlmi-new-vnet-w-point-to-site-vpn) | This deployment will create an Azure Virtual Network with two subnets `ManagedInstance` and `GatewaySubnet`. SQL Managed Instance will be deployed in ManagedInstance subnet. Virtual network gateway will be created in `GatewaySubnet` subnet and configured for Point-to-Site VPN connection. |
| [SQL Managed Instance with Virtual machine](https://github.com/Azure/azure-quickstart-templates/tree/master/201-sqlmi-new-vnet-w-jumpbox) | This deployment will create an Azure Virtual Network with two subnets `ManagedInstance` and `Management`. SQL Managed Instance will be deployed in `ManagedInstance` subnet. Virtual machine with the latest version of SQL Server Management Studio (SSMS) will be deployed in `Management` subnet. |

---

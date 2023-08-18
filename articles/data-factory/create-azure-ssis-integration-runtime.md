---
title: Create an Azure-SSIS integration runtime in Azure Data Factory 
description: Learn how to create an Azure-SSIS integration runtime in Azure Data Factory so you can deploy and run SSIS packages in Azure.
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 04/12/2023
author: chugugrace
ms.author: chugu 
ms.custom:
---

# Create an Azure-SSIS integration runtime

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides steps for provisioning an Azure-SQL Server Integration Services (SSIS) integration runtime (IR) in Azure Data Factory (ADF) and Azure Synapse Pipelines. An Azure-SSIS IR supports:

- Running packages deployed into SSIS catalog (SSISDB) hosted by Azure SQL Database server/Managed Instance (Project Deployment Model)
- Running packages deployed into file system, Azure Files, or SQL Server database (MSDB) hosted by Azure SQL Managed Instance (Package Deployment Model)

> [!NOTE] 
> There are certain features that are not available for Azure-SSIS IR in Azure Synapse Analytics, please check the [limitations](https://aka.ms/AAfq9i3).

After an Azure-SSIS IR is provisioned, you can use familiar tools to deploy and run your packages in Azure. These tools are already Azure-enabled and include SQL Server Data Tools (SSDT), SQL Server Management Studio (SSMS), and command-line utilities like [dtutil](/sql/integration-services/dtutil-utility) and [AzureDTExec](./how-to-invoke-ssis-package-azure-enabled-dtexec.md).

The [Provisioning Azure-SSIS IR](./tutorial-deploy-ssis-packages-azure.md) tutorial shows how to create an Azure-SSIS IR via the Azure portal or the Data Factory app. The tutorial also shows how to optionally use an Azure SQL Database server or managed instance to host SSISDB. This article expands on the tutorial and describes how to do these optional tasks:

- Use an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint to host SSISDB. As a prerequisite, you need to configure virtual network permissions and settings for your Azure-SSIS IR to join a virtual network.

- Use Azure Active Directory (Azure AD) authentication with the specified system/user-assigned managed identity for your data factory to connect to an Azure SQL Database server or managed instance. As a prerequisite, you need to add the specified system/user-assigned managed identity for your data factory as a database user who can create an SSISDB instance.

- Join your Azure-SSIS IR to a virtual network, or configure a self-hosted IR as proxy for your Azure-SSIS IR to access data on-premises.

These articles shows how to provision an Azure-SSIS IR by using the [Azure portal](create-azure-ssis-integration-runtime-portal.md), [Azure PowerShell](create-azure-ssis-integration-runtime-powershell.md), and an [Azure Resource Manager template](create-azure-ssis-integration-runtime-resource-manager-template.md).

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

- **Azure subscription**. If you don't already have a subscription, you can create a [free trial](https://azure.microsoft.com/pricing/free-trial/) account.

- **Azure SQL Database server or SQL Managed Instance (optional)**. If you don't already have a database server or managed instance, create one in the Azure portal before you get started. Data Factory will in turn create an SSISDB instance on this database server. 

  We recommend that you create the database server or managed instance in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs into SSISDB without crossing Azure regions.

  Keep these points in mind:

  - The SSISDB instance can be created on your behalf as a single database, as part of an elastic pool, or in a managed instance. It can be accessible in a public network or by joining a virtual network. For guidance in choosing between SQL Database and SQL Managed Instance to host SSISDB, see the [Compare SQL Database and SQL Managed Instance](#comparison-of-sql-database-and-sql-managed-instance) section in this article. 
  
    If you use an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a SQL managed instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR, you need to join your Azure-SSIS IR to a virtual network. For more information, see [Join an Azure-SSIS IR to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md).

  - Confirm that the **Allow access to Azure services** setting is enabled for the database server. This setting is not applicable when you use an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a SQL managed instance with private endpoint to host SSISDB. For more information, see [Secure Azure SQL Database](/azure/azure-sql/database/secure-database-tutorial#create-firewall-rules). To enable this setting by using PowerShell, see [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule).

  - Add the IP address of the client machine, or a range of IP addresses that includes the IP address of the client machine, to the client IP address list in the firewall settings for the database server. For more information, see [Azure SQL Database server-level and database-level firewall rules](/azure/azure-sql/database/firewall-configure).

  - You can connect to the database server by using SQL authentication with your server admin credentials, or by using Azure AD authentication with the specified system/user-assigned managed identity for your data factory. For the latter, you need to add the specified system/user-assigned managed identity for your data factory into an Azure AD group with access permissions to the database server. For more information, see [Enable Azure AD authentication for an Azure-SSIS IR](./enable-aad-authentication-azure-ssis-ir.md).

  - Confirm that your database server does not have an SSISDB instance already. The provisioning of an Azure-SSIS IR does not support using an existing SSISDB instance.

- **Azure Resource Manager virtual network (optional)**. You must have an Azure Resource Manager virtual network if at least one of the following conditions is true:

  - You're hosting SSISDB on an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint.

  - You want to connect to on-premises data stores from SSIS packages running on your Azure-SSIS IR without configuring a self-hosted IR.

- **Azure PowerShell (optional)**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell), if you want to run a PowerShell script to provision your Azure-SSIS IR.

### Regional support

For a list of Azure regions in which Data Factory and an Azure-SSIS IR are available, see [Data Factory and SSIS IR availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-factory&regions=all).

### Comparison of SQL Database and SQL Managed Instance

The following table compares certain features of an Azure SQL Database server and SQL Managed Instance as they relate to Azure-SSIR IR:

| Feature | SQL Database| SQL Managed instance |
|---------|--------------|------------------|
| **Scheduling** | The SQL Server Agent is not available.<br/><br/>See [Schedule a package execution in a Data Factory pipeline](/sql/integration-services/lift-shift/ssis-azure-schedule-packages#activity).| The Managed Instance Agent is available. |
| **Authentication** | You can create an SSISDB instance with a contained database user who represents any Azure AD group with the managed identity of your data factory as a member in the **db_owner** role.<br/><br/>See [Enable Azure AD authentication to create an SSISDB in Azure SQL Database server](enable-aad-authentication-azure-ssis-ir.md#enable-azure-ad-authentication-on-azure-sql-database). | You can create an SSISDB instance with a contained database user who represents the managed identity of your data factory. <br/><br/>See [Enable Azure AD authentication to create an SSISDB in Azure SQL Managed Instance](enable-aad-authentication-azure-ssis-ir.md#enable-azure-ad-authentication-on-azure-sql-managed-instance). |
| **Service tier** | When you create an Azure-SSIS IR with your Azure SQL Database server, you can select the service tier for SSISDB. There are multiple service tiers. | When you create an Azure-SSIS IR with your managed instance, you can't select the service tier for SSISDB. All databases in your managed instance share the same resource allocated to that instance. |
| **Virtual network** | Your Azure-SSIS IR can join an Azure Resource Manager virtual network if you use an Azure SQL Database server with IP firewall rules/virtual network service endpoints. | Your Azure-SSIS IR can join an Azure Resource Manager virtual network if you use a managed instance with private endpoint. The virtual network is required when you don't enable a public endpoint for your managed instance.<br/><br/>If you join your Azure-SSIS IR to the same virtual network as your managed instance, make sure that your Azure-SSIS IR is in a different subnet from your managed instance. If you join your Azure-SSIS IR to a different virtual network from your managed instance, we recommend either a virtual network peering or a network-to-network connection. See [Connect your application to an Azure SQL Database Managed Instance](/azure/azure-sql/managed-instance/connect-application-instance). |
| **Distributed transactions** | This feature is supported through elastic transactions. Microsoft Distributed Transaction Coordinator (MSDTC) transactions are not supported. If your SSIS packages use MSDTC to coordinate distributed transactions, consider migrating to elastic transactions for Azure SQL Database. For more information, see [Distributed transactions across cloud databases](/azure/azure-sql/database/elastic-transactions-overview). | Not supported. |
| | | |


## Next steps

- [Learn how to provision an Azure-SSIS IR using the Azure portal](create-azure-ssis-integration-runtime-portal.md).
- [Learn how to provision an Azure-SSIS IR using Azure PowerShell](create-azure-ssis-integration-runtime-powershell.md).
- [Learn how to provision an Azure-SSIS IR using an Azure Resource Manager template](create-azure-ssis-integration-runtime-resource-manager-template.md).
- [Deploy and run your SSIS packages in Azure Data Factory](create-azure-ssis-integration-runtime-deploy-packages.md).

See other Azure-SSIS IR topics in this documentation:

- [Azure-SSIS integration runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides information about integration runtimes in general, including Azure-SSIS IR.
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
- [Deploy, run, and monitor SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 
- [Schedule package executions in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)

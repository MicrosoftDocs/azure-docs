---
title: Provision the Azure-SSIS integration runtime 
description: Learn how to provision the Azure-SSIS integration runtime in Azure Data Factory so you can deploy and run SSIS packages in Azure.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: tutorial
ms.custom: seo-lt-2019
ms.date: 12/23/2019
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: mflasko
---

# Provision the Azure-SSIS integration runtime in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This tutorial provides steps for using the Azure portal to provision an Azure-SQL Server Integration Services (SSIS) integration runtime (IR) in Azure Data Factory. An Azure-SSIS IR supports:

- Running packages deployed into the SSIS catalog (SSISDB) hosted by an Azure SQL Database server or a managed instance (Project Deployment Model).
- Running packages deployed into file systems, file shares, or Azure Files (Package Deployment Model). 

After an Azure-SSIS IR is provisioned, you can use familiar tools to deploy and run your packages in Azure. These tools include SQL Server Data Tools (SSDT), SQL Server Management Studio (SSMS), and command-line tools like `dtinstall`, `dtutil`, and `dtexec`.

For conceptual information on Azure-SSIS IRs, see [Azure-SSIS integration runtime overview](concepts-integration-runtime.md#azure-ssis-integration-runtime).

In this tutorial, you complete the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Provision an Azure-SSIS integration runtime.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

- **Azure subscription**. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- **Azure SQL Database server (optional)**. If you don't already have a database server, create one in the Azure portal before you get started. Data Factory will in turn create an SSISDB instance on this database server. 

  We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs into SSISDB without crossing Azure regions.

  Keep these points in mind:

  - Based on the selected database server, the SSISDB instance can be created on your behalf as a single database, as part of an elastic pool, or in a managed instance. It can be accessible in a public network or by joining a virtual network. For guidance in choosing the type of database server to host SSISDB, see [Compare an Azure SQL Database single database, elastic pool, and managed instance](../data-factory/create-azure-ssis-integration-runtime.md#comparison-of-a-sql-database-single-database-elastic-pool-and-managed-instance). 
  
    If you use an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR, you need to join your Azure-SSIS IR to a virtual network. For more information, see [Create an Azure-SSIS IR in a virtual network](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime).

  - Confirm that the **Allow access to Azure services** setting is enabled for the database server. This setting is not applicable when you use an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint to host SSISDB. For more information, see [Secure your Azure SQL database](../sql-database/sql-database-security-tutorial.md#create-firewall-rules). To enable this setting by using PowerShell, see [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule).

  - Add the IP address of the client machine, or a range of IP addresses that includes the IP address of the client machine, to the client IP address list in the firewall settings for the database server. For more information, see [Azure SQL Database server-level and database-level firewall rules](../sql-database/sql-database-firewall-configure.md).

  - You can connect to the database server by using SQL authentication with your server admin credentials, or by using Azure AD authentication with the managed identity for your data factory. For the latter, you need to add the managed identity for your data factory into an Azure AD group with access permissions to the database server. For more information, see [Create an Azure-SSIS IR with Azure AD authentication](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime).

  - Confirm that your database server does not have an SSISDB instance already. The provisioning of an Azure-SSIS IR does not support using an existing SSISDB instance.


> [!NOTE]
> For a list of Azure regions in which Data Factory and an Azure-SSIS IR are currently available, see [Data Factory and SSIS IR availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=data-factory&regions=all). 

## Create a data factory

To create your data factory via the Azure portal, follow the step-by-step instructions in [Create a data factory via the UI](https://docs.microsoft.com/azure/data-factory/quickstart-create-data-factory-portal#create-a-data-factory). Select **Pin to dashboard** while doing so, to allow quick access after its creation. 

After your data factory is created, open its overview page in the Azure portal. Select the **Author & Monitor** tile to open the **Let's get started** page on a separate tab. There, you can continue to create your Azure-SSIS IR.

## Create an Azure-SSIS integration runtime

### From the Data Factory overview

1. On the **Let's get started** page, select the **Configure SSIS Integration Runtime** tile. 

   !["Configure SSIS Integration Runtime" tile](./media/tutorial-create-azure-ssis-runtime-portal/configure-ssis-integration-runtime-tile.png)

1. For the remaining steps to set up an Azure-SSIS IR, see the [Provision an Azure-SSIS integration runtime](#provision-an-azure-ssis-integration-runtime) section. 

### From the authoring UI

1. In the Azure Data Factory UI, switch to the **Edit** tab and select **Connections**. Then switch to the **Integration Runtimes** tab to view existing integration runtimes in your data factory. 

   ![Selections for viewing existing IRs](./media/tutorial-create-azure-ssis-runtime-portal/view-azure-ssis-integration-runtimes.png)

1. Select **New** to create an Azure-SSIS IR. 

   ![Integration runtime via menu](./media/tutorial-create-azure-ssis-runtime-portal/edit-connections-new-integration-runtime-button.png)

1. In the **Integration Runtime Setup** panel, select the **Lift-and-shift existing SSIS packages to execute in Azure** tile, and then select **Next**. 

   ![Specify the type of integration runtime](./media/tutorial-create-azure-ssis-runtime-portal/integration-runtime-setup-options.png)

1. For the remaining steps to set up an Azure-SSIS IR, see the [Provision an Azure-SSIS integration runtime](#provision-an-azure-ssis-integration-runtime) section. 

## Provision an Azure-SSIS integration runtime

1. On the **General Settings** section of **Integration Runtime Setup** panel, complete the following steps. 

   ![General settings](./media/tutorial-create-azure-ssis-runtime-portal/general-settings.png)

   1. For **Name**, enter the name of your integration runtime. 

   1. For **Description**, enter the description of your integration runtime. 

   1. For **Location**, select the location of your integration runtime. Only supported locations are displayed. We recommend that you select the same location of your database server to host SSISDB. 

   1. For **Node Size**, select the size of node in your integration runtime cluster. Only supported node sizes are displayed. Select a large node size (scale up) if you want to run many compute-intensive or memory-intensive packages. 

   1. For **Node Number**, select the number of nodes in your integration runtime cluster. Only supported node numbers are displayed. Select a large cluster with many nodes (scale out) if you want to run many packages in parallel. 

   1. For **Edition/License**, select the SQL Server edition for your integration runtime: Standard or Enterprise. Select Enterprise if you want to use advanced features on your integration runtime. 

   1. For **Save Money**, select the Azure Hybrid Benefit option for your integration runtime: **Yes** or **No**. Select **Yes** if you want to bring your own SQL Server license with Software Assurance to benefit from cost savings with hybrid use. 

   1. Select **Next**. 

1. On the **SQL Settings** section, complete the following steps. 

   ![SQL settings](./media/tutorial-create-azure-ssis-runtime-portal/sql-settings.png)

   1. Select the **Create SSIS catalog (SSISDB) hosted by Azure SQL Database server/Managed Instance to store your projects/packages/environments/execution logs** check box to choose the deployment model for packages to run on your Azure-SSIS IR. You'll choose either the Project Deployment Model where packages are deployed into SSISDB hosted by your database server, or the Package Deployment Model where packages are deployed into file systems, file shares, or Azure Files.
   
      If you select the check box, you'll need to bring your own database server to host SSISDB that we'll create and manage on your behalf.
   
      1. For **Subscription**, select the Azure subscription that has your database server to host SSISDB. 

      1. For **Location**, select the location of your database server to host SSISDB. We recommend that you select the same location of your integration runtime.

      1. For **Catalog Database Server Endpoint**, select the endpoint of your database server to host SSISDB. 
   
         Based on the selected database server, the SSISDB instance can be created on your behalf as a single database, as part of an elastic pool, or in a managed instance. It can be accessible in a public network or by joining a virtual network. For guidance in choosing the type of database server to host SSISDB, see [Compare an Azure SQL Database single database, elastic pool, and managed instance](../data-factory/create-azure-ssis-integration-runtime.md#comparison-of-a-sql-database-single-database-elastic-pool-and-managed-instance).   

         If you select an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR, you need to join your Azure-SSIS IR to a virtual network. For more information, see [Create an Azure-SSIS IR in a virtual network](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime).

      1. Select the **Use AAD authentication with the managed identity for your ADF** check box to choose the authentication method for your database server to host SSISDB. You'll choose either SQL authentication or Azure AD authentication with the managed identity for your data factory.

         If you select the check box, you'll need to add the managed identity for your data factory into an Azure AD group with access permissions to your database server. For more information, see [Create an Azure-SSIS IR with Azure AD authentication](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime).
   
      1. For **Admin Username**, enter the SQL authentication username for your database server to host SSISDB. 

      1. For **Admin Password**, enter the SQL authentication password for your database server to host SSISDB. 

      1. For **Catalog Database Service Tier**, select the service tier for your database server to host SSISDB. Select the Basic, Standard, or Premium tier, or select an elastic pool name.

      1. Select **Test Connection**. If the test is successful, select **Next**. 

1. On the **Advanced Settings** section, complete the following steps. 

   ![Advanced settings](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings.png)

   1. For **Maximum Parallel Executions Per Node**, select the maximum number of packages to run concurrently per node in your integration runtime cluster. Only supported package numbers are displayed. Select a low number if you want to use more than one core to run a single large package that's compute or memory intensive. Select a high number if you want to run one or more small packages in a single core. 

   1. Select the **Customize your Azure-SSIS Integration Runtime with additional system configurations/component installations** check box to choose whether you want to add standard/express custom setups on your Azure-SSIS IR. For more information, see [Custom setup for an Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup).
   
   1. Select the **Select a VNet for your Azure-SSIS Integration Runtime to join, allow ADF to create certain network resources, and optionally bring your own static public IP addresses** check box to choose whether you want to join your Azure-SSIS IR to a virtual network.

      Select it if you use an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR. For more information, see [Create an Azure-SSIS IR in a virtual network](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). 
   
   1. Select the **Set up Self-Hosted Integration Runtime as a proxy for your Azure-SSIS Integration Runtime** check box to choose whether you want to configure a self-hosted IR as proxy for your Azure-SSIS IR. For more information, see [Set up a self-hosted IR as proxy](https://docs.microsoft.com/azure/data-factory/self-hosted-integration-runtime-proxy-ssis).   

   1. Select **Continue**. 

1. On the **Summary** section, review all provisioning settings, bookmark the recommended documentation links, and select **Finish** to start the creation of your integration runtime. 

   > [!NOTE]
   > Excluding any custom setup time, this process should finish within 5 minutes.
   >
   > If you use SSISDB, the Data Factory service will connect to your database server to prepare SSISDB. 
   > 
   > When you provision an Azure-SSIS IR, Access Redistributable and Azure Feature Pack for SSIS are also installed. These components provide connectivity to Excel files, Access files, and various Azure data sources, in addition to the data sources that built-in components already support. For information about other components that you can install, see [Custom setup for an Azure-SSIS IR](how-to-configure-azure-ssis-ir-custom-setup.md).

1. On the **Connections** tab, switch to **Integration Runtimes** if needed. Select **Refresh** to refresh the status. 

   ![Creation status, with "Refresh" button](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-creation-status.png)

1. Use the links in the **Actions** column to stop/start, edit, or delete the integration runtime. Use the last link to view JSON code for the integration runtime. The edit and delete buttons are enabled only when the IR is stopped. 

   ![Links in the "Actions" column](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-actions.png) 

## Deploy SSIS packages

If you use SSISDB, you can deploy your packages into it and run them on the Azure-SSIS IR by using SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) tools. These tools connect to your database server via its server endpoint: 

- For an Azure SQL Database server, the server endpoint format is `<server name>.database.windows.net`.
- For a managed instance with private endpoint, the server endpoint format is `<server name>.<dns prefix>.database.windows.net`.
- For a managed instance with public endpoint, the server endpoint format is `<server name>.public.<dns prefix>.database.windows.net,3342`. 

If you don't use SSISDB, you can deploy your packages into file systems, file shares, or Azure Files and run them on the Azure-SSIS IR by using the `dtinstall`, `dtutil`, and `dtexec` command-line tools. For more information, see [Deploy SSIS packages](/sql/integration-services/packages/deploy-integration-services-ssis-projects-and-packages#deploy-packages-to-integration-services-server). 

In both cases, you can also run your deployed packages on Azure-SSIS IR by using the Execute SSIS Package activity in Data Factory pipelines. For more information, see [Invoke SSIS package execution as a first-class Data Factory activity](https://docs.microsoft.com/azure/data-factory/how-to-invoke-ssis-package-ssis-activity).

See also the following SSIS documentation: 

- [Deploy, run, and monitor SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial) 
- [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database) 
- [Schedule package executions in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages) 
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 

## Next steps

To learn about customizing your Azure-SSIS integration runtime, advance to the following article: 

> [!div class="nextstepaction"]
> [Customize an Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup)
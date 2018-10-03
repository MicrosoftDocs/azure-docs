---
title: Provision the Azure-SSIS Integration Runtime | Microsoft Docs
description: Learn how to provision the Azure-SSIS integration runtime in Azure Data Factory so you can deploy and run SSIS packages in Azure.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: tutorial
ms.date: 09/23/2018
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: craigg
---

# Provision the Azure-SSIS Integration Runtime in Azure Data Factory
This tutorial provides steps for using the Azure portal to provision an Azure-SSIS integration runtime (IR) in Azure Data Factory. Then, you can use SQL Server Data Tools or SQL Server Management Studio to deploy and run SQL Server Integration Services (SSIS) packages in this runtime in Azure. For conceptual information on Azure-SSIS IRs, see [Azure-SSIS integration runtime overview](concepts-integration-runtime.md#azure-ssis-integration-runtime).

In this tutorial, you complete the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Provision an Azure-SSIS integration runtime.

## Prerequisites
- **Azure subscription**. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 
- **Azure SQL Database server**. If you don't already have a database server, create one in the Azure portal before you get started. Azure Data Factory creates the SSIS Catalog (SSISDB database) on this database server. We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to the SSISDB database without crossing Azure regions. 
- Based on the selected database server, SSISDB can be created on your behalf as a single database, part of an elastic pool, or in a Managed Instance and accessible in public network or by joining a virtual network. If you use Azure SQL Database with virtual network service endpoints/Managed Instance to host SSISDB or require access to on-premises data, you need to join your Azure-SSIS IR to a virtual network, see [Create Azure-SSIS IR in a virtual network](https://docs.microsoft.com/en-us/azure/data-factory/create-azure-ssis-integration-runtime). 
- Confirm that the **Allow access to Azure services** setting is enabled for the database server. This is not applicable when you use Azure SQL Database with virtual network service endpoints/Managed Instance to host SSISDB. For more information, see [Secure your Azure SQL database](../sql-database/sql-database-security-tutorial.md#create-a-server-level-firewall-rule-in-the-azure-portal). To enable this setting by using PowerShell, see [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule?view=azurermps-4.4.1). 
- Add the IP address of the client machine, or a range of IP addresses that includes the IP address of client machine, to the client IP address list in the firewall settings for the database server. For more information, see [Azure SQL Database server-level and database-level firewall rules](../sql-database/sql-database-firewall-configure.md). 
- You can connect to the database server using SQL authentication with your server admin credentials or Azure Active Directory (AAD) authentication with your Azure Data Factory (ADF) managed identity for Azure resources.  For the latter, you need to add your ADF MSI into an AAD group with access permissions to the database server, see [Create Azure-SSIS IR with AAD authentication](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). 
- Confirm that your Azure SQL Database server does not have an SSIS Catalog (SSISDB database). The provisioning of an Azure-SSIS IR does not support using an existing SSIS Catalog. 

> [!NOTE]
> - For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). 
> - For a list of Azure regions in which the Azure-SSIS Integration Runtime is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **SSIS Integration Runtime**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). 

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers. 
1. Sign in to the [Azure portal](https://portal.azure.com/). 
1. Select **New** on the left menu, select **Data + Analytics**, and then select **Data Factory**. 

   ![Data Factory selection in the "New" pane](./media/tutorial-create-azure-ssis-runtime-portal/new-data-factory-menu.png)

1. On the **New data factory** page, enter **MyAzureSsisDataFactory** under **Name**. 

   !["New data factory" page](./media/tutorial-create-azure-ssis-runtime-portal/new-azure-data-factory.png)

   The name of the Azure data factory must be *globally unique*. If you receive the following error, change the name of the data factory (for example, **&lt;yourname&gt;MyAzureSsisDataFactory**) and try creating again. For naming rules for Data Factory artifacts, see the [Data Factory - naming rules](naming-rules.md) article. 

   `Data factory name “MyAzureSsisDataFactory” is not available`

1. For **Subscription**, select your Azure subscription in which you want to create the data factory. 
1. For **Resource Group**, do one of the following steps: 

   - Select **Use existing**, and select an existing resource group from the list. 
   - Select **Create new**, and enter the name of a resource group. 

   To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md). 
1. For **Version**, select **V2 (Preview)**. 
1. For **Location**, select the location for the data factory. The list shows only locations that are supported for the creation of data factories. 
1. Select **Pin to dashboard**. 
1. Select **Create**. 
1. On the dashboard, you see the following tile with the status **Deploying data factory**: 

   !["Deploying Data Factory" tile](media/tutorial-create-azure-ssis-runtime-portal/deploying-data-factory.png)

1. After the creation is complete, you see the **Data factory** page. 

   ![Home page for the data factory](./media/tutorial-create-azure-ssis-runtime-portal/data-factory-home-page.png)

1. Select **Author & Monitor** to open the Data Factory user interface (UI) on a separate tab. 

## Provision an Azure-SSIS integration runtime

1. On the **Let's get started** page, select the **Configure SSIS Integration Runtime** tile. 

   !["Configure SSIS Integration Runtime" tile](./media/tutorial-create-azure-ssis-runtime-portal/configure-ssis-integration-runtime-tile.png)

1. On the **General Settings** page of **Integration Runtime Setup**, complete the following steps: 

   ![General settings](./media/tutorial-create-azure-ssis-runtime-portal/general-settings.png)

   a. For **Name**, enter the name of your integration runtime. 

   b. For **Description**, enter the description of your integration runtime. 

   c. For **Location**, select the location of your integration runtime. Only supported locations are displayed. We recommend that you select the same location of your database server to host SSISDB. 

   d. For **Node Size**, select the size of node in your integration runtime cluster. Only supported node sizes are displayed. Select a large node size (scale up), if you want to run many compute/memory –intensive packages. 

   e. For **Node Number**, select the number of nodes in your integration runtime cluster. Only supported node numbers are displayed. Select a large cluster with many nodes (scale out), if you want to run many packages in parallel. 

   f. For **Edition/License**, select SQL Server edition/license for your integration runtime: Standard or Enterprise. Select Enterprise, if you want to use advanced/premium features on your integration runtime. 

   g. For **Save Money**, select Azure Hybrid Benefit (AHB) option for your integration runtime: Yes or No. Select Yes, if you want to bring your own SQL Server license with Software Assurance to benefit from cost savings with hybrid use. 

   h. Click **Next**. 

1. On the **SQL Settings** page, complete the following steps: 

   ![SQL settings](./media/tutorial-create-azure-ssis-runtime-portal/sql-settings.png)

   a. For **Subscription**, select the Azure subscription that has your database server to host SSISDB. 

   b. For **Location**, select the location of your database server to host SSISDB. We recommend that you select the same location of your integration runtime. 

   c. For **Catalog Database Server Endpoint**, select the endpoint of your database server to host SSISDB. Based on the selected database server, SSISDB can be created on your behalf as a standalone database, part of an elastic pool, or in a Managed Instance and accessible in public network or by joining a virtual network. For guidance in choosing the type of database server to host SSISDB, see [Compare SQL Database logical server and Managed Instance](../data-factory/create-azure-ssis-integration-runtime.md#compare-sql-database-logical-server-and-sql-database-managed-instance). If you select Azure SQL Database with virtual network service endpoints/Managed Instance to host SSISDB or require access to on-premises data, you need to join your Azure-SSIS IR to a virtual network. See [Create Azure-SSIS IR in a virtual network](https://docs.microsoft.com/en-us/azure/data-factory/create-azure-ssis-integration-runtime). 

   d. On **Use AAD authentication...** checkbox, select the authentication method for your database server to host SSISDB: SQL or Azure Active Directory (AAD) with your Azure Data Factory (ADF) managed identity for Azure resources. If you check it, you need to add your ADF MSI into an AAD group with access permissions to the database server, see [Create Azure-SSIS IR with AAD authentication](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). 

   e. For **Admin Username**, enter SQL authentication username for your database server to host SSISDB. 

   f. For **Admin Password**, enter SQL authentication password for your database server to host SSISDB. 

   g. For **Catalog Database Service Tier**, select the service tier for your database server to host SSISDB: Basic/Standard/Premium tier or elastic pool name. 

   h. Click **Test Connection** and if successful, click **Next**. 

1. On the **Advanced Settings** page, complete the following steps: 

   ![Advanced settings](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings.png)

   a. For **Maximum Parallel Executions Per Node**, select the maximum number of packages to execute concurrently per node in your integration runtime cluster. Only supported package numbers are displayed. Select a low number, if you want to use more than one cores to run a single large/heavy-weight package that is compute/memory -intensive. Select a high number, if you want to run one or more small/light-weight packages in a single core. 

   b. For **Custom Setup Container SAS URI**, optionally enter Shared Access Signature (SAS) Uniform Resource Identifier (URI) of your Azure Storage Blob container where your setup script and its associated files are stored, see [Custom setup for Azure-SSIS IR](https://docs.microsoft.com/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup). 

   c. On **Select a VNet...** checkbox, select whether you want to join your integration runtime to a virtual network. You should check it if you use Azure SQL Database with virtual network service endpoints/Managed Instance to host SSISDB or require access to on-premises data, see [Create Azure-SSIS IR in a virtual network](https://docs.microsoft.com/en-us/azure/data-factory/create-azure-ssis-integration-runtime). 

1. Click **Finish** to start the creation of your integration runtime. 

   > [!IMPORTANT]
   > This process takes approximately 20 to 30 minutes to complete.
   >
   > The Data Factory service connects to your Azure SQL Database server to prepare the SSIS Catalog (SSISDB database). 
   > 
   > When you provision an instance of an Azure-SSIS IR, the Azure Feature Pack for SSIS and the Access Redistributable are also installed. These components provide connectivity to Excel and Access files and to various Azure data sources, in addition to the data sources supported by the built-in components. You can also install additional components. For more info, see [Custom setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md). 

1. On the **Connections** tab, switch to **Integration Runtimes** if needed. Select **Refresh** to refresh the status. 

   ![Creation status, with "Refresh" button](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-creation-status.png)

1. Use the links in the **Actions** column to stop/start, edit, or delete the integration runtime. Use the last link to view JSON code for the integration runtime. The edit and delete buttons are enabled only when the IR is stopped. 

   ![Links in the "Actions" column](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-actions.png) 

## Create an Azure-SSIS integration runtime

1. In the Azure Data Factory UI, switch to the **Edit** tab, select **Connections**, and then switch to the **Integration Runtimes** tab to view existing integration runtimes in your data factory. 

   ![Selections for viewing existing IRs](./media/tutorial-create-azure-ssis-runtime-portal/view-azure-ssis-integration-runtimes.png)

1. Select **New** to create an Azure-SSIS IR. 

   ![Integration runtime via menu](./media/tutorial-create-azure-ssis-runtime-portal/edit-connections-new-integration-runtime-button.png)

1. In the **Integration Runtime Setup** window, select **Lift-and-shift existing SSIS packages to execute in Azure**, and then select **Next**. 

   ![Specify the type of integration runtime](./media/tutorial-create-azure-ssis-runtime-portal/integration-runtime-setup-options.png)

1. For the remaining steps to set up an Azure-SSIS IR, see the [Provision an Azure-SSIS integration runtime](#provision-an-azure-ssis-integration-runtime) section. 

## Deploy SSIS packages
Now, use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy your SSIS packages to Azure. Connect to your Azure SQL Database server that hosts the SSIS Catalog (SSISDB database). The name of Azure SQL Database server is in the format `<servername>.database.windows.net`. 

See the following articles from the SSIS documentation: 

- [Deploy, run, and monitor an SSIS package on Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial) 
- [Connect to the SSIS Catalog on Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database) 
- [Schedule package execution on Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages) 
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 

## Next steps
In this tutorial, you learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Provision an Azure-SSIS integration runtime.

To learn about copying data from on-premises to the cloud, advance to the following tutorial: 

> [!div class="nextstepaction"]
> [Copy data in the cloud](tutorial-copy-data-portal.md)

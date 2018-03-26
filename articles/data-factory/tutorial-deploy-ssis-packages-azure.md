---
title: 'Deploy SSIS packages to Azure | Microsoft Docs'
description: 'This article explains how to deploy SSIS packages to Azure and create an Azure-SSIS integration runtime by using Azure Data Factory.'
services: data-factory
documentationcenter: ''
author: douglaslMS
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: hero-article
ms.date: 01/29/2018
ms.author: douglasl
---

# Deploy SQL Server Integration Services packages to Azure
This tutorial provides steps for using the Azure portal to provision an Azure-SSIS integration runtime (IR) in Azure Data Factory. Then, you can use SQL Server Data Tools or SQL Server Management Studio to deploy SQL Server Integration Services (SSIS) packages to this runtime on Azure. For conceptual information on Azure-SSIS IRs, see [Azure-SSIS integration runtime overview](concepts-integration-runtime.md#azure-ssis-integration-runtime).

In this tutorial, you complete the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Provision an Azure-SSIS integration runtime.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is in general availability (GA), see the [documentation for Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


## Prerequisites
- **Azure subscription**. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 
- **Azure SQL Database server**. If you don't already have a database server, create one in the Azure portal before you get started. Azure Data Factory creates the SSIS Catalog (SSISDB database) on this database server. We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to the SSISDB database without crossing Azure regions. 
- Confirm that the **Allow access to Azure services** setting is enabled for the database server. For more information, see [Secure your Azure SQL database](../sql-database/sql-database-security-tutorial.md#create-a-server-level-firewall-rule-in-the-azure-portal). To enable this setting by using PowerShell, see [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule?view=azurermps-4.4.1).
- Add the IP address of the client machine, or a range of IP addresses that includes the IP address of client machine, to the client IP address list in the firewall settings for the database server. For more information, see [Azure SQL Database server-level and database-level firewall rules](../sql-database/sql-database-firewall-configure.md).
- Confirm that your Azure SQL Database server does not have an SSIS Catalog (SSISDB database). The provisioning of an Azure-SSIS IR does not support using an existing SSIS Catalog.

> [!NOTE]
> - You can create a data factory of version 2 in the following regions: East US, East US 2, Southeast Asia, and West Europe. 
> - You can create an Azure-SSIS IR in the following regions: East US, East US 2, Central US, North Europe, West Europe, and Australia East. 

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
2. Sign in to the [Azure portal](https://portal.azure.com/).    
3. Select **New** on the left menu, select **Data + Analytics**, and then select **Data Factory**. 
   
   ![Data Factory selection in the "New" pane](./media/tutorial-create-azure-ssis-runtime-portal/new-data-factory-menu.png)
3. On the **New data factory** page, enter **MyAzureSsisDataFactory** under **Name**. 
      
   !["New data factory" page](./media/tutorial-create-azure-ssis-runtime-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be *globally unique*. If you receive the following error, change the name of the data factory (for example, **&lt;yourname&gt;MyAzureSsisDataFactory**) and try creating again. For naming rules for Data Factory artifacts, see the [Data Factory - naming rules](naming-rules.md) article.
  
   `Data factory name “MyAzureSsisDataFactory” is not available`
4. For **Subscription**, select your Azure subscription in which you want to create the data factory. 
5. For **Resource Group**, do one of the following steps:
     
   - Select **Use existing**, and select an existing resource group from the list. 
   - Select **Create new**, and enter the name of a resource group.   
         
   To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
6. For **Version**, select **V2 (Preview)**.
7. For **Location**, select the location for the data factory. The list shows only locations that are supported for the creation of data factories.
8. Select **Pin to dashboard**.     
9. Select **Create**.
10. On the dashboard, you see the following tile with the status **Deploying data factory**: 

   !["Deploying Data Factory" tile](media/tutorial-create-azure-ssis-runtime-portal/deploying-data-factory.png)
11. After the creation is complete, you see the **Data factory** page.
   
   ![Home page for the data factory](./media/tutorial-create-azure-ssis-runtime-portal/data-factory-home-page.png)
12. Select **Author & Monitor** to open the Data Factory user interface (UI) on a separate tab. 

## Provision an Azure-SSIS integration runtime

1. On the **Let's get started** page, select the **Configure SSIS Integration Runtime** tile. 

   !["Configure SSIS Integration Runtime" tile](./media/tutorial-create-azure-ssis-runtime-portal/configure-ssis-integration-runtime-tile.png)
2. On the **General Settings** page of **Integration Runtime Setup**, complete the following steps: 

   ![General settings](./media/tutorial-create-azure-ssis-runtime-portal/general-settings.png)

   a. For **Name**, specify a name for the integration runtime.

   b. For **Location**, select the location for the integration runtime. Only supported locations are displayed.

   c. For **Node Size**, select the size of the node that will be configured with the SSIS runtime.

   d. For **Node Number**, specify the number of nodes in the cluster.
   
   e. Select **Next**. 
3. On the **SQL Settings** page, complete the following steps: 

   ![SQL settings](./media/tutorial-create-azure-ssis-runtime-portal/sql-settings.png)

   a. For **Subscription**, specify the Azure subscription that has the Azure database server.

   b. For **Catalog Database Server Endpoint**, select your Azure database server.

   c. For **Admin Username**, enter the administrator username.

   d. For **Admin Password**, enter the password for the administrator.

   e. For **Catalog Database Server Tier**, select the service tier for the SSISDB database. The default value is **Basic**.

   f. Select **Next**. 
4. On the **Advanced Settings** page, select a value for **Maximum Parallel Executions Per Node**.   

   ![Advanced settings](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings.png)    
5. This step is *optional*. If you have a virtual network (created through the classic deployment model or created through Azure Resource Manager) that you want the integration runtime to join, select the **Select a VNet for your Azure-SSIS integration runtime to join and allow Azure services to configure VNet permissions/settings** check box. Then complete the following steps: 

   ![Advanced settings with a virtual network](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet.png)    

   a. For **Subscription**, specify the subscription that has the virtual network.

   b. For **VNet Name**, select the name of the virtual network.

   c. For **Subnet Name**, select the name of the subnet in the virtual network. 
6. Select **Finish** to start the creation of the Azure-SSIS integration runtime. 

   > [!IMPORTANT]
   > This process takes approximately 20 to minutes to complete.
   >
   > The Data Factory service connects to your Azure SQL database to prepare the SSIS Catalog (SSISDB database). The script also configures permissions and settings for your virtual network, if specified. And it joins the new instance of the Azure-SSIS integration runtime to the virtual network.
   > 
   > When you provision an instance of an Azure-SSIS IR, the Azure Feature Pack for SSIS and the Access Redistributable are also installed. These components provide connectivity to Excel and Access files and to various Azure data sources, in addition to the data sources supported by the built-in components. You can't install third-party components for SSIS at this time. (This restriction includes third-party components from Microsoft, such as the Oracle and Teradata components by Attunity and the SAP BI components).

7. On the **Connections** tab, switch to **Integration Runtimes** if needed. Select **Refresh** to refresh the status. 

   ![Creation status, with "Refresh" button](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-creation-status.png)
8. Use the links in the **Actions** column to stop/start, edit, or delete the integration runtime. Use the last link to view JSON code for the integration runtime. The edit and delete buttons are enabled only when the IR is stopped. 

   ![Links in the "Actions" column](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-actions.png)        

## Create an Azure-SSIS integration runtime

1. In the Azure Data Factory UI, switch to the **Edit** tab, select **Connections**, and then switch to the **Integration Runtimes** tab to view existing integration runtimes in your data factory. 
   ![Selections for viewing existing IRs](./media/tutorial-create-azure-ssis-runtime-portal/view-azure-ssis-integration-runtimes.png)
2. Select **New** to create an Azure-SSIS IR. 

   ![Integration runtime via menu](./media/tutorial-create-azure-ssis-runtime-portal/edit-connections-new-integration-runtime-button.png)
3. In the **Integration Runtime Setup** window, select **Lift-and-shift existing SSIS packages to execute in Azure**, and then select **Next**.

   ![Specify the type of integration runtime](./media/tutorial-create-azure-ssis-runtime-portal/integration-runtime-setup-options.png)
4. For the remaining steps to set up an Azure-SSIS IR, see the [Provision an Azure-SSIS integration runtime](#provision-an-azure-ssis-integration-runtime) section. 

 
## Deploy SSIS packages
Now, use SQL Server Data Tools or SQL Server Management Studio to deploy your SSIS packages to Azure. Connect to your Azure database server that hosts the SSIS Catalog (SSISDB database). The name of the Azure database server is in the format `<servername>.database.windows.net` (for Azure SQL Database). 

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

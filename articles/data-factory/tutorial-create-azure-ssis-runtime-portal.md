---
title: 'Provision an Azure SSIS integration runtime using the portal | Microsoft Docs'
description: 'This article explains how to create an Azure-SSIS integration runtime by using the Azure portal.'
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: hero-article
ms.date: 01/09/2018
ms.author: spelluru
---
# Provision an Azure SSIS integration runtime by using the Data Factory UI
This tutorial provides steps for using the Azure portal to provision an Azure-SSIS integration runtime (IR) in Azure Data Factory. Then, you can use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy SQL Server Integration Services (SSIS) packages to this runtime on Azure. For conceptual information on Azure-SSIS IR, see [Azure-SSIS integration runtime overview](concepts-integration-runtime.md#azure-ssis-integration-runtime).

In this tutorial, you do the following steps:

> [!div class="checklist"]
> * Create a data factory.
> * Create and start an Azure-SSIS integration runtime

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).


## Prerequisites
- **Azure subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin. 
- **Azure SQL Database server**. If you don't already have a database server, create one in the Azure portal before you get started. Azure Data Factory creates the SSIS Catalog database (SSISDB) on this database server. We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to SSISDB without crossing Azure regions. 
    - Confirm that the "**Allow access to Azure services**" setting is enabled for the database server. For more information, see [Secure your Azure SQL database](../sql-database/sql-database-security-tutorial.md#create-a-server-level-firewall-rule-in-the-azure-portal). To enable this setting by using PowerShell, see [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule?view=azurermps-4.4.1).
    - Add the IP address of the client machine or a range of IP addresses that includes the IP address of client machine to the client IP address list in the firewall settings for the database server. For more information, see [Azure SQL Database server-level and database-level firewall rules](../sql-database/sql-database-firewall-configure.md).
    - Confirm that your Azure SQL Database server does not have an SSIS Catalog (SSIDB database). The provisiong of Azure-SSIS IR does not support using an existing SSIS Catalog.
 
## Create a data factory

1. Log in to the [Azure portal](https://portal.azure.com/).    
2. Click **New** on the left menu, click **Data + Analytics**, and click **Data Factory**. 
   
   ![New->DataFactory](./media/tutorial-create-azure-ssis-runtime-portal/new-data-factory-menu.png)
3. In the **New data factory** page, enter **MyAzureSsisDataFactory** for the **name**. 
      
     ![New data factory page](./media/tutorial-create-azure-ssis-runtime-portal/new-azure-data-factory.png)
 
   The name of the Azure data factory must be **globally unique**. If you receive the following error, change the name of the data factory (for example, yournameMyAzureSsisDataFactory) and try creating again. See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.
  
       `Data factory name “MyAzureSsisDataFactory” is not available`
3. Select your Azure **subscription** in which you want to create the data factory. 
4. For the **Resource Group**, do one of the following steps:
     
      - Select **Use existing**, and select an existing resource group from the drop-down list. 
      - Select **Create new**, and enter the name of a resource group.   
         
      To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/resource-group-overview.md).  
4. Select **V2 (Preview)** for the **version**.
5. Select the **location** for the data factory. Only locations that are supported for creation of data factories are shown in the list.
6. Select **Pin to dashboard**.     
7. Click **Create**.
8. On the dashboard, you see the following tile with status: **Deploying data factory**. 

	![deploying data factory tile](media/tutorial-create-azure-ssis-runtime-portal/deploying-data-factory.png)
9. After the creation is complete, you see the **Data Factory** page as shown in the image.
   
   ![Data factory home page](./media/tutorial-create-azure-ssis-runtime-portal/data-factory-home-page.png)
10. Click **Author & Monitor** to launch the Data Factory User Interface (UI) in a separate tab. 

## Provision an Azure SSIS integration runtime

1. In the get started page, click **Configure SSIS Integration Runtime** tile. 

   ![Configure SSIS Integration Runtime tile](./media/tutorial-create-azure-ssis-runtime-portal/configure-ssis-integration-runtime-tile.png)
2. In the **General Settings** page of **Integration Runtime Setup**, do the following steps: 

   ![General settings](./media/tutorial-create-azure-ssis-runtime-portal/general-settings.png)

    1. Specify a **name** for the integration runtime.
    2. Select the **location** for the integration runtime. Only supported locations are displayed.
    3. Select the **size of the node** that is to be configured with the SSIS runtime.
    4. Specify the **number of nodes** in the cluster.
    5. Click **Next**. 
1. In the **SQL Settings**, do the following steps: 

    ![SQL settings](./media/tutorial-create-azure-ssis-runtime-portal/sql-settings.png)

    1. Specify the Azure **subscription** that has the Azure SQL server. 
    2. Select your Azure SQL server for the **Catalog Database Server Endpoint**.
    3. Enter the **administrator** user name.
    4. Enter the **password** for the administrator.  
    5. Select the **service tier** for the SSISDB database. The default value is Basic.
    6. Click **Next**. 
1.  In the **Advanced Settings** page, select a value for the **Maximum Parallel Executions Per Node**.   

    ![Advanced settings](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings.png)    
5. This step is **optional**. If you have a classic virtual network (VNet) that you want the integration runtime to join, select the **Select a VNet for your Azure-SSIS integration runtime to join and allow Azure services to configure VNet permissions/settings** option, and do the following steps: 

    ![Advanced settings with VNet](./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet.png)    

    1. Specify the **subscription** that has the classic VNet. 
    2. Select the **VNet**. <br/>
    4. Select the **Subnet**.<br/> 
1. Click **Finish** to start the creation of Azure-SSIS integration runtime. 

    > [!IMPORTANT]
    > - This process takes approximately 20 to minutes to complete
    > - The Data Factory service connects to your Azure SQL Database to prepare the SSIS Catalog database (SSISDB). The script also configures permissions and settings for your VNet, if specified, and joins the new instance of Azure-SSIS integration runtime to the VNet.
7. In the **Connections** window, switch to **Integration Runtimes** if needed. Click **Refresh** to refresh the status. 

    ![Creation status](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-creation-status.png)
8. Use the links under **Actions** column to monitor, stop/start, edit, or delete the integration runtime. Use the last link to view JSON code for the integration runtime. The edit and delete buttons are enabled only when the IR is stopped. 

    ![Azure SSIS IR - actions](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-actions.png)        
9. Click **Monitor** link under **Actions**.  

    ![Azure SSIS IR - details](./media/tutorial-create-azure-ssis-runtime-portal/azure-ssis-ir-details.png)
10. If there was an **error** associated with the Azure SSIS IR, you see the number of errors on this page and the link to view details about the error. For example, if the SSIS Catalog already exists on the database server, you see an error that indicates the existence of the SSISDB database.  
11. Click **Integration Runtimes** at the top to navigate to back the previous page to see all integration runtimes associated with the data factory.  

## Azure SSIS integration runtimes in the portal

1. In the Azure Data Factory UI, switch to the **Edit** tab, click **Connections**, and then switch to **Integration Runtimes** tab to view existing integration runtimes in your data factory. 
    ![View existing IRs](./media/tutorial-create-azure-ssis-runtime-portal/view-azure-ssis-integration-runtimes.png)
1. Click **New** to create a new Azure-SSIS IR. 

    ![Integration runtime via menu](./media/tutorial-create-azure-ssis-runtime-portal/edit-connections-new-integration-runtime-button.png)
2. To create an Azure-SSIS integration runtime, click **New** as shown in the image. 
3. In the Integration Runtime Setup window, select **Lift-and-shift existing SSIS packages to execute in Azure**, and then click **Next**.

    ![Specify the type of integration runtime](./media/tutorial-create-azure-ssis-runtime-portal/integration-runtime-setup-options.png)
4. See the [Provision an Azure SSIS integration runtime](#provision-an-azure-ssis-integration-runtime) section for the remaining steps to set up an Azure-SSIS IR. 

    
## Deploy SSIS packages
Now, use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy your SSIS packages to Azure. Connect to your Azure SQL server that hosts the SSIS catalog (SSISDB). The name of the Azure SQL server is in the format: `<servername>.database.windows.net` (for Azure SQL Database). 

See the following articles from SSIS documentation: 

- [Deploy, run, and monitor an SSIS package on Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to SSIS catalog on Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Schedule package execution on Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 

## Next steps
In this tutorial, you learned how to: 

> [!div class="checklist"]
> * Create a data factory.
> * Create and start an Azure-SSIS integration runtime

Advance to the following tutorial to learn about coping data from on-premises to cloud: 

> [!div class="nextstepaction"]
>[Copy data in cloud](tutorial-copy-data-portal.md)

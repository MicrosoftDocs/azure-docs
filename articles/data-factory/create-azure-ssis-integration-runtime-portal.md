---
title: Create an Azure-SSIS integration runtime via Azure portal
description: Learn how to create an Azure-SSIS integration runtime in Azure Data Factory via Azure portal so you can deploy and run SSIS packages in Azure.
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 04/12/2023
author: chugugrace
ms.author: chugu 
---

# Create an Azure-SSIS integration runtime via Azure portal 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article shows you how to create an Azure-SQL Server Integration Services (SSIS) integration runtime (IR) in Azure Data Factory (ADF) or Synapse Pipelines via Azure portal.

> [!NOTE] 
> There are certain features that are not available for Azure-SSIS IR in Azure Synapse Analytics, please check the [limitations](https://aka.ms/AAfq9i3).

## Provision an Azure-SSIS integration runtime

# [Azure Data Factory](#tab/data-factory)

Create your data factory via the Azure portal, follow the step-by-step instructions in [Create a data factory via the UI](./quickstart-create-data-factory-portal.md#create-a-data-factory). Select **Pin to dashboard** while doing so, to allow quick access after its creation. 

After your data factory is created, open its overview page in the Azure portal. Select the **Author & Monitor** tile to open its **Let's get started** page on a separate tab. There, you can continue to create your Azure-SSIS IR. 

On the home page, select the **Configure SSIS** tile to open the **Integration runtime setup** pane.

   :::image type="content" source="./media/doc-common-process/get-started-page.png" alt-text="Screenshot that shows the ADF home page.":::

   The **Integration runtime setup** pane has three pages where you successively configure general, deployment, and advanced settings.

# [Azure Synapse](#tab/synapse-analytics)

1. On the home page of the Azure Synapse UI, select the Manage tab from the leftmost pane.

   :::image type="content" source="media/doc-common-process/get-started-page-manage-button-synapse.png" alt-text="Screenshot of the home page Manage button.":::

1. Select **Integration runtimes** on the left pane, and then select **+New**.

   :::image type="content" source="media/doc-common-process/manage-new-integration-runtime-synapse.png" alt-text="Screenshot of create an integration runtime.":::

1. On the following page, select **Azure-SSIS** to create an SSIS IR, and then select **Continue**.
   :::image type="content" source="media/tutorial-create-azure-ssis-runtime-portal/new-sssis-integration-runtime-synapse.png" alt-text="Screenshot of create an SSIS IR.":::

---

### General settings page

On the **General settings** page of **Integration runtime setup** pane, complete the following steps.

:::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/general-settings.png" alt-text="General settings":::

1. For **Name**, enter the name of your integration runtime.

2. For **Description**, enter the description of your integration runtime.

3. For **Location**, select the location of your integration runtime. Only supported locations are displayed. We recommend that you select the same location of your database server to host SSISDB.

4. For **Node Size**, select the size of the node in your integration runtime cluster. Only supported node sizes are displayed. Select a large node size (scale up) if you want to run many compute-intensive or memory-intensive packages.

   > [!NOTE]
   > If you require [compute isolation](../azure-government/azure-secure-isolation-guidance.md#compute-isolation), please select the **Standard_E64i_v3** node size. This node size represents isolated virtual machines that consume their entire physical host and provide the necessary level of isolation required by certain workloads, such as the US Department of Defense's Impact Level 5 (IL5) workloads.
   
5. For **Node Number**, select the number of nodes in your integration runtime cluster. Only supported node numbers are displayed. Select a large cluster with many nodes (scale out) if you want to run many packages in parallel.

6. For **Edition/License**, select the SQL Server edition for your integration runtime: Standard or Enterprise. Select Enterprise if you want to use advanced features on your integration runtime.

7. For **Save Money**, select the Azure Hybrid Benefit option for your integration runtime: **Yes** or **No**. Select **Yes** if you want to bring your own SQL Server license with Software Assurance to benefit from cost savings with hybrid use.

8. Select **Continue**.

### Deployment settings page

On the **Deployment settings** page of **Integration runtime setup** pane, you have the options to create SSISDB and or Azure-SSIS IR package stores.

#### Creating SSISDB

On the **Deployment settings** page of **Integration runtime setup** pane, if you want to deploy your packages into SSISDB (Project Deployment Model), select the **Create SSIS catalog (SSISDB) hosted by Azure SQL Database server/Managed Instance to store your projects/packages/environments/execution logs** check box. Alternatively, if you want to deploy your packages into file system, Azure Files, or SQL Server database (MSDB) hosted by Azure SQL Managed Instance (Package Deployment Model), no need to create SSISDB nor select the check box.

Regardless of your deployment model, if you want to use SQL Server Agent hosted by Azure SQL Managed Instance to orchestrate/schedule your package executions, it's enabled by SSISDB, so select the check box anyway. For more information, see [Schedule SSIS package executions via  Azure SQL Managed Instance Agent](./how-to-invoke-ssis-package-managed-instance-agent.md).
   
If you select the check box, complete the following steps to bring your own database server to host SSISDB that we'll create and manage on your behalf.

:::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/deployment-settings.png" alt-text="Deployment settings for SSISDB":::
   
1. For **Subscription**, select the Azure subscription that has your database server to host SSISDB. 

1. For **Location**, select the location of your database server to host SSISDB. We recommend that you select the same location of your integration runtime.

1. For **Catalog Database Server Endpoint**, select the endpoint of your database server to host SSISDB. 
   
   Based on the selected database server, the SSISDB instance can be created on your behalf as a single database, as part of an elastic pool, or in a managed instance. It can be accessible in a public network or by joining a virtual network. For guidance in choosing the type of database server to host SSISDB, see [Compare SQL Database and SQL Managed Instance](../data-factory/create-azure-ssis-integration-runtime.md#comparison-of-sql-database-and-sql-managed-instance).   

   If you select an Azure SQL Database server with IP firewall rules/virtual network service endpoints or a managed instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR, you need to join your Azure-SSIS IR to a virtual network. For more information, see [Join an Azure-SSIS IR to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md).
      
1. Select either the **Use Microsoft Entra authentication with the system managed identity for Data Factory** or **Use Microsoft Entra authentication with a user-assigned managed identity for Data Factory** check box to choose Microsoft Entra authentication method for Azure-SSIS IR to access your database server that hosts SSISDB. Don't select any of the check boxes to choose SQL authentication method instead.

   If you select any of the check boxes, you'll need to add the specified system/user-assigned managed identity for your data factory into a Microsoft Entra group with access permissions to your database server. If you select the **Use Microsoft Entra authentication with a user-assigned managed identity for Data Factory** check box, you can then select any existing credentials created using your specified user-assigned managed identities or create new ones. For more information, see [Enable Microsoft Entra authentication for an Azure-SSIS IR](./enable-aad-authentication-azure-ssis-ir.md).

1. For **Admin Username**, enter the SQL authentication username for your database server that hosts SSISDB. 

1. For **Admin Password**, enter the SQL authentication password for your database server that hosts SSISDB. 

1. Select the **Use dual standby Azure-SSIS Integration Runtime pair with SSISDB failover** check box to configure a dual standby Azure SSIS IR pair that works in sync with Azure SQL Database/Managed Instance failover group for business continuity and disaster recovery (BCDR).
   
   If you select the check box, enter a name to identify your pair of primary and secondary Azure-SSIS IRs in the **Dual standby pair name** text box. You need to enter the same pair name when creating your primary and secondary Azure-SSIS IRs.

   For more information, see [Configure your Azure-SSIS IR for BCDR](./configure-bcdr-azure-ssis-integration-runtime.md).

1. For **Catalog Database Service Tier**, select the service tier for your database server to host SSISDB. Select the Basic, Standard, or Premium tier, or select an elastic pool name.

Select **Test connection** when applicable, and if it's successful, select **Continue**.

> [!NOTE]
> If you use Azure SQL Database server to host SSISDB, your data will be stored in geo-redundant storage for backups by default. If you don't want your data to be replicated in other regions, please follow the instructions to [Configure backup storage redundancy by using PowerShell](/azure/azure-sql/database/automated-backups-overview?tabs=single-database#configure-backup-storage-redundancy-by-using-powershell).
   
#### Creating Azure-SSIS IR package stores

On the **Deployment settings** page of **Integration runtime setup** pane, if you want to manage your packages that are deployed into MSDB, file system, or Azure Files (Package Deployment Model) with Azure-SSIS IR package stores, select the **Create package stores to manage your packages that are deployed into file system/Azure Files/SQL Server database (MSDB) hosted by Azure SQL Managed Instance** check box.
   
Azure-SSIS IR package store allows you to import/export/delete/run packages and monitor/stop running packages via SSMS similar to the [legacy SSIS package store](/sql/integration-services/service/package-management-ssis-service). For more information, see [Manage SSIS packages with Azure-SSIS IR package stores](./azure-ssis-integration-runtime-package-store.md).
   
If you select this check box, you can add multiple package stores to your Azure-SSIS IR by selecting **New**. Conversely, one package store can be shared by multiple Azure-SSIS IRs.

:::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/deployment-settings2.png" alt-text="Deployment settings for MSDB/file system/Azure Files":::

On the **Add package store** pane, complete the following steps.
   
   1. For **Package store name**, enter the name of your package store. 

   1. For **Package store linked service**, select your existing linked service that stores the access information for file system/Azure Files/Azure SQL Managed Instance where your packages are deployed or create a new one by selecting **New**. On the **New linked service** pane, complete the following steps.
   
      > [!NOTE]
      > You can use either **Azure File Storage** or **File System** linked services to access Azure Files. If you use **Azure File Storage** linked service, Azure-SSIS IR package store supports only **Basic** (not **Account key** nor **SAS URI**) authentication method for now.  

      :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/deployment-settings-linked-service.png" alt-text="Deployment settings for linked services":::

      1. For **Name**, enter the name of your linked service. 
         
      1. For **Description**, enter the description of your linked service. 
         
      1. For **Type**, select **Azure File Storage**, **Azure SQL Managed Instance**, or **File System**.

      1. You can ignore **Connect via integration runtime**, since we always use your Azure-SSIS IR to fetch the access information for package stores.

      1. If you select **Azure File Storage**, for **Authentication method**, select **Basic**, and then complete the following steps. 

         1. For **Account selection method**, select **From Azure subscription** or **Enter manually**.
         
         1. If you select **From Azure subscription**, select the relevant **Azure subscription**, **Storage account name**, and **File share**.
            
         1. If you select **Enter manually**, enter `\\<storage account name>.file.core.windows.net\<file share name>` for **Host**, `Azure\<storage account name>` for **Username**, and `<storage account key>` for **Password** or select your **Azure Key Vault** where it's stored as a secret.

      1. If you select **Azure SQL Managed Instance**, complete the following steps. 

         1. Select **Connection string** or your **Azure Key Vault** where it's stored as a secret.

         1. If you select **Connection string**, complete the following steps. 
             1. For **Account selection method**, if you choose **From Azure subscription**, select the relevant **Azure subscription**, **Server name**, **Endpoint type** and **Database name**. If you choose **Enter manually**, complete the following steps. 
                1.  For **Fully qualified domain name**, enter `<server name>.<dns prefix>.database.windows.net` or `<server name>.public.<dns prefix>.database.windows.net,3342` as the private or public endpoint of your Azure SQL Managed Instance, respectively. If you enter the private endpoint, **Test connection** isn't applicable, since ADF UI can't reach it.

                1. For **Database name**, enter `msdb`.

            1. For **Authentication type**, select **SQL Authentication**, **Managed Identity**, **Service Principal**, or **User-Assigned Managed Identity**.

                - If you select **SQL Authentication**, enter the relevant **Username** and **Password** or select your **Azure Key Vault** where it's stored as a secret.

                -  If you select **Managed Identity**, grant the system managed identity for your ADF access to your Azure SQL Managed Instance.

                - If you select **Service Principal**, enter the relevant **Service principal ID** and **Service principal key** or select your **Azure Key Vault** where it's stored as a secret.

                -  If you select **User-Assigned Managed Identity**, grant the specified user-assigned managed identity for your ADF access to your Azure SQL Managed Instance. You can then select any existing credentials created using your specified user-assigned managed identities or create new ones.

      1. If you select **File system**, enter the UNC path of folder where your packages are deployed for **Host**, as well as the relevant **Username** and **Password** or select your **Azure Key Vault** where it's stored as a secret.

      1. Select **Test connection** when applicable and if it's successful, select **Create**.

   1. Your added package stores will appear on the **Deployment settings** page. To remove them, select their check boxes, and then select **Delete**.

Select **Test connection** when applicable and if it's successful, select **Continue**.

### Advanced settings page

On the **Advanced settings** page of **Integration runtime setup** pane, complete the following steps.

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings.png" alt-text="Advanced settings":::

   1. For **Maximum Parallel Executions Per Node**, select the maximum number of packages to run concurrently per node in your integration runtime cluster. Only supported package numbers are displayed. Select a low number if you want to use more than one core to run a single large package that's compute or memory intensive. Select a high number if you want to run one or more small packages in a single core.

   1. Select the **Customize your Azure-SSIS Integration Runtime with additional system configurations/component installations** check box to choose whether you want to add standard/express custom setups on your Azure-SSIS IR. For more information, see [Custom setup for an Azure-SSIS IR](./how-to-configure-azure-ssis-ir-custom-setup.md).

      If you select the check box, complete the following steps.

      :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-custom.png" alt-text="Advanced settings with custom setups":::
   
      1. For **Custom setup container SAS URI**, enter the SAS URI of your container where you store scripts and associated files for standard custom setups.

      1. For **Express custom setup**, select **New** to open the **Add express custom setup** panel and then select any types under the **Express custom setup type** dropdown menu, e.g. **Run cmdkey command**, **Add environment variable**, **Install licensed component**, etc.

         If you select the **Install licensed component** type, you can then select any integrated components from our ISV partners under the **Component name** dropdown menu and if required, enter the product license key/upload the product license file that you purchased from them into the **License key**/**License file** box.
  
         Your added express custom setups will appear on the **Advanced settings** page. To remove them, you can select their check boxes and then select **Delete**.

   1. Select the **Select a VNet for your Azure-SSIS Integration Runtime to join, allow ADF to create certain network resources, and optionally bring your own static public IP addresses** check box to choose whether you want to join your Azure-SSIS IR to a virtual network. 

      Select it if you use Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB, or if you require access to on-premises data (that is, you have on-premises data sources/destinations in your SSIS packages) without configuring a self-hosted IR. For more information, see [Join Azure-SSIS IR to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md). 

      If you select the check box, complete the following steps.

      :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet.png" alt-text="Advanced settings with a virtual network":::

      1. For **Subscription**, select the Azure subscription that has your virtual network.

      1. For **Location**, the same location of your integration runtime is selected.

      1. For **Type**, select the type of your virtual network: **Azure Resource Manager Virtual Network**/classic virtual network. We recommend that you select **Azure Resource Manager Virtual Network**, because classic virtual network will be deprecated soon.

      1. For **VNet Name**, select the name of your virtual network. It should be the same one used to configure a virtual network service endpoint/private endpoint for your Azure SQL Database server that hosts SSISDB. Or it should be the same one joined by your Azure SQL Managed Instance that hosts SSISDB. Or it should be the same one connected to your on-premises network. Otherwise, it can be any virtual network to bring your own static public IP addresses for Azure-SSIS IR.

      1. For **Subnet Name**, select the name of subnet for your virtual network. It should be the same one used to configure a virtual network service endpoint for your Azure SQL Database server that hosts SSISDB. Or it should be a different subnet from the one joined by your Azure SQL Managed Instance that hosts SSISDB. Otherwise, it can be any subnet to bring your own static public IP addresses for Azure-SSIS IR.

      1. For **VNet injection method**, select the method of your virtual network injection: **Express**/**Standard**. 
   
         To compare these methods, see the [Compare the standard and express virtual network injection methods](azure-ssis-integration-runtime-virtual-network-configuration.md#compare) article. 
   
         If you select **Express**, see the [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md) article. 
      
         If you select **Standard**, see the [Standard virtual network injection method](azure-ssis-integration-runtime-standard-virtual-network-injection.md) article.  With this method, you can also:

         1. Select the **Bring static public IP addresses for your Azure-SSIS Integration Runtime** check box to choose whether you want to bring your own static public IP addresses for Azure-SSIS IR, so you can allow them on the firewall of your data stores.

            If you select the check box, complete the following steps.

            1. For **First static public IP address**, select the first static public IP address that [meets the requirements](azure-ssis-integration-runtime-standard-virtual-network-injection.md#ip) for your Azure-SSIS IR. If you don't have any, click the **Create new** link to create static public IP addresses on Azure portal and then click the refresh button here, so you can select them.
	  
            1. For **Second static public IP address**, select the second static public IP address that [meets the requirements](azure-ssis-integration-runtime-standard-virtual-network-injection.md#ip) for your Azure-SSIS IR. If you don't have any, click the **Create new** link to create static public IP addresses on Azure portal and then click the refresh button here, so you can select them.

   1. Select the **Set up Self-Hosted Integration Runtime as a proxy for your Azure-SSIS Integration Runtime** check box to choose whether you want to configure a self-hosted IR as proxy for your Azure-SSIS IR. For more information, see [Set up a self-hosted IR as proxy](./self-hosted-integration-runtime-proxy-ssis.md). 

      If you select the check box, complete the following steps.

      :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-shir.png" alt-text="Advanced settings with a self-hosted IR":::

      1. For **Self-Hosted Integration Runtime**, select your existing self-hosted IR as a proxy for Azure-SSIS IR.

      1. For **Staging Storage Linked Service**, select your existing Azure Blob storage linked service or create a new one for staging.

      1. For **Staging Path**, specify a blob container in your selected Azure Blob storage account or leave it empty to use a default one for staging.

   1. Select **VNet Validation**. If the validation is successful, select **Continue**. 

On the **Summary** page, review all settings for your Azure-SSIS IR, bookmark the recommended documentation links, and select **Finish** to start the creation of your integration runtime.

> [!NOTE]
> Excluding any custom setup time, this process should finish within 5 minutes. But it might take 20-30 minutes for the Azure-SSIS IR to join a virtual network with standard injection method.
>
> If you use SSISDB, the Data Factory service will connect to your database server to prepare SSISDB. It also configures permissions and settings for your virtual network, if specified, and joins your Azure-SSIS IR to the virtual network.
>
> When you provision an Azure-SSIS IR, Access Redistributable and Azure Feature Pack for SSIS are also installed. These components provide connectivity to Excel files, Access files, and various Azure data sources, in addition to the data sources that built-in components already support. For more information about built-in/preinstalled components, see [Built-in/preinstalled components on Azure-SSIS IR](./built-in-preinstalled-components-ssis-integration-runtime.md). For more information about additional components that you can install, see [Custom setups for Azure-SSIS IR](./how-to-configure-azure-ssis-ir-custom-setup.md).

### Connections pane

On the **Connections** pane of **Manage** hub, switch to the **Integration runtimes** page and select **Refresh**. 

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/connections-pane.png" alt-text="Connections pane":::

   You can edit/reconfigure your Azure-SSIS IR by selecting its name. You can also select the relevant buttons to monitor/start/stop/delete your Azure-SSIS IR, auto-generate an ADF pipeline with Execute SSIS Package activity to run on your Azure-SSIS IR, and view the JSON code/payload of your Azure-SSIS IR.  Editing/deleting your Azure-SSIS IR can only be done when it's stopped.

## Azure SSIS integration runtimes in the portal

1. In the Azure Data Factory UI, switch to the **Manage** tab and then switch to the **Integration runtimes** tab on the **Connections** pane to view existing integration runtimes in your data factory.

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/view-azure-ssis-integration-runtimes.png" alt-text="View existing IRs":::

1. Select **New** to create a new Azure-SSIS IR and open the **Integration runtime setup** pane.

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/edit-connections-new-integration-runtime-button.png" alt-text="Integration runtime via menu":::

1. In the **Integration runtime setup** pane, select the **Lift-and-shift existing SSIS packages to execute in Azure** tile, and then select **Continue**.

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/integration-runtime-setup-options.png" alt-text="Specify the type of integration runtime":::

1. For the remaining steps to set up an Azure-SSIS IR, see the [Provision an Azure SSIS integration runtime](#provision-an-azure-ssis-integration-runtime) section.
 
## Next steps

- [Create an Azure-SSIS IR via Azure PowerShell](create-azure-ssis-integration-runtime-powershell.md).
- [Create an Azure-SSIS IR via Azure Resource Manager template](create-azure-ssis-integration-runtime-resource-manager-template.md).
- [Deploy and run your SSIS packages on Azure-SSIS IR](create-azure-ssis-integration-runtime-deploy-packages.md).

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
- [Deploy, run, and monitor SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Connect to on-premises data stores with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 
- [Schedule SSIS package executions in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)

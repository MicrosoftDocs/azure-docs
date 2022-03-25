---
title: Join Azure-SSIS integration runtime to a virtual network via Azure portal
description: Learn how to join Azure-SSIS integration runtime to a virtual network via Azure portal. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 02/15/2022
author: swinarko
ms.author: sawinark 
ms.custom: devx-track-azurepowershell
---

# Join Azure-SSIS integration runtime to a virtual network via Azure portal

[!INCLUDE[appliesto-adf-asa-preview-md](includes/appliesto-adf-asa-preview-md.md)]

This article shows you how to join your existing Azure-SQL Server Integration Services (SSIS) integration runtime (IR) to a virtual network via portal. 

Before joining your Azure-SSIS IR to a virtual network, you need to properly configure the virtual network first, see the [Configure a virtual network to inject Azure-SSIS IR](azure-ssis-integration-runtime-virtual-network-configuration.md) article. Next, follow the steps in the section below that applies to the type of your virtual network (Azure Resource Manager/classic). Finally, follow the steps in the last section to join your Azure-SSIS IR to the virtual network. 

## Configure an Azure Resource Manager virtual network

Use Azure portal to configure an Azure Resource Manager virtual network before you try to join your Azure-SSIS IR to it.

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support ADF UI. 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Select **More services**. Filter for and select **Virtual networks**. 

1. Filter for and select your virtual network in the list. 

1. On the left-hand-side menu, select **Subnets**:

   - Make sure that there's a proper subnet for your Azure-SSIS IR to join, see the [Select a subnet](azure-ssis-integration-runtime-standard-virtual-network-injection.md#subnet) section.

   - If you use express virtual network injection method, make sure that the selected subnet is delegated to Azure Batch, see the [Delegate a subnet to Azure Batch](azure-ssis-integration-runtime-virtual-network-configuration.md#delegatesubnet) section.

1. Make sure that *Microsoft.Batch* is a registered resource provider in Azure subscription that has the virtual network for your Azure-SSIS IR to join. For detailed instructions, see the [Register Azure Batch as a resource provider](azure-ssis-integration-runtime-virtual-network-configuration.md#registerbatch) section.

## Configure a classic virtual network

Use Azure portal to configure a classic virtual network before you try to join your Azure-SSIS IR to it. 

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support ADF UI. 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Select **More services**. Filter for and select **Virtual networks (classic)**. 

1. Filter for and select your virtual network in the list. 

1. On the **Virtual network (classic)** page, select **Properties**. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/classic-vnet-resource-id.png" alt-text="Classic virtual network resource ID":::

1. Select the copy button for **RESOURCE ID** to copy the resource ID for the classic virtual network to the clipboard. Save the ID from the clipboard in OneNote or a file. 

1. On the left-hand-side menu, select **Subnets**. Make sure that the number of available IP addresses in your selected subnet is greater than twice the number of your Azure-SSIS IR nodes. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/number-of-available-addresses.png" alt-text="Number of available addresses in the virtual network":::

1. Join **MicrosoftAzureBatch** to the **Classic Virtual Machine Contributor** role for the virtual network. 

   1. On the left-hand-side menu, select **Access control (IAM)**, and select the **Role assignments** tab. 

      :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/access-control-add.png" alt-text="&quot;Access control&quot; and &quot;Add&quot; buttons":::

   1. Select **Add role assignment**.

   1. On the **Add role assignment** page, for **Role**, select **Classic Virtual Machine Contributor**. In the **Select** box, paste **ddbf3205-c6bd-46ae-8127-60eb93363864**, and then select **MicrosoftAzureBatch** from the list of search results. 

      :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-to-vm-contributor.png" alt-text="Search results on the &quot;Add role assignment&quot; page":::

   1. Select **Save** to save the settings and close the page. 

      :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/save-access-settings.png" alt-text="Save access settings":::

   1. Confirm that you see **MicrosoftAzureBatch** in the list of contributors. 

      :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-in-list.png" alt-text="Confirm Azure Batch access":::

1. Make sure that *Microsoft.Batch* is a registered resource provider in Azure subscription that has the virtual network for your Azure-SSIS IR to join. For detailed instructions, see the [Register Azure Batch as a resource provider](azure-ssis-integration-runtime-virtual-network-configuration.md#registerbatch) section.

## Join Azure-SSIS IR to the virtual network

After you've configured an Azure Resource Manager/classic virtual network, you can join your Azure-SSIS IR to the virtual network:

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support ADF UI. 

1. In [Azure portal](https://portal.azure.com), on the left-hand-side menu, select **Data factories**. If you don't see **Data factories** on the menu, select **More services**, and then in the **INTELLIGENCE + ANALYTICS** section, select **Data factories**. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/data-factories-list.png" alt-text="List of data factories":::

1. Select your ADF with Azure-SSIS IR in the list. You see the home page for your ADF. Select the **Author & Monitor** tile. You see ADF UI on a separate tab. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/data-factory-home-page.png" alt-text="Data factory home page":::

1. In ADF UI, switch to the **Edit** tab, select **Connections**, and switch to the **Integration Runtimes** tab. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/integration-runtimes-tab.png" alt-text="&quot;Integration runtimes&quot; tab":::

1. If your Azure-SSIS IR is running, in the **Integration Runtimes** list, in the **Actions** column, select the **Stop** button for your Azure-SSIS IR. You can't edit your Azure-SSIS IR until you stop it. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/stop-ir-button.png" alt-text="Stop the IR":::

1. In the **Integration Runtimes** list, in the **Actions** column, select the **Edit** button for your Azure-SSIS IR. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/integration-runtime-edit.png" alt-text="Edit the integration runtime":::

1. On the **Integration runtime setup** pane, advance through the **General settings** and **Deployment settings** pages by selecting the **Next** button.

1. On the **Advanced settings** page, complete the following steps.

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet.png" alt-text="Advanced settings with a virtual network":::

   1. Select the **Select a VNet for your Azure-SSIS Integration Runtime to join, allow ADF to create certain network resources, and optionally bring your own static public IP addresses** check box. 

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

   1. Select **VNet Validation**. If the validation is successful, select **Continue**. 

1. On the **Summary** page, review all settings for your Azure-SSIS IR and then select **Update**.

1. Start your Azure-SSIS IR by selecting the **Start** button in **Actions** column for your Azure-SSIS IR. It takes about 5/20-30 minutes to start your Azure-SSIS IR that joins a virtual network with express/standard injection method, respectively. 

## Next steps

- [Configure a virtual network to inject Azure-SSIS IR](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md)
- [Standard virtual network injection method](azure-ssis-integration-runtime-standard-virtual-network-injection.md)
- [Join Azure-SSIS IR to a virtual network via Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.

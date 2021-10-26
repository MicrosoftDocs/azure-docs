---
title: Join an Azure-SSIS integration runtime to a virtual network with UI
description: Learn how to use the Azure Data Factory Studio UI to join an Azure-SSIS integration runtime to an Azure virtual network. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/16/2021
author: swinarko
ms.author: sawinark 
ms.custom: devx-track-azurepowershell
---

# Join an Azure-SSIS integration runtime to a virtual network with Azure Data Factory Studio UI

This section shows you how to join an existing Azure-SSIS IR to a virtual network (classic or Azure Resource Manager) by using the Azure portal and Azure Data Factory Studio UI. 

Before joining your Azure-SSIS IR to the virtual network, you need to properly configure the virtual network. Follow the steps in the section that applies to your type of virtual network (classic or Azure Resource Manager). Then follow the steps in the third section to join your Azure-SSIS IR to the virtual network. 

## Configure an Azure Resource Manager virtual network

Use the portal to configure an Azure Resource Manager virtual network before you try to join an Azure-SSIS IR to it.

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support the Data Factory UI. 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Select **More services**. Filter for and select **Virtual networks**. 

1. Filter for and select your virtual network in the list. 

1. On the **Virtual network** page, select **Properties**. 

1. Select the copy button for **RESOURCE ID** to copy the resource ID for the virtual network to the clipboard. Save the ID from the clipboard in OneNote or a file. 

1. On the left menu, select **Subnets**. Ensure that the number of available addresses is greater than the nodes in your Azure-SSIS IR. 

1. Verify that the Azure Batch provider is registered in the Azure subscription that has the virtual network. Or register the Azure Batch provider. If you already have an Azure Batch account in your subscription, your subscription is registered for Azure Batch. (If you create the Azure-SSIS IR in the Data Factory portal, the Azure Batch provider is automatically registered for you.) 

   1. In the Azure portal, on the left menu, select **Subscriptions**. 

   1. Select your subscription. 

   1. On the left, select **Resource providers**, and confirm that **Microsoft.Batch** is a registered provider. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png" alt-text="Confirmation of &quot;Registered&quot; status":::

   If you don't see **Microsoft.Batch** in the list, to register it, [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in your subscription. You can delete it later. 

## Configure a classic virtual network

Use the portal to configure a classic virtual network before you try to join an Azure-SSIS IR to it. 

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support the Data Factory UI. 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Select **More services**. Filter for and select **Virtual networks (classic)**. 

1. Filter for and select your virtual network in the list. 

1. On the **Virtual network (classic)** page, select **Properties**. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/classic-vnet-resource-id.png" alt-text="Classic virtual network resource ID":::

1. Select the copy button for **RESOURCE ID** to copy the resource ID for the classic network to the clipboard. Save the ID from the clipboard in OneNote or a file. 

1. On the left menu, select **Subnets**. Ensure that the number of available addresses is greater than the nodes in your Azure-SSIS IR. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/number-of-available-addresses.png" alt-text="Number of available addresses in the virtual network":::

1. Join **MicrosoftAzureBatch** to the **Classic Virtual Machine Contributor** role for the virtual network. 

   1. On the left menu, select **Access control (IAM)**, and select the **Role assignments** tab. 

       :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/access-control-add.png" alt-text="&quot;Access control&quot; and &quot;Add&quot; buttons":::

   1. Select **Add role assignment**.

   1. On the **Add role assignment** page, for **Role**, select **Classic Virtual Machine Contributor**. In the **Select** box, paste **ddbf3205-c6bd-46ae-8127-60eb93363864**, and then select **Microsoft Azure Batch** from the list of search results. 

       :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-to-vm-contributor.png" alt-text="Search results on the &quot;Add role assignment&quot; page":::

   1. Select **Save** to save the settings and close the page. 

       :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/save-access-settings.png" alt-text="Save access settings":::

   1. Confirm that you see **Microsoft Azure Batch** in the list of contributors. 

       :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/azure-batch-in-list.png" alt-text="Confirm Azure Batch access":::

1. Verify that the Azure Batch provider is registered in the Azure subscription that has the virtual network. Or register the Azure Batch provider. If you already have an Azure Batch account in your subscription, your subscription is registered for Azure Batch. (If you create the Azure-SSIS IR in the Data Factory portal, the Azure Batch provider is automatically registered for you.) 

   1. In the Azure portal, on the left menu, select **Subscriptions**. 

   1. Select your subscription. 

   1. On the left, select **Resource providers**, and confirm that **Microsoft.Batch** is a registered provider. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/batch-registered-confirmation.png" alt-text="Confirmation of &quot;Registered&quot; status":::

   If you don't see **Microsoft.Batch** in the list, to register it, [create an empty Azure Batch account](../batch/batch-account-create-portal.md) in your subscription. You can delete it later. 

## Join the Azure-SSIS IR to a virtual network

After you've configured your Azure Resource Manager virtual network or classic virtual network, you can join the Azure-SSIS IR to the virtual network:

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support the Data Factory UI. 

1. In the [Azure portal](https://portal.azure.com), on the left menu, select **Data factories**. If you don't see **Data factories** on the menu, select **More services**, and then in the **INTELLIGENCE + ANALYTICS** section, select **Data factories**. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/data-factories-list.png" alt-text="List of data factories":::

1. Select your data factory with the Azure-SSIS IR in the list. You see the home page for your data factory. Select the **Author & Monitor** tile. You see the Data Factory UI on a separate tab. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/data-factory-home-page.png" alt-text="Data factory home page":::

1. In the Data Factory UI, switch to the **Edit** tab, select **Connections**, and switch to the **Integration Runtimes** tab. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/integration-runtimes-tab.png" alt-text="&quot;Integration runtimes&quot; tab":::

1. If your Azure-SSIS IR is running, in the **Integration Runtimes** list, in the **Actions** column, select the **Stop** button for your Azure-SSIS IR. You can't edit your Azure-SSIS IR until you stop it. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/stop-ir-button.png" alt-text="Stop the IR":::

1. In the **Integration Runtimes** list, in the **Actions** column, select the **Edit** button for your Azure-SSIS IR. 

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/integration-runtime-edit.png" alt-text="Edit the integration runtime":::

1. On the integration runtime setup panel, advance through the **General Settings** and **SQL Settings** sections by selecting the **Next** button. 

1. On the **Advanced Settings** section: 

   1. Select the **Select a VNet for your Azure-SSIS Integration Runtime to join, allow ADF to create certain network resources, and optionally bring your own static public IP addresses** check box. 

   1. For **Subscription**, select the Azure subscription that has your virtual network.

   1. For **Location**, the same location of your integration runtime is selected.

   1. For **Type**, select the type of your virtual network: classic or Azure Resource Manager. We recommend that you select an Azure Resource Manager virtual network, because classic virtual networks will be deprecated soon.

   1. For **VNet Name**, select the name of your virtual network. It should be the same one used for SQL Database with virtual network service endpoints or SQL Managed Instance with private endpoint to host SSISDB. Or it should be the same one connected to your on-premises network. Otherwise, it can be any virtual network to bring your own static public IP addresses for Azure-SSIS IR.

   1. For **Subnet Name**, select the name of subnet for your virtual network. It should be the same one used for SQL Database with virtual network service endpoints to host SSISDB. Or it should be a different subnet from the one used for SQL Managed Instance with private endpoint to host SSISDB. Otherwise, it can be any subnet to bring your own static public IP addresses for Azure-SSIS IR.

   1. Select the **Bring static public IP addresses for your Azure-SSIS Integration Runtime** check box to choose whether you want to bring your own static public IP addresses for Azure-SSIS IR, so you can allow them on the firewall for your data sources.

      If you select the check box, complete the following steps.

      1. For **First static public IP address**, select the first static public IP address that [meets the requirements](azure-ssis-integration-runtime-virtual-network-configuration.md#publicIP) for your Azure-SSIS IR. If you don't have any, click **Create new** link to create static public IP addresses on Azure portal and then click the refresh button here, so you can select them.
	  
      1. For **Second static public IP address**, select the second static public IP address that [meets the requirements](azure-ssis-integration-runtime-virtual-network-configuration.md#publicIP) for your Azure-SSIS IR. If you don't have any, click **Create new** link to create static public IP addresses on Azure portal and then click the refresh button here, so you can select them.

   1. Select **VNet Validation**. If the validation is successful, select **Continue**. 

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet.png" alt-text="Advanced settings with a virtual network":::

1. On the **Summary** section, review all settings for your Azure-SSIS IR. Then select **Update**.

1. Start your Azure-SSIS IR by selecting the **Start** button in the **Actions** column for your Azure-SSIS IR. It takes about 20 to 30 minutes to start the Azure-SSIS IR that joins a virtual network. 

## Next steps
- [Join an Azure-SSIS integration runtime to a virtual network - Overview](join-azure-ssis-integration-runtime-virtual-network.md)
- [Azure-SSIS integration runtime virtual network configuration details](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Join an Azure-SSIS integration runtime to a virtual network with Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 
- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](./tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database to host the SSIS catalog. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions about using Azure SQL Database with virtual network service endpoints or SQL Managed Instance in a virtual network to host the SSIS catalog. It shows how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to get information about your Azure-SSIS IR. It provides status descriptions for the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding nodes.

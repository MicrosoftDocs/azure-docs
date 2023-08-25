---
title: Tutorial to configure Azure-SSIS integration runtime to join a virtual network
description: Learn how to configure Azure-SSIS integration runtime to join a virtual network. 
author: chugugrace
ms.author: chugu
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 08/10/2023
---

# Configure Azure-SSIS integration runtime to join a virtual network

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This tutorial provides minimum steps via Azure portal/Azure Data Factory (ADF) UI to configure your Azure-SQL Server Integration Services (SSIS) integration runtime (IR) to join a virtual network with express injection method.  The steps include:

1. Configure a virtual network for express injection method via Azure portal.
1. Join your Azure-SSIS IR to the virtual network with express injection method via ADF UI

## Prerequisites

- **Azure-SSIS IR**: If you don't have one already, [create an Azure-SSIS IR via ADF UI](tutorial-deploy-ssis-packages-azure.md) first.

- **Virtual network**: If you don't have one already, [create a virtual network via Azure portal](../virtual-network/quick-create-portal.md) first. Make sure of the following:
  - There's no resource lock in your virtual network.
  - The user creating Azure-SSIS IR is granted the necessary role-based access control (RBAC) permissions to join your virtual network/subnet, see the [Select virtual network permissions](azure-ssis-integration-runtime-express-virtual-network-injection.md#perms) section.

The following virtual network configurations aren't covered in this tutorial:

- If you use a static public IP address for Azure-SSIS IR.
- If you use your own domain name system (DNS) server.
- If you use a network security group (NSG).
- If you use user-defined routes (UDRs).

If you want to perform these optional steps, see the [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md) article.

## Configure a virtual network

Use Azure portal to configure a virtual network before you try to join your Azure-SSIS IR to it.

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support ADF UI.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **More services**. Filter for and select **Virtual networks**.

1. Filter for and select your virtual network in the list.

1. On the left-hand-side menu, select **Subnets**:

   - Make sure that there's a proper subnet for your Azure-SSIS IR to join, see the [Select a subnet](azure-ssis-integration-runtime-express-virtual-network-injection.md#subnet) section.

   - Make sure that the selected subnet is delegated to Azure Batch, see the [Delegate a subnet to Azure Batch](azure-ssis-integration-runtime-virtual-network-configuration.md#delegatesubnet) section.

1. Make sure that *Microsoft.Batch* is a registered resource provider in Azure subscription that has the virtual network for your Azure-SSIS IR to join. For detailed instructions, see the [Register Azure Batch as a resource provider](azure-ssis-integration-runtime-virtual-network-configuration.md#registerbatch) section.

## Join Azure-SSIS IR to the virtual network

After you've configured a virtual network, you can join your Azure-SSIS IR to the virtual network:

1. Start Microsoft Edge or Google Chrome. Currently, only these web browsers support ADF UI.

1. In [Azure portal](https://portal.azure.com), on the left-hand-side menu, select **Data factories**. If you don't see **Data factories** on the menu, select **More services**, and then in the **INTELLIGENCE + ANALYTICS** section, select **Data factories**.

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/data-factories-list.png" alt-text="List of data factories":::

1. Select your ADF with Azure-SSIS IR in the list. You see the home page for your ADF. Select the **Open Azure Data Factory Studio** tile. You see ADF UI on a separate tab.

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/data-factory-home-page.png" alt-text="Data factory home page":::

1. In ADF UI, switch to the **Edit** tab, select **Connections**, and switch to the **Integration Runtimes** tab.

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/integration-runtimes-tab.png" alt-text="&quot;Integration runtimes&quot; tab":::

1. If your Azure-SSIS IR is running, in the **Integration Runtimes** list, in the **Actions** column, select the **Stop** button for your Azure-SSIS IR. You can't edit your Azure-SSIS IR until you stop it.

   :::image type="content" source="media/join-azure-ssis-integration-runtime-virtual-network/stop-ir-button.png" alt-text="Stop the IR":::

1. In the **Integration Runtimes** list, in the **Actions** column, select your Azure-SSIS IR to edit it.

1. On the **Integration runtime setup** pane, advance through the **General settings** and **Deployment settings** pages by selecting the **Next** button.

1. On the **Advanced settings** page, complete the following steps.

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/advanced-settings-vnet-express.png" alt-text="Advanced settings for express virtual network injection":::

   1. Select the **Select a VNet for your Azure-SSIS Integration Runtime to join, allow ADF to create certain network resources, and optionally bring your own static public IP addresses** check box.

   1. For **Subscription**, select the Azure subscription that has your virtual network.

   1. For **Location**, the same location of your integration runtime is selected.

   1. For **Type**, select the type of your virtual network: **Azure Resource Manager Virtual Network**/classic virtual network. We recommend that you select **Azure Resource Manager Virtual Network**, because classic virtual network will be deprecated soon.

   1. For **VNet Name**, select the name of your virtual network. It should be the same one used to configure a virtual network service endpoint/private endpoint for your Azure SQL Database server that hosts SSISDB. Or it should be the same one joined by your Azure SQL Managed Instance that hosts SSISDB. Or it should be the same one connected to your on-premises network.

   1. For **Subnet Name**, select the name of subnet for your virtual network. It should be the same one used to configure a virtual network service endpoint for your Azure SQL Database server that hosts SSISDB. Or it should be a different subnet from the one joined by your Azure SQL Managed Instance that hosts SSISDB.

   1. For **VNet injection method**, select **Express** for express virtual network injection.

   1. Select **VNet Validation**. If the validation is successful, select **Continue**.

1. On the **Summary** page, review all settings for your Azure-SSIS IR and then select **Update**.

1. Start your Azure-SSIS IR by selecting the **Start** button in **Actions** column for your Azure-SSIS IR. It takes about 5 minutes to start your Azure-SSIS IR that joins a virtual network with express injection method.

## Next steps

- [Configure a virtual network to inject Azure-SSIS IR](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md)
- [Join Azure-SSIS IR to a virtual network via ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)
- [Join Azure-SSIS IR to a virtual network via Azure PowerShell](join-azure-ssis-integration-runtime-virtual-network-powershell.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.

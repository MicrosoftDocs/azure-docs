---
# Mandatory fields.
title: Enable private access with Private Link
titleSuffix: Azure Digital Twins
description: See how to enable private access for Azure Digital Twins solutions with Private Link
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/25/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable private access with Private Link

...

## Prerequisites

...

## Add a private endpoint for an Azure Digital Twins instance 

You can turn on Private Link with a private endpoint for an Azure Digital Twins instance as part of the instance's initial setup, or enable it later on an instance that already exists. You can set it up on an existing instance using that instance's options in the Azure Portal, or through Private Link options in the Azure portal.

Any of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do each one in the [Azure portal](https://portal.azure.com).

Alternatively, you can also use [Azure PowerShell](/powershell/azure/), [Azure CLI](/cli/azure/), or [ARM templates](../azure-resource-manager/templates/index.yml) to set up a Private Link endpoint to Azure Digital Twins. Refer to the following instructions to learn more:
* [PowerShell instructions](../private-link/create-private-endpoint-powershell.md)
* [CLI instructions](../private-link/create-private-endpoint-cli.md)
* [ARM instructions](../private-link/create-private-endpoint-template.md) 

### Add a private endpoint during instance creation

In this section, you'll use the [Azure portal](https://portal.azure.com) to enable Private Link with a private endpoint on an Azure Digital Twins instance that is currently being created. This section focuses on the networking step of the creation process; for a complete walkthrough of creating a new Azure Digital Twins instance, see [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md).

The Private Link options are located in the **Networking** tab of instance setup.

In this tab, you can enable private endpoints by selecting the **Private endpoint** option for the **Connectivity method**.

This will add a section called **Private endpoint connections** where you can configure the details of your private endpoint. Select the **+ Add** button to continue.

:::image type="content" source="media/how-to-enable-private-link/create-instance-networking-1.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the tab name, the Private endpoint option for Connectivity method, and the + Add button to create a new private endpoint connection." lightbox="media/how-to-enable-private-link/create-instance-networking-1.png":::

This will open a page to enter the details of a new private endpoint.

:::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-full.png" alt-text="Screenshot of the Azure portal showing the Create private endpoint page. It contains the fields described below.":::

1. Fill in the first section with selections for your **Subscription**, **Resource group**, and **Location**, as well as a **Name** for the endpoint. For **Target sub-resources**, select *API*.

1. Next, select the **Virtual network** and **Subnet** you'd like to use to deploy the endpoint.

1. Lastly, select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).

After filling out the configuration options, Hit **OK** to finish.

This will return you to the **Networking** tab of the Azure Digital Twins instance setup, where your new endpoint should be visible under **Private endpoint connections.

:::image type="content" source="media/how-to-enable-private-link/create-instance-networking-2.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the new private endpoint connection, and the navigation buttons (Review + create, Previous, Next: Advanced)." lightbox="media/how-to-enable-private-link/create-instance-networking-2.png":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.

### Add a private endpoint to an existing instance

In this section, you'll use the [Azure portal](https://portal.azure.com) to enable Private Link with a private endpoint for an Azure Digital Twins instance that already exists.

You can do this either through the Azure Digital Twins instance's options in the Azure Portal, or through the Private Link Center in the Azure portal. The configuration options are the same in both places and there is no difference in the result.

#### Option 1: Navigate to setup through the Azure Digital Twins instance

To set up Private Link through an Azure Digital Twins instance, first navigate to the [Azure portal](https://portal.azure.com) in a browser.

1. Search for the name of your instance in the portal search bar, and select it to view its details.

1. Select **Networking (preview)** in the left-hand menu.

1. Switch to the **Private endpoint connections** tab.

1. Select **+ Private endpoint**.

    :::image type="content" source="media/how-to-enable-private-link/add-endpoint-digital-twins.png" alt-text="Screenshot of the Azure portal showing the the Networking (preview) page for an Azure Digital Twins instance. The Private endpoint connections tab is highlighted, and the + Private endpoint button is also highlighted." lightbox="media/how-to-enable-private-link/add-endpoint-digital-twins.png":::

#### Option 2: Navigate to setup through Private Link

To set up Private Link through the Private Link Center in the Azure portal, first navigate to the [Azure portal](https://portal.azure.com) in a browser.

1. Search for **Private Link** in the portal search bar, and select it to go to the **Private Link Center**.

1. Select **Private endpoints** in the left-hand menu.

1. In **Private endpoints**, select **+ Add**. 

    :::image type="content" source="media/how-to-enable-private-link/add-endpoint-private-link.png" alt-text="Screenshot of the Azure portal showing the Private Link Center. The Private endpoints page is selected from the menu, and the + Add button is highlighted." lightbox="media/how-to-enable-private-link/add-endpoint-private-link.png":::

#### Complete setup

Next, you'll go through the **Create a private endpoint** setup.

1. In the **Basics** tab, enter or select the **Subscription** and **Resource group** of your project, and a **Name** and **Region** for your endpoint.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-1.png" alt-text="Screenshot of the Azure portal showing the first (Basics) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, select the **Next : Resource >** button to go to the next tab.

1. In the **Resource** tab, enter or select this information: 
    * **Connection method**: Select **Connect to an Azure resource in my directory** to search for your Azure Digital Twins instance.
    * **Subscription**: Enter your subscription.
    * **Resource type**: Select **Microsoft.DigitalTwins/digitalTwinsInstances**
    * **Resource**: Select the name of your Azure Digital Twins instance.
    * **Target sub-resource**: Select **API**.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-2.png" alt-text="Screenshot of the Azure portal showing the second (Resource) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, select the **Next : Configuration >** button to go to the next tab.    

1. In the **Configuration** tab, enter or select this information:
    * **Virtual network**: Select your virtual network.
    * **Subnet**: Choose a subnet from your virtual network.
    * **Integrate with private DNS zone**: Select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).
    If you select **Yes**, you can leave the default configuration information.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-3.png" alt-text="Screenshot of the Azure portal showing the third (Configuration) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, you can select the **Review + create** button to finish setup. 

1. In the **Review + create** tab, review your selections and select the **Create** button. 

When the endpoint is finished deploying, it should show up in the Private endpoint connections for your Azure Digital Twins instance, or in the endpoint list in Private Link Center.

## Enabling / disabling public network access flags

...

## Next steps
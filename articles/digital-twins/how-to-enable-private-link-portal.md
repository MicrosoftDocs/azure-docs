---
# Mandatory fields.
title: Enable private access with Private Link (preview) - portal
titleSuffix: Azure Digital Twins
description: See how to enable private access for Azure Digital Twins solutions with Private Link, using the Azure portal.
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

# Enable private access with Private Link (preview): Azure portal

[!INCLUDE [digital-twins-private-link-selector.md](../../includes/digital-twins-private-link-selector.md)]

This article describes the different ways to [enable Private Link with a private endpoint for an Azure Digital Twins instance](concepts-security.md#private-network-access-with-azure-private-link-preview) (currently in preview). Configuring a private endpoint for your Azure Digital Twins instance enables you to secure your Azure Digital Twins instance and eliminate public exposure, as well as avoid data exfiltration from your [Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md).

This article walks through the process using the [**Azure portal**](https://portal.azure.com).

Here are the steps that are covered in this article: 
1. Turn on Private Link and configure a private endpoint for an Azure Digital Twins instance.
1. Disable or enable public network access flags, to restrict API access to Private Link connections only.

## Prerequisites

Before you can set up a private endpoint, you'll need an [**Azure Virtual Network (VNet)**](../virtual-network/virtual-networks-overview.md) where the endpoint can be deployed. If you don't have a VNet already, you can follow one of the Azure Virtual Network [quickstarts](../virtual-network/quick-create-portal.md) to set this up.

## Add a private endpoint for an Azure Digital Twins instance 

When using the [Azure portal](https://portal.azure.com), you can choose to turn on Private Link with a private endpoint for an Azure Digital Twins instance as part of the instance's initial setup, or enable it later on an instance that already exists. 

Either of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do each one.

>[!TIP]
> You can also set up a Private Link endpoint through the Private Link service, instead of through your Azure Digital Twins instance. This also gives the same configuration options and the same end result.
>
> For more details about setting up Private Link resources, see Private Link documentation for the [Azure portal](../private-link/create-private-endpoint-portal.md), [Azure CLI](../private-link/create-private-endpoint-cli.md), [ARM](../private-link/create-private-endpoint-template.md), or [PowerShell](../private-link/create-private-endpoint-powershell.md).

### Add a private endpoint during instance creation

In this section, you'll enable Private Link with a private endpoint on an Azure Digital Twins instance that is currently being created. This section focuses on the networking step of the creation process; for a complete walkthrough of creating a new Azure Digital Twins instance, see [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md).

The Private Link options are located in the **Networking** tab of instance setup.

In this tab, you can enable private endpoints by selecting the **Private endpoint** option for the **Connectivity method**.

This will add a section called **Private endpoint connections** where you can configure the details of your private endpoint. Select the **+ Add** button to continue.

:::image type="content" source="media/how-to-enable-private-link/create-instance-networking-1.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the tab name, the Private endpoint option for Connectivity method, and the + Add button to create a new private endpoint connection." lightbox="media/how-to-enable-private-link/create-instance-networking-1.png":::

This will open a page to enter the details of a new private endpoint.

:::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-full.png" alt-text="Screenshot of the Azure portal showing the Create private endpoint page. It contains the fields described below.":::

1. Fill in selections for your **Subscription** and **Resource group**. Set the **Location** to the same location as the VNet you'll be using. Choose a **Name** for the endpoint, and for **Target sub-resources** select *API*.

1. Next, select the **Virtual network** and **Subnet** you'd like to use to deploy the endpoint.

1. Lastly, select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).

After filling out the configuration options, Hit **OK** to finish.

This will return you to the **Networking** tab of the Azure Digital Twins instance setup, where your new endpoint should be visible under **Private endpoint connections.

:::image type="content" source="media/how-to-enable-private-link/create-instance-networking-2.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the new private endpoint connection, and the navigation buttons (Review + create, Previous, Next: Advanced)." lightbox="media/how-to-enable-private-link/create-instance-networking-2.png":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.

### Add a private endpoint to an existing instance

In this section, you'll enable Private Link with a private endpoint for an Azure Digital Twins instance that already exists.

1. First, navigate to the [Azure portal](https://portal.azure.com) in a browser. Bring up your Azure Digital Twins instance by searching for its name in the portal search bar.

1. Select **Networking (preview)** in the left-hand menu.

1. Switch to the **Private endpoint connections** tab.

1. Select **+ Private endpoint** to open the **Create a private endpoint** setup.

    :::image type="content" source="media/how-to-enable-private-link/add-endpoint-digital-twins.png" alt-text="Screenshot of the Azure portal showing the the Networking (preview) page for an Azure Digital Twins instance. The Private endpoint connections tab is highlighted, and the + Private endpoint button is also highlighted." lightbox="media/how-to-enable-private-link/add-endpoint-digital-twins.png":::

1. In the **Basics** tab, enter or select the **Subscription** and **Resource group** of your project, and a **Name** and **Region** for your endpoint. The region needs to be the same as the region for the VNet you're using.

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

When the endpoint is finished deploying, it should show up in the private endpoint connections for your Azure Digital Twins instance.

>[!TIP]
> The endpoint can also be viewed from the Private Link Center in the Azure portal.

## Disable / enable public network access flags

You can configure your Azure Digital Twins instance to deny all public connections and allow only connections through private endpoints to enhance the network security. This action is done with a **public network access flag**. 

This policy allows you to restrict API access to Private Link connections only. When the public network access flag is set to *disabled*, all REST API calls to the Azure Digital Twins instance data plane from the public cloud will return `403, Unauthorized`. Alternatively, when the policy is set to *disabled* and a request is made through a private endpoint, the API call will succeed.

This article shows how to update the value of the network flag using the [Azure portal](https://portal.azure.com). For instructions on how to do it with the Azure CLI or ARMClient command tool, see the [CLI version](how-to-enable-private-link-cli.md) of this article.

### Use the Azure portal

To disable or enable public network access in the [Azure portal](https://portal.azure.com), open the portal and navigate to your Azure Digital Twins instance.

1. Select **Networking (preview)** in the left-hand menu.

1. In the **Public access** tab, set **Allow public network access to** either **Disabled** or **All networks**.

    :::row:::
        :::column:::
            :::image type="content" source="media/how-to-enable-private-link/network-flag-portal.png" alt-text="Screenshot of the Azure portal showing the Networking (preview) page for an Azure Digital Twins instance. The Public access tab is highlighted, and the option to choose whether to allow public network access is also highlighted." lightbox="media/how-to-enable-private-link/network-flag-portal.png":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

    Select **Save**.

## Next steps

Learn more about Private Link for Azure: 
* [*What is Azure Private Link service?*](../private-link/private-link-service-overview.md)
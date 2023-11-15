---
title: 'Enable Private Links - Azure Time Series Insights Gen2 | Microsoft Docs'
description: See how to enable private access for Azure Time Series Insights Gen2 solutions with Private Link, using the Azure portal.
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 09/01/2021
---

# Enable private access for TSI with Private Link (preview)

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

This article describes how to [enable Private Link with a private endpoint for an Azure Time Series Insights Gen2 environment](concepts-private-links.md) (currently in preview). Configuring a private endpoint for your Azure Time Series Insights Gen2 environment enables you to secure your Azure Time Series Insights environment and eliminate public exposure, as well as avoid data exfiltration from your [Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md).

This article walks through the process using the [**Azure portal**](https://portal.azure.com).

Here are the steps that are covered in this article: 
1. Turn on Private Link and configure a private endpoint for a Time Series Insights Gen2 environment.
1. Disable or enable public network access flags, to restrict access to Private Link connections only.

> [!NOTE]
> Please note that Private Link for an event source is not supported. Do not restrict Public Internet access to a hub or event source used by Time Series Insights.

## Prerequisites

Before you can set up a private endpoint, you'll need an [**Azure Virtual Network (VNet)**](../virtual-network/virtual-networks-overview.md) where the endpoint can be deployed. If you don't have a VNet already, you can follow one of the Azure Virtual Network [quickstarts](../virtual-network/quick-create-portal.md) to set this up.

## Add a private endpoint for an Azure Time Series Insights Gen2 environment 

When using the [Azure portal](https://portal.azure.com), you can choose to turn on Private Link with a private endpoint for an Azure Time Series Insights Gen2 environment as part of the environment's initial setup, or enable it later on an environment that already exists. 

Either of these creation methods will give the same configuration options and the same end result for your environment. This section describes how to do each one.

>[!TIP]
> You can also set up a Private Link endpoint through the Private Link service, instead of through your Azure Time Series Insights Gen2 environment. This also gives the same configuration options and the same end result.
>
> For more details about setting up Private Link resources, see Private Link documentation for the [Azure portal](../private-link/create-private-endpoint-portal.md), [Azure CLI](../private-link/create-private-endpoint-cli.md), [ARM](../private-link/create-private-endpoint-template.md), or [PowerShell](../private-link/create-private-endpoint-powershell.md).

### Add a private endpoint during environment creation

In this section, you'll enable Private Link with a private endpoint on an Azure Time Series Insights Gen2 environment that is currently being created. This section focuses on the networking step of the creation process; for a complete walkthrough of creating a new Azure Time Series Insights Gen2 environment, see [*How-to: Set up an environment*](tutorial-set-up-environment.md).

The Private Link options are located in the **Networking** tab of environment setup.

In this tab, you can enable private endpoints by selecting the **Private endpoint** option for the **Connectivity method**.

This will add a section called **Private endpoint connections** where you can configure the details of your private endpoint. Select the **+ Add** button to continue.

:::image type="content" source="media/private-links/create-instance-networking.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Time Series Insights Gen2. There's a highlight around the tab name, the Private endpoint option for Connectivity method, and the + Add button to create a new private endpoint connection." lightbox="media/private-links/create-instance-networking.png":::

This will open a page to enter the details of a new private endpoint.

:::image type="content" source="media/private-links/create-private-endpoint.png" alt-text="Screenshot of the Azure portal showing the Create private endpoint page. It contains the fields described below.":::

1. Fill in selections for your **Subscription** and **Resource group**. Set the **Location** to the same location as the VNet you'll be using. Choose a **Name** for the endpoint, and for **Target sub-resources** select *environment* or *tsiExplorer*.

1. Next, select the **Virtual network** and **Subnet** you'd like to use to deploy the endpoint.

1. Lastly, select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).

After filling out the configuration options, Hit **OK** to finish.

This will return you to the **Networking** tab of the Azure Time Series Insights Gen2 environment setup, where your new endpoint should be visible under **Private endpoint connections**.

You can then use the bottom navigation buttons to continue with the rest of environment setup.

### Add a private endpoint to an existing environment

In this section, you'll enable Private Link with a private endpoint for an Azure Time Series Insights Gen2 environment that already exists.

1. First, navigate to the [Azure portal](https://portal.azure.com) in a browser. Bring up your Azure Time Series Insights Gen2 environment by searching for its name in the portal search bar.

1. Select **Networking (preview)** in the left-hand menu.

1. Switch to the **Private endpoint connections** tab.

1. Select **+ Private endpoint** to open the **Create a private endpoint** setup.

    :::image type="content" source="media/private-links/add-private-endpoint.png" alt-text="Screenshot of the Azure portal showing the Networking (preview) page for an Azure Time Series Insights Gen2 environment. The Private endpoint connections tab is highlighted, and the + Private endpoint button is also highlighted." lightbox="media/private-links/add-private-endpoint.png":::

1. In the **Basics** tab, enter or select the **Subscription** and **Resource group** of your project, and a **Name** and **Region** for your endpoint. The region needs to be the same as the region for the VNet you're using.

    :::image type="content" source="media/private-links/create-private-endpoint-2.png" alt-text="Screenshot of the Azure portal showing the first (Basics) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, select the **Next : Resource >** button to go to the next tab.

1. In the **Resource** tab, enter or select this information: 
    * **Connection method**: Select **Connect to an Azure resource in my directory** to search for your Azure Time Series Insights Gen2 environment.
    * **Subscription**: Enter your subscription.
    * **Resource type**: Select **Microsoft.TimeSeriesInsights/environments**
    * **Resource**: Select the name of your Azure Time Series Insights Gen2 environment.
    * **Target sub-resource**: Select **environment** or **tsiExplorer**.

    :::image type="content" source="media/private-links/create-private-endpoint-3.png" alt-text="Screenshot of the Azure portal showing the second (Resource) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, select the **Next : Configuration >** button to go to the next tab.    

1. In the **Configuration** tab, enter or select this information:
    * **Virtual network**: Select your virtual network.
    * **Subnet**: Choose a subnet from your virtual network.
    * **Integrate with private DNS zone**: Select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).
    If you select **Yes**, you can leave the default configuration information.

    :::image type="content" source="media/private-links/create-private-endpoint-4.png" alt-text="Screenshot of the Azure portal showing the third (Configuration) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, you can select the **Review + create** button to finish setup. 

1. In the **Review + create** tab, review your selections and select the **Create** button. 

When the endpoint is finished deploying, it should show up in the private endpoint connections for your Azure Time Series Insights Gen2 environment.

>[!TIP]
> The endpoint can also be viewed from the Private Link Center in the Azure portal.

## Disable / enable public network access flags

You can configure your Azure Time Series Insights Gen2 environment to deny all public connections and allow only connections through private endpoints to enhance the network security. This action is done with a **public network access flag**. 

This policy allows you to restrict access to Private Link connections only. When the public network access flag is set to *disabled*, all REST API calls to the Azure Time Series Insights Gen2 environment data plane from the public cloud will return `403, Unauthorized`. Alternatively, when the policy is set to *disabled* and a request is made through a private endpoint, the API call will succeed.

To disable or enable public network access in the [Azure portal](https://portal.azure.com), open the portal and navigate to your Azure Time Series Insights Gen2 environment.

1. Select **Networking (preview)** in the left-hand menu.

1. In the **Public access** tab, set **Allow public network access to** either **Disabled** or **All networks**.

    :::row:::
        :::column:::
            :::image type="content" source="media/private-links/network-flag-portal.png" alt-text="Screenshot of the Azure portal showing the Networking (preview) page for an Azure Time Series Insights Gen2 environment. The Public access tab is highlighted, and the option to choose whether to allow public network access is also highlighted." lightbox="media/private-links/network-flag-portal.png":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

    Select **Save**.

## Next steps

Learn more about Private Link for Azure: 
* [*What is Azure Private Link service?*](../private-link/private-link-service-overview.md)

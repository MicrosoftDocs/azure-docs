---
title: Subscribe to Grafana Enterprise
description:  Access Grafana Enterprise plugins within Azure Managed Grafana
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 09/27/2022
---

# Subscribe to a Grafana Enterprise plan and start using Grafana Enterprise plugins

In this guide, learn how to activate the Grafana Enterprise add-on in Azure Managed Grafana, update your Grafana Enterprise plan, and access Grafana Enterprise plugins.

The Grafana Enterprise plans offered by Azure Managed Grafana enable users to access [Grafana Enterprise plugins](https://grafana.com/docs/plugins/) to do more with Azure Managed Grafana.

> [!NOTE]
> Some of the Grafana Enterprise plans incur additional costs. Go to [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/) for details.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- This guide assumes that you already know the basics of [creating an Azure Managed Grafana instance](quickstart-managed-grafana-portal.md).

## Activate and manage Grafana Enterprise plans

You can enable access to Grafana Enterprise plugins by selecting a Grafana Enterprise plan when creating a new workspace, or you can update the Grafana Enterprise plan of an already-created Azure Managed Grafana instance.

### Create an Azure Managed Grafana workspace with the Grafana Enterprise option enabled

To activate Grafana Enterprise plugins when creating an Azure Managed Grafana Workspace, in **Create a Grafana Workspace**, go to the Basics tab and follow the steps below:

1. Under **Grafana enterprise add-on**, check the box **Enable**.
1. Under **Plan details**, select a plan.
1. If you selected a paid plan, set **Recurring billing** to **On** or **Off** to indicate if you wish to subscribe to this plan or only try it once until your next billing renewal. Read and check the waiver box.
1. Select **Review + create** and review the information about your new instance, including the costs that may be associated with the Grafana Enterprise plan.
1. Select **Create** to finalize the creation of your new Azure Managed Grafana instance.

### Update the Grafana Enterprise plan of an existing Azure Managed Grafana instance

To update the Grafana Enterprise plan of an existing Azure Managed Grafana instance, follow the steps below:

  1. In the Azure portal, open your Grafana instance and under **Settings**, select **Grafana Enterprise**. This page displays the name of your current pricing plan, price and payment frequency. It also shows your plan's renewal date and a description of your current plan.
  1. Select **Change plan** to review all available Grafana Enterprise plans and select another plan. Then select **Change plan** at the bottom of the page to switch to the selected plan.
  1. Optionally select **Edit recurring billing** to disable or enable your recurring billing. Select **On** to activate recurring billing and agree to be billed on your renewal date, or select **Off** to disable the renewal of your Grafana Enterprise plan. The subscription will expire on the date displayed on screen. To confirm, select **Update**
  1. The **Cancel subscription** option lets you cancel your Grafana Enterprise subscription for your instance. Select **Cancel subscription**, optionally fill out the short survey and then select **Cancel subscription** again.

## Add a Grafana Enterprise add-on to your Azure Managed Grafana instance

1. Open your Azure Managed Grafana instance and select **Configuration >  Plugins** from the left menu.

    :::image type="content" source="media/grafana-enterprise/access-plugins.png" alt-text="Screenshot of the Grafana dashboard. Access API keys page.":::
1. Select a plugin reserved to Grafana Enterprise customers and install the plugin.

## Next steps

In this how-to guide, you learned how to enable Grafana Enterprise plugins. To learn how to configure data sources, go to:

> [!div class="nextstepaction"]
> [Configure data sources](how-to-data-source-plugins-managed-identity.md)

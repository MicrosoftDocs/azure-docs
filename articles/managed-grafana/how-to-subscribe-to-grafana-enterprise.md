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

The Grafana Enterprise plans offered through Azure Managed Grafana enable users to access [Grafana Enterprise plugins](https://grafana.com/docs/plugins/) to do more with Azure Managed Grafana.

Grafana Enterprise plugins:

- AppDynamics
- Azure Devops
- Datadog
- Dynatrace
- GitLab
- Honeycomb
- Jira
- MongoDB
- New Relic
- Oracle Database
- Salesforce
- SAP HANA®
- ServiceNow
- Snowflake
- Splunk
- Splunk Infrastructure Monitoring
- Wavefront

> [!NOTE]
> Grafana Enterprise plugins are directly supported by Grafana Labs.

> [!NOTE]
> Grafana Enterprise is owned and charged by Grafana Labs, through Azure Marketplace.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- This guide assumes that you already know the basics of [creating an Azure Managed Grafana instance](quickstart-managed-grafana-portal.md).

## Activate and manage Grafana Enterprise plans

You can enable access to Grafana Enterprise plugins by selecting a Grafana Enterprise plan when creating a new workspace, or you can add a Grafana Enterprise plan on an already-created Azure Managed Grafana instance.

### Create an Azure Managed Grafana workspace with the Grafana Enterprise option enabled

To activate Grafana Enterprise plugins when creating an Azure Managed Grafana Workspace, in **Create a Grafana Workspace**, go to the **Basics** tab and follow the steps below:

1. Under **Grafana enterprise add-on**, check the box **Enable**.
1. Under **Plan details**, select a plan: free trial or monthly plan.

   > [!NOTE]
   > The Grafana Enterprise monthly plan is a paid plan. Go to [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/) for details.

   > [!NOTE]
   > Each subscription can benefit from one free trial opportunity.

1. If you selected a paid plan, set **Recurring billing** to **On** or **Off** to indicate if you wish to subscribe to this plan or only try it once, until your next billing renewal. Read and check the waiver box.
1. Select **Review + create** and review the information about your new instance, including the costs that may be associated with the Grafana Enterprise plan.
1. Select **Create** to finalize the creation of your new Azure Managed Grafana instance.

### Update an existing Azure Managed Grafana instance

To add or update the Grafana Enterprise plan of an existing Azure Managed Grafana instance, follow the steps below:

  1. In the Azure portal, open your Grafana instance and under **Settings**, select **Grafana Enterprise**. This page displays the name of your current plan, price and payment frequency. It also shows your plan's renewal date and a description of your current plan.
  1. Select **Change plan** to review available Grafana Enterprise plans and select another plan. Then select **Change plan** at the bottom of the page to switch to the selected plan.
  1. Optionally select **Edit recurring billing** to disable or enable your recurring billing. Select **On** to activate recurring billing and agree to be billed on your renewal date, or select **Off** to disable the renewal of your Grafana Enterprise plan. The subscription will expire on the date displayed on screen. To confirm, select **Update**
  1. The **Cancel subscription** option lets you cancel your Grafana Enterprise subscription for your instance. Select **Cancel subscription**, optionally fill out the short survey and then select **Cancel subscription** again.

      > [!NOTE]
      > If you configure Grafana Enterprise data sources and later cancel your subscription, you will lose access to these data sources. Your Grafana Enterprise data sources and associated dashboards will remain in your Grafana instance but you will need to subscribe again to Grafana Enterprise to regain access to your data.

## Start using Grafana Enterprise plugins

Grafana Enterprise gives you access to preinstalled plugins reserved for Grafana Enterprise customers. Once you've completed your subscription, go to the Grafana UI and then select **Configuration >  Data sources** from the left menu to set up a data source.

:::image type="content" source="media/grafana-enterprise/access-data-sources.png" alt-text="Screenshot of the Grafana dashboard. Access data sources.":::

## Next steps

In this how-to guide, you learned how to enable Grafana Enterprise plugins. To learn how to configure data sources, go to:

> [!div class="nextstepaction"]
> [Configure data sources](how-to-data-source-plugins-managed-identity.md)

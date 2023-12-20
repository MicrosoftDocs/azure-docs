---
title: Subscribe to Grafana Enterprise
description:  Activate Grafana Enterprise to access Grafana Enterprise plugins within Azure Managed Grafana
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 10/06/2023
---

# Enable Grafana Enterprise

In this guide, learn how to activate the Grafana Enterprise add-on in Azure Managed Grafana, update your Grafana Enterprise plan, and access [Grafana Enterprise plugins](https://grafana.com/docs/plugins/).

The Grafana Enterprise plans offered through Azure Managed Grafana enable users to access Grafana Enterprise plugins to do more with Azure Managed Grafana.

>[!NOTE]
> To activate the Grafana Enterprise option, your Azure Managed Grafana instance must be using the Standard plan. For more information about plans, go to [pricing plans](overview.md#service-tiers).

Grafana Enterprise plugins, as of October 2023:

- AppDynamics
- Azure DevOps
- Databricks
- Datadog
- Dynatrace
- GitLab
- Honeycomb
- Jira
- k6 Cloud App
- Looker
- MongoDB
- New Relic
- Oracle Database
- Salesforce
- SAP HANA®
- ServiceNow
- Snowflake
- Splunk
- Splunk Infrastructure Monitoring
- Sqlyze Datasource
- Wavefront

> [!NOTE]
> Grafana Enterprise plugins are directly supported by Grafana Labs. For more information and an updated list, go to [Grafana Enterprise plugins](https://grafana.com/docs/plugins/).

You can enable access to Grafana Enterprise plugins by selecting a Grafana Enterprise plan when creating a new workspace, or you can add a Grafana Enterprise plan on an already-created Azure Managed Grafana instance.

> [!NOTE]
> The Grafana Enterprise monthly plan is a paid plan, owned and charged by Grafana Labs, through Azure Marketplace. Go to [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/) for details.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- This guide assumes that you already know the basics of [creating an Azure Managed Grafana instance](quickstart-managed-grafana-portal.md).

## Create a workspace with Grafana Enterprise enabled

When [creating a new Azure Managed Grafana workspace](quickstart-managed-grafana-portal.md) and filling out the **Basics** tab of the creation form, follow the steps below:

1. Under **Project Details**, select an Azure subscription and enter a resource group name or use the generated suggested resource group name
1. Under **Instance Details**, select an Azure region and enter a resource name.
1. Under **Pricing Plans**, select the **Standard** plan.
1. Under **Grafana Enterprise**, check the box **Grafana Enterprise**, select **Free Trial - Azure Managed Grafana Enterprise Upgrade** and keep the option **Recurring billing** on **Disabled**.

    :::image type="content" source="media/grafana-enterprise/create-with-enterprise-plan.png" alt-text="Screenshot of the Grafana dashboard, instance creation basic details.":::

    > [!CAUTION]
    > Each Azure subscription can benefit from one free Grafana Enterprise trial. The free trial lets you try the Grafana Enterprise plan for one month. If you select a free trial and enable recurring billing, you will start getting charged after the end of your first month. Disable recurring billing if you just want to test Grafana Enterprise.

1. Select **Review + create** and review the information about your new instance, including the costs that may be associated with the Grafana Enterprise plan and potential other paid options.

    :::image type="content" source="media/grafana-enterprise/creation-cost-review.png" alt-text="Screenshot of the Grafana dashboard. Workspace information and cost review.":::

1. Read and check the box at the bottom of the page to state that you agree with the terms displayed, and select **Create** to finalize the creation of your new Azure Managed Grafana instance.

## Activate Grafana Enterprise on an existing workspace

To enable Grafana Enterprise on an existing Azure Managed Grafana instance, follow the steps below:

  1. In the Azure portal, open your Grafana instance and under **Settings**, select **Grafana Enterprise**.
       :::image type="content" source="media/grafana-enterprise/enable-grafana-enterprise.png" alt-text="Screenshot of the Grafana dashboard showing how to enable Grafana enterprise on an existing workspace." lightbox="media/grafana-enterprise/enable-grafana-enterprise.png":::
  1. Select **Free Trial - Azure Managed Grafana Enterprise Upgrade** to test Grafana Enterprise for free or select the monthly plan. Review the associated costs to make sure that you selected a plan that suits you. Recurring billing is disabled by default.
        > [!CAUTION]
        > Each Azure subscription can benefit from one free Grafana Enterprise trial. The free trial lets you try the Grafana Enterprise plan for one month. If you select a free trial and enable recurring billing, you will start getting charged after the end of your first month. Disable recurring billing if you just want to test Grafana Enterprise.

  1. Read and check the box at the bottom of the page to state that you agree with the terms displayed, and select **Update** to finalize the creation of your new Azure Managed Grafana instance.

## Update a Grafana Enterprise plan

To update the Grafana Enterprise plan of an existing Azure Managed Grafana instance, optionally follow the steps below:

  1. In the Azure portal, open your Grafana instance and under **Settings**, select **Grafana Enterprise**. Review the available information about your current plan, price and billing.
    :::image type="content" source="media/grafana-enterprise/update-grafana-enterprise.png" alt-text="Screenshot of the Grafana dashboard showing how to update a Grafana Enterprise plan." lightbox="media/grafana-enterprise/update-grafana-enterprise.png":::
  1. Select **Change plan** to review available Grafana Enterprise plans and select another plan. Then select **Update** at the bottom of the page to switch to the selected plan.
  1. Select **Edit recurring billing** and select **Enabled** to activate recurring billing and agree to be billed on your renewal date, or select **Disabled** to disable the renewal of your Grafana Enterprise plan. The subscription will expire on the date displayed on screen. To confirm, select **Update**.
  1. Select **Cancel enterprise** option to cancel the Grafana Enterprise subscription. Enter the name of the plan and select **Cancel enterprise** again to confirm.

      > [!NOTE]
      > If you configure Grafana Enterprise data sources and later cancel your subscription, you will no longer have access to them. Your Grafana Enterprise data sources and associated dashboards will remain in your Grafana instance but you will need to subscribe again to Grafana Enterprise to regain access to your data.

The Azure platform displays some useful links at the bottom of the page.

## Start using Grafana Enterprise plugins

Grafana Enterprise gives you access to preinstalled plugins reserved for Grafana Enterprise customers. Once you've activated a Grafana Enterprise plan, go to the Grafana platform and select **Connections > Connect data** from the left menu to create a new connection using the newly accessible data sources.

:::image type="content" source="media/grafana-enterprise/access-data-sources.png" alt-text="Screenshot of the Grafana dashboard. Access data sources.":::

## Next steps

In this how-to guide, you learned how to enable Grafana Enterprise plugins. To learn how to configure data sources, go to:

> [!div class="nextstepaction"]
> [Configure data sources](how-to-data-source-plugins-managed-identity.md)

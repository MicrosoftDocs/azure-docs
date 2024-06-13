---
title: 'Quickstart: Onboard to Microsoft Sentinel'
description: In this quickstart, you enable Microsoft Sentinel, and set up data connectors to monitor and protect your environment.
author: yelevin
ms.author: yelevin
ms.topic: quickstart
ms.date: 06/14/2023
ms.custom: references_regions, mode-other
#Customer intent: As a security operator, set up data connectors in one place so I can monitor and protect my environment.
---

# Quickstart: Onboard Microsoft Sentinel

In this quickstart, you'll enable Microsoft Sentinel and install a solution from the content hub. Then, you'll set up a data connector to start ingesting data into Microsoft Sentinel.

Microsoft Sentinel comes with many data connectors for Microsoft products such as the Microsoft Defender XDR service-to-service connector. You can also enable built-in connectors for non-Microsoft products such as Syslog or Common Event Format (CEF). For this quickstart, you'll use the Azure Activity data connector that's available in the Azure Activity solution for Microsoft Sentinel.

## Prerequisites

- **Active Azure Subscription**. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- **Log Analytics workspace**. Learn how to [create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md). For more information about Log Analytics workspaces, see [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/workspace-design.md).

    You may have a default of [30 days retention](../azure-monitor/logs/cost-logs.md#legacy-pricing-tiers) in the Log Analytics workspace used for Microsoft Sentinel. To make sure that you can use all Microsoft Sentinel functionality and features, raise the retention to 90 days. [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md).

- **Permissions**:

    - To enable Microsoft Sentinel, you need **contributor** permissions to the subscription in which the Microsoft Sentinel workspace resides.

    - To use Microsoft Sentinel, you need either **Microsoft Sentinel Contributor** or **Microsoft Sentinel Reader** permissions on the resource group that the workspace belongs to.
    - To install or manage solutions in the content hub, you need the **Microsoft Sentinel Contributor** role on the resource group that the workspace belongs to.

- **Microsoft Sentinel is a paid service**. Review the [pricing options](https://go.microsoft.com/fwlink/?linkid=2104058) and the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).

- Before deploying Microsoft Sentinel to a production environment, review the [predeployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md).

## Enable Microsoft Sentinel <a name="enable"></a>

To get started, add Microsoft Sentinel to an existing workspace or create a new one.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Sentinel**.

    :::image type="content" source="media/quickstart-onboard/search-product.png" alt-text="Screenshot of searching for a service while enabling Microsoft Sentinel.":::   

1. Select **Create**.

1. Select the workspace you want to use or create a new one. You can run Microsoft Sentinel on more than one workspace, but the data is isolated to a single workspace.

    :::image type="content" source="media/quickstart-onboard/choose-workspace.png" alt-text="Screenshot of choosing a workspace while enabling Microsoft Sentinel.":::      
 
   - The default workspaces created by Microsoft Defender for Cloud aren't shown in the list. You can't install Microsoft Sentinel on these workspaces.
   - Once deployed on a workspace, Microsoft Sentinel **doesn't support** moving that workspace to another resource group or subscription.

1. Select **Add**.

As an alternative to using the portal, you can onboard to Microsoft Sentinel using an API request, by calling the [OnboardingStates ARM api](/rest/api/securityinsights/sentinel-onboarding-states/create?view=rest-securityinsights-2024-03-01&preserve-view=true&tabs=HTTP).

## Install a solution from the content hub

The content hub in Microsoft Sentinel is the centralized location to discover and manage out-of-the-box content including data connectors. For this quickstart, install the solution for Azure Activity.

1. In Microsoft Sentinel, select **Content hub**.

1. Find and select the **Azure Activity** solution.

   :::image type="content" source="media/quickstart-onboard/content-hub-azure-activity.png" alt-text="Screenshot of the content hub with the solution for Azure Activity selected.":::

1. On the toolbar at the top of the page, select :::image type="icon" source="media/quickstart-onboard/install-update-button.png"::: **Install/Update**.

## Set up the data connector

Microsoft Sentinel ingests data from services and apps by connecting to the service and forwarding the events and logs to Microsoft Sentinel. For this quickstart, install the data connector to forward data for Azure Activity to Microsoft Sentinel.
 
1. In Microsoft Sentinel, select **Data connectors**.

1. Search for and select the **Azure Activity** data connector.

1. In the details pane for the connector, select **Open connector page**.

1. Review the instructions to configure the connector.

1. Select **Launch Azure Policy Assignment Wizard**.

1. On the **Basics** tab, set the **Scope** to the subscription and resource group that has activity to send to Microsoft Sentinel. For example, select the subscription that contains your Microsoft Sentinel instance.

1. Select the **Parameters** tab.

1. Set the **Primary Log Analytics workspace**. This should be the workspace where Microsoft Sentinel is installed.

1. Select **Review + create** and **Create**.

## Generate activity data

Let's generate some activity data by enabling a rule that was included in the Azure Activity solution for Microsoft Sentinel. This step also shows you how to manage content in the content hub.

1. In Microsoft Sentinel, select **Content hub**.

1. Find and select the **Azure Activity** solution.

1. From the right-hand side pane, select **Manage**.

1. Find and select the rule template **Suspicious Resource deployment**.

1. Select **Configuration**.

1. Select the rule and **Create rule**.

1. On the **General** tab, change the **Status** to enabled. Leave the rest of the default values.

1. Accept the defaults on the other tabs.

1. On the **Review and create** tab, select **Create**.

## View data ingested into Microsoft Sentinel

Now that you've enabled the Azure Activity data connector and generated some activity data let's view the activity data added to the workspace.

1. In Microsoft Sentinel, select **Data connectors**.

1. Search for and select the **Azure Activity** data connector.

1. In the details pane for the connector, select **Open connector page**.

1. Review the **Status** of the data connector. It should be **Connected**.

   :::image type="content" source="media/quickstart-onboard/azure-activity-connected-status.png" alt-text="Screenshot of data connector for Azure Activity with the status showing as connected.":::

1. In the left-hand side pane above the chart, select **Go to log analytics**.

1. On the top of the pane, next to the **New query 1** tab, select the **+** to add a new query tab.

1. In the query pane, run the following query to view the activity date ingested into the workspace.

   ```kusto
    AzureActivity
   ```

   :::image type="content" source="media/quickstart-onboard/azure-activity-logs-query.png" alt-text="Screenshot of the log query window with results returned for the Azure Activity query.":::

## Next steps

In this quickstart, you enabled Microsoft Sentinel and installed a solution from the content hub. Then, you set up a data connector to start ingesting data into Microsoft Sentinel. You also verified that data is being ingested by viewing the data in the workspace.

- To visualize the data you've collected by using the dashboards and workbooks, see [Visualize collected data](get-visibility.md).
- To detect threats by using analytics rules, see [Tutorial: Detect threats by using analytics rules in Microsoft Sentinel](tutorial-log4j-detection.md).

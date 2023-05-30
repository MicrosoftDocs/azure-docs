---
title: 'Quickstart: Onboard in Microsoft Sentinel'
description: In this quickstart, you enable Microsoft Sentinel, and set up data connectors to monitor and protect your environment.
author: yelevin
ms.author: yelevin
ms.topic: quickstart
ms.date: 05/18/2023
ms.custom: references_regions, ignite-fall-2021, mode-other
#Customer intent: As a security operator, set up data connectors in one place so I can monitor and protect my environment.
---

# Quickstart: Onboard Microsoft Sentinel

In this quickstart, you'll enable Microsoft Sentinel and install a solution from the content hub. Then, you'll set up a data connector to start ingesting data into Microsoft Sentinel.

Microsoft Sentinel comes with many data connectors for Microsoft products such as the Microsoft 365 Defender service-to-service connector. You can also enable built-in connectors for non-Microsoft products such as Syslog or Common Event Format (CEF). For this quickstart, you'll use the Azure Activity data connector that's available in the Azure Activity solution for Microsoft Sentinel.

## Prerequisites

- **Active Azure Subscription**. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- **Log Analytics workspace**. Learn how to [create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md). For more information about Log Analytics workspaces, see [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/workspace-design.md).

    You may have a default of [30 days retention](../azure-monitor/logs/cost-logs.md#legacy-pricing-tiers) in the Log Analytics workspace used for Microsoft Sentinel. To make sure that you can use all Microsoft Sentinel functionality and features, raise the retention to 90 days. [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md).

- **Permissions**:

    - To enable Microsoft Sentinel, you need **contributor** permissions to the subscription in which the Microsoft Sentinel workspace resides.

    - To use Microsoft Sentinel, you need either **contributor** or **reader** permissions on the resource group that the workspace belongs to.
    - To install or manage solutions in the content hub, you need the **Template Spec Contributor** role on the resource group that the workspace belongs to.

- **Microsoft Sentinel is a paid service**. Review the [pricing options](https://go.microsoft.com/fwlink/?linkid=2104058) and the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).

- Before deploying Microsoft Sentinel to a production environment, review the [pre-deployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md).

## Enable Microsoft Sentinel <a name="enable"></a>

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Sentinel**.

    :::image type="content" source="media/quickstart-onboard/search-product.png" alt-text="Screenshot of searching for a service while enabling Microsoft Sentinel.":::   

1. Select **Add**.

1. Select the workspace you want to use or create a new one. You can run Microsoft Sentinel on more than one workspace, but the data is isolated to a single workspace. Note that default workspaces created by Microsoft Defender for Cloud are not shown in the list. You can't install Microsoft Sentinel on these workspaces.

    :::image type="content" source="media/quickstart-onboard/choose-workspace.png" alt-text="Screenshot of choosing a workspace while enabling Microsoft Sentinel.":::      
   
   >[!IMPORTANT]
   >
   > - Once deployed on a workspace, Microsoft Sentinel **does not currently support** the moving of that workspace to other resource groups or subscriptions. 
   >
   >   If you have already moved the workspace, disable all active rules under **Analytics** and re-enable them after five minutes. This should be effective in most cases, though, to reiterate, it is unsupported and undertaken at your own risk.

1. Select **Add Microsoft Sentinel**.

## Install a solution from the content hub

The content hub in Microsoft Sentinel is the centralized location to discover and manage out-of-the-box (built-in) content including data connectors.

1. In Microsoft Sentinel, select **Content hub**.

1. Find and select the **Azure Activity** solution.

1. Select **Install** and then **Create**.
1. On the **Basics** tab, select the **Resource group** and **Workspace** where Microsoft Sentinel is enabled.
1. Select **Review + create**.

## Set up the data connector

Microsoft Sentinel ingests data from services and apps by connecting to the service and forwarding the events and logs to Microsoft Sentinel. For this quickstart, you'll install the data connector to forward data for Azure Activity to Microsoft Sentinel.
 
1. In the Azure portal, search for and select **Microsoft Sentinel**.
1. In Microsoft Sentinel, select **Data connectors**.
1. Search for and select the **Azure Activity** data connector.
1. In the details pane for the connector, select **Open connector page**.
1. Review the instructions to configure the connector.
1. Select **Launch Azure Policy Assignment Wizard**.
1. On the **Basics** tab, set the **Scope** to the subscription and resource group that has activity to send to Microsoft Sentinel. For example, use the subscription and resource group that contains your Microsoft Sentinel instance.
1. Select the **Parameters** tab.
1. Set the **Primary Log Analytics workspace**. This should be the workspace where Microsoft Sentinel is installed.
1. Select **Review + create** and **Create**.

After you set up your data connectors, your data starts streaming into Microsoft Sentinel and is ready for you to start working with. You can view the logs in the [built-in workbooks](get-visibility.md) and start building queries in Log Analytics to [investigate the data](investigate-cases.md).

Review the [data collection best practices](best-practices-data.md).

## View data ingested into Microsoft Sentinel


## Next steps

In this quickstart, you enabled Microsoft Sentinel and installed a solution from the content hub. Then, you set up a data connector to start ingesting data into Microsoft Sentinel.
Go to the next article to learn how to visualize the data you've collected by using the dashboards and workbooks.
> [!div class="nextstepaction"]
> [Next steps button](get-visibility.md)
---
title: Onboard to Microsoft Sentinel
description: In this quickstart, you enable Microsoft Sentinel, and set up data connectors to monitor and protect your environment.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 06/12/2025
ms.custom: references_regions, mode-other
#Customer intent: As a security operator, set up data connectors in one place so I can monitor and protect my environment.


#Customer intent: As a security analyst, I want to onboard to Microsoft Sentinel so that I can ingest and monitor security data from various sources for threat detection and response.

---

# Onboard Microsoft Sentinel

In this quickstart, you'll enable Microsoft Sentinel and install a solution from the content hub. Then, you'll set up a data connector to start ingesting data into Microsoft Sentinel.

Microsoft Sentinel comes with many data connectors for Microsoft products such as the Microsoft Defender XDR service-to-service connector. You can also enable built-in connectors for non-Microsoft products such as Syslog or Common Event Format (CEF). For this quickstart, you'll use the Azure Activity data connector that's available in the Azure Activity solution for Microsoft Sentinel.

To onboard to Microsoft Sentinel by using the API, see the latest supported version of [Sentinel Onboarding States](/rest/api/securityinsights/sentinel-onboarding-states). 

## Prerequisites

- **Active Azure Subscription**. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- **Log Analytics workspace**. Learn how to [create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace). For more information about Log Analytics workspaces, see [Designing your Azure Monitor Logs deployment](/azure/azure-monitor/logs/workspace-design).

    You may have a default of [30 days retention](/azure/azure-monitor/logs/cost-logs#legacy-pricing-tiers) in the Log Analytics workspace used for Microsoft Sentinel. To make sure that you can use all Microsoft Sentinel functionality and features, raise the retention to 90 days. [Configure data retention and archive policies in Azure Monitor Logs](/azure/azure-monitor/logs/data-retention-configure).

- **Permissions**:

    - To enable Microsoft Sentinel, you need **contributor** permissions to the subscription in which the Microsoft Sentinel workspace resides.

    - To use Microsoft Sentinel, you need either **Microsoft Sentinel Contributor** or **Microsoft Sentinel Reader** permissions on the resource group that the workspace belongs to.

    - To install or manage solutions in the content hub, you need the **Microsoft Sentinel Contributor** role on the resource group that the workspace belongs to.

    - If you have permissions of a subscription [Owner](/azure/role-based-access-control/built-in-roles#owner) or a [User access administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), your workspace is automatically onboarded to the Defender portal. Users of such workspaces use [Microsoft Sentinel in the Defender portal](../microsoft-sentinel-defender-portal.md) only.

- **Microsoft Sentinel is a paid service**. Review the [pricing options](https://go.microsoft.com/fwlink/?linkid=2104058) and the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).

- Before deploying Microsoft Sentinel to a production environment, review the [predeployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md).


<a name="enable"></a>

## Enable Microsoft Sentinel

To get started, add Microsoft Sentinel to an existing workspace or create a new one.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **Microsoft Sentinel**.

    :::image type="content" source="media/quickstart-onboard/search-product.png" alt-text="Screenshot of searching for a service while enabling Microsoft Sentinel.":::   

1. Select **Create**.

1. Select the workspace you want to use or create a new one. You can run Microsoft Sentinel on more than one workspace, but data is isolated to a single workspace.

    :::image type="content" source="media/quickstart-onboard/choose-workspace.png" alt-text="Screenshot of choosing a workspace while enabling Microsoft Sentinel.":::
 
   - The default workspaces created by Microsoft Defender for Cloud aren't shown in the list. You can't install Microsoft Sentinel on these workspaces.
   - Once deployed on a workspace, Microsoft Sentinel **doesn't support** moving that workspace to another resource group or subscription.

1. Select **Add**.

> [!TIP]
> If your workspace isn't automatically onboarded to the Defender portal, we recommend onboarding for a unified experience in managing security operations (SecOps) across both Microsoft Sentinel and other Microsoft security services.
>
> If your workspace is automatically onboarded, or if you decide to onboard your workspace now, you can continue the procedures in this article from the Defender portal. For more information, see [Onboard Microsoft Sentinel to the Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).

## Access Microsoft Sentinel in the Defender portal

This procedure is relevant if you're automatically onboarded to the Defender portal, or if you choose to onboard your workspace to the Defender portal after enabling Microsoft Sentinel.

In most cases, users of workspaces that are automatically onboarded to the Defender portal use Microsoft Sentinel in the Defender portal only, and are redirected to the Defender portal from Microsoft Sentinel in the Azure portal.

The exception is for Azure Lighthouse-delegated users who are accessing a new customer workspace onboarded to Microsoft Sentinel in the Azure portal. These users won't see the automatic redirection and can work in the Azure portal.

**To access Microsoft Sentinel in the Defender portal:**

1. Sign into the [Defender portal](https://security.microsoft.com).

    The first time you access the Defender portal, it'll take some time to provision your tenant.

1. Once provisioned, you'll see **Microsoft Sentinel** available in the navigation pane, with Microsoft Sentinel nodes nested within. For example:

    :::image type="content" source="media/quickstart-onboard/defender-portal-initial-view.png" alt-text="Screenshot of Microsoft Sentinel in the Defender portal.":::

1. Scroll down in the navigation pane, and select **Settings > Microsoft Sentinel > Workspaces** to view the workspaces onboarded to the Defender portal and available to you.

The Defender portal supports multiple workspaces, with one workspace acting as the primary workspace per tenant. For more information, see [Multiple Microsoft Sentinel workspaces in the Defender portal](workspaces-defender-portal.md) and [Microsoft Defender multitenant management](/defender-xdr/mto-overview).

## Install a solution from the content hub

The content hub in Microsoft Sentinel is the centralized location to discover and manage out-of-the-box content including data connectors. For this quickstart, install the solution for Azure Activity.

1. In Microsoft Sentinel, browse to the **Content hub** page, and find and select the **Azure Activity** solution.

   #### [Defender portal](#tab/defender-portal)

   :::image type="content" source="media/quickstart-onboard/content-hub-azure-activity-defender.png" alt-text="Screenshot of the content hub in the Defender portal with the solution for Azure Activity selected.":::

   #### [Azure portal](#tab/azure-portal)

   :::image type="content" source="media/quickstart-onboard/content-hub-azure-activity.png" alt-text="Screenshot of the content hub in the Azure portal with the solution for Azure Activity selected.":::

   ---

1. On the solution details pane on the side, select **Install**. 

## Set up the data connector

Microsoft Sentinel ingests data from services and apps by connecting to the service and forwarding the events and logs to Microsoft Sentinel. For this quickstart, install the data connector to forward data for Azure Activity to Microsoft Sentinel.

1. In Microsoft Sentinel, select **Configuration** > **Data connectors** and search for and select the **Azure Activity** data connector.

1. In the connector details pane, select **Open connector page**. Use the instructions on the **Azure Activity** connector page to set up the data connector.

    1. Select **Launch Azure Policy Assignment Wizard**.

    1. On the **Basics** tab, set the **Scope** to the subscription and resource group that has activity to send to Microsoft Sentinel. For example, select the subscription that contains your Microsoft Sentinel instance.

    1. Select the **Parameters** tab, and set the **Primary Log Analytics workspace**. This should be the workspace where Microsoft Sentinel is installed.

    1. Select **Review + create** and **Create**.

## Generate activity data

Let's generate some activity data by enabling a rule that was included in the Azure Activity solution for Microsoft Sentinel. This step also shows you how to manage content in the content hub.

1. In Microsoft Sentinel, select **Content hub** and search for and select **Suspicious Resource deployment** rule template in the **Azure Activity** solution.

1. In the details pane, select **Create rule** to create a new rule using the **Analytics rule wizard**.

1. In the **Analytics rule wizard - Create a new Scheduled rule** page, change the **Status** to **Enabled**. 

    On this tab and all other tabs in the wizard, leave the default values as they are.

1. On the **Review and create** tab, select **Create**.

## View data ingested into Microsoft Sentinel

Now that you've enabled the Azure Activity data connector and generated some activity data let's view the activity data added to the workspace.

1. In Microsoft Sentinel, select **Configuration** > **Data connectors** and search for and select the **Azure Activity** data connector.

1. In the connector details pane, select **Open connector page**. 

1. Review the **Status** of the data connector. It should be **Connected**.

   :::image type="content" source="media/quickstart-onboard/azure-activity-connected-status.png" alt-text="Screenshot of data connector for Azure Activity with the status showing as connected.":::

1. Select a tab to continue, depending on which portal you're using:

   #### [Defender portal](#tab/defender-portal)

   1. Select **Go to log analytics** to open the **Advanced hunting** page.

    1. On the top of the pane, next to the **New query** tab, select the **+** to add a new query tab.

    1. Run the following query to view the activity date ingested into the workspace:

        ```kusto
        AzureActivity
       ```

    For example:

   :::image type="content" source="media/quickstart-onboard/content-hub-azure-activity-defender.png" alt-text="Screenshot of the AzureActivity query in the Logs page of the Defender portal.":::

   #### [Azure portal](#tab/azure-portal)

    1. Select **Go to query** to open the **Logs** page in the Azure portal.

    1. On the top of the pane, next to the **New query 1** tab, select the **+** to add a new query tab.

    1. On the side, switch from **Simple mode** to **KQL mode**, and run the following query to view the activity date ingested into the workspace:

        ```kusto
        AzureActivity
       ```

    For example:

   :::image type="content" source="media/quickstart-onboard/azure-activity-logs-query.png" alt-text="Screenshot of the AzureActivity query in the Logs page of the Azure portal.":::

   ---

## Next steps

In this quickstart, you enabled Microsoft Sentinel and installed a solution from the content hub. Then, you set up a data connector to start ingesting data into Microsoft Sentinel. You also verified that data is being ingested by viewing the data in the workspace.

If you're a new customer who's been automatically onboarded to the Defender portal, your users will access Microsoft Sentinel in the Defender portal only. As you use the Microsoft Sentinel documentation, make sure to select the Defender portal version of the documentation.

- To visualize the data you've collected by using the dashboards and workbooks, see [Visualize collected data](get-visibility.md).
- To detect threats by using analytics rules, see [Tutorial: Detect threats by using analytics rules in Microsoft Sentinel](tutorial-log4j-detection.md).

---
title: 'Quickstart: Onboard in Microsoft Sentinel'
description: In this quickstart, learn how to on-board Microsoft Sentinel by first enabling it, and then connecting data sources.
author: yelevin
ms.author: yelevin
ms.topic: quickstart
ms.date: 11/09/2021
ms.custom: references_regions, ignite-fall-2021, mode-other
#Customer intent: As a security operator, connect all my data sources in one place so I can monitor and protect my environment.
---

# Quickstart: On-board Microsoft Sentinel

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

In this quickstart, learn how to on-board Microsoft Sentinel. To on-board Microsoft Sentinel, you first need to enable Microsoft Sentinel, and then connect your data sources.

Microsoft Sentinel comes with a number of connectors for Microsoft solutions, available out of the box and providing real-time integration, including Microsoft 365 Defender (formerly Microsoft Threat Protection) solutions, Microsoft 365 sources (including Office 365), Azure AD, Microsoft Defender for Identity (formerly Azure ATP), Microsoft Defender for Cloud Apps, security alerts from Microsoft Defender for Cloud, and more. In addition, there are built-in connectors to the broader security ecosystem for non-Microsoft solutions. You can also use Common Event Format (CEF), Syslog or REST-API to connect your data sources with Microsoft Sentinel.

After you connect your data sources, choose from a gallery of expertly created workbooks that surface insights based on your data. These workbooks can be easily customized to your needs.

>[!IMPORTANT]
> For information about the charges incurred when using Microsoft Sentinel, see [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel/) and [Microsoft Sentinel costs and billing](billing.md).

## Global prerequisites

- **Active Azure Subscription**. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- **Log Analytics workspace**. Learn how to [create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md). For more information about Log Analytics workspaces, see [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/design-logs-deployment.md).

    By default, you may have a default of [30 days retention](../azure-monitor/logs/manage-cost-storage.md#legacy-pricing-tiers) in the Log Analytics workspace used for Microsoft Sentinel. To make sure that you can use the full extent of Microsoft Sentinel functionality, raise this to 90 days. For more information, see [Change the retention period](../azure-monitor/logs/manage-cost-storage.md#change-the-data-retention-period).

- **Permissions**:

    - To enable Microsoft Sentinel, you need **contributor** permissions to the subscription in which the Microsoft Sentinel workspace resides. 

    - To use Microsoft Sentinel, you need either **contributor** or **reader** permissions on the resource group that the workspace belongs to.

    - Additional permissions may be needed to connect specific data sources.

- **Microsoft Sentinel is a paid service**. For more information, see [About Microsoft Sentinel](https://go.microsoft.com/fwlink/?linkid=2104058) and the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/)

For more information, see [Pre-deployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md).

### Geographical availability and data residency

- Microsoft Sentinel can run on workspaces in most [regions where Log Analytics is generally available](https://azure.microsoft.com/global-infrastructure/services/?products=monitor). Regions where Log Analytics is newly available may take some time to onboard the Microsoft Sentinel service. 

- See [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/) for information on [Geos and regions](https://azure.microsoft.com/global-infrastructure/data-residency/#select-geography) and on [where customer data is stored](https://azure.microsoft.com/global-infrastructure/data-residency/#more-information).

- Single-region data residency is currently provided only in the Southeast Asia (Singapore) region of the Asia Pacific geography, and in the Brazil South (Sao Paulo State) region of the Brazil geography.

    > [!IMPORTANT]
    > - By enabling certain rules that make use of the machine learning (ML) engine, **you give Microsoft permission to copy relevant ingested data outside of your Microsoft Sentinel workspace's geography** as may be required by the machine learning engine to process these rules.

## Enable Microsoft Sentinel <a name="enable"></a>

1. Sign in to the Azure portal. Make sure that the subscription in which Microsoft Sentinel is created is selected.

1. Search for and select **Microsoft Sentinel**.

   ![Services search](./media/quickstart-onboard/search-product.png)

1. Select **Add**.

1. Select the workspace you want to use or create a new one. You can run Microsoft Sentinel on more than one workspace, but the data is isolated to a single workspace.

   ![Choose a workspace](./media/quickstart-onboard/choose-workspace.png)

   >[!NOTE] 
   > - Default workspaces created by Microsoft Defender for Cloud will not appear in the list; you can't install Microsoft Sentinel on them.
   >

   >[!IMPORTANT]
   >
   > - Once deployed on a workspace, Microsoft Sentinel **does not currently support** the moving of that workspace to other resource groups or subscriptions. 
   >
   >   If you have already moved the workspace, disable all active rules under **Analytics** and re-enable them after five minutes. This should be effective in most cases, though, to reiterate, it is unsupported and undertaken at your own risk.

1. Select **Add Microsoft Sentinel**.

## Connect data sources

Microsoft Sentinel ingests data from services and apps by connecting to the service and forwarding the events and logs to Microsoft Sentinel. For physical and virtual machines, you can install the Log Analytics agent that collects the logs and forwards them to Microsoft Sentinel. For Firewalls and proxies, Microsoft Sentinel installs the Log Analytics agent on a Linux Syslog server, from which the agent collects the log files and forwards them to Microsoft Sentinel. 
 
1. From the main menu, select **Data connectors**. This opens the data connectors gallery.

1. The gallery is a list of all the data sources you can connect. Select a data source and then the **Open connector page** button.

1. The connector page shows instructions for configuring the connector, and any additional instructions that may be necessary.

    For example, if you select the **Azure Active Directory** data source, which lets you stream logs from Azure AD into Microsoft Sentinel, you can select what type of logs you want to get - sign-in logs and/or audit logs. <br> Follow the installation instructions or [refer to the relevant connection guide](data-connectors-reference.md) for more information. For information about data connectors, see [Microsoft Sentinel data connectors](connect-data-sources.md).

1. The **Next steps** tab on the connector page shows relevant built-in workbooks, sample queries, and analytics rule templates that accompany the data connector. You can use these as-is or modify them - either way you can immediately get interesting insights across your data.

After your data sources are connected, your data starts streaming into Microsoft Sentinel and is ready for you to start working with. You can view the logs in the [built-in workbooks](get-visibility.md) and start building queries in Log Analytics to [investigate the data](investigate-cases.md).

For more information, see [Data collection best practices](best-practices-data.md).

## Next steps

For more information, see:

- **Alternate deployment / management options**:

    - [Deploy Microsoft Sentinel via ARM template](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/Sentinel-All-In-One)
    - [Manage Microsoft Sentinel via API](/rest/api/securityinsights/)
    - [Manage Microsoft Sentinel via PowerShell](https://www.powershellgallery.com/packages/Az.SecurityInsights/0.1.0)

- **Get started**:
    - [Get started with Microsoft Sentinel](get-visibility.md)
    - [Create custom analytics rules to detect threats](detect-threats-custom.md)
    - [Connect your external solution using Common Event Format](connect-common-event-format.md)
---
title: 'Quickstart: Onboard in Microsoft Sentinel'
description: In this quickstart, you enable Microsoft Sentinel, and set up data connectors to monitor and protect your environment.
author: yelevin
ms.author: yelevin
ms.topic: quickstart
ms.date: 07/14/2022
ms.custom: references_regions, ignite-fall-2021, mode-other
#Customer intent: As a security operator, set up data connectors in one place so I can monitor and protect my environment.
---

# Quickstart: Onboard Microsoft Sentinel

In this quickstart, you enable Microsoft Sentinel, and then set up data connectors to monitor and protect your environment. After you connect your data sources using data connectors, you choose from a gallery of expertly created workbooks that surface insights based on your data. These workbooks can be easily customized to your needs.

Microsoft Sentinel comes with many connectors for Microsoft products, for example, the Microsoft 365 Defender service-to-service connector. You can also enable built-in connectors for non-Microsoft products, for example, Syslog or Common Event Format (CEF). [Learn more about data connectors](connect-data-sources.md).

>[!IMPORTANT]
> Review the [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel/) and [Microsoft Sentinel costs and billing](billing.md) information.

## Global prerequisites

- **Active Azure Subscription**. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- **Log Analytics workspace**. Learn how to [create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md). For more information about Log Analytics workspaces, see [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/workspace-design.md).

    You may have a default of [30 days retention](../azure-monitor/logs/cost-logs.md#legacy-pricing-tiers) in the Log Analytics workspace used for Microsoft Sentinel. To make sure that you can use all Microsoft Sentinel functionality and features, raise the retention to 90 days. [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md).

- **Permissions**:

    - To enable Microsoft Sentinel, you need **contributor** permissions to the subscription in which the Microsoft Sentinel workspace resides. 

    - To use Microsoft Sentinel, you need either **contributor** or **reader** permissions on the resource group that the workspace belongs to.

    - You might need other permissions to connect specific data sources.

- **Microsoft Sentinel is a paid service**. Review the [pricing options](https://go.microsoft.com/fwlink/?linkid=2104058) and the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).

- Review the full [pre-deployment activities and prerequisites for deploying Microsoft Sentinel](prerequisites.md).

### Geographical availability and data residency

- Microsoft Sentinel can run on workspaces in most [regions where Log Analytics is generally available](https://azure.microsoft.com/global-infrastructure/services/?products=monitor). Regions where Log Analytics is newly available may take some time to onboard the Microsoft Sentinel service. 

- See [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/) for information on [Geos and regions](https://azure.microsoft.com/global-infrastructure/data-residency/#select-geography) and on [where customer data is stored](https://azure.microsoft.com/global-infrastructure/data-residency/#more-information).

- Single-region data residency is currently provided only in the Southeast Asia (Singapore) region of the Asia Pacific geography, and in the Brazil South (Sao Paulo State) region of the Brazil geography.

## Enable Microsoft Sentinel <a name="enable"></a>

1. Sign in to the Azure portal. Make sure that the subscription in which Microsoft Sentinel is created is selected.

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

## Set up data connectors

Microsoft Sentinel ingests data from services and apps by connecting to the service and forwarding the events and logs to Microsoft Sentinel. 

- For physical and virtual machines, you can install the Log Analytics agent that collects the logs and forwards them to Microsoft Sentinel. 
- For firewalls and proxies, Microsoft Sentinel installs the Log Analytics agent on a Linux Syslog server, from which the agent collects the log files and forwards them to Microsoft Sentinel. 
 
1. From the main menu, select **Data connectors**. This opens the data connectors gallery. 
1. Select a data connector, and then select the **Open connector page** button.
1. The connector page shows instructions for configuring the connector, and any other instructions that may be necessary.

    For example, if you select the **Azure Active Directory** data connector, which lets you stream logs from Azure AD into Microsoft Sentinel, you can select what type of logs you want to get - sign-in logs and/or audit logs. <br>Follow the installation instructions. To learn more, [read the relevant connection guide](data-connectors-reference.md) or learn about [Microsoft Sentinel data connectors](connect-data-sources.md).

1. The **Next steps** tab on the connector page shows relevant built-in workbooks, sample queries, and analytics rule templates that accompany the data connector. You can use these as-is or modify them - either way you can immediately get interesting insights across your data.

After you set up your data connectors, your data starts streaming into Microsoft Sentinel and is ready for you to start working with. You can view the logs in the [built-in workbooks](get-visibility.md) and start building queries in Log Analytics to [investigate the data](investigate-cases.md).

Review the [data collection best practices](best-practices-data.md).

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

---
title: Enable entity behavior analytics to detect advanced threats
description: Enable User and Entity Behavior Analytics in Microsoft Sentinel, and configure data sources
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 03/18/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel

In the previous deployment step, you enabled the Microsoft Sentinel security content you need to protect your systems. In this article, you learn how to enable and use the UEBA feature to streamline the analysis process. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

As Microsoft Sentinel collects logs and alerts from all of its connected data sources, it analyzes them and builds baseline behavioral profiles of your organization’s entities (such as users, hosts, IP addresses, and applications) across time and peer group horizon. Using a variety of techniques and machine learning capabilities, Microsoft Sentinel can then identify anomalous activity and help you determine if an asset has been compromised. Learn more about [UEBA](identify-threats-with-entity-behavior-analytics.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]
[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

To enable or disable this feature (these prerequisites are not required to use the feature):

- Your user must be assigned the Microsoft Entra ID **Global Administrator** or **Security Administrator** roles in your tenant.

- Your user must be assigned at least one of the following **Azure roles** ([Learn more about Azure RBAC](roles.md)):
    - **Microsoft Sentinel Contributor** at the workspace or resource group levels.
    - **Log Analytics Contributor** at the resource group or subscription levels.

- Your workspace must not have any Azure resource locks applied to it. [Learn more about Azure resource locking](../azure-resource-manager/management/lock-resources.md).

> [!NOTE]
> - No special license is required to add UEBA functionality to Microsoft Sentinel, and there's no additional cost for using it.
> - However, since UEBA generates new data and stores it in new tables that UEBA creates in your Log Analytics workspace, **additional data storage charges** will apply. 

## How to enable User and Entity Behavior Analytics

- Users of Microsoft Sentinel in the Azure portal, follow the instructions in the **Azure portal** tab.
- Users of Microsoft Sentinel as part of the unified security operations platform in the Microsoft Defender portal, follow the instructions in the **Defender portal** tab.

1. Go to the **Entity behavior configuration** page.


    # [Azure portal](#tab/azure)

    Use any one of these three ways to get to the **Entity behavior configuration** page:

    - Select **Entity behavior** from the Microsoft Sentinel navigation menu, then select **Entity behavior settings** from the top menu bar.

    - Select **Settings** from the Microsoft Sentinel navigation menu, select the **Settings** tab, then under the **Entity behavior analytics** expander, select **Set UEBA**.

    - From the Microsoft Defender XDR data connector page, select the **Go the UEBA configuration page** link.

    # [Defender portal](#tab/defender)

    To get to the **Entity behavior configuration** page:

    1. From the Microsoft Defender portal navigation menu, select **Settings**.
    1. In the **Settings** page, select **Microsoft Sentinel**.
    1. From the next menu, select **Entity behavior analytics**. 
    1. Then, select **Set UEBA** which will open a new browser tab with the **Entity behavior configuration** page in the **Azure portal**.

    ---

1. On the **Entity behavior configuration** page, switch the toggle to **On**.

    :::image type="content" source="media/enable-entity-behavior-analytics/ueba-configuration.png" alt-text="Screenshot of UEBA configuration settings.":::

1. Mark the check boxes next to the Active Directory source types from which you want to synchronize user entities with Microsoft Sentinel.

    - **Active Directory** on-premises (Preview)
    - **Microsoft Entra ID**

    To sync user entities from on-premises Active Directory, your Azure tenant must be onboarded to Microsoft Defender for Identity (either standalone or as part of Microsoft Defender XDR) and you must have the MDI sensor installed on your Active Directory domain controller. See [Microsoft Defender for Identity prerequisites](/defender-for-identity/prerequisites) for more information.

1. Mark the check boxes next to the data sources on which you want to enable UEBA.

    > [!NOTE]
    >
    > Below the list of existing data sources, you will see a list of UEBA-supported data sources that you have not yet connected. 
    >
    > Once you have enabled UEBA, you will have the option, when connecting new data sources, to enable them for UEBA directly from the data connector pane if they are UEBA-capable.

1. Select **Apply**. If you accessed this page through the **Entity behavior** page, you will be returned there.

## Next steps

In this article, you learned how to enable and configure User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel. For more information about UEBA:

> [!div class="nextstepaction"]
>>[Investigate entities with entity pages](entity-pages.md)

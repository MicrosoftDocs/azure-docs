---
title: Use entity behavior analytics to detect advanced threats | Microsoft Docs
description: Enable User and Entity Behavior Analytics in Microsoft Sentinel, and configure data sources
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel 

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

To enable or disable this feature (these prerequisites are not required to use the feature):

- Your user must be a member of your organization's Azure Active Directory, and not a guest user.

- Your user must be assigned the **Global Administrator** or **Security Administrator** roles in Azure AD.

- Your user must be assigned at least one of the following **Azure roles** ([Learn more about Azure RBAC](roles.md)):
    - **Microsoft Sentinel Contributor** at the workspace or resource group levels.
    - **Log Analytics Contributor** at the resource group or subscription levels.

- Your workspace must not have any Azure resource locks applied to it. [Learn more about Azure resource locking](../azure-resource-manager/management/lock-resources.md).

> [!NOTE]
> - No special license is required to add UEBA functionality to Microsoft Sentinel, and there's no additional cost for using it.
> - However, since UEBA generates new data and stores it in new tables that UEBA creates in your Log Analytics workspace, **additional data storage charges** will apply. 

## How to enable User and Entity Behavior Analytics

1. Go to the **Entity behavior configuration** page. There are three ways to get to this page:

    - Select **Entity behavior** from the Microsoft Sentinel navigation menu, then select **Entity behavior settings** from the top menu bar.

    - Select **Settings** from the Microsoft Sentinel navigation menu, select the **Settings** tab, then under the **Entity behavior analytics** expander, select **Set UEBA**.

    - From the Microsoft 365 Defender data connector page, select the **Go the UEBA configuration page** link.

1. On the **Entity behavior configuration** page, switch the toggle to **On**.

    :::image type="content" source="media/enable-entity-behavior-analytics/ueba-configuration.png" alt-text="Screenshot of UEBA configuration settings.":::

1. Mark the check boxes next to the Active Directory source types from which you want to synchronize user entities with Microsoft Sentinel.

    - **Active Directory** on-premises (Preview)
    - **Azure Active Directory**

    To sync user entities from on-premises Active Directory, your Azure tenant must be onboarded to Microsoft Defender for Identity (either standalone or as part of Microsoft 365 Defender) and you must have the MDI sensor installed on your Active Directory domain controller. See [Microsoft Defender for Identity prerequisites](/defender-for-identity/prerequisites) for more information.

1. Mark the check boxes next to the data sources on which you want to enable UEBA.

    > [!NOTE]
    >
    > Below the list of existing data sources, you will see a list of UEBA-supported data sources that you have not yet connected. 
    >
    > Once you have enabled UEBA, you will have the option, when connecting new data sources, to enable them for UEBA directly from the data connector pane if they are UEBA-capable.

1. Select **Apply**. If you accessed this page through the **Entity behavior** page, you will be returned there.

## Next steps

In this document, you learned how to enable and configure User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel. For more information about UEBA:
- See the [list of anomalies](anomalies-reference.md#ueba-anomalies) detected using UEBA.
- Learn more about [how UEBA works](identify-threats-with-entity-behavior-analytics.md) and how to use it.

To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).

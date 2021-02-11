---
title: Use entity behavior analytics to detect advanced threats | Microsoft Docs
description:  Enable User and Entity Behavior Analytics in Azure Sentinel, and configure data sources
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/25/2021
ms.author: yelevin

---
# Enable User and Entity Behavior Analytics (UEBA) in Azure Sentinel 

> [!IMPORTANT]
>
> - The UEBA and Entity Pages features are now in **General Availability** in ***all*** Azure Sentinel geographies and regions.

## Prerequisites

To enable or disable this feature (these prerequisites are not required to use the feature):

- Your user must be a member of your organization's Azure Active Directory, and not a guest user.

- Your user must be assigned the **Global Administrator** or **Security Administrator** roles in Azure AD.

- Your user must be assigned at least one of the following **Azure roles** ([Learn more about Azure RBAC](roles.md)):
    - **Azure Sentinel Contributor** at the workspace or resource group levels.
    - **Log Analytics Contributor** at the resource group or subscription levels.

- Your workspace must not have any Azure resource locks applied to it. [Learn more about Azure resource locking](../azure-resource-manager/management/lock-resources.md).

> [!NOTE]
> No special license is required to add UEBA functionality to Azure Sentinel, but **additional charges** may apply.

## How to enable User and Entity Behavior Analytics

1. From the Azure Sentinel navigation menu, select **Entity behavior**.

1. Under the heading **Turn it on**, switch the toggle to **On**.

1. Click the **Select data sources** button.

1. In the **Data source selection** pane, mark the check boxes next to the data sources on which you want to enable UEBA, then select **Apply**.

    > [!NOTE]
    >
    > In the lower half of the **Data source selection** pane, you will see a list of UEBA-supported data sources that you have not yet enabled. 
    >
    > Once you have enabled UEBA, you will have the option, when connecting new data sources, to enable them for UEBA directly from the data connector pane if they are UEBA-capable.

1. Select **Go to entity search**. This will take you to the entity search pane, which from now on will be what you see when you choose **Entity behavior** from the main Azure Sentinel menu.

## Next steps
In this document, you learned how to enable and configure User and Entity Behavior Analytics (UEBA) in Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

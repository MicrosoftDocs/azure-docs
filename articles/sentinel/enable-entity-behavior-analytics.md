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
ms.date: 09/15/2020
ms.author: yelevin

---
# Enable User and Entity Behavior Analytics (UEBA) in Azure Sentinel 



## Prerequisites

- Your user must be assigned the **Global Administrator** or **Security Administrator** roles in Azure AD in order to enable or disable UEBA, but not to run it.

## How to enable User and Entity Behavior Analytics

1. From the Azure Sentinel navigation menu, select **Entity behavior (preview)**.

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

---
title: How to edit a branch office location
description: Learn how to edit a branch office location for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/25/2023
ms.service: network-access
ms.custom: 
---

# Learn how to edit a branch office location for Global Secure Access

Learn how to edit a branch office location for Global Secure Access.

## Prerequisites 
- Global Secure Access license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- Microsoft Graph module when using PowerShell.
- Admin consent when using Graph explorer for Microsoft Graph API. 

## Edit top-level branch settings

### Edit a top-level branch setting using the Entra portal
1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect**. 
1. Select **Branch**.
1. Select a desired branch. 
1. Under the **Basics** tab, select the pencil icon to edit the name or region. 
1. Select **Save**.
1. Under the **Links** tab, select **Add a link to add new device**. Follow the steps listed to add a device link.

### Edit a top-level branch setting using the API
To update a branch using the Microsoft Graph API in Graph Explorer. 
1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    PATCH https://graph.microsoft.com/beta/networkaccess/branches/8d2b05c5-1e2e-4f1d-ba5a-1a678382ef16 
    { 
        "@odata.context": "#$delta", 
        "name": "ContosoBranch2" 
    }
    ``` 
1. Select **Run query** to update the branch. 

## Next steps
- [List office branch locations](how-to-list-branch-locations.md)

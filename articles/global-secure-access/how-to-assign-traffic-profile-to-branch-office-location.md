---
title: How to assign a traffic profile to a branch location
description: Learn how to assign a traffic profile to a branch office location for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/25/2023
ms.service: network-access
ms.custom: 
---

# Learn how to assign a traffic profile to a branch office location for Global Secure Access.

Learn how to assign a traffic profile to a branch office location for Global Secure Access.

## Prerequisites 
- Global Secure Access license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- Microsoft Graph module when using PowerShell.
- Admin consent when using Graph explorer for Microsoft Graph API. 

## Assign a Microsoft 365 traffic profile to a branch location

### Assign a traffic profile to a branch location using the Entra portal
1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect**. 
1. Select **Branch**.
1. Select a desired branch. 
1. On the left hand side navigation select **Forwarding profiles**. 
1. Select (or unselect) the checkbox for **Microsoft 365 traffic forwarding profile**. 
1. Select **Save**.

### Assign a traffic profile to a branch location using the API
Traffic profiles (aka forwarding profiles) determine what traffic will be routed to the Microsoft network. Associating a traffic profile to your branch location is 2-step process. First, get the ID of the traffic profile. This is important as this ID is different for all tenants. Second, associate this traffic profile with your desired branch location.

To update a branch using the Microsoft Graph API in Graph Explorer. 
1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    GET https://graph.microsoft.com/beta/networkaccess/forwardingprofiles 
    ```
1. Select **Run query**. 
1. Find the ID of the desired traffic forwarding profile. 
1. Select PATCH as the HTTP method from the dropdown. 
1. Add the following query to use Update Branches API (add hyperlink to the Graph API) 
    ```
    PATCH https://graph.microsoft.com/beta/networkaccess/branches/d2b05c5-1e2e-4f1d-ba5a-1a678382ef16/forwardingProfiles 
    { 
        "@odata.context": "#$delta", 
        "value": [ 
            { 
                "id": "1adaf535-1e31-4e14-983f-2270408162bf" 
            } 
        ] 
    } 
    ```
1. Select **Run query** to update the branch. 

## Next steps
- [List office branch locations](how-to-list-branch-locations.md)

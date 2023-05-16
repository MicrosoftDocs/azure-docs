---
title: How to list all branch locations
description: Learn how to list all branch office locations for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/25/2023
ms.service: network-access
ms.custom: 
---

# Learn how to list all branch office locations for Global Secure Access

Learn how to list all branch office locations for Global Secure Access.

## Prerequisites 
- Microsoft Entra Internet Access premium license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- The *Microsoft Graph* module must be installed to use PowerShell.
- Admin consent is required when using Graph explorer for the Microsoft Graph API. 

## List all branch locations
List all branch locations in your tenant.

### List all branches using the Microsoft Entra admin center
1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect** in the left-hand side navigation menu. 
1. Select **Branch**.

### List all branches using the Microsoft Graph API 
1. Sign in to the [Graph Explorer](https://aka.ms/ge). 
1. Select GET as the HTTP method from the dropdown. 
1. Select the API version to beta. 
1. Add the query to use List Branches API (add hyperlink to the Graph API) 
    ```
    GET https://graph.microsoft.com/beta/networkaccess/branches 
    ```
1. Select **Run query** to list the branches.  

## List all branches using PowerShell 
List all branches in your tenant using PowerShell.

1. Install the `Microsoft.Graph` module using the `Install-module` command. 
    `Install-module -name Microsoft.Graph`
1. In a PowerShell window, use the `Connect-MgGraph` command to sign into and use Microsoft Graph PowerShell cmdlets.
    `Connect-MgGraph`
1. Use the List Branches API to get the list of branches. 
    ```
    $response = $null  
    $uri = "https://graph.microsoft.com/beta/networkaccess/branches"  
    $method = 'GET'  
    $response = (Invoke-MgGraphRequest -Uri $uri -Headers $headers -Method $method -Body $null).value 
    ```

## Next steps
- [Create branch office location](how-to-manage-branch-locations.md)

---
title: How to list branch locations
description: Learn how to list branch locations for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 05/24/2023
ms.service: network-access
ms.custom: 
---

# How to list branch locations for Global Secure Access

Reviewing your branch locations is an important part of managing your Global Secure Access deployment. As your organization grows, you may need to add new branch locations. You can use the Microsoft Entra admin center, Microsoft Graph API, or PowerShell to list all branch locations.

## Prerequisites 

Listing branch locations requires the following prerequisites:

- **Microsoft Entra Internet Access Premium license** for your Microsoft Entra Identity tenant
- **Microsoft Entra Network Access Administrator** role in Microsoft Entra ID
- The **Microsoft Graph** module must be installed to use PowerShell
- Administrator consent is required when using Microsoft Graph Explorer for the Microsoft Graph API. 

## List all branches using the Microsoft Entra admin center

1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect** in the left-hand side navigation menu. 
1. Select **Branch**.

## List all branches using the Microsoft Graph API 

1. Sign in to the [Graph Explorer](https://aka.ms/ge). 
1. Select `GET` as the HTTP method from the dropdown. 
1. Set the API version to beta. 
1. Enter the following query:
    ```
       GET https://graph.microsoft.com/beta/networkaccess/branches 
    ```
1. Select the **Run query** button to list the branches.  

## List all branches using PowerShell 

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

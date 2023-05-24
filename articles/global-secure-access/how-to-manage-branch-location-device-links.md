---
title: How to manage device links on branch locations
description: Learn how to create, edit, and delete device links on branch locations for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 05/24/2023
ms.service: network-access
ms.custom: 
---

# Manage device links on branch locations

Learn how to create a device link on an office branch location for Global Secure Access.

## Prerequisites 
- **Microsoft Entra Internet Access Premium license** for your Microsoft Entra Identity tenant
- **Microsoft Entra Network Access Administrator** role in Microsoft Entra ID
- The **Microsoft Graph** module must be installed to use PowerShell
- Administrator consent is required when using Microsoft Graph Explorer for the Microsoft Graph API

## Create a device link at a branch location with IKEv2 and default IPsec policy

To create a device link at a branch location with IKEv2 and the default IPSec policy:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Microsoft Entra Network Access Administrator.
1. Go to **Global Secure Access (preview)**. 

## Delete a device link from a branch location

### Delete a device link from a branch location using the Entra portal

### Delete a device link from a branch location using the API

## Delete a branch

### Delete a branch using the Entra portal
1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect**. 
1. Select **Branch**.
1. Select a desired branch. 
1. Select the **Delete** icon, which looks like a trash can, from command bar at top of the screen. 
1. Select **Delete** from in the confirmation pane. 

### Delete a branch using the API
1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    DELETE https://graph.microsoft.com/beta/networkaccess/branches/97e2a6ea-c6c4-4bbe-83ca-add9b18b1c6b 
    ```
 1. Select **Run query** to delete the branch. 

## Next steps
- [List office branch locations](how-to-list-branch-locations.md)

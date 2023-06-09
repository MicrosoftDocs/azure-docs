---
title: How to list remote networks for Global Secure Access (preview)
description: Learn how to list remote networks for Global Secure Access (preview).
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---

# How to list remote networks for Global Secure Access (preview)

Reviewing your remote networks is an important part of managing your Global Secure Access (preview) deployment. As your organization grows, you may need to add new remote networks. You can use the Microsoft Entra admin center, Microsoft Graph API, or PowerShell to list all remote networks.

## Prerequisites 

Listing remote networks requires the following prerequisites:

- A **Global Secure Access Administrator** role in Microsoft Entra ID

## List all remote networks using the Microsoft Entra admin center

1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect** in the left-hand side navigation menu. 
1. Select **Remote network**.

## List all remote networks using the Microsoft Graph API 

1. Sign in to the [Graph Explorer](https://aka.ms/ge). 
1. Select `GET` as the HTTP method from the dropdown. 
1. Set the API version to beta. 
1. Enter the following query:
    ```
       GET https://graph.microsoft.com/beta/networkaccess/branches 
    ```
1. Select the **Run query** button to list the remote networks.  

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps
- [Create remote networks](how-to-manage-remote-networks.md)

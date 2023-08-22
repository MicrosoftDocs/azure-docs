---
title: How to update and delete remote networks for Global Secure Access (preview)
description: Learn how to update and delete remote networks for Global Secure Access (preview).
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---
# Manage remote networks

Remote networks connect your users in remote locations to Global Secure Access (preview). Adding, updating, and removing remote networks from your environment are likely common tasks for many organizations. 

This article explains how to manage your existing remote networks for Global Secure Access.

## Prerequisites

- A **Global Secure Access Administrator** role in Microsoft Entra ID
- The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).
- To use the Microsoft 365 traffic forwarding profile, a Microsoft 365 E3 license is recommended.

### Known limitations

- At this time, remote networks can only be assigned to the Microsoft 365 traffic forwarding profile.

## Update remote networks

To update the details of your remote networks:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Secure Access Administrator](/azure/active-directory/roles/permissions-reference).
1. Go to **Global Secure Access (preview)** > **Devices** > **Remote networks**.
1. Select the remote network you need to update.
    - **Basics**: Select the pencil icon to edit the name of the remote network.
    - **Links**: Select the trash can icon to delete a remote network device link.
    - **Traffic profiles**: Enable or disable the available traffic forwarding profile.

### Update remote network details with the Microsoft Graph API

To edit the details of a remote network:

1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    PATCH https://graph.microsoft.com/beta/networkaccess/connectivity/branches/8d2b05c5-1e2e-4f1d-ba5a-1a678382ef16
    {
        "@odata.context": "#$delta",
        "name": "ContosoRemoteNetwork2"
    }
    ``` 
1. Select **Run query** to update the remote network. 

## Delete a remote network

1. Sign in to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com).
1. Go to **Global Secure Access (preview)** > **Devices** > **Remote networks**.
1. Select the remote network you need to delete.
1. Select the **Delete** button. 
1. Select **Delete** from the confirmation message.

![Screenshot of the delete remote network button.](media/how-to-manage-remote-networks/delete-remote-network.png)

### Delete a remote network using the API

1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    DELETE https://graph.microsoft.com/beta/networkaccess/connectivity/branches/97e2a6ea-c6c4-4bbe-83ca-add9b18b1c6b 
    ```
1. Select **Run query** to delete the remote network. 

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [List remote networks](how-to-list-remote-networks.md)


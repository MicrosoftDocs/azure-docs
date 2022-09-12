---
title: Video Indexer restricted viewer built-in role
description: This article talks about Video Indexer restricted viewer built-in role. This role is an account level permission, which allows users to grant restricted access to a specific user or security group. 
ms.topic: how-to
ms.date: 09/12/2022
---

# Manage access with the Video Indexer Restricted Viewer role

Azure Video Indexer enables managing user access to the Azure Video Indexer resource at the account level with the following built-in role: **Video Indexer Restricted Viewer**. 

Users with the owner or administrator Azure Active Directory (Azure AD) permissions can assign the **Video Indexer Restricted Viewer** role to  Azure AD users or security groups for an account. 

For information on how to assign roles, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). 
The limited access Video Indexer Restricted Viewer role is intended for Video Indexer portal users as its permitted actions relate to the portal experience.

### Azure Video Indexer Restricted viewer permissions

#### Users with this role are **able** to perform the following tasks

- View and play videos in the account
- Search through insights in the account
- Translate the transcription of a specific video

#### Users with this role are **unable** to perform the following tasks:

- Upload/Index/Re-index a video 
- Download/Embed video/insights 
- Change account settings 
- Edit insights 
- Create/update customized models 
    - Language  
    - People  
    - Brands 
- Assign roles
- Generate an access token 

### Using an ARM API

To generate a Video Indexer restricted viewer access token via API, see [documentation](https://aka.ms/vi-restricted-doc). 

## Restricted Viewer Video Indexer portal experience
 
When using the Video Indexer portal with a Video Indexer Restricted Viewer access, disabled features are greyed out. If a user with the restricted viewer role attempts to access an unauthorized page, they'll encounter the pop-up message below: 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/restricted-viewer-role/no-access.png" alt-text="No access to the gallery page.":::

## Next steps

[overview](video-indexer-overview.md)

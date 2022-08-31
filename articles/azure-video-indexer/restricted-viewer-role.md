---
title: Video Indexer restricted viewer built-in role
description: This article talks about Video Indexer restricted viewer built-in role. This role is an account level permission, which allows users to grant restricted access to a specific user or security group. 
ms.topic: how-to
ms.date: 08/29/2022
---

# Manage access with the Video Indexer Restricted Viewer role

Azure Video Indexer enables managing access to the Azure Video Indexer resource with the following built-in role: **Video Indexer Restricted Viewer**. 

If you have the owner or administrator Azure AD permissions, you can assign **Video Indexer Restricted Viewer** role to specific users or security groups for your account. For information on how to assign roles, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). 

It's recommended to use the [Azure Video Indexer](https://www.videoindexer.ai/) website to manage access to the Azure Video Indexer resource.

## The Video Indexer Restricted Viewer role 

### Azure Video Indexer allowed tasks

With this role, you're able to perform the following tasks:

- View and play videos in the account.
- Search through insights in the account. 
- Translate the transcription of a specific video.

### Azure Video Indexer restricted tasks

With this role, come the following restrictions:

- Upload/Index/Re-index a video 
- Download/Embed video/insights 
- Change account settings 
- Edit insights 
- Create/update customized models 
    - Language  
    - People  
    - Brands 
- Invite others 

## Using an ARM API

If you prefer to assign the role with an ARM API, see [documentation](https://review.docs.microsoft.com/rest/api/documentation-preview/generate/restricted-viewer-access-token?view=azure-rest-preview&branch=result_openapiHub_production_6a6469abffe9&tabs=HTTP). 

## Not able to access the website error
 
When visiting the [Azure Video Indexer](https://www.videoindexer.ai/) website with a Video Indexer Restricted Viewer access, the following message appears: 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/restricted-viewer-role/no-access.png" alt-text="No access to the gallery page.":::

## Next steps

[overview](video-indexer-overview.md)

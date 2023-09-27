---
title: Manage access to an Azure AI Video Indexer account
description: This article talks about Video Indexer restricted viewer built-in role. This role is an account level permission, which allows users to grant restricted access to a specific user or security group. 
ms.topic: how-to
ms.date: 12/14/2022
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Manage access to an Azure AI Video Indexer account

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

In this article, you'll learn how to manage access (authorization) to an Azure AI Video Indexer account. As Azure AI Video Indexer’s role management differs depending on the Video Indexer Account type, this document will first cover access management of regular accounts (ARM-based) and then of Classic and Trial accounts.   

To see your accounts, select **User Accounts** at the top-right of the [Azure AI Video Indexer website](https://videoindexer.ai/). Classic and Trial accounts will have a label with the account type to the right of the account name.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/restricted-viewer-role/accounts.png" alt-text="Image of accounts.":::

## User management of ARM accounts

[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Using Azure RBAC, you can segregate duties within your team and users by granting only the amount of access that is appropriate. Users in your Azure Active Directory (Azure AD) are assigned specific roles, which grant access to resources. 

Users with owner or administrator Azure Active Directory (Azure AD) permissions can assign roles to Azure AD users or security groups for an account. For information on how to assign roles, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). 

Azure AI Video Indexer provides three built-in roles. You can learn more about [Azure built-in roles](../role-based-access-control/built-in-roles.md). Azure AI Video Indexer doesn't support the creation of custom roles. 

**Owner** - This role grants full access to manage all resources, including the ability to assign roles to determine who has access to resources.  
**Contributor** - This role has permissions to everything an owner does except it can't control who has access to resources.  
**Video Indexer Restricted Viewer** - This role is unique to Azure AI Video Indexer and has permissions to view videos and their insights but can't perform edits or changes or user management operations. This role enables collaboration and user access to insights through the Video Indexer website while limiting their ability to make changes to the environment.  

Users with this role can perform the following tasks: 

- View and play videos.  
- View and search insights and translate a videos insights and transcript.

Users with this role are unable to perform the following tasks: 

- Upload/index/re-index a video. 
- Download/embed video/insights.
- Change account settings.
- Edit insights.
- Create/update customized models.
- Assign roles.
- Generate an access token.

Disabled features will appear to users with the **Restricted Viewer** access as greyed out. When a user navigates to an unauthorized page, they receive a pop-up message that they don't have access. 

> [!Important]
> The Restricted Viewer role is only available in Azure AI Video Indexer ARM accounts. 
>

### Manage account access (for account owners)

If you're an account owner, you can add and remove roles for the account. You can also assign roles to users. Use the following links to discover how to manage access: 

- [Azure portal UI](../role-based-access-control/role-assignments-portal.md)
- [PowerShell](../role-based-access-control/role-assignments-powershell.md) 
- [Azure CLI](../role-based-access-control/role-assignments-cli.md) 
- [REST API](../role-based-access-control/role-assignments-rest.md) 
- [Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md) 

## User management of classic and trial accounts  

User management of classic accounts, including the creation of new users, is performed in the Account settings section of the Video Indexer website. This can be accessed by either: 

- Selecting the **User accounts** icon at the top-right of the website and then settings. 
- Selecting the **Account settings** icon on the left of the website. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/restricted-viewer-role/settings.png" alt-text="Image of account settings.":::

### Share the account

In the **Account setting** section, select **Manage Roles** to view all the account users and people with pending invites. 

To add users, click **Invite more people to this account**. They'll receive an invitation but you also have the option to copy the invite link to share it directly. Once they've accepted the invitation, you can define their role as either **Owner** or **Contributor**. See above in the [ARM Account user management](#user-management-of-arm-accounts) section for a description of the **Owner** and **Contributor** roles.  

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/restricted-viewer-role/share-account.png" alt-text="Image of invited users.":::

## Next steps

[Overview](video-indexer-overview.md)

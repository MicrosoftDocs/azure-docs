---
title: Set up self-service group management - Azure Active Directory | Microsoft Docs
description: Create and manage security groups or Microsoft 365 groups in Azure Active Directory and request security group or Microsoft 365 group memberships
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 05/18/2021
ms.author: curtand
ms.reviewer: krbain
ms.custom: "it-pro;seo-update-azuread-jan"

ms.collection: M365-identity-device-management
---
# Set up self-service group management in Azure Active Directory 

You can enable users to create and manage their own security groups or Microsoft 365 groups in Azure Active Directory (Azure AD). The owner of the group can approve or deny membership requests, and can delegate control of group membership. Self-service group management features are not available for mail-enabled security groups or distribution lists.

## Self-service group membership defaults

When security groups are created in the Azure portal or using Azure AD PowerShell, only the group's owners can update membership. Security groups created by self-service in the [Access panel](https://account.activedirectory.windowsazure.com/r#/joinGroups) and all Microsoft 365 groups are available to join for all users, whether owner-approved or auto-approved. In the Access panel, you can change membership options when you create the group.

Groups created in | Security group default behavior | Microsoft 365 group default behavior
------------------ | ------------------------------- | ---------------------------------
[Azure AD PowerShell](../enterprise-users/groups-settings-cmdlets.md) | Only owners can add members<br>Visible but not available to join in Access panel | Open to join for all users
[Azure portal](https://portal.azure.com) | Only owners can add members<br>Visible but not available to join in Access panel<br>Owner is not assigned automatically at group creation | Open to join for all users
[Access panel](https://account.activedirectory.windowsazure.com/r#/joinGroups) | Open to join for all users<br>Membership options can be changed when the group is created | Open to join for all users<br>Membership options can be changed when the group is created

## Self-service group management scenarios

* **Delegated group management**
    An example is an administrator who is managing access to a SaaS application that the company is using. Managing these access rights is becoming cumbersome, so this administrator asks the business owner to create a new group. The administrator assigns access for the application to the new group, and adds to the group all people already accessing the application. The business owner then can add more users, and those users are automatically provisioned to the application. The business owner doesn't need to wait for the administrator to manage access for users. If the administrator grants the same permission to a manager in a different business group, then that person can also manage access for their own group members. Neither the business owner nor the manager can view or manage each other's group memberships. The administrator can still see all users who have access to the application and block access rights if needed.
* **Self-service group management**
    An example of this scenario is two users who both have SharePoint Online sites that they set up independently. They want to give each other's teams access to their sites. To accomplish this, they can create one group in Azure AD, and in SharePoint Online each of them selects that group to provide access to their sites. When someone wants access, they request it from the Access Panel, and after approval they get access to both SharePoint Online sites automatically. Later, one of them decides that all people accessing the site should also get access to a particular SaaS application. The administrator of the SaaS application can add access rights for the  application to the SharePoint Online site. From then on, any requests that get approved gives access to the two SharePoint Online sites and also to this SaaS application.

## Make a group available for user self-service

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that's been assigned the Global Administrator or Privileged Role Administrator role for the directory.

1. Select **Groups**, and then select **General** settings.

    ![Azure Active Directory groups general settings](./media/groups-self-service-management/groups-settings-general.png)

1. Set **Owners can manage group membership requests in the Access Panel** to **Yes**.

1. Set **Restrict user ability to access groups features in the Access Panel** to **No**.

1. If you set **Users can create security groups in Azure portals, API or PowerShell** or **Users can create Microsoft 365 groups in Azure portals, API or PowerShell** to

    - **Yes**: All users in your Azure AD organization are allowed to create new security groups and add members to these groups in Azure portals, API or PowerShell. These new groups would also show up in the Access Panel for all other users. If the policy setting on the group allows it, other users can create requests to join these groups.
    - **No**: Users can't create groups and can't change existing groups for which they are an owner. However, they can still manage the memberships of those groups and approve requests from other users to join their groups.

    These settings were recently changed to add support for API and PowerShell. For more information about this change, see the next section [Groups setting change](#groups-setting-change).

You can also use **Owners who can assign members as group owners in the Azure portal** to achieve more granular access control over self-service group management for your users.

When users can create groups, all users in your organization are allowed to create new groups and then can, as the default owner, add members to these groups. You can't specify individuals who can create their own groups. You can specify individuals only for making another group member a group owner.

> [!NOTE]
> An Azure Active Directory Premium (P1 or P2) license is required for users to request to join a security group or Microsoft 365 group and for owners to approve or deny membership requests. Without an Azure Active Directory Premium license, users can still manage their groups in the Access Panel, but they can't create a group that requires owner approval in the Access Panel, and they can't request to join a group.

## Groups setting change

The current security groups and Microsoft 365 groups settings are being deprecated and replaced. The current settings are being replaced because they only control group creation in Azure portals and do not apply to API or PowerShell. The new settings control group creation in Azure portals, and also API and PowerShell.

| Deprecated setting | New setting |
| --- | --- |
| Users can create security groups in Azure portals | Users can create security groups in Azure portals, API or PowerShell |
| Users can create Microsoft 365 groups in Azure portals | Users can create Microsoft 365 groups in Azure portals, API or PowerShell |

Until the current setting is fully deprecated, both settings will appear in the Azure portals. You should configure this new setting before the end of **May 2021**. To configure the security groups settings, you must be assigned the Global Administrator or Privileged Role Administrator role. 

![Azure Active Directory security groups setting change](./media/groups-self-service-management/security-groups-setting.png)

The following table helps you decide which values to choose.

| If you want this ... | Choose these values |
| --- | --- |
| Users can create groups using Azure portals, API or PowerShell | Set both settings to **Yes**. Changes can take up to 15 minutes to take effect. |
| Users **can't** create groups using Azure portals, API or PowerShell | Set both settings to **No**. Changes can take up to 15 minutes to take effect. |
| Users can create groups using Azure portals, but not using API or PowerShell | Not supported |
| Users can create groups using API or PowerShell, but not using Azure portals | Not supported |

The following table lists what happens for different values for these settings. It's not recommended to have the deprecated setting and the new setting set to different values.

| Users can create groups using Azure portals | Users can create groups using Azure portals, API or PowerShell | Effect on your tenant |
| :---: | :---: | --- |
| Yes | Yes | Users can create groups using Azure portals, API or PowerShell. Changes can take up to 15 minutes to take effect.|
| No | No | Users **can't** create groups using Azure portals, API or PowerShell. Changes can take up to 15 minutes to take effect. |
| Yes | No | Users **can't** create groups using Azure portals, API or PowerShell. It's not recommended to have these settings set to different values. Changes can take up to 15 minutes to take effect. |
| No | Yes | Until the **Users can create groups using Azure portals** setting is fully deprecated in **June 2021**, users can create groups using API or PowerShell, but not Azure portals. Starting sometime in **June 2021**, the **Users can create groups using Azure portals, API or PowerShell** setting will take effect and users can create groups using Azure portals, API or PowerShell. |

## Next steps

These articles provide additional information on Azure Active Directory.

* [Manage access to resources with Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md)
* [Azure Active Directory cmdlets for configuring group settings](../enterprise-users/groups-settings-cmdlets.md)
* [Application Management in Azure Active Directory](../manage-apps/what-is-application-management.md)
* [What is Azure Active Directory?](../fundamentals/active-directory-whatis.md)
* [Integrate your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md)

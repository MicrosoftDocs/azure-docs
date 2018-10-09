---
title: Setting up self-service application access management in Azure Active Directory | Microsoft Docs
description: Create and manage security groups or Office 365 groups in Azure Active Directory and request security group or Office 365 group memberships
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: get-started-article
ms.date: 09/11/2018
ms.author: curtand

ms.reviewer: krbain
ms.custom: it-pro

---
# Set up Azure Active Directory for self-service group management
Your users can create and manage their own security groups or Office 365 groups in Azure Active Directory (Azure AD). Users can also request security group or Office 365 group memberships, and then the owner of the group can approve or deny membership. Day-to-day control of group membership can be delegated to the people who understand the business context for that membership. Self-service group management features are available only for security groups and Office 365 groups, but not for mail-enabled security groups or distribution lists.

Self-service group management currently services two essential scenarios: delegated group management and self-service group management.

* **Delegated group management**
    An example is an administrator who is managing access to a SaaS application that the company is using. Managing these access rights is becoming cumbersome, so this administrator asks the business owner to create a new group. The administrator assigns access for the application to the new group, and adds to the group all people already accessing to the application. The business owner then can add more users, and those users are automatically provisioned to the application. The business owner doesn't need to wait for the administrator to manage access for users. If the administrator grants the same permission to a manager in a different business group, then that person can also manage access for their own users. Neither the business owner nor the manager can view or manage each other’s users. The administrator can still see all users who have access to the application and block access rights if needed.
* **Self-service group management**
    An example of this scenario is two users who both have SharePoint Online sites that they set up independently. They want to give each other’s teams access to their sites. To accomplish this, they can create one group in Azure AD, and in SharePoint Online each of them selects that group to provide access to their sites. When someone wants access, they request it from the Access Panel, and after approval they get access to both SharePoint Online sites automatically. Later, one of them decides that all people accessing the site should also get access to a particular SaaS application. The administrator of the SaaS application can add access rights for the  application to the SharePoint Online site. From then on, any requests that get approved gives access to the two SharePoint Online sites and also to this SaaS application.

## Make a group available for user self-service
1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that's a global admin for the directory.
2. Select **Users and groups**, and then select **Group settings**.
3. Set **Self-service group management enabled** to **Yes**.
4. Set **Users can create security groups** or **Users can create Office 365 groups** to **Yes**.
  * When these settings are enabled, all users in your directory are allowed to create new security groups and add members to these groups. These new groups would also show up in the Access Panel for all other users. If the policy setting on the group allows it, other users can create requests to join these groups. 
  * When these settings are disabled, users can't create groups and can't change existing groups for which they are an owner. However, they can still manage the memberships of those groups and approve requests from other users to join their groups.

You can also use **Users who can manage security groups** and **Users who can manage Office 365 groups** to achieve more granular access control over self-service group management for your users. When **Users can create groups** is enabled, all users in your tenant are allowed to create new groups and add members to these groups. By setting them to **Some**, you are restricting group management to only a limited group of users. When this switch is set to **Some**, you must add users to the group SSGMSecurityGroupsUsers before they can create new groups and add members to them. By setting **Users who can use self-service for security groups** and **Users who can manage Office 365 groups** to **All**, you enable all users in your tenant to create new groups.

You can also use **Group that can manage security groups** or **Group that can manage Office 365 groups** to specify a single group whose members can use self-service.

## Next steps
These articles provide additional information on Azure Active Directory.

* [Manage access to resources with Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md)
* [Azure Active Directory cmdlets for configuring group settings](groups-settings-cmdlets.md)
* [Application Management in Azure Active Directory](../manage-apps/what-is-application-management.md)
* [What is Azure Active Directory?](../fundamentals/active-directory-whatis.md)
* [Integrate your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md)

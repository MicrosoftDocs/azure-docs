<properties
	pageTitle="Setting up Azure Active Directory for self service application access management| Microsoft Azure"
	description="Self-service group management enables users to create and manage security groups or Office 365 groups in Azure Active Directory and offers users the possibility to request security group or Office 365 group memberships"
	services="active-directory"
	documentationCenter=""
  authors="curtand"
	manager="femila"
	editor=""
	/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/10/2016"
	ms.author="curtand"/>

# Setting up Azure Active Directory for self-service group management

Self-service group management enables users to create and manage security groups or Office 365 groups in Azure Active Directory (Azure AD). Users can also request security group or Office 365 group memberships, and then the owner of the group can approve or deny membership. In this way, day-to-day control of group membership can be delegated to people who understand the business context for that membership. Self-service group management features are available only for security groups and Office 365 groups, but not for mail-enabled security groups or distribution lists.

Self-service group management currently comprises two essential scenarios: delegated group management and self-service group management.

- **Delegated group management**
	An example is an administrator who is managing access to a SaaS application that the company is using. Managing these access rights is becoming cumbersome, so this administrator asks the business owner to create a new group. The administrator assigns access for the application to the new group, and adds to the group all people already accessing to the application. The business owner then can add more users, and those users are automatically provisioned to the application. The business owner doesn't need to wait for the administrator to manage access for users. If the administrator grants the same permission to a manager in a different business group, then that person can also manage access for their own users. Neither the business owner nor the manager can view or manage each other’s users. The administrator can still see all users who have access to the application and block access rights if needed.

- **Self-service group management**
	An example of this scenario is two users who both have SharePoint Online sites that they set up independently. They want to give each other’s teams access to their sites. To accomplish this, they can create one group in Azure AD, and in SharePoint Online each of them selects that group to provide access to their sites. When someone wants access, they request it from the Access Panel, and after approval they get access to both SharePoint Online sites automatically. Later, one of them decides that all people accessing the site should also get access to a particular SaaS application. The administrator of the SaaS application can add access rights for the  application to the SharePoint Online site. From then on, any requests that get approved gives access to the two SharePoint Online sites and also to this SaaS application.

## Making a group available for end user self-service

1. In the [Azure classic portal](https://manage.windowsazure.com), open your Azure AD directory.

2. On the **Configure** tab, set **Delegated group management** to Enabled.

3. Set **Users can create security groups** or **Users can create Office groups** to Enabled.

When **Users can create security groups** is enabled, all users in your directory are allowed to create new security groups and add members to these groups. These new groups would also show up in the Access Panel for all other users. If the policy setting on the group allows it, other users can create requests to join these groups. If **Users can create security groups** is disabled, users can't create groups and can't change existing groups for which they are an owner. However, they can still manage the memberships of those groups and approve requests from other users to join their groups.

You can also use **Users who can use self-service for security groups** to achieve a more fine-grained access control over self-service group management for your users. When **Users can create groups** is enabled, all users in your directory are allowed to create new groups and add members to these groups. By also setting **Users who can use self-service for security groups** to Some, you are restricting group management to only a limited group of users. When this switch is set to Some, you must add users to the group SSGMSecurityGroupsUsers before they can create new groups and add members to them. By setting **Users who can use self-service for security groups** to All, you enable all users in your directory to create new groups.

You can also use the **Group that can use self-service for security groups** box to specify a custom name for a group whose members can use self-service.

## Additional information

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Azure Active Directory cmdlets for configuring group settings](active-directory-accessmanagement-groups-settings-cmdlets.md)

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

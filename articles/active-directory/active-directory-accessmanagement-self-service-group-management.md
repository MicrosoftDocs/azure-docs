<properties
	pageTitle="Setting up Azure Active Directory for self service application access management| Microsoft Azure"
	description="Self-service group management enables users to create and manage security groups or Office 365 groups in Azure Active Directory and offers users the possibility to request security group or Office 365 group memberships"
	services="active-directory"
	documentationCenter=""
  authors="curtand"
	manager="stevenpo"
	editor=""
	/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/17/2016"
	ms.author="curtand"/>

# Setting up Azure Active Directory for self-service group management

Self-service group management enables users to create and manage security groups or Office 365 groups in Azure Active Directory (Azure AD) and offers users the possibility to request security group or Office 365 group memberships, which can subsequently be approved or denied by the owner of the group. By using self-service group management features, the day-to-day control of group membership can be delegated to people who understand the business context for that membership. Self-service group management features are available only for security groups and Office 365 groups, not for mail-enabled security groups or distribution lists.

Self-service group management currently comprises two essential scenarios: delegated group management and self-service group management.


- **Delegated group management** - An example is an administrator who is managing access to a SaaS application that her company is using. Managing these access rights is becoming cumbersome, so this administrator asks the business owner to create a new group. The administrator now assigns access for the application to a new group that the business owner just created and puts all the people who currently have access to the application into this group. The business owner then can add more users, and those users are automatically provisioned to the application moments later. The business owner does not need to wait for the administrator to do the work but can manage access himself for his users. The administrator can do the same thing for an administrative assistant for a different business group, and both the business owner and this administrative assistant can now manage access for their users – without being able to touch or see each other’s users. The administrator can still see all users who have access to the application and block access rights if needed.


- **Self-service group management** - An example of this scenario is two users who both have SharePoint Online sites that they set up independently, but who would want to give each other’s teams access to their sites. To accomplish they, they can create one group in Azure AD, and in SharePoint Online each of them picks that same group to provide access to their sites. When someone wants access, they request it from the Access Panel, and after approval they get access to both SharePoint Online sites automatically. Later one of them decides that all people accessing his site should also get access to a particular SaaS application. He asks administrator of this SaaS application to add access rights for this application to his site. From then on, any requests that he approves will give access to the two SharePoint Online sites and also to this SaaS application.

## Making a group available for end user self-service

In the [Azure classic portal](https://manage.windowsazure.com), on the **Configure** tab, set **Delegated group management** to Enabled, and then set **Users can create security groups** or **Users can create Office groups** to Enabled.

When **Users can create security groups** is enabled, all users in your directory are allowed to create new security groups and add members to these groups. These new groups would also show up in the Access Panel for all other users, and other users can create requests to join these groups if the policy setting on the group allows this. If **Users can create security groups** is disabled, users cannot create groups and cannot change existing groups for which they are an owner, but they can still manage the memberships of those groups and approve requests from other users to join their groups.

You can also use **Users who can use self-service for security groups** to achieve a more fine-grained access control over the self-service group management capabilities for your users. When **Users can create groups** is enabled, all users in your directory are allowed to create new groups and add members to these groups. By also setting **Users who can use self-service for security groups** to Some, you are restricting group management to only a limited group of users. When this switch is set to Some, a group called SSGMSecurityGroupsUsers is created in your directory and only those users whom you have made members of this group can then create new security groups and add members to these groups within your directory. By setting **Users who can use self-service for security groups** to All, you enable all users in your directory to create new groups.

You can also use the **Group that can use self-service for security groups** box (set by default to ‘SSGMSecurityGroupsUsers’ to specify your own custom name for a group that will hold all the users with the ability to use self-service and create new groups in your directory.

## Additional information

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

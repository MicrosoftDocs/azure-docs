<properties 
	pageTitle="Setting up Azure AD for self service application access management| Microsoft Azure" 
	description="A topic that explains how to manage groups in Azure AD." 
	services="active-directory" 
	documentationCenter="" 
    authors="femila"
	manager="swadhwa"" 
	editor=""
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/13/2015" 
	ms.author="femila"/>

#Setting up Azure AD for self service application access management

Self-service group management enables users to create and manage security groups in Microsoft Azure Active Directory (AD) and offers users the possibility to request security group memberships, which can subsequently be approved or denied by the owner of the group. By using self-service group management features, the day-to-day control of group membership can be delegated to people who understand the business context for that membership. 

Self-service group management is currently comprised of two essential scenarios: delegated group management and self-service group management.


- **Delegated group management** take the example of an administrator who is managing access to a SaaS application that her company is using. Managing these access rights is becoming cumbersome, so this administrator asks the business owner to create a new group. The administrator now assigns access for the application to a new group that the business owner just created and puts all the people who currently have access to the application into this group. The business owner then can add more users, and those users are automatically provisioned to the application moments later. The business owner does not need to wait for the administrator to do the work but can manage access himself for his users. The administrator can do the same thing for an administrative assistant for a different business group, and both the business owner and this administrative assistant can now manage access for their users – without being able to touch or see each other’s users. The administrator can still see all users who have access to the application and block access rights if needed.


- **Self-service group management** - take the example of two users who both have SharePoint Online sites that they set up independently, but they would really like to make it easy to give each other’s teams access. So they create one group in Azure AD, and in SharePoint Online each of them picks that same group to provide access to their sites. When someone wants access, they request it from the Access Panel, and after approval they get access to both SharePoint Online sites automatically. Later one of them decides that all people accessing his site should also get access to a particular SaaS application. He asks administrator of this SaaS application to add access rights for this application to his site. From then on, any requests that he approves will give access to the two SharePoint Online sites and also to this SaaS application.



##Making a group available for end user self-service

In the Azure Management Portal, on the Configure tab, set the Delegated group management switch to Enabled and then set the Users can create groups switch to Enabled.

When the **Users can create groups** switch is set to **Enabled**, all users in your directory are allowed to create new security groups and add members to these groups. Note that these new groups would also show up in the Access Panel for all other users, and that other users can create requests to join these groups if the policy setting on the group allows this. If this switch is set to Disabled, users cannot create groups and cannot change existing groups that they are an owner of, but they can still manage the memberships of those groups and approve requests from other users to join their groups.

You can also use the Users who can use self-service for security groups switch to achieve a more fine-grained access control over the self-service group management capabilities for your users. When the Users can create groups switch is set to Enabled, all users in your directory are allowed to create new security groups and add members to these groups. By also setting the Users who can use self-service for security groups switch to Some, you are restricting security group management to only a limited group of users. When this switch is set to Some, a group called SSGMSecurityGroupsUsers is created in your directory and only those users whom you have made members of this group can then create new security groups and add members to these groups within your directory. By setting the Users who can use self-service for security groups switch to All, you enable all users in your directory to create new security groups.

You can also use the Group that can use self-service for security groups field (set by default to ‘SSGMSecurityGroupsUsers’ to specify your own custom name for a group that will hold all the users with the ability to use self-service and create new security groups in your directory.

Here are some topics that will provide some additional information on Azure Active Directory 

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

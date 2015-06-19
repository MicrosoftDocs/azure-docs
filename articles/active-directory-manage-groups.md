<properties 
	pageTitle="Manage groups in Azure AD" 
	description="A topic that explains how to manage groups in Azure AD." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="Justinha"/>

# Manage groups in Azure AD

A group is a collection of users and groups that can be managed as a single unit. Users and groups that belong to a particular group are referred to as group members. Using groups can simplify administration by assigning a common set of permissions and rights to many accounts at once, rather than assigning permissions and rights to each account individually.

Right now in Azure AD, you can only create Security groups. 

You can use groups as a convenient way to assign access to applications for users in cases when you need to assign many users to the same application. You can also use groups when configuring access management of other online services that control access to resources, for example, SharePoint Online.

If you have configured directory synchronization, you can see groups that have been synchronized from your local on-premises Windows Server Active Directory, which have the value 'Local Active Directory' in the 'Sourced From' property. You must continue to manage these groups in your local Active Directory; these groups cannot be managed or deleted in the Azure Management Portal. 

If you have Office 365, you can see distribution groups and mail-enabled security groups that were created and managed within the Exchange Admin Center within Office 365. These groups have the value 'Office 365' in the 'Sourced From' property, and must continue to be managed in the Exchange Admin Center. 

You can also create Unified Groups via the Access Panel. In the Configure tab, under Group Management, set the **Users can create O365 groups** widget to **Yes**. If you have Office 365 Unified Groups that are created in the Access Panel or in Office 365, these groups will have the ‘Sourced From’ property set to ‘Azure Active Directory’ and they can be managed through the Access Panel.

If you have enabled self-service group management for your users (for more information, see Self-service group management for users in Azure AD, as a tenant administrator you can also manage these groups via the Azure Management Portal. You can add and remove group members, add and remove group owners, edit group properties, and view groups’ history activity report which displays the action that was performed within the group, who performed that action, and at what time.

> [AZURE.NOTE]
> In order to be able to assign a group to an application you must be using Azure AD Premium. If you have Azure AD Premium, you can also use groups to assign access to SaaS applications that are integrated with Azure AD. For more information, see Assign access for a group to a SaaS application in Azure AD.

## What's next

- [Administering Azure AD](active-directory-administer.md)
- [Create or edit users in Azure AD](active-directory-create-users.md)
- [Manage passwords in Azure AD](active-directory-manage-passwords.md)

<properties
	pageTitle="Dedicated groups in Azure Active Directory | Microsoft Azure"
	description="Overview of how dedicated groups work in Azure Active Directory and how they are created."
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
	ms.topic="article"
	ms.date="02/24/2016"
	ms.author="curtand"/>

# Dedicated groups in Azure Active Directory

In Azure Active Directory, the dedicated groups feature automatically creates and populates membership for the dedicated groups. Members of dedicated groups cannot be added or removed using the Azure classic portal, Windows PowerShell cmdlets, or programmatically.

**To enable dedicated groups**

1. In the Azure classic portal, on the Configure tab, set the **Enable Dedicated Groups switch to Yes**.

Once the Enable Dedicated Groups switch is set to **Yes**, you can further enable the directory to automatically create the All Users dedicated group by setting the **Enable “All Users” Group** switch to **Yes**. You can then also edit the name of this dedicated group by typing it in the **Display Name for “All Users” Group** field.

The All Users dedicated group can be useful if you want to assign the same permissions to all the users in your directory. For example, you can grant all users in your directory access to a SaaS application by assigning access for the All Users dedicated group to this application.

Please note that the dedicated "All Users" group includes all users in the directory, and this includes guests and external users. If you need a group that excludes external users then you can accomplish this by creating a group with a dynamic rule like

(user.userPrincipalName -notContains "#EXT#@")

For a group that excludes all Guests, use a rule like

(user.userType -ne "Guest")

This article explains more about how to create a rule to manage members of a group in Azure Active Directory:

* [Creating a simple rule to configure dynamic memberships for a group](active-directory-accessmanagement-simplerulegroup.md)


These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [What is Azure Active Directory?](active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

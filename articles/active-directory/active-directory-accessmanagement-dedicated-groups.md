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
	ms.date="11/17/2015"
	ms.author="curtand"/>

# Dedicated groups in Azure Active Directory

In Azure Active Directory, dedicated groups are created automatically and group membership for the dedicated groups is also automatic. You cannot add or remove members to and from dedicated groups through the Azure portal, Windows PowerShell cmdlets, or programmatically. To enable dedicated groups, In the Azure portal, on the Configure tab, set the **Enable Dedicated Groups switch to Yes**.

Once the Enable Dedicated Groups switch is set to **Yes**, you can further enable the directory to automatically create the All Users dedicated group by setting the **Enable “All Users” Group** switch to **Yes**. You can then also edit the name of this dedicated group by typing it in the **Display Name for “All Users” Group** field.

The All Users dedicated group can be useful if you want to assign the same permissions to all the users in your directory. For example, you can grant all users in your directory access to a SaaS application by assigning access for the All Users dedicated group to this application.

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [What is Azure Active Directory?](active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

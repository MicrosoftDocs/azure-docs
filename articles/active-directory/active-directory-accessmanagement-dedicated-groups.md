<properties
	pageTitle="Dedicated groups in Azure Active Directory | Microsoft Azure"
	description="Overview of how dedicated groups work in Azure Active Directory and how they are created."
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
	ms.topic="article"
	ms.date="06/21/2016"
	ms.author="curtand"/>

# Dedicated groups in Azure Active Directory

In Azure Active Directory (Azure AD), the dedicated groups feature automatically creates and populates membership for Azure AD predefined groups. Members of dedicated groups cannot be added or removed using the Azure classic portal, Windows PowerShell cmdlets, or programmatically.

>[AZURE.NOTE] Dedicated groups require that an Azure AD Premium license is assigned to
>- the administrator who manages the rule on a group
>- all users who are selected by the rule to be a member of the group

**To enable dedicated groups**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then open your organization’s directory.

2. Select the **Groups** tab, and then open the group you want to edit.

3. Select the **Configure** tab, and then set **Enable Dedicated Groups** to **Yes**.

Once the Enable Dedicated Groups switch is set to **Yes**, you can further enable the directory to automatically create the All Users dedicated group by setting the **Enable “All Users” Group** switch to **Yes**. You can then also edit the name of this dedicated group by typing it in the **Display Name for “All Users” Group** field.

The All Users group can be used to assign the same permissions to all the users in your directory. For example, you can grant all users in your directory access to a SaaS application by assigning access for the All Users dedicated group to this application.

The dedicated All Users group includes all users in the directory, including guests and external users. If you need a group that excludes external users, then you can accomplish this by creating a group with an attribute-based dynamic rule such as the following:

				(user.userPrincipalName -notContains "#EXT#@")

For a group that excludes all Guests, use a rule such as the following:

				(user.userType -ne "Guest")

To learn about how to create *advanced* rules (rules that can contain multiple comparisons) for dynamic group membership, see [Using attributes to create advanced rules](active-directory-accessmanagement-groups-with-advanced-rules.md).


These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [What is Azure Active Directory?](active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

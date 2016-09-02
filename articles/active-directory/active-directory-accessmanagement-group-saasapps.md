
<properties
	pageTitle="Using a group to manage access to SaaS Applications | Microsoft Azure"
	description="How to use groups in Azure Active Directory Premium or Basic to assign access to SaaS applications that are integrated with Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="curtand"/>


# Using a group to manage access to SaaS applications

Using Azure Active Directory (Azure AD) with an Azure AD Premium or Azure AD Basic license, you can use groups to assign access to a SaaS application that's integrated with Azure AD. For example, if you want to assign access for the marketing department to use five different SaaS applications, you can create a group that contains the users in the marketing department, and then assign that group to these five SaaS applications that are needed by the marketing department. This way you can save time by managing the membership of the marketing department in one place. Users then are assigned to the application when they are added as members of the marketing group, and have their assignments removed from the application when they are removed from the marketing group.

This capability can be used with hundreds of applications that you can add from within the Azure AD Application Gallery.

**To assign access for a group to a SaaS application**

1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory** on the navigation bar on the left hand side.

2. Select the **Directory** tab, and then open the directory in which you want to assign access for a group to a SaaS application.

3. Select the **Applications** tab. Select an application that you added from the Application Gallery, and then click  the **Users and Groups** tab.

4. On the **Users and Groups** tab, in the **Starting with** field, enter the name of the group to which you want to assign access, and then select the check mark in the upper right. You only need to type the first part of a group's name.

5. Select the group, then then select the **Assign Access** button. Select **Yes** when you see the confirmation message. Nested group memberships are not supported for group-based assignment to applications at this time.

6. You can also see which users are assigned to the application, either directly or by membership in a group. To do this, change the **Show dropdown from 'Groups'** to **'All Users'**. The list shows users in the directory and whether or not each user is assigned to the application. The list also shows whether the assigned users are assigned to the application directly (assignment type shown as 'Direct'), or by virtue of group membership (assignment type shown as 'Inherited.')


> [AZURE.NOTE]
>You can see the Users and Groups tab only after you have enabled Azure AD Premium or Azure AD Basic.

##Related Articles

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

* [Azure Active Directory cmdlets for configuring group settings](active-directory-accessmanagement-groups-settings-cmdlets.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

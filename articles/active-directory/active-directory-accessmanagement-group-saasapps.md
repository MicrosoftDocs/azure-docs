
<properties 
	pageTitle="Using a group to manage access to SaaS Applications| Microsoft Azure" 
	description="A topic that explains how to use groups in Azure AD Premium to assign access to a SaaS applications that are integrated with Azure AD." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="swadhwa" 
	editor=""
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" identity
	ms.topic="article" 
	ms.date="07/13/2015" 
	ms.author="femila"/>


# Using a group to manage access to SaaS applications

With Azure AD Premium you can use groups to assign access to a SaaS application that's integrated with Azure AD. For example, if you want to assign access for the marketing department to use five different SaaS applications, you can create a group that contains the users in the marketing department, and then assign that group to these five SaaS applications that are needed by the marketing department. This way you can save time by managing the membership of the marketing department in one place. Users then are assigned to the application when they are added as members of the marketing group, and have their assignments removed from the application when they are removed from the marketing group.

This capability can be used with hundreds of applications that you can add from within the Azure AD Application Gallery.

**To assign access for a group to a SaaS application**


1. Open a browser of your choice and go to the Azure Management Portal. In the Azure Management Portal, find the Active Directory extension on the navigation bar on the left hand side. Under the **Directory** tab, click the directory in which you want to assign access for a group to a Saas application.


2. Click the Applications tab for your directory. Click on an application that you added from the Application Gallery, then click on the Users and Groups tab.

3. On the Users and Groups tab, in the Starting with field, enter the name of the group to which you want to assign access, and click the check mark in the upper right. You only need to type the first part of the group's name. Then, click on the group to highlight it, then click on the **Assign Access** button and click **Yes** when you see the confirmation message. 


4. You can also see which users are assigned to the application, either directly or by membership in a group. To do this, change the **Show dropdown from 'Groups'** to **'All Users'**. The list shows users in the directory and whether or not each user is assigned to the application. The list also shows whether the assigned users are assigned to the application directly (assignment type shown as 'Direct'), or by virtue of group membership (assignment type shown as 'Inherited.') 


> [AZURE.NOTE]
>You will only see the Users and Groups tab once you have enabled Azure AD Premium.

Here are some topics that will provide some additional information on Azure Active Directory 

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [What is Azure Active Directory?](active-directory-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
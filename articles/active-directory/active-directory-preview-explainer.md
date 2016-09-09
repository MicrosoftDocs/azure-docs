<properties
	pageTitle="Azure Active Directory preview explainer | Microsoft Azure"
	description="A topic that explains the differences between Azure Active Directory in the classic portal and the Azure Active Directory preview in the Azure portal."
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
	ms.date="09/09/2016"
	ms.author="curtand"/>


# Preview of the Azure Active Directory management experience in the Azure portal
 
The Azure Active Directory (Azure AD) management experience is in preview in the Azure portal. You can try it out by signing in to [the Azure portal](https://portal.azure.com) as a global administrator of your directory. Then, select Azure Active Directory in the services list if it is visible, or select **More services** to view the list of all services.
 
The preview experience enables you to manage many directory resources such as users, groups, and applications, as well as directory settings, in the Azure portal. This experience will be improved to include all the capabilities that exist in the Azure AD management experience in the [Azure classic portal](https://manage.windowsazure.com). Until then, there are some directory management tasks that you will need to complete in the classic portal.
 
The preview experience reads and writes to the same Azure Active Directory tenant as the classic portal, and the Office 365 Admin center. Changes made in any of these portals will be reflected in all of the others.
 
The preview experience uses the same authorization logic as existing Active Directory clients. Users are authorized to make changes to directory resources based on their directory role, such as global administrator, user administrator, password administrator. Having a role on Azure resources or an Azure subscription does not authorize a user to manage directory resources. For more information Azure AD management roles, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md).
 
The preview experience is optimized for global administrators. If you use preview experience while signed in as a user that is not a global administrator, you may have a degraded experience. For example, you might be able to select a button that lets you begin a task that the directory will not allow you to complete. This experience will be improved soon.
 
You can provide feedback on the preview experience in the admin portal section of the [dev-null]Azure AD feedback forum(https://social.msdn.microsoft.com/Forums/home?forum=WindowsAzureAD&filter=alltypes&sort=lastpostdesc).

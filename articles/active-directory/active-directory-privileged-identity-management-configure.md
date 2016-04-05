<properties
	pageTitle="Azure AD Privileged Identity Management"
	description="A topic that explains what Azure AD Privileged Identity Management is and how to configure it."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="kgremban"/>

# Azure AD Privileged Identity Management

Azure Active Directory (AD) Privileged Identity Management lets you manage, control, and monitor your privileged identities and their access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

To enable users to carry out privileged operations, organizations often need to give many of their users permanent privileged access in Azure AD for use in Azure or Office 365 resources, or other SaaS apps. For example, some services require a user to be in the Global Administrator role in order to perform certain administrative tasks in those service's admin portal. For many customers, this is a growing security risk for their cloud-hosted resources because they cannot sufficiently monitor what those users are doing with their admin privileges. In addition, a compromised user account that has privileged access could impact their overall cloud security. Azure AD Privileged Identity Management helps to resolve this risk.  

Azure AD Privileged Identity Management lets you:  

- Discover which users are the Azure AD admins
- Enable on-demand, "just in time" administrative access to Microsoft Online Services such as Office 365 and Intune
- Get reports about administrator access history and about changes in administrator assignments
- Get alerts about access to a privileged role

Azure AD Privileged Identity Management can manage the built-in Azure Active Directory organizational roles, including:  

- Global Administrator
- Billing Administrator
- Service Administrator  
- User Administrator
- Password Administrator

## Just in time administrator access

Historically, you could assign a user to an admin role through the previous Azure Management Portal or Windows PowerShell. As a result, that user becomes a **permanent admin** for that role, always active in his or her assigned role. Azure AD Privileged Identity Management introduces the concept of a **temporary admin** for a role, which is a user who needs to complete an activation process for that assigned role.  The activation process changes the assignment of the user to a role in Azure AD from inactive to active, for a specified time period such as 8 hours.

## Enabling Privileged Identity Management for your directory

You can start using Azure AD Privileged Identity Management by accessing the [Azure portal](https://portal.azure.com/). Azure AD Privileged Identity Management does not appear in the earlier classic portal. You must be a global administrator with an organizational account, not a Microsoft Account, to enable Azure AD Privileged Identity Management for a directory.


1. Sign in to the [Azure portal](https://portal.azure.com/) with an organizational account that is a global administrator of your directory.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will use Azure AD Privileged Identity Management.
3. Click the **New** icon in the left navigation.
4. Select **Security + Identity** from the Create menu.
5. Select **Azure AD Privileged Identity Management**.
6. Leave **Pin to dashboard** checked and then click the **Create** button. The Privileged Identity Management dashboard will open.

![Azure portal - search for privileged identities - screenshot][1]

After [completing the security wizard](active-directory-privileged-identity-management-security-wizard.md), you will automatically become the first **Security administrator** of the directory. Only a security administrator can access this extension to manage the access for other administrators.  

Also, a tile of Azure AD Privileged Identity Management will be added to the start board of the Azure portal, so you can launch the extension to change other user's role assignments.

## Privileged Identity Management dashboard

Azure AD Privileged Identity Manager provides a dashboard which gives you important information such as:

- The number of users who are assigned to each privileged role  
- The number of temporary and permanent admins
- The administrator's access history

![PIM dashboard - screenshot][2]

## Privileged role management

With Azure AD Privileged Identity Management, you can manage the administrators by adding or removing permanent or temporary administrators to each role.

![PIM add/remove administrators - screenshot][3]

## Configure the role activation settings

Using the role activation setting you can configure the temporary role activation properties including:

- The duration of the role activation period
- The role activation notification
- The information a user needs to provide during the role activation process  

![PIM settings - administrator activation - screenshot][4]

## Role activation  

In order to activate a role, a temporary admin needs to request a time-bound "activation" for the role. The activation can be requested using the **Activate my role** option in Azure AD Privileged Identity Management.

An admin who wants to activate a role needs to initialize Azure AD Privileged Identity Management in the Azure portal.

Any type of admin can use Azure AD Privileged Identity Management to activate his or her role.

Role activation is time-bound. In the Role Activation settings, you can configure the length of the activation as well as the required information that the admin needs to provide in order to activate the role.

![PIM administrator request role activation - screenshot][5]

## Role activation history

Using Azure AD Privileged Identity Management, you can also track changes in privileged role assignments and role activation history. This can be done using the audit log options:

![PIM activation history - screenshot][6]

## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->
[1]: ./media/active-directory-privileged-identity-management-configure/Search_PIM.png
[2]: ./media/active-directory-privileged-identity-management-configure/PIM_Dash.png
[3]: ./media/active-directory-privileged-identity-management-configure/PIM_AddRemove.png
[4]: ./media/active-directory-privileged-identity-management-configure/PIM_RoleActivationSettings.png
[5]: ./media/active-directory-privileged-identity-management-configure/PIM_RequestActivation.png
[6]: ./media/active-directory-privileged-identity-management-configure/PIM_ActivationHistory.png

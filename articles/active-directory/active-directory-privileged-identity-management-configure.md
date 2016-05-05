<properties
	pageTitle="Azure AD Privileged Identity Management | Microsoft Azure"
	description="A topic that explains what Azure AD Privileged Identity Management is and how to use PIM to improve your cloud security."
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
	ms.date="04/15/2016"
	ms.author="kgremban"/>

# Azure AD Privileged Identity Management

Azure Active Directory (AD) Privileged Identity Management lets you manage, control, and monitor your privileged identities and access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

Sometimes users need to carry out privileged operations in Azure or Office 365 resources, or other SaaS apps. This often means organizations have to give them permanent privileged access in Azure AD. This is a growing security risk for cloud-hosted resources because organizations can't sufficiently monitor what those users are doing with their admin privileges. Additionally, if a user account with privileged access is compromised, that one breach could impact their overall cloud security. Azure AD Privileged Identity Management helps to resolve this risk.  

Azure AD Privileged Identity Management lets you:  

- See which users are Azure AD admins
- Enable on-demand, "just in time" administrative access to Microsoft Online Services like Office 365 and Intune
- Get reports about administrator access history and changes in administrator assignments
- Get alerts about access to a privileged role

Azure AD Privileged Identity Management can manage the built-in Azure AD organizational roles, including:  

- Global Administrator
- Billing Administrator
- Service Administrator  
- User Administrator
- Password Administrator

## Just in time administrator access

Historically, you could assign a user to an admin role through the previous Azure Management Portal or Windows PowerShell. As a result, that user becomes a **permanent admin** for that role, always active in his or her assigned role. Azure AD Privileged Identity Management introduces the concept of a **temporary admin** for a role, which is a user who needs to complete an activation process for that assigned role.  The activation process changes the assignment of the user to a role in Azure AD from inactive to active, for a specified time period such as 8 hours.

## Enable Privileged Identity Management for your directory

You can start using Azure AD Privileged Identity Management by accessing the [Azure portal](https://portal.azure.com/). Azure AD Privileged Identity Management does not appear in the earlier classic portal.

>[AZURE.NOTE] You must be a global administrator with an organizational account, not a Microsoft Account, to enable Azure AD Privileged Identity Management for a directory.

1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator of your directory.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will use Azure AD Privileged Identity Management.
3. Click the **New** icon in the left navigation.
4. Select **Security + Identity**.
5. Select **Azure AD Privileged Identity Management**.
6. Check the **Pin to dashboard** option and then click the **Create** button. The Privileged Identity Management dashboard will open.

If you're the first person to use Azure AD Privileged Identity Management in your directory, then the [security wizard](active-directory-privileged-identity-management-security-wizard.md) will walk you through the initial assignment experience. After that you will automatically become the first **Security administrator** of the directory.

Only a security administrator can use the PIM app to manage access for other administrators. You can [give other users the ability to manage in PIM](active-directory-privileged-identity-management-how-to-give-access-to-pim.md).

## Privileged Identity Management dashboard

Azure AD Privileged Identity Manager provides a dashboard which gives you important information such as:

- The number of users who are assigned to each privileged role  
- The number of temporary and permanent admins
- Each administrator's access history

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

Role activation is time-bound. In the Role Activation settings you can set the length of the activation, as well as the required information that the admin needs to provide in order to activate the role.

![PIM administrator request role activation - screenshot][5]

## Role activation history

Using Azure AD Privileged Identity Management, you can also track changes in privileged role assignments and role activation history. This can be done using the audit log options:

![PIM activation history - screenshot][6]

## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[2]: ./media/active-directory-privileged-identity-management-configure/PIM_Dash.png
[3]: ./media/active-directory-privileged-identity-management-configure/PIM_AddRemove.png
[4]: ./media/active-directory-privileged-identity-management-configure/PIM_RoleActivationSettings.png
[5]: ./media/active-directory-privileged-identity-management-configure/PIM_RequestActivation.png
[6]: ./media/active-directory-privileged-identity-management-configure/PIM_ActivationHistory.png

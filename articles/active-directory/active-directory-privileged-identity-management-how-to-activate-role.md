<properties
   pageTitle="How to activate or deactivate a role | Microsoft Azure"
   description="Learn how to activate roles for privileged identities with the Azure Privileged Identity Management application."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="04/15/2016"
   ms.author="kgremban"/>

# How to activate or deactivate roles in Azure AD Privileged Identity Management

Azure Active Directory (AD) Privileged Identity Management simplifies how enterprises manage privileged identities and access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

This article is for admins who need to activate their role in Azure AD Privileged Identity Management (PIM). It will walk you through the steps to activate a role when you need the permissions, and deactivate the role when you're done.

If you have been assigned to an administrative role, you can activate that role when you need to perform a task that requires that role. For example, if you only need to manage Office 365 sometimes, your organization's security administrators don't want to make you a permanent admin. Instead, they make you a candidate for the Global Administrator or Exchange Online Administrator roles in Azure AD. This means that you can request a temporary role assignment when you need those privileges, and you'll have admin control for Office 365 for a predetermined time period.


## Add the Privileged Identity Management application

Use the Azure AD Privileged Identity Management application in the [Azure portal](https://portal.azure.com/) to request a role "activation" even if you're going to operate in another portal or via PowerShell. If you don't have the Azure AD Privileged Identity Management application on your Azure portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/), if you haven't already.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will you be operating.
3. Click the **New** icon in the left navigation.
4. Select **Security + Identity** from the Create menu.
5. Select **Azure AD Privileged Identity Management**.
6. Check **Pin to dashboard** and then click the **Create** button. The Privileged Identity Management application will open.

## Activate a role

When you need to take on a role, you can request activation using the **Activate my role** button in the Azure AD Privileged Identity Management application.


1. Sign in to the [Azure portal](https://portal.azure.com/) and select the Azure AD Privileged Identity Management tile.
2. Select **Activate my role**. A list of roles that have been assigned to you will appear.
3. Select the role you want to activate.
4. Select **Activate**. The **Request role activation** blade will appear.
5. For some roles, like Global Administrator, Multi-Factor Authentication (MFA) is required to activate the role.  If you did not perform MFA when logging in, you may have to before the role can be activated.
6. Enter the reason for the activation request in the text field.  The security administrator may also require you to supply a trouble ticket number.
7. Select **OK**.  The role will now be activated and the role change will become visible in the Microsoft Online Services.

## Deactivate a role

Once a role has been activated, it will automatically deactivate when its time limit is reached.

If you are done early, you can also deactivate a role manually in the Azure AD Privileged Identity Management application.  Select **Activate my role**, find the role you no longer need at present, and select **Deactivate**.  


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

If you're interested in learning more about Azure AD Privileged Identity Management, the following links have more information.

[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

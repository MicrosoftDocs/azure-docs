<properties
   pageTitle="How To activate or deactivate a role | Microsoft Azure"
   description="Learn how to activate roles for privileged identities with the Azure Privileged Identity Management extension."
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
   ms.date="03/17/2016"
   ms.author="kgremban"/>

# Azure AD Privileged Identity Management: How to activate or deactivate a role

Azure Active Directory (AD) Privileged Identity Management simplifies how enterprises manage privileged identities and their access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

If you have been assigned to an administrative role, you can activate that role when you need to perform a task that requires that role.  For example, if you have an only occasional need to manage Office 365, your organization's security administrator may have made you a candidate for the Global Administrator or Exchange Online Administrator roles in Azure AD.  While your account does not normally have the privileges associated with those roles, you can request as soon as you need those privileges, and then they will be associated with your account for a predetermined time period.


## Adding the Privileged Identity Management extension

You can use the Azure AD Privileged Identity Management extension in the [Azure portal](https://portal.azure.com/) to request an "activation" for a role, even if you're going to be operating in another portal or via PowerShell.  If you don't have the Azure AD Privileged Identity Management extension on your portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/), if you haven't already.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will you be operating.
3. Click the **New** icon in the left navigation.
4. Select **Security + Identity** from the Create menu.
5. Select **Azure AD Privileged Identity Management**.
6. Leave **Pin to dashboard** checked and then click the **Create** button. The Privileged Identity Management extension will open.

## Activating a role

When you need to take on a role, you can request activation using the **Activate my role** button in the Azure AD Privileged Identity Management extension.


1. Log in to the [Azure portal](https://portal.azure.com/) and click on the Azure AD Privileged Identity Management tile.
2. Click on **Activate my role**. A list of roles that have been assigned to you will appear.
3. Click on the role you want to activate.
4. Click **Activate**. The **Request role activation** blade will appear.
5. For some roles such as Global Administrator, MFA (Multi-Factor Authentication) is required to activate the role.  If you did not perform MFA when logging in, you may be required to perform MFA validation before the role can be activated.
6. Enter the reason for the activation request in the text field.  The security administrator may also require you to supply a trouble ticket number.
7. Click **OK**.  The role will now be activated and the role change will become visible in the Microsoft Online Services.

## Deactivating a role


Once a role has been activated, it will automatically deactivate when its time limit is reached.

If you are done early, you can also deactivate a role manually in the Azure AD Privileged Identity Management extension.  Click on Activate my role, fine the role you no longer need at present, and click **Deactivate**.  


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

If you're interested in learning more about Azure AD Privileged Identity Management, the following links have more information.

[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

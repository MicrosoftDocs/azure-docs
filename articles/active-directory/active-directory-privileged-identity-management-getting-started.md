<properties
   pageTitle="Getting started with Azure AD Privileged Identity Management"
   description="Learn how to manage privileged identities with the Azure Active Directory Privileged Identity Management extension."
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

# Getting started with Azure AD Privileged Identity Management


Azure Active Directory (AD) Privileged Identity Management lets you manage, control, and monitor your privileged identities and their access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

## Adding the Privileged Identity Management extension

1. Sign in to the [Azure portal](https://portal.azure.com/) as an organizational account that is a global administrator of your directory.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will use PIM.
3. Click the **New** icon in the left navigation.
4. Select **Security + Identity** from the Create menu.
5. Select **Azure AD Privileged Identity Management**.
6. Leave **Pin to dashboard** checked and then click the **Create** button. The Privileged Identity Management extension will open.

## Managing Azure AD Privileged Identity Management

If you're the first person to use Azure AD Privileged Identity Management in your directory, then the [security wizard](active-directory-privileged-identity-management-security-wizard.md) will walk you through the initial assignment experience, and then you will automatically become the first **Security administrator** of the directory. Only a security administrator can access this extension to manage the access for other administrators.  

Otherwise, assuming you've been assigned to one or more roles by another security administrator, you'll have a choice of which role to activate. If you are in a security administrator role yourself, you'll also see a choice to **Manage Identities**.  


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

The [Azure AD Privileged Identity Management overview](active-directory-privileged-identity-management-configure.md) includes more details on how you can manage adminitrative access in your organization.

[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

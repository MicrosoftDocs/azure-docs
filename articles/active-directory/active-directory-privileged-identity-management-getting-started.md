<properties
   pageTitle="Get started with Azure AD Privileged Identity Management | Microsoft Azure"
   description="Learn how to manage privileged identities with the Azure Active Directory Privileged Identity Management application in Azure portal."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/29/2016"
   ms.author="kgremban"/>

# Get started with Azure AD Privileged Identity Management


Azure Active Directory (AD) Privileged Identity Management lets you manage, control, and monitor your privileged identities and access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

This article tells you how to add the Azure AD PIM app to your Azure portal dashboard.

## Add the Privileged Identity Management application

Before you use Azure AD Privileged Identity Management, you need to add the application to your Azure portal dashboard.

1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator of your directory.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will use PIM.
3. Select **New** > **Security + Identity** > **Azure AD Privileged Identity Management**.

    ![Enable PIM in the portal][1]

4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application will open.


If you're the first person to use Azure AD Privileged Identity Management in your directory, then the [security wizard](active-directory-privileged-identity-management-security-wizard.md) will walk you through the initial assignment experience. After that, you will automatically become the first **Security administrator** and **Privileged role administrator** of the directory. Only a privileged role administrator can access this application to manage the access for other administrators.  

If you've been assigned to one or more roles, you have the option to **Activate my roles**. If you are a privileged role administrator, you'll also see an option to **Manage privileged roles**.  


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

The [Azure AD Privileged Identity Management overview](active-directory-privileged-identity-management-configure.md) includes more details on how you can manage adminitrative access in your organization.

[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-configure/PIM_EnablePim.png

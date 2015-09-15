<properties
	pageTitle="Azure Active Directory: Create directory support topic | Microsoft Azure"
	description="Creating an Azure Active Directory directory or an Azure Active Directory B2C directory - Issues & resolutions"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/15/2015"
	ms.author="swkrish"/>

# Creating an Azure Active Directory (Azure AD) or an Azure Active Directory B2C (Azure AD B2C) Directory - Issues & Resolutions

### Creating an Azure AD Directory

If you can't create an Azure AD directory the first time, please try again. If the problem persists, contact Support.

### Creating an Azure AD B2C Directory (preview)

There are known issues that you may encounter during the [creation of an Azure AD B2C directory](active-directory-b2c-get-started).

- If the Azure AD B2C directory doesn't show up in your list of directories, please try again.
- If the Azure AD B2C directory does show up in your list of directories, but you see an error message that says, "Could not complete the creation of the B2C directory 'contosob2c'. Please visit this [link](http://go.microsoft.com/fwlink/?LinkID=624192&clcid=0x409) for more guidance.", then do one of the following:
    - Navigate to the B2C features blade on the Azure preview portal using this link [https://portal.azure.com/{directory}.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/{directory}.onmicrosoft.com](https://portal.azure.com/{directory}.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/{directory}.onmicrosoft.com), where **{directory}** is to be replaced by the name used at directory creation time (for example, contosob2c), and sign in as the Global Administrator. Click **Enable B2C features** at the top of the blade and click **OK**. Your Azure AD B2C directory should be ready for use!
	- Delete the directory just created and try again.
- If none of the above resolutions work for you, contact Support. Read [this article](active-directory-b2c-support.md) on how to file support requests for Azure AD B2C.

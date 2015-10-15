<properties
	pageTitle="Azure Active Directory: Create tenant support topic | Microsoft Azure"
	description="Creating an Azure Active Directory tenant or an Azure Active Directory B2C tenant - Issues & resolutions"
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
	ms.date="09/24/2015"
	ms.author="swkrish"/>

# Creating an Azure AD Tenant or an Azure AD B2C Tenant - Issues & Resolutions

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

## Creating an Azure AD Tenant

If you can't create an Azure AD tenant the first time, please try again. If the problem persists, contact Support.

## Creating an Azure AD B2C Tenant (preview)

There are known issues that you may encounter during the [creation of an Azure AD B2C tenant](active-directory-b2c-get-started.md).

- If the Azure AD B2C tenant doesn't show up in your list of tenants, please try again.
- If the Azure AD B2C tenant does show up in your list of tenants, but you see an error message that says, "Could not complete the creation of the B2C tenant 'contosob2c'. Please visit this [link](http://go.microsoft.com/fwlink/?LinkID=624192&clcid=0x409) for more guidance.", then do one of the following:
    - Navigate to the B2C features blade on the Azure preview portal using this link [https://portal.azure.com/{tenant}.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/{tenant}.onmicrosoft.com](https://portal.azure.com/{directory}.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/{tenant}.onmicrosoft.com), where **{tenant}** is to be replaced by the name used at tenant creation time (for example, contosob2c), and sign in as the Global Administrator. Click **Enable B2C features** at the top of the blade and click **OK**. Your Azure AD B2C tenant should be ready for use!
	- Delete the tenant just created and try again.
- If none of the above resolutions work for you, contact Support. Read [this article](active-directory-b2c-support.md) on how to file support requests for Azure AD B2C.

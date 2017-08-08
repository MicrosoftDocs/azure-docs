---
title: Add language-specific company branding to your sign-in page in the Azure Active Directory | Microsoft Docs
description: Learn how to add a language specific company branding pictures and text to an Azure sign-in page
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: a0310d6a-aaa7-4ea0-991d-6d3135b4382a
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/04/2017
ms.author: curtand

---
# Add language-specific company branding to your sign-in page in the Azure Active Directory

You can add language-specific elements to your custom sign-in page only if you have already created a custom sign-in page as described in [Add company branding to your sign-in page](active-directory-branding-custom-signon-azure-portal.md). You can configure one sign-in page per directory with a default set of customizable elements. After you’ve configured the default set of page elements, you can configure more versions for different locales. 

## Example of this branding

You can also mix and match various elements across the default and locale-specific branding set. Imagine the following configuration: 

* A default background image and banner logo
* A language-specific banner logo for German

When the sign-in page is loaded in German, the default background image shows with the German logo.

## To add language-specific company branding to your directory

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that's a global admin for the directory.
2. Select **Users and groups** in the text box, and then select **Enter**.

   ![Opening user management](./media/active-directory-branding-localize-azure-portal/user-management.png)
3. On the **Users and groups** blade, select **Company branding**.
4. On the **Users and groups - Company branding** blade, select the **Add language** command.

    ![Add language-specific branding elements](./media/active-directory-branding-localize-azure-portal/add-language.png)
5. Modify the elements you want to customize. All elements are optional.
6. Click **Save**.

It can take up to an hour for any changes you made to the sign-in page branding to appear.

## Next steps
[Add company branding to your sign-in page](active-directory-branding-custom-signon-azure-portal.md)

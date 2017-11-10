---
title: 'Customize: Azure AD SSPR | Microsoft Docs'
description: Customization options for Azure AD self-service password reset
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2017
ms.author: joflore
ms.custom: it-pro

---
# Customize the Azure AD functionality for self-service password reset

IT professionals who want to deploy self-service password reset (SSPR) in Azure Active directory (Azure AD) can customize the experience to match their users' needs.

## Customize the "Contact your administrator" link

Even if SSPR is not enabled, users still have a "Contact your administrator" link on the password reset portal. If a user selects this link, it emails your administrators and asks for assistance in changing the user's password or sends your users to a URL that you specify. We recommend that you set this contact to something like an email address or website that your users already use for support questions.

![Contact][Contact]

The contact email is sent to the following recipients in the following order:

1. If the **Password administrator** role is assigned, administrators with this role are notified.
2. If no Password administrators are assigned, then administrators with the **User administrator** role are notified.
3. If neither of the previous roles are assigned, then the **Global administrators** are notified.

In all cases, a maximum of 100 recipients are notified.

To find out more about the different administrator roles and how to assign them, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md).

### Disable "Contact your administrator" emails

If your organization does not want administrators notified about password reset requests, you can enable the following configuration:

* Enable self-service password reset for all end users. This option is under **Password Reset** > **Properties**.
    * If you don't wish users to reset their own passwords, you can scope access to an empty group. *We don't recommend this option.*
* Customize the helpdesk link to provide a web URL or mailto: address that users can use to get assistance. This option is under **Password Reset** > **Customization** > **Custom helpdesk email or URL**.

## Customize the ADFS sign-in page for SSPR

Active Directory Federation Services (AD FS) administrators can add a link to their sign-in page by using the guidance found in the [Add sign-in page description](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/add-sign-in-page-description) article.

To add a link to the AD FS sign-in page, use the following command on your AD FS server. Users can use this page to enter the self-service password reset workflow.

``` Set-ADFSGlobalWebContent -SigninPageDescriptionText "<p><A href=’https://passwordreset.microsoftonline.com’>Can’t access your account?</A></p>" ```

## Customize the sign-in and access panel look and feel

You can customize the sign-in page. You can add a logo that appears along with the image that fits your company branding.

The graphics you choose are shown in the following circumstances:

* After a user types their username.
* If the user accesses the customized URL:
    * By passing the *whr* parameter to the password reset page, like *https://login.microsoftonline.com/?whr=contoso.com*.
    * By passing the *username* parameter to the password reset page, like *https://login.microsoftonline.com/?username=admin@contoso.com*.

### Graphics details

The following settings allow you to change the visual characteristics of the sign-in page. Go to **Azure Active Directory** > **Company branding** > **Edit company branding**:

* The sign-in page image should be a .png or .jpg file, 1420x1200 pixels, and no larger than 500 KB. For the best results, we recommend it to be around 200 KB.
* The sign-in page background color is used on high-latency connections and must be in RGB hexadecimal format.
* The banner image should be a .png or .jpg file, 60x280 pixels, and be no larger than 10 KB.
* The square logo (normal and dark theme) should be a .png or .jpg, 240x240 (resizable), and no larger than 10 KB.

### Sign-in text options

The following settings allow you to add text to the sign-in page that's relevant to your organization. Go to **Azure Active Directory** > **Company branding** > **Edit company branding**:

* **User name hint**: Replaces the example text of *someone@example.com* with something more appropriate for your users. We recommended that you leave the default hint when you support internal and external users.
* **Sign-in page text**: Can be a maximum of 256 characters in length. This text appears anywhere your users sign in online and in the Azure AD Workplace Join experience on Windows 10. Use this text for the terms of use, instructions, and tips for your users. *Anyone can see your sign-in page, so don't provide any sensitive information here.*

### The "Keep me signed in disabled" setting

The option "Keep me signed in disabled" allows users to remain signed in when they close and reopen their browser window. This option does not impact session lifetimes. Go to **Azure Active Directory** > **Company branding** > **Edit company branding**.

Some features of SharePoint Online and Office 2010 have a dependency on users being able to select this check box. If you hide this option, users can get additional and unexpected sign-in prompts.

### Directory name

You can change the directory name attribute under **Azure Active Directory** > **Properties**. You can show a friendly organization name that is seen in the portal and the automated communications. This option is the most visible in automated emails in the forms that follow:

* The friendly name in the email, for example “Microsoft on behalf of CONTOSO demo.”
* The subject line in the email, for example “CONTOSO demo account email verification code.”

## Next steps

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Contact]: ./media/active-directory-passwords-customize/sspr-contact-admin.png "Contact your administrator for help resetting your password email example"

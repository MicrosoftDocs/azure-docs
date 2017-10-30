---
title: 'Customizing: Azure AD SSPR | Microsoft Docs'
description: Customization options for Azure AD self service password reset
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
# Customize Azure AD functionality for Self-Service Password Reset

IT Professionals looking to deploy self-service password reset can customize the experience to match their users.

## Customize the contact your administrator link

Even if SSPR is not enabled users still a "contact your administrator" link on the password reset portal.  Clicking this link emails your administrators asking for assistance in changing the user's password or sends your users to a URL that you specify. We recommend that you set this to something like an email address or website that your users are used to using for support.

![Contact][Contact]

This email is sent to the following recipients in the following order:

1. If the **Password administrator** role is assigned, administrators with this role are notified
2. If no Password administrators are assigned, then administrators with the **User administrator** role are notified
3. If neither of the previous roles were assigned, then **Global administrators** are notified

In all cases, a maximum of 100 recipients are notified.

To find out more about the different administrator roles and how to assign them see the document [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md)

### Disable contact your administrator emails

If your organization does not want administrators notified about password reset requests, the following configuration can be enabled

* Enable self-service password reset for all end users. This option is under **Password Reset > Properties**.
    * If you do not wish users to reset their own passwords, you can scope access to an empty group **we do not recommend this option**.
* Customize the helpdesk link to provide a web URL or mailto: address that users can use to get assistance. This option is under **Password Reset > Customization > Custom helpdesk email or URL**.

## Customize ADFS sign-in page for SSPR

ADFS Administrators can add a link to their sign-in page using the guidance found in the article [Add sign-in page description](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/add-sign-in-page-description).

Using the command that follows on your ADFS server adds a link to the ADFS login page allowing users to enter the self-service password reset workflow directly.

``` Set-ADFSGlobalWebContent -SigninPageDescriptionText "<p><A href=’https://passwordreset.microsoftonline.com’>Can’t access your account?</A></p>" ```

## Customize the sign-in and access panel look and feel

When your users access the login page, you can customize the logo that appears along with the sign-in page image to fit your company branding.

These graphics are shown in the following circumstances:

* After a user types their username
* User accesses customized url
    * By passing the "whr" parameter to the password reset page, like "https://login.microsoftonline.com/?whr=contoso.com"
    * By passing the "username" parameter to the password reset page, like "https://login.microsoftonline.com/?username=admin@contoso.com"

### Graphics details

The following settings allow you to change the visual characteristics of the sign-in page and can be found under **Azure Active Directory**, **Company branding**, **Edit company branding**

* Sign-in page image should be a PNG or JPG file 1420x1200 pixels and no larger than 500KB. We recommend it to be around 200 KB for best results.
* Sign-in page background color is used when on high-latency connections and must be in the RGB hex format.
* Banner image should be a PNG or JPG file 60x280 pixels and no larger than 10 KB.
* Square logo (normal and dark theme) PNG or JPG 240x240 (resizable) no larger than 10 KB.

### Sign-in text options

The following settings allow you to add text to the sign-in page relevant to your organization. These settings can be found under **Azure Active Directory**, **Company branding**, **Edit company branding**

* **User name hint** replaces the example text of someone@example.com with something more appropriate for your users, recommended to be left default when supporting internal and external users
* **Sign-in page text** is a maximum of 256 characters in length. This text appears anywhere your users login online, and in the Azure AD Join experience on Windows 10. Use this text for terms of use, instructions, and tips for your users. **Anyone can see your sign-in page so do not provide any sensitive information here.**

### Keep me signed in disabled

The option "Keep me signed in disabled" allows users to remain signed in when they close and reopen their browser window. This option does not impact session lifetimes. This setting is found under **Azure Active Directory > Company branding > Edit company branding**.

Some features of SharePoint Online and Office 2010 have a dependency on users being able to check this box. If you hide this option, users may get additional and unexpected sign-in prompts.

### Directory name

You can change the name attribute under **Azure Active Directory > Properties** to show a friendly organization name seen in the portal and automated communications. This option is most visible in the form of automated emails in the forms that follow

* Friendly name in email “Microsoft on behalf of CONTOSO demo”
* Subject line in email “CONTOSO demo account email verification code”

## Next steps

* [How do I complete a successful rollout of SSPR?](active-directory-passwords-best-practices.md)
* [Reset or change your password](active-directory-passwords-update-your-own-password.md).
* [Register for self-service password reset](active-directory-passwords-reset-register.md).
* [Do you have a Licensing question?](active-directory-passwords-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](active-directory-passwords-data.md)
* [What authentication methods are available to users?](active-directory-passwords-how-it-works.md#authentication-methods)
* [What are the policy options with SSPR?](active-directory-passwords-policy.md)
* [What is password writeback and why do I care about it?](active-directory-passwords-writeback.md)
* [How do I report on activity in SSPR?](active-directory-passwords-reporting.md)
* [What are all of the options in SSPR and what do they mean?](active-directory-passwords-how-it-works.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Contact]: ./media/active-directory-passwords-customize/sspr-contact-admin.png "Contact your administrator for help resetting your password email example"
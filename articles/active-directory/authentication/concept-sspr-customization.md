---
title: Customizing Azure AD self-service password reset - Azure Active Directory
description: Customization options for Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# Customize the Azure AD functionality for self-service password reset

IT professionals who want to deploy self-service password reset (SSPR) in Azure Active directory (Azure AD) can customize the experience to match their users' needs.

## Customize the "Contact your administrator" link

Even if SSPR is not enabled, users still have a "Contact your administrator" link on the password reset portal. If a user selects this link, it either:

* Emails your administrators and asks them for assistance in changing the user's password.
* Sends your users to a URL that you specify for assistance.

We recommend that you set this contact to something like an email address or website that your users already use for support questions.

![Sample request to reset email sent to Administrator][Contact]

The contact email is sent to the following recipients in the following order:

1. If the **password administrator** role is assigned, administrators with this role are notified.
2. If no password administrators are assigned, then administrators with the **user administrator** role are notified.
3. If neither of the previous roles are assigned, then the **global administrators** are notified.

In all cases, a maximum of 100 recipients are notified.

To find out more about the different administrator roles and how to assign them, see [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md).

### Disable "Contact your administrator" emails

If your organization does not want to notify administrators about password reset requests, you can enable the following configuration:

* Enable self-service password reset for all end users. This option is under **Password Reset** > **Properties**. If you don't want users to reset their own passwords, you can scope access to an empty group. *We don't recommend this option.*
* Customize the helpdesk link to provide a web URL or mailto: address that users can use to get assistance. This option is under **Password Reset** > **Customization** > **Custom helpdesk email or URL**.

## Customize the AD FS sign-in page for SSPR

Active Directory Federation Services (AD FS) administrators can add a link to their sign-in page by using the guidance found in the [Add sign-in page description](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/add-sign-in-page-description) article.

To add a link to the AD FS sign-in page, use the following command on your AD FS server. Users can use this page to enter the SSPR workflow.

``` powershell
Set-ADFSGlobalWebContent -SigninPageDescriptionText "<p><A href='https://passwordreset.microsoftonline.com' target='_blank'>Can’t access your account?</A></p>"
```

## Customize the sign-in page and access panel look and feel

You can customize the sign-in page. You can add a logo that appears along with the image that fits your company branding.

The graphics you choose are shown in the following circumstances:

* After a user enters their username
* If the user accesses the customized URL:
   * By passing the `whr` parameter to the password reset page, like `https://login.microsoftonline.com/?whr=contoso.com`
   * By passing the `username` parameter to the password reset page, like `https://login.microsoftonline.com/?username=admin@contoso.com`

Find details on how to configure company branding in the article [Add company branding to your sign-in page in Azure AD](../fundamentals/customize-branding.md).

### Directory name

You can change the directory name attribute under **Azure Active Directory** > **Properties**. You can show a friendly organization name that is seen in the portal and in the automated communications. This option is the most visible in automated emails in the forms that follow:

* The friendly name in the email, for example “Microsoft on behalf of CONTOSO demo”
* The subject line in the email, for example “CONTOSO demo account email verification code”

## Next steps

* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](../user-help/active-directory-passwords-update-your-own-password.md)
* [Register for self-service password reset](../user-help/active-directory-passwords-reset-register.md)
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](howto-sspr-writeback.md)
* [How do I report on activity in SSPR?](howto-sspr-reporting.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](active-directory-passwords-troubleshoot.md)
* [I have a question that was not covered somewhere else](active-directory-passwords-faq.md)

[Contact]: ./media/concept-sspr-customization/sspr-contact-admin.png "Contact your administrator for help resetting your password email example"

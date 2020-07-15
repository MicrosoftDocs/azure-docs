---
title: Customize self-service password reset - Azure Active Directory
description: Learn how to customize user display and experience options for Azure AD self-service password reset

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/14/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
---
# Customize the user experience for Azure Active Directory self-service password reset

Self-service password reset (SSPR) gives users in Azure Active Directory (Azure AD) the ability to change or reset their password, with no administrator or help desk involvement. If a user's account is locked or they forget their password, they can follow prompts to unblock themselves and get back to work. This ability reduces help desk calls and loss of productivity when a user can't sign in to their device or an application.

To improve the SSPR experience for users, you can customize the look and feel of the password reset page, email notifications, or sign-in pages. These customization options let you make it clear to the user they're in the right place, and give them confidence they're accessing company resources.
    
This article shows you how to customize the SSPR e-mail link for users, company branding, and AD FS sign-in page link.

## Customize the "Contact your administrator" link

To help users reach out for assistance with self-service password reset, a "Contact your administrator" link is shown in the password reset portal. If a user selects this link, it does one of two things:

* If this contact link is left in the default state, an email is sent to your administrators and asks them to provide assistance in changing the user's password. The following sample e-mail shows this default e-mail message:

    ![Sample request to reset email sent to administrator](./media/howto-sspr-customization/sspr-contact-admin.png)

* If customized, sends the user to a webpage or email address specified by the administrator for assistance.
    * If you customize this, we recommend setting this to something users are already familiar with for support.

    > [!WARNING]
    > If you customize this setting with an email address and account that needs a password reset the user may be unable to ask for assistance.

### Default email behavior

The default contact email is sent to recipients in the following order:

1. If the *helpdesk administrator* role or *password administrator* role is assigned, administrators with these roles are notified.
1. If no helpdesk administrator or password administrator is assigned, then administrators with the *user administrator* role are notified.
1. If none of the previous roles are assigned, then the *global administrators* are notified.

In all cases, a maximum of 100 recipients are notified.

To find out more about the different administrator roles and how to assign them, see [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md).

### Disable "Contact your administrator" emails

If your organization doesn't want to notify administrators about password reset requests, the following configuration options can be used:

* Customize the helpdesk link to provide a web URL or mailto: address that users can use to get assistance. This option is under **Password Reset** > **Customization** > **Custom helpdesk email or URL**.
* Enable self-service password reset for all users. This option is under **Password Reset** > **Properties**. If you don't want users to reset their own passwords, you can scope access to an empty group. *We don't recommend this option.*

## Customize the sign-in page and access panel

You can customize the sign-in page, such as to add a logo that appears along with the image that fits your company branding. For more information on how to configure company branding, see [Add company branding to your sign-in page in Azure AD](../fundamentals/customize-branding.md).

The graphics you choose are shown in the following circumstances:

* After a user enters their username
* If the user accesses the customized URL:
   * By passing the `whr` parameter to the password reset page, like `https://login.microsoftonline.com/?whr=contoso.com`
   * By passing the `username` parameter to the password reset page, like `https://login.microsoftonline.com/?username=admin@contoso.com`

### Directory name

To make things look more user-friendly, you can change organization name in the portal and in the automated communications. To change the directory name attribute in the Azure portal, browse to **Azure Active Directory** > **Properties**. This friendly organization name option is the most visible in automated emails, as in the following examples:

* The friendly name in the email, for example "*Microsoft on behalf of CONTOSO demo*"
* The subject line in the email, for example "*CONTOSO demo account email verification code*"

## Customize the AD FS sign-in page

If you use Active Directory Federation Services (AD FS) for user sign-in events, you can add a link to the sign-in page by using the guidance in the article to [Add sign-in page description](/windows-server/identity/ad-fs/operations/add-sign-in-page-description).

Provide users with a link to the page for them to enter the SSPR workflow, such as *https://passwordreset.microsoftonline.com*. To add a link to the AD FS sign-in page, use the following command on your AD FS server:

``` powershell
Set-ADFSGlobalWebContent -SigninPageDescriptionText "<p><a href='https://passwordreset.microsoftonline.com' target='_blank'>Can't access your account?</a></p>"
```

## Next steps

To understand the usage of SSPR in your environment, see [Reporting options for Azure AD password management](howto-sspr-reporting.md).

If you or users have problems with SSPR, see [Troubleshoot self-service password reset](active-directory-passwords-troubleshoot.md)

---
title: 'How it works: Azure AD password management | Microsoft Docs'
description: Learn about the different components of Azure AD password management--including where users register, reset, and change their passwords, and where admins configure, report on, and enable management of on-premises Active Directory passwords.
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: curtand

ms.assetid: 618c5908-5bf6-4f0d-bf88-5168dfb28a88
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: joflore

ms.custom: H1Hack27Feb2017

---
# How password management works in Azure Active Directory
> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-your-password).

Password management in Azure Active Directory (Azure AD) consists of the following logical components:

* **Password management configuration portal**: You can control different facets of how passwords are managed in your tenants by navigating to their directory’s **Configure** tab in the [Azure portal](https://manage.windowsazure.com).
* **User registration portal**: Users can self-register for password reset through this web portal.
* **User password reset portal**: Users can reset their own passwords by using various challenges in accordance with the administrator-controlled password reset policy.
* **User password change portal**: Users can change their own passwords at any time by entering their old password and selecting a new password through this web portal.
* **Password management reports**: You can view and analyze password reset and registration activity in your tenant by navigating to the **Activity Reports** section of their directory’s **Reports** tab in the [Azure portal](https://manage.windowsazure.com).
* **Password Writeback component of Azure AD Connect**: You can optionally enable the Password Writeback feature when you install Azure AD Connect to enable management of federated or password synchronized user passwords from the cloud.

## Password management configuration portal
You can configure password management policies for a specific directory in the [Azure portal](https://manage.windowsazure.com) by navigating to the **User Password Reset Policy** section on the directory’s **Configure** tab. From this configuration page, you can control many aspects of how passwords are managed in your organization, including:

* Enabling and disabling password reset for all users in a directory.
* Setting the number of challenges (either one or two) that a user must go through to reset their password.
* Setting the specific types of challenges that you want to enable for users in your organization from these choices:
  * Mobile phone (a verification code via text or a voice call)
  * Office phone (a voice call)
  * Alternate email (a verification code via email)
  * Security questions (knowledge-based authentication)
* Setting the number of questions that a user must register to use the security questions authentication method (only visible if security questions are enabled).
* Setting the number of questions that a user must supply during reset to use the security questions authentication method (only visible if security questions are enabled).
* Using pre-canned, localized, security questions that a user can choose to use when they're registering for password reset (only visible if security questions are enabled).
* Defining the custom security questions that a user can choose to use when they're registering for password reset (only visible if security questions are enabled).
* Requiring users to register for password reset when they go to the application [Access Panel](http://myapps.microsoft.com).
* Requiring users to reconfirm their previously registered data after a configurable number of days have passed (only visible if enforced registration is enabled).
* Providing a custom helpdesk email or URL that's shown to users in case they have a problem resetting their passwords.
* Enabling or disabling the Password Writeback capability (when Password Writeback has been deployed by using Azure AD Connect).
* Viewing the status of the Password Writeback agent (when Password Writeback has been deployed by using Azure AD Connect).
* Enabling email notifications to users when their own password has been reset (found in the **Notifications** section of the [Azure portal](https://manage.windowsazure.com)).
* Enabling email notifications to administrators when other administrators reset their own passwords (found in the **Notifications** section of the [Azure portal](https://manage.windowsazure.com)).
* Branding the user password reset portal and password reset emails with your organization’s logo and name by using the tenant branding customization feature (found in the **Directory Properties** section of the [Azure portal](https://manage.windowsazure.com)).

To learn more about configuring password management in your organization, see [Getting started: Azure AD password management](active-directory-passwords-getting-started.md).

## User registration portal
Before your users can use password reset, you must update their cloud user accounts with the correct authentication data to ensure that they can pass through the appropriate number of password reset challenges that you define. You can also define this authentication information on the user’s behalf by using the Azure or Office web portals, DirSync/Azure AD Connect, or Windows PowerShell.

However, if you’d rather have your users register their own data, we also provide a webpage that users can go to so that they can add this information. This page allows users to specify authentication information in accordance with the password reset policies that have been enabled in their organization. After this data is verified, it is stored in their cloud user account for use in account recovery at a later time.

Here’s what the registration portal looks like:

  ![][001]

For more information, see [Getting started: Azure AD password management](active-directory-passwords-getting-started.md) and [Best practices: Azure AD password management](active-directory-passwords-best-practices.md).

## User password reset portal
After you've enabled self-service password reset, set up your organization’s self-service password reset policy, and ensured that your users have the appropriate contact data in the directory, users in your organization can reset their own passwords automatically from any webpage that uses a work or school account for sign-in (such as [portal.microsoftonline.com](https://portal.microsoftonline.com)). On pages such as these, users see a **Can’t access your account?** link.

  ![][002]

Clicking on this link opens the self-service password reset portal.

  ![][003]

To learn more about how users can reset their own passwords, see [Getting started: Azure AD password management](active-directory-passwords-getting-started.md).

## User password change portal
If your users want to change their own passwords, they can do so by using the password change portal at any time. Users can access the password change portal via the Access Panel profile page, or by clicking the **Change password** link from within Office 365 applications. In the case when their passwords expire, users are also asked to change them automatically when they sign in.

  ![][004]

In both cases, if Password Writeback has been enabled, and the user is either federated or the password is synchronized, these changed passwords are written back to your on-premises Active Directory.

Here’s what the password change portal looks like:

  ![][005]

To learn more about how users can change their own on-premises Active Directory passwords, see [Getting started: Azure AD password management](active-directory-passwords-getting-started.md).

## Password management reports
When you navigate to the **Reports** tab and look under the **Activity Logs** section, you see two password management reports: **Password reset activity** and **Password reset registration activity**. You can use these two reports to get a view of users that register for and use password reset in your organization.

Here’s what these reports look like in the [Azure portal](https://manage.windowsazure.com):

  ![][006]

For more information, see [Get insights: Azure AD password management reports](active-directory-passwords-get-insights.md).

## Password Writeback component of Azure AD Connect
If the passwords of users in your organization originate from your on-premises environment (either via federation or password synchronization), you can install the latest version of Azure AD Connect to enable updating those passwords directly from the cloud. This means that when your users forget or want to modify their Azure AD password, they can do so straight from the web. Here’s where to find Password Writeback in the Azure AD Connect installation wizard:

  ![][007]

For more information about Azure AD Connect, see [Get started: Azure AD Connect](active-directory-aadconnect.md). For more information about Password Writeback, see [Getting started: Azure AD password management](active-directory-passwords-getting-started.md).


## Next steps

To learn more, see the following Azure AD password reset pages:

* **Are you here because you're having problems signing in?** If so, learn how to [change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-your-password).
* [**Getting started**](active-directory-passwords-getting-started.md): Learn how to allow you users to reset and change their cloud or on-premises passwords.
* [**Customize**](active-directory-passwords-customize.md): Learn how to customize the look, feel, and behavior of the service to your organization's needs.
* [**Best practices**](active-directory-passwords-best-practices.md): Learn how to quickly deploy and effectively manage passwords in your organization.
* [**Get insights**](active-directory-passwords-get-insights.md): Learn about our integrated reporting capabilities.
* [**FAQ**](active-directory-passwords-faq.md): Get answers to frequently asked questions.
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md): Learn how to quickly troubleshoot problems with the service.
* [**Learn more**](active-directory-passwords-learn-more.md): Go deep into the technical details of how the service works.

[001]: ./media/active-directory-passwords-how-it-works/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-how-it-works/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-how-it-works/003.jpg "Image_003.jpg"
[004]: ./media/active-directory-passwords-how-it-works/004.jpg "Image_004.jpg"
[005]: ./media/active-directory-passwords-how-it-works/005.jpg "Image_005.jpg"
[006]: ./media/active-directory-passwords-how-it-works/006.jpg "Image_006.jpg"
[007]: ./media/active-directory-passwords-how-it-works/007.jpg "Image_007.jpg"

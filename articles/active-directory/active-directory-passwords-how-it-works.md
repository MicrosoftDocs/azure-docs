<properties
	pageTitle="How it works: Azure AD Password Management | Microsoft Azure"
	description="Learn about the different components of Azure AD Password Management, including where users register, reset, and change their passwords, and where admins configure, report on, and enable management of on-premises Active Directory passwords."
	services="active-directory"
	documentationCenter=""
	authors="asteen"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="asteen"/>

# How Password Management works

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

Password Management in Azure Active Directory is comprised of several logical components that are described below.  Click on each link to learn more about that component.

- [**Password Management Configuration Portal**](#password-management-configuration-portal) – Administrators can control different facets of how passwords are managed in their tenants by navigating to their directory’s Configure tab in the [Azure Management Portal](https://manage.windowsazure.com).
- [**User Registration Portal**](#user-registration-portal) – Users can self-register for password reset through this web portal.
- [**User Password Reset Portal**](#user-password-reset-portal) – Users can reset their own passwords using a number of different challenges in accordance with the administrator-controlled password reset policy
- [**User Password Change Portal**](#user-password-change-portal) – Users can change their own passwords at any time by entering their old password and selecting a new password using this web portal
- [**Password Management Reports**](#password-management-reports) – Administrators can view and analyze password reset and registration activity in their tenant by navigating to the “Activity Reports” section of their directory’s “Reports” tab in the [Azure Management Portal](https://manage.windowsazure.com)
- [**Password Writeback Component of Azure AD Connect**](#password-writeback-component-of-azure-ad-connect) – Administrators can optionally enable the Password Writeback feature when installing Azure AD Connect to enable management of federated or password synchronized user passwords from the cloud.

## Password Management Configuration Portal
You can configure Password Management policies for a specific directory using the [Azure Management Portal](https://manage.windowsazure.com) by navigating to the **User Password Reset Policy** section in the directory’s **Configure** tab.  From this configuration page, you can control many aspects of how passwords are managed in your organization, including:

- Enabling and disabling password reset for all users in a directory
- Setting the number of challenges (either one or two) a user must go through to reset his or her password
- Setting the specific types of challenges you want to enable for users in your organization from the choices below:
 - Mobile Phone (a verification code via text or a voice call)
 - Office Phone (a voice call)
 - Alternate Email (a verification code via email)
 - Security Questions (knowledge-based authentication)
- Setting the number of questions a user must register in order to use the security questions authentication method (only visible if security questions are enabled)
- Setting the number of questions a user must supply during reset to use the security questions authentication method (only visible if security questions are enabled)
- Using pre-canned, localized, security questions that a user may choose to use when registering for password reset (only visible if security questions are enabled)
- Defining the custom security questions that a user may choose to use when registering for password reset (only visible if security questions are enabled)
- Requiring users to register for password reset when they go to the application Access Panel at [http://myapps.microsoft.com](http://myapps.microsoft.com).
- Requiring users to re-confirm their previously registered data after a configurable number of days have passed (only visible if enforced registration is enabled)
- Providing a custom helpdesk email or URL that will be shown to users in case they have a problem resetting their passwords
- Enabling or disabling the Password Writeback capability (when Password Writeback has been deployed using AAD Connect)
- Viewing the status of the Password Writeback agent (when Password Writeback has been deployed using AAD Connect)
- Enabling email notifications to users when their own password has been reset (found in the **Notifications** section of the [Azure Management Portal](https://manage.windowsazure.com))
- Enabling email notifications to administrators when other administrators reset their own passwords (found in the **Notifications** section of the [Azure Management Portal](https://manage.windowsazure.com)
- Branding the user password reset portal and password reset emails with your organization’s logo and name by using the tenant branding customization feature (found in the **Directory Properties** section of the [Azure Management Portal](https://manage.windowsazure.com)

To learn more about configuring Password Management in your organization, see [Getting Started: Azure AD Password Management](active-directory-passwords-getting-started.md).

##User Registration Portal
Before users are able to use password reset, their cloud user accounts must be updated with the correct authentication data to ensure that they can pass through the appropriate number of password reset challenges defined by their administrator.  Administrators can also define this authentication information on their user’s behalf by using the Azure or Office web portals, DirSync / Azure AD Connect, or Windows PowerShell.

However, if you’d rather have your users register their own data, we also provide a web page that users can go to in order to provide this information.  This page will allow users to specify authentication information in accordance with the password reset policies that have been enabled in their organization.  Once this data is verified, it is stored in their cloud user account to be used for account recovery at a later time. Here’s what the registration portal looks like:

  ![][001]

For more information, see [Getting Started: Azure AD Password Management](active-directory-passwords-getting-started.md) and [Best Practices: Azure AD Password Management](active-directory-passwords-best-practices.md).

##User Password Reset Portal
Once you have enabled self-service password reset, set up your organization’s self-service password reset policy, and ensured that your users have the appropriate contact data in the directory, users in your organization will be able to reset their own passwords automatically from any web page which uses a Work or School account for sign in (such as [portal.microsoftonline.com](https://portal.microsoftonline.com)). On pages such as these, users will see a **Can’t access your account?** link.

  ![][002]

Clicking on this link will launch the self-service password reset portal.

  ![][003]

To learn more about how users can reset their own passwords, see [Getting Started: Azure AD Password Management](active-directory-passwords-getting-started.md).

##User Password Change Portal
If users want to change their own passwords, they can do so by using the password change portal at any time.  Users can access the password change portal via the Access Panel profile page, or clicking the “change password” link from within Office 365 applications.  In the case when their passwords expire, users will also be asked to change them automatically when signing in.

  ![][004]

In both of these cases, if Password Writeback has been enabled and the user is either federated or password sync’d, these changed passwords are written back to your on-premises Active Directory. Here’s what the password change portal looks like:

  ![][005]

To learn more about how users can change their own on-premises Active Directory passwords, see [Getting Started: Azure AD Password Management](active-directory-passwords-getting-started.md).

##Password Management reports
By navigating to the **Reports** tab and looking under the **Activity Logs** section, you will see two Password Management reports: **Password reset activity** and **Password reset registration activity**.  Using these two reports, you can get a view of users registering for and using password reset in your organization. Here’s what these reports look like in the [Azure Management Portal](https://manage.windowsazure.com):

  ![][006]

For more information, see [Get Insights: Azure AD Password Management Reports](active-directory-passwords-get-insights.md).

##Password Writeback component of Azure AD Connect
If the passwords of users in your organization originate from your on-premises environment (either via federation or password synchronization), you can install the latest version of Azure AD Connect to enable updating those passwords directly from the cloud.  This means that when your users forget or want to modify their AD password, they can do so straight from the web.  Here’s where to find Password Writeback in the Azure AD Connect installation wizard:

  ![][007]

For more information about Azure AD Connect, see [Get Started: Azure AD Connect](active-directory-aadconnect.md). For more information about Password Writeback, see [Getting Started: Azure AD Password Management](active-directory-passwords-getting-started.md).


<br/>
<br/>
<br/>

## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works



[001]: ./media/active-directory-passwords-how-it-works/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-how-it-works/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-how-it-works/003.jpg "Image_003.jpg"
[004]: ./media/active-directory-passwords-how-it-works/004.jpg "Image_004.jpg"
[005]: ./media/active-directory-passwords-how-it-works/005.jpg "Image_005.jpg"
[006]: ./media/active-directory-passwords-how-it-works/006.jpg "Image_006.jpg"
[007]: ./media/active-directory-passwords-how-it-works/007.jpg "Image_007.jpg"

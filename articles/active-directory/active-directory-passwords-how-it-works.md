---
title: 'Deep-dive: Azure AD SSPR | Microsoft Docs'
description: Azure AD self-service password reset deep dive
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: gahug

ms.assetid: 618c5908-5bf6-4f0d-bf88-5168dfb28a88
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/12/2017
ms.author: joflore
ms.custom: it-pro

---
# Self-service password reset in Azure AD deep dive

How does SSPR work? What does that option mean in the interface? Continue reading to find out more about Azure AD self-service password reset.

## How does the password reset portal work

When a user navigates to the password reset portal, a workflow is kicked off to determine:

   * How should the page be localized?
   * Is the user account valid?
   * What organization does the user belong to?
   * Where the user’s password is managed?
   * Is the user licensed to use the feature?


Read through the steps below to learn about the logic behind the password reset page.

1. User clicks the Can’t access your account link or goes directly to [https://passwordreset.microsoftonline.com](https://passwordreset.microsoftonline.com).
2. Based on the browser locale the experience is rendered in the appropriate language. The password reset experience is localized into the same languages as Office 365 supports.
3. User enters a user id and passes a captcha.
4. Azure AD verifies if the user is able to use this feature by doing the following:
   * Checks that the user has this feature enabled and an Azure AD license assigned.
     * If the user does not have this feature enabled or a license assigned, the user is asked to contact their administrator to reset their password.
   * Checks that the user has the right challenge data defined on their account in accordance with administrator policy.
     * If policy requires only one challenge, then it is ensured that the user has the appropriate data defined for at least one of the challenges enabled by the administrator policy.
       * If the user is not configured, then the user is advised to contact their administrator to reset their password.
     * If the policy requires two challenges, then it is ensured that the user has the appropriate data defined for at least two of the challenges enabled by the administrator policy.
       * If the user is not configured, then we the user is advised to contact their administrator to reset their password.
   * Checks if the user’s password is managed on premises (federated or password hash synchronized).
     * If writeback is deployed and the user’s password is managed on premises, then the user is allowed to proceed to authenticate and reset their password.
     * If writeback is not deployed and the user’s password is managed on premises, then the user is asked to contact their administrator to reset their password.
5. If it is determined that the user is able to successfully reset their password, then the user is guided through the reset process.

## Authentication methods

If Self-Service Password Reset (SSPR) is enabled, you must select at least one of the following options for authentication methods. We highly recommend choosing at least two authentication methods so that your users have more flexibility.

* Email
* Mobile Phone
* Office Phone
* Security Questions

### What fields are used in the directory for authentication data

* Office Phone corresponds to Office Phone
    * Users are unable to set this field themselves it must be defined by an administrator
* Mobile Phone corresponds to either Authentication Phone (not publicly visible) or Mobile Phone (publicly visible)
    * The service looks for Authentication Phone first, then falls back to Mobile Phone if not present
* Alternate Email Address corresponds to either Authentication Email (not publicly visible) or Alternate Email
    * The service looks for Authentication Email first, then fails back to Alternate Email

By default, only the cloud attributes Office Phone and Mobile Phone are synchronized to your cloud directory from your on-premises directory for authentication data.

Users can only reset their password if they have data present in the authentication methods that the administrator has enabled and requires.

If users do not want their mobile phone number to be visible in the directory but would still like to use it for password reset, administrators should not populate it in the directory and the user should then populate their **Authentication Phone** attribute via the [password reset registration portal](http://aka.ms/ssprsetup). Administrators can see this information in the user's profile but it is not published elsewhere. If an Azure Administrator account registers their authentication phone number, it is populated into the mobile phone field and is visible.

### Number of authentication methods required

This option determines the minimum number of the available authentication methods a user must go through to reset or unlock their password and can be set to either 1 or 2.

Users can choose to supply more authentication methods if they are enabled by the administrator.

If a user does not have the minimum required methods registered, they see an error page that directs them to request an administrator to reset their password.

### How secure are my security questions

If you use security questions, we recommend them in use with another method as they can be less secure than other methods since some people may know the answers to another users questions.

> [!NOTE] 
> Security questions are stored privately and securely on a user object in the directory and can only be answered by users during registration. There is no way for an administrator to read or modify a users questions or answers.
>

### Security question localization

All predefined questions that follow are localized into the full set of Office 365 languages based on the user's browser locale.

* In what city did you meet your first spouse/partner?
* In what city did your parents meet?
* In what city does your nearest sibling live?
* In what city was your father born?
* In what city was your first job?
* In what city was your mother born?
* What city were you in on New Year's 2000?
* What is the last name of your favorite teacher in high * school?
* What is the name of a college you applied to but didn't attend?
* What is the name of the place in which you held your first wedding reception?
* What is your father's middle name?
* What is your favorite food?
* What is your maternal grandmother's first and last name?
* What is your mother's middle name?
* What is your oldest sibling's birthday month and year? (e.g. November 1985)
* What is your oldest sibling's middle name?
* What is your paternal grandfather's first and last name?
* What is your youngest sibling's middle name?
* What school did you attend for sixth grade?
* What was the first and last name of your childhood best friend?
* What was the first and last name of your first significant other?
* What was the last name of your favorite grade school teacher?
* What was the make and model of your first car or motorcycle?
* What was the name of the first school you attended?
* What was the name of the hospital in which you were born?
* What was the name of the street of your first childhood home?
* What was the name of your childhood hero?
* What was the name of your favorite stuffed animal?
* What was the name of your first pet?
* What was your childhood nickname?
* What was your favorite sport in high school?
* What was your first job?
* What were the last four digits of your childhood telephone number?
* When you were young, what did you want to be when you grew up?
* Who is the most famous person you have ever met?

### Custom security questions

Custom security questions are not localized for different locales. All custom questions are displayed in the same language they are entered in the administrative user interface even if the user's browser locale is different. If you need localized questions, please use the predefined questions.

The maximum length of a custom security question is 200 characters.

### Security question requirements

* Minimum answer character limit is 3 characters
* Maximum answer character limit is 40 characters
* Users may not answer the same question more than one time
* Users may not provide the same answer to more than one question
* Any character set may be used to define questions and answers including Unicode characters
* The number of questions defined must be greater than or equal to the number of questions required to register

## Registration

### Require users to register when signing in

Enabling this option requires a user who is enabled for password reset to complete the password reset registration if they login to applications using Azure AD to sign in like those that follow:

* Office 365
* Azure portal
* Access Panel
* Federated applications
* Custom applications using Azure AD

Disabling this feature will still allow users to manually register their contact information by visiting [http://aka.ms/ssprsetup](http://aka.ms/ssprsetup) or by clicking the **register for password reset** link under the profile tab in the access panel.

> [!NOTE]
> Users can dismiss the password reset registration portal by clicking cancel or closing the window but are prompted each time they login until they complete registration.
>

### Number of days before users are asked to reconfirm their authentication information

This option determines the period of time between setting and reconfirming authentication information and is only available if you enable the **require users to register when signing in** option.

Valid values are 0-730 days with 0 meaning never ask users to reconfirm their authentication information

## Notifications

### Notify users on password resets

If this option is set to yes, then the user who is resetting their password receives an email notifying them that their password has been changed via the SSPR portal to their primary and alternate email addresses on file in Azure AD. No one else is notified of this reset event.

### Notify all admins when other admins reset their passwords

If this option is set to yes, then **all administrators** receive an email to their primary email address on file in Azure AD notifying them that another administrator has changed their password using SSPR.

Example: There are four administrators in an environment. Administrator "A" resets their password using SSPR. Administrators B, C, and D receive an email alerting them of this happening.

## On-premises integration

If you have installed, configured, and enabled Azure AD Connect you will have additional options for on-premises integrations.

### Write back passwords to your on-premises directory

Controls whether or not password writeback is enabled for this directory and, if writeback is on, indicates the status of the on-premises writeback service. This is useful if you want to temporarily disable the password writeback without re-configuring Azure AD Connect.

* If the switch is set to yes, then writeback will be enabled, and federated and password hash synchronized users will be able to reset their passwords.
* If the switch is set to no, then writeback will be disabled, and federated and password hash synchronized users will not be able to reset their passwords.

### Allow users to unlock accounts without resetting their password

Designates whether or not users who visit the password reset portal should be given the option to unlock their on-premises Active Directory accounts without resetting their password. By default, Azure AD will always unlock accounts when performing a password reset, this setting allows you to separate those two operations. 

* If set to “yes”, then users will be given the option to reset their password and unlock the account, or to unlock without resetting the password.
* If set to “no”, then users will only be able to perform a combined password reset and account unlock operation.

## Network requirements

### Firewall rules

[List of Microsoft Office URLs and IP addresses](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2)

For Azure AD Connect version 1.1.443.0 and above, you need outbound HTTPS access to the following
* passwordreset.microsoftonline.com
* servicebus.windows.net

For more granular access, you can find the updated list of Microsoft Azure Datacenter IP Ranges that is updated every Wednesday and put into effect the following Monday [here](https://www.microsoft.com/download/details.aspx?id=41653).

### Idle connection timeouts

The Azure AD Connect tool sends periodic pings/keepalives to ServiceBus endpoints to ensure that the connections stay alive. Should the tool detect that too many connections are being killed, it will automatically increase the frequency of pings to the endpoint. The lowest 'ping intervals' drops to is 1 ping every 60 seconds, however, we strongly advise that proxies/firewalls allow idle connections to persist for at least 2-3 minutes. *For older versions, we suggest four minutes or more.

## Active Directory permissions

The account specified in the Azure AD Connect utility must have Reset Password, Change Password, Write Permissions on lockoutTime, and Write Permissions on pwdLastSet, extended rights on either the root object of **each domain** in that forest **OR** on the user OUs you wish to be in scope for SSPR.

If you are not sure what account the above refers to, open the Azure Active Directory Connect configuration UI and click the Review Your Solution option. The account you need to add permission to is listed under "Synchronized Directories"

Setting these permissions allows the MA service account for each forest to manage passwords on behalf of user accounts within that forest. **If you neglect to assign these permissions, then, even though writeback appears to be configured correctly, users encounter errors when attempting to manage their on-premises passwords from the cloud.**

> [!NOTE]
> It could take up to an hour or more for these permissions to replicate to all objects in your directory.
>

To set up the appropriate permissions for password writeback to occur

1. Open Active Directory Users and Computers with an account that has the appropriate domain administration permissions
2. From the View menu, make sure Advanced Features is turned on
3. In the left panel, right-click the object that represents the root of the domain and choose properties
    * Click the Security tab
    * Then click Advanced.
4. From the Permissions tab, click Add
5. Pick the account that permissions are being applied to (from Azure AD Connect setup)
6. In the Applies to drop down box select Descendent User objects
7. Under permissions check the boxes for the following
    * Unexpire-Password
    * Reset Password
    * Change Password
    * Write lockoutTime
    * Write pwdLastSet
8. Click Apply/OK through to apply and exit any open dialog boxes.

## How does password reset work for B2B users?
Password reset and change are fully supported with all B2B configurations.  Read below for the three explicit B2B cases supported by password reset.

1. **Users from a partner org with an existing Azure AD tenant** - If the organization you are partnering with has an existing Azure AD tenant, we **respect whatever password reset policies are enabled in that tenant**. For password reset to work, the partner organization just needs to make sure Azure AD SSPR is enabled, which is no additional charge for O365 customers, and can be enabled by following the steps in our [Getting Started with Password Management](https://azure.microsoft.com/documentation/articles/active-directory-passwords-getting-started/#enable-users-to-reset-or-change-their-aad-passwords) guide.
2. **Users who signed up using [self-service sign-up](active-directory-self-service-signup.md)** - If the organization you are partnering with used the [self-service sign-up](active-directory-self-service-signup.md) feature to get into a tenant, we let them reset with the email they registered.
3. **B2B users** - Any new B2B users created using the new [Azure AD B2B capabilities](active-directory-b2b-what-is-azure-ad-b2b.md) will also be able to reset their passwords with the email they registered during the invite process.

To test this, go to http://passwordreset.microsoftonline.com with one of these partner users. As long as they have an alternate email or authentication email defined, password reset works as expected.

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Password Writeback**](active-directory-passwords-writeback.md) - How does password writeback work with your on-premises directory
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR


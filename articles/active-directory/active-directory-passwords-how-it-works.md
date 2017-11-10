---
title: 'How it works? Azure AD SSPR | Microsoft Docs'
description: Azure AD self-service password reset deep dive
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: 618c5908-5bf6-4f0d-bf88-5168dfb28a88
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2017
ms.author: joflore
ms.custom: it-pro

---
# Self-service password reset in Azure AD deep dive

How does self-service password reset (SSPR) work? What does that option mean in the interface? Continue reading to find out more about Azure Active Directory (Azure AD) SSPR.

## How does the password reset portal work?

When a user navigates to the password reset portal, a workflow is kicked off to determine:

   * How should the page be localized?
   * Is the user account valid?
   * What organization does the user belong to?
   * Where is the user’s password managed?
   * Is the user licensed to use the feature?

Read through the following steps to learn about the logic behind the password reset page:

1. The user selects the **Can't access your account** link or goes directly to [https://aka.ms/sspr](https://passwordreset.microsoftonline.com).
   * Based on the browser locale the experience is rendered in the appropriate language. The password reset experience is localized into the same languages that Office 365 supports.
2. The user enters a user ID and passes a captcha.
3. Azure AD verifies that the user is able to use this feature by doing the following checks:
   * Checks that the user has this feature enabled and has an Azure AD license assigned.
     * If the user does not have this feature enabled or have a license assigned, the user is asked to contact their administrator to reset their password.
   * Checks that the user has the right challenge data defined on their account in accordance with administrator policy.
     * If the policy requires only one challenge, then it ensures that the user has the appropriate data defined for at least one of the challenges enabled by the administrator policy.
       * If the user challenge is not configured, then the user is advised to contact their administrator to reset their password.
     * If the policy requires two challenges, then it ensures that the user has the appropriate data defined for at least two of the challenges enabled by the administrator policy.
       * If the user challenge is not configured, then the user is advised to contact their administrator to reset their password.
   * Checks to see if the user’s password is managed on-premises (federated or password hash synchronized).
     * If writeback is deployed and the user’s password is managed on-premises, then the user is allowed to proceed to authenticate and reset their password.
     * If writeback is not deployed and the user’s password is managed on-premises, then the user is asked to contact their administrator to reset their password.
4. If it's determined that the user is able to successfully reset their password, then the user is guided through the reset process.

## Authentication methods

If SSPR is enabled, you must select at least one of the following options for the authentication methods. Sometimes you hear these options referred to as "gates." We highly recommend that you choose at least two authentication methods so that your users have more flexibility.

* Email
* Mobile phone
* Office phone
* Security questions

![Authentication][Authentication]

### What fields are used in the directory for the authentication data?

* **Office phone**: Corresponds to Office phone.
    * Users are unable to set this field themselves, it must be defined by an administrator.
* **Mobile phone**: Corresponds to either Authentication Phone (not publicly visible) or Mobile phone (publicly visible).
    * The service looks for the Authentication Phone first, then falls back to the Mobile phone if the Authentication Phone is not present.
* **Alternate email address**: Corresponds to either the Authentication Email (not publicly visible) or the Alternate email.
    * The service looks for the Authentication Email first, then fails back to the Alternate email.

By default, only the cloud attributes Office phone and Mobile phone are synchronized to your cloud directory from your on-premises directory for authentication data.

Users can only reset their password if they have data present in the authentication methods that the administrator has enabled and requires.

If users don't want their mobile phone number to be visible in the directory, but would still like to use it for password reset, administrators should not populate it in the directory and the user should then populate their **Authentication Phone** attribute via the [password reset registration portal](http://aka.ms/ssprsetup). Administrators can see this information in the user's profile, but it's not published elsewhere.

### The number of authentication methods required

This option determines the minimum number of the available authentication methods or gates a user must go through to reset or unlock their password. It can be set to either one or two.

Users can choose to supply more authentication methods if the administrator enables that authentication method.

If a user does not have the minimum required methods registered, they see an error page that directs them to request that an administrator reset their password.

#### Change authentication methods

If you start with a policy that has only one required authentication method for reset or unlock registered and you change that to two methods what happens?

| Number of methods registered | Number of methods required | Result |
| :---: | :---: | :---: |
| 1 or more | 1 | **Able** to reset or unlock |
| 1 | 2 | **Unable** to reset or unlock |
| 2 or more | 2 | **Able** to reset or unlock |

If you change the types of authentication methods that a user can use, you might inadvertently stop users from being able to use SSPR if they don't have the minimum amount of data available.

Example: 
1. The original policy is configured with two authentication methods required. It uses only the office phone number and the security questions. 
2. The administrator changes the policy to no longer use the security questions, but allows the use of a mobile phone and an alternate email.
3. Users without the mobile phone and alternate email fields populated can't reset their passwords.

### How secure are my security questions?

If you use security questions, we recommend them in use in conjunction with another method. Security questions can be less secure than other methods because some people might know the answers to another user's questions.

> [!NOTE] 
> Security questions are stored privately and securely on a user object in the directory and can only be answered by users during registration. There is no way for an administrator to read or modify a user's questions or answers.
>

### Security question localization

All the predefined questions that follow are localized into the full set of Office 365 languages and are based on the user's browser locale:

* In what city did you meet your first spouse/partner?
* In what city did your parents meet?
* In what city does your nearest sibling live?
* In what city was your father born?
* In what city was your first job?
* In what city was your mother born?
* What city were you in on New Year's 2000?
* What is the last name of your favorite teacher in high school?
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

Custom security questions are not localized for different locales. All custom questions are displayed in the same language as they are entered in the administrative user interface, even if the user's browser locale is different. If you need localized questions, you should use the predefined questions.

The maximum length of a custom security question is 200 characters.

### Security question requirements

* The minimum answer character limit is three characters.
* The maximum answer character limit is 40 characters.
* Users can't answer the same question more than one time.
* Users can't provide the same answer to more than one question.
* Any character set can be used to define the questions and the answers, including Unicode characters.
* The number of questions defined must be greater than or equal to the number of questions that were required to register.

## Registration

### Require users to register when they sign in

To enable this option, a user that is enabled for password reset has to complete the password reset registration if they log in to applications by using Azure AD to sign in. This includes the following:

* Office 365
* Azure portal
* Access Panel
* Federated applications
* Custom applications by using Azure AD

When requiring registration is disabled, users can still manually register their contact information. They can either visit [http://aka.ms/ssprsetup](http://aka.ms/ssprsetup) or select the **Register for password reset** link under the **Profile** tab in the Access Panel.

> [!NOTE]
> Users can dismiss the password reset registration portal by selecting **cancel** or by closing the window, but they will be prompted to register each time they sign in until they complete their registration.
>
> This doesn't break the user's connection if they are already signed in.

### Set the number of days before users are asked to reconfirm their authentication information

This option determines the period of time between setting and reconfirming authentication information and is only available if you enable the **Require users to register when signing in** option.

Valid values are between 0 to 730 days with "0" meaning users are never asked to reconfirm their authentication information.

## Notifications

### Notify users on password resets

If this option is set to **Yes**, then the user who is resetting their password receives an email notifying them that their password has been changed. The email is sent via the SSPR portal to their primary and alternate email addresses that are on file in Azure AD. No one else is notified of this reset event.

### Notify all admins when other admins reset their passwords

If this option is set to **Yes**, then *all administrators* receive an email to their primary email address on file in Azure AD. The email notifies them that another administrator has changed their password by using SSPR.

Example: There are four administrators in an environment. Administrator A resets their password by using SSPR. Administrators B, C, and D receive an email that alerts them of the password reset.

## On-premises integration

If you install, configure, and enable Azure AD Connect, you have the following additional options for on-premises integrations. If these options are grayed-out, then writeback has not been properly configured. For more information, see [Configuring password writeback](active-directory-passwords-writeback.md#configuring-password-writeback).

### Write back passwords to your on-premises directory

This control determines whether password writeback is enabled for this directory. If writeback is on, it indicates the status of the on-premises writeback service. This is useful if you want to temporarily disable password writeback without having to reconfigure Azure AD Connect.

* If the switch is set to **Yes**, then writeback is enabled, and federated and password hash synchronized users are able to reset their passwords.
* If the switch is set to **No**, then writeback is disabled, and federated and password hash synchronized users are not able to reset their passwords.

### Allow users to unlock accounts without resetting their password

This control designates whether users who visit the password reset portal should be given the option to unlock their on-premises Active Directory accounts without having to reset their password. By default, Azure AD unlocks accounts when it performs a password reset. This setting allows you to separate those two operations. 

* If set to **Yes**, then users are given the option to reset their password and unlock the account, or to unlock their account without having to reset the password.
* If set to **No**, then users are only be able to perform a combined password reset and account unlock operation.

## How does password reset work for B2B users?
Password reset and change are fully supported on all business-to-business (B2B) configurations. B2B user password reset is supported in the following three cases:

   * **Users from a partner organization with an existing Azure AD tenant**: If the organization you're partnering with has an existing Azure AD tenant, we *respect whatever password reset policies are enabled on that tenant*. For password reset to work, the partner organization just needs to make sure that Azure AD SSPR is enabled. There is no additional charge for Office 365 customers, and it can be enabled by following the steps in our [Get started with password management](https://azure.microsoft.com/documentation/articles/active-directory-passwords-getting-started/#enable-users-to-reset-or-change-their-aad-passwords) guide.
   * **Users who sign up through** [self-service sign-up](active-directory-self-service-signup.md): If the organization you're partnering with used the [self-service sign-up](active-directory-self-service-signup.md) feature to get into a tenant, we let them reset the password with the email they registered.
   * **B2B users**: Any new B2B users created by using the new [Azure AD B2B capabilities](active-directory-b2b-what-is-azure-ad-b2b.md) will also be able to reset their passwords with the email they registered during the invite process.

To test this scenario, go to http://passwordreset.microsoftonline.com with one of these partner users. If they have an Alternate email or Authentication Email defined, password reset works as expected.

> [!NOTE]
> Microsoft accounts that have been granted guest access to your Azure AD tenant, such as those from Hotmail.com, Outlook.com, or other personal email addresses, are not able to use Azure AD SSPR. They will need to reset their password by using the information found in the [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.

## Next steps

The following articles provide additional information regarding password reset through Azure AD:

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

[Authentication]: ./media/active-directory-passwords-how-it-works/sspr-authentication-methods.png "Azure AD authentication methods available and quantity required"

---
title: Self-service password reset deep dive - Azure Active Directory
description: How does self-service password reset work

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/16/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# How it works: Azure AD self-service password reset

How does self-service password reset (SSPR) work? What does that option mean in the interface? Continue reading to find out more about Azure Active Directory (Azure AD) SSPR.

## How does the password reset portal work?

When a user goes to the password reset portal, a workflow is kicked off to determine:

   * How should the page be localized?
   * Is the user account valid?
   * What organization does the user belong to?
   * Where is the user’s password managed?
   * Is the user licensed to use the feature?

Read through the following steps to learn about the logic behind the password reset page:

1. The user selects the **Can't access your account** link or goes directly to [https://aka.ms/sspr](https://passwordreset.microsoftonline.com).
   * Based on the browser locale, the experience is rendered in the appropriate language. The password reset experience is localized into the same languages that Office 365 supports.
   * To view the password reset portal in a different localized language append "?mkt=" to the end of the password reset URL with the example that follows localizing to Spanish [https://passwordreset.microsoftonline.com/?mkt=es-us](https://passwordreset.microsoftonline.com/?mkt=es-us).
2. The user enters a user ID and passes a captcha.
3. Azure AD verifies that the user is able to use this feature by doing the following checks:
   * Checks that the user has this feature enabled and has an Azure AD license assigned.
     * If the user does not have this feature enabled or have a license assigned, the user is asked to contact their administrator to reset their password.
   * Checks that the user has the right authentication methods defined on their account in accordance with administrator policy.
     * If the policy requires only one method, then it ensures that the user has the appropriate data defined for at least one of the authentication methods enabled by the administrator policy.
       * If the authentication methods are not configured, then the user is advised to contact their administrator to reset their password.
     * If the policy requires two methods, then it ensures that the user has the appropriate data defined for at least two of the authentication methods enabled by the administrator policy.
       * If the authentication methods are not configured, then the user is advised to contact their administrator to reset their password.
     * If an Azure administrator role is assigned to the user, then the strong two-gate password policy is enforced. More information about this policy can be found in the section [Administrator reset policy differences](concept-sspr-policy.md#administrator-reset-policy-differences).
   * Checks to see if the user’s password is managed on-premises (federated, pass-through authentication, or password hash synchronized).
     * If writeback is deployed and the user’s password is managed on-premises, then the user is allowed to proceed to authenticate and reset their password.
     * If writeback is not deployed and the user’s password is managed on-premises, then the user is asked to contact their administrator to reset their password.
4. If it's determined that the user is able to successfully reset their password, then the user is guided through the reset process.

## Authentication methods

If SSPR is enabled, you must select at least one of the following options for the authentication methods. Sometimes you hear these options referred to as "gates." We highly recommend that you **choose two or more authentication methods** so that your users have more flexibility in case they are unable to access one when they need it. Additional details about the methods listed below can be found in the article [What are authentication methods?](concept-authentication-methods.md).

* Mobile app notification
* Mobile app code
* Email
* Mobile phone
* Office phone
* Security questions

Users can only reset their password if they have data present in the authentication methods that the administrator has enabled.

> [!IMPORTANT]
> Starting in March of 2019 the phone call options will not be available to MFA and SSPR users in free/trial Azure AD tenants. SMS messages are not impacted by this change. Phone call will continue to be available to users in paid Azure AD tenants. This change only impacts free/trial Azure AD tenants.

> [!WARNING]
> Accounts assigned Azure Administrator roles will be required to use methods as defined in the section [Administrator reset policy differences](concept-sspr-policy.md#administrator-reset-policy-differences).

![Authentication methods selection in the Azure portal][Authentication]

### Number of authentication methods required

This option determines the minimum number of the available authentication methods or gates a user must go through to reset or unlock their password. It can be set to either one or two.

Users can choose to supply more authentication methods if the administrator enables that authentication method.

If a user does not have the minimum required methods registered, they see an error page that directs them to request that an administrator reset their password.

#### Mobile app and SSPR

When using a mobile app, like the Microsoft Authenticator app, as a method for password reset, you should be aware of the following caveats:

* When administrators require one method be used to reset a password, verification code is the only option available.
* When administrators require two methods be used to reset a password, users are able to use **EITHER** notification **OR** verification code in addition to any other enabled methods.

| Number of methods required to reset | One | Two |
| :---: | :---: | :---: |
| Mobile app features available | Code | Code or Notification |

Users do not have the option to register their mobile app when registering for self-service password reset from [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup). Users can register their mobile app at [https://aka.ms/mfasetup](https://aka.ms/mfasetup), or in the new security info registration preview at [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo).

> [!WARNING]
> You must enable the [Converged registration for self-service password reset and Azure Multi-Factor Authentication (Public preview)](concept-registration-mfa-sspr-converged.md) before users will be able to access the new experience at [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo).

> [!IMPORTANT]
> The authenticator app cannot be selected as the only authentication method when configuring a 1-gate policy. Similarly, the authenticator app and only one additional method cannot be selected when configuring a 2-gates policy.
> Then, when configuring SSPR policies that include the authenticator app as a method, at least an additional method should be selected when configuring a 1-gate policy, and at least two additional methods should be selected when configuring a 2-gates policy.
> The reason for this requirement is because the current SSPR registration experience does not include the option to register the authenticator app. The option to register the authenticator app is included with the new [Converged registration for self-service password reset and Azure Multi-Factor Authentication (Public preview)](concept-registration-mfa-sspr-converged.md).
> Allowing policies that only use the authenticator app (for 1-gate policies), or the authenticator app and only one additional method (for 2-gates policies), could lead to users being blocked from registering for  SSPR until they have been configured to use the new registration experience.

### Change authentication methods

If you start with a policy that has only one required authentication method for reset or unlock registered and you change that to two methods, what happens?

| Number of methods registered | Number of methods required | Result |
| :---: | :---: | :---: |
| 1 or more | 1 | **Able** to reset or unlock |
| 1 | 2 | **Unable** to reset or unlock |
| 2 or more | 2 | **Able** to reset or unlock |

If you change the types of authentication methods that a user can use, you might inadvertently stop users from being able to use SSPR if they don't have the minimum amount of data available.

Example:
1. The original policy is configured with two authentication methods required. It uses only the office phone number and the security questions. 
2. The administrator changes the policy to no longer use the security questions, but allows the use of a mobile phone and an alternate email.
3. Users without the mobile phone or alternate email fields populated can't reset their passwords.

## Registration

### Require users to register when they sign in

Enabling this option requires a user to complete the password reset registration if they sign in to any applications using Azure AD. This workflow includes the following applications:

* Office 365
* Azure portal
* Access Panel
* Federated applications
* Custom applications using Azure AD

When requiring registration is disabled, users can manually register. They can either visit [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup) or select the **Register for password reset** link under the **Profile** tab in the Access Panel.

> [!NOTE]
> Users can dismiss the password reset registration portal by selecting **cancel** or by closing the window. But they are prompted to register each time they sign in until they complete their registration.
>
> This interrupt doesn't break the user's connection if they are already signed in.

### Set the number of days before users are asked to reconfirm their authentication information

This option determines the period of time between setting and reconfirming authentication information and is available only if you enable the **Require users to register when signing in** option.

Valid values are 0 to 730 days, with "0" meaning users are never asked to reconfirm their authentication information.

## Notifications

### Notify users on password resets

If this option is set to **Yes**, then users resetting their password receive an email notifying them that their password has been changed. The email is sent via the SSPR portal to their primary and alternate email addresses that are on file in Azure AD. No one else is notified of the reset event.

### Notify all admins when other admins reset their passwords

If this option is set to **Yes**, then *all administrators* receive an email to their primary email address on file in Azure AD. The email notifies them that another administrator has changed their password by using SSPR.

Example: There are four administrators in an environment. Administrator A resets their password by using SSPR. Administrators B, C, and D receive an email alerting them of the password reset.

## On-premises integration

If you install, configure, and enable Azure AD Connect, you have the following additional options for on-premises integrations. If these options are grayed out, then writeback has not been properly configured. For more information, see [Configuring password writeback](howto-sspr-writeback.md).

![Validating password writeback is enabled and working][Writeback]

This page provides you a quick status of the on-premises writeback client, one of the following messages is displayed based on the current configuration:

* Your On-premises writeback client is up and running.
* Azure AD is online and is connected to your on-premises writeback client. However, it looks like the installed version of Azure AD Connect is out-of-date. Consider [Upgrading Azure AD Connect](../hybrid/how-to-upgrade-previous-version.md) to ensure that you have the latest connectivity features and important bug fixes.
* Unfortunately, we can’t check your on-premises writeback client status because the installed version of Azure AD Connect is out-of-date. [Upgrade Azure AD Connect](../hybrid/how-to-upgrade-previous-version.md) to be able to check your connection status.
* Unfortunately, it looks like we can't connect to your on-premises writeback client right now. [Troubleshoot Azure AD Connect](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback-connectivity) to restore the connection.
* Unfortunately, we can't connect to your on-premises writeback client because password writeback has not been properly configured. [Configure password writeback](howto-sspr-writeback.md) to restore the connection.
* Unfortunately, it looks like we can't connect to your on-premises writeback client right now. This may be due to temporary issues on our end. If the problem persists, [Troubleshoot Azure AD Connect](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback-connectivity) to restore the connection.

### Write back passwords to your on-premises directory

This control determines whether password writeback is enabled for this directory. If writeback is on, it indicates the status of the on-premises writeback service. This control is useful if you want to temporarily disable password writeback without having to reconfigure Azure AD Connect.

* If the switch is set to **Yes**, then writeback is enabled, and federated, pass-through authentication, or password hash synchronized users are able to reset their passwords.
* If the switch is set to **No**, then writeback is disabled, and federated, pass-through authentication, or password hash synchronized users are not able to reset their passwords.

### Allow users to unlock accounts without resetting their password

This control designates whether users who visit the password reset portal should be given the option to unlock their on-premises Active Directory accounts without having to reset their password. By default, Azure AD unlocks accounts when it performs a password reset. You use this setting to separate those two operations.

* If set to **Yes**, then users are given the option to reset their password and unlock the account, or to unlock their account without having to reset the password.
* If set to **No**, then users are only be able to perform a combined password reset and account unlock operation.

### On-premises Active Directory password filters

Azure AD self-service password reset performs the equivalent of an admin-initiated password reset in Active Directory. If you are using a third-party password filter to enforce custom password rules, and you require that this password filter is checked during Azure AD self-service password reset, ensure that the third-party password filter solution is configured to apply in the admin password reset scenario. [Azure AD password protection for Windows Server Active Directory](concept-password-ban-bad-on-premises.md) is supported by default.

## Password reset for B2B users

Password reset and change are fully supported on all business-to-business (B2B) configurations. B2B user password reset is supported in the following three cases:

* **Users from a partner organization with an existing Azure AD tenant**: If the organization you're partnering with has an existing Azure AD tenant, we *respect whatever password reset policies are enabled on that tenant*. For password reset to work, the partner organization just needs to make sure that Azure AD SSPR is enabled. There is no additional charge for Office 365 customers, and it can be enabled by following the steps in our [Get started with password management](https://azure.microsoft.com/documentation/articles/active-directory-passwords-getting-started/#enable-users-to-reset-or-change-their-aad-passwords) guide.
* **Users who sign up through** self-service sign-up: If the organization you're partnering with used the [self-service sign-up](../users-groups-roles/directory-self-service-signup.md) feature to get into a tenant, we let them reset the password with the email they registered.
* **B2B users**: Any new B2B users created by using the new [Azure AD B2B capabilities](../active-directory-b2b-what-is-azure-ad-b2b.md) will also be able to reset their passwords with the email they registered during the invite process.

To test this scenario, go to https://passwordreset.microsoftonline.com with one of these partner users. If they have an alternate email or authentication email defined, password reset works as expected.

> [!NOTE]
> Microsoft accounts that have been granted guest access to your Azure AD tenant, such as those from Hotmail.com, Outlook.com, or other personal email addresses, are not able to use Azure AD SSPR. They need to reset their password by using the information found in the [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.

## Next steps

The following articles provide additional information regarding password reset through Azure AD:

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

[Authentication]: ./media/concept-sspr-howitworks/manage-authentication-methods-for-password-reset.png "Azure AD authentication methods available and quantity required"
[Writeback]: ./media/concept-sspr-howitworks/troubleshoot-on-premises-integration-writeback.png "On-premises integration password writeback configuration and troubleshooting information"

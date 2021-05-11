---
title: Self-service password reset deep dive - Azure Active Directory
description: How does self-service password reset work

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 12/07/2020

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
---
# How it works: Azure AD self-service password reset

Azure Active Directory (Azure AD) self-service password reset (SSPR) gives users the ability to change or reset their password, with no administrator or help desk involvement. If a user's account is locked or they forget their password, they can follow prompts to unblock themselves and get back to work. This ability reduces help desk calls and loss of productivity when a user can't sign in to their device or an application.

> [!IMPORTANT]
> This conceptual article explains to an administrator how self-service password reset works. If you're an end user already registered for self-service password reset and need to get back into your account, go to [https://aka.ms/sspr](https://aka.ms/sspr).
>
> If your IT team hasn't enabled the ability to reset your own password, reach out to your helpdesk for additional assistance.

## How does the password reset process work?

A user can reset or change their password using the [SSPR portal](https://aka.ms/sspr). They must first have registered their desired authentication methods. When a user accesses the SSPR portal, the Azure platform considers the following factors:

* How should the page be localized?
* Is the user account valid?
* What organization does the user belong to?
* Where is the user's password managed?
* Is the user licensed to use the feature?

When a user selects the **Can't access your account** link from an application or page, or goes directly to [https://aka.ms/sspr](https://passwordreset.microsoftonline.com), the language used in the SSPR portal is based on the following options:

* By default, the browser locale is used to display the SSPR in the appropriate language. The password reset experience is localized into the same languages that [Microsoft 365 supports](https://support.microsoft.com/office/what-languages-is-office-available-in-26d30382-9fba-45dd-bf55-02ab03e2a7ec).
* If you want to link to the SSPR in a specific localized language, append `?mkt=` to the end of the password reset URL along with the required locale.
    * For example, to specify the Spanish *es-us* locale, use `?mkt=es-us` - [https://passwordreset.microsoftonline.com/?mkt=es-us](https://passwordreset.microsoftonline.com/?mkt=es-us).

After the SSPR portal is displayed in the required language, the user is prompted to enter a user ID and pass a captcha. Azure AD now verifies that the user is able to use SSPR by doing the following checks:

* Checks that the user has SSPR enabled and is assigned an Azure AD license.
  * If the user isn't enabled for SSPR or doesn't have a license assigned, the user is asked to contact their administrator to reset their password.
* Checks that the user has the right authentication methods defined on their account in accordance with administrator policy.
  * If the policy requires only one method, check that the user has the appropriate data defined for at least one of the authentication methods enabled by the administrator policy.
    * If the authentication methods aren't configured, the user is advised to contact their administrator to reset their password.
  * If the policy requires two methods, check that the user has the appropriate data defined for at least two of the authentication methods enabled by the administrator policy.
    * If the authentication methods aren't configured, the user is advised to contact their administrator to reset their password.
  * If an Azure administrator role is assigned to the user, then the strong two-gate password policy is enforced. For more information, see [Administrator reset policy differences](concept-sspr-policy.md#administrator-reset-policy-differences).
* Checks to see if the user's password is managed on-premises, such as if the Azure AD tenant is using federated, pass-through authentication, or password hash synchronization:
  * If SSPR writeback is configured and the user's password is managed on-premises, the user is allowed to proceed to authenticate and reset their password.
  * If SSPR writeback isn't deployed and the user's password is managed on-premises, the user is asked to contact their administrator to reset their password.

If all of the previous checks are successfully completed, the user is guided through the process to reset or change their password.

> [!NOTE]
> SSPR may send email notifications to users as part of the password reset process. These emails are sent using the SMTP relay service, which operates in an active-active mode across several regions.
>
> SMTP relay services receive and process the email body, but don't store it. The body of the SSPR email that may potentially contain customer provided info isn't stored in the SMTP relay service logs. The logs only contain protocol metadata.

To get started with SSPR, complete the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Enable self-service password reset (SSPR)](tutorial-enable-sspr.md)


## Require users to register when they sign in

You can enable the option to require a user to complete the SSPR registration if they use modern authentication or web browser to sign in to any applications using Azure AD. This workflow includes the following applications:

* Microsoft 365
* Azure portal
* Access Panel
* Federated applications
* Custom applications using Azure AD

When you don't require registration, users aren't prompted during sign-in, but they can manually register. Users can either visit [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup) or select the **Register for password reset** link under the **Profile** tab in the Access Panel.

![Registration options for SSPR in the Azure portal][Registration]

> [!NOTE]
> Users can dismiss the SSPR registration portal by selecting **cancel** or by closing the window. However, they're prompted to register each time they sign in until they complete their registration.
>
> This interrupt to register for SSPR doesn't break the user's connection if they're already signed in.

## Reconfirm authentication information

To make sure that authentication methods are correct when they're needed to reset or change their password, you can require users confirm their info registered information after a certain period of time. This option is only available if you enable the **Require users to register when signing in** option.

Valid values to prompt a user to confirm their registered methods are from *0* to *730* days. Setting this value to *0* means that users are never asked to confirm their authentication information. When using the combined registration experience users will be required to confirm their identity before reconfirming their information.

## Authentication methods

When a user is enabled for SSPR, they must register at least one authentication method. We highly recommend that you choose two or more authentication methods so that your users have more flexibility in case they're unable to access one method when they need it. For more information, see [What are authentication methods?](concept-authentication-methods.md).

The following authentication methods are available for SSPR:

* Mobile app notification
* Mobile app code
* Email
* Mobile phone
* Office phone
* Security questions

Users can only reset their password if they have registered an authentication method that the administrator has enabled.

> [!WARNING]
> Accounts assigned Azure *administrator* roles are required to use methods as defined in the section [Administrator reset policy differences](concept-sspr-policy.md#administrator-reset-policy-differences).

![Authentication methods selection in the Azure portal][Authentication]

### Number of authentication methods required

You can configure the number of the available authentication methods a user must provide to reset or unlock their password. This value can be set to either *one* or *two*.

Users can, and should, register multiple authentication methods. Again, it's highly recommended that users register two or more authentication methods so they have more flexibility in case they're unable to access one method when they need it.

If a user doesn't have the minimum number of required methods registered when they try to use SSPR, they see an error page that directs them to request that an administrator reset their password. Take care if you increase the number of methods required from one to two if you have existing users registered for SSPR and they're then unable to use the feature. For more information, see the following section to [Change authentication methods](#change-authentication-methods).

#### Mobile app and SSPR

When using a mobile app as a method for password reset, like the Microsoft Authenticator app, the following considerations apply:

* When administrators require one method be used to reset a password, verification code is the only option available.
* When administrators require two methods be used to reset a password, users are able to use notification **OR** verification code in addition to any other enabled methods.

| Number of methods required to reset | One | Two |
| :---: | :---: | :---: |
| Mobile app features available | Code | Code or Notification |

Users don't have the option to register their mobile app when registering for self-service password reset from [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup). Users can register their mobile app at [https://aka.ms/mfasetup](https://aka.ms/mfasetup), or in the combined security info registration at [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo).

> [!IMPORTANT]
> The Authenticator app can't be selected as the only authentication method when only one method is required. Similarly, the Authenticator app and only one additional method cannot be selected when requiring two methods.
>
> When configuring SSPR policies that include the Authenticator app as a method, at least one additional method should be selected when one method is required, and at least two additional methods should be selected when configuring two methods are required.
>
> This requirement is because the current SSPR registration experience doesn't include the option to register the authenticator app. The option to register the authenticator app is included with the new [combined registration experience](./concept-registration-mfa-sspr-combined.md).
>
> Allowing policies that only use the Authenticator app (when one method is required), or the Authenticator app and only one additional method (when two methods are required), could lead to users being blocked from registering for  SSPR until they're configured to use the new combined registration experience.

### Change authentication methods

If you start with a policy that has only one required authentication method for reset or unlock registered and you change that to two methods, what happens?

| Number of methods registered | Number of methods required | Result |
| :---: | :---: | :---: |
| 1 or more | 1 | **Able** to reset or unlock |
| 1 | 2 | **Unable** to reset or unlock |
| 2 or more | 2 | **Able** to reset or unlock |

Changing the available authentication methods may also cause problems for users. If you change the types of authentication methods that a user can use, you might inadvertently stop users from being able to use SSPR if they don't have the minimum amount of data available.

Consider the following example scenario:

1. The original policy is configured with two authentication methods required. It uses only the office phone number and the security questions.
1. The administrator changes the policy to no longer use the security questions, but allows the use of a mobile phone and an alternate email.
1. Users without the mobile phone or alternate email fields populated now can't reset their passwords.

## Notifications

To improve awareness of password events, SSPR lets you configure notifications for both the users and identity administrators.

### Notify users on password resets

If this option is set to **Yes**, users resetting their password receive an email notifying them that their password has been changed. The email is sent via the SSPR portal to their primary and alternate email addresses that are stored in Azure AD. No one else is notified of the reset event.

### Notify all admins when other admins reset their passwords

If this option is set to **Yes**, then all other Azure administrators receive an email to their primary email address stored in Azure AD. The email notifies them that another administrator has changed their password by using SSPR.

Consider the following example scenario:

* There are four administrators in an environment.
* Administrator *A* resets their password by using SSPR.
* Administrators *B*, *C*, and *D* receive an email alerting them of the password reset.

## On-premises integration

If you have a hybrid environment, you can configure Azure AD Connect to write password change events back from Azure AD to an on-premises directory.

![Validating password writeback is enabled and working][Writeback]

Azure AD checks your current hybrid connectivity and provides one of the following messages in the Azure portal:

* Your on-premises writeback client is up and running.
* Azure AD is online and is connected to your on-premises writeback client. However, it looks like the installed version of Azure AD Connect is out-of-date. Consider [Upgrading Azure AD Connect](../hybrid/how-to-upgrade-previous-version.md) to ensure that you have the latest connectivity features and important bug fixes.
* Unfortunately, we can't check your on-premises writeback client status because the installed version of Azure AD Connect is out-of-date. [Upgrade Azure AD Connect](../hybrid/how-to-upgrade-previous-version.md) to be able to check your connection status.
* Unfortunately, it looks like we can't connect to your on-premises writeback client right now. [Troubleshoot Azure AD Connect](./troubleshoot-sspr-writeback.md) to restore the connection.
* Unfortunately, we can't connect to your on-premises writeback client because password writeback has not been properly configured. [Configure password writeback](./tutorial-enable-sspr-writeback.md) to restore the connection.
* Unfortunately, it looks like we can't connect to your on-premises writeback client right now. This may be due to temporary issues on our end. If the problem persists, [Troubleshoot Azure AD Connect](./troubleshoot-sspr-writeback.md) to restore the connection.

To get started with SSPR writeback, complete the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Enable self-service password reset (SSPR) writeback](./tutorial-enable-sspr-writeback.md)

### Write back passwords to your on-premises directory

You can enable password writeback using the Azure portal. You can also temporarily disable password writeback without having to reconfigure Azure AD Connect.

* If the option is set to **Yes**, then writeback is enabled. Federated, pass-through authentication, or password hash synchronized users are able to reset their passwords.
* If the option is set to **No**, then writeback is disabled. Federated, pass-through authentication, or password hash synchronized users aren't able to reset their passwords.

### Allow users to unlock accounts without resetting their password

By default, Azure AD unlocks accounts when it performs a password reset. To provide flexibility, you can choose to allow users to unlock their on-premises accounts without having to reset their password. Use this setting to separate those two operations.

* If set to **Yes**, users are given the option to reset their password and unlock the account, or to unlock their account without having to reset the password.
* If set to **No**, users are only be able to perform a combined password reset and account unlock operation.

### On-premises Active Directory password filters

SSPR performs the equivalent of an admin-initiated password reset in Active Directory. If you use a third-party password filter to enforce custom password rules, and you require that this password filter is checked during Azure AD self-service password reset, ensure that the third-party password filter solution is configured to apply in the admin password reset scenario. [Azure AD password protection for Active Directory Domain Services](concept-password-ban-bad-on-premises.md) is supported by default.

## Password reset for B2B users

Password reset and change are fully supported on all business-to-business (B2B) configurations. B2B user password reset is supported in the following three cases:

* **Users from a partner organization with an existing Azure AD tenant**: If the organization you partner with has an existing Azure AD tenant, we respect whatever password reset policies are enabled on that tenant. For password reset to work, the partner organization just needs to make sure that Azure AD SSPR is enabled. There is no additional charge for Microsoft 365 customers.
* **Users who sign up through** self-service sign-up: If the organization you partner with used the [self-service sign-up](../enterprise-users/directory-self-service-signup.md) feature to get into a tenant, we let them reset the password with the email they registered.
* **B2B users**: Any new B2B users created by using the new [Azure AD B2B capabilities](../external-identities/what-is-b2b.md) can also reset their passwords with the email they registered during the invite process.

To test this scenario, go to https://passwordreset.microsoftonline.com with one of these partner users. If they have an alternate email or authentication email defined, password reset works as expected.

> [!NOTE]
> Microsoft accounts that have been granted guest access to your Azure AD tenant, such as those from Hotmail.com, Outlook.com, or other personal email addresses, aren't able to use Azure AD SSPR. They need to reset their password by using the information found in the [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.

## Next steps

To get started with SSPR, complete the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Enable self-service password reset (SSPR)](tutorial-enable-sspr.md)

The following articles provide additional information regarding password reset through Azure AD:

[Authentication]: ./media/concept-sspr-howitworks/manage-authentication-methods-for-password-reset.png "Azure AD authentication methods available and quantity required"
[Registration]: ./media/concept-sspr-howitworks/configure-registration-options.png "Configure SSPR registration options in the Azure portal"
[Writeback]: ./media/concept-sspr-howitworks/on-premises-integration.png "On-premises integration for SSPR in the Azure portal"

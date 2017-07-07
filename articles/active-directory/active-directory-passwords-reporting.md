---
title: 'Reporting: Azure AD SSPR | Microsoft Docs'
description: Reporting on Azure AD self-service password reset events
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: gahug

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: joflore
ms.custom: it-pro

---
# Reporting options for Azure AD password management

Post deployment many organizations want to know how or if SSPR is really being used. Azure AD provides reporting features that help you to answer questions using canned reports and if you are appropriately licensed, allow you to create custom queries.

The following questions can be answered by reports that exist in the [Azure portal] (https://portal.azure.com/).

> [!NOTE]
> You must be [a global administrator](active-directory-assign-admin-roles.md#assign-or-remove-administrator-roles) and must opt-in for this data to be gathered on behalf of your organization, by visiting the reporting tab or audit logs at least once. Until doing so, data will not be collected for your organization

* How many people have registered for password reset?
* Who has registered for password reset?
* What data are people registering?
* How many people reset their passwords in the last seven days?
* What are the most common methods users or admins use to reset their passwords?
* What are common issues users or admins face when attempting to use password reset?
* What admins are resetting their own passwords frequently?
* Is there any suspicious activity going on with password reset?

## How to view password management reports in the Azure portal

In the Azure portal experience, we have an improved way to view password reset and password reset registration activity.  Follow the steps below to find the password reset and password reset registration events:

1. Navigate to [**portal.azure.com**](https://portal.azure.com)
2. Click the **More services** menu on the main Azure portal left-hand navigation
3. Search for **Azure Active Directory** in the list of services and select it
4. Click **Users & Groups** from the Azure Active Directory navigation menu
5. Click the **Audit Logs** navigation item from the Users & Groups navigation menu. This shows you all of the audit events occurring against all the users in your directory. You can filter this view to see all the password-related events, as well.
6. To filter this view to only the password reset related events, click the **Filter** button at the top of the blade.
7. From the **Filter** menu, select the **Category** dropdown, and change it to the **Self-service Password Management** category type.
8. Optionally further filter the list by choosing the specific **Activity** you are interested

## How to retrieve password management events from the Azure AD Reports and Events API

The Azure AD Reports and Events API supports retrieving all the information included in password reset and password reset registration reports. By using this API, you can download individual password reset and password reset registration events for integration with the reporting technology of your choice.

### How to get started with the reporting API

To access this data, you need to write a small app or script to retrieve it from our servers. [Learn how to get started with the Azure AD Reporting API](active-directory-reporting-api-getting-started.md).

Once you have a working script, you'll next want to examine the password reset and registration events that you can retrieve to meet your scenarios.

* [SsprActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent): Lists the columns available for password reset events
* [SsprRegistrationActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprRegistrationActivityEvent): Lists the columns available for password reset registration events

### Reporting API data retrieval limitations

Currently, the Azure AD Reports and Events API retrieves up to **75,000 individual events** of the [SsprActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent) and [SsprRegistrationActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprRegistrationActivityEvent) types, spanning the **last 30 days**.

If you need to retrieve or store data beyond this window, we suggest persisting it in an external database and using the API to query the deltas that result. Our recommendation is to begin retrieving this data when you start using SSPR in your organization, persist it externally, and then continue to track the deltas from this point forward.

## How to download password reset registration events quickly with PowerShell

In addition to using the Azure AD Reports and Events API directly, you may also use the below PowerShell script to recent registration events in your directory. This is useful in case you want to see who has registered recently, or would like to ensure that your password reset rollout is occurring as you expect.

* [Azure AD SSPR Registration Activity PowerShell Script](https://gallery.technet.microsoft.com/scriptcenter/azure-ad-self-service-e31b8aee)

### Description of report columns in Azure portal

The following list explains each of the report columns in detail:

* **User** – the user who attempted a password reset registration operation.
* **Role** – the role of the user in the directory.
* **Date and Time** – the date and time of the attempt.
* **Data Registered** – what authentication data the user provided during password reset registration.

### Description of report values in Azure portal

The following table describes the different values allowed for each column:

| Column | Allowed values and their meanings |
| --- | --- |
| Data Registered |**Alternate Email** – user used alternate email or authentication email to authenticate<p><p>**Office Phone**– user used office phone to authenticate<p>**Mobile Phone** - user used mobile phone or authentication phone to authenticate<p>**Security Questions** – user used security questions to authenticate<p>**Any combination of the above (for example, Alternate Email + Mobile Phone)** – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication their password reset request. |

## View password reset activity in the classic portal

This report shows all password reset attempts that have occurred in your organization.

* **Max time range**: 30 days
* **Max number of rows**: 75,000
* **Downloadable**: Yes, via CSV file

### Description of report columns in Azure classic portal

The following list explains each of the report columns in detail:

1. **User** – the user who attempted a password reset operation (based on the User ID field provided when the user comes to reset a password).
2. **Role** – the role of the user in the directory.
3. **Date and Time** – the date and time of the attempt.
4. **Methods Used** – what authentication methods the user used for this reset operation.
5. **Result** – the result of the password reset operation.
6. **Details** – the details of why the password reset resulted in the value it did.  Also includes any mitigation steps you might take to resolve an unexpected error.

### Description of report values in Azure classic portal

The following table describes the different values allowed for each column:

| Column | Allowed values and their meanings |
| --- | --- |
| Methods Used |**Alternate Email** – user used alternate email or authentication email to authenticate<p>**Office Phone** – user used office phone to authenticate<p>**Mobile Phone** – user used mobile phone or authentication phone to authenticate<p>**Security Questions** – user used security questions to authenticate<p>**Any combination of the above (for example, Alternate Email + Mobile Phone)** – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication their password reset request. |
| Result |**Abandoned** – user started password reset but then stopped halfway through without completing<p>**Blocked** – user’s account was prevented to use password reset due to attempting to use the password reset page or a single password reset gate too many times in a 24-hour period<p>**Canceled** – user started password reset but then clicked the cancel button to cancel the session part way through <p>**Contacted Admin** – user had a problem during his session that he could not resolve, so the user clicked the “Contact your administrator” link instead of finishing the password reset flow<p>**Failed** – user was not able to reset a password, likely because the user was not configured to use the feature (for example, no license, missing authentication info, password-managed on-prem but writeback is off).<p>**Succeeded** – password reset was successful. |
| Details |See table below |

### Allowed values for details column

Below is the list of result types you may expect when using the password reset activity report:

| Details | Result Type |
| --- | --- |
| User abandoned after completing the email verification option |Abandoned |
| User abandoned after completing the mobile SMS verification option |Abandoned |
| User abandoned after completing the mobile voice call verification option |Abandoned |
| User abandoned after completing the office voice call verification option |Abandoned |
| User abandoned after completing the security questions option |Abandoned |
| User abandoned after entering their user ID |Abandoned |
| User abandoned after starting the email verification option |Abandoned |
| User abandoned after starting the mobile SMS verification option |Abandoned |
| User abandoned after starting the mobile voice call verification option |Abandoned |
| User abandoned after starting the office voice call verification option |Abandoned |
| User abandoned after starting the security questions option |Abandoned |
| User abandoned before selecting a new password |Abandoned |
| User abandoned while selecting a new password |Abandoned |
| User entered too many invalid SMS verification codes and is blocked for 24 hours |Blocked |
| User tried mobile phone voice verification too many times and is blocked for 24 hours |Blocked |
| User tried office phone voice verification too many times and is blocked for 24 hours |Blocked |
| User tried to answer security questions too many times and is blocked for 24 hours |Blocked |
| User tried to verify a phone number too many times and is blocked for 24 hours |Blocked |
| User canceled before passing the required authentication methods |Canceled |
| User canceled before submitting a new password |Canceled |
| User contacted an admin after trying the email verification option |Contacted admin |
| User contacted an admin after trying the mobile SMS verification option |Contacted admin |
| User contacted an admin after trying the mobile voice call verification option |Contacted admin |
| User contacted an admin after trying the office voice call verification option |Contacted admin |
| User contacted an admin after trying the security question verification option |Contacted admin |
| Password reset is not enabled for this user. Enable password reset under the configure tab to resolve this |Failed |
| User does not have a license. You can add a license to the user to resolve this |Failed |
| User tried to reset from a device without cookies enabled |Failed |
| User's account has insufficient authentication methods defined. Add authentication info to resolve this |Failed |
| User's password is managed on-premises. You can enable Password Writeback to resolve this |Failed |
| We could not reach your on-premises password reset service. Check your sync machine's event log |Failed |
| We encountered a problem while resetting the user's on-premises password. Check your sync machine's event log |Failed |
| This user is not a member of the password reset users group. Add this user to that group to resolve this. |Failed |
| Password reset has been disabled entirely for this tenant. See [here](http://aka.ms/ssprtroubleshoot) to resolve this. |Failed |
| User successfully reset password |Succeeded |

## Self-service Password Management activity types

The following activity types appear in the **Self-Service Password Management** audit event category.  A description for each of follows.

* [**Blocked from self-service password reset**](#activity-type-blocked-from-self-service-password-reset) - Indicates a user tried to reset a password, use a specific gate, or validate a phone number more than 5 total times in 24 hours.
* [**Change password (self-service)**](#activity-type-change-password-self-service) - Indicates a user performed a voluntary, or forced (due to expiry) password change.
* [**Reset password (by admin)**](#activity-type-reset-password-by-admin) - Indicates an administrator performed a password reset on behalf of a user from the Azure portal.
* [**Reset password (self-service)**](#activity-type-reset-password-self-service) - Indicates a user successfully reset their password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com).
* [**Self-service password reset flow activity progress**](#activity-type-self-serve-password-reset-flow-activity-progress) - Indicates each specific step a user proceeds through (such as passing a specific password reset authentication gate) as part of the password reset process.
* [**Unlock user account (self-service)**](#activity-type-unlock-user-account-self-service) - Indicates a user successfully unlocked their Active Directory account without resetting their password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com) using the AD account unlock without reset feature.
* [**User registered for self-service password reset**](#activity-type-user-registered-for-self-service-password-reset) - Indicates a user has registered all the required information to be able to reset their password in accordance with the currently specified tenant password reset policy.

### Activity type: Blocked from self-service password reset

The following list explains this activity in detail:

* **Activity Description** – Indicates a user tried to reset a password, use a specific gate, or validate a phone number more than 5 total times in 24 hours.
* **Activity Actor** - the user who was throttled from performing additional reset operations. May be an end user or an administrator.
* **Activity Target** - the user who was throttled from performing additional reset operations. May be an end user or an administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates a user was throttled from performing any additional resets, attempt any additional authentication methods, or validate any additional phone numbers for the next 24 hours.
* **Activity Status Failure Reason** - not applicable

### Activity type: Change password (self-service)

The following list explains this activity in detail:

* **Activity Description** – Indicates a user performed a voluntary, or forced (due to expiry) password change.
* **Activity Actor** - the user who changed their password. May be an end user or an administrator.
* **Activity Target** - the user who changed their password. May be an end user or an administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates a user successfully changed their password
  * _Failure_ - indicates a user failed to change their password. Clicking the row allows you to see the **Activity Status Reason** category to learn more about why the failure occurred.
* **Activity Status Failure Reason** - 
  * _FuzzyPolicyViolationInvalidPassword_ - the user selected a password, which was automatically banned due to Microsoft's Banned Password Detection capabilities finding it to be too common or especially weak.

### Activity type: Reset password (by admin)

The following list explains this activity in detail:

* **Activity Description** – Indicates an administrator performed a password reset on behalf of a user from the Azure portal.
* **Activity Actor** - the administrator who performed the password reset on behalf of another end user or administrator. Must be either a global administrator, password administrator, user administrator, or helpdesk administrator.
* **Activity Target** - the user whose password was reset. May be an end-user or a different administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates an admin successfully reset a user's password
  * _Failure_ - indicates an admin failed to change a user's password. Clicking the row allows you to see the **Activity Status Reason** category to learn more about why the failure occurred.

### Activity type: Reset password (self-service)

The following list explains this activity in detail:

* **Activity Description** – Indicates a user successfully reset their password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com).
* **Activity Actor** - the user who reset their password. May be an end user or an administrator.
* **Activity Target** - the user who reset their password. May be an end user or an administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates a user successfully reset their own password
  * _Failure_ - indicates a user failed to reset their own password. Clicking the row allows you to see the **Activity Status Reason** category to learn more about why the failure occurred.
* **Activity Status Failure Reason** -
  * _FuzzyPolicyViolationInvalidPassword_ - the admin selected a password, which was automatically banned due to Microsoft's Banned Password Detection capabilities finding it to be too common or especially weak.

### Activity type: Self serve password reset flow activity progress

The following list explains this activity in detail:

* **Activity Description** – Indicates each specific step a user proceeds through (such as passing a specific password reset authentication gate) as part of the password reset process.
* **Activity Actor** - the user who performed part of the password reset flow. May be an end user or an administrator.
* **Activity Target** - the user who performed part of the password reset flow. May be an end user or an administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates a user successfully completed a specific step of the password reset flow.
  * _Failure_ - indicates a specific step of the password reset flow failed. Clicking the row allows you to see the **Activity Status Reason** category to learn more about why the failure occurred.
* **Allowed Activity Status Reasons**
  * See table below for [all allowed reset activity status reasons](#allowed-values-for-details-column)

### Activity type: Unlock user account (self-service)

The following list explains this activity in detail:

* **Activity Description** – Indicates a user successfully unlocked their Active Directory account without resetting their password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com) using the AD account unlock without reset feature.
* **Activity Actor** - the user who unlocked their account without resetting their password. May be an end user or an administrator.
* **Activity Target** - the user who unlocked their account without resetting their password. May be an end user or an administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates a user successfully unlocked their own account
  * _Failure_ - indicates a user failed to unlock their account. Clicking the row allows you to see the **Activity Status Reason** category to learn more about why the failure occurred.

### Activity type: User registered for self-service password reset

The following list explains this activity in detail:

* **Activity Description** – Indicates a user has registered all the required information to be able to reset their password in accordance with the currently specified tenant password reset policy. 
* **Activity Actor** - the user who registered for password reset. May be an end user or an administrator.
* **Activity Target** - the user who registered for password reset. May be an end user or an administrator.
* **Allowed Activity Statuses**
  * _Success_ - indicates a user successfully registered for password reset in accordance with the current policy. 
  * _Failure_ - indicates a user failed to register for password reset. Clicking the row allows you to see the **Activity Status Reason** category to learn more about why the failure occurred. Note - this does not mean a user is unable to reset their own password, just that they did not complete the registration process. If there is unverified data on their account that is correct (such as a phone number that is not validated), even though they have not verified this phone number, they can still use it to reset their password. For more information, see [What happens when a user registers?](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#what-happens-when-a-user-registers)

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [Shortcut to user management audit logs](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/Audit) - Go directly to your tenant's user management audit logs
* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
* [**Troubleshoot**](active-directory-passwords-troubleshoot.md) - Learn how to resolve common issues that we see with SSPR
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies

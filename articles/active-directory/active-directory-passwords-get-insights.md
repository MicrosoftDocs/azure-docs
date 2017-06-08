---
title: 'Get Insights: Azure AD password management reports | Microsoft Docs'
description: This article describes how to use reports to get insight into password management operations in your organization.
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: gahug

ms.assetid: 1472b51d-53f4-4b0f-b1be-57f6fa88fa65
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: joflore
ms.custom: it-pro

---
# How to get operational insights with password management reports
> [!IMPORTANT]
> **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-or-unlock-my-password-for-a-work-or-school-account).
>
>

This section describes how you can use Azure Active Directory’s password management reports to view how users are using password reset and change in your organization.

* [**Password management reports overview**](#overview-of-password-management-reports)
* [**How to view password management reports in the new Azure portal**](#how-to-view-password-management-reports)
 * [Directory roles allowed to read reports](#directory-roles-allowed-to-read-reports)
* [**Self-service Password Management activity types in the new Azure Portal**](#self-service-password-management-activity-types)
 * [Blocked from self-service password reset](#activity-type-blocked-from-self-service-password-reset)
 * [Change password (self-service)](#activity-type-change-password-self-service)
 * [Reset password (by admin)](#activity-type-reset-password-by-admin)
 * [Reset password (self-service)](#activity-type-reset-password-self-service)
 * [Self serve password reset flow activity progress](#activity-type-self-serve-password-reset-flow-activity-progress)
 * [Unlock user account (self-service)](#activity-type-unlock-user-account-self-service)
 * [User registered for self-service password reset](#activity-type-user-registered-for-self-service-password-reset)
* [**How to retrieve password management events from the Azure AD Reports and Events API**](#how-to-retrieve-password-management-events-from-the-azure-ad-reports-and-events-api)
 * [Reporting API data retrieval limitations](#reporting-api-data-retrieval-limitations)
* [**How to download password reset registration events quickly with PowerShell**](#how-to-download-password-reset-registration-events-quickly-with-powershell)
* [**How to view password management reports in the classic portal**](#how-to-view-password-management-reports-in-the-classic-portal)
* [**View password reset registration activity in your organization in the classic portal**](#view-password-reset-registration-activity-in-the-classic-portal)
* [**View password reset activity in your organization in the classic portal**](#view-password-reset-activity-in-the-classic-portal)


## Overview of password management reports
Once you deploy password reset, one of the most common next steps is to see how it is being used in your organization.  For example, you may want to get insight into how users are registering for password reset, or how many password resets have been done in the last few days.  Here are some of the common questions that you will be able to answer with the password management reports that exist in the [Azure Management Portal](https://manage.windowsazure.com) today:

* How many people have registered for password reset?
* Who has registered for password reset?
* What data are people registering?
* How many people reset their passwords in the last 7 days?
* What are the most common methods users or admins use to reset their passwords?
* What are common issues users or admins face when attempting to use password reset?
* What admins are resetting their own passwords frequently?
* Is there any suspicious activity going on with password reset?

## How to view Password Management Reports
In the new [Azure Portal](https://portal.azure.com) experience, we have an improved way to view password reset and password reset registration activity.  Follow the steps below to find the password reset and password reset registration events in the new [Azure Portal](https://portal.azure.com):

1. Navigate to [**portal.azure.com**](https://portal.azure.com)
2. Click on the **More services** menu on the main Azure Portal left hand navigation
3. Search for **Azure Active Directory** in the list of services and select it
4. Click on **Users & Groups** from the Azure Active Directory navigation menu
5. Click on the **Audit Logs** navigation item from the Users & Groups navigation menu. This will show you all of the audit events occuring against all the users in your directory. You can filter this view to see all the password-related events, as well.
6. To filter this view to only the password management related events, click the **Filter** button at the top of the blade.
7. From the **Filter** menu, select the **Category** dropdown, and change it to the **Self-service Password Management** category type.
8. Optionally further filter the list by choosing the specific **Activity** you are interested
### Direct link to User Audit blade
If you are signed in to your portal, here is a direct link to the user audit blade where you can see these events:

* [Go to user management audit view directly](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/Audit)

### Directory Roles allowed to read reports
Currently, the following directory roles may read Azure AD Password Management reports in the classic Azure portal:

* Global administrator

Before being able to read these reports, a global administrator in the company must have opted-in for this data to be retrieved on behalf of the organization by visiting the reporting tab or audit logs at least once. Until doing so, data will not be collected for your organization.

To read more about directory roles and what they can do, see [Assigning administrator roles in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-assign-admin-roles).

## Self-service Password Management activity types
The following activity types appear in the **Self-Service Password Management** audit event category.  A description for each of these follows.

* [**Blocked from self-service password reset**](#activity-type-blocked-from-self-service-password-reset) - Indicates a user tried to reset a password, use a specific gate, or validate a phone number more than 5 total times in 24 hours.
* [**Change password (self-service)**](#activity-type-change-password-self-service) - Indicates a user performed a voluntary, or forced (due to expiry) password change.
* [**Reset password (by admin)**](#activity-type-reset-password-by-admin) - Indicates an administrator performed a password reset on behalf of a user from the Azure Portal.
* [**Reset password (self-service)**](#activity-type-reset-password-self-service) - Indicates a user successfully reset his or her password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com).
* [**Self serve password reset flow activity progress**](#activity-type-self-serve-password-reset-flow-activity-progress) - Indicates each specific step a user proceeds through (such as passing a specific password reset authentication gate) as part of the password reset process.
* [**Unlock user account (self-service)**](#activity-type-unlock-user-account-self-service) - Indicates a user successfully unlocked his or her Active Directory account without resetting his or her password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com) using the [AD account unlock without reset](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-passwords-customize#allow-users-to-unlock-accounts-without-resetting-their-password) feature.
* [**User registered for self-service password reset**](#activity-type-user-registered-for-self-service-password-reset) - Indicates a user has registered all the required information to be able to reset his or her password in accordance with the currently-specified tenant password reset policy.

### Activity type: Blocked from self-service password reset
The following list explains this activity in detail:

* **Activity Description** – Indicates a user tried to reset a password, use a specific gate, or validate a phone number more than 5 total times in 24 hours.
* **Activity Actor** - the user who was throttled from performing additional reset operations. May be an end-user or an administrator.
* **Activity Target** - the user who was throttled from performing additional reset operations. May be an end-user or an administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates a user was throttled from performing any additional resets, attempt any additional authentication methods, or validate any additional phone numbers for the next 24 hours.
* **Activity Status Failure Reason** - not applicable

### Activity type: Change password (self-service)
The following list explains this activity in detail:

* **Activity Description** – Indicates a user performed a voluntary, or forced (due to expiry) password change.
* **Activity Actor** - the user who changed his or her password. May be an end-user or an administrator.
* **Activity Target** - the user who changed his or her password. May be an end-user or an administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates a user successfully changed his or her password
 * _Failure_ - indicates a user failed to change his or her password. Clicking on the row will allow you to see the **Activity Status Reason** category to learn more about why the failure occurred.
* **Activity Status Failure Reason** -
 * _FuzzyPolicyViolationInvalidPassword_ - the user selected a password which was automatically banned due to Microsoft's Banned Password Detection capabilities finding it to be too common or especially weak.

### Activity type: Reset password (by admin)
The following list explains this activity in detail:

* **Activity Description** – Indicates an administrator performed a password reset on behalf of a user from the Azure Portal.
* **Activity Actor** - the administrator who performed the password reset on behalf of another end-user or administrator. Must be either a global administrator, password administrator, user administrator, or helpdesk administrator.
* **Activity Target** - the user whose password was reset. May be an end-user or a different administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates an admin successfully reset a user's password
 * _Failure_ - indicates an admin failed to change a user's password. Clicking on the row will allow you to see the **Activity Status Reason** category to learn more about why the failure occurred.

### Activity type: Reset password (self-service)
The following list explains this activity in detail:

* **Activity Description** – Indicates a user successfully reset his or her password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com).
* **Activity Actor** - the user who reset his or her password. May be an end-user or an administrator.
* **Activity Target** - the user who reset his or her password. May be an end-user or an administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates an user successfully reset his or her own password
 * _Failure_ - indicates an user failed to reset his or her own password. Clicking on the row will allow you to see the **Activity Status Reason** category to learn more about why the failure occurred.
* **Activity Status Failure Reason** -
 * _FuzzyPolicyViolationInvalidPassword_ - the admin selected a password which was automatically banned due to Microsoft's Banned Password Detection capabilities finding it to be too common or especially weak.

### Activity type: Self serve password reset flow activity progress
The following list explains this activity in detail:

* **Activity Description** – Indicates each specific step a user proceeds through (such as passing a specific password reset authentication gate) as part of the password reset process.
* **Activity Actor** - the user who performed part of the password reset flow. May be an end-user or an administrator.
* **Activity Target** - the user who performed part of the password reset flow. May be an end-user or an administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates a user successfully completed a specific step of the password reset flow.
 * _Failure_ - indicates a specific step of the password reset flow failed. Clicking on the row will allow you to see the **Activity Status Reason** category to learn more about why the failure occurred.
* **Allowed Activity Status Reasons**
 * See table below for [all allowed reset activity status reasons](#allowed-values-for-details-column)

### Activity type: Unlock user account (self-service)
The following list explains this activity in detail:

* **Activity Description** – Indicates a user successfully unlocked his or her Active Directory account without resetting his or her password from the [Azure AD Password Reset Portal](https://passwordreset.microsoftonline.com) using the [AD account unlock without reset](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-passwords-customize#allow-users-to-unlock-accounts-without-resetting-their-password) feature.
* **Activity Actor** - the user who unlocked his or her account without resetting their password. May be an end-user or an administrator.
* **Activity Target** - the user who unlocked his or her account without resetting their password. May be an end-user or an administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates an user successfully unlocked his or her own account
 * _Failure_ - indicates an user failed to unlock his or her account. Clicking on the row will allow you to see the **Activity Status Reason** category to learn more about why the failure occurred.

### Activity type: User registered for self-service password reset
The following list explains this activity in detail:

* **Activity Description** – Indicates a user has registered all the required information to be able to reset his or her password in accordance with the currently-specified tenant password reset policy.
* **Activity Actor** - the user who registered for password reset. May be an end-user or an administrator.
* **Activity Target** - the user who registered for password reset. May be an end-user or an administrator.
* **Allowed Activity Statuses**
 * _Success_ - indicates an user successfully registered for password reset in accordance with the current policy.
 * _Failure_ - indicates a user failed to register for password reset. Clicking on the row will allow you to see the **Activity Status Reason** category to learn more about why the failure occurred. Note - this does not mean a user is not able to reset his or her own password, just that he or she did not complete the registration process. If there is unverified data on their account that is correct (such as a phone number that is not validated), even though they have not verified this phone number, they can still use it to reset their password. For more information, see [What happens when a user registers?](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-learn-more#what-happens-when-a-user-registers)

## How to retrieve password management events from the Azure AD Reports and Events API
As of August 2015, the Azure AD Reports and Events API now supports retrieving all of the information included in the password reset and password reset registration reports. By using this API, you can download individual password reset and password reset registration events for integration with the reporting technology of your choce.

### How to get started with the reporting API
To access this data, you'll need to write a small app or script to retrieve it from our servers. [Learn how to get started with the Azure AD Reporting API](active-directory-reporting-api-getting-started.md).

Once you have a working script, you'll next want to examine the password reset and registration events that you can retrieve to meet your scenarios.

* [SsprActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent): Lists the columns available for password reset events
* [SsprRegistrationActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprRegistrationActivityEvent): Lists the columns available for password reset registration events

### Reporting API data retrieval limitations
Currently, the Azure AD Reports and Events API retrieves up to **75,000 individual events** of the [SsprActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprActivityEvent) and [SsprRegistrationActivityEvent](https://msdn.microsoft.com/library/azure/mt126081.aspx#BKMK_SsprRegistrationActivityEvent) types, spanning the **last 30 days**.

If you need to retrieve or store data beyond this window, we suggest persisting it in an external database and using the API to query the deltas that result. A best practice is to begin retrieving this data when you start your password reset registration process in your organization, persist it externally, and then continue to track the deltas from this point forward.

## How to download password reset registration events quickly with PowerShell
In addition to using the Azure AD Reports and Events API directly, you may also use the below PowerShell script to recent registration events in your directory. This is useful in case you want to see who has registered recently, or would like to ensure that your password reset rollout is occurring as you expect.

* [Azure AD SSPR Registration Activity PowerShell Script](https://gallery.technet.microsoft.com/scriptcenter/azure-ad-self-service-e31b8aee)

## How to view password management reports in the classic portal
To find the password management reports, follow the steps below:

1. Click on the **Active Directory** extension in the [Azure classic portal](https://manage.windowsazure.com).
2. Select your directory from the list that appears in the portal.
3. Click on the **Reports** tab.
4. Look under the **Activity Logs** section.
5. Select either the **Password reset activity** report or the **Password reset registration activity** report.

## View password reset registration activity in the classic portal
The password reset registration activity report shows all password reset registrations that have occurred in your organization.  A password reset registration is displayed in this report for any user who has successfully registered authentication information at the password reset registration portal ([http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)).

* **Max time range**: 30 days
* **Max number of rows**: 75,000
* **Downloadable**: Yes, via CSV file

### Description of report columns
The following list explains each of the report columns in detail:

* **User** – the user who attempted a password reset registration operation.
* **Role** – the role of the user in the directory.
* **Date and Time** – the date and time of the attempt.
* **Data Registered** – what authentication data the user provided during password reset registration.

### Description of report values
The following table describes the different values allowed for each column:

| Column | Allowed values and their meanings |
| --- | --- |
| Data Registered |**Alternate Email** – user used alternate email or authentication email to authenticate<p><p>**Office Phone**– user used office phone to authenticate<p>**Mobile Phone** - user used mobile phone or authentication phone to authenticate<p>**Security Questions** – user used security questions to authenticate<p>**Any combination of the above (e.g. Alternate Email + Mobile Phone)** – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication his password reset request. |

## View password reset activity in the classic portal
This report shows all password reset attempts that have occurred in your organization.

* **Max time range**: 30 days
* **Max number of rows**: 75,000
* **Downloadable**: Yes, via CSV file

### Description of report columns
The following list explains each of the report columns in detail:

1. **User** – the user who attempted a password reset operation (based on the User ID field provided when the user comes to reset a password).
2. **Role** – the role of the user in the directory.
3. **Date and Time** – the date and time of the attempt.
4. **Method(s) Used** – what authentication methods the user used for this reset operation.
5. **Result** – the end result of the password reset operation.
6. **Details** – the details of why the password reset resulted in the value it did.  Also includes any mitigation steps you might take to resolve an unexpected error.

### Description of report values
The following table describes the different values allowed for each column:

| Column | Allowed values and their meanings |
| --- | --- |
| Methods Used |**Alternate Email** – user used alternate email or authentication email to authenticate<p>**Office Phone** – user used office phone to authenticate<p>**Mobile Phone** – user used mobile phone or authentication phone to authenticate<p>**Security Questions** – user used security questions to authenticate<p>**Any combination of the above (e.g. Alternate Email + Mobile Phone)** – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication his password reset request. |
| Result |**Abandoned** – user started password reset but then stopped halfway through without completing<p>**Blocked** – user’s account was prevented to use password reset due to attempting to use the password reset page or a single password reset gate too many times in a 24 hour period<p>**Cancelled** – user started password reset but then clicked the cancel button to cancel the session part way through <p>**Contacted Admin** – user had a problem during his session that he could not resolve, so the user clicked the “Contact your administrator” link instead of finishing the password reset flow<p>**Failed** – user was not able to reset a password, likely because the user was not configured to use the feature (e.g. no license, missing authentication info, password managed on-prem but writeback is off).<p>**Succeeded** – password reset was successful. |
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
| User cancelled before passing the required authentication methods |Cancelled |
| User cancelled before submitting a new password |Cancelled |
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

## Next steps
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md#reset-or-unlock-my-password-for-a-work-or-school-account).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works

---
title: Self-service password reset reports
description: Reporting on Microsoft Entra self-service password reset events
services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/14/2023
ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: tilarso
ms.collection: M365-identity-device-management
ms.custom: ignite-fall-2021
---
# Reporting options for Microsoft Entra password management

After deployment, many organizations want to know how or if self-service password reset (SSPR) is really being used. The reporting feature that Microsoft Entra ID provides helps you answer questions by using prebuilt reports. If you're appropriately licensed, you can also create custom queries.

![Reporting on SSPR using the audit logs in Microsoft Entra ID][Reporting]

The following questions can be answered by the reports that exist in the [Microsoft Entra admin center](https://entra.microsoft.com):

> [!NOTE]
> You must be [a Global Administrator](../roles/permissions-reference.md), and you must opt-in for this data to be gathered on behalf of your organization. To opt in, you must visit the **Reporting** tab or the audit logs at least once. Until then, data is not collected for your organization.
>

* How many people have registered for password reset?
* Who has registered for password reset?
* What data are people registering?
* How many people reset their passwords in the last seven days?
* What are the most common methods that  users or admins use to reset their passwords?
* What are common problems users or admins face when attempting to use password reset?
* What admins are resetting their own passwords frequently?
* Is there any suspicious activity going on with password reset?

## How to view password management reports

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Use the following the steps to find the password reset and password reset registration events:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. Browse to **Identity** > **Users**.
5. Select **Audit Logs** from the **Users** blade. This shows you all of the audit events that occurred against all the users in your directory. You can filter this view to see all the password-related events.
6. From the **Filter** menu at the top of the pane, select the **Service** drop-down list, and change it to the **Self-service Password Management** service type.
7. Optionally, further filter the list by choosing the specific **Activity** you're interested in.

### Combined registration

[Combined registration](./concept-registration-mfa-sspr-combined.md) security information registration and management events can be found in the audit logs under **Security** > **Authentication Methods**.

## Description of the report columns

The following list explains each of the report columns in detail:

* **User**: The user who attempted a password reset registration operation.
* **Role**: The role of the user in the directory.
* **Date and Time**: The date and time of the attempt.
* **Data Registered**: The authentication data that the user provided during password reset registration.

## Description of the report values

The following table describes the different values that are you can set for each column:

| Column | Permitted values and their meanings |
| --- | --- |
| Data registered |**Alternate email**: The user used an alternate email or authentication email to authenticate.<p><p>**Office phone**: The user used an office phone to authenticate.<p>**Mobile phone**: The user used a mobile phone or authentication phone to authenticate.<p>**Security questions**: The user used security questions to authenticate.<p>**Any combination of the previous methods, for example, alternate email + mobile phone**: Occurs when a two-gate policy is specified and shows which two methods the user used to authentication their password reset request. |

## Self-Service Password Management activity types

The following activity types appear in the **Self-Service Password Management** audit event category:

* [Blocked from self-service password reset](#activity-type-blocked-from-self-service-password-reset): Indicates that a user tried to reset a password, use a specific gate, or validate a phone number more than five total times in 24 hours.
* [Change password (self-service)](#activity-type-change-password-self-service): Indicates that a user performed a voluntary, or forced (due to expiry) password change.
* [Reset password (by admin)](#activity-type-reset-password-by-admin): Indicates that an administrator performed a password reset on behalf of a user.
* [Reset password (self-service)](#activity-type-reset-password-self-service): Indicates that a user successfully reset their password from [Microsoft Entra password reset](https://passwordreset.microsoftonline.com).
* [Self-service password reset flow activity progress](#activity-type-self-serve-password-reset-flow-activity-progress): Indicates each specific step a user proceeds through, such as passing a specific password reset authentication gate, as part of the password reset process.
* [Unlock user account (self-service)](#activity-type-unlock-a-user-account-self-service): Indicates that a user successfully unlocked their Active Directory account without resetting their password from [Microsoft Entra password reset](https://passwordreset.microsoftonline.com) by using the Active Directory feature of account unlock without reset.
* [User registered for self-service password reset](#activity-type-user-registered-for-self-service-password-reset): Indicates that a user has registered all the required information to be able to reset their password in accordance with the currently specified tenant password reset policy.

### Activity type: Blocked from self-service password reset

The following list explains this activity in detail:

* **Activity description**: Indicates that a user tried to reset a password, use a specific gate, or validate a phone number more than five total times in 24 hours.
* **Activity actor**: The user who was throttled from performing additional reset operations. The user can be an end user or an administrator.
* **Activity target**: The user who was throttled from performing additional reset operations. The user can be an end user or an administrator.
* **Activity status**:
  - *Success*: Indicates that a user was throttled from performing any additional resets, attempting any additional authentication methods, or validating any additional phone numbers for the next 24 hours.
* **Activity status failure reason**: Not applicable.

### Activity type: Change password (self-service)

The following list explains this activity in detail:

* **Activity description**: Indicates that a user performed a voluntary, or forced (due to expiry) password change.
* **Activity actor**: The user who changed their password. The user can be an end user or an administrator.
* **Activity target**: The user who changed their password. The user can be an end user or an administrator.
* **Activity statuses**:
  - *Success*: Indicates that a user successfully changed their password.
  - *Failure*: Indicates that a user failed to change their password. You can select the row to see the **Activity status reason** category to learn more about why the failure occurred.
* **Activity status failure reason**:
  - *FuzzyPolicyViolationInvalidPassword*: The user selected a password that was automatically banned because the Microsoft Banned Password Detection capabilities found it to be too common or especially weak.

### Activity type: Reset password (by admin)

The following list explains this activity in detail:

* **Activity description**: Indicates that an administrator performed a password reset on behalf of a user.
* **Activity actor**: The administrator who performed the password reset on behalf of another end user or administrator. Must be a password administrator, user administrator, or helpdesk administrator.
* **Activity target**: The user whose password was reset. The user can be an end user or a different administrator.
* **Activity statuses**:
  - *Success*: Indicates that an admin successfully reset a user's password.
  - *Failure*: Indicates that an admin failed to change a user's password. You can select the row to see the **Activity status reason** category to learn more about why the failure occurred.
* **Activity additional details OnPremisesAgent**:
  - *None*: Indicates cloud-only reset.
  - *Microsoft Entra Connect*: Indicates password was reset on-premises via Microsoft Entra Connect writeback agent.
  - *CloudSync*: Indicates password was reset on-premises via Microsoft Entra CloudSync writeback agent.

### Activity type: Reset password (self-service)

The following list explains this activity in detail:

* **Activity description**: Indicates that a user successfully reset their password from [Microsoft Entra password reset](https://passwordreset.microsoftonline.com).
* **Activity actor**: The user who reset their password. The user can be an end user or an administrator.
* **Activity target**: The user who reset their password. The user can be an end user or an administrator.
* **Activity statuses**:
  - *Success*: Indicates that a user successfully reset their own password.
  - *Failure*: Indicates that a user failed to reset their own password. You can select the row to see the **Activity status reason** category to learn more about why the failure occurred.
* **Activity status failure reason**:
  - *FuzzyPolicyViolationInvalidPassword*: The admin selected a password that was automatically banned because the Microsoft Banned Password Detection capabilities found it to be too common or especially weak.

### Activity type: Self serve password reset flow activity progress

The following list explains this activity in detail:

* **Activity description**: Indicates each specific step a user proceeds through (such as passing a specific password reset authentication gate) as part of the password reset process.
* **Activity actor**: The user who performed part of the password reset flow. The user can be an end user or an administrator.
* **Activity target**: The user who performed part of the password reset flow. The user can be an end user or an administrator.
* **Activity statuses**:
  - *Success*: Indicates that a user successfully completed a specific step of the password reset flow.
  - *Failure*: Indicates that a specific step of the password reset flow failed. You can select the row to see the **Activity status reason** category to learn more about why the failure occurred.
* **Activity status reasons**:
    See the following table for [all the permissible reset activity status reasons](#description-of-the-report-columns).

### Activity type: Unlock a user account (self-service)

The following list explains this activity in detail:

* **Activity description**: Indicates that a user successfully unlocked their Active Directory account without resetting their password from [Microsoft Entra password reset](https://passwordreset.microsoftonline.com) by using the Active Directory feature of account unlock without reset.
* **Activity actor**: The user who unlocked their account without resetting their password. The user can be an end user or an administrator.
* **Activity target**: The user who unlocked their account without resetting their password. The user can be an end user or an administrator.
* **Allowed activity statuses**:
  - *Success*: Indicates that a user successfully unlocked their own account.
  - *Failure*: Indicates that a user failed to unlock their account. You can select the row to see the **Activity status reason** category to learn more about why the failure occurred.

### Activity type: User registered for self-service password reset

The following list explains this activity in detail:

* **Activity description**: Indicates that a user has registered all the required information to be able to reset their password in accordance with the currently specified tenant password reset policy. 
* **Activity actor**: The user who registered for password reset. The user can be an end user or an administrator.
* **Activity target**: The user who registered for password reset. The user can be an end user or an administrator.
* **Allowed activity statuses**:
  - *Success*: Indicates that a user successfully registered for password reset in accordance with the current policy. 
  - *Failure*: Indicates that a user failed to register for password reset. You can select the row to see the **Activity status reason** category to learn more about why the failure occurred.

     >[!NOTE]
     >Failure doesn't mean a user is unable to reset their own password. It means that they didn't finish the registration process. If there is unverified data on their account that's correct, such as a phone number that's not validated, even though they have not verified this phone number, they can still use it to reset their password.

## Next steps

* [SSPR and MFA usage and insights reporting](./howto-authentication-methods-activity.md)
* [How do I complete a successful rollout of SSPR?](howto-sspr-deployment.md)
* [Reset or change your password](https://support.microsoft.com/account-billing/reset-your-work-or-school-password-using-security-info-23dde81f-08bb-4776-ba72-e6b72b9dda9e).
* [Register for self-service password reset](https://support.microsoft.com/account-billing/register-the-password-reset-verification-method-for-a-work-or-school-account-47a55d4a-05b0-4f67-9a63-f39a43dbe20a).
* [Do you have a licensing question?](concept-sspr-licensing.md)
* [What data is used by SSPR and what data should you populate for your users?](howto-sspr-authenticationdata.md)
* [What authentication methods are available to users?](concept-sspr-howitworks.md#authentication-methods)
* [What are the policy options with SSPR?](concept-sspr-policy.md)
* [What is password writeback and why do I care about it?](./tutorial-enable-sspr-writeback.md)
* [What are all of the options in SSPR and what do they mean?](concept-sspr-howitworks.md)
* [I think something is broken. How do I troubleshoot SSPR?](./troubleshoot-sspr.md)
* [I have a question that was not covered somewhere else](../develop/configure-app-multi-instancing.md)

[Reporting]: ./media/howto-sspr-reporting/sspr-reporting.png "Example of SSPR activity audit logs in Azure AD"

---
title: Use My Staff to delegate user management
description:  Delegate user management using My Staff and administrative units
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.topic: how-to
ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.date: 05/18/2021
ms.author: rolyon
ms.reviewer: sahenry
ms.custom: oldportal;it-pro;

---
# Manage your users with My Staff

My Staff enables you to delegate permissions to a figure of authority, such as a store manager or a team lead, to ensure that their staff members are able to access their Microsoft Entra accounts. Instead of relying on a central helpdesk, organizations can delegate common tasks such as resetting passwords or changing phone numbers to a local team manager. With My Staff, a user who can't access their account can regain access in just a couple of clicks, with no helpdesk or IT staff required.

Before you configure My Staff for your organization, we recommend that you review this documentation as well as the [user documentation](https://support.microsoft.com/account-billing/manage-front-line-users-with-my-staff-c65b9673-7e1c-4ad6-812b-1a31ce4460bd) to ensure you understand how it works and how it impacts your users. You can leverage the user documentation to train and prepare your users for the new experience and help to ensure a successful rollout.

## How My Staff works

My Staff is based on administrative units, which are a container of resources which can be used to restrict the scope of a role assignment's administrative control. For more information, see [Administrative units management in Microsoft Entra ID](administrative-units.md). In My Staff, administrative units can be used to contain a group of users in a store or department. A team manager can then be assigned to an administrative role at a scope of one or more units.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.

  * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A Microsoft Entra tenant associated with your subscription.

  * If needed, [create a Microsoft Entra tenant](../fundamentals/sign-up-organization.md) or [associate an Azure subscription with your account](../fundamentals/how-subscriptions-associated-directory.md).
* You need *Global Administrator* privileges in your Microsoft Entra tenant to enable SMS-based authentication.
* Each user who's enabled in the text message authentication method policy must be licensed, even if they don't use it. Each enabled user must have one of the following Microsoft Entra ID or Microsoft 365 licenses:

  * [Microsoft Entra ID P1 or P2](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing)
  * [Microsoft 365 F1 or F3](https://www.microsoft.com/licensing/news/m365-firstline-workers)
  * [Enterprise Mobility + Security (EMS) E3 or E5](https://www.microsoft.com/microsoft-365/enterprise-mobility-security/compare-plans-and-pricing) or [Microsoft 365 E3 or E5](https://www.microsoft.com/microsoft-365/compare-microsoft-365-enterprise-plans)

## How to enable My Staff

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Once you have configured administrative units, you can apply this scope to your users who access My Staff. Only users who are assigned an administrative role can access My Staff. To enable My Staff, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).

1. Browse to **Identity** > **Users** > **User settings**.

1. Under **User feature**, select **Manage user feature settings**.

1. Under **Administrators can access My Staff**, you can choose to enable for all users, selected users, or no user access.

> [!Note]
> Only users who've been assigned an admin role can access My Staff. If you enable My Staff for a user who is not assigned an admin role, they won't be able to access My Staff.

## Conditional Access

You can protect the My Staff portal using Microsoft Entra Conditional Access policy. Use it for tasks like requiring multi-factor authentication before accessing My Staff.

We strongly recommend that you protect My Staff using [Microsoft Entra Conditional Access policies](../conditional-access/index.yml). To apply a Conditional Access policy to My Staff, you must first visit the My Staff site once for a few minutes to automatically provision the service principal in your tenant for use by Conditional Access.

You'll see the service principal when you create a Conditional Access policy that applies to the My Staff cloud application.

![Create a Conditional Access policy for the My Staff app](./media/my-staff-configure/conditional-access.png)

## Using My Staff

When a user goes to My Staff, they are shown the names of the [administrative units](administrative-units.md) over which they have administrative permissions. In the [My Staff user documentation](https://support.microsoft.com/account-billing/manage-front-line-users-with-my-staff-c65b9673-7e1c-4ad6-812b-1a31ce4460bd), we use the term "location" to refer to administrative units. If an administrator's permissions do not have an administrative unit scope, the permissions apply across the organization. After My Staff has been enabled, the users who are enabled and have been assigned an administrative role can access it through [https://mystaff.microsoft.com](https://mystaff.microsoft.com). They can select an administrative unit to view the users in that unit, and select a user to open their profile.

## Reset a user's password

Before you can reset passwords for on-premises users, you must fulfill the following prerequisite conditions. For detailed instructions, see [Enable self-service password reset](../authentication/tutorial-enable-sspr-writeback.md) tutorial.

* Configure permissions for password writeback
* Enable password writeback in Microsoft Entra Connect
* Enable password writeback in Microsoft Entra self-service password reset (SSPR)

The following roles have permission to reset a user's password:

* [Authentication Administrator](permissions-reference.md#authentication-administrator)
* [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator)
* [Global Administrator](permissions-reference.md#global-administrator)
* [Helpdesk Administrator](permissions-reference.md#helpdesk-administrator)
* [User Administrator](permissions-reference.md#user-administrator)
* [Password Administrator](permissions-reference.md#password-administrator)

From **My Staff**, open a user's profile. Select **Reset password**.

* If the user is cloud-only, you can see a temporary password that you can give to the user.
* If the user is synced from on-premises Active Directory, you can enter a password that meets your on-premises AD policies. You can then give that password to the user.

    ![Password reset progress indicator and success notification](./media/my-staff-configure/reset-password.png)

The user is required to change their password the next time they sign in.

## Manage a phone number

From **My Staff**, open a user's profile.

* Select **Add phone number** section to add a phone number for the user
* Select **Edit phone number** to change the phone number
* Select **Remove phone number** to remove the phone number for the user

Depending on your settings, the user can then use the phone number you set up to sign in with SMS, perform multi-factor authentication, and perform self-service password reset.

To manage a user's phone number, you must be assigned one of the following roles:

* [Authentication Administrator](permissions-reference.md#authentication-administrator)
* [Privileged Authentication Administrator](permissions-reference.md#privileged-authentication-administrator)
* [Global Administrator](permissions-reference.md#global-administrator)

## Search

You can search for administrative units and users in your organization using the search bar in My Staff. You can search across all administrative units and users in your organization, but you can only make changes to users who are in an administrative unit over which you have been given admin permissions.

## Audit logs

You can view audit logs for actions taken in My Staff in the Microsoft Entra admin center. If an audit log was generated by an action taken in My Staff, you will see this indicated under ADDITIONAL DETAILS in the audit event.

## Next steps

[My Staff user documentation](https://support.microsoft.com/account-billing/manage-front-line-users-with-my-staff-c65b9673-7e1c-4ad6-812b-1a31ce4460bd)
[Administrative units documentation](administrative-units.md)

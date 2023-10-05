---
title: Problems signing in to a Microsoft application
description: Troubleshoot common problems faced when signing in to first-party Microsoft Applications using Microsoft Entra ID (like Microsoft 365).
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/07/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.collection: M365-identity-device-management
ms.custom: enterprise-apps
---

# Problems signing in to a Microsoft application

Microsoft Applications (like Exchange, SharePoint, Yammer, etc.) are assigned and managed a bit differently than third-party SaaS applications or other applications you integrate with Microsoft Entra ID for single sign-on.

There are three main ways that a user can get access to a Microsoft-published application.

- For applications in the Microsoft 365 or other paid suites, users are granted access through **license assignment** either directly to their user account, or through a group using our group-based license assignment capability.

- For applications that Microsoft or a Third Party publishes freely for anyone to use, users may be granted access through **user consent**. This means that they sign in to the application with their Microsoft Entra work or school account and allow it to have access to some limited set of data on their account.

- For applications that Microsoft or a third-party publishes freely for anyone to use, users may also be granted access through **administrator consent**. This means that an administrator has determined the application may be used by everyone in the organization, so they sign in to the application with a Global Administrator account and grant access to everyone in the organization.

To troubleshoot your issue, start with the [General Problem Areas with Application Access to consider](#general-problem-areas-with-application-access-to-consider) and then read the Walkthrough: Steps to troubleshoot Microsoft Application access to get into the details.

## General Problem Areas with Application Access to consider

Following is a list of the general problem areas that you can drill into if you have an idea of where to start, but we recommend you read the walkthrough to get going quickly: Walkthrough: Steps to troubleshoot Microsoft Application access.

- [Problems with the user’s account](#problems-with-the-users-account)

- [Problems with groups](#problems-with-groups)

- [Problems with Conditional Access policies](#problems-with-conditional-access-policies)

- [Problems with application consent](#problems-with-application-consent)

## Steps to troubleshoot Microsoft Application access

Following are some common issues folks run into when their users can't sign in to a Microsoft application.

- General issues to check first

  - Make sure the user is signing in to the **correct URL** and not a local application URL.

  - Make sure the user’s account is **not locked out.**

  - Make sure the **user’s account exists** in Microsoft Entra ID. [Check if a user account exists in Microsoft Entra ID](#problems-with-the-users-account)

  - Make sure the user’s account is **enabled** for sign-ins. [Check a user’s account status](#problems-with-the-users-account)

  - Make sure the user’s **password is not expired or forgotten.** [Reset a user’s password](#reset-a-users-password) or [Enable self-service password reset](../authentication/tutorial-enable-sspr.md)

  - Make sure **Multi-Factor Authentication** isn't blocking user access. [Check a user’s multi-factor authentication status](#check-a-users-multi-factor-authentication-status) or [Check a user’s authentication contact info](#check-a-users-authentication-contact-info)

  - Make sure a **Conditional Access policy** or **Identity Protection** policy isn't blocking user access. [Check a specific Conditional Access policy](#problems-with-conditional-access-policies) or [Check a specific application’s Conditional Access policy](#check-a-specific-applications-conditional-access-policy) or [Disable a specific Conditional Access policy](#disable-a-specific-conditional-access-policy)

  - Make sure that a user’s **authentication contact info** is up to date to allow Multi-Factor Authentication or Conditional Access policies to be enforced. [Check a user’s multi-factor authentication status](#check-a-users-multi-factor-authentication-status) or [Check a user’s authentication contact info](#check-a-users-authentication-contact-info)

- For **Microsoft** **applications that require a license** (like Office365), here are some specific issues to check once you've ruled out the general issues above:

  - Ensure the user or has a **license assigned.** [Check a user’s assigned licenses](#check-a-users-assigned-licenses) or [Check a group’s assigned licenses](#check-a-groups-assigned-licenses)

  - If the license is **assigned to a** **static group**, ensure that the **user is a member** of that group. [Check a user’s group memberships](#check-a-users-group-memberships)

  - If the license is **assigned to a** **dynamic group**, ensure that the **dynamic group rule is set correctly**. [Check a dynamic group’s membership criteria](#check-a-dynamic-groups-membership-criteria)

  - If the license is **assigned to a** **dynamic group**, ensure that the dynamic group has **finished processing** its membership and that the **user is a member** (this can take some time). [Check a user’s group memberships](#check-a-users-group-memberships)

  - Once you make sure the license is assigned, make sure the license is **not expired**.

  - Make sure the license is **for the application** they're accessing.

- For **Microsoft** **applications that don’t require a license**, here are some other things to check:

  - If the application is requesting **user-level permissions** (for example “Access this user’s mailbox”), make sure that the user has signed in to the application and has performed a **user-level consent operation** to let the application access their data.

  - If the application is requesting **administrator-level permissions** (for example “Access all user’s mailboxes”), make sure that a Global Administrator has performed an **administrator-level consent operation on behalf of all users** in the organization.

## Problems with the user’s account

Application access can be blocked due to a problem with a user that is assigned to the application. Following are some ways you can troubleshoot and solve problems with users and their account settings:

- [Check if a user account exists in Microsoft Entra ID](#check-if-a-user-account-exists-in-azure-active-directory)

- [Check a user’s account status](#check-a-users-account-status)

- [Reset a user’s password](#reset-a-users-password)

- [Enable self-service password reset](#enable-self-service-password-reset)

- [Check a user’s multi-factor authentication status](#check-a-users-multi-factor-authentication-status)

- [Check a user’s authentication contact info](#check-a-users-authentication-contact-info)

- [Check a user’s group memberships](#check-a-users-group-memberships)

- [Check a user’s assigned licenses](#check-a-users-assigned-licenses)

- [Assign a user a license](#assign-a-user-a-license)

[!INCLUDE [portal updates](../includes/portal-update.md)]

<a name='check-if-a-user-account-exists-in-azure-active-directory'></a>

### Check if a user account exists in Microsoft Entra ID

To check if a user’s account is present, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.

1. **Search** for the user you're interested in and select the row with the user's details.

1. Check the properties of the user object to be sure that they look as you expect and no data is missing.

### Check a user’s account status

To check a user’s account status, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. **Search** for the user you're interested in and select the row with the user's details.
1. Select **Profile**.
1. Under **Settings** ensure that **Block sign in** is set to **No**.

### Reset a user’s password

To reset a user’s password, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. **Search** for the user you're interested in and select the row with the user's details.
1. Select the **Reset password** button at the top of the user pane.
1. Select the **Reset password** button on the **Reset password** pane that appears.
1. Copy the **temporary password** or **enter a new password** for the user.
1. Communicate this new password to the user, they be required to change this password during their next sign-in to Microsoft Entra ID.

### Enable self-service password reset

To enable self-service password reset, follow the deployment steps in the following section:

- [Enable users to reset their Microsoft Entra passwords](../authentication/tutorial-enable-sspr.md)

- [Enable users to reset or change their Active Directory on-premises passwords](../authentication/tutorial-enable-sspr.md)

### Check a user’s multi-factor authentication status

To check a user’s multi-factor authentication status, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.

1. Select the **Multi-Factor Authentication** button at the top of the pane.

1. Once the **Multi-Factor Authentication Administration portal** loads, ensure you are on the **Users** tab.

1. Find the user in the list of users by searching, filtering, or sorting.

1. Select the user from the list of users and **Enable**, **Disable**, or **Enforce** multi-factor authentication as desired.

   * **Note**: If a user is in an **Enforced** state, you may set them to **Disabled** temporarily to let them back into their account. Once they're back in, you can then change their state to **Enabled** again to require them to re-register their contact information during their next sign-in. Alternatively, you can follow the steps in the [Check a user’s authentication contact info](#check-a-users-authentication-contact-info) to verify or set this data for them.

### Check a user’s authentication contact info

To check a user’s authentication contact info used for Multi-factor authentication, Conditional Access, Identity Protection, and Password Reset, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. **Search** for the user you're interested in and select the row with the user's details.

1. Select **Profile**.

1. Scroll down to **Authentication contact info**.

1. **Review** the data registered for the user and update as needed.

### Check a user’s group memberships

To check a user’s group memberships, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. **Search** for the user you're interested in and select the row with the user's details.

1. Select **Groups** to see which groups the user is a member of.

### Check a user’s assigned licenses

To check a user’s assigned licenses, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. **Search** for the user you're interested in and select the row with the user's details.

1. Select **Licenses** to see which licenses the user currently has assigned.

### Assign a user a license

To assign a license to a user, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. **Search** for the user you're interested in and select the row with the user's details.

1. Select **Licenses** to see which licenses the user currently has assigned.

1. Select the **Assign** button.

1. Select **one or more products** from the list of available products.

1. **Optional** select the **assignment options** item to granularly assign products. Select **Ok** when this is completed.

1. Select the **Assign** button to assign these licenses to this user.

## Problems with groups

Application access can be blocked due to a problem with a group that is assigned to the application. Following are some ways you can troubleshoot and solve problems with groups and group memberships:

- [Check a group’s membership](#check-a-groups-membership)

- [Check a dynamic group’s membership criteria](#check-a-dynamic-groups-membership-criteria)

- [Check a group’s assigned licenses](#check-a-groups-assigned-licenses)

- [Reprocess a group’s licenses](#reprocess-a-groups-licenses)

- [Assign a group a license](#assign-a-group-a-license)

### Check a group’s membership

To check a group’s membership, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator) or [groups administrator](../roles/permissions-reference.md#groups-administrator).
1. Browse to **Identity** > **Groups** > **All Groups**.
1. Search for the group you're interested in and select the row with the group's details.
1. Select **Members** to review the list of users assigned to this group.

### Check a dynamic group’s membership criteria

To check a dynamic group’s membership criteria, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator) or [groups administrator](../roles/permissions-reference.md#groups-administrator).
1. Browse to **Identity** > **Groups** > **All Groups**.
1. Search for the group you're interested in and select the row with the group's details.

1. Select **Dynamic membership rules.**

1. Review the **simple** or **advanced** rule defined for this group and ensure that the user you want to be a member of this group meets these criteria.

### Check a group’s assigned licenses

To check a group’s assigned licenses, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator) or [groups administrator](../roles/permissions-reference.md#groups-administrator).
1. Browse to **Identity** > **Groups** > **All Groups**.
1. Search for the group you're interested in and select the row with the group's details.

1. Select **Licenses** to see which licenses the group currently has assigned.

### Reprocess a group’s licenses

To reprocess a group’s assigned licenses, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator) or [groups administrator](../roles/permissions-reference.md#groups-administrator).
1. Browse to **Identity** > **Groups** > **All Groups**.
1. Search for the group you're interested in and select the row with the group's details.

1. Select **Licenses** to see which licenses the group currently has assigned.

1. Select the **Reprocess** button to ensure that the licenses assigned to this group’s members are up-to-date. This may take a long time, depending on the size and complexity of the group.

   >[!NOTE]
   >To do this faster, consider temporarily assigning a license to the user directly. [Assign a user a license](#problems-with-application-consent).
   >
   >

### Assign a group a license

To assign a license to a group, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [user administrator](../roles/permissions-reference.md#user-administrator) or [groups administrator](../roles/permissions-reference.md#groups-administrator).
1. Browse to **Identity** > **Groups** > **All Groups**.
1. Search for the group you're interested in and select the row with the group's details.

1. Select **Licenses** to see which licenses the group currently has assigned.

1. Select the **Assign** button.

1. Select **one or more products** from the list of available products.

1. **Optional** select the **assignment options** item to granularly assign products. Select **Ok** when this is completed.

1. Select the **Assign** button to assign these licenses to this group. This may take a long time, depending on the size and complexity of the group.

    >[!NOTE]
    >To do this faster, consider temporarily assigning a license to the user directly. [Assign a user a license](#problems-with-application-consent).
    >
    >

## Problems with Conditional Access policies

### Check a specific Conditional Access policy

To check or validate a single Conditional Access policy:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [conditional access administrator](../roles/permissions-reference.md#conditional-access-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

1. Select the **Conditional Access** navigation item.

1. Select the policy you're interested in inspecting.

1. Review that there are no specific conditions, assignments, or other settings that may be blocking user access.

   >[!NOTE]
   >You may wish to temporarily disable this policy to ensure it is not affecting sign-ins. To do this, set the **Enable policy** toggle to **No** and click the **Save** button.
   >
   >

### Check a specific application’s Conditional Access policy

To check or validate a single application’s currently configured Conditional Access policy:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Search for the application you're interested in, or the user is attempting to sign in to by application display name or application ID.

1. Select the **Conditional Access** navigation item.

1. Select the policy you're interested in inspecting.

1. Review that there are no specific conditions, assignments, or other settings that may be blocking user access.

     >[!NOTE]
     >You may wish to temporarily disable this policy to ensure it is not affecting sign-ins. To do this, set the **Enable policy** toggle to **No** and click the **Save** button.
     >
     >

### Disable a specific Conditional Access policy

To check or validate a single Conditional Access policy:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [conditional access administrator](../roles/permissions-reference.md#conditional-access-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select the **Conditional Access** navigation item.
1. Select the policy you're interested in inspecting.
1. Disable the policy by setting the **Enable policy** toggle to **No** and select the **Save** button.

## Problems with application consent

Application access can be blocked because the proper permissions consent operation hasn't occurred. Following are some ways you can troubleshoot and solve application consent issues:

- [Perform a user-level consent operation](#perform-a-user-level-consent-operation)

- [Perform administrator-level consent operation for any application](#perform-administrator-level-consent-operation-for-any-application)

- [Perform administrator-level consent for a single-tenant application](#perform-administrator-level-consent-for-a-single-tenant-application)

- [Perform administrator-level consent for a multi-tenant application](#perform-administrator-level-consent-for-a-multi-tenant-application)

### Perform a user-level consent operation

- For any OpenID Connect-enabled application that requests permissions, navigating to the application’s sign-in screen performs a user level consent to the application for the signed-in user.

- If you wish to do this programmatically, see [Requesting individual user consent](../develop/permissions-consent-overview.md#requesting-individual-user-consent).

### Perform administrator-level consent operation for any application

- For **only applications developed using the V1 application model**, you can force this administrator level consent to occur by adding “**?prompt=admin\_consent**” to the end of an application’s sign-in URL.

- For **any application developed using the V2 application model**, you can enforce this administrator-level consent to occur by following the instructions under the **Request the permissions from a directory admin** section of [Using the admin consent endpoint](../develop/permissions-consent-overview.md#using-the-admin-consent-endpoint).

### Perform administrator-level consent for a single-tenant application

- For **single-tenant applications** that request permissions (like those you're developing or own in your organization), you can perform an **administrative-level consent** operation on behalf of all users by signing in as a Global Administrator and clicking on the **Grant permissions** button at the top of the **Application Registry -&gt; All Applications -&gt; Select an App -&gt; Required Permissions** pane.

- For **any application developed using the V1 or V2 application model**, you can enforce this administrator-level consent to occur by following the instructions under the **Request the permissions from a directory admin** section of [Using the admin consent endpoint](../develop/permissions-consent-overview.md#using-the-admin-consent-endpoint).

### Perform administrator-level consent for a multi-tenant application

- For **multi-tenant applications** that request permissions (like an application a third party, or Microsoft, develops), you can perform an **administrative-level consent** operation. Sign in as a Global Administrator and clicking on the **Grant permissions** button under the **Enterprise Applications -&gt; All Applications -&gt; Select an App -&gt; Permissions** pane (available soon).

- You can also enforce this administrator-level consent to occur by following the instructions under the **Request the permissions from a directory admin** section of [Using the admin consent endpoint](../develop/permissions-consent-overview.md#using-the-admin-consent-endpoint).

## Next steps

[Using the admin consent endpoint](../develop/permissions-consent-overview.md#using-the-admin-consent-endpoint)

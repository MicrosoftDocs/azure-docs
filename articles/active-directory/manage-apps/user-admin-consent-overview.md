---
title: Overview of user and admin consent
description: Learn about the fundamental concepts of user and admin consent in Microsoft Entra ID
services: active-directory
author: omondiatieno
manager: celesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: overview
ms.date: 04/04/2023
ms.author: jomondi
ms.reviewer: phsignor
ms.collection: M365-identity-device-management
ms.custom: enterprise-apps
---

# User and admin consent in Microsoft Entra ID

In this article, you’ll learn the foundational concepts and scenarios around user and admin consent in Microsoft Entra ID.

Consent is a process where users can grant permission for an application to access a protected resource. To indicate the level of access required, an application requests the API permissions it requires. For example, an application can request the permission to see a signed-in user's profile and read the contents of the user's mailbox.

Consent can be initiated in various ways. For example, users can be prompted for consent when they attempt to sign in to an application for the first time. Depending on the permissions they require, some applications might require an administrator to be the one who grants consent.

## User consent

A user can authorize an application to access some data at the protected resource, while acting as that user. The permissions that allow this type of access are called "delegated permissions."

User consent is usually initiated when a user signs in to an application. After the user has provided sign-in credentials, they're checked to determine whether consent has already been granted. If no previous record of user or admin consent for the required permissions exists, the user is directed to the consent prompt window to grant the application the requested permissions.

User consent by non-administrators is possible only in organizations where user consent is allowed for the application and for the set of permissions the application requires. If user consent is disabled, or if users aren't allowed to consent for the requested permissions, they won't be prompted for consent. If users are allowed to consent and they accept the requested permissions, the consent is recorded and they usually don't have to consent again on future sign-ins to the same application.

### User consent settings

Users are in control of their data. A Privileged Administrator can configure whether non-administrator users are allowed to grant user consent to an application. This setting can take into account aspects of the application and the application's publisher, and the permissions being requested.

As an administrator, you can choose whether user consent is allowed. If you choose to allow user consent, you can also choose what conditions must be met before an application can be consented to by a user.

By choosing which application consent policies apply for all users, you can set limits on when users are allowed to grant consent to applications and on when they’ll be required to request administrator review and approval. The Microsoft Entra admin center provides the following built-in options:

- *You can disable user consent*. Users can't grant permissions to applications. Users continue to sign in to applications they've previously consented to or to applications that administrators have granted consent to on their behalf, but they won't be allowed to consent to new permissions to applications on their own. Only users who have been granted a directory role that includes the permission to grant consent can consent to new applications.

- *Users can consent to applications from verified publishers or your organization, but only for permissions you select*. All users can consent only to applications that were published by a [verified publisher](../develop/publisher-verification-overview.md) and applications that are registered in your tenant. Users can consent only to the permissions that you've classified as *low impact*. You must [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.

- *Users can consent to all applications*. This option allows all users to consent to any permissions that don't require admin consent, for any application.

For most organizations, one of the built-in options will be appropriate. Some advanced customers might want more control over the conditions that govern when users are allowed to consent. These customers can [create custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy) and configure those policies to apply to user consent.

## Admin consent

During admin consent, a Privileged Administrator may grant an application access on behalf of other users (usually, on behalf of the entire organization). Also during admin consent, applications or services provide direct access to an API, which can be used by the application if there's no signed-in user. The specific role needed to grant admin consent differs based on the permissions requested, which are outlined [here.](grant-admin-consent.md#prerequisites)

When your organization purchases a license or subscription for a new application, you might proactively want to set up the application so that all users in the organization can use it. To avoid the need for user consent, an administrator can grant consent for the application on behalf of all users in the organization.

After an administrator grants admin consent on behalf of the organization, users aren't usually prompted for consent for that application. In certain cases, a user might be prompted for consent even after consent was granted by an administrator. An example might be if an application requests another permission that the administrator hasn't already granted.

Granting admin consent on behalf of an organization is a sensitive operation, potentially allowing the application's publisher access to significant portions of the organization's data, or the permission to do highly privileged operations. Examples of such operations might be role management, full access to all mailboxes or all sites, and full user impersonation. 

Before you grant tenant-wide admin consent, ensure that you trust the application and the application publisher, for the level of access you're granting. If you aren't confident that you understand who controls the application and why the application is requesting the permissions, do *not* grant consent.

For step-by-step guidance on whether to grant an application admin consent, see [Evaluating a request for tenant-wide admin consent](manage-consent-requests.md#evaluate-a-request-for-tenant-wide-admin-consent).

For step-by-step instructions for granting tenant-wide admin consent from the Microsoft Entra admin center, see [Grant tenant-wide admin consent to an application](grant-admin-consent.md).

### Grant consent on behalf of a specific user

Instead of granting consent for an entire organization, an admin can also use the [Microsoft Graph API](/graph/use-the-api) to grant consent to delegated permissions on behalf of a single user. For a detailed example that uses Microsoft Graph PowerShell, see [Grant consent on behalf of a single user by using PowerShell](manage-consent-requests.md).

### Limit user access to an application

User access to applications can still be limited, even when tenant-wide admin consent has been granted. Configure the application’s properties to require user assignment to limit user access to the application. For more information, see [Methods for assigning users and groups](assign-user-or-group-access-portal.md).

For a broader overview, including how to handle other complex scenarios, see [Use Microsoft Entra ID for application access management](what-is-access-management.md).

## Admin consent workflow

The admin consent workflow gives users a way to request admin consent for applications when they aren't allowed to consent themselves. When the admin consent workflow is enabled, users are presented with an "Approval required" window for requesting admin approval for access to the application.

After users submit the admin consent request, the admins who have been designated as reviewers receive a notification. The users are notified after a reviewer has acted on their request. For step-by-step instructions for configuring the admin consent workflow by using the Microsoft Entra admin center, see [configure the admin consent workflow](configure-admin-consent-workflow.md).

### How users request admin consent

After the admin consent workflow is enabled, users can request admin approval for an application that they're unauthorized to consent to. Here are the steps in the process:

1. A user attempts to sign in to the application.
1. An **Approval required** message appears. The user types a justification for needing access to the application and then selects "Request approval."
1. A **Request sent** message confirms that the request was submitted to the admin. If the user sends several requests, only the first request is submitted to the admin.
1. The user receives an email notification when the request is approved, denied, or blocked.

## Next steps

- [Configure user consent settings](configure-user-consent.md)
- [Configure the admin consent workflow](configure-admin-consent-workflow.md)

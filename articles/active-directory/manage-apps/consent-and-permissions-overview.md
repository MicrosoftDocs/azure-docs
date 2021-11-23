---
title: Overview of consent and permissions
titleSuffix: Azure AD
description: Learn about the fundamental concepts of consents and permissions in Azure AD
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: overview
ms.date: 11/16/2021
ms.author: davidmu
ms.reviewer: phsignor
ms.collection: M365-identity-device-management
---

# Consent and permissions overview

In this article, you’ll learn the foundational concepts and scenarios around consent and permissions in Azure Active Directory (Azure AD).

Consent is a process where a user can grant permission for an application to access a protected resource. To indicate the level of access required, an application requests the API permissions it requires. For example, an application can request the permission to see the signed-in user's profile and read the contents of the user's mailbox.

Consent can be initiated in various ways. For example, a user can be prompted for consent when they attempt to sign in to an application for the first time.  Depending on the permissions they require, some applications may require an administrator to be the one who grants consent.

## User consent

A user can authorize an application to access some data at the protected resource, while acting as that user. The permissions that allow this type of access are called "delegated permissions".

User consent is usually initiated while a user signs in to an application. After the user has provided their credentials, they are checked to determine whether consent has already been granted. If no previous record of user or admin consent for the required permissions exists, the user is directed to the consent prompt window to grant the application the requested permissions.

User consent by non-administrators is only possible in organizations where user consent is allowed for the application, and for the set of permissions the application requires. If user consent is disabled, or if the user isn't allowed to consent for the requested permissions, the user won't be prompted for consent. If the user is allowed to consent and the user accepts the permissions requested, consent is recorded and the user usually doesn't have to consent again on future sign-ins to the same application.

### User consent settings

Users are in control of their data. A privileged administrator can configure whether non-administrator users are allowed to grant user consent to an application. This setting can take into account aspects of the application and the application's publisher, and the permissions being requested.

As an administrator, you can choose whether user consent is allowed. If you choose to allow user consent, you can choose what conditions must be met before an application can be consented to by a user.

By choosing which application consent policies apply for all users, you can set limits on when users are allowed to grant consent to applications, and when they’ll be required to request administrator review and approval. Some built-in options are available in the Azure portal: 

- Disable user consent - Users can't grant permissions to applications. Users continue to sign into applications they had previously consented to, or applications that administrators have granted consent to on their behalf, but they'll not be allowed to consent to new permissions to applications on their own. Only users who have been granted a directory role that includes the permission to grant consent can consent to new applications.
- Users can consent to applications from verified publishers or your organization, but only for permissions you select - All users can only consent to applications that were published by a [verified publisher](/develop/publisher-verification-overview.md) and applications that are registered in your tenant. Users can only consent to the permissions you have classified as "low impact". You must [classify permissions](configure-permission-classifications.md) to select which permissions users are allowed to consent to.
- Users can consent to all applications - This option allows all users to consent to any permission that doesn't require admin consent, for any application.

For most organizations, one of the built-in options will be appropriate. Advanced customers who want more options over the conditions that govern when one is allowed to consent, can [create custom app consent policy](manage-app-consent-policies.md#create-a-custom-app-consent-policy), and configure those policies to apply for user consent.

## Admin consent

During admin consent, a privileged administrator may grant an application access on behalf of other users (usually, on behalf of the entire organization). During admin consent, applications or services direct access to an API, which can be used by the application if there's no signed-in user.

When your organization purchases a license or subscription for a new application, you may proactively want to set up the application so that all users in the organization can use it. To avoid the need for user consent, an administrator can grant consent for the application on behalf of all users in the organization.

Usually, once an administrator grants admin consent on behalf of the organization, users aren't prompted for consent for that application. In certain cases, a user may be prompted for consent even after consent was granted by an administrator. For example, if an application requests another permission that the administrator hasn't already granted.

Granting admin consent on behalf of the organization is a sensitive operation, potentially allowing the application's publisher access to significant portions of your organization's data, or the permission to do highly privileged operations. For example, role management, full access to all mailboxes or all sites, and full user impersonation.

Before granting tenant-wide admin consent, you must ensure you trust the application and the application publisher, for the level of access you're granting. If you aren't confident you understand who controls the application and why the application is requesting the permissions, don't grant consent.

See [Evaluating a request for tenant-wide admin consent](manage-consent-requests.md#evaluating-a-request-for-tenant-wide-admin-consent) for step-by-step guidance for evaluating whether you should grant an application admin consent.

See [Grant tenant-wide admin consent](grant-admin-consent.md) to an application for step-by-step instructions for granting tenant-wide admin consent from the Azure portal.

### Grant consent on behalf of a specific user

Instead of granting consent for the entire organization, an admin can also use the [Microsoft Graph API](/graph/use-the-api) to grant consent to delegated permissions on behalf of a single user. See [Grant consent on behalf of a single user using PowerShell](manage-consent-requests.md) for a detailed example using Microsoft Graph PowerShell.
### Limiting users' access to an application

Users' access to applications can still be limited even when tenant-wide admin consent has been granted. Configure the application’s properties to require user assignment to limit user access to the application. [See methods for assigning users and groups](assign-user-or-group-access-portal.md).

For a broader overview  including how to handle other complex scenarios, see using [Azure AD for application access management](what-is-access-management.md).

## Admin consent workflow

The admin consent workflow gives users a way to request admin consent for applications when they aren't allowed to consent themselves. When the admin consent workflow is enabled, a user is presented with an approval required dialog box to request admin approval for access to the application.

After the user submits the admin consent request, the admins who've been designated as reviewers receive notifications. The user is notified after a reviewer has acted on their request. See [configure admin consent workflow](configure-admin-consent-workflow.md) for step-by-step instructions for configuring the admin consent workflow using the Azure portal.

### How users request admin consent

After the admin consent workflow is enabled, users can request admin approval for an application they're unauthorized to consent to. The following steps describe the user's experience when they request approval:

- The user attempts to sign into the application.
- The Approval required message appears. The user types a justification for needing access to the application, and then selects Request approval.
- A Request sent message confirms that the request was submitted to the admin. If the user sends several requests, only the first request is submitted to the admin.
- The user receives an email notification when their request is approved, denied, or blocked.

## Next steps

- [Configure user consent settings](configure-user-consent.md)
- [Configure the admin consent workflow](configure-admin-consent-workflow.md)

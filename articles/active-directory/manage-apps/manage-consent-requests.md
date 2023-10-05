---
title: Manage consent to applications and evaluate consent requests
description: Learn how to manage consent requests when user consent is restricted, and how to evaluate a request for tenant-wide admin consent to an application in Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 06/14/2023
ms.author: jomondi
ms.reviewer: phsignor
ms.custom: enterprise-apps
---

# Manage consent to applications and evaluate consent requests

Microsoft recommends that you [restrict user consent](../../active-directory/manage-apps/configure-user-consent.md) to allow users to consent only for apps from verified publishers, and only for permissions that you select. For apps that don't meet these criteria, the decision-making process is centralized with your organization's security and identity administrator team.

After you've disabled or restricted user consent, you have several important steps to take to help keep your organization secure as you continue to allow business-critical applications to be used. These steps are crucial to minimize impact on your organization's support team and IT administrators, and to help prevent the use of unmanaged accounts in third-party applications.

This article provides guidance on managing consent to applications and evaluating consent requests in Microsoft's recommendations, including restricting user consent to verified publishers and selected permissions. It covers concepts such as process changes, education for administrators, auditing and monitoring, and managing tenant-wide admin consent.

## Process changes and education

 - Consider enabling the [admin consent workflow](configure-admin-consent-workflow.md) to allow users to request administrator approval directly from the consent screen.

 - Ensure that all administrators understand the:
   - [Permissions and consent framework](../develop/permissions-consent-overview.md)
   - How the [consent consent experience and prompts](../develop/application-consent-experience.md) work.
   - How to [evaluate a request for tenant-wide admin consent](#evaluate-a-request-for-tenant-wide-admin-consent).

 - Review your organization's existing processes for users to request administrator approval for an application, and update them if necessary. If processes are changed:
    - Update the relevant documentation, monitoring, automation, and so on.
    - Communicate process changes to all affected users, developers, support teams, and IT administrators.

## Auditing and monitoring

- [Audit apps and granted permissions](../../security/fundamentals/steps-secure-identity.md#audit-apps-and-consented-permissions) in your organization to ensure that no unwarranted or suspicious applications have previously been granted access to data.

- Review the [Detect and Remediate Illicit Consent Grants in Office 365](/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants) article for more best practices and safeguards against suspicious applications that request OAuth consent.

- If your organization has the appropriate license:

    - Use other [OAuth application auditing features in Microsoft Defender for Cloud Apps](/cloud-app-security/investigate-risky-oauth).
    - Use [Azure Monitor Workbooks](../reports-monitoring/howto-use-azure-monitor-workbooks.md)  to monitor permissions and consent-related activity. The *Consent Insights* workbook provides a view of apps by number of failed consent requests. This information can help you prioritize applications for administrators to review and decide whether to grant them admin consent.

### Other considerations for reducing friction

To minimize impact on trusted, business-critical applications that are already in use, consider proactively granting administrator consent to applications that have a high number of user consent grants:

- Take an inventory of the apps already added to your organization with high usage, based on sign-in logs or consent grant activity. You can use a [PowerShell script](https://gist.github.com/psignoret/41793f8c6211d2df5051d77ca3728c09) to quickly and easily discover applications with a large number of user consent grants.

- Evaluate the top applications to grant admin consent.

   > [!IMPORTANT]
   > Carefully evaluate an application before granting tenant-wide admin consent, even if many users in the organization have already consented for themselves.
- For each approved application, grant tenant-wide admin consent and consider restricting user access by [requiring user assignment](assign-user-or-group-access-portal.md).

## Evaluate a request for tenant-wide admin consent

Granting tenant-wide admin consent is a sensitive operation.  Permissions are granted on behalf of the entire organization, and they can include permissions to attempt highly privileged operations. Examples of such operations are role management, full access to all mailboxes or all sites, and full user impersonation.

Before you grant tenant-wide admin consent, it's important to ensure that you trust the application, and the application publisher for the level of access you're granting. If you aren't confident that you understand who controls the application and why the application is requesting the permissions, do *not* grant consent.

When you're evaluating a request to grant admin consent, here are some recommendations to consider:

- Understand the [permissions and consent framework](../develop/permissions-consent-overview.md) in the Microsoft identity platform.

- Understand the difference between [delegated permissions and application permissions](../develop/permissions-consent-overview.md#permission-types).

   Application permissions allow the application to access the data for the entire organization, without any user interaction. Delegated permissions allow the application to act on behalf of a user who was signed into the application at some point.

- Understand the permissions that are being requested.

   The permissions requested by the application are listed in the [consent prompt](../develop/application-consent-experience.md). Expanding the permission title displays the permission’s description. The description for application permissions generally ends in "without a signed-in user." The description for delegated permissions generally end with "on behalf of the signed-in user." Permissions for the Microsoft Graph API are described in [Microsoft Graph Permissions Reference](/graph/permissions-reference). Refer to the documentation for other APIs to understand the permissions they expose.

   If you don't understand a permission that's being requested, do *not* grant consent.

- Understand which application is requesting permissions and who published the application.

   Be wary of malicious applications that try to look like other applications.

   If you doubt the legitimacy of an application or its publisher, do *not* grant consent. Instead, seek confirmation (for example, directly from the application publisher).

- Ensure that the requested permissions are aligned with the features you expect from the application.

   For example, an application that offers SharePoint site management might require delegated access to read all site collections, but it wouldn't necessarily need full access to all mailboxes, or full impersonation privileges in the directory.

   If you suspect that the application is requesting more permissions than it needs, do *not* grant consent. Contact the application publisher to obtain more details.

## Grant tenant-wide admin consent

For step-by-step instructions for granting tenant-wide admin consent from the Microsoft Entra admin center, see [Grant tenant-wide admin consent to an application](grant-admin-consent.md).

## Revoke tenant wide admin consent

To revoke tenant-wide admin consent, you can review and revoke the permissions previously granted to the application. For more information, see [review permissions granted to applications](manage-application-permissions.md). You can also remove user’s access to the application by [disabling user sign-in to application](disable-user-sign-in-portal.md) or by [hiding the application](hide-application-from-user-portal.md) so that it doesn’t appear in the My apps portal.

### Grant consent on behalf of a specific user

Instead of granting consent for the entire organization, an administrator can also use the [Microsoft Graph API](/graph/use-the-api) to grant consent to delegated permissions on behalf of a single user. For a detailed example that uses Microsoft Graph PowerShell, see [Grant consent on behalf of a single user by using PowerShell](grant-consent-single-user.md).

## Limit user access to applications

User access to applications can still be limited even when tenant-wide admin consent has been granted. To limit user access, require user assignment to an application. For more information, see [Methods for assigning users and groups](./assign-user-or-group-access-portal.md). Administrators can also limit user access to applications by disabling all future user consent operations to any application.

For a broader overview, including how to handle more complex scenarios, see [Use Microsoft Entra ID for application access management](what-is-access-management.md).

## Next steps

- [Configure the admin consent workflow](configure-admin-consent-workflow.md)
- [Configure how users consent to applications](configure-user-consent.md)

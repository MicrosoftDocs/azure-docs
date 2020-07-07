---
title: Managing consent to applications and evaluating consent requests - Azure AD
description: Learn how to manage consent requests when user consent is disabled or restricted, and how to evaluate a request for tenant-wide admin consent to an application.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 12/27/2019
ms.author: kenwith
ms.reviewer: phsignor
ms.collection: M365-identity-device-management
---

# Managing consent to applications and evaluating consent requests

Microsoft [recommends](https://docs.microsoft.com/azure/security/fundamentals/steps-secure-identity#restrict-user-consent-operations) disabling end-user consent to applications. This will centralize the decision-making process with your organization's security and identity administrator team.

After end-user consent is disabled or restricted, there are several important considerations to ensure your organization stays secure while still allowing business critical applications to be used. These steps are crucial to minimize impact on your organization's support team and IT administrators, while preventing the use of unmanaged accounts in third-party applications.

## Process changes and education

 1. Consider enabling the [admin consent workflow (preview)](configure-admin-consent-workflow.md) to allow users to request administrator approval directly from the consent screen.

 2. Ensure all administrators understand the [permissions and consent framework](../develop/consent-framework.md), how the [consent prompt](../develop/application-consent-experience.md) works, and how to [evaluate a request for tenant-wide admin consent](#evaluating-a-request-for-tenant-wide-admin-consent).
 3. Review your organization's existing processes for users to request administrator approval for an application, and make updates if necessary. If processes are changed:
    * Update the relevant documentation, monitoring, automation, and so on.
    * Communicate process changes to all affected users, developers, support teams, and IT administrators.

## Auditing and monitoring

1. [Audit apps and granted permissions](https://docs.microsoft.com/azure/security/fundamentals/steps-secure-identity#audit-apps-and-consented-permissions) in your organization to ensure no unwarranted or suspicious applications have previously been granted access to data.

2. Review [Detect and Remediate Illicit Consent Grants in Office 365](https://docs.microsoft.com/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants) for additional best practices and safeguards against suspicious applications requesting OAuth consent.

3. If your organization has the appropriate license:

    * Use additional [OAuth application auditing features in Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/investigate-risky-oauth).
    * Use [Azure Monitor Workbooks to monitor permissions and consent](../reports-monitoring/howto-use-azure-monitor-workbooks.md) related activity. The *Consent Insights* workbook provides a view of apps by number of failed consent requests. This can be helpful to prioritize applications for administrators to review and decide whether to grant them admin consent.

### Additional considerations for reducing friction

To minimize impact on trusted, business-critical applications which are already in use, consider proactively granting administrator consent to applications that have a high number of user consent grants:

1. Take an inventory of the apps already added to your organization with high usage, based on sign-in logs or consent grant activity. A PowerShell [script](https://gist.github.com/psignoret/41793f8c6211d2df5051d77ca3728c09) can be used to quickly and easily discover applications with a large number of user consent grants.

2. Evaluate the top applications that have not yet been granted admin consent.

   > [!IMPORTANT]
   > Carefully evaluate an application before granting tenant-wide admin consent, even if many users in the organization have already consented for themselves.

3. For each application that is approved, grant tenant-wide admin consent using one of the methods documented below.

4. For each approved application, consider [restricting user access](configure-user-consent.md).

## Evaluating a request for tenant-wide admin consent

Granting tenant-wide admin consent is a sensitive operation.  Permissions will be granted on behalf of the entire organization, and can include permissions to attempt highly privileged operations. For example, role management,  full access to all mailboxes or all sites, and full user impersonation.

Before granting tenant-wide admin consent, you must ensure you trust the application and the application publisher, for the level of access you're granting. If you aren't confident you understand who controls the application and why the application is requesting the permissions, *do not grant consent*.

The following list provides some recommendations to consider when evaluating a request to grant admin consent.

* **Understand the [permissions and consent framework](../develop/consent-framework.md) in the Microsoft identity platform.**

* **Understand the difference between [delegated permissions and application permissions](../develop/v2-permissions-and-consent.md#permission-types).**

   Application permissions allow the application to access the data for the entire organization, without any user interaction. Delegated permissions allow the application to act on behalf of a user who at some point was signed into the application.

* **Understand the permissions being requested.**

   The permissions requested by the application are listed in the [consent prompt](../develop/application-consent-experience.md). Expanding the permission title will display the permission’s description. The description for application permissions will generally end in "without a signed-in user". The description for delegated permissions will generally end with "on behalf of the signed-in user." Permissions for the Microsoft Graph API are described in [Microsoft Graph Permissions Reference]- refer to the documentation for other APIs to understand the permissions they expose.

   If you do not understand a permission being requested, *do not grant consent*.

* **Understand which application is requesting permissions and who published the application.**

   Be wary of malicious applications trying to look like other applications.

   If you doubt the legitimacy of an application or its publisher, *do not grant consent*. Instead, seek additional confirmation (for example, directly from the application publisher).

* **Ensure the permissions requested are aligned with the features you expect from the application.**

   For example, an application offering SharePoint site management may require delegated access to read all site collections, but wouldn't necessarily need full access to all mailboxes, or full impersonation privileges in the directory.

   If you suspect the application is requesting more permissions than it needs, *do not grant consent*. Contact the application publisher to obtain more details.

## Granting consent as an administrator

### Granting tenant-wide admin consent

See [Grant tenant-wide admin consent to an application](grant-admin-consent.md) for step-by-step instructions for granting tenant-wide admin consent from the Azure portal, using Azure AD PowerShell, or from the consent prompt itself.

### Granting consent on behalf of a specific user

Instead of granting consent for the entire organization, an administrator can also use the [Microsft Graph API](https://docs.microsoft.com/graph/use-the-api) to grant consent to delegated permissions on behalf of a single user. For more information, see [Get access on behalf of a user](https://docs.microsoft.com/graph/auth-v2-user).

## Limiting user access to applications

Users' access to applications can still be limited even when tenant-wide admin consent has been granted. For more information on how to require user assignment to an application, see [methods for assigning users and groups](methods-for-assigning-users-and-groups.md).

For more a broader overview including how to handle additional complex scenarios, see [using Azure AD for application access management](what-is-access-management.md).

## Next steps

[Five steps to securing your identity infrastructure](https://docs.microsoft.com/azure/security/fundamentals/steps-secure-identity#before-you-begin-protect-privileged-accounts-with-mfa)

[Configure the admin consent workflow](configure-admin-consent-workflow.md)

[Configure how end-users consent to applications](configure-user-consent.md)

[Permissions and consent in the Microsoft identity platform](../develop/active-directory-v2-scopes.md)

[Azure AD on StackOverflow](https://stackoverflow.com/questions/tagged/azure-active-directory)
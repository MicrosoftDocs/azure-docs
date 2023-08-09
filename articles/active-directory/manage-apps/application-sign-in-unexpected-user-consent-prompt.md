---
title: Unexpected consent prompt when signing in to an application
description: How to troubleshoot when a user sees a consent prompt for an application you've integrated with Azure AD that you didn't expect
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/07/2022
ms.author: jomondi
ms.reviewer: phsignor, yuhko
ms.collection: M365-identity-device-management
ms.custom: enterprise-apps
---

# Unexpected consent prompt when signing in to an application

Many applications that integrate with Azure Active Directory require permissions to various resources in order to run. When these resources are also integrated with Azure Active Directory, the permission to access them is requested using the Azure AD consent framework. These requests result in a consent prompt being shown the first time an application is used, which is often a one-time operation.

In certain scenarios, additional consent prompts can appear when a user attempts to sign-in. In this article, we'll diagnose the reason for the unexpected consent prompts showing, and how to troubleshoot.

> [!VIDEO https://www.youtube.com/embed/a1AjdvNDda4]

## Scenarios in which users see consent prompts

Further prompts can be expected in various scenarios:

* The application has been configured to require assignment. Individual user consent isn't currently supported for apps that require assignment; thus the permissions must be granted by an admin for the whole directory. If you configure an application to require assignment, be sure to also grant tenant-wide admin consent so that assigned user can sign-in.

* The set of permissions required by the application has changed by the developer and needs to be granted again.

* The user who originally consented to the application wasn't an administrator, and now a different (non-admin) user is using the application for the first time.

* The user who originally consented to the application was an administrator, but they didn't consent on-behalf of the entire organization.

* The application is using [incremental and dynamic consent](../develop/permissions-consent-overview.md#consent) to request further permissions after consent was initially granted. Incremental and dynamic consent is often used when optional features of an application require permissions beyond those required for baseline functionality.

* Consent was revoked after being granted initially.

* The developer has configured the application to require a consent prompt every time it's used (note: this behavior isn't best practice).

   > [!NOTE]
   > Following Microsoft's recommendations and best practices, many organizations have disabled or limited users' permission to grant consent to apps. If an application forces users to grant consent every time they sign in, most users will be blocked from using these applications even if an administrator grants tenant-wide admin consent. If you encounter an application which is requiring user consent even after admin consent has been granted, check with the app publisher to see if they have a setting or option to stop forcing user consent on every sign in.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Troubleshooting steps

### Compare permissions requested and granted for the applications

To ensure the permissions granted for the application are up-to-date, you can compare the permissions that are being requested by the application with the permissions already granted in the tenant. 

1. Sign in to the [Azure portal](https://portal.azure.com) with an administrator account.
2. Navigate to **Enterprise applications**.
3. Select the application in question from the list.
4. Under Security in the left-hand navigation, choose **Permissions**
5. View the list of already granted permissions from the table on the Permissions page
6. To view the requested permissions, select the **Grant admin consent** button. (NOTE: This will open a consent prompt listing all of the requested permissions. Don't click accept on the consent prompt unless you're sure you want to grant tenant-wide admin consent.)
7. Within the consent prompt, expand the listed permissions and compare with the table on the permissions page. If any are present in the consent prompt but not the permissions page, that permission has yet to be consented to. Unconsented permissions may be the cause for unexpected consent prompts showing for the application.

### View user assignment settings

If the application requires assignment, individual users can't consent for themselves. To check if assignment is required for the application, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com) with an administrator account.
2. Navigate to **Enterprise applications**.
3. Select the application in question from the list.
4. Under Manage in the left-hand navigation, choose **Properties**.
5. Check to see if **Assignment required?** is set to **Yes**.
6. If set to yes, then an admin must consent to the permissions on behalf of the entire organization. 

### Review tenant-wide user consent settings

Determining whether an individual user can consent to an application can be configured by every organization, and may differ from directory to directory. Even if every permission doesn't require admin consent by default, your organization may have disabled user consent entirely, preventing an individual user to consent for themselves for an application. To view your organization's user consent settings, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com) with an administrator account.
2. Navigate to **Enterprise applications**.
3. Under Security in the left-hand navigation, choose **Consent and permissions**.
4. View the user consent settings. If set to *Do not allow user consent*, users will never be able to consent on behalf of themselves for an application.

## Next steps

* [Apps, permissions, and consent in Azure Active Directory (v1.0 endpoint)](../develop/quickstart-register-app.md)

* [Scopes, permissions, and consent in the Azure Active Directory (v2.0 endpoint)](../develop/v2-permissions-and-consent.md)

* [Unexpected error when performing consent to an application](application-sign-in-unexpected-user-consent-error.md)

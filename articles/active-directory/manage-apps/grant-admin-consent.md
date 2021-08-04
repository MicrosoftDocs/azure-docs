---
title: Grant tenant-wide admin consent to an application - Azure AD
description: Learn how to grant tenant-wide consent to an application so that end-users are not prompted for consent when signing in to an application.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 11/04/2019
ms.author: davidmu
ms.reviewer: ergreenl
ms.collection: M365-identity-device-management
---

# Grant tenant-wide admin consent to an application

  Learn how to grant tenant-wide admin consent to an application. This article gives the different ways to achieve this.

For more information on consenting to applications, see [Azure Active Directory consent framework](../develop/consent-framework.md).

## Prerequisites

Granting tenant-wide admin consent requires you to sign in as a user that is authorized to consent on behalf of the organization. This includes [Global Administrator](../roles/permissions-reference.md#global-administrator) and [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator). For applications which do not require application permissions for Microsoft Graph or Azure AD Graph this also includes [Application Administrator](../roles/permissions-reference.md#application-administrator) and [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). A user can also be authorized to grant tenant-wide consent if they are assigned a [custom directory role](../roles/custom-create.md) that includes the [permission to grant permissions to applications](../roles/custom-consent-permissions.md).

> [!WARNING]
> Granting tenant-wide admin consent to an application will grant the app and the app's publisher access to your organization's data. Carefully review the permissions the application is requesting before granting consent.

> [!IMPORTANT]
> When an application has been granted tenant-wide admin consent, all users will be able to sign in to the app unless it has been configured to require user assignment. To restrict which users can sign in to an application, require user assignment and then assign users or groups to the application. For more information, see [Methods for assigning users and groups](./assign-user-or-group-access-portal.md).

## Grant admin consent from the Azure portal

### Grant admin consent in Enterprise apps

You can grant tenant-wide admin consent through *Enterprise applications* if the application has already been provisioned in your tenant. For example, an app could be provisioned in your tenant if at least one user has already consented to the application. For more information, see [How and why applications are added to Azure Active Directory](../develop/active-directory-how-applications-are-added.md).

To grant tenant-wide admin consent to an app listed in **Enterprise applications**:

1. Sign in to the [Azure portal](https://portal.azure.com) with a role that allows granting admin consent (see [Prerequisites](#prerequisites)).
2. Select **Azure Active Directory** then **Enterprise applications**.
3. Select the application to which you want to grant tenant-wide admin consent.
4. Select **Permissions** and then click **Grant admin consent**.
5. Carefully review the permissions the application requires.
6. If you agree with the permissions the application requires, grant consent. If not, click **Cancel** or close the window.

> [!WARNING]
> Granting tenant-wide admin consent through **Enterprise apps** will revoke any permissions which had previously been granted tenant-wide. Permissions which have previously been granted by users on their own behalf will not be affected.

### Grant admin consent in App registrations

For applications your organization has developed, or which are registered directly in your Azure AD tenant, you can also grant tenant-wide admin consent from **App registrations** in the Azure portal.

To grant tenant-wide admin consent from **App registrations**:

1. Sign in to the [Azure portal](https://portal.azure.com) with a role that allows granting admin consent (see [Prerequisites](#prerequisites)).
2. Select **Azure Active Directory** then **App registrations**.
3. Select the application to which you want to grant tenant-wide admin consent.
4. Select **API permissions** and then click **Grant admin consent**.
5. Carefully review the permissions the application requires.
6. If you agree with the permissions the application requires, grant consent. If not, click **Cancel** or close the window.

> [!WARNING]
> Granting tenant-wide admin consent through **App registrations** will revoke any permissions which had previously been granted tenant-wide. Permissions which have previously been granted by users on their own behalf will not be affected.

## Construct the URL for granting tenant-wide admin consent

When granting tenant-wide admin consent using either method described above, a window opens from the Azure portal to prompt for tenant-wide admin consent. If you know the client ID (also known as the application ID) of the application, you can build the same URL to grant tenant-wide admin consent.

The tenant-wide admin consent URL follows the following format:

```http
https://login.microsoftonline.com/{tenant-id}/adminconsent?client_id={client-id}
```

where:

* `{client-id}` is the application's client ID (also known as app ID).
* `{tenant-id}` is your organization's tenant ID or any verified domain name.

As always, carefully review the permissions an application requests before granting consent.

> [!WARNING]
> Granting tenant-wide admin consent through this URL will revoke any permissions which had previously been granted tenant-wide. Permissions which have previously been granted by users on their own behalf will not be affected.

## Next steps

[Configure how end-users consent to applications](configure-user-consent.md)

[Configure the admin consent workflow](configure-admin-consent-workflow.md)

[Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md)

[Azure AD on Microsoft Q&A](/answers/topics/azure-active-directory.html)

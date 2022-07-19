---
title: Configure an app's publisher domain
description: Learn how to configure an application's publisher domain to let users know where their information is being sent.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/23/2021
ms.author: ryanwi
ms.reviewer: lenalepa, sureshja, zachowd
ms.custom: contperf-fy21q4, aaddev
---

# Configure an application's publisher domain

An application’s publisher domain informs the users where their information is being sent and acts as an input/prerequisite for [publisher verification](publisher-verification-overview.md). Depending on whether an app is a [multitenant app](/azure/architecture/guide/multitenant/overview), when it was registered, and it's verified publisher status, either the publisher domain or the verified publisher status is displayed to the user on the [application's consent prompt](application-consent-experience.md). Multitenant applications are applications that support accounts outside a single organizational directory. For example, a multitenant app might support all Azure Active Directory (Azure AD) work or school accounts, or it might support both Azure AD work or school accounts and Microsoft accounts.

## New applications

When you register a new app, the publisher domain of your app might be set to a default value. The value depends on where the app is registered. The publisher domain value depends especially on whether the app is registered in a tenant and whether the tenant has tenant-verified domains.

If the app has tenant-verified domains, the app’s publisher domain defaults to the primary verified domain of the tenant. If the app doesn't have tenant-verified domains and the app isn't registered in a tenant, the app’s publisher domain is set to null.

The following table summarizes the default behavior of the publisher domain value:

| Tenant-verified domains | Default value of publisher domain |
|-------------------------|----------------------------|
| null | null |
| `*.onmicrosoft.com` | `*.onmicrosoft.com` |
| - `*.onmicrosoft.com`<br/>- `domain1.com`<br/>- `domain2.com` (primary) | `domain2.com` |

1. If your multitenant app was registered *between May 21, 2019, and November 30, 2020*:  
   - If the  application's publisher domain isn't set, or if it's set to a domain that ends in `.onmicrosoft.com`, the app's consent prompt shows **unverified** for the publisher domain value.
   - If the application has a verified app domain, the consent prompt show the verified domain.
   - If the application is publisher-verified, the publisher domain shows a [blue "verified" badge](publisher-verification-overview.md) that indicates the status.
2. If your multitenant was registered *after November 30, 2020*:
   - If the application isn't publisher-verified, the app shows **unverified** at the consent prompt. No publisher domain-related information appears.
   - If the application is publisher-verified, it will show a [blue "verified" badge](publisher-verification-overview.md) indicating the same 

## Applications created before May 21, 2019

If your app was registered *before May 21, 2019*, your application's consent prompt shows **unverified**, even if you haven't set a publisher domain. We recommend that you set the publisher domain value so that users can see this information on your app's consent prompt.

## Set a publisher domain in the Azure portal

To set a publisher domain for your app by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the portal global menu to select the tenant where the app is registered.
1. In Azure Active Directory, go to [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908). Search for and select the app you want to configure.
1. In **Overview**, in the resource menu under **Manage**, select **Branding**.
1. In **Publisher domain**, select one of the following options:

   - If you haven't already configured a domain, select **Configure a domain**.
   - If you have already configured a domain, select **Update domain**.

If your app is registered in a tenant, you can select from two options: **Select a verified domain** and **Verify a new domain**.

If your domain isn't registered in the tenant, only the option to verify a new domain for your application appears.

### Verify a new domain for your app

To verify a new publisher domain for your app:

1. Create a file named *microsoft-identity-association.json*. Copy the following JSON and paste it in the *microsoft-identity-association.json* file:

   ```json
   {
      "associatedApplications": [
         {
            "applicationId": "<your-app-id>"
         },
         {
            "applicationId": "<your-other-app-id>"
         }
      ]
    }
   ```

1. Replace `<your-app-id>` with the application (client) ID for your app.
1. Host the file at `https://<your-domain>.com/.well-known/microsoft-identity-association.json`. Replace `<your-domain>` with the name of the verified domain.
1. Select **Verify and save domain**.

You're not required to maintain the resources that are used for verification after you verify a domain. When the verification is finished, you can remove the hosted file.

### Select a verified domain

If your tenant has verified domains, in the **Select a verified domain** dropdown, select one of the domains.

> [!NOTE]
> The expected `Content-Type` header that should return is `application/json`. If you use any other header, like `application/json; charset=utf-8`, you might see this error message:
>
> `Verification of publisher domain failed. Error getting JSON file from https:///.well-known/microsoft-identity-association. The server returned an unexpected content type header value.`
>

## Implications of the app consent prompt

Configuring the publisher domain affects what users see in the app consent prompt. To fully understand the components of the consent prompt, see [Understand the application consent experiences](application-consent-experience.md).

The following table describes the behavior for applications that were created before May 21, 2019:

:::image type="content" source="./media/howto-configure-publisher-domain/old-app-behavior-table.png" alt-text="Table that shows consent prompt behavior for apps created before May 21, 2019.":::

The behavior for applications created between May 21, 2019, and November 30, 2020, depends on the publisher domain and the type of application. The following table describes what is shown on the consent prompt with the different combinations of configurations.

:::image type="content" source="./media/howto-configure-publisher-domain/new-app-behavior-table.png" alt-text="able that shows consent prompt behavior for apps created between May 21, 2019 and Nov 30, 2020.":::

For multitenant applications created after November 30, 2020, only publisher verification status is surfaced in the consent prompt. The following table describes what is shown on the consent prompt depending on whether an app is verified or not. The consent prompt for single-tenant applications remain the same:

:::image type="content" source="./media/howto-configure-publisher-domain/new-app-behavior-publisher-verification-table.png" alt-text="Table that shows consent prompt behavior for apps created after Nov 30, 2020.":::

## Implications on redirect URIs

Applications that sign in users with any work or school account or with a Microsoft account (multitenant) are subject to few restrictions when specifying redirect URIs.

### Single-root domain restriction

When the publisher domain value for multi-tenant apps is set to null, apps are restricted to share a single root domain for the redirect URIs. For example, the following combination of values isn't allowed because the root domain `contoso.com` doesn't match `fabrikam.com`.

```
"https://contoso.com",
"https://fabrikam.com",
```

### Subdomain restrictions

Subdomains are allowed, but you must explicitly register the root domain. For example, while the following URIs share a single root domain, the combination isn't allowed.

```
"https://app1.contoso.com",
"https://app2.contoso.com",
```

However, if the developer explicitly adds the root domain, the combination is allowed.

```
"https://contoso.com",
"https://app1.contoso.com",
"https://app2.contoso.com",
```

### Exceptions

The following cases aren't subject to the single-root domain restriction:

- Single-tenant apps or apps that target accounts in a single directory.
- Use of localhost as redirect URIs.
- Redirect URIs with custom schemes (non-HTTP or HTTPS).

## Configure publisher domain programmatically

Currently, there is no REST API or PowerShell support to configure publisher domain programmatically.

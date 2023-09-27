---
title: Configure an app's publisher domain
description: Learn how to configure an app's publisher domain to let users know where their information is being sent.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 04/27/2023
ms.author: owenrichards
ms.reviewer: xurobert
ms.custom: contperf-fy21q4, aaddev
---

# Configure an app's publisher domain

An app’s publisher domain informs users where their information is being sent. The publisher domain also acts as an input or prerequisite for [publisher verification](publisher-verification-overview.md). Depending on when the app was registered and the status of the Publisher Verification, it would be displayed directly to the user on the [application's consent prompt](application-consent-experience.md). An application’s publisher domain is displayed to users (depending on the state of Publisher Verification) on the consent UX to let users know where their information is being sent for trustworthiness.

In an app's consent prompt, either the publisher domain or the publisher verification status appears. Which information is shown depends on whether the app is a [multitenant app](/azure/architecture/guide/multitenant/overview), when the app was registered, and the app's publisher verification status.

## Understand multitenant apps

A *multitenant app* is an app that supports user accounts that are outside a single organizational directory. For example, a multitenant app might support all Microsoft Entra work or school accounts, or it might support both Microsoft Entra work or school accounts and personal Microsoft accounts.

## Understand default publisher domain values

Several factors determine the default value that's set for an app's publisher domain:

- Whether the app is registered in a tenant.
- Whether a tenant has tenant-verified domains.
- The app registration date.

### Tenant registration and tenant-verified domains

When you register a new app, the publisher domain of your app might be set to a default value. The default value depends on where the app is registered. The publisher domain value depends especially on whether the app is registered in a tenant and whether the tenant has tenant-verified domains.

If the app has tenant-verified domains, the app’s publisher domain defaults to the primary verified domain of the tenant. If the app doesn't have tenant-verified domains and the app isn't registered in a tenant, the app’s default publisher domain is null.

The following table uses example scenarios to describe the default values for publisher domain:

| Tenant-verified domain | Default value of publisher domain |
|-------------------------|----------------------------|
| null | null |
| `*.onmicrosoft.com` | `*.onmicrosoft.com` |
| - `*.onmicrosoft.com`<br/>- `domain1.com`<br/>- `domain2.com` (primary) | `domain2.com` |

### App registration date

An app's registration date also determines the app's default publisher domain values.

If your multitenant app was registered *between May 21, 2019, and November 30, 2020*:  

- If the  app's publisher domain isn't set, or if it's set to a domain that ends in `.onmicrosoft.com`, the app's consent prompt shows *unverified* for the publisher domain value.
- If the app has a verified app domain, the consent prompt shows the verified domain.
- If the app is publisher verified, the publisher domain shows a [blue *verified* badge](publisher-verification-overview.md) that indicates the status.

If your multitenant was registered *after November 30, 2020*:

- If the app isn't publisher verified, the consent prompt for the app shows *unverified*. No publisher domain-related information appears.
- If the app is publisher verified, the app consent prompt shows a [blue *verified* badge](publisher-verification-overview.md).

#### Apps created before May 21, 2019

If your app was registered *before May 21, 2019*, your app's consent prompt shows *unverified*, even if you haven't set a publisher domain. We recommend that you set the publisher domain value so that users can see this information in your app's consent prompt.

## Set a publisher domain in the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To set a publisher domain for your app by using the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the portal global menu to select the tenant where the app is registered.
1. In Azure Microsoft Entra admin center browse to **Identity** > **Applications** > **App registrations**. 
1. Search for and select the app you want to configure.
1. In **Overview**, in the resource menu under **Manage**, select **Branding**.
1. In **Publisher domain**, select one of the following options:

   - If you haven't already configured a domain, select **Configure a domain**.
   - If you have configured a domain, select **Update domain**.

1. If your app is registered in a tenant, next, select from two options:

   - **Select a verified domain**
   - **Verify a new domain**

   If your domain isn't registered in the tenant, only the option to verify a new domain for your app appears.

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
            "applicationId": "<another-app-id>"
         }
      ]
    }
   ```

1. Replace `<your-app-id>` with the application (client) ID for your app. Use all relevant app IDs if you're verifying a new domain for multiple apps.
1. Host the file at `https://<your-domain>.com/.well-known/microsoft-identity-association.json`. Replace `<your-domain>` with the name of the verified domain.
1. Select **Verify and save domain**.

You're not required to maintain the resources that are used for verification after you verify a domain. When verification is finished, you can remove the hosted file.

### Select a verified domain

If your tenant has verified domains, in the **Select a verified domain** dropdown, select one of the domains.

> [!NOTE]
> Content will be interpreted as UTF-8 JSON for deserialization. Supported `Content-Type` headers that should return are `application/json`, `application/json; charset=utf-8`, or ` `. If you use any other header, you might see this error message:
>
> `Verification of publisher domain failed. Error getting JSON file from https:///.well-known/microsoft-identity-association. The server returned an unexpected content type header value.`
>

## Publisher domain and the app consent prompt

Configuring the publisher domain affects what users see in the app consent prompt. For more information about the components of the consent prompt, see [Understand the application consent experience](application-consent-experience.md).

The following figure shows how publisher domain appears in app consent prompts for apps that were created before May 21, 2019:

:::image type="content" source="./media/howto-configure-publisher-domain/old-app-behavior-table.png" border="false" alt-text="Diagram that shows consent prompt behavior for apps created before May 21, 2019.":::

For apps that were created between May 21, 2019, and November 30, 2020, how the publisher domain appears in an app's consent prompt depends on the publisher domain and the type of app. The following figure describes what appears on the consent prompt for different combinations of configurations:

:::image type="content" source="./media/howto-configure-publisher-domain/new-app-behavior-table.png" border="false" alt-text="Diagram that shows consent prompt behavior for apps created between May 21, 2019, and November 30, 2020.":::

For multitenant apps that were created after November 30, 2020, only publisher verification status is shown in an app's consent prompt. The following table describes what appears in a consent prompt depending on whether an app is verified. The consent prompt for single-tenant apps remains the same.

:::image type="content" source="./media/howto-configure-publisher-domain/new-app-behavior-publisher-verification-table.png" border="false" alt-text="Diagram that shows  consent prompt results for apps that were created after November 30, 2020.":::

## Publisher domain and redirect URIs

Apps that sign in users by using any work or school account or by using a Microsoft account (multitenant) are subject to a few restrictions in redirect URIs.

### Single root domain restriction

When the publisher domain value for a multitenant app is set to null, the app is restricted to sharing a single root domain for the redirect URIs. For example, the following combination of values isn't allowed because the root domain `contoso.com` doesn't match the root domain `fabrikam.com`.

```json
"https://contoso.com",  
"https://fabrikam.com",
```

### Subdomain restrictions

Subdomains are allowed, but you must explicitly register the root domain. For example, although the following URIs share a single root domain, the combination isn't allowed:

```json
"https://app1.contoso.com",
"https://app2.contoso.com",
```

But if the developer explicitly adds the root domain, the combination is allowed:

```json
"https://contoso.com",
"https://app1.contoso.com",
"https://app2.contoso.com",
```

### Restriction exceptions

The following cases aren't subject to the single root domain restriction:

- Single-tenant apps or apps that target accounts in a single directory.
- Use of localhost as redirect URIs.
- Redirect URIs that have custom schemes (non-HTTP or HTTPS).

## Configure publisher domain programmatically

Currently, you can't use REST API or PowerShell to programmatically set a publisher domain.

## Next steps

- Learn how to [mark an app as publisher verified](mark-app-as-publisher-verified.md).
- [Troubleshoot](troubleshoot-publisher-verification.md) publisher verification.

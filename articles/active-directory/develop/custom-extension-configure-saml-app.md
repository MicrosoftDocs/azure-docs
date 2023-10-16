---
title: Source claims from an external store (SAML app)
titleSuffix: Microsoft identity platform
description: Use a custom claims provider to augment tokens with claims from an external identity system. Configure a SAML app to receive tokens with external claims. 
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 03/06/2023
ms.author: davidmu
ms.custom: aaddev
ms.reviewer: JasSuri
#Customer intent: As an application developer, I want to source claims from a data store that is external to Microsoft Entra ID.
---

# Configure a SAML app to receive tokens with claims from an external store (preview)

This article describes how to configure a SAML application to receive tokens with external claims from your custom claims provider.

## Prerequisites

Before configuring a SAML application to receive tokens with external claims, first follow these sections:

- [Create a custom claims provider API](custom-extension-get-started.md#step-1-create-an-azure-function-app)
- [Register a custom claims extension](custom-extension-get-started.md#step-2-register-a-custom-authentication-extension)

## Configure a SAML application that receives enriched tokens

Individual app administrators or owners can use a custom claims provider to enrich tokens for existing applications or new applications.  These apps can use tokens in either [JWT (for OpenID connect)](./custom-extension-get-started.md) or SAML formats.

The following steps are for registering a demo [XRayClaims](https://adfshelp.microsoft.com/ClaimsXray/TokenRequest) application so you can test whether it can receive a token with enriched claims.

### Add a new SAML application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Add a new, non-gallery SAML application in your tenant:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).

1. Browse to **Identity** > **Applications** > **Enterprise applications**.  

1. Select **New application** and then **Create your own application**.

1. Add a name for the app.  For example, **AzureADClaimsXRay**.  Select the **Integrate any other application you don't find in the gallery (Non-gallery)** option and select **Create**.

### Configure single sign-on with SAML

Set up single sign-on for the app:

1. In the **Overview** page, select **Set up Single Sign-On** and then **SAML**.  Select **Edit** in **Basic SAML Configuration**.

1. Select **Add identifier** and add "urn:microsoft:adfs:claimsxray" as the identifier. If that identifier is already used by another application in your organization, you can use an alternative like **urn:microsoft:adfs:claimsxray12**

1. Select **reply URL** and add `https://adfshelp.microsoft.com/ClaimsXray/TokenResponse` as the Reply URL.

1. Select **Save**.

### Configure claims

Attributes that return by your custom claims provider API aren't automatically included in tokens returned by Microsoft Entra ID.  You need to configure your application to reference attributes returned by the custom claims provider and return them as claims in tokens.

1. On the **Enterprise applications** configuration page for that new app, go to the **Single sign-on** pane.

1. Select on **Edit** for the **Attributes & Claims** section

1. Expand the **Advanced settings** section.

1. Select on **Configure** for **Custom claims provider**.

1. Select the custom authentication extension you [registered previously](custom-extension-get-started.md#step-2-register-a-custom-authentication-extension) in the **Custom claims provider** dropdown.  Select **Save**.

1. Select **Add new claim** to add a new claim.

1. Provide a name to the claim you want to be issued, for example "DoB". Optionally set a namespace URI.

1. For **Source**, select **Attribute** and pick the attribute provided by the custom claims provider from the **Source attribute** dropdown. Attributes shown are the attributes defined as 'to be made available' by the custom claims provider in your custom claims provider configuration. Attributes provided by the custom claims provider are prefixed with **customclaimsprovider**. For example, **customclaimsprovider.DateOfBirth** and **customclaimsprovider.CustomRoles**. These claims can be single or multi-valued depend on your API response.

1. Select **Save** to add the claim to the SAML token configuration.

1. Close the **Manage claim** and **Attributes & Claims** windows.

### Assign a user or group to the app

Before testing the user sign-in, you must assign a user or group of users to the app. If you don't, the `AADSTS50105 - The signed in user is not assigned to a role for the application` error returns when signing in.

1. In the application **Overview** page, select **Assign users and groups** under **Getting started**.

1. In the **Users and groups** page, select **Add user/group**.

1. Search for and select the user to sign in to the app.  Select the **Assign** button.

### Test the application

Test that the token is being enriched for users signing in to the application:

1. In the app overview page, select **Single sign-on** in the left nav bar.

1. Scroll down and select **Test** under **Test single sign-on with {app name}**.

1. Select **Test sign in** and sign in. At the end of your sign-in, you should see the Token response Claims X-ray tool. The claims you configured to appear in the token should all be listed if they have non-null values, including any that use the custom claims provider as a source.

:::image type="content" source="media/custom-extension-configure-saml-app/saml-token-response.png" alt-text="Screenshot that shows the claims from an external source." :::

## Next steps

[Troubleshoot your custom claims provider API](custom-extension-troubleshoot.md).

View the [Authentication Events Trigger for Azure Functions sample app](https://github.com/Azure/azure-docs-sdk-dotnet/blob/live/api/overview/azure/preview/microsoft.azure.webjobs.extensions.authenticationevents-readme.md).

<!-- For information on the HTTP request and response formats, read the [protocol reference](custom-claims-provider-protocol-reference.md). -->

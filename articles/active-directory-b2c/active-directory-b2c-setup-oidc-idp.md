---
title: Adding OpenID Connect identity providers in built-in policies in Azure Active Directory B2C | Microsoft Docs
description: Overview guide on how to add OpenID Connect providers in built-in policies within Azure AD B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/27/2018
ms.author: davidmu
ms.component: B2C
---

# Azure Active Directory B2C: Add a custom OpenID Connect identity provider in built-in policies

>[!NOTE]
> This feature is in public preview. Do not use the feature in production environments.

[OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html) is an authentication protocol, built on top of OAuth 2.0, that can be used to securely sign users in. Most identity providers that use this protocol, such as [Azure AD](active-directory-b2c-setup-oidc-azure-active-directory.md), are supported in Azure AD B2C. This article explains how you can add custom OpenID Connect identity providers into your built-in policies.

## Configuring a custom OpenID Connect identity provider

To add a custom OpenID Connect identity provider:

1. Follow these steps to [navigate to the Azure AD B2C settings](active-directory-b2c-app-registration.md#navigate-to-b2c-settings) in the Azure portal.
1. Click on **Identity Providers**.
1. Click on **Add**.
1. For the **Identity provider type**, select **OpenID Connect**.

### Setting up the OpenID Connect identity provider

#### Metadata URL

As per specification, every OpenID Connect identity providers describes a metadata document that contains most of the information required to perform sign-in. This includes information such as the URLs to use and the location of the service's public signing keys. The OpenID Connect metadata document is always located at an endpoint that ends in `.well-known\openid-configuration`.

For the OpenID Connect identity provider you are looking to add, enter its metadata URL.

#### Client ID and secret

To allow users to sign in, the identity provider will require developers to register an application in their service. This application will have an ID (referred to as the **client ID**) and a **client secret**. Copy these values from the identity provider and enter them into the corresponding fields.

> [!NOTE]
> The client secret is optional. However, you must enter a client secret if you would like to use the [authorization code flow](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth), which uses the secret to exchange the code for the token.

#### Scope

Scopes define the information and permissions you are looking to gather from your custom identity provider. OpenID Connect requests must contain the `openid` scope value in order to receive the ID token from the identity provider. Without the ID token, users will not be able to sign into Azure AD B2C using the custom identity provider.

Other scopes can be appended (separated by space). Refer to the custom identity provider's documentation to see what other scopes may be available.

#### Response type

The response type describes what kind of information will be sent back in the initial call to the `authorization_endpoint` of the custom identity provider. 

* `code`: As per the [authorization code flow](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth), a code will be returned back to Azure AD B2C. Azure AD B2C will then proceed to call the `token_endpoint` to exchange the code for the token.
* `token`: An access token will be returned back to Azure AD B2C from the custom identity provider.
* `id_token`: An ID token will be returned back to Azure AD B2C from the custom identity provider.


#### Response mode

The response mode defines the method that should be used to send the data back from the custom identity provider to Azure AD B2C.

* `form_post`: This response mode is recommended for best security. The response is transmitted via the HTTP `POST` method, with the code or token being encoded in the body using the `application/x-www-form-urlencoded` format.
* `query`: The code or token will be returned as a query parameter.


#### Domain hint

The domain hint can be used to skip directly to the sign in page of the specified identity provider, instead of having the user make a selection among the list of available identity providers. To allow this kind of behavior, enter a value for the domain hint.

To jump to the custom identity provider, append the parameter `domain_hint=<domain hint value>` to the end of your request when calling Azure AD B2C for sign in.


### Mapping the claims from the OpenID Connect identity provider

After the custom identity provider sends an ID token back to Azure AD B2C, Azure AD B2C needs to be able to map the claims from the received token to the claims that Azure AD B2C recognizes and uses. 

For each of the mappings below, refer to the documentation of the custom identity provider to understand the claims that are returned back in the identity provider's tokens.

* `User ID`: Enter the claim that provides the unique identifier for the signed in user.
* `Display Name`: Enter the claim that provides the display name or full name for the user.
* `Given Name`: Enter the claim that provides the first name of the user.
* `Surname`: Enter the claim that provides the last name of the user.
* `Email`: Enter the claim that provides the email address of the user.

## Next steps

Add the custom OpenID Connect identity provider to your [built-in policy](active-directory-b2c-reference-policies.md).

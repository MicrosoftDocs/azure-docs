---
title: Set up sign-up and sign-in with OpenID Connect
titleSuffix: Azure AD B2C
description: Set up sign-up and sign-in with any OpenID Connect identity provider (IdP) in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/30/2021
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-up and sign-in with OpenID Connect using Azure Active Directory B2C

[OpenID Connect](openid-connect.md) is an authentication protocol built on top of OAuth 2.0 that can be used for secure user sign-in. Most identity providers that use this protocol are supported in Azure AD B2C. 

This article explains how you can add custom OpenID Connect identity providers into your user flows.

[!INCLUDE [active-directory-b2c-https-cipher-tls-requirements](../../includes/active-directory-b2c-https-cipher-tls-requirements.md)]

## Add the identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Contoso*.

## Configure the identity provider

Every OpenID Connect identity provider describes a metadata document that contains most of the information required to perform sign-in. This includes information such as the URLs to use and the location of the service's public signing keys. The OpenID Connect metadata document is always located at an endpoint that ends in `.well-known/openid-configuration`. For the OpenID Connect identity provider you are looking to add, enter its metadata URL.

## Client ID and secret

To allow users to sign in, the identity provider requires developers to register an application in their service. This application has an ID that is referred to as the **client ID** and a **client secret**. Copy these values from the identity provider and enter them into the corresponding fields.

> [!NOTE]
> The client secret is optional. However, you must enter a client secret if you'd like to use the [authorization code flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth), which uses the secret to exchange the code for the token.

## Scope

Scope defines the information and permissions you are looking to gather from your identity provider, for example `openid profile`. In order to receive the ID token from the identity provider, the `openid` scope must be specified. Without the ID token, users are not able to sign in to Azure AD B2C using the custom identity provider. Other scopes can be appended separated by space. Refer to the custom identity provider's documentation to see what other scopes may be available.

## Response type

The response type describes what kind of information is sent back in the initial call to the `authorization_endpoint` of the custom identity provider. The following response types can be used:

* `code`: As per the [authorization code flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth), a code will be returned back to Azure AD B2C. Azure AD B2C proceeds to call the `token_endpoint` to exchange the code for the token.
* `id_token`: An ID token is returned back to Azure AD B2C from the custom identity provider.

## Response mode

The response mode defines the method that should be used to send the data back from the custom identity provider to Azure AD B2C. The following response modes can be used:

* `form_post`: This response mode is recommended for best security. The response is transmitted via the HTTP `POST` method, with the code or token being encoded in the body using the `application/x-www-form-urlencoded` format.
* `query`: The code or token is returned as a query parameter.

## Domain hint

The domain hint can be used to skip directly to the sign in page of the specified identity provider, instead of having the user make a selection among the list of available identity providers. To allow this kind of behavior, enter a value for the domain hint. To jump to the custom identity provider, append the parameter `domain_hint=<domain hint value>` to the end of your request when calling Azure AD B2C for sign in.

## Claims mapping

After the custom identity provider sends an ID token back to Azure AD B2C, Azure AD B2C needs to be able to map the claims from the received token to the claims that Azure AD B2C recognizes and uses. For each of the following mappings, refer to the documentation of the custom identity provider to understand the claims that are returned back in the identity provider's tokens:

* **User ID**: Enter the claim that provides the *unique identifier* for the signed-in user.
* **Display Name**: Enter the claim that provides the *display name* or *full name* for the user.
* **Given Name**: Enter the claim that provides the *first name* of the user.
* **Surname**: Enter the claim that provides the *last name* of the user.
* **Email**: Enter the claim that provides the *email address* of the user.

## Add the identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the identity provider. 
1. Under the **Social identity providers**, select the identity provider you added. For example, *Contoso*.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select the identity provider you want to sign-in. For example, *Contoso*.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

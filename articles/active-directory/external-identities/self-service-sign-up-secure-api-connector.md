---
title: Secure APIs used as API connectors in Azure AD self-service sign-up user flows
description: Secure your custom RESTful APIs used as API connectors in self-service sign-up user flows.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 02/15/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
ms.collection: engagement-fy23, M365-identity-device-management

# Customer intent: As a tenant administrator, I want to make sure that I protect my API endpoint with proper authentication. 
---

# Secure your API used an API connector in Azure AD External Identities self-service sign-up user flows

When integrating a REST API within an Azure AD external identities self-service sign-up user flow, you must protect your REST API endpoint with authentication. The REST API authentication ensures that only services that have proper credentials, such as Azure AD, can make calls to your endpoint. This article explores how to secure REST API. 

## Prerequisites
Complete the steps in the [Walkthrough: Add an API connector to a sign-up user flow](self-service-sign-up-add-api-connector.md) guide.

You can protect your API endpoint by using either HTTP basic authentication or HTTPS client certificate authentication. In either case, you provide the credentials that Azure AD uses when calling your API endpoint. Your API endpoint then checks the credentials and performs authorization decisions.

## HTTP basic authentication

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

HTTP basic authentication is defined in [RFC 2617](https://tools.ietf.org/html/rfc2617). Basic authentication works as follows: Azure AD sends an HTTP request with the client credentials (`username` and `password`) in the `Authorization` header. The credentials are formatted as the base64-encoded string `username:password`. Your API then is responsible for checking these values to perform other authorization decisions.

To configure an API Connector with HTTP basic authentication, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Under **Azure services**, select **Azure AD**.
1. In the left menu, select **External Identities**.
1. Select **All API connectors**, and then select the **API Connector** you want to configure.
1. For the **Authentication type**, select **Basic**.
1. Provide the **Username**, and **Password** of your REST API endpoint.
    :::image type="content" source="media/secure-api-connector/api-connector-config.png" alt-text="Screenshot of basic authentication configuration for an API connector.":::
1. Select **Save**.

## HTTPS client certificate authentication

Client certificate authentication is a mutual certificate-based authentication, where the client, Azure AD, provides its client certificate to the server to prove its identity. This happens as a part of the SSL handshake. Your API is responsible for validating the certificates belong to a valid client, such as Azure AD, and performing authorization decisions. The client certificate is an X.509 digital certificate. 

> [!IMPORTANT]
> In production environments, the certificate must be signed by a certificate authority.

### Create a certificate

#### Option 1: Use Azure Key Vault (recommended)

To create a certificate, you can use [Azure Key Vault](../../key-vault/certificates/create-certificate.md), which has options for self-signed certificates and integrations with certificate issuer providers for signed certificates. Recommended settings include:
- **Subject**: `CN=<yourapiname>.<tenantname>.onmicrosoft.com`
- **Content Type**: `PKCS #12`
- **Lifetime Acton Type**: `Email all contacts at a given percentage lifetime` or `Email all contacts a given number of days before expiry`
- **Key Type**: `RSA`
- **Key Size**: `2048`
- **Exportable Private Key**: `Yes` (in order to be able to export `.pfx` file)

You can then [export the certificate](../../key-vault/certificates/how-to-export-certificate.md).

#### Option 2: prepare a self-signed certificate using PowerShell

[!INCLUDE [active-directory-b2c-create-self-signed-certificate](../../../includes/active-directory-b2c-create-self-signed-certificate.md)]

### Configure your API Connector

To configure an API Connector with client certificate authentication, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Under **Azure services**, select **Azure AD**.
1. In the left menu, select **External Identities**.
1. Select **All API connectors**, and then select the **API Connector** you want to configure.
1. For the **Authentication type**, select **Certificate**.
1. In the **Upload certificate** box, select your certificate's .pfx file with a private key.
1. In the **Enter Password** box, type the certificate's password.
  :::image type="content" source="media/secure-api-connector/api-connector-upload-cert.png" alt-text="Screenshot of certificate authentication configuration for an API connector.":::
1. Select **Save**.

### Perform authorization decisions 
Your API must implement the authorization based on sent client certificates in order to protect the API endpoints. For Azure App Service and Azure Functions, see [configure TLS mutual authentication](../../app-service/app-service-web-configure-tls-mutual-auth.md) to learn how to enable and *validate the certificate from your API code*.  You can alternatively use Azure API Management as a layer in front of any API service to [check client certificate properties](
../../api-management/api-management-howto-mutual-certificates-for-clients.md) against desired values.

### Renewing certificates
It's recommended you set reminder alerts for when your certificate expires. You'll need to generate a new certificate and repeat the steps above when used certificates are about to expire. To "roll" the use of a new certificate, your API service can continue to accept old and new certificates for a temporary amount of time while the new certificate is deployed. 

To upload a new certificate to an existing API connector, select the API connector under **API connectors** and select on **Upload new certificate**. The most recently uploaded certificate that isn't expired and whose start date has passed will automatically be used by Azure AD.

  :::image type="content" source="media/secure-api-connector/api-connector-renew-cert.png" alt-text="Screenshot of a new certificate, when one already exists.":::

## API key authentication

Some services use an "API key" mechanism to obfuscate access to your HTTP endpoints during development by requiring the caller to include a unique key as an HTTP header or HTTP query parameter. For [Azure Functions](../../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys), you can accomplish this by including the `code` as a query parameter in the **Endpoint URL** of your API connector. For example, `https://contoso.azurewebsites.net/api/endpoint`<b>`?code=0123456789`</b>). 

This isn't a mechanism that should be used alone in production. Therefore, configuration for basic or certificate authentication is always required. If you don't wish to implement any authentication method (not recommended) for development purposes, you can select 'basic' authentication in the API connector configuration and use temporary values for `username` and `password` that your API can disregard while you implement proper authorization.

## Next steps
- Get started with our [quickstart samples](code-samples-self-service-sign-up.md#api-connector-azure-function-quickstarts).

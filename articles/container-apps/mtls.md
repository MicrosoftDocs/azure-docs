---
title: Use mTLS in Azure Container Apps
description: Learn to use mTLS in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/22/2025
ms.author: cshoe
---

# Use mTLS in Azure Container Apps

Mutual Transport Layer Security (mTLS) is an extension of the standard TLS protocol that provides mutual authentication between client and server. Azure Container Apps supports running mTLS-enabled applications to provide increased security in your applications.

In Azure Container Apps, all incoming requests pass through Envoy before being routed to the target container app. When you use mTLS, the client exchanges certificates with Envoy. Each of these certificates is placed into the [X-Forwarded-Client-Cert](ingress-overview.md#http-headers) header, which is then sent to the application.

To build an mTLS application in Azure Container Apps, you need to:

1. Configure Azure Container Apps to require client certificates from peers.
2. Extract `X.509` Certificates from requests.

This article describes how to handle peer mTLS handshake certificates by extracting the `X.509` certificate from the client.

## Require client certificates

Use the following steps to configure your container app to require client certificates:

1. Open your container app in the Azure portal.
1. Under *Settings*, select **Ingress**.
1. Select the **Enabled** option.
1. For *ingress type*, select **HTTP**.
1. Under *Client certificate mode*, select **Require**.
1. Select **Save** to apply the changes.

For more information about configuring client certificate authentication in Azure Container Apps, see [Configure client certificate authentication in Azure Container Apps](client-certificate-authorization.md).

## Extract X.509 certificates

To extract `X.509` certificates from the `X-Forwarded-Client-Cert` header, parse the header value in your application code. This header contains the client certificate information when mTLS is enabled. The certificates are provided in a semicolon-separated list format, which includes the hash, certificate, and chain.

Here's the procedure you want to follow to extract and parse the certificate in your application:

1. Retrieve the `X-Forwarded-Client-Cert` header from the incoming request.
1. Parse the header value to extract the certificate details.
1. Put the parsed certificates to the standard certificate attribute for further validation or usage.

Once parsed, you can validate certificates and use them according to the needs of your application.

## Example

In Java applications, you can use the [Reactive X.509 authentication filter](https://docs.spring.io/spring-security/reference/reactive/authentication/x509.html) to map the user information from certificates to the security context. For a complete example of a Java application with mTLS in Azure Container Apps, see [mTLS Server Application on Azure Container Apps](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/azure-container-apps-mtls-certificate-filter).

## Related content

- [Configure client certificate authentication in Azure Container Apps](client-certificate-authorization.md)
- [Custom domain names and bring your own certificates in Azure Container Apps](custom-domains-certificates.md)

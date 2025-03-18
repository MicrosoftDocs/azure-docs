---
title: TLS and SSL overview
description: Learn how SSL and TLS work in Azure App Service, including TLS version support, certificate management, secure bindings, and mutual authentication to protect web app traffic.
keywords: Azure App Service, SSL, TLS, HTTPS, certificate management, TLS mutual authentication, secure bindings, SSL certificates, App Service Certificates, SSL in code, TLS versions
ms.topic: overview
ms.date: 03/10/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
ms.collection: ce-skilling-ai-copilot
---

# TLS and SSL overview for Azure App Service

> [!NOTE]
> The [retirement of TLS 1.1 and 1.0 on Azure services](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/) doesn't affect applications running on App Service, Azure Functions, or Logic Apps (Standard). Applications on either App Service, Azure Functions, or Logic Apps (Standard) configured to accept TLS 1.0 or TLS 1.1 for incoming requests **will continue to run unaffected**.

Transport Layer Security (TLS) is a widely adopted security protocol designed to secure connections and communications between servers and clients. App Service allows customers to use TLS/SSL certificates to secure incoming requests to their web apps. App Service currently supports different set of TLS features for customers to secure their web apps.

Azure App Service supports TLS to ensure:

- **Encryption** of data in transit.
- **Authentication** of web apps using trusted certificates.
- **Integrity** to prevent tampering of data during transmission.

> [!TIP]
>
> You can also ask Azure Copilot, an AI-powered assistant in the Azure portal, these questions:
>
> - *What versions of TLS are supported in App Service?*
> - *What are the benefits of using TLS 1.3 over previous versions?*
> - *How can I change the cipher suite order for my App Service Environment?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

## TLS version support

Azure App Service supports the following TLS versions for incoming requests to your web app:

- **TLS 1.3**: Latest and most secure version, now fully supported.
- **TLS 1.2**: Default minimum TLS version for new web apps.
- **TLS 1.1 and TLS 1.0**: Supported for backward compatibility, but not recommended.

You can configure the **minimum TLS version** for incoming requests to your web app and its SCM site. By default, the minimum is set to **TLS 1.2**.

You can use Azure Policy to help audit your resources when it comes to minimum TLS version. You can refer to [App Service apps should use the latest TLS version policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff0e6e85b-9b9f-4a4b-b67b-f730d42f1b0b) and change the values to your desired minimum TLS version. For similar policy definitions for other App Service resources, refer to [List of built-in policy definitions - Azure Policy for App Service](../governance/policy/samples/built-in-policies.md#app-service).

### TLS 1.3

TLS 1.3 is fully supported on App Service and introduces several improvements over TLS 1.2:

- **Stronger security** with simplified cipher suites and forward secrecy.
- **Faster handshakes** for reduced latency.
- **Encrypted handshake** messages for enhanced privacy.

To require TLS 1.3 for all inbound requests, set your **Minimum Inbound TLS Version** to **TLS 1.3** in the Azure portal, CLI, or ARM templates.

TLS 1.3 supports the following cipher suites, which are fixed and cannot be customized:

- `TLS_AES_256_GCM_SHA384`
- `TLS_AES_128_GCM_SHA256`

These suites provide strong encryption and are automatically used when TLS 1.3 is negotiated.

### TLS 1.2

TLS 1.2 is the **default and recommended** TLS version for App Service. It provides strong encryption and broad compatibility while meeting compliance standards like PCI DSS. New web apps and SCM endpoints are automatically set to TLS 1.2 unless changed.

Azure App Service uses a secure set of TLS 1.2 cipher suites to ensure encrypted connections and protect against known vulnerabilities. While TLS 1.0 and 1.1 can be enabled for backward compatibility, they are not recommended.

### TLS 1.0 and TLS 1.1

TLS 1.0 and 1.1 are considered **legacy protocols** and are no longer considered secure. They are supported on App Service only for backward compatibility and should be avoided when possible. The default minimum TLS version for new apps is **TLS 1.2**, and we recommend migrating apps that still use TLS 1.0 or 1.1.

> [!IMPORTANT]
> Incoming requests to web apps and incoming requests to Azure are treated differently. App Service will continue to support TLS 1.0 and 1.1 for incoming requests to the web apps. For incoming requests directly to the Azure control plane, for example through ARM or API calls, it's not recommended to use TLS 1.0 or 1.1.

## Minimum TLS cipher suite

> [!NOTE]
> Minimum TLS Cipher Suite is supported on Basic SKUs and higher on multitenant App Service.

The minimum TLS cipher suite includes a fixed list of cipher suites with an optimal priority order that you cannot change. Reordering or reprioritizing the cipher suites isn't recommended as it could expose your web apps to weaker encryption. You also cannot add new or different cipher suites to this list. When you select a minimum cipher suite, the system automatically disables all less secure cipher suites for your web app, without allowing you to selectively disable only some weaker cipher suites.

### What are cipher suites and how do they work on App Service?

A cipher suite is a set of instructions that contains algorithms and protocols to help secure network connections between clients and servers. By default, the front-end's OS would pick the most secure cipher suite that is supported by both App Service and the client. However, if the client only supports weak cipher suites, then the front-end's OS would end up picking a weak cipher suite that is supported by them both. If your organization has restrictions on what cipher suites should not be allowed, you may update your web app’s minimum TLS cipher suite property to ensure that the weak cipher suites would be disabled for your web app.

### App Service Environment (ASE) V3 with cluster setting `FrontEndSSLCipherSuiteOrder`

For App Service Environments (ASE) with the `FrontEndSSLCipherSuiteOrder` cluster setting configured, you need to update your settings to include **the two TLS 1.3 cipher suites**:

- `TLS_AES_256_GCM_SHA384`
- `TLS_AES_128_GCM_SHA256`

Once you update your cluster setting, **you must restart your front-end** for the changes to take effect. Also, remember that **you must still include the two required cipher suites as mentioned in the documentation**, even when updating to support TLS 1.3. If you are already using `FrontEndSSLCipherSuiteOrder`, it is **not recommended to also enable Minimum TLS Cipher Suite for your web app**, as this could lead to conflicting configurations. **Only one** of these should be configured for managing cipher suite preferences.

## End-to-end TLS encryption

End-to-end (E2E) TLS encryption ensures that **front-end to worker communication** within Azure App Service is encrypted using TLS. Without this feature, while incoming HTTPS requests are encrypted to the front ends, the traffic from front ends to workers running the application workloads would travel unencrypted inside Azure’s infrastructure.

E2E TLS helps ensure **full encryption of traffic** between:

- Clients and App Service front ends.
- App Service front ends and worker processes hosting the application.

This feature is available on:

- **Premium App Service plans** (recommended for new deployments).
- **Legacy Standard App Service plans** (existing users).

> [!IMPORTANT]
> **Premium plans** are recommended for new deployments that require end-to-end encryption and other advanced security features.

### How to enable end-to-end TLS encryption

You can enable E2E TLS encryption via:

- **Azure portal** settings.
- **Azure CLI** commands.
- **ARM templates** for automation.

Once enabled, all intra-cluster communication for your web app will be encrypted using TLS, ensuring **end-to-end data protection**.

## SSL/TLS certificates on App Service

To serve HTTPS traffic, App Service requires an SSL/TLS certificate bound to your custom domain.

### Types of certificates

- **App Service Certificates (ASC)**  
   Fully managed certificates issued and renewed automatically by Azure, stored securely in Azure Key Vault.

- **Bring your own certificate (BYOC)**  
   Upload and manage certificates (PFX format) issued by third-party Certificate Authorities (CAs).

### Binding certificates to custom domains

After uploading or creating a certificate, you bind it to a custom domain on your web app using:

- **SNI SSL bindings** for multitenant hosting.
- **IP SSL bindings** for dedicated IP addresses.

> [!NOTE]
> Azure-managed domains (such as `*.azurewebsites.net`) are automatically secured with default certificates, requiring no additional configuration.

## Mutual TLS (mTLS) authentication

Azure App Service supports **mutual TLS (mTLS)** on **both Linux and Windows App Service plans**, allowing apps to require client certificates for added security.

### How mTLS works

- Clients present certificates that are validated against a trusted CA chain you configure.
- Only clients with valid certificates can connect.
- Commonly used to secure APIs and internal apps.

### Configuration options

- Enable mTLS through **Azure portal**, **CLI**, or **ARM templates**.
- Upload trusted CA certificates for client validation.
- Access client certificate information in app code via request headers.

## Automatic certificate management

Azure App Service provides built-in features to manage certificates automatically:

- **App Service managed certificates (free)**  
  Automatically issued and renewed for custom domains. These certificates are limited to basic domain validation and don't support wildcard or exportable certificates.

- **App Service Certificates (paid)**  
  Fully managed certificates that support advanced scenarios, including wildcard domains and exportable certificates. These are stored and managed in Azure Key Vault.

## Summary

Azure App Service makes it easy to help secure your web apps with SSL/TLS. With support for modern TLS versions, flexible certificate options, and advanced features like mutual TLS, App Service helps you protect data in transit and meet compliance requirements.

## Related content

- [Bind SSL certificates to your custom domain](configure-ssl-bindings.md)
- [Purchase and manage App Service Certificates](configure-ssl-app-service-certificate.md)
- [Configure mutual TLS](app-service-web-configure-tls-mutual-auth.md)
- [Use certificates in app code](configure-ssl-certificate-in-code.md)

---
title: What Is TLS/SSL in Azure App Service?
description: Learn how TLS and SSL work in Azure App Service, including TLS version support, certificate management, bindings, and mutual authentication to protect web app traffic.
keywords: Azure App Service, SSL, TLS, HTTPS, certificate management, TLS mutual authentication, secure bindings, SSL certificates, App Service Certificates, SSL in code, TLS versions
ms.topic: overview
ms.date: 04/17/2025
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service
ms.custom: UpdateFrequency3
ms.collection: ce-skilling-ai-copilot
---

# What is TLS/SSL in Azure App Service?

> [!NOTE]
> The [retirement of TLS 1.1 and TLS 1.0 on Azure services](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/) doesn't affect applications running on Azure App Service, Azure Functions, or Azure Logic Apps (Standard). Applications on App Service, Azure Functions, or Logic Apps (Standard) that are configured to accept TLS 1.1 or TLS 1.0 for incoming requests *continue to run unaffected*.

Transport Layer Security (TLS) is a widely adopted security protocol that is designed to secure connections and communications between servers and clients. In Azure App Service, you can use TLS and Secure Sockets Layer (SSL) certificates to help secure incoming requests in your web apps.

App Service supports TLS to help ensure:

- Encryption of data in transit.
- Authentication of web apps by using trusted certificates.
- Integrity to prevent tampering of data during transmission.

> [!TIP]
>
> You can also ask Azure Copilot, an AI-powered assistant in the Azure portal, these questions:
>
> - *What versions of TLS are supported in App Service?*
> - *What are the benefits of using TLS 1.3 instead of earlier versions?*
> - *How can I change the cipher suite order for my App Service Environment?*
>
> On the page header in the [Azure portal](https://portal.azure.com), select **Copilot**.

## TLS version support

Azure App Service supports the following TLS versions for incoming requests to your web app:

- TLS 1.3: The latest and most secure version, now fully supported.
- TLS 1.2: The default minimum TLS version for new web apps.
- TLS 1.1 and TLS 1.0: Versions supported for backward compatibility, but not recommended.

You can configure the *minimum TLS version* for incoming requests to your web app and its Source Control Manager (SCM) site. By default, the minimum is set to **TLS 1.2**.

You can use Azure Policy to help audit your resources and minimum TLS version. Go to [App Service apps should use the latest TLS version policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff0e6e85b-9b9f-4a4b-b67b-f730d42f1b0b) and change the values to the minimum TLS version you want your web apps to use. For related policy definitions for other App Service resources, see [List of built-in policy definitions - Azure Policy for App Service](../governance/policy/samples/built-in-policies.md#app-service).

### TLS 1.3

TLS 1.3 is fully supported on App Service and introduces several improvements over TLS 1.2:

- Stronger security, with simplified cipher suites and forward secrecy.
- Faster handshakes for reduced latency.
- Encrypted handshake messages for enhanced privacy.

To require TLS 1.3 for all inbound requests, set **Minimum Inbound TLS Version** to **TLS 1.3** in the Azure portal, the Azure CLI, or your Azure Resource Manager template (ARM template).

TLS 1.3 supports the following cipher suites, which are fixed and can't be customized:

- `TLS_AES_256_GCM_SHA384`
- `TLS_AES_128_GCM_SHA256`

These suites provide strong encryption and are automatically used when TLS 1.3 is negotiated.

### TLS 1.2

TLS 1.2 is the *default* TLS version for App Service. It provides strong encryption and broad compatibility while meeting compliance standards like the Payment Card Industry Data Security Standard (PCI DSS). New web apps and SCM endpoints by default use TLS 1.2 unless you change them.

Azure App Service uses a secure set of TLS 1.2 cipher suites to help ensure encrypted connections and to protect against known vulnerabilities. Although you can enable TLS 1.1 and TLS 1.0 for backward compatibility, we recommend that you use a minimum version of TLS 1.2.

### TLS 1.1 and TLS 1.0

TLS 1.1 and TLS 1.0 are considered legacy protocols and are no longer considered secure. These versions are supported on App Service *only* for backward compatibility and should be avoided when possible. The default minimum TLS version for new apps is TLS 1.2, and we recommend that you migrate apps that use TLS 1.1 or TLS 1.0.

> [!IMPORTANT]
> Incoming requests to web apps and incoming requests to Azure are handled differently. App Service continues to support TLS 1.1 and TLS 1.0 for incoming requests to web apps.
>
> For incoming requests made directly to the Azure control plane, for example, through Azure Resource Manager or API calls, we recommend that you don't use TLS 1.1 or TLS 1.0.

## Minimum TLS cipher suite

> [!NOTE]
> The **Minimum TLS Cipher Suite** setting is supported on Basic SKUs or higher on multitenant App Service.

The minimum TLS cipher suite includes a fixed list of cipher suites with an optimal priority order that you can't change. Reordering or reprioritizing the cipher suites isn't recommended because it could expose your web apps to weaker encryption. You also can't add new or different cipher suites to this list. When you select a minimum cipher suite, the system automatically disables all less secure cipher suites for your web app. You can't selectively disable only some weaker cipher suites.

### What are cipher suites and how do they work on App Service?

A cipher suite is a set of instructions that contains algorithms and protocols to help secure network connections between clients and servers. By default, the front-end OS chooses the most secure cipher suite that both App Service and the client support. However, if the client supports only weak cipher suites, the front-end OS would end up choosing a weak cipher suite. If your organization has restrictions on what cipher suites are allowed, you can update your web app’s minimum TLS cipher suite property to ensure that weak cipher suites are disabled for your web app.

### App Service Environment with cluster setting FrontEndSSLCipherSuiteOrder

For App Service Environments that have the `FrontEndSSLCipherSuiteOrder` cluster setting configured, update your settings to include the two TLS 1.3 cipher suites:

- `TLS_AES_256_GCM_SHA384`
- `TLS_AES_128_GCM_SHA256`

After you update your cluster setting, you must restart your front end for the changes to take effect. Also, you must still include the two required cipher suites described earlier, even when you update to support TLS 1.3. If you already use `FrontEndSSLCipherSuiteOrder`, we recommend that you don't also enable **Minimum TLS Cipher Suite** for your web app. The result might be conflicting configurations. Configure only one of these options to manage cipher suite preferences.

## End-to-end TLS encryption

End-to-end (E2E) TLS encryption ensures that *front-end to worker communication* within Azure App Service is encrypted by using TLS. Without this feature, while incoming HTTPS requests are encrypted to the front ends, the traffic from front ends to workers running the application workloads would travel unencrypted inside Azure’s infrastructure.

E2E TLS helps ensure full encryption of traffic between:

- Clients and App Service front ends
- App Service front ends and worker processes hosting the application

This feature is available on:

- Premium App Service plans (recommended for new deployments)
- Legacy Standard App Service plans (existing users)

> [!IMPORTANT]
> Premium plans are recommended for new deployments that require E2E encryption and other advanced security features.

### Enable end-to-end TLS encryption

You can enable E2E TLS encryption via:

- Azure portal settings
- Azure CLI commands
- ARM templates for automation

After you enable E2E TLS encryption, all intra-cluster communications for your web app are encrypted by using TLS, ensuring end-to-end data protection.

## TLS/SSL certificates on App Service

To serve HTTPS traffic, App Service requires a TLS/SSL certificate that is bound to your custom domain. App Service offers multiple certificate options, ranging from fully managed free certificates to customer-managed certificates.

### Types of certificates

- **App Service managed certificates** (Free)  
  - Provided at no cost.  
  - Fully managed by Azure App Service, including automatic renewal.  
  - Customers cannot access, export, or use these certificates outside of App Service.  
  - Doesn't support wildcard or custom root CAs.

- **App Service certificates (ASC)**  
  - Paid certificates issued by GoDaddy.  
  - Customer owns and manages the certificate.  
  - Stored in the customer’s Key Vault (KV) and can be exported and used outside of App Service.  

- **Bring your own certificate (BYOC)**  
  - Upload and manage your own TLS/SSL certificates (**PFX format**).
  - Fully customer-managed.

Each of these options provides flexibility based on your security and management needs.

### Bind certificates to custom domains

After you upload or create a certificate, you bind it to a custom domain on your web app by using:

- SNI (Server Name Indication) SSL bindings for multitenant hosting
- IP SSL bindings for dedicated IP addresses

> [!NOTE]
> Azure-managed domains (such as `*.azurewebsites.net`) are automatically secured with default certificates, so no extra configuration is required.

## Mutual TLS (mTLS) authentication

Azure App Service supports *mutual TLS (mTLS)* on both Linux and Windows App Service plans, so apps can require client certificates for added security.

### How mTLS works

- Clients present certificates that are validated against a trusted CA chain that you configure.
- Only clients that have valid certificates can connect.
- It's commonly used to secure APIs and internal apps.

### Configuration options

- Enable mTLS by using the Azure portal, the Azure CLI, or ARM templates.
- Upload trusted CA certificates for client validation.
- Access client certificate information in app code via request headers.

## Automatic certificate management

Azure App Service provides built-in features to manage certificates automatically:

- **App Service managed certificates (free)**. Automatically issued and renewed for custom domains. These certificates are limited to basic domain validation and don't support wildcard or exportable certificates.

- **App Service certificates (paid)**. Fully managed certificates that support advanced scenarios, including wildcard domains and exportable certificates. These certificates are stored and managed in Azure Key Vault.

Azure App Service makes it easy to help secure your web apps by using TLS and SSL. With support for modern TLS versions, flexible certificate options, and advanced features like mutual TLS, App Service helps you protect data in transit and meet compliance requirements.

## Related content

- [Bind SSL certificates to your custom domain](configure-ssl-bindings.md)
- [Purchase and manage App Service certificates](configure-ssl-app-service-certificate.md)
- [Configure mutual TLS](app-service-web-configure-tls-mutual-auth.md)
- [Use certificates in app code](configure-ssl-certificate-in-code.md)

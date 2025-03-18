---
title: Overview of TLS/SSL for Azure App Service
description: Get an overview of TLS/SSL certificates in Azure App Service and understand how they secure your custom domains.
keywords: TLS/SSL certificates, Azure App Service security, HTTPS overview, domain encryption
ms.topic: overview
ms.date: 02/18/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: UpdateFrequency3
ms.collection: ce-skilling-ai-copilot
---
# TLS/SSL certificates for Azure App Service overview

Transport Layer Security (TLS) is a widely adopted security protocol that is designed to secure connections and communications between servers and clients. In Azure App Service, you can use TLS/Secure Sockets Layer (SSL) certificates to secure incoming requests to your web app. App Service currently supports different set of TLS features.

> [!NOTE]
> The [retirement of TLS 1.1 and TLS 1.0 on Azure services](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/) doesn't affect applications running on App Service, Azure Functions, or Azure Logic Apps (Standard). Applications on these Azure services that are configured to accept TLS 1.1 or TLS 1.0 for incoming requests *continue to run unaffected*.

> [!TIP]
>
> Try asking Azure Copilot these questions:
>
> - *What versions of TLS are supported in App Service?*
> - *What are the benefits of using TLS 1.3 over previous versions?*
> - *How can I change the cipher suite order for my Azure App Service Environment deployment?*
>
> To find Azure Copilot, in the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

## App Service supported TLS versions

For incoming requests to your web app, App Service supports TLS versions 1.3, TLS 1.2, TLS 1.1, and TLS 1.0.

## Minimum TLS versions

The following sections describe how to set the minimum TLS version in various scenarios.

### Set the minimum TLS version by using the Azure portal

To change the minimum TLS version of your App Service resource:

1. In the [Azure portal](https://portal.azure.com/), go to your app.
1. On the resource menu, select **Configuration**, and then select the **General settings** tab.
1. For **Minimum Inbound TLS Version**, select the version.
1. Select **Save**.

### Set the minimum TLS version by using Azure Policy

You can use Azure Policy to help you confirm that your resources to accept a minimum TLS version. To set the minimum TLS version for your app, go to [App Service apps should use the latest TLS version policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff0e6e85b-9b9f-4a4b-b67b-f730d42f1b0b). For similar policy definitions for other App Service resources, see [List of built-in policy definitions - Azure Policy for App Service](../governance/policy/samples/built-in-policies.md#app-service).

### Minimum TLS version and SCM minimum TLS version

You also can set your App Service apps to accept a minimum TLS version for incoming requests and a minimum TLS version for a Source Control Manager (SCM) site. By default, the minimum TLS version for incoming requests to your web app and to SCM site is set to TLS 1.2 in both the portal and the API.

## TLS 1.3

TLS 1.3 is the latest and most secure TLS version that App Service supports. It introduces significant security and performance improvements over TLS 1.2 by simplifying cryptographic algorithms, reducing handshake latency, and enhancing encryption.

Key benefits include:

- **Stronger security**: Removes outdated cipher suites, enforces Perfect Forward Secrecy (PFS), and encrypts more of the handshake process.
- **Faster handshake**: Reduces round trips, improving connection latency, especially for repeated sessions (0-RTT support).
- **Better performance**: Uses streamlined encryption algorithms that lower computational overhead and improve efficiency.
- **Enhanced privacy**: Encrypts handshake messages, reducing metadata exposure and mitigating downgrade attacks.

### Cipher suites  

A [minimum TLS cipher suite](#minimum-tls-cipher-suite) setting is available with TLS 1.3. The setting includes two cipher suites at the top of the cipher suite order:

- TLS_AES_256_GCM_SHA384  
- TLS_AES_128_GCM_SHA256

Because TLS 1.3 removes legacy cryptographic algorithms, we recommend that you use TLS 1.3 for applications that require modern security standards, improved performance, and reduced latency.

## TLS 1.2

TLS 1.2 is the default TLS version for Azure App Service. TLS 1.2 provides strong encryption, improved security over earlier versions, and compliance with industry standards like Payment Card Industry Data Security Standard (PCI DSS). Because TLS 1.2 is the default setting, no action is required unless you migrate from an earlier version of TLS. If your app currently uses TLS 1.1 or TLS 1.0, we recommend that you update to TLS 1.2 to maintain security, performance, and compliance. App Service supports a predefined set of TLS 1.2 cipher suites to ensure secure communication between clients and your web app.

## TLS 1.1 and TLS 1.0

TLS 1.1 and TLS 1.0 are considered legacy protocols and no longer secure. We recommend that you use TLS 1.2 as a minimum TLS version. When you create a web app, the setting for default minimum TLS version is TLS 1.2.

To ensure backward compatibility for TLS 1.1 and TLS 1.0, App Service continues to support TLS 1.1 and TLS 1.0 for incoming requests to your web app. Because the default minimum TLS version is set to TLS 1.2, in this scenario, you must update the minimum TLS version setting on your web app to either TLS 1.1 or TLS 1.0 so that the requests aren't rejected.

> [!IMPORTANT]
> Incoming requests to web apps and to Azure are handled differently.
>
> App Service continues to support TLS 1.1 and TLS 1.0 for incoming requests to *web apps*.
>
> For incoming requests to the *Azure control plane*, such as through Azure Resource Manager (ARM) or API calls, we recommend that you use TLS 1.2 at a minimum.
>

## Minimum TLS cipher suite

> [!NOTE]
> A minimum TLS cipher suite is supported on Basic SKUs and later on multitenant App Service.

The minimum TLS cipher suite includes a fixed list of cipher suites that has an optimal priority order that you can't change. Reordering or reprioritizing the cipher suites might expose your web apps to weaker encryption. We recommend that you use the default, optimal priority order.

You also can't add new or different cipher suites to this list. When you select a minimum cipher suite, the system automatically disables all cipher suites that are less secure for your web app. You can't selectively disable cipher suites.

### What are cipher suites and how do they work on App Service?

A cipher suite is a set of instructions that contains algorithms and protocols to help secure network connections between clients and servers. By default, the front-end operating system selects the most secure cipher suite that is supported by both App Service and the client. However, if the client supports only weak cipher suites, then the front-end operating system in that scenario would select a weak cipher suite that is supported by them both.

If your organization has restrictions on what cipher suites should not be allowed, you can update your web app’s minimum TLS cipher suite setting to ensure that cipher suites that are less secure are disabled for your web app.

### FrontEndSSLCipherSuiteOrder cluster setting

For App Service Environments that have the `FrontEndSSLCipherSuiteOrder` cluster setting, you must update your settings to include two TLS 1.3 cipher suites (TLS_AES_256_GCM_SHA384 and TLS_AES_128_GCM_SHA256). After you update, restart your front end for the change to take effect. You must still include the two required [cipher suites](#cipher-suites).

## End-to-end TLS encryption

End-to-end TLS encryption is available in Premium App Service plans (and in legacy Standard App Service plans). Front-end intra-cluster traffic between App Service front ends and the workers running application workloads now can be encrypted.

## Related content

- [Secure a custom DNS name by using a TLS/SSL binding](configure-ssl-bindings.md)

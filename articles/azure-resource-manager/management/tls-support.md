---
title: TLS version supported by Azure Resource Manager
description: Describes the deprecation of TLS versions prior to 1.2 in Azure Resource Manager
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 10/05/2023
---
# Migrating to TLS 1.2 for Azure Resource Manager

Transport Layer Security (TLS) is a security protocol that establishes encryption channels over computer networks. TLS 1.2 is the current industry standard and is supported by Azure Resource Manager. For backwards compatibility, Azure Resource Manager also supports earlier versions, such as TLS 1.0 and 1.1, but that support is ending.

To ensure that Azure is compliant with regulatory requirements, and provide improved security for our customers, **Azure Resource Manager will stop supporting protocols older than TLS 1.2 on September 30, 2024.**

This article provides guidance for removing dependencies on older security protocols.  

## Why migrate to TLS 1.2

TLS encrypts data sent over the internet to prevent malicious users from accessing private, sensitive information. The client and server perform a TLS handshake to verify each other's identity and determine how they'll communicate. During the handshake, each party identifies which TLS versions they use. The client and server can communicate if they both support a common version.

TLS 1.2 is more secure and faster than its predecessors.

Azure Resource Manager is the deployment and management service for Azure. You use Azure Resource Manager to create, update, and delete resources in your Azure account. To strengthen security and mitigate against any future protocol downgrade attacks, Azure Resource Manager will no longer support TLS 1.1 or earlier. To continue using Azure Resource Manager, make sure all of your clients that call Azure use TLS 1.2 or later.

## Prepare for migration to TLS 1.2

We recommend the following steps as you prepare to migrate your clients to TLS 1.2: 

* Update your operating system to the latest version.
* Update your development libraries and frameworks to their latest versions.

   For example, Python 3.6 and 3.7 support TLS 1.2.

* Fix hardcoded instances of security protocols older than TLS 1.2.
* Notify your customers and partners of your product or service's migration to TLS 1.2.

For a more detailed guidance, see the [checklist to deprecate older TLS versions](/security/engineering/solving-tls1-problem#figure-1-security-protocol-support-by-os-version) in your environment.

## Quick tips

* Windows 8+ has TLS 1.2 enabled by default.
* Windows Server 2016+ has TLS 1.2 enabled by default.
* When possible, avoid hardcoding the protocol version. Instead, configure your applications to always defer to your operating system's default TLS version.

   For example, you can enable the `SystemDefaultTLSVersion` flag in .NET Framework applications to defer to your operating system's default version. This approach lets your applications take advantage of future TLS versions.

   If you can't avoid hardcoding, specify TLS 1.2.

* Upgrade applications that target .NET Framework 4.5 or earlier. Instead, use .NET Framework 4.7 or later because these versions support TLS 1.2.

   For example, Visual Studio 2013 doesn't support TLS 1.2. Instead, use at least the latest release of Visual Studio 2017.

* You can use [Qualys SSL Labs](https://www.ssllabs.com/) to identify which TLS version is requested by clients connecting to your application.

* You can use [Fiddler](https://www.telerik.com/fiddler) to identify which TLS version your client uses when you send out HTTPS requests.

## Next steps

* [Solving the TLS 1.0 Problem, 2nd Edition](/security/engineering/solving-tls1-problem) – deep dive into migrating to TLS 1.2.
* [How to enable TLS 1.2 on clients](/mem/configmgr/core/plan-design/security/enable-tls-1-2-client) – for Microsoft Configuration Manager.
* [Configure Transport Layer Security (TLS) for a client application](../../storage/common/transport-layer-security-configure-client-version.md) – contains instructions to update TLS version in PowerShell 
* [Enable support for TLS 1.2 in your environment for Azure AD TLS 1.1 and 1.0 deprecation](/troubleshoot/azure/active-directory/enable-support-tls-environment) – contains information on updating TLS version for WinHTTP.
* [Transport Layer Security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls) – best practices when configuring security protocols for applications targeting .NET Framework.
* [TLS best practices with the .NET Framework](https://github.com/dotnet/docs/issues/4675) – GitHub to ask questions about best practices with .NET Framework.
* [Troubleshooting TLS 1.2 compatibility with PowerShell](https://github.com/microsoft/azure-devops-tls12) – probe to check TLS 1.2 compatibility and identify issues when incompatible with PowerShell.

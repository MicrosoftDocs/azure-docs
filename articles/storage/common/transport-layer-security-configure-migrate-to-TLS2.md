---
title: Migrating to TLS 1.2 for Azure Blob Storage
titleSuffix: Azure Storage
description: Put description here.
services: storage
author: normesta

ms.service: azure-storage
ms.topic: how-to
ms.date: 12/29/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.devlang: csharp
---

# Migrating to TLS 1.2 for Azure Blob Storage

Transport Layer Security (TLS) is an internet security protocol that establishes encryption channels over networks to encrypt communication between your applications and servers. Azure Blob Storage currently supports TLS 1.0 and 1.1 (for backward compatibility) and TLS 1.2 on public HTTPS endpoints. We are recommending that customers secure their infrastructure by using TLS 1.2 with Azure Storage. The older TLS versions (1.0 and 1.1) are being deprecated and removed to meet evolving technology and regulatory standards (FedRamp, NIST), and provide improved security for our customers.

Starting Nov 1, 2024, Azure Blob Storage will stop supporting older protocols TLS 1.0 and TLS1.1.  TLS 1.2 will be the new minimum TLS version.  This change impacts all existing and new blob storage accounts, using TLS 1.0 and 1.1 in all clouds. Storage accounts already using TLS 1.2 are not impacted by this change.
This article provides guidance for removing dependencies on TLS 1.0 and 1.1.

## Why migrate to TLS 1.2

When storage data is accessed via HTTPS connections, communication between client applications and the storage account is encrypted using TLS. TLS encrypts data sent over the internet to prevent malicious users from accessing private, sensitive information. The client and server perform a TLS handshake to verify each other's identity and determine how they'll communicate. During the handshake, each party identifies which TLS versions they use. The client and server can communicate if they both support a common version. 
TLS 1.2 is more secure and faster than TLS 1.0 and 1.1 which do not support modern cryptographic algorithms and cipher suites. While many customers using Azure storage are already using TLS 1.2, we are sharing further guidance to accelerate this transition for customers that are still using TLS 1.0 or 1.1.
To avoid disruptions to your applications connecting to Azure Storage, you must migrate to TLS 1.2 and remove dependencies on TLS version 1.0 and 1.1. Subsequent sections provide additional details on steps for moving to TLS 1.2.

## Prepare for migration to TLS1.2

We recommend the following steps as you prepare to migrate to TLS 1.2:

- Update your operating system to the latest version.

- Update your development libraries and frameworks to their latest versions. (For example, Python 3.6 and 3.7 support TLS 1.2).

- Enable Azure policy to enforce minimum TLS version and enable logging to identify requests using TLS 1.0 and 1.1. This will help identify TLS versions being used by clients. Learn more on how to [Enforce a minimum required version of Transport Layer Security (TLS) for incoming requests for Azure Storage](transport-layer-security-configure-minimum-version.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json#detect-the-tls-version-used-by-client-applications).

- Fix hardcoded instances of older security protocols TLS 1.0 and 1.1.

- Notify your customers and partners of your product or service's migration to TLS 1.2.

For more detailed guidance, see the [checklist to deprecate older TLS versions in your environment](../../security/engineering/solving-tls1-problem.md#figure-1-security-protocol-support-by-os-version).

## Quick Tips

- Windows 8+ has TLS 1.2 enabled by default.

- Windows Server 2016+ has TLS 1.2 enabled by default.

- When possible, avoid hardcoding the protocol version. Instead, configure your applications to always defer to your operating system's default TLS version.

- For example, you can enable the SystemDefaultTLSVersion flag in .NET Framework applications to defer to your operating system's default version. This approach lets your applications take advantage of future TLS versions.

- If you can't avoid hardcoding, specify TLS 1.2.

- Upgrade applications that target .NET Framework 4.5 or earlier. Instead, use .NET Framework 4.7 or later because these versions support TLS 1.2.

- For example, Visual Studio 2013 doesn't support TLS 1.2. Instead, use at least the latest release of Visual Studio 2017.

- Use [Qualys SSL Labs](https://www.ssllabs.com/) to identify which TLS version is requested by clients connecting to your application.

- Use [Fiddler](https://www.telerik.com/fiddler) to identify which TLS version your client uses when you send out HTTPS requests.

## Next steps

- [Solving the TLS 1.0 Problem, 2nd Edition](../../security/engineering/solving-tls1-problem.md) – deep dive into migrating to TLS 1.2.

- [How to enable TLS 1.2 on clients](/mem/configmgr/core/plan-design/security/enable-tls-1-2-client) – for Microsoft Configuration Manager.

- [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) – contains instructions to update TLS version in PowerShell

- [Enable support for TLS 1.2 in your environment for Azure AD TLS 1.1 and 1.0 deprecation](/troubleshoot/azure/active-directory/enable-support-tls-environment) – contains information on updating TLS version for WinHTTP.

- [Transport Layer Security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls) – best practices when configuring security protocols for applications targeting .NET Framework.

- [TLS best practices with the .NET Framework](https://github.com/dotnet/docs/issues/4675) – GitHub to ask questions about best practices with .NET Framework.

- [Troubleshooting TLS 1.2 compatibility with PowerShell](https://github.com/microsoft/azure-devops-tls12) – probe to check TLS 1.2 compatibility and identify issues when incompatible with PowerShell
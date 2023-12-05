---
title: Migrate to Transport Layer Security (TLS) 1.2 for Azure Blob Storage
titleSuffix: Azure Storage
description: Avoid disruptions to client applications that connect to your storage account by migrating to Transport Layer Security (TLS) version 1.2.
services: storage
author: normesta

ms.service: azure-storage
ms.topic: how-to
ms.date: 10/27/2023
ms.author: normesta
ms.subservice: storage-common-concepts
ms.devlang: csharp
---

# Migrate to TLS 1.2 for Azure Blob Storage

On **Nov 1, 2024**, Azure Blob Storage will stop supporting versions 1.0 and 1.1 of Transport Layer Security (TLS). TLS 1.2 will become the new minimum TLS version. This change impacts all existing and new blob storage accounts, using TLS 1.0 and 1.1 in all clouds. Storage accounts already using TLS 1.2 aren't impacted by this change.

To avoid disruptions to applications that connect to your storage account, you must ensure that your account requires clients to send and receive data by using TLS **1.2**, and remove dependencies on TLS version 1.0 and 1.1.

## About Transport Layer Security

Transport Layer Security (TLS) is an internet security protocol that establishes encryption channels over networks to encrypt communication between your applications and servers. When storage data is accessed via HTTPS connections, communication between client applications and the storage account is encrypted using TLS. 

TLS encrypts data sent over the internet to prevent malicious users from accessing private, sensitive information. The client and server perform a TLS handshake to verify each other's identity and determine how they communicate. During the handshake, each party identifies which TLS versions they use. The client and server can communicate if they both support a common version. 

## Why use TLS 1.2?

We're recommending that customers secure their infrastructure by using TLS 1.2 with Azure Storage. The older TLS versions (1.0 and 1.1) are being deprecated and removed to meet evolving technology and regulatory standards (FedRamp, NIST), and provide improved security for our customers. 

TLS 1.2 is more secure and faster than TLS 1.0 and 1.1, which don't support modern cryptographic algorithms and cipher suites. While many customers using Azure storage are already using TLS 1.2, we're sharing further guidance to accelerate this transition for customers that are still using TLS 1.0 or 1.1.

## Configure clients to use TLS 1.2

First, identify each client that makes requests to the Blob Storage service of your account. Then, ensure that each client uses TLS 1.2 to make those requests. 

For each client application, we recommend the following tasks.

- Update the operating system to the latest version.

- Update your development libraries and frameworks to their latest versions. (For example, Python 3.6 and 3.7 support TLS 1.2).

- Fix hardcoded instances of older security protocols TLS 1.0 and 1.1.

- Configure clients to use a TLS 1.2. See [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). 

For more detailed guidance, see the [checklist to deprecate older TLS versions in your environment](/security/engineering/solving-tls1-problem#figure-1-security-protocol-support-by-os-version).

> [!IMPORTANT] 
> Notify your customers and partners of your product or service's migration to TLS 1.2 so that they can make the necessary changes to their applications.

## Enforce TLS 1.2 as the minimum allowed version

In advance of the deprecation date, you can enable Azure policy to enforce minimum TLS version. 

To understand how configuring the minimum TLS version might affect client applications, we recommend that you enable logging for your Azure Storage account and analyze the logs after an interval of time to detect what versions of TLS client applications are using.

When you're confident that traffic from clients using older versions of TLS is minimal, or that it's acceptable to fail requests made with an older version of TLS, then you can begin enforcement of a minimum TLS version on your storage account. 

To learn how to detect the TLS versions used by client applications, and then enforce TLS 1.2 as the minimum allowed version, see [Enforce a minimum required version of Transport Layer Security (TLS) for incoming requests for Azure Storage](transport-layer-security-configure-minimum-version.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json#detect-the-tls-version-used-by-client-applications).


## Quick Tips

- Windows 8+ has TLS 1.2 enabled by default.

- Windows Server 2016+ has TLS 1.2 enabled by default.

- When possible, avoid hardcoding the protocol version. Instead, configure your applications to always defer to your operating system's default TLS version.

- For example, you can enable the SystemDefaultTLSVersion flag in .NET Framework applications to defer to your operating system's default version. This approach lets your applications take advantage of future TLS versions.

- If you can't avoid hardcoding, specify TLS 1.2.

- Upgrade applications that target .NET Framework 4.5 or earlier. Instead, use .NET Framework 4.7 or later because these versions support TLS 1.2.

  For example, Visual Studio 2013 doesn't support TLS 1.2. Instead, use at least the latest release of Visual Studio 2017.

- Use [Qualys SSL Labs](https://www.ssllabs.com/) to identify which TLS version is requested by clients connecting to your application.

- Use [Fiddler](https://www.telerik.com/fiddler) to identify which TLS version your client uses when you send out HTTPS requests.

## Next steps

- [Solving the TLS 1.0 Problem, 2nd Edition](/security/engineering/solving-tls1-problem) – deep dive into migrating to TLS 1.2.

- [How to enable TLS 1.2 on clients](/mem/configmgr/core/plan-design/security/enable-tls-1-2-client) – for Microsoft Configuration Manager.

- [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) – contains instructions to update TLS version in PowerShell

- [Enable support for TLS 1.2 in your environment for Microsoft Entra ID TLS 1.1 and 1.0 deprecation](/troubleshoot/azure/active-directory/enable-support-tls-environment) – contains information on updating TLS version for WinHTTP.

- [Transport Layer Security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls) – best practices when configuring security protocols for applications targeting .NET Framework.

- [TLS best practices with the .NET Framework](https://github.com/dotnet/docs/issues/4675) – GitHub to ask questions about best practices with .NET Framework.

- [Troubleshooting TLS 1.2 compatibility with PowerShell](https://github.com/microsoft/azure-devops-tls12) – probe to check TLS 1.2 compatibility and identify issues when incompatible with PowerShell
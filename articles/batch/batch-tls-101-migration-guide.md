---
title: Migrate client code to TLS 1.2 in Azure Batch
description: Learn how to migrate client code to TLS 1.2 in Azure Batch to plan for end of support for TLS 1.0 and TLS 1.1.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 08/16/2022
---

# Migrate client code to TLS 1.2 in Batch

To support security best practices and remain in compliance with industry standards, Azure Batch will retire Transport Layer Security (TLS) 1.0 and TLS 1.1 in Azure Batch on *March 31, 2023*. Learn how to migrate to TLS 1.2 in the client code you manage by using Batch.

## End of support for TLS 1.0 and TLS 1.1 in Batch

TLS versions 1.0 and TLS 1.1 are known to be susceptible to BEAST and POODLE attacks and to have other Common Vulnerabilities and Exposures (CVE) weaknesses. TLS 1.0 and TLS 1.1 don't support the modern encryption methods and cipher suites that the Payment Card Industry (PCI) compliance standards recommends. Microsoft is participating in an industry-wide push toward the exclusive use of TLS version 1.2 or later.

Most customers have already migrated to TLS 1.2. Customers who continue to use TLS 1.0 or TLS 1.1 can be identified via existing BatchOperation data. If you're using TLS 1.0 or TLS 1.1, to avoid disruption to your Batch workflows, update existing workflows to use TLS 1.2.

## Alternative: Use TLS 1.2

To avoid disruption to your Batch workflows, you must update your client code to use TLS 1.2 before the TLS 1.0 and TLS 1.1 retirement in Batch on March 31, 2023.

For specific development use cases, see the following information:

- If you use native WinHTTP for your client application code, see the guidance in [Update to enable TLS 1.1 and TLS 1.2 as default security protocols](https://support.microsoft.com/topic/update-to-enable-tls-1-1-and-tls-1-2-as-default-secure-protocols-in-winhttp-in-windows-c4bd73d2-31d7-761e-0178-11268bb10392).

- If you use the .NET Framework for your client application code, upgrade to .NET 4.7 or later. Beginning in .NET 4.7, TLS 1.2 is enforced by default.

- If you use the .NET Framework and you *can't* upgrade to .NET 4.7 or later, see the guidance in [TLS for network programming](/dotnet/framework/network-programming/tls) to enforce TLS 1.2.

For more information, see [TLS best practices for the .NET Framework](/dotnet/framework/network-programming/tls).

## FAQs

- Why do I need to upgrade to TLS 1.2?

   TLS 1.0 and TLS 1.1 have security issues that are fixed in TLS 1.2. TLS 1.2 has been available since 2008. TLS 1.2 is the current default version in most development frameworks.

- What happens if I don’t upgrade?

   After the feature retirement from Azure Batch, your client application won't work until you upgrade the code to use TLS 1.2.

- Will upgrading to TLS 1.2 affect the performance of my application?

   Upgrading to TLS 1.2 won't affect your application's performance.

- How do I know if I’m using TLS 1.0 or TLS 1.1?

   To determine the TLS version you're using, check the audit log for your Batch deployment.

## Next steps

For more information, see [Enable TLS 1.2 on clients](/mem/configmgr/core/plan-design/security/enable-tls-1-2-client).

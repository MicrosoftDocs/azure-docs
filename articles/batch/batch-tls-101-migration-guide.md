---
title: Batch Tls 1.0 Migration Guide
description: Describes the migration steps for the batch TLS 1.0 and the end of support details.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/16/2022
---
# Batch TLS 1.0 Migration Guide

Transport Layer Security (TLS) versions 1.0 and 1.1 are known to be susceptible to attacks such as BEAST and POODLE, and to have other Common Vulnerabilities and Exposures (CVE) weaknesses. They also don't support the modern encryption methods and cipher suites recommended by Payment Card Industry (PCI) compliance standards. There's an industry-wide push toward the exclusive use of TLS version 1.2 or later.

To follow security best practices and remain in compliance with industry standards, Azure Batch will retire Batch TLS 1.0/1.1 on **31 March 2023**. Most customers have already migrated to TLS 1.2. Customers who continue to use TLS 1.0/1.1 can be identified via existing BatchOperation telemetry. Customers will need to adjust their existing workflows to ensure that they're using TLS 1.2. Failure to migrate to TLS 1.2 will break existing Batch workflows.

## Migration strategy

Customers must update client code before the TLS 1.0/1.1 retirement. 

- Customers using native WinHTTP for client code can follow this [guide](https://support.microsoft.com/topic/update-to-enable-tls-1-1-and-tls-1-2-as-default-secure-protocols-in-winhttp-in-windows-c4bd73d2-31d7-761e-0178-11268bb10392). 

- Customers using .NET framework for their client code should upgrade to .NET > 4.7, that which enforces TLS 1.2 by default. 

- For customers on .NET framework who are unable to upgrade to > 4.7, please follow this [guide](https://docs.microsoft.com/dotnet/framework/network-programming/tls) to enforce TLS 1.2.

For TLS best practices, refer to [TLS best practices for .NET framework](https://docs.microsoft.com/dotnet/framework/network-programming/tls).

## FAQ

* Why must we upgrade to TLS 1.2?<br>
   TLS 1.0/1.1 has security issues that are fixed in TLS 1.2. TLS 1.2 has been available since 2008 and is the current default version in most frameworks.

* What happens if I don’t upgrade?<br>
   After the feature retirement, our client application won't work until you upgrade.<br>

* Will Upgrading to TLS 1.2 affect the performance?<br>
   Upgrading to TLS 1.2 won't affect performance.<br>

* How do I know if I’m using TLS 1.0/1.1?<br>
   You can check the Audit Log to determine the TLS version you're using.

## Next steps

For more information, see [How to enable TLS 1.2 on clients](https://docs.microsoft.com/mem/configmgr/core/plan-design/security/enable-tls-1-2-client).

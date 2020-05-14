---
title: Notification Hubs TLS updates
description: Learn about support for TLS in Azure Notification Hubs.
services: notification-hubs
documentationcenter: .net
author: sethmanheim
manager: femila

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: multiple
ms.topic: article
ms.date: 04/29/2020
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 01/28/2020
---

# Transport Layer Security (TLS)

To ensure a higher level of security, Notification Hubs will disable support for TLS versions 1.0 and 1.1 on **December 31, 2020** (extended from April 30, 2020). These older protocols deliver weak cryptography, and are vulnerable to BEAST and POODLE attacks. Applications deployed to devices running Android version 5 or greater, or iOS version 5 or greater, are not impacted by this change as those operating systems support TLS 1.2 and the client and server will negotiate the highest mutually supported version of the protocol upon connection.

We recommend that you review your all of your applications that use Azure Notification Hubs, to ensure that they use the most applicable libraries and TLS stacks that support TLS 1.2.

## Update apps

You can ensure that your iOS apps are using TLS 1.2 using Apple's networking security feature called App Transport Security (ATS). ATS cannot be used for SDKs older than iOS 9.0 or macOS 10.11, and you can read further about it from [Apple's documentation](https://developer.apple.com/documentation/security/preventing_insecure_network_connections).

For Android applications using SSLSocket instances, set enabled protocols on each SSLSocket instance as noted in [setEnabledProtocols](https://developer.android.com/reference/javax/net/ssl/SSLSocket#setEnabledProtocols(java.lang.String%5B%5D)).

The table on the [TLS Protocol Compatibility](https://support.globalsign.com/customer/portal/articles/2934392-tls-protocol-compatibility) support page helps map operating systems with compatible TLS versions.

For more information, see the overview of the [support for TLS protocols on Windows](https://docs.microsoft.com/archive/blogs/kaushal/support-for-ssltls-protocols-on-windows).

## Next steps

- [Notification Hubs overview](notification-hubs-push-notification-overview.md)
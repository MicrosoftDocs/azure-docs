---
title: Troubleshoot MSAL for Objective-C issues | Microsoft identity platform
description: Learn what to do about various problems using SSL certificates with the MSAL.Objective-C library.
services: active-directory
documentationcenter: ''
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/12/2019
ms.author: twhitney
ms.reviewer: ''
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: Troubleshoot MSAL for Objective-C issues

This article provides information to help you troubleshoot issues that you may come across while using the Objective-C [Microsoft Authentication Library (MSAL)](reference-v2-libraries.md)

## Network issues

**Error -1200**: "An SSL error has occurred and a secure connection to the server can't be made."  This error is from Apple's networking library. A full list of NSURL error codes is in NSURLError.h in the macOS and iOS SDKs.

This error means that the connection isn't secure. It occurs when a certificate is invalid. Refer to `NSURLErrorFailingURLErrorKey` in the `userInfo` dictionary of the error object for more details, including which server is failing the SSL check.

## Certificate issues

If the URL providing an invalid certificate connects to the server that you intend to use as part of the authentication flow, a good start to diagnosing the problem is to test the URL with a SSL validation service such as [Qualys SSL Labs Analyzer](https://www.ssllabs.com/ssltest/analyze.html). It tests the server against a wide array of scenarios and browsers and checks for many known vulnerabilities.

By default, Apple's new [App Transport Security (ATS)](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW35) feature applies more stringent security policies to apps that use SSL certificates. Some operating systems and web browsers have started enforcing some of these policies by default. For security reasons, we recommend you not disable ATS.

Certificates using SHA-1 hashes have known vulnerabilities. Most modern web browsers don't allow certificates with SHA-1 hashes.

## Captive Portals

A captive portal presents a web page to a user when they first access a Wi-Fi network and haven't yet been granted access to that network. It intercepts their internet traffic until the user satisfies the requirements of the portal. Network errors resulting from the user not being able to connect to network resources are expected until the user connects through the portal.

## Next steps

Learn about [captive portals](https://en.wikipedia.org/wiki/Captive_portal) and Apple's new [App Transport Security (ATS)](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW35) feature.
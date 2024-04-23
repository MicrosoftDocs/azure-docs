---
title: Trusted Signing trust models
description: Trusted Signing is a fully managed end-to-end service for signing. Managed as an Azure resource, the service functions through the familiar tenant and subscription management experiences. In this article, learn what a trust model is, the two primary trust models provided in Trusted Signing (Public-Trust and Private-Trust), and the signing scenarios and security features that each of the Trusted Signing trust models support.
author: ianjmcm
ms.author: ianmcm
ms.service: trusted-signing
ms.topic: concept-article
ms.date: 04/03/2024
ms.custom: template-concept
---

# Trusted Signing trust models

This article explains the concept of trust models, the primary trust models that Trusted Signing provides, and how to leverage them across a wide variety of signing scenarios supported by Trusted Signing. 

## Overview

A trust model defines the rules and mechanisms for validating digital signatures and ensuring the security of communications in a digital environment. In other words, trust models define how trust is established and maintained within entities in a digital ecosystem.

For signature consumers like publicly trusted code signing for Microsoft Windows applications, trust models depend on signatures that have certificates from a Certification Authority (CA) that is part of the [Microsoft Root Certificate Program](/security/trusted-root/program-requirements). This is primarily why Trusted Signing trust models are designed to support Windows Authenticode signing and security features that use code signing on Windows (e.g. [Smart App Control](/windows/apps/develop/smart-app-control/overview) and [Windows Defender Application Control](/windows/security/application-security/application-control/windows-defender-application-control/wdac)).

Trusted Signing provides two primary trust models to support a wide variety of signature consumption (validations): 

- [Public-Trust](#public-trust)
- [Private-Trust](#private-trust)

> [!NOTE]
> Subscribers to Trusted Signing aren't limited to the signing scenarios application of the trust models shared in this article. Trusted Signing was designed to support Windows > Authenticode code signing and App Control for Business features in Windows with an ability to broadly support other signing and trust models beyond Windows. 

## Public-Trust

Public-Trust is one of the models provided in Trusted Signing and is the most commonly used model. The certificates in the Public-Trust model are issued from the [Microsoft Identity Verification Root Certificate Authority 2020](https://www.microsoft.com/pkiops/certs/microsoft%20identity%20verification%20root%20certificate%20authority%202020.crt) and complies with the [Microsoft PKI Services Third Party Certification Practice Statement (CPS)](https://www.microsoft.com/pkiops/docs/repository.htm). This root CA is included a relying party's root certificate program such as the [Microsoft Root Certificate Program](/security/trusted-root/program-requirements) for the usage of code signing and timestamping. 

The Public-Trust resources in Trusted Signing are designed to support the following signing scenarios and security features:

- [Win32 App Code Signing](/windows/win32/seccrypto/cryptography-tools#introduction-to-code-signing)
- [Windows 11 Smart App Control](/windows/apps/develop/smart-app-control/code-signing-for-smart-app-control)
- [/INTEGRITYCHECK - Forced Integrity Signing for PE binaries](/cpp/build/reference/integritycheck-require-signature-check)
- [Virtualization Based Security (VBS) Enclaves](/windows/win32/trusted-execution/vbs-enclaves)

Public-Trust is recommended for signing any artifact that is to be shared publicly and for the signer to be a validated legal organization or individual. 

> [!NOTE]
> Trusted Signing includes options for "Test" Certificate Profiles under the Public-Trust collection, but the certificates are not publicly trusted. These "Test" Certificate Profiles are intended to be used for inner loop dev/test signing and should NOT be trusted.

## Private-Trust

Private-Trust is the other trust model provided in Trusted Signing. It's for opt-in trust where the signatures aren't broadly trusted across the ecosystem. The CA hierarchy used for Trusted Signing's Private-Trust resources isn't default trusted in any root program and in Windows. Rather, it's specifically designed for use in [App Control for Windows (formerly known as Windows Defender Application Control)](/windows/security/application-security/application-control/windows-defender-application-control/wdac) features including:


* [Use code signing for added control and protection with WDAC](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-code-signing-for-better-control-and-protection)
* [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
* [Optional: Create a code signing cert for Windows Defender Application Control](/windows/security/application-security/application-control/windows-defender-application-control/deployment/create-code-signing-cert-for-wdac)

For more information on how to configure and sign WDAC Policy with Trusted Signing reference, [Quickstart Guide](./quickstart.md) 

## Next steps
* Get started with Trusted Signing's [Quickstart Guide](./quickstart.md)

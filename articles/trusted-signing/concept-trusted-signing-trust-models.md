---
title: Trusted Signing trust models
description: Learn what a trust model is, understand the two primary trust models in Trusted Signing, and learn about the signing scenarios and security features that each supports.
author: ianjmcm
ms.author: ianmcm
ms.service: trusted-signing
ms.topic: concept-article
ms.date: 04/03/2024
ms.custom: template-concept
---

# Trusted Signing trust models

This article explains the concept of trust models, the primary trust models that Trusted Signing provides, and how to use them in a wide variety of signing scenarios that Trusted Signing supports.

## Trust models

A trust model defines the rules and mechanisms for validating digital signatures and ensuring the security of communications in a digital environment. Trust models define how trust is established and maintained within entities in a digital ecosystem.

For signature consumers like publicly trusted code signing for Microsoft Windows applications, trust models depend on signatures that have certificates from a Certification Authority (CA) that is part of the [Microsoft Root Certificate Program](/security/trusted-root/program-requirements). For this reason, Trusted Signing trust models are designed primarily to support Windows Authenticode signing and security features that use code signing on Windows (for example, [Smart App Control](/windows/apps/develop/smart-app-control/overview) and [Windows Defender Application Control](/windows/security/application-security/application-control/windows-defender-application-control/wdac)).

Trusted Signing provides two primary trust models to support a wide variety of signature consumption (*validations*):

- [Public Trust](#public-trust-model)
- [Private Trust](#private-trust-model)

> [!NOTE]
> You aren't limited to applying the trust models that are used in the signing scenarios described in this article. Trusted Signing was designed to support Windows and Authenticode code signing and Application Control for Windows features. It broadly supports other signing and trust models beyond Windows.

## Public Trust model

Public Trust is one of the two trust models that are provided in Trusted Signing and is the most commonly used model. The certificates in the Public Trust model are issued from the [Microsoft Identity Verification Root Certificate Authority 2020](https://www.microsoft.com/pkiops/certs/microsoft%20identity%20verification%20root%20certificate%20authority%202020.crt) and comply with the [Microsoft PKI Services Third-Party Certification Practice Statement (CPS)](https://www.microsoft.com/pkiops/docs/repository.htm). This root CA is included in a relying party's root certificate program, such as the [Microsoft Root Certificate Program](/security/trusted-root/program-requirements), for code signing and time stamping.

Public Trust resources in Trusted Signing are designed to support the following signing scenarios and security features:

- [Win32 app code signing](/windows/win32/seccrypto/cryptography-tools#introduction-to-code-signing)
- [Smart App Control in Windows 11](/windows/apps/develop/smart-app-control/code-signing-for-smart-app-control)
- [/INTEGRITYCHECK forced integrity signing for portable executable (PE) binaries](/cpp/build/reference/integritycheck-require-signature-check)
- [Virtualization-based security (VBS) enclaves](/windows/win32/trusted-execution/vbs-enclaves)

We recommend that you use Public Trust to sign any artifact that you want to share publicly. The signer should be a validated legal organization or individual.

> [!NOTE]
> Trusted Signing includes options for "test" certificate profiles under the Public Trust collection, but the certificates are not publicly trusted. The Public Trust Test certificate profiles are intended to be used for inner-loop dev/test signing and should *not* be trusted.

## Private Trust model

Private Trust is the second trust model that's provided in Trusted Signing. It's for opt-in trust when signatures aren't broadly trusted across the ecosystem. The CA hierarchy that's used for Trusted Signing Private Trust resources isn't default-trusted in any root program and in Windows. Rather, it's designed to use in [App Control for Business (formerly Windows Defender Application Control, *WDAC*)](/windows/security/application-security/application-control/windows-defender-application-control/wdac) features, including:

- [Use code signing for added control and protection with WDAC](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-code-signing-for-better-control-and-protection)
- [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
- [Optional: Create a code signing cert for Windows Defender Application Control](/windows/security/application-security/application-control/windows-defender-application-control/deployment/create-code-signing-cert-for-wdac)

For more information about how to configure and sign WDAC policies by using a Trusted Signing reference, see the [Trusted Signing quickstart](./quickstart.md).

## Next step

>[!div class="nextstepaction"]
>[Set up Trusted Signing](./quickstart.md)

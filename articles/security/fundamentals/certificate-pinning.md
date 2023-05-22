---
title: Certificate pinning
titleSuffix: Certificate pinning and Azure services
description: Information about the history, usage, and risks of certificate pinning.
services: security
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 04/11/2023
ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: quentinb
---

# What is Certificate pinning?

Certificate Pinning is a security technique where only authorized, or *pinned*, certificates are accepted when establishing a secure session. Any attempt to establish a secure session using a different certificate is rejected.

## Certificate pinning history
Certificate pinning was originally devised as a means of thwarting Man-in-the-Middle (MITM) attacks. Certificate pinning first became popular in 2011 as the result of the DigiNotar Certificate Authority (CA) compromise, where an attacker was able to create wildcard certificates for several high-profile websites including Google. Chrome was updated to "pin" the current certificates for Google's websites and would reject any connection if a different certificate was presented. Even if an attacker found a way to convince a CA into issuing a fraudulent certificate, it would still be recognized by Chrome as invalid, and the connection rejected.

Though web browsers such as Chrome and Firefox were among the first applications to implement this technique, the range of use cases rapidly expanded. Internet of Things (IoT) devices, iOS and Android mobile apps, and a disparate collection of software applications began using this technique to defend against Man-in-the-Middle attacks.

For several years, certificate pinning was considered good security practice. Oversight over the public Public Key Infrastructure (PKI) landscape has improved with transparency into issuance practices of publicly trusted CAs.

## How to address certificate pinning in your application

Typically, an application contains a list of authorized certificates or properties of certificates including Subject Distinguished Names, thumbprints, serial numbers, and public keys. Applications may pin against individual leaf or end-entity certificates, subordinate CA certificates, or even Root CA certificates.

If your application explicitly specifies a list of acceptable CAs, you may periodically need to update pinned certificates when Certificate Authorities change or expire. To detect certificate pinning, we recommend the taking the following steps:

- If you're an application developer, search your source code for any of the following references for the CA that is changing or expiring. If there's a match, update the application to include the missing CAs.
    - Certificate thumbprints
    - Subject Distinguished Names
    - Common Names
    - Serial numbers
    - Public keys
    - Other certificate properties

- If you have an application that integrates with Azure APIs or other Azure services and you're unsure if it uses certificate pinning, check with the application vendor.

## Certificate pinning limitations
The practice of certificate pinning has become widely disputed as it carries unacceptable certificate agility costs. One specific implementation, HTTP Public Key Pinning (HPKP), has been deprecated altogether

As there's no single web standard for how certificate pinning is performed, we can't offer direct guidance in detecting its usage. While we don't recommend against certificate pinning, customers should be aware of the limitations this practice creates if they choose to use it.

- Ensure that the pinned certificates can be updated on short notice.
- Industry requirements, such as the [CA/Browser Forum’s Baseline Requirements for the Issuance and Management of Publicly-Trusted Certificates](https://cabforum.org/about-the-baseline-requirements/) require rotating and revoking certificates in as little as 24 hours in certain situations.

## Next steps

- [Check the Azure Certificate Authority details for upcoming changes](azure-CA-details.md)
- [Review the Azure Security Fundamentals best practices and patterns](best-practices-and-patterns.md)
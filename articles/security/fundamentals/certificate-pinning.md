---
title: Certificate pinning
titleSuffix: Certificate pinning and Azure services
description: Learn about certificate pinning history, limitations, Azure service considerations, and how to address certificate pinning in applications.
ms.service: security
ms.subservice: security-fundamentals
ms.topic: concept-article
ms.date: 12/06/2023
author: msmbaldwin
ms.author: mbaldwin
manager: femila
ms.reviewer: quentinb
ai-usage: ai-assisted
---

# What is certificate pinning?

Certificate pinning is a security technique in which a client accepts only authorized, or *pinned*, certificates when establishing a secure session. The client rejects any attempt to establish a secure session by using a different certificate.

## Certificate pinning history

The security community originally devised certificate pinning as a way to thwart man-in-the-middle (MITM) attacks. Certificate pinning first became popular in 2011 as the result of the DigiNotar certificate authority (CA) compromise, where an attacker created wildcard certificates for several high-profile websites, including Google. Google updated Chrome to pin the current certificates for Google's websites and reject any connection that presented a different certificate. Even if an attacker convinced a CA to issue a fraudulent certificate, Chrome would recognize it as invalid and reject the connection.

Though web browsers such as Chrome and Firefox were among the first applications to implement this technique, the range of use cases rapidly expanded. Internet of Things (IoT) devices, iOS and Android mobile apps, and a disparate collection of software applications began to use this technique to defend against man-in-the-middle attacks.

For several years, certificate pinning was good security practice. Improved oversight over the public key infrastructure (PKI) landscape provides more transparency into issuance practices of publicly trusted CAs.

## How to address certificate pinning in your application

Typically, an application contains a list of authorized certificates or properties of certificates including Subject Distinguished Names, thumbprints, serial numbers, and public keys. Applications might pin against individual leaf or end-entity certificates, subordinate CA certificates, or even Root CA certificates.

If your application explicitly specifies a list of acceptable CAs, you might need to periodically update pinned certificates when certificate authorities change or expire. To detect certificate pinning, take the following steps:

- If you're an application developer, search your source code for any of the following references for the CA that is changing or expiring. If there's a match, update the application to include the missing CAs.
    - Certificate thumbprints
    - Subject Distinguished Names
    - Common Names
    - Serial numbers
    - Public keys
    - Other certificate properties

- If your custom client application integrates with Azure APIs or other Azure services and you're unsure if it uses certificate pinning, check with the application vendor.

## Certificate pinning limitations

The practice of certificate pinning is widely disputed because it carries unacceptable certificate agility costs. One specific implementation, HTTP Public Key Pinning (HPKP), is deprecated altogether.

Because no single web standard defines how applications perform certificate pinning, Microsoft doesn't offer direct guidance for detecting its usage. While Microsoft doesn't recommend against certificate pinning, be aware of the limitations this practice creates if you choose to use it.

- Ensure that the pinned certificates can receive updates on short notice.
- Industry requirements, such as the [CA/Browser Forum’s Baseline Requirements for the Issuance and Management of Publicly-Trusted Certificates](https://cabforum.org/about-the-baseline-requirements/), require rotating and revoking certificates in as little as 24 hours in certain situations.

## Next steps

- [Check the Azure Certificate Authority details for upcoming changes](azure-certificate-authority-details.md)
- [Review the Azure Security Fundamentals best practices and patterns](best-practices-and-patterns.md)..

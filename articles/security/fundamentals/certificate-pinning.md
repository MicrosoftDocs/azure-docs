---
title: Certificate pinning
titleSuffix: Certificate pinning and Azure services
description: Learn why static certificate pinning is no longer recommended for publicly trusted TLS certificates, when pinning is appropriate, and Azure's guidance.
ms.service: security
ms.subservice: security-fundamentals
ms.topic: concept-article
ms.date: 08/26/2026
author: msmbaldwin
ms.author: mbaldwin
manager: femila
ms.reviewer: quentinb
ai-usage: ai-assisted
---

# Certificate pinning

## What is certificate pinning?

Certificate pinning is a security technique that restricts which certificates or certificate authorities (CAs) a client accepts when establishing a secure session. The client trusts only specifically *pinned* certificates or issuers and rejects any other certificate. The security community originally introduced pinning to help defend against man-in-the-middle (MITM) attacks, particularly after high-profile CA compromises.

## Certificate pinning and the public Web PKI

This article focuses on publicly trusted TLS server certificates issued through the public Web PKI.

A global ecosystem of CAs, browser root programs, industry standards bodies, and operating system vendors operates the public Web PKI. Certificate chains, issuing CAs, trust anchors, and certificate lifetimes evolve over time in response to security incidents, compliance requirements, and ecosystem changes.

This guidance doesn't apply to private PKIs or other controlled trust environments where an organization owns the complete certificate lifecycle, trust distribution model, and incident response process.

## Why static pinning is no longer recommended for publicly trusted certificates

While certificate pinning was once a best practice, the security landscape evolved. Today, Microsoft, AWS, DigiCert, Cloudflare, Google, and security organizations such as OWASP widely discourage static pinning (hardcoding certificates or CAs in code or configuration).

The primary concern isn't that certificate pinning is ineffective. Rather, in the public Web PKI it often introduces more operational risk than security benefit.

- **Operational risk:** You must rotate certificates and CAs regularly for security and compliance. Static pinning makes these changes difficult, leading to service outages when you update or replace certificates.
- **Lack of agility:** The public Web PKI evolves continuously. The ecosystem might introduce new roots, intermediates, certificate profiles, and trust requirements as part of normal operation. Pinned applications can fail if they aren't updated in step with these changes.
- **Complexity and maintenance:** Managing and updating pins across distributed applications is error-prone and difficult to scale. Failure to update pins promptly can result in service disruption.
- **Industry consensus:** Major cloud providers and security standards bodies now recommend against static pinning for publicly trusted certificates except in rare, highly controlled scenarios.

## Azure guidance

**Azure recommends against static pinning of publicly trusted TLS server certificates.**

Applications that connect to Azure services should rely on standard TLS validation, platform-managed trust stores, Certificate Transparency, and other modern Web PKI protections rather than pinning publicly trusted certificates or certificate authorities.

The public Web PKI is externally governed and changes over time. You can't control when certificate authorities rotate keys, when browser root programs update trust requirements, when certificate chains change, or when ecosystem-wide security events require a rapid response. Static pinning creates dependencies on these external components and can result in service outages when changes occur.

## When pinning might be appropriate

Don't interpret this guidance as a recommendation against all forms of certificate pinning.

Pinning can be a valid security control when the organization deploying the system controls the complete trust model and certificate lifecycle. Examples include:

- Private PKIs
- Enterprise trust hierarchies
- Device identity systems
- Controlled mutual-authentication environments

In these scenarios, the organization owns the associated operational risk and can coordinate certificate lifecycle changes within its own trust boundary.

## Risks and limitations of static pinning

- **Service outages:** Pinned applications can fail when certificates are rotated, revoked, replaced, or migrated to new issuing hierarchies.
- **Maintenance burden:** Keeping pins current requires continuous monitoring and rapid updates.
- **Reduced agility:** Static pinning can delay or block security improvements, certificate authority migrations, and ecosystem-driven trust changes.
- **Limited security benefit:** Public cloud services might use shared certificate authorities. Pinning to a public CA doesn't guarantee exclusivity and might not provide the expected security benefit.

## Related content

- [Azure Certificate Authority details](/azure/security/fundamentals/azure-certificate-authority-details)
- [OWASP: Certificate and Public Key Pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning)
- [Apple Developer: Identity Pinning](https://developer.apple.com/news/?id=g9ejcf8y)
- [AWS Certificate Manager Best Practices](https://docs.aws.amazon.com/acm/latest/userguide/acm-bestpractices.html)
- [Cloudflare: Avoiding Downtime: Modern Alternatives to Outdated Certificate Pinning Practices](https://blog.cloudflare.com/why-certificate-pinning-is-outdated/)
- [Chromium: Intent to Deprecate and Remove Public Key Pinning](https://groups.google.com/a/chromium.org/g/blink-dev/c/he9tr7p3rZ8)
- [DigiCert: Stop Certificate Pinning](https://www.digicert.com/blog/certificate-pinning-what-is-certificate-pinning)

---
title: What's New in Azure Cache for Redis
description: Recent updates for Azure Cache for Redis
author: yegu-ms

ms.service: cache
ms.topic: reference
ms.date: 09/28/2020
ms.author: yegu

#Customer intent: As a user of Azure Cache for Redis, I want to find out what're the latest changes in the service.

---

# What's New in Azure Cache for Redis

## Azure TLS Certificate Change

Microsoft is updating Azure services to use TLS server certificates from a different set of Certificate Authorities (CAs). This change is rolled out in phases from August 13, 2020 to October 26, 2020 (estimated). Azure is making this change because [the current CA certificates don't comply with one of the CA/Browser Forum Baseline requirements](https://bugzilla.mozilla.org/show_bug.cgi?id=1649951). The problem was reported on July 1, 2020 and applies to multiple popular Public Key Infrastructure (PKI) providers worldwide. Most TLS certificates used by Azure services today come from the *Baltimore CyberTrust Root* PKI. The Azure Cache for Redis service will continue to be chained to the Baltimore CyberTrust Root. Its TLS server certificates, however, will be issued by new Intermediate Certificate Authorities (ICAs) starting on October 12, 2020.

> [!NOTE]
> This change is limited to services in public [Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/). It excludes sovereign (e.g., China) or government clouds.
>
>

### Does this change affect me?

We expect that most Azure Cache for Redis customers aren't affected by the change. Your application may be impacted if it explicitly specifies a list of acceptable certificates, a practice known as “certificate pinning”. If it's pinned to an intermediate or leaf certificate instead of the Baltimore CyberTrust Root, you should **take immediate actions** to change the certificate configuration.

The following table provides information about the certificates that are being rolled. Depending on which certificate your application uses, you may need to update it to prevent loss of connectivity to your Azure Cache for Redis instance.

| CA Type | Current | Post Rolling (Oct 12, 2020) | Action |
| ----- | ----- | ----- | ----- |
| Root | Thumbprint: d4de20d05e66fc53fe1a50882c78db2852cae474<br><br> Expiration: Monday, May 12, 2025, 4:59:00 PM<br><br> Subject Name:<br> CN = Baltimore CyberTrust Root<br> OU = CyberTrust<br> O = Baltimore<br> C = IE | Not changing | None |
| Intermediates | Thumbprints:<br> CN = Microsoft IT TLS CA 1<br> Thumbprint: 417e225037fbfaa4f95761d5ae729e1aea7e3a42<br><br> CN = Microsoft IT TLS CA 2<br> Thumbprint: 54d9d20239080c32316ed9ff980a48988f4adf2d<br><br> CN = Microsoft IT TLS CA 4<br> Thumbprint: 8a38755d0996823fe8fa3116a277ce446eac4e99<br><br> CN = Microsoft IT TLS CA 5<br> Thumbprint: Ad898ac73df333eb60ac1f5fc6c4b2219ddb79b7<br><br> Expiration: ‎Friday, ‎May ‎20, ‎2024 5:52:38 AM<br><br> Subject Name:<br> OU = Microsoft IT<br> O = Microsoft Corporation<br> L = Redmond<br> S = Washington<br> C = US<br> | Thumbprints:<br> CN = Microsoft RSA TLS CA 01<br> Thumbprint: 703d7a8f0ebf55aaa59f98eaf4a206004eb2516a<br><br> CN = Microsoft RSA TLS CA 02<br> Thumbprint: b0c2d2d13cdd56cdaa6ab6e2c04440be4a429c75<br><br> Expiration: ‎Tuesday, ‎October ‎8, ‎2024 12:00:00 AM;<br><br> Subject Name:<br> O = Microsoft Corporation<br> C = US<br> | Required |

### What actions should I take?

If your application uses the operating system certificate store or pins the Baltimore root among others, no action is needed. On the other hand, if your application pins any intermediate or leaf TLS certificate, we recommend that you pin the following roots:

| Certificate | Thumbprint |
| ----- | ----- |
| [Baltimore Root CA](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74 |
| [Digicert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4 |

> [!TIP]
> Both the intermediate and leaf certificates are expected to change frequently. We recommend not to take a dependency on them. Instead pin your application to a root certificate since it rolls less frequently.
>
>

To continue to pin intermediate certificates, add the following to the pinned intermediate certificates list, which includes few additional ones to minimize future changes:

| Common name of the CA | Thumbprint |
| ----- | ----- |
| [Microsoft RSA TLS CA 01](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2001.crt) | 703d7a8f0ebf55aaa59f98eaf4a206004eb2516a |
| [Microsoft RSA TLS CA 02](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2002.crt) | b0c2d2d13cdd56cdaa6ab6e2c04440be4a429c75 |
| [Microsoft Azure TLS Issuing CA 01](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001.cer) | 2f2877c5d778c31e0f29c7e371df5471bd673173 |
| [Microsoft Azure TLS Issuing CA 02](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002.cer) | e7eea674ca718e3befd90858e09f8372ad0ae2aa |
| [Microsoft Azure TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005.cer) | 6c3af02e7f269aa73afd0eff2a88a4a1f04ed1e5 |
| [Microsoft Azure TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2006.cer) | 30e01761ab97e59a06b41ef20af6f2de7ef4f7b0 |

If your application validates certificate in code, you will need to modify it to recognize the properties (e.g., Issuers, Thumbprint) of the newly pinned certificates. This extra verification should cover all pinned certificates to be more future-proof.

## Next steps

If you have additional questions, contact us through [support](https://azure.microsoft.com/support/options/).  

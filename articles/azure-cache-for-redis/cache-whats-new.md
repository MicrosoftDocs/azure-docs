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

Microsoft is updating Azure services in a phased manner to use TLS server certificates from a different set of Certificate Authorities (CAs) beginning **August 13, 2020** and concluding approximately on **October 26, 2020**. We expect that most Azure Cache for Redis customers will not be impacted. Your application may be impacted, however, if you've explicitly specified a list of acceptable CAs (a practice known as “certificate pinning”). This change is limited to services in [public Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/) and not sovereign (e.g., China) or government clouds.

### What is changing?

This change is being made because the current CA certificates do not comply with one of the [CA/Browser Forum Baseline requirements](https://bugzilla.mozilla.org/show_bug.cgi?id=1649951). This was reported on July 1, 2020 and impacts multiple popular Public Key Infrastructure (PKI) providers worldwide. Most of the TLS certificates used by Azure services today are issued from the "Baltimore CyberTrust Root" PKI. The root certificate will continue to be Baltimore CyberTrust Root*, but their TLS server certificates will be issued by new Intermediate Certificate Authorities (ICAs) starting **October 12, 2020**.

If any client application or device has pinned to an Intermediate CA or leaf certificate rather than the Baltimore CyberTrust Root, **immediate action** is required to prevent disruption of client connectivity to Azure Cache for Redis.

| Certificate | Current | Post Rollover (Oct 10, 2020) | Action |
| ----- | ----- | ----- | ----- |
| Root | Thumbprint: d4de20d05e66fc53fe1a50882c78db2852cae474<br><br> Expiration: Monday, May 12, 2025, 4:59:00 PM<br><br> Subject Name:<br> CN = Baltimore CyberTrust Root<br> OU = CyberTrust<br> O = Baltimore<br> C = IE | Not changing | None |
| Intermediates | Thumbprints:<br> CN = Microsoft IT TLS CA 1<br> Thumbprint: 417e225037fbfaa4f95761d5ae729e1aea7e3a42<br><br> CN = Microsoft IT TLS CA 2<br> Thumbprint: 54d9d20239080c32316ed9ff980a48988f4adf2d<br><br> CN = Microsoft IT TLS CA 4<br> Thumbprint: 8a38755d0996823fe8fa3116a277ce446eac4e99<br><br> CN = Microsoft IT TLS CA 5<br> Thumbprint: Ad898ac73df333eb60ac1f5fc6c4b2219ddb79b7<br><br> Expiration: ‎Friday, ‎May ‎20, ‎2024 5:52:38 AM<br><br> Subject Name:<br> OU = Microsoft IT<br> O = Microsoft Corporation<br> L = Redmond<br> S = Washington<br> C = US<br> | Thumbprints:<br> CN = Microsoft RSA TLS CA 01<br> Thumbprint: 703d7a8f0ebf55aaa59f98eaf4a206004eb2516a<br><br> CN = Microsoft RSA TLS CA 02<br> Thumbprint: b0c2d2d13cdd56cdaa6ab6e2c04440be4a429c75<br><br> Expiration: ‎Tuesday, ‎October ‎8, ‎2024 12:00:00 AM;<br><br> Subject Name:<br> O = Microsoft Corporation<br> C = US<br> | Required |

> [!NOTE]
> Both the intermediate and leaf certificates are expected to change frequently. We recommend not taking dependencies on them and instead pinning the root certificate as it rolls less frequently.
>
>

### Required actions
1. If your devices depend on the operating system certificate store for getting these roots or use the device/gateway SDKs as provided, no action is required.

1. If your devices pin the Baltimore root CA and not the intermediates, no action is required related to this change.

1. If your devices pin any intermediary or leaf TLS certificates instead of the Baltimore root CA, **immediate action is required**:

    * To continue without disruption due to this change, Microsoft recommends that client applications or devices pin the Baltimore root.

| Common name of the CA | Thumbprint |
| ----- | ----- |
| [Baltimore Root CA](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |

    To prevent future disruption, client applications or devices should also pin the following roots:

| Common name of the CA | Thumbprint |
| ----- | ----- |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74 |
| [Digicert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4 |

    * To continue pinning intermediaries, replace the existing certificates with the new intermediates CAs:

| Common name of the CA | Thumbprint |
| ----- | ----- |
| [Microsoft RSA TLS CA 01](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2001.crt) | 703d7a8f0ebf55aaa59f98eaf4a206004eb2516a |
| [Microsoft RSA TLS CA 02](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2002.crt) | b0c2d2d13cdd56cdaa6ab6e2c04440be4a429c75 |

    To minimize future code changes, also pin the following ICAs:

| Common name of the CA | Thumbprint |
| ----- | ----- |
| [Microsoft Azure TLS Issuing CA 01](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001.cer) | 2f2877c5d778c31e0f29c7e371df5471bd673173 |
| [Microsoft Azure TLS Issuing CA 02](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002.cer) | e7eea674ca718e3befd90858e09f8372ad0ae2aa |
| [Microsoft Azure TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005.cer) | 6c3af02e7f269aa73afd0eff2a88a4a1f04ed1e5 |
| [Microsoft Azure TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2006.cer) | 30e01761ab97e59a06b41ef20af6f2de7ef4f7b0 |


1. If your client applications, devices, or networking infrastructure (e.g. firewalls) perform any sub root validation in code, **immediate action is required**:

    * If you have hard coded properties like Issuer, Subject Name, Alternative DNS, or Thumbprint of any certificate other than the Baltimore Root CA, then you will need to modify this to reflect the properties of the newly pinned certificates.

    * Note: This extra validation, if done, should cover all the pinned certificates to prevent future disruptions in connectivity.

## Next steps

If you have additional questions, please contact us through [support](https://azure.microsoft.com/support/options/).  

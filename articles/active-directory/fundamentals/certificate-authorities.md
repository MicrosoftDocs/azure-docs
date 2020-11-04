---
title: Azure Active Directory certificate authorities
description: Listing of trusted certificates used in Azure
services: active-directory
author: BarbaraSelden
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 10/10/2020
ms.author: baselden
ms.reviewer: baselden
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Certificate authorities used by Azure Active Directory

> [!IMPORTANT]
> The information in this page is relevant only to entities that explicitly specify a list of acceptable Certificate Authorities (CAs). This practice, known as certificate pinning, should be avoided unless there are no other options.

Any entity trying to access Azure Active Directory (Azure AD) identity services via the TLS/SSL protocols will be presented with certificates from the CAs listed below. If the entity trusts those CAs, it may use the certificates to verify the identity and legitimacy of the identity services and establish secure connections.

Certificate Authorities can be classified into root CAs and intermediate CAs. Typically, root CAs have one or more associated intermediate CAs. This article lists the root CAs used by Azure AD identity services and the intermediate CAs associated with each of those roots. For each CA, we include Uniform Resource Identifiers (URIs) to download the associated Authority Information Access (AIA) and the Certificate Revocation List Distribution Point (CDP) files. When appropriate, we also provide a URI to the Online Certificate Status Protocol (OCSP) endpoint.

## CAs used in Azure Public and Azure US Government clouds

Different services may use different root or intermediate CAs. Therefore all entries listed below may be required.

### DigiCert Global Root G2


| Root CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - |- |-|-|-|-|
| DigiCert Global Root G2| 033af1e6a711a 9a0bb2864b11d09fae5| August 1, 2013 <br>January 15, 2038| df3c24f9bfd666761b268 073fe06d1cc8d4f82a4| [AIA](http://cacerts.digicert.com/DigiCertGlobalRootG2.crt)<br>[CDP](http://crl3.digicert.com/DigiCertGlobalRootG2.crl) |


#### Associated Intermediate CAs

| Issuing and Intermediate CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - | 
| Microsoft Azure TLS Issuing CA 01| 0aafa6c5ca63c45141 ea3be1f7c75317| July 29, 2020<br>June 27, 2024| 2f2877c5d778c31e0f29c 7e371df5471bd673173| [AIA](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001%20-%20xsign.crt)<br>[CDP](https://www.microsoft.com/pkiops/crl/Microsoft%20Azure%20TL%20Issuing%20CA%2001.crl)|
|Microsoft Azure TLS Issuing CA 02| 0c6ae97cced59983 8690a00a9ea53214| July 29, 2020<br>June 27, 2024| e7eea674ca718e3befd 90858e09f8372ad0ae2aa| [AIA](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002%20-%20xsign.crt)<br>[CDP](https://www.microsoft.com/pkiops/crl/Microsoft%20Azure%20TLS%20Issuing%20CA%2002.crl) |
| Microsoft Azure TLS Issuing CA 05| 0d7bede97d8209967a 52631b8bdd18bd| July 29, 2020<br>June 27, 2024| 6c3af02e7f269aa73a fd0eff2a88a4a1f04ed1e5| [AIA](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005%20-%20xsign.crt)<br>[CDP](https://www.microsoft.com/pkiops/crl/Microsoft%20Azure%20TLS%20Issuing%20CA%2005.crl) |
| Microsoft Azure TLS Issuing CA 06| 02e79171fb8021e93fe 2d983834c50c0| July 29, 2020<br>June 27, 2024| 30e01761ab97e59a06b 41ef20af6f2de7ef4f7b0| [AIA](https://www.microsoft.com/pkiops/certs/Microsoft%20zure%20TLS%20Issuing%20CA%2006%20-%20xsign.crt)<br>[CDP](https://www.microsoft.com/pkiops/crl/Microsoft%20Azure%20TLS%20Issuing%20CA%2006.crl) |


 ### Baltimore CyberTrust Root

| Root CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - | 
| Baltimore CyberTrust Root| 020000b9| May 12, 2000<br>May 12, 2025| d4de20d05e66fc53fe 1a50882c78db2852cae474|<br>[CDP](http://crl3.digicert.com/Omniroot2025.crl)<br>[OCSP](http://ocsp.digicert.com/) |


#### Associated Intermediate CAs

| Issuing and Intermediate CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - | 
| Microsoft RSA TLS CA 01| 703d7a8f0ebf55aaa 59f98eaf4a206004eb2516a| July 21, 2020<br>October 8, 2024| 417e225037fbfaa4f9 5761d5ae729e1aea7e3a42| [AIA](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2001.crt)<br>[CDP](https://mscrl.microsoft.com/pki/mscorp/crl/Microsoft%20RSA%20TLS%20CA%2001.crl)<br>[OCSP](https://ocsp.msocsp.com/) |
| Microsoft RSA TLS CA 02| b0c2d2d13cdd56cdaa 6ab6e2c04440be4a429c75| July 21, 2020<br>May 20, 2024| 54d9d20239080c32316ed 9ff980a48988f4adf2d| [AIA](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2002.crt)<br>[CDP](https://mscrl.microsoft.com/pki/mscorp/crl/Microsoft%20RSA%20TLS%20CA%2002.crl)<br>[OCSP](https://ocsp.msocsp.com/) |


 ### DigiCert Global Root CA

| Root CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - | 
| DigiCert Global Root CA| 083be056904246 b1a1756ac95991c74a| November 9, 2006<br>November 9, 2031| a8985d3a65e5e5c4b2d7 d66d40c6dd2fb19c5436| [CDP](http://crl3.digicert.com/DigiCertGlobalRootCA.crl)<br>[OCSP](http://ocsp.digicert.com/) |


#### Associated Intermediate CAs

| Issuing and Intermediate CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - |
| DigiCert SHA2 Secure Server CA| 01fda3eb6eca75c 888438b724bcfbc91| March 8, 2013 March 8, 2023| 1fb86b1168ec743154062 e8c9cc5b171a4b7ccb4| [AIA](http://cacerts.digicert.com/DigiCertSHA2SecureServerCA.crt)<br>[CDP](http://crl3.digicert.com/ssca-sha2-g6.crl)<br>[OCSP](http://ocsp.digicert.com/) |
| DigiCert SHA2 Secure Server CA |02742eaa17ca8e21 c717bb1ffcfd0ca0 |September 22, 2020<br>September 22, 2030|626d44e704d1ceabe3bf 0d53397464ac8080142c|[AIA](http://cacerts.digicert.com/DigiCertSHA2SecureServerCA-2.crt)<br>[CDP](http://crl3.digicert.com/DigiCertSHA2SecureServerCA.crl)<br>[OCSP](http://ocsp.digicert.com/)|


## CAs used in Azure China 21Vianet cloud

### DigiCert Global Root CA


| Root CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - |
| DigiCert Global Root CA| 083be056904246b 1a1756ac95991c74a| Nov. 9, 2006<br>Nov. 9, 2031| a8985d3a65e5e5c4b2d7 d66d40c6dd2fb19c5436| [CDP](http://ocsp.digicert.com/)<br>[OCSP](http://crl3.digicert.com/DigiCertGlobalRootCA.crl) |


#### Associated Intermediate CA

| Issuing and Intermediate CA| Serial Number| Issue Date Expiration Date| SHA1 Thumbprint| URIs |
| - | - | - | - | - | - |
| DigiCert Basic RSA CN CA G2| 02f7e1f982bad 009aff47dc95741b2f6| March 4, 2020<br>March 4, 2030| 4d1fa5d1fb1ac3917c08e 43f65015e6aea571179| [AIA](http://cacerts.digicert.cn/DigiCertBasicRSACNCAG2.crt)<br>[CDP](http://crl.digicert.cn/DigiCertBasicRSACNCAG2.crl)<br>[OCSP](http://ocsp.digicert.cn/) |

## Next Steps
[Learn about Microsoft 365 Encryption chains](https://docs.microsoft.com/microsoft-365/compliance/encryption-office-365-certificate-chains?view=o365-worldwide)

---
title: Azure Certificate Authority details
description: Certificate Authority details for Azure services that utilize x509 certs and TLS encryption.
services: security
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 10/21/2022

ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: quentinb
---

# Azure Certificate Authority details

This article provides the details of the root and subordinate Certificate Authorities (CAs) utilized by Azure. The scope includes government and national clouds. The minimum requirements for public key encryption and signature algorithms as well as links to certificate downloads and revocation lists are provided below the CA details tables.

Looking for CA details specific to Azure Active Directory? See the [Certificate authorities used by Azure Active Directory](../../active-directory/fundamentals/certificate-authorities.md) article.

**How to read the certificate details:**
- The Serial Number (top string in the table) contains the hexadecimal value of the certificate serial number.
- The Thumbprint (bottom string in the table) is the SHA-1 thumbprint.
- Links to download the Privacy Enhanced Mail (PEM) and Distinguished Encoding Rules (DER) are the last cell in the table.

## Root Certificate Authorities

| Certificate Authority | Expiry Date | Serial Number /<br>Thumbprint | Download |
|---- |---- |---- |---- |
| Baltimore CyberTrust Root | May 12, 2025 | 0x20000b9<br>D4DE20D05E66FC53FE1A50882C78DB2852CAE474 | [PEM](https://crt.sh/?d=76) |
| DigiCert Global Root CA | Nov 10, 2031 | 0x083be056904246b1a1756ac95991c74a<br>A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436 | [PEM](https://crt.sh/?d=853428) |
| DigiCert Global Root G2 | Jan 15 2038 | 0x033af1e6a711a9a0bb2864b11d09fae5<br>DF3C24F9BFD666761B268073FE06D1CC8D4F82A4 | [PEM](https://crt.sh/?d=8656329) |
| DigiCert Global Root G3 | Jan 15, 2038 | 0x055556bcf25ea43535c3a40fd5ab4572<br>7E04DE896A3E666D00E687D33FFAD93BE83D349E | [PEM](https://crt.sh/?d=8568700) |
| Microsoft ECC Root Certificate Authority 2017 | Jul 18, 2042 | 0x66f23daf87de8bb14aea0c573101c2ec<br>999A64C37FF47D9FAB95F14769891460EEC4C3C5 | [PEM](https://crt.sh/?d=2565145421) |
| Microsoft RSA Root Certificate Authority 2017 | Jul 18, 2042 | 0x1ed397095fd8b4b347701eaabe7f45b3<br>73A5E64A3BFF8316FF0EDCCC618A906E4EAE4D74 | [PEM](https://crt.sh/?d=2565151295) |

## Subordinate Certificate Authorities

| Certificate Authority | Expiry Date | Serial Number<br>Thumbprint | Downloads |
|---- |---- |---- |---- |
| DigiCert Basic RSA CN CA G2 | Mar 4, 2030 | 0x02f7e1f982bad009aff47dc95741b2f6<br>4D1FA5D1FB1AC3917C08E43F65015E6AEA571179 | [PEM](https://crt.sh/?d=2545289014) |
| DigiCert Cloud Services CA-1 | Aug 4, 2030 | 0x019ec1c6bd3f597bb20c3338e551d877<br>81B68D6CD2F221F8F534E677523BB236BBA1DC56 | [PEM](https://crt.sh/?d=12624881) |
| DigiCert SHA2 Secure Server CA | Sep 22, 2030 | 0x02742eaa17ca8e21c717bb1ffcfd0ca0<br>626D44E704D1CEABE3BF0D53397464AC8080142C | [PEM](https://crt.sh/?d=3422153451) |
| DigiCert TLS Hybrid ECC SHA384 2020 CA1 | Sep 22, 2030 | 0x0a275fe704d6eecb23d5cd5b4b1a4e04<br>51E39A8BDB08878C52D6186588A0FA266A69CF28 | [PEM](https://crt.sh/?d=3422153452) |
| DigiCert TLS RSA SHA256 2020 CA1 | Apr 13, 2031 | 0x06d8d904d5584346f68a2fa754227ec4<br>1C58A3A8518E8759BF075B76B750D4F2DF264FCD | [PEM](https://crt.sh/?d=4385364571) |
| GeoTrust Global TLS RSA4096 SHA256 2022 CA1 | Nov 09, 2031 | 0x0f622f6f21c2ff5d521f723a1d47d62d<br>7E6DB7B7584D8CF2003E0931E6CFC41A3A62D3DF | [PEM](https://crt.sh/?d=6670931375)|
| GeoTrust TLS DV RSA Mixed SHA256 2020 CA-1 | May 31, 2023 | 0x0c08966535b942a9735265e4f97540bc<br>2F7AA2D86056A8775796F798C481A079E538E004 | [PEM](https://crt.sh/?d=3112858728)|
| Microsoft Azure TLS Issuing CA 01 | Jun 27, 2024 | 0x0aafa6c5ca63c45141ea3be1f7c75317<br>2F2877C5D778C31E0F29C7E371DF5471BD673173 | [PEM](https://crt.sh/?d=3163654574) |
| Microsoft Azure TLS Issuing CA 01 | Jun 27, 2024 | 0x1dbe9496f3db8b8de700000000001d<br>B9ED88EB05C15C79639493016200FDAB08137AF3 | [PEM](https://crt.sh/?d=2616326024) |
| Microsoft Azure TLS Issuing CA 02 | Jun 27, 2024 | 0x0c6ae97cced599838690a00a9ea53214<br>E7EEA674CA718E3BEFD90858E09F8372AD0AE2AA | [PEM](https://crt.sh/?d=3163546037) |
| Microsoft Azure TLS Issuing CA 02 | Jun 27, 2024 | 0x330000001ec6749f058517b4d000000000001e<br>C5FB956A0E7672E9857B402008E7CCAD031F9B08 | [PEM](https://crt.sh/?d=2616326032) |
| Microsoft Azure TLS Issuing CA 05 | Jun 27, 2024 | 0x0d7bede97d8209967a52631b8bdd18bd<br>6C3AF02E7F269AA73AFD0EFF2A88A4A1F04ED1E5 | [PEM](https://crt.sh/?d=3163600408) |
| Microsoft Azure TLS Issuing CA 05 | Jun 27, 2024 | 0x330000001f9f1fa2043bc28db900000000001f<br>56F1CA470BB94E274B516A330494C792C419CF87 | [PEM](https://crt.sh/?d=2616326057) |
| Microsoft Azure TLS Issuing CA 06 | Jun 27, 2024 | 0x02e79171fb8021e93fe2d983834c50c0<br>30E01761AB97E59A06B41EF20AF6F2DE7EF4F7B0 | [PEM](https://crt.sh/?d=3163654575) |
| Microsoft Azure TLS Issuing CA 06 | Jun 27, 2024 | 0x3300000020a2f1491a37fbd31f000000000020<br>8F1FD57F27C828D7BE29743B4D02CD7E6E5F43E6 | [PEM](https://crt.sh/?d=2616330106) |
| Microsoft Azure ECC TLS Issuing CA 01 | Jun 27, 2024 | 0x09dc42a5f574ff3a389ee06d5d4de440<br>92503D0D74A7D3708197B6EE13082D52117A6AB0 | [PEM](https://crt.sh/?d=3232541596) |
| Microsoft Azure ECC TLS Issuing CA 01 | Jun 27, 2024 | 0x330000001aa9564f44321c54b900000000001a<br>CDA57423EC5E7192901CA1BF6169DBE48E8D1268 | [PEM](https://crt.sh/?d=2616305805) |
| Microsoft Azure ECC TLS Issuing CA 02 | Jun 27, 2024 | 0x0e8dbe5ea610e6cbb569c736f6d7004b<br>1E981CCDDC69102A45C6693EE84389C3CF2329F1 | [PEM](https://crt.sh/?d=3232541597) |
| Microsoft Azure ECC TLS Issuing CA 02 | Jun 27, 2024 | 0x330000001b498d6736ed5612c200000000001b<br>489FF5765030EB28342477693EB183A4DED4D2A6 | [PEM](https://crt.sh/?d=2616326233) |
| Microsoft Azure ECC TLS Issuing CA 05 | Jun 27, 2024 | 0x0ce59c30fd7a83532e2d0146b332f965<br>C6363570AF8303CDF31C1D5AD81E19DBFE172531 | [PEM](https://crt.sh/?d=3232541594) |
| Microsoft Azure ECC TLS Issuing CA 05 | Jun 27, 2024 | 0x330000001cc0d2a3cd78cf2c1000000000001c<br>4C15BC8D7AA5089A84F2AC4750F040D064040CD4 | [PEM](https://crt.sh/?d=2616326161) |
| Microsoft Azure ECC TLS Issuing CA 06 | Jun 27, 2024 | 0x066e79cd7624c63130c77abeb6a8bb94<br>7365ADAEDFEA4909C1BAADBAB68719AD0C381163 | [PEM](https://crt.sh/?d=3232541595) |
| Microsoft Azure ECC TLS Issuing CA 06 | Jun 27, 2024 | 0x330000001d0913c309da3f05a600000000001d<br>DFEB65E575D03D0CC59FD60066C6D39421E65483 | [PEM](https://crt.sh/?d=2616326228) |
| Microsoft RSA TLS CA 01 | Oct 8, 2024 | 0x0f14965f202069994fd5c7ac788941e2<br>703D7A8F0EBF55AAA59F98EAF4A206004EB2516A | [PEM](https://crt.sh/?d=3124375355) |
| Microsoft RSA TLS CA 02 | Oct 8, 2024 | 0x0fa74722c53d88c80f589efb1f9d4a3a<br>B0C2D2D13CDD56CDAA6AB6E2C04440BE4A429C75 | [PEM](https://crt.sh/?d=3124375356) |

## Client compatibility for public PKIs

| Windows | Firefox | iOS | macOS | Android | Java |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Windows XP SP3+ | Firefox 32+ | iOS 7+ | OS X Mavericks (10.9)+ | Android SDK 5.x+ | Java JRE 1.8.0_101+ |

## Public key encryption and signature algorithms

Support for the following algorithms, elliptical curves, and key sizes are required:

Signature algorithms:
- ES256
- ES384
- ES512
- RS256
- RS384
- RS512

Elliptical curves:
- P256
- P384
- P521

Key sizes:
- ECDSA 256
- ECDSA 384
- ECDSA 521
- RSA 2048
- RSA 3072
- RSA 4096

## Certificate downloads and revocation lists

The following domains may need to be included in your firewall allowlists to optimize connectivity:

AIA:
- `cacerts.digicert.com`
- `cacerts.digicert.cn`
- `cacerts.geotrust.com`
- `www.microsoft.com`

CRL:
- `crl.microsoft.com`
- `crl3.digicert.com`
- `crl4.digicert.com`
- `crl.digicert.cn`
- `cdp.geotrust.com`
- `mscrl.microsoft.com`
- `www.microsoft.com`

OCSP:
- `ocsp.msocsp.com`
- `ocsp.digicert.com`
- `ocsp.digicert.cn`
- `oneocsp.microsoft.com`
- `status.geotrust.com`

## Past changes

The CA/Browser Forum updated the Baseline Requirements to require all publicly trusted Public Key Infrastructures (PKIs) to end usage of the SHA-1 hash algorithms for Online Certificate Standard Protocol (OCSP) on May 31, 2022. Microsoft updated all remaining OCSP Responders that used the SHA-1 hash algorithm to use the SHA-256 hash algorithm. View the [Sunset for SHA-1 OCSP signing article](../fundamentals/ocsp-sha-1-sunset.md) for additional information.

Microsoft updated Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs) on February 15, 2021, to comply with changes set forth by the CA/Browser Forum Baseline Requirements. Some services may not finalize these updates until 2022. View the [Azure TLS certificate changes article](../fundamentals/tls-certificate-changes.md) for additional information. 

## Next steps

To learn more about Certificate Authorities and PKI, see:

- [Microsoft PKI Repository](https://www.microsoft.com/pkiops/docs/repository.htm)
- [Microsoft PKI Repository, including CRL and policy information](https://www.microsoft.com/pki/mscorp/cps/default.htm)
- [Azure Firewall Premium certificates](../../firewall/premium-certificates.md)
- [PKI certificates and Configuration Manager](/mem/configmgr/core/plan-design/security/plan-for-certificates)
- [Securing PKI](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn786443(v=ws.11))
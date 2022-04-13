---
title: Azure Certificate Authority details
description: Create, deploy, and manage a cloud-native Public Key Infrastructure with Azure PKI.
services: security
ms.service: security
ms.subservice: security-fundamentals
ms.topic: CA details
ms.date: 04/04/2022

ms.author: sarahlipsey
author: shlipsey3
manager: rachelkarlin
ms.reviewer: person

<a id="ameroot-ea76"></a>ameroot (413e)

<a id="Baltimore-CyberTrust-Root"></a>Baltimore CyberTrust Root (d4de)

---

# Azure Certificate Authority details

This article provides an overview and details of the Certificate Authorities (CAs) utilized by Azure, including Public Key Infrastructure (PKI) and SSL/TSL information.

**How to read the certificate details:**
- The CA name includes the Common Name (CN) of the certificate plus the first four characters of the SHA-1 Thumbprint. This construction gives each entry a unique anchor when there are multiple versions of a particular cert.
- The Serial Number contains the hexadecimal value of the certificate serial number.
- The Thumbprint is the SHA-1 thumbprint.

## Root Certificate Authorities

| Certificate Authority | Expiry Date | Serial Number<br>Thumbprint | Downloads |
|---- |---- |---- |---- |
| DigiCert Global Root CA (a898) | Nov 10, 2031 | 0x083be056904246b1a1756ac95991c74a<br>A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertglobalrootca2031-11-10der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertglobalrootca2031-11-10pem.crt) |
| DigiCert Global Root G2 (df3c) | Nov 10 2031 | 0x083be056904246b1a1756ac95991c74a<br>A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertglobalrootca2031-11-10der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertglobalrootca2031-11-10pem.crt) |
| DigiCert Global Root G3 (7e04) | Jan 15, 2038 | 0x055556bcf25ea43535c3a40fd5ab4572<br>7E04DE896A3E666D00E687D33FFAD93BE83D349E | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertglobalrootg32038-01-15der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertglobalrootg32038-01-15pem.crt) |
| Baltimore CyberTrust Root (d4de) | May 12, 2025 | 0x20000b9<br>D4DE20D05E66FC53FE1A50882C78DB2852CAE474 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/baltimorecybertrustroot2025-05-12der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/baltimorecybertrustroot2025-05-12pem.crt) |
| Microsoft ECC Root Certificate Authority 2017 (999a) | Jul 18, 2042 | 0x66f23daf87de8bb14aea0c573101c2ec<br>999A64C37FF47D9FAB95F14769891460EEC4C3C5 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsofteccrootcertificateauthority20172042-07-18der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsofteccrootcertificateauthority20172042-07-18pem.crt) |
| Microsoft RSA Root Certificate Authority 2017 (73a5) | Jul 18, 2042 | 0x1ed397095fd8b4b347701eaabe7f45b3<br>73A5E64A3BFF8316FF0EDCCC618A906E4EAE4D74 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftrsarootcertificateauthority20172042-07-18der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftrsarootcertificateauthority20172042-07-18pem.crt) |

## Intermediate Certificate Authorities

| Certificate Authority | Expiry Date | Serial Number<br>Thumbprint | Downloads |
|---- |---- |---- |---- |
| DigiCert SHA2 Secure Server CA (626d) | Sep 22, 2030 | 0x02742eaa17ca8e21c717bb1ffcfd0ca0<br>626D44E704D1CEABE3BF0D53397464AC8080142C | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertsha2secureserverca2030-09-22der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertsha2secureserverca2030-09-22pem.crt) |
| DigiCert TLS Hybrid ECC SHA384 2020 CA1 (51e3) | Sep 22, 2030 | 0x0a275fe704d6eecb23d5cd5b4b1a4e04<br>51E39A8BDB08878C52D6186588A0FA266A69CF28 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicerttlshybrideccsha3842020ca12030-09-22der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicerttlshybrideccsha3842020ca12030-09-22pem.crt) |
| DigiCert Cloud Services CA-1 (81b6) | Aug 4, 2030 | 0x019ec1c6bd3f597bb20c3338e551d877<br>81B68D6CD2F221F8F534E677523BB236BBA1DC56 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertcloudservicesca-12030-08-04der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertcloudservicesca-12030-08-04pem.crt) |
| DigiCert Basic RSA CN CA G2 (4d1f) | Mar 4, 2030 | 0x02f7e1f982bad009aff47dc95741b2f6<br>4D1FA5D1FB1AC3917C08E43F65015E6AEA571179 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertbasicrsacncag22030-03-04der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicertbasicrsacncag22030-03-04pem.crt) |
| DigiCert TLS RSA SHA256 2020 CA1 (1c58) | Apr 13, 2031 | 0x06d8d904d5584346f68a2fa754227ec4<br>1C58A3A8518E8759BF075B76B750D4F2DF264FCD | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicerttlsrsasha2562020ca12031-04-13der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/digicerttlsrsasha2562020ca12031-04-13pem.crt) |
| GeoTrust RSA CA 2018 (7ccc) | Nov 6, 2027 | 0x0546fe1823f7e1941da39fce14c46173<br>7CCC2A87E3949F20572B18482980505FA90CAC3B | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/geotrustrsaca20182027-11-06der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/digicert/geotrustrsaca20182027-11-06pem.crt) |
| Microsoft Azure TLS Issuing CA 01 (2f28) | Jun 27, 2024 | 0x0aafa6c5ca63c45141ea3be1f7c75317<br>2F2877C5D778C31E0F29C7E371DF5471BD673173 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca012024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca012024-06-27-xsignpem.crt) |
| Microsoft Azure TLS Issuing CA 01 (b9ed) | Jun 27, 2024 | 0x1dbe9496f3db8b8de700000000001d<br>B9ED88EB05C15C79639493016200FDAB08137AF3 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca012024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca012024-06-27pem.crt) |
| Microsoft Azure TLS Issuing CA 02 (e7ee) | Jun 27, 2024 | 0x0c6ae97cced599838690a00a9ea53214<br>E7EEA674CA718E3BEFD90858E09F8372AD0AE2AA | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca022024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca022024-06-27-xsignpem.crt) |
| Microsoft Azure TLS Issuing CA 02 (c5fb) | Jun 27, 2024 | 0x330000001ec6749f058517b4d000000000001e<br>C5FB956A0E7672E9857B402008E7CCAD031F9B08 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca022024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca022024-06-27pem.crt) |
| Microsoft Azure TLS Issuing CA 05 (56f1) | Jun 27, 2024 | 0x330000001f9f1fa2043bc28db900000000001f<br>56F1CA470BB94E274B516A330494C792C419CF87 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca052024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca052024-06-27pem.crt) |
| Microsoft Azure TLS Issuing CA 06 (30e0) | Jun 27, 2024 | 0x02e79171fb8021e93fe2d983834c50c0<br>30E01761AB97E59A06B41EF20AF6F2DE7EF4F7B0 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca062024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca062024-06-27-xsignpem.crt) |
| Microsoft Azure TLS Issuing CA 06 (8f1f) | Jun 27, 2024 | 0x3300000020a2f1491a37fbd31f000000000020<br>8F1FD57F27C828D7BE29743B4D02CD7E6E5F43E6 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca062024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazuretlsissuingca062024-06-27pem.crt) |
| Microsoft Azure ECC TLS Issuing CA 01 (9250) | Jun 27, 2024 | 0x09dc42a5f574ff3a389ee06d5d4de440<br>92503D0D74A7D3708197B6EE13082D52117A6AB0 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca012024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca012024-06-27-xsignpem.crt) |
| Microsoft Azure ECC TLS Issuing CA 01 (cda5) | Jun 27, 2024 | 0x330000001aa9564f44321c54b900000000001a<br>CDA57423EC5E7192901CA1BF6169DBE48E8D1268 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca012024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca012024-06-27pem.crt) |
| Microsoft Azure ECC TLS Issuing CA 02 (1e98) | Jun 27, 2024 | 0x0e8dbe5ea610e6cbb569c736f6d7004b<br>1E981CCDDC69102A45C6693EE84389C3CF2329F1 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca022024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca022024-06-27-xsignpem.crt) |
| Microsoft Azure ECC TLS Issuing CA 02 (489f) | Jun 27, 2024 | 0x330000001b498d6736ed5612c200000000001b<br>489FF5765030EB28342477693EB183A4DED4D2A6 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca022024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca022024-06-27pem.crt) |
| Microsoft Azure ECC TLS Issuing CA 05 (c636) | Jun 27, 2024 | 0x0ce59c30fd7a83532e2d0146b332f965<br>C6363570AF8303CDF31C1D5AD81E19DBFE172531 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca052024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca052024-06-27-xsignpem.crt) |
| Microsoft Azure ECC TLS Issuing CA 05 (4c15) | Jun 27, 2024 | 0x330000001cc0d2a3cd78cf2c1000000000001c<br>4C15BC8D7AA5089A84F2AC4750F040D064040CD4 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca052024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca052024-06-27pem.crt) |
| Microsoft Azure ECC TLS Issuing CA 06 (7365) | Jun 27, 2024 | 0x066e79cd7624c63130c77abeb6a8bb94<br>7365ADAEDFEA4909C1BAADBAB68719AD0C381163 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca062024-06-27-xsignder.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca062024-06-27-xsignpem.crt) |
| Microsoft Azure ECC TLS Issuing CA 06 (dfeb) | Jun 27, 2024 | 0x330000001d0913c309da3f05a600000000001d<br>DFEB65E575D03D0CC59FD60066C6D39421E65483 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca062024-06-27der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/mspki/microsoftazureecctlsissuingca062024-06-27pem.crt) |
| Microsoft RSA TLS CA 01 (703d) | Oct 8, 2024 | 0x0f14965f202069994fd5c7ac788941e2<br>703D7A8F0EBF55AAA59F98EAF4A206004EB2516A | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/ssladmin/microsoftrsatlsca012024-10-08der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/ssladmin/microsoftrsatlsca012024-10-08pem.crt) |
| Microsoft RSA TLS CA 02 (7deb) | Oct 8, 2024 | 0x0fa74722c53d88c80f589efb1f9d4a3a<br>B0C2D2D13CDD56CDAA6AB6E2C04440BE4A429C75 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/ssladmin/microsoftrsatlsca022024-10-08der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220412T1713331314Z/media/cafiles/ssladmin/microsoftrsatlsca022024-10-08pem.crt) |

### Microsoft Operated Root Certificate Authorities

| Certificate Authority | Issue Date<br>Expiry Date | Serial Number<br>Thumbprint | Downloads |
|---- |---- |---- |---- |
| DigiCert Global Root G2 | Aug 1, 2013<br>Jan 15, 2038 | 033af1e6a711a9a0bb2864b11d09fae5<br>df3c24f9bfd666761b268073fe06d1cc8d4f82a4 | [DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220315T2117452458Z/media/cafiles/ame/ameroot2026-05-24der.crt)<br>[PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220315T2117452458Z/media/cafiles/ame/ameroot2026-05-24pem.crt) |
| ameroot (413e) | Aug 1, 2013<br>May 24, 2026 | 0x25dacb55c9c67781409e569482de4dfe | [AIA](http://crl.microsoft.com/pkiinfra/certs/AMEROOT_ameroot.crt)<br>[AIA 2](http://crl1.ame.gbl/aia/AMEROOT_ameroot.crt) |
- - -


## Additional CA details
The following URLs need to be included in your ____. The Authority Information Access (AIA) URL is the link to download the certificate of a particular CA. The URL provided is the domain only, so you will need to ____. The CRL Distribution Point (CDP) URL is the CRL file containing certificates revoked by this CA.

- AIA: http://crl.microsoft.com
    - http://cacerts.digicert.com/DigiCertGlobalRootG2.crt
    - http://cacerts.digicert.com/DigiCertGlobalRootG3.crt
    - http://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt
- CRL: http://crl.microsoft.com
- OCSP: http://oneocsp.microsoft.com

## Client compatibility for public PKIs

| PKI | Windows | Firefox | iOS | MacOS | Android | Java |
|--|--| -- | -- | --  | -- | -- |
| Microsoft PKI (DigiCert Root)| Windows XP Sp3+ | Firefox 32+ | iOS 7+ | OS X Mavericks (10.9)+ | Android SDK 5.x+ | Java JRE 1.8.0_101+ |
| SSL Admin (Public) | Windows XP SP3+ | Firefox 1+ | iOS 5+ | OS X Mavericks (10.5)+ | Android SDK 2.3+ | Java JRE 1.4.1+ |
| DigiCert (Mooncake) | Windows XP SP3+ | Firefox 1+ | iOS 5+ | OS X Mavericks (10.5)+ | Android SDK 2.3+ |Java JRE 1.4.1+ |
| DigiCert (Mgd Certs) | Windows XP SP3+ | Firefox 1+ | iOS 5+ | OS X Mavericks (10.5)+ | Android SDK 2.3+ | Java JRE 1.4.1+ |
| D-TRUST | Windows XP SP3+ | Firefox 23+ | iOS 7+ | OS Mavericks (10.9)+ | Android SDK 4.4x+ | Java JRE 1.7.0_111+ |
- - -

## History of changes

The CA/Browser Forum updated the Baseline Requirements to require all publicly-trusted Public Key Infrastructures (PKIs) to end usage of the SHA-1 has algorithms for Online Certificate Standard Protocol (OCSP) on May 31, 2022. Microsoft updated all remaining OCSP Responders that used the SHA-1 hash algorithm to use the SHA-256 hash algorithm. View the [Sunset for SHA-1 OCSP signing article](../fundamentals/ocsp-sha-1-sunset.md) for additional information.

Microsoft updated Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs) on February 15, 2021, to comply with changes set forth by the CA/Browser Forum Baseline Requirements. Some services may not finalize these updates until 2022. View the [Azure TLS certificate changes article](../fundamentals/tls-certificate-changes.md) for additional information. 

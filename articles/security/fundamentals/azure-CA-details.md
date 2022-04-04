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

## Certificate Authority details

**How to read the certificate details:**
- The Header contains the Common Name (CN) of the certificate plus the first four characters of the SHA-1 Thumbprint. This construction gives each entry a unique anchor when there are multiple versions of a particular cert.
- The Serial Number contains the hexadecimal value of the certificate serial number.
- The Subject Name Hash is used by OpenSSL when referencing certificates.
- The Authority Information Access (AIA) URL is the link to download the certificate of this CA.
- The CRL Distribution Point (CDP) URL is the CRL file containing certificates revoked by this CA.

### Microsoft Operated Root Certificate Authorities

**ameroot (413e)**
- - -
Valid until: May 24 2026 | Serial: 0x25dacb55c9c67781409e569482de4dfe

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220315T2117452458Z/media/cafiles/ame/ameroot2026-05-24der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220315T2117452458Z/media/cafiles/ame/ameroot2026-05-24pem.crt)

- SHA-1 Thumbprint: 413E8AAC6049924B178BA636CBAF3963CCB963CD
- SHA-256 Thumbprint: EA76599D86897382AA519FF2BC0FA6B9C15D60DA2EBE53E72139CD317B0797ED
- Subject Name Hash: 7957940c

AIA URLs
- http://crl.microsoft.com/pkiinfra/certs/AMEROOT_ameroot.crt
- http://crl1.ame.gbl/aia/AMEROOT_ameroot.crt
- http://crl2.ame.gbl/aia/AMEROOT_ameroot.crt
- http://crl3.ame.gbl/aia/AMEROOT_ameroot.crt
- [ldap:///CN=ameroot,CN=AIA,CN=Public%20Key%20Services,CN=Services,CN=Configuration,DC=AME,DC=GBL?cACertificate?base?objectClass=certificationAuthority](ldap:///CN=ameroot,CN=AIA,CN=Public%20Key%20Services,CN=Services,CN=Configuration,DC=AME,DC=GBL?cACertificate?base?objectClass=certificationAuthority)


CRL Distribution Points
- http://crl.microsoft.com/pkiinfra/crl/ameroot.crl
- http://crl1.ame.gbl/crl/ameroot.crl
- http://crl2.ame.gbl/crl/ameroot.crl
- http://crl3.ame.gbl/crl/ameroot.crl
- [LDAP](ldap:///CN=ameroot,CN=AMEROOT,CN=CDP,CN=Public%20Key%20Services,CN=Services,CN=Configuration,DC=AME,DC=GBL?certificateRevocationList?base?objectClass=cRLDistributionPoint)

- - -
**Microsoft Assurance Designation Root 2011 (ad34)**
- - -
Valid until: March 23 2036 | Serial: 0x0b1c041c9c7434af413a3cbf39f556bf

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/esrp/microsoftassurancedesignationroot20112036-03-23der.crt?cdntoken=LBQBCsn34lip730UkmVhT-R1M_jHXtqh6DkhwreTFZuJ4oWTQiOI-lHhUffkKPGhFL5hx5ze8deLN0UaGjfs) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220315T2117452458Z/media/cafiles/ame/ameroot2026-05-24pem.crt)

- SHA-1 Thumbprint: AD34FF084A8E0ACB42D83365A3F2EB686BC191C4
- SHA-256 Thumbprint: BD6FF27EA305D884768AE41E9B24976FB891488320675D8ED43C05A701FB0DFC
- Subject Name Hash: aeaad467
- AIA URL: http://www.microsoft.com/pkiops/certs/MicAssDesRoo_2011_03_23.crt
- CRL Distribution Point: http://crl.microsoft.com/pkiops/crl/MicAssDesRoo_2011_03_23.crl

- - -
**Microsoft Internal Corporate Root (d176)**
- - -
Valid until: April 5 2037 | Serial: 0x0b1f0111e9b90a9d4ad8d66d359f7000

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ssladmin/microsoftinternalcorporateroot2037-04-05der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ssladmin/microsoftinternalcorporateroot2037-04-05pem.crt)

- SHA-1 Thumbprint: D17697CC206ED26E1A51F5BB96E9356D6D610B74
- SHA-256 Thumbprint: 841F033B49E2BFA246E96860A53A3B12F8130EA0503803285268D0A8F8E4E5EC841F033B49E2BFA246E96860A53A3B12F8130EA0503803285268D0A8F8E4E5EC
- Subject Name Hash: d3be1282
- AIA URL: http://www.microsoft.com/pki/mscorp/msintcrca.crt
- CRL Distribution Point: http://mscrl.microsoft.com/pki/mscorp/crl/msintcrca.crl
- CRL Distribution Point: http://crl.microsoft.com/pki/mscorp/crl/msintcrca.crl

- - -
**Microsoft ECC Root Certificate Authority 2017 (999a)**
- - -
Valid until: July 18 2042 | Serial: 0x66f23daf87de8bb14aea0c573101c2ec

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/mspki/microsofteccrootcertificateauthority20172042-07-18der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/mspki/microsofteccrootcertificateauthority20172042-07-18pem.crt)

- SHA-1 Thumbprint: 999A64C37FF47D9FAB95F14769891460EEC4C3C5
- SHA-256 Thumbprint: 358DF39D764AF9E1B766E9C972DF352EE15CFAC227AF6AD1D70E8E4A6EDCBA02
- Subject Name Hash: aeaad467
- AIA URL: http://www.microsoft.com/pkiops/certs/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crt
- CRL Distribution Point: http://www.microsoft.com/pkiops/crl/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crl
- OCSP Responder URL: http://oneocsp.microsoft.com/ocsp

- - -
**Microsoft ECC Root Certificate Authority 2017 (73a5)**
- - -
Valid until: July 18 2042 | Serial: 0x66f23daf87de8bb14aea0c573101c2ec

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/mspki/microsoftrsarootcertificateauthority20172042-07-18der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/mspki/microsoftrsarootcertificateauthority20172042-07-18pem.crt)

- SHA-1 Thumbprint: 73A5E64A3BFF8316FF0EDCCC618A906E4EAE4D74
- SHA-256 Thumbprint: C741F70F4B2A8D88BF2E71C14122EF53EF10EBA0CFA5E64CFA20F418853073E0
- Subject Name Hash: bf53fb88
- AIA URL: http://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt
- CRL Distribution Point: http://www.microsoft.com/pkiops/crl/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crl
- OCSP Responder URL: http://oneocsp.microsoft.com/ocsp

### Microsoft Operated Intermediate Certificate Authorities

**AME CS CA 01 (e398)**
- - -
Issuer: [ameroot](https://eng.ms/docs/products/onecert-certificates-key-vault-and-dsms/key-vault-dsms/autorotationandecr/cadetails#ameroot-413e)

Valid until: May 21 2026 | Serial: 0x1f00000051ea8ff69c730ca83b000000000051

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca012026-05-21der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca012026-05-21pem.crt)

- SHA-1 Thumbprint: E3981E455AAFF0C851FF1D3C4EF41EE6A4C087F5
- SHA-256 Thumbprint: F6E1EA13F594A93DC5546ED3EEF703591D539ACFFEC5EAFE5159F4BBB67200A0
- Subject Name Hash: 4abedc67
- AIA URL: http://crl.microsoft.com/pkiinfra/Certs/BY2PKICSCA01.AME.GBL_AME%20CS%20CA%2001%282%29.crt
- CRL Distribution Point: http://crl.microsoft.com/pkiinfra/CRL/AME%20CS%20CA%2001%282%29.crl
- OCSP Responder URL: http://oneocsp.microsoft.com/ocsp
- - -

**AME CS CA 02 (d69c)**
- - - 
Issuer: [ameroot](https://eng.ms/docs/products/onecert-certificates-key-vault-and-dsms/key-vault-dsms/autorotationandecr/cadetails#ameroot-413e)

Valid until: May 21 2026 | Serial: 0x1f000000508f622032a5d83e53000000000050

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca022026-05-21der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca022026-05-21pem.crt)

- SHA-1 Thumbprint: D69C8D3C833A00316FF1C341F95497458A2A6594
- SHA-256 Thumbprint: EAAF0CA0A4DA4F838C18FC4241760A4F16620306ADFA7064FE6AE4CA9EDC6205
- Subject Name Hash: 7c771a4e
- AIA URL: http://crl.microsoft.com/pkiinfra/Certs/BL2PKICSCA01.AME.GBL_AME%20CS%20CA%2002%282%29.crt
- CRL Distribution Point: http://crl.microsoft.com/pkiinfra/CRL/AME%20CS%20CA%2002%282%29.crl
- - -

**AME CS CA 03 (7519)**
- - -
Issuer: [ameroot](https://eng.ms/docs/products/onecert-certificates-key-vault-and-dsms/key-vault-dsms/autorotationandecr/cadetails#ameroot-413e)

Valid until: March 19 2023 | Serial: 0x1f000000246b1e390f6582e391000000000024

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/keyvaultdocs/media/cafiles/ame/amecsca032023-03-19der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca032023-03-19pem.crt)

- SHA-1 Thumbprint: 7519DF7D08B690C216FD14A937DE379777EE4CED
- SHA-256 Thumbprint: EFAB3997ED92A828E25721C5E7F21DD5E8F4290725DD880230E4DE3E6CADC98C
- Subject Name Hash: d49ef963
- AIA URL: http://crl.microsoft.com/pkiinfra/Certs/AM3PKICSCA01.AME.GBL_AME%20CS%20CA%2003.crt
- CRL Distribution Point: http://crl.microsoft.com/pkiinfra/CRL/AME%20CS%20CA%2003.crl
- - -

**AME CS CA 03 (f4e4)**
- - -
Issuer: [ameroot](https://eng.ms/docs/products/onecert-certificates-key-vault-and-dsms/key-vault-dsms/autorotationandecr/cadetails#ameroot-413e)

Valid until: May 21 2026 | Serial: 0x1f0000004ff76b623024cf720c00000000004f

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/keyvaultdocs/media/cafiles/ame/amecsca032026-05-21der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca032026-05-21pem.crt)

- SHA-1 Thumbprint: F4E4475DD7C94A3844AAD14D67B7A44299D52777
- SHA-256 Thumbprint: EFAB3997ED92A828E25721C5E7F21DD5E8F4290725DD880230E4DE3E6CADC98C
- Subject Name Hash: d49ef963
- AIA URL: http://crl.microsoft.com/pkiinfra/Certs/AM3PKICSCA01.AME.GBL_AME%20CS%20CA%2003%281%29.crt
- CRL Distribution Point: http://crl.microsoft.com/pkiinfra/CRL/AME%20CS%20CA%2003%281%29.crl
- - -

**AME CS CA 04 (48ec)**
- - -
Issuer: [ameroot](https://eng.ms/docs/products/onecert-certificates-key-vault-and-dsms/key-vault-dsms/autorotationandecr/cadetails#ameroot-413e)

Valid until: March 19 2023 | Serial: 0x1f00000025df1fac4e89e964fa000000000025

[Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca042023-03-19der.crt) | [Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220331T2145112553Z/media/cafiles/ame/amecsca042023-03-19pem.crt)

- SHA-1 Thumbprint: 48EC3CB115C2C6C47876308095DFFDF9F3C7D553
- SHA-256 Thumbprint: 4715E35083F436DF0131F80CCD3E8A3B9294058AB97566D61DB946E15C176285
- Subject Name Hash: ebaa690e
- AIA URL: http://crl.microsoft.com/pkiinfra/Certs/mel01pkicsca01.AME.GBL_AME%20CS%20CA%2004.crt
- CRL Distribution Point: http://crl.microsoft.com/pkiinfra/CRL/AME%20CS%20CA%2004.crl
- - -

### DigiCert Operated Root Certificates

**Baltimore CyberTrust Root (d4de)**

---
Valid until: May 12 2025 | Serial: 0x20000b9

[Download PEM](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220330T2323062212Z/media/cafiles/digicert/baltimorecybertrustroot2025-05-12pem.crt) | [Download DER](https://hubcontentprod.azureedge.net/content/docfx/f770e87c-605e-4620-91ee-8cb4c8d1bf25/20220330T2323062212Z/media/cafiles/digicert/baltimorecybertrustroot2025-05-12der.crt) |

- SHA-1 Thumbprint: D4DE20D05E66FC53FE1A50882C78DB2852CAE474
- SHA-256 Thumbprint: 16AF57A9F676B0AB126095AA5EBADEF22AB31119D644AC95CD4B93DBF3F26AEB
- Subject Name Hash: 653b494a
- AIA URL: http://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt
- CRL distribution point: http://crl3.digicert.com/Omniroot2025.crl
- OCSP Responder URL: http://ocsp.digicert.com
---

### Client compatibility for public PKIs

| PKI | Windows | Firefox | iOS | MacOS | Android | Java |
|--|--| -- | -- | --  | -- | -- |
| Microsoft PKI (DigiCert Root)| Windows XP Sp3+ | Firefox 32+ | iOS 7+ | OS X Mavericks (10.9)+ | Android SDK 5.x+ | Java JRE 1.8.0_101+ |
| SSL Admin (Public) | Windows XP SP3+ | Firefox 1+ | iOS 5+ | OS X Mavericks (10.5)+ | Android SDK 2.3+ | Java JRE 1.4.1+ |
DigiCert (Mooncake) | Windows XP SP3+ | Firefox 1+ | iOS 5+ | OS X Mavericks (10.5)+ | Android SDK 2.3+ |Java JRE 1.4.1+ | DigiCert (Mgd Certs) | Windows XP SP3+ | Firefox 1+ | iOS 5+ | OS X Mavericks (10.5)+  Android SDK 2.3+ | Java JRE 1.4.1+ |
D-TRUST | Windows XP SP3+ | Firefox 23+ | iOS 7+ | OS Mavericks (10.9)+ | Android SDK 4.4x+ | Java JRE 1.7.0_111+ |


## History of changes

The CA/Browser Forum updated the Baseline Requirements to require all publicly-trusted Public Key Infrastructures (PKIs) to end usage of the SHA-1 has algorithms for Online Certificate Standard Protocol (OCSP) on May 31, 2022. Microsoft updated all remaining OCSP Responders that used the SHA-1 hash algorithm to use the SHA-256 hash algorithm. View the [Sunset for SHA-1 OCSP signing article](https://docs.microsoft.com/en-us/azure/security/fundamentals/ocsp-sha-1-sunset) for additional information.

Microsoft updated Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs) on February 15, 2021, to comply with changes set forth by the CA/Browser Forum Baseline Requirements. Some services may not finalize these updates until 2022. View the [Azure TLS certificate changes article](https://docs.microsoft.com/en-us/azure/security/fundamentals/tls-certificate-changes) for additional information. 

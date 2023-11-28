---
title: Azure Certificate Authority details
description: Certificate Authority details for Azure services that utilize x509 certs and TLS encryption.
services: security
ms.service: security
ms.subservice: security-fundamentals
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 11/27/2023
ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: quentinb
---
# Azure Certificate Authority details

This article provides the details of the root and subordinate Certificate Authorities (CAs) utilized by Azure. The scope includes government and national clouds. The minimum requirements for public key encryption and signature algorithms, links to certificate downloads and revocation lists, and information about key concepts are provided below the CA details tables. The host names for the URIs that should be added to your firewall allowlists are also provided.

## Certificate Authority details

Any entity trying to access Microsoft Entra identity services via the TLS/SSL protocols will be presented with certificates from the CAs listed in this article. Different services may use different root or intermediate CAs. The following root and subordinate CAs are relevant to entities that use [certificate pinning](certificate-pinning.md).

**How to read the certificate details:**
- The Serial Number (top string in the table) contains the hexadecimal value of the certificate serial number.
- The Thumbprint (bottom string in the table) is the SHA1 thumbprint.
- CAs listed in italics are the most recently added CAs.

# [Root and Subordinate CAs list](#tab/root-and-subordinate-cas-list)

### Root Certificate Authorities

| Certificate Authority | Serial Number /<br>Thumbprint |
|---- |---- |
| [Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | 0x20000b9<br>D4DE20D05E66FC53FE1A50882C78DB2852CAE474 |
| [DigiCert Global Root CA](https://cacerts.digicert.com/DigiCertGlobalRootCA.crt) | 0x083be056904246b1a1756ac95991c74a<br>A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436 |
| [DigiCert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | 0x033af1e6a711a9a0bb2864b11d09fae5<br>DF3C24F9BFD666761B268073FE06D1CC8D4F82A4 |
| [DigiCert Global Root G3](https://cacerts.digicert.com/DigiCertGlobalRootG3.crt) | 0x055556bcf25ea43535c3a40fd5ab4572<br>7E04DE896A3E666D00E687D33FFAD93BE83D349E |
| [Microsoft ECC Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crt) | 0x66f23daf87de8bb14aea0c573101c2ec<br>999A64C37FF47D9FAB95F14769891460EEC4C3C5 |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 0x1ed397095fd8b4b347701eaabe7f45b3<br>73a5e64a3bff8316ff0edccc618a906e4eae4d74 |

### Subordinate Certificate Authorities

| Certificate Authority | Serial Number<br>Thumbprint |
|---- |---- |
| [DigiCert Basic RSA CN CA G2](https://crt.sh/?d=2545289014) | 0x02f7e1f982bad009aff47dc95741b2f6<br>4D1FA5D1FB1AC3917C08E43F65015E6AEA571179 |
| [DigiCert Cloud Services CA-1](https://crt.sh/?d=12624881) | 0x019ec1c6bd3f597bb20c3338e551d877<br>81B68D6CD2F221F8F534E677523BB236BBA1DC56 |
| [DigiCert SHA2 Secure Server CA](https://crt.sh/?d=3422153451) | 0x02742eaa17ca8e21c717bb1ffcfd0ca0<br>626D44E704D1CEABE3BF0D53397464AC8080142C |
| [DigiCert TLS Hybrid ECC SHA384 2020 CA1](https://crt.sh/?d=3422153452) | 0x0a275fe704d6eecb23d5cd5b4b1a4e04<br>51E39A8BDB08878C52D6186588A0FA266A69CF28 |
| [DigiCert TLS RSA SHA256 2020 CA1](https://crt.sh/?d=4385364571) | 0x06d8d904d5584346f68a2fa754227ec4<br>1C58A3A8518E8759BF075B76B750D4F2DF264FCD |
| [GeoTrust Global TLS RSA4096 SHA256 2022 CA1](https://crt.sh/?d=6670931375) | 0x0f622f6f21c2ff5d521f723a1d47d62d<br>7E6DB7B7584D8CF2003E0931E6CFC41A3A62D3DF |
| [GeoTrust TLS DV RSA Mixed SHA256 2020 CA-1](https://crt.sh/?d=3112858728) | 0x0c08966535b942a9735265e4f97540bc<br>2F7AA2D86056A8775796F798C481A079E538E004 |
| [Microsoft Azure ECC TLS Issuing CA 01](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2001.cer) | 0x09dc42a5f574ff3a389ee06d5d4de440<br>92503D0D74A7D3708197B6EE13082D52117A6AB0 |
| [Microsoft Azure ECC TLS Issuing CA 01](https://crt.sh/?d=2616305805) | 0x330000001aa9564f44321c54b900000000001a<br>CDA57423EC5E7192901CA1BF6169DBE48E8D1268 |
| [Microsoft Azure ECC TLS Issuing CA 02](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2002.cer) | 0x0e8dbe5ea610e6cbb569c736f6d7004b<br>1E981CCDDC69102A45C6693EE84389C3CF2329F1 |
| [Microsoft Azure ECC TLS Issuing CA 02](https://crt.sh/?d=2616326233) | 0x330000001b498d6736ed5612c200000000001b<br>489FF5765030EB28342477693EB183A4DED4D2A6 |
| [*Microsoft Azure ECC TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2003%20-%20xsign.crt) | 0x01529ee8368f0b5d72ba433e2d8ea62d<br>56D955C849887874AA1767810366D90ADF6C8536 |
| [*Microsoft Azure ECC TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2003.crt) | 0x330000003322a2579b5e698bcc000000000033<br>91503BE7BF74E2A10AA078B48B71C3477175FEC3 |
| [*Microsoft Azure ECC TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2004%20-%20xsign.crt) | 0x02393d48d702425a7cb41c000b0ed7ca<br>FB73FDC24F06998E070A06B6AFC78FDF2A155B25 |
| [*Microsoft Azure ECC TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2004.crt) | 0x33000000322164aedab61f509d000000000032<br>406E3B38EFF35A727F276FE993590B70F8224AED |
| [Microsoft Azure ECC TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2005.cer) | 0x0ce59c30fd7a83532e2d0146b332f965<br>C6363570AF8303CDF31C1D5AD81E19DBFE172531 |
| [Microsoft Azure ECC TLS Issuing CA 05](https://crt.sh/?d=2616326161) | 0x330000001cc0d2a3cd78cf2c1000000000001c<br>4C15BC8D7AA5089A84F2AC4750F040D064040CD4 |
| [Microsoft Azure ECC TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2006.cer) | 0x066e79cd7624c63130c77abeb6a8bb94<br>7365ADAEDFEA4909C1BAADBAB68719AD0C381163 |
| [Microsoft Azure ECC TLS Issuing CA 06](https://crt.sh/?d=2616326228) | 0x330000001d0913c309da3f05a600000000001d<br>DFEB65E575D03D0CC59FD60066C6D39421E65483 |
| [*Microsoft Azure ECC TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2007%20-%20xsign.crt) | 0x0f1f157582cdcd33734bdc5fcd941a33<br>3BE6CA5856E3B9709056DA51F32CBC8970A83E28 |
| [*Microsoft Azure ECC TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2007.crt) | 0x3300000034c732435db22a0a2b000000000034<br>AB3490B7E37B3A8A1E715036522AB42652C3CFFE |
| [*Microsoft Azure ECC TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2008%20-%20xsign.crt) | 0x0ef2e5d83681520255e92c608fbc2ff4<br>716DF84638AC8E6EEBE64416C8DD38C2A25F6630 |
| [*Microsoft Azure ECC TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2008.crt) | 0x3300000031526979844798bbb8000000000031<br>CF33D5A1C2F0355B207FCE940026E6C1580067FD |
| [*Microsoft Azure RSA TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2003%20-%20xsign.crt) | 0x05196526449a5e3d1a38748f5dcfebcc<br>F9388EA2C9B7D632B66A2B0B406DF1D37D3901F6 | 
| [*Microsoft Azure RSA TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2003.crt) | 0x330000003968ea517d8a7e30ce000000000039<br>37461AACFA5970F7F2D2BAC5A659B53B72541C68 |
| [*Microsoft Azure RSA TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2004%20-%20xsign.crt) | 0x09f96ec295555f24749eaf1e5dced49d<br>BE68D0ADAA2345B48E507320B695D386080E5B25 |
| [*Microsoft Azure RSA TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2004.crt) | 0x330000003cd7cb44ee579961d000000000003c<br>7304022CA8A9FF7E3E0C1242E0110E643822C45E |
| [*Microsoft Azure RSA TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2007%20-%20xsign.crt) | 0x0a43a9509b01352f899579ec7208ba50<br>3382517058A0C20228D598EE7501B61256A76442 |
| [*Microsoft Azure RSA TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2007.crt) | 0x330000003bf980b0c83783431700000000003b<br>0E5F41B697DAADD808BF55AD080350A2A5DFCA93 |
| [*Microsoft Azure RSA TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2008%20-%20xsign.crt) | 0x0efb7e547edf0ff1069aee57696d7ba0<br>31600991ED5FEC63D355A5484A6DCC787EAD89BC |
| [*Microsoft Azure RSA TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2008.crt) | 0x330000003a5dc2ffc321c16d9b00000000003a<br>512C8F3FB71EDACF7ADA490402E710B10C73026E |
| [Microsoft Azure TLS Issuing CA 01](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001.cer) | 0x0aafa6c5ca63c45141ea3be1f7c75317<br>2F2877C5D778C31E0F29C7E371DF5471BD673173 |
| [Microsoft Azure TLS Issuing CA 01](https://crt.sh/?d=2616326024) | 0x1dbe9496f3db8b8de700000000001d<br>B9ED88EB05C15C79639493016200FDAB08137AF3 |
| [Microsoft Azure TLS Issuing CA 02](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002.cer) | 0x0c6ae97cced599838690a00a9ea53214<br>E7EEA674CA718E3BEFD90858E09F8372AD0AE2AA |
| [Microsoft Azure TLS Issuing CA 02](https://crt.sh/?d=2616326032) | 0x330000001ec6749f058517b4d000000000001e<br>C5FB956A0E7672E9857B402008E7CCAD031F9B08 |
| [Microsoft Azure TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005.cer) | 0x0d7bede97d8209967a52631b8bdd18bd<br>6C3AF02E7F269AA73AFD0EFF2A88A4A1F04ED1E5 |
| [Microsoft Azure TLS Issuing CA 05](https://crt.sh/?d=2616326057) | 0x330000001f9f1fa2043bc28db900000000001f<br>56F1CA470BB94E274B516A330494C792C419CF87 |
| [Microsoft Azure TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2006.cer) | 0x02e79171fb8021e93fe2d983834c50c0<br>30E01761AB97E59A06B41EF20AF6F2DE7EF4F7B0 |
| [Microsoft Azure TLS Issuing CA 06](https://crt.sh/?d=2616330106) | 0x3300000020a2f1491a37fbd31f000000000020<br>8F1FD57F27C828D7BE29743B4D02CD7E6E5F43E6 |
| [Microsoft ECC TLS Issuing AOC CA 01](https://crt.sh/?d=4789656467) | 0x33000000282bfd23e7d1add707000000000028<br>30ab5c33eb4b77d4cbff00a11ee0a7507d9dd316 |
| [Microsoft ECC TLS Issuing AOC CA 02](https://crt.sh/?d=4814787086) | 0x33000000290f8a6222ef6a5695000000000029<br>3709cd92105d074349d00ea8327f7d5303d729c8 |
| [Microsoft ECC TLS Issuing EOC CA 01](https://crt.sh/?d=4814787088) | 0x330000002a2d006485fdacbfeb00000000002a<br>5fa13b879b2ad1b12e69d476e6cad90d01013b46 |
| [Microsoft ECC TLS Issuing EOC CA 02](https://crt.sh/?d=4814787085) | 0x330000002be6902838672b667900000000002b<br>58a1d8b1056571d32be6a7c77ed27f73081d6e7a |
| [Microsoft RSA TLS CA 01](https://crt.sh/?d=3124375355) | 0x0f14965f202069994fd5c7ac788941e2<br>703D7A8F0EBF55AAA59F98EAF4A206004EB2516A |
| [Microsoft RSA TLS CA 02](https://crt.sh/?d=3124375356) | 0x0fa74722c53d88c80f589efb1f9d4a3a<br>B0C2D2D13CDD56CDAA6AB6E2C04440BE4A429C75 |
| [Microsoft RSA TLS Issuing AOC CA 01](https://crt.sh/?d=4789678141) | 0x330000002ffaf06f6697e2469c00000000002f<br>4697fdbed95739b457b347056f8f16a975baf8ee |
| [Microsoft RSA TLS Issuing AOC CA 02](https://crt.sh/?d=4814787092) | 0x3300000030c756cc88f5c1e7eb000000000030<br>90ed2e9cb40d0cb49a20651033086b1ea2f76e0e |
| [Microsoft RSA TLS Issuing EOC CA 01](https://crt.sh/?d=4814787098) | 0x33000000310c4914b18c8f339a000000000031<br>a04d3750debfccf1259d553dbec33162c6b42737 |
| [Microsoft RSA TLS Issuing EOC CA 02](https://crt.sh/?d=4814787087) | 0x3300000032444d7521341496a9000000000032<br>697c6404399cc4e7bb3c0d4a8328b71dd3205563 |

# [Certificate Authority chains](#tab/certificate-authority-chains)

### Root and subordinate certificate authority chains

| Certificate Authority | Serial Number<br>Thumbprint |
|---- |---- |
| [**Baltimore CyberTrust Root**](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | 020000b9<br>d4de20d05e66fc53fe1a50882c78db2852cae474 |
| └ [Microsoft RSA TLS CA 01](https://crt.sh/?d=3124375355) | 0x0f14965f202069994fd5c7ac788941e2<br>703D7A8F0EBF55AAA59F98EAF4A206004EB2516A |
| └ [Microsoft RSA TLS CA 02](https://crt.sh/?d=3124375356) | 0x0fa74722c53d88c80f589efb1f9d4a3a<br>B0C2D2D13CDD56CDAA6AB6E2C04440BE4A429C75 |
| [**DigiCert Global Root CA**](https://cacerts.digicert.com/DigiCertGlobalRootCA.crt) | 0x083be056904246b1a1756ac95991c74a<br>A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436 |
| └ [DigiCert Basic RSA CN CA G2](https://crt.sh/?d=2545289014) | 0x02f7e1f982bad009aff47dc95741b2f6<br>4D1FA5D1FB1AC3917C08E43F65015E6AEA571179 |
| └ [DigiCert Cloud Services CA-1](https://crt.sh/?d=12624881) | 0x019ec1c6bd3f597bb20c3338e551d877<br>81B68D6CD2F221F8F534E677523BB236BBA1DC56 |
| └ [DigiCert SHA2 Secure Server CA](https://crt.sh/?d=3422153451) | 0x02742eaa17ca8e21c717bb1ffcfd0ca0<br>626D44E704D1CEABE3BF0D53397464AC8080142C |
| └ [DigiCert TLS Hybrid ECC SHA384 2020 CA1](https://crt.sh/?d=3422153452) | 0x0a275fe704d6eecb23d5cd5b4b1a4e04<br>51E39A8BDB08878C52D6186588A0FA266A69CF28 |
| └ [DigiCert TLS RSA SHA256 2020 CA1](https://crt.sh/?d=4385364571) | 0x06d8d904d5584346f68a2fa754227ec4<br>1C58A3A8518E8759BF075B76B750D4F2DF264FCD |
| └ [GeoTrust Global TLS RSA4096 SHA256 2022 CA1](https://crt.sh/?d=6670931375) | 0x0f622f6f21c2ff5d521f723a1d47d62d<br>7E6DB7B7584D8CF2003E0931E6CFC41A3A62D3DF |
| └ [GeoTrust TLS DV RSA Mixed SHA256 2020 CA-1](https://crt.sh/?d=3112858728) |0x0c08966535b942a9735265e4f97540bc<br>2F7AA2D86056A8775796F798C481A079E538E004 |
| [**DigiCert Global Root G2**](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | 0x033af1e6a711a9a0bb2864b11d09fae5<br>DF3C24F9BFD666761B268073FE06D1CC8D4F82A4 |
| └ [Microsoft Azure TLS Issuing CA 01](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001.cer) | 0x0aafa6c5ca63c45141ea3be1f7c75317<br>2F2877C5D778C31E0F29C7E371DF5471BD673173 |
| └ [Microsoft Azure TLS Issuing CA 02](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002.cer) | 0x0c6ae97cced599838690a00a9ea53214<br>E7EEA674CA718E3BEFD90858E09F8372AD0AE2AA |
| └ [*Microsoft Azure RSA TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2003%20-%20xsign.crt) | 0x05196526449a5e3d1a38748f5dcfebcc<br>F9388EA2C9B7D632B66A2B0B406DF1D37D3901F6 |
| └ [*Microsoft Azure RSA TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2004%20-%20xsign.crt) | 0x09f96ec295555f24749eaf1e5dced49d<br>BE68D0ADAA2345B48E507320B695D386080E5B25 |
| └ [*Microsoft Azure RSA TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2007%20-%20xsign.crt) | 0x0a43a9509b01352f899579ec7208ba50<br>3382517058A0C20228D598EE7501B61256A76442 |
| └ [*Microsoft Azure RSA TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2008%20-%20xsign.crt) | 0x0efb7e547edf0ff1069aee57696d7ba0<br>31600991ED5FEC63D355A5484A6DCC787EAD89BC |
| └ [Microsoft Azure TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005.cer) | 0x0d7bede97d8209967a52631b8bdd18bd<br>6C3AF02E7F269AA73AFD0EFF2A88A4A1F04ED1E5 |
| └ [Microsoft Azure TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2006.cer) | 0x02e79171fb8021e93fe2d983834c50c0<br>30E01761AB97E59A06B41EF20AF6F2DE7EF4F7B0 |
| [**DigiCert Global Root G3**](https://cacerts.digicert.com/DigiCertGlobalRootG3.crt) | 0x055556bcf25ea43535c3a40fd5ab4572<br>7E04DE896A3E666D00E687D33FFAD93BE83D349E |
| └ [Microsoft Azure ECC TLS Issuing CA 01](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2001.cer) | 0x09dc42a5f574ff3a389ee06d5d4de440<br>92503D0D74A7D3708197B6EE13082D52117A6AB0 |
| └ [Microsoft Azure ECC TLS Issuing CA 02](https://www.microsoft.com/pki/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2002.cer) | 0x0e8dbe5ea610e6cbb569c736f6d7004b<br>1E981CCDDC69102A45C6693EE84389C3CF2329F1 |
| └ [*Microsoft Azure ECC TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2003%20-%20xsign.crt) | 0x01529ee8368f0b5d72ba433e2d8ea62d<br>56D955C849887874AA1767810366D90ADF6C8536 |
| └ [*Microsoft Azure ECC TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2004%20-%20xsign.crt) | 0x02393d48d702425a7cb41c000b0ed7ca<br>FB73FDC24F06998E070A06B6AFC78FDF2A155B25 |
| └ [*Microsoft Azure ECC TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2007%20-%20xsign.crt) | 0x0f1f157582cdcd33734bdc5fcd941a33<br>3BE6CA5856E3B9709056DA51F32CBC8970A83E28 |
| └ [*Microsoft Azure ECC TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2008%20-%20xsign.crt) | 0x0ef2e5d83681520255e92c608fbc2ff4<br>716DF84638AC8E6EEBE64416C8DD38C2A25F6630 |
| └ [Microsoft Azure ECC TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2005.cer) | 0x0ce59c30fd7a83532e2d0146b332f965<br>C6363570AF8303CDF31C1D5AD81E19DBFE172531 |
| └ [Microsoft Azure ECC TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2006.cer) | 0x066e79cd7624c63130c77abeb6a8bb94<br>7365ADAEDFEA4909C1BAADBAB68719AD0C381163 |
| [**Microsoft ECC Root Certificate Authority 2017**](https://www.microsoft.com/pkiops/certs/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crt) | 0x66f23daf87de8bb14aea0c573101c2ec<br>999A64C37FF47D9FAB95F14769891460EEC4C3C5 |
| └ [Microsoft Azure ECC TLS Issuing CA 01](https://crt.sh/?d=2616305805) | 0x330000001aa9564f44321c54b900000000001a<br>CDA57423EC5E7192901CA1BF6169DBE48E8D1268 |
| └ [Microsoft Azure ECC TLS Issuing CA 02](https://crt.sh/?d=2616326233) | 0x330000001b498d6736ed5612c200000000001b<br>489FF5765030EB28342477693EB183A4DED4D2A6 |
| └ [*Microsoft Azure ECC TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2003.crt) | 0x330000003322a2579b5e698bcc000000000033<br>91503BE7BF74E2A10AA078B48B71C3477175FEC3 |
| └ [*Microsoft Azure ECC TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2004.crt) | 0x33000000322164aedab61f509d000000000032<br>406E3B38EFF35A727F276FE993590B70F8224AED |
| └ [Microsoft Azure ECC TLS Issuing CA 05](https://crt.sh/?d=2616326161) | 0x330000001cc0d2a3cd78cf2c1000000000001c<br>4C15BC8D7AA5089A84F2AC4750F040D064040CD4 |
| └ [Microsoft Azure ECC TLS Issuing CA 06](https://crt.sh/?d=2616326228) | 0x330000001d0913c309da3f05a600000000001d<br>DFEB65E575D03D0CC59FD60066C6D39421E65483 |
| └ [*Microsoft Azure ECC TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2007.crt) | 0x3300000034c732435db22a0a2b000000000034<br>AB3490B7E37B3A8A1E715036522AB42652C3CFFE |
| └ [*Microsoft Azure ECC TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20ECC%20TLS%20Issuing%20CA%2008.crt) | 0x3300000031526979844798bbb8000000000031<br>CF33D5A1C2F0355B207FCE940026E6C1580067FD |
| └ [Microsoft ECC TLS Issuing AOC CA 01](https://crt.sh/?d=4789656467) |33000000282bfd23e7d1add707000000000028<br>30ab5c33eb4b77d4cbff00a11ee0a7507d9dd316 |
| └ [Microsoft ECC TLS Issuing AOC CA 02](https://crt.sh/?d=4814787086) |33000000290f8a6222ef6a5695000000000029<br>3709cd92105d074349d00ea8327f7d5303d729c8 |
| └ [Microsoft ECC TLS Issuing EOC CA 01](https://crt.sh/?d=4814787088) |330000002a2d006485fdacbfeb00000000002a<br>5fa13b879b2ad1b12e69d476e6cad90d01013b46 |
| └ [Microsoft ECC TLS Issuing EOC CA 02](https://crt.sh/?d=4814787085) |330000002be6902838672b667900000000002b<br>58a1d8b1056571d32be6a7c77ed27f73081d6e7a |
| [**Microsoft RSA Root Certificate Authority 2017**](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 0x1ed397095fd8b4b347701eaabe7f45b3<br>73A5E64A3BFF8316FF0EDCCC618A906E4EAE4D74 |
| └ [*Microsoft Azure RSA TLS Issuing CA 03*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2003.crt) | 0x330000003968ea517d8a7e30ce000000000039<br>37461AACFA5970F7F2D2BAC5A659B53B72541C68 |
| └ [*Microsoft Azure RSA TLS Issuing CA 04*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2004.crt) | 0x330000003cd7cb44ee579961d000000000003c<br>7304022CA8A9FF7E3E0C1242E0110E643822C45E |
| └ [*Microsoft Azure RSA TLS Issuing CA 07*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2007.crt) | 0x330000003bf980b0c83783431700000000003b<br>0E5F41B697DAADD808BF55AD080350A2A5DFCA93 |
| └ [*Microsoft Azure RSA TLS Issuing CA 08*](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2008.crt) | 0x330000003a5dc2ffc321c16d9b00000000003a<br>512C8F3FB71EDACF7ADA490402E710B10C73026E |
| └ [Microsoft Azure TLS Issuing CA 01](https://crt.sh/?d=2616326024) | 0x1dbe9496f3db8b8de700000000001d<br>B9ED88EB05C15C79639493016200FDAB08137AF3 |
| └ [Microsoft Azure TLS Issuing CA 02](https://crt.sh/?d=2616326032) | 0x330000001ec6749f058517b4d000000000001e<br>C5FB956A0E7672E9857B402008E7CCAD031F9B08 |
| └ [Microsoft Azure TLS Issuing CA 05](https://crt.sh/?d=2616326057) | 0x330000001f9f1fa2043bc28db900000000001f<br>56F1CA470BB94E274B516A330494C792C419CF87 |
| └ [Microsoft Azure TLS Issuing CA 06](https://crt.sh/?d=2616330106) | 0x3300000020a2f1491a37fbd31f000000000020<br>8F1FD57F27C828D7BE29743B4D02CD7E6E5F43E6 |
| └ [Microsoft RSA TLS Issuing AOC CA 01](https://crt.sh/?d=4789678141) |330000002ffaf06f6697e2469c00000000002f<br>4697fdbed95739b457b347056f8f16a975baf8ee |
| └ [Microsoft RSA TLS Issuing AOC CA 02](https://crt.sh/?d=4814787092) |3300000030c756cc88f5c1e7eb000000000030<br>90ed2e9cb40d0cb49a20651033086b1ea2f76e0e |
| └ [Microsoft RSA TLS Issuing EOC CA 01](https://crt.sh/?d=4814787098) |33000000310c4914b18c8f339a000000000031<br>a04d3750debfccf1259d553dbec33162c6b42737 |
| └ [Microsoft RSA TLS Issuing EOC CA 02](https://crt.sh/?d=4814787087) |3300000032444d7521341496a9000000000032<br>697c6404399cc4e7bb3c0d4a8328b71dd3205563 |

---

## Client compatibility for public PKIs

The CAs used by Azure are compatible with the following OS versions:

| Windows | Firefox | iOS | macOS | Android | Java |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Windows XP SP3+ | Firefox 32+ | iOS 7+ | OS X Mavericks (10.9)+ | Android SDK 5.x+ | Java JRE 1.8.0_101+ |

Review the following action steps when CAs expire or change:

- Update to a supported version of the required OS.
- If you can't change the OS version, you may need to manually update the trusted root store to include the new CAs. Refer to documentation provided by the manufacturer.
- If your scenario includes disabling the trusted root store or running the Windows client in disconnected environments, ensure that all root CAs are included in the Trusted Root CA store and all sub CAs listed in this article are included in the Intermediate CA store.
- Many distributions of **Linux** require you to add CAs to /etc/ssl/certs. Refer to the distribution’s documentation.
- Ensure that the **Java** key store contains the CAs listed in this article.  For more information, see the [Java applications](#java-applications) section of this article.
- If your application explicitly specifies a list of acceptable CAs, check to see if you need to update the pinned certificates when CAs change or expire. For more information, see [Certificate pinning](certificate-pinning.md).

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

## Certificate Pinning

Certificate Pinning is a security technique where only authorized, or *pinned*, certificates are accepted when establishing a secure session. Any attempt to establish a secure session using a different certificate is rejected. Learn about the history and implications of [certificate pinning](certificate-pinning.md).

### How to address certificate pinning

If your application explicitly specifies a list of acceptable CAs, you may periodically need to update pinned certificates when Certificate Authorities change or expire.

To detect certificate pinning, we recommend the taking the following steps:

- If you're an application developer, search your source code for references to certificate thumbprints, Subject Distinguished Names, Common Names, serial numbers, public keys, and other certificate properties of any of the Sub CAs involved in this change.
    - If there's a match, update the application to include the missing CAs.
- If you have an application that integrates with Azure APIs or other Azure services and you're unsure if it uses certificate pinning, check with the application vendor.

## Java Applications

To determine if the **Microsoft ECC Root Certificate Authority 2017** and **Microsoft RSA Root Certificate Authority 2017** root certificates are trusted by your Java application, you can check the list of trusted root certificates used by the Java Virtual Machine (JVM).

1. Open a terminal window on your system.
1. Run the following command:
    ```bash
    keytool -list -keystore $JAVA_HOME/jre/lib/security/cacerts
    ```
    - `$JAVA_HOME` refers to the path to the Java home directory.
    - If you're unsure of the path, you can find it by running the following command:
    
    ```bash
    readlink -f $(which java) | xargs dirname | xargs dirname
    ```

1. Look for the **Microsoft RSA Root Certificate Authority 2017** in the output. It should look something like this:
    - If the **Microsoft ECC Root Certificate Authority 2017** and **Microsoft RSA Root Certificate Authority 2017** root certificates are trusted, they should appear in the list of trusted root certificates used by the JVM.
    - If it's not in the list, you'll need to add it.
    - The output should look like the following sample:

    ```bash
        ...
        Microsoft ECC Root Certificate Authority 2017, 20-Aug-2022, Root CA,
        Microsoft RSA Root Certificate Authority 2017, 20-Aug-2022, Root CA,
        ...
    ```


1. To add a root certificate to the trusted root certificate store in Java, you can use the `keytool` utility. The following example adds the **Microsoft RSA Root Certificate Authority 2017** root certificate:
    ```bash
    keytool -import -file microsoft-ecc-root-ca.crt -alias microsoft-rsa-root-ca -keystore $JAVA_HOME/jre/lib/security/cacerts
    keytool -import -file microsoft-rsa-root-ca.crt -alias microsoft-rsa-root-ca -keystore $JAVA_HOME/jre/lib/security/cacerts
    ```
    > [!NOTE]
    > In this example, `microsoft-ecc-root-ca.crt` and `microsoft-rsa-root-ca.crt` are the names of the files that contain the **Microsoft ECC Root Certificate Authority 2017** and **Microsoft RSA Root Certificate Authority 2017** root certificates, respectively.

## Past changes

The CA/Browser Forum updated the Baseline Requirements to require all publicly trusted Public Key Infrastructures (PKIs) to end usage of the SHA-1 hash algorithms for Online Certificate Standard Protocol (OCSP) on May 31, 2022. Microsoft updated all remaining OCSP Responders that used the SHA-1 hash algorithm to use the SHA-256 hash algorithm. View the [Sunset for SHA-1 OCSP signing article](../fundamentals/ocsp-sha-1-sunset.md) for additional information.

Microsoft updated Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs) on February 15, 2021, to comply with changes set forth by the CA/Browser Forum Baseline Requirements. Some services finalized these updates in 2022. View the [Azure TLS certificate changes article](../fundamentals/tls-certificate-changes.md) for additional information. 

### Article change log

- July 17, 2023: Added 16 new subordinate Certificate Authorities
- February 7, 2023: Added eight new subordinate Certificate Authorities

## Next steps

To learn more about Certificate Authorities and PKI, see:

- [Microsoft PKI Repository](https://www.microsoft.com/pkiops/docs/repository.htm)
- [Microsoft PKI Repository, including CRL and policy information](https://www.microsoft.com/pki/mscorp/cps/default.htm)
- [Azure Firewall Premium certificates](../../firewall/premium-certificates.md)
- [PKI certificates and Configuration Manager](/mem/configmgr/core/plan-design/security/plan-for-certificates)
- [Securing PKI](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn786443(v=ws.11))

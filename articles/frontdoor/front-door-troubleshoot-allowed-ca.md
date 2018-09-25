---
title: Allowed certificate authorities for enabling custom HTTPS on Azure Front Door Service | Microsoft Docs
description: If you are using your own certificate to enable HTTPS on a custom domain, you must use an allowed certificate authority (CA) to create it.  
services: frontdoor
documentationcenter: ''
author: sharad4u

ms.assetid: 
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/23/2018
ms.author: sharadag

---

# Allowed certificate authorities for enabling custom HTTPS on Azure Front Door Service

For an Azure Front Door Service custom domain, when you [enable the HTTPS feature by using your own certificate](front-door-custom-domain-https.md?tabs=option-2-enable-https-with-your-own-certificate), you must use an allowed certificate authority (CA) to create your SSL certificate. Otherwise, if you use a non-allowed CA or a self-signed certificate, your request will be rejected.

The following CAs are allowed when you create your own certificate:

- AddTrust External CA Root
- AP Root CA
- AP Root Certificate Authority 2013
- AP Root Certificate Authority 2014
- APCA-DM3P
- Autopilot Root CA
- Baltimore CyberTrust Root
- Class 3 Public Primary Certification Authority
- COMODO RSA Certification Authority
- COMODO RSA Domain Validation Secure Server CA
- D-TRUST Root Class 3 CA 2 2009
- DigiCert Cloud Services CA-1
- DigiCert Global Root CA
- DigiCert High Assurance CA-3
- DigiCert High Assurance EV Root CA
- DigiCert SHA2 High Assurance Server CA
- DigiCert SHA2 Secure Server CA
- GeoTrust Global CA
- GeoTrust Primary Certification Authority
- GeoTrust Primary Certification Authority - G2
- GlobalSign
- GlobalSign Extended Validation CA - SHA256 - G2
- GlobalSign Organization Validation CA - G2
- GlobalSign Root CA
- Go Daddy Root Certificate Authority - G2
- Microsoft Authenticode(tm) Root Authority
- Microsoft Exchange Services CA 2015
- Microsoft Internal Corporate Root
- Microsoft IT ITO SSL CA 1
- Microsoft IT SSL SHA1
- Microsoft IT SSL SHA2
- Microsoft IT TLS CA 1
- Microsoft IT TLS CA 2
- Microsoft IT TLS CA 4
- Microsoft IT TLS CA 5
- Microsoft Root Authority
- Microsoft Root Certificate Authority
- Microsoft Root Certificate Authority 2010
- Microsoft Root Certificate Authority 2011
- Microsoft Secure Server CA 2011
- Microsoft Services Partner Root
- Microsoft Time Stamping Service Root
- Microsoft Windows Hardware Compatibility
- MSIT CA Z2
- MSIT Enterprise CA 1
- MSIT Enterprise CA 3
- Root Agency
- Symantec Class 3 EV SSL CA - G3
- Symantec Class 3 Secure Server CA - G4
- Symantec Enterprise Mobile Root for Microsoft
- Thawte Primary Root CA
- Thawte Primary Root CA - G2
- Thawte Primary Root CA - G3
- Thawte Timestamping CA
- UTN-USERFirst-Object
- VeriSign Class 3 Extended Validation SSL CA
- VeriSign Class 3 Extended Validation SSL SGC CA
- VeriSign Class 3 Public Primary Certification Authority - G5
- VeriSign International Server CA - Class 3
- VeriSign Time Stamping Service Root
- VeriSign Universal Root Certification Authority
- WMSvc-SHA2-DALEDGE1008

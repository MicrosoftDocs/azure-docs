---
title: SSL certificate asset filters
titleSuffix: Defender EASM SSL certificate asset filters 
description: This article outlines the filter functionality available in Microsoft Defender External Attack Surface Management for SSL certificate assets specifically, including operators and applicable field values.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 12/14/2022
ms.topic: how-to
---

# SSL certificate asset filters 

These filters specifically apply to SSL certificate assets. Use these filters when searching for a specific cert, or select group of certs.  


## Defined value filters  

The following filters provide a drop-down list of options to select. The available values are pre-defined. 


|       Filter name    |     Description                                                                                        |     Value format                                                                             |     Applicable operators                            |
|----------------------|--------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------|
|     Self Signed      |   Indicates whether the SSL certificate was self-signed.                                               |   True / False                                                                               |   `Equals` `Not Equals`                                |
|     Cert Expiration  |   The date when a certificate will expire.                                                             |   Expired, Expires in 30 days, Expires in 60 days, Expires in 90 days, Expires in > 90 days  |   `Equals` `Not Equals` `In` `Not In`                    |
|     Cert Validation  |   Indicates the method used to validate the cert, which is indicative of itss trustworthiness.         |   Domain, Organization, Extended                                                             |   `Equals` `Not Equals` `In` `Not In` `Empty` `Not Empty`  |

## Free form filters

The following filters require that the user manually enters the value with which they want to search. This list is organized by the number of applicable operators for each filter, then alphabetically. 

|       Filter name                     |     Description                                                                                            |     Value format                        |     Applicable operators                                                                                                                                                                                                                            |
|---------------------------------------|------------------------------------------------------------------------------------------------------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     Cert Key Size                     |   The number of bits within a SSL certificate key.                                                         |   2048                                  |   `Equals` `Not Equals` `In` `Not In` `Greater Than or Equal To` `Less Than or Equal To` `Between` `Empty` `Not Empty`                                                                                                                                        |
|     Cert Key Algorithm                |   The key algorithm used to encrypt the certificate.                                                       |   RSA                                   |   `Equals` `Not Equals` `Starts with` `Does not start with` `In` `Not in` `Starts with in` `Does not start with in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`                                                          |
|     Cert Serial Number                |   The serial number associated with a certificate.                                                         |   426f9c536bf46487c641d1fc20529b39bb3   |                                                                                                                                                                                                                                                     |
|     Cert Signature Algorithm          |   The hash algorithm used to sign the certificate.                                                         |   SHA256withRSA                         |                                                                                                                                                                                                                                                     |
|     Cert Signature Algorithm Oid      |   The OID identifying the hash algorithm used to sign the certificate request.                             |   1.2.840.113549.1.1.5                  |                                                                                                                                                                                                                                                     |
|     Cert Issuer Alternative Name      |   Any alternative name(s) of the issuer of the certificate.                                                |   ZeroSSL ECC Domain Secure Site CA     |   `Equals` `Not Equals` `Starts with` `Does not start with` `Matches` `Does Not Match` `In` `Not in` `Starts with in` `Does not start with in` `Matches in` `Does not match in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`  |
|     Cert Issuer Common Name           |   The common name of the issuer.                                                                           |   ZeroSSL ECC                           |                                                                                                                                                                                                                                                     |
|     Cert Issuer Organization          |   The organization linked to the issuer.                                                                   |   GoDaddy.com, Inc.                     |                                                                                                                                                                                                                                                     |
|     Cert Issuer Organizational Unit   |   Indicates the department within an organization that is responsible for the issuing of the certificate.  |   http://certs.godaddy.com/repository/  |                                                                                                                                                                                                                                                     |
|     Cert Subject Alternative Name     |   Any alternative names for the subject (e.g. protected entity) of the SSL certificate.                    |   www.host.contoso.com                  |                                                                                                                                                                                                                                                     |
|     Cert Subject Common Name          |   The Issuer Common Name of the subject of the SSL certificate.                                            |   host.contoso.com                      |                                                                                                                                                                                                                                                     |
|     Cert Subject Organization         |   The organization linked to the subject of the SSL certificate.                                           |   Contoso Ltd.                          |                                                                                                                                                                                                                                                     |
|     Cert Subject Organizational Unit  |   Indicates the department within a subject organization that is responsible for the certificate.          |   Compliance                            |                                                                                                                                                                                                                                                     |

## Next steps 
[Understanding asset details](understanding-asset-details.md)

[Inventory filters](inventory-filters.md) 

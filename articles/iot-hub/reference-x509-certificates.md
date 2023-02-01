---
title: X.509 certificates | Microsoft Docs
description: Reference documentation containing information about X.509 certificates, including supported file formats and certificate fields.
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.topic: reference
ms.date: 02/03/2022
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub, and I need to know what file formats, fields, and other details are supported by Azure IoT Hub. 
---

# X.509 certificates

X.509 certificates are digital documents that represent a user, computer, service, or device. They're issued by a certification authority (CA), subordinate CA, or registration authority and contain the public key of the certificate subject. They don't contain the subject's private key, which must be stored securely. Public key certificates are documented by [RFC 5280](https://tools.ietf.org/html/rfc5280). They're digitally signed and, in general, contain the following information:

* Information about the certificate subject
* The public key that corresponds to the subject's private key
* Information about the issuing CA
* The supported encryption and/or digital signing algorithms
* Information to determine the revocation and validity status of the certificate

## Certificate fields

There are three incremental versions of the X.509 certificate standard, and each subsequent version added certificate fields to the standard: 

* Version 1 (v1), published in 1988, follows the initial X.509 standard for certificates.
* Version 2 (v2), published in 1993, adds two new fields to the fields included in Version 1.
* Version 3 (v3), published in 2008, represents the current version of the X.509 standard. This version adds more fields and allows for extension fields to be added as needed.

This section is meant as a general reference for the certificate fields and certificate extensions available in X.509 certificates. For more information about certificate fields and certificate extensions, including data types, constraints, and other details, see the [RFC 5280](https://tools.ietf.org/html/rfc5280) specification.

#### Version 1 fields

The following table describes Version 1 certificate fields for X.509 certificates. All of the fields included in this table are available in subsequent X.509 certificate versions.

| Name | Description |
| --- | --- |
| `version` | An integer that identifies the version number of the certificate.<br/>A value of zero represents Version 1, a value of one represents Version 2, and a value of two represents Version 3. |
| `serialNumber` | An integer that represents the unique number for each certificate issued by a certificate authority (CA). |
| `signature` | The identifier for the cryptographic algorithm used by the CA to sign the certificate. The value includes both the identifier of the algorithm and any optional parameters used by that algorithm, if applicable. |
| `issuer` | The distinguished name (DN) of the certificate's issuing CA. |
| `validity` | The inclusive time period for which the certificate is considered valid. |
| `subject` | The distinguished name (DN) of the certificate subject. |
| `subjectPublicKeyInfo` | The public key owned by the certificate subject. |

#### Version 2 fields

The following table describes the fields added for Version 2, containing information about the certificate issuer. These fields are, however, rarely used. All of the fields included in this table are available in subsequent X.509 certificate versions.

| Name | Description |
| --- | --- | --- |
| `issuerUniqueID` | A unique identifier that represents the issuing CA, as defined by the issuing CA. |
| `subjectUniqueID` | A unique identifier that represents the certificate subject, as defined by the issuing CA. |

#### Version 3 fields

The following table describes the field added for Version 3, representing a collection of X.509 certificate extensions. 

| Name | Description |
| --- | --- | --- |
| `extensions` | A collection of standard and Internet-specific certificate extensions. For more information about the certificate extensions available to X.509 v3 certificates, see [Certificate extensions](#certificate-extensions). |

## Certificate extensions

Introduced with Version 3, certificate extensions provide methods for associating more attributes with users or public keys, and for managing relationships between certificate authorities.

#### Standard extensions

The extensions included in this section are defined as part of the X.509 standard, for use in the Internet public key infrastructure (PKI). 

| Extension | Description |
| --- | --- |
| Authority Key Identifier | This extension can be set to either the subject of the CA and serial number of the CA certificate that issued this certificate, or a hash of the public key of the CA that issued this certificate. |
| Subject Key Identifier | A hash of the current certificate's public key |
| Key Usage | Defines the service for which a certificate can be used. This extension can be set to one or more of the following values:<br/>Digital Signature<br/>Non-Repudiation<br/>Key Encipherment<br/>Data Encipherment<br/>Key Agreement<br/>Key Cert Sign<br/>CRL Sign<br/>Encipher Only<br/>Decipher Only |

* **Private Key Usage Period**
    Validity period for the private key portion of a key pair

* **Certificate Policies**
    Policies used to validate the certificate subject

* **Policy Mappings**
    Maps a policy in one organization to policy in another
* **Subject Alternative Name**
    List of alternate names for the subject
* **Issuer Alternative Name**: List of alternate names for the issuing CA
* **Subject Dir Attribute**: Attributes from an X.500 or LDAP directory
* **Basic Constraints**: Allows the certificate to designate whether it's issued to a CA, or to a user, computer, device, or service. This extension also includes a path length constraint that limits the number of subordinate CAs that can exist.
* **Name Constraints**: Designates which namespaces are allowed in a CA-issued certificate
* **Policy Constraints**: Can be used to prohibit policy mappings between CAs
* **Extended Key Usage**: Indicates how a certificate's public key can be used beyond the purposes identified in the **Key Usage** extension
* **CRL Distribution Points**: Contains one or more URLs where the base certificate revocation list (CRL) is published
* **Inhibit anyPolicy**: Inhibits the use of the **All Issuance Policies** OID (2.5.29.32.0) in subordinate CA certificates
* **Freshest CRL**: Contains one or more URLs where the issuing CA's delta CRL is published

#### Private Internet extensions

The extensions included in this section are similar to defined as part of the X.509 standard, for use in the Internet public key infrastructure (PKI). 

* **Authority Information Access**: Contains one or more URLs where the issuing CA certificate is published
* **Subject Information Access**: Contains information about how to retrieve more details for a certificate subject

## Certificate formats

Certificates can be saved in various formats. Azure IoT Hub authentication typically uses the Privacy-Enhanced Mail (PEM) and Personal Information Exchange (PFX) formats.

| Format | Description |
| --- | --- |
| Binary certificate | A raw form binary certificate using Distinguished Encoding Rules (DER) ASN.1 encoding. |
| ASCII PEM format | A PEM certificate (.pem) file contains a Base64-encoded certificate beginning with `-----BEGIN CERTIFICATE-----` and ending with `-----END CERTIFICATE-----`. One of the most common formats for X.509 certificates, PEM format is required by IoT Hub when uploading certain certificates. |
| ASCII PEM key | Contains a Base64-encoded DER key, optionally with more metadata about the algorithm used for password protection. |
| PKCS #7 certificate | A format designed for the transport of signed or encrypted data. It's defined by [RFC 2315](https://tools.ietf.org/html/rfc2315). It can include the entire certificate chain. |
| PKCS #8 key | The format for a private key store defined by [RFC 5208](https://tools.ietf.org/html/rfc5208). |
| PKCS #12 key and certificate | A complex format that can store and protect a key and the entire certificate chain. It's commonly used with a .pfx extension. PKCS #12 is synonymous with the PFX format. |

## For more information

For more information about X.509 certificates, see the following articles:

* [The layman’s guide to X.509 certificate jargon](https://techcommunity.microsoft.com/t5/internet-of-things/the-layman-s-guide-to-x-509-certificate-jargon/ba-p/2203540)
* [Understand how X.509 CA certificates are used in IoT](./iot-hub-x509ca-concept.md)
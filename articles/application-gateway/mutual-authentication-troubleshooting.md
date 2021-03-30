---
title: Troubleshoot mutual authentication on Azure Application Gateway 
description: Learn how to troubleshoot mutual authentication on Application Gateway
services: application-gateway
author: mscatyao
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 03/30/2021
ms.author: caya
---

# Troubleshooting mutual authentication errors in Application Gateway 

Learn how to troubleshoot problems with mutual authentication when using Application Gateway. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview 

After configuring mutual authentication on an Application Gateway, there can be a number of errors that appear when trying to use mutual authentication. Some common causes for errors include:

* Uploaded a certificate or certificate chain without a root CA certificate
* Uploaded a certificate chain with multiple root CA certificates
* Uploaded a certificate chain that only contained a leaf certificate without a CA certificate 
* Uploaded a certificate that was not in the right format (i.e., not in PEM format)

Below we'll explain all possible control plane failures and how to resolve them. 

## Error code: ApplicationGatewayTrustedClientCertificateMustSpecifyData

### Cause

There is certificate data that is missing. The certificate uploaded could've been an empty file without any certificate data. 

### Solution

Validate that the certificate file uploaded does not have any missing data. 

## Error code: ApplicationGatewayTrustedClientCertificateMustNotHavePrivateKey

### Cause

There is a private key in the certificate chain. There shouldn't be a private key in the certificate chain. 

### Solution

Double check the certificate chain that was uploaded and remove the private key that was part of the chain. Re-upload the chain without the private key. 

## Error code: ApplicationGatewayTrustedClientCertificateInvalidData

### Cause

There are two potential causes behind this error code.
1. The parsing failed due to the chain not being presented in the right format. Application Gateway expects a certificate chain to be in PEM format and also expects individual certificate data to be delimited. 
2. The parser didn't find anything to parse. The file uploaded could potentially only had the delimiters but no certificate data. 

### Solution

Depending on the cause of this error, there are two potential solutions. 
1. Validate that the certificate chain uploaded was in the right format (PEM) and that the certificate data was properly delimited. 
2. Check that the certificate file uploaded contained the certificate data in addition to the delimiters. 

## Error code: ApplicationGatewayTrustedClientCertificateDoesNotContainAnyCACertificate

### Cause

The certificate uploaded only contained a leaf certificate without a CA certificate. Uploading a certificate chain with CA certificates and a leaf certificate is acceptable as the leaf certificate would just be ignored, but a certificate must have a CA. 

### Solution 

Double check the certificate chain that was uploaded contained more than just the leaf certificate. The *BasicConstraintsOid* = "2.5.29.19" should be set to TRUE when the certificate is a CA certificate. 

## Error code: ApplicationGatewayOnlyOneRootCAAllowedInTrustedClientCertificate

### Cause

The certificate chain contained multiple root CA certificates *or* contained 0 root CA certificates. 

### Solution

Certificates uploaded must contain exactly 1 root CA certificate (and however many intermediate CA certificates as needed).



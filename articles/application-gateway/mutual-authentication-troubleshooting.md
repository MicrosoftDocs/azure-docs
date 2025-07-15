---
title: Troubleshoot mutual authentication on Azure Application Gateway 
description: Learn how to troubleshoot mutual authentication on Application Gateway
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: troubleshooting
ms.date: 07/09/2025
ms.author: mbender
# Customer intent: As an application administrator, I want to troubleshoot mutual authentication issues on the Application Gateway, so that I can ensure secure communication and resolve errors efficiently.
---

# Troubleshooting mutual authentication errors in Application Gateway

Learn how to troubleshoot problems with mutual authentication when using Application Gateway. 

## Overview 

For mutual authentication on an Application Gateway, various errors can occur during client certificate validation after configuring. Common causes for these errors include:

* Upload a certificate or certificate chain without a root CA certificate
* Upload a certificate chain with multiple root CA certificates
* Upload a certificate chain that contains only a leaf certificate without a CA certificate 
* Certificate validation errors due to issuer Distinguished Name (DN) mismatch  
* Missing or incorrect Extended Key Usage (EKU) attributes

This guide covers different scenarios you might encounter and provides troubleshooting steps for each. We also address specific error codes and explain their likely causes in mutual authentication scenarios. All client certificate authentication failures result in an HTTP 400 (Bad Request) status code being returned to the client. 

## Scenario troubleshooting - configuration problems

The following scenarios address common configuration issues that can occur when setting up mutual authentication. Each scenario includes the problem description and recommended solution. 

### Self-signed certificate

#### Problem 

The client certificate you uploaded is a self-signed certificate and is resulting in the error code ApplicationGatewayTrustedClientCertificateDoesNotContainAnyCACertificate.

#### Solution 

Verify that the self-signed certificate you're using includes the *BasicConstraintsOid* extension with value "2.5.29.19" and the CA flag set to TRUE. This extension indicates that the certificate subject can act as a Certificate Authority. 

To check the certificate properties, you can use the following OpenSSL command:
```bash
openssl x509 -in certificate.pem -text -noout
```

Look for the "Basic Constraints" section in the output, which should show "CA:TRUE" for a valid CA certificate. For detailed guidance on generating self-signed client certificates, see [trusted client certificates](./mutual-authentication-certificate-management.md).

## Scenario troubleshooting - connectivity problems

You might be able to configure mutual authentication without any problems but you're running into problems when sending requests to your Application Gateway. We address some common problems and solutions in the following section. You can find the *sslClientVerify* property in the access logs of your Application Gateway. 

### SslClientVerify is NONE

#### Problem 

The *sslClientVerify* property appears as "NONE" in your access logs, indicating that no client certificate was presented during the TLS handshake. 

#### Solution 

This problem occurs when the client doesn't send a client certificate in the TLS handshake request to the Application Gateway. This problem can happen when:
- The client application isn't configured to use client certificates
- The client certificate isn't properly installed or accessible
- The client doesn't trust the Application Gateway's server certificate

To verify that client authentication is configured correctly on Application Gateway, use the following OpenSSL command:

```
openssl s_client -connect <hostname:port> -cert <path-to-certificate> -key <client-private-key-file> 
```

Where:
- `-cert` specifies the path to the client certificate (leaf certificate)
- `-key` specifies the path to the client private key file
- `-verify_return_error` ensures the command fails if certificate verification fails

For more information on using the OpenSSL `s_client` command, see the [OpenSSL manual page](https://www.openssl.org/docs/manmaster/man1/openssl-s_client.html).

### SslClientVerify is FAILED

#### Problem

The *sslClientVerify* property appears as "FAILED" in your access logs, indicating that the client certificate validation failed during the TLS handshake. 

#### Solution

There are many potential causes for failures in the access logs. Here's a list of common causes for failure:
* **Unable to get issuer certificate:** The issuer certificate of the client certificate couldn't be found. This issue normally means the trusted client CA certificate chain isn't complete on the Application Gateway. Validate that the trusted client CA certificate chain uploaded on the Application Gateway is complete.  
* **Unable to get local issuer certificate:** Similar to unable to get issuer certificate, the issuer certificate of the client certificate couldn't be found. This issue normally means the trusted client CA certificate chain isn't complete on the Application Gateway. Validate that the trusted client CA certificate chain uploaded on the Application Gateway is complete.
* **Unable to verify the first certificate:** Unable to verify the client certificate. This error occurs specifically when the client presents only the leaf certificate, whose issuer isn't trusted. Validate that the trusted client CA certificate chain uploaded on the Application Gateway is complete.
* **Unable to verify the client certificate issuer:** This error occurs when the configuration *VerifyClientCertIssuerDN* is set to true. This error typically happens when the Issuer DN of the client certificate doesn't match the *ClientCertificateIssuerDN* extracted from the trusted client CA certificate chain uploaded by the customer. For more information about how Application Gateway extracts the *ClientCertificateIssuerDN*, check out [Application Gateway extracting issuer DN](./mutual-authentication-overview.md#verify-client-certificate-dn). As best practice, make sure you're uploading one certificate chain per file to Application Gateway. 
* **Unsupported certificate purpose:** Ensure the client certificate designates Extended Key Usage for Client Authentication ([1.3.6.1.5.5.7.3.2](https://oidref.com/1.3.6.1.5.5.7.3.2)). More details on definition of extended key usage and object identifier for client authentication can be found in [RFC 3280](https://www.rfc-editor.org/rfc/rfc3280) and [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280). 

For more information on how to extract the entire trusted client CA certificate chain to upload to Application Gateway, see [how to extract trusted client CA certificate chains](./mutual-authentication-certificate-management.md).

## Error code troubleshooting

The following error codes appear when configuring mutual authentication. Each error includes the likely cause and recommended solution. 

### Error code: ApplicationGatewayTrustedClientCertificateMustSpecifyData

#### Cause

The uploaded certificate file is missing certificate data or contains an empty file without valid certificate content. 

#### Solution

Verify that the certificate file contains valid certificate data in the correct format (PEM). Use a text editor to confirm that the file contains certificate content between the `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` delimiters. 

### Error code: ApplicationGatewayTrustedClientCertificateMustNotHavePrivateKey

#### Cause

There's a private key in the certificate chain. There shouldn't be a private key in the certificate chain. 

#### Solution

Double check the certificate chain that was uploaded and remove the private key that was part of the chain. Reupload the chain without the private key. 

### Error code: ApplicationGatewayTrustedClientCertificateInvalidData

#### Cause

There are two potential causes for this error:

* **Parsing failure:** The certificate chain isn't in the correct format. Application Gateway expects certificate chains in PEM format with properly delimited individual certificates.
* **Empty content:** The uploaded file contains only delimiters without actual certificate data between them. 

#### Solution

Based on the specific cause, apply one of the following solutions:

* **Format issue:** Ensure the certificate chain is in PEM format with each certificate properly delimited by `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` markers. Each certificate should be on separate lines within these delimiters.
* **Missing data:** Verify that the certificate file contains actual certificate data between the delimiters, not just empty delimiters. 

### Error code: ApplicationGatewayTrustedClientCertificateDoesNotContainAnyCACertificate

#### Cause

The certificate uploaded only contained a leaf certificate without a CA certificate. Uploading a certificate chain with CA certificates and a leaf certificate is acceptable as the leaf certificate would just be ignored, but a certificate must have a CA. 

#### Solution 

Ensure the certificate chain includes at least one CA certificate with the proper *BasicConstraintsOid* extension (OID: 2.5.29.19) where the CA flag is set to TRUE. This extension indicates that the certificate subject can act as a Certificate Authority. 

To verify a certificate's CA status, use:
```bash
openssl x509 -in certificate.pem -text -noout | grep -A 2 "Basic Constraints"
```

The output should show "CA:TRUE" for valid CA certificates.

### Error code: ApplicationGatewayOnlyOneRootCAAllowedInTrustedClientCertificate

#### Cause

The certificate chain contained multiple root CA certificates *or* contained zero root CA certificates. 

#### Solution

Certificates uploaded must contain exactly one root CA certificate (and however many intermediate CA certificates as needed).



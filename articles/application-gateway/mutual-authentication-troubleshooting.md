---
title: Troubleshoot mutual authentication on Azure Application Gateway 
description: Learn how to troubleshoot mutual authentication on Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 02/18/2022
ms.author: greglin
---

# Troubleshooting mutual authentication errors in Application Gateway

Learn how to troubleshoot problems with mutual authentication when using Application Gateway. 

## Overview 

After configuring mutual authentication on an Application Gateway, there can be a number of errors that appear when trying to use mutual authentication. Some common causes for errors include:

* Uploaded a certificate or certificate chain without a root CA certificate
* Uploaded a certificate chain with multiple root CA certificates
* Uploaded a certificate chain that only contained a leaf certificate without a CA certificate 
* Validation errors due to issuer DN mismatch  

We'll go through different scenarios that you might run into and how to troubleshoot those scenarios. We'll then address error codes and explain likely causes for certain error codes you might be seeing with mutual authentication. All client certificate authentication failures should result in an HTTP 400 error code. 

## Scenario troubleshooting - configuration problems
There are a few scenarios that you might be facing when trying to configure mutual authentication. We'll walk through how to troubleshoot some of the most common pitfalls. 

### Self-signed certificate

#### Problem 

The client certificate you uploaded is a self-signed certificate and is resulting in the error code ApplicationGatewayTrustedClientCertificateDoesNotContainAnyCACertificate.

#### Solution 

Double check that the self-signed certificate that you're using has the extension *BasicConstraintsOid* = "2.5.29.19" which indicates the subject can act as a CA. This will ensure that the certificate used is a CA certificate. For more information about how to generate self-signed client certificates, check out [trusted client certificates](./mutual-authentication-certificate-management.md).

## Scenario troubleshooting - connectivity problems

You might have been able to configure mutual authentication without any problems but you're running into problems when sending requests to your Application Gateway. We address some common problems and solutions in the following section. You can find the *sslClientVerify* property in the access logs of your Application Gateway. 

### SslClientVerify is NONE

#### Problem 

The property *sslClientVerify* is appearing as "NONE" in your access logs. 

#### Solution 

This is seen when the client doesn't send a client certificate when sending a request to the Application Gateway. This could happen if the client sending the request to the Application Gateway isn't configured correctly to use client certificates. One way to verify that the client authentication setup on Application Gateway is working as expected is through the following OpenSSL command:

```
openssl s_client -connect <hostname:port> -cert <path-to-certificate> -key <client-private-key-file> 
```

The `-cert` flag is the leaf certificate, the `-key` flag is the client private key file. 

For more information on how to use the OpenSSL `s_client` command, check out their [manual page](https://www.openssl.org/docs/manmaster/man1/openssl-s_client.html).

### SslClientVerify is FAILED

#### Problem

The property *sslClientVerify* is appearing as "FAILED" in your access logs. 

#### Solution

There are a number of potential causes for failures in the access logs. Below is a list of common causes for failure:
* **Unable to get issuer certificate:** The issuer certificate of the client certificate couldn't be found. This normally means the trusted client CA certificate chain is not complete on the Application Gateway. Validate that the trusted client CA certificate chain uploaded on the Application Gateway is complete.  
* **Unable to get local issuer certificate:** Similar to unable to get issuer certificate, the issuer certificate of the client certificate couldn't be found. This normally means the trusted client CA certificate chain is not complete on the Application Gateway. Validate that the trusted client CA certificate chain uploaded on the Application Gateway is complete.
* **Unable to verify the first certificate:** Unable to verify the client certificate. This error occurs specifically when the client presents only the leaf certificate, whose issuer is not trusted. Validate that the trusted client CA certificate chain uploaded on the Application Gateway is complete.
* **Unable to verify the client certificate issuer:** This error occurs when the configuration *VerifyClientCertIssuerDN* is set to true. This typically happens when the Issuer DN of the client certificate doesn't match the *ClientCertificateIssuerDN* extracted from the trusted client CA certificate chain uploaded by the customer. For more information about how Application Gateway extracts the *ClientCertificateIssuerDN*, check out [Application Gateway extracting issuer DN](./mutual-authentication-overview.md#verify-client-certificate-dn). As best practice, make sure you're uploading one certificate chain per file to Application Gateway. 
* **Unsupported certificate purpose:** Ensure the client certificate designates Extended Key Usage for Client Authentication ([1.3.6.1.5.5.7.3.2](https://oidref.com/1.3.6.1.5.5.7.3.2)). More details on definition of extended key usage and object identifier for client authentication can be found in [RFC 3280](https://www.rfc-editor.org/rfc/rfc3280) and [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280). 

For more information on how to extract the entire trusted client CA certificate chain to upload to Application Gateway, see [how to extract trusted client CA certificate chains](./mutual-authentication-certificate-management.md).

## Error code troubleshooting
If you're seeing any of the following error codes, we have a few recommended solutions to help resolve the problem you might be facing. 

### Error code: ApplicationGatewayTrustedClientCertificateMustSpecifyData

#### Cause

There is certificate data that is missing. The certificate uploaded could have been an empty file without any certificate data. 

#### Solution

Validate that the certificate file uploaded doesn't have any missing data. 

### Error code: ApplicationGatewayTrustedClientCertificateMustNotHavePrivateKey

#### Cause

There is a private key in the certificate chain. There shouldn't be a private key in the certificate chain. 

#### Solution

Double check the certificate chain that was uploaded and remove the private key that was part of the chain. Reupload the chain without the private key. 

### Error code: ApplicationGatewayTrustedClientCertificateInvalidData

#### Cause

There are two potential causes behind this error code.
1. The parsing failed due to the chain not being presented in the right format. Application Gateway expects a certificate chain to be in PEM format and also expects individual certificate data to be delimited. 
2. The parser didn't find anything to parse. The file uploaded could potentially only have had the delimiters but no certificate data. 

#### Solution

Depending on the cause of this error, there are two potential solutions. 
* Validate that the certificate chain uploaded was in the right format (PEM) and that the certificate data was properly delimited. 
* Check that the certificate file uploaded contained the certificate data in addition to the delimiters. 

### Error code: ApplicationGatewayTrustedClientCertificateDoesNotContainAnyCACertificate

#### Cause

The certificate uploaded only contained a leaf certificate without a CA certificate. Uploading a certificate chain with CA certificates and a leaf certificate is acceptable as the leaf certificate would just be ignored, but a certificate must have a CA. 

#### Solution 

Double check the certificate chain that was uploaded contained more than just the leaf certificate. The *BasicConstraintsOid* = "2.5.29.19" extension should be present and indicate the subject can act as a CA.

### Error code: ApplicationGatewayOnlyOneRootCAAllowedInTrustedClientCertificate

#### Cause

The certificate chain contained multiple root CA certificates *or* contained zero root CA certificates. 

#### Solution

Certificates uploaded must contain exactly one root CA certificate (and however many intermediate CA certificates as needed).



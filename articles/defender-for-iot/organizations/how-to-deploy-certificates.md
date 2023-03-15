---
title: Setting SSL/TLS appliance certificates
description: Learn how to set up and deploy certificates for Defender for IoT.
ms.date: 02/06/2022
ms.topic: how-to
---

# Certificates for appliance encryption and authentication (OT appliances)

This article provides information needed when creating and deploying certificates for Microsoft Defender for IoT. A security, PKI or other qualified certificate lead should handle certificate creation and deployment.

Defender for IoT uses SSL/TLS certificates to secure communication between the following system components: 

- Between users and the web console of the appliance.
- Between the sensors and an on-premises management console.
- Between a management console and a High Availability management console.
- To the REST API on the sensor and on-premises management console.

Defender for IoT Admin users can upload a certificate  to sensor consoles and their on-premises management console from the SSL/TLS Certificates dialog box.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/wizard-upload-activation-certificates-1.png" alt-text="Screenshot of an initial sensor sign-in certificate page.":::

## About certificate generation methods

All certificate generation methods are supported using:  

- Private and Enterprise Key Infrastructures (Private PKI). 
- Public Key Infrastructures (Public PKI). 
- Certificates locally generated on the appliance (locally self-signed). 

> [!Important]
> It is not recommended to use locally self-signed certificates. This type of connection is not secure and should be used for test environments only. Since the owner of the certificate can't be validated and the security of your system can't be maintained, self-signed certificates should never be used for production networks.

## About certificate validation

In addition to securing communication between system components, users can also carry out certificate validation.  

Validation is evaluated against:

- A Certificate Revocation List (CRL)
- The certificate expiration date  
- The certificate trust chain

Validation is carried out twice:

1. When uploading the certificate to sensors and on-premises management consoles. If validation fails, the certificate can't be uploaded.
1. When initiating encrypted communication between:

    - Defender for IoT system components, for example, a sensor and on-premises management console.

    - Defender for IoT and certain third party servers defined in alert forwarding rules. For more information, see [Forward OT alert information](how-to-forward-alert-information-to-partners.md).

If validation fails, communication between the relevant components is halted and a validation error is presented in the console.

## About certificate upload to Defender for IoT appliances

Following sensor and on-premises management console installation, a local self-signed certificate is generated and used to access the sensor and on-premises management console web application.

When signing into the sensor and on-premises management console for the first time, Admin users are prompted to upload an SSL/TLS certificate. Using SSL/TLS certificates is highly recommended.

If the certificate isn't created properly by the certificate lead or there are connection issues to it, the certificate can't be uploaded and users will be forced to work with a locally signed certificate.  

The option to validate the uploaded certificate and third-party certificates is automatically enabled, but can be disabled. When disabled, encrypted communications between components continue, even if a certificate is invalid.

## Certificate deployment

This section describes the steps you need to take to ensure that certificate deployment runs smoothly.

**To deploy certificates, verify that:**

- A security, PKI or certificate specialist is creating or overseeing certificate creation. 
- You create a unique certificate for each sensor, management console and HA machine.
- You meet [certificate creation requirements](#supported-ssl-certificates).
- Admin users logging in to each Defender for IoT sensor, and on-premises management console and HA machine have access to the certificate.

## Supported SSL certificates

This section covers requirements for successful certificate deployment, including:

- [CRL server access for certificate validation](#crl-server-access-for-certificate-validation)

- [Supported certificate file types](#supported-certificate-file-types)

- [Key file requirements](#key-file-requirements)

- [Using a certificate chain (optional)](#using-a-certificate-chain-optional)

### CRL server access for certificate validation

If you are working with certificate validation, verify access to port 80 is available.

Certificate validation is evaluated against a Certificate Revocation List, and the certificate expiration date. This means the appliance should be able to establish connection to the CRL server defined by the certificate. By default, the certificate will reference the CRL URL on HTTP port 80. 

Some organizational security policies may block access to this port. If your organization doesn't have access to port 80, you can: 

1. Define another URL and a specific port in the certificate.

    - The URL should be defined as `http: //`  rather than `https: //`.

    - Verify that the destination CRL server can listen on the port you defined. 

1. Use a proxy server that will access the CRL on port 80.

### Supported certificate file types

Defender for IoT requires that each CA-signed certificate contains a .key file and a .crt file. These files are uploaded to the sensor and On-premises management console after login. Some organizations may require a .pem file. Defender for IoT doesn't require this file type.

**.crt – certificate container file**

A .pem, or .der formatted file with a different extension. The file is recognized by Windows Explorer as a certificate. The .pem file isn't recognized by Windows Explorer.

**.key – Private key file**

A key file is in the same format as a PEM file, but it has a different extension.

**.pem – certificate container file (optional)**

PEM is a text file that contains Base64 encoding of the certificate text, a plain-text header & a footer that marks the beginning and end of the certificate.

You may need to convert existing files types to supported types. See [Convert existing files to supported files](#convert-existing-files-to-supported-files) for details.

### Certificate file parameter requirements

Verify that you've met the following parameter requirements before creating a certificate:

- [CRT file requirements](#crt-file-requirements)
- [Key file requirements](#key-file-requirements)
- [Using a certificate chain (optional)](#using-a-certificate-chain-optional)

### CRT file requirements

This section covers .crt field requirements.

- Signature Algorithm = SHA256RSA 
- Signature Hash Algorithm = SHA256 
- Valid from = Valid past date 
- Valid To = Valid future date 
- Public Key = RSA 2048 bits (Minimum) or 4096 bits 
- CRL Distribution Point = URL to .crl file 
- Subject CN (Common Name) = domain name of the appliance; for example, Sensor.contoso.com, or *.contoso.com.  
- Subject (C)ountry = defined, for example, US 
- Subject (OU) Org Unit = defined, for example, Contoso Labs 
- Subject (O)rganization = defined, for example, Contoso Inc. 

> [!IMPORTANT]
> Certificates with other parameters might work, but Microsoft doesn't support them.
> Wildcard SSL certificates (public key certificates that can be used on multiple subdomains such as *.contoso.com) are not supported and insecure. Each appliance should use a unique CN.

### Key file requirements

Use either RSA 2048 bits or 4096 bits.

When using a key length of 4096 bits, the SSL handshake at the start of each connection will be slower. In addition, there's an increase in CPU usage during handshakes.

### Using a certificate chain (optional)

A .pem file containing the certificates of all the certificate authorities in the chain of trust that led to your certificate. 

Bag attributes are supported in the certificate chain file.

## Create SSL certificates

Use a certificate management platform to create a certificate, for example, an automated PKI management platform. Verify that the certificates meet certificate file requirements. For more information on testing the files you create, see [Test certificates you create](#test-certificates-you-create).  

If you are not carrying out certificate validation, remove the CRL URL reference in the certificate. See [CRT file requirements](#crt-file-requirements) for information about this parameter.

Consult a security, PKI, or other qualified certificate lead if you don't have an application that can automatically create certificates.

You can [Test certificates you create](#test-certificates-you-create).  

You can also convert existing certificate files if you don't want to create new ones. See [Convert existing files to supported files](#convert-existing-files-to-supported-files) for details.

### Sample Certificate

Compare your certificate to the following sample certificate. Verify that the same fields exits and that the order of the fields is the same:

:::image type="content" source="media/how-to-deploy-certificates/sample-certificate.png" alt-text="Screenshot of a sample certificate.":::

## Test certificates you create

Test certificates before deploying them to your sensors and on-premises management consoles. If you want to check the information within the certificate .csr file or private key file, use these commands:

| **Test** | **CLI command** |
|--|--|
| Check a Certificate Signing Request (CSR) | `openssl req -text -noout -verify -in CSR.csr` |
| Check a private key  | `openssl rsa -in privateKey.key -check`  |
| Check a certificate  | `openssl x509 -in certificate.crt -text -noout` |

If these tests fail, review [Certificate file parameter requirements](#certificate-file-parameter-requirements) to verify file parameters are accurate, or consult your certificate lead.

## Convert existing files to supported files 

This section describes how to convert existing certificates files to supported formats.

|**Description** | **CLI command** |
|--|--|
| Convert .crt file to .pem file   | `openssl x509 -inform PEM -in <full path>/<pem-file-name>.crt -out <fullpath>/<crt-file-name>.pem`  | 
| Convert .pem file to .crt file   | `openssl x509 -inform PEM -in <full path>/<pem-file-name>.pem -out <fullpath>/<crt-file-name>.crt` |  
| Convert a PKCS#12 file (.pfx .p12) containing a private key and certificates to .pem   | `openssl pkcs12 -in keyStore.pfx -out keyStore.pem -nodes`. You can add -nocerts to only output the private key, or add -nokeys to only output the certificates.  | 
|  Convert .cer file to .crt file  |  `openssl x509 -inform PEM -in <filepath>/certificate.cer -out certificate.crt` <br> Make sure to specify the full path. <br><br>**Note**: Other options are available for the -inform flag. The value is usually `DER` or `PEM` but might also be `P12` or another value. For more information, see [`openssl-format-options`]( https://www.openssl.org/docs/manmaster/man1/openssl-format-options.html) and [openssl-x509]( https://www.openssl.org/docs/manmaster/man1/openssl-x509.html). |

## Troubleshooting

This section covers various issues that may occur during certificate upload and validation, and steps to take to resolve the issues.

### Troubleshoot CA-Certificate Upload  

Admin users attempting to log in to the sensor or on-premises management console for the first time will not be able to upload the CA-signed certificate if the certificate isn't created properly or is invalid. If certificate upload fails, one or several of the error messages will display:

| **Certificate validation error** | **Recommendation** |
|--|--|
| Passphrase does not match to the key | Validate that you typed the correct passphrase. If the problem continues, try recreating the certificate using the correct passphrase. |
| Cannot validate chain of trust. The provided Certificate and Root CA don't match.  | Make sure the .pem file correlates to the  .crt file. If the problem continues, try recreating the certificate using the correct chain of trust (defined by the .pem file). |
| This SSL certificate has expired and isn't considered valid.  | Create a new certificate with valid dates.|
| This SSL certificate has expired and isn't considered valid.  | Create a new certificate with valid dates.|
|This certificate has been revoked by the CRL and can't be trusted for a secure connection | Create a new unrevoked certificate. |
|The CRL (Certificate Revocation List) location is not reachable. Verify the URL can be accessed from this appliance | Make sure that your network configuration allows the appliance to reach the CRL Server defined in the certificate. You can use a proxy server if there are limitations in establishing a direct connection.  
|Certificate validation failed  | This indicates a general error in the appliance. Contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).|

### Troubleshoot file conversions  

Your file conversion may not create a valid certificate. For example, the file structure may be inaccurate.

If the conversion fails:  

- Use the conversion commands described in [Convert existing files to supported files](#convert-existing-files-to-supported-files).
- Make sure the file parameters are accurate. See [Supported certificate file types](#supported-certificate-file-types) and [Certificate File Parameter Requirements](#certificate-file-parameter-requirements) for details.  
- Consult your certificate lead.

## Next steps

For more information, see [Identify required appliances](how-to-identify-required-appliances.md).

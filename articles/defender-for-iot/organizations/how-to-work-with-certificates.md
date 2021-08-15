---
title: Work with Certificates
description: This articles provides information that IT specialists need when creating and deploying certificates for Defender for IoT.
ms.date: 08/11/2021
ms.topic: article
---


# Working with Certificates 

This articles provides information that IT specialists need when creating and deploying certificates for Defender for IoT.

Azure Defender for IoT uses SSL/TLS certificates to secure communication between the following system components:

- Between users, and the web console of the appliance.
- To the REST API on the sensor and on-premises management console.
- Between the sensors and an on-premises management console.
- Between a management console and a High Availability management console.

Defender for IoT Admin users will upload the certificates you create to sensors and on-premises management console.

## About certificate validation

In addition to securing communication between system components, you can also carry out certificate validation. Validation is carried out *once*when the certificate is uploaded. Validation is evaluated against a Certificate Revocation List (CRL) and the certificate expiration date.  Certificate trust chain validation is also carried out.

*If validation fails, communication between the relevant components is halted and a validation error is presented in the console*.

>[!Note] Your system may work with Forwarding Rules where 3rd party integrations use unique certificates. In these cases, Certificate validation will take place with the integrated server certificate. See TBD for details.

Admin users uploading certificates can disable certificate validations. When disabled, encrypted communications between components continues, even if a certificate is invalid.


## About certificate upload to Defender for IoT

Following sensor and on-premises management console installation, a local self-signed certificate is generated and used to access the sensor and on-premises management console web application. 

When signing in to the console for the first time, Admin users are prompted to upload an SSL/TLS certificate. 
In addition, an option to validate the uploaded certificate and third party certificates is automatically is enabled.

:::image type="content" source="media/how-to-set-up-your-network/certificate_upload.png" alt-text="certificate_upload screen":::

If the certificate is not created properly, it cannot be uploaded and the Admin cannot access the console. Admin users will get one of the following error messages if there is a problem with the files.

- Passphrase does not match to the key
- Certificate Validation Failed
- Cannot validate chain of trust.The provided Certificate and Root CA do not match.
- This SSL certificate has expired and is not considered valid. 
- "This certificate has been revoked by the CRL and cannot be trusted for a secure connection.
- Cannot download chain certificates.
- Cannot download certificate.
- The CRL (Certificate Revocation List) location is not reachable. Verify the URL can be accessed from this appliance

## About certificate generation framework

Certificate generation is supported in any of the following frameowrks:
- Private and Enterprise Key Infrastructure (Private PKI) 
- Public Key Infrastructure (Public PKI) 
- Locally generated on the appliance (locally self-signed).

>[!Important]It is not recommended to use a locally self-signed certificates. This type of connection is not secure and should be used for test environments only. Since, the owner of the certificate can't be validated, and the security of your system can't be maintained, self-signed certificates should never be used for production networks.



## Certificate deployment tasks

This section describes the steps you need to take to ensure that certificate deployment runs smoothly.

**To deploy certificates, verify that**

1. You create a unique certificate for **each** sensor, management console and HA machine.
1. You meet certificate creation prerequisites. See [Certificate creation prerequisites](#certificate-creation-prerequisites)
1. You create the required certificate. See See [Certificate creation prerequisites](#certificate-creation-prerequisites).
1. The Admin users logging in to each Defender for IoT sensor, and on-premises management console and High Availability machine have access to the certificate.
1. You notified the Admin users if there is a requirement to work with or not work with certificate validation.

## Certificate creation prerequisites

This section covers the certificate creation prerequisites,including:

- [Port access requirements](#port-access-requirements)

- [File type requirements](#file-type-requirements)

### Port access requirements

Verify access to port 80 is available.

Certificate validation is evaluated against a Certificate Revocation List, and the certificate expiration date. This means appliance should be able to establish connection to the CRL server defined by the certificate. By default, the certificate will reference the CRL URL on HTTP port 80. 

Some organizational security policies may block access to this port. If your organization does not have access to port 80, you can:
1. Define another URL and a specific port in the certificate. 
- The URL should be defined as http:// rather than https://.
- Verify that the destination CRL server can listen on the port you defined. 
1. Use a proxy server that will access the CRL on port 80.
1. Not carry out CRL validation. In this case, remove the CRL URL reference in the certificate.

### File type requirements

Each CA-signed certificates should contain a .key file and a .crt file. Some organizations may require .pem file. Defender for IoT does not require this file type.

**.cert .cer .crt – certificate container file** A `.pem`, or `.der` formatted file with a different extension. The file is recognized by Windows Explorer as a certificate. The `.pem` file is not recognized by Windows Explorer.

**.key – Private Key File** A key file is in the same format as a PEM file, but it has a different extension.

**.pem – certificate container file** (optional)
 PEM is a text file that contains Base64 encoding of the certificate text, a plain-text header & a footer that marks the beginning and end of the certificate. 

See TBD if created a certificate but need to convert file types. 

## Create certificates

1. Use a CA platform to create a certificate.
1. Verify that it meets certificate file requirements.

If you doe not have CA you can create something local for  using these commands:


| Description | CLI Command |
|--|--|
| Generate a new private key and Certificate Signing Request | `openssl req -out CSR.csr -new -newkey rsa:2048 -nodes -keyout privateKey.key` |
| Generate a self-signed certificate | `openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt` |
| Generate a certificate signing request (CSR) for an existing private key | `openssl req -out CSR.csr -key privateKey.key -new` |
| Generate a certificate signing request based on an existing certificate | `openssl x509 -x509toreq -in certificate.crt -out CSR.csr -signkey privateKey.key` |
| Remove a passphrase from a private key | `openssl rsa -in privateKey.pem -out newPrivateKey.pem` |

### Troubleshooting certificate creation

If you need to check the information within a certificate, CSR or Private Key, use these commands:

**Ariel/Dolev-** why would I want to do this? What would be trigger?

| Description | CLI Command |
|--|--|
| Check a Certificate Signing Request (CSR) | `openssl req -text -noout -verify -in CSR.csr` |
| Check a private key | `openssl rsa -in privateKey.key -check` |
| Check a certificate | `openssl x509 -in certificate.crt -text -noout`  |

If you receive an error that the private key doesn’t match the certificate, or that a certificate that you installed on a site is not trusted, use these commands to fix the error;
**Ariel/Dolev-** where would I see this error?

| Description | CLI Command |
|--|--|
| Check an MD5 hash of the public key to ensure that it matches with what is in a CSR or private key | 1. `openssl x509 -noout -modulus -in certificate.crt | openssl md5` <br /> 2. `openssl rsa -noout -modulus -in privateKey.key | openssl md5` <br /> 3. `openssl req -noout -modulus -in CSR.csr | openssl md5 ` |
-----------------------------------------

#### Convert non-supported file types to supported types

Convert the following files to a .pem file:

**.pkcs12 .pfx .p12 – password container**. 

Originally defined by RSA in the Public-Key Cryptography Standards (PKCS), the 12-variant was originally enhanced by Microsoft, and later submitted as RFC 7292.  

This container format requires a password that contains both public and private certificate pairs. Unlike `.pem` files, this container is fully encrypted. 
 
**To convert the file:**

1. Use OpenSSL to turn this into a `.pem` file with both public and private keys: `openssl pkcs12 -in file-to-convert.p12 -out converted-file.pem -nodes`  

**.der – binary encoded PEM**.

The way to encode ASN.1 syntax in binary, is through a `.pem` file, which is just a Base64 encoded `.der` file. 

**To convert the file:**

1. Use OpenSSL can convert these files to a `.pem`: `openssl x509 -inform der -in to-convert.der -out converted.pem`.  

2. Windows will recognize these files as certificate files. By default, Windows will export certificates as `.der` formatted files with a different extension.  

**Why does the info appear twice?** 

## Convert exsiting ceritificate files to supported files

To convert certificates and keys to different formats to make them compatible with specific types of servers, or software, use these commands;

| Description | CLI Command |
|--|--|
| Convert a DER file (.crt .cer .der) to PEM  | `openssl x509 -inform der -in certificate.cer -out certificate.pem`  |
| Convert a PEM file to DER | `openssl x509 -outform der -in certificate.pem -out certificate.der`  |
| Convert a PKCS#12 file (.pfx .p12) containing a private key and certificates to PEM | `openssl pkcs12 -in keyStore.pfx -out keyStore.pem -nodes` <br />You can add `-nocerts` to only output the private key, or add `-nokeys` to only output the certificates. |
| Convert a PEM certificate file and a private key to PKCS#12 (.pfx .p12) | `openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt -certfile CACert.crt` |

#### Supported parameters for SSL certificate

The following certificate parameters are supported. 

**Certificate CRT**

- The primary certificate file for your domain name
- Signature Algorithm = SHA256RSA
- Signature Hash Algorithm = SHA256
- Valid from = Valid past date
- Valid To = Valid future date
- Public Key = RSA 2048 bits (Minimum) or 4096 bits
- CRL Distribution Point = URL to .crl file
- Subject CN = URL, can be a wildcard certificate; for example, Sensor.contoso.<span>com, or *.contoso.<span>com
- Subject (C)ountry = defined, for example, US
- Subject (OU) Org Unit = defined, for example, Contoso Labs
- Subject (O)rganization = defined, for example, Contoso Inc.

**Key File**

- The key file generated when you created CSR.

- RSA 2048 bits (Minimum) or 4096 bits.

 > [!Note]
 > Using a key length of 4096bits:
 > - The SSL handshake at the start of each connection will be slower.  
 > - There's an increase in CPU usage during handshakes. 

**Certificate Chain**

- The intermediate certificate file (if any) that was supplied by your CA

- The CA certificate that issued the server's certificate should be first in the file, followed by any others up to the root. 
- Can include Bag attributes.

**Passphrase**

- One key supported.

- Set up when you're importing the certificate.

Certificates with other parameters might work, but Microsoft doesn't support them.


 
##### CLI commands

Use the `cyberx-xsense-certificate-import` CLI command to import certificates. To use this tool, you need to upload certificate files to the device, by using tools such as WinSCP or Wget.

The command supports the following input flags:

- `-h`:  Shows the command-line help syntax.

- `--crt`:  Path to a certificate file (.crt extension).

- `--key`:  \*.key file. Key length should be a minimum of 2,048 bits.

- `--chain`:  Path to a certificate chain file (optional).

- `--pass`:  Passphrase used to encrypt the certificate (optional).

- `--passphrase-set`:  Default = `False`, unused. Set to `True` to use the previous passphrase supplied with the previous certificate (optional).

When you're using the CLI command:

- Verify that the certificate files are readable on the appliance.

- Verify that the domain name and IP in the certificate match the configuration that the IT department has planned.





## Replacing existing certificates

Appliances may use unique certificate files. If you need to replace a certificate, you have uploaded;

- From version 10.0, the certificate can be replaced from the System Settings menu.

- For versions previous to 10.0, the SSL certificate can be replaced using the command-line tool.** 
- 
## Certificates and forwrading rules.
 > For integration forwarding rules where the appliance is the client and initiator of the session, unique certificates are used.
In these cases, the certificates are typically received from the server, or use asymmetric encryption where a specific certificate will be provided to set up the integration. For example alert information ServiceNow; or communications with Active Directory. Users will upload the certificate of the destination server when creating the forwarding rule.  You do not need to create a certificate.

### Network access requirements

Verify that your organizational security policy allows access to the following:

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| HTTPS | TCP | IN/OUT | 443 | Sensor and On-Premises Management Console Web Console | Access to Web console | Client | Sensor and on-premises management console |
| SSH | TCP | IN/OUT | 22 | CLI | Access to the CLI | Client | Sensor and on-premises management console |
| SSL | TCP | IN/OUT | 443 | Sensor and on-premises management console | Connection Between CyberX platform and the Central Management platform | sensor | On-premises management console |
| NTP | UDP | IN | 123 | Time Sync | On-premises management console use as NTP to sensor | sensor | on-premises management console |
| NTP | UDP | IN/OUT | 123 | Time Sync | Sensor connected to external NTP server, when there is no on-premises management console installed | sensor | NTP |
| SMTP | TCP | OUT | 25 | Email | The connection between CyberX platform and the Management platform and the mail server | Sensor and On-premises management console | Email server |
| Syslog | UDP | OUT | 514 | LEEF | Logs that send from the on-premises management console to Syslog server | On-premises management console and Sensor | Syslog server |
| DNS |  | IN/OUT | 53 | DNS | DNS Server Port | On-premises management console and Sensor | DNS server |
| LDAP | TCP | IN/OUT | 389 | Active Directory | The connection between CyberX platform and the Management platform to the Active Directory | On-premises management console and Sensor | LDAP server |
| LDAPS | TCP | IN/OUT | 636 | Active Directory | The connection between CyberX platform and the Management platform to the Active Directory | On-premises management console and Sensor | LDAPS server |
| SNMP | UDP | OUT | 161 | Monitoring | Remote SNMP collectors. | On-premises management console and Sensor | SNMP server |
| WMI | UDP | OUT | 135 | monitoring | Windows Endpoint Monitoring | Sensor | Relevant network element |
| Tunneling | TCP | IN | 9000 <br /><br />- on top of port 443 <br /><br />From end user to the on-premises management console. <br /><br />- Port 22 from sensor to the on-premises management console  | monitoring | Tunneling | Sensor | On-premises management console |

### Plan rack installation

To plan your rack installation:

1. Prepare a monitor and a keyboard for your appliance network settings.

1. Allocate the rack space for the appliance.

1. Have AC power available for the appliance.
1. Prepare the LAN cable for connecting the management to the network switch.
1. Prepare the LAN cables for connecting switch SPAN (mirror) ports and or network taps to the Defender for IoT appliance. 
1. Configure, connect, and validate SPAN ports in the mirrored switches as described in the architecture review session.
1. Connect the configured SPAN port to a computer running Wireshark and verify that the port is configured correctly.
1. Open all the relevant firewall ports.
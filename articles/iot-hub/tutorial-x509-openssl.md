---
title: Tutorial - Use OpenSSL to create X.509 test certificates for Azure IoT Hub| Microsoft Docs
description: Tutorial - Use OpenSSL to create CA and device certificates for Azure IoT hub
author: v-gpettibone
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 02/26/2021
ms.author: robinsh
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics', devx-track-azurecli]
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This step of the tutorial needs to introduce me to OpenSSL that I can use to generate test certificates. 
---

# Tutorial: Using OpenSSL to create test certificates

Although you can purchase X.509 certificates from a trusted certification authority, creating your own test certificate hierarchy or using self-signed certificates is adequate for testing IoT hub device authentication. The following example uses [OpenSSL](https://www.openssl.org/) and the [OpenSSL Cookbook](https://www.feistyduck.com/library/openssl-cookbook/online/ch-openssl.html) to create a certification authority (CA), a subordinate CA, and a device certificate. The example then signs the subordinate CA and the device certificate into a certificate hierarchy. This is presented for example purposes only.

## Step 1 - Create the root CA directory structure

Create a directory structure for the certification authority.

* The **certs** directory stores new certificates.
* The **db** directory is used for the certificate database.
* The **private** directory stores the CA private key.

```bash
  mkdir rootca
  cd rootca
  mkdir certs db private
  touch db/index
  openssl rand -hex 16 > db/serial
  echo 1001 > db/crlnumber
```

## Step 2 - Create a root CA configuration file

Before creating a CA, create a configuration file and save it as `rootca.conf` in the rootca directory.

```xml
[default]
name                     = rootca
domain_suffix            = example.com
aia_url                  = http://$name.$domain_suffix/$name.crt
crl_url                  = http://$name.$domain_suffix/$name.crl
default_ca               = ca_default
name_opt                 = utf8,esc_ctrl,multiline,lname,align

[ca_dn]
commonName               = "Test Root CA"

[ca_default]
home                     = ../rootca 
database                 = $home/db/index
serial                   = $home/db/serial
crlnumber                = $home/db/crlnumber
certificate              = $home/$name.crt
private_key              = $home/private/$name.key
RANDFILE                 = $home/private/random
new_certs_dir            = $home/certs
unique_subject           = no
copy_extensions          = none
default_days             = 3650
default_crl_days         = 365
default_md               = sha256
policy                   = policy_c_o_match

[policy_c_o_match]
countryName              = optional
stateOrProvinceName      = optional
organizationName         = optional
organizationalUnitName   = optional
commonName               = supplied
emailAddress             = optional

[req]
default_bits             = 2048
encrypt_key              = yes
default_md               = sha256
utf8                     = yes
string_mask              = utf8only
prompt                   = no
distinguished_name       = ca_dn
req_extensions           = ca_ext

[ca_ext]
basicConstraints         = critical,CA:true
keyUsage                 = critical,keyCertSign,cRLSign
subjectKeyIdentifier     = hash

[sub_ca_ext]
authorityKeyIdentifier   = keyid:always
basicConstraints         = critical,CA:true,pathlen:0
extendedKeyUsage         = clientAuth,serverAuth
keyUsage                 = critical,keyCertSign,cRLSign
subjectKeyIdentifier     = hash

```

## Step 3 - Create a root CA

First, generate the key and the certificate signing request (CSR) in the rootca directory.

```bash
  openssl req -new -config rootca.conf -out rootca.csr -keyout private/rootca.key
```

Next, create a self-signed CA certificate. Self-signing is suitable for testing purposes. Specify the ca_ext configuration file extensions on the command line. These indicate that the certificate is for a root CA and can be used to sign certificates and certificate revocation lists (CRLs). Sign the certificate, and commit it to the database.

```bash
  openssl ca -selfsign -config rootca.conf -in rootca.csr -out rootca.crt -extensions ca_ext
```

## Step 4 - Create the subordinate CA directory structure

Create a directory structure for the subordinate CA.

```bash
  mkdir subca
  cd subca
  mkdir certs db private
  touch db/index
  openssl rand -hex 16 > db/serial
  echo 1001 > db/crlnumber
```

## Step 5 - Create a subordinate CA configuration file

Create a configuration file and save it as subca.conf in the `subca` directory.

```bash
[default]
name                     = subca
domain_suffix            = example.com
aia_url                  = http://$name.$domain_suffix/$name.crt
crl_url                  = http://$name.$domain_suffix/$name.crl
default_ca               = ca_default
name_opt                 = utf8,esc_ctrl,multiline,lname,align

[ca_dn]
commonName               = "Test Subordinate CA"

[ca_default]
home                     = . 
database                 = $home/db/index
serial                   = $home/db/serial
crlnumber                = $home/db/crlnumber
certificate              = $home/$name.crt
private_key              = $home/private/$name.key
RANDFILE                 = $home/private/random
new_certs_dir            = $home/certs
unique_subject           = no
copy_extensions          = copy 
default_days           
default_crl_days         = 90 
default_md               = sha256
policy                   = policy_c_o_match

[policy_c_o_match]
countryName              = optional
stateOrProvinceName      = optional
organizationName         = optional
organizationalUnitName   = optional
commonName               = supplied
emailAddress             = optional

[req]
default_bits             = 2048
encrypt_key              = yes
default_md               = sha256
utf8                     = yes
string_mask              = utf8only
prompt                   = no
distinguished_name       = ca_dn
req_extensions           = ca_ext

[ca_ext]
basicConstraints         = critical,CA:true
keyUsage                 = critical,keyCertSign,cRLSign
subjectKeyIdentifier     = hash

[sub_ca_ext]
authorityKeyIdentifier   = keyid:always
basicConstraints         = critical,CA:true,pathlen:0
extendedKeyUsage         = clientAuth,serverAuth
keyUsage                 = critical,keyCertSign,cRLSign
subjectKeyIdentifier     = hash

[client_ext]
authorityKeyIdentifier   = keyid:always
basicConstraints         = critical,CA:false
extendedKeyUsage         = clientAuth
keyUsage                 = critical,digitalSignature
subjectKeyIdentifier     = hash
```

## Step 6 - Create a subordinate CA

Create a new serial number in the `rootca/db/serial` file for the subordinate CA certificate.

```bash
  openssl rand -hex 16 > db/serial
```

>[!IMPORTANT]
>You must create a new serial number for every subordinate CA certificate and every device certificate that you create. Different certificates cannot have the same serial number.

This example shows you how to create a subordinate or registration CA. Because you can use the root CA to sign certificates, creating a subordinate CA isn’t strictly necessary. Having a subordinate CA does, however,  mimic real world certificate hierarchies in which the root CA is kept offline and subordinate CAs issue client certificates.

Use the configuration file to generate a key and a certificate signing request (CSR).

```bash
  openssl req -new -config subca.conf -out subca.csr -keyout private/subca.key
```

Submit the CSR to the root CA and use the root CA to issue and sign the subordinate CA certificate. Specify sub_ca_ext for the extensions switch on the command line. The extensions indicate that the certificate is for a CA that can sign certificates and certificate revocation lists (CRLs). When prompted, sign the certificate, and commit it to the database.

```bash
  openssl ca -config ../rootca/rootca.conf -in subca.csr -out subca.crt -extensions sub_ca_ext
```

## Step 7 - Demonstrate proof of possession

You now have both a root CA certificate and a subordinate CA certificate. You can use either one to sign device certificates. The one you choose must be uploaded to your IoT Hub. The following steps assume that you are using the subordinate CA certificate. To upload and register your subordinate CA certificate to your IoT Hub:

1. In the Azure portal, navigate to your IoTHub and select **Settings > Certificates**.

1. Select **Add** to add your new subordinate CA certificate.

1. Enter a display name in the **Certificate Name** field, and select the PEM  certificate file you created previously.

1. Select **Save**. Your certificate is shown in the certificate list with a status of **Unverified**. The verification process will prove that you own the certificate.

   
1. Select the certificate to view the **Certificate Details** dialog.

1. Select **Generate Verification Code**. For more information, see [Prove Possession of a CA certificate](tutorial-x509-prove-possession.md).

1. Copy the verification code to the clipboard. You must set the verification code as the certificate subject. For example, if the verification code is BB0C656E69AF75E3FB3C8D922C1760C58C1DA5B05AAA9D0A, add that as the subject of your certificate as shown in the next step.

1. Generate a private key.

  ```bash
    $ openssl req -new -key pop.key -out pop.csr

    -----
    Country Name (2 letter code) [XX]:.
    State or Province Name (full name) []:.
    Locality Name (eg, city) [Default City]:.
    Organization Name (eg, company) [Default Company Ltd]:.
    Organizational Unit Name (eg, section) []:.
    Common Name (eg, your name or your server hostname) []:BB0C656E69AF75E3FB3C8D922C1760C58C1DA5B05AAA9D0A
    Email Address []:

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:
 
  ```

9. Create a certificate using the root CA configuration file and the CSR.

  ```bash
    openssl ca -config rootca.conf -in pop.csr -out pop.crt -extensions client_ext

  ```

10. Select the new certificate in the **Certificate Details** view

11. After the certificate uploads, select **Verify**. The CA certificate status should change to **Verified**.

## Step 8 - Create a device in your IoT Hub

Navigate to your IoT Hub in the Azure portal and create a new IoT device identity with the following values:

1. Provide the **Device ID** that matches the subject name of your device certificates.

1. Select the **X.509 CA Signed** authentication type.

1. Select **Save**.

## Step 9 - Create a client device certificate

To generate a client certificate, you must first generate a private key. The following command shows how to use OpenSSL to create a private key. Create the key in the subca directory.

```bash
openssl genpkey -out device.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048
```

Create a certificate signing request (CSR) for the key. You do not need to enter a challenge password or an optional company name. You must, however, enter the device ID in the common name field.

```bash
openssl req -new -key device.key -out device.csr

-----
Country Name (2 letter code) [XX]:.
State or Province Name (full name) []:.
Locality Name (eg, city) [Default City]:.
Organization Name (eg, company) [Default Company Ltd]:.
Organizational Unit Name (eg, section) []:
Common Name (eg, your name or your server hostname) []:`<your device ID>`
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:

```

Check that the CSR is what you expect.

```bash
openssl req -text -in device.csr -noout
```

Send the CSR to the subordinate CA for signing into the certificate hierarchy. Specify `client_ext` in the `-extensions` switch. Notice that the `Basic Constraints` in the issued certificate indicate that this certificate is not for a CA. If you are signing multiple certificates, be sure to update the serial number before generating each certificate by using the openssl `rand -hex 16 > db/serial` command.

```bash
openssl ca -config subca.conf -in device.csr -out device.crt -extensions client_ext
```

## Next Steps

Go to [Testing Certificate Authentication](tutorial-x509-test-certificate.md) to determine if your certificate can authenticate your device to your IoT Hub.

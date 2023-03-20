---
title: Tutorial - Create a root CA and certificates for testing | Microsoft Docs
description: Tutorial - Create a root certificate authority and use it to make and sign certificates that you can use for testing purposes with Azure IoT Hub
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 03/03/2023
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to test my devices on an IoT hub. 
---

# Tutorial: Create a root CA and certificates for testing

## Prerequisites

* A local instance of Azure CLI. This article requires Azure CLI version 2.36 or later. Run `az --version` to find the version. To locally install or upgrade Azure CLI, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a root CA

Intro

Proc

1. Start an Azure CLI session and run the following command, replacing *{basedir}* with the desired folder in which to create the root CA.

    ```bash
    cd {basedir}
    ```

1. In the CLI session, run the following commands, one at a time. This step creates the following folder structure and support files for the root CA.

    | Folder or file | Description |
    | --- | --- |
    | rootca | The root folder of the root CA. |
    | rootca/certs | The folder in which CA certificates for the root CA are created and stored. |
    | rootca/db | The folder in which the database for the root CA is stored. |
    | rootca/db/index | The index file for the root CA. The `touch` command creates a file without any content, for later use. |
    | rootca/db/serial | The serial number file for the root CA. The `openssl` command creates a 16-byte random number in hexadecimal format, then stores it in this file. |
    | rootca/db/crlnumber | A file used to store serial numbers for revoked CA certificates issued by the root CA. The `echo` command pipes a sample serial number, 1001, into the file. |
    | rootca/private | The folder in which private files for the root CA, including the private key, are stored. |

    ```bash
      mkdir rootca
      cd rootca
      mkdir certs db private
      touch db/index
      openssl rand -hex 16 > db/serial
      echo 1001 > db/crlnumber
    ```

1. Create a text file named *rootca.conf* in the *rootca* folder created in the previous step, then copy and save the following OpenSSL configuration settings into that file. The file provides OpenSSL with the values needed to configure your test root CA. For this example, the file configures a root CA named *rootca* for the *example.com* domain, using the folders and files created in previous steps. The file also provides configuration settings for:
    - The CA policy used by the root CA for certificate Distinguished Name (DN) fields
    - Certificate requests created by the root CA
    - X.509 extensions applied to root CA certificates, intermediate CA certificates, and client certificates issued by the root CA

    For more information about the syntax of OpenSSL configuration files, see the [config](https://www.openssl.org/docs/manmaster/man5/config.html) master manual page in [OpenSSL documentation](https://www.openssl.org/docs/).

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
    
    [client_ext]
    authorityKeyIdentifier   = keyid:always
    basicConstraints         = critical,CA:false
    extendedKeyUsage         = clientAuth
    keyUsage                 = critical,digitalSignature
    subjectKeyIdentifier     = hash
    
    ```

1. In the CLI session, run the following command to generate a private key and a certificate signing request (CSR) in the *rootca* directory. For more information about the OpenSSL `req` command, see the [openssl-req](https://www.openssl.org/docs/man3.1/man1/openssl-req.html) manual page in [OpenSSL documentation](https://www.openssl.org/docs/).

    ```bash
      openssl req -new -config rootca.conf -out rootca.csr -keyout private/rootca.key
    ```

1. In the CLI session, run the following command to create a self-signed root CA certificate. The command applies the `ca_ext` configuration file extensions to the certificate. These extensions indicate that the certificate is for a root CA and can be used to sign certificates and certificate revocation lists (CRLs).

    ```bash
      openssl ca -selfsign -config rootca.conf -in rootca.csr -out rootca.crt -extensions ca_ext
    ```

## Create a subordinate CA

Intro

Proc

1. Start an Azure CLI session and run the following command, replacing *{basedir}* with the folder that contains your previously-created root CA.

    ```bash
    cd {basedir}
    ```

1. In the CLI session, run the following commands, one at a time. This step creates the following folder structure and support files for the subordinate CA.

    | Folder or file | Description |
    | --- | --- |
    | subca | The root folder of the subordinate CA. |
    | subca/certs | The folder in which CA certificates for the subordinate CA are created and stored. |
    | subca/db | The folder in which the database for the subordinate CA is stored. |
    | subca/db/index | The index file for the subordinate CA. The `touch` command creates a file without any content, for later use. |
    | subca/db/serial | The serial number file for the subordinate CA. The `openssl` command creates a 16-byte random number in hexadecimal format, then stores it in this file. |
    | subca/db/crlnumber | A file used to store serial numbers for revoked CA certificates issued by the subordinate CA. The `echo` command pipes a sample serial number, 1001, into the file. |
    | subca/private | The folder in which private files, including the private key,  for the subordinate CA are stored. |

    ```bash
      mkdir subca
      cd subca
      mkdir certs db private
      touch db/index
      openssl rand -hex 16 > db/serial
      echo 1001 > db/crlnumber
    ```

1. Create a text file named *subca.conf* in the *subca* folder created in the previous step, then copy and save the following OpenSSL configuration settings into that file. The file provides OpenSSL with the values needed to configure your test subordinate CA. For this example, the file configures a subordinate CA named *subca* for the *example.com* domain, using the folders and files created in previous steps. The file also provides configuration settings for:
    - The CA policy used by the subordinate CA for certificate Distinguished Name (DN) fields
    - Certificate requests created by the subordinate CA
    - X.509 extensions applied to root CA certificates, intermediate CA certificates, and client certificates issued by the subordinate CA

    For more information about the syntax of OpenSSL configuration files, see the [config](https://www.openssl.org/docs/manmaster/man5/config.html) master manual page in [OpenSSL documentation](https://www.openssl.org/docs/).

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
    default_days             = 365
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
    
1. In the CLI session, run the following commands to generate a private key and a certificate signing request (CSR) in the *subca* directory.

    ```bash
      openssl req -new -config subca.conf -out subca.csr -keyout private/subca.key
    ```

1. In the CLI session, run the following command to create a self-signed root CA certificate in the *subca* directory. The command applies the `ca_ext` configuration file extensions to the certificate. These extensions indicate that the certificate is for a root CA and can be used to sign certificates and certificate revocation lists (CRLs). The command also signs 

    ```bash
      openssl ca -selfsign -config rootca.conf -in rootca.csr -out rootca.crt -extensions ca_ext
    ```
## Step 6 - Create a subordinate CA

This example shows you how to create a subordinate or registration CA. Because you can use the root CA to sign certificates, creating a subordinate CA isn’t strictly necessary. Having a subordinate CA does, however, mimic real world certificate hierarchies in which the root CA is kept offline and a subordinate CA issues client certificates.

From the *subca* directory, use the configuration file to generate a private key and a certificate signing request (CSR).

```bash
  openssl req -new -config subca.conf -out subca.csr -keyout private/subca.key
```

Submit the CSR to the root CA and use the root CA to issue and sign the subordinate CA certificate. Specify `sub_ca_ext` for the extensions switch on the command line. The extensions indicate that the certificate is for a CA that can sign certificates and certificate revocation lists (CRLs). When prompted, sign the certificate, and commit it to the database.

```bash
  openssl ca -config ../rootca/rootca.conf -in subca.csr -out subca.crt -extensions sub_ca_ext
```
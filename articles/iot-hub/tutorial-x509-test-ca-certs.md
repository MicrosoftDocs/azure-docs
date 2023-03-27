---
title: Tutorial - Create and upload certificates for testing | Microsoft Docs
description: Tutorial - Create a root certificate authority and use it to make and sign subordinate CA and client certificates that you can use for testing purposes with Azure IoT Hub
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 03/03/2023
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to test my devices on an IoT hub. 
---

# Tutorial: Create and upload certificates for testing

For production environments, we recommend that you purchase an X.509 CA certificate from a commercial certificate authority (CA) and issue certificates within your organization from internal, self-managed subordinate CAs that are chained to the external root CA as part of a comprehensive public key infrastructure (PKI) strategy. For more information about getting an X.509 CA certificate from a commercial CA, see the [Get an X.509 CA certificate](iot-hub-x509ca-overview.md#get-an-x509-ca-certificate) section of [Authenticate devices using X.509 CA certificates](iot-hub-x509ca-overview.md).

However, creating your own self-managed, private CA that uses an internal root CA as the trust anchor is adequate for testing environments. Using a self-managed private CA with at least one subordinate CA chained to your internal root CA, and client certificates for your devices issued by your subordinate CA certificates, allows you to more closely simulate a recommended production environment.

>[!NOTE]
>We do not recommend the use of a self-managed PKI or self-signed certificates for production environments.

The following tutorial uses [OpenSSL](https://www.openssl.org/) and the [OpenSSL Cookbook](https://www.feistyduck.com/library/openssl-cookbook/online/ch-openssl.html) to create a self-signed internal root certificate authority (CA) and a subordinate CA, then shows how to upload your internal subordinate CA certificate to your IoT hub for testing purposes. The example then signs the subordinate CA and the device certificate into a certificate hierarchy. This example is presented for demonstration purposes only.

>[!NOTE]
>Microsoft provides PowerShell and Bash scripts to help you understand how to create your own X.509 certificates and authenticate them to an IoT hub. The scripts are included with the [Azure IoT Hub Device SDK for C](https://github.com/Azure/azure-iot-sdk-c). The scripts are provided for demonstration purposes only. Certificates created by them must not be used for production. The certificates contain hard-coded passwords (“1234”) and expire after 30 days. You must use your own best practices for certificate creation and lifetime management in a production environment. For more information, see [Managing test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/main/tools/CACertificates/CACertificateOverview.md) in the GitHub repository for the [Azure IoT Hub Device SDK for C](https://github.com/Azure/azure-iot-sdk-c).

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
    | rootca/db | The folder in which the certificate database and support files for the root CA are stored. |
    | rootca/db/index | The certificate database for the root CA. The `touch` command creates a file without any content, for later use. The certificate database is a plain text file managed by OpenSSL that contains certificate information. For more information about the certificate database, see .|
    | rootca/db/serial | A file used to store the serial number of the next certificate to be created for the root CA. The `openssl` command creates a 16-byte random number in hexadecimal format, then stores it in this file to initialize the file for creating the root CA certificate. |
    | rootca/db/crlnumber | A file used to store serial numbers for revoked certificates issued by the root CA. The `echo` command pipes a sample serial number, 1001, into the file. |
    | rootca/private | The folder in which private files for the root CA, including the private key, are stored.<br/><br/>The files in this folder must be secured and protected. |

    ```bash
      mkdir rootca
      cd rootca
      mkdir certs db private
      touch db/index
      openssl rand -hex 16 > db/serial
      echo 1001 > db/crlnumber
    ```

1. Create a text file named *rootca.conf* in the *rootca* folder created in the previous step. Open that file in a text editor, and then copy and save the following OpenSSL configuration settings into that file, replacing the following placeholders with corresponding values. 

    | Placeholder | Description |
    | --- | --- |
    | {CA_Name} | The name of the root CA. For example, `rootca`.|
    | {Domain_Suffix} | The suffix of the domain name for the root CA. For example, `example.com`. |
    | {Common_Name} | The common name of the root CA. For example, `Test Root CA`. |

    The file provides OpenSSL with the values needed to configure your test root CA. For this example, the file configures a root CA using the folders and files created in previous steps. The file also provides configuration settings for:
    - The CA policy used by the root CA for certificate Distinguished Name (DN) fields
    - Certificate requests created by the root CA
    - X.509 extensions applied to root CA certificates, subordinate CA certificates, and client certificates issued by the root CA
    The root CA certificate generated from this configuration file is valid for 3650 days, 

    For more information about the syntax of OpenSSL configuration files, see the [config](https://www.openssl.org/docs/manmaster/man5/config.html) master manual page in [OpenSSL documentation](https://www.openssl.org/docs/).

    ```xml
    [default]
    name                     = {CA_Name}
    domain_suffix            = {Domain_Suffix}
    aia_url                  = http://$name.$domain_suffix/$name.crt
    crl_url                  = http://$name.$domain_suffix/$name.crl
    default_ca               = ca_default
    name_opt                 = utf8,esc_ctrl,multiline,lname,align
    
    [ca_dn]
    commonName               = "{Common_Name}"
    
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

1. In the CLI session, run the following command to generate a certificate signing request (CSR) in the *rootca* directory and a private key in the *rootca/private* directory. For more information about the OpenSSL `req` command, see the [openssl-req](https://www.openssl.org/docs/man3.1/man1/openssl-req.html) manual page in [OpenSSL documentation](https://www.openssl.org/docs/).

    > [!NOTE]
    > Even though this root CA is for testing purposes and won't be exposed as part of a public key infrastructure (PKI), we recommend that you do not share the private key.

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

1. In the CLI session, run the following commands, one at a time, replacing the following placeholders with corresponding values. 

    | Placeholder | Description |
    | --- | --- |
    | {CA_Directory} | The name of the directory for the subordinate CA. For example, `subca`.|
    
    This step creates a folder structure and support files for the subordinate CA similar to that created for the root CA in [Create a root CA](#create-a-root-ca).

    ```bash
      mkdir {CA_Directory}
      cd {CA_Directory}
      mkdir certs db private
      touch db/index
      openssl rand -hex 16 > db/serial
      echo 1001 > db/crlnumber
    ```

1. Create a text file named *subca.conf* in the *subca* folder created in the previous step. Open that file in a text editor, and then copy and save the following OpenSSL configuration settings into that file, replacing the following placeholders with corresponding values. 

    | Placeholder | Description |
    | --- | --- |
    | {CA_Name} | The name of the subordinate CA. For example, `subca`.|
    | {Domain_Suffix} | The suffix of the domain name for the subordinate CA. For example, `example.com`. |
    | {Common_Name} | The common name of the subordinate CA. For example, `Test Subordinate CA`. |

    As with the configuration file for your test root CA, the file provides OpenSSL with the values needed to configure your test subordinate CA.

    For more information about the syntax of OpenSSL configuration files, see the [config](https://www.openssl.org/docs/manmaster/man5/config.html) master manual page in [OpenSSL documentation](https://www.openssl.org/docs/).

    ```xml
    [default]
    name                     = {CA_Name}
    domain_suffix            = {Domain_Suffix}
    aia_url                  = http://$name.$domain_suffix/$name.crt
    crl_url                  = http://$name.$domain_suffix/$name.crl
    default_ca               = ca_default
    name_opt                 = utf8,esc_ctrl,multiline,lname,align
    
    [ca_dn]
    commonName               = "{Common_Name}"
    
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
    
1. In the CLI session, run the following commands to generate a private key and a certificate signing request (CSR) in the *subca* directory.

    ```bash
      openssl req -new -config subca.conf -out subca.csr -keyout private/subca.key
    ```

1. In the CLI session, run the following command to create an subordinate CA certificate in the *subca* directory. The command applies the `sub_ca_ext` configuration file extensions to the certificate. These extensions indicate that the certificate is for a subordinate CA and can also be used to sign certificates and certificate revocation lists (CRLs). Unlike the root CA certificate, this certificate isn't self-signed. Instead, the subordinate CA certificate is signed with the root CA certificate, establishing a certificate hierarchy similar to what you would use for a public key infrastructure (PKI). The subordinate CA certificate is then used to sign client certificates for testing your devices.

    ```bash
      openssl ca -config ../rootca/rootca.conf -in subca.csr -out subca.crt -extensions sub_ca_ext
    ```

## Upload and verify your subordinate CA certificate

After you've created your subordinate CA certificate, you must then upload the certificate to the IoT hub with which you test devices that use client certificates signed by that subordinate CA certificate. When you upload your subordinate CA certificate to your IoT hub, you can set it to verified automatically. The following procedure describes how to upload and automatically verify your subordinate CA certificate to your IoT hub.

1. In the Azure portal, navigate to your IoT hub and select **Certificates** from the resource menu, under **Security settings**.

1. Select **Add** from the command bar to add a new CA certificate.

1. Enter a display name in the **Certificate name** field.

1. Select the certificate file of your subordinate CA certificate to add in the **Certificate .pem or .cer file** field.

1. To automatically verify the certificate, check the box next to **Set certificate status to verified on upload**.

   :::image type="content" source="media/tutorial-x509-prove-possession/skip-pop.png" alt-text="Screenshot showing how to automatically verify the certificate status on upload.":::

1. Select **Save**.  

If you chose to automatically verify your certificate during upload, your certificate is shown with its status set to **Verified** on the **Certificates** tab of the working pane.

You now have a 
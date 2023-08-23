---
title: Create certificates for Azure Stack Edge Pro GPU via Azure PowerShell | Microsoft Docs
description: Describes how to create certificates for Azure Stack Edge Pro GPU device using Azure PowerShell cmdlets.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.custom: devx-track-azurepowershell
ms.topic: article
ms.date: 06/01/2021
ms.author: alkohli
---
# Use certificates with Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the procedure to create your own certificates using the Azure PowerShell cmdlets. The article includes the guidelines that you need to follow if you plan to bring your own certificates on Azure Stack Edge device.

Certificates ensure that the communication between your device and clients accessing it is trusted and that you're sending encrypted information to the right server. When your Azure Stack Edge device is initially configured, self-signed certificates are automatically generated. Optionally, you can bring your own certificates. 

You can use one of the following methods to create your own certificates for the device:

 - Use the Azure PowerShell cmdlets.
 - Use the Azure Stack Hub Readiness Checker tool to create certificate signing requests (CSRs) that would help your certificate authority issue you certificates. 

This article only covers how to create your own certificates using the Azure PowerShell cmdlets. 

## Prerequisites

Before you bring your own certificates, make sure that:

- You are familiar with the [Types of the certificates that can be used with your Azure Stack Edge device](azure-stack-edge-gpu-certificates-overview.md).
- You have reviewed the [Certificate requirements for each type of certificate](azure-stack-edge-gpu-certificate-requirements.md).


## Create certificates

The following section describes the procedure to create signing chain and endpoint certificates.


### Certificate workflow

You will have a defined way to create the certificates for the devices operating in your environment. You can use the certificates provided to you by your IT administrator. 

**For development or test purposes only, you can also use Windows PowerShell to create certificates on your local system.** While creating the certificates for the client, follow these guidelines:

1. You can create any of the following types of certificates:

    - Create a single certificate valid for use with a single fully qualified domain name (FQDN). For example, *mydomain.com*.
    - Create a wildcard certificate to secure the main domain name and multiple sub domains as well. For example, **.mydomain.com*.
    - Create a subject alternative name (SAN) certificate that will cover multiple domain names in a single certificate. 

2. If you are bringing your own certificate, you will need a root certificate for the signing chain. See steps to [Create signing chain certificates](#create-signing-chain-certificate).

3. You can next create the endpoint certificates for the local UI of the appliance, blob, and Azure Resource Manager. You can create 3 separate certificates for the appliance, blob, and Azure Resource Manager, or you can create one certificate for all the 3 endpoints. For detailed steps, see [Create signing and endpoint certificates](#create-signed-endpoint-certificates).

4. Whether you are creating 3 separate certificates or one certificate, specify the subject names (SN) and subject alternative names (SAN) as per the guidance provided for each certificate type. 

### Create signing chain certificate

Create these certificates via Windows PowerShell running in administrator mode. **The certificates created this way should be used for development or test purposes only.**

The signing chain certificate needs to be created only once. The other end point certificates will refer to this certificate for signing.
 

```azurepowershell
$cert = New-SelfSignedCertificate -Type Custom -KeySpec Signature -Subject "CN=RootCert" -HashAlgorithm sha256 -KeyLength 2048 -CertStoreLocation "Cert:\LocalMachine\My" -KeyUsageProperty Sign -KeyUsage CertSign
```


### Create signed endpoint certificates

Create these certificates via Windows PowerShell running in administrator mode.

In these examples, endpoints certificates are created for a device with:
    - Device name: `DBE-HWDC1T2`
    - DNS domain: `microsoftdatabox.com`

Replace with the name and DNS domain for your device to create certificates for your device.
 
**Blob endpoint certificate**

Create a certificate for the Blob endpoint in your personal store.

```azurepowershell
$AppName = "DBE-HWDC1T2"
$domain = "microsoftdatabox.com"

New-SelfSignedCertificate -Type Custom -DnsName "*.blob.$AppName.$domain" -Subject "CN=*.blob.$AppName.$domain" -KeyExportPolicy Exportable  -HashAlgorithm sha256 -KeyLength 2048  -CertStoreLocation "Cert:\LocalMachine\My" -Signer $cert -KeySpec KeyExchange -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")
```

**Azure Resource Manager endpoint certificate**

Create a certificate for the Azure Resource Manager endpoints in your personal store.

```azurepowershell
$AppName = "DBE-HWDC1T2"
$domain = "microsoftdatabox.com"

New-SelfSignedCertificate -Type Custom -DnsName "management.$AppName.$domain","login.$AppName.$domain" -Subject "CN=management.$AppName.$domain" -KeyExportPolicy Exportable  -HashAlgorithm sha256 -KeyLength 2048  -CertStoreLocation "Cert:\LocalMachine\My" -Signer $cert -KeySpec KeyExchange -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")
```

**Device local web UI certificate**

Create a certificate for the local web UI of the device in your personal store.

```azurepowershell
$AppName = "DBE-HWDC1T2"
$domain = "microsoftdatabox.com"

New-SelfSignedCertificate -Type Custom -DnsName "$AppName.$domain" -Subject "CN=$AppName.$domain" -KeyExportPolicy Exportable  -HashAlgorithm sha256 -KeyLength 2048  -CertStoreLocation "Cert:\LocalMachine\My" -Signer $cert -KeySpec KeyExchange -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")
```

**Single multi-SAN certificate for all endpoints**

Create a single certificate for all the endpoints in your personal store.

```azurepowershell
$AppName = "DBE-HWDC1T2"
$domain = "microsoftdatabox.com"
$DeviceSerial = "HWDC1T2"

New-SelfSignedCertificate -Type Custom -DnsName "$AppName.$domain","$DeviceSerial.$domain","management.$AppName.$domain","login.$AppName.$domain","*.blob.$AppName.$domain" -Subject "CN=$AppName.$domain" -KeyExportPolicy Exportable  -HashAlgorithm sha256 -KeyLength 2048  -CertStoreLocation "Cert:\LocalMachine\My" -Signer $cert -KeySpec KeyExchange -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1")
```

Once the certificates are created, the next step is to upload the certificates on your Azure Stack Edge Pro GPU device.

## Next steps

[Upload certificates on your device](azure-stack-edge-gpu-manage-certificates.md).

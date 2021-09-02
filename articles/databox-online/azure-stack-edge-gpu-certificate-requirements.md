---
title: Certificates requirements and troubleshooting with Azure Stack Edge Pro | Microsoft Docs
description: Describes certificates requirements and troubleshooting certificate errors with Azure Stack Edge Pro device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/22/2021
ms.author: alkohli
---

# Certificate requirements

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the certificate requirements that must be met before certificates can be installed on your Azure Stack Edge Pro device. The requirements are related to PFX certificates, issuing authority,  certificate subject name and subject alternative name, and supported certificate algorithms.

## Certificate issuing authority

Certificate issuing requirements are as follows:

* Certificates must be issued from either an internal certificate authority or a public certificate authority.

* The use of self-signed certificates is not supported.

* The certificate's *Issued to:* field must not be the same as its *Issued by:* field except for Root CA certificates.


## Certificate algorithms

Only the Rivest–Shamir–Adleman (RSA) certificates are supported with your device. Elliptic Curve Digital Signature Algorithm (ECDSA) certificates are not supported.

Certificates that contain an RSA public key are referred to as RSA certificates. Certificates that contain an Elliptic Curve Cryptographic (ECC) public key are referred to as ECDSA (Elliptic Curve Digital Signature Algorithm) certificates.

Certificate algorithm requirements are as follows:

* Certificates must use the RSA key algorithm.

* Only RSA certificates with Microsoft RSA/Schannel Cryptographic Provider are supported.

* The certificate signature algorithm cannot be SHA1.

* Minimum key size is 4096.

## Certificate subject name and subject alternative name

Certificates must meet the following subject name and subject alternative name requirements:

* You can either use a single certificate covering all namespaces in the certificate's Subject Alternative Name (SAN) fields. Alternatively, you can use individual certificates for each of the namespaces. Both approaches require using wild cards for endpoints where required, such as binary large object (Blob).

* Ensure that the subject names (common name in the subject name) is part of subject alternative names in the subject alternative name extension.

* You can use a single wildcard certificate covering all name spaces in the certificate's SAN fields.

* Use the following table when creating an endpoint certificate:

    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Azure Resource Manager|`management.<Device name>.<Dns Domain>`|`login.<Device name>.<Dns Domain>`<br>`management.<Device name>.<Dns Domain>`|`management.mydevice1.microsoftdatabox.com` |
    |Blob storage|`*.blob.<Device name>.<Dns Domain>`|`*.blob.< Device name>.<Dns Domain>`|`*.blob.mydevice1.microsoftdatabox.com` |
    |Local UI| `<Device name>.<DnsDomain>`|`<Device name>.<DnsDomain>`| `mydevice1.microsoftdatabox.com` |
    |Multi-SAN single certificate for both endpoints|`<Device name>.<dnsdomain>`|`<Device name>.<dnsdomain>`<br>`login.<Device name>.<Dns Domain>`<br>`management.<Device name>.<Dns Domain>`<br>`*.blob.<Device name>.<Dns Domain>`|`mydevice1.microsoftdatabox.com` |
    |Node|`<NodeSerialNo>.<DnsDomain>`|`*.<DnsDomain>`<br><br>`<NodeSerialNo>.<DnsDomain>`|`mydevice1.microsoftdatabox.com` |
    |VPN|`AzureStackEdgeVPNCertificate.<DnsDomain>`<br><br> * AzureStackEdgeVPNCertificate is hardcoded.  | `*.<DnsDomain>`<br><br>`<AzureStackVPN>.<DnsDomain>` | `edgevpncertificate.microsoftdatabox.com`|
    
## PFX certificate

The PFX certificates installed on your Azure Stack Edge Pro device should meet the following requirements:

* When you get your certificates from the SSL authority, makes sure that you get the full signing chain for the certificates.

* When you export a PFX certificate, make sure that you have selected the **Include all certificates in the chain, if possible** option.

* Use a PFX certificate for endpoint, local UI, node, VPN, and Wi-Fi as both the public and private keys are required for Azure Stack Edge Pro. The private key must have the local machine key attribute set.

* The certificate's PFX Encryption should be 3DES. This is the default encryption used when exporting from a Windows 10 client or Windows Server 2016 certificate store. For more information related to 3DES, see [Triple DES](https://en.wikipedia.org/wiki/Triple_DES).

* The certificate PFX files must have valid *Digital Signature* and *KeyEncipherment* values in the *Key Usage* field.

* The certificate PFX files must have the values *Server Authentication (1.3.6.1.5.5.7.3.1)* and *Client Authentication (1.3.6.1.5.5.7.3.2)* in the *Enhanced Key Usage* field.

* The passwords to all certificate PFX files must be the same at the time of deployment if you are using the Azure Stack Readiness Checker Tool. For more information, see [Create certificates for your Azure Stack Edge Pro using Azure Stack Hub Readiness Checker tool](azure-stack-edge-gpu-create-certificates-tool.md).

* The password to the certificate PFX must be a complex password. Make a note of this password because it is used as a deployment parameter.

* Use only RSA certificates with the Microsoft RSA/Schannel Cryptographic provider.

For more information, see [Export PFX certificates with private key](azure-stack-edge-gpu-prepare-certificates-device-upload.md#export-certificates-as-pfx-format-with-private-key).

## Next steps

- Create certificates for your device

    - Via [Azure PowerShell cmdlets](azure-stack-edge-gpu-create-certificates-powershell.md)
    - Via [Azure Stack Hub Readiness Checker tool](azure-stack-edge-gpu-create-certificates-tool.md).


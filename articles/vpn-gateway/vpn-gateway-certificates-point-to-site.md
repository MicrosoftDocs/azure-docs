---
title: 'Generate and export certificates for Point-to-Site: PowerShell: Azure | Microsoft Docs'
description: This article contains steps to create a self-signed root certificate, export the public key, and generate client certificates using PowerShell on Windows 10.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 27b99f7c-50dc-4f88-8a6e-d60080819a43
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/23/2017
ms.author: cherylmc

---
# Generate and export certificates for Point-to-Site connections using PowerShell on Windows 10

Point-to-Site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10. If you are looking for Point-to-Site configuration steps, such as how to upload root certificates, select one of the 'Configure Point-to-Site' articles from the following list:

> [!div class="op_single_selector"]
> * [Create self-signed certificates - PowerShell](vpn-gateway-certificates-point-to-site.md)
> * [Create self-signed certificates - MakeCert](vpn-gateway-certificates-point-to-site-makecert.md)
> * [Configure Point-to-Site - Resource Manager - Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Configure Point-to-Site - Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Configure Point-to-Site - Classic - Azure portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> 
> 


You must perform the steps in this article on a computer running Windows 10. The PowerShell cmdlets that you use to generate certificates are part of the Windows 10 operating system and do not work on other versions of Windows. The Windows 10 computer is only needed to generate the certificates. Once the certificates are generated, you can upload them, or install them on any supported client operating system. 

If you do not have access to a Windows 10 computer, you can use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) to generate certificates. However, MakeCert can't generate SHA-2 certificates, only SHA-1. SHA-1 certificates are still valid for Point-to-Site connections, but SHA-1 uses an encryption hash that is not as strong as SHA-2. For this reason, we recommend that you use these PowerShell steps, if at all possible. The certificates that you generate using either method can be installed on any [supported](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq) client operating system.

## <a name="rootcert"></a>Create a self-signed root certificate

Use the New-SelfSignedCertificate cmdlet to create a self-signed root certificate. For additional parameter information, see [New-SelfSignedCertificate](https://technet.microsoft.com/itpro/powershell/windows/pkiclient/new-selfsignedcertificate).

1. From a computer running Windows 10, open a Windows PowerShell console with elevated privileges.
2. Use the following example to create the self-signed root certificate. The following example creates a self-signed root certificate named 'P2SRootCert' that is automatically installed in 'Certificates-Current User\Personal\Certificates'. You can view the certificate by opening *certmgr.msc*, or *Manage User Certificates*.

  ```powershell
  $cert = New-SelfSignedCertificate -Type Custom -KeySpec Signature `
  -Subject "CN=P2SRootCert" -KeyExportPolicy Exportable `
  -HashAlgorithm sha256 -KeyLength 2048 `
  -CertStoreLocation "Cert:\CurrentUser\My" -KeyUsageProperty Sign -KeyUsage CertSign
  ```

### <a name="cer"></a>Export the public key (.cer)

[!INCLUDE [Export public key](../../includes/vpn-gateway-certificates-export-public-key-include.md)]

The exported.cer file must be uploaded to Azure. For instructions, see [Configure a Point-to-Site connection](vpn-gateway-howto-point-to-site-rm-ps.md#upload). To add an additional trusted root certificate, [this section](vpn-gateway-howto-point-to-site-rm-ps.md#addremovecert) of the article.

### Export the self-signed root certificate and public key to store it (optional)

You may want to export the self-signed root certificate and store it safely. If need be, you can later install it on another computer and generate more client certificates, or export another .cer file. To export the self-signed root certificate as a .pfx, select the root certificate and use the same steps as described in [Export a client certificate](#clientexport).

## <a name="clientcert"></a>Generate a client certificate

Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. You generate a client certificate from the self-signed root certificate, and then export and install the client certificate. If the client certificate is not installed, authentication fails. 

The following steps walk you through generating a client certificate from a self-signed root certificate. You may generate multiple client certificates from the same root certificate. When you generate client certificates using the steps below, the client certificate is automatically installed on the computer that you used to generate the certificate. If you want to install a client certificate on another client computer, you can export the certificate.

The examples use the New-SelfSignedCertificate cmdlet to generate a client certificate that expires in one year. For additional parameter information, such as setting a different expiration value for the client certificate, see [New-SelfSignedCertificate](https://technet.microsoft.com/itpro/powershell/windows/pkiclient/new-selfsignedcertificate).

### Example 1

This example uses the declared '$cert' variable from the previous section. If you closed the PowerShell console after creating the self-signed root certificate, or are creating additional client certificates in a new PowerShell console session, use the steps in [Example 2](#ex2).

Modify and run the example to generate a client certificate. If you run the following example without modifying it, the result is a client certificate named 'P2SChildCert'.  If you want to name the child certificate something else, modify the CN value. Do not change the TextExtension when running this example. The client certificate that you generate is automatically installed in 'Certificates - Current User\Personal\Certificates' on your computer.

```powershell
New-SelfSignedCertificate -Type Custom -KeySpec Signature `
-Subject "CN=P2SChildCert" -KeyExportPolicy Exportable `
-HashAlgorithm sha256 -KeyLength 2048 `
-CertStoreLocation "Cert:\CurrentUser\My" `
-Signer $cert -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.2")
```

### <a name="ex2"></a>Example 2

If you are creating additional client certificates, or are not using the same PowerShell session that you used to create your self-signed root certificate, use the following steps:

1. Identify the self-signed root certificate that is installed on the computer. This cmdlet returns a list of certificates that are installed on your computer.

  ```powershell
  Get-ChildItem -Path “Cert:\CurrentUser\My”
  ```
2. Locate the subject name from the returned list, then copy the thumbprint that is located next to it to a text file. In the following example, there are two certificates. The CN name is the name of the self-signed root certificate from which you want to generate a child certificate. In this case, 'P2SRootCert'.

  ```
  Thumbprint                                Subject
  
  AED812AD883826FF76B4D1D5A77B3C08EFA79F3F  CN=P2SChildCert4
  7181AA8C1B4D34EEDB2F3D3BEC5839F3FE52D655  CN=P2SRootCert
  ```
3. Declare a variable for the root certificate using the thumbprint from the previous step. Replace THUMBPRINT with the thumbprint of the root certificate from which you want to generate a child certificate.

  ```powershell
  $cert = Get-ChildItem -Path "Cert:\CurrentUser\My\THUMBPRINT"
  ```

  For example, using the thumbprint for P2SRootCert in the previous step, the variable looks like this:

  ```powershell
  $cert = Get-ChildItem -Path "Cert:\CurrentUser\My\7181AA8C1B4D34EEDB2F3D3BEC5839F3FE52D655"
  ```
4.  Modify and run the example to generate a client certificate. If you run the following example without modifying it, the result is a client certificate named 'P2SChildCert'. If you want to name the child certificate something else, modify the CN value. Do not change the TextExtension when running this example. The client certificate that you generate is automatically installed in 'Certificates - Current User\Personal\Certificates' on your computer.

  ```powershell
  New-SelfSignedCertificate -Type Custom -KeySpec Signature `
  -Subject "CN=P2SChildCert" -KeyExportPolicy Exportable `
  -HashAlgorithm sha256 -KeyLength 2048 `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -Signer $cert -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.2")
  ```

## <a name="clientexport"></a>Export a client certificate   

[!INCLUDE [Export client certificate](../../includes/vpn-gateway-certificates-export-client-cert-include.md)]

## <a name="install"></a>Install an exported client certificate

[!INCLUDE [Install client certificate](../../includes/vpn-gateway-certificates-install-client-cert-include.md)]

## Next steps

Continue with your Point-to-Site configuration. 

* For **Resource Manager** deployment model steps, see [Configure a Point-to-Site connection to a VNet](vpn-gateway-howto-point-to-site-resource-manager-portal.md). 
* For **classic** deployment model steps, see [Configure a Point-to-Site VPN connection to a VNet (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md).
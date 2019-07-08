---
title: 'Generate and export certificates for Point-to-Site: PowerShell: Azure | Microsoft Docs'
description: Create a self-signed root certificate, export the public key, and generate client certificates using PowerShell on Windows 10 or Windows Server 2016.
services: vpn-gateway
documentationcenter: na
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 12/03/2018
ms.author: cherylmc

---
# Generate and export certificates for Point-to-Site using PowerShell

Point-to-Site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using PowerShell on Windows 10 or Windows Server 2016. If you are looking for different certificate instructions, see [Certificates - Linux](vpn-gateway-certificates-point-to-site-linux.md) or [Certificates - MakeCert](vpn-gateway-certificates-point-to-site-makecert.md).

You must perform the steps in this article on a computer running Windows 10 or Windows Server 2016. The PowerShell cmdlets that you use to generate certificates are part of the operating system and do not work on other versions of Windows. The Windows 10 or Windows Server 2016 computer is only needed to generate the certificates. Once the certificates are generated, you can upload them, or install them on any supported client operating system. 

If you do not have access to a Windows 10 or Windows Server 2016 computer, you can use [MakeCert](vpn-gateway-certificates-point-to-site-makecert.md) to generate certificates. The certificates that you generate using either method can be installed on any [supported](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq) client operating system.

## <a name="rootcert"></a>1. Create a self-signed root certificate

Use the New-SelfSignedCertificate cmdlet to create a self-signed root certificate. For additional parameter information, see [New-SelfSignedCertificate](https://technet.microsoft.com/itpro/powershell/windows/pkiclient/new-selfsignedcertificate).

1. From a computer running Windows 10 or Windows Server 2016, open a Windows PowerShell console with elevated privileges. These examples do not work in the Azure Cloud Shell "Try It". You must run these examples locally.
2. Use the following example to create the self-signed root certificate. The following example creates a self-signed root certificate named 'P2SRootCert' that is automatically installed in 'Certificates-Current User\Personal\Certificates'. You can view the certificate by opening *certmgr.msc*, or *Manage User Certificates*.

   ```powershell
   $cert = New-SelfSignedCertificate -Type Custom -KeySpec Signature `
   -Subject "CN=P2SRootCert" -KeyExportPolicy Exportable `
   -HashAlgorithm sha256 -KeyLength 2048 `
   -CertStoreLocation "Cert:\CurrentUser\My" -KeyUsageProperty Sign -KeyUsage CertSign
   ```

## <a name="clientcert"></a>2. Generate a client certificate

Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. You generate a client certificate from the self-signed root certificate, and then export and install the client certificate. If the client certificate is not installed, authentication fails. 

The following steps walk you through generating a client certificate from a self-signed root certificate. You may generate multiple client certificates from the same root certificate. When you generate client certificates using the steps below, the client certificate is automatically installed on the computer that you used to generate the certificate. If you want to install a client certificate on another client computer, you can export the certificate.

The examples use the New-SelfSignedCertificate cmdlet to generate a client certificate that expires in one year. For additional parameter information, such as setting a different expiration value for the client certificate, see [New-SelfSignedCertificate](https://technet.microsoft.com/itpro/powershell/windows/pkiclient/new-selfsignedcertificate).

### Example 1

Use this example if you have not closed your PowerShell console after creating the self-signed root certificate. This example continues from the previous section and uses the declared '$cert' variable. If you closed the PowerShell console after creating the self-signed root certificate, or are creating additional client certificates in a new PowerShell console session, use the steps in [Example 2](#ex2).

Modify and run the example to generate a client certificate. If you run the following example without modifying it, the result is a client certificate named 'P2SChildCert'.  If you want to name the child certificate something else, modify the CN value. Do not change the TextExtension when running this example. The client certificate that you generate is automatically installed in 'Certificates - Current User\Personal\Certificates' on your computer.

```powershell
New-SelfSignedCertificate -Type Custom -DnsName P2SChildCert -KeySpec Signature `
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
4. Modify and run the example to generate a client certificate. If you run the following example without modifying it, the result is a client certificate named 'P2SChildCert'. If you want to name the child certificate something else, modify the CN value. Do not change the TextExtension when running this example. The client certificate that you generate is automatically installed in 'Certificates - Current User\Personal\Certificates' on your computer.

   ```powershell
   New-SelfSignedCertificate -Type Custom -DnsName P2SChildCert -KeySpec Signature `
   -Subject "CN=P2SChildCert" -KeyExportPolicy Exportable `
   -HashAlgorithm sha256 -KeyLength 2048 `
   -CertStoreLocation "Cert:\CurrentUser\My" `
   -Signer $cert -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.2")
   ```

## <a name="cer"></a>3. Export the root certificate public key (.cer)

[!INCLUDE [Export public key](../../includes/vpn-gateway-certificates-export-public-key-include.md)]


### Export the self-signed root certificate and private key to store it (optional)

You may want to export the self-signed root certificate and store it safely as backup. If need be, you can later install it on another computer and generate more client certificates. To export the self-signed root certificate as a .pfx, select the root certificate and use the same steps as described in [Export a client certificate](#clientexport).

## <a name="clientexport"></a>4. Export the client certificate

[!INCLUDE [Export client certificate](../../includes/vpn-gateway-certificates-export-client-cert-include.md)]


## <a name="install"></a>5. Install an exported client certificate

Each client that connects to the VNet over a P2S connection requires a client certificate to be installed locally.

To install a client certificate, see [Install a client certificate for Point-to-Site connections](point-to-site-how-to-vpn-client-install-azure-cert.md).

## <a name="install"></a>6. Continue with the P2S configuration steps

Continue with your Point-to-Site configuration.

* For **Resource Manager** deployment model steps, see [Configure P2S using native Azure certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md). 
* For **classic** deployment model steps, see [Configure a Point-to-Site VPN connection to a VNet (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md).
* For P2S troubleshooting information, see [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).

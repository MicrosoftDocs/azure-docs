---
title: 'Create a self-signed certificates for Point-to-Site: PowerShell: Azure | Microsoft Docs'
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
ms.date: 04/24/2017
ms.author: cherylmc

---
# Create a self-signed root certificate for Point-to-Site connections using PowerShell

Point-to-Site connections use certificates to authenticate. When you configure a Point-to-Site connection, you need to upload the public key (.cer file) of a root certificate to Azure. Client certificates must be generated from the root certificate and installed on every client computer that connects to the VNet. The client certificate allows the client to authenticate. This article shows you how to create a self-signed root certificate, export the public key, and generate client certificates. This article does not contain Point-to-Site configuration instructions or the Point-to-Site FAQ. You can find that information by selecting one of the articles from the following list:

> [!div class="op_single_selector"]
> * [Create self-signed certificates](vpn-gateway-certificates-point-to-site.md)
> * [Configure Point-to-Site - Resource Manager - Azure Portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Configure Point-to-Site - Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Configure Point-to-Site - Classic - Azure Portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> 
> 

## <a name="rootcert"></a>Create a self-signed root certificate

The following steps walk you through creating a self-signed root certificate using PowerShell on Windows 10. The cmdlets and parameters that are used in these steps are part of the Windows 10 operating system, not a part of a PowerShell version. This does not mean that the certificates that you create can only be installed on Windows 10. For information about supported clients, see [Point-to-Site FAQ](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq).

1. From a computer running Windows 10, open a Windows PowerShell console with elevated privileges.
2. Use the following example to create the self-signed root certificate. The following example creates a self-signed root certificate named 'P2SRootCert' that is automatically installed in 'Certificates-Current User\Personal\Certificates'. You can view the certificate by opening *certmgr.msc*.

  ```powershell
  $cert = New-SelfSignedCertificate -Type Custom -KeySpec Signature `
  -Subject "CN=P2SRootCert" -KeyExportPolicy Exportable `
  -HashAlgorithm sha256 -KeyLength 2048 `
  -CertStoreLocation "Cert:\CurrentUser\My" -KeyUsageProperty Sign -KeyUsage CertSign
  ```

### <a name="cer"></a>To obtain the public key

Point-to-Site connections require the public key (.cer) to be uploaded to Azure. The following steps help you export the .cer file for your self-signed root certificate:

1. To obtain a .cer file from the certificate, open **Manage user certificates**. Locate the self-signed root certificate, typically in 'Certificates - Current User\Personal\Certificates', and right-click. Click **All Tasks**, and then click **Export**. This opens the **Certificate Export Wizard**.
2. In the Wizard, click **Next**. Select **No, do not export the private key**, and then click **Next**.
3. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, and then click **Next**. 
4. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.
5. Click **Finish** to export the certificate. You see **The export was successful**. Click **OK** to close the wizard.

### To export a self-signed root certificate (optional)

You may want to export the self-signed root certificate and store it safely. If need be, you can later install it on another computer and generate more client certificates, or export another .cer file. To export the self-signed root certificate as a .pfx, select the root certificate and use the same steps as described in [Export a client certificate](#clientexport).

## <a name="clientcert"></a>Generate a client certificate

Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. You generate a client certificate from the self-signed root certificate, and then export and install the client certificate. If the client certificate is not installed, authentication fails. 

The following steps walk you through generating a client certificate from a self-signed root certificate. You may generate multiple client certificates from the same root certificate. When you generate client certificates using the steps below, the client certificate is automatically installed on the computer that you used to generate the certificate. If you want to install a client certificate on another client computer, you can export the certificate.

Windows 10 is required to generate client certificates using the following PowerShell steps. The cmdlets and parameters that are used in these steps are part of the Windows 10 operating system, not a part of a PowerShell version. This does not mean that the certificates that you create can only be installed on Windows 10. For information about supported clients, see [Point-to-Site FAQ](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq).

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

		Thumbprint                                Subject

		AED812AD883826FF76B4D1D5A77B3C08EFA79F3F  CN=P2SChildCert4
		7181AA8C1B4D34EEDB2F3D3BEC5839F3FE52D655  CN=P2SRootCert


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

When you generate a client certificate, it's automatically installed on the computer that you used to generate it. If you want to install the client certificate on another client computer, you need to export the client certificate that you generated.                              

1. To export a client certificate, open **Manage user certificates**. The client certificates that you generated are, by default, located in 'Certificates - Current User\Personal\Certificates'. Right-click the client certificate that you want to export, click **all tasks**, and then click **Export** to open the **Certificate Export Wizard**.
2. In the Wizard, click **Next**, then select **Yes, export the private key**, and then click **Next**.
3. On the **Export File Format** page, leave the defaults selected. Make sure that **Include all certificates in the certification path if possible** is selected. Selecting this also exports the root certificate information that is required for successful authentication. Then, click **Next**.
4. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate. Then, click **Next**.
5. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.
6. Click **Finish** to export the certificate.    

## <a name="install"></a>Install an exported client certificate

If you want to create a P2S connection from a client computer other than the one you used to generate the client certificates, you need to install a client certificate. When installing a client certificate, you need the password that was created when the client certificate was exported.

1. Locate and copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, and then click **Next**.
2. On the **File** to import page, don't make any changes. Click **Next**.
3. On the **Private key protection** page, input the password for the certificate, or verify that the security principal is correct, then click **Next**.
4. On the **Certificate Store** page, leave the default location, and then click **Next**.
5. Click **Finish**. On the **Security Warning** for the certificate installation, click **Yes**. You can feel comfortable clicking 'Yes' because you generated the certificate. The certificate is now successfully imported.

## Next steps

Continue with your Point-to-Site configuration. 

* For **Resource Manager** deployment model steps, see [Configure a Point-to-Site connection to a VNet](vpn-gateway-howto-point-to-site-resource-manager-portal.md). 
* For **classic** deployment model steps, see [Configure a Point-to-Site VPN connection to a VNet (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md).
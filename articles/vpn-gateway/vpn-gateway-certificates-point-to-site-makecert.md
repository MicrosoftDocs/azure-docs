---
title: 'Generate and export certificates for Point-to-Site: MakeCert : Azure | Microsoft Docs'
description: Create a self-signed root certificate, export the public key, and generate client certificates using MakeCert.
services: vpn-gateway
documentationcenter: na
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 09/05/2018
ms.author: cherylmc

---
# Generate and export certificates for Point-to-Site connections using MakeCert

Point-to-Site connections use certificates to authenticate. This article shows you how to create a self-signed root certificate and generate client certificates using MakeCert. If you are looking for different certificate instructions, see [Certificates - PowerShell](vpn-gateway-certificates-point-to-site.md) or [Certificates - Linux](vpn-gateway-certificates-point-to-site-linux.md).

While we recommend using the [Windows 10 PowerShell steps](vpn-gateway-certificates-point-to-site.md) to create your certificates, we provide these MakeCert instructions as an optional method. The certificates that you generate using either method can be installed on [any supported client operating system](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq). However, MakeCert has the following limitation:

* MakeCert is deprecated. This means that this tool could be removed at any point. Any certificates that you already generated using MakeCert won't be affected when MakeCert is no longer available. MakeCert is only used to generate the certificates, not as a validating mechanism.

## <a name="rootcert"></a>Create a self-signed root certificate

The following steps show you how to create a self-signed certificate using MakeCert. These steps are not deployment-model specific. They are valid for both Resource Manager and classic.

1. Download and install [MakeCert](https://msdn.microsoft.com/library/windows/desktop/aa386968(v=vs.85).aspx).
2. After installation, you can typically find the makecert.exe utility under this path: 'C:\Program Files (x86)\Windows Kits\10\bin\<arch>'. Although, it's possible that it was installed to another location. Open a command prompt as administrator and navigate to the location of the MakeCert utility. You can use the following example, adjusting for the proper location:

   ```cmd
   cd C:\Program Files (x86)\Windows Kits\10\bin\x64
   ```
3. Create and install a certificate in the Personal certificate store on your computer. The following example creates a corresponding *.cer* file that you upload to Azure when configuring P2S. Replace 'P2SRootCert' and 'P2SRootCert.cer' with the name that you want to use for the certificate. The certificate is located in your 'Certificates - Current User\Personal\Certificates'.

   ```cmd
   makecert -sky exchange -r -n "CN=P2SRootCert" -pe -a sha256 -len 2048 -ss My
   ```

## <a name="cer"></a>Export the public key (.cer)

[!INCLUDE [Export public key](../../includes/vpn-gateway-certificates-export-public-key-include.md)]

The exported.cer file must be uploaded to Azure. For instructions, see [Configure a Point-to-Site connection](vpn-gateway-howto-point-to-site-resource-manager-portal.md#uploadfile). To add an additional trusted root certificate, see [this section](vpn-gateway-howto-point-to-site-resource-manager-portal.md#add) of the article.

### Export the self-signed certificate and private key to store it (optional)

You may want to export the self-signed root certificate and store it safely. If need be, you can later install it on another computer and generate more client certificates, or export another .cer file. To export the self-signed root certificate as a .pfx, select the root certificate and use the same steps as described in [Export a client certificate](#clientexport).

## Create and install client certificates

You don't install the self-signed certificate directly on the client computer. You need to generate a client certificate from the self-signed certificate. You then export and install the client certificate to the client computer. The following steps are not deployment-model specific. They are valid for both Resource Manager and classic.

### <a name="clientcert"></a>Generate a client certificate

Each client computer that connects to a VNet using Point-to-Site must have a client certificate installed. You generate a client certificate from the self-signed root certificate, and then export and install the client certificate. If the client certificate is not installed, authentication fails. 

The following steps walk you through generating a client certificate from a self-signed root certificate. You may generate multiple client certificates from the same root certificate. When you generate client certificates using the steps below, the client certificate is automatically installed on the computer that you used to generate the certificate. If you want to install a client certificate on another client computer, you can export the certificate.
 
1. On the same computer that you used to create the self-signed certificate, open a command prompt as administrator.
2. Modify and run the sample to generate a client certificate.
   * Change *"P2SRootCert"* to the name of the self-signed root that you are generating the client certificate from. Make sure you are using the name of the root certificate, which is whatever the 'CN=' value was that you specified when you created the self-signed root.
   * Change *P2SChildCert* to the name you want to generate a client certificate to be.

   If you run the following example without modifying it, the result is a client certificate named P2SChildcert in your Personal certificate store that was generated from root certificate P2SRootCert.

   ```cmd
   makecert.exe -n "CN=P2SChildCert" -pe -sky exchange -m 96 -ss My -in "P2SRootCert" -is my -a sha256
   ```

### <a name="clientexport"></a>Export a client certificate

[!INCLUDE [Export client certificate](../../includes/vpn-gateway-certificates-export-client-cert-include.md)]

### <a name="install"></a>Install an exported client certificate

To install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

## Next steps

Continue with your Point-to-Site configuration. 

* For **Resource Manager** deployment model steps, see [Configure P2S using native Azure certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* For **classic** deployment model steps, see [Configure a Point-to-Site VPN connection to a VNet (classic)](vpn-gateway-howto-point-to-site-classic-azure-portal.md).

For P2S troubleshooting information, [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
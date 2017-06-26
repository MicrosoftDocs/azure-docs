---
title: 'Create a self-signed certificates for Point-to-Site: makecert : Azure | Microsoft Docs'
description: This article contains steps to create a self-signed root certificate, export the public key, and generate client certificates using makecert.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/03/2017
ms.author: cherylmc

---
# Create a self-signed root certificate for Point-to-Site connections using makecert

> [!NOTE]
> Use these instructions only when you don't have access to a Windows 10 computer to generate self-signed certificates for Point-to-Site connections. Makecert is being deprecated. Additionally, makecert cannot create a SHA-2 certificate, only SHA-1 (which is still valid for P2S). For these reasons, we recommend that you use the [PowerShell steps](vpn-gateway-certificates-point-to-site.md), if possible. The certificates that you create, using either PowerShell or makecert, can be installed on any [supported client operating system](vpn-gateway-howto-point-to-site-resource-manager-portal.md#faq), not just the operating system that you used to create them.
>
>


This article shows you how to create a self-signed root certificate, export the public key, and generate client certificates. This article does not contain Point-to-Site configuration instructions or the Point-to-Site FAQ. You can find that information by selecting one of the 'Configure Point-to-Site' articles from the following list:

> [!div class="op_single_selector"]
> * [Create self-signed certificates - PowerShell](vpn-gateway-certificates-point-to-site.md)
> * [Create self-signed certificates - Makecert](vpn-gateway-certificates-point-to-site-makecert.md)
> * [Configure Point-to-Site - Resource Manager - Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
> * [Configure Point-to-Site - Resource Manager - PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md)
> * [Configure Point-to-Site - Classic - Azure portal](vpn-gateway-howto-point-to-site-classic-azure-portal.md)
> 
> 

Point-to-Site connections use certificates to authenticate. When you configure a Point-to-Site connection, you need to upload the public key (.cer file) of a root certificate to Azure. Additionally, client certificates must be generated from the root certificate and installed on every client computer that connects to the VNet. The client certificate allows the client to authenticate.

## <a name="rootcert"></a>Create a self-signed root certificate

The following steps show you how to create a self-signed certificate using makecert. These steps are not deployment-model specific. They are valid for both Resource Manager and classic.

1. Download and install [makecert](https://msdn.microsoft.com/en-us/library/windows/desktop/aa386968(v=vs.85).aspx).
2. After installation, you can find the makecert.exe utility under this path: 'C:\Program Files (x86)\Windows Kits\10\bin\<arch>'. Open a command prompt as administrator and navigate to the location of the makecert utility. You can use the following example:

  ```cmd
  cd C:\Program Files (x86)\Windows Kits\10\bin\x64
  ```
3. Create and install a certificate in the Personal certificate store on your computer. The following example creates a corresponding *.cer* file that you upload to Azure when configuring P2S. Replace 'P2SRootCert' and 'P2SRootCert.cer' with the name that you want to use for the certificate.<br><br>The certificate will be located in your 'Certificates - Current User\Personal\Certificates'.

  ```cmd
  makecert -sky exchange -r -n "CN=P2SRootCert" -pe -a sha1 -len 2048 -ss My "P2SRootCert.cer"
  ```

## <a name="cer"></a>Export the public key (.cer)

Point-to-Site connections require the public key (.cer) to be uploaded to Azure. The following steps help you export the .cer file for your self-signed root certificate:

1. To obtain a .cer file from the certificate, open **Manage user certificates**. Locate the self-signed root certificate, typically in 'Certificates - Current User\Personal\Certificates', and right-click. Click **All Tasks**, and then click **Export**. This opens the **Certificate Export Wizard**.
2. In the Wizard, click **Next**. Select **No, do not export the private key**, and then click **Next**.
3. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, and then click **Next**. 
4. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.
5. Click **Finish** to export the certificate. You see **The export was successful**. Click **OK** to close the wizard.

### Export the self-signed certificate to store it (optional)

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
  makecert.exe -n "CN=P2SChildCert" -pe -sky exchange -m 96 -ss My -in "P2SRootCert" -is my -a sha1
  ```

### <a name="clientexport"></a>Export a client certificate

When you generate a client certificate, it's automatically installed on the computer that you used to generate it. If you want to install the client certificate on another client computer, you need to export the client certificate that you generated.                              

1. To export a client certificate, open **Manage user certificates**. The client certificates that you generated are, by default, located in 'Certificates - Current User\Personal\Certificates'. Right-click the client certificate that you want to export, click **all tasks**, and then click **Export** to open the **Certificate Export Wizard**.
2. In the Wizard, click **Next**, then select **Yes, export the private key**, and then click **Next**.
3. On the **Export File Format** page, leave the defaults selected. Make sure that **Include all certificates in the certification path if possible** is selected. Selecting this also exports the root certificate information that is required for successful authentication. Then, click **Next**.
4. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate. Then, click **Next**.
5. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.
6. Click **Finish** to export the certificate.     

### <a name="install"></a>Install an exported client certificate

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
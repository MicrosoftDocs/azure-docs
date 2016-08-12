<properties 
   pageTitle="Create self-signed certificates for Point-to-Site virtual network cross-premises connections by using makecert | Microsoft Azure"
   description="This article contains steps to use makecert to create self-signed certificates on Windows 10."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/12/2016"
   ms.author="cherylmc" />

# Working with self-signed certificates for Point-to-Site connections

This article will help you create a self-signed certificate using makecert, and then generate client certificates from it. The steps are written for makecert on Windows 10. Makecert has been validated to create certificates that are compatible with P2S connections. 

For P2S connections, the preferred method for certificates is to use your enterprise certificate solution, making to issue the client certificates with the common name value format 'name@yourdomain.com', rather than the 'NetBIOS domain name\username' format.

If you don't have an enterprise solution, a self-signed certificate is necessary to allow P2S clients to connect to a virtual network. We are aware that makecert has been deprecated, but it is still a valid method for creating self-signed certificates that are compatible with P2S connections.

## Create a self-signed certificate

Makecert is one way of creating a self-signed certificate. The following steps walk you through creating a self-signed certificate using makecert. These steps are not deployment-model specific. They are valid for both Resource Manager and classic.

### To create a self-signed certificate

1. From a computer running Windows 10, download and install the [Windows Software Development Kit (SDK) for Windows 10](https://dev.windows.com/en-us/downloads/windows-10-sdk).

2. After installation, you can find the makecert.exe utility under this path: C:\Program Files (x86)\Windows Kits\10\bin\<arch>. 
		
	Example: 
	
		C:\Program Files (x86)\Windows Kits\10\bin\x64\makecert.exe

3. Next, create and install a certificate in the Personal certificate store on your computer. The following example creates a corresponding *.cer* file that you'll later upload. Run the following command, as administrator, where *CertificateName* is the name that you want to use for the certificate. 

	Note: If you run the following example with no changes, the result will be a certificate and the corresponding file *CertificateName.cer*. You can find the .cer file in the directory from which you ran the command. The certificate will be located in your Certificates - Current User\Personal\Certificates.

    	makecert -sky exchange -r -n "CN=CertificateName" -pe -a sha1 -len 2048 -ss My "CertificateName.cer"

	>[AZURE.NOTE] Because you have created a self-signed certificate from which client certificates will be generated, you may want to export this certificate along with its private key and save it to a safe location where it may be recovered. 

## Create and install client certificates

The self-signed certificate is not what you will install on your clients. You need to generate a client certificate from the self-signed certificate. You then export and install the client certificate to the client computer. The following steps are not deployment-model specific. They are valid for both Resource Manager and classic.

### Part 1 - Generate a client certificate from a self-signed certificate

The following steps walk you through one way to generate a client certificate from a self-signed certificate. You may generate multiple client certificates from the same certificate. Each client certificate can then be exported and installed on the client computer. 

1. On the same computer that you used to create the self-signed certificate, open a command prompt as administrator.

2. Change the directory to the location to which you want to save the client certificate file. *CertificateName* refers to the self-signed certificate that you generated. If you run the following example (changing the CertificateName to the name of your certificate), the result will be a client certificate named "ClientCertificateName" in your Personal certificate store.

3. Type the following command:

    	makecert.exe -n "CN=ClientCertificateName" -pe -sky exchange -m 96 -ss My -in "CertificateName" -is my -a sha1

4. All certificates are stored in your Certificates - Current User\Personal\Certificates store on your computer. You can generate as many client certificates as needed based on this procedure.

### Part 2 - Export a client certificate

1. To export a client certificate, use *certmgr.msc*. Right-click the client certificate that you want to export, click **all tasks**, and then click **export**. This will open the Certificate Export Wizard.

2. In the Wizard, click **Next**, then select **Yes, export the private key**, and then click **Next**.

3. On the **Export File Format** page, you can leave the defaults selected. Then click **Next**. 
 
4. On the **Security** page, you must protect the private key. If you select to use a password, make sure to record or remember the password that you set for this certificate. Then click **Next**.

5. On the **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then click **Next**.

6. Click **Finish** to export the certificate.	

### Part 3 - Install a client certificate

Each client that you want to connect to your virtual network by using a Point-to-Site connection must have a client certificate installed. This certificate is in addition to the required VPN configuration package. The following steps walk you through installing the client certificate manually.

1. Locate and copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, then click **Next**.

2. On the **File** to import page, don't make any changes. Click **Next**.

3. On the **Private key protection** page, input the password for the certificate if you used one, or verify that the security principal that is installing the certificate is correct, then click **Next**.

4. On the **Certificate Store** page, leave the default location, and then click **Next**.

5. Click **Finish**. On the **Security Warning** for the certificate installation, click **Yes**. The certificate is now successfully imported.

## Next steps

Continue with your Point-to-Site configuration. 

- For **Resource Manager** deployment model steps, see [Configure a Point-to-Site connection to a virtual network using PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md). 
- For **classic** deployment model steps, see [Configure a Point-to-Site VPN connection to a VNet](vpn-gateway-point-to-site-create.md).
---
title: Certificates and the Azure App Service Environment 
description: Explain numerous topics related to certificates on an ASE
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 9e21a7e4-2436-4e81-bb05-4a6ba70eeaf7
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/29/2018
ms.author: ccompy
---

# Certificates and the App Service Environment 

The App Service Environment(ASE) is a deployment of the Azure App Service that runs within your Azure Virtual Network(VNet). It can be deployed with an internet accessible application endpoint or an application endpoint that is in your VNet. If you deploy the ASE with an internet accessible endpoint, that deployment is called an External ASE. If you deploy the ASE with an endpoint in your VNet, that deployment is called an ILB ASE. You can learn more about the ILB ASE from the [Create and use an ILB ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase) document.

The ASE is a single tenant system. Because it is single tenant, there are some features available only with an ASE that are not available in the multi-tenant App Service. 

## ILB ASE certificates 

If you are using an External ASE, then your apps are reached at [appname].[asename].p.azurewebsites.net. By default all ASEs, even ILB ASEs, are created with certificates that follow that format. When you have an ILB ASE, the apps are reached based on the domain name that you specify when creating the ILB ASE. In order for the apps to support SSL, you need to upload certificates. Obtain a valid SSL certificate by using internal certificate authorities, purchasing a certificate from an external issuer, or using a self-signed certificate. 

There are two options for configuring certificates with your ILB ASE.  You can set a wildcard default certificate for the ILB ASE or set certificates on the individual web apps in the ASE.  Regardless of the choice you make, the following certificate attributes must be configured properly:

- **Subject:** This attribute must be set to *.[your-root-domain-here] for a wildcard ILB ASE certificate. If creating the certificate for your app, then it should be [appname].[your-root-domain-here]
- **Subject Alternative Name:** This attribute must include both *.[your-root-domain-here] and *.scm.[your-root-domain-here] for the wildcard ILB ASE certificate. If creating the certificate for your app, then it should be [appname].[your-root-domain-here] and [appname].scm.[your-root-domain-here].

As a third variant, you can create an ILB ASE certificate that includes all of your individual app names in the SAN of the certificate instead of using a wildcard reference. The problem with this method is that you need to know up front the names of the apps that you are putting in the ASE or you need to keep updating the ILB ASE certificate.

### Upload certificate to ILB ASE 

After an ILB ASE is created in the portal, the certificate must be set for the ILB ASE. Until the certificate is set, the ASE will show a banner that the certificate was not set.  

The certificate that you upload must be a .pfx file. After the certificate is uploaded, the ASE will perform a scale operation to set the certificate. 

You cannot create the ASE and upload the certificate as one action in the portal or even in one template. As a separate action, you can upload the certificate using a template as described in the [Create an ASE from a template](./create-from-template.md) document.  

If you want to create a self signed certificate quickly for testing, you can use the following bit of PowerShell:

	$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "*.internal-contoso.com","*.scm.internal-contoso.com"

	$certThumbprint = "cert:\localMachine\my\" + $certificate.Thumbprint
	$password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText

	$fileName = "exportedcert.pfx"
	Export-PfxCertificate -cert $certThumbprint -FilePath $fileName -Password $password     


## Application certificates 

Apps that are hosted in an ASE can use the app-centric certificate features that are available in the multi-tenant App Service. Those features include:  

- SNI certificates 
- IP-based SSL, which is only supported with an External ASE.  An ILB ASE does not support IP-based SSL.
- KeyVault hosted certificates 

The instructions for uploading and managing those certificates are available in the App Service SSL tutorial https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-ssl.  If you are simply configuring certificates to match a custom domain name that you have assigned to your web app, then those instructions will suffice. If you are uploading the certificate for an ILB ASE web app with the default domain name, then specify the scm site in the SAN of the certificate as noted earlier. 

## TLS settings 

You can configure the TLS setting at an app level.  

## Private client certificate 

A common use case is to configure your app as a client in a client-server model. If you secure your server with a private CA certificate, you will need to upload the client certificate to your app.  The following instructions will load certificates to the truststore of the workers that your app is running on. If you load the certificate to one app, you can use it with your other apps in the same App Service plan without uploading the certificate again.

To upload the certificate to your app in your ASE:

1. Generate a *.cer* file for your certificate. 
2. Go to the app that needs the certificate in the Azure portal
3. Go to SSL settings in the app. Click Upload Certificate. Select Public. Select Local Machine. Provide a name. Browse and select your *.cer* file. Select upload. 
4. Copy the thumbprint.
5. Go to Application Settings. Create an App Setting WEBSITE_LOAD_ROOT_CERTIFICATES with the thumbprint as the value. If you have multiple certificates, you can put them in the same setting separated by commas and no whitespace like 

	84EC242A4EC7957817B8E48913E50953552DAFA6,6A5C65DC9247F762FE17BF8D4906E04FE6B31819

The certificate will be available by all the apps in the same app service plan as the app, which configured that setting. If you need it to be available for apps in a different App Service plan, you will need to repeat the App Setting operation in an app in that App Service plan. To check that the certificate is set, go to the Kudu console and issue this command dir cert:\localmachine\root in the PowerShell debug console. 

To perform testing, you can create a self signed certificate and generate a *.cer* file with the following PowerShell: 

	$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "*.internal-contoso.com","*.scm.internal-contoso.com

	$certThumbprint = "cert:\localMachine\my\" + $certificate.Thumbprint
	$password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText

	$fileName = "exportedcert.cer"
	export-certificate -Cert $certThumbprint -FilePath $fileName -Type CERT


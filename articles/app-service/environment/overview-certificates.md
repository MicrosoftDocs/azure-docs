---
title: Certificates in App Service Environment
description: Explain topics related to certificates in an App Service Environment. Learn how certificate bindings work on the single-tenanted apps in an ASE.
author: madsd
ms.topic: overview
ms.date: 11/15/2021
ms.author: madsd
---

# Certificates and the App Service Environment 
> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
>

The App Service Environment (ASE) is a deployment of the Azure App Service that runs within your Azure virtual network. It can be deployed with an internet accessible application endpoint or an application endpoint that is in your virtual network. If you deploy the ASE with an internet accessible endpoint, that deployment is called an External ASE. If you deploy the ASE with an endpoint in your virtual network, that deployment is called an ILB ASE. You can learn more about the ILB ASE from the [Create and use an ILB ASE](./creation.md) document.

## Application certificates

Apps that are hosted in an ASE can use the app-centric certificate features that are available in the multi-tenant App Service. Those features include:

- SNI certificates
- KeyVault hosted certificates

The requirements and instructions for uploading and managing those certificates are available in [Add a TLS/SSL certificate in Azure App Service](../configure-ssl-certificate.md).

Once the certificate is added to your App Service app or function app, you can [secure a custom domain name with it](../configure-ssl-bindings.md) or [use it in your application code](../configure-ssl-certificate-in-code.md).

## TLS settings

You can [configure the TLS setting](../configure-ssl-bindings.md#enforce-tls-versions) at an app level.

## Private client certificate

A common use case is to configure your app as a client in a client-server model. If you secure your server with a private CA certificate, you will need to upload the client certificate to your app. The following instructions will load certificates to the truststore of the workers that your app is running on. If you load the certificate to one app, you can use it with your other apps in the same App Service plan without uploading the certificate again.

>[!NOTE]
> Private client certificates are not supported outside the app. This limits usage in scenarios such as pulling the app container image from a registry using a private certificate and TLS validating through the front-end servers using a private certificate.

Follow these steps to upload the certificate (*.cer* file) to your app in your ASE. The *.cer* file can be exported from your certificate. For testing purposes, there is a PowerShell example at the end to generate a temporary self-signed certificate:

1. Go to the app that needs the certificate in the Azure portal
1. Go to **TLS/SSL settings** in the app. Click **Public Key Certificate (.cer)**. Select **Upload Public Key Certificate**. Provide a name. Browse and select your *.cer* file. Select upload. 
1. Copy the thumbprint.
1. Go to **Application Settings**. Create an app setting WEBSITE_LOAD_ROOT_CERTIFICATES with the thumbprint as the value. If you have multiple certificates, you can put them in the same setting separated by commas and no whitespace like 

	84EC242A4EC7957817B8E48913E50953552DAFA6,6A5C65DC9247F762FE17BF8D4906E04FE6B31819

The certificate will be available by all the apps in the same app service plan as the app, which configured that setting. If you need it to be available for apps in a different App Service plan, you will need to repeat the app setting operation in an app in that App Service plan. To check that the certificate is set, go to the Kudu console and issue the following command in the PowerShell debug console:

```azurepowershell-interactive
dir Cert:\LocalMachine\Root
```

To perform testing, you can create a self signed certificate and generate a *.cer* file with the following PowerShell: 

```azurepowershell-interactive
$certificate = New-SelfSignedCertificate -CertStoreLocation "Cert:\LocalMachine\My" -DnsName "*.internal-contoso.com","*.scm.internal-contoso.com"

$certThumbprint = "Cert:\LocalMachine\My\" + $certificate.Thumbprint
$fileName = "exportedcert.cer"
Export-Certificate -Cert $certThumbprint -FilePath $fileName -Type CERT
```

## Next steps

* Information on how to [use certificates in application code](../configure-ssl-certificate-in-code.md)
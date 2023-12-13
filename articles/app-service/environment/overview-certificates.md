---
title: Certificates in App Service Environment
description: Explain the use of certificates in an App Service Environment. Learn how certificate bindings work on the single-tenanted apps in an App Service Environment.
author: madsd
ms.topic: overview
ms.date: 10/3/2023
ms.author: madsd
---

# Certificates and the App Service Environment 
> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
>

The App Service Environment is a deployment of the Azure App Service that runs within your Azure virtual network. It can be deployed with an internet accessible application endpoint or an application endpoint that is in your virtual network. If you deploy the App Service Environment with an internet accessible endpoint, that deployment is called an External App Service Environment. If you deploy the App Service Environment with an endpoint in your virtual network, that deployment is called an ILB App Service Environment. You can learn more about the ILB App Service Environment from the [Create and use an ILB App Service Environment](./creation.md) document.

## Application certificates

Applications that are hosted in an App Service Environment support the following app-centric certificate features, which are also available in the multitenant App Service. For requirements and instructions for uploading and managing those certificates, see [Add a TLS/SSL certificate in Azure App Service](../configure-ssl-certificate.md).

- [SNI certificates](../configure-ssl-certificate.md)
- [KeyVault hosted certificates](../configure-ssl-certificate.md#import-a-certificate-from-key-vault)

Once you add the certificate to your App Service app or function app, you can [secure a custom domain name with it](../configure-ssl-bindings.md) or [use it in your application code](../configure-ssl-certificate-in-code.md).

### Limitations

[App Service managed certificates](../configure-ssl-certificate.md#create-a-free-managed-certificate) aren't supported on apps that are hosted in an App Service Environment.

## TLS settings

You can [configure the TLS setting](../configure-ssl-bindings.md#enforce-tls-versions) at an app level.

## Private client certificate

A common use case is to configure your app as a client in a client-server model. If you secure your server with a private CA certificate, you need to upload the client certificate (*.cer* file) to your app. The following instructions load certificates to the trust store of the workers that your app is running on. You only need to upload the certificate once to use it with apps that are in the same App Service plan.

>[!NOTE]
> Private client certificates are only supported from custom code in Windows code apps. Private client certificates are not supported outside the app. This limits usage in scenarios such as pulling the app container image from a registry using a private certificate and TLS validating through the front-end servers using a private certificate.

Follow these steps to upload the certificate (*.cer* file) to your app in your App Service Environment. The *.cer* file can be exported from your certificate. For testing purposes, there's a PowerShell example at the end to generate a temporary self-signed certificate:

1. Go to the app that needs the certificate in the Azure portal
1. Go to **Certificates** in the app. Select **Public Key Certificate (.cer)**. Select **Add certificate**. Provide a name. Browse and select your *.cer* file. Select upload. 
1. Copy the thumbprint.
1. Go to **Configuration** > **Application Settings**. Create an app setting WEBSITE_LOAD_ROOT_CERTIFICATES with the thumbprint as the value. If you have multiple certificates, you can put them in the same setting separated by commas and no whitespace like 

	84EC242A4EC7957817B8E48913E50953552DAFA6,6A5C65DC9247F762FE17BF8D4906E04FE6B31819

The certificate is available by all the apps in the same app service plan as the app, which configured that setting, but all apps that depend on the private CA certificate should have the Application Setting configured to avoid timing issues.

If you need it to be available for apps in a different App Service plan, you need to repeat the app setting operation for the apps in that App Service plan. To check that the certificate is set, go to the Kudu console and issue the following command in the PowerShell debug console:

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

## Private server certificate

If your app acts as a server in a client-server model, either behind a reverse proxy or directly with private client and you're using a private CA certificate, you need to upload the server certificate (*.pfx* file) with the full certificate chain to your app and bind the certificate to the custom domain. Because the infrastructure is dedicated to your App Service Environment, the full certificate chain is added to the trust store of the servers. You only need to upload the certificate once to use it with apps that are in the same App Service Environment.

>[!NOTE]
> If you uploaded your certificate prior to 1. October 2023, you will need to reupload and rebind the certificate for the full certificate chain to be added to the servers.

Follow the [secure custom domain with TLS/SSL](../configure-ssl-bindings.md) tutorial to upload/bind your private CA rooted certificate to the app in your App Service Environment.

## Next steps

* Information on how to [use certificates in application code](../configure-ssl-certificate-in-code.md)
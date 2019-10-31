---
title: Use SSL certificate in application code - Azure App Service | Microsoft Docs
description: Learn how to use client certificates to connect to remote resources that require them.
services: app-service
documentationcenter: 
author: cephalin
manager: gwallace
editor: ''

ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/16/2019
ms.author: cephalin
ms.reviewer: yutlin
ms.custom: seodec18

---

# Use an SSL certificate in your application code in Azure App Service

Your App Service app code may act as a client and access an external service that requires certificate authentication. This how-to guide shows how to use public or private certificates in your application code.

This approach to using certificates in your code makes use of the SSL functionality in App Service, which requires your app to be in **Basic** tier or above. Alternatively, you can [include the certificate file in your app repository](#load-certificate-from-file), but it's not a recommended practice for private certificates.

When you let App Service manage your SSL certificates, you can maintain the certificates and your application code separately and safeguard your sensitive data.

## Prerequisites

To follow this how-to guide:

- [Create an App Service app](/azure/app-service/)
- [Add a certificate to your app](configure-ssl-certificate.md)

## Find the thumbprint

In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, from the left menu, select **App Services** > **\<app-name>**.

From the left navigation of your app, select **TLS/SSL settings**, then select **Private Key Certificates (.pfx)** or **Public Key Certificates (.cer)**.

Find the certificate you want to use and copy the thumbprint.

![Copy the certificate thumbprint](./media/configure-ssl-certificate/create-free-cert-finished.png)

## Load the certificate

To use a certificate in your app code, add its thumbprint to the `WEBSITE_LOAD_CERTIFICATES` app setting, by running the following command in the <a target="_blank" href="https://shell.azure.com" >Cloud Shell</a>:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_LOAD_CERTIFICATES=<comma-separated-certificate-thumbprints>
```

To make all your certificates accessible, set the value to `*`.

> [!NOTE]
> This setting places the specified certificates in the [Current User\My](/windows-hardware/drivers/install/local-machine-and-current-user-certificate-stores) store for most pricing tiers, but in the **Isolated** tier (i.e. app runs in an [App Service Environment](environment/intro.md)), it places the certificates in the [Local Machine\My](/windows-hardware/drivers/install/local-machine-and-current-user-certificate-stores) store.
>

The configured certificates are now ready to be used by your code.

## Load the certificate in code

Once your certificate is accessible, you access it in C# code by the certificate thumbprint. The following code loads a certificate with the thumbprint `E661583E8FABEF4C0BEF694CBC41C28FB81CD870`.

```csharp
using System;
using System.Security.Cryptography.X509Certificates;

...
X509Store certStore = new X509Store(StoreName.My, StoreLocation.CurrentUser);
certStore.Open(OpenFlags.ReadOnly);
X509Certificate2Collection certCollection = certStore.Certificates.Find(
                            X509FindType.FindByThumbprint,
                            // Replace below with your certificate's thumbprint
                            "E661583E8FABEF4C0BEF694CBC41C28FB81CD870",
                            false);
// Get the first cert with the thumbprint
if (certCollection.Count > 0)
{
    X509Certificate2 cert = certCollection[0];
    // Use certificate
    Console.WriteLine(cert.FriendlyName);
}
certStore.Close();
...
```

<a name="file"></a>
## Load certificate from file

If you need to load a certificate file from your application directory, it's better to upload it using [FTPS](deploy-ftp.md) instead of [Git](deploy-local-git.md), for example. You should keep sensitive data like a private certificate out of source control.

Even though you're loading the file directly in your .NET code, the library still verifies if the current user profile is loaded. To load the current user profile, set the `WEBSITE_LOAD_USER_PROFILE` app setting with the following command in the <a target="_blank" href="https://shell.azure.com" >Cloud Shell</a>.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_LOAD_USER_PROFILE=1
```

Once this setting is set, the following C# example loads a certificate called `mycert.pfx` from the `certs` directory of your app's repository.

```csharp
using System;
using System.Security.Cryptography.X509Certificates;

...
// Replace the parameter with "~/<relative-path-to-cert-file>".
string certPath = Server.MapPath("~/certs/mycert.pfx");

X509Certificate2 cert = GetCertificate(certPath, signatureBlob.Thumbprint);
...
```

## More resources

* [Secure a custom DNS name with an SSL binding](configure-ssl-bindings.md)
* [Enforce HTTPS](configure-ssl-bindings.md#enforce-https)
* [Enforce TLS 1.1/1.2](configure-ssl-bindings.md#enforce-tls-versions)
* [FAQ : App Service Certificates](https://docs.microsoft.com/azure/app-service/faq-configuration-and-management/)

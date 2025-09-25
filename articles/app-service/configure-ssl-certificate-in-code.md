---
title: Use TLS/SSL Certificates in App Code
description: Understand how to use TLS/SSL certificates in your application code to secure connections in Azure App Service.
keywords: TLS/SSL in code, secure app, HTTPS integration, Azure App Service security
ms.topic: article
ms.date: 02/14/2025
ms.reviewer: yutlin
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service
ms.custom:
  - linux-related-content
  - sfi-image-nochange
---

# Use TLS/SSL certificates in your application code

[!INCLUDE [app-service-managed-certificate](./includes/managed-certs/managed-certs-note.md)]

In your application code, you can access the [public or private certificates that you add to Azure App Service](configure-ssl-certificate.md). Your app code might act as a client and access an external service that requires certificate authentication. It might also need to perform cryptographic tasks. This article shows how to use public or private certificates in your application code.

This approach to using certificates in your code makes use of the Transport Layer Security (TLS) functionality in App Service, which requires your app to be in the Basic tier or higher. If your app is in the Free or Shared tier, you can [include the certificate file in your app repository](#load-a-certificate-from-a-file).

When you let App Service manage your TLS/Secure Sockets Layer (SSL) certificates, you can maintain the certificates and your application code separately and safeguard your sensitive data.

## Prerequisites

To follow this article, see:

- [Create an App Service app](./index.yml)
- [Add a certificate to your app](configure-ssl-certificate.md)

## Find the thumbprint

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, on the left pane, select **App Services** > *\<app-name>*.

1. On the left pane of your app, select **Certificates**. Then select **Bring your own certificates (.pfx)** or **Public key certificates (.cer)**.

1. Find the certificate that you want to use and copy the thumbprint.

![Screenshot that shows copying the certificate thumbprint.](./media/configure-ssl-certificate/create-free-cert-finished.png)

## Make the certificate accessible

To access a certificate in your app code, add its thumbprint to the `WEBSITE_LOAD_CERTIFICATES` app setting. Run the following command in <a target="_blank" href="https://shell.azure.com" >Azure Cloud Shell</a>:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_LOAD_CERTIFICATES=<comma-separated-certificate-thumbprints>
```

To make all your certificates accessible, set the value to `*`.

When `WEBSITE_LOAD_CERTIFICATES` is set to `*`, all previously added certificates are accessible to application code. If you add a certificate to your app later, restart the app to make the new certificate accessible to your app. For more information, see [Update or renew a certificate](#update-or-renew-a-certificate).

## Load certificates in Windows apps

The `WEBSITE_LOAD_CERTIFICATES` app setting makes the specified certificates accessible to your Windows hosted app in the Windows certificate store, in [Current User\My](/windows-hardware/drivers/install/local-machine-and-current-user-certificate-stores).

In C# code, you access the certificate by using the certificate thumbprint. The following code loads a certificate with the thumbprint `E661583E8FABEF4C0BEF694CBC41C28FB81CD870`.

```csharp
using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

string certThumbprint = "E661583E8FABEF4C0BEF694CBC41C28FB81CD870";
bool validOnly = false;

using (X509Store certStore = new X509Store(StoreName.My, StoreLocation.CurrentUser))
{
  certStore.Open(OpenFlags.ReadOnly);

  X509Certificate2Collection certCollection = certStore.Certificates.Find(
                              X509FindType.FindByThumbprint,
                              // Replace below with your certificate's thumbprint
                              certThumbprint,
                              validOnly);
  // Get the first cert with the thumbprint
  X509Certificate2 cert = certCollection.OfType<X509Certificate2>().FirstOrDefault();

  if (cert is null)
      throw new Exception($"Certificate with thumbprint {certThumbprint} was not found");

  // Use certificate
  Console.WriteLine(cert.FriendlyName);
  
  // Consider to call Dispose() on the certificate after it's being used, available in .NET 4.6 and later
}
```

In Java code, you access the certificate from the `Windows-MY` store by using the **Subject Common Name** field. For more information, see [Public key certificate](https://en.wikipedia.org/wiki/Public_key_certificate). The following code shows how to load a private key certificate:

```java
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.PrivateKey;

...
KeyStore ks = KeyStore.getInstance("Windows-MY");
ks.load(null, null); 
Certificate cert = ks.getCertificate("<subject-cn>");
PrivateKey privKey = (PrivateKey) ks.getKey("<subject-cn>", ("<password>").toCharArray());

// Use the certificate and key
...
```

For languages that don't support or offer insufficient support for the Windows certificate store, see [Load a certificate from a file](#load-a-certificate-from-a-file).

## Load a certificate from a file

If you need to load a certificate file that you upload manually, it's better to upload the certificate by using [File Transfer Protocol Secure (FTPS)](deploy-ftp.md) instead of [Git](deploy-local-git.md), for example. Keep sensitive data like a private certificate out of source control.

ASP.NET and ASP.NET Core on Windows must access the certificate store even if you load a certificate from a file. To load a certificate file in a Windows .NET app, load the current user profile with the following command in <a target="_blank" href="https://shell.azure.com" >Cloud Shell</a>:

 ```azurecli-interactive
 az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_LOAD_USER_PROFILE=1
 ```

 This approach to using certificates in your code makes use of the TLS functionality in App Service, which requires your app to be in the Basic tier or higher.

The following C# example loads a public certificate from a relative path in your app:

```csharp
using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;

...

var cert = X509CertificateLoader.LoadCertificateFromFile("~/<relative-path-to-cert-file>");

// Use the loaded certificate
```
To see how to load a TLS/SSL certificate from a file in Node.js, PHP, Python, or Java, see the documentation for the respective language or web platform.

## Load certificates in Linux/Windows containers

The `WEBSITE_LOAD_CERTIFICATES` app setting makes the specified certificates accessible to your Windows or Linux custom containers (including built-in Linux containers) as files. The files are found under the following directories:

| Container platform | Public certificates | Private certificates |
| - | - | - |
| Windows container | `C:\appservice\certificates\public` | `C:\appservice\certificates\private` |
| Linux container | `/var/ssl/certs` | `/var/ssl/private` |

The certificate file names are the certificate thumbprints.

> [!NOTE]
> App Service injects the certificate paths into Windows containers as the following environment variables: `WEBSITE_PRIVATE_CERTS_PATH`, `WEBSITE_INTERMEDIATE_CERTS_PATH`, `WEBSITE_PUBLIC_CERTS_PATH`, and `WEBSITE_ROOT_CERTS_PATH`. It's better to reference the certificate path with the environment variables instead of hardcoding the certificate path, in case the certificate paths change in the future.
>

In addition, [Windows Server Core and Windows Nano Server containers](configure-custom-container.md#supported-parent-images) load the certificates into the certificate store automatically, in `LocalMachine\My`. To load the certificates, follow the same pattern as shown in [Load certificates in Windows apps](#load-certificates-in-windows-apps). For Windows Nano-based containers, use the file paths as shown in [Load a certificate from a file](#load-a-certificate-from-a-file).

### [Linux](#tab/linux)

The following C# code shows how to load a public certificate in a Linux app.

```csharp
using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;

...

var cert = X509CertificateLoader.LoadCertificateFromFile("/var/ssl/certs/<thumbprint>.der");

// Use the loaded certificate
```

The following C# code shows how to load a private certificate in a Linux app.

```csharp
using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;

...

var cert = X509CertificateLoader.LoadCertificateFromFile("/var/ssl/private/<thumbprint>.p12");

// Use the loaded certificate
```

### [Windows](#tab/windows)

The following C# example shows how to load a public certificate in a .NET Framework app in a Windows Server Core container.

```csharp
using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

string certThumbprint = "E661583E8FABEF4C0BEF694CBC41C28FB81CD870";
bool validOnly = false;

using (X509Store certStore = new X509Store(StoreName.My, StoreLocation.LocalMachine))
{
  certStore.Open(OpenFlags.ReadOnly);

  X509Certificate2Collection certCollection = certStore.Certificates.Find(
                              X509FindType.FindByThumbprint,
                              // Replace below with your certificate's thumbprint
                              certThumbprint,
                              validOnly);
  // Get the first cert with the thumbprint
  X509Certificate2 cert = certCollection.OfType<X509Certificate2>().FirstOrDefault();

  if (cert is null)
      throw new Exception($"Certificate with thumbprint {certThumbprint} was not found");

  // Use certificate
  Console.WriteLine(cert.FriendlyName);
  
  // Consider to call Dispose() on the certificate after it's being used, available in .NET 4.6 and later
}
```

The following C# example shows how to load a public certificate in a .NET Core app in a Windows Server Core or Windows Nano Server container.

```csharp
using System.Security.Cryptography.X509Certificates;

string Thumbprint = "C0CF730E216F5D690D1834446554DF5DC577A78B";

using X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
{
    store.Open(OpenFlags.ReadOnly);
    
    // Get the first cert with the thumbprint
    var certificate = store.Certificates.OfType<X509Certificate2>()
        .First(c => c.Thumbprint == Thumbprint) ?? throw new Exception($"Certificate with thumbprint {Thumbprint} was not found");

    // Use certificate
    ViewData["certificateDetails"] = certificate.IssuerName.Name.ToString();
}
```

---

To see how to load a TLS/SSL certificate from a file in Node.js, PHP, Python, or Java, see the documentation for the respective language or web platform.

## Update or renew a certificate

When you renew a certificate and add it to your app, it gets a new thumbprint, which also must be [made accessible](#make-the-certificate-accessible). How it works depends on your certificate type.

If you manually upload the [public](configure-ssl-certificate.md#upload-a-public-certificate) or [private](configure-ssl-certificate.md#upload-a-private-certificate) certificate:

- If you list thumbprints explicitly in `WEBSITE_LOAD_CERTIFICATES`, add the new thumbprint to the app setting.
- If `WEBSITE_LOAD_CERTIFICATES` is set to `*`, restart the app to make the new certificate accessible.

If you renew a certificate [in Azure Key Vault](configure-ssl-certificate.md#renew-a-certificate-imported-from-key-vault), such as with an [App Service certificate](configure-ssl-app-service-certificate.md#renew-an-app-service-certificate), the daily sync from Key Vault makes the necessary update automatically when your app synchronizes with the renewed certificate.

- If `WEBSITE_LOAD_CERTIFICATES` contains the old thumbprint of your renewed certificate, the daily sync updates the old thumbprint to the new thumbprint automatically.
- If `WEBSITE_LOAD_CERTIFICATES` is set to `*`, the daily sync makes the new certificate accessible automatically.

## Related content

* [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
* [Enforce HTTPS](configure-ssl-bindings.md#enforce-https)
* [Enforce TLS 1.1/1.2](configure-ssl-bindings.md#enforce-tls-versions)
* [FAQ: App Service certificates](./faq-configuration-and-management.yml)
* [Environment variables and app settings reference](reference-app-settings.md)

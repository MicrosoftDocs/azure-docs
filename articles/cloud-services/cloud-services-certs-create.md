---
title: Cloud Services (classic) and management certificates | Microsoft Docs
description: Learn about how to create and deploy certificates for cloud services and for authenticating with the management API in Azure.
ms.topic: article
ms.service: cloud-services
ms.date: 07/23/2024
author: hirenshah1
ms.author: hirshah
ms.custom: compute-evergreen
---

# Certificates overview for Azure Cloud Services (classic)

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

Certificates are used in Azure for cloud services ([service certificates](#what-are-service-certificates)) and for authenticating with the management API ([management certificates](#what-are-management-certificates)). This article gives a general overview of both certificate types, how to [create](#create) and deploy them to Azure.

Certificates used in Azure are x.509 v3 certificates. They can self-sign, or another trusted certificate can sign them. A certificate is self-signed when its creator signs it. Self-signed certificates aren't trusted by default, but most browsers can ignore this problem. You should only use self-signed certificates when developing and testing your cloud services. 

Certificates used by Azure can contain a public key. Certificates have a thumbprint that provides a means to identify them in an unambiguous way. This thumbprint is used in the Azure [configuration file](cloud-services-configure-ssl-certificate-portal.md) to identify which certificate a cloud service should use. 

>[!Note]
>Azure Cloud Services does not accept AES256-SHA256 encrypted certificate.

## What are service certificates?
Service certificates are attached to cloud services and enable secure communication to and from the service. For example, if you deployed a web role, you would want to supply a certificate that can authenticate an exposed HTTPS endpoint. Service certificates, defined in your service definition, are automatically deployed to the virtual machine that is running an instance of your role. 

You can upload service certificates to Azure either using the Azure portal or by using the classic deployment model. Service certificates are associated with a specific cloud service. The service definition file assigns them to a deployment.

Service certificates can be managed separately from your services, and different individuals may manage them. For example, a developer may upload a service package that refers to a certificate that an IT manager previously uploaded to Azure. An IT manager can manage and renew that certificate (changing the configuration of the service) without needing to upload a new service package. Updating without a new service package is possible because the logical name, store name, and location of the certificate is in the service definition file and while the certificate thumbprint is specified in the service configuration file. To update the certificate, it's only necessary to upload a new certificate and change the thumbprint value in the service configuration file.

>[!Note]
>The [Cloud Services FAQ - Configuration and Management](cloud-services-configuration-and-management-faq.yml) article has some helpful information about certificates.

## What are management certificates?
Management certificates allow you to authenticate with the classic deployment model. Many programs and tools (such as Visual Studio or the Azure SDK) use these certificates to automate configuration and deployment of various Azure services. These certificates aren't related to cloud services.

> [!WARNING]
> Be careful! These types of certificates allow anyone who authenticates with them to manage the subscription they are associated with. 
> 
> 

### Limitations
There's a limit of 100 management certificates per subscription. There's also a limit of 100 management certificates for all subscriptions under a specific service administrator’s user ID. If the user ID for the account administrator was already used to add 100 management certificates and there's a need for more certificates, you can add a coadministrator to add more certificates. 

Additionally, management certificates can’t be used with Cloud Solution Provider (CSP) subscriptions as CSP subscriptions only support the Azure Resource Manager deployment model and management certificates use the classic deployment model. Reference [Azure Resource Manager vs classic deployment model](../azure-resource-manager/management/deployment-models.md) and [Understanding Authentication with the Azure SDK for .NET](/dotnet/azure/sdk/authentication) for more information on your options for CSP subscriptions.

<a name="create"></a>
## Create a new self-signed certificate
You can use any tool available to create a self-signed certificate as long as they adhere to these settings:

* An X.509 certificate.
* Contains a public key.
* Created for key exchange (.pfx file).
* Subject name must match the domain used to access the cloud service.

    > You cannot acquire a TLS/SSL certificate for the cloudapp.net (or for any Azure-related) domain; the certificate's subject name must match the custom domain name used to access your application. For example, **contoso.net**, not **contoso.cloudapp.net**.

* Minimum of 2048-bit encryption.
* **Service Certificate Only**: Client-side certificate must reside in the *Personal* certificate store.

There are two easy ways to create a certificate on Windows, with the `makecert.exe` utility, or IIS.

### Makecert.exe
This utility is retired and is no longer documented here. For more information, see [this Microsoft Developer Network (MSDN) article](/windows/desktop/SecCrypto/makecert).

### PowerShell
```powershell
$cert = New-SelfSignedCertificate -DnsName yourdomain.cloudapp.net -CertStoreLocation "cert:\LocalMachine\My" -KeyLength 2048 -KeySpec "KeyExchange"
$password = ConvertTo-SecureString -String "your-password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath ".\my-cert-file.pfx" -Password $password
```

> [!NOTE]
> If you want to use the certificate with an IP address instead of a domain, use the IP address in the -DnsName parameter.


If you want to use this [certificate with the management portal](/previous-versions/azure/azure-api-management-certs), export it to a **.cer** file:

```powershell
Export-Certificate -Type CERT -Cert $cert -FilePath .\my-cert-file.cer
```

### Internet Information Services (IIS)
There are many pages on the internet that cover how to create certificates with IIS, such as [When to Use an IIS Self Signed Certificate](https://www.sslshopper.com/article-how-to-create-a-self-signed-certificate-in-iis-7.html).

### Linux
[Quick steps: Create and use an SSH public-private key pair for Linux VMs in Azure](../virtual-machines/linux/mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) describes how to create certificates with SSH.

## Next steps
[Upload your service certificate to the Azure portal](cloud-services-configure-ssl-certificate-portal.md).

Upload a [management API certificate](/previous-versions/azure/azure-api-management-certs) to the Azure portal.
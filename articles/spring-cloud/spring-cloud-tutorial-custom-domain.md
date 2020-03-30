---
title: "Tutorial - Use custom domain with Azure Spring Cloud"
description: How to map an existing custom DNS name to Azure Spring Cloud
author: MikeDodaro
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 03/19/2020
ms.author: brendm

---
# Map an existing custom DNS name to Azure Spring Cloud
This tutorial maps a domain, such as www.contoso.com, using a CNAME record. It secures the custom domain with a certificate and shows how to enforce Transport Layer Security (TLS), also known as Secure Sockets Layer (SSL). 

Certificates encrypt web traffic. These TLS/SSL certificates can be stored in Azure Key Vault, and allow secure deployments of certificates to Windows virtual machines (VMs) in Azure. 

## Prerequisites
* An application deployed to Azure Spring Cloud (see [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](spring-cloud-quickstart-launch-app-portal.md), or use an existing app).
* A domain name with access to the DNS registry for domain provider such as GoDaddy.
* A private certificate from a third-party provider. The certificate must match the domain.
* [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)

## Import certificate 
The procedure to import the certificate requires a PEM or PFX to be on disk and have a private key. 

Upload your certificate to key vault, then import it to Azure Spring Cloud. 
Go to your service instance, from the left navigation of your app, select **TLS/SSL settings** then **Import Key Vault Certificate**.

![Import certificate](./media/custom-dns-tutorial/import-certificate.png)

When you have successfully imported your certificate, you'll see it on the list of **Private Key Certificates**.

![Private key certificate](./media/custom-dns-tutorial/key-certificates.png)

> [!IMPORTANT] To secure a custom domain with this certificate, you still need to bind the certificate to a specific domain. Follow the steps in **Add SSL Binding**.

## Add Custom Domain
You can use a CNAME record to map a custom DNS name to Azure Spring Cloud. We don't support the A record as the IP may change. 

### Create the CNAME record
Go to your DNS provider and add a CNAME record to map your domain to the <service_name>.azuremicroservices.io, where <service_name> is the name of your Azure Spring Cloud instance. We support wildcard domain and sub domain. 
After you add the CNAME, the DNS records page will look like the following example: 

![DNS records page](./media/custom-dns-tutorial/dns-records.png)

## Map your custom domain to Azure Spring Cloud app
If you don't have an application in Azure Spring Cloud, follow the instructions in [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](https://review.docs.microsoft.com/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal?branch=master).

Go to application page, select **Custom Domain**, then **Add Custom Domain**. 

![Custom domain](./media/custom-dns-tutorial/custom-domain.png)

1. Type the fully qualified domain name that you added a CNAME record for, such as www.contoso.com. Make sure that Hostname record type is set to CNAME (<service_name>.azuremicroservices.io)
1. Select Validate to enable the **Add** button.
1. Select **Add**.

![Add custom domain](./media/custom-dns-tutorial/add-custom-domain.png)

One app can have multiple domains, but one domain can only map to one app. When you've successfully mapped your custom domain to the app, you'll see it on the custom domain table.

![Custom domain table](./media/custom-dns-tutorial/custom-domain-table.png)

[!NOTE] A **Not Secure** label for your custom domain means that it's not yet bound to an SSL certificate, and any HTTPS request from a browser to your custom domain will receive and error or warning, depending on the browser.

## Add SSL binding
In the custom domain table, select **Add ssl binding** as shown in the previous figure.  
1. Select certificate or import a new one.
1. Click **Save**.

![Add SSL binding](./media/custom-dns-tutorial/add-ssl-binding.png)

After you successfully add SSL binding, the domain state will be secure. 

![Add SSL binding](./media/custom-dns-tutorial/secured-domain-state.png)

## Enforce HTTPS
By default, anyone can still access your app using HTTP. You can redirect all HTTP requests to the HTTPS port.

In your app page, in the left navigation, select **Custom Domain**. Then, in **HTTPS Only**, select *True*.

![Add SSL binding](./media/custom-dns-tutorial/enforce-http.png)

When the operation is complete, navigate to any of the HTTP URLs that point to your app. For example:
* http://contoso.com
* http://www.contoso.com

## See also
* [Secure a web server on a Windows virtual machine in Azure with TLS/SSL certificates stored in Key Vault](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-secure-web-server)
* [About keys, secrets, and certificates](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates)
* [What is Azure Key Vault?](https://docs.microsoft.com/azure/key-vault/key-vault-overview)
* [Use Azure Key Vault with an Azure web app in .NET](https://docs.microsoft.com/azure/key-vault/tutorial-net-create-vault-azure-web-app)
* [Authenticate Azure Spring Cloud with Key Vault in GitHub Actions](spring-cloud\spring-cloud-github-actions-key-vault.md)
* [Import a certificate](https://docs.microsoft.com/azure/key-vault/certificate-scenarios#import-a-certificate)
* [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](https://docs.microsoft.com/azure/key-vault/quick-create-portal)
* [Manage storage account keys with Key Vault and the Azure CLI](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys)

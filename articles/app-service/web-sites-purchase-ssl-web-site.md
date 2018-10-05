---
title: Buy and Configure an SSL Certificate for your Azure App Service | Microsoft Docs
description: Learn how to buy an App Service certificate and bind it to your App Service app
services: app-service
documentationcenter: .net
author: cephalin
manager: cfowler
tags: buy-ssl-certificates

ms.assetid: cdb9719a-c8eb-47e5-817f-e15eaea1f5f8
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/01/2017
ms.author: apurvajo;cephalin
---
# Buy and Configure an SSL Certificate for your Azure App Service

This tutorial shows you how to secure your web app by purchasing an SSL certificate for your **[Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714)**, securely storing it in [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis), and associating it with a custom domain.

## Step 1 - Sign in to Azure

Sign in to the Azure portal at http://portal.azure.com

## Step 2 - Place an SSL Certificate order

You can place an SSL Certificate order by creating a new [App Service Certificate](https://portal.azure.com/#create/Microsoft.SSL) In the **Azure portal**.

![Certificate Creation](./media/app-service-web-purchase-ssl-web-site/createssl.png)

Enter a friendly **Name** for your SSL certificate and enter the **Domain Name**

> [!NOTE]
> This step is one of the most critical parts of the purchase process. Make sure to enter correct host name (custom domain) that you want to protect with this certificate. **DO NOT** prepend the Host name with WWW. 
>

Select your **Subscription**, **Resource Group**, and **Certificate SKU**

> [!TIP]
> App Service Certificates can be used for any Azure or non-Azure Services and is not limited to App Services. To do so , you need to create a local PFX copy of an App Service certificate that you can use it anywhere you want. For more information, read [Creating a local PFX copy of an App Service Certificate](https://blogs.msdn.microsoft.com/appserviceteam/2017/02/24/creating-a-local-pfx-copy-of-app-service-certificate/).
>

## Step 3 - Store the certificate in Azure Key Vault

> [!NOTE]
> [Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) is an Azure service that helps safeguard cryptographic keys and secrets used by cloud applications and services.
>

Once the SSL Certificate purchase is complete, you need to open the [App Service Certificates](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders) page.

![insert image of ready to store in KV](./media/app-service-web-purchase-ssl-web-site/ReadyKV.png)

The certificate status is **“Pending Issuance”** as there are few more steps you need to complete before you can start using this certificate.

Click **Certificate Configuration** inside the Certificate Properties page and Click on **Step 1: Store** to store this certificate in Azure Key Vault.

From the **Key Vault Status** page, click **Key Vault Repository** to choose an existing Key Vault to store this certificate **OR Create New Key Vault** to create new Key Vault inside same subscription and resource group.

> [!NOTE]
> Azure Key Vault has minimal charges for storing this certificate.
> For more information, see **[Azure Key Vault Pricing Details](https://azure.microsoft.com/pricing/details/key-vault/)**.
>

Once you have selected the Key Vault Repository to store this certificate in, the **Store** option should show success.

![insert image of store success in KV](./media/app-service-web-purchase-ssl-web-site/KVStoreSuccess.png)

## Step 4 - Verify the Domain Ownership

From the same **Certificate Configuration** page you used in Step 3, click **Step 2: Verify**.

Choose the preferred domain verification method. 

There are four types of domain verification supported by App Service Certificates: App Service, Domain, and Manual Verification. These verification types are explained in more details in the [Advanced section](#advanced).

> [!NOTE]
> **App Service Verification** is the most convenient option when the domain you want to verify is already mapped to an App Service app in the same subscription. It takes advantage of the fact that the App Service app has already verified the domain ownership.
>

Click on **Verify** button to complete this step.

![insert image of domain verification](./media/app-service-web-purchase-ssl-web-site/DomainVerificationRequired.png)

After clicking **Verify**, use the **Refresh** button until the **Verify** option should show success.

![insert image of verify success in KV](./media/app-service-web-purchase-ssl-web-site/KVVerifySuccess.png)

## Step 5 - Assign Certificate to App Service App

> [!NOTE]
> Before performing the steps in this section, you must have associated a custom domain name with your app. For more information, see **[Configuring a custom domain name for a web app.](app-service-web-tutorial-custom-domain.md)**
>

In the **[Azure portal](https://portal.azure.com/)**, click the **App Service** option on the left of the page.

Click the name of your app to which you want to assign this certificate.

In the **Settings**, click **SSL settings**.

Click **Import App Service Certificate** and select the certificate that you just purchased.

![insert image of Import Certificate](./media/app-service-web-purchase-ssl-web-site/ImportCertificate.png)

In the **ssl bindings** section Click on **Add bindings**, and use the dropdowns to select the domain name to secure with SSL, and the certificate to use. You may also select whether to use **[Server Name Indication (SNI)](http://en.wikipedia.org/wiki/Server_Name_Indication)** or IP based SSL.

![insert image of SSL Bindings](./media/app-service-web-purchase-ssl-web-site/SSLBindings.png)

Click **Add Binding** to save the changes and enable SSL.

> [!NOTE]
> If you selected **IP based SSL** and your custom domain is configured using an A record, you must perform the following additional steps. These are explained in more details in the [Advanced section](#Advanced).

At this point, you should be able to visit your app using `HTTPS://` instead of `HTTP://` to verify that the certificate has been configured correctly.

<!--![insert image of https](./media/app-service-web-purchase-ssl-web-site/Https.png)-->

## Step 6 - Management tasks

### Azure CLI

[!code-azurecli[main](../../cli_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.sh?highlight=3-5 "Bind a custom SSL certificate to a web app")] 

### PowerShell

[!code-powershell[main](../../powershell_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.ps1?highlight=1-3 "Bind a custom SSL certificate to a web app")]

## Advanced

### Verifying Domain Ownership

There are two other types of domain verification supported by App service Certificates: domain verification and manual verification.

#### Domain Verification

Choose this option only for [an App Service domain that you purchased from Azure.](custom-dns-web-site-buydomains-web-app.md). Azure automatically adds the verification TXT record for you and completes the process.

#### Manual Verification

> [!IMPORTANT]
> HTML Web Page Verification (only works with Standard Certificate SKU)
>

1. Create an HTML file named **"starfield.html"**

1. Content of this file should be the exact name of the Domain Verification Token. (You can copy the token from the Domain Verification Status page)

1. Upload this file at the root of the web server hosting your domain `/.well-known/pki-validation/starfield.html`

1. Click **Refresh** to update the certificate status after verification is completed. It might take few minutes for verification to complete.

> [!TIP]
> Verify in a terminal using `curl -G http://<domain>/.well-known/pki-validation/starfield.html` the response should contain the `<verification-token>`.

#### DNS TXT Record Verification

1. Using your DNS manager, Create a TXT record on the `@` subdomain with value equal to the Domain Verification Token.
1. Click **“Refresh”** to update the Certificate status after verification is completed.

> [!TIP]
> You need to create a TXT record on `@.<domain>` with value `<verification-token>`.

### Assign Certificate to App Service App

If you selected **IP based SSL** and your custom domain is configured using an A record, you must perform the following additional steps:

After you have configured an IP based SSL binding, a dedicated IP address is assigned to your app. You can find this IP address on the **Custom domain** page under settings of your app, right above the **Hostnames** section. It is listed as **External IP Address**

![insert image of IP SSL](./media/app-service-web-purchase-ssl-web-site/virtual-ip-address.png)

This IP address is different than the virtual IP address used previously to configure the A record for your domain. If you are configured to use SNI based SSL, or are not configured to use SSL, no address is listed for this entry.

Using the tools provided by your domain name registrar, modify the A record for your custom domain name to point to the IP address from the previous step.

## Rekey and Sync the Certificate

If you ever need to rekey your certificate, select the **Rekey and Sync** option from the **Certificate Properties** page.

Click **Rekey** Button to initiate the process. This process can take 1-10 minutes to complete.

![insert image of Rekey SSL](./media/app-service-web-purchase-ssl-web-site/Rekey.png)

Rekeying your certificate rolls the certificate with a new certificate issued from the certificate authority.

## Renew the certificate

To turn on automatic renewal of your certificate at anytime, click **Auto Renew Settings** in the certificate management page. Select **On** and click **Save**. Certificates can start automatically renewing 90 days before expiration if you have automatic renewal turned on.

![](./media/app-service-web-purchase-ssl-web-site/auto-renew.png)

To manually renew the certificate instead, click **Manual Renew** instead. You can request to manually renew your certificate 60 days before expiration.

> [!NOTE]
> The renewed certificate is not automatically bound to your app, whether you renewed it manually or it renewed automatically. To bind it to your app, see [Renew certificates](./app-service-web-tutorial-custom-ssl.md#renew-certificates). 

<a name="notrenewed"></a>
## Why is my certificate not auto-renewed?

If your SSL certificate is configured for auto-renewal, but it is not automatically renewed, you may have a pending domain verification. Note that: 

- GoDaddy, which generates App Service certificates, requires domain verification once every two years. The domain administrator receives an email once every three years to verify the domain. Failure to check the email or verify your domain prevents the App Service certificate from being automatically renewed. 
- Because of a change in GoDaddy policy, all App Service certificates issued prior to March 1, 2017 require reverification of domain at the time of next renewal (even if the auto-renewal is enabled for the certificate). Check your email and complete this one-time domain verification to continue the auto-renewal of the App Service certificate. 

## More resources

* [Enforce HTTPS](app-service-web-tutorial-custom-ssl.md#enforce-https)
* [Enforce TLS 1.1/1.2](app-service-web-tutorial-custom-ssl.md#enforce-tls-versions)
* [Use an SSL certificate in your application code in Azure App Service](app-service-web-ssl-cert-load.md)
* [FAQ : App Service Certificates](https://blogs.msdn.microsoft.com/appserviceteam/2017/07/24/faq-app-service-certificates/)

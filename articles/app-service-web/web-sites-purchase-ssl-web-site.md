---
title: Add an SSL certificate to your Azure App Service app | Microsoft Docs
description: Learn how to add an SSL certificate to your App Service app.
services: app-service
documentationcenter: .net
author: apurvajo; ahmedelnably
manager: stefsch
editor: cephalin
tags: buy-ssl-certificates

ms.assetid: cdb9719a-c8eb-47e5-817f-e15eaea1f5f8
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/19/2016
ms.author: apurvajo;aelnably

---

In this tutorial, you will secure your web app by purchasing an SSL certificate for your **[Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714)**, securely storing it in [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis), and associating it with a custom domain.

By default, [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) enables HTTPS for your web app with a wildcard certificate for the \*.azurewebsites.net domain. If you don't plan to set up a custom domain, you can benefit from the default HTTPS certificate. But, like all [wildcard domains](https://casecurity.org/2014/02/26/pros-and-cons-of-single-domain-multi-domain-and-wildcard-certificates), the Azure wildcard certificate is not as secure as using a custom domain with your own certificate.

App Service gives you a simplified way to purchase and manage an SSL certificate in the Azure portal. 

This article explains how to buy and set up an SSL certificate for your [App Service](http://go.microsoft.com/fwlink/?LinkId=529714) app. 

You can place an SSL Certificate order by creating a new [App Service Certificate](https://portal.azure.com/#create/Microsoft.SSL) In the **Azure portal**.

![Certificate Creation](./media/app-service-web-purchase-ssl-web-site/createssl.png)

Enter a friendly **Name** for your SSL certificate and enter the **Domain Name**

> [!NOTE]
> This is one of the most critical parts of the purchase process. Make sure to enter correct host name (custom domain) that you want to protect with this certificate. **DO NOT** append the Host name with WWW. 
>

Select your **Subscription**, **Resource Group**, and **Certificate SKU**

> [!WARNING]
> App Service Certificates can only be used by other App Services within the same subscription.
>

## <a name="bkmk_StoreKeyVault"></a>Store the certificate in Azure Key Vault

> [!NOTE]
> [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis) is an Azure service that helps safeguard cryptographic keys and secrets used by cloud applications and services.
>

Once the SSL Certificate purchase is complete, you need to open [App Service Certificates](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.CertificateRegistration%2FcertificateOrders) Resource blade.

![insert image of ready to store in KV](./media/app-service-web-purchase-ssl-web-site/ReadyKV.png)

You will notice that Certificate status is **“Pending Issuance”** as there are few more steps you need to complete before you can start using this certificate.

Click **Certificate Configuration** inside Certificate Properties blade and Click on **Step 1: Store** to store this certificate in Azure Key Vault.

From **Key Vault Status** Blade, click **Key Vault Repository** to choose an existing Key Vault to store this certificate **OR Create New Key Vault** to create new Key Vault inside same subscription and resource group.

> [!NOTE]
> Azure Key Vault has minimal charges for storing this certificate. 
> For more information, see **[Azure Key Vault Pricing Details](https://azure.microsoft.com/pricing/details/key-vault/)**.
>

Once you have selected the Key Vault Repository to store this certificate in, the **Store** option should show success.

![insert image of store success in KV](./media/app-service-web-purchase-ssl-web-site/KVStoreSuccess.png)

App Service certificates support three types of domain verification:

From the same **Certificate Configuration** blade you used in Step 3, click **Step 2: Verify**.

**Domain Verification**
This is the most convenient process **ONLY IF** you have **[purchased your custom domain from Azure App Service.](custom-dns-web-site-buydomains-web-app.md)**
Click on **Verify** button to complete this step.

![insert image of domain verification](./media/app-service-web-purchase-ssl-web-site/DomainVerificationRequired.png)

> [!NOTE]
> There are three types of domain verification supported by App service Certificates: Domain, Mail, Manual Verification. These are explained in more details in the [Advanced section](#advanced).

After clicking **Verify**, use the **Refresh** button until the **Verify** option should show success.

![insert image of verify success in KV](./media/app-service-web-purchase-ssl-web-site/KVVerifySuccess.png)

**DNS TXT record verification**
        
1. Using your DNS manager, create a TXT record on the **@** subdomain with a value equal to the **domain verification token.**
2. To update the certificate status when verification is finished, select **Refresh**. It might take few minutes for verification to finish.
 
   For example, to perform validation for a wildcard certificate with host name **\*.contosocertdemo.com** or **\*.subdomain.contosocertdemo.com**, and domain verification token **tgjgthq8d11ttaeah97s3fr2sh**, create a TXT record on **contosocertdemo.com** that has the value **tgjgthq8d11ttaeah97s3fr2sh**.     

## <a name="bkmk_AssignCertificate"></a>Assign the certificate to an App Service app

> [!NOTE]
> Before you complete the steps in this section, you must associate a custom domain name with your app. For more information, see [Configure a custom domain name for a web app](web-sites-custom-domain-name.md).
>

In the **[Azure portal](https://portal.azure.com/)**, click the **App Service** option on the left of the page.

![Import certificate](./media/app-service-web-purchase-ssl-web-site/ImportCertificate.png)

In the **Settings**, click **SSL certificates**.

   ![SSL bindings](./media/app-service-web-purchase-ssl-web-site/SSLBindings.png)
   
    * To associate a certificate with a domain name, IP-based SSL maps the dedicated public IP address of the server to the domain name. When you use IP-based SSL, each domain name (for example, contoso.com or fabricam.com) associated with your service must have a dedicated IP address. This is the traditional method for associating an SSL certificate with a web server.
    * SNI-based SSL is an extension to SSL and [Transport Layer Security](http://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS). When you use SNI-based SSL, multiple domains can share the same IP address. Each domain has a separate security certificate. Most modern browsers, including Internet Explorer, Chrome, Firefox, and Opera, support SNI. Older browsers might not support SNI. For more information about SNI, see [Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) in Wikipedia.

6. To save your changes and enable SSL, select **Add Binding**.

If you select **IP-based SSL** and your custom domain is configured using an A record, you must complete the following additional steps.

> [!NOTE]
> If you selected **IP based SSL** and your custom domain is configured using an A record, you must perform the following additional steps. These are explained in more details in the [Advanced section](#Advanced).

At this point, you should be able to visit your app using `HTTPS://` instead of `HTTP://` to verify that the certificate has been configured correctly.

<!--![insert image of https](./media/app-service-web-purchase-ssl-web-site/Https.png)-->

## Step 6 - Management tasks

[!code-azurecli[main](../../../cli_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.sh?highlight=3-5 "Bind a custom SSL certificate to a web app")] 
[!code-powershell[main](../../../powershell_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.ps1?highlight=1-3 "Bind a custom SSL certificate to a web app")] 

## <a name="advanced"></a>Advanced

### Verifying Domain Ownership
There are two more types of domain verification supported by App service Certificates: Mail, and Manual Verification.

**Mail Verification**

Verification email has already been sent to the Email Address(es) associated with this custom domain.
To complete the Email verification step, open the email and click the verification link.
   
![insert image of email verification](./media/app-service-web-purchase-ssl-web-site/KVVerifyEmailSuccess.png)


If you need to resend the verification email, click the **Resend Email** button.


**Manual Verification**

**HTML Web Page Verification (only works with Standard Certificate SKU)**
1. Create an HTML file named **"starfield.html"**

2. Content of this file should be the exact name of the Domain Verification Token. (You can copy the token from the Domain Verification Status Blade)

3. Upload this file at the root of the web server hosting your domain `/.well-known/pki-validation/starfield.html`

4. Click **Refresh** to update the certificate status after verification is completed. It might take few minutes for verification to complete.

> [!TIP]
> Verify in a terminal using `curl -G http://<domain>/.well-known/pki-validation/starfield.html` the response should contain the `<verification-token>`.

**DNS TXT Record Verification**
1. Using your DNS manager, Create a TXT record on the `@` subdomain with value equal to the Domain Verification Token.
2. Click **“Refresh”** to update the Certificate status after verification is completed.

> [!TIP]
> You need to create a TXT record on `@.<domain>` with value `<verification-token>`. 

### Assign Certificate to App Service App

If you selected **IP based SSL** and your custom domain is configured using an A record, you must perform the following additional steps:

After you have configured an IP based SSL binding, a dedicated IP address is assigned to your app. You can find this IP address on the **Custom domain** page under settings of your app, right above the **Hostnames** section. It is listed as **External IP Address**
  
![insert image of IP SSL](./media/app-service-web-purchase-ssl-web-site/virtual-ip-address.png)

Note that this IP address is different than the virtual IP address used previously to configure the A record for your domain. If you are configured to use SNI based SSL, or are not configured to use SSL, no address is listed for this entry.

Using the tools provided by your domain name registrar, modify the A record for your custom domain name to point to the IP address from the previous step.

## Rekey and Sync the Certificate

If you ever need to Rekey your certificate, select **Rekey and Sync** option from **Certificate Properties** Blade.

Click **Rekey** Button to initiate the process. This process can take 1-10 minutes to complete. 
   
![insert image of ReKey SSL](./media/app-service-web-purchase-ssl-web-site/Rekey.png)

Rekeying your certificate rolls the certificate with a new certificate issued from the certificate authority.

## <a name="bkmk_Rekey"></a>Rekey and sync your certificate

Rekeying your certificate goes through Pending Issuance state. 

Once the certificate is ready, make sure you sync your resources using this certificate to prevent disruption to the service.

Here's some additional information about rekeying:

## Next Steps

* [Add a Content Delivery Network](app-service-web-tutorial-content-delivery-network.md)

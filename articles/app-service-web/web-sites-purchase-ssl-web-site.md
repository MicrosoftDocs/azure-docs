---
title: Buy and Configure an SSL Certificate for your Azure App Service
description: Learn how to Buy and Configure an SSL Certificate for your Azure App Service.
services: app-service
documentationcenter: .net
author: ahmedelnably
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
# Buy and Configure an SSL Certificate for your Azure App Service

In this tutorial, you will purchase an SSL certificate for your **[Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714)**, moving, and configuring your custom domain.

## Step 1 - Log in to Azure

Log in to the Azure portal at http://portal.azure.com

## Step 2 - Place an SSL Certificate order

In the **Azure Portal**, click Browse and Type “App Service Certificates” in search bar and select “App Service Certificates” from the result and Click Add.

   
![insert image of create using browse](./media/app-service-web-purchase-ssl-web-site/browse.jpg)
   
   ![insert image of create using browse](./media/app-service-web-purchase-ssl-web-site/add.jpg)

Enter **Friendly Name** for your SSL certificate and enter the **Host Name**
   
   > [!NOTE]
   > This is one of the most critical parts of the purchase process. Make sure to enter correct host name (custom domain) that you want to protect with this certificate. **DO NOT** append the Host name with WWW. For example, if your custom domain name is www.contoso.com then just enter contoso.com in the Host Name field, the certificate in question will protect both www and root domains. 
   > 
   >

Select your **Subscription**, **Resource Group**, and **Certificate SKU**

![insert image of certificate SKU](./media/app-service-web-purchase-ssl-web-site/SKU.jpg)

> [!NOTE]
> SSL Certificate creation will take anywhere from 1 – 10 minutes. This process performs multiple steps in background that are otherwise very cumbersome to perform manually.  
> 
> 

## Step 3 - Store the certificate in Azure Key Vault

Once the SSL Certificate purchase is complete you will need to open **App Service Certificates** Resource blade by browsing to it again.
   
![insert image of ready to store in KV](./media/app-service-web-purchase-ssl-web-site/ReadyKV.jpg)

You will notice that Certificate status is **“Pending Issuance”** as there are few more steps you need to complete before you can start using this certificates.

Click on **Certificate Configuration** inside Certificate Properties blade and Click on **Step 1: Store** to store this certificate in Azure Key Vault.

From **Key Vault Status** Blade click on **Key Vault Repository** to choose an existing Key Vault to store this certificate **OR Create New Key Vault** to create new Key Vault inside same subscription and resource group.
   
   > [!NOTE]
   > Azure Key Vault has very minimal charges for storing this certificate. 
   > See **[Azure Key Vault Pricing Details](https://azure.microsoft.com/pricing/details/key-vault/)** for more information.
   > 
   > 

Once you have selected the Key Vault Repository to store this certificate in, go ahead and store it by clicking on **Store** button at the top of **Key Vault Status** blade.  

## Step 4 - Verify the Domain Ownership

From the same **Certificate Configuration** blade you used in Step 3, click on **Step 2: Verify**. There are 3 types of domain verification supported by App service Certificates.

**Domain Verification**
This is the most convinent process **ONLY IF** you have **[purchased your custom domain from Azure App Service.](custom-dns-web-site-buydomains-web-app.md)**
Click on **Verify** button to complete this step.

**Mail Verification**
Verification email has already been send to the Email Address(es) associated with this custom domain.
Open the email and click on the verification link to complete the Email Verification step.
If you need to resend the verfication email, click on the **Resent Email** button.

**Manual Verification**

**HTML Web Page Verification (only works with Standard Certificate SKU)**
- Create an HTML file named **"starfield.html"**
- Content of this file should be the exact name of the Domain Verification Token. (You can copy the token from the Domain Verification Status Blade)
- Upload this file at the root of the web server hosting your domain **/.well-known/pki-validation/starfield.html**
- Click on **Refresh** to update the certificate status after verification is completed. It might take few minutes for verification to complete.

For example, if you are buying a standard certificate for **contosocertdemo.com** with Domain Verification Token **tgjgthq8d11ttaeah97s3fr2sh** then a web request made to **http://contosocertdemo.com/.well-known/pki-validation/starfield.html** should return **tgjgthq8d11ttaeah97s3fr2sh**.

**DNS TXT  Record Verification**
- Using your DNS manager, Create a TXT record on the **‘DZC’** subdomain with value equal to the **Domain Verification Token.**
- Click on **“Refresh”** to update the Certificate status after verification is completed. It might take few minutes for verification to complete.

For example, in order to perform validation for a wildcard certificate with hostname **\*.contosocertdemo.com** or **\*.subdomain.contosocertdemo.com** and Domain Verification Token **cAGgQrKc**, you need to create a TXT record on dzc.contosocertdemo.com with value **cAGgQrKc.**   

## Step 5 - Assign Certificate to App Service App

> [!NOTE]
> Before performing the steps in this section, you must have associated a custom domain name with your app. For more information, see **[Configuring a custom domain name for a web app.](web-sites-custom-domain-name.md)**
> 
> 

In the **[Azure Portal.](https://portal.azure.com/)**, click the **App Service** option on the left of the page.

Click the name of your app to which you want to assign this certificate.

In the **Settings**, Click **SSL certificates**.

Click **Import App Service Certificate** and select the certificate that you just purchased.
   
![insert image of Import Certificate](./media/app-service-web-purchase-ssl-web-site/ImportCertificate.png)

In the **ssl bindings** section Click on **Add bindings**, and use the dropdowns to select the domain name to secure with SSL, and the certificate to use. You may also select whether to use **[Server Name Indication (SNI)](http://en.wikipedia.org/wiki/Server_Name_Indication)** or IP based SSL.
   
![insert image of SSL Bindings](./media/app-service-web-purchase-ssl-web-site/SSLBindings.png)

Click **Add Binding** to save the changes and enable SSL.

If you selected **IP based SSL** and your custom domain is configured using an A record, you must perform the following additional steps:

After you have configured an IP based SSL binding, a dedicated IP address is assigned to your app. You can find this IP address on the **Custom domain** page under settings of your app, right above the **Hostnames** section. It will be listed as **External IP Address**
  
![insert image of IP SSL](./media/app-service-web-purchase-ssl-web-site/virtual-ip-address.png)

Note that this IP address will be different than the virtual IP address used previously to configure the A record for your domain. If you are configured to use SNI based SSL, or are not configured to use SSL, no address will be listed for this entry.

Using the tools provided by your domain name registrar, modify the A record for your custom domain name to point to the IP address from the previous step.
At this point, you should be able to visit your app using HTTPS:// instead of HTTP:// to verify that the certificate has been configured correctly.

## Step 6 - Rekey and Sync the Certificate

For security reasons, if you ever need to Rekey your certificate then simply select **"Rekey and Sync"** option from **"Certificate Properties"** Blade.

Click on **"Rekey"** Button to initiate the process. This process can take 1-10 minutes to complete. 
   
![insert image of ReKey SSL](./media/app-service-web-purchase-ssl-web-site/Rekey.jpg)

Rekeying your certificate will roll the certificate with a new certificate issued from the certificate authority.

You will not be charged for the Rekeying for the lifetime of the certificate. 

Rekeying your certificate will go through Pending Issuance state. 

Once the certificate is ready make sure you sync your resources using this certificate to prevent disruption to the service.

Sync option is not available for Certificates that are not yet assigned to the Web App.

## Step 7 - Management tasks

Insert PowerShell and CLI snippets here

## Next Steps
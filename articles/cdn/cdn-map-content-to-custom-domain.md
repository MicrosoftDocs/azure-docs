---
title: Map Azure CDN content to a custom domain | Microsoft Docs
description: Learn how to map Azure CDN content to a custom domain.
services: cdn
documentationcenter: ''
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: 289f8d9e-8839-4e21-b248-bef320f9dbfc
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/09/2017
ms.author: mazha

---
# Add a custom domain to your CDN endpoint
When you create a profile, you typically also create a CDN endpoint (a subdomain of azureedge.net) to deliver your content using HTTP and HTTPS. By default, this endpoint is included in all your URLs, for example, `http(s)://contoso.azureedge.net/photo.png`). For your convenience, Azure CDN provides the option of associating a custom domain (for example, `www.contoso.com`) with your endpoint. With this option, you use a custom domain to deliver your content instead of your endpoint. This option is useful if, for example, you would like your own domain name to be visible to your customers for branding purposes.

Before you can use a custom domain with an Azure CDN endpoint, you must have access to a CNAME DNS record. A CNAME DNS record is a DNS feature that maps a source domain to a destination domain. In this case, the source domain is your custom domain and subdomain (such as www or cdn) and the destination domain is your CDN endpoint. Azure CDN verifies the CNAME DNS record when you add the custom domain to the endpoint from the portal or API. 

If you do not already have a custom domain, you must first purchase one with a domain provider. Then, you must [delegate the DNS to an Azure DNS](https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-portal) and enable the custom domain in Azure CDN. 

If you have an existing custom domain, follow these steps:
1. [Access the DNS records with your domain provider](#step-1-access-the-dns-records-with-your-domain-provider)
2. [Create the CNAME DNS record(s)](#step-2-create-the-cname-dns-records)
	- Option 1: Direct mapping of your custom domain to the CDN endpoint
	- Option 2: Mapping of your custom domain to the CDN endpoint by using cdnverify 
3. [Enable the CNAME record mapping in Azure](#step-3-enable-the-cname-record-mapping-in-azure)
4. [Verify that the custom subdomain references your CDN endpoint](#step-4-verify-that-the-custom-subdomain-references-your-cdn-endpoint)
5. [If you are using the cdnverify intermediate step, repeat steps 1 and 2](#step-5-if-you-are-using-the-cdnverify-intermediate-step-repeat-steps-1-and-2)

## Step 1: Access the DNS records with your domain provider
Sign in to the website of your domain provider.
 
Find the page for managing DNS records by consulting the provider's documentation. Search for areas of the web site labeled **Domain Name**, **DNS**, or **Name Server Management**. 

Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and search for a link that has a name similar to **Zone file**, **DNS Records**, or **Advanced configuration**. Some providers have different links to add different types of records.

> [!NOTE]
> For certain providers, such as GoDaddy, changes to DNS records don't become effective until you select a separate **Save Changes** link. 


## Step 2: Create the CNAME DNS record(s)

You must create a CNAME DNS record with your domain registrar to map your domain to the CDN endpoint. CNAME records map specific subdomains such as `www.contoso.com` or `cdn.contoso.com`. It is not possible to map a CNAME record to a root domain, such as `contoso.com`.

A subdomain can be associated with only one CDN endpoint. The CNAME record that you create will route all traffic addressed to the subdomain to the specified endpoint. For example, if you associate `www.contoso.com` with your CDN endpoint, you cannot associate it with another Azure endpoint, such as a storage account endpoint or a cloud service endpoint. However, you can use different subdomains from the same domain for different service endpoints. You can also map different subdomains to the same CDN endpoint.

Use one of the following options to map your custom domain to a CDN endpoint:

- Option 1: Direct mapping. If **NO** production traffic is running on the custom domain, you can map a custom domain to a CDN endpoint directly. The process of mapping your custom domain to your CDN endpoint might result in a brief period of downtime for the domain while you are registering the domain in the Azure portal. Your DNS mapping should be similar to: `www.consoto.com   CNAME   consoto.azureedge.net`.

- Option 2: Mapping with cdnverify. If production traffic is running on the custom domain, you can create a CNAME record from a custom domain to a CDN endpoint by using an intermediate step. With this option, you use the Azure cdnverify subdomain to provide an intermediate registration step so that users can access your domain without interruption as the DNS mapping takes place. For traffic to flow to the custom domain, after you enable the custom domain in Azure CDN you must visit the domain provider's web site and map the real custom domain to the CDN endpoint (see step 5). 

   1. Create a new CNAME record and provide a subdomain alias that includes the **cdnverify** subdomain. For example, **cdnverify.www** or **cdnverify.cdn**. 
   2. Provide the host name, which is your CDN endpoint, in the following format: `cdnverify.&lt;EndpointName>.azureedge.net`. Your DNS mapping should look like: `cdnverify.www.consoto.com   CNAME   cdnverify.consoto.azureedge.net`.

## Step 3: Enable the CNAME record mapping in Azure

After you have registered your custom domain by using one of the previous procedures, you can then enable the custom domain feature in Azure CDN. 

1. Log in to the [Azure portal](https://portal.azure.com/) and browse to the CDN profile with the endpoint you want to map to a custom domain.  
2. In the **CDN Profile** blade, select the CDN endpoint with which you want to associate the subdomain.
3. In the upper left of the endpoint blade, click **Custom domain**. 
   ![Custom domain button](./media/cdn-map-content-to-custom-domain/cdn-custom-domain-button.png)

4. In the **Custom hostname** text box, enter your custom domain, including the subdomain. For example, `www.contoso.com` or `cdn.contoso.com`.

![Add a custom domain dialog](./media/cdn-map-content-to-custom-domain/cdn-add-custom-domain-dialog.png)

5. Click **Add**.
   Azure verifies that the CNAME record exists for the domain name you have entered. If the CNAME is correct, your custom domain is validated. It can take some time for the CNAME record to propagate to the name servers. If your domain is not validated immediately, verify that the CNAME record is correct, then wait a few minutes and try again. For **Azure CDN from Verizon** (Standard and Premium) endpoints, it can take up to 90 minutes for custom domain settings to propagate to all CDN edge nodes.  

## Step 4: Verify that the custom subdomain references your CDN endpoint
After you have completed the registration of your custom domain, verify that the custom subdomain references your CDN endpoint.
 
1. Ensure that you have public content that is cached at the endpoint. For example, if your CDN endpoint is associated with a storage account, the CDN caches content in public blob containers. To test the custom domain, ensure that your container is set to allow public access and contains at least one blob.

2. In your browser, navigate to the address of the blob using the custom domain. For example, if your custom domain is `cdn.contoso.com`, the URL to the cached blob is similar to the following URL: `http://cdn.contoso.com/mypubliccontainer/acachedblob.jpg`

## Step 5: If you are using the cdnverify intermediate step, repeat steps 1 and 2

After you have enabled the custom domain in Azure CDN and verified that the domain works, you must map the real custom domain to the CDN endpoint. To do so, repeat step 1 and step 2 (using option 1 this time). Then, delete the CNAME record you created with the **cdnverify** subdomain on your provider's web site.

## See Also
[How to Enable the Content Delivery Network (CDN)  for Azure](cdn-create-new-endpoint.md)  
[Delegating your domain to Azure DNS](../dns/dns-domain-delegation.md)
---
title: Add a custom domain to your CDN endpoint | Microsoft Docs
description: Learn how to map Azure CDN content to a custom domain.
services: cdn
documentationcenter: ''
author: dksimpson
manager: akucer
editor: ''

ms.assetid: 289f8d9e-8839-4e21-b248-bef320f9dbfc
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/23/2018
ms.author: mazha
ms.custom: mvc

---
# Add a custom domain to your CDN endpoint
To deliver your CDN content, you must create at least one CDN endpoint in your profile. This endpoint name, which is a subdomain of `azureedge.net`, is included in all your URLs by default (for example, `https://contoso.azureedge.net/photo.png`). For your convenience, Azure CDN provides the option of associating a custom domain, such as `www.contoso.com`, with a CDN endpoint. With this option, you use a custom domain in your URL instead of an endpoint name to deliver your content (for example, `https://www.contoso.com/photo.png`). Using a custom domain is useful if, for instance, you would like your own domain name to be visible to your customers for branding purposes. This tutorial shows how to create and add a custom domain to a CDN endpoint.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Access DNS records by using your domain provider
> - Create the CNAME DNS record
> - Enable the CNAME record mapping in Azure
> - Verify that the custom subdomain references your CDN endpoint
> - Map the permanent custom domain to the CDN endpoint (if necessary)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Before you can complete the steps in this tutorial, you must first create a CDN profile and at least one CDN endpoint. For more information, see [cdn-create-new-endpoint.md](Quickstart: Create an Azure CDN profile and endpoint).

If you do not already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](https://docs.microsoft.com/azure/app-service/custom-dns-web-site-buydomains-web-app).

## Access DNS records by using your domain provider

If you are using Azure to host your [DNS domains](https://docs.microsoft.com/azure/dns/dns-overview), you must delegate the domain provider's DNS to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](https://docs.microsoft.com/azure/dns/dns-delegate-domain-azure-dns).

Otherwise, if you are using your domain provider to handle your DNS domain, sign in to the website of your domain provider. Find the page for managing DNS records by consulting the provider's documentation or searching for areas of the web site labeled **Domain Name**, **DNS**, or **Name Server Management**. Often, you can find the DNS records page by viewing your account information page and searching for a link such as **My domains**. Some providers have different links to add different types of records. For certain providers, such as GoDaddy, changes to DNS records don't become effective until you select a separate **Save Changes** link. 


## Create the CNAME DNS record

Before you can use a custom domain with an Azure CDN endpoint, you must first create a Canonical Name (CNAME) record with your domain provider. A CNAME record is a type of record in the Domain Name System (DNS) that maps a source domain to a destination domain by specifying an alias domain name for the "canonical" or true domain name. For Azure CDN, the source domain is your custom domain (and subdomain) and the destination domain is your CDN endpoint. Azure CDN verifies the CNAME DNS record when you add the custom domain to the endpoint from the portal or API. 

A CNAME record maps a specific domain and subdomain, such as `www.contoso.com` or `cdn.contoso.com`; it is not possible to map a CNAME record to a root domain, such as `contoso.com`. A subdomain can be associated with only one CDN endpoint. A CNAME record routes all traffic addressed to the subdomain to the specified endpoint. For example, if you associate `www.contoso.com` with your CDN endpoint, you cannot associate it with another Azure endpoint, such as a storage account endpoint or a cloud service endpoint. However, you can use different subdomains from the same domain for different service endpoints. You can also map different subdomains to the same CDN endpoint.

Use one of the following options to map your custom domain to a CDN endpoint:

- Option 1: Directly map your custom domain to the CDN endpoint. If no production traffic is running on the custom domain, you can map a custom domain to a CDN endpoint directly. While you are registering the domain in the Azure portal, a brief period of downtime for the domain might occur. Your CNAME mapping entry should be in this format: 
 
  | NAME             | TYPE  | VALUE                  |
  |------------------|-------|------------------------|
  | `www.contoso.com` | `CNAME` | `contoso.azureedge.net` |


- Option 2: Map your custom domain to the CDN endpoint by using the **cdnverify** subdomain. If production traffic that cannot be interrupted is running on the custom domain, you can create a temporary CNAME mapping to your CDN endpoint. With this option, you use the Azure **cdnverify** subdomain to provide an intermediate registration step so that users can access your domain without interruption while the DNS mapping occurs.

   1. Create a new CNAME record and provide a subdomain alias that includes the **cdnverify** subdomain. For example, `cdnverify.www` or `cdnverify.cdn`. 
   2. Provide the host name, which is your CDN endpoint, in the following format: `cdnverify.<EndpointName>.azureedge.net`. Your CNAME mapping entry should be in this format: 

   | NAME                       | TYPE  | VALUE                            |
   |----------------------------|-------|----------------------------------|
   | `cdnverify.www.contoso.com` | `CNAME` | `cdnverify.contoso.azureedge.net` | 


## Enable the CNAME record mapping in Azure

After you have registered your custom domain by using one of the previous procedures, you can then enable the custom domain feature in Azure CDN. 

1. Log in to the [Azure portal](https://portal.azure.com/) and browse to the CDN profile with the endpoint you want to map to a custom domain.
    
2. On the **CDN Profile** page, select the CDN endpoint with which you want to associate the subdomain.
    
3. Select **Custom domain**. 

   ![Custom domain button](./media/cdn-map-content-to-custom-domain/cdn-custom-domain-button.png)

4. For **Custom hostname**, enter your custom domain, including the subdomain. For example, `www.contoso.com` or `cdn.contoso.com`.

   ![Add a custom domain dialog](./media/cdn-map-content-to-custom-domain/cdn-add-custom-domain-dialog.png)

5. Select **Add**.

   Azure verifies that the CNAME record exists for the domain name you have entered. If the CNAME is correct, your custom domain is validated. It can take some time for the CNAME record to propagate to the name servers. If your domain is not validated immediately, verify that the CNAME record is correct, then wait a few minutes and try again. For **Azure CDN from Verizon** (Standard and Premium) endpoints, it can take up to 90 minutes for custom domain settings to propagate to all CDN edge nodes.  


## Verify that the custom subdomain references your CDN endpoint

After you have completed the registration of your custom domain, verify that the custom subdomain references your CDN endpoint.
 
1. Ensure that you have public content that is cached at the endpoint. For example, if your CDN endpoint is associated with a storage account, the CDN caches content in public blob containers. To test the custom domain, verify that your container is set to allow public access and contains at least one blob.

2. In your browser, navigate to the address of the blob by using the custom domain. For example, if your custom domain is `cdn.contoso.com`, the URL to the cached blob should be similar to the following URL: `http://cdn.contoso.com/mypubliccontainer/acachedblob.jpg`.


## Map the permanent custom domain to the CDN endpoint (if necessary)

This step is necessary only if you are using the temporary **cdnverify** subdomain. After you've verified that the temporary subdomain works, you can then map your permanent custom domain to the CDN endpoint.

1. On your domain provider's web site, create a CNAME DNS record to map your permanent custom domain to the CDN endpoint. Your CNAME mapping entry should be in this format: 
 
   | NAME             | TYPE  | VALUE                  |
   |------------------|-------|------------------------|
   | `www.contoso.com` | `CNAME` | `contoso.azureedge.net` |
2. Delete the CNAME record with the **cdnverify** subdomain that you previously created.

## Clean up resources

In the preceding steps, you added a custom domain to a CDN endpoint. If you no longer want to associate your endpoint with a custom domain, you can remove the custom domain by performing these steps:
 
1. In your CDN profile, select the endpoint with the custom domain that you want to remove.

2. From the **Endpoint** page, under Custom domains, right-click the custom domain that you want to remove, then select **Delete** from the context menu.  

   The custom domain is disassociated from your endpoint.


## Next steps

What you learned:

> [!div class="checklist"]
> - Accessed DNS records by using your domain provider
> - Created the CNAME DNS record
> - Enabled the CNAME record mapping in Azure
> - Verified that the custom subdomain references your CDN endpoint
> - Mapped the permanent custom domain to the CDN endpoint

Advance to the next tutorial to learn how to configure HTTPS on an Azure CDN custom domain.

> [!div class="nextstepaction"]
> [Configure HTTPS on an Azure CDN custom domain](cdn-custom-ssl.md)



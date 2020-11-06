---
title: 'Tutorial: Add a custom domain to your endpoint'
titleSuffix: Azure Content Delivery Network
description: Use this tutorial to add a custom domain to an Azure Content Delivery Network endpoint so that your domain name is visible in your URL.
services: cdn
author: asudbring
manager: KumudD
ms.service: azure-cdn
ms.topic: tutorial
ms.date: 11/06/2020
ms.author: allensu
ms.custom: mvc
# As a website owner, I want to add a custom domain to my CDN endpoint so that my users can use my custom domain to access my content.
---
# Tutorial: Add a custom domain to your endpoint

This tutorial shows how to add a custom domain to an Azure Content Delivery Network (CDN) endpoint. 

The endpoint name in your CDN profile is a subdomain of azureedge.net. By default when delivering content, the CDN profile domain is included within the URL.

For example, **https://contoso.azureedge.net/photo.png**.

Azure CDN provides the option of associating a custom domain with a CDN endpoint. This option delivers content with a custom domain in your URL instead of the default domain.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a CNAME DNS record.
> - Associate the custom domain with your CDN endpoint.
> - Verify the custom domain.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Before you can complete the steps in this tutorial, create a CDN profile and at least one CDN endpoint. 
    * For more information, see [Quickstart: Create an Azure CDN profile and endpoint](cdn-create-new-endpoint.md).

* If you don't have a custom domain, purchase one with a domain provider. 
    * For more information, see [Buy a custom domain name](../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../dns/dns-overview.md), delegate your custom domain to Azure DNS. 
    * For more information, see [Delegate a domain to Azure DNS](../dns/dns-delegate-domain-azure-dns.md).

* If you're using a domain provider to handle your DNS domain, continue to [Create a CNAME DNS record](#create-a-cname-dns-record).

---
# [**Azure DNS**](#tab/azure-dns)

## Create a CNAME DNS record

Before you can use a custom domain with an Azure CDN endpoint, you must first create a canonical name (CNAME) record with Azure DNS to point to your CDN endpoint. 

A CNAME record is a DNS record that maps a source domain name to a destination domain name. 

For Azure CDN, the source domain name is your custom domain name and the destination domain name is your CDN endpoint hostname. 

Azure CDN routes traffic addressed to the source custom domain to the destination CDN endpoint hostname after it verifies the CNAME record.

A custom domain and its subdomain can be associated with a single endpoint at a time. 

Use multiple CNAME records for different subdomains from the same custom domain for different Azure services.

You can map a custom domain with different subdomains to the same CDN endpoint.

> [!NOTE]
> This tutorial uses the CNAME record type. If you're using A or AAAA record types, follow the same steps below and replace CNAME with the record type of your choice.

Azure DNS uses alias records for Azure resources within the same subscription.

To add an alias record for your Azure CDN endpoint:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left-hand menu, select **All resources** then the Azure DNS zone for your custom domain.

3. In the DNS zone for your custom domain, select **+ Record set**.

4. In **Add record set** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name  | Enter alias you want to use for your CDN endpoint. For example, **www**. |
    | Type  | Select **CNAME**. |
    | Alias record set | Select **Yes**. |
    | Alias type | Select **Azure resource**. |
    | Choose a subscription | Select your subscription. |
    | Azure resource | Select your Azure CDN endpoint. |

5. Change the **TTL** for the record to your desired value.

6. Select **OK**.

# [**DNS Provider**](#tab/dns-provider)

## Create a CNAME DNS record

Before you can use a custom domain with an Azure CDN endpoint, you must first create a canonical name (CNAME) record with your domain provider to point to your CDN endpoint. 

A CNAME record is a DNS record that maps a source domain name to a destination domain name. 

For Azure CDN, the source domain name is your custom domain name and the destination domain name is your CDN endpoint hostname. 

Azure CDN routes traffic addressed to the source custom domain to the destination CDN endpoint hostname after it verifies the CNAME record.

A custom domain and its subdomain can be associated with a single endpoint at a time. 

Use multiple CNAME records for different subdomains from the same custom domain for different Azure services.

You can map a custom domain with different subdomains to the same CDN endpoint.

> [!NOTE]
> This tutorial uses the CNAME record type. If you're using A or AAAA record types, follow the same steps below and replace CNAME with the record type of your choice.

## Map the temporary cdnverify subdomain

When you map an existing domain that is in production, there are special considerations. 

A brief period of downtime for the domain can occur when registering your custom domain in the Azure portal.

To avoid interruption of web traffic, map your custom domain to your CDN endpoint hostname with the Azure **cdnverify** subdomain. This process creates a temporary CNAME mapping. 

With this method, users can access your domain without interruption while the DNS mapping occurs. 

If production downtime considerations aren't a concern, you can directly map your custom domain to your CDN endpoint. Continue to [Map the permanent custom domain](#map-the-permanent-custom-domain).

To create a CNAME record with the cdnverify subdomain:

1. Sign in to the web site of the DNS provider for your custom domain.

2. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names may vary):

    | Source                    | Type  | Destination                     |
    |---------------------------|-------|---------------------------------|
    | cdnverify.www.contoso.com | CNAME | cdnverify.contoso.azureedge.net |

    - Source: Enter your custom domain name, including the cdnverify subdomain, in the following format: **cdnverify.\<custom-domain-name>**
        - For example: **cdnverify.www.contoso.com**

    - Type: Enter or select **CNAME**.

    - Destination: Enter your CDN endpoint hostname, including the cdnverify subdomain, in the following format: **cdnverify.\<endpoint-name>.azureedge.net**. 
        - For example: **cdnverify.contoso.azureedge.net**

3. Save your changes.

## Map the permanent custom domain

In this section, you map the permanent custom domain to the CDN endpoint. 

To create a CNAME record for your custom domain:

1. Sign in to the web site of the domain provider for your custom domain.

2. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names may vary):

    | Source          | Type  | Destination           |
    |-----------------|-------|-----------------------|
    | www.contoso.com | CNAME | contoso.azureedge.net |

    - Source: Enter your custom domain name.
        - For example: **www.contoso.com**

    - Type: Enter or select **CNAME**.

    - Destination: Enter your CDN endpoint hostname in the following format: **\<endpoint-name>.azureedge.net**. 
        - For example: **contoso.azureedge.net**

3. Save your changes.

4. If you're previously created a temporary cdnverify subdomain CNAME record, delete it. 

5. If you're using this custom domain in production for the first time, follow the steps for [Associate the custom domain with your CDN endpoint](#associate-the-custom-domain-with-your-cdn-endpoint) and [Verify the custom domain](#verify-the-custom-domain).

---
## Associate the custom domain with your CDN endpoint

After you've registered your custom domain, you can then add it to your CDN endpoint. 

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the CDN profile containing the endpoint that you want to map to a custom domain.
    
2. On the **CDN profile** page, select the CDN endpoint to associate with the custom domain.

    :::image type="content" source="media/cdn-map-content-to-custom-domain/cdn-endpoint-selection.png" alt-text="CDN endpoint selection" border="true":::
    
3. Select **+ Custom domain**. 

   :::image type="content" source="media/cdn-map-content-to-custom-domain/cdn-custom-domain-button.png" alt-text="Add custom domain button" border="true":::

4. In **Add a custom domain**, **Endpoint hostname**, is pre-filled and is derived from your CDN endpoint URL: **\<endpoint-hostname>**.azureedge.net. It cannot be changed.

5. For **Custom hostname**, enter your custom domain, including the subdomain, to use as the source domain of your CNAME record. 
    1. For example, **www.contoso.com** or **cdn.contoso.com**. **Don't use the cdnverify subdomain name**.

    :::image type="content" source="media/cdn-map-content-to-custom-domain/cdn-add-custom-domain.png" alt-text="Add custom domain" border="true":::

6. Select **Add**.

   Azure verifies that the CNAME record exists for the custom domain name you entered. If the CNAME is correct, your custom domain will be validated. 

   It can take some time for the new custom domain settings to propagate to all CDN edge nodes: 
    - For **Azure CDN Standard from Microsoft** profiles, propagation usually completes in 10 minutes. 
    - For **Azure CDN Standard from Akamai** profiles, propagation usually completes within one minute. 
    - For **Azure CDN Standard from Verizon** and **Azure CDN Premium from Verizon** profiles, propagation usually completes in 10 minutes.   


## Verify the custom domain

After you've completed the registration of your custom domain, verify that the custom domain references your CDN endpoint.
 
1. Ensure that you have public content that is cached at the endpoint. For example, if your CDN endpoint is associated with a storage account, Azure CDN will cache the content in a public container. Set your container to allow public access and it contains at least one file to test the custom domain.

2. In your browser, navigate to the address of the file by using the custom domain. For example, if your custom domain is `www.contoso.com`, the URL to the cached file should be similar to the following URL: `http://www.contoso.com/my-public-container/my-file.jpg`. Verify that the result is that same as when you access the CDN endpoint directly at **\<endpoint-hostname>**.azureedge.net.

## Clean up resources

If you no longer want to associate your endpoint with a custom domain, remove the custom domain by doing the following steps:
 
1. In your CDN profile, select the endpoint with the custom domain that you want to remove.

2. From the **Endpoint** page, under Custom domains, right-click the custom domain that you want to remove, then select **Delete** from the context menu. Select **Yes**.

   The custom domain is disassociated from your endpoint.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> - Create a CNAME DNS record.
> - Associate the custom domain with your CDN endpoint.
> - Verify the custom domain.

Advance to the next tutorial to learn how to configure HTTPS on an Azure CDN custom domain.

> [!div class="nextstepaction"]
> [Tutorial: Configure HTTPS on an Azure CDN custom domain](cdn-custom-ssl.md)
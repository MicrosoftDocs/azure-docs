---
title: Export DNS records for a private endpoint - Azure portal
titleSuffix: Azure Private Link
description: In this tutorial, learn how to export DNS records for a private endpoint in the Azure portal. 
author: abell
ms.author: abell
ms.service: azure-private-link
ms.topic: how-to 
ms.date: 03/30/2026
ms.custom: template-how-to
# Customer intent: As a cloud administrator, I want to export DNS records for a private endpoint in the portal, so that I can ensure proper name resolution for my Azure resources.
---

# Export DNS records for a private endpoint by using the Azure portal

A private endpoint in Azure requires DNS records for name resolution of the endpoint. The DNS record resolves the private IP address of the endpoint for the configured resource. To export the DNS records of the endpoint, use the Private Link section in the Network foundation page in the portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A private endpoint configured in your subscription. For the example in this article, a private endpoint to an Azure web app is used. For more information on how to create a private endpoint for a web app, see [Quickstart: Create a private endpoint by using the Azure portal](create-private-endpoint-portal.md).

## Export endpoint DNS records

In this section, you sign in to the Azure portal and select the private endpoints page.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Private Link**.

1. Select **Private Link** from the search results.

1. In **Network foundation**, expand **Private Link** in the left menu and select **Private endpoints**.

1. In **Private endpoints**, select the endpoint for which you want to export the DNS records. Select **Generate hostfile** to download the endpoint DNS records in a host file format. If the button isn't visible in the toolbar, select the **More commands** (**...**) button to find it.

1. The downloaded host file records look similar to this example:

    ```text
    # Exported from the Azure portal "2026-03-30 11:26:03Z"
    # Private IP    FQDN    Private Endpoint Id
    10.1.0.4    mywebapp8675.scm.azurewebsites.net    #/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/privateEndpoints/mywebappendpoint
    10.1.0.4    mywebapp8675.azurewebsites.net    #/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/privateEndpoints/mywebappendpoint
    ```

## Next steps

To learn more about Azure Private Link and DNS, see [Azure private endpoint DNS configuration](private-endpoint-dns.md).

For more information on Azure Private Link, see:

* [What is Azure Private Link?](private-link-overview.md)
* [What is Azure Private Link service?](private-link-service-overview.md)
* [Azure Private Link frequently asked questions (FAQ)](private-link-faq.yml)

---
title: Export DNS records for a private endpoint - Azure portal
titleSuffix: Azure Private Link
description: In this tutorial, learn how to export the DNS records for a private endpoint in the Azure portal. 
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: how-to 
ms.date: 07/25/2021
ms.custom: template-how-to
---

# Export DNS records for a private endpoint using the Azure portal

A private endpoint in Azure requires DNS records for name resolution of the endpoint. The DNS record resolves the private IP address of the endpoint for the configured resource. To export the DNS records of the endpoint, use the Private Link center in the portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free ](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A private endpoint configured in your subscription. For the example in this article, a private endpoint to an Azure Web App is used. For more information on creating a private endpoint for a web app, see [Tutorial: Connect to a web app using an Azure Private endpoint](tutorial-private-endpoint-webapp-portal.md).

## Export endpoint DNS records

In this section, you'll sign in to the Azure portal and search for the private link center.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Private Link**.

3. Select **Private link**.

4. In the Private Link center, select **Private endpoints**.

    :::image type="content" source="./media/private-endpoint-export-dns/private-link-center.png" alt-text="Select private endpoints in Private Link center":::

5. In **Private endpoints**, select the endpoint you want to export the DNS records for. Select **Download host file** to download the endpoint DNS records in a host file format.
    
    :::image type="content" source="./media/private-endpoint-export-dns/download-host-file.png" alt-text="Download endpoint DNS records":::

6. The downloaded host file records will look similar to below:

    ```text
    # Exported from the Azure portal "2021-07-26 11:26:03Z"
    # Private IP    FQDN    Private Endpoint Id
    10.1.0.4    mywebapp8675.scm.azurewebsites.net    #/subscriptions/7cc654c6-760b-442f-bd02-1a8a64b17413/resourceGroups/myResourceGroup/providers/Microsoft.Network/privateEndpoints/mywebappendpoint
    10.1.0.4    mywebapp8675.azurewebsites.net    #/subscriptions/7cc654c6-760b-442f-bd02-1a8a64b17413/resourceGroups/myResourceGroup/providers/Microsoft.Network/privateEndpoints/mywebappendpoint
    ```

## Next steps

To learn more about Azure Private link and DNS, see [Azure Private Endpoint DNS configuration](private-endpoint-dns.md).

For more information on Azure Private link, see:

* [What is Azure Private Link?](private-link-overview.md)
* [What is Azure Private Link service?](private-link-service-overview.md)
* [Azure Private Link frequently asked questions (FAQ)](private-link-faq.yml)
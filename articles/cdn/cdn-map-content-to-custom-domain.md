---
title: 'Tutorial: Add a custom domain to your endpoint'
titleSuffix: Azure Content Delivery Network
description: Use this tutorial to add a custom domain to an Azure Content Delivery Network endpoint so that your domain name is visible in your URL.
services: cdn
author: duongau
manager: KumudD
ms.service: azure-cdn
ms.topic: tutorial
ms.date: 03/20/2024
ms.author: duau
ms.custom: mvc, devx-track-azurepowershell
#Customer intent: As a website owner, I want to add a custom domain to my content delivery network endpoint so that my users can use my custom domain to access my content.
---

# Tutorial: Add a custom domain to your endpoint

This tutorial shows how to add a custom domain to an Azure Content Delivery Network endpoint.

The endpoint name in your content delivery network profile is a subdomain of azureedge.net. By default when delivering content, the content delivery network profile domain gets included in the URL.

For example, `https://contoso.azureedge.net/photo.png`.

Azure Content Delivery Network provides the option of associating a custom domain with a content delivery network endpoint. This option delivers content with a custom domain in your URL instead of the default domain.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a CNAME DNS record.
> - Add a custom domain with your content delivery network endpoint.
> - Verify the custom domain.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Before you can complete the steps in this tutorial, create a content delivery network profile and at least one content delivery network endpoint.
    - For more information, see [Quickstart: Create an Azure Content Delivery Network profile and endpoint](cdn-create-new-endpoint.md).

- If you don't have a custom domain, purchase one with a domain provider.
    - For more information, see [Buy a custom domain name](../app-service/manage-custom-dns-buy-domain.md).

- If you're using Azure to host your [DNS domains](../dns/dns-overview.md), delegate your custom domain to Azure DNS.
    - For more information, see [Delegate a domain to Azure DNS](../dns/dns-delegate-domain-azure-dns.md).

- If you're using a domain provider to handle your DNS domain, continue to [Create a CNAME DNS record](#create-a-cname-dns-record).

## Create a CNAME DNS record

Before you can use a custom domain with an Azure Content Delivery Network endpoint, you must first create a canonical name (CNAME) record with Azure DNS or your DNS provider to point to your content delivery network endpoint.

A CNAME record is a DNS record that maps a source domain name to a destination domain name.

For Azure Content Delivery Network, the source domain name is your custom domain name and the destination domain name is your content delivery network endpoint hostname.

Azure Content Delivery Network routes traffic addressed to the source custom domain to the destination content delivery network endpoint hostname after it verifies the CNAME record.

A custom domain and its subdomain can only get added to a single endpoint at a time.

Use multiple CNAME records for different subdomains from the same custom domain for different Azure services.

You can map a custom domain with different subdomains to the same content delivery network endpoint.

> [!NOTE]
> - This tutorial uses the CNAME record type for multiple purposes:
>   - *Traffic routing* can be accomplished with a CNAME record as well as A or AAAA record types in Azure DNS. To apply, use the following steps to replace the CNAME record with the record type of your choice.
>   - A CNAME record is **required** for custom domain *ownership validation* and must be available when adding the custom domain to a content delivery network endpoint. More details in the following section.
---

# [**Azure DNS**](#tab/azure-dns)

Azure DNS uses alias records for Azure resources within the same subscription.

To add an alias record for your Azure Content Delivery Network endpoint:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left-hand menu, select **All resources** then the Azure DNS zone for your custom domain.

3. In the DNS zone for your custom domain, select **+ Record set**.

4. In **Add record set** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name  | Enter alias you want to use for your content delivery network endpoint. For example, **www**. |
    | Type  | Select **CNAME**. |
    | Alias record set | Select **Yes**. |
    | Alias type | Select **Azure resource**. |
    | Choose a subscription | Select your subscription. |
    | Azure resource | Select your Azure Content Delivery Network endpoint. |

5. Change the **TTL** for the record to your value.

6. Select **OK**.

# [**DNS Provider**](#tab/dns-provider)

## Map the temporary cdnverify subdomain

When you map an existing domain that is in production, there are special considerations.

A brief period of downtime for the domain can occur when registering your custom domain in the Azure portal.

To avoid interruption of web traffic, map your custom domain to your content delivery network endpoint hostname with the Azure **cdnverify** subdomain. This process creates a temporary CNAME mapping.

With this method, users can access your domain without interruption while the DNS mapping occurs.

If production downtime considerations aren't a concern, you can directly map your custom domain to your content delivery network endpoint. Continue to [Map the permanent custom domain](#map-the-permanent-custom-domain).

To create a CNAME record with the cdnverify subdomain:

1. Sign in to the web site of the DNS provider for your custom domain.

2. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names might vary):

    | Source                    | Type  | Destination                     |
    |---------------------------|-------|---------------------------------|
    | cdnverify.www.contoso.com | CNAME | cdnverify.contoso.azureedge.net |

    - Source: Enter your custom domain name, including the cdnverify subdomain, in the following format: **cdnverify.\<custom-domain-name>**
        - For example: **cdnverify.www.contoso.com**

    - Type: Enter or select **CNAME**.

    - Destination: Enter your content delivery network endpoint hostname, including the cdnverify subdomain, in the following format: **cdnverify.\<endpoint-name>.azureedge.net**.
        - For example: **cdnverify.contoso.azureedge.net**

3. Save your changes.

## Map the permanent custom domain

In this section, you map the permanent custom domain to the content delivery network endpoint.

To create a CNAME record for your custom domain:

1. Sign in to the web site of the domain provider for your custom domain.

2. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names might vary):

    | Source          | Type  | Destination           |
    |-----------------|-------|-----------------------|
    | www.contoso.com | CNAME | contoso.azureedge.net |

    - Source: Enter your custom domain name.
        - For example: **www.contoso.com**

    - Type: Enter or select **CNAME**.

    - Destination: Enter your content delivery network endpoint hostname in the following format: **\<endpoint-name>.azureedge.net**.
        - For example: **contoso.azureedge.net**

3. Save your changes.

4. If you previously created a temporary cdnverify subdomain CNAME record, delete it.

5. If you're using this custom domain in production for the first time, follow the steps for [Add the custom domain with your content delivery network endpoint](#add-a-custom-domain-to-your-cdn-endpoint) and [Verify the custom domain](#verify-the-custom-domain).

---

<a name='add-a-custom-domain-to-your-cdn-endpoint'></a>

## Add a custom domain to your content delivery network endpoint

After you've registered your custom domain, you can then add it to your content delivery network endpoint.

# [**Azure portal**](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the content delivery network profile containing the endpoint that you want to map to a custom domain.

2. On the **CDN profile** page, select the content delivery network endpoint to add the custom domain.

    :::image type="content" source="media/cdn-map-content-to-custom-domain/cdn-endpoint-selection.png" alt-text="Screenshot of content delivery network endpoint selection." border="true":::

3. Select **+ Custom domain**.

   :::image type="content" source="media/cdn-map-content-to-custom-domain/cdn-custom-domain-button.png" alt-text="Screenshot of the add custom domain button." border="true":::

4. In **Add a custom domain**, **Endpoint hostname**, gets generated and pre-filled from your content delivery network endpoint URL: **\<endpoint-hostname>**.azureedge.net. You can't change this value.

5. For **Custom hostname**, enter your custom domain, including the subdomain, to use as the source domain of your CNAME record.
    1. For example, **www.contoso.com** or **cdn.contoso.com**. **Don't use the cdnverify subdomain name**.

    :::image type="content" source="media/cdn-map-content-to-custom-domain/cdn-add-custom-domain.png" alt-text="Add custom domain" border="true":::

6. Select **Add**.

   Azure verifies that the CNAME record exists for the custom domain name you entered. If the CNAME is correct, your custom domain gets validated.

   It can take some time for the new custom domain settings to propagate to all content delivery network edge nodes:
    - For **Azure CDN Standard from Microsoft** profiles, propagation usually completes in 10 minutes.
    - For **Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** profiles, propagation usually completes in 10 minutes.

# [**PowerShell**](#tab/azure-powershell)

1. Sign in to Azure PowerShell:

```azurepowershell-interactive
    Connect-AzAccount

```

2. Use [New-AzCdnCustomDomain](/powershell/module/az.cdn/new-azcdncustomdomain) to map the custom domain to your content delivery network endpoint.

    - Replace **myendpoint8675.azureedge.net** with your endpoint URL.
    - Replace **myendpoint8675** with your content delivery network endpoint name.
    - Replace **www.contoso.com** with your custom domain name.
    - Replace **myCDN** with your content delivery network profile name.
    - Replace **myResourceGroupCDN** with your resource group name.

```azurepowershell-interactive
    $parameters = @{
        Hostname = 'myendpoint8675.azureedge.net'
        EndPointName = 'myendpoint8675'
        CustomDomainName = 'www.contoso.com'
        ProfileName = 'myCDN'
        ResourceGroupName = 'myResourceGroupCDN'
    }
    New-AzCdnCustomDomain @parameters
```

Azure verifies that the CNAME record exists for the custom domain name you entered. If the CNAME is correct, your custom domain gets validated.

   It can take some time for the new custom domain settings to propagate to all content delivery network edge nodes:

- For **Azure CDN Standard from Microsoft** profiles, propagation usually completes in 10 minutes.
- For **Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** profiles, propagation usually completes in 10 minutes.

---

## Verify the custom domain

After you've completed the registration of your custom domain, verify that the custom domain references your content delivery network endpoint.

1. Ensure that you have public content that you want cached at the endpoint. For example, if your content delivery network endpoint is associated with a storage account, Azure Content Delivery Network caches the content in a public container. Set your container to allow public access and it contains at least one file to test the custom domain.

2. In your browser, navigate to the address of the file by using the custom domain. For example, if your custom domain is `www.contoso.com`, the URL to the cached file should be similar to the following URL: `http://www.contoso.com/my-public-container/my-file.jpg`. Verify that the result is that same as when you access the content delivery network endpoint directly at **\<endpoint-hostname>**.azureedge.net.

## Clean up resources
---

# [**Azure portal**](#tab/azure-portal-cleanup)

If you no longer want to associate your endpoint with a custom domain, remove the custom domain by doing the following steps:

1. Go to your DNS provider, delete the CNAME record for the custom domain, or update the CNAME record for the custom domain to a non-Azure Content Delivery Network endpoint.

    > [!IMPORTANT]
    > To prevent dangling DNS entries and the security risks they create, starting from April 9, 2021, Azure Content Delivery Network requires removal of the CNAME records to Azure Content Delivery Network endpoints before the resources can be deleted. Resources include Azure Content Delivery Network custom domains, Azure Content Delivery Network profiles/endpoints or Azure resource groups that have Azure Content Delivery Network custom domains enabled.

2. In your content delivery network profile, select the endpoint with the custom domain that you want to remove.

3. From the **Endpoint** page, under Custom domains, select and hold (or right-click) the custom domain that you want to remove, then select **Delete** from the context menu. Select **Yes**.

   The custom domain gets removed from your endpoint.

# [**PowerShell**](#tab/azure-powershell-cleanup)

If you no longer want your endpoint to have a custom domain, remove the custom domain by doing the following steps:

1. Go to your DNS provider, delete the CNAME record for the custom domain, or update the CNAME record for the custom domain to a non-Azure Content Delivery Network endpoint.

    > [!IMPORTANT]
    > To prevent dangling DNS entries and the security risks they create, starting from ninth 2021 9, 2021 ninth 2021, Azure Content Delivery Network requires removal of the CNAME records to Azure Content Delivery Network endpoints before the resources can be deleted. Resources include Azure Content Delivery Network custom domains, Azure Content Delivery Network profiles/endpoints or Azure resource groups that have Azure Content Delivery Network custom domains enabled.

2. Use [Remove-AzCdnCustomDomain](/powershell/module/az.cdn/remove-azcdncustomdomain) to remove the custom domain from the endpoint:

    - Replace **myendpoint8675** with your content delivery network endpoint name.
    - Replace **www.contoso.com** with your custom domain name.
    - Replace **myCDN** with your content delivery network profile name.
    - Replace **myResourceGroupCDN** with your resource group name.

    ```azurepowershell-interactive
        $parameters = @{
            CustomDomainName = 'www.contoso.com'
            EndPointName = 'myendpoint8675'
            ProfileName = 'myCDN'
            ResourceGroupName = 'myResourceGroupCDN'
        }
        Remove-AzCdnCustomDomain @parameters
    ```

---

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> - Create a CNAME DNS record.
> - Add a custom domain with your content delivery network endpoint.
> - Verify the custom domain.

Advance to the next tutorial to learn how to configure HTTPS on an Azure Content Delivery Network custom domain.

> [!div class="nextstepaction"]
> [Tutorial: Configure HTTPS on an Azure Content Delivery Network custom domain](cdn-custom-ssl.md)

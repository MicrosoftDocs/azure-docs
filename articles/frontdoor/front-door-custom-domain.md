---
title: Add a Custom Domain to Azure Front Door
description: In this article, you learn how to onboard a custom domain to Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 05/04/2026

#Customer intent: As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Add a custom domain to Azure Front Door

**Applies to:** :heavy_check_mark: Front Door (classic)

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

This article shows how to add a custom domain to your Front Door. When you use Azure Front Door for application delivery, a custom domain is necessary if you want your own domain name to be visible in your end-user request. Having a visible domain name can be convenient for your customers and useful for branding purposes.

After you create a Front Door profile, the default frontend host is a subdomain of `azurefd.net`. This name is included in the URL for delivering Front Door content to your backend by default. For example, `https://contoso-frontend.azurefd.net`. For your convenience, Azure Front Door provides the option to associate a custom domain to the endpoint. With this capability, you can deliver your content with your URL instead of the Front Door default domain name, such as `https://www.contoso.com/photo.png`. 

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> Front Door does **not** support custom domains with [punycode](https://en.wikipedia.org/wiki/Punycode) characters. 

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door](quickstart-create-front-door.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, continue to [Create a CNAME DNS record](#create-a-cname-dns-record).

## Create a CNAME DNS record

Before you can use a custom domain with your Front Door, you must first create a canonical name (CNAME) record with your domain provider to point to the Front Door default frontend host. A CNAME record is a type of DNS record that maps a source domain name to a destination domain name. In Azure Front Door, the source domain name is your custom domain name and the destination domain name is your Front Door default hostname. Once Front Door verifies the CNAME record gets created, traffic to the source custom domain gets routed to the specified destination Front Door default frontend host. 

A custom domain can only be associated with one Front Door profile at a time. However, you can have different subdomains of an apex domain in the same or a different Front Door profile.

## Map the temporary afdverify subdomain

When you map an existing domain that's in production, consider the impact. While you're registering your custom domain in the Azure portal, a brief period of downtime for the domain might occur. To avoid interruption of web traffic, map your custom domain to your Front Door default frontend host by using the Azure afdverify subdomain first to create a temporary CNAME mapping. Your users can access your domain without interruption when the DNS mapping occurs.

If you're using your custom domain for the first time with no production traffic, you can directly map your custom domain to your Front Door. You can skip ahead to [Map the permanent custom domain](#map-the-permanent-custom-domain).

To create a CNAME record by using the afdverify subdomain:

1. Sign in to the website of the domain provider for your custom domain.

1. Find the page for managing DNS records by consulting the provider's documentation or searching for areas of the website labeled **Domain Name**, **DNS**, or **Name server management**. 

1. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names might vary):

    | Source                    | Type  | Destination                     |
    |---------------------------|-------|---------------------------------|
    | afdverify.www.contoso.com | CNAME | afdverify.contoso-frontend.azurefd.net |

        
    - **Source:** Enter your custom domain name, including the `afdverify` subdomain, in the following format: `afdverify.<custom domain name>`. For example, `afdverify.www.contoso.com`. If you're mapping a wildcard domain, like `*.contoso.com`, the source value is the same as it would be without the wildcard: `afdverify.contoso.com`.

    - **Type:** Enter *CNAME*.

    - **Destination:** Enter your default Front Door frontend host, including the afdverify subdomain, in the following format: `afdverify.<endpoint name>.azurefd.net`. For example, `afdverify.contoso-frontend.azurefd.net`.

1. Save your changes.

For example, the procedure for the GoDaddy domain registrar is as follows:

1. Sign in and select the custom domain you want to use.

1. In the **Domains** section, select **Manage All**, and then select **DNS** | **Manage Zones**.

1. For **Domain Name**, enter your custom domain, and then select **Search**.

1. From the **DNS Management** page, select **Add**, and then select **CNAME** in the **Type** list.

1. Complete the following fields of the CNAME entry:

    - Type: Leave *CNAME* selected.

    - Host: Enter the subdomain of your custom domain for use, including the afdverify subdomain name. For example, `afdverify.www`.

    - Points to: Enter the host name of your default Front Door frontend host, including the afdverify subdomain name. For example, `afdverify.contoso-frontend.azurefd.net`. 

    - TTL: Leave *one Hour* selected.

1. Select **Save**.
 
    The CNAME entry is added to the DNS records table.

## Associate the custom domain with your Front Door

After you register your custom domain, add it to your Front Door.

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the Front Door containing the frontend host that you want to map to a custom domain.
    
1. On the **Front Door designer** page, select **+** to add a custom domain.
    
3. Specify **Custom domain**. 

1. For **Frontend host**, the frontend host to use as the destination domain of your CNAME record is predetermined and is derived from your Front Door: *&lt;default hostname&gt;*.azurefd.net. You can't change it.

1. For **Custom hostname**, enter your custom domain, including the subdomain, to use as the source domain of your CNAME record. For example, www\.contoso.com or cdn.contoso.com. Don't use the afdverify subdomain name.

1. Select **Add**.

   Azure verifies that the CNAME record exists for the custom domain name you entered. If the CNAME is correct, your custom domain gets validated.

> [!WARNING]
> You **must** ensure that each of the frontend hosts (including custom domains) in your Front Door has a routing rule with a default path ('/\*') associated with it. That is, across all of your routing rules there must be at least one routing rule for each of your frontend hosts defined at the default path ('/\*'). If you don't configure this setting, your end-user traffic might not route correctly.

## Verify the custom domain

After you complete the registration of your custom domain, verify that the custom domain references your default Front Door frontend host.
 
In your browser, go to the address of the file by using the custom domain. For example, if your custom domain is robotics.contoso.com, the URL to the cached file should be similar to the following URL: `http://robotics.contoso.com/my-public-container/my-file.jpg`. Verify that the result is the same as when you access the Front Door directly at *&lt;Front Door host&gt;*.azurefd.net.


## Map the permanent custom domain

To map the custom domain directly to your default Front Door frontend host, first make sure that the afdverify subdomain is successfully mapped to your Front Door. Once verified, you can proceed with mapping the custom domain.

To create a CNAME record for your custom domain:

1. Sign in to the website of the domain provider for your custom domain.

1. Find the page for managing DNS records by consulting the provider's documentation or searching for areas of the website labeled **Domain Name**, **DNS**, or **Name Server Management**. 

1. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names might vary):

    | Source          | Type  | Destination           |
    |-----------------|-------|-----------------------|
    | <www.contoso.com> | CNAME | contoso-frontend.azurefd.net |

   - Source: Enter your custom domain name (for example, www\.contoso.com).

   - Type: Enter *CNAME*.

   - Destination: Enter your default Front Door frontend host. It must be in the following format:_&lt;hostname&gt;_.azurefd.net. For example, contoso-frontend.azurefd.net.

1. Save your changes.

1. If you previously created a temporary afdverify subdomain CNAME record, delete it. 

1. If you're using this custom domain in production for the first time, follow the steps for [Associate the custom domain with your Front Door](#associate-the-custom-domain-with-your-front-door) and [Verify the custom domain](#verify-the-custom-domain).

For example, the procedure for the GoDaddy domain registrar is as follows:

1. Sign in and select the custom domain you want to use.

1. In the **Domains** section, select **Manage All**, and then select **DNS** | **Manage Zones**.

1. For **Domain Name**, enter your custom domain, and then select **Search**.

1. From the **DNS Management** page, select **Add**, and then select **CNAME** in the **Type** list.

1. Complete the fields of the CNAME entry:

    - Type: Leave *CNAME* selected.

    - Host: Enter the subdomain of your custom domain to use. For example, www or profile.

    - Points to: Enter the default host name of your Front Door. For example, contoso.azurefd.net. 

    - TTL: Leave *one Hour* selected.

1. Select **Save**.
 
    The CNAME entry is added to the DNS records table.

1. If you have an afdverify CNAME record, select the pencil icon next to it, and then select the trash can icon.

1. Select **Delete** to delete the CNAME record.

## Clean up resources

In the preceding steps, you added a custom domain to a Front Door. If you no longer want to associate your Front Door with a custom domain, remove the custom domain by following these steps:
 
1. Go to your DNS provider, and either delete the CNAME record for the custom domain or update the CNAME record for the custom domain to a non-Front Door endpoint.

    > [!Important]
    > To prevent dangling DNS entries and the security risks they create, starting from April 9, 2021, Azure Front Door requires removal of the CNAME records to Front Door endpoints before you can delete the resources. Resources include Front Door custom domains, Front Door endpoints, or Azure resource groups that have Front Door custom domains enabled.

1. In your Front Door designer, select the custom domain that you want to remove.

1. Select **Delete** from the context menu for the custom domain. The custom domain is removed from your endpoint.

## Next step

> [!div class="nextstepaction"]
> [Enable HTTPS for a custom domain](front-door-custom-domain-https.md)

---
title: Tutorial - Add custom domain to your Azure Front Door configuration
description: In this tutorial, you learn how to onboard a custom domain to Azure Front Door.
services: frontdoor
documentationcenter: ''
author: sharad4u
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/10/2018
ms.author: sharadag
# As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.

---
# Tutorial: Add a custom domain to your Front Door
This tutorial shows how to add a custom domain to your Front Door. When you use Azure Front Door for application delivery, a custom domain is necessary if you would like your own domain name to be visible in your end-user request. Having a visible domain name can be convenient for your customers and useful for branding purposes.

After you create a Front Door, the default frontend host, which is a subdomain of `azurefd.net`, is included in the URL for delivering Front Door content from your backend by default (for example, https:\//contoso.azurefd.net/activeusers.htm). For your convenience, Azure Front Door provides the option of associating a custom domain with the default host. With this option, you deliver your content with a custom domain in your URL instead of a Front Door owned domain name (for example, https:\//www.contoso.com/photo.png). 

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a CNAME DNS record.
> - Associate the custom domain with your Front Door.
> - Verify the custom domain.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> Front Door does **not** support custom domains with [punycode](https://en.wikipedia.org/wiki/Punycode) characters. 

## Prerequisites

Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door](quickstart-create-front-door.md).

If you do not already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](https://docs.microsoft.com/azure/app-service/manage-custom-dns-buy-domain).

If you are using Azure to host your [DNS domains](https://docs.microsoft.com/azure/dns/dns-overview), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](https://docs.microsoft.com/azure/dns/dns-delegate-domain-azure-dns). Otherwise, if you are using a domain provider to handle your DNS domain, proceed to [Create a CNAME DNS record](#create-a-cname-dns-record).


## Create a CNAME DNS record

Before you can use a custom domain with your Front Door, you must first create a canonical name (CNAME) record with your domain provider to point to your Front Door's default frontend host (say contoso.azurefd.net). A CNAME record is a type of DNS record that maps a source domain name to a destination domain name. For Azure Front Door, the source domain name is your custom domain name and the destination domain name is your Front Door default hostname. After Front Door verifies the CNAME record that you create, traffic addressed to the source custom domain (such as www\.contoso.com) is routed to the specified destination Front Door default frontend host (such as contoso.azurefd.net). 

A custom domain and its subdomain can be associated with only a single Front Door at a time. However, you can use different subdomains from the same custom domain for different Front Doors by using multiple CNAME records. You can also map a custom domain with different subdomains to the same Front Door.


## Map the temporary afdverify subdomain

When you map an existing domain that is in production, there are special considerations. While you are registering your custom domain in the Azure portal, a brief period of downtime for the domain can occur. To avoid interruption of web traffic, first map your custom domain to your Front Door default frontend host with the Azure afdverify subdomain to create a temporary CNAME mapping. With this method, users can access your domain without interruption while the DNS mapping occurs.

Otherwise, if you are using your custom domain for the first time and no production traffic is running on it, you can directly map your custom domain to your Front Door. Proceed to [Map the permanent custom domain](#map-the-permanent-custom-domain).

To create a CNAME record with the afdverify subdomain:

1. Sign in to the web site of the domain provider for your custom domain.

2. Find the page for managing DNS records by consulting the provider's documentation or searching for areas of the web site labeled **Domain Name**, **DNS**, or **Name server management**. 

3. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names may vary):

    | Source                    | Type  | Destination                     |
    |---------------------------|-------|---------------------------------|
    | afdverify.www.contoso.com | CNAME | afdverify.contoso.azurefd.net |

    - Source: Enter your custom domain name, including the afdverify subdomain, in the following format: afdverify._&lt;custom domain name&gt;_. For example, afdverify.www.contoso.com.

    - Type: Enter *CNAME*.

    - Destination: Enter your default Front Door frontend host, including the afdverify subdomain, in the following format: afdverify._&lt;endpoint name&gt;_.azurefd.net. For example, afdverify.contoso.azurefd.net.

4. Save your changes.

For example, the procedure for the GoDaddy domain registrar is as follows:

1. Sign in and select the custom domain you want to use.

2. In the Domains section, select **Manage All**, then select **DNS** | **Manage Zones**.

3. For **Domain Name**, enter your custom domain, then select **Search**.

4. From the **DNS Management** page, select **Add**, then select **CNAME** in the **Type** list.

5. Complete the following fields of the CNAME entry:

    - Type: Leave *CNAME* selected.

    - Host: Enter the subdomain of your custom domain to use, including the afdverify subdomain name. For example, afdverify.www.

    - Points to: Enter the host name of your default Front Door frontend host, including the afdverify subdomain name. For example, afdverify.contoso.azurefd.net. 

    - TTL: Leave *one Hour* selected.

6. Select **Save**.
 
    The CNAME entry is added to the DNS records table.


## Associate the custom domain with your Front Door

After you've registered your custom domain, you can then add it to your Front Door.

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the Front Door containing the frontend host that you want to map to a custom domain.
    
2. On the **Front Door designer** page, click on '+' to add a custom domain.
    
3. Specify **Custom domain**. 

4. For **Frontend host**, the frontend host to use as the destination domain of your CNAME record is pre-filled and is derived from your Front Door: *&lt;default hostname&gt;*.azurefd.net. It cannot be changed.

5. For **Custom hostname**, enter your custom domain, including the subdomain, to use as the source domain of your CNAME record. For example, www\.contoso.com or cdn.contoso.com. Do not use the afdverify subdomain name.

6. Select **Add**.

   Azure verifies that the CNAME record exists for the custom domain name you entered. If the CNAME is correct, your custom domain will be validated.

>[!WARNING]
> You **must** ensure that each of the frontend hosts (including custom domains) in your Front Door has a routing rule with a default path ('/\*') associated with it. That is, across all of your routing rules there must be at least one routing rule for each of your frontend hosts defined at the default path ('/\*'). Failing to do so, may result in your end-user traffic not getting routed correctly.

## Verify the custom domain

After you have completed the registration of your custom domain, verify that the custom domain references your default Front Door frontend host.
 
In your browser, navigate to the address of the file by using the custom domain. For example, if your custom domain is robotics.contoso.com, the URL to the cached file should be similar to the following URL: http:\//robotics.contoso.com/my-public-container/my-file.jpg. Verify that the result is that same as when you access the Front Door directly at *&lt;Front Door host&gt;*.azurefd.net.


## Map the permanent custom domain

If you have verified that the afdverify subdomain has been successfully mapped to your Front Door (or if you are using a new custom domain  that is not in production), you can then map the custom domain directly to your default Front Door frontend host.

To create a CNAME record for your custom domain:

1. Sign in to the web site of the domain provider for your custom domain.

2. Find the page for managing DNS records by consulting the provider's documentation or searching for areas of the web site labeled **Domain Name**, **DNS**, or **Name Server Management**. 

3. Create a CNAME record entry for your custom domain and complete the fields as shown in the following table (field names may vary):

    | Source          | Type  | Destination           |
    |-----------------|-------|-----------------------|
    | <www.contoso.com> | CNAME | contoso.azurefd.net |

   - Source: Enter your custom domain name (for example, www\.contoso.com).

   - Type: Enter *CNAME*.

   - Destination: Enter your default Front Door frontend host. It must be in the following format:_&lt;hostname&gt;_.azurefd.net. For example, contoso.azurefd.net.

4. Save your changes.

5. If you're previously created a temporary afdverify subdomain CNAME record, delete it. 

6. If you are using this custom domain in production for the first time, follow the steps for [Associate the custom domain with your Front Door](#associate-the-custom-domain-with-your-front-door) and [Verify the custom domain](#verify-the-custom-domain).

For example, the procedure for the GoDaddy domain registrar is as follows:

1. Sign in and select the custom domain you want to use.

2. In the Domains section, select **Manage All**, then select **DNS** | **Manage Zones**.

3. For **Domain Name**, enter your custom domain, then select **Search**.

4. From the **DNS Management** page, select **Add**, then select **CNAME** in the **Type** list.

5. Complete the fields of the CNAME entry:

    - Type: Leave *CNAME* selected.

    - Host: Enter the subdomain of your custom domain to use. For example, www or profile.

    - Points to: Enter the default host name of your Front Door. For example, contoso.azurefd.net. 

    - TTL: Leave *one Hour* selected.

6. Select **Save**.
 
    The CNAME entry is added to the DNS records table.

7. If you have an afdverify CNAME record, select the pencil icon next to it, then select the trash can icon.

8. Select **Delete** to delete the CNAME record.


## Clean up resources

In the preceding steps, you added a custom domain to a Front Door. If you no longer want to associate your Front Door with a custom domain, you can remove the custom domain by performing these steps:
 
1. In your Front Door designer, select the custom domain that you want to remove.

2. Click Delete from the context menu for the custom domain.  

   The custom domain is disassociated from your endpoint.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> - Create a CNAME DNS record.
> - Associate the custom domain with your Front Door.
> - Verify the custom domain.
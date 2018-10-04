---
title: Tutorial - Host your domain and subdomain in Azure DNS
description: This tutorial shows you how to configure Azure DNS to host your DNS zones.
services: dns
author: vhorne
manager: jeconnoc

ms.service: dns
ms.topic: tutorial
ms.date: 6/13/2018
ms.author: victorh
#Customer intent: As an experienced network administrator I want to configure Azure DNS, so I can host DNS zones.
---

# Tutorial: Host your domain in Azure DNS

You can use Azure DNS to host your DNS domain and manage your DNS records. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools, and billing as your other Azure services. 

Suppose you buy the domain contoso.net from a domain name registrar and then create a zone with the name contoso.net in Azure DNS. Because you're the owner of the domain, your registrar offers you the option to configure the name server (NS) records for your domain. The registrar stores the NS records in the .net parent zone. Internet users around the world are then directed to your domain in your Azure DNS zone when they're trying to resolve DNS records in contoso.net.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DNS zone
> * Retrieve a list of name servers
> * Delegate the domain
> * Verify that the delegation is working


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a DNS zone

1. Sign in to the Azure portal.
1. On the upper left, select **Create a resource** > **Networking** > **DNS zone** to open the **Create DNS zone** page.

   ![DNS zone](./media/dns-delegate-domain-azure-dns/openzone650.png)

1. On the **Create DNS zone** page, enter the following values, and then select **Create**:

   | **Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|[your domain name] |The domain name you bought. This tutorial uses contoso.net as an example.|
   |**Subscription**|[Your subscription]|Select a subscription to create the zone in.|
   |**Resource group**|**Create new:** contosoRG|Create a resource group. The resource group name must be unique within the subscription that you selected. |
   |**Location**|East US||

> [!NOTE]
> The location of the resource group has no impact on the DNS zone. The DNS zone location is always "global," and is not shown.

## Retrieve name servers

Before you can delegate your DNS zone to Azure DNS, you need to know the name servers for your zone. Azure DNS allocates name servers from a pool each time a zone is created.

1. With the DNS zone created, in the Azure portal **Favorites** pane, select **All resources**. On the **All resources** page, select your DNS zone. If the subscription that you selected already has several resources in it, you can type your domain name in the **Filter by name** box to easily access the application gateway. 

1. Retrieve the name servers from the DNS zone page. In this example, the zone contoso.net has been assigned name servers *ns1-01.azure-dns.com*, *ns2-01.azure-dns.net*, *ns3-01.azure-dns.org*, and *ns4-01.azure-dns.info*:

   ![List of name servers](./media/dns-delegate-domain-azure-dns/viewzonens500.png)

Azure DNS automatically creates authoritative NS records in your zone for the assigned name servers.


## Delegate the domain

Now that the DNS zone is created and you have the name servers, you need to update the parent domain with the Azure DNS name servers. Each registrar has its own DNS management tools to change the name server records for a domain. In the registrar's DNS management page, edit the NS records and replace the NS records with the Azure DNS name servers.

When you're delegating a domain to Azure DNS, you must use the name servers that Azure DNS provides. We recommend that you use all four name servers, regardless of the name of your domain. Domain delegation does not require a name server to use the same top-level domain as your domain.

> [!NOTE]
> When you copy each name server address, make sure you copy the trailing period at the end of the address. The trailing period indicates the end of a fully qualified domain name. Some registrars may append the period if the NS name doesn't have it at the end. But to be compliant with the DNS RFC, you should include the trailing period as you can't assume every registrar append it for you.

Delegations that use name servers in your own zone, sometimes called *vanity name servers*, are not currently supported in Azure DNS.

## Verify that the delegation is working

After you complete the delegation, you can verify that it is working by using a tool such as *nslookup* to query the Start of Authority (SOA) record for your zone. The SOA record is automatically created when the zone is created. You may need to wait 10 minutes or longer after you complete the delegation before you can successfully verify that it is working. It can take a while for changes to propagate through the DNS system.

You do not have to specify the Azure DNS name servers. If the delegation is set up correctly, the normal DNS resolution process finds the name servers automatically.

From a command prompt, type a nslookup command similar to following:

```
nslookup -type=SOA contoso.net
```

Here's an example response from the preceding command:

```
Server: ns1-04.azure-dns.com
Address: 208.76.47.4

contoso.net
primary name server = ns1-04.azure-dns.com
responsible mail addr = msnhst.microsoft.com
serial = 1
refresh = 900 (15 mins)
retry = 300 (5 mins)
expire = 604800 (7 days)
default TTL = 300 (5 mins)
```

## Clean up resources

You can keep the **contosoRG** resource group if you intend to do the next tutorial. Otherwise, delete the **contosoRG** resource group to delete the resources created in this tutorial. To do so, click the **contosoRG** resource group and then click **Delete resource group**. 

## Next steps

In this tutorial, you've created a DNS zone for your domain and delegated it to Azure DNS. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

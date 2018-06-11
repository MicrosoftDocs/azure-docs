---
title: Tutorial - Host your domain and subdomain in Azure DNS
description: This tutorial shows you how to change domain delegation and use Azure DNS name servers to provide domain hosting.
services: dns
author: KumudD
manager: jeconnoc

ms.service: dns
ms.topic: tutorial
ms.date: 6/11/2018
ms.author: kumud
#Customer intent: As an administrator, I want learn how to configure Azure DNS so I can resolve names in my own domain and sub-domains.
---

# Tutorial: Host your domain and subdomains in Azure DNS

You can use Azure DNS to host your DNS domain and manage your DNS records. Your domain must be delegated to Azure DNS from the parent domain so the queries for your domain reach Azure DNS. Keep in mind that Azure DNS isn't the domain registrar. This tutorial explains how to delegate your domain and subdomain to Azure DNS.

For domains that you buy from a registrar, your registrar offers the option to set up the name server (NS) records. NS records identify which DNS server is authoritative for a particular domain.

Recall that a dns zone contains all the entries (records) for a particular domain. You don't have to own a domain to create a DNS zone with that domain name in Azure DNS. However, you do need to own the domain to set up the delegation to Azure DNS with the registrar.

For example, suppose you buy the domain contoso.net and create a zone with the name contoso.net in Azure DNS. Because you're the owner of the domain, your registrar offers you the option to configure the NS records for your domain. The registrar stores these NS records in the .net parent zone. Users around the world are then directed to your domain in the Azure DNS zone when they're trying to resolve DNS records in contoso.net.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DNS zone
> * Retrieve a list of name servers
> * Delegate the domain
> * Verify that name resolution is working
> * Delegate subdomains

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a DNS zone

1. Sign in to the Azure portal.
1. On the **Hub** menu, select **New** > **Networking** > **DNS zone** to open the **Create DNS zone** page.

   ![DNS zone](./media/dns-delegate-domain-azure-dns/openzone650.png)

1. On the **Create DNS zone** page, enter the following values, and then select **Create**:

   | **Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|[your domain name] |The domain name you bought. This tutorial uses contoso.net as an example.|
   |**Subscription**|[Your subscription]|Select a subscription to create the application gateway in.|
   |**Resource group**|**Create new:** contosoRG|Create a resource group. The resource group name must be unique within the subscription that you selected. |
   |**Location**|East US||

> [!NOTE]
> The location of the resource group has no impact on the DNS zone. The DNS zone location is always "global," and is not shown.

## Retrieve name servers

Before you can delegate your DNS zone to Azure DNS, you need to know the name servers for your zone. Azure DNS allocates name servers from a pool each time a zone is created.

1. With the DNS zone created, in the Azure portal **Favorites** pane, select **All resources**. On the **All resources** page, select your DNS zone. If the subscription that you selected already has several resources in it, you can type your domain name in the **Filter by name** box to easily access the application gateway. 

1. Retrieve the name servers from the DNS zone page. In this example, the zone contoso.net has been assigned name servers ns1-01.azure-dns.com, ns2-01.azure-dns.net, ns3-01.azure-dns.org, and ns4-01.azure-dns.info:

   ![List of name servers](./media/dns-domain-delegation/viewzonens500.png)

Azure DNS automatically creates authoritative NS records in your zone for the assigned name servers.

The following examples provide the steps to retrieve the name servers for a zone in Azure DNS by using Azure PowerShell and Azure CLI.

### PowerShell

```powershell
# The record name "@" is used to refer to records at the top of the zone.
$zone = Get-AzureRmDnsZone -Name contoso.net -ResourceGroupName contosoRG
Get-AzureRmDnsRecordSet -Name "@" -RecordType NS -Zone $zone
```

The following example is the response:

```
Name              : @
ZoneName          : contoso.net
ResourceGroupName : contosorg
Ttl               : 172800
Etag              : 03bff8f1-9c60-4a9b-ad9d-ac97366ee4d5
RecordType        : NS
Records           : {ns1-07.azure-dns.com., ns2-07.azure-dns.net., ns3-07.azure-dns.org.,
                    ns4-07.azure-dns.info.}
Metadata          :
```

### Azure CLI

```azurecli
az network dns record-set list --resource-group contosoRG --zone-name contoso.net --type NS --name @
```

The following example is the response:

```json
{
  "etag": "03bff8f1-9c60-4a9b-ad9d-ac97366ee4d5",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contosoRG/providers/Microsoft.Network/dnszones/contoso.net/NS/@",
  "metadata": null,
  "name": "@",
  "nsRecords": [
    {
      "nsdname": "ns1-07.azure-dns.com."
    },
    {
      "nsdname": "ns2-07.azure-dns.net."
    },
    {
      "nsdname": "ns3-07.azure-dns.org."
    },
    {
      "nsdname": "ns4-07.azure-dns.info."
    }
  ],
  "resourceGroup": "contosoRG",
  "ttl": 172800,
  "type": "Microsoft.Network/dnszones/NS"
}
```

## Delegate the domain

Now that the DNS zone is created and you have the name servers, you need to update the parent domain with the Azure DNS name servers. Each registrar has its own DNS management tools to change the name server records for a domain. In the registrar's DNS management page, edit the NS records and replace the NS records with the Azure DNS name servers.

When you're delegating a domain to Azure DNS, you must use the name servers that Azure DNS provides. We recommend that you use all four name servers, regardless of the name of your domain. Domain delegation does not require a name server to use the same top-level domain as your domain.

Delegations that use name servers in your own zone, sometimes called *vanity name servers*, are not currently supported in Azure DNS.

## Verify that name resolution is working

After you complete the delegation, you can verify that name resolution is working by using a tool such as nslookup to query the Start of Authority (SOA) record for your zone. (The SOA record is automatically created when the zone is created.)

You do not have to specify the Azure DNS name servers. If the delegation is set up correctly, the normal DNS resolution process finds the name servers automatically.

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

## Delegate subdomains in Azure DNS

If you want to set up a separate child zone, you can delegate a subdomain in Azure DNS. 

For example, suppose that you set up and delegated contoso.net in Azure DNS. You now want to set up a separate child zone, partners.contoso.net. In the following example, substitute your own domain name for contoso.net.

### Create a DNS zone

1. Sign in to the Azure portal.
1. On the **Hub** menu, select **New** > **Networking** > **DNS zone** to open the **Create DNS zone** page.

1. On the **Create DNS zone** page, enter the following values, and then select **Create**:

   | **Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|partners.contoso.net|Provide the name of the DNS zone.|
   |**Subscription**|[Your subscription]|Select a subscription to create the application gateway in.|
   |**Resource group**|**Use Existing:** contosoRG|Use the existing resource group you created previously.|
   |**Location**|East US||


### Retrieve name servers

1. With the DNS zone created, in the Azure portal **Favorites** pane, select **All resources**. Select the **partners.contoso.net** DNS zone on the **All resources** page. If the subscription that you selected already has several resources in it, you can enter **partners.contoso.net** in the **Filter by name** box to easily access the DNS zone.

1. Retrieve the name servers from the DNS zone page. In this example, the zone contoso.net has been assigned name servers ns1-01.azure-dns.com, ns2-01.azure-dns.net, ns3-01.azure-dns.org, and ns4-01.azure-dns.info:

   ![List of name servers](./media/dns-domain-delegation/viewzonens500.png)

Azure DNS automatically creates authoritative NS records in your zone for the assigned name servers. You can also use Azure PowerShell or Azure CLI to retrieve these name servers as shown previously.

### Create a name server record in the parent zone

1. In the Azure portal, browse to the **contoso.net** DNS zone.
1. Select **+ Record set**.
1. On the **Add record set** page, enter the following values, and then select **OK**:

   | **Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|partners|Enter the name of the child DNS zone.|
   |**Type**|NS|Use NS for name server records.|
   |**TTL**|1|Enter the time to live.|
   |**TTL unit**|Hours|Set the time-to-live unit to hours.|
   |**NAME SERVER**|{name servers from partners.contoso.net zone}|Type all four of the name servers from the partners.contoso.net zone. |

   ![Values for the name server record](./media/dns-domain-delegation/partnerzone.png)

## Clean up resources

When no longer needed, delete the **contosoRG** resource group to delete the resources created in this tutorial. To do so, click the **contosoRG** resource group and then click **Delete resource group**. 

## Next steps

In this tutorial, you've delegated a domain and subdomain to Azure DNS. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

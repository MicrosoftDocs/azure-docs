<properties
   pageTitle="How to create a DNS zone in the Azure portal | Microsoft Azure"
   description="Learn how to create DNS zones for Azure DNS. This is a Step-by-step guide to create your first DNS and start hosting your DNS domain using the Azure portal."
   services="dns"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/21/2016"
   ms.author="cherylmc"/>

# Create a DNS zone in the Azure portal


> [AZURE.SELECTOR]
- [Azure Portal](dns-getstarted-create-dnszone-portal.md)
- [PowerShell](dns-getstarted-create-dnszone.md)
- [Azure CLI](dns-getstarted-create-dnszone-cli.md)



This article will walk you thorough the steps to create a DNS zone by using the Azure portal. You can also create a DNS zone using PowerShell or CLI. The links to the article are at the top of this page.

The domain ‘contoso.com’ may contain a number of DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site).  A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain you will first create a DNS zone. Any DNS record created for a particular domain will be inside a DNS zone for the domain.


## To create a DNS zone

1. Sign in to the Azure portal
2. On the Hub menu, click  and click** New > Networking >** and then click ** DNS zone** to open the DNS zone blade. 
3. On the **DNS zone** blade, click **Create** at the bottom. This will open the **Create DNS zone** blade.
4. On the **Create DNS zone** blade, Name your DNS zone. For example, *contoso.com*. 
5. Next, specify the resource group that you want to use. You can either create a new resource group, or select one that already exists. 
6. From the location dropdown, specify the location.
7. You can leave the **Pin to dashboard** checkbox selected if you want to easily locate your new zone on your dashboard. Then click **Create**.
8. After you click Create, you'll see your new zone being configured on the dashboard.



## To view your DNS zone using the portal

Creating a DNS zone also creates the following DNS records:

- The ‘Start of Authority’ (SOA) record.  This is present at the root of every DNS zone.
- The authoritative name server (NS) records.  These show which name servers are hosting the zone.  Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS.  See [delegate a domain to Azure DNS](dns-domain-delegation.md) for more information.

You can view these records in on the blade for your DNS zone in the Azure portal. From your DNS zone blade, you can click on All settings to open the Settings blade for the DNS zone. If a zone is not available for you to use, you will see a "Failed" result and the details for the reason of failure in the Operations details window.

You can also use the `Get-AzureRmDnsRecordSet` PowerShell cmdlet to view the records.

## To test your DNS zone by using DNS tools

You can test your DNS zone by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).<BR>



## To delegate your domain to use the new zone in Azure DNS

If you haven’t yet delegated your domain to use the new zone in Azure DNS, you will need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as listed by Get-AzureRmDnsRecordSet above—be sure the substitute the correct values for your zone into the command below.<BR>

		C:\> nslookup
		> set type=SOA
		> server ns1-01.azure-dns.com
		> contoso.com

		Server: ns1-01.azure-dns.com
		Address:  208.76.47.1

		contoso.com
        		primary name server = ns1-01.azure-dns.com
        		responsible mail addr = msnhst.microsoft.com
        		serial  = 1
        		refresh = 900 (15 mins)
        		retry   = 300 (5 mins)
        		expire  = 604800 (7 days)
        		default TTL = 300 (5 mins)

## To delete a DNS zone in the portal

You can delete the DNS zone directly from the portal. Local the DNS zone blade for the zone you want to delete, then click Delete. Note that when deleting a DNS zone from the portal, the Resource Group that the DNS zone is associated with will not be deleted.


## About Etags and Tags for Azure DNS

### Etags

Suppose two people or two processes try to modify a DNS record at the same time.  Which one wins?  And does the winner know that they’ve just overwritten changes created by someone else?

Azure DNS uses Etags to handle concurrent changes to the same resource safely. Each DNS resource (zone or record set) has an Etag associated with it.  Whenever a resource is retrieved, its Etag is also retrieved. When updating a resource, you have the option to pass back the Etag so Azure DNS can verify that the Etag on the server matches. Since each update to a resource results in the Etag being re-generated, an Etag mismatch indicates a concurrent change has occurred. Etags are also used when creating a new resource to ensure that the resource does not already exist.

By default, Azure DNS PowerShell uses Etags to block concurrent changes to zones and record sets. The optional ‘-Overwrite’ switch can be used to suppress Etag checks, in which case any concurrent changes that have occurred will be overwritten.

At the level of the Azure DNS REST API, Etags are specified using HTTP headers. The following table shows the behavior:

|Header|Behavior|
|------|--------|
|None|PUT always succeeds (no Etag checks)|
|If-match <etag>|PUT only succeeds if resource exists and Etag matches|
|If-match *	|PUT only succeeds if resources exists|
|If-none-match |*	PUT only succeeds if resource does not exist|

### Tags

Tags are different than Etags. Tags are a list of name-value pairs and are used by Azure Resource Manager to label resources for billing or grouping purposes. For more information about Tags, see the article [Using tags to organize your Azure resources](../resource-group-using-tags.md).
Azure DNS PowerShell supports Tags on both zones and record sets specified using the options ‘-Tag’ parameter. The following example shows how to create a DNS zone with two tags, ‘project = demo’ and ‘env = test’:

	PS C:\> New-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup -Tag @( @{ Name="project"; Value="demo" }, @{ Name="env"; Value="test" } )

You can also add Tags in the Azure portal by using the Settings pane for your DNS zone.


## Next steps

After creating your DNS zone, see [Get started creating record sets and records](dns-getstarted-create-recordset.md), [How to manage DNS zones](dns-operations-dnszones.md), and [How to manage DNS records](dns-operations-recordsets.md).
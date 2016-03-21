<properties
   pageTitle="Get started with Azure DNS and the Azure portal | Microsoft Azure"
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

# Get started with Azure DNS using Powershell


> [AZURE.SELECTOR]
- [Azure Portal](dns-getstarted-create-dnszone-portal.md)
- [PowerShell](dns-getstarted-create-dnszone.md)
- [Azure CLI](dns-getstarted-create-dnszone-cli.md)

The domain ‘contoso.com’ may contain a number of DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site).  A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain we need to first create a DNS zone. Any DNS record created for a particular domain will be inside a DNS zone for the domain.

This article will walk you thorough the steps using the Azure portal. You can also create a DNS zone using PowerShell or CLI. The links to the article are at the top of this page.

## To create a DNS zone

1. Log in to the Azure portal and click New, and then type DNS in the search window on the New blade. On the search results, click DNS zone. The Everything blade will open.
2. On the Everything blade, click DNS zone in the results pane to open the DNS zone blade.
3. On the DNS zone blade, click Create at the bottom. This will open the Create DNS zone blade.
4. On the Create DNS zone blade, Name your DNS zone. For example, *contoso.com*. 
5. Next, specify the Resource Group that you want to use. You can either create a new resource group, or select one that already exists. 
6. From the location dropdown, specify the location.
7. You can leave the "Pin to dashboard" checkbox selected if you want to easily locate your new zone on your dashboard. Then click Create.
8. After you click Create, you'll see your new zone being configured on the dashboard.

Your DNS zone has now been created in Azure DNS.  Creating a DNS zone also creates the following DNS records:<BR>

- The ‘Start of Authority’ (SOA) record.  This is present at the root of every DNS zone.
- The authoritative name server (NS) records.  These show which name servers are hosting the zone.  Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS.  See [delegate a domain to Azure DNS](dns-domain-delegation.md) for more information.<BR>

To view these records, use Get-AzureRmDnsRecordSet:

	PS C:\> Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

	Name              : @
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 3600
	Etag              : 2b855de1-5c7e-4038-bfff-3a9e55b49caf
	RecordType        : SOA
	Records           : {[ns1-01.azure-dns.com,msnhst.microsoft.com,900,300,604800,300]}
	Tags              : {}

	Name              : @
	ZoneName          : contoso.com
	ResourceGroupName : MyResourceGroup
	Ttl               : 3600
	Etag              : 5fe92e48-cc76-4912-a78c-7652d362ca18
	RecordType        : NS
	Records           : {ns1-01.azure-dns.com, ns2-01.azure-dns.net, ns3-01.azure-dns.org,
                  ns4-01.azure-dns.info}
	Tags              : {}

>[AZURE.NOTE] Record sets at the root (or ‘apex’) of a DNS Zone use "@" as the record set name.

## How to verify your DNS zone

### To verify by using the Azure portal

In the blade for your DNS zone, you can see the status.

- When the zone is created, it will automatically open the blade for the new zone in the portal. From that blade, you can view the details of your zone. From your DNS zone blade, you can click on All settings to open the Settings blade for the DNS zone.

- If a zone is not available for you to use, you will see a "Failed" result and the details for the reason of failure in the Operations details window.

### To test your DNS zone by using DNS tools

You can test your DNS zone by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).<BR>

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

## Understanding Etags and Tags

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
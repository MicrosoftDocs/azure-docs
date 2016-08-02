<properties
   pageTitle="Get started with Azure DNS | Microsoft Azure"
   description="Learn how to create DNS zones for Azure DNS .This is a Step by step to get your first DNS zone created to start hosting your DNS domain using PowerShell."
   services="dns"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/09/2016"
   ms.author="cherylmc"/>

# Create a DNS zone using Powershell

> [AZURE.SELECTOR]
- [Azure Portal](dns-getstarted-create-dnszone-portal.md)
- [PowerShell](dns-getstarted-create-dnszone.md)
- [Azure CLI](dns-getstarted-create-dnszone-cli.md)

This article will walk you through the steps to create a DNS zone by using CLI. You can also create a DNS zone using PowerShell or the Azure portal. 

[AZURE.INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)] 

## <a name="tagetag"></a>About Etags and tags

### <a name="etags"></a>Etags

Suppose two people or two processes try to modify a DNS record at the same time. Which one wins? And does the winner know that they’ve just overwritten changes created by someone else?

Azure DNS uses Etags to handle concurrent changes to the same resource safely. Each DNS resource (zone or record set) has an Etag associated with it.  Whenever a resource is retrieved, its Etag is also retrieved. When updating a resource, you have the option to pass back the Etag so Azure DNS can verify that the Etag on the server matches. Since each update to a resource results in the Etag being re-generated, an Etag mismatch indicates a concurrent change has occurred. Etags are also used when creating a new resource to ensure that the resource does not already exist.

By default, Azure DNS PowerShell uses Etags to block concurrent changes to zones and record sets. The optional *-Overwrite* switch can be used to suppress Etag checks, in which case any concurrent changes that have occurred will be overwritten.

At the level of the Azure DNS REST API, Etags are specified using HTTP headers.  Their behavior is given in the following table:

|Header|Behavior|
|------|--------|
|None|PUT always succeeds (no Etag checks)|
|If-match <etag>|PUT only succeeds if resource exists and Etag matches|
|If-match * 	| PUT only succeeds if resource exists|
|If-none-match * |	PUT only succeeds if resource does not exist|

### <a name="tags"></a>Tags

Tags are different from Etags. Tags are a list of name-value pairs and are used by Azure Resource Manager to label resources for billing or grouping purposes. For more information about tags, see [Using tags to organize your Azure resources](../resource-group-using-tags.md).

Azure DNS PowerShell supports Tags on both zones and record sets specified using the options `-Tag` parameter.


## Before you begin

Verify that you have the following items before beginning your configuration.
	
- An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
	
- You'll need to install the latest version of the Azure Resource Manager PowerShell cmdlets (1.0 or later). See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.

## Step 1 - Sign in

Open your PowerShell console and connect to your account. For more information, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

Use the following sample to help you connect:

	Login-AzureRmAccount

Check the subscriptions for the account.

	Get-AzureRmSubscription 

Specify the subscription that you want to use.

	Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

## Step 2 - Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group. 

	New-AzureRmResourceGroup -Name MyAzureResourceGroup -location "West US"


## Step 3 - Register

The Azure DNS service is managed by the Microsoft.Network resource provider. Your Azure subscription needs to be registered to use this resource provider before you can use Azure DNS. This is a one-time operation for each subscription.

	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network


## Step 4 -  Create a DNS zone

A DNS zone is created by using the `New-AzureRmDnsZone` cmdlet. There are examples below for creating a DNS zone with or without tags. For more information about tags, see the section on [tags](#tags) in this article.

>[AZURE.NOTE] In Azure DNS, zone names should be specified without a terminating **‘.’**. For example, as '**contoso.com**' rather than '**contoso.com.**'.

### To create a DNS zone

The example below creats a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

	New-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup

### To create a DNS zone with tags

The following example shows how to create a DNS zone with two tags, *project = demo* and *env = test*. Use the example to create a DNS zone, substituting the values for your own.

	New-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup -Tag @( @{ Name="project"; Value="demo" }, @{ Name="env"; Value="test" } )

## View records

Creating a DNS zone also creates the following DNS records:

- The *Start of Authority* (SOA) record. This is present at the root of every DNS zone.

- The authoritative name server (NS) records. These show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS. See [delegate a domain to Azure DNS](dns-domain-delegation.md) for more information. 

To view these records, use `Get-AzureRmDnsRecordSet`:

	Get-AzureRmDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup

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


Record sets at the root (or *apex*) of a DNS Zone use **@** as the record set name.


## Test

You can test your DNS zone by using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/library/jj590781.aspx).

If you haven’t yet delegated your domain to use the new zone in Azure DNS, you will need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as listed by `Get-AzureRmDnsRecordSet` above. Be sure the substitute the correct values for your zone into the command below.

	nslookup
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


## Next steps

After creating a DNS zone, create [record sets and records](dns-getstarted-create-recordset.md) to start resolving names for your Internet domain.


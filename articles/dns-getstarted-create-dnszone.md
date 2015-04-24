<properties 
   pageTitle="Get started with Azure DNS" 
   description="configure powershell and Dns zone for Azure DNS" 
   services="virtual-network" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="adinah" 
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="en-us"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/23/2015"
   ms.author="joaoma"/>

#Get Started With Azure DNS
The domain ‘contoso.com’ may contain a number of DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site).  A DNS zone is used to host the DNS records for a particular domain.<BR><BR>
To start hosting your domain we need to first create a DNS zone. Any DNS record created for a particular domain will be inside a DNS zone for the domain.<BR><BR>
These instructions use Microsoft Azure PowerShell.  Be sure to update to the latest Azure PowerShell to use the Azure DNS cmdlets. The same steps can also be executed using the Microsoft Azure Command Line Interface, REST API or SDK.<BR><BR>
  
##Set up Azure DNS PowerShell

The following steps need to be completed before you can manage Azure DNS using Azure PowerShell.

1. Azure DNS uses Azure Resource Manager (ARM). Make sure you switch PowerShell mode to use the ARM cmdlets. More info is available at Using Windows Powershell with Resource Manager.<BR><BR>

		PS C:\> Switch-AzureMode -Name AzureResourceManager
2. Log in to your Azure account.<BR><BR>
			
		PS C:\> Add-AzureAccount

You will be prompted to Authenticate with your credentials.<BR>

3. Choose which of your Azure subscriptions to use. <BR>


		PS C:\> Select-AzureSubscription -SubscriptionName "MySubscription"

To see a list of available subscriptions, use the ‘Get-AzureSubscription’ cmdlet.<BR>

4. Create a new resource group (skip this step if using an existing resource group)<BR>

		PS C:\> New-AzureResourceGroup -Name MyAzureResourceGroup -location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, since all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.<BR>

5. The Azure DNS service is managed by the Microsoft.Network resource provider.  Your Azure subscription needs to be registered to use this resource provider before you can use Azure DNS.  This is a one-time operation for each subscription.<BR>

		PS C:\> Register-AzureProvider –ProviderNamespace Microsoft.Network

##Etags and Tags
###Etags
Suppose two people or two processes try to modify a DNS record at the same time.  Which one wins?  And does the winner know that they’ve just overwritten changes created by someone else?<BR><BR>
Azure DNS uses Etags to handle concurrent changes to the same resource safely. Each DNS resource (zone or record set) has an Etag associated with it.  Whenever a resource is retrieved, its Etag is also retrieved.  When updating a resource, you have the option to pass back the Etag so Azure DNS can verify that the Etag on the server matches.  Since each update to a resource results in the Etag being re-generated, an Etag mismatch indicates a concurrent change has occurred.  Etags are also used when creating a new resource to ensure that the resource does not already exist.<BR><BR>
By default, Azure DNS PowerShell uses Etags to block concurrent changes to zones and record sets.  The optional ‘-Overwrite’ switch can be used to suppress Etag checks, in which case any concurrent changes that have occurred will be overwritten.<BR><BR>
At the level of the Azure DNS REST API, Etags are specified using HTTP headers.  Their behavior is given in the following table:
|Header|Behavior|
|------|--------|
|None|PUT always succeeds (no Etag checks)|
|If-match <etag>|PUT only succeeds if resource exists and Etag matches|
|If-match *	|PUT only succeeds if resources exists|
|If-none-match |*	PUT only succeeds if resource does not exist|

##Create a DNS zone
A DNS zone is created using the New-AzureDnsZone cmdlet. In the example below we will create a DNS zone called 'contoso.com' in the resource group called 'MyResourceGroup':<BR>

		PS C:\> New-AzureDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGRoup

>[AZURE.NOTE]: In Azure DNS, zone names should be specified without a terminating ‘.’.  For example, as ‘contoso.com’ rather than ‘contoso.com.’.<BR>


Your DNS zone has now been created in Azure DNS.  Creating a DNS zone also creates the following DNS records:<BR>



- The ‘Start of Authority’ (SOA) record.  This is present at the root of every DNS zone.
- The authoritative name server (NS) records.  These show which name servers are hosting the zone.  Azure DNS uses a pool of name servers, and so different name servers may be assigned to different zones in Azure DNS.  See [delegate a domain to Azure DNS](./dns-domain-delegation.md)for more information.<BR>

To view these records, use Get-AzureDnsRecordSet:

		PS C:\> Get-AzureDnsRecordSet -ZoneName contoso.com -ResourceGroupName MyAzureResourceGroup 

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

>[AZURE.NOTE] record sets at the root (or ‘apex’) of a DNS Zone use "@" as the record set name.


Having created your first DNS zone, you can test it using DNS tools such as nslookup, dig, or the [Resolve-DnsName PowerShell cmdlet](https://technet.microsoft.com/en-us/library/jj590781.aspx).<BR>

If you haven’t yet delegated your domain to use the new zone in Azure DNS, you will need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as listed by Get-AzureDnsRecordSet above—be sure the substitute the correct values for your zone into the command below.<BR>

		C:\> nslookup –type=SOA contoso.com ns1-01.azure-dns.com

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


##See Also


[Get started creating record sets and records](./dns-getstarted-create-record.md)<BR>
[Perform operations on DNS zones](./dns-operations-dnszones.md)<BR>
[Perform operations on DNS records](./dns-operations-recordsets.md)
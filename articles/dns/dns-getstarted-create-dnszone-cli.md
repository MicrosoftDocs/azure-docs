<properties
   pageTitle="Get started with Azure DNS using CLI| Microsoft Azure"
   description="Learn how to create DNS zones for Azure DNS step-by-step to start hosting your DNS domain using CLI"
   services="dns"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/09/2016"
   ms.author="joaoma"/>

# Get started with Azure DNS using CLI


> [AZURE.SELECTOR]
- [Azure CLI](dns-getstarted-create-dnszone-cli.md)
- [PowerShell](dns-getstarted-create-dnszone.md)


The domain ‘contoso.com’ can contain a number of DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a website). A DNS zone is used to host the DNS records for a particular domain.

To start hosting your domain, you first need to create a DNS zone. Any DNS record created for a particular domain will be inside a DNS zone for the domain.

These instructions use Microsoft Azure CLI. Be sure to update to the latest Azure CLI to use the Azure DNS commands.

## Set up Azure CLI

### Step 1

Install Azure CLI. You can install Azure CLI for Windows, Linux, or MAC. The following steps need to be completed before you can manage Azure DNS using Azure CLI. More information is available at [Install the Azure CLI](../xplat-cli-install.md). All the network provider commands on CLI can be found using the following command:

	Azure network


>[AZURE.IMPORTANT] The DNS commands require Azure CLI version 0.9.8 or above. Type `azure -v`to check which Azure CLI version is currently installed in your machine.
 
### Step 2

Azure DNS uses Azure Resource Manager. Make sure you switch CLI to use arm commands and DNS.

	Azure config mode arm

### Step 3

Sign in to your Azure account.

    Azure login -u "username"

You will be prompted to authenticate with your credentials. Keep in mind that you can only use ORGID accounts.

### Step 4
Choose which of your Azure subscriptions to use.

    Azure account set "subscription name"

To see a list of available subscriptions, use the "azure account list" command.

### Step 5

Create a new resource group (skip this step if using an existing resource group)

    Azure group create -n myresourcegroup --location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

### Step 6

The Azure DNS service is managed by the Microsoft.Network resource provider. Your Azure subscription needs to be registered to use this resource provider before you can use Azure DNS. This is a one-time operation for each subscription.

	Azure provider register --namespace Microsoft.Network

## Tags

Tags are different from Etags. Tags are a list of name-value pairs, and are used by Azure Resource Manager to label resources for billing or grouping purposes. For more information about tags, see [Using tags to organize your Azure resources](resource-group-using-tags.md). Azure DNS CLI supports tags on both zones and record sets specified by using the options ‘-Tag’ parameter. The following example shows how to create a DNS zone with two tags, ‘project = demo’ and ‘env = test’:

	Azure network dns zone create -n contoso.com -g myresourcegroup -t "project=demo";"env=test"

## Create a DNS zone

A DNS zone is created using the `azure network dns zone create` command. In the example below, you create a DNS zone called 'contoso.com' in the resource group called 'MyResourceGroup':

    Azure network dns zone create -n contoso.com -g myresourcegroup


>[AZURE.NOTE] In Azure DNS, zone names should be specified without a terminating ‘.’, for example, as ‘contoso.com’ rather than ‘contoso.com.’.


Your DNS zone has now been created in Azure DNS. Creating a DNS zone also creates the following DNS records:

- The ‘Start of Authority’ (SOA) record. This is present at the root of every DNS zone.
- The authoritative name server (NS) records. These show which name servers are hosting the zone. Azure DNS uses a pool of name servers, and so different name servers can be assigned to different zones in Azure DNS. See [Delegate a domain to Azure DNS](dns-domain-delegation.md) for more information.

To view these records, use "azure network dns-record-set show":

	Usage: network dns record-set show <resource-group> <dns-zone-name> <name> <type>


In the example below, running the command with resource group "myresourcegroup", record set name "@" (for a root record) and type "SOA" will yield the following output:
 

	azure network dns record-set show myresourcegroup "contoso.com" "@" SOA
	info:    Executing command network dns-record-set show
	+ Looking up the DNS record set "@"
	data:    Id                              : /subscriptions/#######################/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/SOA/@
	data:    Name                            : @
	data:    Type                            : Microsoft.Network/dnszones/SOA
	data:    Location                        : global
	data:    TTL                             : 3600
	data:    SOA record:
	data:      Email                         : msnhst.microsoft.com
	data:      Expire time                   : 604800
	data:      Host                          : edge1.azuredns-cloud.net
	data:      Minimum TTL                   : 300
	data:      Refresh time                  : 900
	data:      Retry time                    : 300
	data:                                    :
<BR>
To view the NS records created, use the following command:

	azure network dns record-set show myresourcegroup "contoso.com" "@" NS
	info:    Executing command network dns-record-set show
	+ Looking up the DNS record set "@"
	data:    Id                              : /subscriptions/#######################/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/NS/@
	data:    Name                            : @
	data:    Type                            : Microsoft.Network/dnszones/NS
	data:    Location                        : global
	data:    TTL                             : 3600
	data:    NS records
	data:        Name server domain name     : ns1-05.azure-dns.com
	data:        Name server domain name     : ns2-05.azure-dns.net
	data:        Name server domain name     : ns3-05.azure-dns.org
	data:        Name server domain name     : ns4-05.azure-dns.info
	data:
	info:    network dns-record-set show command OK

>[AZURE.NOTE] Record sets at the root (or ‘apex’) of a DNS zone use "@" as the record set name.

Having created your first DNS zone, you can test it by using DNS tools such as nslookup, DIG, or the **Resolve-DnsName** PowerShell cmdlet.
If you haven’t yet delegated your domain to use the new zone in Azure DNS, you need to direct the DNS query directly to one of the name servers for your zone. The name servers for your zone are given in the NS records, as listed by "azure network dns-record-set show" above. Be sure the substitute the correct values for your zone in the command below.

The following example uses DIG to query the domain contoso.com using the name servers assigned for the DNS zone. The query has to point to a name server for which we used `@<name server for the zone>` and zone name using DIG.

	 <<>> DiG 9.10.2-P2 <<>> @ns1-05.azure-dns.com contoso.com
	(1 server found)
	global options: +cmd
 	Got answer:
	->>HEADER<<- opcode: QUERY, status: NOERROR, id: 60963
 	flags: qr aa rd; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1
 	WARNING: recursion requested but not available

 	OPT PSEUDOSECTION:
 	EDNS: version: 0, flags:; udp: 4000
  	QUESTION SECTION:
	contoso.com.                        IN      A

 	AUTHORITY SECTION:
	contoso.com.         300     IN      SOA     edge1.azuredns-cloud.net.
	msnhst.microsoft.com. 6 900 300 604800 300

	Query time: 93 msec
	SERVER: 208.76.47.5#53(208.76.47.5)
	WHEN: Tue Jul 21 16:04:51 Pacific Daylight Time 2015
	MSG SIZE  rcvd: 120

## Next Steps

After create a DNS zone, you need to create [record sets and records](dns-getstarted-create-recordset-cli.md) to start resolving names for your Internet domain.<BR>
You can also learn [how to manage DNS zones](dns-operations-dnszones-cli.md) and its DNS zone operations.<BR>
Learn [how to manage DNS records](dns-operations-recordsets-cli.md) and 
[automate Azure operations with .NET SDK](dns-sdk.md)<BR>
[Azure DNS REST API Reference.](https://msdn.microsoft.com/library/azure/mt163862.aspx)
<properties
   pageTitle="Import and export a domain zone file with Azure DNS | Microsoft Azure"
   description="Learn how to import and export a DNS zone file to Azure DNS by using Azure CLI"
   services="dns"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/11/2016"
   ms.author="jonatul"/>

# Import and export a DNS zone file


This guide will show how to import and export DNS zone files to and from Azure DNS.

## Introduction to DNS zone migration

A DNS zone file is a text file that contains details of every DNS record in the zone.  It follows a standard format, making it suitable for transferring DNS records between different DNS systems.  Using a zone file is a quick, reliable and convenient way to transfer a DNS zone into or out of Azure DNS.  

Azure DNS supports zone file import and export via the Azure CLI.  This article explains how to use this feature.

The Azure CLI is a cross-platform command line tool used for managing Azure services.  It is available for Windows, Mac and Linux platforms from the Azure downloads page.  This cross-platform support is particularly important for zone file import and export since the most common name server software, [BIND](https://www.isc.org/downloads/bind/), typically runs on Linux.

## Obtaining your existing DNS zone file

Before importing your DNS zone file into Azure DNS, you will need to obtain a copy of the zone file.  The source of this file will depend on where the DNS zone is currently hosted.  For example:

- If your DNS zone is hosted by a third-party service (such as a domain registrar, dedicated DNS hoster, or alternative cloud provider), that service should provide the ability to download the DNS zone file.
-	If your DNS zone is hosted using Windows DNS server, by default the zone files can be found in the **'%systemroot%\system32\dns'** folder.  The full path to each zone file is also shown on the ‘General’ tab of the DNS service management console.
-	If your DNS zone is hosted using BIND, the location of the zone file for each zone is specified in the BIND configuration file **‘named.conf’**. 

>[AZURE.NOTE] Zone files downloaded from ‘GoDaddy’ have a slightly non-standard format, which needs to be corrected before importing those zone files into Azure DNS.  Specifically, DNS names in the RDATA of each DNS record are specified as fully-qualified names, but without a terminating ‘.’, which means they are interpreted by other DNS systems as relative names.  You will need to edit the zone file to append the terminating ‘.’ to these names before importing them into Azure DNS.

## Importing a DNS zone file into Azure DNS

The format of the Azure CLI command to import a DNS zone is as follows:
`azure network dns zone import [options] <resource group> <zone name> <zone file name>`
where:

- **<resource group>** - is the name of the resource group for the zone in Azure DNS.
- **<zone name>** - is the name of the zone.
- **<zone file name>** - is the path/name of the zone file to be imported.

If a zone with this name does not exist in the resource group, it will be created for you.  If the zone already exists, the imported record sets will be merged with existing record sets.  To overwrite the existing record sets instead, use the ‘--force' option.  Further details on [how record sets are merged](#merging-with-existing-data) are given below.

To verify the format of a zone file without actually importing it, use the ‘--parse-only’ option.

## Step by Step to import a zone file to Azure DNS

Let’s see an example.  Suppose you want to import a zone file for the zone ‘contoso.com’. 

### Step 1
Login to your Azure subscription using Azure CLI.

	azure login

### Step 2
Select the subscription where you want to create your new DNS zone.

	azure account set <subscription name>

### Step 3
Azure DNS is an Azure Resource Manager (ARM) -only service,  Azure CLI must be switched to ARM mode.

	azure config mode arm

### Step 4
Before using the Azure DNS service, you must register your subscription to use the Microsoft.Network resource provider (this is a one-time-only operation for each subscription).

	azure provider register Microsoft.Network

### Step 5 
If you don’t have one already, you also need to create an ARM resource group.
	
	azure group create myresourcegroup westeurope

### Step 6	
To import the zone ‘contoso.com’ from the file ‘contoso.com.txt’ into a new DNS zone in the resource group ‘myresourcegroup’, run the command `azure network dns zone import`.

	azure network dns zone import myresourcegroup contoso.com contoso.com.txt

This command will load the zone file, parse it, and execute a series of commands on the Azure DNS service to create the zone and all the record sets in the zone. 

It will report progress in the console window, as well as any errors or warnings.  Since record sets are created in series, it may take a few minutes to import a large zone file.

## Verify the DNS zone after import

You can list the records using the following Azure CLI command (you can also do this via PowerShell, using `Get-AzureRmDnsRecordSet`).

	azure network dns record-set list myresourcegroup contoso.com

You can also use ‘nlookup’ to verify name resolution for the records.  Since the zone isn’t delegated yet you will need to specify the correct Azure DNS name servers explicitly.  The sample below shows how to retrieve the name server names assigned to the zone, and query the ‘www’ record using ‘nslookup’:

	C:\>azure network dns record-set show myresourcegroup contoso.com @ NS
	info:    Executing command network dns record-set show
	+ Looking up the DNS Record Set "@" of type "NS"
	data:    Id: /subscriptions/…/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/NS/@
	data:    Name                            : @
	data:    Type                            : Microsoft.Network/dnszones/NS
	data:    Location                        : global
	data:    TTL                             : 3600
	data:    NS records
	data:        Name server domain name     : ns1-01.azure-dns.com
	data:        Name server domain name     : ns2-01.azure-dns.net
	data:        Name server domain name     : ns3-01.azure-dns.org
	data:        Name server domain name     : ns4-01.azure-dns.info
	data:
	info:    network dns record-set show command OK

	C:\> nslookup www.contoso.com ns1-01.azure-dns.com

	Server: ns1-01.azure-dns.com
	Address:  40.90.4.1

	Name:    www.contoso.com
	Addresses:  134.170.185.46
            134.170.188.221

Once you have verified the zone has been imported correctly, you will need to [update the DNS delegation](dns-domain-delegation.md) to point to the Azure DNS name servers.

## Merging with existing data

Importing a zone file will create a new zone in Azure DNS if one does not already exist.  If the zone already exists, the record sets in the zone file must be merged with the existing record sets.  The merge behavior is as follows:

1.	By default, existing and new record sets are merged.  Identical records within a merged record set are de-duplicated.
2.	Alternatively, by specifying the '--force' option, the import process will replace existing record sets with new record sets.  Existing record sets that do not have a corresponding record set in the imported zone file will not be removed.
3.	Where record sets are merged, the TTL of pre-existing record sets is used.  Where '--force' is used, the TTL of the new record set is used.
4.	SOA parameters (except ‘host’) are always taken from the imported zone file, regardless of use of '--force'.  Similarly, for the NS record set at the zone apex the TTL is always taken from the imported zone file.
5.	An imported CNAME record will not replace an existing CNAME record with the same name, unless the '--force' parameter is specified.
6.	When a conflict arises between a CNAME record and another record of the same name but different type (regardless of which is existing vs new), the existing record is retained. This is independent of the use of '--force'.

## Additional technical details
The follow notes provide additional technical details about the zone import process:
1.	The $TTL directive is optional, and is supported.  Where no $TTL directive is given, records without an explicit TTL will be imported using a default TTL of 3600 seconds.  Where two records in the same record set specify different TTLs, the lower value is used.
2.	The $ORIGIN directive is optional, and is supported. Where no $ORIGIN is set, the default value used is the zone name as specified on the command line (plus terminating ‘.’).
3.	The $INCLUDE and $GENERATE directives are not supported.
4.	The following record types are supported: A, AAAA, CNAME, MX, NS, SOA, SRV and TXT.  
5.	The SOA record is created automatically by Azure DNS when a zone is created.  When importing a zone file, all SOA parameters are taken from the zone file EXCEPT the ‘host’ parameter, which uses the value provided by Azure DNS.  This is because this parameter must refer to the primary name server provided by Azure DNS.
6.	The NS record set at the zone apex is also created automatically by Azure DNS when the zone is created.  Only the TTL of this record set is imported.  These records contain the name server names provided by Azure DNS, and hence the record data is not overwritten by the values contained in the imported zone file.
7.	During the Public Preview, Azure DNS only supports single-string TXT records, thus multi-string TXT records will be concatenated and truncated to 255 characters.

## Export a DNS zone file from Azure DNS

The format of the Azure CLI command to import a DNS zone is as follows:
`azure network dns zone export [options] <resource group> <zone name> <zone file name>`
where:

- **<resource group>** - is the name of the resource group for the zone in Azure DNS.
- **<zone name>** - is the name of the zone.
- **<zone file name>** -  is the path/name of the zone file to be exported.

## Step by Step to export an Azure DNS file
 
As with zone import, we first need to log in, choose our subscription, and configure Azure CLI to use ‘ARM’ mode:

### Step 1
Login to your Azure subscription using Azure CLI.

	azure login

### Step 2
Select the subscription where you want to create your new DNS zone.

	azure account set <subscription name>

### Step 3
Azure DNS is an Azure Resource Manager (ARM) -only service,  Azure CLI must be switched to ARM mode.

	azure config mode arm
### Step 4
To export the existing Azure DNS zone ‘contoso.com’ in resource group ‘myresourcegroup’ to the file ‘contoso.com.txt’ (in the current folder), run `azure network dns zone export`.

	azure network dns zone export myresourcegroup contoso.com contoso.com.txt

This command will call the Azure DNS service to enumerate record sets in the zone and export the results to a BIND-compatible zone file.


<properties
   pageTitle="Import and export a domain zone file to Azure DNS using CLI| Microsoft Azure"
   description="Learn how to import and export a DNS zone file to Azure DNS by using Azure CLI"
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
   ms.date="05/11/2016"
   ms.author="cherylmc"/>

# Import and export a DNS zone file using the Azure CLI


This article will walk you through how to import and export DNS zone files for Azure DNS using the Azure CLI.

## Introduction to DNS zone migration

A DNS zone file is a text file that contains details of every Domain Name System (DNS) record in the zone. It follows a standard format, making it suitable for transferring DNS records between DNS systems. Using a zone file is a quick, reliable, and convenient way to transfer a DNS zone into or out of Azure DNS.  

Azure DNS supports importing and exporting zone files by using the Azure command-line interface (CLI). The Azure CLI is a cross-platform command-line tool used for managing Azure services. It is available for the Windows, Mac, and Linux platforms from the [Azure downloads page](https://azure.microsoft.com/downloads/). Cross-platform support is particularly important for importing and exporting zone files, because the most common name server software, [BIND](https://www.isc.org/downloads/bind/), typically runs on Linux.

## Obtain your existing DNS zone file

Before you import a DNS zone file into Azure DNS, you will need to obtain a copy of the zone file. The source of this file will depend on where the DNS zone is currently hosted.

- If your DNS zone is hosted by a partner service (such as a domain registrar, dedicated DNS hosting provider, or alternative cloud provider), that service should provide the ability to download the DNS zone file.

- If your DNS zone is hosted on Windows DNS, the default folder for the zone files is **%systemroot%\system32\dns**. The full path to each zone file also shows on the **General** tab of the DNS service management console.

- If your DNS zone is hosted by using BIND, the location of the zone file for each zone is specified in the BIND configuration file **named.conf**.

**Working with zone files from GoDaddy**<BR>
Zone files downloaded from GoDaddy have a slightly nonstandard format. You need to correct this before you import these zone files into Azure DNS. DNS names in the RData of each DNS record are specified as fully qualified names, but they don't have a terminating "." This means they are interpreted by other DNS systems as relative names. You need to edit the zone file to append the terminating "." to their names before you import them into Azure DNS.

## Import a DNS zone file into Azure DNS


Importing a zone file will create a new zone in Azure DNS if one does not already exist. If the zone already exists, the record sets in the zone file must be merged with the existing record sets. 

### Merge behavior

- By default, existing and new record sets are merged. Identical records within a merged record set are de-duplicated.

- Alternatively, by specifying the `--force` option, the import process will replace existing record sets with new record sets. Existing record sets that do not have a corresponding record set in the imported zone file will not be removed.

- When record sets are merged, the time to live (TTL) of preexisting record sets is used. When `--force` is used, the TTL of the new record set is used.

- Start of Authority (SOA) parameters (except `host`) are always taken from the imported zone file, regardless of whether `--force` is used. Similarly, for the name server record set at the zone apex, the TTL is always taken from the imported zone file.

- An imported CNAME record will not replace an existing CNAME record with the same name unless the `--force` parameter is specified.

- When a conflict arises between a CNAME record and another record of the same name but different type (regardless of which is existing or new), the existing record is retained. This is independent of the use of `--force`.

### Additional information about importing

The following notes provide additional technical details about the zone import process.

- The `$TTL` directive is optional, and it is supported. When no `$TTL` directive is given, records without an explicit TTL will be imported set to a default TTL of 3600 seconds. When two records in the same record set specify different TTLs, the lower value is used.

- The `$ORIGIN` directive is optional, and it is supported. When no `$ORIGIN` is set, the default value used is the zone name as specified on the command line (plus the terminating ".").

- The `$INCLUDE` and `$GENERATE` directives are not supported.

- These record types are supported: A, AAAA, CNAME, MX, NS, SOA, SRV, and TXT.  

- The SOA record is created automatically by Azure DNS when a zone is created. When you import a zone file, all SOA parameters are taken from the zone file *except* the `host` parameter. This parameter uses the value provided by Azure DNS. This is because this parameter must refer to the primary name server provided by Azure DNS.

- The name server record set at the zone apex is also created automatically by Azure DNS when the zone is created. Only the TTL of this record set is imported. These records contain the name server names provided by Azure DNS. The record data is not overwritten by the values contained in the imported zone file.

- During Public Preview, Azure DNS supports only single-string TXT records. Multistring TXT records will be concatenated and truncated to 255 characters.

### CLI format and values


The format of the Azure CLI command to import a DNS zone is:<BR>`azure network dns zone import [options] <resource group> <zone name> <zone file name>`

Values:

- `<resource group>` is the name of the resource group for the zone in Azure DNS.
- `<zone name>` is the name of the zone.
- `<zone file name>` is the path/name of the zone file to be imported.

If a zone with this name does not exist in the resource group, it will be created for you. If the zone already exists, the imported record sets will be merged with existing record sets. To overwrite the existing record sets, use the `--force` option. 

To verify the format of a zone file without actually importing it, use the `--parse-only` option.

### Step 1. Import a zone file

To import a zone file for the zone **contoso.com**.

1. Sign in to your Azure subscription by using the Azure CLI.

		azure login

2. Select the subscription where you want to create your new DNS zone.

		azure account set <subscription name>

3. Azure DNS is an Azure Resource Manager-only service, so the Azure CLI must be switched to Resource Manager mode.

		azure config mode arm

4. Before you use the Azure DNS service, you must register your subscription to use the Microsoft.Network resource provider. (This is a one-time operation for each subscription.)

		azure provider register Microsoft.Network

5. If you don’t have one already, you also need to create a Resource Manager resource group.

		azure group create myresourcegroup westeurope

6. To import the zone **contoso.com** from the file **contoso.com.txt** into a new DNS zone in the resource group **myresourcegroup**, run the command `azure network dns zone import`.<BR>This command will load the zone file and parse it. The command will execute a series of commands on the Azure DNS service to create the zone and all of the record sets in the zone. The command will also report progress in the console window, along with any errors or warnings. Because record sets are created in series, it may take a few minutes to import a large zone file.

		azure network dns zone import myresourcegroup contoso.com contoso.com.txt



### Step 2. Verify the zone

To verify the DNS zone after you import the file, you can use any one of the following methods:

- You can list the records by using the following Azure CLI command.

		azure network dns record-set list myresourcegroup contoso.com

- You can list the records by using the PowerShell cmdlet `Get-AzureRmDnsRecordSet`.

- You can use `nslookup` to verify name resolution for the records. Because the zone isn’t delegated yet, you will need to specify the correct Azure DNS name servers explicitly. The sample below shows how to retrieve the name server names assigned to the zone. IT also shows how to query the "www" record by using `nslookup`.

    	C:\>azure network dns record-set show myresourcegroup contoso.com @ NS
    	info:Executing command network dns record-set show
    	+ Looking up the DNS Record Set "@" of type "NS"
    	data:Id: /subscriptions/…/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/NS/@
    	data:Name: @
    	data:Type: Microsoft.Network/dnszones/NS
    	data:Location: global
    	data:TTL : 3600
    	data:NS records
    	data:Name server domain name : ns1-01.azure-dns.com
    	data:Name server domain name : ns2-01.azure-dns.net
    	data:Name server domain name : ns3-01.azure-dns.org
    	data:Name server domain name : ns4-01.azure-dns.info
    	data:
    	info:network dns record-set show command OK
    
    	C:\> nslookup www.contoso.com ns1-01.azure-dns.com
    
    	Server: ns1-01.azure-dns.com
    	Address:  40.90.4.1
    
    	Name:www.contoso.com
    	Addresses:  134.170.185.46
    	134.170.188.221

### Step 3. Update DNS delegation

After you have verified that the zone has been imported correctly, you will need to update the DNS delegation to point to the Azure DNS name servers. For more information, see the article [Update the DNS delegation](dns-domain-delegation.md).

## Export a DNS zone file from Azure DNS

The format of the Azure CLI command to import a DNS zone is:<BR>`azure network dns zone export [options] <resource group> <zone name> <zone file name>`

Values:

- `<resource group>` is the name of the resource group for the zone in Azure DNS.
- `<zone name>` is the name of the zone.
- `<zone file name>` is the path/name of the zone file to be exported.

As with the zone import, you first need to sign in, choose your subscription, and configure the Azure CLI to use Resource Manager mode. 

### To export a zone file


1. Sign in to your Azure subscription by using the Azure CLI.

		azure login

2. Select the subscription where you want to create your new DNS zone.

		azure account set <subscription name>

3. Azure DNS is an Azure Resource Manager-only service. The Azure CLI must be switched to Resource Manager mode.

		azure config mode arm

4. To export the existing Azure DNS zone **contoso.com** in resource group **myresourcegroup** to the file **contoso.com.txt** (in the current folder), run `azure network dns zone export`. This command will call the Azure DNS service to enumerate record sets in the zone and export the results to a BIND-compatible zone file.

		azure network dns zone export myresourcegroup contoso.com contoso.com.txt


---
title: Import and export a domain zone file - Azure CLI
titleSuffix: Azure DNS
description: Learn how to import and export a DNS (Domain Name System) zone file to Azure DNS by using Azure CLI 
services: dns
author: greg-lindsay
ms.service: dns
ms.custom: devx-track-azurecli
ms.date: 04/25/2023
ms.author: greglin
ms.topic: how-to
---

# Import and export a DNS zone file using the Azure CLI

In this article, you'll learn how to  import and export a DNS zone file in Azure DNS using Azure CLI.

## Introduction to DNS zone migration

A DNS zone file is a text file containing information about every Domain Name System (DNS) record in the zone. It follows a standard format, making it suitable for transferring DNS records between DNS systems. Using a zone file is a fast and convenient way to import DNS zones into Azure DNS. You can also export a zone file from Azure DNS to use with other DNS systems.

Azure DNS supports importing and exporting zone files via the Azure CLI. Importing zone files via Azure PowerShell or the Azure portal is **not** supported currently.

Azure CLI is a cross-platform command-line tool used for managing Azure services. It's available for Windows, Mac, and Linux from the [Azure downloads page](https://azure.microsoft.com/downloads/).

## Obtain your existing DNS zone file

Before you import a DNS zone file into Azure DNS, you need to obtain a copy of the zone file. The source of this file depends on where the DNS zone is currently hosted.

* If your DNS zone is currently hosted by a partner service, they'll have a way for you to download the DNS zone file. Partner services include domain registrar, dedicated DNS hosting provider, or an alternative cloud provider.
* If your DNS zone is hosted on Windows DNS, the default folder for the zone files is **%systemroot%\system32\dns**. The full path to each zone file is also shown on the **General** tab of the DNS console.
* If your DNS zone is hosted using BIND, the location of the zone file for each zone gets specified in the BIND configuration file **named.conf**.

> [!IMPORTANT]
> If the zone file that you import contains CNAME entries that point to names in another private zone, Azure DNS resolution of the CNAME will fail unless the other zone is also imported, or the CNAME entries are modified.

## Import a DNS zone file into Azure DNS

Importing a zone file creates a new zone in Azure DNS if the zone doesn't already exist. If the zone exists, then the record sets in the zone file will be merged with the existing record sets.

### Merge behavior

* By default, the new record sets get merged with the existing record sets. Identical records within a merged record set aren't duplicated.
* When record sets are merged, the time to live (TTL) of pre-existing record sets is used.
* Start of Authority (SOA) parameters, except `host` are always taken from the imported zone file. The name server record set at the zone apex will also always use the TTL taken from the imported zone file.
* An imported CNAME record doesn't replace an existing CNAME record with the same name.  
* When a conflict happens between a CNAME record and another record with the same name of different type, the existing record gets used.

### Additional information about importing

The following notes provide more technical details about the zone import process.

* The `$TTL` directive is optional, and is supported. When no `$TTL` directive is given, records without an explicit TTL are imported set to a default TTL of 3600 seconds. When two records in the same record set specify different TTLs, the lower value is used.
* The `$ORIGIN` directive is optional, and is supported. When no `$ORIGIN` is set, the default value used is the zone name as specified on the command line including the ending ".".
* The `$INCLUDE` and `$GENERATE` directives aren't supported.
* These record types are supported: A, AAAA, CAA, CNAME, MX, NS, SOA, SRV, and TXT.
* The SOA record is created automatically by Azure DNS when a zone is created. When you import a zone file, all SOA parameters are taken from the zone file *except* the `host` parameter. This parameter uses the value provided by Azure DNS because it needs to refer to the primary name server provided by Azure DNS.
* The name server record set at the zone apex is also created automatically by Azure DNS when the zone is created. Only the TTL of this record set is imported. These records contain the name server names provided by Azure DNS. The record data is not overwritten by the values contained in the imported zone file.
* During Public Preview, Azure DNS supports only single-string TXT records. Multistring TXT records are to be concatenated and truncated to 255 characters.

### CLI format and values

The format of the Azure CLI command to import a DNS zone is:

```azurecli-interactive-interactive
az network dns zone import -g <resource group> -n <zone name> -f <zone file name>
```

Values:

* `<resource group>` is the name of the resource group for the zone in Azure DNS.
* `<zone name>` is the name of the zone.
* `<zone file name>` is the path/name of the zone file to be imported.

If a zone with this name doesn't already exist in the resource group, one will be created for you. For an existing zone, the imported record sets will get merged with existing record sets. 

### Import a zone file

To import a zone file for the zone **contoso.com**.

1. Create a resource group if you don't have one.

    ```azurecli-interactive
    az group create --resource-group myresourcegroup -l westeurope
    ```

1. To import the zone **contoso.com** from the file **contoso.com.txt** into a new DNS zone in the resource group **myresourcegroup**, you'll run the command `az network dns zone import`.

    This command loads the zone file and parses it. The command executes a series of operations on the Azure DNS service to create the zone and all the record sets in the zone. The command will report the progress in the console window along with any errors or warnings. Since record sets are created in series, it may take a few minutes to import a large zone file.

    ```azurecli-interactive
    az network dns zone import -g myresourcegroup -n contoso.com -f contoso.com.txt
    ```

### Verify the zone

You can use any one of the following methods to verify the DNS zone after you've imported the file:

* To list the records, use the following Azure CLI command:

    ```azurecli-interactive
    az network dns record-set list -g myresourcegroup -z contoso.com
    ```

* You can also list the records by using the Azure CLI command `az network dns record-set ns list`.
* Use `nslookup` to verify name resolution for the records. If the zone hasn't been delegated yet, you need to specify the correct Azure DNS name servers explicitly. The following sample shows how to retrieve the name server names assigned to the zone.

    ```azurecli-interactive
    az network dns record-set ns list -g myresourcegroup -z contoso.com  --output json 
    ```

    ```json
    [
      {
       .......
       "name": "@",
        "nsRecords": [
          {
            "additionalProperties": {},
            "nsdname": "ns1-03.azure-dns.com."
          },
          {
            "additionalProperties": {},
            "nsdname": "ns2-03.azure-dns.net."
          },
          {
            "additionalProperties": {},
            "nsdname": "ns3-03.azure-dns.org."
          },
          {
            "additionalProperties": {},
            "nsdname": "ns4-03.azure-dns.info."
          }
        ],
        "resourceGroup": "myresourcegroup",
        "ttl": 86400,
        "type": "Microsoft.Network/dnszones/NS"
      }
    ]
    ```

    Use Windows Command Prompt to query the "www" record with the `nslookup` command.

    ```cmd
    nslookup www.contoso.com ns1-03.azure-dns.com

        Server: ns1-01.azure-dns.com
        Address:  40.90.4.1

        Name:www.contoso.com
        Addresses:  134.170.185.46
        134.170.188.221
    ```

### Update DNS delegation

After you've verified that the zone has been imported correctly, you then need to update the DNS delegation to point to the Azure DNS name servers. For more information, see [Update the DNS delegation](dns-domain-delegation.md).

## Export a DNS zone file from Azure DNS

To export a DNS zone, use the following Azure CLI command:

```azurecli-interactive
az network dns zone export -g <resource group> -n <zone name> -f <zone file name>
```

Values:

* `<resource group>` is the name of the resource group for the zone in Azure DNS.
* `<zone name>` is the name of the zone.
* `<zone file name>` is the path/name of the zone file to be exported.

As with the zone import, you first need to sign in, choose your subscription, and configure the Azure CLI to use Resource Manager mode.

### To export a zone file

To export the existing Azure DNS zone **contoso.com** in resource group **myresourcegroup** to the file **contoso.com.txt** (in the current folder), run `azure network dns zone export`. This command  calls the Azure DNS service to enumerate record sets in the zone and export the results to a BIND-compatible zone file.

```azurecli-interactive
az network dns zone export -g myresourcegroup -n contoso.com -f contoso.com.txt
```

## Next steps

* Learn how to [manage record sets and records](./dns-getstarted-cli.md) in your DNS zone.

* Learn how to [delegate your domain to Azure DNS](dns-domain-delegation.md).

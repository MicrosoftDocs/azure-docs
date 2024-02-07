---
title: Import and export a domain zone file for Azure private DNS - Azure CLI
titleSuffix: Azure DNS
description: Learn how to import and export a  DNS zone file to Azure private DNS by using Azure CLI 
services: dns
author: greg-lindsay
ms.service: dns
ms.custom: devx-track-azurecli
ms.date: 10/20/2023
ms.author: greglin
ms.topic: how-to
---

# Import and export a private DNS zone file for Azure private DNS

This article walks you through how to import and export DNS zone files for Azure DNS using the Azure CLI.

## Introduction to DNS zone migration

A DNS zone file is a text file that contains details of every Domain Name System (DNS) record in the zone. It follows a standard format, making it suitable for transferring DNS records between DNS systems. Using a zone file is a quick, reliable, and convenient way to transfer a DNS zone into or out of Azure DNS.

Azure private DNS supports importing and exporting zone files via the Azure CLI. Importing zone files via Azure PowerShell or the Azure portal is **not** supported  currently.

The Azure CLI is a cross-platform command-line tool used for managing Azure services. It is available for the Windows, Mac, and Linux platforms from the [Azure downloads page](https://azure.microsoft.com/downloads/). Cross-platform support is important for importing and exporting zone files, because the most common name server software, [BIND](https://www.isc.org/downloads/bind/), typically runs on Linux.

## Obtain your existing DNS zone file

Before you import a DNS zone file into Azure DNS, you need to obtain a copy of the zone file. The source of this file depends on where the DNS zone is currently hosted.

* If your DNS zone is hosted by a partner service (such as a domain registrar, dedicated DNS hosting provider, or alternative cloud provider), that service should provide the ability to download the DNS zone file.
* If your DNS zone is hosted on Windows DNS, the default folder for the zone files is **%systemroot%\system32\dns**. The full path to each zone file also shows on the **General** tab of the DNS console.
* If your DNS zone is hosted by using BIND, the location of the zone file for each zone is specified in the BIND configuration file **named.conf**.

## Import a DNS zone file into Azure private DNS

Importing a zone file creates a new zone in Azure private DNS if one does not already exist. If the zone already exists, the record sets in the zone file must be merged with the existing record sets.

### Merge behavior

* By default, existing and new record sets are merged. Identical records within a merged record set are de-duplicated.
* When record sets are merged, the time to live (TTL) of preexisting record sets is used.
* Start of Authority (SOA) parameters (except `host`) are always taken from the imported zone file. Similarly, for the name server record set at the zone apex, the TTL is always taken from the imported zone file.
* An imported CNAME record does not replace an existing CNAME record with the same name.  
* When a conflict arises between a CNAME record and another record of the same name but different type (regardless of which is existing or new), the existing record is retained. 

### Additional information about importing

The following notes provide additional technical details about the zone import process.

* The `$TTL` directive is optional, and it's supported. When no `$TTL` directive is given, records without an explicit TTL are imported set to a default TTL of 3600 seconds. When two records in the same record set specify different TTLs, the lower value is used.
* The `$ORIGIN` directive is optional, and it's supported. When no `$ORIGIN` is set, the default value used is the zone name as specified on the command line (plus the terminating ".").
* The `$INCLUDE` and `$GENERATE` directives are not supported.
* These record types are supported: A, AAAA, CAA, CNAME, MX, NS, SOA, SRV, and TXT.
* The SOA record is created automatically by Azure DNS when a zone is created. When you import a zone file, all SOA parameters are taken from the zone file *except* the `host` parameter. This parameter uses the value provided by Azure DNS. This is because this parameter must refer to the primary name server provided by Azure DNS.
* The name server record set at the zone apex is also created automatically by Azure DNS when the zone is created. Only the TTL of this record set is imported. These records contain the name server names provided by Azure DNS. The record data is not overwritten by the values contained in the imported zone file.
* Azure DNS supports only single-string TXT records. Multistring TXT records will be concatenated and truncated to 255 characters.

### CLI format and values

The format of the Azure CLI command to import a DNS zone is:

```azurecli
az network private-dns zone import -g <resource group> -n <zone name> -f <zone file name>
```

Values:

* `<resource group>` is the name of the resource group for the zone in Azure DNS.
* `<zone name>` is the name of the zone.
* `<zone file name>` is the path/name of the zone file to be imported.

If a zone with this name does not exist in the resource group, it's created for you. If the zone already exists, the imported record sets are merged with existing record sets.

### Import a zone file

To import a zone file for the zone **contoso.com**.

1. If you don't have one already, you need to create a Resource Manager resource group.

    ```azurecli
    az group create --resource-group myresourcegroup -l westeurope
    ```

2. To import the zone **contoso.com** from the file **contoso.com.txt** into a new DNS zone in the resource group **myresourcegroup**, you'll run the command `az network private-dns zone import`.<BR>This command loads the zone file and parses it. The command executes a series of commands on the Azure DNS service to create the zone and all the record sets in the zone. The command reports progress in the console window, along with any errors or warnings. Because record sets are created in series, it may take a few minutes to import a large zone file.

    ```azurecli
    az network private-dns zone import -g myresourcegroup -n contoso.com -f contoso.com.txt
    ```

### Verify the zone

To verify the DNS zone after you import the file, you can use any one of the following methods:

* You can list the records by using the following Azure CLI command:

    ```azurecli
    az network private-dns record-set list -g myresourcegroup -z contoso.com
    ```

* You can use `nslookup` to verify name resolution for the records. Because the zone isn't delegated yet, you need to specify the correct Azure DNS name servers explicitly. The following sample shows how to retrieve the name server names assigned to the zone. This also shows how to query the "www" record by using `nslookup`.

## Export a DNS zone file from Azure DNS

The format of the Azure CLI command to export a DNS zone is:

```azurecli
az network private-dns zone export -g <resource group> -n <zone name> -f <zone file name>
```

Values:

* `<resource group>` is the name of the resource group for the zone in Azure DNS.
* `<zone name>` is the name of the zone.
* `<zone file name>` is the path/name of the zone file to be exported.

As with the zone import, you first need to sign in, choose your subscription, and configure the Azure CLI to use Resource Manager mode.

### To export a zone file

To export the existing Azure DNS zone **contoso.com** in resource group **myresourcegroup** to the file **contoso.com.txt** (in the current folder), run `azure network private-dns zone export`. This command  calls the Azure DNS service to enumerate record sets in the zone and export the results to a BIND-compatible zone file.

```azurecli
az network private-dns zone export -g myresourcegroup -n contoso.com -f contoso.com.txt
```

## Next steps

* Learn how to [manage record sets and records](./private-dns-getstarted-cli.md) in your DNS zone.

---
title: Quickstart - Create an Azure DNS zone and record using Azure CLI
description: Quickstart - Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone and record using the Azure CLI.
services: dns
author: vhorne
ms.service: dns
ms.topic: quickstart
ms.date: 7/16/2018
ms.author: victorh
---

# Quickstart: Create an Azure DNS zone and record using Azure CLI

This article walks you through the steps to create your first DNS zone and record using Azure CLI, which is available for Windows, Mac and Linux. You can also perform these steps using the [Azure portal](dns-getstarted-portal.md) or [Azure PowerShell](dns-getstarted-powershell.md).

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. Finally, to publish your DNS zone to the Internet, you need to configure the name servers for the domain. Each of these steps is described below.

Azure DNS now also supports private DNS zones (currently in public preview). To learn more about private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md). For an example on how to create a private DNS zone, see [Get started with Azure DNS private zones using CLI](./private-dns-getstarted-cli.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create the resource group

Before you create the DNS zone, create a resource group to contain the DNS zone:

```azurecli
az group create --name MyResourceGroup --location "East US"
```

## Create a DNS zone

A DNS zone is created using the `az network dns zone create` command. To see help for this command, type `az network dns zone create -h`.

The following example creates a DNS zone called *contoso.com* in the resource group *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```azurecli
az network dns zone create -g MyResourceGroup -n contoso.com
```

## Create a DNS record

To create a DNS record, use the `az network dns record-set [record type] add-record` command. For help on A records, see `azure network dns record-set A add-record -h`.

The following example creates a record with the relative name "www" in the DNS Zone "contoso.com" in the resource group "MyResourceGroup". The fully-qualified name of the record set is "www.contoso.com". The record type is "A", with IP address "1.2.3.4", and a default TTL of 3600 seconds (1 hour).

```azurecli
az network dns record-set a add-record -g MyResourceGroup -z contoso.com -n www -a 1.2.3.4
```

## View records

To list the DNS records in your zone, run:

```azurecli
az network dns record-set list -g MyResourceGroup -z contoso.com
```

## Update name servers

Once you are satisfied that your DNS zone and records have been set up correctly, you need to configure your domain name to use the Azure DNS name servers enabling other users on the Internet to find your DNS records.

The name servers for your zone are given by the `az network dns zone show` command. To see the name server names, use JSON output, as shown in the following example.

```azurecli
az network dns zone show -g MyResourceGroup -n contoso.com -o json

{
  "etag": "00000003-0000-0000-b40d-0996b97ed101",
  "id": "/subscriptions/a385a691-bd93-41b0-8084-8213ebc5bff7/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com",
  "location": "global",
  "maxNumberOfRecordSets": 5000,
  "name": "contoso.com",
  "nameServers": [
    "ns1-01.azure-dns.com.",
    "ns2-01.azure-dns.net.",
    "ns3-01.azure-dns.org.",
    "ns4-01.azure-dns.info."
  ],
  "numberOfRecordSets": 3,
  "resourceGroup": "myresourcegroup",
  "tags": {},
  "type": "Microsoft.Network/dnszones"
}
```

These name servers should be configured with the domain name registrar (where you purchased the domain name). Your registrar will offer the option to set up the name servers for the domain. For more information, see [Delegate your domain to Azure DNS](dns-domain-delegation.md).

## Delete all resources
 
When no longer needed, you can delete all resources created in this quickstart by deleting the resource group:

```azurecli
az group delete --name MyResourceGroup
```

## Next steps

Now that you've created your first DNS zone and record using Azure CLI, you can create records for a web app in a custom domain.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

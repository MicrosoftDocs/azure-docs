---
title: Allow access to indexer IP ranges
titleSuffix: Azure Cognitive Search
description: How to guide that describes how to set up IP firewall rules so that indexers can have access.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/07/2020
---

# Setting up IP firewall rules to enable indexer access

IP firewall rules on Azure resources such as storage accounts, Cosmos DB accounts, and Azure SQL servers only permit traffic originating from specific IP ranges to access data.

This article will describe how to configure the IP rules, via Azure portal, for a storage account so that Azure Cognitive Search indexers can access the data securely. While specific to storage, this guide can be directly translated to other Azure resources that also offer IP firewall rules for securing access to data.

> [!NOTE]
> IP firewall rules for storage account are only effective if the storage account and the search service are in different regions. If your setup does not permit this, we recommend utilizing the [trusted service exception option](search-indexer-howto-access-trusted-service-exception.md).

## Get the IP address of the search service

Obtain the fully qualified domain name (FQDN) of your search service. This will look like `<search-service-name>.search.windows.net`. You can find out the FQDN by looking up your search service on the Azure portal.

   ![Obtain service FQDN](media\search-indexer-howto-secure-access\search-service-portal.png "Obtain service FQDN")

The IP address of the search service can be obtained by performing a `nslookup` (or a `ping`) of the FQDN. This will be one of the IP addresses to add to the firewall rules.

```azurepowershell

nslookup contoso.search.windows.net
Server:  server.example.org
Address:  10.50.10.50

Non-authoritative answer:
Name:    <name>
Address:  150.0.0.1
Aliases:  contoso.search.windows.net
```

## Get the IP address ranges for "AzureCognitiveSearch" service tag

The IP address ranges for the `AzureCognitiveSearch` service tag can be either obtained via the [discovery API (preview)](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api-public-preview) or the [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

For this walkthrough, assuming the search service is the Azure Public cloud, the [Azure Public JSON file](https://www.microsoft.com/download/details.aspx?id=56519) should be downloaded.

   ![Download JSON file](media\search-indexer-howto-secure-access\service-tag.png "Download JSON file")

From the JSON file, assuming the search service is in West Central US, the list of IP addresses for the multi-tenant indexer execution environment are listed below.

```json
    {
      "name": "AzureCognitiveSearch.WestCentralUS",
      "id": "AzureCognitiveSearch.WestCentralUS",
      "properties": {
        "changeNumber": 1,
        "region": "westcentralus",
        "platform": "Azure",
        "systemService": "AzureCognitiveSearch",
        "addressPrefixes": [
          "52.150.139.0/26",
          "52.253.133.74/32"
        ]
      }
    }
```

For /32 IP addresses, drop the "/32" (52.253.133.74/32 -> 52.253.133.74), others can be used verbatim.

## Add the IP address ranges to IP firewall rules

The easiest way to add IP address ranges to a storage account's firewall rule is via the Azure portal. Locate the storage account on the portal and navigate to the "**Firewalls and virtual networks**" tab.

   ![Firewall and virtual networks](media\search-indexer-howto-secure-access\storage-firewall.png "Firewall and virtual networks")

Add the three IP addresses obtained previously (1 for the search service IP, 2 for the `AzureCognitiveSearch` service tag) in the address range and click "**Save**"

   ![Firewall IP rules](media\search-indexer-howto-secure-access\storage-firewall-ip.png "Firewall IP rules")

The firewall rules take 5-10 minutes to get updated after which indexers will be able to access the data in the storage account.

## Next Steps

Now that you know how to get the two sets of IP addresses to allow access for indexes, use the following links to update the IP firewall rules for some common data sources.

- [Configure Azure Storage firewalls](../storage/common/storage-network-security.md)
- [Configure IP firewall for CosmosDB](../cosmos-db/firewall-support.md)
- [Configure IP firewall for Azure SQL server](../azure-sql/database/firewall-configure.md)
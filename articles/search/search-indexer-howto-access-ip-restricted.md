---
title: Allow access to indexer IP ranges
titleSuffix: Azure Cognitive Search
description: Configure IP firewall rules to allow data access by an Azure Cognitive Search indexer.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/14/2020
---

# Configure IP firewall rules to allow indexer connections (Azure Cognitive Search)

IP firewall rules on Azure resources such as storage accounts, Cosmos DB accounts, and Azure SQL Servers only permit traffic originating from specific IP ranges to access data.

This article describes how to configure the IP rules, via Azure portal, for a storage account so that Azure Cognitive Search indexers can access the data securely. While specific to Azure Storage, the approach also works for other Azure resources that use IP firewall rules for securing access to data.

> [!NOTE]
> IP firewall rules for storage account are only effective if the storage account and the search service are in different regions. If your setup does not permit this, we recommend utilizing the [trusted service exception option](search-indexer-howto-access-trusted-service-exception.md).

## Get the IP address of the search service

Obtain the fully qualified domain name (FQDN) of your search service. This will look like `<search-service-name>.search.windows.net`. You can find out the FQDN by looking up your search service on the Azure portal.

   ![Obtain service FQDN](media\search-indexer-howto-secure-access\search-service-portal.png "Obtain service FQDN")

The IP address of the search service can be obtained by performing a `nslookup` (or a `ping`) of the FQDN. In the example below, you would add "150.0.0.1" to an inbound rule on the Azure Storage firewall. It might take up to 15 minutes after the firewall settings have been updated for the search service indexer to be able to access the Azure Storage account.

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

Additional IP addresses are used for requests that originate from the indexer's [multi-tenant execution environment](search-indexer-securing-resources.md#indexer-execution-environment). You can get this IP address range from the service tag.

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

The easiest way to add IP address ranges to a storage account's firewall rule is via the Azure portal. Locate the storage account on the portal and navigate to the **Firewalls and virtual networks** tab.

   ![Firewall and virtual networks](media\search-indexer-howto-secure-access\storage-firewall.png "Firewall and virtual networks")

Add the three IP addresses obtained previously (1 for the search service IP, 2 for the `AzureCognitiveSearch` service tag) in the address range and select **Save**.

   ![Firewall IP rules](media\search-indexer-howto-secure-access\storage-firewall-ip.png "Firewall IP rules")

The firewall rules take 5-10 minutes to get updated, after which indexers should be able to access the data in the storage account.

## Next Steps

- [Configure Azure Storage firewalls](../storage/common/storage-network-security.md)
- [Configure IP firewall for Cosmos DB](../cosmos-db/how-to-configure-firewall.md)
- [Configure IP firewall for Azure SQL Server](../azure-sql/database/firewall-configure.md)
---
title: Allow access to indexer IP ranges
titleSuffix: Azure Cognitive Search
description: Configure IP firewall rules to allow data access by an Azure Cognitive Search indexer.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/11/2021
---

# Configure IP firewall rules to allow indexer connections in Azure Cognitive Search

On behalf of an indexer, a search service will issue outbound calls to an external Azure resource to pull in data during indexing. If your Azure resource uses IP firewall rules to filter incoming calls, you'll need to create an inbound rule in your firewall that admits indexer requests.

This article explains how to find the IP address of your search service, and then use Azure portal to configure an inbound IP rule on an Azure Storage account. While specific to Azure Storage, this approach also works for other Azure resources that use IP firewall rules for data access, such as Cosmos DB and Azure SQL.

> [!NOTE]
> IP firewall rules for a storage account are only effective if the storage account and the search service are in different regions. If your setup does not permit this, we recommend utilizing the [trusted service exception option](search-indexer-howto-access-trusted-service-exception.md) as an alternative.

## Get a search service IP address

1. Determine the fully qualified domain name (FQDN) of your search service. This will look like `<search-service-name>.search.windows.net`. You can find out the FQDN by looking up your search service on the Azure portal.

   ![Obtain service FQDN](media\search-indexer-howto-secure-access\search-service-portal.png "Obtain service FQDN")

1. Look up the IP address of the search service by performing a `nslookup` (or a `ping`) of the FQDN on a command prompt.

1. Copy the IP address so that you can specify it on an inbound rule in the next step. In the example below, the IP address that you should copy is "150.0.0.1".

   ```azurepowershell
   nslookup contoso.search.windows.net
   Server:  server.example.org
   Address:  10.50.10.50
    
   Non-authoritative answer:
   Name:    <name>
   Address:  150.0.0.1
   aliases:  contoso.search.windows.net
   ```

## Get IP addresses for "AzureCognitiveSearch" service tag

Depending on your search service configuration, you might also need to create an inbound rule that admits requests from a range of IP addresses. Specifically, additional IP addresses are used for requests that originate from the indexer's [multi-tenant execution environment](search-indexer-securing-resources.md#indexer-execution-environment). 

You can get this IP address range from the `AzureCognitiveSearch` service tag.

1. Get the IP address ranges for the `AzureCognitiveSearch` service tag using either the [discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) or the [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

1. If the search service is the Azure Public cloud, the [Azure Public JSON file](https://www.microsoft.com/download/details.aspx?id=56519) should be downloaded.

   ![Download JSON file](media\search-indexer-howto-secure-access\service-tag.png "Download JSON file")

1. From the JSON file, assuming the search service is in West Central US, the list of IP addresses for the multi-tenant indexer execution environment are listed below.

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

For `/32` IP addresses, drop the "/32" (52.253.133.74/32 becomes 52.253.133.74 in the rule definition). All other IP addresses can be used verbatim.

## Add IP addresses to IP firewall rules

Once you have the IP addresses, you are ready to set up the rule. The easiest way to add IP address ranges to a storage account's firewall rule is via the Azure portal. 

1. Locate the storage account on the portal and navigate to the **Firewalls and virtual networks** tab.

   ![Firewall and virtual networks](media\search-indexer-howto-secure-access\storage-firewall.png "Firewall and virtual networks")

1. Add the three IP addresses obtained previously (one for the search service IP, two for the `AzureCognitiveSearch` service tag) in the address range and select **Save**.

   ![Firewall IP rules](media\search-indexer-howto-secure-access\storage-firewall-ip.png "Firewall IP rules")

It can take five to ten minutes for the firewall rules to be updated, after which indexers should be able to access the data in the storage account.

## Next Steps

- [Configure Azure Storage firewalls](../storage/common/storage-network-security.md)
- [Configure IP firewall for Cosmos DB](../cosmos-db/how-to-configure-firewall.md)
- [Configure IP firewall for Azure SQL Server](../azure-sql/database/firewall-configure.md)

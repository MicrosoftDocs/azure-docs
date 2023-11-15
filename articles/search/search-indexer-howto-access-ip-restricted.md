---
title: Connect through firewalls
titleSuffix: Azure AI Search
description: Configure IP firewall rules to allow data access by an Azure AI Search indexer.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 07/19/2023
---

# Configure IP firewall rules to allow indexer connections from Azure AI Search

On behalf of an indexer, a search service issues outbound calls to an external Azure resource to pull in data during indexing. If your Azure resource uses IP firewall rules to filter incoming calls, you need to create an inbound rule in your firewall that admits indexer requests.

This article explains how to find the IP address of your search service and configure an inbound IP rule on an Azure Storage account. While specific to Azure Storage, this approach also works for other Azure resources that use IP firewall rules for data access, such as Azure Cosmos DB and Azure SQL.

> [!NOTE]
> A storage account and your search service must be in different regions if you want to define IP firewall rules. If your setup doesn't permit this, try the [trusted service exception](search-indexer-howto-access-trusted-service-exception.md) or [resource instance rule](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances) instead.

## Get a search service IP address

1. Get the fully qualified domain name (FQDN) of your search service. This looks like `<search-service-name>.search.windows.net`. You can find the FQDN by looking up your search service on the Azure portal.

   :::image type="content" source="media\search-indexer-howto-secure-access\search-service-portal.png" alt-text="Screenshot of the search service Overview page." border="true":::

1. Look up the IP address of the search service by performing a `nslookup` (or a `ping`) of the FQDN on a command prompt. Make sure you remove the "https://" prefix from the FQDN.

1. Copy the IP address so that you can specify it on an inbound rule in the next step. In the following example, the IP address that you should copy is "150.0.0.1".

   ```bash
   nslookup contoso.search.windows.net
   Server:  server.example.org
   Address:  10.50.10.50
    
   Non-authoritative answer:
   Name:    <name>
   Address:  150.0.0.1
   aliases:  contoso.search.windows.net
   ```

## Allow access from your client IP address

Client applications that push indexing and query requests to the search service must be represented in an IP range. On Azure, you can generally determine the IP address by pinging the FQDN of a service (for example, `ping <your-search-service-name>.search.windows.net` returns the IP address of a search service).

Add your client IP address to allow access to the service from the Azure portal on your current computer. Navigate to the **Networking** section on the left navigation pane. Change **Public Network Access** to **Selected networks**, and then check **Add your client IP address** under **Firewall**.

   :::image type="content" source="media\service-configure-firewall\azure-portal-firewall.png" alt-text="Screenshot of adding client ip to search service firewall" border="true":::

## Get the Azure portal IP address

If you're using the portal or the [Import Data wizard](search-import-data-portal.md) to create an indexer, you need an inbound rule for the portal as well.

To get the portal's IP address, perform `nslookup` (or `ping`) on `stamp2.ext.search.windows.net`, which is the domain of the traffic manager. For nslookup, the IP address is visible in the "Non-authoritative answer" portion of the response. 

In the following example, the IP address that you should copy is "52.252.175.48".

```bash
$ nslookup stamp2.ext.search.windows.net
Server:  ZenWiFi_ET8-0410
Address:  192.168.50.1

Non-authoritative answer:
Name:    azsyrie.northcentralus.cloudapp.azure.com
Address:  52.252.175.48
Aliases:  stamp2.ext.search.windows.net
          azs-ux-prod.trafficmanager.net
          azspncuux.management.search.windows.net
```

Services in different regions connects to different traffic managers. Regardless of the domain name, the IP address returned from the ping is the correct one to use when defining an inbound firewall rule for the Azure portal in your region.

For ping, the request times out, but the IP address is visible in the response. For example, in the message "Pinging azsyrie.northcentralus.cloudapp.azure.com [52.252.175.48]", the IP address is "52.252.175.48".

## Get IP addresses for "AzureCognitiveSearch" service tag

You'll also need to create an inbound rule that allows requests from the [multi-tenant execution environment](search-indexer-securing-resources.md#indexer-execution-environment). This environment is managed by Microsoft and it's used to offload processing intensive jobs that could otherwise overwhelm your search service. This section explains how to get the range of IP addresses needed to create this inbound rule.

An IP address range is defined for each region that supports Azure AI Search. Specify the full range to ensure the success of requests originating from the multi-tenant execution environment. 

You can get this IP address range from the `AzureCognitiveSearch` service tag.

1. Use either the [discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) or the [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). If the search service is the Azure Public cloud, download the [Azure Public JSON file](https://www.microsoft.com/download/details.aspx?id=56519).

1. Open the JSON file and search for "AzureCognitiveSearch". For a search service in WestUS2, the IP addresses for the multi-tenant indexer execution environment are:

    ```json
    {
    "name": "AzureCognitiveSearch.WestUS2",
    "id": "AzureCognitiveSearch.WestUS2",
    "properties": {
       "changeNumber": 1,
       "region": "westus2",
       "regionId": 38,
       "platform": "Azure",
       "systemService": "AzureCognitiveSearch",
       "addressPrefixes": [
          "20.42.129.192/26",
          "40.91.93.84/32",
          "40.91.127.116/32",
          "40.91.127.241/32",
          "51.143.104.54/32",
          "51.143.104.90/32",
          "2603:1030:c06:1::180/121"
       ],
       "networkFeatures": null
    }
    },
    ```

1. For IP addresses have the "/32" suffix, drop the "/32" (40.91.93.84/32 becomes 40.91.93.84 in the rule definition). All other IP addresses can be used verbatim.

1. Copy all of the IP addresses for the region.

## Add IP addresses to IP firewall rules

Now that you have the necessary IP addresses, you can set up the inbound rules. The easiest way to add IP address ranges to a storage account's firewall rule is through the Azure portal. 

1. Locate the storage account on the portal and open **Networking** on the left navigation pane.

1. In the **Firewall and virtual networks** tab, choose **Selected networks**.

   :::image type="content" source="media\search-indexer-howto-secure-access\storage-firewall.png" alt-text="Screenshot of Azure Storage Firewall and virtual networks page" border="true":::

1. Add the IP addresses obtained previously in the address range and select **Save**. You should have rules for the search service, Azure portal (optional), plus all of the IP addresses for the "AzureCognitiveSearch" service tag for your region.

   :::image type="content" source="media\search-indexer-howto-secure-access\storage-firewall-ip.png" alt-text="Screenshot of the IP address section of the page." border="true":::

It can take five to ten minutes for the firewall rules to be updated, after which indexers should be able to access storage account data behind the firewall.

## Next Steps

- [Configure Azure Storage firewalls](../storage/common/storage-network-security.md)
- [Configure an IP firewall for Azure Cosmos DB](../cosmos-db/how-to-configure-firewall.md)
- [Configure IP firewall for Azure SQL Server](/azure/azure-sql/database/firewall-configure)

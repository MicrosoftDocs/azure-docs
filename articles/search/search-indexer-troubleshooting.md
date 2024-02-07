---
title: Indexer troubleshooting
titleSuffix: Azure AI Search
description: Provides indexer problem and resolution guidance for cases when no error messages are returned from the service search.

author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/11/2024
---

# Indexer troubleshooting guidance for Azure AI Search

Occasionally, indexers run into problems that don't produce errors or that occur on other Azure services, such as during authentication or when connecting. This article focuses on troubleshooting indexer problems when there are no messages to guide you. It also provides troubleshooting for errors that come from non-search resources used during indexing. 

> [!NOTE]
> If you have an Azure AI Search error to investigate, see [Troubleshooting common indexer errors and warnings](cognitive-search-common-errors-warnings.md) instead.

<a name="connection-errors"></a>

## Troubleshoot connections to restricted resources

For data sources under Azure network security, indexers are limited in how they make the connection. Currently, indexers can access restricted data sources [behind an IP firewall](search-indexer-howto-access-ip-restricted.md) or on a virtual network through a [private endpoint](search-indexer-howto-access-private.md) using a shared private link.

### Firewall rules

Azure Storage, Azure Cosmos DB and Azure SQL provide a configurable firewall. There's no specific error message when the firewall blocks the request. Typically, firewall errors are generic. Some common errors include:

* `The remote server returned an error: (403) Forbidden`
* `This request is not authorized to perform this operation`
* `Credentials provided in the connection string are invalid or have expired`

There are two options for allowing indexers to access these resources in such an instance:

* Configure an inbound rule for the IP address of your search service and the IP address range of `AzureCognitiveSearch` [service tag](../virtual-network/service-tags-overview.md#available-service-tags). Details for configuring IP address range restrictions for each data source type can be found from the following links:

  * [Azure Storage](../storage/common/storage-network-security.md#grant-access-from-an-internet-ip-range)
  * [Azure Cosmos DB](../storage/common/storage-network-security.md#grant-access-from-an-internet-ip-range)
  * [Azure SQL](/azure/azure-sql/database/firewall-configure#create-and-manage-ip-firewall-rules)

* As a last resort or as a temporary measure, disable the firewall by allowing access from **All Networks**.

**Limitation**: IP address range restrictions only work if your search service and your storage account are in different regions.

In addition to data retrieval, indexers also send outbound requests through skillsets and [custom skills](cognitive-search-custom-skill-web-api.md). For custom skills based on an Azure function, be aware that Azure functions also have [IP address restrictions](/azure/azure-functions/ip-addresses#ip-address-restrictions). The list of IP addresses to allow through for custom skill execution include the IP address of your search service and the IP address range of `AzureCognitiveSearch` service tag.

### Network security group (NSG) rules

When an indexer accesses data on a SQL managed instance, or when an Azure VM is used as the web service URI for a [custom skill](cognitive-search-custom-skill-web-api.md), the network security group determines whether requests are allowed in.

For external resources residing on a virtual network, [configure inbound NSG rules](/azure/virtual-network/manage-network-security-group#work-with-security-rules) for the `AzureCognitiveSearch` service tag.

For more information about connecting to a virtual machine, see [Configure a connection to SQL Server on an Azure VM](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md).

### Network errors

Usually, network errors are generic. Some common errors include:

* `A network-related or instance-specific error occurred while establishing a connection to the server`
* `The server was not found or was not accessible`
* `Verify that the instance name is correct and that the source is configured to allow remote connections`

When you receive any of those errors:

* Make sure your source is accessible by trying to connect to it directly and not through the search service
* Check your resource in the Azure portal for any current errors or outages
* Check for any network outages in [Azure Status](https://azure.status.microsoft/status)
* Verify you're using a public DNS for name resolution and not an [Azure Private DNS](/azure/dns/private-dns-overview)

## Azure SQL Database serverless indexing (error code 40613)

If your SQL database is on a [serverless compute tier](/azure/azure-sql/database/serverless-tier-overview), make sure that the database is running (and not paused) when the indexer connects to it.

If the database is paused, the first sign in from your search service is expected to auto-resume the database, but instead returns an error stating that the database is unavailable, giving error code 40613. After the database is running, retry the sign in to establish connectivity.

<a name='azure-active-directory-conditional-access-policies'></a>

## Microsoft Entra Conditional Access policies

When you create a SharePoint indexer, there's a step requiring you to sign in to your Microsoft Entra app after providing a device code. If you receive a message that says `"Your sign-in was successful but your admin requires the device requesting access to be managed"`, the indexer is probably blocked from the SharePoint document library by a [Conditional Access](../active-directory/conditional-access/overview.md) policy.

To update the policy and allow indexer access to the document library:

1. Open the Azure portal and search for **Microsoft Entra Conditional Access**.

1. Select **Policies** on the left menu. If you don't have access to view this page, you need to either find someone who has access or get access.

1. Determine which policy is blocking the SharePoint indexer from accessing the document library. The policy that might be blocking the indexer includes the user account that you used to authenticate during the indexer creation step in the **Users and groups** section. The policy also might have **Conditions** that:

    * Restrict **Windows** platforms.
    * Restrict **Mobile apps and desktop clients**.
    * Have **Device state** configured to **Yes**.

1. Once you've confirmed which policy is blocking the indexer, make an exemption for the indexer. Start by retrieving the search service IP address.

    First, obtain the fully qualified domain name (FQDN) of your search service. The FQDN looks like `<your-search-service-name>.search.windows.net`. You can find the FQDN in the Azure portal.

    ![Obtain service FQDN](media\search-indexer-howto-secure-access\search-service-portal.png "Obtain service FQDN")

    Now that you have the FQDN, get the IP address of the search service by performing a `nslookup` (or a `ping`) of the FQDN. In the following example, you would add "150.0.0.1" to an inbound rule on the Azure Storage firewall. It might take up to 15 minutes after the firewall settings have been updated for the search service indexer to be able to access the Azure Storage account.

    ```azurepowershell
    nslookup contoso.search.windows.net
    Server:  server.example.org
    Address:  10.50.10.50
    
    Non-authoritative answer:
    Name:    <name>
    Address:  150.0.0.1
    Aliases:  contoso.search.windows.net
    ```

1. Get the IP address ranges for the indexer execution environment for your region.

    Extra IP addresses are used for requests that originate from the indexer's [multitenant execution environment](search-indexer-securing-resources.md#indexer-execution-environment). You can get this IP address range from the service tag.

    The IP address ranges for the `AzureCognitiveSearch` service tag can be either obtained via the [discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) or the [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

    For this exercise, assuming the search service is the Azure Public cloud, the [Azure Public JSON file](https://www.microsoft.com/download/details.aspx?id=56519) should be downloaded.

   ![Download JSON file](media\search-indexer-troubleshooting\service-tag.png "Download JSON file")

    From the JSON file, assuming the search service is in West Central US, the list of IP addresses for the multitenant indexer execution environment are listed below.

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

1. Back on the Conditional Access page in Azure portal, select **Named locations** from the menu on the left, then select **+ IP ranges location**. Give your new named location a name and add the IP ranges for your search service and indexer execution environments that you collected in the last two steps.
1
    * For your search service IP address, you might need to add "/32" to the end of the IP address since it only accepts valid IP ranges.
    * Remember that for the indexer execution environment IP ranges, you only need to add the IP ranges for the region that your search service is in.

1. Exclude the new Named location from the policy:

    1. Select **Policies** on the left menu. 
    1. Select the policy that is blocking the indexer.
    1. Select **Conditions**.
    1. Select **Locations**.
    1. Select **Exclude** then add the new Named location.
    1. **Save** the changes.

1. Wait a few minutes for the policy to update and enforce the new policy rules.

1. Attempt to create the indexer again:

    1. Send an update request for the data source object that you created.
    1. Resend the indexer create request. Use the new code to sign in, then send another indexer creation request.

## Indexing unsupported document types

If you're indexing content from Azure Blob Storage, and the container includes blobs of an [unsupported content type](search-howto-indexing-azure-blob-storage.md#SupportedFormats), the indexer skips that document. In other cases, there might be problems with individual documents. 

In this situation, you can [set configuration options](search-howto-indexing-azure-blob-storage.md#DealingWithErrors) to allow indexer processing to continue in the event of problems with individual documents.

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2023-11-01
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false, "failOnUnprocessableDocument" : false } }
}
```

## Missing documents

Indexers extract documents or rows from an external [data source](/rest/api/searchservice/create-data-source) and create *search documents*, which are then indexed by the search service. Occasionally, a document that exists in data source fails to appear in a search index. This unexpected result can occur due to the following reasons:

* The document was updated after the indexer was run. If your indexer is on a [schedule](/rest/api/searchservice/create-indexer#indexer-schedule), it eventually reruns and picks up the document.
* The indexer timed out before the document could be ingested. There are [maximum processing time limits](search-limits-quotas-capacity.md#indexer-limits) after which no documents are processed. You can check indexer status in the portal or by calling [Get Indexer Status (REST API)](/rest/api/searchservice/get-indexer-status).
* [Field mappings](/rest/api/searchservice/create-indexer#fieldmappings) or [AI enrichment](./cognitive-search-concept-intro.md) have changed the document and its articulation in the search index is different from what you expect.
* [Change tracking](/rest/api/searchservice/create-data-source#data-change-detection-policies) values are erroneous or prerequisites are missing. If your high watermark value is a date set to a future time, then any documents that have an earlier date are skipped by the indexer. You can determine your indexer's change tracking state using the 'initialTrackingState' and 'finalTrackingState' fields in the [indexer status](/rest/api/searchservice/get-indexer-status#indexer-execution-result). Indexers for Azure SQL and MySQL must have an index on the high water mark column of the source table, or queries used by the indexer might time out. 

> [!TIP]
> If documents are missing, check the [query](/rest/api/searchservice/search-documents) you are using to make sure it isn't excluding the document in question. To query for a specific document, use the [Lookup Document REST API](/rest/api/searchservice/lookup-document).

## Missing content from Blob Storage

The blob indexer [finds and extracts text from blobs in a container](search-howto-indexing-azure-blob-storage.md). Some problems with extracting text include:

* The document only contains scanned images. PDF blobs that have non-text content, such as scanned images (JPGs), don't produce results in a standard blob indexing pipeline. If you have image content with text elements, you can use [OCR or image analysis](cognitive-search-concept-image-scenarios.md) to find and extract the text.

* The blob indexer is configured to only index metadata. To extract content, the blob indexer must be configured to [extract both content and metadata](search-howto-indexing-azure-blob-storage.md#PartsOfBlobToIndex):


```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "dataToExtract" : "contentAndMetadata" } }
}
```

## Missing content from Azure Cosmos DB

Azure AI Search has an implicit dependency on Azure Cosmos DB indexing. If you turn off automatic indexing in Azure Cosmos DB, Azure AI Search returns a successful state, but fails to index container contents. For instructions on how to check settings and turn on indexing, see [Manage indexing in Azure Cosmos DB](../cosmos-db/how-to-manage-indexing-policy.md#use-the-azure-portal).

## Document count discrepancy between the data source and index

An indexer might show a different document count than either the data source, the index itself, or count in your code. Here are some possible reasons why this behavior can occur:

- The index can lag in showing the real document count, especially in the portal.
- The indexer has a Deleted Document Policy. The deleted documents get counted by the indexer if the documents are indexed before they get deleted.
- If the ID column in the data source isn't unique. This applies to data sources that have the concept of columns, such as Azure Cosmos DB.
- If the data source definition has a different query than the one you're using to estimate the number of records. In example, in your database, you're querying the database record count, while in the data source definition query, you might be selecting just a subset of records to index.
- The counts are being checked at different intervals for each component of the pipeline: data source, indexer and index.
- The data source has a file that's mapped to many documents. This condition can occur when [indexing blobs](search-howto-index-json-blobs.md) and "parsingMode" is set to **`jsonArray`** and **`jsonLines`**.

## Documents processed multiple times

Indexers use a conservative buffering strategy to ensure that every new and changed document in the data source is picked up during indexing. In certain situations, these buffers can overlap, causing an indexer to index a document two or more times resulting in the processed documents count to be more than actual number of documents in the data source. This behavior does **not** affect the data stored in the index, such as duplicating documents, only that it can take longer to reach eventual consistency. This condition is especially prevalent if any of the following criteria are true:

- On-demand indexer requests are issued in quick succession
- The data source's topology includes multiple replicas and partitions (one such example is discussed [here](../cosmos-db/consistency-levels.md))
- The data source is an Azure SQL database and the column chosen as "high water mark" is of type `datetime2`

Indexers aren't intended to be invoked multiple times in quick succession. If you need updates quickly, the supported approach is to push updates to the index while simultaneously updating the data source. For on-demand processing, we recommend that you pace your requests in five-minute intervals or more, and run the indexer on a schedule.

### Example of duplicate document processing with 30 second buffer

Conditions under which a document is processed twice is explained in the following timeline that notes each action and counter action. The following timeline illustrates the issue:

| Timeline (hh:mm:ss) | Event | Indexer High Water Mark | Comment |
|---------------------|-------|-------------------------|---------|
| 00:01:00 | Write `doc1` to data source with eventual consistency | `null` | Document timestamp is 00:01:00. |
| 00:01:05 | Write `doc2` to data source with eventual consistency | `null` | Document timestamp is 00:01:05. |
| 00:01:10 | Indexer starts | `null` | |
| 00:01:11 | Indexer queries for all changes before 00:01:10; the replica that the indexer queries happens to be only aware of `doc2`; only `doc2` is retrieved | `null` | Indexer requests all changes before starting timestamp but actually receives a subset. This behavior necessitates the look back buffer period. |
| 00:01:12 | Indexer processes `doc2` for the first time | `null` | |
| 00:01:13 | Indexer ends | 00:01:10 | High water mark is updated to starting timestamp of current indexer execution. |
| 00:01:20 | Indexer starts | 00:01:10 | |
| 00:01:21 | Indexer queries for all changes between 00:00:40 and 00:01:20; the replica that the indexer queries happens to be aware of both `doc1` and `doc2`; retrieves `doc1` and `doc2` | 00:01:10 | Indexer requests for all changes between current high water mark minus the 30 second buffer, and starting timestamp of current indexer execution. |
| 00:01:22 | Indexer processes `doc1` for the first time | 00:01:10 | |
| 00:01:23 | Indexer processes `doc2` for the second time | 00:01:10 | |
| 00:01:24 | Indexer ends | 00:01:20 | High water mark is updated to starting timestamp of current indexer execution. |
| 00:01:32 | Indexer starts | 00:01:20 | |
| 00:01:33 | Indexer queries for all changes between 00:00:50 and 00:01:32; retrieves `doc1` and `doc2` | 00:01:20 | Indexer requests for all changes between current high water mark minus the 30 second buffer, and starting timestamp of current indexer execution. |
| 00:01:34 | Indexer processes `doc1` for the second time | 00:01:20 | |
| 00:01:35 | Indexer processes `doc2` for the third time | 00:01:20 | |
| 00:01:36 | Indexer ends | 00:01:32 | High water mark is updated to starting timestamp of current indexer execution. |
| 00:01:40 | Indexer starts | 00:01:32 | |
| 00:01:41 | Indexer queries for all changes between 00:01:02 and 00:01:40; retrieves `doc2` | 00:01:32 | Indexer requests for all changes between current high water mark minus the 30 second buffer, and starting timestamp of current indexer execution. |
| 00:01:42 | Indexer processes `doc2` for the fourth time | 00:01:32 | |
| 00:01:43 | Indexer ends | 00:01:40 | Notice this indexer execution started more than 30 seconds after the last write to the data source and also processed `doc2`. This is the expected behavior because if all indexer executions before 00:01:35 are eliminated, this becomes the first and only execution to process `doc1` and `doc2`. |

In practice, this scenario only happens when on-demand indexers are manually invoked within minutes of each other, for certain data sources. It can result in mismatched numbers (like the indexer processed 345 documents total according to the indexer execution stats, but there are 340 documents in the data source and index) or potentially increased billing if you're running the same skills for the same document multiple times. Running an indexer using a schedule is the preferred recommendation.


## Indexing documents with sensitivity labels

If you have [sensitivity labels set on documents](/microsoft-365/compliance/sensitivity-labels), you might not be able to index them. If you're getting errors, remove the labels prior to indexing.


## See also

* [Troubleshooting common indexer errors and warnings](cognitive-search-common-errors-warnings.md)
* [Monitor indexer-based indexing](search-howto-monitor-indexers.md)

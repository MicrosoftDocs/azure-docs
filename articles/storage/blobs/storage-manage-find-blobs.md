---
title: Manage and find data on Azure Blob Storage with Blob Index (Preview) 
description: Learn how to use Blob Index tags to categorize, manage, and query to discover blob objects.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 04/24/2020
ms.service: storage
ms.subservice: common
ms.topic: conceptual
ms.reviewer: hux
---

# Manage and find data on Azure Blob Storage with Blob Index (Preview)

As datasets get larger and larger, finding a specific object in a sea of data can be difficult and frustrating. Blob Index provides data management and discovery capabilities using key-value index tag attributes, which allow you to categorize and find objects within a single container or across all containers in your storage account. Later, as the requirements of data changes, objects can be dynamically recategorized by updating their index tags while remaining in-place with their current container organization. Utilizing Blob Index can simplify development by consolidating your blob data and associated index attributes on the same service; allowing you to build efficient and scalable applications using native features. 

Blob Index lets you:

- Dynamically categorize your blobs using key-value index tags for data management
- Quickly find specific tagged blobs across a single container or an entire storage account
- Specify conditional behaviors for blob APIs based on the evaluation of index tags
- Utilize index tags for advanced controls on blob platform features like [lifecycle management](storage-lifecycle-management-concepts.md)

Consider the scenario where you have millions of blobs in your storage account written and accessed by many different applications. You want to find all related data from a single project, but you aren't sure what is in scope as the data can be spread across multiple containers with different blob naming conventions. However, you know that your applications upload all data with tags based on their respective project and identifying description. Instead of searching through millions of blobs and comparing names and properties, you can simply use `Project = Contoso` as your discovery criteria. Blob Index will filter all containers across your entire storage account to quickly find and return just the set of fifty blobs from `Project = Contoso`. 

To get started with examples on how to use Blob Index, see [Utilize Blob Index to manage and find data](storage-blob-index-how-to.md).

## Blob Index tags and Data Management

Container and blob name prefixes are one-dimensional categorization for your stored data. Blob Index now allows for multi-dimension categorization for all your [blob data types (Block, Append, or Page)](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs) with applied attribute tags. This multi-dimensional categorization is natively indexed and made available for you to quickly query and find your data.

Consider the following five blobs in your storage account:
>
> container1/transaction.csv  
> container2/campaign.docx  
> photos/bannerphoto.png  
> archives/completed/2019review.pdf  
> logs/2020/01/01/logfile.txt  
>

These blobs are currently separated using a prefix of container/virtual folder/blob name. With Blob Index, you can set an index tag attribute of `Project = Contoso` on these five blobs to categorize them together while maintaining their current prefix organization. This eliminates the need to move data by exposing the ability to filter and find data using the storage platform's multi-dimensional index.

## Setting Blob Index tags

Blob Index tags are key-value attributes that can be applied to new or existing objects within your storage account. You may specify the index tags during the upload process using the PutBlob, PutBlockList, or CopyBlob operations and the optional x-ms-tags header. If you already have blobs in your storage account, you may call SetBlobTags with a formatted XML document specifying the blob index tag attributes in the body of the request. 

Consider the following examples tags that can be set

You can apply a single tag on your blob to describe when your data was finished processing.
>
> "processedDate" = '2020-01-01'
>
You can apply multiple tags on your blob to be more descriptive of the data.
>
> "Project" = 'Contoso'  
> "Classified" = 'True'  
> "Status" = 'Unprocessed'  
> "Priority" = '01' 
>

To modify the existing index tag attributes, you must first retrieve the existing tag attributes, modify the tag attributes, and replace with the SetBlobTags operation. To remove all index tags from the blob, call the SetBlobTags operation with no tag attributes specified. As blob index tags are a sub-resource to the blob data contents, SetBlobTags does not modify any underlying content and does not change the blob's last-modified-time.

The following limits apply to Blob Index tags:
- Each blob can have up to 10 blob index tags
- Tag keys must be between 1 to 128 characters
- Tag values must be between 0 to 256 characters
- Tag keys and values are case-sensitive
- Tag keys and values only support string data types; any numbers, date, times, or special characters will be saved as strings
- Tag keys and values must adhere to the following naming rules:
  - Alpha numeric characters: a-z, A-Z, 0-9
  - Special characters: space, plus, minus, period, colon, equals, underscore, forward slash

## Getting and Listing Blob Index tags

Blob index tags are stored as a sub-resource alongside the blob data and can be retrieved independently from the underlying blob data content. Once set, the blob index tags for a single blob can be retrieved and reviewed immediately with the GetBlobTags operation. The ListBlobs operation with `include:tags` parameter will also return all blobs within a container along with their applied blob index tags. 

For any blobs with at least 1 blob index tag, the x-ms-tag-count is returned in the ListBlobs, GetBlob, and GetBlobProperties operations indicating the count of blob index tags that exists on the blob.

## Finding data using Blob Index tags

With blob index tags set on your blobs, the indexing engine exposes those key/value attributes into a multi-dimensional index. While your index tags exist on the blob and can be retrieved immediately, it may take some time before the blob index is updated with the refreshed index tag attributes. Once the blob index is updated, you can now take advantage of the native query and discovery capabilities offered by blob storage.

The FindBlobsByTags operation enables you to get a filtered return set of blobs whose index tags match a given blob index query expression. Blob Index supports filtering across all containers within your storage account or you can scope the filtering to just a single container. Since all the blob index tag keys and values are strings, the supported relational operators use a lexicographic sorting on the index tag values.

The following criteria applies to blob index filtering:
-	Tag keys should be enclosed in double quotes (")
-	Tag values and container names should be enclosed in single quotes (')
-	The @ character is only allowed for filtering on a specific container name (i.e. @container = 'ContainerName')
- Filters are applied with lexicographic sorting on strings
-	Same sided range operations on the same key are invalid (i.e. "Rank" > '10' AND "Rank" >= '15')
- When using REST to create a filter expression, characters should be URI encoded

The below table shows all the valid operators for FindBlobsByTags:

|  Operator  |  Description  | Example |
|------------|---------------|---------|
|     =      |     Equal     | "Status" = 'In Progress' | 
|     >      | 	Greater than |	"Date" > '2018-06-18' |
|     >=     | 	Greater than or equal |	"Priority" >= '5' | 
|     <      | 	Less than 	 | "Age" < '32' |
|     <=     | 	Less than or equal  | "Company" <= 'Contoso' |
|    AND     | 	Logical and  | "Rank" >= '010' AND "Rank" < '100' |
| @container |	Scope to a specific container	| @container = 'videofiles' AND "status" = 'done' |

> [!NOTE]
> Be familiar with lexicographical ordering when setting and querying on tags.
> - Numbers are sorted before letters. Numbers are sorted based on the first digit.
> - Uppercase letters are sorted before lowercase letters.
> - Symbols are not standard. Some symbols are sorted before numeric values. Other symbols are sorted before or after letters.
>

## Conditional Blob operations with Blob Index tags
In REST versions 2019-10-10 and higher, most [blob service APIs](https://docs.microsoft.com/rest/api/storageservices/operations-on-blobs) now support a conditional header, x-ms-if-tags, such that the operation will only succeed if the specified blob index condition is met. If the condition is not met, you will get `error 412: The condition specified using HTTP conditional header(s) is not met`.

The x-ms-if-tags header may be combined with the other existing HTTP conditional headers (If-Match, If-None-Match, etc.).  If multiple conditional headers are provided in a request, they all must evaluate true for the operation to succeed.  All conditional headers are effectively combined with logical AND. 

The below table shows all the valid operators for conditional operations:

|  Operator  |  Description  | Example |
|------------|---------------|---------|
|     =      |     Equal     | "Status" = 'In Progress' |
|     <>     | 	 Not equal 	 | "Status" <> 'Done'  | 
|     >      | 	Greater than |	"Date" > '2018-06-18' |
|     >=     | 	Greater than or equal |	"Priority" >= '5' | 
|     <      | 	Less than 	 | "Age" < '32' |
|     <=     | 	Less than or equal  | "Company" <= 'Contoso' |
|    AND     | 	Logical and  | "Rank" >= '010' AND "Rank" < '100' |
|     OR     |	Logical or   | "Status" = 'Done' OR "Priority" >= '05' |

> [!NOTE]
> There are two additional operators, not equal and logical or, that are allowed in the conditional x-ms-if-tags header for blob operation but do not exist in the FindBlobsByTags operation.

## Platform integrations with Blob Index tags

Blob Index’s tags not only help you categorize, manage, and search on your blob data but also provide integrations with other Blob service features, such as [lifecycle management](storage-lifecycle-management-concepts.md). 

### Lifecycle Management

Using the new blobIndexMatch as a rule filter in lifecycle management, you can move data to cooler tiers or delete data based on the index tags applied to your blobs. This allows you to be more granular in your rules and only move or delete data if they match the specified tags criteria.

You can set a blob index match as a standalone filter set in a lifecycle rule to apply actions on tagged data. Or you can combine both a prefix match and a blob index match to match more specific data sets. Applying multiple filters to a lifecycle rule treats is a logical AND operation such that the action will only apply if all filter criteria match. 

The following sample lifecycle management rule applies to block blobs in the container 'videofiles' and tiers blobs to archive storage only if the data matches the blob index tag criteria of ```"Status" = 'Processed' AND "Source" == 'RAW'```.

# [Portal](#tab/azure-portal)
![Blob Index match rule example for Lifecycle management in Azure portal](media/storage-blob-index-concepts/blob-index-lifecycle-management-example.png)
   
# [JSON](#tab/json)
```json
{
    "rules": [
        {
            "enabled": true,
            "name": "ArchiveProcessedSourceVideos",
            "type": "Lifecycle",
            "definition": {
                "actions": {
                    "baseBlob": {
                        "tierToArchive": {
                            "daysAfterModificationGreaterThan": 0
                        }
                    }
                },
                "filters": {
                    "blobIndexMatch": [
                        {
                            "name": "Status",
                            "op": "==",
                            "value": "Processed"
                        },
                        {
                            "name": "Source",
                            "op": "==",
                            "value": "RAW"
                        }
                    ],
                    "blobTypes": [
                        "blockBlob"
                    ],
                    "prefixMatch": [
                        "videofiles/"
                    ]
                }
            }
        }
    ]
}
```
---

## Permissions and Authorization

You can authorize access to Blob Index using one of the following approaches:

- By using role-based access control (RBAC) to grant permissions to an Azure Active Directory (Azure AD) security principal. Microsoft recommends using Azure AD for superior security and ease of use. For more information about using Azure AD with blob operations, see [Authorize access to blobs and queues using Azure Active Directory](../common/storage-auth-aad.md).
- By using a shared access signature (SAS) to delegate access to blob index. For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).
- By using the account access keys to authorize operations with Shared Key. For more information, see [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key).

Blob Index tags are a sub-resource to the blob data. A user with permissions or a SAS token to read or write blobs may not have access to the blob index tags. 

### Role-Based Access Control 
Callers using an [AAD identity](../common/storage-auth-aad.md) may be granted the following permissions to operate on blob index tags. 

|   Blob operations   |  RBAC action   |
|---------------------|----------------|
| Find Blobs by Tags  | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action |
| Set Blob Tags 	    | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | 
| Get Blob Tags 	    | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read |

Additional permissions separate from the underlying blob data are required to operate over the tags. 
The Storage Blob Data Contributor role will be granted all three of these permissions. The Storage Blob Data Reader will be granted the only Find Blobs by Tags and Get Blob Tags permissions.

### SAS Permissions 
Callers using a [shared access signature (SAS)](../common/storage-sas-overview.md) may be granted scoped permissions to operate on blob tags.
#### Blob SAS
The following permissions may be granted in a Blob service SAS to allow access to blob index tags. Blob Read and Write permissions alone are not enough to allow reading or writing its index tags.

|  Permission  |  URI Symbol  | Allowed operations |
|--------------|--------------|--------------------|
|  Index tags  |      t 	    | Get and Set blob index tags for a blob |

#### Container SAS
The following permissions may be granted in Container service SAS to allow filtering on blob tags.  The Blob List permission is not enough to allow filtering blobs by their index tags.

|  Permission  |  URI Symbol  | Allowed operations |
|--------------|--------------|--------------------|
| Index tags 	 |      f 	    | Find Blobs with blob index tags | 

## Choosing Between Metadata and Blob Index Tags 
Both Blob Index tags and metadata provide the ability to store arbitrary user-defined key/value properties alongside a blob resource. Both may be retrieved and set directly, without returning or altering the content of the blob. It is possible to utilize both metadata and index tags.

However only Blob Index tags are automatically indexed and made queryable by the native blob service. Metadata cannot be natively indexed and queried unless you utilize a separate service such as [Azure Search](../../search/search-blob-ai-integration.md). Blob Index tags also have additional permissions for reading/filtering and writing that are separate from the underlying blob data. Metadata utilizes the same permissions as the blob and is returned as HTTP headers in the GetBlob or GetBlobProperties operations. Blob Index tags are encrypted at rest using a [Microsoft-managed key](../common/storage-service-encryption.md) whereas metadata is encrypted at rest using the same encryption key specified for blob data. 

The following table summarizes the differences between Metadata and Blob Index tags:

|              |   Metadata   |   Blob Index tags  |
|--------------|--------------|--------------------|
| **Limits** 	     | No numerical limit; 8 KB total; case insensitive	| 10 tags per blob max; 768 bytes per tag; case sensitive |
| **Updates** 	   | Not allowed on archive tier; SetBlobMetadata replaces all existing metadata; SetBlobMetadata changes the blob’s last-modified-time | Allowed for all access tiers; SetBlobTags replaces all existing tags; SetBlobTags does not change the blob’s last-modified-time |
| **Storage**	     | Stored with the blob data | 	Sub-resource to the blob data | 
| **Indexing & Querying** |	N/A natively; must use a separate service such as Azure Search | Yes, native indexing and querying capabilities built into blob storage |
| **Encryption** | Encrypted at rest with the same encryption key used for blob data |	Encrypted at rest with a Microsoft-managed encryption key |
| **Pricing** 	| Size of metadata is included in the storage costs for a blob |	Fixed cost per index tag | 
| **Header response** |	Metadata returned as headers in GetBlob and GetBlobProperties |	TagCount returned in GetBlob or GetBlobProperties; Tags returned only in GetBlobTags and ListBlobs |
| **Permissions**  |	Read or write permissions to blob data extends to metadata |	Additional permissions are required to read/filter or write tags |

## Pricing
Blob Index pricing is currently in public preview and subject to change for general availability. Customers are charged for the total number of blob index tags within a storage account, averaged over the month. There is no cost for the indexing engine. Requests to SetBlobTags, GetBlobTags, and FindBlobsByTags are charged in accordance to their respective operation types. See [Block Blob pricing to learn more](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Regional availability and storage account support

Blob Index is currently only available on General Purpose v2 (GPv2) accounts with hierarchical namespace (HNS) disabled. General Purpose (GPV1) accounts are not supported but you can upgrade any GPv1 account to a GPv2 account. For more information about storage accounts, see [Azure storage account overview](../common/storage-account-overview.md).

In public preview, Blob Index is currently only available in the following select regions:
- Canada Central
- Canada East
- France Central
- France South

To get started, see [Utilize Blob Index to manage and find data](storage-blob-index-how-to.md).

> [!IMPORTANT]
> See the conditions section of this article. To enroll in the preview, see the Register your subscription section of this article. You must register your subscription before you can use Blob Index on your storage accounts.

### Register your subscription (Preview)
Because the Blob Index is only in public preview, you'll need to register your subscription before you can use the feature. To submit a request, run the following PowerShell or CLI commands.

#### Register by using PowerShell
```powershell
Register-AzProviderFeature -FeatureName BlobIndex -ProviderNamespace Microsoft.Storage
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

#### Register by using Azure CLI
```azurecli
az feature register --namespace Microsoft.Storage --name BlobIndex
az provider register --namespace 'Microsoft.Storage'
```

## Conditions and known issues (Preview)
This section describes known issues and conditions in the current public preview of the Blob Index. As with most previews, this feature should not be used for production workloads until it reaches GA as behaviors may change.

-	For preview, you must first register your subscription before you can use Blob Index for your storage account in the preview regions.
-	Only GPv2 accounts are currently supported in preview. Blob, BlockBlobStorage, and HNS enabled DataLake Gen2 accounts are not currently supported with Blob Index. GPv1 accounts will not be supported.
-	Uploading page blobs with index tags currently does not persist the tags. You must set the tags after uploading a page blob.
-	When filtering is scoped to a single container, the @container can only be passed if all the index tags in the filter expression are equality checks (key=value). 
-	When using the range operator with the AND condition, you can only specify the same index tag key name (Age > ‘013’ AND Age < ‘100’).
-	Versioning and Blob Index are currently not supported. Blob Index tags are preserved for versions but are currently not passed to the blob index engine.
-	Account failover is currently not supported. The blob index may not update properly after failover.
-	Lifecycle management currently only supports equality checks with Blob Index Match.
-	CopyBlob does not copy blob index tags from the source blob to the new destination blob. You can specify the tags you want applied to the destination blob during the copy operation. 
-	Tags are persisted on snapshot creation; however promoting a snapshot is currently not supported and may result in an empty tag set.

## FAQ

### Can Blob Index help me filter and query content inside my blobs? 
No, Blob Index tags can help you find the blobs that you are looking for. If you need to search within your blobs, use Query Acceleration or Azure Search.

### Are there any special considerations regarding Blob Index tag values?
Blob Index tags only support string data types and querying returns results with lexicographical ordering. For numbers, it is recommended to zero pad the number. For date and times, it is recommended to store as an ISO 8601 compliant format.

### Are Blob Index tags and Azure Resource Manager tags related?
No, Azure Resource Manager tags help organize control plane resources such as subscriptions, resource groups, and storage accounts. Blob Index tags provide object management and discovery on data plane resources such as blobs within a storage account.

## Next steps

See an example of how to utilize Blob Index. See [Utilize Blob Index to manage and find data](storage-blob-index-how-to.md)


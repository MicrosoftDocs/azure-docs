---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets in Media Services - Azure | Microsoft Docs
description: This article gives an explanation of what assets are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 12/12/2018
ms.author: juliako
ms.custom: seodec18

---

# Assets

In Azure Media Services, an [Asset](https://docs.microsoft.com/rest/api/media/assets) contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an Asset, they can be used in the Media Services encoding, streaming, analyzing content workflows. For more information, see the [Upload digital files into Assets](#upload-digital-files-into-assets) section below.

An Asset is mapped to a blob container in the [Azure Storage account](storage-account-concept.md) and the files in the Asset are stored as block blobs in that container. Media Services supports Blob tiers when the account uses General-purpose v2 (GPv2) storage. With GPv2, you can move files to [Cool or Archive storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers). **Archive** storage is suitable for archiving source files when no longer needed (for example, after they have been encoded).

The **Archive** storage tier is only recommended for very large source files that have already been encoded and the encoding Job output was put in an output blob container. The blobs in the output container that you want to associate with an Asset and use to stream or analyze your content, must exist in a **Hot** or **Cool** storage tier.

## Asset definition

The following table shows the Asset's properties and gives their definitions.

|Name|Description|
|---|---|
|id|Fully qualified resource ID for the resource.|
|name|The name of the resource.|
|properties.alternateId |The alternate ID of the Asset.|
|properties.assetId |The Asset ID.|
|properties.container |The name of the asset blob container.|
|properties.created |The creation date of the Asset.<br/> Datetime is always in UTC format.|
|properties.description|The Asset description.|
|properties.lastModified |The last modified date of the Asset. <br/> Datetime is always in UTC format.|
|properties.storageAccountName |The name of the storage account.|
|properties.storageEncryptionFormat |The Asset encryption format. One of None or MediaStorageEncryption.|
|type|The type of the resource.|

For a full definition, see [Assets](https://docs.microsoft.com/rest/api/media/assets).

## Upload digital files into Assets

One of the common Media Services workflows:

1. Use the Media Services v3 API to create a new "input" Asset. This operation creates a container in the storage account associated with your Media Services account. The API returns the container name (for example, `"container": "asset-b8d8b68a-2d7f-4d8c-81bb-8c7bbbe67ee4"`).
   
    If you already have a blob container that you want to associate with an Asset, you can specify the container name when creating the Asset. Media Services currently only supports blobs in the container root and not with paths in the file name. Thus, a container with the "input.mp4" file name will work. However, a container with the "videos/inputs/input.mp4" file name, will not work.

    You can use the Azure CLI to upload directly to any storage account and container that you have rights to in your subscription. <br/>The container name must be unique and follow storage naming guidelines. The name doesn't have to follow the Media Services Asset container name (Asset-GUID) formatting. 
    
    ```azurecli
    az storage blob upload -f /path/to/file -c MyContainer -n MyBlob
    ```
2. Get a SAS URL with read-write permissions that will be used to upload digital files into the Asset container. You can use the Media Services API to [list the asset container URLs](https://docs.microsoft.com/rest/api/media/assets/listcontainersas).
3. Use the Azure Storage APIs or SDKs (for example, the [Storage REST API](../../storage/common/storage-rest-api-auth.md), [JAVA SDK](../../storage/blobs/storage-quickstart-blobs-java-v10.md), or [.NET SDK](../../storage/blobs/storage-quickstart-blobs-dotnet.md)) to upload files into the Asset container. 
4. Use Media Services v3 APIs to create a Transform and a Job to process your "input" Asset. For more information, see [Transforms and Jobs](transform-concept.md).
5. Stream the content from the "output" asset.

> [!TIP]
> For a full .NET example that shows how to: create the Asset, get a writable SAS URL to the Asset’s container in storage, upload the file into the container in storage using the SAS URL, see [Create a job input from a local file](job-input-from-local-file-how-to.md).

### Create a new asset

#### REST

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{amsAccountName}/assets/{assetName}?api-version=2018-07-01
```

For a REST example, see the [Create an Asset with REST](https://docs.microsoft.com/rest/api/media/assets/createorupdate#examples) example.

The example shows how to create the **Request Body** where you can specify useful information like description, container name, storage account, and other information.

#### cURL

```cURL
curl -X PUT \
  'https://management.azure.com/subscriptions/00000000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.Media/mediaServices/amsAccountName/assets/myOutputAsset?api-version=2018-07-01' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "properties": {
    "description": "",
  }
}'
```

#### .NET

```csharp
 Asset asset = await client.Assets.CreateOrUpdateAsync(resourceGroupName, accountName, assetName, new Asset());
```

For a full example, see [Create a job input from a local file](job-input-from-local-file-how-to.md). In Media Services v3, a job's input can also be created from HTTPS URLs (see [Create a job input from an HTTPS URL](job-input-from-http-how-to.md)).

## Filtering, ordering, paging

Media Services supports the following OData query options for Assets: 

* $filter 
* $orderby 
* $top 
* $skiptoken 

Operator description:

* Eq = equal to
* Ne = not equal to
* Ge = Greater than or equal to
* Le = Less than or equal to
* Gt = Greater than
* Lt = Less than

### Filtering/ordering

The following table shows how these options may be applied to the Asset properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|Supports: Eq, Gt, Lt|Supports: Ascending and Descending|
|properties.alternateId |Supports: Eq||
|properties.assetId |Supports: Eq||
|properties.container |||
|properties.created|Supports: Eq, Gt, Lt| Supports: Ascending and Descending|
|properties.description |||
|properties.lastModified |||
|properties.storageAccountName |||
|properties.storageEncryptionFormat | ||
|type|||

The following C# example filters on the created date:

```csharp
var odataQuery = new ODataQuery<Asset>("properties/created lt 2018-05-11T17:39:08.387Z");
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName, odataQuery);
```

### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 1000.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If Assets are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded). 

#### C# example

The following C# example shows how to enumerate through all the assets in the account.

```csharp
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.Assets.ListNextAsync(currentPage.NextPageLink);
}
```

#### REST example

Consider the following example of where $skiptoken is used. Make sure you replace *amstestaccount* with your account name and set the *api-version* value to the latest version.

If you request a list of Assets like this:

```
GET  https://management.azure.com/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01 HTTP/1.1
x-ms-client-request-id: dd57fe5d-f3be-4724-8553-4ceb1dbe5aab
Content-Type: application/json; charset=utf-8
```

You would get back a response similar to this:

```
HTTP/1.1 200 OK
 
{
"value":[
{
"name":"Asset 0","id":"/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/amstestaccount/assets/Asset 0","type":"Microsoft.Media/mediaservices/assets","properties":{
"assetId":"00000000-5a4f-470a-9d81-6037d7c23eff","created":"2018-12-11T22:12:44.98Z","lastModified":"2018-12-11T22:15:48.003Z","container":"asset-98d07299-5a4f-470a-9d81-6037d7c23eff","storageAccountName":"amsdevc1stoaccount11","storageEncryptionFormat":"None"
}
},
// lots more assets
{
"name":"Asset 517","id":"/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/amstestaccount/assets/Asset 517","type":"Microsoft.Media/mediaservices/assets","properties":{
"assetId":"00000000-912e-447b-a1ed-0f723913b20d","created":"2018-12-11T22:14:08.473Z","lastModified":"2018-12-11T22:19:29.657Z","container":"asset-fd05a503-912e-447b-a1ed-0f723913b20d","storageAccountName":"amsdevc1stoaccount11","storageEncryptionFormat":"None"
}
}
],"@odata.nextLink":"https:// management.azure.com/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$skiptoken=Asset+517"
}
```

You would then request the next page by sending a get request for:

```
https://management.azure.com/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$skiptoken=Asset+517
```

For more REST examples, see [Assets - List](https://docs.microsoft.com/rest/api/media/assets/list)

## Storage side encryption

To protect your Assets at rest, the assets should be encrypted by the storage side encryption. The following table shows how the storage side encryption works in Media Services:

|Encryption option|Description|Media Services v2|Media Services v3|
|---|---|---|---|
|Media Services Storage Encryption|AES-256 encryption, key managed by Media Services|Supported<sup>(1)</sup>|Not supported<sup>(2)</sup>|
|[Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)|Server-side encryption offered by Azure Storage, key managed by Azure or by customer|Supported|Supported|
|[Storage Client-Side Encryption](https://docs.microsoft.com/azure/storage/common/storage-client-side-encryption)|Client-side encryption offered by Azure storage, key managed by customer in Key Vault|Not supported|Not supported|

<sup>1</sup> While Media Services does support handling of content in the clear/without any form of encryption, doing so is not recommended.

<sup>2</sup> In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but will not allow creation of new ones.

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)

---
title: Access data in a blob access point
titleSuffix: Azure Blob Storage
description: Read data in a blob access point by using the Azure portal, the REST API, and Azure tools and services that read from Blob Storage.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/09/2026
# Customer intent: As a developer, I want to read data in a blob access point with the tools and services I already use, so that I don't need custom connectors.
---

# Access data in a blob access point

A blob access point behaves like a container with read-only blobs. Tools and services that read from Blob Storage can read the data in your data source without code changes, as long as they use the Blob Storage endpoint.

## Prerequisites

- A blob access point. To create one, see [Create a blob access point](blob-access-points-create.md).
- Network access to the storage account from your client. The network rules of the storage account apply to blob access points the same way that they apply to other containers. For more information, see [Networking considerations](blob-access-points-overview.md#networking-considerations).
- Permission to read blob data, such as the [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-reader) role. For other options, see [Authorize access to blob access points](blob-access-points-authorize.md).
- To browse data in the Azure portal, the Azure Resource Manager Reader role, or a role with more permissions, on the storage account. Storage Blob Data Reader alone doesn't let you open the storage account in the portal. For more information, see [Choose how to authorize access to blob data in the Azure portal](authorize-data-operations-portal.md).

## Browse data in the Azure portal

You can browse data in the Azure portal only in regions where the Azure portal experience for blob access points is available. In other supported regions, read data by using the REST API or another tool. See [Supported regions](blob-access-points-overview.md#supported-regions). To list blob access points with the REST API, see [Read data with the REST API](#read-data-with-the-rest-api).

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. Under **Data storage**, select **Containers**, and then select the **Blob access points** tab.

   The tab lists each blob access point with the configuration that it uses.

   :::image type="content" source="media/blob-access-points-access-data/containers-blob-access-points-tab.png" alt-text="Screenshot of the Blob access points tab on the Containers page of a storage account, with the tab highlighted." lightbox="media/blob-access-points-access-data/containers-blob-access-points-tab.png":::

1. Select a blob access point to browse its folders and blobs.

   The toolbar offers only **Refresh** and **Edit columns**, because the blobs are read-only. The page also shows the authentication method that the portal uses and the configuration that the blob access point uses.

   :::image type="content" source="media/blob-access-points-access-data/browse-blobs.png" alt-text="Screenshot of blobs from an external data source in a blob access point, with the read-only toolbar highlighted." lightbox="media/blob-access-points-access-data/browse-blobs.png":::

1. To work with a blob, select **More** (**...**) next to it. You can view its **Properties**, **Copy URL**, **Download** it, or **Generate SAS**.

## Read data with the REST API

Use the same Blob Storage operations that you use for any container. Use the blob access point name as the container name.

In each request, replace `<utc-date-time>` with the current UTC time in RFC 1123 format, such as `Mon, 02 Nov 2026 16:00:00 GMT`. Replace `<authorization>` with the value for your authorization method. For more information, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

To find the blob access points in a storage account, call [List Containers](/rest/api/storageservices/list-containers2). Use a role or shared access signature that's scoped to the storage account. One that's scoped to a single blob access point can't list blob access points.

```http
GET https://<storage-account>.blob.core.windows.net/?comp=list
x-ms-version: 2026-12-06
x-ms-date: <utc-date-time>
Authorization: <authorization>
```

The response lists containers and blob access points together. For each blob access point, the `Properties` element includes three more elements:

```xml
<Container>
  <Name>my-blob-access-point</Name>
  <Properties>
    <!-- Standard container properties -->
    <IsBlobAccessPointContainer>true</IsBlobAccessPointContainer>
    <BlobAccessPointConfigurationName>my-configuration</BlobAccessPointConfigurationName>
    <BlobAccessPointConfigurationUniqueId>configuration-guid</BlobAccessPointConfigurationUniqueId>
  </Properties>
</Container>
```

List Blobs, Get Blob Properties, and Get Blob don't need a specific `x-ms-version`. The examples use `2026-12-06`, but earlier versions also work.

To list blobs, call [List Blobs](/rest/api/storageservices/list-blobs):

```http
GET https://<storage-account>.blob.core.windows.net/<blob-access-point>?restype=container&comp=list
x-ms-version: 2026-12-06
x-ms-date: <utc-date-time>
Authorization: <authorization>
```

If the response includes a `NextMarker` value, add `&marker=<next-marker>` to the request to get the next page.

To get the properties of a blob, call [Get Blob Properties](/rest/api/storageservices/get-blob-properties):

```http
HEAD https://<storage-account>.blob.core.windows.net/<blob-access-point>/<blob-name>
x-ms-version: 2026-12-06
x-ms-date: <utc-date-time>
Authorization: <authorization>
```

To download a blob, call [Get Blob](/rest/api/storageservices/get-blob):

```http
GET https://<storage-account>.blob.core.windows.net/<blob-access-point>/<blob-name>
x-ms-version: 2026-12-06
x-ms-date: <utc-date-time>
Authorization: <authorization>
```

## Read data with tools and client libraries

Tools and client libraries that list, get properties of, and download blobs through the Blob Storage endpoint can read from a blob access point. Use the blob access point name wherever the tool asks for a container name.

## Use a shared access signature

To give an application time-limited read access, create a shared access signature (SAS). Grant only the permissions that reading needs, because blobs in a blob access point are read-only:

- **For a single blob**, create a blob SAS with **Read** permission. In the Azure portal, select **Generate SAS** for the blob.
- **For the whole blob access point**, create a container SAS with **Read** and **List** permissions. List permission works only on a container SAS.

For more information, see [Grant limited access to data with shared access signatures (SAS)](../common/storage-sas-overview.md).

## Use blob access points with Azure services

Azure services that read from Blob Storage can read from a blob access point, as long as they use the [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) operations. Check the following points before you connect a service:

- **Endpoint.** The service must read through the Blob Storage endpoint (`<storage-account>.blob.core.windows.net`). Requests through the Data Lake Storage endpoint (`<storage-account>.dfs.core.windows.net`) fail.
- **Identity.** Use a managed identity for the service, and assign it the Storage Blob Data Reader role on the storage account.
- **Change detection.** Change tracking isn't available for blob access points. Services that rely on it to detect new or deleted objects might not pick up changes.

## Read-only behavior and blob properties

- Write, update, and delete requests for blobs fail with status code `409` and error code `OperationNotSupportedForBlobAccessPoints`.
- The `ETag`, `Last-Modified`, and size (`Content-Length`) of each blob come from your data source. Get Blob Properties and Get Blob also return supported content headers when your data source provides them. The access tier is always reported as Hot. It doesn't reflect the storage class of the object in your data source. Other Blob Storage properties might be missing or show default values.
- Azure Storage reads data directly from your data source for every request, with no caching. Expect higher latency than when you read data that's stored in Azure Storage.
- Storage accounts that allow blob access point creation don't return List Blobs results in Apache Arrow format. For details, see [Apache Arrow listings](blob-access-points-known-issues.md#apache-arrow-listings).

For the full list, see [Limitations and known issues with blob access points](blob-access-points-known-issues.md).

## Related content

- [Authorize access to blob access points](blob-access-points-authorize.md)
- [Limitations and known issues with blob access points](blob-access-points-known-issues.md)
- [Troubleshoot blob access points](blob-access-points-troubleshoot.md)

---
title: Ingestion error codes for Microsoft Planetary Computer Pro
description: Learn how to troubleshoot ingestion errors when adding geospatial data to your Microsoft Planetary Computer Pro GeoCatalog.
author: prasadko
ms.author: prasadkomma
ms.service: planetary-computer-pro
ms.topic: error-reference
ms.date: 06/16/2025

#customer intent: As a GeoCatalog user, I want to understand ingestion error codes so that I can troubleshoot and resolve issues when ingesting geospatial data.
---

# Error codes: Microsoft Planetary Computer Pro ingestion

This article lists the error codes that can occur when ingesting or deleting geospatial data from a Microsoft Planetary Computer Pro GeoCatalog. Use this reference to identify the cause of ingestion failures and find resolution steps for each error type.

Ingestion errors can occur during various stages of the data ingestion process, including authentication, validation, transformation, and storage operations (adding and deleting). The following table provides detailed information about each error code, its meaning, and steps to resolve the issue.

## Table of Error Codes:

| Code | Explanation | Troubleshooting |
| --- | --- | --- |
| `AssetTransformationError` | The system failed to transform the asset during ingestion. | • Verify asset files are in a [supported format](./supported-data-types.md)<br>• Check that asset files aren't corrupted<br>• Ensure asset URLs are accessible from your ingestion source |
| `CogTransformationError` | The Cloud Optimized GeoTIFF (COG) transformation process failed. | • Ensure source files are valid GeoTIFF files with proper georeferencing information<br>• Validate your files with GDAL tools before ingestion |
| `CogTransformationTimeout` | The COG transformation process exceeded the time limit, typically with very large files. | • Split large files into smaller tiles<br>• Convert files to COG format before ingestion to skip transformation |
| `CanceledOperation` | The ingestion operation was manually canceled or terminated. | • No action required for intentional cancellations<br>• Check system logs for automatic cancellation reasons |
| `CollectionDoesNotExist` | The STAC collection ID referenced in your ingestion request doesn't exist. | • [Create the collection](./create-stac-collection.md) before attempting to ingest items into it |
| `EmptyAsset` | The asset file referenced in the STAC item has no content or is 0 bytes. | • Verify asset files exist at the specified URLs<br>• Ensure asset files contain valid data |
| `ErrorsInBatchOperation` | One or more items in a bulk ingestion operation failed. | • Check operation details for specific item failures<br>• Try ingesting failed items individually to isolate issues |
| `GenericHttpIngestionError` | A general HTTP error occurred while accessing ingestion resources. | • Check network connectivity<br>• Verify all asset URLs are accessible<br>• Review HTTP status codes in logs for specific issues |
| `GenericIngestionError` | An unspecified error occurred during ingestion. | • Check detailed error messages and system logs<br>• Contact support if the issue persists |
| `ImportFileValidationFailed` | The STAC catalog or collection file failed validation. | [Troubleshooting STAC validation errors](./troubleshooting-ingestion.md#cause-2-stac-metadata-validation-failed) |
| `IngestionAuthenticationFailed` | The GeoCatalog couldn't authenticate to the ingestion source. | [Troubleshooting access permission issues](./troubleshooting-ingestion.md#cause-1-geocatalog-cant-access-source-data) |
| `IngestionResourceConnectionFailed` | Unable to establish connection to the storage container. | [Troubleshooting access permission issues](./troubleshooting-ingestion.md#cause-1-geocatalog-cant-access-source-data) |
| `IngestionResourceForbidden` | The GeoCatalog lacks permissions to access the resource. | [Troubleshooting access permission issues](./troubleshooting-ingestion.md#cause-1-geocatalog-cant-access-source-data) |
| `IngestionResourceTimeout` | The request to access the ingestion source exceeded the time limit. | • Retry the operation<br>• Check Azure service health for outages<br>• Verify network connectivity between GeoCatalog and storage |
| `IngestionResourceUriNotFound` | The specified asset or catalog URI doesn't exist. | [Troubleshooting access permission issues](./troubleshooting-ingestion.md#cause-1-geocatalog-cant-access-source-data) |
| `InternalError` | An unexpected error occurred within the GeoCatalog service. | • Retry the operation<br>• If the error persists, contact support with the operation ID and timestamp |
| `InternalIntermitentError` | A temporary internal error occurred. | • Wait a few minutes and retry the operation<br>• These errors typically resolve automatically |
| `InvalidAssetHref` | The asset URL in the STAC item is malformed or invalid. | • Ensure all asset hrefs are properly formatted URLs<br>• Use absolute URLs, not relative paths<br>• Verify all URLs point to accessible resources |
| `InvalidGeoparquet` | The GeoParquet file doesn't meet the required format specifications. | • Validate GeoParquet files using appropriate tools<br>• Ensure files contain valid geometry columns |
| `InvalidInputData` | The STAC item or collection data contains invalid fields or values. | [Troubleshooting STAC validation errors](./troubleshooting-ingestion.md#cause-2-stac-metadata-validation-failed) |
| `InvalidStacCatalog` | The STAC catalog structure doesn't conform to specifications. | [Troubleshooting STAC validation errors](./troubleshooting-ingestion.md#cause-2-stac-metadata-validation-failed) |
| `ItemAlreadyExistsInCollection` | A STAC item with the same ID already exists in the collection. | • Use unique IDs for each item<br>• Delete the existing item before attempting to ingest again |
| `ItemSizeExceeded` | The STAC item JSON exceeds the maximum allowed size (1 MB). | • Reduce the number of assets or properties in the item<br>• Split large items into multiple smaller items |
| `ItemTransformationError` | Failed to process or transform the STAC item. | [Troubleshooting STAC validation errors](./troubleshooting-ingestion.md#cause-2-stac-metadata-validation-failed) |
| `ManagedIdentityInfoNotFound` | The specified managed identity doesn't exist or isn't associated with the GeoCatalog. | [Troubleshooting access permission issues](./troubleshooting-ingestion.md#cause-1-geocatalog-cant-access-source-data) |
| `NoRecordsToDelete` | The delete operation didn't find any matching records. | • Verify the STAC item IDs or search criteria used for deletion<br>• Confirm items exist in the specified collection |
| `NoRecordsToPatch` | The patch operation didn't find any matching records. | • Ensure the STAC items you're trying to update exist in the collection<br>• Verify item IDs are correct |
| `NoRecordsToUpdate` | The update operation didn't find any matching records. | • Verify that the items exist before attempting updates<br>• Check item IDs and collection IDs for accuracy |
| `OperationIsCanceled` | The ingestion operation was canceled before completion. | • Check if cancellation was intentional<br>• Review system logs for automatic cancellation triggers |
| `OperationNotExistsInCollection` | The referenced operation ID doesn't exist for this collection. | • Verify you're using the correct operation ID and collection |
| `PatchValidation` | The patch operation contains invalid data or operations. | • Ensure your patch follows [JSON Patch](https://jsonpatch.com/) specifications<br>• Verify patch operations target valid fields |
| `PostItemCollectionSizeExceeded` | The batch of items being posted exceeds the size limit. | • Reduce the number of items in a single request<br>• Use the [bulk ingestion API](./bulk-ingestion-api.md) for large datasets |
| `PublicAccessRestricted` | The storage resource doesn't allow public access. | [Troubleshooting access permission issues](./troubleshooting-ingestion.md#cause-1-geocatalog-cant-access-source-data) |
| `StacValidationFailed` | The STAC item doesn't meet validation requirements. | [Troubleshooting STAC validation errors](./troubleshooting-ingestion.md#cause-2-stac-metadata-validation-failed) |
| `TotalAssetsExceeded` | The STAC item contains too many assets (100 assets max). | • Reduce the number of assets per item to below 100<br>• Split into multiple items<br> |

## Related content

- [Troubleshooting data ingestion in Microsoft Planetary Computer Pro](./troubleshooting-ingestion.md)
- [Ingest data into Microsoft Planetary Computer Pro](./ingestion-overview.md)
- [Configure an ingestion source using managed identity](./set-up-ingestion-credentials-managed-identity.md)
- [Configure an ingestion source using SAS tokens](./set-up-ingestion-credentials-sas-tokens.md)
- [Create a STAC Item](./create-stac-item.md)
- [Bulk Ingestion API](./bulk-ingestion-api.md)
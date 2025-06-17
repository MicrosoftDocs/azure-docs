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

This article lists the error codes that can occur when ingesting geospatial data into a Microsoft Planetary Computer Pro GeoCatalog. Use this reference to identify the cause of ingestion failures and find resolution steps for each error type.

Ingestion errors can occur during various stages of the data ingestion process, including authentication, validation, transformation, and storage operations. The following table provides detailed information about each error code, its meaning, and steps to resolve the issue.

| Code | Error message | Details |
| --- | --- | --- |
| `AssetTransformationError` | Asset transformation failed | The system failed to transform the asset during ingestion. Verify that your asset files are in a [supported format](./supported-data-types.md) and aren't corrupted. Check that the asset URLs are accessible from your ingestion source. |
| `CogTransformationError` | Error occurred during COG transformation | The Cloud Optimized GeoTIFF (COG) transformation process failed. Ensure your source files are valid GeoTIFF files with proper georeferencing information. Try validating your files with GDAL tools before ingestion. |
| `CogTransformationTimeout` | COG transformation timed out | The transformation process exceeded the time limit. This error typically occurs with very large files. Consider splitting large files into smaller tiles or ensure your files are already in COG format to skip transformation. |
| `CanceledOperation` | Operation was canceled | The ingestion operation was manually canceled or terminated. No action required unless this error was unexpected, in which case check system logs for automatic cancellation reasons. |
| `CollectionDoesNotExist` | The specified collection doesn't exist | The STAC collection ID referenced in your ingestion request doesn't exist in the GeoCatalog. [Create the collection](./create-stac-collection.md) before attempting to ingest items into it. |
| `EmptyAsset` | Asset content is empty | The asset file referenced in the STAC item has no content or is 0 bytes. Verify that the asset files exist at the specified URLs and contain valid data. |
| `ErrorsInBatchOperation` | Multiple errors occurred in batch operation | One or more items in a bulk ingestion operation failed. Check the operation details for specific item failures. Consider ingesting failed items individually to isolate issues. |
| `GenericHttpIngestionError` | HTTP error during ingestion | A general HTTP error occurred while accessing ingestion resources. Check network connectivity and verify that all asset URLs are accessible. Review HTTP status codes in logs for specific issues. |
| `GenericIngestionError` | General ingestion error occurred | An unspecified error occurred during ingestion. Check the detailed error message and system logs for more information. Contact support if the issue persists. |
| `ImportFileValidationFailed` | Import file validation failed | The STAC catalog or collection file failed validation. Ensure your STAC JSON files conform to the [STAC specification](./stac-overview.md) and include all required fields. |
| `IngestionAuthenticationFailed` | Authentication to ingestion source failed | The GeoCatalog couldn't authenticate to the ingestion source. Verify your [ingestion source credentials](./ingestion-source.md) are valid. For SAS tokens, ensure the token isn't past its expiration date. |
| `IngestionResourceConnectionFailed` | Connection to ingestion source failed | Unable to establish connection to the storage container. Check that the storage account is accessible and that network policies allow connections from GeoCatalog. |
| `IngestionResourceForbidden` | Access to ingestion source is forbidden | The GeoCatalog lacks permissions to access the resource. Ensure your [managed identity has the Storage Blob Data Reader role](./set-up-ingestion-credentials-managed-identity.md) or that your SAS token has `read` permissions. |
| `IngestionResourceTimeout` | Ingestion source access timed out | The request to access the ingestion source exceeded the time limit. This error can indicate network issues or an unresponsive storage service. Retry the operation or check Azure service health. |
| `IngestionResourceUriNotFound` | Resource URI wasn't found | The specified asset or catalog URI doesn't exist. Verify all URLs in your STAC items point to existing files. Check for typos in file paths and ensure files haven't been moved or deleted. |
| `InternalError` | Internal service error occurred | An unexpected error occurred within the GeoCatalog service. Retry the operation. If the error persists, contact support with the operation ID and timestamp. |
| `InternalIntermitentError` | Intermittent internal error occurred | A temporary internal error occurred. Wait a few minutes and retry the operation. These errors typically resolve automatically. |
| `InvalidAssetHref` | Asset href URL is invalid | The asset URL in the STAC item is malformed or invalid. Ensure all asset hrefs are properly formatted URLs pointing to accessible resources. Use absolute URLs, not relative paths. |
| `InvalidGeoparquet` | GeoParquet file is invalid | The GeoParquet file doesn't meet the required format specifications. Validate your GeoParquet files using appropriate tools and ensure they contain valid geometry columns. |
| `InvalidInputData` | Input data for ingestion is invalid | The STAC item or collection data contains invalid fields or values. Review the [STAC item creation guide](./create-stac-item.md) and validate your JSON against the STAC schema. |
| `InvalidStacCatalog` | STAC catalog format is invalid | The STAC catalog structure doesn't conform to specifications. Ensure your catalog follows the [STAC catalog specification](https://github.com/radiantearth/stac-spec/blob/master/catalog-spec/catalog-spec.md) with proper links and child references. |
| `ItemAlreadyExistsInCollection` | Item with this ID already exists | A STAC item with the same ID already exists in the collection. Use unique IDs for each item or delete the existing item before attempting to ingest again. |
| `ItemSizeExceeded` | Item size exceeds limit | The STAC item JSON is too large. Reduce the number of assets or properties in the item. Consider splitting large items into multiple smaller items. |
| `ItemTransformationError` | Item transformation error occurred | Failed to process or transform the STAC item. Verify that all required STAC fields are present and that datetime values are properly formatted. |
| `ManagedIdentityInfoNotFound` | Managed identity information not found | The specified managed identity doesn't exist or isn't associated with the GeoCatalog. [Configure a managed identity](./set-up-ingestion-credentials-managed-identity.md) for your GeoCatalog. |
| `NoRecordsToDelete` | No records found to delete | The delete operation didn't find any matching records. Verify the STAC item IDs or search criteria used for deletion. |
| `NoRecordsToPatch` | No records found to patch | The patch operation didn't find any matching records. Ensure the STAC items you're trying to update exist in the collection. |
| `NoRecordsToUpdate` | No records found to update | The update operation didn't find any matching records. Verify that the items exist before attempting updates. |
| `OperationIsCanceled` | Operation was canceled | The ingestion operation was canceled before completion. Check if this was intentional or if system limits triggered automatic cancellation. |
| `OperationNotExistsInCollection` | Operation not found in collection | The referenced operation ID doesn't exist for this collection. Verify you're using the correct operation ID and collection. |
| `PatchValidation` | Patch validation failed | The patch operation contains invalid data or operations. Ensure your patch follows [JSON Patch](https://jsonpatch.com/) specifications and targets valid fields. |
| `PostItemCollectionSizeExceeded` | Item collection POST size exceeded | The batch of items being posted is too large. Reduce the number of items in a single request or use the [bulk ingestion API](./bulk-ingestion-api.md) for large datasets. |
| `PublicAccessRestricted` | The data you're trying to ingest restricted public access | The storage resource doesn't allow public access. Configure proper [ingestion sources](./ingestion-source.md) with appropriate authentication instead of using public URLs. |
| `StacValidationFailed` | STAC item validation failed | The STAC item doesn't meet validation requirements. Use STAC validation tools to check your items and ensure all required fields are present with valid values. |
| `TotalAssetsExceeded` | Maximum number of assets exceeded | The STAC item contains too many assets. Reduce the number of assets per item or split into multiple items. Check service limits for maximum assets per item. |

## Related content

- [Ingest data into Microsoft Planetary Computer Pro](./ingestion-overview.md)
- [Configure an ingestion source using managed identity](./set-up-ingestion-credentials-managed-identity.md)
- [Configure an ingestion source using SAS tokens](./set-up-ingestion-credentials-sas-tokens.md)
- [Create a STAC Item](./create-stac-item.md)
- [Bulk Ingestion API](./bulk-ingestion-api.md)
---
title: Ingestion Source Configuration in Microsoft Planetary Computer Pro
description: This article explains the concept of an ingestion source for Microsoft Planetary Computer Pro including the location, URI structure, and authentication methods.
author: prasadko
ms.author: prasadkomma
ms.service: planetary-computer-pro
ms.topic: concept-article
ms.date: 04/09/2025
#customer intent: As a Microsoft Planetary Computer Pro user, I want to understand what an Ingestion Source is.
ms.custom:
  - build-2025
---

# Ingestion source for Microsoft Planetary Computer Pro

Ingestion sources represent the location and authentication mechanisms required to [ingest data](./ingestion-overview.md) into a GeoCatalog resource. You can list and configure ingestion sources by selecting the **Settings** tab in the GeoCatalog web portal.

[ ![Screenshot of GeoCatalog Portal showing where the Settings button is located.](media/settings-link.png) ](media/settings-link.png#lightbox)

Once an ingestion source is set, your GeoCatalog will be able to securely ingest data from that ingestion source's location. 

## Ingestion source location

Microsoft Planetary Computer Pro currently only supports secure ingestion from [Azure Blob Storage Containers](/azure/storage/blobs/blob-containers-portal). When creating a new ingestion source, you'll need to provide a Blob Storage URI for the Container where your data is stored. A [Blob Storage URI](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata), or link, follows the following URI structure:

`https://{storage-account-name}.blob.core.windows.net/{container-name}`

| Storage Account | Container Name | Storage URI                                                |
|-----------------|---------------|------------------------------------------------------------|
| contosodata     | my data       | `https://contosodata.blob.core.windows.net/mydata`         |

>[!IMPORTANT]
> Don't include a trailing "/" after the container name.

## Ingestion source authentication mechanisms

Securely ingesting data requires users to provide an authentication mechanism which permits a GeoCatalog to read the data from a specific location. Planetary Computer Pro supports two mechanisms to support secure ingestion:

- [Managed identities](/entra/identity/managed-identities-azure-resources/overview) provide an automatically managed identity in Microsoft Entra ID for applications to use when connecting to resources that support Microsoft Entra authentication.

- [Shared Access Signatures (SAS)](/azure/storage/common/storage-sas-overview) are cryptographic credentials used to access a resource, such as Azure Blob Storage.

## Next steps
To securely ingest data, set up managed identity access:

> [!div class="nextstepaction"]
- [Configure an ingestion source for Microsoft Planetary Computer Pro using managed identity](./set-up-ingestion-credentials-managed-identity.md)

## Related content

The following quickstarts are available to assist users in setting up ingestion sources using either the managed identity or SAS token approach:

- [Set up Ingestion Credentials for Planetary Computer Pro using SAS Tokens](./set-up-ingestion-credentials-sas-tokens.md)
- [Adding an Item to a STAC Collection](./add-stac-item-to-collection.md)
- [Ingest data into GeoCatalog with the Bulk Ingestion API](./add-stac-item-to-collection.md)

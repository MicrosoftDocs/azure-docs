---
title: Ingestion source for Microsoft Planetary Computer Pro
description: This article explains the concept of an ingestion source for Microsoft Planetary Computer Pro including the location, URI structure, and authentication methods.
author: prasadko
ms.author: prasadkomma
ms.service: azure
ms.topic: concept-article
ms.date: 04/09/2025
#customer intent: As a Microsoft Planetary Computer Pro user, I want to understand what an Ingestion Source is. 
---

# Ingestion source for Microsoft Planetary Computer Pro

Ingestion sources are representations of the location and authentication mechanisms required to [ingest data](./ingestion-overview.md) into a GeoCatalog resource. Listing and configuring ingestion sources can be accessed by selecting the **Settings** tab in the web portal. 

:::image type="content" source="media/settings-link.png" alt-text="Screenshot of GeoCatalog Portal showing where the "Settings" button is located.":::

Once the ingestion source is set, data stored in that location is securely available to ingest from its original location into your GeoCatalog. 

## Ingestion source location

Microsoft Planetary Computer Pro (MPC Pro) currently only supports secure ingestion of data from [Azure Blob Storage Containers](/azure/storage/blobs/blob-containers-portal). A [Blob Storage URI](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata), or link, follows the following URI structure:

`https://{storage-account-name}.blob.core.windows.net/{container-name}`

| Storage Account | Container Name | Storage URI                                                |
|-----------------|---------------|------------------------------------------------------------|
| contosodata     | my data       | `https://contosodata.blob.core.windows.net/mydata`         |

>[!IMPORTANT]
> Don't include a trailing "/" after the container name.

## Ingestion source authentication mechanisms

Securely ingesting data requires users to provide an authentication mechanism which permits a GeoCatalog to read the data from a specific location. MPC Pro supports two mechanisms to support secure ingestion:

- [Managed identities](/entra/identity/managed-identities-azure-resources/overview) provide an automatically managed identity in Microsoft Entra ID for applications to use when connecting to resources that support Microsoft Entra authentication.

- [Shared Access Signatures (SAS)](/azure/storage/common/storage-sas-overview) are cryptographic credentials used to access a resource, such as Azure Blob Storage.


## Related content

The following quickstarts are available to assist users in setting up ingestion sources using either the managed identity or SAS token approach:

- [Setup Ingestion Credentials for MPC Pro using managed identity](./setup-ingestion-credentials-managed-identity.md)
- [Setup Ingestion Credentials for MPC Pro using SAS Tokens](./setup-ingestion-credentials-sas-tokens.md)
- [Ingestion overview](./ingestion-overview.md).
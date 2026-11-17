---
title: Data source requirements for blob access points
titleSuffix: Azure Blob Storage
description: Learn which data sources blob access points support, and the endpoint, credential, signing, and TLS requirements that your data source must meet.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: reference
ms.date: 11/13/2026
# Customer intent: As a storage administrator, I want to know what my data source needs, so that I can collect the right endpoint and credentials before I create a configuration.
---

# Data source requirements for blob access points

This article lists the data source types that blob access points support and the requirements that your data source must meet.

## Supported data source types

When you create a configuration, select the data source type that matches your platform. You can't change it later.

| Data source type in the Azure portal | `sourceType` value in the REST API |
|---|---|
| Azure NetApp Files | `AzureNetAppFiles` |
| Qumulo | `Qumulo` |
| Nasuni | `Nasuni` |
| Commvault | `Commvault` |

## Requirements

| Requirement | Details |
|---|---|
| Endpoint | An HTTPS endpoint on a supported data source that's compatible with the S3 API. Use a path-style URL that includes the bucket, such as `https://s3.contoso.com/bucket1`. Include the port if it isn't 443, such as `https://s3.contoso.com:8443/bucket1`. |
| Operations | The endpoint must support listing objects, getting object metadata, and getting objects, such as the S3 `ListObjectsV2`, `HeadObject`, and `GetObject` operations. |
| Request signing | The endpoint must accept requests signed with Signature Version 4 (SigV4). |
| Credentials | An access key ID and a secret access key with permission to list and read objects in the bucket. Read-only credentials are enough, and they're more secure. |
| Signing region | The region that the data source expects in signed requests. It can differ from your Azure region. The default is `us-east-1`. |
| TLS certificate | A certificate from a trusted certificate authority. You can allow self-signed certificates, but that option is less secure. Use it only for testing. |
| Network access | For a public connection, the endpoint must be reachable from Azure over the internet. If the data source restricts inbound traffic, allow the IP address ranges of the `Storage` service tag for the region of your storage account. For more information, see [Azure service tags overview](/azure/virtual-network/service-tags-overview). For a private connection, the endpoint must be reachable through a Private Link-enabled resource. See [Connect blob access points privately (preview)](blob-access-points-private-connectivity.md). |

## Set up your data source

Blob access points don't configure your data source. Your data source provider's documentation explains how to turn on the S3 API, create access keys, and install a TLS certificate. Follow that documentation, or work with your provider or your storage administrator, to get the following values:

- The source endpoint, as a path-style URL that includes the bucket.
- An access key ID and a secret access key with permission to list and read objects in the bucket.
- The signing region, if it isn't `us-east-1`.

For Azure NetApp Files, see [Configure object REST API in Azure NetApp Files](/azure/azure-netapp-files/object-rest-api-access-configure).

When you have these values, [create a configuration](blob-access-points-create.md#create-a-configuration).

## Related content

- [Create a blob access point](blob-access-points-create.md)
- [Connect blob access points privately (preview)](blob-access-points-private-connectivity.md)
- [Troubleshoot blob access points](blob-access-points-troubleshoot.md)

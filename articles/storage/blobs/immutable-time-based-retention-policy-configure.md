---
title: Configure time-based retention policies for blob data
titleSuffix: Azure Storage
description: Learn how to use WORM (Write Once, Read Many) support for Blob (object) storage to store data in a non-erasable, non-modifiable state for a specified interval.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/25/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: devx-track-azurepowershell
---

# Configure time-based retention policies for blob data

Immutable storage for Azure Blob storage enables users to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. For the duration of the retention interval, blobs can be created and read, but cannot be modified or deleted. Immutable storage is available for general-purpose v2 and Blob storage accounts in all Azure regions.

This article shows how to set and manage immutability policies and legal holds for data in Blob storage using the Azure portal, PowerShell, or Azure CLI. For more information about immutable storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

## Configure version-level retention policies

### Prerequisites

The following prerequisites are required to configure version-level retention policies:

- Blob versioning must be enabled for the storage account. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).
- The storage account must be either a general-purpose v2 storage account or a premium storage account for block blobs.

All access tiers and redundancy configurations are supported. However, if the storage account is geo-replicated to a secondary region, then customer-initiated failover is not supported.

Storage accounts with a hierarchical namespace are not supported.

### Enable version-level immutability for a new container

To use a version-level immutability policy, you must explicitly enable support for version-level WORM on the container. You can enable support for version-level WORM either when you create the container, or when you add a version-level immutability policy to an existing container.

To create a container that supports version-level immutability in the Azure portal, follow these steps:

1. Navigate to the **Containers** page for your storage account in the Azure portal, and select **Add**.
1. In the **New container** dialog, provide a name for your container, then expand the **Advanced** section.
1. Select **Enable version-level immutability support** to enable ??? for the container.

    :::image type="content" source="media/storage-blob-immutability-policies-manage/create-container-version-level-immutability.png" alt-text="Screenshot showing how to create a container with version-level immutability enabled":::

### Migrate an existing container to support version-level immutability

To configure version-level immutability policies for an existing container, you must migrate the container to support version-level immutable storage. Container migration may take some time and cannot be reversed.

An existing container must be migrated regardless of whether it has a container-level time-based retention policy configured. If the container has an existing container-level legal hold, then it cannot be migrated until the legal hold is removed.

To migrate a container to support version-level immutable storage in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button on the right, then select **Access policy**.
1. Under **Immutable blob storage**, select **Add policy**.
1. For the **Policy type** field, choose *Time-based retention*, and specify the retention interval.
1. Select **Enable version-level immutability**.
1. Select **OK** to begin the migration.

    :::image type="content" source="media/storage-blob-immutability-policies-manage/migrate-existing-container.png" alt-text="Screenshot showing how to migrate an existing container to support version-level immutability":::

### Configure a default version-level time-based retention policy

You can specify a default version-level time-based retention policy on a container that is enabled for version-level immutability. The default policy applies to all blob versions in the container, unless you override the policy for an individual version.

To apply a default version-level immutability policy to a container in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the **Containers** page, and locate the container to which you want to apply the policy.
1. Select the **More** button to the right of the container name, and choose **Access policy**.
1. In the **Access policy** dialog, under the **Immutable blob storage** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. If desired, select **Allow additional protected appends** to enable 
1. Select **OK** to apply the default policy to the container.

    :::image type="content" source="media/storage-blob-immutability-policies-manage/configure-default-retention-policy-container.png" alt-text="Screenshot showing how to configure a default version-level retention policy for a container":::

## Determine the scope of a time-based retention policy

To determine the scope of a time-based retention policy in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button on the right, then select **Access policy**.
1. Under **Immutable blob storage**, locate the **Scope** field. If the container is configured with a default version-level retention policy, then the scope is set to Version, as shown in the following image:

    :::image type="content" source="media/storage-blob-immutability-policies-manage/version-scoped-retention-policy.png" alt-text="Screenshot showing default version-level retention policy configured for container":::

1. If the container is configured with a container-level retention policy, then the scope is set to Version, as shown in the following image:

    :::image type="content" source="media/storage-blob-immutability-policies-manage/container-scoped-retention-policy.png" alt-text="Screenshot showing container-level retention policy configured for container":::

## Next steps

[Store business-critical blob data with immutable storage](immutable-storage-overview.md)

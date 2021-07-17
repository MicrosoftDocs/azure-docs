---
title: Configure time-based retention policies for blob data
titleSuffix: Azure Storage
description: Learn how to use WORM (Write Once, Read Many) support for Blob (object) storage to store data in a non-erasable, non-modifiable state for a specified interval.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/15/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: devx-track-azurepowershell
---

# Configure time-based retention policies for blob data

Immutable storage for Azure Blob storage enables users to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. For the duration of the retention interval, blobs can be created and read, but cannot be modified or deleted. Immutable storage is available for general-purpose v2 and Blob storage accounts in all Azure regions.

This article shows how to set and manage immutability policies and legal holds for data in Blob storage using the Azure portal, PowerShell, or Azure CLI. For more information about immutable storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

## Prerequisites & feature support

The following prerequisites are required to configure version-level retention policies:

- Blob versioning must be enabled for the storage account. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).
- The storage account must be either a general-purpose v2 storage account or a premium storage account for block blobs.

All access tiers and redundancy configurations are supported. However, if the storage account is geo-replicated to a secondary region, then customer-initiated failover is not supported.

Storage accounts with a hierarchical namespace are not supported.

## Configure version-level retention policies

Configuring a version-level time-based retention policy is a two-step process:

1. First, enable support for version-level immutability on a new or existing container.
1. Next, configure a time-based retention policy that applies to a blob version in that container. 

You have three options for configuring a time-based retention policy for a blob version:

1. You can configure a default policy that is scoped to the container and that applies to all objects in the container by default. Objects in the container will inherit the default policy unless you explicitly override it by configuring a policy on an individual blob version.
1. You can configure a policy on the current version of the blob. This policy can override a default policy configured on the container, if one exists and it is unlocked. By default, any previous versions that are created after the policy is configured will inherit the policy on the current version of the blob.
1. You can configure a policy on a previous version of a blob. This policy can override a default policy configured on the current version, if one exists and it is unlocked.

> [!IMPORTANT]
> Enabling version-level immutability support for a container does not make data in that container immutable. You must also configure either a default immutability policy for the container, or an immutability policy on a specific blob version.

### Enable version-level immutability for a new container

To use a version-level immutability policy, you must first explicitly enable support for version-level WORM on the container. You can enable support for version-level WORM either when you create the container, or when you add a version-level immutability policy to an existing container.

To create a container that supports version-level immutability in the Azure portal, follow these steps:

1. Navigate to the **Containers** page for your storage account in the Azure portal, and select **Add**.
1. In the **New container** dialog, provide a name for your container, then expand the **Advanced** section.
1. Select **Enable version-level immutability support** to enable version-level immutability for the container.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/create-container-version-level-immutability.png" alt-text="Screenshot showing how to create a container with version-level immutability enabled":::

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

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/migrate-existing-container.png" alt-text="Screenshot showing how to migrate an existing container to support version-level immutability":::

### Configure a default time-based retention policy

You can specify a default version-level time-based retention policy on a container that is enabled for version-level immutability. The default policy applies to all blob versions in the container, unless you override the policy for an individual version.

To apply a default version-level immutability policy to a container in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the **Containers** page, and locate the container to which you want to apply the policy.
1. Select the **More** button to the right of the container name, and choose **Access policy**.
1. In the **Access policy** dialog, under the **Immutable blob storage** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. If desired, select **Allow additional protected appends** to enable ???
1. Select **OK** to apply the default policy to the container.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/configure-default-retention-policy-container.png" alt-text="Screenshot showing how to configure a default version-level retention policy for a container":::

### Configure a time-based retention policy on a blob version

The Azure portal displays a list of blobs when you navigate to a container. Each blob displayed represents the current version of the blob. For more information on blob versioning, see [Blob versioning](versioning-overview.md).

To configure a time-based retention policy on the current version of a blob, follow these steps:

1. Navigate to the container that contains the target blob.
1. Select the **More** button to the right of the blob name, and choose **Access policy**. If a time-based retention policy has already been configured for the previous version, it appears in the **Access policy** dialog.
1. In the **Access policy** dialog, under the **Immutable blob versions** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. Select **OK** to apply the policy to the current version of the blob.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/configure-retention-policy-version.png" alt-text="Screenshot showing how to configure a retention policy for the current version of a blob":::

You can view the properties for a blob to see whether a policy is enabled on the current version. Select the blob, then navigate to the **Overview** tab and locate the **Version-level immutability policy** property. If a policy is enabled, the **Retention period** property will display the expiry date and time for the policy. Keep in mind that a policy may either be configured for the current version, or may be inherited from the blob's parent container if a default policy is in effect.

:::image type="content" source="media/immutable-time-based-retention-policy-configure/view-version-level-retention-policy-portal.png" alt-text="Screenshot showing immutability policy properties on blob version in Azure portal":::

You can also configure a time-based retention policy on a previous version of a blob. A previous version is always immutable in that it cannot be modified. However, a previous version can be deleted. A time-based retention policy protects against deletion while it is in effect.

To configure a time-based retention policy on a previous version of a blob, follow these steps:

1. Navigate to the container that contains the blob.
1. Select the blob, then navigate to the **Versions** tab.
1. Locate the target version, then select the **More** button and choose **Access policy**. If a time-based retention policy has already been configured for the previous version, it appears in the **Access policy** dialog.
1. In the **Access policy** dialog, under the **Immutable blob versions** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. Select **OK** to apply the policy to the current version of the blob.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/configure-retention-policy-previous-version.png" alt-text="Screenshot showing how to configure retention policy for a previous blob version in Azure portal":::

### Determine the scope of a time-based retention policy

To determine the scope of a time-based retention policy in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button on the right, then select **Access policy**.
1. Under **Immutable blob storage**, locate the **Scope** field. If the container is configured with a default version-level retention policy, then the scope is set to Version, as shown in the following image:

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/version-scoped-retention-policy.png" alt-text="Screenshot showing default version-level retention policy configured for container":::

1. If the container is configured with a container-level retention policy, then the scope is set to Version, as shown in the following image:

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/container-scoped-retention-policy.png" alt-text="Screenshot showing container-level retention policy configured for container":::

## Next steps

[Store business-critical blob data with immutable storage](immutable-storage-overview.md)

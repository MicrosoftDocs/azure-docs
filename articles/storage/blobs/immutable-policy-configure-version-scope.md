---
title: Configure time-based retention policies for blob versions (preview)
titleSuffix: Azure Storage
description: Learn how to use WORM (Write Once, Read Many) support for Blob (object) storage to store data in a non-erasable, non-modifiable state for a specified interval.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/17/2021
ms.author: tamram
ms.subservice: blobs 
---

# Configure time-based retention policies for blob versions (preview)

A time-based retention policy is an immutability policy that stores business-critical data objects in a WORM (Write Once, Read Many) state for a specified period of time. While a time-based retention policy is in effect, data cannot be modified or deleted. A time-based retention policy may be scoped either to an individual blob version (preview) or to a container. For more information about time-based retention policies, see [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md).

Configuring a version-level time-based retention policy is a two-step process:

1. First, enable support for version-level immutability on a new or existing container. See [Enable support for version-level immutability on a container](#enable-support-for-version-level-immutability-on-a-container) for details.
1. Next, configure a time-based retention policy that applies to one or more blob versions in that container.

You have three options for configuring a time-based retention policy for a blob version:

1. You can configure a default policy that is scoped to the container and that applies to all objects in the container by default. Objects in the container will inherit the default policy unless you explicitly override it by configuring a policy on an individual blob version. See [Configure a default time-based retention policy](#configure-a-default-time-based-retention-policy) for details.
1. You can configure a policy on the current version of the blob. This policy can override a default policy configured on the container, if one exists and it is unlocked. By default, any previous versions that are created after the policy is configured will inherit the policy on the current version of the blob. See [Configure a retention policy on the current version of a blob](#configure-a-retention-policy-on-the-current-version-of-a-blob) for details.
1. You can configure a policy on a previous version of a blob. This policy can override a default policy configured on the current version, if one exists and it is unlocked. See [Configure a retention policy on a previous version of a blob](#configure-a-retention-policy-on-a-previous-version-of-a-blob) for details.

> [!IMPORTANT]
> Version-level immutability policies are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

To configure version-level time-based retention policies, blob versioning must be enabled for the storage account. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).

## Enable support for version-level immutability on a container

Before you can apply a time-based retention policy to a blob version, you must enable support for version-level immutability. Both new and existing containers can be configured to support version-level immutability. However, an existing container must undergo a migration process in order to enable support.

Keep in mind that enabling version-level immutability support for a container does not make data in that container immutable. You must also configure either a default immutability policy for the container, or an immutability policy on a specific blob version.

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

## Configure a default time-based retention policy

You can specify a default version-level time-based retention policy on a container that is enabled for version-level immutability. The default policy applies to all blob versions in the container, unless you override the policy for an individual version.

To apply a default version-level immutability policy to a container in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the **Containers** page, and locate the container to which you want to apply the policy.
1. Select the **More** button to the right of the container name, and choose **Access policy**.
1. In the **Access policy** dialog, under the **Immutable blob storage** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. If desired, select **Allow additional protected appends** to enable ???
1. Select **OK** to apply the default policy to the container.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/configure-default-retention-policy-container.png" alt-text="Screenshot showing how to configure a default version-level retention policy for a container":::

## Configure a retention policy on the current version of a blob

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

## Configure a retention policy on a previous version of a blob

You can also configure a time-based retention policy on a previous version of a blob. A previous version is always immutable in that it cannot be modified. However, a previous version can be deleted. A time-based retention policy protects against deletion while it is in effect.

To configure a time-based retention policy on a previous version of a blob, follow these steps:

1. Navigate to the container that contains the target blob.
1. Select the blob, then navigate to the **Versions** tab.
1. Locate the target version, then select the **More** button and choose **Access policy**. If a time-based retention policy has already been configured for the previous version, it appears in the **Access policy** dialog.
1. In the **Access policy** dialog, under the **Immutable blob versions** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. Select **OK** to apply the policy to the current version of the blob.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/configure-retention-policy-previous-version.png" alt-text="Screenshot showing how to configure retention policy for a previous blob version in Azure portal":::

## Determine the scope of a retention policy

To determine the scope of a time-based retention policy in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button on the right, then select **Access policy**.
1. Under **Immutable blob storage**, locate the **Scope** field. If the container is configured with a default version-level retention policy, then the scope is set to Version, as shown in the following image:

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/version-scoped-retention-policy.png" alt-text="Screenshot showing default version-level retention policy configured for container":::

1. If the container is configured with a container-level retention policy, then the scope is set to Version, as shown in the following image:

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/container-scoped-retention-policy.png" alt-text="Screenshot showing container-level retention policy configured for container":::

## Modify an unlocked retention policy

You can modify an unlocked time-based retention policy to shorten or lengthen the retention interval. You can also delete an unlocked policy. Editing or deleting an unlocked time-based retention policy for a blob version does not affect policies in effect for any other versions. If there is a default time-based retention policy in effect for the container, then the blob version with the modified or deleted policy will no longer inherit from the container.

To modify an unlocked time-based retention policy, follow these steps:

1. Locate the target version, which may be the current version or a previous version of a blob. Select the **More** button and choose **Access policy**.
1. Under the **Immutable blob versions** section, locate the existing unlocked policy. Select the **More** button, then select **Edit** from the menu.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/edit-existing-version-policy.png" alt-text="Screenshot showing how to edit an existing version-level time-based retention policy in Azure portal":::

1. Provide the new date and time for the policy expiration.

To delete an unlocked policy, follow steps 1 through 4, then select **Delete** from the menu.

## Lock a time-based retention policy

When you have finished testing a time-based retention policy, you can lock the policy. A locked policy is compliant with SEC 17a-4(f) and other regulatory compliance. You can lengthen the retention interval for a locked policy up to five times, but you cannot shorten it.

After a policy is locked, you cannot delete it. However, you can delete the blob after the retention interval has expired.

To lock a policy, follow these steps:

1. Locate the target version, which may be the current version or a previous version of a blob. Select the **More** button and choose **Access policy**.
1. Under the **Immutable blob versions** section, locate the existing unlocked policy. Select the **More** button, then select **Lock policy** from the menu.
1. Confirm that you want to lock the policy.

    :::image type="content" source="media/immutable-time-based-retention-policy-configure/lock-policy-portal.png" alt-text="Screenshot showing how to lock a time-based retention policy in Azure portal":::

## Feature support

Version-level time-based retention policies are supported for general-purpose v2 storage accounts and premium storage accounts for block blobs in all regions.

All access tiers and redundancy configurations are supported. However, if the storage account is geo-replicated to a secondary region, then customer-initiated failover is not supported.

Storage accounts with a hierarchical namespace are not supported.

## Next steps

- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)

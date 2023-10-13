---
title: Add assets and tags
description: Learn how to define assets and tags in Azure IoT Operations. Assets and tags map inbound data from OPC UA servers to friendly names.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 10/13/2023

#CustomerIntent: As an OT user, I want define assets and tags so that I can use friendly names to refer to data points from my OPC UA servers.
---

# Create assets and tags

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[!INCLUDE [assets-servers](../includes/assets-servers.md)]

This article describes how to use the Digital Operation (preview) portal to manually add assets and define tags. These assets and tags map inbound data from OPC UA servers to friendly names that you can use in the Azure MQ broker and Data Processor pipelines.

## Prerequisites

- A running instance of Azure IoT Operations – enabled by Azure Arc.
- An [asset endpoint profile](howto-configure-assets-endpoint.md).

## Sign in to the Digital Operations portal

Navigate to the [Digital Operations portal](https://digitaloperations.azure.com) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your cluster

When you sign in, the portal displays a list of the Kubernetes clusters running Azure IoT Operations that you have access to. Select the cluster that you want to use.

> [!TIP]
> If you don't see any clusters, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any clusters, that means you are not added to any yet. Reach out to your IT administrator to give you access to the Azure resource group the Kubernetes cluster belongs to from Azure portal. You must be in the _contributor_ role.

:::image type="content" source="media/howto-add-assets/cluster-list.png" alt-text="Screenshot that shows the list of clusters in the Azure IoT Operations portal.":::

## Add an asset

To add an asset in the Digital Operations portal:

1. Select the **Assets** tab. If you haven't created any assets yet, you see the following screen:

    :::image type="content" source="media/howto-add-assets/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the Digital Operations portal.":::

1. Enter the following asset information:

    - Asset name
    - Endpoint profile
    - Asset description.

    The **Endpoint profile** must match the value in the [asset endpoint profile configuration](howto-configure-assets-endpoint.md).

    :::image type="content" source="media/howto-add-assets/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the Digital Operations portal.":::

1. Add any optional information that you want to include such as:

    - Manufacturer
    - Manufacturer URI
    - Model
    - Product code
    - Hardware version
    - Software version
    - Serial number
    - Documentation URI

    :::image type="content" source="media/howto-add-assets/create-asset-additional-info.png" alt-text="Screenshot that shows how to add additional asset information in the Digital Operations portal.":::

1. Select **Next** to go to the **Additional configurations** page.

    This page shows the default telemetry settings for the asset. You can override these settings for each tag that you add. These settings apply to all the OPC UA tags that belong to the asset.

    Default telemetry settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA Server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before it's published.

    :::image type="content" source="media/howto-add-assets/create-asset-additional-config.png" alt-text="Screenshot that shows how to define default telemetry settings for asset tags in the Digital Operations portal.":::

1. Select **Next** to go to the **Tags** page.

## Add individual tags to an asset

Now you can define the tags associated with the asset. To add OPC UA tags:

- Select **Add** and then select **Add tag**. Enter your tag details:

    - Node ID. This value is the node ID from the OPC UA server.
    - Tag name (Optional). This value is the friendly name that you want to use for the tag. If you don't specify a tag name, the node ID is used as the tag name.
    - Observability mode (Optional) with following choices:
      - None
      - Gauge
      - Counter
      - Histogram
      - Log
    - Sampling Interval (milliseconds). You can override the asset default value for this tag.
    - Queue size. You can override the asset default value for this tag.

    :::image type="content" source="media/howto-add-assets/add-tag.png" alt-text="Screenshot that shows adding tags in the Digital Operations portal.":::

    The following table shows some example tag values that you can use to with the built-in OPC PLC simulator:

    | Node ID | Tag name | Observability mode |
    | ------- | -------- | ------------------ |
    | ns=3;s=FastUInt10 | temperature | none |
    | ns=3;s=FastUInt100 | Tag 10 | none |

## Manage tags in bulk

You can import up to 1000 OPC UA tags at a time from a Microsoft Excel file:

1. Create a Microsoft Excel file that looks like the following example:

    | NodeID              | TagName  | Sampling Interval Milliseconds | QueueSize | ObservabilityMode |
    |---------------------|----------|--------------------------------|-----------|-------------------|
    | ns=3;s=FastUInt1000 | Tag 1000 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1001 | Tag 1001 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1002 | Tag 1002 | 5000                           | 10        | none              |

1. Select **Add** and then select **Import Microsoft Excel**. Select the Excel file you created and select **Open**. The tags defined in the Excel file are imported:

    :::image type="content" source="media/howto-add-assets/import-complete.png" alt-text="A screenshot that shows the completed import from the Excel file in the Digital Operations portal.":::

    If you import an= Microsoft Excel file that contains tags that are duplicates of existing tags, the Digital Operations portal displays the following message:

    :::image type="content" source="media/howto-add-assets/import-duplicates.png" alt-text="A screenshot that shows the error message when you import duplicate tag definitions in the Digital Operations portal.":::

    You can either replace the duplicate tags and add new tags from the import file, or you can cancel the import.

1. To export all the tags from an asset to a Microsoft Excel file, select **Export** and choose a location for the file:

    :::image type="content" source="media/howto-add-assets/export-tags.png" alt-text="A screenshot that shows how to export tag definitions from an asset in the Digital Operations portal.":::

## Review your changes

Select **Next** to go to the **Review** page. Review your asset and OPC UA tag details and make any adjustments you need:

:::image type="content" source="media/howto-add-assets/review-asset-tags.png" alt-text="A screenshot that shows how to review your asset and tags in the Digital Operations portal.":::

## Update an asset

Select the asset you created previously. Use the **Properties**, **Default telemetry settings**, and **Tags** tabs to make any changes:

:::image type="content" source="media/howto-add-assets/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the Digital Operations portal.":::

On the **Tags** tab, you can update existing tags or remove them or add new ones.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-add-assets/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the Digital Operations portal.":::

To remove tags, select one or more tags and then select **Remove**:

:::image type="content" source="media/howto-add-assets/asset-remove-tags.png" alt-text="A screenshot that shows how to delete a tag in the Digital Operations portal.":::

When you're finished making changes, select **Save** to save your changes.

## Delete an asset

To delete an asset, select the asset you want to delete. On the **Asset**  details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-add-assets/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the Digital Operations portal.":::

## Notifications

Whenever you make a change to asset, you see a notification in the Digital Operations portal that reports the status of the operation:

:::image type="content" source="media/howto-add-assets/portal-notifications.png" alt-text="A screenshot that shows the notifications in the Digital Operations portal.":::

## Related content

[Configure an assets endpoint](howto-configure-assets-endpoint.md)

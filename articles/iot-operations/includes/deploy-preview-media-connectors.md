---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 07/25/2025
ms.author: dobett
---

When you deploy the preview version of Azure IoT Operations, the deployment includes the three preview connectors. You can verify that you have a preview instance of Azure IoT Operations by checking in the Azure portal that preview features are enabled for your instance:

:::image type="content" source="media/deploy-preview-media-connectors/portal-enable-preview-connectors.png" alt-text="Screenshot of Azure portal that shows that preview features are enabled." lightbox="media/deploy-preview-media-connectors/portal-enable-preview-connectors.png":::

Before you can use the preview connectors (ONVIF, media, and HTTP/REST) in the operations experience web UI, an administrator must add connector template instances to your Azure IoT Operations instance.

All three preview connectors can publish captured data to the MQTT broker. The media connector can also save captured data to storage. Azure IoT Operations uses [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) to transfer the captured data to cloud storage destinations such as Azure Blob Storage. When you configure a connector template instance, you specify a _persistent volume claim_ and _mount path_ for the connector to use to save captured data. To learn how to create a suitable persistent volume claim, see [Cloud Ingest Edge Volumes configuration](/azure/azure-arc/container-storage/howto-configure-cloud-ingest-subvolumes).

To add a connector template instance to your Azure IoT Operations instance:

1. In the Azure portal, go to your Azure IoT Operations instance, select **Connector templates**, and then select **Add connector template instances**:

    :::image type="content" source="media/deploy-preview-media-connectors/portal-add-connector-template.png" alt-text="Screenshot of Azure portal that shows how to add a connector template instance." lightbox="media/deploy-preview-media-connectors/portal-add-connector-template.png":::

1. On the first page of the **Add an Akri connector template** wizard, select the type of connector template you want to add, such as **ONVIF**, **Media**, **HTTP/REST**, or **SSE HTTP**. Then select **Metadata**.

    :::image type="content" source="media/deploy-preview-media-connectors/select-connector-template-type.png" alt-text="Screenshot of Azure portal that shows how to select the connector template instance type." lightbox="media/deploy-preview-media-connectors/select-connector-template-type.png":::

1. On the **Metadata** page, accept the defaults, and then select **Device inbound endpoint type**.

1. On the **Device inbound endpoint type** page, accept the defaults, and then select **Diagnostics configurations**.

1. On the **Diagnostics configurations** page, accept the defaults, and then select **Runtime configuration**.

1. On the **Runtime configuration** page, select **Add a volume claim** and enter the details of the persistent volume claim you created previously. Then select **Review**:

    :::image type="content" source="media/deploy-preview-media-connectors/add-volume-claim.png" alt-text="Screenshot of Azure portal that shows how to configure the runtime settings for the connector template instance." lightbox="media/deploy-preview-media-connectors/add-volume-claim.png":::

1. On the **Review** page, review the details of the connector template instance, and then select **Create** to create the connector template instance.

An OT user can now use the operations experience web UI to create a device with a preview connector endpoint.

---

---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 07/25/2025
ms.author: dobett
---

Before you can use the preview connectors (ONVIF, media, and REST/HTTP) in the operations experience web UI, an administrator must:

1. Enable them in your Azure IoT Operations instance.
1. Add connector template instances to your Azure IoT Operations instance.

To enable the preview connectors, you can either enable them when you deploy your Azure IoT Operations instance or enable them after you deploy your instance.

To enable the preview connectors when you deploy your Azure IoT Operations instance:

# [Azure portal](#tab/portal)

Select **ONVIF Connector and Media Connector (Preview)** in the **Connectors** section of the **Install Azure IoT Operations > Basics** page:

:::image type="content" source="media/deploy-preview-media-connectors/portal-deploy-preview-connectors.png" alt-text="Screenshot of Azure portal that shows how to select the preview connectors." lightbox="media/deploy-preview-media-connectors/portal-deploy-preview-connectors.png":::

# [Azure CLI](#tab/cli)

Include the `--feature connectors.settings.preview=Enabled` parameter when you run the `az iot ops create` command.

---

To enable the preview connectors after you deploy your Azure IoT Operations instance:

# [Azure portal](#tab/portal)

1. Go to your Azure IoT Operations instance in the Azure portal.

1. Enable the preview connectors:

  :::image type="content" source="media/deploy-preview-media-connectors/portal-enable-preview-connectors.png" alt-text="Screenshot of Azure portal that shows how to enable the preview connectors." lightbox="media/deploy-preview-media-connectors/portal-enable-preview-connectors.png":::

# [Azure CLI](#tab/cli)

Run the following command to enable the preview connectors:

```azcli
az iot ops update -n <your-instance> -g <your-resource-group> --feature connectors.settings.preview=Enabled
```

---

All three preview connectors can publish captured data to the MQTT broker and save captured data to storage.

Azure IoT Operations uses [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) to transfer the captured data to cloud storage destinations such as Azure Blob Storage. When you configure a connector template instance, you specify a _persistent volume claim_ and path for the connector to use to save captured data. To learn how to create a suitable persistent volume claim, see [Cloud Ingest Edge Volumes configuration](/azure/azure-arc/container-storage/cloud-ingest-edge-volume-configuration).

To add a connector template instance to your Azure IoT Operations instance:

1. In the Azure portal, go to your Azure IoT Operations instance, select **Connector templates**, and then select **Add connector template instances**:

    :::image type="content" source="media/deploy-preview-media-connectors/portal-add-connector-template.png" alt-text="Screenshot of Azure portal that shows how to add a connector template instance." lightbox="media/deploy-preview-media-connectors/portal-add-connector-template.png":::

1. On the first page of the **Add an Akri connector template** wizard, select the type of connector template you want to add, such as **ONVIF**, **Media**, or **HTTP REST**. Then select **Metadata**.

    :::image type="content" source="media/deploy-preview-media-connectors/select-connector-template-type.png" alt-text="Screenshot of Azure portal that shows how to select the connector template instance type." lightbox="media/deploy-preview-media-connectors/select-connector-template-type.png":::

1. On the **Metadata** page, accept the defaults, and then select **Device inbound endpoint type**.

1. On the **Device inbound endpoint type** page, accept the defaults, and then select **Diagnostics configurations**.

1. On the **Diagnostics configurations** page, accept the defaults, and then select **Runtime configuration**.

1. On the **Runtime configuration** page, select **Add a volume claim** and enter the details of the persistent volume claim you created previously. Then select **Review**:

    :::image type="content" source="media/deploy-preview-media-connectors/add-volume-claim.png" alt-text="Screenshot of Azure portal that shows how to configure the runtime settings for the connector template instance." lightbox="media/deploy-preview-media-connectors/add-volume-claim.png":::

1. On the **Review** page, review the details of the connector template instance, and then select **Create** to create the connector template instance.

An OT user can now use the operations experience web UI to create a device with a preview connector endpoint.

---

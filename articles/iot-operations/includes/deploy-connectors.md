---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 10/21/2025
ms.author: dobett
---

When you deploy Azure IoT Operations, the deployment includes various connectors. Before you can use the connectors (such as ONVIF, media, MQTT, and HTTP/REST) in the operations experience web UI, an administrator must add connector template instances to your Azure IoT Operations instance.

All the connectors can publish captured data to the MQTT broker. The media connector can also save captured data to storage. Azure IoT Operations uses [Azure Container Storage enabled by Azure Arc (ACSA)](/azure/azure-arc/container-storage/overview) to transfer the captured data to cloud storage destinations such as Azure Blob Storage. When you configure a connector template instance, you specify a _persistent volume claim_ and _mount path_ for the connector to use to save captured data. You can also share volumes between pods. To learn how to create a suitable persistent volume claim, see [Cloud Ingest Edge Volumes configuration](/azure/azure-arc/container-storage/howto-configure-cloud-ingest-subvolumes).

> [!IMPORTANT]
> You must install [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/howto-install-edge-volumes) before you use it with the media connector template.

To add a connector template instance to your Azure IoT Operations instance:

1. In the Azure portal, go to your Azure IoT Operations instance, select **Connector templates**, and then select **Create connector template**:

    :::image type="content" source="media/deploy-connectors/portal-add-connector-template.png" alt-text="Screenshot of Azure portal that shows how to add a connector template instance." lightbox="media/deploy-connectors/portal-add-connector-template.png":::

1. On the first page of the **Add an Akri connector template** wizard, select the type and version of connector template you want to add, such as **ONVIF**, **Media**, **HTTP/REST**, **SSE**, or **MQTT**. Then select **Metadata**.

    :::image type="content" source="media/deploy-connectors/select-connector-template-type.png" alt-text="Screenshot of Azure portal that shows how to select the connector template instance type." lightbox="media/deploy-connectors/select-connector-template-type.png":::

1. On the **Metadata** page, accept the defaults, and then select **Device inbound endpoint type**.

1. On the **Device inbound endpoint type** page, accept the defaults, and then select **Diagnostics configurations**.

1. On the **Diagnostics configurations** page, accept the defaults, and then select **Runtime configuration**.

1. On the **Runtime configuration** page, if you're using ACSA to synchronize captured data to the cloud, select **Add a volume claim** and enter the details of the persistent volume claim you created previously. Then select **Review**:

    :::image type="content" source="media/deploy-connectors/add-volume-claim.png" alt-text="Screenshot of Azure portal that shows how to configure the runtime settings for the connector template instance volume claims." lightbox="media/deploy-connectors/add-volume-claim.png":::

    You can also specify secrets from Azure Key Vault to use for authentication by the connector. These secrets are made available to all device endpoints that use the connector template instance:

    :::image type="content" source="media/deploy-connectors/add-secrets.png" alt-text="Screenshot of Azure portal that shows how to configure the runtime settings for the connector template instance secrets." lightbox="media/deploy-connectors/add-secrets.png":::

1. On the **Review** page, review the details of the connector template instance, and then select **Create** to create the connector template instance.

An OT user can now use the operations experience web UI to create a device with a connector endpoint.

---

---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 07/25/2025
ms.author: dobett
---

When you deploy Azure IoT Operations, the deployment includes various connectors. Before you can use the connectors (such as ONVIF, media, and HTTP/REST) in the operations experience web UI, an administrator must add connector template instances to your Azure IoT Operations instance.

All the connectors can publish captured data to the MQTT broker.

To add a connector template instance to your Azure IoT Operations instance:

1. In the Azure portal, go to your Azure IoT Operations instance, select **Connector templates**, and then select **Create a connector template**:

    :::image type="content" source="media/deploy-connectors-simple/portal-add-connector-template.png" alt-text="Screenshot of Azure portal that shows how to add a connector template instance." lightbox="media/deploy-connectors-simple/portal-add-connector-template.png":::

1. On the first page of the **Add an Akri connector template** wizard, select the type and version of connector template you want to add, such as **ONVIF**, **Media**, **HTTP/REST**, **SSE**, or **MQTT**. Then select **Metadata**.

    :::image type="content" source="media/deploy-connectors-simple/select-connector-template-type.png" alt-text="Screenshot of Azure portal that shows how to select the connector template instance type." lightbox="media/deploy-connectors-simple/select-connector-template-type.png":::

1. On the **Metadata** page, accept the defaults, and then select **Device inbound endpoint type**.

1. On the **Device inbound endpoint type** page, accept the defaults, and then select **Diagnostics configurations**.

1. On the **Diagnostics configurations** page, accept the defaults, and then select **Runtime configuration**.

1. On the **Runtime configuration** page,  accept the defaults, and then select **Review**.

1. On the **Review** page, review the details of the connector template instance, and then select **Create** to create the connector template instance.

An OT user can now use the operations experience web UI to create a device with a connector endpoint.

---

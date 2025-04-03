---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 04/03/2025
ms.author: dobett
---

To deploy the preview version of the connectors, you can either enable them when you deploy your Azure IoT Operations instance or enable them after you deploy your instance:

- To enable the preview connectors when you deploy your Azure IoT Operations instance include the `--feature connectors.settings.preview=Enabled` parameter when you run `az iot ops create`.

- To enable the preview connectors after you deploy your Azure IoT Operations instance by using the Azure portal:

  :::image type="content" source="media/deploy-preview-media-connectors/portal-enable-preview-connectors.png" alt-text="Screenshot of Azure portal that shows how to enable the preview connectors.":::

- To enable the preview connectors after you deploy your Azure IoT Operations instance by using the Azure CLI:

  ```console
  az iot ops update -n <your-instance> -g <your-resource-group> --feature connectors.settings.preview=Enabled
  ```

> [!IMPORTANT]
> If you don't enable preview features, you see the following error message in the `aio-supervisor-...` pod logs when you try to use the media or ONVIF connectors: `No connector configuration present for AssetEndpointProfile: <AssetEndpointProfileName>`.

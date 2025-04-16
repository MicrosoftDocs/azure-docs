---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 04/03/2025
ms.author: dobett
---

To deploy the preview version of the connectors, you can either enable them when you deploy your Azure IoT Operations instance or enable them after you deploy your instance.

To enable the preview connectors when you deploy your Azure IoT Operations instance:

# [Azure portal](#tab/portal)

Select **ONVIF Connector and Media Connector (Preview)** in the **Connectors** section of the **Install Azure IoT Operations > Basics** page:

:::image type="content" source="media/deploy-preview-media-connectors/portal-deploy-preview-connectors.png" alt-text="Screenshot of Azure portal that shows how to select the preview connectors.":::

# [Azure CLI](#tab/cli)

Include the `--feature connectors.settings.preview=Enabled` parameter when you run the `az iot ops create` command.

---

To enable the preview connectors after you deploy your Azure IoT Operations instance:

# [Azure portal](#tab/portal)

1. Go to your Azure IoT Operations instance in the Azure portal.

1. Enable the preview connectors:

  :::image type="content" source="media/deploy-preview-media-connectors/portal-enable-preview-connectors.png" alt-text="Screenshot of Azure portal that shows how to enable the preview connectors.":::

# [Azure CLI](#tab/cli)

Run the following command to enable the preview connectors:

```azcli
az iot ops update -n <your-instance> -g <your-resource-group> --feature connectors.settings.preview=Enabled
```

---

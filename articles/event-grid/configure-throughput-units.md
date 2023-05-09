---
title: Configure throughput units in Azure Event Grid namespaces
description: This article describes how to configure throughput units in namespaces
author: robece
ms.topic: how-to
ms.author: robece
ms.date: 05/09/2023
---

# Configure throughput units in Azure Event Grid namespaces

You can configure the number of throughput units (TUs) during the creation of the Azure Event Grid namespace, or once the resource has been created.

## Configure throughput units during namespace creation

During the namespace creation select the number of TUs required, along with the configuration required to create the resource.

:::image type="content" source="media/configure-throughput-units/namespace-creation-with-throughput-units.png" alt-text="Screenshot showing Event Grid creation with throughput units.":::

## Configure throughput units in created namespace

If you already created the namespace and want to increase or decrease TUs, follow the next steps:

1. Navigate to the Azure portal and select the Azure Event Grid namespace you would like to configure the throughput units.
2. Once you have opened the resource, select the “Scale” blade.
3. Select the number of TUs you want to increase or decrease.
4. Select “Save” to apply the changes.
5. The throughput units will then be enabled and available for use in your namespace.

:::image type="content" source="media/configure-throughput-units/namespace-scale.png" alt-text="Screenshot showing Event Grid scale blade.":::

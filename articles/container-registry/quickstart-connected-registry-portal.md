---
title: Quickstart - Create connected registry using the portal
description: Use Azure portal to create a connected Azure container registry resource that can synchronize images and other artifacts with the cloud registry.
ms.topic: quickstart
ms.date: 10/11/2022
ms.author: memladen
author: toddysm
ms.custom: ignite-fall-2021, mode-ui, devx-track-azurecli
---

# Quickstart: Create a connected registry using the Azure portal

In this quickstart, you use the Azure portal to create a [connected registry](intro-connected-registry.md) resource in Azure. The connected registry feature of Azure Container Registry allows you to deploy a registry remotely or on your premises and synchronize images and other artifacts with the cloud registry. 

Here you create two connected registry resources for a cloud registry: one connected registry allows read and write (artifact pull and push) functionality and one allows read-only functionality. 

After creating a connected registry, you can follow other guides to deploy and use it on your on-premises or remote infrastructure.

## Prerequisites

* Azure Container registry - If you don't already have a container registry, [create one](container-registry-get-started-portal.md) (Premium tier required) in a [region](intro-connected-registry.md#available-regions) that supports connected registries. 

To import images to the container registry, use the Azure CLI:
[!INCLUDE [Prepare Azure CLI environment](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Enable the dedicated data endpoint for the cloud registry

Enable the [dedicated data endpoint](container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints) for the Azure container registry in the cloud. This step is needed for a connected registry to communicate with the cloud registry.

1. In the [Azure portal](https://portal.azure.com), navigate to your container registry.
1. Select **Networking > Public access**.
Select the **Enable dedicated data endpoint** checkbox.
1. Select **Save**.

[!INCLUDE [container-registry-connected-import-images](../../includes/container-registry-connected-import-images.md)]

## Create a connected registry resource for read and write functionality

The following steps create a connected registry in [ReadWrite mode](intro-connected-registry.md#modes) that is linked to the cloud registry.

1. In the [Azure portal](https://portal.azure.com), navigate to your container registry.
1. Select **Connected registries (Preview) > + Create**.
1. Enter or select the values in the following table, and select **Save**.


|Item  |Description  |
|---------|---------|
|Parent     | Select **No parent** for a connected registry linked to the cloud registry.        |
|Mode     | Select **ReadWrite**.         |
|Name     | The connected registry name must start with a letter and contain only alphanumeric characters. It must be 5 to 40 characters long and unique in the hierarchy for this Azure container registry.       |
|Logging properties     | Accept the default settings.       |
|Sync properties    | Accept the default settings. Because there is no synchronization schedule defined by default, the repositories will be synchronized between the cloud registry and the connected registry without interruptions.      |
|Repositories     | Select or enter the names of the repositories you imported in the previous step. The specified repositories will be synchronized between the cloud registry and the connected registry once it is deployed.     |

:::image type="content" source="media/quickstart-connected-registry-portal/create-readwrite-connected-registry.png" alt-text="Create a connected registry in ReadWrite mode":::


> [!IMPORTANT]
> To support nested scenarios where lower layers have no Internet access, you must always allow synchronization of the `acr/connected-registry` repository. This repository contains the image for the connected registry runtime.

## Create a connected registry resource for read-only functionality

The following steps create a connected registry in [ReadOnly mode](intro-connected-registry.md#modes)  whose parent is the connected registry you created in the previous section. This connected registry enables read-only (artifact pull) functionality once deployed.

1. In the [Azure portal](https://portal.azure.com), navigate to your container registry.
1. Select **Connected registries (Preview) > + Create**.
1. Enter or select the values in the following table, and select **Save**.


|Item  |Description  |
|---------|---------|
|Parent     | Select the connected registry you created previously.        |
|Mode     | Select **ReadOnly**.         |
|Name     | The connected registry name must start with a letter and contain only alphanumeric characters. It must be 5 to 40 characters long and unique in the hierarchy for this Azure container registry.      |
|Logging properties     | Accept the default settings.       |
|Sync properties    | Accept the default settings. Because there is no synchronization schedule defined by default, the repositories will be synchronized between the cloud registry and the connected registry without interruptions.      |
|Repositories     | Select or enter the names of the repositories you imported in the previous step. The specified repositories will be synchronized between the parent registry and the connected registry once it is deployed.     |

:::image type="content" source="media/quickstart-connected-registry-portal/create-readonly-connected-registry.png" alt-text="Create a connected registry in ReadOnly mode":::

## View connected registry properties

Select a connected registry in the portal to view its properties, such as its connection status (Offline, Online, or Unhealthy) and whether it has been activated (deployed on-premises). In the following example, the connected registry is not deployed. Its connection state of "Offline" indicates that it is currently disconnected from the cloud.

:::image type="content" source="media/quickstart-connected-registry-portal/connected-registry-properties.png" alt-text="View connected registry properties":::

From this view, you can also generate a connection string and optionally generate passwords for the [sync token](overview-connected-registry-access.md#sync-token). A connection string contains configuration settings used for deploying a connected registry and synchronizing content with a parent registry.

## Next steps

In this quickstart, you used the Azure portal to create two connected registry resources in Azure. Those new connected registry resources are tied to your cloud registry and allow synchronization of artifacts with the cloud registry.

Continue to the connected registry deployment guides to learn how to deploy and use a connected registry on your IoT Edge infrastructure.

> [!div class="nextstepaction"]
> [Quickstart: Deploy connected registry on IoT Edge][quickstart-deploy-connected-registry-iot-edge-cli]

<!-- LINKS - internal -->
[az-acr-connected-registry-create]: /cli/azure/acr/connected-registry#az_acr_connected_registry_create
[az-acr-connected-registry-list]: /cli/azure/acr/connected-registry#az_acr_connected_registry_list
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-update]: /cli/azure/acr#az_acr_update
[az-acr-import]: /cli/azure/acr#az_acr_import
[az-group-create]: /cli/azure/group#az_group_create
[container-registry-intro]: container-registry-intro.md
[container-registry-skus]: container-registry-skus.md
[quickstart-deploy-connected-registry-iot-edge-cli]: quickstart-deploy-connected-registry-iot-edge-cli.md

---
title: Quickstart - Deploy a connected registry to an IoT Edge device
description: Use Azure CLI commands and Azure portal to deploy a connected Azure container registry to an Azure IoT Edge device.
ms.topic: quickstart
ms.date: 10/31/2023
ms.author: memladen
author: toddysm
ms.custom: mode-other, devx-track-azurecli
ms.devlang: azurecli
ms.service: container-registry
---

# Quickstart: Deploy a connected registry to an IoT Edge device

In this quickstart, you use the Azure CLI to deploy a [connected registry](intro-connected-registry.md) as a module on an Azure IoT Edge device. The IoT Edge device can access the parent Azure container registry in the cloud.

For an overview of using a connected registry with IoT Edge, see [Using connected registry with Azure IoT Edge](overview-connected-registry-and-iot-edge.md). This scenario corresponds to a device at the [top layer](overview-connected-registry-and-iot-edge.md#top-layer) of an IoT Edge hierarchy. 


[!INCLUDE [Prepare Azure CLI environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]
* Azure IoT Hub and IoT Edge device. For deployment steps, see [Quickstart: Deploy your first IoT Edge module to a virtual Linux device](../iot-edge/quickstart-linux.md).
  > [!IMPORTANT]
  > For later access to the modules deployed on the IoT Edge device, make sure that you open the ports 8000, 5671, and 8883 on the device. For configuration steps, see [How to open ports to a virtual machine with the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md). 

* Connected registry resource in Azure. For deployment steps, see quickstarts using the [Azure CLI][quickstart-connected-registry-cli] or [Azure portal][quickstart-connected-registry-portal]. 

    * A connected registry in either `ReadWrite` or `ReadOnly` mode can be used in this scenario. 
    * In the commands in this article, the connected registry name is stored in the environment variable *CONNECTED_REGISTRY_RW*.

[!INCLUDE [container-registry-connected-import-images](../../includes/container-registry-connected-import-images.md)]

## Retrieve connected registry configuration

Before deploying the connected registry to the IoT Edge device, you need to retrieve configuration settings from the connected registry resource in Azure.

Use the [az acr connected-registry get-settings][az-acr-connected-registry-get-settings] command to get the settings information required to install a connected registry. The following example specifies HTTPS as the parent protocol. This protocol is required when the parent registry is a cloud registry.

```azurecli
az acr connected-registry get-settings \
  --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RW \
  --parent-protocol https
```

By default, the settings information doesn't include the [sync token](overview-connected-registry-access.md#sync-token) password, which is also needed to deploy the connected registry. Optionally, generate one of the passwords by passing the `--generate-password 1` or `generate-password 2` parameter. Save the generated password to a safe location. It cannot be retrieved again.

> [!WARNING]
> Regenerating a password rotates the sync token credentials. If you configured a device using the previous password, you need to update the configuration.

[!INCLUDE [container-registry-connected-connection-configuration](../../includes/container-registry-connected-connection-configuration.md)]

## Configure a deployment manifest for IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry and API proxy modules using the Azure CLI, save the following deployment manifest locally as a `manifest.json` file. You will use the file path in the next section when you run the command to apply the configuration to your device.

[!INCLUDE [container-registry-connected-iot-edge-manifest](../../includes/container-registry-connected-iot-edge-manifest.md)]

## Deploy the connected registry and API proxy modules on IoT Edge

Use the following command to deploy the connected registry and API proxy modules on the IoT Edge device, using the deployment manifest created in the previous section. Provide the ID of the IoT Edge top layer device and the name of the IoT Hub where indicated.

```azurecli
# Set the IOT_EDGE_TOP_LAYER_DEVICE_ID and IOT_HUB_NAME environment variables for use in the following Azure CLI command
IOT_EDGE_TOP_LAYER_DEVICE_ID=<device-id>
IOT_HUB_NAME=<hub-name>

az iot edge set-modules \
  --device-id $IOT_EDGE_TOP_LAYER_DEVICE_ID \
  --hub-name $IOT_HUB_NAME \
  --content manifest.json
```

For details, see [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md).

To check the status of the connected registry, use the following [az acr connected-registry show][az-acr-connected-registry-show] command. The name of the connected registry is the value of *$CONNECTED_REGISTRY_RW*.

```azurecli
az acr connected-registry show \
  --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RW \
  --output table
```

After successful deployment, the connected registry shows a status of `Online`.

## Next steps

In this quickstart, you learned how to deploy a connected registry to an IoT Edge device. Continue to the next guides to learn how to pull images from the newly deployed connected registry or to deploy the connected registry on nested IoT Edge devices.


> [!div class="nextstepaction"]
> [Pull images from a connected registry][pull-images-from-connected-registry]

> [!div class="nextstepaction"]
> [Tutorial: Deploy connected registry on nested IoT Edge devices][tutorial-connected-registry-nested]

<!-- LINKS - internal -->
[az-acr-connected-registry-get-settings]: /cli/azure/acr/connected-registry/install#az_acr_connected_registry_get_settings
[az-acr-connected-registry-show]: /cli/azure/acr/connected-registry#az_acr_connected_registry_show
[az-acr-import]:/cli/azure/acr#az_acr_import
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential?#az_acr_token_credential_generate
[container-registry-intro]: container-registry-intro.md
[pull-images-from-connected-registry]: pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
[quickstart-connected-registry-portal]: quickstart-connected-registry-portal.md
[tutorial-connected-registry-nested]: tutorial-deploy-connected-registry-nested-iot-edge-cli.md

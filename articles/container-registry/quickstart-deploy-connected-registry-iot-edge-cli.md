---
title: Quickstart - Deploy a connected registry to an IoT Edge device
description: Use Azure Container Registry CLI commands and Azure portal to deploy a connected registry to an Azure IoT Edge device.
ms.topic: quickstart
ms.date: 09/13/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Deploy a connected registry to an IoT Edge device

In this quickstart, you use the Azure CLI to deploy a [connected registry](intro-connected-registry.md) as a module on an Azure IoT Edge device. The IoT Edge device can access the parent Azure container registry in the cloud.

For an overview of using a connected registry with IoT Edge, see [Using connected registry with Azure IoT Edge](overview-connected-registry-and-iot-edge.md). This scenario corresponds to a device at the [top layer](overview-connected-registry-and-iot-edge.md#top-layer) of an IoT Edge hierarchy. 


[!INCLUDE [Prepare Azure CLI environment](../../includes/azure-cli-prepare-your-environment.md)]
* Azure IoT Edge device. For deployment steps, see [Quickstart: Deploy your first IoT Edge module to a virtual Linux device](../iot-edge/quickstart-linux.md).
  > [!IMPORTANT]
  > For later access to the modules deployed on the IoT Edge device, make sure that you open the ports 8000, 5671, and 8883 on the device. For configuration steps, see [How to open ports to a virtual machine with the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md). 

* Connected registry resource in Azure. For deployment steps, see [Quickstart: Create a connected registry using the Azure CLI][quickstart-connected-registry-cli]. A connected registry in either `registry` or `mirror` mode can be used in this scenario.

## Import the connected registry image to your registry

To support nested IoT Edge scenarios, the container image for the connected registry runtime must be available in your private Azure container registry. Use the [az acr import][az-acr-import] command to import the connected registry image into your private registry. 

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/acr/connected-registry:0.3.0
```

To learn more about nested IoT Edge scenarios, see [Tutorial: Create a hierarchy of IoT Edge devices](../iot-edge/tutorial-nested-iot-edge.md).

## Import the IoT Edge and API proxy images into your registry

To support the connected registry on nested IoT Edge, you need to import and set up the IoT Edge and API proxy using the private images from the `acronpremiot` registry.

The [IoT Edge API proxy module](../iot-edge/how-to-configure-api-proxy-module.md) allows an IoT Edge device to expose multiple services using the HTTPS protocol on the same port such as 443.

> [!NOTE]
> You can import these images from Microsoft Container Registry if you don't need to create a nested connected registry. See import commands in [Quickstart: Create a connected registry using the Azure CLI](quickstart-connected-registry-cli.md).

```azurecli
az acr import \
  --name $REGISTRY_NAME \
  --source acronpremiot.azurecr.io/acr/microsoft/azureiotedge-agent:20210609.5 \
  --image azureiotedge-agent:20210609.5

az acr import \
  --name $REGISTRY_NAME \
  --source acronpremiot.azurecr.io/acr/microsoft/azureiotedge-hub:20210609.5 \
  --image azureiotedge-hub:20210609.5

az acr import \
  --name $REGISTRY_NAME \
  --source acronpremiot.azurecr.io/acr/microsoft/azureiotedge-api-proxy:9.9.9-dev \
  --image azureiotedge-api-proxy:9.9.9-dev
```

## Create a client token for access to the cloud registry

The IoT Edge runtime will need to authenticate with the cloud registry to pull the images and deploy them. Currently, [token-based authentication](overview-connected-registry-access.md) is used for authentication.

In this section, create a [client token](overview-connected-regstry-access.md#client-tokens) for the IoT Edge device. You will configure the token credentials in the deployment manifest for the device, shown later in this article.

[!INCLUDE [container-registry-connected-client-token](../../includes/container-registry-connected-client-token.md)]

## Retrieve connected registry configuration information

Before deploying the connected registry to the IoT Edge device, you need to retrieve the configuration from the connected registry resource in Azure. Use the [az acr connected-registry install renew-credentials][az-acr-connected-registry-install-renew-credentials] command to retrieve the configuration. The following example specifies HTTPS as the parent protocol. This protocol is required when the parent registry is a cloud registry.

```azurecli
az acr connected-registry install renew-credentials \
  --registry $REGISTRY_NAME \
  --name myconnectedregistry \
  --parent-protocol https
```

This command returns the connection string for the connected registry, including a newly generated password for the [sync token](overview-connected-registry-access.md#sync-token). The following example shows the connection string for the *myconnectedregistry* connected registry with parent registry *contosoregistry*:

```json
{
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedregistry;SyncTokenName=myconnectedregistry-sync-token;SyncTokenPassword=xxxxxxxxxxxxxxxx;ParentGatewayEndpoint=contosoregistry.eastus.data.azurecr.io;ParentEndpointProtocol=https",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server>."
}
```

The preceding JSON lists the environment variables that need to be passed to the connected registry container at runtime. The following environment variables are optional:

- `ACR_REGISTRY_CERTIFICATE_VOLUME` - Use if your connected registry will be accessible via HTTPS. The volume should point to the location where the HTTPS certificates are stored. If not set, the default location is `/var/acr/certs`.
- `ACR_REGISTRY_DATA_VOLUME` - Optionally use to overwrite the default location `/var/acr/data` where the images will be stored by the connected registry. This location must match the volume bind for the container.

You will need the information for the following IoT Edge manifest.

> [!IMPORTANT]
> Make sure that you save the generated connection string. The connection string contains a one-time password that cannot be retrieved. If you issue the command again, a new password will be generated.

## Configure a deployment manifest for IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry and API proxy modules using the Azure CLI, save the following deployment manifest locally as a `manifest.json` file. Use the information from the previous sections to update the relevant JSON values. You will use the file path in the next section when you run the command to apply the configuration to your device.

The API proxy will listen on port 8000 configured as `NGINX_DEFAULT_PORT`. For more information about the API proxy settings, see the [IoT Edge GitHub repo](https://github.com/Azure/iotedge/tree/master/edge-modules/api-proxy-module). 

[!INCLUDE [container-registry-connected-iot-edge-manifest](../../includes/container-registry-connected-iot-edge-manifest.md)]

> [!IMPORTANT]
> If the connected registry listens on a port different from 80 and 443, the `ACR_REGISTRY_LOGIN_SERVER` value must include the port. Example: `192.168.0.100:8080`.

[TODO: FIND OUT IF ACR_REGISTRY_LOGIN_SERVER should be in manifest?]
## Deploy the connected registry and API proxy modules on IoT Edge

Use the following command to deploy the connected registry and API proxy modules on the IoT Edge device, using the deployment manifest created in the previous section.

```azurecli
az iot edge set-modules \
  --device-id <device-id> \
  --hub-name <hub-name> \
  --content manifest.json
```

For details, see [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md).

To check the status of the connected registry, use the following [az acr connected-registry show][az-acr-connected-registry-show] command:

```azurecli
az acr connected-registry show \
  --registry $REGISTRY_NAME \
  --name myconnectedregistry \
  --output table
```

After successful deployment, the connected registry shows a status of `Online`.

## Next steps

In this quickstart, you learned how to deploy a connected registry to an IoT Edge device. Continue to the next guides to learn how to pull images from the newly deployed connected registry or to deploy the connected registry on nested IoT Edge devices.


> [!div class="nextstepaction"]
> [Quickstart: Pull images from a connected registry][quickstart-pull-images-from-connected-registry]


> [!div class="nextstepaction"]
> [Quickstart: Deploy connected registry on nested IoT Edge devices][quickstart-connected-registry-nested]

<!-- LINKS - internal -->
[az-acr-connected-registry-install-renew-credentials]: /cli/azure/acr/connected-registry/install#az_acr_connected_registry_install_renew_credentials
[az-acr-connected-registry-show]: /cli/azure/acr/connected-registr#az_acr_connected_registry_show
[az-acr-import]:/cli/azure/acr#az_acr_import
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential?#az_acr_token_credential_generate
[container-registry-intro]: container-registry-intro.md
[quickstart-pull-images-from-connected-registry]: quickstart-pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
[quickstart-connected-registry-nested]: quickstart-deploy-connected-registry-nested-iot-edge-cli.md
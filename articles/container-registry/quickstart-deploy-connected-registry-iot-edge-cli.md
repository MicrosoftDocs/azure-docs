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

* Connected registry resource in Azure. For deployment steps, see [Quickstart: Create a connected registry using the Azure CLI][quickstart-connected-registry-cli]. A connected registry in either `read-write` or `read-only` mode can be used in this scenario. In the commands in this article, the connected registry name is stored in the environment variable *$CONNECTED_REGISTRY_RW*.

[!INCLUDE [container-registry-connected-import-images](../../includes/container-registry-connected-import-images.md)]

[!INCLUDE [container-registry-connected-client-token](../../includes/container-registry-connected-client-token.md)]

## Retrieve connected registry configuration information

Before deploying the connected registry to the IoT Edge device, you need to retrieve the configuration from the connected registry resource in Azure. You will need the information for the IoT Edge manifest used in a later section. 

Use the [az acr connected-registry install renew-credentials][az-acr-connected-registry-install-renew-credentials] command to retrieve the configuration. The following example specifies HTTPS as the parent protocol. This protocol is required when the parent registry is a cloud registry.

```azurecli
az acr connected-registry install renew-credentials \
  --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RW \
  --parent-protocol https
```

This command returns the connection string for the connected registry, including a newly generated password for the [sync token](overview-connected-registry-access.md#sync-token). 

The following example output shows the connection string for the *myconnectedregistry* connected registry with parent registry *contosoregistry*:

```json
{
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedregistry;SyncTokenName=myconnectedregistry-sync-token;SyncTokenPassword=xxxxxxxxxxxxxxxx;ParentGatewayEndpoint=contosoregistry.eastus.data.azurecr.io;ParentEndpointProtocol=https",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server>."
}
```

The `ACR_REGISTRY_CONNECTION_STRING` environment variable needs to be passed to the connected registry container at runtime. The following environment variables are optional:

- `ACR_REGISTRY_LOGIN_SERVER` - Optionally specify the login server to access the connected registry. If specified, it is the only login server that can be used to access the connected registry. If no value is provided, then the connected registry can be accessed with any login server.
- `ACR_REGISTRY_CERTIFICATE_VOLUME` - Optionally use if your connected registry will be accessible via HTTPS. The volume should point to the location where the HTTPS certificates are stored. If not set, the default location is `/var/acr/certs`.
- `ACR_REGISTRY_DATA_VOLUME` - Optionally use to overwrite the default location `/var/acr/data` where the images will be stored by the connected registry. This location must match the volume bind for the container.

> [!IMPORTANT]
> Make sure that you save the generated connection string. The connection string contains a one-time password that cannot be retrieved. If you issue the command again, a new password will be generated.

## Configure a deployment manifest for IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry and API proxy modules using the Azure CLI, save the following deployment manifest locally as a `manifest.json` file. You will use the file path in the next section when you run the command to apply the configuration to your device.
* Use the information from the previous sections to update the relevant JSON values for the modules. 
* Envionment variables for the connected registry   module are defined in the `env` node. Add optional varibles in this node.
* The API proxy will listen on port 8000 configured as `NGINX_DEFAULT_PORT`. For more information about the API proxy settings, see the [IoT Edge GitHub repo](https://github.com/Azure/iotedge/tree/master/edge-modules/api-proxy-module). 

[!INCLUDE [container-registry-connected-iot-edge-manifest](../../includes/container-registry-connected-iot-edge-manifest.md)]

> [!IMPORTANT]
> If the connected registry listens on a port different from 80 and 443, the `ACR_REGISTRY_LOGIN_SERVER` value (if specified) must include the port. Example: `192.168.0.100:8080`.

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
> [Pull images from a connected registry][pull-images-from-connected-registry]

> [!div class="nextstepaction"]
> [Tutorial: Deploy connected registry on nested IoT Edge devices][quickstart-connected-registry-nested]

<!-- LINKS - internal -->
[az-acr-connected-registry-install-renew-credentials]: /cli/azure/acr/connected-registry/install#az_acr_connected_registry_install_renew_credentials
[az-acr-connected-registry-show]: /cli/azure/acr/connected-registr#az_acr_connected_registry_show
[az-acr-import]:/cli/azure/acr#az_acr_import
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential?#az_acr_token_credential_generate
[container-registry-intro]: container-registry-intro.md
[pull-images-from-connected-registry]: pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
[tutorial-connected-registry-nested]: tutorial-deploy-connected-registry-nested-iot-edge-cli.md
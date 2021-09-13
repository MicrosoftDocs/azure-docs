---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 09/10/2021
ms.author: danlep
---
## Import the connected registry image to your registry

To support nested IoT Edge scenarios, the container image for the connected registry runtime must be available in your private Azure container registry. Use the [az acr import](/cli/azure/acr#az_acr_import) command to import the connected registry image into your private registry. 

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/acr/connected-registry:0.3.0
```

## Import the IoT Edge and API proxy images into your registry

To support the connected registry on nested IoT Edge, you need to import and set up the IoT Edge and API proxy using the private images from the `acronpremiot` registry.

The [IoT Edge API proxy module](../articles/iot-edge/how-to-configure-api-proxy-module.md) allows an IoT Edge device to expose multiple services using the HTTPS protocol on the same port such as 443.

> [!NOTE]
> You can import these images from Microsoft Container Registry if you don't need to create a nested connected registry. See import commands in [Quickstart: Create a connected registry using the Azure CLI](../articles/container-registryquickstart-connected-registry-cli.md).

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
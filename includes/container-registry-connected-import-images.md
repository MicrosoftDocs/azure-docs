---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 09/10/2021
ms.author: danlep
---
## Import the connected registry image to your registry

To support nested IoT Edge scenarios, the container image for the connected registry runtime must be available in your private Azure container registry. Use the [az acr import](/cli/azure/acr#az_acr_import) command to import the connected registry image into your private registry, if you haven't previously done so. 

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/acr/connected-registry:0.3.0
```

## Import the IoT Edge and API proxy images into your registry

To support the connected registry on nested IoT Edge, you need to deploy modules for the IoT Edge and API proxy. If you haven't already done so, import these images into your private registry.

The [IoT Edge API proxy module](../articles/iot-edge/how-to-configure-api-proxy-module.md) allows an IoT Edge device to expose multiple services using the HTTPS protocol on the same port such as 443.

```azurecli
az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-agent: 1.2.3

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-hub:1.2.3

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-api-proxy:1.0
```
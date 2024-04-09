---
author: tejaswikolli-web
ms.service: container-registry
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 08/16/2022
ms.author: tejaswikolli
---
## Import images to your cloud registry

Import the following container images to your cloud registry using the [az acr import](/cli/azure/acr#az-acr-import) command. Skip this step if you already imported these images.

### Connected registry image

To support nested IoT Edge scenarios, the container image for the connected registry runtime must be available in your private Azure container registry. Use the [az acr import](/cli/azure/acr#az-acr-import) command to import the connected registry image into your private registry. 

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/acr/connected-registry:0.8.0
```

### IoT Edge and API proxy images

To support the connected registry on nested IoT Edge, you need to deploy modules for the IoT Edge and API proxy. Import these images into your private registry.

The [IoT Edge API proxy module](../articles/iot-edge/how-to-configure-api-proxy-module.md) allows an IoT Edge device to expose multiple services using the HTTPS protocol on the same port such as 443.

```azurecli
az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-agent:1.2.4

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-hub:1.2.4

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-api-proxy:1.1.2

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-diagnostics:1.2.4
```

### Hello-world image

For testing the connected registry, import the `hello-world` image. This repository will be synchronized to the connected registry and pulled by the connected registry clients.

```azurecli
az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/hello-world:1.1.2
```

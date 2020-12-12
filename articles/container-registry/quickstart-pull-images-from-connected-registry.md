---
title: Quickstart - Pull images from a connected registry
description: Use Azure Container Registry CLI commands configure a client token and pull images from a connected registry.
ms.topic: quickstart
ms.date: 12/04/2020
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Pull images from a connected registry

In this quickstart, you use [Azure Container Registry][container-registry-intro] commands to configure a client token for a connected registry and use this client token to pull images. You can review the [ACR connected registry introduction](intro-connected-registry.md) for details about the connected registry feature of Azure Container Registry.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Before you begin

Make sure that you have created the connected registry resource in Azure as described in the [Create connected registry using the CLI][quickstart-connected-registry-cli] quickstart guide and have a connected registry deployed on your premises as described in [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md) or [Quickstart: Deploy a connected registry to an Azure Arc cluster](quickstart-deploy-connected-registry-azure-arc.md).

## Create a scope map

Use the following CLI command to create a scope map for read access to the `hello-world` repository:

```azurecli-interactive
az acr scope-map create \
  --name hello-world-scopemap \
  --registry mycontainerregistry001 \
  --repository hello-world content/read \
  --description "Scope map for the connected registry."
```

## Create a client token

Use the following CLI command to create a client token and associate it with the newly created scope map:

```azurecli-interactive
az acr token create \
  --name myconnectedregistry-client-token \
  --registry mycontainerregistry001 \
  --scope-map hello-world-scopemap
```

The command will return details about the newly generated token including passwords.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved.

## Update the connected registry with the client token

Use the following CLI command to update the connected registry with the newly created client token:

```azurecli-interactive
az acr connected-registry update \
  --name myconnectedregistry \
  --registry mycontainerregistry001 \
  --add-client-token myconnectedregistry-client-token
```

## Pull an image from the connected registry

From a machine with access to the connected registry instance, use the following command to sign into the connected registry:

```
docker login -u myconnectedregistry-client-token -p <use_the_password_for_the_token> <use_the_ip_address_of_the_connected_registry>
```

Use the following command to pull the `hello-world` image:

```
docker pull <use_the_ip_address_of_the_connected_registry>/hello-world
```

## Next steps

In this quickstart, you learned how to configure a client token for the connected registry and pull a container image.

<!-- LINKS - internal -->
[container-registry-intro]: container-registry-intro.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
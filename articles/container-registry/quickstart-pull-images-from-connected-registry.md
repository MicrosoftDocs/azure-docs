---
title: Quickstart - Pull images from a connected registry
description: Use Azure Container Registry CLI commands to configure a client token and pull images from a connected registry.
ms.topic: quickstart
ms.date: 09/01/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Pull images from a connected registry

In this quickstart, you use Azure CLI commands to configure a client token for a [connected registry](intro-connected-registry.md) and use this client token to pull images from the registry.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]
* Connected registry resource in Azure. For deployment steps, see [Quickstart: Create a connected registry using the Azure CLI][quickstart-connected-registry-cli].
* Connected registry instance deployed on an IoT Edge device. For deployment steps, see [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md) or [TODO FILL IN HERE].

## Create a scope map

Use the [az acr scope-map create][az-acr-scope-map-create] command to create a scope map for read access to the `hello-world` repository:

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

az acr scope-map create \
  --name hello-world-scopemap \
  --registry $REGISTRY_NAME \
  --repository hello-world content/read \
  --description "Scope map for the connected registry."
```

## Create a client token

Use the [az acr token create][az-acr-token-create] command to create a client token and associate it with the newly created scope map:

```azurecli
az acr token create \
  --name myconnectedregistry-client-token \
  --registry $REGISTRY_NAME \
  --scope-map hello-world-scopemap
```

The command will return details about the newly generated token including passwords.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

## Update the connected registry with the client token

Use the [az acr connected-registry update][az-acr-connected-registry-update] command to update the connected registry with the newly created client token. In this example the connected registry is named *myconnectedregistry*.

```azurecli
az acr connected-registry update \
  --name myconnectedregistry \
  --registry $REGISTRY_NAME \
  --add-client-token myconnectedregistry-client-token
```

## Pull an image from the connected registry

From a machine with access to the connected registry instance, use the following command to sign into the connected registry, using the client token credentials:

```
docker login --username myconnectedregistry-client-token \
  --password <use_the_password_for_the_token> <use_the_ip_address_of_the_connected_registry>
```
[TODO: REPLACE WITH PASSWD_STDIN form, and explain how to get IP of CR]

Then, use the following command to pull the `hello-world` image:

```
docker pull <use_the_ip_address_of_the_connected_registry>/hello-world
```

## Next steps

In this quickstart, you learned how to configure a client token for the connected registry and pull a container image.

<!-- LINKS - internal -->
[az-acr-scope-map-create]: /cli/azure/acr/token/#az_acr_token_create
[az-acr-token-create]: /cli/azure/acr/token/#az_acr_token_create
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential#az_acr_token_credential_generate
[az-acr-connected-registry-update]: /cli/azure/acr/connect-registry#az_acr_connected_registry_update] 
[container-registry-intro]: container-registry-intro.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
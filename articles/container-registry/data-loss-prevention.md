---
title: Disable export of artifacts
description: Set a registry property to prevent data exfiltration from a Premium Azure container registry.
ms.topic: how-to
ms.custom: devx-track-azurecli
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Disable export of artifacts from an Azure container registry 

To prevent registry users in an organization from maliciously or accidentally leaking artifacts outside a virtual network, you can configure the registry's *export policy* to disable exports.

Export policy is a property introduced in API version **2021-06-01-preview** for Premium container registries. The `exportPolicy` property, when its status is set to `disabled`, blocks export of artifacts from a network-restricted registry when a user attempts to:

* [Import](container-registry-import-images.md) the registry's artifacts to another Azure container registry
* Create a registry [export pipeline](container-registry-transfer-images.md) to transfer artifacts to another container registry

> [!NOTE]
> Disabling export of artifacts does not prevent authorized users' access to the registry within the virtual network to pull artifacts or perform other data-plane operations. To audit this use, we recommend that you configure diagnostic settings to [monitor](monitor-service.md) registry operations. 

## Prerequisites

* A Premium container registry configured with a [private endpoint](container-registry-private-link.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Other requirements to disable exports

* **Disable public network access** - To disable export of artifacts, public access to the registry must also be disabled (the registry's `publicNetworkAccess` property must be set to `disabled`). You can disable public network access to the registry before disabling export or disable it at the same time.

    By disabling access to the registry's public endpoint, you ensure that registry operations are permitted only within the virtual network. Public access to the registry to pull artifacts and perform other operations is prohibited. 

*  **Remove export pipelines** - Before setting the registry's `exportPolicy` status to `disabled`, delete any existing export pipelines configured on the registry. If a pipeline is configured, you can't change the `exportPolicy` status.

## Disable exportPolicy for an existing registry

When you create a registry, the `exportPolicy` status is set to `enabled` by default, which permits artifacts to be exported. You can update the status to `disabled` using an ARM template or the `az resource update` command.

### ARM template 

Include the following JSON to update the `exportPolicy` status and set the `publicNetworkAccess` property to `disabled`. Learn more about [deploying resources with ARM templates](../azure-resource-manager/templates/deploy-cli.md).

```json
{
[...]
"resources": [
    {
    "type": "Microsoft.ContainerRegistry/registries",
    "apiVersion": "2021-06-01-preview",
    "name": "myregistry",
    [...]
    "properties": {
      "publicNetworkAccess": "disabled",
      "policies": {
        "exportPolicy": {
          "status": "disabled"
         }
      }
      }
    }
]
[...]
}
```

### Azure CLI

Run [az resource update](/cli/azure/resource/#az-resource-update) to set the `exportPolicy` status in an existing registry to `disabled`. Substitute the names of your registry and resource group.

As shown in this example, when disabling the `exportPolicy` property, also set the `publicNetworkAccess` property to `disabled`.

```azurecli
az resource update --resource-group myResourceGroup \
    --name myregistry \
    --resource-type "Microsoft.ContainerRegistry/registries" \
    --api-version "2021-06-01-preview" \
    --set "properties.policies.exportPolicy.status=disabled" \
    --set "properties.publicNetworkAccess=disabled"  
```

The output shows that the export policy status is disabled.

```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
  "identity": null,
  "kind": null,
  "location": "centralus",
  "managedBy": null,
  "name": "myregistry",
  "plan": null,
  "properties": {
    [...]
    "policies": {
      "exportPolicy": {
        "status": "disabled"
      },
      "quarantinePolicy": {
        "status": "disabled"
      },
      "retentionPolicy": {
        "days": 7,
        "lastUpdatedTime": "2021-07-20T23:20:30.9985256+00:00",
        "status": "disabled"
      },
      "trustPolicy": {
        "status": "disabled",
        "type": "Notary"
      },
    "privateEndpointConnections": [],
    "provisioningState": "Succeeded",
    "publicNetworkAccess": "Disabled",
    "zoneRedundancy": "Disabled"
[...]
}
```

## Enable exportPolicy 

After disabling the `exportPolicy` status in a registry, you can re-enable it at any time using an ARM template or the `az resource update` command.

### ARM template 

Include the following JSON to update the `exportPolicy` status to `enabled`. Learn more about [deploying resources with ARM templates](../azure-resource-manager/templates/deploy-cli.md)

```json
{
[...]
"resources": [
    {
    "type": "Microsoft.ContainerRegistry/registries",
    "apiVersion": "2021-06-01-preview",
    "name": "myregistry",
    [...]
    "properties": {
     "policies": {
        "exportPolicy": {
          "status": "enabled"
         }
      }
      }
    }
]
[...]
}
```

### Azure CLI

Run [az resource update](/cli/azure/resource/#az-resource-update) to set the `exportPolicy` status to `enabled`. Substitute the names of your registry and resource group.

```azurecli
az resource update --resource-group myResourceGroup \
    --name myregistry \
    --resource-type "Microsoft.ContainerRegistry/registries" \
    --api-version "2021-06-01-preview" \
    --set "properties.policies.exportPolicy.status=enabled"
```
 
## Next steps

* Learn about [Azure Container Registry roles and permissions](container-registry-roles.md).
* If you want to prevent accidental deletion of registry artifacts, see [Lock container images](container-registry-image-lock.md).
* Learn about built-in [Azure policies](container-registry-azure-policy.md) to secure your Azure container registry

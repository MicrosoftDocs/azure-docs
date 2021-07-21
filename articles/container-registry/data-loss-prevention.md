---
title: Prevent image export from a registry
description: Set a registry property and policy to prevent exfiltration of registry artifacts.
ms.topic: how-to
ms.date: 07/20/2021
---

# Prevent export of artifacts from an Azure container registry 

[INTRO]

Export policy is a nested policy property on a registry resource. This property, when it's status is disabled, prevents exports via import and acr transfer.

The export policy feature is being introduced in API version **2021-06-01-preview**.

If you want to prevent accidental deletion of registry artifacts, see [Lock container images](container-registry-lock-images.md)

[AZURE CLI include]

## Create a registry with the exportPolicy setting disabled

By default, when you create a registry, the `exportPolicy` status in a registry is set to `enabled`.

You can use an Azure Resource Manager template to create a registry with the `exportPolicy` status set to `disabled`. Add the following JSON in the `policies` object of the template:

```json
{
  "name": "myregistry",
  "type": "Microsoft.ContainerRegistry/registries",
  "apiVersion": "2020-11-01-preview",
  [...]
  "policies" {
    "exportPolicy": {
        "status": "disabled"
  }
  [...]
}
```

## Disable exportPolicy setting for an existing registry

By default, the `exportPolicy` status in a registry is set to `enabled`.

Use the following [az resource update](/cli/azure/resource/#az_resource_update) command to set the `exportPolicy` status to `disabled`. Substitute the names of your registry and resource group.

> [!NOTE]
> When disabling the `exportPolicy` property, you must also disable public network access by setting the `publicNetworkAccess` property to `disabled`.

```azurecli
az resource update --resource-group myResourceGroup \
    --name myregistry \
    --resource-type "Microsoft.ContainerRegistry/registries" \
    --api-version "2021-06-01-preview" \
    --set "properties.policies.exportPolicy.Status=disabled" \
    --set "properties.publicNetworkAccess=disabled"  
```

The output shows that the export policy is disabled.

```console

  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
  "identity": null,
  "kind": null,
  "location": "centralus",
  "managedBy": null,
  "name": "myregistry",
  "plan": null,
  "properties": {
    "adminUserEnabled": false,
    "anonymousPullEnabled": false,
    "creationDate": "2021-07-13T20:06:31.9290934Z",
    "dataEndpointEnabled": false,
    "dataEndpointHostNames": [],
    "encryption": {
      "status": "disabled"
    },
    "loginServer": "myregistry .azurecr.io",
    "networkRuleBypassOptions": "AzureServices",
    "networkRuleSet": {
      "defaultAction": "Allow",
      "ipRules": [],
      "virtualNetworkRules": []
    },
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
      }
[...]
```

## Re-enable exportPolicy setting

After disabling the `exportPolicy` status in a registry, you can re-enable it at anytime.

Use the following [az resource update](/cli/azure/resource/#az_resource_update) command to set the `exportPolicy` status to `enabled`. Substitute the names of your registry and resource group.

> [!NOTE]
> When enabling the `exportPolicy` property, you must also enable public network access by setting the `publicNetworkAccess` property to `enabled`.

```azurecli
az resource update --resource-group myResourceGroup \
    --name myregistry \
    --resource-type "Microsoft.ContainerRegistry/registries" \
    --api-version "2021-06-01-preview" \
    --set "properties.policies.exportPolicy.Status=enabled" \
    --set "properties.publicNetworkAccess=enabled"  
```
 

## Next steps

In this article, you learned about ...

<!-- LINKS - Internal -->
[az-acr-repository-update]: /cli/azure/acr/repository#az_acr_repository_update
[az-acr-repository-show]: /cli/azure/acr/repository#az_acr_repository_show
[az-acr-repository-show-manifests]: /cli/azure/acr/repository#az_acr_repository_show_manifests
[azure-cli]: /cli/azure/install-azure-cli
[container-registry-delete]: container-registry-delete.md

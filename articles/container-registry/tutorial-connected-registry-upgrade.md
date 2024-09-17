---
title: "Upgrade and roll back connected registry Arc extension version"
description: "Upgrade and roll back the connected registry Arc extension version. Learn how to upgrade and roll back the connected registry extension version in this tutorial."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: tutorial  #Don't change.
ms.date: 06/17/2024

#customer intent: Learn how to upgrade and roll back the connected registry Arc extension.
---

# Upgrade and roll back the connected registry extension version

In this tutorial, you learn how to upgrade and roll back the connected registry extension version. 

## Prerequisites

To complete this tutorial, you need the following resources:

* Follow the [quickstart][quickstart] as needed. 

## Deploy the connected registry extension with auto upgrade enabled

Follow the [quickstart][quickstart] to edit the [az-k8s-extension-create][az-k8s-extension-create] command and include the `--auto-upgrade-minor-version true` parameter. This parameter automatically upgrades the extension to the latest version whenever a new version is available. 

```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \ 
    --config-protected-file protected-settings-extension.json \  
    --auto-upgrade-minor-version true
```

## Deploy the connected registry extension with auto roll back enabled

> [!IMPORTANT]
> When a customer pins to a specific version, the extension does not auto-rollback. Auto-rollback will only occur if the--auto-upgrade-minor-version flag is set to true.

Follow the [quickstart][quickstart] to edit the [az k8s-extension update] command and add --version with your desired version. This example uses version 0.6.0. This parameter updates the extension version to the desired pinned version. 

```azurecli
    az k8s-extension update --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \
    --config-protected-file <JSON file path> \
    --auto-upgrade-minor-version true \
    --version 0.6.0 
```

## Deploy the connected registry extension using manual upgrade steps

Follow the [quickstart][quickstart] to edit the [az-k8s-extension-update][az-k8s-extension-update] command and add--version with your desired version. This example uses version 0.6.1. This parameter upgrades the extension version to 0.6.1. 

```azurecli
    az k8s-extension update --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \
    --auto-upgrade-minor-version false \
    --version 0.6.1 
```

## Next steps

In this tutorial, you learned how to upgrade the Connected registry extension with Azure Arc. 

- [Enable Connected registry with Azure arc CLI][quickstart]
- [Deploy the Connected registry Arc extension](tutorial-connected-registry-arc.md)
- [Sync Connected registry with Azure arc](tutorial-connected-registry-sync.md)
- [Troubleshoot Connected registry with Azure arc](troubleshoot-connected-registry-arc.md)
- [Glossary of terms](connected-registry-glossary.md)

[quickstart]: quickstart-connected-registry-arc-cli.md
[az-k8s-extension-create]: /cli/azure/k8s-extension#az-k8s-extension-create
[az-k8s-extension-update]: /cli/azure/k8s-extension#az-k8s-extension-update

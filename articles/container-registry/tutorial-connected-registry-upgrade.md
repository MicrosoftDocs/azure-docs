---
title: " Upgrade and Rollback Connected registry with Azure arc"
description: "Upgrade and Roll back the Connected registry extension with Azure Arc for secure the extension deployment."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: tutorial  #Don't change.
ms.date: 06/17/2024

#customer intent: Learn how to upgrade and rollback the Connected registry extension with Azure Arc to secure the extension deployment.
---

# Upgrade and Rollback with Connected registry with Azure arc

In this tutorial, you learn how to upgrade the Connected registry extension with Azure Arc. The upgrade process includes securing the extension deployment with HTTPS, Transport Layer Security (TLS) encryption, and upgrades/rollbacks.

You learn how to:

> [!div class="checklist"]
> - [Deploy the Connected registry Arc extension with auto upgrade](#deploy-the-connected-registry-arc-extension-with-auto-upgrade).
> - [Deploy the Connected registry Arc extension with auto rollback](#deploy-the-connected-registry-arc-extension-with-auto-rollback).
> - [Deploy the Connected registry Arc extension with manual upgrade](#deploy-the-connected-registry-arc-extension-with-manual-upgrade).

## Prerequisites

To complete this tutorial, you need the following resources:

* Follow the [quickstart][quickstart] to create an Azure Arc-enabled Kubernetes cluster. Deploying with Secure-by-default settings imply the following configuration is being used: HTTPS, Read Only, Trust Distribution, Cert Manager service. 

## Deploy the Connected registry Arc extension with auto upgrade

1. Follow the [quickstart][quickstart] to edit the [az-k8s-extension-create][az-k8s-extension-create] command and include the `--auto-upgrade-minor-version true` parameter. This parameter automatically upgrades the extension to the latest version whenever a new version is available. 

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

## Deploy the Connected registry Arc extension with auto rollback

> [!IMPORTANT]
> When a customer pins to a specific version, the extension does not auto-rollback. Auto-rollback will only occur if the--auto-upgrade-minor-version is set to true.

1. Follow the [quickstart][quickstart] to edit the [az k8s-extension update] command and add --version with your desired version. This example uses version 0.6.0. This parameter updates the extension version to the desired pinned version. 

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

## Deploy the Connected registry arc extension with manual upgrade

1. Follow the [quickstart][quickstart] to edit the [az-k8s-extension-update][az-k8s-extension-update] command and add--version with your desired version. This example uses version 0.6.1. This parameter upgrades the extension version to 0.6.1. 

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

> [!div class="nextstepaction"]
> [Enable Connected registry with Azure arc CLI][quickstart]
> [Deploy the Connected registry Arc extension](tutorial-connected-registry-arc.md)
> [Sync Connected registry with Azure arc](tutorial-connected-registry-sync.md)
> [Troubleshoot Connected registry with Azure arc](troubleshoot-connected-registry-arc.md)
> [Glossary of terms](connected-registry-glossary.md)

[quickstart]: quickstart-connected-registry-arc-cli.md
[az-k8s-extension-create]: /cli/azure/k8s-extension#az-k8s-extension-create
[az-k8s-extension-update]: /cli/azure/k8s-extension#az-k8s-extension-update
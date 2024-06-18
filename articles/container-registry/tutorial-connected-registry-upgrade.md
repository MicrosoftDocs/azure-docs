---
title: " Upgrade and Rollback Connected registry with Azure arc"
description: "Secure the Connected registry extension deployment with HTTPS, TLS encryption, and upgrades/rollbacks."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 06/17/2024

#customer intent: Learn how to deploy the Connected registry extension with HTTPS, TLS encryption, and upgrades/rollbacks to secure the extension deployment. 

---

# Upgrade and Rollback with Connected registry with Azure arc

In this tutorial, you learn how to upgrade the Connected registry extension with Azure Arc. The upgrade process includes securing the extension deployment with HTTPS, TLS encryption, and upgrades/rollbacks.

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
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 trustDistribution.enabled=true trustDistribution.skipNodeSelector=true cert-manager.enabled=false cert-manager.install=false HttpsEnabled=false \ 
     --config-protected-file <JSON file path> \
     --auto-upgrade-minor-version true
    ```

## Deploy the Connected registry Arc extension with auto rollback

1. Follow the [quickstart][quickstart] to edit the [az k8s-extension update] command and add--version with your desired version. This example uses version 0.6.0. This parameter updates the extension version to the desired pinned version. 

    ```azurecli
    az k8s-extension update --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup 
    --config service.clusterIP=192.100.100.1 trustDistribution.enabled=true trustDistribution.skipNodeSelector=true cert-manager.enabled=false cert-manager.install=false HttpsEnabled=false \ 
    --config-protected-file <JSON file path> 
    --version 0.6.0 
    ```

## Deploy the Connected registry arc extension with manual upgrade

1. Follow the [quickstart][quickstart] to edit the [az-k8s-extension-update][az-k8s-extension-update] command and add--version with your desired version. This example uses version 0.6.1. This parameter upgrades the extension version to 0.6.1. 

    ```azurecli
    az k8s-extension update --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --version 0.6.1 
    ```

## Next steps

In this tutorial, you learned how to upgrade the Connected registry extension with Azure Arc. 

> [!div class="nextstepaction"]
> [Enable Connected registry with Azure arc CLI][quickstart]
> [Deploy the Connected registry Arc extension](tutorial-connected-registry-arc.md)
> [Sync Connected registry with Azure arc](tutorial-connected-registry-sync.md)
> [Troubleshoot Connected registry with Azure arc](troubleshoot-connected-registry-arc.md)

[quickstart]: quickstart-enable-connected-registry-arc-cli.md
[az-k8s-extension-create]: /cli/azure/k8s-extension#az-k8s-extension-create
[az-k8s-extension-update]: /cli/azure/k8s-extension#az-k8s-extension-update
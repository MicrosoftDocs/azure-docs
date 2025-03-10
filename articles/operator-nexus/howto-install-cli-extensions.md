---
title: "Azure Operator Nexus: Install CLI extensions"
description: Learn to install the needed Azure CLI extensions for Operator Nexus
author: Travisivart
ms.author: travisneely
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 09/05/2024
# ms.custom: template-include
---

# Prepare to install Azure CLI extensions
This how-to guide explains the steps for installing the required az CLI and extensions required to interact with Operator Nexus.

Installations of the following CLI extensions are required:
`networkcloud` (for Microsoft.NetworkCloud APIs) and `managednetworkfabric` (for Microsoft.ManagedNetworkFabric APIs).

If you haven't already installed Azure CLI: [Install Azure CLI][installation-instruction]. The aka.ms links download the latest available version of the extension.
For list of available versions, see [the extension release history][az-cli-networkcloud-cli-versions].

## Install `networkcloud` CLI extension

- Upgrade any previously installed version of the extension

    ```azurecli
    az extension add --yes --upgrade --name networkcloud
    ```

- Install and test the latest version of `networkcloud` CLI extension

    ```azurecli
    az extension add --name networkcloud
    az networkcloud --help
    ```

## Install `managednetworkfabric` CLI extension

- Upgrade any previously installed version of the extension

    ```azurecli
    az extension add --yes --upgrade --name managednetworkfabric
    ```

- Install and test the `managednetworkfabric` CLI extension

    ```azurecli
    az extension add --name managednetworkfabric
    az networkfabric --help
    ```

## Install other Azure extensions

   ```azurecli
   az extension add --yes --upgrade --name customlocation
   az extension add --yes --upgrade --name k8s-extension
   az extension add --yes --upgrade --name k8s-configuration
   az extension add --yes --upgrade --name connectedmachine
   az extension add --yes --upgrade --name monitor-control-service
   az extension add --yes --upgrade --name ssh
   az extension add --yes --upgrade --name connectedk8s
   ```

- List installed CLI extensions and versions

List the extension version running:

```azurecli
az extension list --query "[].{Name:name,Version:version}" -o table
```

Example output:

```output
Name                     Version
-----------------------  -------------
monitor-control-service  0.4.1
connectedmachine         0.7.0
connectedk8s             1.9.2
k8s-extension            1.4.3
networkcloud             1.1.0
k8s-configuration        2.0.0
managednetworkfabric     6.4.0
customlocation           0.1.3
ssh                      2.0.5
```

<!-- LINKS - External -->
[installation-instruction]: https://aka.ms/azcli

[az-cli-networkcloud-cli-versions]: https://github.com/Azure/azure-cli-extensions/blob/main/src/networkcloud/HISTORY.rst

---
title: "Azure Operator Nexus: Install CLI extensions"
description: Learn to install the needed Azure CLI extensions for Operator Nexus
author: Travisivart
ms.author: travisneely
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 08/01/2023
# ms.custom: template-include
---

# Prepare to install Azure CLI extensions
This how-to guide explains the steps for installing the required az CLI and extensions required to interact with Operator Nexus.

Installations of the following CLI extensions are required:
`networkcloud` (for Microsoft.NetworkCloud APIs), `managednetworkfabric` (for Microsoft.ManagedNetworkFabric APIs) and `hybridaks` (for AKS-Hybrid APIs).

If you haven't already installed Azure CLI: [Install Azure CLI][installation-instruction]. The aka.ms links download the latest available version of the extension.

## Install `networkcloud` CLI extension

- Remove any previously installed version of the extension

    ```azurecli
    az extension remove --name networkcloud
    ```


- Install and test the latest version of `networkcloud` CLI extension

    ```azurecli
    az extension add --name networkcloud
    az networkcloud --help
    ```

For list of available versions, see [the extension release history][az-cli-networkcloud-cli-versions].

To install a specific version of the networkcloud CLI extension, add `--version` parameter to the command. For example, below installs 0.4.1

```azurecli
az extension add --name networkcloud --version 0.4.1
```

## Install `managednetworkfabric` CLI extension

- Remove any previously installed version of the extension

    ```azurecli
    az extension remove --name managednetworkfabric
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
   az extension add --yes --upgrade --name monitor-control-service --version 0.2.0
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
monitor-control-service  0.2.0
connectedmachine         0.5.1
connectedk8s             1.3.20
k8s-extension            1.4.2
networkcloud             1.0.0b2
k8s-configuration        1.7.0
managednetworkfabric     3.1.0
customlocation           0.1.3
ssh                      2.0.1
```

<!-- LINKS - External -->
[installation-instruction]: https://aka.ms/azcli

[az-cli-networkcloud-cli-versions]: https://github.com/Azure/azure-cli-extensions/blob/main/src/networkcloud/HISTORY.rst

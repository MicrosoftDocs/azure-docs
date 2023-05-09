---
title: "Azure Operator Nexus: Install CLI extensions"
description: Learn to install the needed Azure CLI extensions for Operator Nexus
author: Travisivart
ms.author: travisneely
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 03/06/2023
# ms.custom: template-include
---

# Prepare to install Azure CLI extensions
This how-to guide explains the steps for installing the required az CLI and extensions required to interact with Operator Nexus.

Installation of the following CLI extensions are required:
`networkcloud` (for Microsoft.NetworkCloud APIs), `managednetworkfabric` (for Microsoft.ManagedNetworkFabric APIs) and `hybridaks` (for AKS-Hybrid APIs).

If you haven't already installed Azure CLI: [Install Azure CLI][installation-instruction]. The aka.ms links download the latest available version of the extension.

## Install `networkcloud` CLI extension

- Remove any previously installed version of the extension

    ```azurecli
    az extension remove --name networkcloud
    ```

- Download the `networkcloud` python wheel

# [Linux / macOS / WSL](#tab/linux+macos+wsl)

```sh
    curl -L "https://aka.ms/nexus-nc-cli" --output "networkcloud-0.0.0-py3-none-any.whl"
```

# [PowerShell](#tab/powershell)

```ps
    curl "https://aka.ms/nexus-nc-cli" -OutFile "networkcloud-0.0.0-py3-none-any.whl"
```

---

- Install and test the `networkcloud` CLI extension

    ```azurecli
    az extension add --source networkcloud-0.0.0-py3-none-any.whl
    az networkcloud --help
    ```

## Install `managednetworkfabric` CLI extension

- Remove any previously installed version of the extension

    ```azurecli
    az extension remove --name managednetworkfabric
    ```

- Download the `managednetworkfabric` python wheel

# [Linux / macOS / WSL](#tab/linux+macos+wsl)

```sh
    curl -L "https://aka.ms/nexus-nf-cli" --output "managednetworkfabric-0.0.0-py3-none-any.whl"
```

# [PowerShell](#tab/powershell)

```ps
    curl "https://aka.ms/nexus-nf-cli" -OutFile "managednetworkfabric-0.0.0-py3-none-any.whl"
```

---

- Install and test the `managednetworkfabric` CLI extension

    ```azurecli
    az extension add --source managednetworkfabric-0.0.0-py3-none-any.whl
    az nf --help
    ```

## Install AKS-Hybrid (`hybridaks`) CLI extension

- Remove any previously installed version of the extension

    ```azurecli
    az extension remove --name hybridaks
    ```

- Download the `hybridaks` python wheel

# [Linux / macOS / WSL](#tab/linux+macos+wsl)

```sh
    curl -L "https://aka.ms/nexus-hybridaks-cli" --output "hybridaks-0.0.0-py3-none-any.whl"
```

# [PowerShell](#tab/powershell)

```ps
    curl "https://aka.ms/nexus-hybridaks-cli" -OutFile "hybridaks-0.0.0-py3-none-any.whl"
```

---

- Install and test the `hybridaks` CLI extension

    ```azurecli
    az extension add --source hybridaks-0.0.0-py3-none-any.whl
    az hybridaks --help
    ```

## Install other Azure extensions

   ```azurecli
   az extension add --yes --upgrade --name customlocation
   az extension add --yes --upgrade --name k8s-extension
   az extension add --yes --upgrade --name k8s-configuration
   az extension add --yes --upgrade --name arcappliance
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
arcappliance             0.2.29
monitor-control-service  0.2.0
connectedmachine         0.5.1
connectedk8s             1.3.8
k8s-extension            1.3.7
networkcloud             0.1.6.post209
k8s-configuration        1.7.0
managednetworkfabric     0.1.0.post24
customlocation           0.1.3
hybridaks                0.1.6
ssh                      1.1.3
```

<!-- LINKS - External -->
[installation-instruction]: https://aka.ms/azcli

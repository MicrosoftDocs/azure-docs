---
title: How to upgrade Network Fabric for Azure Operator Nexus
description: Learn the process for upgrading Network Fabric for Azure Operator Nexus.
author: sushantjrao 
ms.author: sushrao
ms.date: 06/11/2023
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---

# Network Fabric upgrade guide

This how to guide provides a streamlined upgrade process for your network fabric. It is designed to assist users in enhancing their network infrastructure through Azure APIs, which facilitate the lifecycle management of various network devices. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## **Overview**

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate device reboots. The network fabric's design allows for updates to be applied while maintaining continuous data traffic flow.

Runtime changes are categorized as follows:

- **Operating system updates**: Necessary to support new features or resolve issues.

- **Base configuration updates**: Initial settings applied during device bootstrapping.

- **Configuration structure updates**: Generated based on user input for configurations like isolation domains and ACLs. These updates accommodate new features without altering user input.

### **Prerequisites**

Confirm that the Network Fabric Controller is in a 'Provisioned' state.

### **Upgrade workflow**

#### **Step 1: Initiate upgrade**

Start the upgrade with the following command:

```Azure CLI
az networkfabric fabric upgrade -g [resource-group] --resource-name [fabric-name] --action start --version "2.0.0"
```

##### Example Command

```sh
az networkfabric fabric upgrade -g myResourceGroup --resource-name myFabricName --action start --version "2.0.0"
```

| Parameter                | Description                                 | Example                |
|--------------------------|---------------------------------------------|------------------------|
| `-g` or `--resource-group`  | The name of the resource group              | `myResourceGroup`      |
| `--resource-name`        | The name of the fabric to upgrade           | `myFabricName`         |
| `--action`               | Specifies the upgrade action to perform     | `start`                |
| `--version`              | Specifies the version to upgrade to         | `"2.0.0"`              |

Replace `myResourceGroup` and `myFabricName` with the actual names of your resource group and fabric, respectively.

> [!NOTE]
> This command places the NetworkFabric in 'Under Maintenance'.

#### **Step 2: Device-specific upgrades**

Follow the recommended sequence for device upgrades, addressing any failures manually if necessary.

**Device upgrade sequence**:

1. Upgrade Top-of-Rack (TOR) switches concurrently.

2. Update management switches in parallel.

3. Upgrade Network Packet Broker (NPB) devices sequentially.

4. Update Compute Elements (CEs) individually.

5. Lastly, upgrade aggregate rack switches.

**Pre-validation checks**:

- Ensure the network fabric is in a 'Succeeded' state.

- Verify all devices are configured and synchronized.

- Ensure that there is at least **3GB of available disk space** within the directory `/mnt` to proceed with NNF device upgrade .

Upgrade individual devices with the following command:

```Azure CLI
az networkfabric device upgrade --version 2.0.0 -g [resource-group] --resource-name [device-name] --debug
```

##### Example Command

```Azure CLI
az networkfabric device upgrade --version 2.0.0 -g myResourceGroup --resource-name myDeviceName --debug
```

| Parameter            | Description                         | Example                |
|----------------------|-------------------------------------|------------------------|
| `--version`          | Specifies the version to upgrade to | `2.0.0`                |
| `-g` or `--resource-group` | The name of the resource group   | `myResourceGroup`      |
| `--resource-name`    | The name of the device to upgrade   | `myDeviceName`         |
| `--debug`            | Enables debug mode for detailed output | `--debug`              |

Replace `myResourceGroup` and `myDeviceName` with the actual names of your resource group and device, respectively.

#### **Step 3: Finalize upgrade**

After updating all devices, run the completion command to exit maintenance mode:

```Azure CLI
az networkfabric fabric upgrade --action Complete -g [resource-group] --resource-name [fabric-name]
```

##### Example Command

```sh
az networkfabric fabric upgrade --action Complete -g myResourceGroup --resource-name myFabricName
```

| Parameter            | Description                                   | Example                |
|----------------------|-----------------------------------------------|------------------------|
| `--action`           | Specifies the upgrade action to perform       | `Complete`             |
| `-g` or `--resource-group` | The name of the resource group              | `myResourceGroup`      |
| `--resource-name`    | The name of the fabric to upgrade             | `myFabricName`         |

Replace `myResourceGroup` and `myFabricName` with the actual names of your resource group and fabric, respectively.

### **Post-validation**

Check the version status of all devices and the fabric with AZCLI commands.

### **Known issues**

1. Create the EOS image directory manually at `/mnt/nvram/nexus/eosimages` if it is missing. This is especially important for environments built from older NF versions.
2. NNF device upgrades fail when the available disk space within the directory `/mnt` is less than 3GB. Perform a manual clean up to free up disk space within the NNF device and then retry the upgrade operation.


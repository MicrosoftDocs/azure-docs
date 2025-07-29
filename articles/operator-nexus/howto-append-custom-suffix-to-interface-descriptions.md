---
title: Append a Custom Suffix to Interface Descriptions in Azure Operator Nexus Network Fabric
description: Learn how to append and remove a custom suffix from interface descriptions in Azure Operator Nexus Network Fabric for enhanced operational annotations.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Append a custom suffix to interface descriptions in Azure Operator Nexus Network Fabric

This article explains how to append a user-defined suffix (`additionalDescription`) to interface descriptions in Azure Operator Nexus Network Fabric. The primary interface description is read-only, but the `additionalDescription` property provides enhanced flexibility for operational annotations. This approach allows users to customize interface descriptions for specific maintenance or operational requirements without altering the system-generated description.

## Prerequisites

- Have Azure CLI version 2.69 or higher.
- Install the CLI extension `managednetworkfabric` 8.0.0 or higher.

## Steps to append a custom suffix

### Step 1: Check the current interface description

Before you make changes, verify the existing interface description by using the following command:

```Azure CLI
az networkfabric interface show -g "example-rg" \
  --network-device-name "example-device" \
  --resource-name "example-interface" --query description
```

#### Parameter details  

| Parameter                     | Short form | Description |
|--------------------------------|-----------|-------------|
| `az networkfabric interface show` | N/A       | Displays details of a specified network fabric interface. |
| `-g, --resource-group`        | `-g`      | Name of the resource group where the network device resides. |
| `--network-device-name`       | N/A       | Name of the Azure Operator Nexus Network Fabric device. |
| `--resource-name`             | N/A       | Name of the network interface resource. |
| `--query`                     | N/A       | Filters the output to show only the specified field (for example, `description`). |

### Step 2: Append a suffix to the interface description

The primary interface description (for example, `AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23`) is read-only and can't be modified. You can append a custom suffix by using the `additional-description` property. This approach updates the `additional-description` field only while the main description remains unchanged.

To add a custom suffix, use the following command:

```Azure CLI
az networkfabric interface update --additional-description "example-description" \
  --device "example-device" \
  -g "example-resource-group" \
  --resource-name "example-interface"
```

#### Parameter details

| Parameter                | Description                                      | Constraints |
|--------------------------|--------------------------------------------------|-------------|
| `--additional-description` | Provides an additional description for the interface update. | Alphanumeric (`A-Z`, `a-z`, `0-9`), `-`, and `_` are allowed. Maximum of 64 characters. Can be an empty string with a space or null. |
| `--device`               | Specifies the name of the Azure Operator Nexus Network Fabric device. | No specific constraints. |
| `-g, --resource-group`   | Defines the name of the resource group where the device is located. | No specific constraints. |
| `--resource-name`        | Indicates the name of the network interface resource. | No specific constraints. |

### Step 3: Commit the configuration

After you update the description, apply the changes to the fabric:

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "example-rg" --resource-name "example-fabric"
```

#### Parameter details

| Parameter            | Short form | Description |
|----------------------|-----------|-------------|
| `--resource-group`  | `-g`      | Name of the resource group |
| `--resource-name`   | N/A       | Name of the Azure Operator Nexus Network Fabric resource |

### Example

#### Original interface description

```Azure CLI
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23
```

#### Updated description

```Azure CLI
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23-Additional_description-1234
```

## Steps to remove a custom suffix

### Step 1: Remove the interface description

To restore the default description, set `additionalDescription` to an empty string with a space (`" "`) or null:

```Azure CLI
az networkfabric interface update --additional-description "example-description" \
  --device "example-device" \
  -g "example-resource-group" \
  --resource-name "example-interface"
```

#### Parameter details

| Parameter                | Description                                      | Constraints |
|--------------------------|--------------------------------------------------|-------------|
| `--additional-description` | Provides an additional description for the interface update. | Alphanumeric (`A-Z`, `a-z`, `0-9`), `-`, and `_` are allowed. Maximum of 64 characters. Can be an empty string with a space or null. |
| `--device`               | Specifies the name of the Azure Operator Nexus Network Fabric device. | No specific constraints. |
| `-g, --resource-group`   | Defines the name of the resource group where the device is located. | No specific constraints. |
| `--resource-name`        | Indicates the name of the network interface resource. | No specific constraints. |

### Step 2: Commit the configuration

After you remove the suffix, apply the changes to the fabric:

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "example-rg" --resource-name "example-fabric"
```

#### Parameter details

| Parameter            | Short form | Description |
|----------------------|-----------|-------------|
| `--resource-group`  | `-g`      | Name of the resource group |
| `--resource-name`   | N/A       | Name of the Azure Operator Nexus Network Fabric resource|

After the commit finishes, the interface description reverts to its original state:

```
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23
```

## Network interface updates

Updates were made to the network interface of the network device to standardize the interface description. Also, these updates now link the interface to the Azure Resource Manager resource ID of the connected interface for better management and tracking.

### Standardized interface descriptions

Interface descriptions follow a consistent format of the source device to the destination device (including the host name and the interface name).

### Example

`AR-CE2 (Fab3-AR-CE2): Et1/1 to CR1-TOR1 (Fab3-CP1-TOR1) - Port23`

### connectedTo property

The `connectedTo` property returns the Azure Resource Manager resource ID of the connected interface, where available.

### Comparison of old and new values

| Example | Previous value | New value |
|---------|---------------|-----------|
| Example 1 | `CR1-TOR1-Port23` | `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedNetworkFabric/networkDevices/fab3nf-CompRack1-TOR1/networkInterfaces/Ethernet23-1` |
| Example 2 | `AR-CE2 (Fab3-AR-CE2): Et1/1 to CR1-TOR1 (Fab3-CP1-TOR1) - Port23` | `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedNetworkFabric/networkDevices/fab3nf-CompRack1-TOR1/networkInterfaces/Ethernet23-1` |

## Supported interface types

All the preceding features are available for the following interface types:

- Agg Rack customer edge
- Agg Rack management
- Comp Rack top of rack
- Comp Rack management
- Network packet broker device

> [!NOTE]
> For devices that Azure Operator Nexus Network Fabric doesn't manage, such as provider edge or storage devices, the `connectedTo` property continues to reflect the value as `string` with no active link.

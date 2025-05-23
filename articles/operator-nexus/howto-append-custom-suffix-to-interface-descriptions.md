---
title: How to append custom suffix to interface descriptions in Azure Operator Nexus Network Fabric
description: Learn how to append and remove custom suffix from interface descriptions in Azure Operator Nexus Network Fabric for enhanced operational annotations.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Append custom suffix to interface descriptions in Azure Operator Nexus Network Fabric

This guide explains how to append a user-defined suffix (`additionalDescription`) to interface descriptions in Azure Operator Nexus Network Fabric. The primary interface description is `read-only,` but the `additionalDescription` property provides enhanced flexibility for operational annotations. This approach allows users to customize interface descriptions for specific maintenance or operational requirements without altering the system-generated description.

## Prerequisites

- **Azure CLI**: Version 2.69 or higher.

- Install CLI extension **`managednetworkfabric`** 8.0.0 or higher.

## Steps to append a custom suffix

### 1. Check the current interface description

Before making changes, verify the existing interface description using the following command:

```Azure CLI
az networkfabric interface show -g "example-rg" \
  --network-device-name "example-device" \
  --resource-name "example-interface" --query description
```

#### Parameter details  

| Parameter                     | Short Form | Description |
|--------------------------------|-----------|-------------|
| `az networkfabric interface show` | N/A       | Displays details of a specified network fabric interface. |
| `-g, --resource-group`        | `-g`      | Name of the resource group where the network device resides. |
| `--network-device-name`       | N/A       | Name of the Network Fabric device. |
| `--resource-name`             | N/A       | Name of the network interface resource. |
| `--query`                     | N/A       | Filters the output to show only the specified field (for example, `description`). |

### 2. Append a suffix to the interface description

The primary interface description (for example, AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23) is read-only and can't be modified. However, you can append a custom suffix using the additional-description property. This updates only the additional-description field while keeping the main description unchanged.

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
| `--additional-description` | Provides an additional description for the interface update. | Alphanumeric (`A-Z`, `a-z`, `0-9`), `-`, and `_` allowed. Max 64 characters. Can be an empty string with a space or null. |
| `--device`               | Specifies the name of the Network Fabric device. | No specific constraints. |
| `-g, --resource-group`   | Defines the name of the resource group where the device is located. | No specific constraints. |
| `--resource-name`        | Indicates the name of the network interface resource. | No specific constraints. |

### 3. Commit the configuration

After updating the description, apply the changes to the Fabric:

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "example-rg" --resource-name "example-fabric"
```
#### Parameter details

| Parameter            | Short Form | Description |
|----------------------|-----------|-------------|
| `--resource-group`  | `-g`      | Name of the resource group. |
| `--resource-name`   | N/A       | Name of the Network Fabric. |

### Example

#### **Original interface description:**

```Azure CLI
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23
```

#### **Updated Description:**
```Azure CLI
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23-Additional_description-1234
```

## Removing the interface description

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
| `--additional-description` | Provides an additional description for the interface update. | Alphanumeric (`A-Z`, `a-z`, `0-9`), `-`, and `_` allowed. Max 64 characters. Can be an empty string with a space or null. |
| `--device`               | Specifies the name of the Network Fabric device. | No specific constraints. |
| `-g, --resource-group`   | Defines the name of the resource group where the device is located. | No specific constraints. |
| `--resource-name`        | Indicates the name of the network interface resource. | No specific constraints. |

### 3. Commit the configuration

After removing the suffix, apply the changes to the Fabric:

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "example-rg" --resource-name "example-fabric"
```

#### Parameter details

| Parameter            | Short Form | Description |
|----------------------|-----------|-------------|
| `--resource-group`  | `-g`      | Name of the resource group. |
| `--resource-name`   | N/A       | Name of the Network Fabric. |

Once committed, the interface description reverts to its original state:

```
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23
```

## Network interface updates

Updates have been made to the network interface of the network device to standardize the interface description. Additionally, these updates now link the interface to the ARM resource ID of the connected interface for better management and tracking.

### Standardized interface descriptions

Interface descriptions follow a consistent format:

Source Device to Destination Device (including hostname and interface name).

### Example
AR-CE2 (Fab3-AR-CE2): Et1/1 to CR1-TOR1 (Fab3-CP1-TOR1) - Port23

### connectedTo property

The `connectedTo` property returns the ARM resource ID of the connected interface, where available.

### Comparison of old and new values

| Example | Previous Value | New Value |
|---------|---------------|-----------|
| **Example 1** | CR1-TOR1-Port23 | `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedNetworkFabric/networkDevices/fab3nf-CompRack1-TOR1/networkInterfaces/Ethernet23-1` |
| **Example 2** | AR-CE2 (Fab3-AR-CE2): Et1/1 to CR1-TOR1 (Fab3-CP1-TOR1) - Port23 | `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ManagedNetworkFabric/networkDevices/fab3nf-CompRack1-TOR1/networkInterfaces/Ethernet23-1` |

## Supported interface types

All the above features are available for the following interface types:

- **Agg Rack CE**  
- **Agg Rack Management**  
- **Comp Rack TOR**  
- **Comp Rack Management**  
- **NPB Device**  

> [!Note]  
> For non-NF managed devices, such as PE \ Storage Device, the `connectedTo` property will continue to reflect value as a `string` with no active link.

---
title: How to append a custom suffix to interface descriptions in Azure Operator Nexus Network Fabric
description: Learn how to append and remove a custom suffix from interface descriptions in Azure Operator Nexus Network Fabric for enhanced operational annotations.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Append a custom suffix to interface descriptions in Azure Operator Nexus Network Fabric

This guide explains how to append a user-defined suffix (`additionalDescription`) to interface descriptions in Azure Operator Nexus Network Fabric. This feature provides enhanced flexibility for operational annotations, allowing users to customize interface descriptions for specific maintenance or operational requirements.

## Prerequisites

- **Azure CLI**: Version 2.61 or higher

## Steps to append a custom suffix

### 1. Check the current iterface description

Before making changes, verify the existing interface description using the following command:

```Azure CLI
az networkfabric interface show --device nffab5-8-0-gf-AggrRack-CE1 \
  -g Fab5NF-8-0-GF \
  --resource-name Ethernet22-1 --query description
```

### 2. Append a suffix to the interface description

To add a custom suffix, use the following command:

```Azure CLI
az networkfabric interface update --additional-description "support-ticket1234-jkl" \
  --device nffab5-8-0-gf-AggrRack-CE1 \
  -g Fab5NF-8-0-GF \
  --resource-name Ethernet22-1
```

#### Parameter Details:

| Parameter                  | Description                                      | Constraints |
|----------------------------|--------------------------------------------------|-------------|
| `--additional-description` | Additional description for the interface update. | Alphanumeric (A-Za-z0-9), `-` and `_` allowed. Max 64 characters. |
| `--device`                 | Name of the network fabric device.               | No specific constraints provided. |
| `-g, --resource-group`     | Name of the resource group where the device resides. | No specific constraints provided. |
| `--resource-name`          | Name of the network interface resource.          | No specific constraints provided. |


### 3. Commit the configuration

After updating the description, apply the changes to the fabric:

```Azure CLI
az networkfabric fabric commit-configuration --resource-name nffab5-8-0-gf -g Fab5NF-8-0-GF
```

### Example

#### **Original interface description:**

```Azure CLI
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23
```

#### **Updated Description:**
```Azure CLI
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23-support-ticket1234-jkl
```

## Removing the interface description

To restore the default description, set `additionalDescription` to an empty string with a space (`" "`) or null:

```Azure CLI
az networkfabric interface update --additional-description " " \
  --device nffab5-8-0-gf-AggrRack-CE1 \
  -g Fab5NF-8-0-GF \
  --resource-name Ethernet22-1
```

### 3. Commit the configuration

After removing the suffix, apply the changes to the fabric:

```Azure CLI
az networkfabric fabric commit-configuration --resource-name nffab5-8-0-gf -g Fab5NF-8-0-GF
```

Once committed, the interface description reverts to its original state:

```
AR-CE2(Fab3-AR-CE2):Et1/1 to CR1-TOR1(Fab3-CP1-TOR1)-Port23
```

## Supported interface types

This feature is available for the following interface types:

- **Agg Rack CE**  
- **Agg Rack Management**  
- **Comp Rack TOR**  
- **Comp Rack Management**  
- **NPB Device**  

> [!Note]  
> **Existing deployments** will retain their **current descriptions** until fabric instances are **migrated to Release 8.0**. After migration, users must update descriptions via the **API**.

---
title: "Azure Operator Nexus: Configure the network packet broker"
description: Learn commands to create, view network packet broker's TAPRule.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/20/2023
ms.custom: template-how-to, devx-track-azurecli
---

# How to configure Network Packet Broker (NPB)

This guide explains how to set up a Network Packet Broker (NPB) to capture, filter, and forward network traffic to monitoring tools (vProbes).

## Prerequisites

- **Provisioned NPB devices**: Ensure NPB devices are correctly racked, stacked, and provisioned. For details, see [Network Fabric Provisioning](./howto-configure-network-fabric.md).

- **vProbes configuration**: Respective vProbes should be set up with dedicated IPs.

- **Internal vProbes (optional)**: If using internal vProbes, create Layer 3 isolation domains with internal networks. Required subnets must be configured, and the **NPB extension flag** must be set for internal networks. For details, see [Isolation Domains](./howto-configure-isolation-domain.md).

- **Network-to-Network Interconnect (NNI) use case**: If applicable, create an NNI of type `NPB`. Ensure appropriate Layer 2 and Layer 3 properties are defined during creation. For details, see [Network Fabric Provisioning](./howto-configure-network-fabric.md).


## Step 1: Create a Network TAP Rule

A **network TAP rule** defines the traffic you want to capture and the actions to perform once a packet matches.

**Key points:**

* A TAP rule consists of one or more **matching configurations**.

* **Match conditions** are evaluated as logical **“AND”** tuples; all conditions must be satisfied for a packet to match.

* **Actions** are executed once a packet matches a configuration.

* TAP rules can be created **inline** (Azure CLI, portal, or ARM) or **file-based** (upload from a storage URL). File updates support **push or pull mechanisms**.

**CLI examples:**

```bash
# Create a TAP rule
az networkfabric taprule create \
  --resource-group <rg-name> \
  --fabric-name <fabric-name> \
  --name <taprule-name> \
  --configurations <configurations-json>

# Update a TAP rule
az networkfabric taprule update --name <taprule-name> --resource-group <rg-name> --fabric-name <fabric-name>

# Delete a TAP rule
az networkfabric taprule delete --name <taprule-name> --resource-group <rg-name> --fabric-name <fabric-name>

# Show a TAP rule
az networkfabric taprule show --name <taprule-name> --resource-group <rg-name> --fabric-name <fabric-name>
```

## Step 2: Create a Neighbor Group

A **neighbor group** defines **destinations** for the traffic forwarded by a TAP.

**Key points:**

* Destinations can include **network interfaces** or monitoring tools like **vProbes**.
* IP addresses behind load balancers can also be used as destinations, but traffic is sent directly to the specified addresses.
* Grouping multiple destinations simplifies configuration.

**CLI examples:**

```AzCLI
# Create a neighbor group

az networkfabric neighborgroup create \
  --resource-group <rg-name> \
  --fabric-name <fabric-name> \
  --name <neighborgroup-name> \
  --destinations <destinations-json>

# Delete a neighbor group

az networkfabric neighborgroup delete --name <neighborgroup-name> --resource-group <rg-name> --fabric-name <fabric-name>

# Show a neighbor group

az networkfabric neighborgroup show --name <neighborgroup-name> --resource-group <rg-name> --fabric-name <fabric-name>
```

> [!Note]
> Update operations are not currently supported for Neighbor Groups. Changes made via `CLI` or `API` will not reflect on the network device.

## Step 3: Create a Network TAP

A **network TAP** captures traffic from a specified **source network interface** and forwards it according to a TAP rule and neighbor group.

**Key points:**

* Associate the TAP rule and neighbor group created in previous steps.
* Use Azure CLI, portal, or ARM to create the TAP.
* The TAP can be **enabled or disabled** to start or stop traffic forwarding.

**CLI examples:**

```AzCLI
# Create a network TAP
az networkfabric tap create \
  --resource-group <rg-name> \
  --fabric-name <fabric-name> \
  --name <tap-name> \
  --source-interface <interface-id> \
  --taprule <taprule-name> \
  --neighborgroup <neighborgroup-name>

# Update a network TAP
az networkfabric tap update --name <tap-name> --resource-group <rg-name> --fabric-name <fabric-name>

# Delete a network TAP
az networkfabric tap delete --name <tap-name> --resource-group <rg-name> --fabric-name <fabric-name>

# Show a network TAP
az networkfabric tap show --name <tap-name> --resource-group <rg-name> --fabric-name <fabric-name>
```

## Step 4: Enable or Disable a Network TAP

After creating a TAP, **enable it** to start the packet brokering process. You can disable it at any time to stop forwarding traffic.

**CLI example:**

```AzCLI
# Enable a network TAP
az networkfabric tap update-admin-state \
  --resource-group <rg-name> \
  --fabric-name <fabric-name> \
  --name <tap-name> \
  --enabled true

# Disable a network TAP
az networkfabric tap update-admin-state \
  --resource-group <rg-name> \
  --fabric-name <fabric-name> \
  --name <tap-name> \
  --enabled false
```

## Operational notes

* NPB **does not analyze traffic**; it only captures, filters, and forwards packets.

* Multiple TAPs can be configured to monitor different sources simultaneously.

* Updates to TAP rules or neighbor groups can be applied dynamically without disrupting other flows.

## Common errors for NPB

During Network Packet Broker (NPB) configuration, the system classifies all control path errors into two broad categories:

- **Bad Request (400)**  
  This occurs when the request is invalid. For example, missing required parameters, providing incorrect values, or using an unsupported schema.  
  **Recommended action:** Review your request payload and ensure that all required fields and values are valid.

- **Internal Server Error (500)**  
  This occurs when the system encounters an unexpected condition, such as backend unavailability or a transient failure.  
  **Recommended action:** Retry the operation after a few minutes. 
  If the issue persists, contact Microsoft Support.

## Additional resources
[Concepts: Network Packet Broker](./concepts-nexus-network-packet-broker.md)
[Deep Dive: Network TAP Rules](./concepts-nexus-network-tap-rules.md)
[Configure the Network Fabric](./howto-configure-network-fabric.md)
[Network Fabric Services](./concepts-network-fabric-services.md)

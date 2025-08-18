---
title: Azure Operator Nexus - How to Use Administrative Lock or Unlock Network fabric
description: Learn how to lock or unlock a fabric resource using the Administrative Lock feature in Nexus Network Fabric.
author: sushantjrao
ms.author: sushrao
ms.date: 05/27/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---


# How to Administratively Lock or Unlock a Network Fabric in Azure

This guide explains how to use the **Administrative Lock** feature introduced in **NNF 8.2** to lock or unlock a fabric resource in Azure. The lock prevents any configuration changes while still allowing safe read operations. This feature is available for both existing and new deployments.

The **Administrative Lock** feature provides a mechanism to control write and update operations to your Network Fabric environment. When locked, the fabric rejects all Create, Update, and Delete (CUD) operations, ensuring configuration integrity during critical events such as maintenance, incident response, or staged deployments.


## Key Behaviors

* When **locked**, **all configuration changes** are blocked—including those initiated by the user or the Azure service.
* The current lock status is visible on the **Fabric resource** under the `Fabric Lock Properties` block.
* The lock can be toggled via a **POST action** using **ARM APIs** or **Azure CLI**.


## Prerequisites

* **Azure CLI version** `8.0.0b3` or later is installed.

## How to Use the Azure CLI to Lock or Unlock a Fabric

You can apply or remove the administrative lock using the following CLI command:

```Azure CLI
az networkfabric fabric lock-fabric \
  --action {Lock | Unlock} \
  --lock-type Administrative \
  --network-fabric-name <fabric-name> \
  --resource-group <resource-group-name>
```

### Parameters:

* `--action`: Specify `Lock` or `Unlock` to change the fabric's state.
* `--lock-type`: Set to `Administrative`.
* `--network-fabric-name`: Name of your Network Fabric resource.
* `--resource-group`: (Optional) Name of the resource group containing the fabric.


## Example

```Azure CLI
az networkfabric fabric lock-fabric \
  --action Lock \
  --lock-type Administrative \
  --network-fabric-name nf-eastus-prod \
  --resource-group nf-rg-prod
```

This command will place the fabric in a locked state, preventing any configuration changes.

## Supported and unsupported actions post administrative lock

| **Action Type**              | **Supported resource actions when fabric is under administrative lock Resources**                                                                          | **Unsupported resource actions when fabric is under administrative lock**                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resource Actions (CUD)**   | - **NFC**: Update operation allowed<br>- All **read operations** on all Network Fabric resources | - L2 ISD<br>- L3 ISD<br>- RCF<br>- IPPrefix (if connected to RCF)<br>- IPCommunity (if connected to RCF)<br>- IPExtendedCommunity (if connected to RCF)<br>- ACL<br>- Internal Networks<br>- External Networks<br>- Network Packet Broker (NPB)<br>- Network TAP<br>- TAP Rule<br>- Neighbor Group<br>- Network Monitor<br>- Network Fabric<br>- Network Device |
| **Post Actions**             | - Unlock Fabric (administrative state)                                                           | All other post actions are blocked                                                                                                                                                                                                                                                                                                                              |
| **Service Actions / Geneva** | *(None supported)*                                                                               | All service actions are blocked                                                                                                                                                                                                                                                                                                                                 |
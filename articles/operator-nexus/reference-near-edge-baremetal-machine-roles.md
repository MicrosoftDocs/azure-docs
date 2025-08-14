---
title: "Azure Operator Nexus: Near-edge BareMetal Machine Roles"
titleSuffix: Azure Operator Nexus
description: Learn about machine roles applicable to BMM in near-edge Azure Operator Nexus instances.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 05/14/2025
ms.custom:
  - template-reference
  - build-2025
---

# BareMetal Machine roles

The `machineRoles` property identifies the role of the BareMetal Machine (BMM) within the Nexus Cluster.
The management nodes where the platform software runs and worker nodes that are reserved for tenant workloads.

The following roles are assigned to BMM resources:

  - `Control plane` BMMs run the Kubernetes control plane agents for Nexus platform cluster.
  - `Management plane` BMMs run the Nexus platform agents including controllers and extensions.
  - `Compute plane` BMMs are responsible for running actual tenant workloads including Nexus Kubernetes Clusters and Virtual Machines.

## How do machine roles work?

Kubernetes labels are applied to the BMM resources during the Nexus Cluster deployment.
The `machineRoles` property is derived from the Kubernetes labels applied to the BMM resource.

## How to determine the BareMetal Machine role?

In any standard Nexus multi-rack instance with three or more compute racks, there are three powered-on control plane nodes.
Additionally, there's one node that is powered off but available to join the cluster.
The new `machineRoles` field is used in addition to the `powerState` and `detailedStatus` fields to determine the spare control plane node in a Nexus instance.

This command lists the control plane servers along with their power states and statuses:

```azurecli
az networkcloud baremetalmachine list \
  -g <resource-group> \
  --sub <subscription> \
  --query "sort_by([].{name:name,readyState:readyState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,powerState:powerState,cordonStatus:cordonStatus,machineRoles:machineRoles | join(', ', @)}, &name)" \
  --output table

| Name             | ReadyState | DetailedStatus | DetailedStatusMessage                    | PowerState | CordonStatus | MachineRoles                                         | Notes                    |
|------------------|------------|----------------|------------------------------------------|------------|--------------|------------------------------------------------------|--------------------------|
| x01dev01c1mg01   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/control-plane=true     | Control plane node       |
| *x01dev01c2mg02* | False      | Available      | Available to participate in the cluster. | Off        | Uncordoned   | platform.afo-nc.microsoft.com/control-plane=true     | Spare control plane node |
| x01dev01c3mg01   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/control-plane=true     | Control plane node       |
| x01dev01c4mg01   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/control-plane=true     | Control plane node       |
| x01dev01c1mg02   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/management-plane=true  | Management plane node    |
| x01dev01c2mg01   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/management-plane=true  | Management plane node    |
| x01dev01c3mg02   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/management-plane=true  | Management plane node    |
| x01dev01c4mg02   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/management-plane=true  | Management plane node    |
| x01dev01c1co01   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/compute-plane=true     | Compute plane node       |
| x01dev01c1co02   | True       | Provisioned    | The OS is provisioned to the machine.    | On         | Uncordoned   | platform.afo-nc.microsoft.com/compute-plane=true     | Compute plane node       |
```

In the example, the BMM `x01dev01c2mg02` serves as the spare control plane node, which is currently powered off but in `Available` state.

## What is the spare node?

This spare control plane machine functions as a standby, ready to be provisioned just-in-time during Cluster upgrades or to replace another control plane machine deemed unhealthy.

For any initial Cluster deployment *(greenfield, GF)*, there will always be one BMM designated as the spare node from the control plane pool.
The spare node is never provisioned and doesn't have the Cluster version, Kubernetes version, and Operations, Administration, and Maintenance (OAM) IP information populated on the resource.
The spare node’s `cordonState` is set to `Uncordoned`, the `powerState` is set to `Off`, and the Kubernetes version value is unset.
The `detailedStatus` is made `Available` and its `detailedStatusMessage` is `Available to participate in the cluster.`

When a spare node has been provisioned, the spare node designation is reassigned to another node in the control plane pool. 
After the runtime upgrade concludes, there's one spare node that used to be an active node at some point in time. Outside of a runtime upgrade, an active KCP server can become the spare, if it moves into an unhealthy state. 
The newly designated spare node reflects the previous Cluster version and includes the OAM IP information.
The spare node’s `cordonState` is set to `Cordoned`, the `powerState` is set to `Off`, and the Kubernetes version value is unset.
The `detailedStatus` is made `Available` and its `detailedStatusMessage` is `Available to participate in the cluster.`

---
title: "Azure Operator Nexus: Near-edge BareMetal Machine Roles"
titleSuffix: Azure Operator Nexus
description: Learn about machine roles applicable to BMM in near-edge Azure Operator Nexus instances.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 12/05/2023
ms.custom: template-reference
---

# BareMetal Machine roles

MachineRoles helps identify the role(s) that BMM fulfills in the Nexus cluster. In other words, it allows for the identification of the Nexus platform Kubernetes control plane nodes, the management nodes where the platform software runs & worker nodes that are reserved for tenant workloads.

The following roles are assigned to BMM resources:

  - `Control plane`: These BMM runs the Kubernetes control plane agents for Nexus platform cluster.
  - `Management plane`: The BMM runs the Nexus platform agents including controllers and extensions.
  - `Compute plane`: The BMM responsible for running actual tenant workloads including Nexus Kubernetes Clusters and Virtual Machines.

## How does it work?

Appropriate Kubernetes labels get applied to the BMM resources to identify the role(s) that BMM fulfills in the Nexus cluster during deployment. The MachineRoles property against the BMM resource is derived from the kubernetes labels applied to the BMM resource.

## How do I infer what role(s) a BMM is assigned to?

In any standard Nexus multi-rack instance with 3 or more compute racks, there will be 3 powered on control plane nodes and one node that is powered off but available. The new machineRole field is used in addition to the `powerState` and `detailedStatus` fields to determine the spare control plane node in a Nexus instance. 
 
This command lists the control plane servers along with their power states and statuses:

```azurecli
az networkcloud baremetalmachine list -g <resource-group> --sub <subscription> --query "sort_by([].{name:name,readyState:readyState, detailedStatus:detailedStatus, detailedStatusMessage:detailedStatusMessage, powerState:powerState, machineRoles:machineRoles | join(', ', @)}, &name)" --output table
``` 
### Sample output:

| Name           | ReadyState | DetailedStatus  | DetailedStatusMessage                    | PowerState |  MachineRoles | Notes |
| -------------- | ---------- | --------------  | --------------------------------------- | -----------  |------------------------------------------------ | -------------------------- |
| x01dev01c1mg01  | True  | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/control-plane=true | Control plane node
| x01dev01c2mg02* | False | Available | Available to participate in the cluster | Off | platform.afo-nc.microsoft.com/control-plane=true | Spare control plane node |
| x01dev01c3mg01 | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/control-plane=true | Control plane node
| x01dev01c4mg01 | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/control-plane=true | Control plane node |
| x01dev01c1mg02 | True | Provisioned | The OS is provisioned to the machine |On | platform.afo-nc.microsoft.com/management-plane=true | Management plane node |
| x01dev01c2mg01 | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/management-plane=true | Management plane node |
| x01dev01c3mg02 | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/management-plane=true | Management plane node |
| x01dev01c4mg02 | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/management-plane=true | Management plane node |
| x01dev01c1co01 | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/compute-plane=true | Compute plane node |
| x01dev01c1co02  | True | Provisioned | The OS is provisioned to the machine | On | platform.afo-nc.microsoft.com/compute-plane=true | Compute plane node |

*In this example, x01dev01c2mg02 is the spare control plane node that is currently in powered off state. And is still available to take up the role of control plane, in scenarios where active control plane node goes down for any reason.

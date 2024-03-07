---
title: Operator Nexus rack resiliency
description: Document how rack resiliency works in Operator Nexus Near Edge
ms.topic: article
ms.date: 01/05/2024
author: matthewernst
ms.author: matthewernst
ms.service: azure-operator-nexus
---

# Ensuring control plane resiliency with Operator Nexus Service

The Nexus service is engineered to uphold control plane resiliency across various compute rack configurations.

## Instances with three or more compute racks

Operator Nexus ensures the availability of three active Kubernetes control plane (KCP) nodes in instances with three or more compute racks. For configurations exceeding two compute racks, an extra spare node is also maintained. These nodes are strategically distributed across different racks to guarantee control plane resiliency, when possible.

> [!TIP]
> The Kubernetes control plane is a set of components that manage the state of a Kubernetes cluster, schedule workloads, and respond to cluster events. It includes the API server, etcd storage, scheduler, and controller managers.
>
> The remaining management nodes contain various operators which run the platform software as well as other components performing support capabilities for monitoring, storage and networking.

During runtime upgrades, Operator Nexus implements a sequential upgrade of the control plane nodes, thereby preserving resiliency throughout the upgrade process.

Three compute racks:
  
|  Rack 1    | Rack 2  | Rack 3   | 
|------------|---------|----------|
| KCP        | KCP     | KCP      |
| KCP-spare  | MGMT    | MGMT     |

Four or more compute racks:

|  Rack 1 | Rack 2  | Rack 3   | Rack 4   |
|---------|---------|----------|----------|
| KCP     | KCP     | KCP      | KCP-spare|
| MGMT    | MGMT    | MGMT     | MGMT     |

## Instances with less than three compute racks

Operator Nexus maintains an active control plane node and, if available, a spare control plane instance. For instance, a two-rack configuration has one active Kubernetes Control Plane (KCP) node and one spare node.

Two compute racks:
  
| Rack 1     | Rack 2   |
|------------|----------|
| KCP        | KCP-spare|
| MGMT       | MGMT     |

Single compute rack:

Operator Nexus supports control plane resiliency in single rack configurations by having three management nodes within the rack. For example, a single rack configuration with three management servers will provide an equivalent number of active control planes to ensure resiliency within a rack.

| Rack 1     |
|------------|
| KCP        |
| KCP        |
| KCP        |

## Resiliency implications of lost quorum

In disaster situations when the control plane loses quorum, there are impacts to the Kubernetes API across the instance. This scenario can affect a workload's ability to read and write Custom Resources (CRs) and talk across racks. 

## Related Links

[Determining Control Plane Role](./reference-near-edge-baremetal-machine-roles.md)

[Troubleshooting failed Control Plane Quorum](./troubleshoot-control-plane-quorum.md)

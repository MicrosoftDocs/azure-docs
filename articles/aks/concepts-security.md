---
title: Concepts - Security in Azure Kubernetes Services (AKS)
description: Learn about security in Azure Kubernetes Service (AKS), including master and node communication, network policies, and Kubernetes secrets.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 9/24/2018
ms.author: iainfou
---

# Security concepts for applications and clusters in Azure Kubernetes Service (AKS)

## Master security

In AKS, the Kubernetes master components are part of the managed service provided my Microsoft. Each AKS cluster has their own single-tenanted, dedicated Kubernetes master to provide the API Server, Scheduler, etc. This master is managed and maintained by Microsoft

By default, the Kubernetes API server uses a public IP address and with fully qualified domain name (FQDN). You can control access to the API server using Kubernetes role-based access controls and Azure Active Directory.

## Node security

AKS nodes are Azure virtual machines that you manage and maintain. The nodes run an optimized Ubuntu Linux distribution with the Docker container runtime. When an AKS cluster is created or scales up, the nodes are automatically deployed with the latest OS security updates and configurations.

The Azure platform automatically applies OS security patches to the nodes on a nightly basis. If an OS security update requires a host reboot, that reboot is not automatically performed. You can manually reboot the nodes, or a common approach is to use [Kured][kured], an open-source reboot daemon for Kubernetes. Kured runs as a [DaemonSet][aks-daemonset] and monitors each node for the presence of a file indicating that a reboot is required. Reboots are managed across the cluster using the same [cordon and drain process](#cordon-and-drain) as a cluster upgrade.

Nodes are deployed into a private virtual network subnet, with no public IP addresses assigned. For troubleshooting and management purposes, SSH is enabled by default. This SSH access is only available using the internal IP address. Azure network security group rules can be used to further restrict IP range access to the AKS nodes. Deleting the default network security group SSH rule and disabling the SSH service on the nodes prevents the Azure platform from performing maintenance tasks.

To provide storage, the nodes use Azure Managed Disks. The data stored on managed disks is automatically encrypted at rest within the Azure platform. To improve redundancy, these disks are also securely replicated within the Azure datacenter.

*** CAN / SHOULD THE FOLLOWING BE USED?? ARE THEY SUPPORTED ?? ***

- [Azure VM encryption](../virtual-machines/linux/encrypt-disks.md)
- [Azure Active Directory integration for Linux VMs](../virtual-machines/linux/login-using-aad.md)
- [Just-in-time VM access](../security-center/security-center-just-in-time.md)

## Cluster upgrades

For security and compliance, or to use the latest features, Azure can orchestrate the upgrade of an AKS cluster and components. This upgrade orchestration includes both the Kubernetes master and agent components. You can view a list of available Kubernetes versions for your AKS cluster. To start the upgrade process, you specify one of these available versions. Azure then safely cordons and drains each AKS node and performs the upgrade.

### Cordon and drain

During the upgrade process, AKS nodes are individually cordoned from the cluster so new pods are not scheduled on them. The nodes are then drained and upgraded as follows:

- Existing pods are gracefully terminated and scheduled on remaining nodes.
- The node is rebooted, the upgrade process completed, and then joins back into the AKS cluster.
- Pods are scheduled to run on them again.
- The next node in the cluster is cordoned and drained using the same process until all nodes are successfully upgraded.

For more information, see [Upgrade and AKS cluster][aks-upgrade-cluster].

## Network security

To filter the flow of traffic in virtual networks, Azure uses network security group rules. These rules define the source and destination IP ranges, ports, and protocols that are allowed or denied access to resources.

For more information, see [Kubernetes / AKS network policies][aks-network-policies].

## Secrets

## Next steps

<!-- LINKS - External -->
[kured]: https://github.com/weaveworks/kured

<!-- LINKS - Internal -->
[aks-daemonsets]: concepts-clusters-workloads.md#daemonsets
[aks-upgrade-cluster]: upgrade-cluster.md
[aks-network-policies]: concepts-network.md#network-policies

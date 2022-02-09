---
title: Concepts - Security in Azure Kubernetes Services (AKS)
description: Learn about security in Azure Kubernetes Service (AKS), including master and node communication, network policies, and Kubernetes secrets.
services: container-service
author: mlearned
ms.topic: conceptual
ms.date: 03/11/2021
ms.author: mlearned
---

# Security concepts for applications and clusters in Azure Kubernetes Service (AKS)

Cluster security protects your customer data as you run application workloads in Azure Kubernetes Service (AKS). 

Kubernetes includes security components, such as *network policies* and *Secrets*. Meanwhile, Azure includes components like network security groups and orchestrated cluster upgrades. AKS combines these security components to:
* Keep your AKS cluster running the latest OS security updates and Kubernetes releases.
* Provide secure pod traffic and access to sensitive credentials.

This article introduces the core concepts that secure your applications in AKS:

- [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](#security-concepts-for-applications-and-clusters-in-azure-kubernetes-service-aks)
  - [Master security](#master-security)
  - [Node security](#node-security)
    - [Compute isolation](#compute-isolation)
  - [Cluster upgrades](#cluster-upgrades)
    - [Cordon and drain](#cordon-and-drain)
  - [Network security](#network-security)
    - [Azure network security groups](#azure-network-security-groups)
  - [Kubernetes Secrets](#kubernetes-secrets)
  - [Next steps](#next-steps)

## Master security

In AKS, the Kubernetes master components are part of the managed service provided, managed, and maintained by Microsoft. Each AKS cluster has its own single-tenanted, dedicated Kubernetes master to provide the API Server, Scheduler, etc.

By default, the Kubernetes API server uses a public IP address and a fully qualified domain name (FQDN). You can limit access to the API server endpoint using [authorized IP ranges][authorized-ip-ranges]. You can also create a fully [private cluster][private-clusters] to limit API server access to your virtual network.

You can control access to the API server using Kubernetes role-based access control (Kubernetes RBAC) and Azure RBAC. For more information, see [Azure AD integration with AKS][aks-aad].

## Node security

AKS nodes are Azure virtual machines (VMs) that you manage and maintain. 
* Linux nodes run an optimized Ubuntu distribution using the `containerd` or Docker container runtime. 
* Windows Server nodes run an optimized Windows Server 2019 release using the `containerd` or Docker container runtime.

When an AKS cluster is created or scaled up, the nodes are automatically deployed with the latest OS security updates and configurations.

> [!NOTE]
> AKS clusters using:
> * Kubernetes version 1.19 and greater for Linux node pools use `containerd` as its container runtime. Using `containerd` with Windows Server 2019 node pools is currently in preview. For more details, see [Add a Windows Server node pool with `containerd`][aks-add-np-containerd].
> * Kubernetes prior to v1.19 for Linux node pools use Docker as its container runtime. For Windows Server 2019 node pools, Docker is the default container runtime.

### Node security patches

#### Linux nodes
Each evening, Linux nodes in AKS get security patches through their distro security update channel. This behavior is automatically configured as the nodes are deployed in an AKS cluster. To minimize disruption and potential impact to running workloads, nodes are not automatically rebooted if a security patch or kernel update requires it. For more information about how to handle node reboots, see [Apply security and kernel updates to nodes in AKS][aks-kured].

Nightly updates apply security updates to the OS on the node, but the node image used to create nodes for your cluster remains unchanged. If a new Linux node is added to your cluster, the original image is used to create the node. This new node will receive all the security and kernel updates available during the automatic check every night but will remain unpatched until all checks and restarts are complete. You can use node image upgrade to check for and update node images used by your cluster. For more details on node image upgrade, see [Azure Kubernetes Service (AKS) node image upgrade][node-image-upgrade].

#### Windows Server nodes

For Windows Server nodes, Windows Update doesn't automatically run and apply the latest updates. Schedule Windows Server node pool upgrades in your AKS cluster around the regular Windows Update release cycle and your own validation process. This upgrade process creates nodes that run the latest Windows Server image and patches, then removes the older nodes. For more information on this process, see [Upgrade a node pool in AKS][nodepool-upgrade].

### Node deployment
Nodes are deployed into a private virtual network subnet, with no public IP addresses assigned. For troubleshooting and management purposes, SSH is enabled by default and only accessible using the internal IP address.

### Node storage
To provide storage, the nodes use Azure Managed Disks. For most VM node sizes, Azure Managed Disks are Premium disks backed by high-performance SSDs. The data stored on managed disks is automatically encrypted at rest within the Azure platform. To improve redundancy, Azure Managed Disks are securely replicated within the Azure datacenter.

### Hostile multi-tenant workloads

Currently, Kubernetes environments aren't safe for hostile multi-tenant usage. Extra security features, like *Pod Security Policies* or Kubernetes RBAC for nodes, efficiently block exploits. For true security when running hostile multi-tenant workloads, only trust a hypervisor. The security domain for Kubernetes becomes the entire cluster, not an individual node. 

For these types of hostile multi-tenant workloads, you should use physically isolated clusters. For more information on ways to isolate workloads, see [Best practices for cluster isolation in AKS][cluster-isolation].

### Compute isolation

Because of compliance or regulatory requirements, certain workloads may require a high degree of isolation from other customer workloads. For these workloads, Azure provides [isolated VMs](../virtual-machines/isolation.md) to use as the agent nodes in an AKS cluster. These VMs are isolated to a specific hardware type and dedicated to a single customer. 

Select [one of the isolated VMs sizes](../virtual-machines/isolation.md) as the **node size** when creating an AKS cluster or adding a node pool.

## Cluster upgrades

Azure provides upgrade orchestration tools to upgrade of an AKS cluster and components, maintain security and compliance, and access the latest features. This upgrade orchestration includes both the Kubernetes master and agent components. 

To start the upgrade process, specify one of the [listed available Kubernetes versions](supported-kubernetes-versions.md). Azure then safely cordons and drains each AKS node and upgrades.

### Cordon and drain

During the upgrade process, AKS nodes are individually cordoned from the cluster to prevent new pods from being scheduled on them. The nodes are then drained and upgraded as follows:

1.  A new node is deployed into the node pool. 
    * This node runs the latest OS image and patches.
1. One of the existing nodes is identified for upgrade. 
1. Pods on the identified node are gracefully terminated and scheduled on the other nodes in the node pool.
1. The emptied node is deleted from the AKS cluster.
1. Steps 1-4 are repeated until all nodes are successfully replaced as part of the upgrade process.

For more information, see [Upgrade an AKS cluster][aks-upgrade-cluster].

## Network security

For connectivity and security with on-premises networks, you can deploy your AKS cluster into existing Azure virtual network subnets. These virtual networks connect back to your on-premises network using Azure Site-to-Site VPN or Express Route. Define Kubernetes ingress controllers with private, internal IP addresses to limit services access to the internal network connection.

### Azure network security groups

To filter virtual network traffic flow, Azure uses network security group rules. These rules define the source and destination IP ranges, ports, and protocols allowed or denied access to resources. Default rules are created to allow TLS traffic to the Kubernetes API server. You create services with load balancers, port mappings, or ingress routes. AKS automatically modifies the network security group for traffic flow.

If you provide your own subnet for your AKS cluster (whether using Azure CNI or Kubenet), **do not** modify the NIC-level network security group managed by AKS. Instead, create more subnet-level network security groups to modify the flow of traffic. Make sure they don't interfere with necessary traffic managing the cluster, such as load balancer access, communication with the control plane, and [egress][aks-limit-egress-traffic].

### Kubernetes network policy

To limit network traffic between pods in your cluster, AKS offers support for [Kubernetes network policies][network-policy]. With network policies, you can allow or deny specific network paths within the cluster based on namespaces and label selectors.

## Kubernetes Secrets

With a Kubernetes *Secret*, you inject sensitive data into pods, such as access credentials or keys. 
1. Create a Secret using the Kubernetes API. 
1. Define your pod or deployment and request a specific Secret. 
    * Secrets are only provided to nodes with a scheduled pod that requires them.
    * The Secret is stored in *tmpfs*, not written to disk. 
1. When you delete the last pod on a node requiring a Secret, the Secret is deleted from the node's tmpfs. 
   * Secrets are stored within a given namespace and can only be accessed by pods within the same namespace.

Using Secrets reduces the sensitive information defined in the pod or service YAML manifest. Instead, you request the Secret stored in Kubernetes API Server as part of your YAML manifest. This approach only provides the specific pod access to the Secret. 

> [!NOTE]
> The raw secret manifest files contain the secret data in base64 format (see the [official documentation][secret-risks] for more details). Treat these files as sensitive information, and never commit them to source control.

Kubernetes secrets are stored in etcd, a distributed key-value store. Etcd store is fully managed by AKS and [data is encrypted at rest within the Azure platform][encryption-atrest]. 

## Next steps

To get started with securing your AKS clusters, see [Upgrade an AKS cluster][aks-upgrade-cluster].

For associated best practices, see [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security] and [Best practices for pod security in AKS][developer-best-practices-pod-security].

For more information on core Kubernetes and AKS concepts, see:

- [Kubernetes / AKS clusters and workloads][aks-concepts-clusters-workloads]
- [Kubernetes / AKS identity][aks-concepts-identity]
- [Kubernetes / AKS virtual networks][aks-concepts-network]
- [Kubernetes / AKS storage][aks-concepts-storage]
- [Kubernetes / AKS scale][aks-concepts-scale]

<!-- LINKS - External -->
[kured]: https://github.com/weaveworks/kured
[kubernetes-network-policies]: https://kubernetes.io/docs/concepts/services-networking/network-policies/
[secret-risks]: https://kubernetes.io/docs/concepts/configuration/secret/#risks
[encryption-atrest]: ../security/fundamentals/encryption-atrest.md

<!-- LINKS - Internal -->
[aks-daemonsets]: concepts-clusters-workloads.md#daemonsets
[aks-upgrade-cluster]: upgrade-cluster.md
[aks-aad]: ./managed-aad.md
[aks-add-np-containerd]: windows-container-cli.md#add-a-windows-server-node-pool-with-containerd-preview
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-identity]: concepts-identity.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-network]: concepts-network.md
[aks-kured]: node-updates-kured.md
[aks-limit-egress-traffic]: limit-egress-traffic.md
[cluster-isolation]: operator-best-practices-cluster-isolation.md
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[developer-best-practices-pod-security]:developer-best-practices-pod-security.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[authorized-ip-ranges]: api-server-authorized-ip-ranges.md
[private-clusters]: private-clusters.md
[network-policy]: use-network-policies.md
[node-image-upgrade]: node-image-upgrade.md

---
title: Network configuration in Azure Kubernetes Service (AKS)
description: Learn about basic and advanced network configuration in Azure Kubernetes Service (AKS).
services: container-service
author: mmacy
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/15/2018
ms.author: marsma
---

# Network configuration in Azure Kubernetes Service (AKS)

When you create an Azure Kubernetes Service (AKS) cluster, you can select from two networking options: **Basic** or **Advanced**.

## Basic networking

The **Basic** networking option is the default configuration for AKS cluster creation. The network configuration of the cluster and its pods are managed completely by Azure, and is appropriate for deployments that do not require custom VNet configuration. You do not have control over network configuration such as subnets or the IP address ranges assigned to the cluster when you select Basic networking.

Nodes in an AKS cluster configured for Basic networking use the [kubenet][kubenet] Kubernetes plugin.

## Advanced networking

**Advanced** networking places your pods in an Azure Virtual Network (VNet) that you configure, providing them automatic connectivity to VNet resources and integration with the rich set of capabilities that VNets offer.
Advanced networking is available when deploying AKS clusters with the [Azure portal][portal], Azure CLI, or with a Resource Manager template.

Nodes in an AKS cluster configured for Advanced networking use the [Azure Container Networking Interface (CNI)][cni-networking] Kubernetes plugin.

![Diagram showing two nodes with bridges connecting each to a single Azure VNet][advanced-networking-diagram-01]

## Advanced networking features

Advanced networking provides the following benefits:

* Deploy your AKS cluster into an existing VNet, or create a new VNet and subnet for your cluster.
* Every pod in the cluster is assigned an IP address in the VNet, and can directly communicate with other pods in the cluster, and other nodes in the VNet.
* A pod can connect to other services in a peered VNet, and to on-premises networks over ExpressRoute and site-to-site (S2S) VPN connections. Pods are also reachable from on-premises.
* Expose a Kubernetes service externally or internally through the Azure Load Balancer. Also a feature of Basic networking.
* Pods in a subnet that have service endpoints enabled can securely connect to Azure services, for example Azure Storage and SQL DB.
* Use user-defined routes (UDR) to route traffic from pods to a Network Virtual Appliance.
* Pods can access resources on the public Internet. Also a feature of Basic networking.

> [!IMPORTANT]
> Each node in an AKS cluster configured for Advanced networking can host a maximum of **30 pods** when configured using the Azure portal.  You can change the maximum value only by modifying the maxPods property when deploying a cluster with a Resource Manager template. Each VNet provisioned for use with the Azure CNI plugin is limited to **4096 configured IP addresses**.

## Advanced networking prerequisites

* The VNet for the AKS cluster must allow outbound internet connectivity.
* Do not create more than one AKS cluster in the same subnet.
* Advanced networking for AKS does not support VNets that use Azure Private DNS Zones.
* AKS clusters may not use `169.254.0.0/16`, `172.30.0.0/16`, or `172.31.0.0/16` for the Kubernetes service address range.
* The service principal used for the AKS cluster must have `Contributor` permissions to the resource group containing the existing VNet.

## Plan IP addressing for your cluster

Clusters configured with Advanced networking require additional planning. The size of your VNet and its subnet must accommodate both the number of pods you plan to run as well as the number of nodes for the cluster.

IP addresses for the pods and the cluster's nodes are assigned from the specified subnet within the VNet. Each node is configured with a primary IP, which is the IP of the node and 30 additional IP addresses pre-configured by Azure CNI that are assigned to pods scheduled to the node. When you scale out your cluster, each node is similarly configured with IP addresses from the subnet.

The IP address plan for an AKS cluster consists of a VNet, at least one subnet for nodes and pods, and a Kubernetes service address range.

| Address range / Azure resource | Limits and sizing |
| --------- | ------------- |
| Virtual network | Azure VNet can be as large as /8 but may only have 4096 configured IP addresses. |
| Subnet | Must be large enough to accommodate the nodes and Pods. To calculate your minimum subnet size: (Number of nodes) + (Number of nodes * Pods per node). For a 50 node cluster: (50) + (50 * 30) = 1,550, your subnet would need to be a /21 or larger. |
| Kubernetes service address range | This range should not be used by any network element on or connected to this VNet. Service address CIDR must be smaller than /12. |
| Kubernetes DNS service IP address | IP address within the Kubernetes service address range that will be used by cluster service discovery (kube-dns). |
| Docker bridge address | IP address (in CIDR notation) used as the Docker bridge IP address on nodes. Default of 172.17.0.1/16. |

As mentioned previously, each VNet provisioned for use with the Azure CNI plugin is limited to **4096 configured IP addresses**. Each node in a cluster configured for Advanced networking can host a maximum of **30 pods**.

## Deployment parameters

When create an AKS cluster, the following parameters are configurable for advanced networking:

**Virtual network**: The VNet into which you want to deploy the Kubernetes cluster. If you want to create a new VNet for your cluster, select *Create new* and follow the steps in the *Create virtual network* section.

**Subnet**: The subnet within the VNet where you want to deploy the cluster. If you want to create a new subnet in the VNet for your cluster, select *Create new* and follow the steps in the *Create subnet* section.

**Kubernetes service address range**: The *Kubernetes service address range* is the IP range from which addresses are assigned to Kubernetes services in your cluster (for more information on Kubernetes services, see [Services][services] in the Kubernetes documentation).

The Kubernetes service IP address range:

* Must not be within the VNet IP address range of your cluster
* Must not overlap with any other VNets with which the cluster VNet peers
* Must not overlap with any on-premises IPs

Unpredictable behavior can result if overlapping IP ranges are used. For example, if a pod tries to access an IP outside the cluster, and that IP also happens to be a service IP, you might see unpredictable behavior and failures.

**Kubernetes DNS service IP address**:  The IP address for the cluster's DNS service. This address must be within the *Kubernetes service address range*.

**Docker Bridge address**: The IP address and netmask to assign to the Docker bridge. This IP address must not be within the VNet IP address range of your cluster.

## Configure networking - CLI

When you create an AKS cluster with the Azure CLI, you can also configure advanced networking. Use the following commands to create a new AKS cluster with advanced networking features enabled.

First, get the subnet resource ID for the existing subnet into which the AKS cluster will be joined:

```console
$ az network vnet subnet list --resource-group myVnet --vnet-name myVnet --query [].id --output tsv

/subscriptions/d5b9d4b7-6fc1-46c5-bafe-38effaed19b2/resourceGroups/myVnet/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/default
```

Use the [az aks create][az-aks-create] command with the `--network-plugin azure` argument to create a cluster with advanced networking. Update the `--vnet-subnet-id` value with the subnet ID collected in the previous step:

```azurecli
az aks create --resource-group myAKSCluster --name myAKSCluster --network-plugin azure --vnet-subnet-id <subnet-id> --docker-bridge-address 172.17.0.1/16 --dns-service-ip 10.2.0.10 --service-cidr 10.2.0.0/24
```

## Configure networking - portal

The following screenshot from the Azure portal shows an example of configuring these settings during AKS cluster creation:

![Advanced networking configuration in the Azure portal][portal-01-networking-advanced]

## Frequently asked questions

The following questions and answers apply to the **Advanced** networking configuration.

* *Can I deploy VMs in my cluster subnet?*

  No. Deploying VMs in the subnet used by your Kubernetes cluster is not supported. VMs may be deployed in the same VNet, but in a different subnet.

* *Can I configure per-pod network policies?*

  No. Per-pod network policies are currently unsupported.

* *Is the maximum number of pods deployable to a node configurable?*

  By default, each node can host a maximum of 30 pods. You can change the maximum value only by modifying the `maxPods` property when deploying a cluster with a Resource Manager template.

* *How do I configure additional properties for the subnet that I created during AKS cluster creation? For example, service endpoints.*

  The complete list of properties for the VNet and subnets that you create during AKS cluster creation can be configured in the standard VNet configuration page in the Azure portal.

## Next steps

### Networking in AKS

Learn more about networking in AKS in the following articles:

[Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)

[HTTPS ingress on Azure Container Service (AKS)](ingress.md)

[Use an internal load balancer with Azure Container Service (AKS)](internal-lb.md)

### ACS Engine

[Azure Container Service Engine (ACS Engine)][acs-engine] is an open-source project that generates Azure Resource Manager templates you can use for deploying Docker-enabled clusters on Azure. Kubernetes, DC/OS, Swarm Mode, and Swarm orchestrators can be deployed with ACS Engine.

Kubernetes clusters created with ACS Engine support both the [kubenet][kubenet] and [Azure CNI][cni-networking] plugins. As such, both basic and advanced networking scenarios are supported by ACS Engine.

<!-- IMAGES -->
[advanced-networking-diagram-01]: ./media/networking-overview/advanced-networking-diagram-01.png
[portal-01-networking-advanced]: ./media/networking-overview/portal-01-networking-advanced.png

<!-- LINKS - External -->
[acs-engine]: https://github.com/Azure/acs-engine
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet
[services]: https://kubernetes.io/docs/concepts/services-networking/service/
[portal]: https://portal.azure.com

<!-- LINKS - Internal -->
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[aks-ssh]: aks-ssh.md

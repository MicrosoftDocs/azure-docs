---
title: Network configuration in Azure Kubernetes Service (AKS)
description: Learn about basic and advanced network configuration in Azure Kubernetes Service (AKS).
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 10/11/2018
ms.author: iainfou
---

# Network configuration in Azure Kubernetes Service (AKS)

When you create an Azure Kubernetes Service (AKS) cluster, you can select from two networking options: **Basic** or **Advanced**.

## Basic networking

The **Basic** networking option is the default configuration for AKS cluster creation. The network configuration of the cluster and its pods is managed completely by Azure, and is appropriate for deployments that do not require custom VNet configuration. You do not have control over network configuration such as subnets or the IP address ranges assigned to the cluster when you select Basic networking.

Nodes in an AKS cluster configured for Basic networking use the [kubenet][kubenet] Kubernetes plugin.

## Advanced networking

**Advanced** networking places your pods in an Azure Virtual Network (VNet) that you configure, providing them automatic connectivity to VNet resources and integration with the rich set of capabilities that VNets offer. Advanced networking is available when deploying AKS clusters with the [Azure portal][portal], Azure CLI, or with a Resource Manager template.

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

## Advanced networking prerequisites

* The virtual network for the AKS cluster must allow outbound internet connectivity.
* Do not create more than one AKS cluster in the same subnet.
* AKS clusters may not use `169.254.0.0/16`, `172.30.0.0/16`, or `172.31.0.0/16` for the Kubernetes service address range.
* The service principal used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within your virtual network. If you wish to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:
  * `Microsoft.Network/virtualNetworks/subnets/join/action`
  * `Microsoft.Network/virtualNetworks/subnets/read`

## Plan IP addressing for your cluster

Clusters configured with Advanced networking require additional planning. The size of your virtual network and its subnet must accommodate both the number of pods you plan to run as well as the number of nodes for the cluster.

IP addresses for the pods and the cluster's nodes are assigned from the specified subnet within the virtual network. Each node is configured with a primary IP, which is the IP of the node and 30 additional IP addresses pre-configured by Azure CNI that are assigned to pods scheduled to the node. When you scale out your cluster, each node is similarly configured with IP addresses from the subnet.

The IP address plan for an AKS cluster consists of a virtual network, at least one subnet for nodes and pods, and a Kubernetes service address range.

| Address range / Azure resource | Limits and sizing |
| --------- | ------------- |
| Virtual network | The Azure virtual network can be as large as /8, but is limited to 65,536 configured IP addresses. |
| Subnet | Must be large enough to accommodate the nodes, pods, and all Kubernetes and Azure resources that might be provisioned in your cluster. For example, if you deploy an internal Azure Load Balancer, its front-end IPs are allocated from the cluster subnet, not public IPs. <p/>To calculate *minimum* subnet size: `(number of nodes) + (number of nodes * pods per node)` <p/>Example for a 50 node cluster: `(50) + (50 * 30) = 1,550` (/21 or larger) |
| Kubernetes service address range | This range should not be used by any network element on or connected to this virtual network. Service address CIDR must be smaller than /12. |
| Kubernetes DNS service IP address | IP address within the Kubernetes service address range that will be used by cluster service discovery (kube-dns). |
| Docker bridge address | IP address (in CIDR notation) used as the Docker bridge IP address on nodes. Default of 172.17.0.1/16. |

## Maximum pods per node

The default maximum number of pods per node in an AKS cluster varies between Basic and Advanced networking, and the method of cluster deployment.

| Deployment method | Basic | Advanced | Configurable at deployment |
| -- | :--: | :--: | -- |
| Azure CLI | 110 | 30 | Yes (up to 110) |
| Resource Manager template | 110 | 30 | Yes (up to 110) |
| Portal | 110 | 30 | No |

### Configure maximum - new clusters

You're able to configure the maximum number of pods per node *only at cluster deployment time*. If you deploy with the Azure CLI or with a Resource Manager template, you can set the maximum pods per node value as high as 110.

* **Azure CLI**: Specify the `--max-pods` argument when you deploy a cluster with the [az aks create][az-aks-create] command. The maximum value is 110.
* **Resource Manager template**: Specify the `maxPods` property in the [ManagedClusterAgentPoolProfile] object when you deploy a cluster with a Resource Manager template. The maximum value is 110.
* **Azure portal**: You can't change the maximum number of pods per node when you deploy a cluster with the Azure portal. Advanced networking clusters are limited to 30 pods per node when you deploy using the Azure portal.

### Configure maximum - existing clusters

You can't change the maximum pods per node on an existing AKS cluster. You can adjust the number only when you initially deploy the cluster.

## Deployment parameters

When you create an AKS cluster, the following parameters are configurable for advanced networking:

**Virtual network**: The virtual network into which you want to deploy the Kubernetes cluster. If you want to create a new virtual network for your cluster, select *Create new* and follow the steps in the *Create virtual network* section. For information about the limits and quotas for an Azure virtual network, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).

**Subnet**: The subnet within the virtual network where you want to deploy the cluster. If you want to create a new subnet in the virtual network for your cluster, select *Create new* and follow the steps in the *Create subnet* section.

**Kubernetes service address range**: This is the set of virtual IPs that Kubernetes assigns to [services][services] in your cluster. You can use any private address range that satisfies the following requirements:

* Must not be within the virtual network IP address range of your cluster
* Must not overlap with any other virtual networks with which the cluster virtual network peers
* Must not overlap with any on-premises IPs
* Must not be within the ranges `169.254.0.0/16`, `172.30.0.0/16`, or `172.31.0.0/16`

Although it's technically possible to specify a service address range within the same virtual network as your cluster, doing so is not recommended. Unpredictable behavior can result if overlapping IP ranges are used. For more information, see the [FAQ](#frequently-asked-questions) section of this article. For more information on Kubernetes services, see [Services][services] in the Kubernetes documentation.

**Kubernetes DNS service IP address**:  The IP address for the cluster's DNS service. This address must be within the *Kubernetes service address range*.

**Docker Bridge address**: The IP address and netmask to assign to the Docker bridge. This IP address must not be within the virtual network IP address range of your cluster.

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

  No. Deploying VMs in the subnet used by your Kubernetes cluster is not supported. VMs may be deployed in the same virtual network, but in a different subnet.

* *Can I configure per-pod network policies?*

  No. Per-pod network policies are currently unsupported.

* *Is the maximum number of pods deployable to a node configurable?*

  Yes, when you deploy a cluster with the Azure CLI or a Resource Manager template. See [Maximum pods per node](#maximum-pods-per-node).

  You can't change the maximum number of pods per node on an existing cluster.

* *How do I configure additional properties for the subnet that I created during AKS cluster creation? For example, service endpoints.*

  The complete list of properties for the virtual network and subnets that you create during AKS cluster creation can be configured in the standard virtual network configuration page in the Azure portal.

* *Can I use a different subnet within my cluster virtual network for the* **Kubernetes service address range**?

  It's not recommended, but this configuration is possible. The service address range is a set of virtual IPs (VIPs) that Kubernetes assigns to the services in your cluster. Azure Networking has no visibility into the service IP range of the Kubernetes cluster. Because of the lack of visibility into the cluster's service address range, it's possible to later create a new subnet in the cluster virtual network that overlaps with the service address range. If such an overlap occurs, Kubernetes could assign a service an IP that's already in use by another resource in the subnet, causing unpredictable behavior or failures. By ensuring you use an address range outside the cluster's virtual network, you can avoid this overlap risk.

## Next steps

### Networking in AKS

Learn more about networking in AKS in the following articles:

- [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)
- [Use an internal load balancer with Azure Container Service (AKS)](internal-lb.md)

- [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
- [Enable the HTTP application routing add-on][aks-http-app-routing]
- [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
- [Create an ingress controller with a dynamic public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-tls]
- [Create an ingress controller with a static public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-static-tls]

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
[aks-ssh]: ssh.md
[ManagedClusterAgentPoolProfile]: /azure/templates/microsoft.containerservice/managedclusters#managedclusteragentpoolprofile-object
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-tls]: ingress-tls.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-internal]: ingress-internal-ip.md

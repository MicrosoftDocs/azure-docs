---
title: Create a private Azure Kubernetes Service cluster
description: Learn how to create a private Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 2/21/2020

---

# Create a private Azure Kubernetes Service cluster

In a private cluster, the control plane or API server has internal IP addresses that are defined in the [RFC1918 - Address Allocation for Private Internets](https://tools.ietf.org/html/rfc1918) document. By using a private cluster, you can ensure that network traffic between your API server and your node pools remains on the private network only.

The control plane or API server is in an Azure Kubernetes Service (AKS)-managed Azure subscription. A customer's cluster or node pool is in the customer's subscription. The server and the cluster or node pool can communicate with each other through the [Azure Private Link service][private-link-service] in the API server virtual network and a private endpoint that's exposed in the subnet of the customer's AKS cluster.

## Prerequisites

* The Azure CLI version 2.2.0 or later

## Create a private AKS cluster

### Create a resource group

Create a resource group or use an existing resource group for your AKS cluster.

```azurecli-interactive
az group create -l westus -n MyResourceGroup
```

### Default basic networking 

```azurecli-interactive
az aks create -n <private-cluster-name> -g <private-cluster-resource-group> --load-balancer-sku standard --enable-private-cluster  
```
Where *--enable-private-cluster* is a mandatory flag for a private cluster. 

### Advanced networking  

```azurecli-interactive
az aks create \
    --resource-group <private-cluster-resource-group> \
    --name <private-cluster-name> \
    --load-balancer-sku standard \
    --enable-private-cluster \
    --network-plugin azure \
    --vnet-subnet-id <subnet-id> \
    --docker-bridge-address 172.17.0.1/16 \
    --dns-service-ip 10.2.0.10 \
    --service-cidr 10.2.0.0/24 
```
Where *--enable-private-cluster* is a mandatory flag for a private cluster. 

> [!NOTE]
> If the Docker bridge address CIDR (172.17.0.1/16) clashes with the subnet CIDR, change the Docker bridge address appropriately.

## Options for connecting to the private cluster

The API server endpoint has no public IP address. To manage the API server, you will need to use a VM that has access to the AKS cluster's Azure Virtual Network (VNet). There are several options for establishing network connectivity to the private cluster.

* Create a VM in the same Azure Virtual Network (VNet) as the AKS cluster.
* Use a VM in a separate network and set up [Virtual network peering][virtual-network-peering].  See the section below for more information on this option.
* Use an [Express Route or VPN][express-route-or-VPN] connection.

Creating a VM in the same VNET as the AKS cluster is the easiest option.  Express Route and VPNs add costs and require additional networking complexity.  Virtual network peering requires you to plan your network CIDR ranges to ensure there are no overlapping ranges.

## Virtual network peering

As mentioned, VNet peering is one way to access your private cluster. To use VNet peering you need to set up a link between virtual network and the private DNS zone.
    
1. Go to the MC_* resource group in the Azure portal.  
2. Select the private DNS zone.   
3. In the left pane, select the **Virtual network** link.  
4. Create a new link to add the virtual network of the VM to the private DNS zone. It takes a few minutes for the DNS zone link to become available.  
5. Go back to the MC_* resource group in the Azure portal.  
6. In the right pane, select the virtual network. The virtual network name is in the form *aks-vnet-\**.  
7. In the left pane, select **Peerings**.  
8. Select **Add**, add the virtual network of the VM, and then create the peering.  
9. Go to the virtual network where you have the VM, select **Peerings**, select the AKS virtual network, and then create the peering. If the address ranges on the AKS virtual network and the VM's virtual network clash, peering fails. For more information, see  [Virtual network peering][virtual-network-peering].

## Dependencies  

* The Private Link service is supported on Standard Azure Load Balancer only. Basic Azure Load Balancer isn't supported.  
* To use a custom DNS server, deploy an AD server with DNS to forward to this IP 168.63.129.16

## Limitations 
* IP authorized ranges cannot be applied to the private api server endpoint, they only apply to the public API server
* Availability Zones are currently supported for certain regions, see the beginning of this document 
* [Azure Private Link service limitations][private-link-service] apply to private clusters, Azure private endpoints, and virtual network service endpoints, which aren't currently supported in the same virtual network.
* No support for virtual nodes in a private cluster to spin private Azure Container Instances (ACI) in a private Azure virtual network
* No support for Azure DevOps integration out of the box with private clusters
* For customers that need to enable Azure Container Registry to work with private AKS, the Container Registry virtual network must be peered with the agent cluster virtual network.
* No current support for Azure Dev Spaces
* No support for converting existing AKS clusters into private clusters
* Deleting or modifying the private endpoint in the customer subnet will cause the cluster to stop functioning. 
* Azure Monitor for containers Live Data isn't currently supported.


<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest#az-feature-list
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[private-link-service]: /private-link/private-link-service-overview
[virtual-network-peering]: ../virtual-network/virtual-network-peering-overview.md
[azure-bastion]: ../bastion/bastion-create-host-portal.md
[express-route-or-vpn]: ../expressroute/expressroute-about-virtual-network-gateways.md


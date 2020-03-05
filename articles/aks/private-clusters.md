---
title: Create a private Azure Kubernetes Service cluster
description: Learn how to create a private Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 2/21/2020

---

# Create a private Azure Kubernetes Service cluster (preview)

In a private cluster, the control plane or API server has internal IP addresses that are defined in the [RFC1918 - Address Allocation for Private Internets](https://tools.ietf.org/html/rfc1918) document. By using a private cluster, you can ensure that network traffic between your API server and your node pools remains on the private network only.

The control plane or API server is in an Azure Kubernetes Service (AKS)-managed Azure subscription. A customer's cluster or node pool is in the customer's subscription. The server and the cluster or node pool can communicate with each other through the [Azure Private Link service][private-link-service] in the API server virtual network and a private endpoint that's exposed in the subnet of the customer's AKS cluster.

> [!IMPORTANT]
> AKS preview features are self-service and are offered on an opt-in basis. Previews are provided *as is* and *as available* and are excluded from the service-level agreement (SLA) and limited warranty. AKS previews are partially covered by customer support on a *best effort* basis. Therefore, the features aren't meant for production use. For more information, see the following support articles:
>
> * [AKS Support Policies](support-policies.md)
> * [Azure Support FAQ](faq.md)

## Prerequisites

* The Azure CLI version 2.0.77 or later, and the Azure CLI AKS Preview extension version 0.4.18

## Currently supported regions

* Australia East
* Australia Southeast
* Brazil South
* Canada Central
* Canada East
* Cenral US
* East Asia
* East US
* East US 2
* East US 2 EUAP
* France Central
* Germany North
* Japan East
* Japan West
* Korea Central
* Korea South
* North Central US
* North Europe
* North Europe
* South Central US
* UK South
* West Europe
* West US
* West US 2
* East US 2

## Currently Supported Availability Zones

* Central US
* East US
* East US 2
* France Central
* Japan East
* North Europe
* Southeast Asia
* UK South
* West Europe
* West US 2

## Install the latest Azure CLI AKS Preview extension

To use private clusters, you need the Azure CLI AKS Preview extension version 0.4.18 or later. Install the Azure CLI AKS Preview extension by using the [az extension add][az-extension-add] command, and then check for any available updates by using the following [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```
> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, you can use default settings for all AKS clusters that were created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name AKSPrivateLinkPreview --namespace Microsoft.ContainerService
```

It might take several minutes for the registration status to show as *Registered*. You can check on the status by using the following [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKSPrivateLinkPreview')].{Name:name,State:properties.state}"
```

When the state is registered, refresh the registration of the *Microsoft.ContainerService* resource provider by using the following [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
az provider register --namespace Microsoft.Network
```
## Create a private AKS cluster

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

## Connect to the private cluster

The API server endpoint has no public IP address. To manage the API server, you will need a machine or service that has access to the AKS cluster's Azure Virtual Network (VNet).  There are several options for establishing network connectivity to the private cluster.

* Use [Azure Bastion](azure-bastion), a fully-managed PaaS service that you can provision inside your AKS cluster's virtual network
* Create a VM in the same Azure Virtual Network (VNet) as the AKS cluster
* Use a VM in a separate network and set up [Virtual network peering](virtual-network-peering)
* Use an [Express Route or a VPN](express-route-or-VPN) connection

There are some advantages and disadvantages to each option.  Azure Bastion provides the simplest solution, and you don't need to create and manage additional VMs.  Express Route and VPNs add costs and require additional networking complexity.  Virtual network peering requires you to plan your network CIDR ranges to ensure there are no overlapping ranges.

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
* *Bring your own DNS* isn't currently supported.


<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest#az-feature-list
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[private-link-service]: /private-link/private-link-service-overview
[virtual-network-peering]: /virtual-network/virtual-network-peering-overview
[azure-bastion]: /bastion/bastion-create-host-portal
[express-route-or-vpn] /expressroute/expressroute-about-virtual-network-gateways


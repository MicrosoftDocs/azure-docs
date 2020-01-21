---
title: Create a private Azure Kubernetes Service cluster
description: Learn how to create a private Azure Kubernetes Service (AKS) cluster
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 12/10/2019
ms.author: mlearned
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
* West US
* West US 2
* East US 2
* Canada Central
* North Europe
* West Europe
* Australia East

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
The API server endpoint has no public IP address. Consequently, you must create an Azure virtual machine (VM) in a virtual network and connect to the API server. To do so, do the following:

1. Get credentials to connect to the cluster.

   ```azurecli-interactive
   az aks get-credentials --name MyManagedCluster --resource-group MyResourceGroup
   ```

1. Do either of the following:
   * Create a VM in the same virtual network as the AKS cluster.  
   * Create a VM in a different virtual network, and peer this virtual network with the AKS cluster virtual network.

     If you create a VM in a different virtual network, set up a link between this virtual network and the private DNS zone. To do so:
    
     a. Go to the MC_* resource group in the Azure portal.  
     b. Select the private DNS zone.   
     c. In the left pane, select the **Virtual network** link.  
     d. Create a new link to add the virtual network of the VM to the private DNS zone. It takes a few minutes for the DNS zone link to become available.  
     e. Go back to the MC_* resource group in the Azure portal.  
     f. In the right pane, select the virtual network. The virtual network name is in the form *aks-vnet-\**.  
     g. In the left pane, select **Peerings**.  
     h. Select **Add**, add the virtual network of the VM, and then create the peering.  
     i. Go to the virtual network where you have the VM, select **Peerings**, select the AKS virtual network, and then create the peering. If the address ranges on the AKS virtual network and the VM's virtual network clash, peering fails. For more information, see  [Virtual network peering][virtual-network-peering].

1. Access the VM via Secure Shell (SSH).
1. Install the Kubectl tool, and run the Kubectl commands.


## Dependencies  
* The Private Link service is supported on Standard Azure Load Balancer only. Basic Azure Load Balancer isn't supported.  

## Limitations 
* [Azure Private Link service limitations][private-link-service] apply to private clusters, Azure private endpoints, and virtual network service endpoints, which aren't currently supported in the same virtual network.
* No support for virtual nodes in a private cluster to spin private Azure Container Instances (ACI) in a private Azure virtual network.
* No support for Azure DevOps integration out of the box with private clusters.
* For customers that need to enable Azure Container Registry to work with private AKS, the Container Registry virtual network must be peered with the agent cluster virtual network.
* No current support for Azure Dev Spaces.
* No support for converting existing AKS clusters into private clusters.  
* Deleting or modifying the private endpoint in the customer subnet will cause the cluster to stop functioning. 
* Azure Monitor for containers Live Data isn't currently supported.
* *Bring your own DNS* isn't currently supported.


<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest#az-feature-list
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[private-link-service]: https://docs.microsoft.com/azure/private-link/private-link-service-overview
[virtual-network-peering]: ../virtual-network/virtual-network-peering-overview.md


---
title: Private Azure Kubernetes Service cluster
description: Learn how to create a private Azure Kubernetes Service (AKS) cluster
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 12/10/2019
ms.author: mlearned
---

# Public Preview - Private Azure Kubernetes Service cluster

In a private cluster, the Control Plane/API server will have internal IP addresses defined in [RFC1918](https://tools.ietf.org/html/rfc1918).  By using a private cluster, you can ensure network traffic between your API server and your node pools remains on the private network only.

The communication between the control plane/API server, which is in an AKS-managed Azure subscription, and the customers cluster/node pool, which is in a customer subscription, can communicate with each other through the [private link service][private-link-service] in the API server VNET and a private endpoint exposed in the subnet of the customer AKS cluster.

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For additional infromation, please see the following support articles:
>
> * [AKS Support Policies](support-policies.md)
> * [Azure Support FAQ](faq.md)

## Before you begin

* You need the Azure CLI version 2.0.77 or later and the aks-preview 0.4.18 extension

## Current supported regions
* West US
* West US 2
* East US 2
* Canada Central
* North Europe
* West Europe
* Australia East

## Install latest AKS CLI preview extension

To use private clusters, you need the *aks-preview* CLI extension version 0.4.18 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```
> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, defaults may be used for all AKS clusters then created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name AKSPrivateLinkPreview --namespace Microsoft.ContainerService
```

It may take several minutes for the status to show *Registered*. You can check on the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKSPrivateLinkPreview')].{Name:name,State:properties.state}"
```

When the state is registered, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
az provider register --namespace Microsoft.Network
```
## Create a private AKS cluster

#### Default Basic Networking 

```azurecli-interactive
az aks create -n <private-cluster-name> -g <private-cluster-resource-group> --load-balancer-sku standard --enable-private-cluster  
```
Where --enable-private-cluster is a mandatory flag for a private cluster 

#### Advanced Networking  

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
Where --enable-private-cluster is a mandatory flag for a private cluster 

## Steps to connect to the private cluster
The API server end point has no public IP address. Consequently, users will need to create an Azure virtual machine in a virtual network and connect to the API server. The steps in

* Get credentials to connect to the cluster

   ```azurecli-interactive
   az aks get-credentials --name MyManagedCluster --resource-group MyResourceGroup
   ```
* Create a VM in the same VNET as the AKS cluster or create a VM in a different VNET and peer this VNET with the AKS cluster VNET
* If you create a VM in a different VNET, you'll need to set up a link between this VNET and the Private DNS Zone
    * go to the MC_* resource group in the portal 
    * click on the Private DNS Zone 
    * select Virtual network link in the left pane
    * create a new link to add the VNET of the VM to the Private DNS Zone *(It takes a few minutes for the DNS zone link to become available)*
* SSH into the VM
* Install Kubectl tool and run kubectl commands

## Dependencies  
* Standard LB Only - no support for basic load balancer  

## Limitations 
* The same [Azure Private Link service limitations][private-link-service] apply to private clusters, Azure Private Endpoints and Virtual Network service endpoints are not currently supported in the same VNET
* No support for virtual nodes in a private cluster to spin private ACI instances in a private Azure VNET
* No support for Azure DevOps integration out of the box with private clusters
* If customers need to enable ACR to work with private AKS, then the ACR's VNET will need to be peered with the agent cluster VNET
* No current support for Azure Dev Spaces
* No support to convert existing AKS clusters to private clusters  
* Deleting or modifying the private endpoint in the customer subnet will cause the cluster to stop functioning 
* Azure Monitor for containers Live Data isn't currently supported
* Bring your own DNS isn't currently supported


<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest#az-provider-register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest#az-feature-list
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[private-link-service]: https://docs.microsoft.com/azure/private-link/private-link-service-overview

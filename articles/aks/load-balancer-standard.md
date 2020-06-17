---
title: Use a Standard SKU load balancer
titleSuffix: Azure Kubernetes Service
description: Learn how to use a load balancer with a Standard SKU to expose your services with Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 09/27/2019

#Customer intent: As a cluster operator or developer, I want to learn how to create a service in AKS that uses an Azure Load Balancer with a Standard SKU.
---

# Use a Standard SKU load balancer in Azure Kubernetes Service (AKS)

To provide access to applications via Kubernetes services of type `LoadBalancer` in Azure Kubernetes Service (AKS), you can use an Azure Load Balancer. A load balancer running on AKS can be used as an internal or an external load balancer. An internal load balancer makes a Kubernetes service accessible only to applications running in the same virtual network as the AKS cluster. An external load balancer receives one or more public IPs for ingress and makes a Kubernetes service accessible externally using the public IPs.

Azure Load Balancer is available in two SKUs - *Basic* and *Standard*. By default, the *Standard* SKU is used when you create an AKS cluster. Using a *Standard* SKU load balancer provides additional features and functionality, such as a larger backend pool size and Availability Zones. It's important that you understand the differences between *Standard* and *Basic* load balancers before choosing which to use. Once you create an AKS cluster, you cannot change the load balancer SKU for that cluster. For more information on the *Basic* and *Standard* SKUs, see [Azure load balancer SKU comparison][azure-lb-comparison].
The AKS cluster must use the Standard SKU load balancer to use multiple node pools, the feature is not supported with Basic SKU load balancers, see [Create and manage multiple node pools for a cluster in AKS][use-multiple-node-pools].

This article assumes a basic understanding of Kubernetes and Azure Load Balancer concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts] and [What is Azure Load Balancer?][azure-lb].

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.81 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Before you begin

This article assumes you have an AKS cluster with the *Standard* SKU Azure Load Balancer. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

The AKS cluster service principal needs also permission to manage network resources if you use an existing subnet or resource group. In general, assign the *Network contributor* role to your service principal on the delegated resources. Instead of a service principal, you can also use the system assigned managed identity for permissions. For more information, see [Use managed identities](use-managed-identity.md). For more information on permissions, see [Delegate AKS access to other Azure resources][aks-sp].

### Moving from a Basic SKU Load Balancer to Standard SKU

If you have an existing cluster with the Basic SKU Load Balancer, there are important behavioral differences to note when migrating to use a cluster with the Standard SKU Load Balancer.

For example, making blue/green deployments to migrate clusters is a common practice given the `load-balancer-sku` type of a cluster can only be defined at cluster create time. However, *Basic SKU* Load Balancers use *Basic SKU* IP Addresses which are not compatible with *Standard SKU* Load Balancers as they require *Standard SKU* IP Addresses. When migrating clusters to upgrade Load Balancer SKUs, a new IP address with a compatible IP Address SKU will be required.

For more considerations on how to migrate clusters, visit [our documentation on migration considerations](aks-migration.md) to view a list of important topics to consider when migrating. The below limitations are also important behavioral differences to note when using Standard SKU Load Balancers in AKS.

### Limitations

The following limitations apply when you create and manage AKS clusters that support a load balancer with the *Standard* SKU:

* At least one public IP or IP prefix is required for allowing egress traffic from the AKS cluster. The public IP or IP prefix is also required to maintain connectivity between the control plane and agent nodes as well as to maintain compatibility with previous versions of AKS. You have the following options for specifying public IPs or IP prefixes with a *Standard* SKU load balancer:
    * Provide your own public IPs.
    * Provide your own public IP prefixes.
    * Specify a number up to 100 to allow the AKS cluster to create that many *Standard* SKU public IPs in the same resource group created as the AKS cluster, which is usually named with *MC_* at the beginning. AKS assigns the public IP to the *Standard* SKU load balancer. By default, one public IP will automatically be created in the same resource group as the AKS cluster, if no public IP, public IP prefix, or number of IPs is specified. You also must allow public addresses and avoid creating any Azure Policy that bans IP creation.
* When using the *Standard* SKU for a load balancer, you must use Kubernetes version *1.13 or greater*.
* Defining the load balancer SKU can only be done when you create an AKS cluster. You cannot change the load balancer SKU after an AKS cluster has been created.
* You can only use one type of load balancer SKU (Basic or Standard) in a single cluster.
* *Standard* SKU Load Balancers only support *Standard* SKU IP Addresses.

## Use the *Standard* SKU load balancer

When you create an AKS cluster, by default, the *Standard* SKU load balancer is used when you run services in that cluster. For example, [the quickstart using the Azure CLI][aks-quickstart-cli] deploys a sample application that uses the *Standard* SKU load balancer.

> [!IMPORTANT]
> Public IP addresses can be avoided by customizing a user-defined route (UDR). Specifying an AKS cluster's outbound type as UDR can skip IP provisioning and backend pool setup for the AKS created Azure load balancer. See [setting a cluster's `outboundType` to 'userDefinedRouting'](egress-outboundtype.md).

## Configure the load balancer to be internal

You can also configure the load balancer to be internal and not expose a public IP. To configure the load balancer as internal, add `service.beta.kubernetes.io/azure-load-balancer-internal: "true"` as an annotation to the *LoadBalancer* service. You can see an example yaml manifest as well as more details about an internal load balancer [here][internal-lb-yaml].

## Scale the number of managed public IPs

When using a *Standard* SKU load balancer with managed outbound public IPs, which are created by default, you can scale the number of managed outbound public IPs using the *load-balancer-managed-ip-count* parameter.

To update an existing cluster, run the following command. This parameter can also be set at cluster create-time to have multiple managed outbound public IPs.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-managed-outbound-ip-count 2
```

The above example sets the number of managed outbound public IPs to *2* for the *myAKSCluster* cluster in *myResourceGroup*. 

You can also use the *load-balancer-managed-ip-count* parameter to set the initial number of managed outbound public IPs when creating your cluster by appending the `--load-balancer-managed-outbound-ip-count` parameter and setting it to your desired value. The default number of managed outbound public IPs is 1.

## Provide your own public IPs or prefixes for egress

When using a *Standard* SKU load balancer, the AKS cluster automatically creates a public IP in same resource group created for the AKS cluster and assigns the public IP to the *Standard* SKU load balancer. Alternatively, you can assign your own public IP at cluster creation time or you can update an existing cluster's load balancer properties.

By bringing multiple IP addresses or prefixes, you are able to define multiple backing services when defining the IP address behind a single load balancer object. The egress endpoint of specific nodes will depend on what service they are associated with.

### Pre-requisites to bring-your-own IP addresses or IP prefixes
1. You must use *Standard* SKU public IPs for egress with your *Standard* SKU your load balancer. You can verify the SKU of your public IPs using the [az network public-ip show][az-network-public-ip-show] command:

   ```azurecli-interactive
   az network public-ip show --resource-group myResourceGroup --name myPublicIP --query sku.name -o tsv
   ```
 1. The public IPs and IP prefixes must be in the same region and part of the same subscription as your AKS cluster.
 1. The public IPs and IP prefixes cannot be IPs created by AKS as a managed IP. Ensure any IPs specified as custom IPs were created manually and not be the AKS service.
 1. The public IPs and IP prefixes cannot be used by another resource or service.

 ### Define your own public IP or prefixes on an existing cluster

Use the [az network public-ip show][az-network-public-ip-show] command to list the IDs of your public IPs.

```azurecli-interactive
az network public-ip show --resource-group myResourceGroup --name myPublicIP --query id -o tsv
```

The above command shows the ID for the *myPublicIP* public IP in the *myResourceGroup* resource group.

Use the *az aks update* command with the *load-balancer-outbound-ips* parameter to update your cluster with your public IPs.

The following example uses the *load-balancer-outbound-ips* parameter with the IDs from the previous command.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2>
```

You can also use public IP prefixes for egress with your *Standard* SKU load balancer. The following example uses the [az network public-ip prefix show][az-network-public-ip-prefix-show] command to list the IDs of your public IP prefixes:

```azurecli-interactive
az network public-ip prefix show --resource-group myResourceGroup --name myPublicIPPrefix --query id -o tsv
```

The above command shows the ID for the *myPublicIPPrefix* public IP prefix in the *myResourceGroup* resource group.

The following example uses the *load-balancer-outbound-ip-prefixes* parameter with the IDs from the previous command.

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ip-prefixes <publicIpPrefixId1>,<publicIpPrefixId2>
```

### Define your own public IP or prefixes at cluster create time

You may wish to bring your own IP addresses or IP prefixes for egress at cluster creation time to support scenarios like whitelisting egress endpoints. Append the same parameters shown above to your cluster creation step to define your own public IPs and IP prefixes at the start of a cluster's lifecycle.

Use the *az aks create* command with the *load-balancer-outbound-ips* parameter to create a new cluster with your public IPs at the start.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 1 \
    --load-balancer-sku standard \
    --generate-ssh-keys \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2>
```

Use the *az aks create* command with the *load-balancer-outbound-ip-prefixes* parameter to create a new cluster with your public IP prefixes at the start.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 1 \
    --load-balancer-sku standard \
    --generate-ssh-keys \
    --load-balancer-outbound-ip-prefixes <publicIpPrefixId1>,<publicIpPrefixId2>
```

## Configure outbound ports and idle timeout

> [!WARNING]
> The following section is intended for advanced scenarios of larger scale networking or for addressing SNAT exhaustion issues with the default configurations. You must have an accurate inventory of available quota for VMs and IP addresses before changing *AllocatedOutboundPorts* or *IdleTimeoutInMinutes* from their default value in order to maintain healthy clusters.
> 
> Altering the values for *AllocatedOutboundPorts* and *IdleTimeoutInMinutes* may significantly change the behavior of the outbound rule for your load balancer. Review the [Load Balancer outbound rules][azure-lb-outbound-rules-overview], [load Balancer outbound rules][azure-lb-outbound-rules], and [outbound connections in Azure][azure-lb-outbound-connections] before updating these values to fully understand the impact of your changes.

Outbound allocated ports and their idle timeouts are used for [SNAT][azure-lb-outbound-connections]. By default, the *Standard* SKU load balancer uses [automatic assignment for the number of outbound ports based on backend pool size][azure-lb-outbound-preallocatedports] and a 30-minute idle timeout for each port. To see these values, use [az network lb outbound-rule list][az-network-lb-outbound-rule-list] to show the outbound rule for the load balancer:

```azurecli-interactive
NODE_RG=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
az network lb outbound-rule list --resource-group $NODE_RG --lb-name kubernetes -o table
```

The previous commands will list the outbound rule for your load balancer, for example:

```console
AllocatedOutboundPorts    EnableTcpReset    IdleTimeoutInMinutes    Name             Protocol    ProvisioningState    ResourceGroup
------------------------  ----------------  ----------------------  ---------------  ----------  -------------------  -------------
0                         True              30                      aksOutboundRule  All         Succeeded            MC_myResourceGroup_myAKSCluster_eastus  
```

The example output shows the default value for *AllocatedOutboundPorts* and *IdleTimeoutInMinutes*. A value of 0 for *AllocatedOutboundPorts* sets the number of outbound ports using automatic assignment for the number of outbound ports based on backend pool size. For example, if the cluster has 50 or less nodes, 1024 ports for each node are allocated.

Consider changing the setting of *allocatedOutboundPorts* or *IdleTimeoutInMinutes* if you expect to face SNAT exhaustion based on the above default configuration. Each additional IP address enables 64,000 additional ports for allocation, however the Azure Standard Load Balancer does not automatically increase the ports per node when more IP addresses are added. You can change these values by setting the *load-balancer-outbound-ports* and *load-balancer-idle-timeout* parameters. For example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-outbound-ports 0 \
    --load-balancer-idle-timeout 30
```

> [!IMPORTANT]
> You must [calculate your required quota][calculate-required-quota] before customizing *allocatedOutboundPorts* to avoid connectivity or scaling issues. The value you specify for *allocatedOutboundPorts* must also be a multiple of 8.

You can also use the *load-balancer-outbound-ports* and *load-balancer-idle-timeout* parameters when creating a cluster, but you must also specify either *load-balancer-managed-outbound-ip-count*, *load-balancer-outbound-ips*, or *load-balancer-outbound-ip-prefixes* as well.  For example:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 1 \
    --load-balancer-sku standard \
    --generate-ssh-keys \
    --load-balancer-managed-outbound-ip-count 2 \
    --load-balancer-outbound-ports 0 \
    --load-balancer-idle-timeout 30
```

When altering the *load-balancer-outbound-ports* and *load-balancer-idle-timeout* parameters from their default, it affects the behavior of the load balancer profile, which impacts the entire cluster.

### Required quota for customizing allocatedOutboundPorts
You must have enough outbound IP capacity based on the number of your node VMs and desired allocated outbound ports. To validate you have enough outbound IP capacity, use the following formula: 
 
*outboundIPs* \* 64,000 \> *nodeVMs* \* *desiredAllocatedOutboundPorts*.
 
For example, if you have 3 *nodeVMs*, and 50,000 *desiredAllocatedOutboundPorts*, you need to have at least 3 *outboundIPs*. It is recommended that you incorporate additional outbound IP capacity beyond what you need. Additionally, you must account for the cluster autoscaler and the possibility of node pool upgrades when calculating outbound IP capacity. For the cluster autoscaler, review the current node count and the maximum node count and use the higher value. For upgrading, account for an additional node VM for every node pool that allows upgrading.
 
When setting *IdleTimeoutInMinutes* to a different value than the default of 30 minutes, consider how long your workloads will need an outbound connection. Also consider the default timeout value for a *Standard* SKU load balancer used outside of AKS is 4 minutes. An *IdleTimeoutInMinutes* value that more accurately reflects your specific AKS workload can help decrease SNAT exhaustion caused by tying up connections no longer being used.

## Restrict access to specific IP ranges

The Network Security Group (NSG) associated with the virtual network for the load balancer, by default, has a rule to allow all inbound external traffic. You can update this rule to only allow specific IP ranges for inbound traffic. The following manifest uses *loadBalancerSourceRanges* to specify a new IP range for inbound external traffic:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
  loadBalancerSourceRanges:
  - MY_EXTERNAL_IP_RANGE
```

The above example updates the rule to only allow inbound external traffic from the *MY_EXTERNAL_IP_RANGE* range. More information about using this method to restrict access to the load balancer service is available in the [Kubernetes documentation][kubernetes-cloud-provider-firewall].

## Next steps

Learn more about Kubernetes services at the [Kubernetes services documentation][kubernetes-services].

<!-- LINKS - External -->
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubernetes-cloud-provider-firewall]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/#restrict-access-for-loadbalancer-service
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/
[aks-engine]: https://github.com/Azure/aks-engine

<!-- LINKS - Internal -->
[advanced-networking]: configure-azure-cni.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-sp]: kubernetes-service-principal.md#delegate-access-to-other-azure-resources
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks?view=azure-cli-latest#az-aks-install-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-group-create]: /cli/azure/group#az-group-create
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-network-lb-outbound-rule-list]: /cli/azure/network/lb/outbound-rule?view=azure-cli-latest#az-network-lb-outbound-rule-list
[az-network-public-ip-show]: /cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-show
[az-network-public-ip-prefix-show]: /cli/azure/network/public-ip/prefix?view=azure-cli-latest#az-network-public-ip-prefix-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[azure-lb]: ../load-balancer/load-balancer-overview.md
[azure-lb-comparison]: ../load-balancer/skus.md
[azure-lb-outbound-rules]: ../load-balancer/load-balancer-outbound-rules-overview.md#snatports
[azure-lb-outbound-connections]: ../load-balancer/load-balancer-outbound-connections.md#snat
[azure-lb-outbound-preallocatedports]: ../load-balancer/load-balancer-outbound-connections.md#preallocatedports
[azure-lb-outbound-rules-overview]: ../load-balancer/load-balancer-outbound-rules-overview.md
[install-azure-cli]: /cli/azure/install-azure-cli
[internal-lb-yaml]: internal-lb.md#create-an-internal-load-balancer
[kubernetes-concepts]: concepts-clusters-workloads.md
[use-kubenet]: configure-kubenet.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[calculate-required-quota]: #required-quota-for-customizing-allocatedoutboundports
[use-multiple-node-pools]: use-multiple-node-pools.md

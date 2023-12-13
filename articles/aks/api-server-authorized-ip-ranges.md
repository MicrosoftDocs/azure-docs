---
title: API server authorized IP ranges in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address range for access to the API server in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 11/04/2022
#Customer intent: As a cluster operator, I want to increase the security of my cluster by limiting access to the API server to only the IP addresses that I specify.
---

# Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)

The Kubernetes API server is the core of the Kubernetes control plane and is the central way to interact with and manage your clusters. To improve the security of your clusters and minimize the risk of attacks, we recommend limiting the IP address ranges that can access the API server. To do this, you can use the *API server authorized IP ranges* feature.

This article shows you how to use *API server authorized IP address ranges* feature to limit which IP addresses and CIDRs can access control plane.

## Before you begin

- You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
- To learn what IP addresses to include when integrating your AKS cluster with Azure DevOps, see the Azure DevOps [Allowed IP addresses and domain URLs][azure-devops-allowed-network-cfg] article.  

### Limitations

The *API server authorized IP ranges* feature has the following limitations:

- The *API server authorized IP ranges* feature was moved out of preview in October 2019. For clusters created after the feature was moved out of preview, this feature is only supported on the *Standard* SKU load balancer. Any existing clusters on the *Basic* SKU load balancer with the *API server authorized IP ranges* feature enabled will continue to work as is. However, these clusters cannot be migrated to a *Standard* SKU load balancer. Existing clusters will continue to work if the Kubernetes version and control plane are upgraded.
- The *API server authorized IP ranges* feature isn't supported on private clusters.
- When using this feature with clusters that use [Node Public IP](use-node-public-ips.md), the node pools using Node Public IP must use public IP prefixes. The public IP prefixes must be added as authorized ranges.

## Overview of API server authorized IP ranges

The Kubernetes API server is how the underlying Kubernetes APIs are exposed. This component provides the interaction for management tools, such as `kubectl` or the Kubernetes dashboard. AKS provides a single-tenant cluster control plane, with a dedicated API server. By default, the API server is assigned a public IP address, and you should control access using Kubernetes role-based access control (Kubernetes RBAC) or Azure RBAC.

To secure access to the otherwise publicly accessible AKS control plane / API server, you can enable and use authorized IP ranges. These authorized IP ranges only allow defined IP address ranges to communicate with the API server. A request made to the API server from an IP address that isn't part of these authorized IP ranges is blocked. Continue to use Kubernetes RBAC or Azure RBAC to authorize users and the actions they request.

For more information about the API server and other cluster components, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

## Create an AKS cluster with API server authorized IP ranges enabled

Create a cluster using the [`az aks create`][az-aks-create] and specify the *`--api-server-authorized-ip-ranges`* parameter to provide a list of authorized public IP address ranges. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

> [!IMPORTANT]
> By default, your cluster uses the [Standard SKU load balancer][standard-sku-lb] which you can use to configure the outbound gateway. When you enable API server authorized IP ranges during cluster creation, the public IP for your cluster is also allowed by default in addition to the ranges you specify. If you specify *""* or no value for *`--api-server-authorized-ip-ranges`*, API server authorized IP ranges will be disabled. Note that if you're using PowerShell, use *`--api-server-authorized-ip-ranges=""`* (with equals sign) to avoid any parsing issues.

The following example creates a single-node cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled. The IP address ranges allowed are *73.140.245.0/24*:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --api-server-authorized-ip-ranges 73.140.245.0/24 \
    --generate-ssh-keys
```

> [!NOTE]
> You should add these ranges to an allow list:
>
> - The cluster egress IP address (firewall, NAT gateway, or other address, depending on your [outbound type][egress-outboundtype]).
> - Any range that represents networks that you'll administer the cluster from
>
> The upper limit for the number of IP ranges you can specify is 200.
>
> The rules can take up to two minutes to propagate. Please allow up to that time when testing the connection.

### Specify the outbound IPs for the Standard SKU load balancer

While creating an AKS cluster, if you specify the outbound IP addresses or prefixes for the cluster, they are allowed as well. For example:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --api-server-authorized-ip-ranges 73.140.245.0/24 \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2> \
    --generate-ssh-keys
```

In the above example, all IPs provided in the parameter *`--load-balancer-outbound-ip-prefixes`* are allowed along with the IPs in the *`--api-server-authorized-ip-ranges`* parameter.

Instead, you can specify the *`--load-balancer-outbound-ip-prefixes`* parameter to allow outbound load balancer IP prefixes.

### Allow only the outbound public IP of the Standard SKU load balancer

When you enable API server authorized IP ranges during cluster creation, the outbound public IP for the Standard SKU load balancer for your cluster is also allowed by default in addition to the ranges you specify. To allow only the outbound public IP of the Standard SKU load balancer, use *0.0.0.0/32* when specifying the *`--api-server-authorized-ip-ranges`* parameter.

In the following example, only the outbound public IP of the Standard SKU load balancer is allowed, and you can only access the API server from the nodes within the cluster.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --api-server-authorized-ip-ranges 0.0.0.0/32 \
    --generate-ssh-keys
```

## Update a cluster's API server authorized IP ranges

To update the API server authorized IP ranges on an existing cluster, use [`az aks update`][az-aks-update] command and use the *`--api-server-authorized-ip-ranges`*, *`--load-balancer-outbound-ip-prefixes`*, *`--load-balancer-outbound-ips`*, or *`--load-balancer-outbound-ip-prefixes`* parameters.

The following example updates API server authorized IP ranges on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address range to authorize is *73.140.245.0/24*:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges  73.140.245.0/24
```

You can also use *0.0.0.0/32* when specifying the *`--api-server-authorized-ip-ranges`* parameter to allow only the public IP of the Standard SKU load balancer.

## Disable authorized IP ranges

To disable authorized IP ranges, use [`az aks update`][az-aks-update] and specify an empty range to disable API server authorized IP ranges. For example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges ""
```

> [!IMPORTANT]
> When running this command using the PowerShell in Azure Cloud Shell or from your local computer,
> the double-quote string value for the *--api-server-authorized-ip-rangers* argument needs to be [enclosed
> in single quotes](/powershell/module/microsoft.powershell.core/about/about_quoting_rules#including-quote-characters-in-a-string).
> Otherwise, an error message is returned indicating an expected argument is missing.

## Find existing authorized IP ranges

To find IP ranges that have been authorized, use [`az aks show`][az-aks-show] and specify the cluster's name and resource group. For example:

```azurecli-interactive
az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --query apiServerAccessProfile.authorizedIpRanges
```

## Update, disable, and find authorized IP ranges using Azure portal

The above operations of adding, updating, finding, and disabling authorized IP ranges can also be performed in the Azure portal. To access, navigate to **Networking** under **Settings** in the menu blade of your cluster resource.

:::image type="content" source="media/api-server-authorized-ip-ranges/ip-ranges-specified.PNG" alt-text="In a browser, shows the cluster resource's networking settings Azure portal page. The options 'set specified IP range' and 'Specified IP ranges' are highlighted.":::

## How to find my IP to include in `--api-server-authorized-ip-ranges`?

You must add your development machines, tooling, or automation IP addresses to the AKS cluster list of approved IP ranges to access the API server from there.

Another option is to configure a jumpbox with the necessary tooling inside a separate subnet in the firewall's virtual network. This assumes your environment has a firewall with the respective network, and you've added the firewall IPs to authorized ranges. Similarly, if you've forced tunneling from the AKS subnet to the firewall subnet, having the jumpbox in the cluster subnet is also okay.

To add another IP address to the approved ranges, use the following commands.

```bash
# Retrieve your IP address
CURRENT_IP=$(dig +short "myip.opendns.com" "@resolver1.opendns.com")
````

```azurecli
# Add to AKS approved list
az aks update -g $RG -n $AKSNAME --api-server-authorized-ip-ranges $CURRENT_IP/24,73.140.245.0/24
```

> [!NOTE]
> The above example adds another IP address to the approved ranges. Note that it still includes the IP address from [Update a cluster's API server authorized IP ranges](#update-a-clusters-api-server-authorized-ip-ranges). If you don't include your existing IP address, this command will replace it with the new one instead of adding it to the authorized ranges. To disable authorized IP ranges, use `az aks update` and specify an empty range "".

Another option is to use the following command on Windows systems to get the public IPv4 address, or you can follow the steps in [Find your IP address](https://support.microsoft.com/en-gb/help/4026518/windows-10-find-your-ip-address).

```azurepowershell-interactive
Invoke-RestMethod http://ipinfo.io/json | Select -exp ip
```

You can also find this address by searching on *what is my IP address* in an internet browser.

## Next steps

In this article, you enabled API server authorized IP ranges. This approach is one part of how you can securely run an AKS cluster. For more information, see [Security concepts for applications and clusters in AKS][concepts-security] and [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security].

<!-- LINKS - external -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[dev-spaces-ranges]: /previous-versions/azure/dev-spaces/#aks-cluster-network-requirements
[kubenet]: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#kubenet

<!-- LINKS - internal -->
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-network-public-ip-list]: /cli/azure/network/public-ip#az_network_public_ip_list
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[egress-outboundtype]: egress-outboundtype.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[route-tables]: ../virtual-network/manage-route-table.md
[standard-sku-lb]: load-balancer-standard.md
[azure-devops-allowed-network-cfg]: /azure/devops/organizations/security/allow-list-ip-url

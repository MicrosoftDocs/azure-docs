---
title: API server authorized IP ranges in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address range for access to the API server in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 05/19/2024
ms.author: schaffererin
author: schaffererin
#Customer intent: As a cluster operator, I want to increase the security of my cluster by limiting access to the API server to only the IP addresses that I specify.
---

# Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)

This article shows you how to use *API server authorized IP address ranges* feature to limit which IP addresses and CIDRs can access control plane.

The Kubernetes API server is the core of the Kubernetes control plane and is the central way to interact with and manage your clusters. To improve the security of your clusters and minimize the risk of attacks, we recommend limiting the IP address ranges that can access the API server. To do this, you can use the *API server authorized IP ranges* feature.

## Before you begin

- You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
- To learn what IP addresses to include when integrating your AKS cluster with Azure DevOps, see the Azure DevOps [Allowed IP addresses and domain URLs][azure-devops-allowed-network-cfg] article.  

### Limitations

The *API server authorized IP ranges* feature has the following limitations:

- The *API server authorized IP ranges* feature was moved out of preview in October 2019. For clusters created after the feature was moved out of preview, this feature is only supported on the *Standard* SKU load balancer. Any existing clusters on the *Basic* SKU load balancer with the *API server authorized IP ranges* feature enabled will continue to work as is. However, these clusters cannot be migrated to a *Standard* SKU load balancer. Existing clusters will continue to work if the Kubernetes version and control plane are upgraded.
- The *API server authorized IP ranges* feature isn't supported on private clusters.
- When using this feature with clusters that use [Node Public IP](use-node-public-ips.md), the node pools using Node Public IP must use public IP prefixes. The public IP prefixes must be added as authorized ranges.

## Overview of API server authorized IP ranges

The Kubernetes API server exposes underlying Kubernetes APIs and provides the interaction for management tools like `kubectl` and the Kubernetes dashboard. AKS provides a single-tenant cluster control plane with a dedicated API server. The API server is assigned a public IP address by default. You can control access using Kubernetes role-based access control (Kubernetes RBAC) or Azure RBAC.

To secure access to the otherwise publicly accessible AKS control plane / API server, you can enable and use authorized IP ranges. These authorized IP ranges only allow defined IP address ranges to communicate with the API server. Any requests made to the API server from an IP address that isn't part of these authorized IP ranges is blocked.

## Create an AKS cluster with API server authorized IP ranges enabled

> [!IMPORTANT]
> By default, your cluster uses the [Standard SKU load balancer][standard-sku-lb] which you can use to configure the outbound gateway. When you enable API server authorized IP ranges during cluster creation, the public IP for your cluster is allowed by default in addition to the ranges you specify. If you specify *""* or no value for *`--api-server-authorized-ip-ranges`*, API server authorized IP ranges is disabled. Note that if you're using PowerShell, use *`--api-server-authorized-ip-ranges=""`* (with equals signs) to avoid any parsing issues.

> [!NOTE]
> You should add these ranges to an allow list:
>
> - The cluster egress IP address (firewall, NAT gateway, or other address, depending on your [outbound type][egress-outboundtype]).
> - Any range that represents networks that you'll administer the cluster from.
>
> The upper limit for the number of IP ranges you can specify is 200.
>
> The rules can take up to two minutes to propagate. Please allow up to that time when testing the connection.

### [Azure CLI](#tab/azure-cli)

When creating a cluster with API server authorized IP ranges enabled, you use the `--api-server-authorized-ip-ranges` parameter to provide a list of authorized public IP address ranges. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

- Create an AKS cluster with API server authorized IP ranges enabled using the [`az aks create`][az-aks-create] command with the `--api-server-authorized-ip-ranges` parameter. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled. The IP address ranges allowed are *73.140.245.0/24*:

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --api-server-authorized-ip-ranges 73.140.245.0/24 --generate-ssh-keys
    ```

### [Azure PowerShell](#tab/azure-powershell)

When creating a cluster with API server authorized IP ranges enabled, you use the `-ApiServerAccessAuthorizedIpRange` parameter to provide a list of authorized public IP address ranges. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

- Create an AKS cluster with API server authorized IP ranges enabled using the [`New-AzAksCluster`][new-azakscluster] cmdlet with the `-ApiServerAccessAuthorizedIpRange` parameter. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled. The IP address ranges allowed are *73.140.245.0/24*:

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeVmSetType VirtualMachineScaleSets -LoadBalancerSku Standard -ApiServerAccessAuthorizedIpRange '73.140.245.0/24' -GenerateSshKey
    ```

### [Azure portal](#tab/azure-portal)

When creating a cluster with API server authorized IP ranges enabled, you specify a list of authorized public IP address ranges. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

1. Navigate to the Azure portal and select **Create a resource** > **Containers** > **Azure Kubernetes Service (AKS)**.
2. Configure the cluster settings as needed.
3. In the **Networking** section under **Public access**, select **Set authorized IP ranges**.
4. For **Specify IP ranges**, enter the IP address ranges you want to authorize to access the API server.

    :::image type="content" source="media/api-server-authorized-ip-ranges/create-cluster-api-server-authorized-ip-ranges-portal.png" alt-text="This screenshot shows the cluster resource's specify IP ranges networking settings Azure portal page.":::

5. Configure the rest of the cluster settings as needed.
6. When you're ready, select **Review + create** > **Create** to create the cluster.

---

## Specify outbound IPs for a Standard SKU load balancer

When creating a cluster with API server authorized IP ranges enabled, you can also specify the outbound IP addresses or prefixes for the cluster using the `--load-balancer-outbound-ips` or `--load-balancer-outbound-ip-prefixes` parameters. All IPs provided in the parameters are allowed along with the IPs in the `--api-server-authorized-ip-ranges` parameter.

- Create an AKS cluster with API server authorized IP ranges enabled and specify the outbound IP addresses for the Standard SKU load balancer using the `--load-balancer-outbound-ips` parameter. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled and the outbound IP addresses `<public-ip-id-1>` and `<public-ip-id-2>`:

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --api-server-authorized-ip-ranges 73.140.245.0/24 --load-balancer-outbound-ips <public-ip-id-1>,<public-ip-id-2> --generate-ssh-keys
    ```

## Allow only the outbound public IP of the Standard SKU load balancer

### [Azure CLI](#tab/azure-cli)

When you enable API server authorized IP ranges during cluster creation, the outbound public IP for the Standard SKU load balancer for your cluster is also allowed by default in addition to the ranges you specify. To allow only the outbound public IP of the Standard SKU load balancer, you use *0.0.0.0/32* when specifying the `--api-server-authorized-ip-ranges` parameter.

- Create an AKS cluster with API server authorized IP ranges enabled and allow only the outbound public IP of the Standard SKU load balancer using the `--api-server-authorized-ip-ranges` parameter. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled and allows only the outbound public IP of the Standard SKU load balancer:

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --api-server-authorized-ip-ranges 0.0.0.0/32 --generate-ssh-keys
    ```

### [Azure PowerShell](#tab/azure-powershell)

When you enable API server authorized IP ranges during cluster creation, the outbound public IP for the Standard SKU load balancer for your cluster is also allowed by default in addition to the ranges you specify. To allow only the outbound public IP of the Standard SKU load balancer, you use *0.0.0.0/32* when specifying the `-ApiServerAccessAuthorizedIpRange` parameter.

- Create an AKS cluster with API server authorized IP ranges enabled and allow only the outbound public IP of the Standard SKU load balancer using the `-ApiServerAccessAuthorizedIpRange` parameter. The following example creates a cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled and allows only the outbound public IP of the Standard SKU load balancer:

    ```azurepowershell-interactive
    New-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeVmSetType VirtualMachineScaleSets -LoadBalancerSku Standard -ApiServerAccessAuthorizedIpRange '0.0.0.0/32' -GenerateSshKey
    ```

### [Azure portal](#tab/azure-portal)

When you enable API server authorized IP ranges during cluster creation, the outbound public IP for the Standard SKU load balancer for your cluster is also allowed by default in addition to the ranges you specify. To allow only the outbound public IP of the Standard SKU load balancer, you use *0.0.0.0/32* when specifying the IP ranges.

1. Navigate to the Azure portal and select **Create a resource** > **Containers** > **Azure Kubernetes Service (AKS)**.
2. Configure the cluster settings as needed.
3. In the **Networking** section under **Public access**, select **Set authorized IP ranges**.
4. For **Specify IP ranges**, enter *0.0.0.0/32*. This allows only the outbound public IP of the Standard SKU load balancer.

    :::image type="content" source="media/api-server-authorized-ip-ranges/api-server-authorized-only-outbound-ip-ranges-portal.png" alt-text="This screenshot shows the cluster resource's specify IP ranges networking settings Azure portal page set to allow only the outbound public IP of the load balancer.":::

5. Configure the rest of the cluster settings as needed.
6. When you're ready, select **Review + create** > **Create** to create the cluster.

---

## Update an existing cluster's API server authorized IP ranges

### [Azure CLI](#tab/azure-cli)

- Update an existing cluster's API server authorized IP ranges using the [`az aks update`][az-aks-update] command with the `--api-server-authorized-ip-ranges` parameter. The following example updates API server authorized IP ranges on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address range to authorize is *73.140.245.0/24*:

    ```azurecli-interactive
    az aks update --resource-group myResourceGroup --name myAKSCluster --api-server-authorized-ip-ranges 73.140.245.0/24
    ```

- To allow multiple IP address ranges, you can list several IP addresses, separated by commas.
  
    ```azurecli-interactive
    az aks update --resource-group myResourceGroup --name myAKSCluster --api-server-authorized-ip-ranges 73.140.245.0/24,193.168.1.0/24,194.168.1.0/24
    ```
  
    You can also use *0.0.0.0/32* when specifying the `--api-server-authorized-ip-ranges` parameter to allow only the public IP of the Standard SKU load balancer.

### [Azure PowerShell](#tab/azure-powershell)

- Update an existing cluster's API server authorized IP ranges using the [`Set-AzAksCluster`][set-azakscluster] cmdlet with the `-ApiServerAccessAuthorizedIpRange` parameter. The following example updates API server authorized IP ranges on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address range to authorize is *73.140.245.0/24*:

    ```azurepowershell-interactive
    Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -ApiServerAccessAuthorizedIpRange '73.140.245.0/24'
    ```

    You can also use *0.0.0.0/32* when specifying the `-ApiServerAccessAuthorizedIpRange` parameter to allow only the public IP of the Standard SKU load balancer.

### [Azure portal](#tab/azure-portal)

1. Navigate to the Azure portal and select the AKS cluster you want to update.
2. Under **Settings**, select **Networking**.
3. Under **Resource Settings**, select **Manage**.

    :::image type="content" source="media/api-server-authorized-ip-ranges/update-existing-authorized-ip-ranges-portal.png" alt-text="This screenshot shows the cluster resource's resource settings in the networking settings Azure portal page.":::

4. On the **Authorized IP ranges** page, update the **Authorized IP ranges** as needed.

    :::image type="content" source="media/api-server-authorized-ip-ranges/authorized-ip-ranges-update-page-portal.png" alt-text="This screenshot shows the cluster resource's update authorized IP ranges Azure portal page.":::

5. When you're done, select **Save**.

---

## Disable authorized IP ranges

### [Azure CLI](#tab/azure-cli)

- Disable authorized IP ranges using the [`az aks update`][az-aks-update] command and specify an empty range `""` for the `--api-server-authorized-ip-ranges` parameter.

    ```azurecli-interactive
    az aks update --resource-group myResourceGroup --name myAKSCluster --api-server-authorized-ip-ranges ""
    ```

### [Azure PowerShell](#tab/azure-powershell)

- Disable authorized IP ranges using the [`Set-AzAksCluster`][set-azakscluster] cmdlet and specify an empty range `''` for the `-ApiServerAccessAuthorizedIpRange` parameter.

    ```azurepowershell-interactive
    Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -ApiServerAccessAuthorizedIpRange ''
    ```

### [Azure portal](#tab/azure-portal)

1. Navigate to the Azure portal and select the AKS cluster you want to update.
2. Under **Settings**, select **Networking**.
3. Under **Resource Settings**, select **Manage**.

    :::image type="content" source="media/api-server-authorized-ip-ranges/update-existing-authorized-ip-ranges-portal.png" alt-text="This screenshot shows the cluster resource's networking settings Azure portal page.":::

4. On the **Authorized IP ranges** page, deselect the **Set authorized IP ranges** checkbox.

    :::image type="content" source="media/api-server-authorized-ip-ranges/disable-authorized-ip-ranges-portal.png" alt-text="This screenshot shows the cluster resource's disable authorized IP ranges Azure portal page.":::

5. When you're done, select **Save**.

---

## Find existing authorized IP ranges

### [Azure CLI](#tab/azure-cli)

- Find existing authorized IP ranges using the [`az aks show`][az-aks-show] command with the `--query` parameter set to `apiServerAccessProfile.authorizedIpRanges`.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query apiServerAccessProfile.authorizedIpRanges
    ```

### [Azure PowerShell](#tab/azure-powershell)

- Find existing authorized IP ranges using the [`Get-AzAksCluster`][get-azakscluster] cmdlet.

    ```azurepowershell-interactive
    Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster | Select-Object -ExpandProperty ApiServerAccessProfile
    ```

### [Azure portal](#tab/azure-portal)

1. Navigate to the Azure portal and select your AKS cluster.
2. Under **Settings**, select **Networking**. The existing authorized IP ranges are listed under **Resource Settings**:

    :::image type="content" source="media/api-server-authorized-ip-ranges/find-existing-authorized-ip-ranges-portal.png" alt-text="This screenshot shows the cluster resource's existing authorized IP networking settings in the Azure portal page.":::

---

## How to find my IP to include in `--api-server-authorized-ip-ranges`?

You must add your development machines, tooling, or automation IP addresses to the AKS cluster list of approved IP ranges to access the API server from there.

Another option is to configure a jumpbox with the necessary tooling inside a separate subnet in the firewall's virtual network. This assumes your environment has a firewall with the respective network, and you've added the firewall IPs to authorized ranges. Similarly, if you've forced tunneling from the AKS subnet to the firewall subnet, having the jumpbox in the cluster subnet is also okay.

1. Retrieve your IP address using the following command:

    ```bash
    # Retrieve your IP address
    CURRENT_IP=$(dig +short "myip.opendns.com" "@resolver1.opendns.com")
    ```

2. Add your IP address to the approved list using Azure CLI or Azure PowerShell:

    ```bash
    # Add to AKS approved list using Azure CLI
    az aks update --resource-group $RG --name $AKSNAME --api-server-authorized-ip-ranges $CURRENT_IP/24,73.140.245.0/24
    
    # Add to AKS approved list using Azure PowerShell
    Set-AzAksCluster -ResourceGroupName $RG -Name $AKSNAME -ApiServerAccessAuthorizedIpRange '$CURRENT_IP/24,73.140.245.0/24'
    ```

> [!NOTE]
> The above example adds another IP address to the approved ranges. Note that it still includes the IP address from [Update a cluster's API server authorized IP ranges](#update-an-existing-clusters-api-server-authorized-ip-ranges). If you don't include your existing IP address, this command will replace it with the new one instead of adding it to the authorized ranges. To disable authorized IP ranges, use `az aks update` and specify an empty range "".

Another option is to use the following command on Windows systems to get the public IPv4 address, or you can follow the steps in [Find your IP address](https://support.microsoft.com/help/4026518/windows-10-find-your-ip-address).

```azurepowershell-interactive
Invoke-RestMethod http://ipinfo.io/json | Select -exp ip
```

You can also find this address by searching on *what is my IP address* in an internet browser.

## Next steps

In this article, you enabled API server authorized IP ranges. This approach is one part of how you can securely run an AKS cluster. For more information, see [Security concepts for applications and clusters in AKS][concepts-security] and [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security].

<!-- LINKS - internal -->
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-show]: /cli/azure/aks#az_aks_show
[concepts-security]: concepts-security.md
[egress-outboundtype]: egress-outboundtype.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[route-tables]: ../virtual-network/manage-route-table.yml
[standard-sku-lb]: load-balancer-standard.md
[azure-devops-allowed-network-cfg]: /azure/devops/organizations/security/allow-list-ip-url
[new-azakscluster]: /powershell/module/az.aks/new-azakscluster
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster

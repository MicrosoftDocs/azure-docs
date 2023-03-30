---
title: Create a private Azure Kubernetes Service cluster
description: Learn how to create a private Azure Kubernetes Service (AKS) cluster
ms.topic: article
ms.date: 01/25/2023
ms.custom: references_regions
---

# Create a private Azure Kubernetes Service cluster

In a private cluster, the control plane or API server has internal IP addresses that are defined in the [RFC1918 - Address Allocation for Private Internet][rfc1918-document] document. By using a private cluster, you can ensure network traffic between your API server and your node pools remains on the private network only.

The control plane or API server is in an Azure Kubernetes Service (AKS)-managed Azure resource group. Your cluster or node pool is in your resource group. The server and the cluster or node pool can communicate with each other through the [Azure Private Link service][private-link-service] in the API server virtual network and a private endpoint that's exposed on the subnet of your AKS cluster.

When you provision a private AKS cluster, AKS by default creates a private FQDN with a private DNS zone and an additional public FQDN with a corresponding A record in Azure public DNS. The agent nodes continue to use the A record in the private DNS zone to resolve the private IP address of the private endpoint for communication to the API server.

The purpose of this article is to help you deploy a private link-based AKS cluster. If you are interested in creating an AKS cluster without any required private link or tunnel, see [create an Azure Kubernetes Service cluster with API Server VNet Integration][create-aks-cluster-api-vnet-integration] (preview).

## Region availability

Private cluster is available in public regions, Azure Government, and Azure China 21Vianet regions where [AKS is supported][aks-supported-regions].

## Prerequisites

* The Azure CLI version 2.28.0 and higher. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* The `aks-preview` extension 0.5.29 or higher.
* If using Azure Resource Manager (ARM) or the Azure REST API, the AKS API version must be 2021-05-01 or higher.
* Azure Private Link service is supported on Standard Azure Load Balancer only. Basic Azure Load Balancer isn't supported.  
* To use a custom DNS server, add the Azure public IP address 168.63.129.16 as the upstream DNS server in the custom DNS server. For more information about the Azure IP address, see [What is IP address 168.63.129.16?][virtual-networks-168.63.129.16]

## Limitations

* IP authorized ranges can't be applied to the private API server endpoint, they only apply to the public API server
* [Azure Private Link service limitations][private-link-service] apply to private clusters.
* No support for Azure DevOps Microsoft-hosted Agents with private clusters. Consider using [Self-hosted Agents](/azure/devops/pipelines/agents/agents). 
* If you need to enable Azure Container Registry to work with a private AKS cluster, [set up a private link for the container registry in the cluster virtual network][container-registry-private-link] or set up peering between the Container Registry virtual network and the private cluster's virtual network.
* No support for converting existing AKS clusters into private clusters
* Deleting or modifying the private endpoint in the customer subnet will cause the cluster to stop functioning.

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

Where `--enable-private-cluster` is a mandatory flag for a private cluster.

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

Where `--enable-private-cluster` is a mandatory flag for a private cluster.

> [!NOTE]
> If the Docker bridge address CIDR (172.17.0.1/16) clashes with the subnet CIDR, change the Docker bridge address.

## Use custom domains

If you want to configure custom domains that can only be resolved internally, see [Use custom domains][use-custom-domains] for more information.

## Disable Public FQDN

The following parameters can be leveraged to disable Public FQDN.

### Disable Public FQDN on a new AKS cluster

```azurecli-interactive
az aks create -n <private-cluster-name> -g <private-cluster-resource-group> --load-balancer-sku standard --enable-private-cluster --enable-managed-identity --assign-identity <ResourceId> --private-dns-zone <private-dns-zone-mode> --disable-public-fqdn
```

### Disable Public FQDN on an existing cluster

```azurecli-interactive
az aks update -n <private-cluster-name> -g <private-cluster-resource-group> --disable-public-fqdn
```

## Configure private DNS zone

The following parameters can be used to configure private DNS zone.

- **system** - This is the default value. If the `--private-dns-zone` argument is omitted, AKS creates a Private DNS zone in the node resource group.
- **none** - the default is public DNS. AKS won't create a private DNS zone.  
- **CUSTOM_PRIVATE_DNS_ZONE_RESOURCE_ID**, requires you to create a private DNS zone only in the following format for Azure global cloud: `privatelink.<region>.azmk8s.io` or `<subzone>.privatelink.<region>.azmk8s.io`. You'll need the Resource ID of that private DNS zone going forward. Additionally, you need a user assigned identity or service principal with at least the [Private DNS Zone Contributor][private-dns-zone-contributor-role]  and [Network Contributor][network-contributor-role] roles. When deploying using API server VNet integration, a private DNS zone additionally supports the naming format of `private.<region>.azmk8s.io` or `<subzone>.private.<region>.azmk8s.io`.
  - If the private DNS zone is in a different subscription than the AKS cluster, you need to register the Azure provider **Microsoft.ContainerServices** in both subscriptions.
  - "fqdn-subdomain" can be utilized with "CUSTOM_PRIVATE_DNS_ZONE_RESOURCE_ID" only to provide subdomain capabilities to `privatelink.<region>.azmk8s.io`.
  - If your AKS cluster is configured with an Active Directory service principal, AKS does not support using a system-assigned managed identity with custom private DNS zone.

### Create a private AKS cluster with private DNS zone

```azurecli-interactive
az aks create -n <private-cluster-name> -g <private-cluster-resource-group> --load-balancer-sku standard --enable-private-cluster --enable-managed-identity --assign-identity <ResourceId> --private-dns-zone [system|none]
```

### Create a private AKS cluster with custom private DNS zone or private DNS subzone

```azurecli-interactive
# Custom Private DNS Zone name should be in format "<subzone>.privatelink.<region>.azmk8s.io"
az aks create -n <private-cluster-name> -g <private-cluster-resource-group> --load-balancer-sku standard --enable-private-cluster --enable-managed-identity --assign-identity <ResourceId> --private-dns-zone <custom private dns zone or custom private dns subzone ResourceId>
```

### Create a private AKS cluster with custom private DNS zone and custom subdomain

```azurecli-interactive
# Custom Private DNS Zone name could be in formats "privatelink.<region>.azmk8s.io" or "<subzone>.privatelink.<region>.azmk8s.io"
az aks create -n <private-cluster-name> -g <private-cluster-resource-group> --load-balancer-sku standard --enable-private-cluster --enable-managed-identity --assign-identity <ResourceId> --private-dns-zone <custom private dns zone ResourceId> --fqdn-subdomain <subdomain>
```

## Options for connecting to the private cluster

The API server endpoint has no public IP address. To manage the API server, you'll need to use a VM that has access to the AKS cluster's Azure Virtual Network (VNet). There are several options for establishing network connectivity to the private cluster.

* Create a VM in the same Azure Virtual Network (VNet) as the AKS cluster using the [`az vm create`][az-vm-create] command with the `--vnet-name` parameter.
* Use a VM in a separate network and set up [Virtual network peering][virtual-network-peering].  See the section below for more information on this option.
* Use an [Express Route or VPN][express-route-or-VPN] connection.
* Use the [AKS `command invoke` feature][command-invoke].
* Use a [private endpoint][private-endpoint-service] connection.

Creating a VM in the same VNet as the AKS cluster is the easiest option. Express Route and VPNs add costs and require additional networking complexity. Virtual network peering requires you to plan your network CIDR ranges to ensure there are no overlapping ranges.

## Virtual network peering

Virtual network peering is one way to access your private cluster. To use virtual network peering, you need to set up a link between the virtual network and the private DNS zone.

1. From your browser, go to the [Azure portal](https://portal.azure.com).
1. From the Azure portal, go to the node resource group.  
1. Select the private DNS zone.
1. In the left pane, select **Virtual network**.  
1. Create a new link to add the virtual network of the VM to the private DNS zone. It takes a few minutes for the DNS zone link to become available.  
1. In the Azure portal, navigate to the resource group that contains your cluster's virtual network.  
1. In the right pane, select the virtual network. The virtual network name is in the form *aks-vnet-\**.  
1. In the left pane, select **Peerings**.  
1. Select **Add**, add the virtual network of the VM, and then create the peering. For more information, see  [Virtual network peering][virtual-network-peering].

## Hub and spoke with custom DNS

[Hub and spoke architectures](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) are commonly used to deploy networks in Azure. In many of these deployments, DNS settings in the spoke VNets are configured to reference a central DNS forwarder to allow for on-premises and Azure-based DNS resolution. When deploying an AKS cluster into such a networking environment, there are some special considerations that must be taken into account.

![Private cluster hub and spoke](media/private-clusters/aks-private-hub-spoke.png)

1. By default, when a private cluster is provisioned, a private endpoint (1) and a private DNS zone (2) are created in the cluster-managed resource group. The cluster uses an A record in the private zone to resolve the IP of the private endpoint for communication to the API server.

2. The private DNS zone is linked only to the VNet that the cluster nodes are attached to (3). This means that the private endpoint can only be resolved by hosts in that linked VNet. In scenarios where no custom DNS is configured on the VNet (default), this works without issue as hosts point at 168.63.129.16 for DNS that can resolve records in the private DNS zone because of the link.

3. In scenarios where the VNet containing your cluster has custom DNS settings (4), cluster deployment fails unless the private DNS zone is linked to the VNet that contains the custom DNS resolvers (5). This link can be created manually after the private zone is created during cluster provisioning or via automation upon detection of creation of the zone using event-based deployment mechanisms (for example, Azure Event Grid and Azure Functions). To avoid cluster failure during initial deployment, the cluster can be deployed with the private DNS zone resource ID. This only works with resource type Microsoft.ContainerService/managedCluster and API version 2022-07-01. Using an older version with an ARM template or Bicep resource definition is not supported.

> [!NOTE]
> Conditional Forwarding doesn't support subdomains.

> [!NOTE]
> If you are using [Bring Your Own Route Table with kubenet](./configure-kubenet.md#bring-your-own-subnet-and-route-table-with-kubenet) and Bring Your Own DNS with Private Cluster, the cluster creation will fail. You will need to associate the [RouteTable](./configure-kubenet.md#bring-your-own-subnet-and-route-table-with-kubenet) in the node resource group to the subnet after the cluster creation failed, in order to make the creation successful.

## Use a private endpoint connection

A private endpoint can be set up so that an Azure Virtual Network doesn't need to be peered to communicate to the private cluster. To use a private endpoint, create a new private endpoint in your virtual network then create a link between your virtual network and a new private DNS zone.

> [!IMPORTANT]
> If the virtual network is configured with custom DNS servers, private DNS will need to be set up appropriately for the environment. See the [virtual networks name resolution documentation][virtual-networks-name-resolution] for more details.

1. From your browser, go to the [Azure portal](https://portal.azure.com).
1. From the Azure portal menu or from [Azure Home][azure-home], select **Create a resource**.
1. Search for **Private Endpoint** and then select **Create > Private Endpoint**.
1. Select **Create**.
1. On the **Basics** tab, set up the following options:
    * **Project details**:
      * Select an Azure **Subscription**.
      * Select the Azure **Resource group** where your virtual network is located.
    * **Instance details**:
      * Enter a **Name** for the private endpoint, such as *myPrivateEndpoint*.
      * Select a **Region** for the private endpoint.
  
  > [!IMPORTANT]
  > Check that the region selected is the same as the virtual network where you want to connect from, otherwise you won't see your virtual network in the **Configuration** tab.

5. Select **Next: Resource** when complete.
6. On the **Resource** tab, set up the following options:
    * **Connection method**: *Connect to an Azure resource in my directory*
    * **Subscription**: Select your Azure subscription where the private cluster is located
    * **Resource type**: *Microsoft.ContainerService/managedClusters*
    * **Resource**: *myPrivateAKSCluster*
    * **Target sub-resource**: *management*
7. Select **Next: Configuration** when complete.
8. On the **Configuration** tab, set up the following options:
    * **Networking**:
      * **Virtual network**: *myVirtualNetwork*
      * **Subnet**: *mySubnet*
9.  Select **Next: Tags** when complete.
10. (Optional) On the **Tags** tab, set up key-values as needed.
11. Select **Next: Review + create**, and then select **Create** when validation completes.

Record the private IP address of the private endpoint. This private IP address is used in a later step.

After the private endpoint has been created, create a new private DNS zone with the same name as the private DNS zone that was created by the private cluster. 

1. Go to the node resource group in the Azure portal.  
2. Select the private DNS zone and record:
   * The name of the private DNS zone, which follows the pattern `*.privatelink.<region>.azmk8s.io`
   * The name of the A record (excluding the private DNS name)
   * The time-to-live (TTL)
3. From the Azure portal or from the Home page, select **Create a resource**.
4. Search for **Private DNS zone** and select **Create > Private DNS Zone**.
5. On the **Basics** tab, set up the following options:
     * **Project details**:
       * Select an Azure **Subscription**
       * Select the Azure **Resource group** where the private endpoint was created
     * **Instance details**:
       * Enter the **Name** of the DNS zone retrieved from previous steps
       * **Region** defaults to the Azure Resource group location
6. Select **Review + create** when complete and select **Create** when validation completes.

After the private DNS zone is created, create an A record. This record associates the private endpoint to the private cluster.

1. Go to the private DNS zone created in previous steps.
2. On the **Overview** page, select **+ Record set**.
3. On the **Add record set** tab, set up the following options:
   * **Name**: Input the name retrieved from the A record in the private cluster's DNS zone
   * **Type**: *A - Alias record to IPv4 address*
   * **TTL**: Input the number to match the record from the A record private cluster's DNS zone
   * **TTL Unit**: Change the dropdown value to match the A record from the private cluster's DNS zone
   * **IP address**: Input the IP address of the private endpoint that was created previously

> [!IMPORTANT]
> When creating the A record, use only the name, and not the fully qualified domain name (FQDN).

Once the A record is created, link the private DNS zone to the virtual network that will access the private cluster.

1. Go to the private DNS zone created in previous steps.  
2. From the left pane, select **Virtual network links**.  
3. Create a new link to add the virtual network to the private DNS zone. It takes a few minutes for the DNS zone link to become available.

> [!WARNING]
> If the private cluster is stopped and restarted, the private cluster's original private link service is removed and re-created, which breaks the connection between your private endpoint and the private cluster. To resolve this issue, delete and re-create any user created private endpoints linked to the private cluster. DNS records will also need to be updated if the re-created private endpoints have new IP addresses.

## Next steps

For associated best practices, see [Best practices for network connectivity and security in AKS][operator-best-practices-network].

<!-- LINKS - external -->
[rfc1918-document]: https://tools.ietf.org/html/rfc1918
[aks-supported-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service

<!-- LINKS - internal -->
[private-link-service]: ../private-link/private-link-service-overview.md#limitations
[private-endpoint-service]: ../private-link/private-endpoint-overview.md
[virtual-network-peering]: ../virtual-network/virtual-network-peering-overview.md
[express-route-or-vpn]: ../expressroute/expressroute-about-virtual-network-gateways.md
[command-invoke]: command-invoke.md
[container-registry-private-link]: ../container-registry/container-registry-private-link.md
[virtual-networks-name-resolution]: ../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server
[virtual-networks-168.63.129.16]: ../virtual-network/what-is-ip-address-168-63-129-16.md
[use-custom-domains]: coredns-custom.md#use-custom-domains
[create-aks-cluster-api-vnet-integration]: api-server-vnet-integration.md
[azure-home]: ../azure-portal/azure-portal-overview.md#azure-home
[operator-best-practices-network]: operator-best-practices-network.md
[install-azure-cli]: /cli/azure/install-azure-cli
[private-dns-zone-contributor-role]: ../role-based-access-control/built-in-roles.md#dns-zone-contributor
[network-contributor-role]: ../role-based-access-control/built-in-roles.md#network-contributor
[az-vm-create]: /cli/azure/vm#az-vm-create

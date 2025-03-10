---
title: Prerequisites for deploying tenant workloads
description: Learn the prerequisites for creating VMs for VNF workloads and for creating Kubernetes clusters for CNF workloads.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/25/2023
ms.custom: template-how-to-pattern, devx-track-azurecli, devx-track-azurepowershell
---

# Prerequisites for deploying tenant workloads

This guide explains prerequisites for creating:

- Virtual machines (VMs) for virtual network function (VNF) workloads.
- Nexus Kubernetes cluster deployments for cloud-native network function (CNF) workloads.

:::image type="content" source="./media/tenant-workload-deployment-flow.png" alt-text="Diagram of a tenant workload deployment flow.":::

## Network prerequisites

You need to create various networks based on your workload needs. The following list of considerations isn't exhaustive. Consult with the appropriate support teams for help.

- Determine the types of networks that you need to support your workloads:
  - A layer 3 (L3) network requires a VLAN and subnet assignment. The subnet must be large enough to support IP assignment to each of the VMs.
    The platform reserves the first three usable IP addresses for internal use. For instance, to support six VMs, the minimum CIDR for your subnet is /28 (14 usable addresses – 3 reserved = 11 addresses available).
  - A layer 2 (L2) network requires only a single VLAN assignment.
  - A trunked network requires the assignment of multiple VLANs.
- Determine how many networks of each type you need.
- Determine the MTU size of each of your networks (maximum is 9,000).
- Determine the BGP peering info for each network, and whether the networks need to talk to each other. You should group networks that need to talk to each other into the same L3 isolation domain, because each L3 isolation domain can support multiple L3 networks.
- The platform provides a proxy to allow your VM to reach other external endpoints. Creating a `cloudservicesnetwork` instance requires the endpoints to be proxied, so gather the list of endpoints. You can modify the list of endpoints after the network creation.

## Create isolation domains

The isolation-domains enable communication between workloads hosted in the same rack (intra-rack communication) or different racks (inter-rack communication). You can find more details about creating isolation domains [here](./howto-configure-isolation-domain.md).

## Create networks for tenant workloads

The following sections describe how to create these networks:

- Layer 2 network
- Layer 3 network
- Trunked network

### Create an L2 network

Create an L2 network, if necessary, for your workloads. You can repeat the instructions for each required L2 network.

Gather the resource ID of the L2 isolation domain that you created to configure the VLAN for this network.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
  az networkcloud l2network create --name "<YourL2NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --l2-isolation-domain-id "<YourL2IsolationDomainId>"
```

#### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzNetworkCloudL2Network -Name "<YourL2NetworkName>" `
-ResourceGroupName "<YourResourceGroupName>" `
-ExtendedLocationName "<ClusterCustomLocationId>" `
-ExtendedLocationType "CustomLocation" `
-L2IsolationDomainId "<YourL2IsolationDomainId>" `
-Location "<ClusterAzureRegion>" `
-InterfaceName "<InterfaceName>" `
-Subscription "<YourSubscription>"
```

---

### Create an L3 network

Create an L3 network, if necessary, for your workloads. Repeat the instructions for each required L3 network.

You need:

- The `resourceID` value of the L3 isolation domain that you created to configure the VLAN for this network.
- The `ipv4-connected-prefix` value, which must match the `i-pv4-connected-prefix` value that's in the L3 isolation domain.
- The `ipv6-connected-prefix` value, which must match the `i-pv6-connected-prefix` value that's in the L3 isolation domain.
- The `ip-allocation-type` value, which can be `IPv4`, `IPv6`, or `DualStack` (default).
- The `vlan` value, which must match what's in the L3 isolation domain.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
  az networkcloud l3network create --name "<YourL3NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --ip-allocation-type "<YourNetworkIpAllocation>" \
    --ipv4-connected-prefix "<YourNetworkIpv4Prefix>" \
    --ipv6-connected-prefix "<YourNetworkIpv6Prefix>" \
    --l3-isolation-domain-id "<YourL3IsolationDomainId>" \
    --vlan <YourNetworkVlan>
```

#### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzNetworkCloudL3Network -Name "<YourL3NetworkName>" `
-ResourceGroupName "<YourResourceGroupName>" `
-Subscription "<YourSubscription>" `
-Location "<ClusterAzureRegion>" `
-ExtendedLocationName "<ClusterCustomLocationId>" `
-ExtendedLocationType "CustomLocation" `
-Vlan "<YourNetworkVlan>" `
-L3IsolationDomainId "<YourL3IsolationDomainId>" `
-Ipv4ConnectedPrefix "<YourNetworkIpv4Prefix>" `
-Ipv6ConnectedPrefix "<YourNetworkIpv6Prefix>"
```

---

### Create a trunked network

Create a trunked network, if necessary, for your VM. Repeat the instructions for each required trunked network.

Gather the `resourceId` values of the L2 and L3 isolation domains that you created earlier to configure the VLANs for this network. You can include as many L2 and L3 isolation domains as needed.

#### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
  az networkcloud trunkednetwork create --name "<YourTrunkedNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --interface-name "<YourNetworkInterfaceName>" \
    --isolation-domain-ids \
      "<YourL3IsolationDomainId1>" \
      "<YourL3IsolationDomainId2>" \
      "<YourL2IsolationDomainId1>" \
      "<YourL2IsolationDomainId2>" \
      "<YourL3IsolationDomainId3>" \
    --vlans <YourVlanList>
```

#### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzNetworkCloudTrunkedNetwork -Name "<YourTrunkedNetworkName>" `
-ResourceGroupName "<YourResourceGroupName>" `
-SubscriptionId "<YourSubscription>" `
-ExtendedLocationName "<ClusterCustomLocationId>" `
-ExtendedLocationType "CustomLocation" `
-Location "<ClusterAzureRegion>" `
-IsolationDomainId "<YourL3IsolationDomainId>" `
-InterfaceName "<YourNetworkInterfaceName>" `
-Vlan "<YourVlanList>"
```

---

## Create a cloud services network

To create an Operator Nexus virtual machine (VM) or Operator Nexus Kubernetes cluster, you must have a cloud services network. Without this network, you can't create a VM or cluster.

While the cloud services network automatically enables access to essential platform endpoints, you need to add others, such as docker.io, if your application requires them. Configuring the cloud services network proxy is a crucial step in ensuring a successful connection to your desired endpoints. To achieve this, you can add the egress endpoints to the cloud services network during the initial creation or as an update, using the `--additional-egress-endpoints` parameter. While wildcards for the URL endpoints might seem convenient, it isn't recommended for security reasons. For example, if you want to configure the proxy to allow image pull from any repository hosted off docker.io, you can specify `.docker.io` as an endpoint.

The egress endpoints must comply with the domain name structures and hostname specifications outlined in RFC 1034, RFC 1035, and RFC 1123. Valid domain names include alphanumeric characters, hyphens (not at the start or end), and can have subdomains separated by dots. The endpoints can be a single FQDN, or a subdomain (domain prefix with a `.`). Here are a few examples to demonstrate compliant naming conventions for domain and hostnames.
  
- `contoso.com`: The base domain, serving as a second-level domain under the .com top-level domain.
- `sales.contoso.com`: A subdomain of contoso.com, serving as a third-level domain under the .com top-level domain.
- `web-server-1.contoso.com`: A hostname for a specific web server, using hyphens to separate the words and the numeral.
- `api.v1.contoso.com`: Incorporates two subdomains (`v1` and `api`) above the base domain contoso.com.
- `.api.contoso.com`: A wildcard for any subdomain under `api.contoso.com`, covering multiple third-level domains.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName >" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId >" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --additional-egress-endpoints "[{\"category\":\"<YourCategory >\",\"endpoints\":[{\"<domainName1 >\":\"< endpoint1 >\",\"port\":<portnumber1 >}]}]"
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$endpointEgressList = @()
$endpointList = @()
$endpoint = New-AzNetworkCloudEndpointDependencyObject `
  -DomainName "<domainName1>" `
  -Port "<portnumber1>"
$endpointList+= $endpoint
$additionalEgressEndpoint = New-AzNetworkCloudEgressEndpointObject `
  -Category "YourCategory" `
  -Endpoint $endpointList
$endpointEgressList+= $additionalEgressEndpoint

New-AzNetworkCloudServicesNetwork -CloudServicesNetworkName "<YourCloudServicesNetworkName>" `
-ResourceGroupName "<YourResourceGroupName>" `
-Subscription "<YourSubscription>" `
-ExtendedLocationName "<ClusterCustomLocationId>" `
-ExtendedLocationType "CustomLocation" `
-Location "<ClusterAzureRegion>" `
-AdditionalEgressEndpoint $endpointEgressList `
-EnableDefaultEgressEndpoint "False"
```

---

After setting up the cloud services network, you can use it to create a VM or cluster that can connect to the egress endpoints you have specified. Remember that the proxy only works with HTTPS.

> [!NOTE]
> To ensure that the VNF image can be pulled correctly, ensure the ACR URL is in the egress allow list of the cloud services network that you will use with your Operator Nexus virtual machine.
>
> In addition, if your ACR has dedicated data endpoints enabled, you will need to add all the new data-endpoints to the egress allow list.  To find all the possible endpoints for your ACR follow the instruction [here](/azure/container-registry/container-registry-dedicated-data-endpoints#dedicated-data-endpoints).

### Use the proxy to reach outside of the virtual machine

After creating your Operator Nexus VM or Operator Nexus Kubernetes cluster with this cloud services network, you need to additionally set appropriate environment variables within VM to use tenant proxy and to reach outside of virtual machine. This tenant proxy is useful if you need to access resources outside of the virtual machine, such as managing packages or installing software.

To use the proxy, you need to set the following environment variables:

```bash
export HTTPS_PROXY=http://169.254.0.11:3128
export https_proxy=http://169.254.0.11:3128
```

After setting the proxy environment variables, your virtual machine will be able to reach the configured egress endpoints.

> [!NOTE]
> HTTP is not supported due to security reasons when using the proxy to access resources outside of the virtual machine. It is required to use HTTPS for secure communication when managing packages or installing software on the Operator Nexus VM or Operator Nexus Kubernetes cluster with this cloud services network.

> [!IMPORTANT]
> When using a proxy, it's also important to set the `no_proxy` environment variable properly. This variable can be used to specify domains or IP addresses that shouldn't be accessed through the proxy. If not set properly, it can cause issues while accessing services, such as the Kubernetes API server or cluster IP. Make sure to include the IP address or domain name of the Kubernetes API server and any cluster IP addresses in the `no_proxy` variable.

## Nexus Kubernetes cluster availability zone

When you're creating a Nexus Kubernetes cluster, you can schedule the cluster onto specific racks or distribute it across multiple racks. This technique can improve resource utilization and fault tolerance.

If you don't specify a zone when you're creating a Nexus Kubernetes cluster, the Azure Operator Nexus platform automatically implements a default anti-affinity rule to spread the VM across racks and bare metal nodes and isn't guaranteed. This rule also aims to prevent scheduling the cluster VM on a node that already has a VM from the same cluster, but it's a best-effort approach and can't make guarantees.

To get the list of available zones in the Azure Operator Nexus instance, you can use the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
    az networkcloud cluster show \
      --resource-group <Azure Operator Nexus on-premises cluster resource group> \
      --name <Azure Operator Nexus on-premises cluster name> \
      --query computeRackDefinitions[*].availabilityZone
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzNetworkCloudCluster -Name "<Azure Operator Nexus on-premises cluster name>" `
-ResourceGroupName "<Azure Operator Nexus on-premises cluster resource group>" `
-SubscriptionId "<YourSubscription>" `
| Select -ExpandProperty ComputeRackDefinition `
| Select-Object -Property AvailabilityZone
```

---

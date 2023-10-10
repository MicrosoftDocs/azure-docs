---
title: Prerequisites for deploying tenant workloads
description: Learn the prerequisites for creating VMs for VNF workloads and for creating Kubernetes clusters for CNF workloads.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/25/2023
ms.custom: template-how-to-pattern, devx-track-azurecli
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

## Create networks for tenant workloads

The following sections explain the steps to create networks for tenant workloads (VMs and Kubernetes clusters).

### Create isolation domains

Isolation domains enable creation of layer 2 (L2) and layer 3 (L3) connectivity between network functions running on Azure Operator Nexus. This connectivity enables inter-rack and intra-rack communication between the workloads.
You can create as many L2 and L3 isolation domains as needed.

You should have the following information already:

- The network fabric resource ID to create isolation domains.
- VLAN and subnet info for each L3 network.
- Which networks need to talk to each other. (Remember to put VLANs and subnets that need to talk to each other into the same L3 isolation domain.)
- BGP peering and network policy information for your L3 isolation domains.
- VLANs for all your L2 networks.
- VLANs for all your trunked networks.
- MTU values for your networks.

#### L2 isolation domain

[!INCLUDE [l2-isolation-domain](./includes/l2-isolation-domain.md)]

#### L3 isolation domain

[!INCLUDE [l3-isolation-domain](./includes/l3-isolation-domain.md)]

### Create networks for tenant workloads

The following sections describe how to create these networks:

- Layer 2 network
- Layer 3 network
- Trunked network
- Cloud services network

#### Create an L2 network

Create an L2 network, if necessary, for your workloads. You can repeat the instructions for each required L2 network.

Gather the resource ID of the L2 isolation domain that you [created](#l2-isolation-domain) to configure the VLAN for this network.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
  az networkcloud l2network create --name "<YourL2NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --l2-isolation-domain-id "<YourL2IsolationDomainId>"
```

### [Azure PowerShell](#tab/azure-powershell)

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

#### Create an L3 network

Create an L3 network, if necessary, for your workloads. Repeat the instructions for each required L3 network.

You need:

- The `resourceID` value of the L3 isolation domain that you [created](#l3-isolation-domain) to configure the VLAN for this network.
- The `ipv4-connected-prefix` value, which must match the `i-pv4-connected-prefix` value that's in the L3 isolation domain.
- The `ipv6-connected-prefix` value, which must match the `i-pv6-connected-prefix` value that's in the L3 isolation domain.
- The `ip-allocation-type` value, which can be `IPv4`, `IPv6`, or `DualStack` (default).
- The `vlan` value, which must match what's in the L3 isolation domain.

### [Azure CLI](#tab/azure-cli)

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

### [Azure PowerShell](#tab/azure-powershell)

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

#### Create a trunked network

Create a trunked network, if necessary, for your VM. Repeat the instructions for each required trunked network.

Gather the `resourceId` values of the L2 and L3 isolation domains that you created earlier to configure the VLANs for this network. You can include as many L2 and L3 isolation domains as needed.

### [Azure CLI](#tab/azure-cli)

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
### [Azure PowerShell](#tab/azure-powershell)

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

#### Create a cloud services network

Your VM requires at least one cloud services network. You need the egress endpoints that you want to add to the proxy for your VM to access. This list should include any domains needed to pull images or access data, such as `.azurecr.io` or `.docker.io`.

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

#### Using the proxy to reach outside of the virtual machine

Once you have created your VM or Kubernetes cluster with this cloud services network, you can use the proxy to reach outside of the virtual machine. Proxy is useful if you need to access resources outside of the virtual machine, such as pulling images or accessing data.

To use the proxy, you need to set the following environment variables:

```bash
export HTTP_PROXY=http://169.254.0.11:3128
export http_proxy=http://169.254.0.11:3128
export HTTPS_PROXY=http://169.254.0.11:3128
export https_proxy=http://169.254.0.11:3128
```

Once you have set the environment variables, your virtual machine should be able to reach outside of the virtual network using the proxy.

In order to reach the desired endpoints, you need to add the required egress endpoints to the cloud services network. Egress endpoints can be added using the `--additional-egress-endpoints` parameter when creating the network. Be sure to include any domains needed to pull images or access data, such as `.azurecr.io` or `.docker.io`.

> [!IMPORTANT]
> When using a proxy, it's also important to set the `no_proxy` environment variable properly. This variable can be used to specify domains or IP addresses that shouldn't be accessed through the proxy. If not set properly, it can cause issues while accessing services, such as the Kubernetes API server or cluster IP. Make sure to include the IP address or domain name of the Kubernetes API server and any cluster IP addresses in the `no_proxy` variable.

## Nexus Kubernetes cluster availability zone

When you're creating a Nexus Kubernetes cluster, you can schedule the cluster onto specific racks or distribute it evenly across multiple racks. This technique can improve resource utilization and fault tolerance.

If you don't specify a zone when you're creating a Nexus Kubernetes cluster, the Azure Operator Nexus platform automatically implements a default anti-affinity rule. This rule aims to prevent scheduling the cluster VM on a node that already has a VM from the same cluster, but it's a best-effort approach and can't make guarantees.

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

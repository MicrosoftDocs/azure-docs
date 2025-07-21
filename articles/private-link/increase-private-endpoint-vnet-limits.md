---
title: Increase Private Endpoint virtual network limits
titleSuffix: Azure Private Link
description: Learn how to increase private endpoints virtual network limits by upgrading to High Scale Private Endpoints.
services: private-link
author: ivapplyr
ms.author: ivapplyr
ms.date: 04/01/2025
ms.service: azure-private-link
ms.topic: how-to
#customer intent: As a network administrator, I want to increase private endpoint limits so that I can scale my virtual network infrastructure effectively.
# Customer intent: As a network administrator, I want to upgrade to High Scale Private Endpoints so that I can increase the limit of private endpoints in my virtual network and effectively scale my infrastructure without risking connectivity issues.
---

# How-to: Increase Private Endpoint virtual network limits

Today, users are [limited](/azure/azure-resource-manager/management/azure-subscription-service-limits) to deploying only 1,000 private endpoints within their virtual network. It's common for users to navigate around this limitation by implementing a [Hub and Spoke](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology) model or a [Mesh network](/azure/virtual-network-manager/concept-connectivity-configuration). Doing so would make it possible to deploy extra private endpoints across peered virtual networks to temporarily surpass the per virtual network limit. However, scaling in this manner places users at risk of a silently enforced limitation. Whenever users surpass 4,000 private endpoints across their peered virtual networks, they put themselves at risk of connectivity issues and packet drops.

For users looking to surpass these current limits, we recommend upgrading to *High Scale Private Endpoints*. This feature increases standard limits to 5,000 private endpoints in a singular virtual network and 20,000 private endpoints across peered networks. This article details how to opt into this feature and provide extra considerations before enablement.

> [!NOTE]
> This feature is currently in public preview and available in select regions. We recommend reviewing all considerations before enabling it for your subscription.

## Prerequisites

* An active Azure account with a subscription. [Create an account for free](https://azure.microsoft.com/free/).
* Register feature flag Microsoft.Network/EnableMaxPrivateEndpointsVia64kPath on current subscription, see [Enable Azure preview features](/azure/azure-resource-manager/management/preview-features).
* Understanding of [Hub and Spoke](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology) or [Mesh network](/azure/virtual-network-manager/concept-connectivity-configuration) topology.
* A virtual network with private endpoint configured, see [Create a private endpoint](/azure/private-link/create-private-endpoint-portal).
* Private Endpoint Network Policies set to **Enabled** or **RouteTableEnabled** for all Private Endpoint Subnets, see [Manage network policies for private endpoints](/azure/private-link/disable-private-endpoint-network-policy).

### Confirm if you need to upgrade

If you need more than 1,000 private endpoints in a single virtual network or encounter a max private endpoint limit error, consider upgrading to *High Scale Private Endpoints*.

For customers using a Hub and Spoke or Mesh topology, determine how many private endpoints are connected to your central virtual network containing client virtual machines. Use the provided ARG query to facilitate this process.

```Azure Resource Graph
Resources

   | where subscriptionId == "\<yourSubscriptionIDHere>"

   | where type =~ 'Microsoft.Network/virtualnetworks'

   | project id, remoteVNetIds = properties.virtualNetworkPeerings

   | mv-expand remoteVNetIds

   | project id, remoteVNetId = tostring(remoteVNetIds.properties.remoteVirtualNetwork.id)

   | where isnotempty(remoteVNetId)

   | join kind=leftouter (

       Resources

           | where type =~ 'Microsoft.Network/privateEndpoints'

           | project id, subnetId = tostring(properties.subnet.id)

           | extend VNetId = split(subnetId ,'/subnets/')[0]

           | project id, VNetId = tostring(VNetId)

           | summarize Count = count() by VNetId) 
           on $left.remoteVNetId == $right.VNetId
           | extend Count = iff(isempty(Count), 0, Count)
           | summarize TotalRemotePE = sum(Count) by ['id']

   | join kind=leftouter (

       Resources

           | where type =~ 'Microsoft.Network/privateEndpoints'

           | project id, subnetId = tostring(properties.subnet.id)

           | extend VNetId = split(subnetId ,'/subnets/')[0]

           | project id, VNetId = tostring(VNetId)

           | summarize Count = count() by VNetId) 

           on $left.id == $right.VNetId

          | extend TotalPE = iff(isempty(Count), 0, Count) + TotalRemotePE

| project VNetId = id, TotalPE

| order by TotalPE desc

| order by ['VNetId'] asc

```

### Enable High Scale Private Endpoints

To enable this feature, configure *Private Endpoint virtual network Policies*. We recommend enabling this property for all virtual networks you want to include in this feature and for all connected compute virtual networks in peering scenarios.

> [!WARNING]
> Upgrading or downgrading this feature triggers a platform update and results in a one-time connection reset. We recommend performing this action during a maintenance window.

#### [**PowerShell**](#tab/ARG-HSP-Powershell)

```azurepowershell-interactive
$vnetName = "myVirtualNetwork"
$resourceGroupName = "myResourceGroup"
$vnet = Get-AzVirtualNetwork -ResourceGroupName $resourceGroupName -Name $vnetName

$vnet.PrivateEndpointVNetPolicies = "Basic"
$vnet | Set-AzVirtualNetwork

```

#### [**CLI**](#tab/ARG-HSP-CLI)

```azurecli-interactive
vnetName = "myVirtualNetwork"
resourceGroupName="myResourceGroup"

az network vnet update --name $vnetName --resource-group $resourceGroupName --pe-vnet-policies="Basic"

```

---

### Validate configuration

To validate the configuration, verify all necessary properties are set correctly. You can do this by checking the following:

#### [**Portal**](#tab/validate-portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks**.

1. Select **myVNet**.

1. In settings of **myVNet**, select **Subnets**.

1. Select your subnet.

1. In the **Edit subnet** pane, under **Network Policy for Private Endpoints**, confirm **Route Table** is selected.

1. In the virtual network overview page, select **JSON view** in the top right corner.

1. In the **Resource JSON** pane, select the latest API Version.

1. Validate that the virtual network property *privateEndpointVNetPolicies* is set to **Basic**.

1. Confirm that you can deploy more than 1,000 private endpoints in the respective virtual network.

#### [**PowerShell**](#tab/validate-PowerShell)

```Powershell

$vnetName = "myVirtualNetwork"
$resourceGroupName = "myResourceGroup"
$vnet = Get-AzVirtualNetwork /
-ResourceGroupName $resourceGroupName /
-Name $vnetName /
$vnet.PrivateEndpointVNetPolicies

```

---

### Additional Considerations

* Upgrading or downgrading this feature triggers a platform update and results in a one-time connection reset of all long-running private endpoint connections. We recommend configuring High Scale Private Endpoints during a maintenance window.

* To downgrade from this feature, reduce the total private endpoint count in your virtual network to the limit before the feature was enabled.

* Monitoring Bytes In / Out will no longer be available on all high scale private endpoints.

* On-premises private endpoint traffic is now billed as an aggregate on your gateway virtual network. Previously, it was shown on the private endpoint resource in your billing cost center. This change doesn't affect your total bill.

### Limitations

| **Limit** | **Description** |
|---|---|
| Subscription must be enabled before enabling High Scale Private Endpoints. | Enabling Private Endpoint virtual network Policies before allow listing subscription feature flag requires a reconfiguration. |
| Swift based virtual machines aren't supported. | Swift based virtual machines deployed within a High Scale Private Endpoint virtual network aren't supported with this feature. |
| Feature currently available in select regions. | West Central US <br> UK South <br> East Asia <br> US East <br> US North |

## Next Steps

In this article, you learned how to enable High Scale Private Endpoints and the considerations that come with it. For more information on Azure Private Link, see the following articles:

* [Private Link Availability](/azure/private-link/availability)
* [Private Link DNS Zone Values](/azure/private-link/private-endpoint-dns)
* [Manage network policies for private endpoints](/azure/private-link/disable-private-endpoint-network-policy)
* [What is a private endpoint?](/azure/private-link/private-endpoint-overview)

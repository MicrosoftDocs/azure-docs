---
title: Configure Azure Application Gateway Private Link
description: This article shows you how to configure Application Gateway Private Link.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: how-to
ms.date: 02/23/2022
ms.author: victorh

---

# Configure Azure Application Gateway Private Link

The Application Gateway Private Link feature allows you to extend your workloads to be connected over a private link spanning across VNets and subscriptions. For more information, see [Application Gateway Private Link](private-link.md).

:::image type="content" source="media/private-link/private-link.png" alt-text="Diagram showing Application Gateway Private Link":::


## Configuration options

You can configure Application Gateway Private Link using the Azure portal, Azure PowerShell, and Azure CLI.

# [Azure portal](#tab/portal)

**Define a subnet for Private Link Configuration**

To enable Private Link Configuration, a subnet is required for the private link IP configuration. Private Link must use a subnet that doesn't contain any Application Gateways. Subnet sizing can be determined by the number of connections required for your deployment. Each IP address allocated to this subnet ensures 64-K concurrent TCP connections that can be established via Private Link at single point in time. Allocate more IP addresses to allow more connections via Private Link.  For example: `n * 64K`; where `n` is the number of IP addresses s being provisioned.

> [!Note]
> The maximum number of IP addresses per private link configuration is eight. Only dynamic allocation is supported.

The following steps can be completed to create a new subnet:

[Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md#add-a-subnet)

**Configure Private Link Service**

The following steps can be used to configure Private Link for your Application Gateway using the Azure portal.

1. Select **Private link**
1. Configure the following items:

   - **Name**: The name of the private link configuration.
   - **Private link subnet**: The subnet IP addresses should be consumed from.
   - **Frontend IP Configuration**: The frontend IP address that private link should forward traffic to on Application Gateway.
   - **Private IP address settings**: specify at least one IP address
1. Select **Add**.

**Configure Private Endpoint**

The private endpoint is the network interface that clients can send traffic to.  To create a private endpoint, complete the following steps:

1. Select **Private Link**.
1. Select the **Private endpoint connections** tab.
1. Select **Create**.
1. On the **Basics** tab, configure a resource group, name, and region for the Private Endpoint.  Select **Next**.
1. On the **Resource** tab, select **Next**.
1. On the **Virtual Network** tab, configure a virtual network and subnet where the private endpoint network interface should be provisioned to. Configure whether the private endpoint should have a dynamic or static IP address.  Last, configure if you want a new private link zone to be created to automatically manage IP addressing.  Select **Next**.
1. On the **Tags** tab, optionally configure resource tags. Select **Next**.
1. Select **Create**.

# [Azure PowerShell](#tab/powershell)

```azurepowershell
# Disable Private Link Service Network Policies
# https://docs.microsoft.com/en-us/azure/private-link/disable-private-endpoint-network-policy
$net =@{
    Name = 'AppGW-PL-PSH'
    ResourceGroupName = 'AppGW-PL-PSH-RG'
}
$vnet = Get-AzVirtualNetwork @net

($vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq 'AppGW-PL-Subnet'}).PrivateLinkServiceNetworkPolicies = "Disabled"

$vnet | Set-AzVirtualNetwork

# Get Application Gateway Frontend IP Name
$agw = Get-AzApplicationGateway -Name AppGW-PL-PSH -ResourceGroupName AppGW-PL-PSH-RG
# List the names
$agw.FrontendIPConfigurations | Select Name

# Add a new Private Link configuration and associate it with an existing Frontend IP
$PrivateLinkIpConfiguration = New-AzApplicationGatewayPrivateLinkIpConfiguration `
                            -Name "ipConfig01" `
                            -Subnet ($vnet | Select -ExpandProperty subnets | Where-Object {$_.Name -eq 'AppGW-PL-Subnet'}) `
                            -Primary

# Add the Private Link configuration to the gateway configuration
Add-AzApplicationGatewayPrivateLinkConfiguration `
                            -ApplicationGateway $agw `
                            -Name "privateLinkConfig01" `
                            -IpConfiguration $PrivateLinkIpConfiguration

# Associate private link configuration to Frontend IP
$agwPip = ($agw | Select -ExpandProperty FrontendIpConfigurations| Where-Object {$_.Name -eq 'appGwPublicFrontendIp'}).PublicIPAddress.Id
$privateLinkConfiguration = ($agw | Select -ExpandProperty PrivateLinkConfigurations | Where-Object {$_.Name -eq 'privateLinkConfig01'}).Id
Set-AzApplicationGatewayFrontendIPConfig -ApplicationGateway $agw -Name "appGwPublicFrontendIp" -PublicIPAddressId $agwPip -PrivateLinkConfigurationId $privateLinkConfiguration

# Apply the change to the gateway
Set-AzApplicationGateway -ApplicationGateway $agw

# Disable Private Endpoint Network Policies
# https://docs.microsoft.com/en-us/azure/private-link/disable-private-endpoint-network-policy
$net =@{
    Name = 'AppGW-PL-Endpoint-PSH-VNET'
    ResourceGroupName = 'AppGW-PL-Endpoint-PSH-RG'
}
$vnet_plendpoint = Get-AzVirtualNetwork @net

($vnet_plendpoint | Select -ExpandProperty subnets | Where-Object {$_.Name -eq 'MySubnet'}).PrivateEndpointNetworkPolicies = "Disabled"

$vnet_plendpoint | Set-AzVirtualNetwork

# Create Private Link Endpoint - Group ID is the same as the frontend IP configuration
$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "AppGW-PL-Connection" -PrivateLinkServiceId $agw.Id -GroupID "appGwPublicFrontendIp"

## Create private endpoint
New-AzPrivateEndpoint -Name "AppGWPrivateEndpoint" -ResourceGroupName $vnet_plendpoint.ResourceGroupName -Location $vnet_plendpoint.Location -Subnet ($vnet_plendpoint | Select -ExpandProperty subnets | Where-Object {$_.Name -eq 'MySubnet'}) -PrivateLinkServiceConnection $privateEndpointConnection
```


# [Azure CLI](#tab/cli)

```azurecli
# Disable Private Link Service Network Policies
# https://docs.microsoft.com/en-us/azure/private-link/disable-private-endpoint-network-policy
az network vnet subnet update \
				--name AppGW-PL-Subnet \
				--vnet-name AppGW-PL-CLI-VNET \
				--resource-group AppGW-PL-CLI-RG \
				--disable-private-link-service-network-policies true

# Get Application Gateway Frontend IP Name
az network application-gateway frontend-ip list \
							--gateway-name AppGW-PL-CLI \
							--resource-group AppGW-PL-CLI-RG

# Add a new Private Link configuration and associate it with an existing Frontend IP
az network application-gateway private-link add \
							--frontend-ip appGwPublicFrontendIp \
							--name privateLinkConfig01 \
							--subnet /subscriptions/XXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX/resourceGroups/AppGW-PL-CLI-RG/providers/Microsoft.Network/virtualNetworks/AppGW-PL-CLI-VNET/subnets/AppGW-PL-Subnet \
							--gateway-name AppGW-PL-CLI \
							--resource-group AppGW-PL-CLI-RG

# Get Private Link resource ID
az network application-gateway private-link list \
				--gateway-name AppGW-PL-CLI \
				--resource-group AppGW-PL-CLI-RG



# Disable Private Endpoint Network Policies
# https://docs.microsoft.com/en-us/azure/private-link/disable-private-endpoint-network-policy
az network vnet subnet update \
				--name MySubnet \
				--vnet-name AppGW-PL-Endpoint-CLI-VNET \
				--resource-group AppGW-PL-Endpoint-CLI-RG \
				--disable-private-endpoint-network-policies true

# Create Private Link Endpoint - Group ID is the same as the frontend IP configuration
az network private-endpoint create \
	--name AppGWPrivateEndpoint \
	--resource-group AppGW-PL-Endpoint-CLI-RG \
	--vnet-name AppGW-PL-Endpoint-CLI-VNET \
	--subnet MySubnet \
	--group-id appGwPublicFrontendIp \
	--private-connection-resource-id /subscriptions/XXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX/resourceGroups/AppGW-PL-CLI-RG/providers/Microsoft.Network/applicationGateways/AppGW-PL-CLI \
	--connection-name AppGW-PL-Connection
```

---

## Next steps

- Learn about Azure Private Link: [What is Azure Private Link?](../private-link/private-link-overview.md)

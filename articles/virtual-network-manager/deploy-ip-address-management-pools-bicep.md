---
title: Deploy IPAM pools and static CIDRs with Azure Virtual Network Manager - Bicep
description: Deploy IPAM pools and static CIDRs with Azure Virtual Network Manager using Bicep. Create non-overlapping address spaces and associate existing virtual networks in minutes.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: quickstart
ms.date: 06/25/2025
ms.custom:
  - template-quickstart
  - mode-arm
  - devx-track-bicep
  - devx-track-azurepowershell
  - devx-track-azurecli
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:06/25/2025
---

# Deploy IPAM pools and static CIDRs with Azure Virtual Network Manager - Bicep

Azure Virtual Network Manager provides centralized IP address management (IPAM) that helps you avoid overlapping address spaces across your virtual networks. With IPAM pools, you can define large address ranges and automatically allocate non-overlapping subnets to your virtual networks.

This article shows you how to use Bicep templates to:

- Create an Azure Virtual Network Manager instance with IPAM capabilities
- Set up an IPAM pool with a static CIDR allocation
- Associate existing virtual networks with IPAM pools
- Create new virtual networks that automatically receive IP addresses from IPAM pools

When you finish, you'll have a working IPAM configuration that you can use to manage IP address allocation across multiple virtual networks.

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure CLI or Azure PowerShell installed locally, or use [Azure Cloud Shell](https://shell.azure.com).

## Review the Bicep file

The following Bicep template creates an Azure Virtual Network Manager instance with an IPAM pool and static CIDR allocation. The template defines these Azure resources:

- [**Microsoft.Network/networkManagers**](/azure/templates/microsoft.network/networkmanagers): Creates an Azure Virtual Network Manager instance
- [**Microsoft.Network/networkManagers/ipamPools**](/azure/templates/microsoft.network/networkmanagers/ipampools): Creates an IPAM pool under the network manager
- [**Microsoft.Network/networkManagers/ipamPools/staticCidrs**](/azure/templates/microsoft.network/networkmanagers/ipampools/staticcidrs): Creates a static CIDR allocation in the IPAM pool

```bicep
@description('Location for resources.')
param locationName string = resourceGroup().location

@description('Name of the Virtual Network Manager')
param networkManagerName string = 'vnm-learn-prod-${locationName}-001'

@description('Name of the IPAM pool')
param ipamPoolName string = 'ipam-pool-learn-prod-001'

@description('Address prefix of the IPAM pool')
param ipamPoolAddressPrefix string = '10.0.0.0/16'

@description('Name of the static CIDR')
param staticCidrName string = 'static-cidr-reserved-001'

@description('Address prefix of the static CIDR')
param staticCidrAddressPrefix string = '10.0.1.0/24'

// Virtual Network Manager
resource networkManager 'Microsoft.Network/networkManagers@2024-05-01' = {
  name: networkManagerName
  location: locationName
  properties: {
    networkManagerScopes: {
      managementGroups: []
      subscriptions: [
        subscription().id
      ]
    }
    networkManagerScopeAccesses: [
      'Connectivity'
    ]
  }
}

// IPAM Pool
resource ipamPool 'Microsoft.Network/networkManagers/ipamPools@2024-05-01' = {
  parent: networkManager
  name: ipamPoolName
  location: locationName
  properties: {
    addressPrefixes: [
      ipamPoolAddressPrefix
    ]
  }
}

// Static CIDR
resource staticCidr 'Microsoft.Network/networkManagers/ipamPools/staticCidrs@2024-05-01' = {
  parent: ipamPool
  name: staticCidrName
  properties: {
    addressPrefixes: [
      staticCidrAddressPrefix
    ]
  }
}
```

## Deploy the Bicep template

Save the Bicep template to your local computer as **main.bicep**, then deploy it using either Azure CLI or Azure PowerShell.

### [Azure CLI](#tab/azure-cli)

```azurecli
az group create \
    --name rg-network-manager \
    --location eastus2

az deployment group create \
    --resource-group rg-network-manager \
    --template-file main.bicep
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$rgParams = @{
    Name     = 'rg-network-manager'
    Location = 'eastus2'
}
New-AzResourceGroup @rgParams

$deploymentParams = @{
    ResourceGroupName = 'rg-network-manager'
    TemplateFile      = 'main.bicep'
}
New-AzResourceGroupDeployment @deploymentParams
```

---

The deployment takes a few minutes to complete. When the deployment finishes, you see a message indicating that the deployment succeeded.

## Associate an existing virtual network to an IPAM pool

The following Bicep template associates an existing virtual network with an IPAM pool. This scenario is useful when you have existing virtual networks that you want to manage through Azure Virtual Network Manager's IPAM feature.

The template defines this Azure resource:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): Modifies an existing virtual network to associate it with the IPAM pool

```bicep
@description('Name of an existing virtual network')
param existingVnetName string = 'vnet-existing-001'

@description('Location of an existing virtual network')
param existingVnetLocation string = 'eastus2'

@description('Resource ID of an existing IPAM pool')
param existingIpamPoolId string = '/subscriptions/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1/resourceGroups/rg-network-manager/providers/Microsoft.Network/networkManagers/vnm-learn-prod-eastus2-001/ipamPools/ipam-pool-learn-prod-001'

// Virtual Network
resource existingVnet 'Microsoft.Network/virtualNetworks@2024-05-01' = {
  name: existingVnetName
  location: existingVnetLocation
  properties: {
    addressSpace: {
      ipamPoolPrefixAllocations: [
        {
          pool: {
            id: existingIpamPoolId
          }
        }
      ]
    }
  }
}
```

### Deploy the association template

1. Save the Bicep template to your local computer as **associate-existing-vnet.bicep**.

1. Use a text or code editor to update the following parameters in the file:
   - Change `existingVnetName` to the name of your existing virtual network
   - Change `existingVnetLocation` to the location of your existing virtual network
   - Change `existingIpamPoolId` to the resource ID of your existing IPAM pool

1. Save the **associate-existing-vnet.bicep** file.

1. Deploy the Bicep template using either Azure CLI or Azure PowerShell. Replace `rg-existing-vnet` with the resource group name of the existing virtual network:

### [Azure CLI](#tab/azure-cli-associate)

```azurecli
az deployment group create \
    --resource-group rg-existing-vnet \
    --template-file associate-existing-vnet.bicep
```

### [Azure PowerShell](#tab/azure-powershell-associate)

```azurepowershell
$deploymentParams = @{
    ResourceGroupName = 'rg-existing-vnet'
    TemplateFile      = 'associate-existing-vnet.bicep'
}
New-AzResourceGroupDeployment @deploymentParams
```

---

When the deployment finishes, you see a message indicating that the deployment succeeded.

## Create a new virtual network using IPAM pool allocation

The following Bicep template creates a new virtual network that automatically receives IP address allocation from an IPAM pool. This approach simplifies virtual network creation by ensuring non-overlapping address spaces.

The template defines this Azure resource:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): Creates an IPAM-managed virtual network

```bicep
@description('Name of new virtual network')
param newVnetName string = 'vnet-learn-prod-001'

@description('Name of default subnet')
param subnetName string = 'snet-default-001'

@description('Location for virtual network')
param locationName string = resourceGroup().location

@description('Resource ID of an existing IPAM pool')
param existingIpamPoolId string = '/subscriptions/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1/resourceGroups/rg-network-manager/providers/Microsoft.Network/networkManagers/vnm-learn-prod-eastus2-001/ipamPools/ipam-pool-learn-prod-001'

@description('Number of IP addresses for virtual network')
param vnetNumberOfIpAddresses string = '256'

@description('Number of IP addresses for subnet')
param subnetNumberOfIpAddresses string = '128'

// Virtual Network
resource newVnet 'Microsoft.Network/virtualNetworks@2024-05-01' = {
  name: newVnetName
  location: locationName
  properties: {
    addressSpace: {
      ipamPoolPrefixAllocations: [
        {
          numberOfIpAddresses: vnetNumberOfIpAddresses
          pool: {
            id: existingIpamPoolId
          }
        }
      ]
    }
    subnets: [
      {
        name: subnetName
        properties: {
          ipamPoolPrefixAllocations: [
            {
              numberOfIpAddresses: subnetNumberOfIpAddresses
              pool: {
                id: existingIpamPoolId
              }
            }
          ]
        }
      }
    ]
  }
}
```

### Deploy the new virtual network template

1. Save the Bicep template to your local computer as **create-ipam-managed-vnet.bicep**.

1. Use a text or code editor to update the following parameter in the file:
   - Change `existingIpamPoolId` to the resource ID of your existing IPAM pool

1. Save the **create-ipam-managed-vnet.bicep** file.

1. Deploy the Bicep template using either Azure CLI or Azure PowerShell:

### [Azure CLI](#tab/azure-cli-create)

```azurecli
az deployment group create \
    --resource-group rg-network-manager \
    --template-file create-ipam-managed-vnet.bicep
```

### [Azure PowerShell](#tab/azure-powershell-create)

```azurepowershell
$deploymentParams = @{
    ResourceGroupName = 'rg-network-manager'
    TemplateFile      = 'create-ipam-managed-vnet.bicep'
}
New-AzResourceGroupDeployment @deploymentParams
```

---

When the deployment finishes, you see a message indicating that the deployment succeeded.

## Verify the deployment

After deploying the templates, verify that the IPAM pool and virtual network configurations are working correctly:

1. In the [Azure portal](https://portal.azure.com), navigate to your Virtual Network Manager instance.

1. Under **IP address management**, select **IP address pools**.

1. Select your IPAM pool to view its allocations and usage statistics.

1. Under **Settings**, select **Allocations** to see all resources associated with the pool, including static CIDR blocks and virtual networks.

## Clean up resources

If you no longer need the resources created in this quickstart, delete the resource group and all its contained resources:

### [Azure CLI](#tab/azure-cli-cleanup)

```azurecli
az group delete --name rg-network-manager --yes --no-wait
```

### [Azure PowerShell](#tab/azure-powershell-cleanup)

```azurepowershell
Remove-AzResourceGroup -Name 'rg-network-manager' -Force -AsJob
```

---

## Next steps

In this quickstart, you deployed Azure Virtual Network Manager with IPAM pools and learned how to associate virtual networks with IP address pools. To learn more about IP address management in Azure Virtual Network Manager:

> [!div class="nextstepaction"]
> [What is IP address management (IPAM) in Azure Virtual Network Manager?](concept-ip-address-management.md)

> [!div class="nextstepaction"]
> [Manage IP addresses with Azure Virtual Network Manager](how-to-manage-ip-addresses-network-manager.md)
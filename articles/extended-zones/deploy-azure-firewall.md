---
title: Deploy Azure Firewall in Azure Extended Zones
description: Learn how to deploy Azure Firewall in Azure Extended Zones using ARM templates, including routing configuration, firewall rules, and deployment validation.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 03/27/2026
---

# Deploy Azure Firewall in Azure Extended Zones

In this article, you learn how to deploy **Azure Firewall** in **Azure Extended Zones** using ARM templates. It provides setup instructions, including ARM template snippets and deployment validation steps.

Azure Firewall in Azure Extended Zones behaves the same as Azure Firewall in global Azure regions — same SKUs (Standard and Premium), Firewall Policy and rule collections, autoscaling, and availability. The difference is in the setup and deployment. The firewall and its associated resources are created with an `extendedLocation` property, which places them in the extended zone. 

> [!IMPORTANT]
> Do **not** create the **AzureFirewallSubnet** manually. It is created automatically by the Azure Firewall service during deployment.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

## Architecture overview

A typical Azure Firewall deployment in an Extended Zone includes the following resources:

- A virtual network deployed with workload subnets.
- A public IP address.
- Azure Firewall associated with the public IP.
- An optional Firewall Policy with rule collections.
- A route table that forces traffic through the firewall via a default route.

All resources that belong to the Extended Zone are deployed using the parent Azure region as the `location` and the Extended Zone name as the `extendedLocation`. For example, the **Perth** extended zone uses **Australia East** as the parent region.

## ARM template deployment

Use the following ARM template snippets for your own deployments. All Azure Extended Zone resources should have the same pattern: `location` is set to the parent region and `extendedLocation` specifies the extended zone name. Make sure to replace the parameter values with your own, and keep them consistent across all resources.

```json
{
  "location": "<parent-region>",
  "extendedLocation": { "type": "EdgeZone", "name": "<edge-zone-name>" }
}
```

### Create a virtual network

With the virtual network, create workload subnets only. 
> [!NOTE]
> Do not include `AzureFirewallSubnet` in the subnets array. Azure Firewall creates and manages this subnet automatically.

```json
{
  "type": "Microsoft.Network/virtualNetworks",
  "apiVersion": "2024-05-01",
  "name": "[parameters('vnetName')]",
  "location": "[parameters('location')]",
  "extendedLocation": {
    "type": "EdgeZone",
    "name": "[parameters('edgeZoneName')]"
  },
  "properties": {
    "addressSpace": {
      "addressPrefixes": [ "[parameters('vnetAddressPrefix')]" ]
    },
    "subnets": [
      {
        "name": "[parameters('workloadSubnetName')]",
        "properties": {
          "addressPrefix": "[parameters('workloadSubnetPrefix')]"
        }
      }
    ]
  }
}
```

### Create a standard public IP

The IP should be Standard SKU with Static allocation method.

```json
{
  "type": "Microsoft.Network/publicIPAddresses",
  "apiVersion": "2024-05-01",
  "name": "[parameters('publicIpName')]",
  "location": "[parameters('location')]",
  "extendedLocation": {
    "type": "EdgeZone",
    "name": "[parameters('edgeZoneName')]"
  },
  "sku": { "name": "Standard" },
  "properties": {
    "publicIPAllocationMethod": "Static"
  }
}
```

### Create Azure Firewall

Firewall SKU can be either Standard or Premium, depending on your needs. Make sure to associate the public IP created in the previous step, and to attach the Firewall Policy (if applicable) correctly in the ARM template.

We recommend using Firewall Policies to manage firewall rules in a more efficient way, but you can also use classic rules if you prefer. Make sure to attach the Firewall Policy to the firewall in the ARM template. For more information on Firewall Policies and rule collections, see [Azure Firewall Policy overview](/azure/firewall/policy-rule-sets).

```json
{
  "type": "Microsoft.Network/azureFirewalls",
  "apiVersion": "2024-05-01",
  "name": "[parameters('firewallName')]",
  "location": "[parameters('location')]",
  "extendedLocation": {
    "type": "EdgeZone",
    "name": "[parameters('edgeZoneName')]"
  },
  "properties": {
    "sku": {
      "name": "AZFW_VNet",
      "tier": "[parameters('firewallSkuTier')]"
    },
    "firewallPolicy": {
      "id": "[resourceId('Microsoft.Network/firewallPolicies', parameters('firewallPolicyName'))]"
    },
    "ipConfigurations": [
      {
        "name": "ipconfig",
        "properties": {
          "publicIPAddress": {
            "id": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIpName'))]"
          },
          "subnet": {
            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), 'AzureFirewallSubnet')]"
          }
        }
      }
    ]
  }
}
```

### Configure routing

For the routing, add the following default route **0.0.0.0/0**, **VirtualAppliance** and **firewallPrivateIP** to the properties. Associate the route table to workload subnets.
  
```json
{
  "type": "Microsoft.Network/routeTables",
  "apiVersion": "2024-05-01",
  "name": "[parameters('routeTableName')]",
  "location": "[parameters('location')]",
  "extendedLocation": {
    "type": "EdgeZone",
    "name": "[parameters('edgeZoneName')]"
  },
  "properties": {
    "routes": [
      {
        "name": "default-to-firewall",
        "properties": {
          "addressPrefix": "0.0.0.0/0",
          "nextHopType": "VirtualAppliance",
          "nextHopIpAddress": "[parameters('firewallPrivateIp')]"
        }
      }
    ]
  }
}
```

## Validate the deployment

After deploying all resources, verify the following:

1. Resource placement in the intended extended zone: Firewall, Public IP, and Virtual Network should all show the correct Extended Zone.

2. AzureFirewallSubnet creation: after deployment, it should be visible in the virtual network's subnet list. Do not attempt to create it manually, as this may cause deployment conflicts.


3. Routing configuration: route table should be associated to workload subnets; 0.0.0.0/0 routes to firewall private IP.


4. Firewall rules setup: Firewall Policy (or classic ruleset) should be attached to the firewall and contain the expected rule collections and allow/deny behavior. 

5. Traffic flow: test that traffic from workload VMs is correctly processed by the firewall according to the configured rules. If enabled, review firewall logs/hits.


## Clean up resources

When no longer needed, delete the resource group and all resources it contains:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [Azure Firewall documentation](/azure/firewall/overview)
- [Azure Firewall Policy overview](/azure/firewall/policy-rule-sets)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Request access to an Azure Extended Zone](request-access.md)
- [Frequently asked questions](faq.md)

---
title: Create an Azure DDoS Protection custom policy with an Azure Resource Manager template
description: Learn how to create an Azure DDoS Protection custom policy with protocol-specific detection thresholds by using an Azure Resource Manager template.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.author: duau
ms.date: 10/13/2026
# Customer intent: As a network administrator, I want to create a DDoS Protection custom policy with an Azure Resource Manager template, so that I can deploy protocol-specific detection thresholds as code.
---

# Create an Azure DDoS Protection custom policy by using an Azure Resource Manager template

This article describes how to use an Azure Resource Manager template to create an Azure DDoS Protection custom policy. A custom policy defines protocol-specific detection thresholds that override adaptive auto-tuning for supported public IP endpoints. For more information, see the [custom policy overview](ddos-custom-policy-overview.md).

The template in this article demonstrates the Standard Load Balancer frontend IP configuration management path. Custom-policy resource support isn't limited to this example. Association properties depend on the resource and management interface. For public IP association examples, see the [Azure CLI](manage-ddos-custom-policy-cli.md) and [Azure PowerShell](manage-ddos-custom-policy-powershell.md) guides.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- For this template example, a Standard Load Balancer with at least one public frontend IP configuration. You need the resource ID of the frontend IP configuration to associate it with the policy.

## Review the template

The following template creates a custom policy with a single inbound TCP detection threshold rule, set in packets per second (from 50,000 to 2,000,000), and associates it with a Standard Load Balancer frontend IP configuration. The policy uses the [Microsoft.Network/ddosCustomPolicies](/azure/templates/microsoft.network/ddoscustompolicies) resource type.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "policyName": {
      "type": "string",
      "metadata": {
        "description": "The name of the DDoS custom policy."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The region for the custom policy."
      }
    },
    "frontendIPConfigurationId": {
      "type": "string",
      "metadata": {
        "description": "The resource ID of the Standard Load Balancer frontend IP configuration to protect."
      }
    },
    "tcpThreshold": {
      "type": "int",
      "defaultValue": 100000,
      "minValue": 50000,
      "maxValue": 2000000,
      "metadata": {
        "description": "Inbound TCP detection threshold in packets per second (50,000 to 2,000,000)."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Network/ddosCustomPolicies",
      "apiVersion": "2025-07-01",
      "name": "[parameters('policyName')]",
      "location": "[parameters('location')]",
      "properties": {
        "detectionRules": [
          {
            "name": "tcp-threshold",
            "properties": {
              "detectionMode": "TrafficThreshold",
              "trafficDetectionRule": {
                "packetsPerSecond": "[parameters('tcpThreshold')]",
                "trafficType": "Tcp"
              }
            }
          }
        ],
        "frontEndIpConfiguration": [
          {
            "id": "[parameters('frontendIPConfigurationId')]"
          }
        ]
      }
    }
  ]
}
```

The template defines one resource:

- [Microsoft.Network/ddosCustomPolicies](/azure/templates/microsoft.network/ddoscustompolicies)

To tune more protocols, add more entries to `detectionRules` with a `trafficType` of `Tcp`, `Udp`, or `TcpSyn`. Set `packetsPerSecond` within the range for the selected protocol.

| Traffic type | Minimum threshold (packets per second) | Maximum threshold (packets per second) |
| --- | --- | --- |
| `Tcp` | 50,000 | 2,000,000 |
| `Udp` | 20,000 | 200,000 |
| `TcpSyn` | 1,000 | 100,000 |

## Deploy the template

1. Save the template to a file named **azuredeploy.json**.
1. Deploy the template by using Azure CLI or Azure PowerShell. Replace the placeholder values with your own.

    # [CLI](#tab/CLI)

    ```azurecli-interactive
    az group create --name MyResourceGroup --location eastus
    az deployment group create \
      --resource-group MyResourceGroup \
      --template-file azuredeploy.json \
      --parameters policyName=MyCustomPolicy frontendIPConfigurationId=<frontend-ip-configuration-id>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    New-AzResourceGroup -Name MyResourceGroup -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName MyResourceGroup `
      -TemplateFile azuredeploy.json `
      -policyName "MyCustomPolicy" `
      -frontendIPConfigurationId "<frontend-ip-configuration-id>"
    ```

    ---

## Review deployed resources

Use Azure CLI or Azure PowerShell to verify that the custom policy exists.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource show \
  --resource-group MyResourceGroup \
  --name MyCustomPolicy \
  --resource-type Microsoft.Network/ddosCustomPolicies
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName MyResourceGroup -Name MyCustomPolicy -ResourceType Microsoft.Network/ddosCustomPolicies
```

---

## Clean up resources

First detach the policy from the load balancer frontend by using the [Azure PowerShell guidance](manage-ddos-custom-policy-powershell.md#remove-the-associations). When you no longer need the example resources, delete their resource group to remove the custom policy and any other resources it contains.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name MyResourceGroup
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

---

## Next steps

> [!div class="nextstepaction"]
> [Monitor Azure DDoS Protection](monitor-ddos-protection.md)

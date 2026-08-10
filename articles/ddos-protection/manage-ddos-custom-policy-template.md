---
title: Create an Azure DDoS Protection custom policy with an Azure Resource Manager template (preview)
description: Learn how to create an Azure DDoS Protection custom policy with protocol-specific detection thresholds by using an Azure Resource Manager template.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.author: duau
ms.date: 06/25/2026
# Customer intent: As a network administrator, I want to create a DDoS Protection custom policy with an Azure Resource Manager template, so that I can deploy protocol-specific detection thresholds as code.
---

# Create an Azure DDoS Protection custom policy by using an Azure Resource Manager template (preview)

This article describes how to use an Azure Resource Manager template to create an Azure DDoS Protection custom policy. A custom policy defines protocol-specific detection thresholds that override adaptive auto-tuning for the Standard Load Balancer frontend IP addresses that you associate with it. For more information, see [What is Azure DDoS Protection custom policy?](ddos-custom-policy-overview.md)

> [!IMPORTANT]
> Azure DDoS Protection custom policy is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Standard Load Balancer with at least one frontend IP configuration. You need the resource ID of the frontend IP configuration to associate it with the policy.

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

To tune more protocols, add more entries to `detectionRules` with a `trafficType` of `Tcp`, `Udp`, or `TcpSyn`.

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

When you no longer need the resources, delete the resource group to remove the custom policy and any other resources it contains.

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

---
title: 'Quickstart: Create and configure Azure DDoS Network Protection - ARM template'
description: Learn how to create and enable an Azure DDoS Protection plan using an Azure Resource Manager template (ARM template).
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: quickstart
ms.workload: infrastructure-services
ms.custom: subject-armqs, mode-arm, ignite-2022, devx-track-arm-template
ms.author: abell
ms.date: 10/12/2022
---

# Quickstart: Create and configure Azure DDoS Network Protection using ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a distributed denial of service (DDoS) protection plan and virtual network (VNet), then enables the protection plan for the VNet. An Azure DDoS Network Protection plan defines a set of virtual networks that have DDoS protection enabled across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions to the same plan.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fcreate-and-enable-ddos-protection-plans%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/create-and-enable-ddos-protection-plans).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/create-and-enable-ddos-protection-plans/azuredeploy.json":::

The template defines two resources:

- [Microsoft.Network/ddosProtectionPlans](/azure/templates/microsoft.network/ddosprotectionplans)
- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)

## Deploy the template

In this example, the template creates a new resource group, a DDoS protection plan, and a VNet.

1. To sign in to Azure and open the template, select the **Deploy to Azure** button.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fcreate-and-enable-ddos-protection-plans%2Fazuredeploy.json)

1. Enter the values to create a new resource group, DDoS protection plan, and VNet name.

    :::image type="content" source="media/manage-ddos-protection-template/ddos-template.png" alt-text="DDoS quickstart template.":::

    - **Subscription**: Name of the Azure subscription where the resources will be deployed.
    - **Resource group**: Select an existing resource group or create a new resource group.
    - **Region**: The region where the resource group is deployed, such as East US.
    - **Ddos Protection Plan Name**: The name of for the new DDoS protection plan.
    - **Virtual Network Name**: Creates a name for the new VNet.
    - **Location**: Function that uses the same region as the resource group for resource deployment.
    - **Vnet Address Prefix**: Use the default value or enter your VNet address.
    - **Subnet Prefix**: Use the default value or enter your VNet subnet.
    - **Ddos Protection Plan Enabled**: Default is `true` to enable the DDoS protection plan.

1. Select **Review + create**.
1. Verify that template validation passed and select **Create** to begin the deployment.

## Review deployed resources

To copy the Azure CLI or Azure PowerShell command, select the **Copy** button. The **Try it** button opens Azure Cloud Shell to run the command.

# [CLI](#tab/CLI)

```azurecli-interactive
az network ddos-protection show \
  --resource-group MyResourceGroup \
  --name MyDdosProtectionPlan
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzDdosProtectionPlan -ResourceGroupName 'MyResourceGroup' -Name 'MyDdosProtectionPlan'
```

---

The output shows the new resources.

# [CLI](#tab/CLI)

```Output
{
  "etag": "W/\"abcdefgh-1111-2222-bbbb-987654321098\"",
  "id": "/subscriptions/b1111111-2222-3333-aaaa-012345678912/resourceGroups/MyResourceGroup/providers/Microsoft.Network/ddosProtectionPlans/MyDdosProtectionPlan",
  "location": "eastus",
  "name": "MyDdosProtectionPlan",
  "provisioningState": "Succeeded",
  "resourceGroup": "MyResourceGroup",
  "resourceGuid": null,
  "tags": null,
  "type": "Microsoft.Network/ddosProtectionPlans",
  "virtualNetworks": [
    {
      "id": "/subscriptions/b1111111-2222-3333-aaaa-012345678912/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyVNet",
      "resourceGroup": "MyResourceGroup"
    }
  ]
}
```

# [PowerShell](#tab/PowerShell)

```Output
Name              : MyDdosProtectionPlan
Id                : /subscriptions/b1111111-2222-3333-aaaa-012345678912/resourceGroups/MyResourceGroup/providers/Microsoft.Network/ddosProtectionPlans/MyDdosProtectionPlan
Etag              : W/"abcdefgh-1111-2222-bbbb-987654321098"
ProvisioningState : Succeeded
VirtualNetworks   : [
                      {
                        "Id": "/subscriptions/b1111111-2222-3333-aaaa-012345678912/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyVNet"
                      }
                    ]
```

---

## Clean up resources

When you're finished you can delete the resources. The command deletes the resource group and all the resources it contains.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name MyResourceGroup
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'MyResourceGroup'
```

---

## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)

---
title: View your Azure Payment HSMs
description: View your Azure Payment HSMs
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: tutorial
ms.custom:
ms.date: 08/09/2023
---

# Tutorial: View your payment HSMs

After you have [created one or more Azure Payment HSMs](create-payment-hsm.md), you can view them (and validate their deployment) with Azure CLI, Azure PowerShell, or the Azure portal.

## View your payment HSM

# [Azure CLI](#tab/azure-cli)

To list all of your payment HSMs, use the [az dedicated-hsm list](/cli/azure/dedicated-hsm#az-dedicated-hsm-list) command. (The output of this command is more readable when displayed in table-format.)

```azurecli-interactive
az dedicated-hsm list --resource-group "myResourceGroup" -o table
```

To see a specific payment HSM and its properties, use the Azure CLI [az dedicated-hsm show](/cli/azure/dedicated-hsm#az-dedicated-hsm-show) command.

```azurecli-interactive
az dedicated-hsm show --resource-group "myResourceGroup" --name "myPaymentHSM"
```

# [Azure PowerShell](#tab/azure-powershell)

To list all of your payment HSMs, use the [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet with no parameters.

To get more information on your payment HSMs, you can use the [Get-AzResource](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet, specifying the resource group, and "Microsoft.HardwareSecurityModules/dedicatedHSMs" as the resource type:

```azurepowershell-interactive
Get-AzResource -ResourceGroupName "myResourceGroup" -ResourceType "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

To view a specific payment HSM and its properties, use the Azure PowerShell [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet.

```azurepowershell-interactive
Get-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroup "myResourceGroup"
```

# [Azure portal](#tab/azure-portal)


To view your payment HSMs in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Select "Resource groups".
1. Select your resource group (e.g., "myResourceGroup").
1. You will see your network interfaces, but not your payment HSMs. Select the "Show hidden types" box.
  :::image type="content" source="./media/portal-view-payment-hsms.png" lightbox="./media/portal-view-payment-hsms.png" alt-text="Screenshot of the Azure portal displaying all payment HSMs.":::
1. You can select one of your payment HSMs to see its properties.
  :::image type="content" source="./media/portal-view-payment-hsm.png" lightbox="./media/portal-view-payment-hsm.png" alt-text="Screenshot of the Azure portal displaying a specific payment HSM and its properties.":::

---

## Next steps

Advance to the next article to learn how to access the payShield manager for your payment HSM
> [!div class="nextstepaction"]
> [Access the payShield manager](access-payshield-manager.md)

Additional information:

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)

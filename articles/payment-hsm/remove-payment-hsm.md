---
title: Remove a commissioned Azure Payment HSM
description: Remove a commissioned Azure Payment HSM
services: payment-hsm
author: msmbaldwin
ms.service: payment-hsm
ms.topic: overview
ms.date: 09/12/2022
ms.author: mbaldwin

---
# Tutorial: Remove a commissioned payment HSM

Before deleting a payment HSM that has been commissioned, it must first be decommissioned.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Remove a commissioned payment HSM
> * Verify that the payment HSM has been deleted

## Remove a payment HSM from the payShield manager

Navigate to the payShield manager, following the steps in [Access the payShield manager](access-payshield-manager.md#access-the-payshield-manager). From there, select "Remove device".

:::image type="content" source="./media/payshield-manager-remove-device.png" alt-text="Screenshot of the payShield manager for Azure Payment HSM, remove device screen.":::

> [!IMPORTANT]
> The payment HSM must be in a Secure state before RELEASE button is enabled. To do this, login with both Left and Right Keys and change state to Secure.

## Delete the payment HSM

Once the payment HSM has been released, you can delete it using Azure CLI or Azure PowerShell.

# [Azure CLI](#tab/azure-cli)

To remove your payment HSM, use the [az dedicated-hsm delete](/cli/azure/dedicated-hsm#az-dedicated-hsm-delete) command. The following example deletes the `myPaymentHSM` payment HSM from the `myResourceGroup` resource group:

```azurecli-interactive
az dedicated-hsm delete --name "myPaymentHSM" -g "myResourceGroup"
```

Afterward, you can verify that the payment HSM was deleted with the Azure CLI [az dedicated-hsm show](/cli/azure/dedicated-hsm#az-dedicated-hsm-show) command.

```azurecli-interactive
az dedicated-hsm show --resource-group "myResourceGroup" --name "myPaymentHSM"
```

This will return a "resource not found" error.

# [Azure PowerShell](#tab/azure-powershell)

To remove your payment HSM, use the Azure PowerShell [Remove-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/remove-azdedicatedhsm) cmdlet. The following example deletes the `myPaymentHSM` payment HSM from the `myResourceGroup` resource group:

```azurepowershell-interactive
Remove-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "myResourceGroup"
```

Afterward, you can verify that the payment HSM was deleted with the Azure PowerShell [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet.

```azurepowershell-interactive
Get-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroup "myResourceGroup"
```

This will return a "resource not found" error.

---

## Next steps

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- [Access the payShield manager for your payment HSM](access-payshield-manager.md)
---
title: Create a lab using PowerShell
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab using PowerShell and the Az module.
author: RogerBestMSFT
ms.topic: how-to
ms.date: 06/15/2022
ms.custom: mode-api, devx-track-azurepowershell
---

# Create a lab in Azure Lab Services using PowerShell and the Azure module

In this article, you learn how to create a lab using PowerShell and the Azure modules.  The lab uses the settings from a previously created lab plan.  For detailed overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

- [Windows PowerShell](/powershell/scripting/windows-powershell/starting-windows-powershell).
- [Azure Az PowerShell module](/powershell/azure/new-azureps-module-az). Must be version 7.2 or higher.

    ```powershell
    Install-Module 'Az'
    ```

- [Az.LabServices PowerShell module](/powershell/module/az.labservices/).

    ```powershell
    Install-Module 'Az.LabServices'
    ```

- Lab plan. To create a lab plan, see [Create a lab plan using PowerShell and the Azure modules](how-to-create-lab-plan-powershell.md).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure and verify an active subscription.

## Create a lab

Before you can create a lab, you need the lab plan resource.  In the [create a lab plan by using PowerShell](how-to-create-lab-plan-powershell.md), you learn how to create a lab plan named `ContosoLabPlan` in a resource group named `MyResourceGroup`.

```powershell
$plan = Get-AzLabServicesLabPlan `
    -Name "ContosoLabPlan" `
    -ResourceGroupName "MyResourceGroupName"
```

We also need to choose a base image for the lab VMs from the available images for the lab plan.  Let's see what is available.

```powershell
$plan | Get-AzLabServicesPlanImage | Where-Object { $_.EnabledState.ToString() -eq "enabled" }
```

We'll choose the Windows 11 image.

```powershell
$image = $plan | Get-AzLabServicesPlanImage | Where-Object { $_.EnabledState.ToString() -eq "enabled" -and $_.DisplayName -eq "Windows 11 Pro (Gen2)" }
```

When you create a lab by using PowerShell, you also need to provide the resource SKU information. The following command uses the [REST API to retrieve the list of SKUs](/rest/api/labservices/skus/list) and selects the `Classic_Fsv2_4_8GB_128_S_SSD` SKU:

```powershell
$subscriptionId = (Get-AzContext).Subscription.ID
$skus = (Invoke-AzRestMethod -Uri https://management.azure.com/subscriptions/$subscriptionId/providers/Microsoft.LabServices/skus?api-version=2022-08-01 | Select-Object -Property "Content" -ExpandProperty Content | ConvertFrom-Json).value
$sku = $skus | Where-Object -Property "name" -eq "Classic_Fsv2_4_8GB_128_S_SSD" | select-object -First 1
```

We're now ready to create a lab based of our lab plan with the Window 11 Pro image and the `Classic_Fsv2_4_8GB_128_S_SSD` resource SKU. The following command will create a lab using the lab plan created above.

``` powershell
# $plan and $image are from the Create LabPlan QuickStart.
$password = "<custom password>"

$lab = New-AzLabServicesLab -Name "ContosoLab" `
    -ResourceGroupName "MyResourceGroup" `
    -Location "westus" `
    -LabPlanId $plan.Id `
    -AdminUserPassword (ConvertTo-SecureString $password -AsPlainText -Force) `
    -AdminUserUsername "adminUser" `
    `
    -AutoShutdownProfileShutdownOnDisconnect Enabled `
    -AutoShutdownProfileDisconnectDelay $(New-Timespan) `
    -AutoShutdownProfileShutdownOnIdle "LowUsage" `
    -AutoShutdownProfileIdleDelay $(New-TimeSpan -Minutes 15) `
    -AutoShutdownProfileShutdownWhenNotConnected Disabled `
    -AutoShutdownProfileNoConnectDelay $(New-TimeSpan -Minutes 15) `
    `
    -ConnectionProfileClientRdpAccess Public `
    -ConnectionProfileClientSshAccess None `
    -ConnectionProfileWebRdpAccess None `
    -ConnectionProfileWebSshAccess None `
    -SecurityProfileOpenAccess Disabled `
    `
    -ImageReferenceOffer $image.Offer `
    -ImageReferencePublisher $image.Publisher `
    -ImageReferenceSku $image.Sku `
    -ImageReferenceVersion $image.Version `
    -SkuCapacity 1 `
    -SkuName $sku.size `
    `
    -Title "Contoso Lab" `
    -Description "The Contoso lab" `
    -AdditionalCapabilityInstallGpuDriver Disabled `
    -VirtualMachineProfileCreateOption "TemplateVM" `
    -VirtualMachineProfileUseSharedPassword Enabled
```

## Clean up resources

If you're not going to continue to use this application, delete
the plan and lab with the following steps:

```powershell
$lab | Remove-AzLabServicesLab
```

## More information

As an admin, you can learn more about [Azure PowerShell module](/powershell/azure) and [Az.LabServices cmdlets](/powershell/module/az.labservices/).

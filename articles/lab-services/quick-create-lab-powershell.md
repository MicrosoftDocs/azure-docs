---
title: Azure Lab Services Quickstart - Create a lab using PowerShell
description: In this quickstart, you learn how to create an Azure Lab Services lab using PowerShell and the Az module.
author: RogerBestMSFT
ms.topic: quickstart
ms.date: 06/15/2022
ms.custom: mode-api
---

# Quickstart: Create a lab using PowerShell and the Azure module

In this quickstart, you, as the educator, create a lab using PowerShell and the Azure modules.  The lab will use the settings from a previously created lab plan.  For detailed overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

- Azure subscription.  If you don’t have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Windows PowerShell](/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7.2&preserve-view=true).
- [Azure Az PowerShell module](/powershell/azure/new-azureps-module-az). Must be version 7.2 or higher.

    ```powershell
    Install-Module 'Az'
    ```

- [Az.LabServices PowerShell module](/powershell/module/az.labservices/).

    ```powershell
    Install-Module 'Az.LabServices'
    ```

- Lab plan. To create a lab plan, see [Quickstart: Create a lab plan using PowerShell and the Azure modules](quick-create-lab-plan-powershell.md).

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure and verify an active subscription.

## Create a lab

Before we can create a lab, we need the lab plan object.  In the [previous quickstart](quick-create-lab-plan-powershell.md), we created a lab plan named `ContosoLabPlan` in a resource group named `MyResourceGroup`.

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

We're now ready to create a lab based of our lab plan with the Window 11 Pro image.  The following command will create a lab using the lab plan created above.

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
    -SkuName "Classic_Fsv2_4_8GB_128_S_SSD" `
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

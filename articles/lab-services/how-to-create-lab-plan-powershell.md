---
title: Create a lab plan using PowerShell
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab plan using PowerShell and the Azure PowerShell module.
author: RogerBestMSFT
ms.topic: how-to
ms.date: 06/15/2022
ms.custom: mode-api, devx-track-azurepowershell
---

# Create a lab plan in Azure Lab Services using PowerShell and the Azure modules

In this article, you learn how to use PowerShell and the Azure module to create a lab plan.  Lab plans are used when creating labs for Azure Lab Services.  You'll also add a role assignment so an educator can create labs based on the lab plan.  For an overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]

- [Windows PowerShell](/powershell/scripting/windows-powershell/starting-windows-powershell).
- [Azure Az PowerShell module](/powershell/azure/new-azureps-module-az). Must be version 7.2 or higher.

    ```powershell
    Install-Module 'Az'
    ```

- [Az.LabServices PowerShell module](/powershell/module/az.labservices/).

    ```powershell
    Install-Module 'Az.LabServices'
    ```

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure and verify an active subscription.

## Create a lab plan

The following steps will show you how to create a lab plan.  Any properties set in the lab plan will be used in labs created with this plan.

```powershell
New-AzResourceGroup -Name "MyResourceGroup" -Location "eastus"

$plan = New-AzLabServicesLabPlan -Name "ContosoLabPlan" `
    -ResourceGroupName "MyResourceGroup" `
    -Location "eastus" `
    -AllowedRegion @("westus","eastus")
```

## Add a user to the Lab Creator role

To create or edit up a lab in the Lab Services web portal ([https://labs.azure.com](https://labs.azure.com)), the educator must be assigned the **Lab Creator** role.  Assigning the **Lab Creator** role on the lab plan's resource group will allow an educator to use all lab plans in that resource group.

```powershell
New-AzRoleAssignment -SignInName <emailOrUserprincipalname> `
    -RoleDefinitionName "Lab Creator" `
    -ResourceGroupName "MyResourceGroup"
```

For more information about role assignments, see [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md).

## Clean up resources

If you're not going to continue to use this application, delete the lab with the following steps:

```powershell
Remove-AzRoleAssignment -SignInName <emailOrUserprincipalname> `
    -RoleDefinitionName "Lab Creator" `
    -ResourceGroupName "MyResourceGroup"
$plan | Remove-AzLabServicesLabPlan
```

## Next steps

In this article, you created a resource group and a lab plan.  As an admin, you can learn more about [Azure PowerShell module](/powershell/azure) and [Az.LabServices cmdlets](/powershell/module/az.labservices/).

> [!div class="nextstepaction"]
> [Create a lab using PowerShell and the Azure module](how-to-create-lab-powershell.md)

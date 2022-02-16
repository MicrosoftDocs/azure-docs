---
title: Azure Lab Services Quickstart - Create a lab plan using PowerShell
description: In this quickstart, you learn how to create an Azure Lab Services lab plan using PowerShell and the Az module. 
author: RogerBestMSFT
ms.author: tm-azurelabservices
ms.service: Azure Lab Services
ms.topic: quickstart
ms.date: 02/15/2022
ms.custom: template-quickstart
---

# Quickstart: Create a lab plan using PowerShell and the Azure modules

In this article you, as the admin, use PowerShell and the Azure module to create a lab plan.  Lab plans are used when creating labs for Azure Lab Services.  You'll also add a role assignment so an educator can create labs based on the lab plan.  For detailed overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- [Windows PowerShell](/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7.2).
- [Azure Az PowerShell module](/powershell/azure/install-Az-ps?view=azps-7.2.0). Must be version 7.2 or higher.

Run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure and verify an active subscription.

## Create a Lab Plan

The following steps will show you how to create a lab plan.  Any properties set in the lab plan will be used in labs created with this plan.

```powershell
$plan = New-AzLabServicesLabPlan -Name "ContosoLabPlan" `
    -ResourceGroupName "MyResourceGroup" `
    -Location "eastus" `
    -AllowedRegion @("westus","eastus")
```

## Add a user to the Lab Creator role

To create or edit up a lab in the Lab Services web portal ([https://labs.azure.com](https://labs.azure.com)), the instructor must be assigned the **Lab Creator** role.  Assigning **Lab Creator** role on the lab plan's resource group will allow an instructor to use all lab plans in that resource group.

```powershell
New-AzRoleAssignment -SignInName <emailOrUserprincipalname> `
    -RoleDefinitionName "Lab Creator" `
    -ResourceGroupName "MyResourceGroup"
```

For more information about role assignments, see [Assign Azure roles using Azure PowerShell](/azure/role-based-access-control/role-assignments-powershell).

## Clean up resources

If you're not going to continue to use this application, delete the lab with the following steps:

```powershell
Remove-AzRoleAssignment -SignInName <emailOrUserprincipalname> `
    -RoleDefinitionName "Lab Creator" `
    -ResourceGroupName "MyResourceGroup"
$plan | Remove-AzLabServicesLabPlan
```

## Next Steps

In this QuickStart, you created a resource group and a lab plan.  As an admin, you can learn more about [Azure PowerShell module](/powershell/azure) and [Az.LabServices cmdlets](/powershell/module/az.labservices/).

[!div class="nextstepaction"]
[Quickstart: Using PowerShell to manage Azure Lab Services](quick-create-lab-powershell.md)

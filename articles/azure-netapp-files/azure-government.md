---
title: Azure NetApp Files for Azure Government  | Microsoft Docs
description: Learn how to connect to Azure Government to use Azure NetApp Files and the Azure NetApp Files feature availability in Azure Government.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.custom: devx-track-azurecli, has-azure-ad-ps-ref
ms.topic: conceptual
ms.date: 11/02/2023
ms.author: anfdocs
---

# Azure NetApp Files for Azure Government

[Microsoft Azure Government](../azure-government/documentation-government-welcome.md) delivers a dedicated cloud that enables government agencies and their partners to transform mission-critical workloads to the cloud.

This article describes Azure NetApp Files feature availability in Azure Government. It also shows you how to access Azure NetApp Files within Azure Government.

## Feature availability

For Azure Government regions supported by Azure NetApp Files, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

All [Azure NetApp Files features](whats-new.md) available on Azure public cloud are also available on supported Azure Government regions, *except for the features listed in the following table*:

| Azure NetApp Files features | Azure public cloud availability |  Azure Government availability |
|:--- |:--- |:--- |
| Azure NetApp Files backup | Generally available (GA) | No |
| Azure NetApp Files customer-managed keys | Generally available (GA) | No | 
| Azure NetApp Files large volumes | Generally available (GA) | Generally available [(select regions)](large-volumes-requirements-considerations.md#supported-regions) |

## Portal access

Azure Government users can access Azure NetApp Files by pointing their browsers to **portal.azure.us**. The portal site name is **Microsoft Azure Government**. For more information, see [Connect to Azure Government using portal](../azure-government/documentation-government-get-started-connect-with-portal.md).

![Screenshot that shows the Azure Government portal highlighting portal.azure.us as the URL.](./media/azure-government/azure-government.jpg)

From the Azure Government portal, you can access Azure NetApp Files the same way you would in the Azure portal. For example, you can enter **Azure NetApp Files** in the portal's **Search resources** box, and then select **Azure NetApp Files** from the list that appears.

You can follow [Azure NetApp Files](./index.yml) documentation for details about using the service.

## Azure CLI access

You can connect to Azure Government by setting the cloud name to `AzureUSGovernment` and then proceeding to sign in as you normally would with the `az login` command. After you run the sign-in command, a browser launches, where you enter the appropriate Azure Government credentials.

```azurecli 

az cloud set --name AzureUSGovernment 

``` 

To confirm the cloud was set to `AzureUSGovernment`, run:

```azurecli 

az cloud list --output table 

``` 

This command produces a table with Azure cloud locations. The `isActive` column entry for `AzureUSGovernment` should read `true`.

For more information, see [Connect to Azure Government with Azure CLI](../azure-government/documentation-government-get-started-connect-with-cli.md).

## REST API access

Endpoints for Azure Government are different from commercial Azure endpoints. For a list of different endpoints, see Azure Government's [Guidance for developers](../azure-government/compare-azure-government-global-azure.md#guidance-for-developers).

## PowerShell access

When you connect to Azure Government through PowerShell, you must specify an environmental parameter to ensure that you connect to the correct endpoints. From there, you can proceed to use Azure NetApp Files as you normally would with PowerShell.

[!INCLUDE [Azure AD PowerShell deprecation note](~/reusable-content/msgraph-powershell/includes/aad-powershell-deprecation-note.md)]

| Connection type | Command | 
| --- | --- | 
| [Azure](/powershell/module/az.accounts/Connect-AzAccount) commands |`Connect-AzAccount -EnvironmentName AzureUSGovernment` | 
| [Microsoft Entra ID](/powershell/module/azuread/connect-azuread) commands |`Connect-AzureAD -AzureEnvironmentName AzureUSGovernment` | 
| [Azure (Classic deployment model)](/powershell/module/servicemanagement/azure/add-azureaccount) commands |`Add-AzureAccount -Environment AzureUSGovernment` | 
| [Microsoft Entra ID (Classic deployment model)](/previous-versions/azure/jj151815(v=azure.100)) commands |`Connect-MsolService -AzureEnvironment UsGovernment` | 

For more information, see [Connect to Azure Government with PowerShell](../azure-government/documentation-government-get-started-connect-with-ps.md).

## Next steps

* [What is Azure Government?](../azure-government/documentation-government-welcome.md)
* [What's new in Azure NetApp Files](whats-new.md)
* [Compare Azure Government and global Azure](../azure-government/compare-azure-government-global-azure.md)
* [Azure NetApp Files REST API](azure-netapp-files-develop-with-rest-api.md)
* [Azure NetApp Files REST API using PowerShell](develop-rest-api-powershell.md)

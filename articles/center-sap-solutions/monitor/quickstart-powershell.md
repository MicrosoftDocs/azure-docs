---
title: Deploy Azure Monitor for SAP solutions with Azure PowerShell (preview)
description: Deploy Azure Monitor for SAP solutions with Azure PowerShell
author: sameeksha91
ms.author: sakhare
ms.topic: quickstart
ms.service: azure-center-sap-solutions
ms.date: 10/27/2022
ms.devlang: azurepowershell
ms.custom: devx-track-azurepowershell, mode-api
# Customer intent: As a developer, I want to deploy Azure Monitor for SAP solutions with PowerShell so that I can create resources with PowerShell.
---

# Quickstart: deploy Azure Monitor for SAP solutions with PowerShell (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

Get started with Azure Monitor for SAP solutions by using the 
[Az.HanaOnAzure](/powershell/module/az.hanaonazure/#sap-hana-on-azure) PowerShell module to create Azure Monitor for SAP solutions resources. You'll create a resource group, set up monitoring, and create a provider instance.

This content only applies to the Azure Monitor for SAP solutions (classic) version of the service.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

- If you choose to use PowerShell locally, this article requires that you install the Az PowerShell module. You'll also need to connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-az-ps). Alternately, you can use [Azure Cloud Shell](../../cloud-shell/overview.md).

- While the **Az.HanaOnAzure** PowerShell module is in preview, you must install it separately using the `Install-Module` cmdlet. Once this PowerShell module becomes generally available, it becomes part of future Az PowerShell module releases and available natively from within Azure Cloud Shell.

    ```azurepowershell-interactive
    Install-Module -Name Az.HanaOnAzure
    ```

- If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources should be billed. Select a specific subscription using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
    ```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as a group.

The following example creates a resource group with the specified name and in the specified location.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location westus2
```

## SAP monitor

To create an SAP monitor, use the [New-AzSapMonitor](/powershell/module/az.hanaonazure/new-azsapmonitor) cmdlet. The following example creates an SAP monitor for the specified subscription, resource group, and resource name.

```azurepowershell-interactive
$Workspace = New-AzOperationalInsightsWorkspace -ResourceGroupName myResourceGroup -Name sapmonitor-test -Location westus2 -Sku Standard

$WorkspaceKey = Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName myResourceGroup -Name sapmonitor-test

$SapMonitorParams = @{
  Name = 'ps-sapmonitor-t01'
  ResourceGroupName = 'myResourceGroup'
  Location = 'westus2'
  EnableCustomerAnalytic = $true
  MonitorSubnet = '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/vnet-sap/subnets/mysubnet'
  LogAnalyticsWorkspaceSharedKey = $WorkspaceKey.PrimarySharedKey
  LogAnalyticsWorkspaceId = $Workspace.CustomerId
  LogAnalyticsWorkspaceResourceId = $Workspace.ResourceId
}
New-AzSapMonitor @SapMonitorParams
```

To retrieve the properties of an SAP monitor, use the [Get-AzSapMonitor](/powershell/module/az.hanaonazure/get-azsapmonitor) cmdlet. The following example gets properties of an SAP monitor for the specified subscription, resource group, and resource name.

```azurepowershell-interactive
Get-AzSapMonitor -ResourceGroupName myResourceGroup -Name ps-spamonitor-t01
```

## Provider instance

To create a provider instance, use the [New-AzSapMonitorProviderInstance](/powershell/module/az.hanaonazure/new-azsapmonitorproviderinstance) cmdlet. The following example creates a provider instance for the specified subscription, resource group, and resource name.

```azurepowershell-interactive
$SapProviderParams = @{
  ResourceGroupName = 'myResourceGroup'
  Name = 'ps-sapmonitorins-t01'
  SapMonitorName = 'yemingmonitor'
  ProviderType = 'SapHana'
  HanaHostname = 'hdb1-0'
  HanaDatabaseName = 'SYSTEMDB'
  HanaDatabaseSqlPort = '30015'
  HanaDatabaseUsername = 'SYSTEM'
  HanaDatabasePassword = (ConvertTo-SecureString 'Manager1' -AsPlainText -Force)
}
New-AzSapMonitorProviderInstance @SapProviderParams
```

To retrieve properties of a provider instance, use the [Get-AzSapMonitorProviderInstance](/powershell/module/az.hanaonazure/get-azsapmonitorproviderinstance) cmdlet. The following example gets properties of: 
- A provider instance for the specified subscription
- The resource group
- The SapMonitor name
- The resource name

```azurepowershell-interactive
Get-AzSapMonitorProviderInstance -ResourceGroupName myResourceGroup -SapMonitorName ps-spamonitor-t01
```

## Clean up resources

If the resources created in this article aren't needed, you can delete them by running the following examples.

### Delete the provider instance

To remove a provider instance, use the
[Remove-AzSapMonitorProviderInstance](/powershell/module/az.hanaonazure/remove-azsapmonitorproviderinstance) cmdlet. The following example deletes a provider instance for the specified subscription, resource group, SapMonitor name, and resource name.

```azurepowershell-interactive
Remove-AzSapMonitorProviderInstance -ResourceGroupName myResourceGroup -SapMonitorName ps-spamonitor-t01 -Name ps-sapmonitorins-t02
```

### Delete the SAP monitor

To remove an SAP monitor, use the [Remove-AzSapMonitor](/powershell/module/az.hanaonazure/remove-azsapmonitor) cmdlet. The following example deletes an SAP monitor for the specified subscription, resource group, and monitor name.

```azurepowershell
Remove-AzSapMonitor -ResourceGroupName myResourceGroup -Name ps-sapmonitor-t02
```

### Delete the resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

## Next steps

Learn more about Azure Monitor for SAP solutions.

> [!div class="nextstepaction"]
> [Monitor SAP on Azure](about-azure-monitor-sap-solutions.md)

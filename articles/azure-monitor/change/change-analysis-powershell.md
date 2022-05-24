---
title: Azure PowerShell for Change Analysis in Azure Monitor
description: Learn how to use Azure PowerShell in Azure Monitor's Change Analysis to determine changes to resources in your subscription
ms.topic: conceptual
author: hhunter-ms
ms.author: hannahhunter
ms.contributor: cawa
ms.devlang: azurepowershell
ms.date: 04/11/2022
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell
---

# Azure PowerShell for Change Analysis in Azure Monitor (preview)

This article describes how you can use Change Analysis with the
[Az.ChangeAnalysis PowerShell module](/powershell/module/az.changeanalysis/) to determine changes
made to resources in your Azure subscription.

> [!CAUTION]
> Change analysis  is currently in public preview. This preview version is provided without a
> service level agreement. It's not recommended for production workloads. Some features might not be
> supported or might have constrained capabilities. For more information, see
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [azure-powershell-requirements-no-header.md](../../../includes/azure-powershell-requirements-no-header.md)]

> [!IMPORTANT]
> While the **Az.ChangeAnalysis** PowerShell module is in preview, you must install it separately using
> the `Install-Module` cmdlet.

```azurepowershell-interactive
Install-Module -Name Az.ChangeAnalysis -Scope CurrentUser -Repository PSGallery
```

If you have multiple Azure subscriptions, choose the appropriate subscription. Select a specific
subscription using the [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## View Azure subscription changes

To view changes made to all resources in your Azure subscription, you use the `Get-AzChangeAnalysis`
command. You specify the time range for events in UTC date format using the `StartTime` and
`EndTime` parameters.

```azurepowershell-interactive
$startDate = Get-Date -Date '2022-04-07T12:09:03.141Z' -AsUTC
$endDate = Get-Date -Date '2022-04-10T12:09:03.141Z' -AsUTC
Get-AzChangeAnalysis -StartTime $startDate -EndTime $endDate
```

## View Azure resource group changes

To view changes made to all resources in a resource group, you use the `Get-AzChangeAnalysis`
command and specify the `ResourceGroupName` parameter. The following example returns a list of
changes made within the last 12 hours. Specify `StartTime` and `EndTime` in UTC date formats.

```azurepowershell-interactive
$startDate = (Get-Date -AsUTC).AddHours(-12)
$endDate = Get-Date -AsUTC
Get-AzChangeAnalysis -ResourceGroupName <myResourceGroup> -StartTime $startDate -EndTime $endDate
```

## View Azure resource changes

To view changes made to a resource, you use the `Get-AzChangeAnalysis` command and specify the
`ResourceId` parameter. The following example uses PowerShell splatting to return a list of the
changes made within the last day. Specify `StartTime` and `EndTime` in UTC date formats.

```azurepowershell-interactive
$Params = @{
    StartTime = (Get-Date -AsUTC).AddDays(-1)
    EndTime = Get-Date -AsUTC
    ResourceId = '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/<myResourceGroup>/providers/Microsoft.Network/networkInterfaces/<myNetworkInterface>'
}
Get-AzChangeAnalysis @Params
```

> [!NOTE]
> A resource not found message is returned if the specified resource has been removed or deleted.
> Use Change Analysis at the resource group or subscription level to determine changes for resources
> that have been removed or deleted.

## View detailed information

You can view more properties for any of the commands shown in this article by piping the results to
`Select-Object -Property *`.

```azurepowershell-interactive
$startDate = (Get-Date -AsUTC).AddHours(-12)
$endDate = Get-Date -AsUTC
Get-AzChangeAnalysis -ResourceGroupName <myResourceGroup> -StartTime $startDate -EndTime $endDate |
  Select-Object -Property *
```

The `PropertyChange` property is a complex object that has addition nested properties. Pipe the
`PropertyChange` property to `Select-Object -Property *` to see the nested properties.

```azurepowershell-interactive
$startDate = (Get-Date -AsUTC).AddHours(-12)
$endDate = Get-Date -AsUTC
(Get-AzChangeAnalysis -ResourceGroupName <myResourceGroup> -StartTime $startDate -EndTime $endDate |
  Select-Object -First 1).PropertyChange | Select-object -Property *
```

## Next steps

- Learn how to use [Get-AzChangeAnalysis](/powershell/module/az.changeanalysis/get-azchangeanalysis/)
- Learn how to [use Change Analysis in Azure Monitor](change-analysis.md)
- Learn about [visualizations in Change Analysis](change-analysis-visualizations.md)
- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)

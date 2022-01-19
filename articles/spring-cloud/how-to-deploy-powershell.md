---
title: How to deploy Azure Spring Cloud with Azure PowerShell
description: How to deploy Azure Spring Cloud with Azure PowerShell
author: karlerickson
ms.author: karler
ms.topic: conceptual
ms.service: spring-cloud
ms.devlang: azurepowershell
ms.date: 11/16/2020
ms.custom: devx-track-azurepowershell
---

# Deploy Azure Spring Cloud with Azure PowerShell

This article describes how you can create an instance of Azure Spring Cloud using the
[Az.SpringCloud](/powershell/module/Az.SpringCloud) PowerShell module.

## Requirements

* If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

   > [!IMPORTANT]
   > While the **Az.SpringCloud** PowerShell module is in preview, you must install it separately using
   > the `Install-Module` cmdlet. After this PowerShell module becomes generally available, it will be
   > part of future Az PowerShell module releases and available by default from within Azure Cloud
   > Shell.

   ```azurepowershell-interactive
   Install-Module -Name Az.SpringCloud
   ```

* If you have multiple Azure subscriptions, choose the appropriate subscription in which the
  resources should be billed. Select a specific subscription using the
  [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

   ```azurepowershell-interactive
   Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
   ```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/management/overview.md)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as
a group.

The following example creates a resource group with the specified name and in the specified location.

```azurepowershell-interactive
New-AzResourceGroup -Name <resource group name> -Location eastus
```

## Provision a new instance of Azure Spring Cloud

To create a new instance of Azure Spring Cloud, you use the
[New-AzSpringCloud](/powershell/module/az.springcloud/new-azspringcloud) cmdlet. The following
example creates an Azure Spring Cloud service with the specified name in the previously created
resource group.

```azurepowershell-interactive
New-AzSpringCloud -ResourceGroupName <resource group name> -name <service instance name> -Location eastus
```

## Create a new Azure Spring Cloud app

To create a new App, you use the
[New-AzSpringCloudApp](/powershell/module/az.springcloud/new-azspringcloudapp) cmdlet. The following
example creates an Azure Spring Cloud app named `gateway`.

```azurepowershell-interactive
New-AzSpringCloudApp -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway
```

## Create a new Azure Spring Cloud deployment

To create a new Deployment, you use the
[New-AzSpringCloudAppDeployment](/powershell/module/az.springcloud/new-azspringcloudappdeployment)
cmdlet. The following example creates an Azure Spring Cloud deployment named `default` for the
`gateway` app.

```azurepowershell-interactive
New-AzSpringCloudAppDeployment -ResourceGroupName <resource group name> -Name <service instance name> -AppName gateway -DeploymentName default
```

## Get an Azure Spring Cloud service

To get an Azure Spring Cloud service and its properties, you use the
[Get-AzSpringCloud](/powershell/module/az.springcloud/get-azspringcloud) cmdlet. The following
example retrieves information about the specified Azure Spring Cloud service.

```azurepowershell-interactive
Get-AzSpringCloud -ResourceGroupName <resource group name> -ServiceName <service instance name>
```

## Get an Azure Spring Cloud app

To get an Azure Spring Cloud app and its properties, you use the
[Get-AzSpringCloudApp](/powershell/module/az.springcloud/get-azspringcloudapp) cmdlet. The following
example retrieves information about the `gateway` Spring Cloud app.

```azurepowershell-interactive
Get-AzSpringCloudApp -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway
```

## Get an Azure Spring Cloud deployment

To get an Azure Spring Cloud deployment and its properties, you use the
[Get-AzSpringCloudAppDeployment](/powershell/module/az.springcloud/get-azspringcloudappdeployment)
cmdlet. The following example retrieves information about the `default` Spring Cloud deployment.

```azurepowershell-interactive
Get-AzSpringCloudAppDeployment -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway -DeploymentName default
```

## Clean up resources

If the resources created in this article aren't needed, you can delete them by running the following
examples.

### Delete an Azure Spring Cloud deployment

To remove an Azure Spring Cloud deployment, you use the
[Remove-AzSpringCloudAppDeployment](/powershell/module/az.springcloud/remove-azspringcloudappdeployment)
cmdlet. The following example deletes an Azure Spring Cloud app deployment named `default` for the
specified service and app.

```azurepowershell-interactive
Remove-AzSpringCloudAppDeployment -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway -DeploymentName default
```

### Delete an Azure Spring Cloud app

To remove a Spring Cloud app, you use the
[Remove-AzSpringCloudApp](/powershell/module/Az.SpringCloud/remove-azspringcloudapp) cmdlet. The
following example deletes the `gateway` app in the specified service and resource group.

```azurepowershell
Remove-AzSpringCloudApp -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway
```

### Delete an Azure Spring Cloud service

To remove an Azure Spring Cloud service, you use the
[Remove-AzSpringCloud](/powershell/module/Az.SpringCloud/remove-azspringcloud) cmdlet. The following
example deletes the specified Azure Spring Cloud service.

```azurepowershell
Remove-AzSpringCloud -ResourceGroupName <resource group name> -ServiceName <service instance name>
```

### Delete the resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name <resource group name>
```

## Next steps

[Azure Spring Cloud developer resources](./resources.md).

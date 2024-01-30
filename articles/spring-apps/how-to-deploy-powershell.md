---
title: Create and deploy applications in Azure Spring Apps by using PowerShell
description: How to create and deploy applications in Azure Spring Apps by using PowerShell
author: KarlErickson
ms.author: karler
ms.topic: conceptual
ms.service: spring-apps
ms.devlang: azurepowershell
ms.date: 2/15/2022
ms.custom: devx-track-azurepowershell, event-tier1-build-2022, devx-track-java
---

# Create and deploy applications by using PowerShell

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how you can create an instance of Azure Spring Apps by using the [Az.SpringCloud](/powershell/module/Az.SpringCloud) PowerShell module.

## Requirements

The requirements for completing the steps in this article depend on your Azure subscription:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

   > [!IMPORTANT]
   > While the **Az.SpringCloud** PowerShell module is in preview, you must install it by using
   > the `Install-Module` cmdlet. See the following command. After this PowerShell module becomes generally available, it will be part of future Az PowerShell releases and available by default from within Azure Cloud Shell.

   ```azurepowershell-interactive
   Install-Module -Name Az.SpringCloud
   ```

* If you have multiple Azure subscriptions, choose the appropriate subscription in which the
  resources should be billed. Select a specific subscription by using the [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet:

   ```azurepowershell-interactive
   Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
   ```

## Create a resource group

A resource group is a logical container in which Azure resources are deployed and managed as
a group. Create an [Azure resource group](../azure-resource-manager/management/overview.md)
by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. The following example creates a resource group with a specified name and location.

```azurepowershell-interactive
New-AzResourceGroup -Name <resource group name> -Location eastus
```

## Provision a new instance

To create a new instance of Azure Spring Apps, you use the
[New-AzSpringCloud](/powershell/module/az.springcloud/new-azspringcloud) cmdlet. The following
example creates an Azure Spring Apps service, with the name that you specified in the resource group you created previously.

```azurepowershell-interactive
New-AzSpringCloud -ResourceGroupName <resource group name> -name <service instance name> -Location eastus
```

## Create a new application

To create a new app, you use the
[New-AzSpringCloudApp](/powershell/module/az.springcloud/new-azspringcloudapp) cmdlet. The following example creates an app in Azure Spring Apps named `gateway`.

```azurepowershell-interactive
New-AzSpringCloudApp -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway
```

## Create a new app deployment

To create a new app Deployment, you use the
[New-AzSpringCloudAppDeployment](/powershell/module/az.springcloud/new-azspringcloudappdeployment)
cmdlet. The following example creates an app deployment in Azure Spring Apps named `default` with an empty welcome application, for the `gateway` app.

```azurepowershell-interactive
$welcomeApplication = New-AzSpringCloudAppDeploymentJarUploadedObject -RuntimeVersion "Java_11"
New-AzSpringCloudAppDeployment -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway -Name default -Source $welcomeApplication
```

## Get a service and its properties

To get an Azure Spring Apps service and its properties, you use the
[Get-AzSpringCloud](/powershell/module/az.springcloud/get-azspringcloud) cmdlet. The following
example retrieves information about the specified Azure Spring Apps service.

```azurepowershell-interactive
Get-AzSpringCloud -ResourceGroupName <resource group name> -ServiceName <service instance name>
```

## Get an application

To get an app and its properties in Azure Spring Apps, you use the
[Get-AzSpringCloudApp](/powershell/module/az.springcloud/get-azspringcloudapp) cmdlet. The following example retrieves information about the app `gateway`.

```azurepowershell-interactive
Get-AzSpringCloudApp -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway
```

## Get an app deployment

To get an app deployment and its properties in Azure Spring Apps, you use the
[Get-AzSpringCloudAppDeployment](/powershell/module/az.springcloud/get-azspringcloudappdeployment) cmdlet. The following example retrieves information about the `default` Azure Spring Apps deployment.

```azurepowershell-interactive
Get-AzSpringCloudAppDeployment -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway -DeploymentName default
```

## Clean up resources

If the resources created in this article aren't needed, you can delete them by running the examples shown in the following sections.

### Delete an app deployment

To remove an app deployment in Azure Spring Apps, you use the
[Remove-AzSpringCloudAppDeployment](/powershell/module/az.springcloud/remove-azspringcloudappdeployment) cmdlet. The following example deletes an app deployed in Azure Spring Apps named `default`, for the specified service and app.

```azurepowershell-interactive
Remove-AzSpringCloudAppDeployment -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway -DeploymentName default
```

### Delete an app

To remove an app in Azure Spring Apps, you use the
[Remove-AzSpringCloudApp](/powershell/module/Az.SpringCloud/remove-azspringcloudapp) cmdlet. The following example deletes the `gateway` app in the specified service and resource group.

```azurepowershell
Remove-AzSpringCloudApp -ResourceGroupName <resource group name> -ServiceName <service instance name> -AppName gateway
```

### Delete a service

To remove an Azure Spring Apps service, you use the
[Remove-AzSpringCloud](/powershell/module/Az.SpringCloud/remove-azspringcloud) cmdlet. The following example deletes the specified Azure Spring Apps service.

```azurepowershell
Remove-AzSpringCloud -ResourceGroupName <resource group name> -ServiceName <service instance name>
```

### Delete the resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it. If resources outside the scope of this article exist in the specified resource group, they will also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name <resource group name>
```

## Next steps

[Azure Spring Apps developer resources](./resources.md)

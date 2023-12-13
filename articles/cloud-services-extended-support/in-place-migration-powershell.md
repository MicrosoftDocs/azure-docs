---
title: Migrate to Azure Cloud Services (extended support) using PowerShell 
description: How to migrate from Azure Cloud Services (classic) to Azure Cloud Services (extended support) using PowerShell
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
ms.reviwer: mimckitt
ms.topic: how-to
ms.date: 02/06/2020
author: hirenshah1
ms.author: hirshah
ms.custom: devx-track-azurepowershell

---

# Migrate to Azure Cloud Services (extended support) using PowerShell

These steps show you how to use Azure PowerShell commands to migrate from [Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md) to [Cloud Services (extended support)](overview.md).

## 1) Plan for migration
Planning is the most important step for a successful migration experience. Review the [Cloud Services (extended support) overview](overview.md) and [Planning for migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-plan.md) prior to beginning any migration steps. 

## 2) Install the latest version of PowerShell
There are two main options to install Azure PowerShell: [PowerShell Gallery](https://www.powershellgallery.com/profiles/azure-sdk/) or [Web Platform Installer (WebPI)](https://aka.ms/webpi-azps). WebPI receives monthly updates. PowerShell Gallery receives updates on a continuous basis. This article is based on Azure PowerShell version 2.1.0.

For installation instructions, see [How to install and configure Azure PowerShell](/powershell/azure/servicemanagement/install-azure-ps?preserve-view=true&view=azuresmps-4.0.0).

## 3) Ensure Admin permissions
To perform this migration, you must be added as a coadministrator for the subscription in the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the **Hub** menu, select **Subscription**. If you don't see it, select **All services**.
3. Find the appropriate subscription entry, and then look at the **MY ROLE** field. For a coadministrator, the value should be *Account admin*.

If you're not able to add a co-administrator, contact a service administrator or co-administrator for the subscription to get yourself added.

## 4) Register the classic provider and CloudService feature
First, start a PowerShell prompt. For migration, set up your environment for both classic and Resource Manager.

Sign in to your account for the Resource Manager model.

```powershell
Connect-AzAccount
```

Get the available subscriptions by using the following command:

```powershell
Get-AzSubscription | Sort Name | Select Name
```

Set your Azure subscription for the current session. This example sets the default subscription name to **My Azure Subscription**. Replace the example subscription name with your own.

```powershell
Select-AzSubscription –SubscriptionName "My Azure Subscription"
```

Register with the migration resource provider by using the following command:

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
```
> [!NOTE]
> Registration is a one-time step, but you must do it once before you attempt migration. Without registering, you see the following error message:
>
> *BadRequest : Subscription is not registered for migration.*

Register the CloudServices feature for your subscription. The registrations may take several minutes to complete. 

```powershell
Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

Wait five minutes for the registration to finish. 

Check the status of the classic provider approval by using the following command:

```powershell
Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
```

Check the status of registration using the following:  
```powershell
Get-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

Make sure that RegistrationState is `Registered` for both before you proceed.

Before switching to the classic deployment model, make sure that you have enough Azure Resource Manager vCPU quota in the Azure region of your current deployment or virtual network. You can use the following PowerShell command to check the current number of vCPUs you have in Azure Resource Manager. To learn more about vCPU quotas, see [Limits and the Azure Resource Manager](../azure-resource-manager/management/azure-subscription-service-limits.md#managing-limits).

This example checks the availability in the **West US** region. Replace the example region name with your own.

```powershell
Get-AzVMUsage -Location "West US"
```

Now, sign in to your account for the classic deployment model.

```powershell
Add-AzureAccount
```

Get the available subscriptions by using the following command:

```powershell
Get-AzureSubscription | Sort SubscriptionName | Select SubscriptionName
```

Set your Azure subscription for the current session. This example sets the default subscription to **My Azure Subscription**. Replace the example subscription name with your own.

```powershell
Select-AzureSubscription –SubscriptionName "My Azure Subscription"
```


## 5) Migrate your Cloud Services 
Before starting the migration, understand how the [migration steps](./in-place-migration-overview.md#migration-steps) works and what each step does. 

* [Migrate a Cloud Service not in a virtual network](#51-option-1---migrate-a-cloud-service-not-in-a-virtual-network)
* [Migrate a Cloud Service in a virtual network](#51-option-2---migrate-a-cloud-service-in-a-virtual-network)

> [!NOTE]
> All the operations described here are idempotent. If you have a problem other than an unsupported feature or a configuration error, we recommend that you retry the prepare, abort, or commit operation. The platform then tries the action again.


### 5.1) Option 1 - Migrate a Cloud Service not in a virtual network
Get the list of cloud services by using the following command. Then pick the cloud service that you want to migrate.

```powershell
Get-AzureService | ft Servicename
```

Get the deployment name for the Cloud Service. In this example, the service name is **My Service**. Replace the example service name with your own service name.

```powershell
$serviceName = "My Service"
$deployment = Get-AzureDeployment -ServiceName $serviceName
$deploymentName = $deployment.DeploymentName
```

First, validate that you can migrate the Cloud Service by using the following commands. The command displays any errors that block migration. 

```powershell
$validate = Move-AzureService -Validate -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork
$validate.ValidationMessages
 ```

If validation is successful or has just warnings, you can move on to the Prepare step. 

```powershell
Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork
```

Check the configuration for the prepared Cloud Service (extended support) by using either Azure PowerShell or the Azure portal. If you're not ready for migration and you want to go back to the old state, abort the migration.
```powershell
Move-AzureService -Abort -ServiceName $serviceName -DeploymentName $deploymentName
```
If you're ready to complete the migration, commit the migration

```powershell
Move-AzureService -Commit -ServiceName $serviceName -DeploymentName $deploymentName
```

### 5.1) Option 2 - Migrate a Cloud Service in a virtual network

To migrate a Cloud Service in a virtual network, you migrate the virtual network. The Cloud Service automatically migrates with the virtual network.

> [!NOTE]
> The virtual network name might be different from what is shown in the new portal. The new Azure portal displays the name as `[vnet-name]`, but the actual virtual network name is of type `Group [resource-group-name] [vnet-name]`. Before you start the migration, look up the actual virtual network name by using the command `Get-AzureVnetSite | Select -Property Name` or view it in the old Azure portal. 

This example sets the virtual network name to **myVnet**. Replace the example virtual network name with your own.

```powershell
$vnetName = "myVnet"
```

First, validate that you can migrate the virtual network by using the following command:

```powershell
Move-AzureVirtualNetwork -Validate -VirtualNetworkName $vnetName
```

The following command displays any warnings and errors that block migration. If validation is successful, you can proceed with the following Prepare step:

```powershell
Move-AzureVirtualNetwork -Prepare -VirtualNetworkName $vnetName
```

Check the configuration for the prepared Cloud Service (extended support) by using either Azure PowerShell or the Azure portal. If you're not ready for migration and you want to go back to the old state, use the following command:

```powershell
Move-AzureVirtualNetwork -Abort -VirtualNetworkName $vnetName
```

If the prepared configuration looks good, you can move forward and commit the resources by using the following command:

```powershell
Move-AzureVirtualNetwork -Commit -VirtualNetworkName $vnetName
```


## Next steps

Review the [Post migration changes](post-migration-changes.md) section to see changes in deployment files, automation and other attributes of your new Cloud Services (extended support) deployment.

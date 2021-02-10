---
title: Migrate to Cloud Services (extended support) using PowerShell 
description: How to migrate from Cloud Services (classic) to Cloud Services (extended support) using PowerShell
author: tanmaygore
ms.service: cloud-services-extended-support
ms.reviwer: mimckitt
ms.topic: how-to
ms.date: 02/06/2020
ms.author: tagore 

---

# Migrate to Cloud Services (extended support) using PowerShell

These steps show you how to use Azure PowerShell commands to migrate infrastructure as a service (IaaS) resources from the classic deployment model to the Azure Resource Manager deployment model.


* For background on supported migration scenarios, see [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-overview.md).
* For detailed guidance and a migration walkthrough, see [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](migration-classic-resource-manager-deep-dive.md).
* [Review the most common migration errors](migration-classic-resource-manager-errors.md).

<br>
Here's a flowchart to identify the order in which steps need to be executed during a migration process. 

## Step 1: Plan for migration
Here are a few best practices that we recommend as you evaluate whether to migrate IaaS resources from classic to Resource Manager:

* Read through the [supported and unsupported features and configurations](migration-classic-resource-manager-overview.md). If you have virtual machines that use unsupported configurations or features, wait for the configuration or feature support to be announced. Alternatively, if it suits your needs, remove that feature or move out of that configuration to enable migration.
* If you have automated scripts that deploy your infrastructure and applications today, try to create a similar test setup by using those scripts for migration. Alternatively, you can set up sample environments by using the Azure portal.

> [!IMPORTANT]
> Application gateways aren't currently supported for migration from classic to Resource Manager. To migrate a virtual network with an application gateway, remove the gateway before you run a Prepare operation to move the network. After you complete the migration, reconnect the gateway in Azure Resource Manager.
>
> Azure ExpressRoute gateways that connect to ExpressRoute circuits in another subscription can't be migrated automatically. In such cases, remove the ExpressRoute gateway, migrate the virtual network, and re-create the gateway. For more information, see [Migrate ExpressRoute circuits and associated virtual networks from the classic to the Resource Manager deployment model](../expressroute/expressroute-migration-classic-resource-manager.md).

## Step 2: Install the latest version of PowerShell
There are two main options to install Azure PowerShell: [PowerShell Gallery](https://www.powershellgallery.com/profiles/azure-sdk/) or [Web Platform Installer (WebPI)](https://aka.ms/webpi-azps). WebPI receives monthly updates. PowerShell Gallery receives updates on a continuous basis. This article is based on Azure PowerShell version 2.1.0.

For installation instructions, see [How to install and configure Azure PowerShell](/powershell/azure/).

## Step 3: Ensure that you're an administrator for the subscription
To perform this migration, you must be added as a coadministrator for the subscription in the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the **Hub** menu, select **Subscription**. If you don't see it, select **All services**.
3. Find the appropriate subscription entry, and then look at the **MY ROLE** field. For a coadministrator, the value should be _Account admin_.

If you're not able to add a co-administrator, contact a service administrator or co-administrator for the subscription to get yourself added.

## Step 4: Set your subscription, and sign up for migration
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

> [!NOTE]
> Registration is a one-time step, but you must do it once before you attempt migration. Without registering, you see the following error message:
>
> *BadRequest : Subscription is not registered for migration.*

Register with the migration resource provider by using the following command:

```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
```

Wait five minutes for the registration to finish. Check the status of the approval by using the following command:

```powershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
```

Make sure that RegistrationState is `Registered` before you proceed.

Before switching to the classic deployment model, make sure that you have enough Azure Resource Manager virtual machine vCPUs in the Azure region of your current deployment or virtual network. You can use the following PowerShell command to check the current number of vCPUs you have in Azure Resource Manager. To learn more about vCPU quotas, see [Limits and the Azure Resource Manager](../azure-resource-manager/management/azure-subscription-service-limits.md#managing-limits).

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


## Step 5: Run commands to migrate your IaaS resources
* [Migrate VMs in a cloud service (not in a virtual network)](#step-51-option-1---migrate-virtual-machines-in-a-cloud-service-not-in-a-virtual-network)
* [Migrate VMs in a virtual network](#step-51-option-2---migrate-virtual-machines-in-a-virtual-network)
* [Migrate a storage account](#step-52-migrate-a-storage-account)

> [!NOTE]
> All the operations described here are idempotent. If you have a problem other than an unsupported feature or a configuration error, we recommend that you retry the prepare, abort, or commit operation. The platform then tries the action again.


### Step 5.1: Option 1 - Migrate virtual machines in a cloud service (not in a virtual network)
Get the list of cloud services by using the following command. Then pick the cloud service that you want to migrate. If the VMs in the cloud service are in a virtual network or if they have web or worker roles, the command returns an error message.

```powershell
    Get-AzureService | ft Servicename
```

Get the deployment name for the cloud service. In this example, the service name is **My Service**. Replace the example service name with your own service name.

```powershell
    $serviceName = "My Service"
    $deployment = Get-AzureDeployment -ServiceName $serviceName
    $deploymentName = $deployment.DeploymentName
```

Prepare the virtual machines in the cloud service for migration. You have two options to choose from.

* **Option 1: Migrate the VMs to a platform-created virtual network.**

    First, validate that you can migrate the cloud service by using the following commands:

    ```powershell
    $validate = Move-AzureService -Validate -ServiceName $serviceName `
        -DeploymentName $deploymentName -CreateNewVirtualNetwork
    $validate.ValidationMessages
    ```

    The following command displays any warnings and errors that block migration. If validation is successful, you can move on to the Prepare step.

    ```powershell
    Move-AzureService -Prepare -ServiceName $serviceName `
        -DeploymentName $deploymentName -CreateNewVirtualNetwork
    ```

### Step 5.1: Option 2 - Migrate virtual machines in a virtual network

To migrate virtual machines in a virtual network, you migrate the virtual network. The virtual machines automatically migrate with the virtual network. Pick the virtual network that you want to migrate.
> [!NOTE]
> [Migrate a single virtual machine](./windows/create-vm-specialized-portal.md) created using the classic deployment model by creating a new Resource Manager virtual machine with Managed Disks by using the VHD (OS and data) files of the virtual machine.
<br>

> [!NOTE]
> The virtual network name might be different from what is shown in the new portal. The new Azure portal displays the name as `[vnet-name]`, but the actual virtual network name is of type `Group [resource-group-name] [vnet-name]`. Before you start the migration, look up the actual virtual network name by using the command `Get-AzureVnetSite | Select -Property Name` or view it in the old Azure portal. 

This example sets the virtual network name to **myVnet**. Replace the example virtual network name with your own.

```powershell
    $vnetName = "myVnet"
```

> [!NOTE]
> If the virtual network contains web or worker roles, or VMs with unsupported configurations, you get a validation error message.

First, validate that you can migrate the virtual network by using the following command:

```powershell
    Move-AzureVirtualNetwork -Validate -VirtualNetworkName $vnetName
```

The following command displays any warnings and errors that block migration. If validation is successful, you can proceed with the following Prepare step:

```powershell
    Move-AzureVirtualNetwork -Prepare -VirtualNetworkName $vnetName
```

Check the configuration for the prepared virtual machines by using either Azure PowerShell or the Azure portal. If you're not ready for migration and you want to go back to the old state, use the following command:

```powershell
    Move-AzureVirtualNetwork -Abort -VirtualNetworkName $vnetName
```

If the prepared configuration looks good, you can move forward and commit the resources by using the following command:

```powershell
    Move-AzureVirtualNetwork -Commit -VirtualNetworkName $vnetName
```


## Next steps
* [Overview of platform-supported migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-overview.md)
* [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](migration-classic-resource-manager-deep-dive.md)
* [Planning for migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-plan.md)
* [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-cli.md)
* [Community tools for assisting with migration of IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-community-tools.md)
* [Review most common migration errors](migration-classic-resource-manager-errors.md)
* [Review the most frequently asked questions about migrating IaaS resources from classic to Azure Resource Manager](migration-classic-resource-manager-faq.md)

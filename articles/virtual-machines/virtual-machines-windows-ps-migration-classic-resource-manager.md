<properties
	pageTitle="Migrate IaaS resources from classic to Azure Resource Manager by using Azure PowerShell | Microsoft Azure"
	description="This article walks through the platform-supported migration of resources from classic to Azure Resource Manager by using PowerShell scripts"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/04/2016"
	ms.author="danlep"/>

# Migrate IaaS resources from classic to Azure Resource Manager by using Azure PowerShell

These steps show you how to use Azure PowerShell commands to migrate infrastructure as a service (IaaS) resources from the classic deployment model to the Azure Resource Manager deployment model. These steps follow a fill-in-the-blanks approach for migrating your custom environment. Take the commands and substitute your own values for the variables (the lines that begin with "$").

## Step 1: Prepare for migration

Here are a few best practices that we recommend as you evaluate migrating IaaS resources from classic to Resource Manager:

- Read through the [list of unsupported configurations or features](virtual-machines-windows-migration-classic-resource-manager.md). If you have virtual machines that use unsupported configurations or features, we recommend that you wait for the configuration/feature support to be announced. Alternatively, if it suits your needs, remove that feature or move out of that configuration to enable migration.
-	If you have automated scripts that deploy your infrastructure and applications today, try to create a similar test setup by using those scripts for migration. Alternatively, you can set up sample environments by using the Azure portal.

## Step 2: Install the latest version of Azure PowerShell

There are two main options for installation, [PowerShell Gallery](https://www.powershellgallery.com/profiles/azure-sdk/) and [Web Platform Installer (WebPI)](http://aka.ms/webpi-azps). WebPI receives monthly updates. PowerShell Gallery receives updates on a continuous basis.

For more information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## Step 3: Set your subscription and sign up for migration

First, start a PowerShell prompt. For migration scenarios, you need to set up your environment for both classic and Resource Manager.

Sign in to your account for the Resource Manager model.

	Login-AzureRmAccount

Get the available subscriptions by using the following command.

	Get-AzureRMSubscription | Sort SubscriptionName | Select SubscriptionName

Set your Azure subscription for the current session. Replace everything within the quotes, including the < and > characters, with the correct name.

	Select-AzureRmSubscription –SubscriptionName "<subscription name>"

>[AZURE.NOTE] Registration is a one-time step, but you must do it once before attempting migration. Without registering, you see the following error message: 

>	*BadRequest : Subscription is not registered for migration.* 

Register with the migration resource provider by using the following command.
	
	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

Please wait five minutes for the registration to finish. You can check the status of the approval by using the following command. Make sure that RegistrationState is `Registered` before you proceed.

	Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

Now sign in to your account for the classic model.

	Add-AzureAccount

Get the available subscriptions by using the following command.

	Get-AzureSubscription | Sort SubscriptionName | Select SubscriptionName

Set your Azure subscription for the current session. Replace everything within the quotes, including the < and > characters, with the correct name.

	Select-AzureSubscription –SubscriptionName "<subscription name>"

## Step 4: Make sure you have enough Azure Resource Manager Virtual Machine cores in the Azure region of your current deployment or VNET

You can use the following powershell command to check the current amount of cores you have in Azure Resource Manager. To learn more about core quotas, see [Limits and the Azure Resource Manager](../azure-subscription-service-limits.md#limits-and-the-azure-resource-manager)

```
Get-AzureRmVMUsage -Location "<Your VNET or Deployment's Azure region"
```

## Step 5: Run commands to migrate your IaaS resources

>[AZURE.NOTE] All the operations described here are idempotent. If you have a problem other than an unsupported feature or a configuration error, we recommend that you retry the prepare, abort, or commit operation. The platform then tries the action again.

### Migrate virtual machines in a cloud service (not in a virtual network)

Get the list of cloud services by using the following command, and then pick the cloud service that you want to migrate. If the VMs in the cloud service are in a virtual network or if they have web/worker roles, the command returns an error message.

	Get-AzureService | ft Servicename

Get the deployment name for the cloud service by using the following command.

	$serviceName = "<service name>"
	$deployment = Get-AzureDeployment -ServiceName $serviceName
	$deploymentName = $deployment.DeploymentName

Prepare the virtual machines in the cloud service for migration. You have two options to choose from.

1. If you want to migrate the VMs to a platform-created virtual network

	First, validate if you can migrate the cloud service using the following command:

		$validate = Move-AzureService -Validate -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork
		$validate.ValidationMessages

	The preceding command displays any warnings and errors that block migration. If validation is successful, then you can proceed with the following Prepare step.

		Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork

2. If you want to migrate to an existing virtual network in the Resource Manager deployment model

		$existingVnetRGName = "<Existing VNET's Resource Group Name>"
		$vnetName = "<Virtual Network Name>"
		$subnetName = "<Subnet name>"

	First, validate if you can migrate the cloud service using the following command:

		$validate = Move-AzureService -Validate -ServiceName $serviceName -DeploymentName $deploymentName -UseExistingVirtualNetwork -VirtualNetworkResourceGroupName $existingVnetRGName -VirtualNetworkName $vnetName -SubnetName $subnetName
		$validate.ValidationMessages

	The preceding command displays any warnings and errors that block migration. If validation is successful, then you can proceed with the following Prepare step.

		Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -UseExistingVirtualNetwork -VirtualNetworkResourceGroupName $existingVnetRGName -VirtualNetworkName $vnetName -SubnetName $subnetName

After the prepare operation is successful, you can query the migration state of the VMs and ensure that they are in the `Prepared` state.

	$vmName = "<vm-name>"
	$vm = Get-AzureVM -ServiceName $serviceName -Name $vmName
	$migrationState = $vm.VM.MigrationState

Check the configuration for the prepared resources by using either PowerShell or the Azure portal. If you are not ready for migration and you want to go back to the old state, use the following command.

	Move-AzureService -Abort -ServiceName $serviceName -DeploymentName $deploymentName

If the prepared configuration looks good, you can move forward and commit the resources by using the following command.

	Move-AzureService -Commit -ServiceName $serviceName -DeploymentName $deploymentName

### Migrate virtual machines in a virtual network

Pick the virtual network that you want to migrate. 

	$vnetName = "VNET-Name"

>[AZURE.NOTE] If the virtual network contains web/worker roles or VMs with unsupported configurations, you get a validation error message.

First, validate if you can migrate the virtual network using the following command:

	Move-AzureVirtualNetwork -Validate -VirtualNetworkName $vnetName

The preceding command displays any warnings and errors that block migration. If validation is successful, then you can proceed with the following Prepare step.
	
	Move-AzureVirtualNetwork -Prepare -VirtualNetworkName $vnetName

Check the configuration for the prepared virtual machines by using either PowerShell or the Azure portal. If you are not ready for migration and you want to go back to the old state, use the following command.

	Move-AzureVirtualNetwork -Abort -VirtualNetworkName $vnetName

If the prepared configuration looks good, you can move forward and commit the resources by using the following command.

	Move-AzureVirtualNetwork -Commit -VirtualNetworkName $vnetName

### Migrate a storage account

Once you're done migrating the virtual machines, we recommend you migrate the storage account.

Prepare the storage account for migration by using the following command

	$storageAccountName = "storagename"
	Move-AzureStorageAccount -Prepare -StorageAccountName $storageAccountName

Check the configuration for the prepared storage account by using either PowerShell or the Azure portal. If you are not ready for migration and you want to go back to the old state, use the following command.

	Move-AzureStorageAccount -Abort -StorageAccountName $storageAccountName

If the prepared configuration looks good, you can move forward and commit the resources by using the following command.

	Move-AzureStorageAccount -Commit -StorageAccountName $storageAccountName

## Next steps

- [Platform-supported migration of IaaS resources from classic to Resource Manager](virtual-machines-windows-migration-classic-resource-manager.md)
- [Technical deep dive on platform-supported migration from classic to Resource Manager](virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
- [Clone a classic virtual machine to Azure Resource Manager by using community PowerShell scripts](virtual-machines-windows-migration-scripts.md)

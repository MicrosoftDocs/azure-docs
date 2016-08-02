<properties
	pageTitle="Migrate IaaS resources from classic to Azure Resource Manager by using Azure PowerShell | Microsoft Azure"
	description="This article walks through the platform-supported migration of resources from classic to Azure Resource Manager by using PowerShell scripts"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="mahthi"
	manager="drewm"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/04/2016"
	ms.author="mahthi"/>

# Migrate IaaS resources from classic to Azure Resource Manager by using Azure PowerShell

These steps show you how to use Azure PowerShell commands to migrate infrastructure as a service (IaaS) resources from the classic deployment model to the Azure Resource Manager deployment model. These steps follow a fill-in-the-blanks approach for migrating your custom environment. You just need to take the commands and substitute your own values for the variables (the lines that begin with "$").

## Step 1: Prepare for migration

Here are a few best practices that we recommend as you evaluate migrating IaaS resources from classic to Resource Manager:

- Read through the [list of unsupported configurations or features](virtual-machines-windows-migration-classic-resource-manager.md). If you have virtual machines that use unsupported configurations or features, we recommend that you wait for the configuration/feature support to be announced. Alternatively, you can remove that feature or move out of that configuration to enable migration if it suits your needs.
-	If you have automated scripts that deploy your infrastructure and applications today, try to create a similar test setup by using those scripts for migration. Alternatively, you can set up sample environments by using the Azure portal.

## Step 2: Install the latest version of Azure PowerShell

There are two main options for installation, [PowerShell Gallery](https://www.powershellgallery.com/profiles/azure-sdk/) and [Web Platform Installer (WebPI)](http://aka.ms/webpi-azps). WebPI will receive monthly updates. PowerShell Gallery will receive updates on a continuous basis.

For more information, see [Azure PowerShell 1.0](https://azure.microsoft.com//blog/azps-1-0/).

## Step 3: Set your subscription and sign up for migration

First, start a PowerShell prompt. For migration scenarios, you need to set up your environment for both classic and Resource Manager.

Sign in to your account for the Resource Manager model.

	Login-AzureRmAccount

Get the available subscriptions by using the following command.

	Get-AzureRMSubscription | Sort SubscriptionName | Select SubscriptionName

Set your Azure subscription for the current session. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	Get-AzureRmSubscription –SubscriptionName $subscr | Select-AzureRmSubscription

>[AZURE.NOTE] Registration is a one time step but it needs to be done once before attempting migration. Without registering you'll see the following error message 

>	*BadRequest : Subscription is not registered for migration.* 

Register with the migration resource provider by using the following command.
	
	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

Please wait five minutes for the registration to finish. You can check the status of the approval by using the following command. Make sure that RegistrationState is `Registered` before you proceed.

	Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

Now sign in to your account for the classic model.

	Add-AzureAccount

Get the available subscriptions by using the following command.

	Get-AzureSubscription | Sort SubscriptionName | Select SubscriptionName

Set your Azure subscription for the current session. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	Get-AzureSubscription –SubscriptionName $subscr | Select-AzureSubscription

## Step 4: Run commands to migrate your IaaS resources

>[AZURE.NOTE] All the operations described here are idempotent. If you have a problem other than an unsupported feature or a configuration error, we recommend that you retry the prepare, abort, or commit operation. The platform will then try the action again.

### Migrate virtual machines in a cloud service (not in a virtual network)

Get the list of cloud services by using the following command, and then pick the cloud service that you want to migrate. Note that if the VMs in the cloud service are in a virtual network or if they have web/worker roles, you will get an error message.

	Get-AzureService | ft Servicename

Get the deployment name for the cloud service by using the following command.

	$serviceName = "<service name>"
	$deployment = Get-AzureDeployment -ServiceName $serviceName
	$deploymentName = $deployment.DeploymentName

Prepare the virtual machines in the cloud service for migration. You have two options to choose from.

1. If you want to migrate the VMs to a platform-created virtual network

	First step is to validate if you can migrate the cloud service using the following command:

		$validate = Move-AzureService -Validate -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork
		$validate.ValidationMessages

	The above command will display any warnings and errors that will block migration. If the validate is succesfull, then you can proceed with the Prepare step below.

		Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork

2. If you want to migrate to an existing virtual network in the Resource Manager deployment model

		$existingVnetRGName = "<Existing VNET's Resource Group Name>"
		$vnetName = "<Virtual Network Name>"
		$subnetName = "<Subnet name>"

	First step is to validate if you can migrate the cloud service using the following command:

		$validate = Move-AzureService -Validate -ServiceName $serviceName -DeploymentName $deploymentName -UseExistingVirtualNetwork -VirtualNetworkResourceGroupName $existingVnetRGName -VirtualNetworkName $vnetName -SubnetName $subnetName
		$validate.ValidationMessages

	The above command will display any warnings and errors that will block migration. If the validate is succesfull, then you can proceed with the Prepare step below.

		Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -UseExistingVirtualNetwork -VirtualNetworkResourceGroupName $existingVnetRGName -VirtualNetworkName $vnetName -SubnetName $subnetName

After the prepare operation is successful, you can query the migration state of the VMs and ensure that they are in the `Prepared` state.

	$vmName = "<vm-name>"
	$vm = Get-AzureVM -ServiceName $serviceName -Name $vmName
	$migrationState = $vm.VM.MigrationState

Check the configuration for the prepared resources by using either PowerShell or the Azure portal. If you are not ready for migration and you want to go back to the old state, use the following command.

	Move-AzureService -Abort -ServiceName $serviceName -DeploymentName $deploymentName

If the prepared configuration looks good, you can move forward and commit the resources by using the following command.

	Move-AzureService -Commit -ServiceName docmigtest1 -DeploymentName docmigtest1

### Migrate virtual machines in a virtual network

Pick the virtual network that you want to migrate. 

	$vnetName = "VNET-Name"

>[AZURE.NOTE] If the virtual network contains web/worker roles or VMs with unsupported configurations, you will get a validation error message.

First step is to validate if you can migrate the virtual network using the following command:

	Move-AzureVirtualNetwork -Validate -VirtualNetworkName $vnetName

The above command will display any warnings and errors that will block migration. If the validate is succesfull, then you can proceed with the Prepare step below.
	
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

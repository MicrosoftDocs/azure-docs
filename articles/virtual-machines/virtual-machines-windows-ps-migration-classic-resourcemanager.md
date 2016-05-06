<properties
	pageTitle="Migrate IaaS resources from Classic to Azure Resource Manager using Azure PowerShell"
	description="This article walks through the platform supported migration service capabilities Service Management to Azure Resource Manager using PowerShell scripts"
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

# Migrate IaaS resources from Classic to Azure Resource Manager using Azure PowerShell

These steps show you how to use Azure PowerShell commands to migrate IaaS resources from Classic to Resource Manager. These steps follow a fill-in-the-blanks approach for migrating your custom environment. You just need to take the commands and substitute your own values for the variables (the lines beginning with "$")

## Step 1: Preparing for migration

Here are a few best practices recommended as you evaluate migrating IaaS resources from Classic to Resource Manager

- Read through the list of unsupported configurations or features [here](virtual-machines-windows-migration-asm-arm.md). If you have Virtual Machines that uses unsupported configurations or features, then we recommend that you wait for the feature/configuration support to be announced. Alternatively, you can remove that feature or move out of that configuration to enable migration if it suits your needs.
-	If you have automated scripts that deploys your infrastructure and applications today. Try to create a similar test setup using those scripts for migration. Alternatively, you can also setup sample environments using Azure Portal as well.
- Since the service is in Public Preview, please make sure that your test environment for migration is isolated from your production environment. Do not mix storage accounts, VNETs or other resources between the test and production environments.

## Step 2: Install Latest Azure PowerShell

There are two main options for installation, [PowerShell Gallery](https://www.powershellgallery.com/profiles/azure-sdk/) and [WebPI](http://aka.ms/webpi-azps). WebPI will receive monthly updates. PowerShell Gallery will receive updates on a continuous basis.

For more information, see [Azure Powershell 1.0](https://azure.microsoft.com//blog/azps-1-0/).

## Step 3: Set your subscription and sign-up for Migration Public Preview

First, start a PowerShell prompt. For migration scenarios, you need to set your environment up for both Classic and Resource Manager.

Login to your account for Resource Manager model.

	Login-AzureRmAccount

Get the available subscriptions by using the following command.

	Get-AzureRMSubscription | Sort SubscriptionName | Select SubscriptionName

Set your Azure subscription for the current session. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	Get-AzureRmSubscription –SubscriptionName $subscr | Select-AzureRmSubscription

Sign up for Public Preview with the following command.

	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

Please wait for 5 minutes for the registration to complete. You can check the status of the approval using the following command. You should make sure that the  RegistrationState is 'Registered' before proceeding further.

	Get-AzureRmResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate

Now login to your account for Classic model.

	Add-AzureAccount

Get the available subscriptions by using the following command.

	Get-AzureSubscription | Sort SubscriptionName | Select SubscriptionName

Set your Azure subscription for the current session. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<subscription name>"
	Get-AzureSubscription –SubscriptionName $subscr | Select-AzureSubscription

## Step 4: Commands to migrate your IaaS resources

>[AZURE.NOTE] Please note that all the operations described below are idempotent. If you run into anything other than an unsupported feature or configuration error, we recommend that you retry the prepare, abort or commit operation and the platform will retry the action again.

### Migrating Virtual Machines in a Cloud Service (Not in a Virtual Network)

Get the list of Cloud Services by using the following command and the pick the cloud service that you want to migrate. Please note that if the VMs in the Cloud Service are in a VNET or if they have web/worker roles, then you will get an error message.

	Get-AzureService | ft Servicename

Get the deployment name for the Cloud Service using the following command

	$serviceName = "<service name>"
	$deployment = Get-AzureDeployment -ServiceName $serviceName
	$deploymentName = $deployment.DeploymentName

Prepare the Virtual Machines in the Cloud Service for Migration. You have two options to chose from.

If you want to migrate the VMs to a platform created Virtual Network, use the command below.

	Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -CreateNewVirtualNetwork

If you want to migrate into an existing Virtual Network in the Resource Manager deployment model, use the command below.

	$existingVnetRGName = "<Existing VNET's Resource Group Name>"
	$vnetName = "<Virtual Network Name>"
	$subnetName = "<Subnet name>"
	Move-AzureService -Prepare -ServiceName $serviceName -DeploymentName $deploymentName -UseExistingVirtualNetwork -VirtualNetworkResourceGroupName $existingVnetRGName 		-VirtualNetworkName $vnetName -SubnetName $subnetName

Once the prepare operation is successful, you can then query the migration state of the VM and ensure that the VMs are in 'Prepared' state.

	$vmName = "<vm-name>"
	$vm = Get-AzureVM -ServiceName $serviceName -Name $vmName
	$migrationState = $vm.VM.MigrationState

Check the configuration for the prepared resources either using PowerShell or Azure Portal. if you are not ready for migration and you want to go back to the old state, use the command below.

	Move-AzureService -Abort -ServiceName $serviceName -DeploymentName $deploymentName

If the prepared configuration looks good, you can move forward and Commit the resources using the command below.

	Move-AzureService -Commit -ServiceName docmigtest1 -DeploymentName docmigtest1

### Migrating Virtual Machines in a Virtual Network

Pick the Virtual Network that you want to migrate. Please note that if the Virtual Network contains web/worker roles or VMs with unsupported configurations, then you will get a validation error message.

Prepare the Virtual Network for Migration using the command below.

	$vnetName = "VNET-Name"
	Move-AzureVirtualNetwork -Prepare -VirtualNetworkName $vnetName

Check the configuration for the prepared Virtual Machines either using PowerShell or Azure Portal. if you are not ready for migration and you want to go back to the old state, use the command below.

	Move-AzureVirtualNetwork -Abort -VirtualNetworkName $vnetName

If the prepared configuration looks good, you can move forward and Commit the resources using the command below.

	Move-AzureVirtualNetwork -Commit -VirtualNetworkName $vnetName

## References

- [Platform supported migration of IaaS resources from Classic to Resource Manager](virtual-machines-windows-migration-asm-arm)
- [Technical Deep Dive on Platform supported migration from Classic to Resource Manager](virtual-machines-windows-migration-asm-arm-deepdive)
- [Clone a classic Virtual Machine to Azure Resource Manager using Community PowerShell Scripts](virtual-machines-windows-migration-scripts)

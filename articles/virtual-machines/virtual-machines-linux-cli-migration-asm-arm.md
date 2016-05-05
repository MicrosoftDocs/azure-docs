<properties
	pageTitle="Migrate IaaS resources from Classic to Azure Resource Manager stack using Azure CLI"
	description="This article walks through the platform supported migration service capabilities Service Management to Azure Resource Manager using Azure CLI"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="mahthi"
	manager="drewm"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/04/2016"
	ms.author="mahthi"/>

# Migrate IaaS resources from Classic to Azure Resource Manager stack using Azure CLI

These steps show you how to use Azure CLI commands to migrate IaaS resources from Classic to Resource Manager Stack. The article requires [the Azure CLI](../xplat-cli-install.md) logged in (`azure login`).

## Step 1: Preparing for migration

Here are a few best practices recommended as you evaluate migrating IaaS resources from Classic to Resource Manager stack

- Read through the list of unsupported configurations or features [here](./virtual-machines-windows-migration-asm-arm.md). If you have Virtual Machines that uses unsupported configurations or features, then we recommend that you wait for the feature/configuration support to be announced. Alternatively, you can remove that feature or move out of that configuration to enable migration if it suits your needs.
-	If you have automated scripts that deploys your infrastructure and applications today. Try to create a similar test setup using those scripts for migration. Alternatively, you can also setup sample environments using Azure Portal as well.
- Since the service is in Public Preview, please make sure that your test environment for migration is isolated from your production environment. Do not mix storage accounts, VNETs or other resources between the test and production environments.

## Step 2: Set your subscription and sign-up for Migration Public Preview

For migration scenarios, you need to set your environment up for both Classic and Resource Manager. [Install Azure CLI](./xplat-cli-install.md) and [select your subscription](./xplat-cli-connect.md).

Select the Azure subscription using the following command

	azure account set "azure-subscription-name"

Sign up for Public Preview with the following command. Please note that in some cases, this command times out, however, the registration will be successful. Please follow the next step to check the status of the registration.

	azure provider register Microsoft.ClassicInfrastructureMigrate

Please wait for 5 minutes for the registration to complete. You can check the status of the approval using the following command. You should make sure that the  RegistrationState is 'Registered' before proceeding further.

	azure provider show Microsoft.ClassicInfrastructureMigrate

Now switch CLI to the asm mode

	azure config mode asm


>[AZURE.NOTE] Please note that all the operations described below are idempotent. If you run into anything other than an unsupported feature or configuration error, we recommend that you retry the prepare, abort or commit operation and the platform will retry the action again.

### Migrating Virtual Machines in a Cloud Service (Not in a Virtual Network)

Get the list of Cloud Services by using the following command and the pick the cloud service that you want to migrate. Please note that if the VMs in the Cloud Service are in a VNET or if they have web/worker roles, then you will get an error message.

	azure service list

Run the following command get the deployment name for the Cloud Service from the verbose output. In most cases, the deployment name is the same as the cloud service name.

	azure service show servicename -vv

Prepare the Virtual Machines in the Cloud Service for Migration. You have two options to chose from.

If you want to migrate the VMs to a platform created Virtual Network, use the command below.

	azure service deployment prepare-migration servicename deploymentname new "" "" ""

If you want to migrate into an existing Virtual Network in the Resource Manager stack, use the command below.

	azure service deployment prepare-migration serviceName deploymentName existing destinationVNETResourceGroupName subnetName vnetName

Once the prepare operation is successful, you can then look through the verbose output to get the migration state of the VM and ensure that the VMs are in 'Prepared' state.

	azure vm show vmName -vv

Check the configuration for the prepared resources either using CLI or Azure Portal. if you are not ready for migration and you want to go back to the old state, use the command below.

	azure service deployment abort-migration serviceName deploymentName

If the prepared configuration looks good, you can move forward and Commit the resources using the command below.

	azure service deployment commit-migration serviceName deploymentName

### Migrating Virtual Machines in a Virtual Network

Pick the Virtual Network that you want to migrate. Please note that if the Virtual Network contains web/worker roles or VMs with unsupported configurations, then you will get a validation error message.

Get all the Virtual Networks in the subscription using the following command.

	azure network vnet list

Prepare the Virtual Network of your choice for Migration using the command below.

	azure network vnet prepare-migration virtualnetworkname

Check the configuration for the prepared Virtual Machines either using CLI or Azure Portal. if you are not ready for migration and you want to go back to the old state, use the command below.

	azure network vnet abort-migration virtualnetworkname

If the prepared configuration looks good, you can move forward and Commit the resources using the command below.

	azure network vnet commit-migration virtualnetworkname

## References


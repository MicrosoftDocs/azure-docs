<properties
	pageTitle="Platform supported migration of IaaS resources from Classic to Azure Resource Manager stack"
	description="This article walks through the platform supported migration service capabilities Service Management to Azure Resource Manager"
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

# Platform supported migration of IaaS resources from Classic to Azure Resource Manager stack

It’s been almost a year since we announced the support for Virtual Machines under the Azure Resource Manager stack. You can read more about the advancements and the additional capabilities that it supports here. In addition, we also gave guidance around how to best connect and have resources from the two stacks co-exist in your subscription using Virtual Network Site-Site Gateways. In this blog, we would like to share our plans and continued investment in enabling migration of IaaS resources from Classic to Resource Manager Stack.

## What is our goal with migration?

We are really excited about the power and capability offered by the new experience and APIs available on Virtual Machines. We think this is really going to change the way you can use the cloud in a lot of ways. with the release of the new model, it allows you to deploy, manage, and monitor related services in a resource group. Resource Manager stack enables deploying complex applications using templates, configures virtual machines using VM extensions, and incorporates access management and tagging. It also includes scalable, parallel deployment for virtual machines into availability sets. In addition, the new model provides lifecycle management of Compute, Network and Storage independently. And there’s a focus of enabling security by default with the enforcement of virtual machines in a Virtual Network.

From a feature standpoint, almost all the features are supported for Compute, Network & Storage under Azure Resource Manager with a few exceptions which we are aggressively trying to finish in the coming months. In addition, we are continuously improving the user experience and adding more features to the azure portal to bridge the experiences.

Because of this new capability and growing deployment base in the new Azure Resource Manager, we want to enable customers to be able to migrate existing deployments in Classic as fast as possible.

>[AZURE.NOTE] With this announcement, we are launching the public preview of the migration service. During public preview, we only recommend migration of your Dev/Test workloads in your Azure subscription.

## Changes to your automation & tooling after migration

Please note that one of the important changes that you will have to make as part of migrating your resources from Classic to Resource Manager model would be the updates to your existing automation or tooling to ensure that it continues to work even after the resources are migrated.

## What does Migration of IaaS resources from Classic to Resource Manager Stack mean?

Before we drill down into the details, we’d like to briefly explain the difference between Data Plane and Management Plane operations on the IaaS resources. Understanding these differences are critical since this explains how we are planning to support migration.

- Management Plane - This describes the calls that comes into the management plane or the API for modifying resources. For example – Creating a VM, Restarting a VM, Update a Virtual Network with a new subnet, etc. All of these operations manage the resources running but doesn't directly impact connecting to the instances.
- Data Plane (Application) – This describes the “runtime” of the application itself and involve interaction with instances that don’t go through the Azure API. Accessing your website or pulling data from a running SQL Server or mongoDB server would all be considered data plane or application interaction. Copying a blob from a storage account and accessing a Public IP address to RDP or SSH into the Virtual Machine also are data plane. These operations keep the application running across compute, networking, and storage.

>[AZURE.NOTE] In some migration scenarios (more details in the unsupported configurations), we will stop deallocate & restart your virtual machines which will incur a short data plane downtime.

## What are the supported scopes of Migration?

During public preview, we are offering two migration scopes primarily targeting Compute and Network. Support for migration of Storage Accounts is planned and will be released very soon. However, to enable a

### Migration of Virtual Machines (Not in a Virtual Network)

In the Resource manager stack, we enforce security of your applications by default. Hence, all VMs need to be in a Virtual Network in the Resource manager model. Hence as part of the migration, we will be restarting (Stop Deallocate and Start) the VMs as part of the migration. You will have a couple of choices when it comes to the Virtual networks:
- You can request the platform to create a new Virtual Network and migrate the virtual machine into the new Virtual Network (or)
- Migrate the Virtual Machine into an existing Virtual Network in Resource Manager

>[AZURE.NOTE] In this migration scope, both the ‘management plane’ and ‘data plane’ operations may not be allowed for a certain period of time during the migration.

### Migration of Virtual machines (in a Virtual Network)

In this scope, for most VM configurations, we are only migrating the metadata between the Classic and Resource Manager stack. The underlying Virtual Machines are running on the same hardware, in the same network, and with the same storage. Thus, when we refer to migration of the metadata from the Classic to Resource Manager Stack, the ‘management plane’ operations may not be allowed for a certain period of time during the migration. However, the Data plane will continue to work i.e., your applications running on top of Virtual Machines (Classic) will not incur downtime during the migration.

At this time, the following configurations are not supported. However, when we add support for them in the future, some VMs in this configuration might incur downtime (stop deallocate & restart) are:

-	If you have more than 1 availability set in a Single Cloud Service
-	If you have '1 or more availability sets' & 'VMs that are not in an availability set' in a single Cloud Service

>[AZURE.NOTE] In this migration scope, the ‘management plane’ may not be allowed for a certain period of time during the migration. For certain special configurations as described above will incur

## Unsupported features & configurations

At this time, we do not support a certain set of features and configurations. We are working on adding support for them, however, the following section calls out our recommendation and plans around them.

### Unsupported features

The following list of features are not supported for Public Preview. You can optionally remove these settings, migrate the VMs and then re-enable them back again in the Resource Manager stack. Support for most of these features are planned and will be released as they become available.

Resource Provider | Feature
---------- | ------------
Compute | Boot Diagnostics
Compute | Unassociated Virtual Machine Disks
Compute | Virtual Machine Images
Network | Unassociated Reserved IPs [If not attached to a Virtual Machine]. Reserved IPs attached to VMs is supported.
Network | Unassociated Network Security Groups [If not attached to a Virtual Network or Network Interface]. NSGs referenced by VNETs is supported.
Network | Endpoint ACLs
Network | Virtual Network Gateways (Site to Site, Express Route, Point to Site)
Storage | Storage Accounts

### Unsupported configurations

The following list of configurations are not supported for Public Preview. You can find our recommendations below. Support for some of these configurations is planned and will be released as they become available.

Service | Configuration | Recommendation
---------- | ------------ | ------------
Resource Manager | Role Based Access Control for Classic Resources | Since the URI of the resources are modified after migration. We recommend that you pre-plan the RBAC policy updates that need to happen after migration.
Compute | Multiple Subnets associated with a VM | You can optionally delete the VM to enable migration. This feature support is currently planned.
Compute | Virtual Machines that belong to a Virtual Network but doesn't have an explicit subnet assigned. | You can optionally delete the VM. This feature support is currently planned.
Compute | Virtual Machines that has Alerts, AutoScale Policies | At this time, the migration will go through and these settings will be dropped. So we highly recommend you to evaluate your environment before doing migration. Alternatively, you can also reconfigure the Alert settings after migration is complete.
Compute | XML VM Extensions [VS Debugger, WebDeploy & RemoteDebug] | This will not be supported. We recommend that you remove these extensions from the Virtual Machine continue migration.
Compute | Cloud Services that contain Web/Worker Roles | This is currently not supported and is in the planning process.
Network | Virtual Networks that contain Virtual Machines & Web/Worker Roles |  This is currently not supported and is in the planning process.
Network | Subnets that contain spaces in the name | This feature support is planned.
App Services | Virtual Network that contain App Service Environments | This is currently not supported and is in the planning process.
HDInsight Services | Virtual Network that contain HDInsight Services | This is currently not supported and is in the planning process.
Dynamics Lifecycle Services | Virtual Network that contain Virtual Machines managed by Dynamics Lifecycle Services | This is currently not supported and is in the planning process.

## The migration experience

Before you start the migration experience, we highly recommend you to follow a few steps

1. Ensure the resources being planned for migration don't leverage any unsupported features or configuration. In most cases, the platform detects these issues and throws an error.
2. If you have VMs that are not in a Virtual Network, they will be stopped deallocated as part of the prepare operation. So if you don't want to lose the Public IP address, please look into Reserving the IP address before triggering prepare. However, if the VMs are in a Virtual Network, they will not be stopped deallocated.
3. Azure recommends you to setup a test environment that has a similar setup and migrate those resources before migrating production deployments.
4. Plan your migration during non-business hours to accommodate for any unexpected failures that might happen during migration.
5. Download the current configuration of your Virtual Machines using PowerShell, CLI Commands or REST APIs to make it easier for validation after prepare step is complete.
6. Update your automation/operationalization scripts to handle Resource Manager stack before starting migration. In addition, you can also optionally do GET operations when the resources are in the Prepared state.
7. Evaluate the RBAC policies configured on the Classic IaaS Resources and have a plan once the migration is complete.

With the announcement of Public Preview, we have added support for triggering migration through REST APIs, PowerShell & Azure CLI. Azure Portal support for migration for you to visualize and walk through the migration from Classic to ARM Migration is currently planned.

![Screenshot that shows the migration workflow](./media/virtual-machines-windows-migration-asm-arm/migration-workflow.png)

1.	Prepare
	* This is the first step in the migration process. The goal of this step is to simulate the transformation of the IaaS resources from Classic to Resource Manager resources and present this side by side for you to visualize. The detailed flow of actions are described below.
  * You will select the Virtual Network or the Hosted Service (if it’s not a VNET) that you want to prepare for migration.
  *	At first, the platform will always do data analysis in the background for the resource(s) under migration and return back success/failure if the resource(s) are capable of migration.
	*	If the resource is not capable of migration, we will list out the reasons for why it’s not supported for migration.*
	* If the resource is capable of migration, the platform first locks down the management plane operations for the resource(s) under migration. For example: you will not able to add a data disk to a VM under migration.
  *	The platform will then start the migration of metadata from the Classic to Resource Manager Stack for the migrating resource(s).  
  *	Once the prepare operation is complete, you will have the option of visualizing the resources in both Classic and Resource Manager Stack. For every Cloud Service in the Classic Stack, we will create a resource group name which has a pattern <cloud-service-name>-migrated.

2.	Manual or Scripted Check
  * In this step, you can optionally use the configuration that you downloaded earlier to validate that the migration looks correct. Alternatively, you can also log into the portal and spot check the properties and resources to validate that metadata migration looks good.
	* If you are migrating a Virtual Network, most configuration of virtual machines will not be restarted. For applications on those VMs, you can validate that the application is still up and running.
	* You can test your monitoring/automation and operational scripts to see if the VMs are working as expected and if your updated scripts work correctly. Please note that only GET operations will be supported when the resources are in the Prepared state.
  * There will no set time window before which you need to ‘commit’ the migration. You can take as much time as you want in this state. However, please note that the Management plane will be locked for these resources until you either ‘abort’ or ‘commit’.
  * If you see any issues, you can always ‘abort’ the migration and go back to the ‘Classic’ stack. Once you go back, we will open up the management plane operations on the resources so you can resume normal operations on those VMs in the Classic stack.

3. Abort
  * This is an optional step that allows you to revert back your changes to the Classic Stack and abort the migration.
	Please note that this operation cannot be executed once you have triggered the 'Commit' Operation. 	*

4.	Commit
  * Once you are done with the validation, you can ‘commit’ the migration and the resources will not appear anymore in Classic but will be available only in the Resource Manager Stack. This also means the migrated resources can only be managed in the new portal.
	* If this operation fails, we recommend that you retry this a couple of times. If it continues to fail, please create a support ticket or create a forum post with ClassicIaaSMigration tag [here](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows)
	* Please note that once the migration is complete,

>[AZURE.NOTE] Please note that all the operations described below are idempotent. If you run into anything other than an unsupported feature or configuration error, we recommend that you retry the prepare, abort or commit operation and the platform will retry the action again.

## Next steps
Now that you have an understanding of migration of Classic IaaS resources to Resource Manager, you can start migrating the resources.

- [Technical Deep Dive on Platform supported migration from Classic to Azure Resource Manager](./virtual-machines-windows-migration-asm-arm-deepdive)
- [Use PowerShell to migrate IaaS resources from Classic to Azure Resource Manager](./virtual-machines-windows-ps-migration-asm-arm)
- [Use CLI to migrate IaaS resources from Classic to Azure Resource Manager](./virtual-machines-windows-cli-migration-asm-arm)
- [Clone a classic Virtual Machine to Azure Resource Manager using Community PowerShell Scripts](./virtual-machines-windows-migration-scripts)

## Frequently Asked Questions

**Does this migration plan affect any of my existing services or applications that run on Azure Virtual Machines?**

No. The Virtual Machines (Classic) are fully supported GA services and you can continue to leverage these resources to expand your foot print on the Microsoft Azure Cloud.

**What happens to my VMs if I don’t plan on migrating in the near future?**

We are not deprecating the existing Classic APIs and resource model. We want to make migration extremely easy given the advanced features available in the Resource Manager Stack. Thus, we highly recommend that you review some of the advancements made as part of the IaaS stack under Resource Manager [here](./virtual-machines-windows-compare-deployment-models.md).

**What does this migration plan mean for my existing tooling?**

As stated above, updating your tooling to the Azure Resource Manager stack would be one of the most important changes that you have to account for in your migration plans.

**How long will the management plane downtime be?**

It depends on the number of resources that are being migrated. For smaller deployments (a few 10s of VMs), the whole migration end to end should take less than an hour. However, for large scale deployments (100s of VMs), it can run into a few hours. Given the service is in Public Preview, we highly recommend that you run this on your Development or Test subscription to evaluate the impact.

**Can I roll back my migration if something goes wrong?**

You can abort your migration as long as you haven’t ‘Committed’ your changes into the Resource manager stack. The prepare operation provides an implicit option to validate your migration to ensure that everything works as expected before completing the migration.

**Do I have to buy another express route circuit if I have to leverage the IaaS stack under Resource manager?**

No. We recently enabled coexistence of an Express Route Circuit across Classic and Resource Manager Stack. You don’t have to buy a new express route circuit if you already have one.

**Do you have a roadmap for when you will add the unsupported scenarios into the migration list?**

At this time, we are landing the first set of scenarios in H1 CY 2016. We will continue to add the unsupported feature support following the first release.

**What if I had configured Role based access control policies for my Classic IaaS resources?**

During migration, the resources transform from Classic to Resource Manager. So we recommend that you pre-plan the RBAC policy updates that need to happen after migration.

**What if I’m using Azure Site Recovery or Back up Services on Azure today?**

Azure Site Recovery & Backup support for Virtual Machines under Resource Manager Stack was added recently. We are actively working with those teams to enable the capability to support migration of VMs into Resource Manager as well. At this time, we recommend you to not run migration if you are leveraging these functionalities.

**Can I validate my subscription or resources to see if its capable for migration?**

At this time, the prepare operation does an implicit validation for the resources that are being prepared for migration. In the platform supported migration option , the first step in prepare migration is to validate if the resources are capable of migration. If the validation fails, the resources will not be touched at all. However, we are also planning to release a new validate action that will make it much simpler.

**What happens if I run into a quota error while preparing the IaaS resources for migration?**

We recommend you abort your migration. And then log a support request to increase the quotas in the region that you are migrating the VMs. Once the quota request is approved, please start executing the migration steps again.

**How do I report an issue if I don't have a support contract?**

Please post your issues and questions on migration to our Virtual Machines Forum with the keyword ClassicIaaSMigration [here](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows). We recommend posting all your questions in this forum, however, if you do have a support contract, you are more than welcome to log a support ticket as well.

**What if I don't like the names that the platform chose for my resource groups during migration?**

We are soon going to announce the support for moving resources between resource groups. Once that capability is supported, you can move the resources to the resource group of your choice.

**What if I don't like the names of the resources that the platform chose during migration?**

For all the resources that you explicitly provide names in the Classic Stack, they will be retained during migration. In some cases, new resources will be created. For example: A network interface will be created for every VM. At this moment, we don't support the ability to control the names of these new resources created during migration. Please log your votes for this feature [here](http://feedback.azure.com)

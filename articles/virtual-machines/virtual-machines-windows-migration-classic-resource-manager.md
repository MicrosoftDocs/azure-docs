<properties
	pageTitle="Platform-supported migration of IaaS resources from classic to Azure Resource Manager | Microsoft Azure"
	description="This article walks through the platform-supported migration of resources from classic to Azure Resource Manager"
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

# Platform-supported migration of IaaS resources from classic to Azure Resource Manager

It’s been almost a year since we announced the support for virtual machines under Azure Resource Manager. You can read more about the advancements and the additional capabilities that it supports here. In addition, we gave guidance around how to best connect and have resources from the two deployment models coexist in your subscription by using virtual network site-to-site gateways. In this article, we describe how we're enabling migration of infrastructure as a service (IaaS) resources from classic to Resource Manager.

## Goal for migration

We're excited about the new experience and APIs that are available on virtual machines. We think this is going to change the way you can use the cloud in a lot of ways. With the release of the new model, you can deploy, manage, and monitor related services in a resource group. Resource Manager enables deploying complex applications through templates, configures virtual machines by using VM extensions, and incorporates access management and tagging. It also includes scalable, parallel deployment for virtual machines into availability sets. In addition, the new model provides lifecycle management of compute, network, and storage independently. Finally, there’s a focus on enabling security by default with the enforcement of virtual machines in a virtual network.

From a feature standpoint, almost all the features from the classic deployment model are supported for compute, network, and storage under Azure Resource Manager. In addition, we are continuously improving the user experience and adding features to the Azure portal.

Because of this new capability and growing deployment base in Azure Resource Manager, we want customers to be able to migrate existing deployments in the classic deployment model.

>[AZURE.NOTE] During public preview of the migration service, we recommend migration of only your non-production workloads in your Azure subscription.

## Changes to your automation and tooling after migration

As part of migrating your resources from the classic model to the Resource Manager model, you'll have to update your existing automation or tooling to ensure that it continues to work after the migration.

## Meaning of migration of IaaS resources from classic to Resource Manager

Before we drill down into the details, we’d like to briefly explain the difference between data plane and management plane operations on the IaaS resources. Understanding these differences is critical because this explains how we are planning to support migration.

- *Management plane* describes the calls that comes into the management plane or the API for modifying resources. For example, operations like creating a VM, restarting a VM, and updating a virtual network with a new subnet manage the running resources. They don't directly affect connecting to the instances.
- *Data plane* (application) describes the “runtime” of the application itself and involves interaction with instances that don’t go through the Azure API. Accessing your website or pulling data from a running SQL Server instance or a MongoDB server would be considered data plane or application interaction. Copying a blob from a storage account and accessing a public IP address to RDP or SSH into the virtual machine also are data plane. These operations keep the application running across compute, networking, and storage.

>[AZURE.NOTE] In some migration scenarios, we will stop, deallocate, and restart your virtual machines. This will incur a short data plane downtime.

## Supported scopes of migration

During public preview, we are offering two migration scopes that primarily target compute and network. To allow seamless migration, we have enabled the classic storage accounts to contain disks for Resource Manager VMs.  

### Migration of virtual machines (not in a virtual network)

In the Resource Manager deployment model, we enforce security of your applications by default. All VMs need to be in a virtual network in the Resource Manager model. Therefore, we will be restarting (`Stop`, `Deallocate`, and `Start`) the VMs as part of the migration. You have two options for the virtual networks:
- You can request the platform to create a new virtual network and migrate the virtual machine into the new virtual network.
- You can migrate the virtual machine into an existing virtual network in Resource Manager.

>[AZURE.NOTE] In this migration scope, both the management plane and data plane operations may not be allowed for a certain period of time during the migration.

### Migration of virtual machines (in a virtual network)

In this scope, for most VM configurations, we are only migrating the metadata between the classic deployment model and the Resource Manager deployment model. The underlying VMs are running on the same hardware, in the same network, and with the same storage. Thus, when we refer to migration of the metadata from classic to Resource Manager, the management plane operations may not be allowed for a certain period of time during the migration. However, the data plane will continue to work. That is, your applications running on top of VMs (classic) will not incur downtime during the migration.

At this time, the following configurations are not supported. If we add support for them in the future, some VMs in this configuration might incur downtime (stop, deallocate, and restart).

-	You have more than one availability set in a single cloud service
-	You have one or more availability sets and VMs that are not in an availability set in a single cloud service.

>[AZURE.NOTE] In this migration scope, the management plane may not be allowed for a certain period of time during the migration. For certain special configurations as described earlier, this will incur data plane downtime.

### Storage accounts and migration

Storage account migration is not supported for this public preview.

To allow seamless migration, we have enabled the capability to deploy Resource Manager VMs in a classic storage account. With this capability, compute and network resources can be migrated independent of storage accounts.

## Unsupported features and configurations

At this time, we do not support a certain set of features and configurations. The following sections describe our recommendations around them.

### Unsupported features

The following features are not supported for public preview. You can optionally remove these settings, migrate the VMs, and then re-enable them in the Resource Manager deployment model.

Resource provider | Feature
---------- | ------------
Compute | Boot diagnostics
Compute | Unassociated virtual machine disks
Compute | Virtual machine images
Network | Unassociated reserved IPs (if not attached to a VM). Reserved IPs attached to VMs is supported.
Network | Unassociated network security groups (if not attached to a virtual network or network interface). NSGs referenced by virtual networks is supported.
Network | Endpoint ACLs
Network | Virtual network gateways (site to site, Azure ExpressRoute, point to site)
Storage | Storage Accounts

### Unsupported configurations

The following configurations are not supported for public preview. Our recommendations are as follows.

Service | Configuration | Recommendation
---------- | ------------ | ------------
Resource Manager | Role Based Access Control (RBAC) for classic resources | Because the URI of the resources are modified after migration, we recommend that you plan the RBAC policy updates that need to happen after migration.
Compute | Multiple subnets associated with a VM | You should update the subnet configuration to reference only subnets.
Compute | Virtual machines that belong to a virtual network but don't have an explicit subnet assigned. | You can optionally delete the VM.
Compute | Virtual machines that have alerts, Autoscale policies | At this time, the migration will go through and these settings will be dropped. So we highly recommend that you evaluate your environment before you do the migration. Alternatively, you can reconfigure the alert settings after migration is complete.
Compute | XML VM extensions (Visual Studio Debugger, Web Deploy, and Remote Debugging) | This is not supported. We recommend that you remove these extensions from the virtual machine to continue migration.
Compute | Cloud services that contain web/worker roles | This is currently not supported.
Network | Virtual networks that contain virtual machines and web/worker roles |  This is currently not supported.
Network | Subnets that contain spaces in the name | This is currently not supported.
Azure App Service | Virtual networks that contain App Service environments | This is currently not supported.
HDInsight services | Virtual networks that contain HDInsight services | This is currently not supported.
Microsoft Dynamics Lifecycle Services | Virtual networks that contain virtual machines that are managed by Dynamics Lifecycle Services | This is currently not supported.

## The migration experience

Before you start the migration experience, we highly recommend the following:

- Ensure that the resources being planned for migration don't use any unsupported features or configuration. In most cases, the platform detects these issues and throws an error.
- If you have VMs that are not in a virtual network, they will be stopped and deallocated as part of the prepare operation. If you don't want to lose the public IP address, please look into reserving the IP address before triggering the prepare operation. However, if the VMs are in a virtual network, they will not be stopped and deallocated.
- Do not attempt to migrate production resources at this time.
- Plan your migration during non-business hours to accommodate for any unexpected failures that might happen during migration.
- Download the current configuration of your VMs by using PowerShell, command-line interface (CLI) commands, or REST APIs to make it easier for validation after the prepare step is complete.
- Update your automation/operationalization scripts to handle the Resource Manager deployment model before you start the migration. You can optionally do GET operations when the resources are in the prepared state.
- Evaluate the RBAC policies that are configured on the classic IaaS resources, and have a plan for after the migration is complete.

The migration workflow is as follows. With the announcement of public preview, we have added support for triggering migration through REST APIs, PowerShell, and Azure CLI.

![Screenshot that shows the migration workflow](./media/virtual-machines-windows-migration-classic-resource-manager/migration-workflow.png)

>[AZURE.NOTE] All the operations described in the following sections are idempotent. If you run into anything other than an unsupported feature or configuration error, we recommend that you retry the prepare, abort, or commit operation. The platform will then try the action again.

### Prepare

The prepare operation is the first step in the migration process. The goal of this step is to simulate the transformation of the IaaS resources from classic to Resource Manager resources and present this side by side for you to visualize.

You will select the virtual network or the hosted service (if it’s not a virtual network) that you want to prepare for migration.

At first, the platform will always do data analysis in the background for the resources under migration and return success/failure if the resources are capable of migration.

	* If the resource is not capable of migration, we will list out the reasons for why it’s not supported for migration.
	* If the resource is capable of migration, the platform first locks down the management plane operations for the resources under migration. For example: you will not able to add a data disk to a VM under migration.

The platform will then start the migration of metadata from classic to Resource Manager for the migrating resources.  

After the prepare operation is complete, you will have the option of visualizing the resources in both classic and Resource Manager. For every cloud service in the classic deployment model, we will create a resource group name which has a pattern `cloud-service-name>-migrated`.

### Check (manual or scripted)

In the check step, you can optionally use the configuration that you downloaded earlier to validate that the migration looks correct. Alternatively, you can also log into the portal and spot check the properties and resources to validate that metadata migration looks good.

If you are migrating a virtual network, most configuration of virtual machines will not be restarted. For applications on those VMs, you can validate that the application is still up and running.

You can test your monitoring/automation and operational scripts to see if the VMs are working as expected and if your updated scripts work correctly. Please note that only GET operations will be supported when the resources are in the Prepared state.

There is no set time window before which you need to ‘commit’ the migration. You can take as much time as you want in this state. However, please note that the Management plane will be locked for these resources until you either ‘abort’ or ‘commit’.

If you see any issues, you can always ‘abort’ the migration and go back to the ‘classic’ deployment model. After you go back, we will open up the management plane operations on the resources so you can resume normal operations on those VMs in the classic deployment model.

### Abort

Abort is an optional step that allows you to revert your changes to the classic deployment model and stop the migration. Note that this operation cannot be executed after you have triggered the commit operation. 	

### Commit

After you are done with the validation, you can commit the migration, and the resources will not appear anymore in classic but will be available only in the Resource Manager deployment model. This also means the migrated resources can only be managed in the new portal.

If this operation fails, we recommend that you retry this a couple of times. If it continues to fail, please create a support ticket or create a forum post with a ClassicIaaSMigration tag [here](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows).

## Frequently Asked Questions

**Does this migration plan affect any of my existing services or applications that run on Azure virtual machines?**

No. The VMs (classic) are fully supported GA services and you can continue to leverage these resources to expand your foot print on the Microsoft Azure Cloud.

**What happens to my VMs if I don’t plan on migrating in the near future?**

We are not deprecating the existing classic APIs and resource model. We want to make migration extremely easy given the advanced features available in the Resource Manager deployment model. Thus, we highly recommend that you review some of the advancements made as part of IaaS under Resource Manager [here](virtual-machines-windows-compare-deployment-models.md).

**What does this migration plan mean for my existing tooling?**

Updating your tooling to the Resource Manager deployment model would be one of the most important changes that you have to account for in your migration plans.

**How long will the management plane downtime be?**

It depends on the number of resources that are being migrated. For smaller deployments (a few 10s of VMs), the whole migration end to end should take less than an hour. However, for large scale deployments (100s of VMs), it can run into a few hours. Given the service is in Public Preview, we highly recommend that you run this on your Development or Test subscription to evaluate the impact.

**Can I roll back after my migrating resources are committed in Resource Manager?**

You can abort your migration as long as the resources are in the 'Prepared' state. Rollback is not supported after the resources have been successfully migrated using the Commit operation.

**Can I roll back my migration if the Commit Operations fails?**

You cannot abort migration if the Commit operation fails. All migration operations including the commit operation is idempotent. So we recommend that you retry the operation after a short time window. If you still face an error, please create a support ticket or create a forum post with ClassicIaaSMigration tag [here](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows)

**Do I have to buy another express route circuit if I have to leverage the IaaS under Resource Manager?**

No. We recently enabled [coexistence of an Express Route Circuit across classic and Resource Manager](../expressroute/expressroute-howto-coexist-resource-manager.md). You don’t have to buy a new express route circuit if you already have one.

**Do you have a roadmap for when you will add the unsupported scenarios into the migration list?**

At this time, we are landing the first set of scenarios in H1 CY 2016. We will continue to add the unsupported feature support following the first release.

**What if I had configured Role based access control policies for my classic IaaS resources?**

During migration, the resources transform from classic to Resource Manager. So we recommend that you pre-plan the RBAC policy updates that need to happen after migration.

**What if I’m using Azure Site Recovery or Back up Services on Azure today?**

Azure Site Recovery & Backup support for VMs under Resource Manager was added recently. We are actively working with those teams to enable the capability to support migration of VMs into Resource Manager as well. At this time, we recommend you to not run migration if you are leveraging these functionalities.

**Can I validate my subscription or resources to see if its capable for migration?**

At this time, the prepare operation does an implicit validation for the resources that are being prepared for migration. In the platform supported migration option , the first step in prepare migration is to validate if the resources are capable of migration. If the validation fails, the resources will not be touched at all. However, we are also planning to release a new validate action that will make it much simpler.

**What happens if I run into a quota error while preparing the IaaS resources for migration?**

We recommend you abort your migration. And then log a support request to increase the quotas in the region that you are migrating the VMs. After the quota request is approved, please start executing the migration steps again.

**How do I report an issue if I don't have a support contract?**

Please post your issues and questions on migration to our VMs Forum with the keyword ClassicIaaSMigration [here](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows). We recommend posting all your questions in this forum, however, if you do have a support contract, you are more than welcome to log a support ticket as well.

**What if I don't like the names that the platform chose for my resource groups during migration?**

We are soon going to announce the support for moving resources between resource groups. After that capability is supported, you can move the resources to the resource group of your choice.

**What if I don't like the names of the resources that the platform chose during migration?**

For all the resources that you explicitly provide names in the classic deployment model, they will be retained during migration. In some cases, new resources will be created. For example: A network interface will be created for every VM. At this moment, we don't support the ability to control the names of these new resources created during migration. Please log your votes for this feature [here](http://feedback.azure.com)


## Next steps
Now that you have an understanding of migration of classic IaaS resources to Resource Manager, you can start migrating the resources.

- [Technical Deep Dive on Platform supported migration from classic to Azure Resource Manager](virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
- [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-ps-migration-classic-resource-manager.md)
- [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-linux-cli-migration-classic-resource-manager.md)
- [Clone a classic virtual machine to Azure Resource Manager using Community PowerShell Scripts](virtual-machines-windows-migration-scripts.md)

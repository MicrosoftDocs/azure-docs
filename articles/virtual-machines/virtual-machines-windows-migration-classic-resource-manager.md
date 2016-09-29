<properties
	pageTitle="Platform-supported migration of IaaS resources from classic to Azure Resource Manager | Microsoft Azure"
	description="This article walks through the platform-supported migration of resources from classic to Azure Resource Manager"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="mahthi"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/22/2016"
	ms.author="mahthi"/>

# Platform-supported migration of IaaS resources from classic to Azure Resource Manager

In this article, we describe how we're enabling migration of infrastructure as a service (IaaS) resources from the Classic to Resource Manager deployment models. You can read more about [Azure Resource Manager features and benefits](../resource-group-overview.md). We detail how to connect resources from the two deployment models that coexist in your subscription by using virtual network site-to-site gateways. 

## Goal for migration

Resource Manager enables deploying complex applications through templates, configures virtual machines by using VM extensions, and incorporates access management and tagging. Azure Resource Manager includes scalable, parallel deployment for virtual machines into availability sets. The new deployment model also provides lifecycle management of compute, network, and storage independently. Finally, there’s a focus on enabling security by default with the enforcement of virtual machines in a virtual network.

Almost all the features from the classic deployment model are supported for compute, network, and storage under Azure Resource Manager. To benefit from the new capabilities in Azure Resource Manager, you can migrate existing deployments from the Classic deployment model.

## Changes to your automation and tooling after migration

As part of migrating your resources from the Classic deployment model to the Resource Manager deployment model, you have to update your existing automation or tooling to ensure that it continues to work after the migration.

## Meaning of migration of IaaS resources from classic to Resource Manager

Before we drill down into the details, let's look at the difference between data-plane and management-plane operations on the IaaS resources.

- *Management plane* describes the calls that come into the management plane or the API for modifying resources. For example, operations like creating a VM, restarting a VM, and updating a virtual network with a new subnet manage the running resources. They don't directly affect connecting to the instances.
- *Data plane* (application) describes the runtime of the application itself and involves interaction with instances that don’t go through the Azure API. Accessing your website or pulling data from a running SQL Server instance or a MongoDB server would be considered data plane or application interaction. Copying a blob from a storage account and accessing a public IP address to RDP or SSH into the virtual machine also are data plane. These operations keep the application running across compute, networking, and storage.

>[AZURE.NOTE] In some migration scenarios, the Azure platform stops, deallocates, and restarts your virtual machines. This incurs a short data-plane downtime.

## Supported scopes of migration

There are three migration scopes that primarily target compute, network, and storage. 

### Migration of virtual machines (not in a virtual network)

In the Resource Manager deployment model, security is enforced for your applications by default. All VMs need to be in a virtual network in the Resource Manager model. The Azure platform restarts (`Stop`, `Deallocate`, and `Start`) the VMs as part of the migration. You have two options for the virtual networks:

- You can request the platform to create a new virtual network and migrate the virtual machine into the new virtual network.
- You can migrate the virtual machine into an existing virtual network in Resource Manager.

>[AZURE.NOTE] In this migration scope, both the management-plane operations and the data-plane operations may not be allowed for a period of time during the migration.

### Migration of virtual machines (in a virtual network)

For most VM configurations, only the metadata is migrating between the Classic and Resource Manager deployment models. The underlying VMs are running on the same hardware, in the same network, and with the same storage. The management-plane operations may not be allowed for a certain period of time during the migration. However, the data plane continues to work. That is, your applications running on top of VMs (classic) do not incur downtime during the migration.

The following configurations are not currently supported. If support is added in the future, some VMs in this configuration might incur downtime (go through stop, deallocate, and restart VM operations).

-	You have more than one availability set in a single cloud service.
-	You have one or more availability sets and VMs that are not in an availability set in a single cloud service.

>[AZURE.NOTE] In this migration scope, the management plane may not be allowed for a period of time during the migration. For certain configurations as described earlier, data-plane downtime occurs.

### Storage accounts migration

To allow seamless migration, you can deploy Resource Manager VMs in a classic storage account. With this capability, compute and network resources can and should be migrated independently of storage accounts. Once you migrate over your Virtual Machines and Virtual Network, you need to migrate over your storage accounts to complete the migration process. 

>[AZURE.NOTE] The Resource Manager deployment model doesn't have the concept of Classic images and disks. When the storage account is migrated, Classic images and disks are not visible in the Resource Manager stack but the backing VHDs remain in the storage account. 

## Unsupported features and configurations

We do not currently support some features and configurations. The following sections describe our recommendations around them.

### Unsupported features

The following features are not currently supported. You can optionally remove these settings, migrate the VMs, and then re-enable the settings in the Resource Manager deployment model.

Resource provider | Feature
---------- | ------------
Compute | Unassociated virtual machine disks.
Compute | Virtual machine images.
Network | Endpoint ACLs.
Network | Virtual network gateways (site to site, Azure ExpressRoute, application gateway, point to site).
Network | Virtual networks using VNet Peering. (Migrate VNet to ARM, then peer) Learn more about [VNet Peering] (../virtual-network/virtual-network-peering-overview.md).
Network | Traffic Manager profiles.

### Unsupported configurations

The following configurations are not currently supported.

Service | Configuration | Recommendation
---------- | ------------ | ------------
Resource Manager | Role Based Access Control (RBAC) for classic resources | Because the URI of the resources is modified after migration, it is recommended that you plan the RBAC policy updates that need to happen after migration.
Compute | Multiple subnets associated with a VM | Update the subnet configuration to reference only subnets.
Compute | Virtual machines that belong to a virtual network but don't have an explicit subnet assigned | You can optionally delete the VM.
Compute | Virtual machines that have alerts, Autoscale policies | The migration goes through and these settings are dropped. It is highly recommended that you evaluate your environment before you do the migration. Alternatively, you can reconfigure the alert settings after migration is complete.
Compute | XML VM extensions (BGInfo 1.*, Visual Studio Debugger, Web Deploy, and Remote Debugging) | This is not supported. It is recommended that you remove these extensions from the virtual machine to continue migration or they will be dropped automatically during the migration process.
Compute | Boot diagnostics with Premium storage | Disable Boot Diagnostics feature for the VMs before continuing with migration. You can re-enable boot diagnostics in the Resource Manager stack after the migration is complete. Additionally, blobs that are being used for screenshot and serial logs should be deleted so you are no longer charged for those blobs.
Compute | Cloud services that contain web/worker roles | This is currently not supported.
Network | Virtual networks that contain virtual machines and web/worker roles |  This is currently not supported.
Azure App Service | Virtual networks that contain App Service environments | This is currently not supported.
Azure HDInsight | Virtual networks that contain HDInsight services | This is currently not supported.
Microsoft Dynamics Lifecycle Services | Virtual networks that contain virtual machines that are managed by Dynamics Lifecycle Services | This is currently not supported.
Compute | Azure Security Center extensions with a VNET that has a VPN gateway or ER gateway with on-prem DNS server | Azure Security Center automatically installs extensions on your Virtual Machines to monitor their security and raise alerts. These extensions usually get installed automatically if the Azure Security Center policy is enabled on the subscription. As gateway migration is not supported currently and the gateway needs to be deleted before proceeding with committing the migration, the internet access to VM storage account is lost when the gateway is deleted. The migration will not proceed when this happens as the guest agent status blob cannot be populated. It is recommended to disable Azure Security Center policy on the subscription 3 hours before proceeding with migration.

## The migration experience

Before you start the migration experience, the following is recommended:

- Ensure that the resources that you want to migrate don't use any unsupported features or configurations. Usually the platform detects these issues and generates an error.
- If you have VMs that are not in a virtual network, they will be stopped and deallocated as part of the prepare operation. If you don't want to lose the public IP address, look into reserving the IP address before triggering the prepare operation. However, if the VMs are in a virtual network, they are not stopped and deallocated.
- Plan your migration during non-business hours to accommodate for any unexpected failures that might happen during migration.
- Download the current configuration of your VMs by using PowerShell, command-line interface (CLI) commands, or REST APIs to make it easier for validation after the prepare step is complete.
- Update your automation/operationalization scripts to handle the Resource Manager deployment model before you start the migration. You can optionally do GET operations when the resources are in the prepared state.
- Evaluate the RBAC policies that are configured on the classic IaaS resources, and plan for after the migration is complete.

The migration workflow is as follows

![Screenshot that shows the migration workflow](./media/virtual-machines-windows-migration-classic-resource-manager/migration-workflow.png)

>[AZURE.NOTE] All the operations described in the following sections are idempotent. If you have a problem other than an unsupported feature or a configuration error, it is recommended that you retry the prepare, abort, or commit operation. The Azure platform tries the action again.

### Validate

The validate operation is the first step in the migration process. The goal of this step is to analyze data in the background for the resources under migration and return success/failure if the resources are capable of migration.

You select the virtual network or the hosted service (if it’s not a virtual network) that you want to validate for migration.

* If the resource is not capable of migration, the Azure platform lists all the reasons for why it’s not supported for migration.

### Prepare

The prepare operation is the second step in the migration process. The goal of this step is to simulate the transformation of the IaaS resources from classic to Resource Manager resources and present this side by side for you to visualize.

You select the virtual network or the hosted service (if it’s not a virtual network) that you want to prepare for migration.

* If the resource is not capable of migration, the Azure platform stops the migration process and lists the reason why the prepare operation failed.
* If the resource is capable of migration, the Azure platform first locks down the management-plane operations for the resources under migration. For example, you are not able to add a data disk to a VM under migration.

The Azure platform then starts the migration of metadata from classic to Resource Manager for the migrating resources.

After the prepare operation is complete, you have the option of visualizing the resources in both classic and Resource Manager. For every cloud service in the classic deployment model, the Azure platform creates a resource group name that has the pattern `cloud-service-name>-migrated`.

>[AZURE.NOTE] Virtual Machines that are not in a classic Virtual Network are stopped deallocated in this phase of migration.

### Check (manual or scripted)

In the check step, you can optionally use the configuration that you downloaded earlier to validate that the migration looks correct. Alternatively, you can sign in to the portal and spot check the properties and resources to validate that metadata migration looks good.

If you are migrating a virtual network, most configuration of virtual machines is not restarted. For applications on those VMs, you can validate that the application is still up and running.

You can test your monitoring/automation and operational scripts to see if the VMs are working as expected and if your updated scripts work correctly. Only GET operations are supported when the resources are in the prepared state.

There is no set time window before which you need to commit the migration. You can take as much time as you want in this state. However, the management plane is locked for these resources until you either abort or commit.

If you see any issues, you can always abort the migration and go back to the classic deployment model. After you go back, the Azure platform will open the management-plane operations on the resources so that you can resume normal operations on those VMs in the classic deployment model.

### Abort

Abort is an optional step that you can use to revert your changes to the classic deployment model and stop the migration.

>[AZURE.NOTE] This operation cannot be executed after you have triggered the commit operation. 	

### Commit

After you finish the validation, you can commit the migration. Resources do not appear anymore in classic and are available only in the Resource Manager deployment model. The migrated resources can be managed only in the new portal.

>[AZURE.NOTE] This is an idempotent operation. If it fails, it is recommended that you retry the operation. If it continues to fail, create a support ticket or create a forum post with a ClassicIaaSMigration tag on our [VM forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows).

## Frequently asked questions

**Does this migration plan affect any of my existing services or applications that run on Azure virtual machines?**

No. The VMs (classic) are fully supported services in general availability. You can continue to use these resources to expand your footprint on Microsoft Azure.

**What happens to my VMs if I don’t plan on migrating in the near future?**

We are not deprecating the existing classic APIs and resource model. We want to make migration easy, considering the advanced features that are available in the Resource Manager deployment model. We highly recommend that you review [some of the advancements](virtual-machines-windows-compare-deployment-models.md) that are part of IaaS under Resource Manager.

**What does this migration plan mean for my existing tooling?**

Updating your tooling to the Resource Manager deployment model is one of the most important changes that you have to account for in your migration plans.

**How long will the management-plane downtime be?**

It depends on the number of resources that are being migrated. For smaller deployments (a few tens of VMs), the whole migration should take less than an hour. For large-scale deployments (hundreds of VMs), the migration can take a few hours.

**Can I roll back after my migrating resources are committed in Resource Manager?**

You can abort your migration as long as the resources are in the prepared state. Rollback is not supported after the resources have been successfully migrated through the commit operation.

**Can I roll back my migration if the commit operation fails?**

You cannot abort migration if the commit operation fails. All migration operations, including the commit operation, are idempotent. So we recommend that you retry the operation after a short time. If you still face an error, create a support ticket or create a forum post with the ClassicIaaSMigration tag on our [VM forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows).

**Do I have to buy another express route circuit if I have to use IaaS under Resource Manager?**

No. We recently enabled [moving ExpressRoute circuits from the classic to the Resource Manager deployment model](../expressroute/expressroute-move.md). You don’t have to buy a new ExpressRoute circuit if you already have one.

**What if I had configured Role-Based Access Control policies for my classic IaaS resources?**

During migration, the resources transform from classic to Resource Manager. So we recommend that you plan the RBAC policy updates that need to happen after migration.

**What if I’m using Azure Site Recovery or Azure Backup today?**

To migrate your Virtual Machine that are enabled for backup, see [I have backed up my classic VMs in backup vault. Now I want to migrate my VMs from classic mode to Resource Manager mode. How Can I backup them in recovery services vault?](../backup/backup-azure-backup-ibiza-faq.md#i-have-backed-up-my-classic-vms-in-backup-vault-now-i-want-to-migrate-my-vms-from-classic-mode-to-resource-manager-mode-how-can-i-backup-them-in-recovery-services-vault)

**Can I validate my subscription or resources to see if they're capable of migration?**

Yes. In the platform-supported migration option, the first step in preparing for migration is to validate that the resources are capable of migration. In case the validate operation fails, you receive messages for all the reasons the migration cannot be completed.

**What happens if I run into a quota error while preparing the IaaS resources for migration?**

We recommend that you abort your migration and then log a support request to increase the quotas in the region where you are migrating the VMs. After the quota request is approved, you can start executing the migration steps again.

**How do I report an issue?**

Post your issues and questions about migration to our [VM forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WAVirtualMachinesforWindows), with the keyword ClassicIaaSMigration. We recommend posting all your questions on this forum. If you have a support contract, you're welcome to log a support ticket as well.

**What if I don't like the names of the resources that the platform chose during migration?**

All the resources that you explicitly provide names for in the classic deployment model are retained during migration. In some cases, new resources are created. For example: a network interface is created for every VM. We currently don't support the ability to control the names of these new resources created during migration. Log your votes for this feature on the [Azure feedback forum](http://feedback.azure.com).

**I got a message *"VM is reporting the overall agent status as Not Ready. Hence, the VM cannot be migrated. Ensure that the VM Agent is reporting overall agent status as Ready"* or *"VM contains Extension whose Status is not being reported from the VM. Hence, this VM cannot be migrated."***

This message is received when the VM does not have outbound connectivity to the internet. The VM agent uses outbound connectivity to reach the Azure storage account for updating the agent status every five minutes.


## Next steps
Now that you understand the migration of classic IaaS resources to Resource Manager, you can start migrating resources.

- [Technical deep dive on platform-supported migration from classic to Azure Resource Manager](virtual-machines-windows-migration-classic-resource-manager-deep-dive.md)
- [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-ps-migration-classic-resource-manager.md)
- [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-linux-cli-migration-classic-resource-manager.md)
- [Clone a classic virtual machine to Azure Resource Manager by using community PowerShell scripts](virtual-machines-windows-migration-scripts.md)

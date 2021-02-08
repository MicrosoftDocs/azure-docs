---
title: Platform supported migration of Cloud Services (classic) to Azure Resource Manager
description: Overview of migration from Cloud Services (classic) to Cloud Service (extended support)
ms.topic: overview
ms.service: cloud-services-extended-support
author: tanmaygore
ms.author: tagore
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Platform supported migration of Cloud Services (classic) to Azure Resource Manager

This article provides an overview on the platform-supported migration tool, how to move your [Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md) to [Azure Cloud Services (extended support)](overview.md). Cloud Services (extended support) is a new Azure Resource Manager (ARM) based deployment model for Azure Cloud Services.

The migration tool utilizes the same APIs and has the same experience via Portal, Power Shell and CLI as that for Classic IaaS VM migration. 
Add Banner: Preview Product: we do not recommend using it to migrate production workload yet. 
Benefits 

The platform supported migration provides following key benefits:
1.	The migration is fully orchestrated by the platform, moving the entire deployment and associated resources to ARM.
2.	Provides seamless no downtime migration.
3.	Provides easy & fast migration compared to other migration paths by minimizing manual tasks. 

Learn more about benefits of [Cloud Services (extended support)](overview.md) and [Azure Resource Manager](../azure-resource-manager/management/overview.md). 

## Before you begin
1. Register your subscription for Classic Infrastructure.

    ```powershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
    ```

2.	Register your subscription for Cloud Services (extended support).

    ```powershell
    Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
    ```

3. Check the status of your registration: 

    ```powershell
    Get-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
    ```

## How is migration for Cloud Services (classic) different from Virtual Machines (classic)?
Azure Service Manager supports two different compute products, Azure Virtual Machines (classic) and Azure Cloud Services (classic). The two products differ based on the deployment type that lies within the hosted service (Cloud service). Azure Cloud Services (classic) uses Hosted Service containing deployments with PaaS VMs. Azure Virtual Machines (classic) uses a hosted service containing deployments with IaaS VMs. 
Due to difference in deployment type, the list of supported scenarios differ from Virtual Machines (classic). 

## Migration steps for this tool
 
Customers migrate their cloud service using the same four migration operations that exist today for VM (classic). 
1. Validate Migration - Performs fast validation of migration.
2. Prepare Migration – Duplicates resource metadata in ARM. All resources are locks for create/update/delete operations to ensure resource metadata is in sync across RDFE & ARM. All read operations will work using both CS(classic) & CS -ES APIs. I.e. resources are visible on both CS (classic) & CS-ES.  
3. Abort Migration - Removes resource metadata from ARM. Unlocks all resources for create/update/delete operations
4. Commit Migration - Removes resource metadata from RDFE. Unlocks the resource for create/update/delete operations. Abort is no longer allowed after commit has been attempted.


:::image type="content" source="media/in-place-migration-1.png" alt-text="Image shows diagram of steps associated with migration.":::

If Validate or Prepare failed, use the error message to understand the issue and identify the unsupported scenario. Use the workaround mentioned for this unsupported scenario to fix the issue. Retry migration after the fix. Prepare, Abort & Commit are idempotent and therefore, if failed, retry should fix the issue.

Since the tool is same for Virtual Machine (classic), please refer Virtual Machine (classic) migration documentation for more details on Migration flow & steps, how to plan for migration, how to migrate using Power shell or CLI & resource translations from classic to ARM representation. 

## Supported resources & features associated with Cloud Services (classic)
- 	Storage Accounts
- 	Virtual Networks
- 	Network Security Groups
- 	Reserved Public IPs
- 	Endpoint ACLs
- 	UDRs
- 	Internal load balancer
- 	Certificate migration to key vault
- 	Plugins & Extension (XML & Json based)
- 	On Start / On Stop Tasks
- 	All supported VM sizes (SQLG7, SQLG7_AMD, CosmosDBG5_JBOD will be available after it’s availability on CS-ES)
- 	Deployments with Accelerated Networking
- 	Deployments using single or multiple roles
- 	Multi-VIP & VIP Groups (Internal Only)
- 	Az Pinning (Internal Only)
- 	Basic load balancer
- 	Input, Instance Input, Internal Endpoints
- 	Dynamic Public IP
- 	DNS Name 
- 	Dedicated Node Group (DNG) (Internal Only)
- 	dSMS Secrets (Internal Only)
- 	Network Traffic Rules
- 	Hypernet VNet (Will be available before Public Preview)

## Supported configurations / migration scenarios
These are top scenarios involving combinations of resources, features and cloud services. This list is not exhaustive.

| Service |	Configuration | Comments |
|---|---|---|
| Azure AD Domain Services | Virtual networks that contain Azure AD Domain services | | 
| Cloud Service | Cloud service with deployment in only 1 slot | | 
| Cloud Service | Some deployment not in a Vnet and but in a hidden default vnet  Running Validate API can tell if a deployment is inside a default Vnet or not. If not, it is not supported for migration. | 
|Cloud Service | XML extensions (BGInfo 1.*, Visual Studio Debugger, Web Deploy, and Remote Debugging) | | 
| Virtual Network | Vnet containing multiple cloud services	| | 
| Virtual Network | Migration of Vnets created via Portal 
(Requires using “Group Resource-group-name VNet-Name” in Cscfg) | As part of migration, the Vnet name in cscfg will be changed to use ARM ID of the VNet. (subscription/subscription-id/resource-group/resource-group-name/resource/vnet-name) <br> To manage the deployment after migration, update the local copy of Cscfg to start using ARM ID instead of VNet name.  <br>A CSCFG that uses the old naming scheme will not pass validation. | 
| Virtual Network | Migration of deployment with roles in different subnet | | 
	

## Unsupported resources & features associated with Cloud Services (classic)
| Resource | Next steps / work around | 
|---|---|
| Auto Scale Rules | Migration goes through but rules are dropped. Recreate the rules after migration on CS-ES | 
| Alerts | Migration goes thru but alerts are dropped. Recreate the rules after migration on CS-ES | 
| VPN Gateway | Remove the VPN Gateway before beginning migration and then recreate the VPN Gateway once migration is complete. | 
| Express Route Gateway (in the same subscription as Virtual Network only) | Remove the ER Gateway before beginning migration and then recreate the ER Gateway once migration is completed to ARM. | 
| JIT Policies| Not supported. <br> Recreate the policies after migration. Existing rules are dropped after migration. | 
| Quota	 | Quota is not migrated automatically as part of migration. You need to request new quota on ARM for the validation to be successful. Once adequate quota is approved, the migration will go thru. | 
| Affinity Groups | Affinity Groups are legacy and not supported for migration. Learn more about them and how to remove it before migration. | 
| VNets using VNet Peering | 1.	Before migrating a VNet that is peered to another VNet(s), you will need to delete the peering. <br> 2.	Migrate the virtual network to Resource Manager <br> 3.	Re-create peering. 
Learn more about VNet Peering. This can cause downtime depending on the architecture. | 
| Virtual networks that contain App Service environments | This is currently not supported | 
| Virtual networks that contain HDInsight services | This is currently not supported | 
| Virtual networks that contain Azure API Management deployments | This is currently not supported. To migrate the VNET, change the VNET of the API Management deployment, which is a no downtime operation. | 
| Classic Express Route circuits | 
This is currently not supported. These circuits need to be migrated to Azure Resource Manager before beginning PaaS migration. To learn more, see Moving ExpressRoute circuits from the classic to the Resource Manager deployment model. |  
| Role-Based Access Control	| Post migration, the URI of the resource changes from Microsoft.ClassicCompute to Microsoft.Compute or Microsoft.Network, etc. RBAC policies needs to be updated after migration. | 
| Application Gateway | Remove the Application Gateway before beginning migration and then recreate the Application Gateway once migration is completed to ARM | 

## Unsupported configurations / Migration Scenarios

| Configuration / Scenario	| Next steps / work around | 
|---|---|
| Migration of some older deployments not in a Vnet | Some CS deployments not in a Vnet are currently not supported for migration due to infrastructure limitations. <br> 1. Use the Validate API to check if the deployment is migratable. <br> 2. Such migratable deployments will be moved to ARM under a Vnet with prefix “DefaultNetwork” | 
| Migration of deployments containing both Production & Staging slot deployment using dynamic IPs | Migration of a two slot cloud service requires deleting the staging slot. Once the staging slot is deleted, migrate the production slot as an independent cloud service (extended support) in ARM. Then redeploy the staging environment as a new cloud service (extended support) and make it swappable with the first one. | 
| Migration of deployments containing both Production & Staging slot deployment using Reserved IPs | This is currently not supported. | 
| Migration of production & staging deployment in different Vnet| Migration of a two slot cloud service requires deleting the staging slot. Once the staging slot is deleted, migrate the production slot as an independent cloud service (extended support) in ARM. Then redeploy the staging environment as a new cloud service (extended support) and make it swappable with the first one. | 
| Migration of empty cloud service (Cloud Service with no deployment) | This is not supported. As there isn’t a concept of hosted services in ARM, CS-ES do not support empty deployments | 
| Migration of deployment containing both RDP plugin & RDP Extension | Option 1: Remove the RDP plugin before migration. Will need changes to deployment files. Migration will then go thru. <br> Option 2: Remove RDP Extension & migrate the deployment. Post-migration, remove the plugin & install the extension. This will cause deployment file changes. <br>Note: Plugins are not recommended for use on CS-ES. Learn More. | 
| Virtual network with both PaaS & IaaS deployment | Move either the PaaS or IaaS deployments into a different virtual network. This will cause downtime. | 
Cloud service deployments using legacy role sizes (such as Small or ExtraLarge). | The migration will complete, but the role sizes will be updated to leverage modern role sizes. There is no change in cost or SKU properties and VM will not be rebooted for this change. Add link to sizing doc|
 | Migration of cloud service to different Vnet | This is not supported as part of the migration tool. <br> 1. Move the deployment to a different classic vnet before migration. This will cause downtime. <br> 2. Migrate the new vnet to ARM. <br> Or <br> 1. Migrate the vnet to ARM <br>2. Move the cloud service to a new VNet. This will cause downtime. | 
| Cloud Service that belong to a virtual network but don't have an explicit subnet assigned | This is not supported. | 


## Post Migration Changes
After the migration is completed, the Cloud Services (classic) deployment gets converted to a Cloud Service (extended support) deployment. Therefore, you must start using all the APIs and experience for Cloud Services (extended support) to manage your deployment. Please refer to Cloud Services (extended support) documentation for more details. 


## Next steps
-	How to migrate video:   In-Place-Migration.mp4
-	(Internal Only) Support Trainings
- Session 1: Go to your video now 
- Session 2: Go to your video now 
-	Migration Flow & Steps. Cloud Services (classic) follow the same migration flow as for VM (classic)
-	How to migrate using Powershell. Cloud Services use the same process and commands as that for VM (classic). 
-	Migrate Storage Accounts & Unassociated resources
-	Resource Translation from classic to ARM representation
-	How to plan for Migration
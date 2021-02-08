---
title: Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)
description: Overview of migration from Cloud Services (classic) to Cloud Service (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: tanmaygore
ms.author: tagore
ms.reviewer: mimckitt
ms.date: 2/08/2021
ms.custom: 
---

# Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)

This article provides an overview on the platform-supported migration tool and how to use it to migrate [Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md) to [Azure Cloud Services (extended support)](overview.md).

The migration tool utilizes the same APIs and has the same experience via Portal, Power Shell and CLI as that for Classic IaaS Virtual Machine migration. 

> [!IMPORTANT]
> Migrating from Cloud Services (classic) to Cloud Services (extended support) using the migration tool is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


The platform supported migration provides following key benefits:
1. The migration is fully orchestrated by the platform, moving the entire deployment and associated resources to Azure Resource Manager.
2. Provides seamless no downtime migration.
3. Provides easy and fast migration compared to other migration paths by minimizing manual tasks. 

For additional benefits and why you should migrate, see [Cloud Services (extended support)](overview.md) and [Azure Resource Manager](../azure-resource-manager/management/overview.md). 

## Before you begin
1. Register your subscription for Classic Infrastructure.

    ```powershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate
    ```

2.	Register your subscription for Cloud Services (extended support).

    ```powershell
    Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
    ```

3. Check the status of your registration.

    ```powershell
    Get-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
    ```

## How is migration for Cloud Services (classic) different from Virtual Machines (classic)?
Azure Service Manager supports two different compute products, Azure Virtual Machines (classic) and [Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md). The two products differ based on the deployment type that lies within the hosted service. Azure Cloud Services (classic) uses Hosted Service containing deployments with PaaS Virtual Machines. Azure Virtual Machines (classic) uses a hosted service containing deployments with IaaS Virtual Machines. 
Due to difference in deployment type, the list of supported scenarios differ from Virtual Machines (classic). 

## Migration steps for this tool
 
Customers can manage their migration of Cloud Services (classic) the same four operations that exist today for Virtual Machines (classic). 
1. **Validate Migration** - Performs fast validation of migration.
2. **Prepare Migration** – Duplicates resource metadata in Azure Resource Manager. All resources are locks for create/update/delete operations to ensure resource metadata is in sync across Azure Resource Manager and Azure Resource Manager. All read operations will work using both CS(classic) and Cloud Services (extended support) APIs.
3. **Abort Migration** - Removes resource metadata from Azure Resource Manager. Unlocks all resources for create/update/delete operations
4. **Commit Migration** - Removes resource metadata from Azure Service Manager. Unlocks the resource for create/update/delete operations. Abort is no longer allowed after commit has been attempted.


:::image type="content" source="media/in-place-migration-1.png" alt-text="Image shows diagram of steps associated with migration.":::

For more information, see [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md)

## Supported resources and features available for migration associated with Cloud Services (classic)
- 	Storage Accounts
- 	Virtual Networks
- 	Network Security Groups
- 	Reserved Public IPs
- 	Endpoint ACLs
- 	User Defined Routes
- 	Internal load balancer
- 	Certificate migration to key vault
- 	Plugins and Extension (XML and Json based)
- 	On Start / On Stop Tasks
- 	Deployments with Accelerated Networking
- 	Deployments using single or multiple roles
- 	Basic load balancer
- 	Input, Instance Input, Internal Endpoints
- 	Dynamic Public IP
- 	DNS Name 
- 	Network Traffic Rules
- 	Hypernet VNet

## Supported configurations / migration scenarios
These are top scenarios involving combinations of resources, features and Cloud Services. This list is not exhaustive.

| Service |	Configuration | Comments |
|---|---|---|
| Azure AD Domain Services | Virtual networks that contain Azure AD Domain services | | 
| Cloud Service | Cloud Service with deployment in only 1 slot | | 
| Cloud Service | Some deployment not in a Vnet and but in a hidden default virtual network  Running Validate API can tell if a deployment is inside a default Vnet or not. If not, it is not supported for migration. | 
|Cloud Service | XML extensions (BGInfo 1.*, Visual Studio Debugger, Web Deploy, and Remote Debugging) | | 
| Virtual Network | Vnet containing multiple Cloud Services	| | 
| Virtual Network | Migration of Vnets created via Portal 
(Requires using “Group Resource-group-name VNet-Name” in Cscfg) | As part of migration, the Vnet name in cscfg will be changed to use Azure Resource Manager ID of the VNet. (subscription/subscription-id/resource-group/resource-group-name/resource/virtual network-name) <br> To manage the deployment after migration, update the local copy of Cscfg to start using Azure Resource Manager ID instead of VNet name.  <br>A CSCFG that uses the old naming scheme will not pass validation. | 
| Virtual Network | Migration of deployment with roles in different subnet | | 
	

## Unsupported resources and features associated with Cloud Services (classic)
| Resource | Next steps / work around | 
|---|---|
| Auto Scale Rules | Migration goes through but rules are dropped. Recreate the rules after migration on Cloud Services (extended support) | 
| Alerts | Migration goes thru but alerts are dropped. Recreate the rules after migration on Cloud Services (extended support) | 
| VPN Gateway | Remove the VPN Gateway before beginning migration and then recreate the VPN Gateway once migration is complete. | 
| Express Route Gateway (in the same subscription as Virtual Network only) | Remove the ER Gateway before beginning migration and then recreate the ER Gateway once migration is completed to Azure Resource Manager. | 
| JIT Policies| Not supported. <br> Recreate the policies after migration. Existing rules are dropped after migration. | 
| Quota	 | Quota is not migrated automatically as part of migration. You need to request new quota on Azure Resource Manager for the validation to be successful. Once adequate quota is approved, the migration will go thru. | 
| Affinity Groups | Affinity Groups are legacy and not supported for migration. Learn more about them and how to remove it before migration. | 
| VNets using VNet Peering | 1.	Before migrating a VNet that is peered to another VNet(s), you will need to delete the peering. <br> 2.	Migrate the virtual network to Resource Manager <br> 3.	Re-create peering. 
Learn more about VNet Peering. This can cause downtime depending on the architecture. | 
| Virtual networks that contain App Service environments | Not supported | 
| Virtual networks that contain HDInsight services | Not supported. | 
| Virtual networks that contain Azure API Management deployments | Not supported. To migrate the virtual network, change the virtual network of the API Management deployment, which is a no downtime operation. | 
| Classic Express Route circuits | 
Not supported. These circuits need to be migrated to Azure Resource Manager before beginning PaaS migration. To learn more, see [Moving ExpressRoute circuits from the classic to the Resource Manager deployment model](../expressroute/expressroute-howto-move-arm.md). |  
| Role-Based Access Control	| Post migration, the URI of the resource changes from Microsoft.ClassicCompute to Microsoft.Compute or Microsoft.Network, etc. RBAC policies needs to be updated after migration. | 
| Application Gateway | Remove the Application Gateway before beginning migration and then recreate the Application Gateway once migration is completed to Azure Resource Manager | 

## Unsupported configurations / Migration Scenarios

| Configuration / Scenario	| Next steps / work around | 
|---|---|
| Migration of some older deployments not in a Vnet | Some Cloud Service deployments not in a Vnet are currently not supported for migration due to infrastructure limitations. <br> 1. Use the Validate API to check if the deployment is eligible to migrate. <br> 2. If eligible, the deployments will be moved to Azure Resource Manager under a Vnet with prefix “DefaultNetwork” | 
| Migration of deployments containing both Production and Staging slot deployment using dynamic IPs | Migration of a two slot Cloud Service requires deleting the staging slot. Once the staging slot is deleted, migrate the production slot as an independent Cloud Service (extended support) in Azure Resource Manager. Then redeploy the staging environment as a new Cloud Service (extended support) and make it swappable with the first one. | 
| Migration of deployments containing both Production and Staging slot deployment using Reserved IPs | Not supported. | 
| Migration of production and staging deployment in different Vnet| Migration of a two slot Cloud Service requires deleting the staging slot. Once the staging slot is deleted, migrate the production slot as an independent Cloud Service (extended support) in Azure Resource Manager. Then redeploy the staging environment as a new Cloud Service (extended support) and make it swappable with the first one. | 
| Migration of empty Cloud Service (Cloud Service with no deployment) | Not supported. As there isn’t a concept of hosted services in Azure Resource Manager, Cloud Services (extended support) do not support empty deployments | 
| Migration of deployment containing both RDP plugin and RDP Extension | Option 1: Remove the RDP plugin before migration. Will need changes to deployment files. Migration will then go thru. <br> Option 2: Remove RDP Extension and migrate the deployment. Post-migration, remove the plugin and install the extension. This will cause deployment file changes. <br>Note: Plugins are not recommended for use on Cloud Services (extended support). Learn More. | 
| Virtual network with both PaaS and IaaS deployment | Move either the PaaS or IaaS deployments into a different virtual network. This will cause downtime. | 
Cloud Service deployments using legacy role sizes (such as Small or ExtraLarge). | The migration will complete, but the role sizes will be updated to leverage modern role sizes. There is no change in cost or SKU properties and Virtual Machine will not be rebooted for this change. Add link to sizing doc|
 | Migration of Cloud Service to different Vnet | Not supported as part of the migration tool. <br><br> 1. Move the deployment to a different classic virtual network before migration. This will cause downtime. <br> 2. Migrate the new virtual network to Azure Resource Manager. <br> Or <br> 1. Migrate the virtual network to Azure Resource Manager <br>2. Move the Cloud Service to a new VNet. This will cause downtime. | 
| Cloud Service that belong to a virtual network but don't have an explicit subnet assigned | Not supported. | 


## Post Migration Changes
After the migration is completed, the Cloud Services (classic) deployment gets converted to a Cloud Service (extended support) deployment. Therefore, you must start using all the APIs and experience for Cloud Services (extended support) to manage your deployment. Please refer to Cloud Services (extended support) documentation for more details. 


## Next steps
- [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md)
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

The migration tool utilizes the same APIs and has the same experience as the [Virtual Machine (classic) migration](https://docs.microsoft.com/azure/virtual-machines/migration-classic-resource-manager-overview). 

> [!IMPORTANT]
> Migrating from Cloud Services (classic) to Cloud Services (extended support) using the migration tool is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Migration benefits
The platform supported migration provides following key benefits:
- The migration is fully orchestrated by the platform, moving the entire deployment and associated resources to Azure Resource Manager.
- No downtime migration.
- Easy and fast migration compared to other migration paths by minimizing manual tasks. 

For additional benefits and why you should migrate, see [Cloud Services (extended support)](overview.md) and [Azure Resource Manager](../azure-resource-manager/management/overview.md). 

## How is migration for Cloud Services (classic) different from Virtual Machines (classic)?
Azure Service Manager supports two different compute products, [Azure Virtual Machines (classic)](..//azure-resource-manager/management/deployment-models.md) and [Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md). The two products differ based on the deployment type that lies within the hosted service. Azure Cloud Services (classic) uses a hosted service containing deployments with PaaS Virtual Machines. Azure Virtual Machines (classic) uses a hosted service containing deployments with IaaS Virtual Machines. 

Due to differences in deployment types, the list of supported scenarios differ Cloud Services (classic) than from Virtual Machines (classic). 

## Migration steps for this tool
 
Customers can manage their migration of Cloud Services (classic) using the same four operations used to migrate Virtual Machines (classic). 
1. **Validate Migration** - Performs validation of migration.
2. **Prepare Migration** – Duplicates the resource metadata in Azure Resource Manager. All resources are locked for create/update/delete operations to ensure resource metadata is in sync across Azure Server Manager and Azure Resource Manager. All read operations will work using both Cloud Services (classic) and Cloud Services (extended support) APIs.
3. **Abort Migration** - Removes resource metadata from Azure Resource Manager. Unlocks all resources for create/update/delete operations.
4. **Commit Migration** - Removes resource metadata from Azure Service Manager. Unlocks the resource for create/update/delete operations. Abort is no longer allowed after commit has been attempted.


:::image type="content" source="media/in-place-migration-1.png" alt-text="Image shows diagram of steps associated with migration.":::

For more information, see [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md)

## Supported resources and features available for migration associated with Cloud Services (classic)
- 	Storage Accounts
- 	Virtual Networks
- 	Network Security Groups
- 	Reserved Public IP addresses
- 	Endpoint Access Control Lists
- 	User Defined Routes
- 	Internal load balancer
- 	Certificate migration to key vault
- 	Plugins and Extension (XML and Json based)
- 	On Start / On Stop Tasks
- 	Deployments with Accelerated Networking
- 	Deployments using single or multiple roles
- 	Basic load balancer
- 	Input, Instance Input, Internal Endpoints
- 	Dynamic Public IP addresses
- 	DNS Name 
- 	Network Traffic Rules
- 	Hypernet VNet

## Supported configurations / migration scenarios
These are top scenarios involving combinations of resources, features and Cloud Services. This list is not exhaustive.

| Service |	Configuration | Comments | 
|---|---|---|
| Azure AD Domain Services | Virtual networks that contain Azure Active Directory Domain services. | Virtual network containing both Cloud Service deployment and Azure AD Domain services is supported. Customer first needs to separately migrate Azure AD Domain services and then migrate the VNet left only with the Cloud Service deployment |
| Cloud Service | Cloud Service with a deployment in a single slot only. | Cloud Services containing either a prod or staging slot deployment can be migrated |
| Cloud Service | Deployment not in a virtual network but in a hidden default virtual network | A Cloud Service can be in a publicly visible vnet, in a hidden vnet or not in any vnet.  Cloud Services in a hidden vnet & publicly visible vnet are supported for migration. Customer can use the Running Validate API to tell if a deployment is inside a default Vnet or not and thus determine if it can be migrated. |
|Cloud Service | XML extensions (BGInfo, Visual Studio Debugger, Web Deploy, and Remote Debugging). | All xml extensions are supported for migration 
| Virtual Network | Virtual network containing multiple Cloud Services.	| Virtual network contain multiple cloud services is supported for migration. The Vnet and all the Cloud Services within it will be migrated together to ARM. |
| Virtual Network | Migration of Vnets created via Portal      (Requires using “Group Resource-group-name VNet-Name” in Cscfg)  | As part of migration, the Vnet name in cscfg will be changed to use ARM ID of the VNet. (subscription/subscription-id/resource-group/resource-group-name/resource/vnet-name) <br><br>To manage the deployment after migration, update the local copy of Cscfg to start using ARM ID instead of VNet name. <br><br>A CSCFG that uses the old naming scheme will not pass validation. 
| Virtual Network | Migration of deployment with roles in different subnet. | A cloud service with different roles in different subnets is supported for migration. |
	

## Resources and features not available for migration
| Resource | Next steps / work around | 
|---|---|
| Auto Scale Rules | Migration goes through but rules are dropped. [Recreate the rules](https://docs.microsoft.com/azure/cloud-services-extended-support/configure-scaling) after migration on Cloud Services (extended support). | 
| Alerts | Migration goes through but alerts are dropped. [Recreate the rules](https://docs.microsoft.com/azure/cloud-services-extended-support/enable-alerts) after migration on Cloud Services (extended support). | 
| VPN Gateway | Remove the VPN Gateway before beginning migration and then recreate the VPN Gateway once migration is complete. | 
| Express Route Gateway (in the same subscription as Virtual Network only) | Remove the Express Route Gateway before beginning migration and then recreate the Gateway once migration is complete. | 
| JIT Policies| Not supported. <br><br> Recreate the policies after migration. Existing rules are dropped after migration. | 
| Quota	 | Quota is not migrated. [Request new quota](https://docs.microsoft.com/azure/azure-resource-manager/templates/error-resource-quota#solution) on Azure Resource Manager prior to migration for the validation to be successful. | 
| Affinity Groups | Not supported. Remove any affinity groups before migration.  | 
| Virtual networks using virtual network peering| Before migrating a virtual network that is peered to another virtual network, delete the peering, migrate the virtual network to Resource Manager and re-create peering. This can cause downtime depending on the architecture. | 
| Virtual networks that contain App Service environments | Not supported | 
| Virtual networks that contain HDInsight services | Not supported. 
| Virtual networks that contain Azure API Management deployments | Not supported. <br><br> To migrate the virtual network, change the virtual network of the API Management deployment. This is a no downtime operation. | 
| Classic Express Route circuits | Not supported. <br><br>These circuits need to be migrated to Azure Resource Manager before beginning PaaS migration. To learn more, see [Moving ExpressRoute circuits from the classic to the Resource Manager deployment model](../expressroute/expressroute-howto-move-arm.md). |  
| Role-Based Access Control	| Post migration, the URI of the resource changes from `Microsoft.ClassicCompute` to `Microsoft.Compute` RBAC policies needs to be updated after migration. | 
| Application Gateway | Not Supported. <br><br> Remove the Application Gateway before beginning migration and then recreate the Application Gateway once migration is completed to Azure Resource Manager | 

## Unsupported configurations / migration scenarios

| Configuration / Scenario	| Next steps / work around | 
|---|---|
| Migration of some older deployments not in a Vnet | Some Cloud Service deployments not in a virtual network are not supported for migration. <br><br> 1. Use the validate API to check if the deployment is eligible to migrate. <br> 2. If eligible, the deployments will be moved to Azure Resource Manager under a virtual network with prefix of “DefaultNetwork” | 
| Migration of deployments containing both production and staging slot deployment using dynamic IP addresses | Migration of a two slot Cloud Service requires deletion of the staging slot. Once the staging slot is deleted, migrate the production slot as an independent Cloud Service (extended support) in Azure Resource Manager. Then redeploy the staging environment as a new Cloud Service (extended support) and make it swappable with the first one. | 
| Migration of deployments containing both production and staging slot deployment using Reserved IP addresses | Not supported. | 
| Migration of production and staging deployment in different virtual network|Migration of a two slot cloud service requires deleting the staging slot. Once the staging slot is deleted, migrate the production slot as an independent cloud service (extended support) in ARM. A new CSES deployment can then be linked to the migrated deployment with swappable property enabled. Deployments files of the old staging slot deployment can be reused to create this new swappable deployment. | 
| Migration of empty Cloud Service (Cloud Service with no deployment) | Not supported. | 
| Migration of deployment containing the remote desktop plugin and the remote desktop extensions | Not supported <br><br> Remove the plugin and extension before migration. [Plugins are not recommended](https://docs.microsoft.com/azure/cloud-services-extended-support/deploy-prerequisite#required-service-definition-file-csdef-updates) for use on Cloud Services (extended support).| 
| Virtual network with both PaaS and IaaS deployment |Not Supported <br><br> Move either the PaaS or IaaS deployments into a different virtual network. This will cause downtime. | 
Cloud Service deployments using legacy role sizes (such as Small or ExtraLarge). | The migration will complete, but the role sizes will be updated to leverage modern role sizes. There is no change in cost or SKU properties and virtual machine will not be rebooted for this change. Update all deployment artifacts to reference these new modern role sizes. For more information see, [Available VM sizes](available-sizes.md)|
| Migration of Cloud Service to different virtual network | Not supported <br><br> 1. Move the deployment to a different classic virtual network before migration. This will cause downtime. <br> 2. Migrate the new virtual network to Azure Resource Manager. <br><br> Or <br><br> 1. Migrate the virtual network to Azure Resource Manager <br>2. Move the Cloud Service to a new virtual network. This will cause downtime. | 
| Cloud Service that belong to a virtual network but don't have an explicit subnet assigned | Not supported. | 


## Post Migration Changes
After the migration is completed, the Cloud Services (classic) deployment gets converted to a Cloud Service (extended support) deployment. Therefore, you must start using all the APIs and experience for Cloud Services (extended support) to manage your deployment. Refer to [Cloud Services (extended support) documentation](deploy-prerequisite.md) for more details.  

### Changes to deployment files 

Minor changes are made to customer’s Csdef & Cscfg to make the deployment files conform to the ARM & CS-ES requirements. Post migration retrieve your new deployment files or update the existing files. This will be needed for update/delete operations.  

- Virtual Network uses full ARM resource ID instead of just the resource name in the netcfg section of the .cscfg. Eg. /subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Network/virtualNetworks/vnet-name. For VNets belonging to the same resource group as the cloud service, you can choose to update the .cscfg back to using just the VNet name.  

- Classic sizes like small, large, extra large are replaced by their new size names, Standard_A*. The size names needs to be changed to their new names in Csdef, Cscfg. As part of migration, this change is automatically done.  

- Customers can use the Get API to get the latest copy of their deployment files. 
    - Get the template using [Portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal), [Powershell](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-powershell#export-resource-groups-to-templates), [CLI](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-cli#export-resource-groups-to-templates), and [Rest API](https://docs.microsoft.com/rest/api/resources/resourcegroups/exporttemplate) 
    - Get the .csdef file using Portal, [Powershell](https://docs.microsoft.com/powershell/module/az.cloudservice/?view=azps-5.4.0#cloudservice), or [Rest API](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-get-package). 
    - Get the .cscfg file using Portal, [Powershell](https://docs.microsoft.com/powershell/module/az.cloudservice/?view=azps-5.4.0#cloudservice), or [Rest API](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-get-package). 
    
 

### Changes to customer’s Automation, CI/CD pipeline, custom scripts, custom dashboards, custom tooling, etc.  

Customers need to update their tooling and automation to start using the new APIs / commands to manage their deployment. Customer can easily adopt new features and capabilities of ARM/CS-ES as part of this change. 

- Changes to Resource & Resource Group names post migration
    - As part of migration, the names of few resources like the Cloud Service, public IP, etc. change. These changes might need to be reflected in deployment files before update of Cloud Service. “Translation of Resource & its name after migration” section talks about these changes. [Learn More about the names of resources changing](in-place-migration-technical-details.md).  

- Recreate rules & policies required to manage and scale cloud services 
    - Auto Scale rules are not migrated. After migration, recreate the auto scale rules.  
    - Alerts are not migrated. After migration, recreate the alerts. -
    - Key Vault is created without any access policies. Recreate the policies on Key Vault to access the certificates.  

 

## Next steps
- [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md)
- Migrate to Cloud Services (extended support) using the [Azure portal](in-place-migration-portal.md)]
- Migrate to Cloud Services (extended support) using [PowerShell](in-place-migration-powershell.md)

---
title: Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)
description: Overview of migration from Cloud Services (classic) to Cloud Service (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
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

Refer to the following resources if you need assistance with your migration: 

- [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html): Microsoft and community support for migration.
- [Azure Migration Support](https://ms.portal.azure.com/#create/Microsoft.Support/Parameters/%7B%22pesId%22:%22e79dcabe-5f77-3326-2112-74487e1e5f78%22,%22supportTopicId%22:%22fca528d2-48bd-7c9f-5806-ce5d5b1d226f%22%7D): Dedicated support team for technical assistance during migration. Customers without technical support can use [free support capability](https://aka.ms/cs-migration-errors) provided specifically for this migration.
- If your company/organization has partnered with Microsoft or works with Microsoft representatives such as cloud solution architects or technical account managers, reach out to them for more resources for migration.
- Complete [this survey](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR--AgudUMwJKgRGMO84rHQtUQzZYNklWUk4xOTFXVFBPOFdGOE85RUIwVC4u) to provide feedback or raise issues to the Cloud Services (extended support) product team. 

## Migration benefits
The platform supported migration provides following key benefits:
- The migration is fully orchestrated by the platform, moving the entire deployment and associated resources to Azure Resource Manager.
- No downtime migration.
- Easy and fast migration compared to other migration paths by minimizing manual tasks. 
- Retains Cloud Services IP Address and DNS label as part of the migration. 

For other benefits and why you should migrate, see [Cloud Services (extended support)](overview.md) and [Azure Resource Manager](../azure-resource-manager/management/overview.md). 

## Setup access for migration

To perform this migration, you must be added as a coadministrator for the subscription and register the providers needed. 

1. Sign in to the Azure portal.
3. On the Hub menu, select Subscription. If you don't see it, select All services.
3. Find the appropriate subscription entry, and then look at the MY ROLE field. For a coadministrator, the value should be Account admin. If you're not able to add a co-administrator, contact a service administrator or co-administrator for the subscription to get yourself added.

4. Register your subscription for Classic Infrastructure using PowerShell.

    ```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate 
    ```
 
5. Register your subscription for Cloud Services (extended support) using PowerShell. 

    ```powershell
    Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute 
    ```

6. Check the status of your registration. Registration can take a few minutes to complete. 

    ```powershell
    Get-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute 
    ```

## How is migration for Cloud Services (classic) different from Virtual Machines (classic)?
Azure Service Manager supports two different compute products, [Azure Virtual Machines (classic)](https://docs.microsoft.com/previous-versions/azure/virtual-machines/windows/classic/tutorial-classic) and [Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md) or Web/ Worker roles. The two products differ based on the deployment type that lies within the Cloud Service. Azure Cloud Services (classic) uses Cloud Service containing deployments with Web/Worker roles. Azure Virtual Machines (classic) uses a cloud service containing deployments with IaaS VMs.

The list of supported scenarios differ between Cloud Services (classic) and Virtual Machines (classic) because of differences in the deployment types.

## Migration steps
 
Customers can migrate their Cloud Services (classic) deployments using the same four operations used to migrate Virtual Machines (classic). 

1. **Validate Migration** - Validates that the migration will not be prevented by common unsupported scenarios.
2. **Prepare Migration** – Duplicates the resource metadata in Azure Resource Manager. All resources are locked for create/update/delete operations to ensure resource metadata is in sync across Azure Server Manager and Azure Resource Manager. All read operations will work using both Cloud Services (classic) and Cloud Services (extended support) APIs.
3. **Abort Migration** - Removes resource metadata from Azure Resource Manager. Unlocks all resources for create/update/delete operations.
4. **Commit Migration** - Removes resource metadata from Azure Service Manager. Unlocks the resource for create/update/delete operations. Abort is no longer allowed after commit has been attempted.

>[!NOTE]
> Prepare, Abort and Commit are idempotent and therefore, if failed, a retry should fix the issue.

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
- 	Hypernet virtual network

## Supported configurations / migration scenarios
These are top scenarios involving combinations of resources, features, and Cloud Services. This list is not exhaustive.

| Service |	Configuration | Comments | 
|---|---|---|
| [Azure AD Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/migrate-from-classic-vnet) | Virtual networks that contain Azure Active Directory Domain services. | Virtual network containing both Cloud Service deployment and Azure AD Domain services is supported. Customer first needs to separately migrate Azure AD Domain services and then migrate the virtual network left only with the Cloud Service deployment |
| Cloud Service | Cloud Service with a deployment in a single slot only. | Cloud Services containing either a prod or staging slot deployment can be migrated |
| Cloud Service | Deployment not in a publicly visible virtual network (default virtual network deployment) | A Cloud Service can be in a publicly visible virtual network, in a hidden virtual network or not in any virtual network.  Cloud Services in a hidden virtual network and publicly visible virtual networks are supported for migration. Customer can use the Validate API to tell if a deployment is inside a default virtual network or not and thus determine if it can be migrated. |
|Cloud Service | XML extensions (BGInfo, Visual Studio Debugger, Web Deploy, and Remote Debugging). | All xml extensions are supported for migration 
| Virtual Network | Virtual network containing multiple Cloud Services.	| Virtual network contain multiple cloud services is supported for migration. The virtual network and all the Cloud Services within it will be migrated together to Azure Resource Manager. |
| Virtual Network | Migration of virtual networks created via Portal (Requires using “Group Resource-group-name VNet-Name” in .cscfg file)  | As part of migration, the virtual network name in cscfg will be changed to use Azure Resource Manager ID of the virtual network. (subscription/subscription-id/resource-group/resource-group-name/resource/vnet-name) <br><br>To manage the deployment after migration, update the local copy of .cscfg file to start using Azure Resource Manager ID instead of virtual network name. <br><br>A .cscfg file that uses the old naming scheme will not pass validation. 
| Virtual Network | Migration of deployment with roles in different subnet. | A cloud service with different roles in different subnets is supported for migration. |
	

## Resources and features not available for migration
These are top scenarios involving combinations of resources, features and Cloud Services. This list is not exhaustive. 

| Resource | Next steps / work-around | 
|---|---|
| Auto Scale Rules | Migration goes through but rules are dropped. [Recreate the rules](https://docs.microsoft.com/azure/cloud-services-extended-support/configure-scaling) after migration on Cloud Services (extended support). | 
| Alerts | Migration goes through but alerts are dropped. [Recreate the rules](https://docs.microsoft.com/azure/cloud-services-extended-support/enable-alerts) after migration on Cloud Services (extended support). | 
| VPN Gateway | Remove the VPN Gateway before beginning migration and then recreate the VPN Gateway once migration is complete. | 
| Express Route Gateway (in the same subscription as Virtual Network only) | Remove the Express Route Gateway before beginning migration and then recreate the Gateway once migration is complete. | 
| Quota	 | Quota is not migrated. [Request new quota](https://docs.microsoft.com/azure/azure-resource-manager/templates/error-resource-quota#solution) on Azure Resource Manager prior to migration for the validation to be successful. | 
| Affinity Groups | Not supported. Remove any affinity groups before migration.  | 
| Virtual networks using [virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview)| Before migrating a virtual network that is peered to another virtual network, delete the peering, migrate the virtual network to Resource Manager and re-create peering. This can cause downtime depending on the architecture. | 
| Virtual networks that contain App Service environments | Not supported | 
| Virtual networks that contain HDInsight services | Not supported. 
| Virtual networks that contain Azure API Management deployments | Not supported. <br><br> To migrate the virtual network, change the virtual network of the API Management deployment. This is a no downtime operation. | 
| Classic Express Route circuits | Not supported. <br><br>These circuits need to be migrated to Azure Resource Manager before beginning PaaS migration. To learn more, see [Moving ExpressRoute circuits from the classic to the Resource Manager deployment model](../expressroute/expressroute-howto-move-arm.md). |  
| Role-Based Access Control	| Post migration, the URI of the resource changes from `Microsoft.ClassicCompute` to `Microsoft.Compute` RBAC policies needs to be updated after migration. | 
| Application Gateway | Not Supported. <br><br> Remove the Application Gateway before beginning migration and then recreate the Application Gateway once migration is completed to Azure Resource Manager | 

## Unsupported configurations / migration scenarios

| Configuration / Scenario	| Next steps / work-around | 
|---|---|
| Migration of some older deployments not in a virtual network | Some Cloud Service deployments not in a virtual network are not supported for migration. <br><br> 1. Use the validate API to check if the deployment is eligible to migrate. <br> 2. If eligible, the deployments will be moved to Azure Resource Manager under a virtual network with prefix of “DefaultRdfeVnet” | 
| Migration of deployments containing both production and staging slot deployment using dynamic IP addresses | Migration of a two slot Cloud Service requires deletion of the staging slot. Once the staging slot is deleted, migrate the production slot as an independent Cloud Service (extended support) in Azure Resource Manager. Then redeploy the staging environment as a new Cloud Service (extended support) and make it swappable with the first one. | 
| Migration of deployments containing both production and staging slot deployment using Reserved IP addresses | Not supported. | 
| Migration of production and staging deployment in different virtual network|Migration of a two slot cloud service requires deleting the staging slot. Once the staging slot is deleted, migrate the production slot as an independent cloud service (extended support) in Azure Resource Manager. A new Cloud Services (extended support) deployment can then be linked to the migrated deployment with swappable property enabled. Deployments files of the old staging slot deployment can be reused to create this new swappable deployment. | 
| Migration of empty Cloud Service (Cloud Service with no deployment) | Not supported. | 
| Migration of deployment containing the remote desktop plugin and the remote desktop extensions | Option 1: Remove the remote desktop plugin before migration. This requires changes to deployment files. The migration will then go through. <br><br> Option 2: Remove remote desktop extension and migrate the deployment. Post-migration, remove the plugin and install the extension. This requires changes to deployment files. <br><br> Remove the plugin and extension before migration. [Plugins are not recommended](https://docs.microsoft.com/azure/cloud-services-extended-support/deploy-prerequisite#required-service-definition-file-csdef-updates) for use on Cloud Services (extended support).| 
| Virtual networks with both PaaS and IaaS deployment |Not Supported <br><br> Move either the PaaS or IaaS deployments into a different virtual network. This will cause downtime. | 
Cloud Service deployments using legacy role sizes (such as Small or ExtraLarge). | The migration will complete, but the role sizes will be updated to use modern role sizes. There is no change in cost or SKU properties and virtual machine will not be rebooted for this change. Update all deployment artifacts to reference these new modern role sizes. For more information, see [Available VM sizes](available-sizes.md)|
| Migration of Cloud Service to different virtual network | Not supported <br><br> 1. Move the deployment to a different classic virtual network before migration. This will cause downtime. <br> 2. Migrate the new virtual network to Azure Resource Manager. <br><br> Or <br><br> 1. Migrate the virtual network to Azure Resource Manager <br>2. Move the Cloud Service to a new virtual network. This will cause downtime. | 
| Cloud Service in a virtual network but does not have an explicit subnet assigned | Not supported. Mitigation involves moving the role into a subnet, which requires a role restart (downtime) | 


## Post Migration Changes
The Cloud Services (classic) deployment is converted to a Cloud Service (extended support) deployment. Refer to [Cloud Services (extended support) documentation](deploy-prerequisite.md) for more details.  

### Changes to deployment files 

Minor changes are made to customer’s .csdef and .cscfg file to make the deployment files conform to the Azure Resource Manager and Cloud Services (extended support) requirements. Post migration retrieves your new deployment files or update the existing files. This will be needed for update/delete operations.  

- Virtual Network uses full Azure Resource Manager resource ID instead of just the resource name in the NetworkConfiguration section of the .cscfg file. For example, `/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Network/virtualNetworks/vnet-name`. For virtual networks belonging to the same resource group as the cloud service, you can choose to update the .cscfg file back to using just the virtual network name.  

- Classic sizes like Small, Large, ExtraLarge are replaced by their new size names, Standard_A*. The size names need to be changed to their new names in .csdef file. For more information, see [Cloud Services (extended support) deployment prerequisites](deploy-prerequisite.md#required-service-definition-file-csdef-updates)

- Use the Get API to get the latest copy of the deployment files. 
    - Get the template using [Portal](https://docs.microsoft.com/azure/azure-resource-manager/templates/export-template-portal), [PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-powershell#export-resource-groups-to-templates), [CLI](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-cli#export-resource-groups-to-templates), and [Rest API](https://docs.microsoft.com/rest/api/resources/resourcegroups/exporttemplate) 
    - Get the .csdef file using [PowerShell](https://docs.microsoft.com/powershell/module/az.cloudservice/?view=azps-5.4.0#cloudservice&preserve-view=true) or [Rest API](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-get-package). 
    - Get the .cscfg file using [PowerShell](https://docs.microsoft.com/powershell/module/az.cloudservice/?view=azps-5.4.0#cloudservice&preserve-view=true) or [Rest API](https://docs.microsoft.com/rest/api/compute/cloudservices/rest-get-package). 
    
 

### Changes to customer’s Automation, CI/CD pipeline, custom scripts, custom dashboards, custom tooling, etc.  

Customers need to update their tooling and automation to start using the new APIs / commands to manage their deployment. Customer can easily adopt new features and capabilities of Azure Resource Manager/Cloud Services (extended support) as part of this change. 

- Changes to Resource and Resource Group names post migration
    - As part of migration, the names of few resources like the Cloud Service, public IP addresses, etc. change. These changes might need to be reflected in deployment files before update of Cloud Service. [Learn More about the names of resources changing](in-place-migration-technical-details.md#translation-of-resources-and-naming-convention-post-migration).  

- Recreate rules and policies required to manage and scale cloud services 
    - [Auto Scale rules](configure-scaling.md) are not migrated. After migration, recreate the auto scale rules.  
    - [Alerts](enable-alerts.md) are not migrated. After migration, recreate the alerts.
    - The Key Vault is created without any access policies. [Create appropriate policies](../key-vault/general/assign-access-policy-portal.md) on the Key Vault to view or manage your certificates. Certificates will be visible under settings on the tab called secrets.

## Next steps
- [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md)
- Migrate to Cloud Services (extended support) using the [Azure portal](in-place-migration-portal.md)
- Migrate to Cloud Services (extended support) using [PowerShell](in-place-migration-powershell.md)

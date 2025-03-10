---
title: Azure Cloud Services (extended support) post-migration changes
description: Overview of post migration changes after migrating to Cloud Services (extended support)
ms.topic: how-to
ms.service: azure-cloud-services-extended-support
ms.subservice: classic-to-arm-migration
author: tanmaygore
ms.author: tagore
ms.reviewer: mimckitt
ms.date: 07/24/2024
---
 
# Post-migration changes

The Cloud Services (classic) deployment is converted to a Cloud Services (extended support) deployment. For more information, see [Cloud Services (extended support) documentation](deploy-prerequisite.md).  

## Changes to deployment files 

Minor changes are made to customer’s .csdef and .cscfg file to make the deployment files conform to the Azure Resource Manager and Cloud Services (extended support) requirements. Post migration retrieves your new deployment files or updates the existing files, which are needed for update/delete operations.  

- Virtual Network uses full Azure Resource Manager resource ID instead of just the resource name in the NetworkConfiguration section of the .cscfg file. For example, `/subscriptions/subscription-id/resourceGroups/resource-group-name/providers/Microsoft.Network/virtualNetworks/vnet-name`. For virtual networks belonging to the same resource group as the cloud service, you can choose to update the .cscfg file back to using just the virtual network name.  

- Classic sizes like Small, Large, ExtraLarge are replaced by their new size names, Standard_A*. The size names need to be changed to their new names in .csdef file. For more information, see [Cloud Services (extended support) deployment prerequisites](deploy-prerequisite.md#required-definition-file-updates)

- Use the Get API to get the latest copy of the deployment files. 
    - Get the template using [Portal](../azure-resource-manager/templates/export-template-portal.md), [PowerShell](../azure-resource-manager/management/manage-resource-groups-powershell.md#export-resource-groups-to-templates), [CLI](../azure-resource-manager/management/manage-resource-groups-cli.md#export-resource-groups-to-templates), and [REST API](/rest/api/resources/resourcegroups/exporttemplate) 
    - Get the .csdef file using [PowerShell](/powershell/module/az.cloudservice/?preserve-view=true&view=azps-5.4.0#cloudservice) or [REST API](/rest/api/compute/cloudservices/rest-get-package). 
    - Get the .cscfg file using [PowerShell](/powershell/module/az.cloudservice/?preserve-view=true&view=azps-5.4.0#cloudservice) or [REST API](/rest/api/compute/cloudservices/rest-get-package). 
    
## Updating Azure Traffic Manager Configuration After Cloud Service Migration

After migrating your Cloud Services (Classic) to Cloud Services (Extended Support), you may encounter issues with updating or deleting endpoint configurations in Azure Traffic Manager. This is due to resource ID synchronization problems, where the Traffic Manager endpoint still points to the old resource ID for Cloud Services (classic), but the Cloud Services (extended support) deployment has a new Resource ID. To resolve this issue, please follow these steps:
1.	Migrate traffic Temporary endpoint: Migrate your Azure Traffic Manager traffic to a secondary endpoint.
2.	Remove Classic Compute Endpoints in Azure Traffic Manager : Once the traffic is being directed to a temporary endpoint, delete the classic compute endpoint from the Traffic Manager profile.
3.	Migrate to Cloud Services (extended support): Migrate the Cloud Service resource to Cloud Services (extended support).
4.	Add New Endpoints in ATM: Create new endpoints in your Traffic Manager profile for the migrated Cloud Services (extended Support) resource. This endpoint has the new resource ID for the migrated Cloud Service.
5.	Resume traffic to Primary Cloud Services (extended support) endpoint: the secondary endpoint can be deleted or adjusted to a lower weight. Traffic will be served to new (extended support) resource.
This process ensures that your Traffic Manager is correctly aligned with the updated resource IDs and avoids configuration issues that can delay projects.


## Changes to customer’s Automation, CI/CD pipeline, custom scripts, custom dashboards, custom tooling, etc.  

Customers need to update their tooling and automation to start using the new APIs / commands to manage their deployment. Customer can easily adopt new features and capabilities of Azure Resource Manager/Cloud Services (extended support) as part of this change. 

- Changes to Resource and Resource Group names post migration
    - As part of migration, the names of few resources like the Cloud Service, public IP addresses, etc. change. These changes might need to be reflected in deployment files before update of Cloud Service. [Learn More about the names of resources changing](in-place-migration-technical-details.md#translation-of-resources-and-naming-convention-post-migration).  

- Recreate rules and policies required to manage and scale cloud services 
    - [Auto Scale rules](configure-scaling.md) aren't migrated. After migration, recreate the auto scale rules.  
    - [Alerts](enable-alerts.md) aren't migrated. After migration, recreate the alerts.
    - The Key Vault is created without any access policies. To view or manage your certificates, [create appropriate policies](/azure/key-vault/general/assign-access-policy-portal) on the Key Vault. Certificates are visible under settings on the tab called secrets.


## Changes to Certificate Management Post Migration 

As a standard practice to manage your certificates, all the valid .pfx certificate files should be added to certificate store in Key Vault and update would work perfectly fine via any client - Portal, PowerShell, or REST API.

Currently, the Azure portal does a validation for you to check if all the required Certificates are uploaded in certificate store in Key Vault and warns if a certificate isn't found. However, if you're planning to use Certificates as secrets, then these certificates can't be validated for their thumbprint and any update operation that involves addition of secrets would fail via Portal. Customers are recommended to use PowerShell or RestAPI to continue updates involving Secrets.


## Changes for Update via Visual Studio
If you published updates via Visual Studio directly, then you would need to first download the latest CSCFG file from your deployment post migration. Use this file as reference to add Network Configuration details to your current CSCFG file in Visual Studio project. Then build the solution and publish it. You might have to choose the Key Vault and Resource Group for this update.


## Next steps
- [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview)
- Migrate to Cloud Services (extended support) using the [Azure portal](in-place-migration-portal.md)
- Migrate to Cloud Services (extended support) using [PowerShell](in-place-migration-powershell.md)

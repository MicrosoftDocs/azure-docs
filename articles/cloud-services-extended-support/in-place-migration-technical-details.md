---
title: Technical details and requirements for migrating to Azure Cloud Services (extended support)
description: Provides technical details and requirements for migrating from Azure Cloud Services (classic) to Azure Cloud Services (extended support)
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
ms.reviwer: mimckitt
ms.topic: how-to
ms.date: 02/06/2020
author: hirenshah1
ms.author: hirshah

---

# Technical details of migrating to Azure Cloud Services (extended support)   

This article discusses the technical details regarding the migration tool as pertaining to Cloud Services (classic). 

## Details about feature / scenarios supported for migration 


### Extensions and plugin migration 
- All enabled and supported extensions will be migrated. 
- Disabled extensions will not be migrated. 
- Plugins are a legacy concept and should be removed before migration. They are supported for migration and but after migration, if extension needs to be enabled, plugin needs to be removed first before installing the extension. Remote desktop plugins and extensions are most impacted by this. 	
 
### Certificate migration
- In Cloud Services (extended support), certificates are stored in a Key Vault. As part of migration, we create a Key Vault for the customers having the Cloud Service name and transfer all certificates from Azure Service Manager to Key Vault. 
- The reference to this Key Vault is specified in the template or passed through PowerShell or Azure CLI. 

### Service Configuration and Service Definition files
- The .cscfg and .csdef files needs to be updated for Cloud Services (extended support) with minor changes. 
- The names of resources like virtual network and VM SKU are different. See [Translation of resources and naming convention post migration](#translation-of-resources-and-naming-convention-post-migration)
- Customers can retrieve their new deployments through [PowerShell](/powershell/module/az.cloudservice/?preserve-view=true&view=azps-5.4.0#cloudservice) and [REST API](/rest/api/compute/cloudservices/get). 

### Cloud Service and deployments
- Each Cloud Services (extended support) deployment is an independent Cloud Service. Deployment are no longer grouped into a cloud service using slots.
- If you have two slots in your Cloud Service (classic), you need to delete one slot (staging) and use the migration tool to move the other (production) slot to Azure Resource Manager. 
- The public IP address on the Cloud Service deployment remains the same after migration to Azure Resource Manager and is exposed as a Basic SKU IP (dynamic or static) resource. 
- The DNS name and domain (cloudapp.net) for the migrated cloud service remains the same. 

### Virtual network migration
- If a Cloud Services deployment is in a virtual network, then during migration all Cloud Services and associated virtual network resources are migrated together. 
- After migration, the virtual network is placed in a different resource group than the Cloud Service. 
- For virtual networks with multiple Cloud Services, each Cloud Service is migrated one after the other. 

### Migration of deployments not in a virtual network
- In 2017, Azure started automatically creating new deployments (without customer specified virtual network) into a platform created “default” virtual network. These default virtual networks are hidden from customers.   
- As part of the migration, this default virtual network will be exposed to customers once in Azure Resource Manager. To manage or update the deployment in Azure Resource Manager, customers need to add this virtual network information in the NetworkConfiguration section of the .cscfg file.    
- The default virtual network, when migrated to Azure Resource Manager, is placed in the same resource group as the Cloud Service.
- Cloud Services created before this time will not be in any virtual network and cannot be migrated using the tool. Consider redeploying these Cloud Services directly in Azure Resource Manager. 
- To check if a deployment is eligible to migrate, run the validate API on the deployment. The result of Validate API will contain error message explicitly mentioning if this deployment is eligible to migrate.     

### Load Balancer   
- For a Cloud Service using a public endpoint, a platform created load balancer associated with the Cloud Service is exposed inside the customer’s subscription in Azure Resource Manager. The load balancer is a read-only resource, and updates are restricted only through the Service Configuration (.cscfg) and Service Definition (.csdef) files. 

### Key Vault
- As part of migration, Azure automatically creates a new Key Vault and migrates all the certificates to it. The tool does not allow you to use an existing Key Vault. 
- Cloud Services (extended support) require a Key Vault located in the same region and subscription. This Key Vault is automatically created as part of the migration. 

## Resources and features not available for migration
These are top scenarios involving combinations of resources, features and Cloud Services. This list is not exhaustive. 

| Resource | Next steps / work-around | 
|---|---|
| Auto Scale Rules | Migration goes through but rules are dropped. [Recreate the rules](./configure-scaling.md) after migration on Cloud Services (extended support). | 
| Alerts | Migration goes through but alerts are dropped. [Recreate the rules](./enable-alerts.md) after migration on Cloud Services (extended support). | 
| VPN Gateway | Remove the VPN Gateway before beginning migration and then recreate the VPN Gateway once migration is complete. | 
| Express Route Gateway (in the same subscription as Virtual Network only) | Remove the Express Route Gateway before beginning migration and then recreate the Gateway once migration is complete. | 
| Quota	 | Quota is not migrated. [Request new quota](../azure-resource-manager/templates/error-resource-quota.md#solution) on Azure Resource Manager prior to migration for the validation to be successful. | 
| Affinity Groups | Not supported. Remove any affinity groups before migration.  | 
| Virtual networks using [virtual network peering](../virtual-network/virtual-network-peering-overview.md)| Before migrating a virtual network that is peered to another virtual network, delete the peering, migrate the virtual network to Resource Manager and re-create peering. This can cause downtime depending on the architecture. | 
| Virtual networks that contain App Service environments | Not supported | 
| Virtual networks with Azure Batch Deployments | Not supported | 
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
| Migration of deployment containing the remote desktop plugin and the remote desktop extensions | Option 1: Remove the remote desktop plugin before migration. This requires changes to deployment files. The migration will then go through. <br><br> Option 2: Remove remote desktop extension and migrate the deployment. Post-migration, remove the plugin and install the extension. This requires changes to deployment files. <br><br> Remove the plugin and extension before migration. [Plugins are not recommended](./deploy-prerequisite.md#required-service-definition-file-csdef-updates) for use on Cloud Services (extended support).| 
| Virtual networks with both PaaS and IaaS deployment |Not Supported <br><br> Move either the PaaS or IaaS deployments into a different virtual network. This will cause downtime. | 
Cloud Service deployments using legacy role sizes (such as Small or ExtraLarge). | The role sizes need to be updated before migration. Update all deployment artifacts to reference these new modern role sizes. For more information, see [Available VM sizes](available-sizes.md)|
| Migration of Cloud Service to different virtual network | Not supported <br><br> 1. Move the deployment to a different classic virtual network before migration. This will cause downtime. <br> 2. Migrate the new virtual network to Azure Resource Manager. <br><br> Or <br><br> 1. Migrate the virtual network to Azure Resource Manager <br>2. Move the Cloud Service to a new virtual network. This will cause downtime. | 
| Cloud Service in a virtual network but does not have an explicit subnet assigned | Not supported. Mitigation involves moving the role into a subnet, which requires a role restart (downtime) | 

## Translation of resources and naming convention post migration
As part of migration, the resource names are changed, and few Cloud Services features are exposed as Azure Resource Manager resources. The table summarizes the changes specific to Cloud Services migration.

| Cloud Services (classic) <br><br> Resource name | Cloud Services (classic) <br><br> Syntax| Cloud Services (extended support) <br><br> Resource name| Cloud Services (extended support) <br><br> Syntax | 
|---|---|---|---|
| Cloud Service | `cloudservicename` | Not associated| Not associated |
| Deployment (portal created) <br><br> Deployment (non-portal created)  | `deploymentname` | Cloud Services (extended support) | `cloudservicename` |  
| Virtual Network | `vnetname` <br><br> `Group resourcegroupname vnetname` <br><br> Not associated |  Virtual Network (not portal created) <br><br> Virtual Network (portal created) <br><br> Virtual Networks (Default) | `vnetname` <br><br> `group-resourcegroupname-vnetname` <br><br> `VNet-cloudservicename`|
| Not associated | Not associated | Key Vault | `KV-cloudservicename` | 
| Not associated | Not associated | Resource Group for Cloud Service Deployments | `cloudservicename-migrated` | 
| Not associated | Not associated | Resource Group for Virtual Network | `vnetname-migrated` <br><br> `group-resourcegroupname-vnetname-migrated`|
| Not associated | Not associated | Public IP (Dynamic) | `cloudservicenameContractContract` | 
| Reserved IP Name | `reservedipname` | Reserved IP (non-portal created) <br><br> Reserved IP (portal created) | `reservedipname` <br><br> `group-resourcegroupname-reservedipname` | 
| Not associated| Not associated | Load Balancer | `LB-cloudservicename`|



## Migration issues and how to handle them. 

### Migration stuck in an operation for a long time. 
- Commit, prepare, and abort can take a long time depending on the number of deployments. Operations will time out after 24 hours.   
- Commit, prepare, and abort operations are idempotent. Most issues are fixable by retrying. There could be transient errors, which can go away in few minutes, we recommend retrying after a gap. If migrating using the Azure portal and the operation is stuck in an "in-progress state",  use PowerShell to retry the operation. 
- Contact support to help migrate or roll back the deployment from the backend. 

### Migration failed in an operation. 
- If validate failed, it is because the deployment or virtual network contains an unsupported scenario/feature/resource. Use the list of unsupported scenarios to find the work-around in the documents.  
- Prepare operation first does validation including some expensive validations (not covered in validate). Prepare failure could be due to an unsupported scenario. Find the scenario and the work-around in the public documents. Abort needs to be called to go back to the original state and unlock the deployment for updates and delete operations.
- If abort failed, retry the operation. If retries fail, then contact support.
- If commit failed, retry the operation. If retry fail, then contact support. Even in commit failure, there should be no data plane issue to your deployment. Your deployment should be able to handle customer traffic without any issue. 

### Portal refreshed after Prepare. Experience restarted and Commit or Abort not visible anymore. 
- Portal stores the migration information locally and therefore after refresh, it will start from validate phase even if the Cloud Service is in the prepare phase.  
- You can use portal to go through the validate and prepare steps again to expose the Abort and Commit button. It will not cause any failures.
- Customers can use PowerShell or REST API to abort or commit. 

### How much time can the operations take?<br>
Validate is designed to be quick. Prepare is longest running and takes some time depending on total number of role instances being migrated. Abort and commit can also take time but will take less time compared to prepare. All operations will time out after 24 hrs.

## Next steps
For assistance migrating your Cloud Services (classic) deployment to Cloud Services (extended support) see our [Support and troubleshooting](support-help.md) landing page.

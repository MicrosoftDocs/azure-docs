---
title: Technical details and requirements for migrating to Azure Cloud Services (extended support)
description: Provides technical details and requirements for migrating from Azure Cloud Services (classic) to Azure Cloud Services (extended support)
author: tanmaygore
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
ms.reviwer: mimckitt
ms.topic: how-to
ms.date: 02/06/2020
ms.author: tagore

---

# Technical details of migrating to Azure Cloud Services (extended support)   

This article discusses the technical details regarding the migration tool as pertaining to Cloud Services (classic). 

> [!IMPORTANT]
> Migrating from Cloud Services (classic) to Cloud Services (extended support) using the migration tool is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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
- Customers can retrieve their new deployments through [PowerShell](https://docs.microsoft.com/powershell/module/az.cloudservice/?view=azps-5.4.0#cloudservice&preserve-view=true) and [Rest API](https://docs.microsoft.com/rest/api/compute/cloudservices/get). 

### Cloud Service and deployments
- Each Cloud Services (extended support) deployment is an independent Cloud Service. Deployment are no longer grouped into a cloud service using slots.
- If you have two slots in your Cloud Service (classic), you need to delete one slot (staging) and use the migration tool to move the other (production) slot to Azure Resource Manager. 
- The public IP address on the Cloud Service deployment remains the same after migration to Azure Resource Manager and is exposed as a Basic SKU IP (dynamic or static) resource. 
- The DNS name and domain (cloudapp.azure.net) for the migrated cloud service remains the same. 

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


## Translation of resources and naming convention post migration
As part of migration, the resource names are changed, and few Cloud Services features are exposed as Azure Resource Manager resources. The table summarizes the changes specific to Cloud Services migration.

| Cloud Services (classic) <br><br> Resource name | Cloud Services (classic) <br><br> Syntax| Cloud Services (extended support) <br><br> Resource name| Cloud Services (extended support) <br><br> Syntax | 
|---|---|---|---|
| Cloud Service | `cloudservicename` | Not associated| Not associated |
| Deployment (portal created) <br><br> Deployment (non-portal created)  | `deploymentname` | Cloud Services (extended support) | `deploymentname` |  
| Virtual Network | `vnetname` <br><br> `Group resourcegroupname vnetname` <br><br> Not associated |  Virtual Network (not portal created) <br><br> Virtual Network (portal created) <br><br> Virtual Networks (Default) | `vnetname` <br><br> `group-resourcegroupname-vnetname` <br><br> `DefaultRdfevirtualnetwork_vnetid`|
| Not associated | Not associated | Key Vault | `cloudservicename` | 
| Not associated | Not associated | Resource Group for Cloud Service Deployments | `cloudservicename-migrated` | 
| Not associated | Not associated | Resource Group for Virtual Network | `vnetname-migrated` <br><br> `group-resourcegroupname-vnetname-migrated`|
| Not associated | Not associated | Public IP (Dynamic) | `cloudservicenameContractContract` | 
| Reserved IP Name | `reservedipname` | Reserved IP (non-portal created) <br><br> Reserved IP (portal created) | `reservedipname` <br><br> `group-resourcegroupname-reservedipname` | 
| Not associated| Not associated | Load Balancer | `deploymentname-lb`|



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
- Customers can use PowerShell or Rest API to abort or commit. 

### How much time can the operations take?<br>
Validate is designed to be quick. Prepare is longest running and takes some time depending on total number of role instances being migrated. Abort and commit can also take time but will take less time compared to prepare. All operations will time out after 24 hrs. 

---
title: Technical details and requirements for migrating to Azure Cloud Services (extended support)
description: Provides technical details and requirements for migrating from Azure Cloud Services (classic) to Azure Cloud Services (extended support)
author: tanmaygore
ms.service: cloud-services-extended-support
ms.reviwer: mimckitt
ms.topic: how-to
ms.date: 02/06/2020
ms.author: tagore 

---

# Technical details and requirements for migrating to Azure Cloud Services (extended support)   

This document talks about the deeper technical details about the migration tool pertaining to Cloud Services (classic). Since the tool is same for VM (classic), please follow VM (classic) migration documentation for details on Migration flow & steps, how to plan for migration & resource translations from classic to ARM representation. 

## Details about feature / scenarios supported for migration 

### Extensions & Plugin Migration 
- All enabled & supported extension will be migrated. Disabled extensions will not be migrated. 
- Plugins are legacy concept and should be removed before migration.   They are supported for migration and but after migration, if extension needs to be enabled, plugin needs to be removed first before installing the Extension. RDP Plugins & extensions are most impacted by this. 	
 
### Certificate Migration
- In Cloud Services (extended support), certificates are stored in Key Vault. Therefore, as part of migration, we create a Key Vault for the customers having the cloud service name and transfer all certificates from ASM to Key Vault. 
- This information relationship between cloud service and key vault is specified in the Template or passed thru Powershell/CLI

### Cscfg/csdef migration
- The Cscfg / Csdef needs to be updated for CS-ES with minor changes. 
- The names of resources like vnet, VM SKU is different. Please follow this  document on the full list of changes between CS (classic) & CS-ES. 
- Customers can retrieve their new deployments thru Power shell & Rest API  . 

### Cloud Service (hosted service) & Deployments
- CS-ES do not support the concept of Cloud Services an hosted service and each deployment is an independent deployment cloud service
- If you have two slots in your cloud service (classic), you need to delete one slot (staging) and use the migration tool to move the other (production) slot to ARM
- The Public IP Address on the cloud service deployment remains the same after migration to ARM and is exposed as a Basic SKU IP (dynamic or static) resource in the customer’s subscription. 
- The DNS name for the migrated cloud service uses the same name and DNS domain as used in RDFE [cloudapp.azure.net]   

### Vnet Migration
- If a cloud service deployment is in a virtual network, then during migration all cloud services and associated VNet resources are migrated together. 
- After migration, the VNet is placed in a different resource group than the cloud service (refer table below)
- For Vnets with multiple cloud services, each cloud service is migrated one after the other. 

### Migration of deployments not in a Vnet
- In 2017, Azure started automatically creating new deployments (without customer specified Vnet) into a platform created “default” vnet. These default vnets are hidden from customers.   
- As part of the migration, this default vnet will be exposed to customers once in ARM. To manage/update the deployment in ARM, customers need to add this VNet information in the NetworkConfiguration section of the .cscfg.    
- The default VNet, when migrated to ARM, is placed in the same resource group as the cloud service.
- Cloud Services created before this time will not be in any Vnet and cannot be migrated using the tool. Consider re-deploying these cloud services directly in ARM. 
- To check if a deployment is migratable, please run the validate API on the deployment. The result of Validate API will contain error message explicitly mentioning if this deployment is migratable.     

### Load Balancer   
- For a cloud service using a public endpoint, a platform created load balancer associated with the cloud service is exposed inside the customer’s subscription in ARM. The load balancer is a read-only resource, and updates are restricted only through the service config (.cscfg) and service definition (.csdef) files. 

### Key Vault
- As part of migration, we automatically create a new key vault and migrate all the certificates to it. The tool does not allow you to use an existing key vault. 
- CSES require a key vault located in the same region & subscription. This Key vault is auto created as part of In-place migration. 


## Translation of Resource & its name after migration
As part of migration, the resource names are changed, and few cloud services features are exposed as ARM resources. The table summarizes the changes specific to Cloud Services migration. More resource translation details between ASM & ARM are documented here. 

### Cloud Services (Classic)


Resource Name | Syntax |Example | 
|---|---|---|
| Cloud Service | cloudservicename | azurecloudservicestest |

Deployment (Portal Created)

Deployment (Non-Portal Created)	deploymentname

deploymentname	e60b839d97f64662s3ee
2ea8db574eb5

cloudservicetestdeployment	Cloud Service (extended support)


	deploymentname    	e60b839d97f64662s3ee
2ea8db574eb5

cloudservicetestdeployment

	Deployment becomes a Cloud Service in CS-ES
Virtual Network	vnetname

Group resourcegroupname vnetname	testvnet

Group testrg testvnet

	Virtual Network (Non-Portal Created)

Virtual Network (Portal created)

Virtual Networks (Default)	vnetname

group-resourcegroupname-vnetname   

DefaultRdfeVnet_vnetid	testvnet

group-testrg-testvnet

DefaultRdfeVnet_6d3594ce-502c-4c0a-b349-1321076e676f
	Azure creates a hidden vnet when cloud services is created without Vnet. This vnet is exposed during migration.
-	-	-	Key Vault	csname	azurecloudservicestest	New resource created as part of migration
-	-	-	Resource Group for Cloud Service Deployments	csname-migrated	azurecloudservicestest-migrated	New resource created as part of migration
-	-	-	Resource Group for Virtual Network       	vnetname-migrated

group-resourcegroupname-vnetname-migrated	testvnet-migrated

group-testrg-testvnet-migrated	Vnet lives in a different RG. New resource created as part of migration
-	-	-	Public IP (Dynamic)	csnameContractContract         
	azurecloudservicestestContractContract	Public IP now becomes a separate resource
Reserved IP Name	reservedipname	csvirtualip	Reserved IP (Non-Portal created)

Reserved IP (Portal Created)	reservedipname

group-resourcegroupname-reservedipname	csvirtualip

group-rgname-csvirtualip	
-	-	-	Load Balancer	deploymentname-lb	e60b839d97f64662s3ee
2ea8db574eb5-lb	

Migration Issues & how to handle them. 
1.	Migration stuck in an operation for a long time. 
a.	Commit, Prepare & Abort migration can take a long time depending on the number of deployments, however it will not take more than 1 day. 
b.	Commit, Prepare & Abort operations are idempotent, i.e. most issues are fixable by simple retrying. There could be transient errors which can go away in few minutes, so we recommend retrying after a gap. If migrating via Portal & the operation is stuck in in-progress state, please use PS to rety. 
c.	If it doesn’t help, contact support to help migrate / rollback the deployment from the backend. 

2.	Migration failed in an operation. 
a.	If validate failed, its because your deployment/vnet contains an unsupported scenario/feature/resource. Please use the list of unsupported scenarios to find the work around in the documents.  
b.	Prepare operation also does validation include some expensive validations (not covered in validate). Prepare failure could be due to an unsupported scenario. Please find the scenario & it’s work around in the public documents, to fix the issue. Abort needs to be called to go back to the original state. 
c.	If abort failed, please retry. If retries fail, then contact support.
d.	If commit failed, please retry. If retry fail, then contact support. Even in commit failure, there should no data plane issue to your deployment. I.e. your deployment should be handle customer traffic without any issue. 

3.	Portal refreshed after Prepare. Experience restarted and Commit or Abort not visible anymore. 
a.	Portal stores the migration information locally and therefore after refresh, it will start from Validate phase even if the CS is in Prepare complete stage. 
b.	Customers can use Power Shell or Rest API to call abort or commit. 
c.	You can also use Portal to go thru Validate, Prepare steps again and it will not cause any failures. (Assuming Validate & Prepare was previously successful)

Known Issues in Public Preview: (Internal Only)
1.	Get instance view via CSES API on a prepared CS (classic) deployment
2.	Extension add not blocked on RDFE for a prepared CS (classic) deployment
3.	Restart role instance using CSES API is being allowed on a prepared CS (classic) deployment
4.	Auto scale is being allowed via CSES API on a prepared CS (classic) deployment
5.	WAD & RDP extension created using VS not getting migrated
6.	Approot getting changes from E: to F: during migration 
7.	Delete CS being allowed using CSES APIs on a prepared CS (classic) deployment
8.	Tags not getting migrated
9.	Republishing from VS to an in-place migrated deployment failing
10.	Machine key is getting regenerated during migration
11.	Migration of CS using Reserved IP after VIP SWAP
12.	Migration of CS in default vnet and no subnet

Common Questions:
1.	How much time can the operations take?
a.	Validate is designed to be quick. Prepare is longest running and takes some time depending on total number of role instances being migrated. Abort & commit can also take time but will take less time compared to prepare. All operations will time out after 24 hrs. 



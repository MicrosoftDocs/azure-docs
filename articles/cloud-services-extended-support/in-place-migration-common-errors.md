---
title: Common errors and known issues when migrating to Azure Cloud Services (extended support)
description: Overview of common errors when migrating from Cloud Services (classic) to Cloud Service (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.date: 2/08/2021
ms.custom: 
---

# Common errors and known issues when migrating to Azure Cloud Services (extended support)

This article covers known issues and common errors you might encounter when migration from Cloud Services (classic) to Cloud Services (extended support). 

## Known issues
Following issues are known and being addressed.

| Known issues | Mitigation | 
|---|---|
| Role Instances restarting UD by UD after successful commit. | Restart operation follows the same method as monthly guest OS rollouts. Do not commit migration of cloud services with single role instance or impacted by restart.| 
| Azure portal cannot read migration state after browser refresh. | Rerun validate and prepare operation to get back to the original migration state. | 
| Certificate displayed as secret resource in key vault. | After migration, reupload the certificate as a certificate resource to simplify update operation on Cloud Services (extended support). | 
| Deployment labels not getting saved as tags as part of migration. | Manually create the tags after migration to maintain this information.
| Resource Group name is in all caps. | Non-impacting. Solution not yet available. |
| Name of the lock on Cloud Services (extended support) lock is incorrect. | Non-impacting. Solution not yet available. | 
| IP address name is incorrect on Cloud Services (extended support) portal blade. | Non-impacting. Solution not yet available. | 
| Invalid DNS name shown for virtual IP address after on update operation on a migrated cloud service. | Non-impacting. Solution not yet available. | 
| After successful prepare, linking a new Cloud Services (extended support) deployment as swappable isn't allowed. | Do not link a new cloud service as swappable to a prepared cloud service. | 
| Error messages need to be updated. | Non-impacting. | 

## Common migration errors
Common migration errors and mitigation steps. 

| Error message	| Details | 
|---|---|
| The resource type could not be found in the namespace `Microsoft.Compute` for api version '2020-10-01-preview'. | [Register the subscription](in-place-migration-overview.md#setup-access-for-migration) for CloudServices feature flag to access public preview. | 
| The server encountered an internal error. Retry the request. | Retry the operation, use [Microsoft Q&A](/answers/topics/azure-cloud-services-extended-support.html) or contact support. | 
| The server encountered an unexpected error while trying to allocate network resources for the cloud service. Retry the request. | Retry the operation, use [Microsoft Q&A](/answers/topics/azure-cloud-services-extended-support.html) or contact support. | 
| Deployment deployment-name in cloud service cloud-service-name must be within a virtual network to be migrated. | Deployment isn't located in a virtual network. Refer to [this](in-place-migration-technical-details.md#migration-of-deployments-not-in-a-virtual-network) document for more details. | 
| Migration of deployment deployment-name in cloud service cloud-service-name isn't supported because it is in region region-name. Allowed regions: [list of available regions]. | Region isn't yet supported for migration. | 
| The Deployment deployment-name in cloud service cloud-service-name cannot be migrated because there are no subnets associated with the role(s) role-name. Associate all roles with a subnet, then retry the migration of the cloud service. | Update the cloud service (classic) deployment by placing it in a subnet before migration. |  
| The deployment deployment-name in cloud service cloud-service-name cannot be migrated because the deployment requires at least one feature that not registered on the subscription in Azure Resource Manager. Register all required features to migrate this deployment. Missing feature(s): [list of missing features]. | Contact support to get the feature flags registered. | 
| The deployment cannot be migrated because the deployment's cloud service has two occupied slots. Migration of cloud services is only supported for deployments that are the only deployment in their cloud service. Delete the other deployment in the cloud service to proceed with the migration of this deployment. | Refer to the [unsupported scenario](in-place-migration-technical-details.md#unsupported-configurations--migration-scenarios) list for more details. | 
| Deployment deployment-name in HostedService cloud-service-name is in intermediate state: state. Migration not allowed. | Deployment is either being created, deleted or updated. Wait for the operation to complete and retry. | 
| The deployment deployment-name in hosted service cloud-service-name has reserved IP(s) but no reserved IP name. To resolve this issue, update reserved IP name or contact the Microsoft Azure service desk. | Update cloud service deployment. | 
| The deployment deployment-name in hosted service cloud-service-name has reserved IP(s) reserved-ip-name but no endpoint on the reserved IP. To resolve this issue, add at least one endpoint to the reserved IP. | Add endpoint to reserved IP. | 
| Migration of Deployment {0} in HostedService {1} is in the process of being committed and cannot be changed until it completes successfully.	| Wait or retry operation. | 
| Migration of Deployment {0} in HostedService {1} is in the process of being aborted and cannot be changed until it completes successfully. | Wait or retry operation. |
| One or more VMs in Deployment {0} in HostedService {1} is undergoing an update operation. It can't be migrated until the previous operation completes successfully. Retry after sometime. | Wait for operation to complete. | 
| Migration isn't supported for Deployment {0} in HostedService {1} because it uses following features not yet supported for migration: Non-vnet deployment.| Deployment isn't located in a virtual network. Refer to [this](in-place-migration-technical-details.md#migration-of-deployments-not-in-a-virtual-network) document for more details. | 
| The virtual network name cannot be null or empty.	| Provide virtual network name in the REST request body | 
| The Subnet Name cannot be null or empty. | Provide subnet name in the REST request body. | 
| DestinationVirtualNetwork must be set to one of the following values: Default, New, or Existing. | Provide DestinationVirtualNetwork property in the REST request body. | 
| Default VNet destination option not implemented. | “Default” value isn't supported for DestinationVirtualNetwork property in the REST request body. | 
| The deployment {0} cannot be migrated because the CSPKG isn't available. | Upgrade the deployment and try again. | 
| The subnet with ID '{0}' is in a different location than deployment '{1}' in hosted service '{2}'. The location for the subnet is '{3}' and the location for the hosted service is '{4}'.  Specify a subnet in the same location as the deployment. | Update the cloud service to have both subnet and cloud service in the same location before migration. | 
| Migration of Deployment {0} in HostedService {1} is in the process of being aborted and cannot be changed until it completes successfully. | Wait for abort to complete or retry abort. Use [Microsoft Q&A](/answers/topics/azure-cloud-services-extended-support.html) or Contact support otherwise. | 
| Deployment {0} in HostedService {1} has not been prepared for Migration. | Run prepare on the cloud service before running the commit operation. | 
| UnknownExceptionInEndExecute: Contract.Assert failed: rgName is null or empty: Exception received in EndExecute that isn't an RdfeException. |	Use [Microsoft Q&A](/answers/topics/azure-cloud-services-extended-support.html) or Contact support. | 
| UnknownExceptionInEndExecute: A task was canceled: Exception received in EndExecute that isn't an RdfeException. | Use [Microsoft Q&A](/answers/topics/azure-cloud-services-extended-support.html) or Contact support. | 
| XrpVirtualNetworkMigrationError: Virtual network migration failure. | Use [Microsoft Q&A](/answers/topics/azure-cloud-services-extended-support.html) or Contact support. | 
| Deployment {0} in HostedService {1}  belongs to Virtual Network {2}. Migrate Virtual Network {2} to migrate this HostedService {1}. | Refer to [Virtual Network migration](in-place-migration-technical-details.md#virtual-network-migration). | 
| The current quota for Resource name in Azure Resource Manager is insufficient to complete migration. Current quota is {0}, additional needed is {1}. File a support request to raise the quota and retry migration once the quota has been raised.	| Follow appropriate channels to request quota increase: <br>[Quota increase for networking resources](../azure-portal/supportability/networking-quota-requests.md) <br>[Quota increase for compute resources](../azure-portal/supportability/per-vm-quota-requests.md) | 
|XrpPaaSMigrationCscfgCsdefValidationMismatch: Migration could not be completed on deployment deployment-name in hosted service service-name because the deployment's metadata is stale. Please abort the migration and upgrade the deployment before retrying migration. Validation Message: The service name 'service-name'in the service definition file does not match the name 'service-name-in-config-file' in the service configuration file|match the service names in both .csdef and .cscfg file|
|NetworkingInternalOperationError when deploying Cloud Service (extended support) resource| The issue may occur if the Service name is same as role name. The recommended remediation is to use different names for service and roles|

## Next steps
For more information on the requirements of migration, see [Technical details of migrating to Azure Cloud Services (extended support)](in-place-migration-technical-details.md)

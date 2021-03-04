---
title: Common errors and known issues when migration to Azure Cloud Services (extended support)
description: Overview of common errors when migrating from Cloud Services (classic) to Cloud Service (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
author: tanmaygore
ms.author: tagore
ms.reviewer: mimckitt
ms.date: 2/08/2021
ms.custom: 
---

# Common errors and known issues when migration to Azure Cloud Services (extended support)

This article covers known issues and common errors you might encounter when migration from Cloud Services (classic) to Cloud Services (extended support). 

Refer to the following resources if you need assistance with your migration: 

- [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html): Microsoft and community support for migration.
- [Azure Migration Support](https://ms.portal.azure.com/#create/Microsoft.Support/Parameters/%7B%22pesId%22:%22e79dcabe-5f77-3326-2112-74487e1e5f78%22,%22supportTopicId%22:%22fca528d2-48bd-7c9f-5806-ce5d5b1d226f%22%7D): Dedicated support team for technical assistance during migration. Customers without technical support can use [free support capability](https://aka.ms/cs-migration-errors) provided specifically for this migration.
- If your company/organization has partnered with Microsoft or works with Microsoft representatives such as cloud solution architects or technical account managers, reach out to them for additional resources for migration.
- Complete [this survey](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR--AgudUMwJKgRGMO84rHQtUQzZYNklWUk4xOTFXVFBPOFdGOE85RUIwVC4u) to provide feedback or raise issues to the Cloud Services (extended support) product team. 


## Known Issues
Following issues are known and being addressed.

| Known Issue | Mitigation | 
|---|---|
| Portal - View resource group link giving 404 error after successful prepare operation. | View resource group content via resource group portal blade. | 
| Role Instances restarting UD by UD after successful commit. | Restart operation follows the same method as monthly guest OS rollouts. Do not commit migration of cloud services with single role instance or impacted by restart.| 
| Portal cannot read migration state after browser refresh. | Rerun validate and prepare operation to get back to the original migration state. | 
| Certificate displayed as secret resource in key vault. | After migration, re-upload the certificate as a certificate resource to simplify update operation on Cloud Services (extended support). | 
| Resource names are not following a standard naming scheme after migration. | Non-impacting. Solution not yet available. | 
| Deployment labels not getting saved as tags as part of migration. | Manually create the tags after migration to maintain this information.
| Commit operation taking long time to succeed. Waiting until role instance is in available state. | Non-impacting. Solution not yet available. | 
| Resource Group name is in all caps. | Non-impacting. Solution not yet available. |
| Name of the lock on Cloud Services (extended support) lock is incorrect. | Non-impacting. Solution not yet available. | 
| IP address name is incorrect on Cloud Services (extended support) portal blade. | Non-impacting. Solution not yet available. | 
| Invalid DNS name shown for virtual IP address after on update operation on a migrated cloud service. | Non-impacting. Solution not yet available. | 
| After successful prepare, linking a new Cloud Services (extended support) deployment as swappable is allowed. | Do not link a new cloud service as swappable to a prepared cloud service. | 
| Error messages needs to be updated. | Non-impacting. Submit feedback using available channels for improvement. | 

## Common Migration Errors
Common migration errors and mitigations. 

| Error Message	| Additional Details | 
|---|---|
| The resource type could not be found in the namespace 'Microsoft.Compute' for api version '2020-10-01-preview'. | [Register the subscription](in-place-migration-overview.md#access-in-place-public-preview) for CloudServices feature flag to access public preview. | 
| The server encountered an internal error. Please retry the request. | Retry the operation, use [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html) or contact support. | 
| The server encountered an unexpected error while trying to allocate network resources for the cloud service. Please retry the request. | Retry the operation, use [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html) or contact support. | 
| Deployment deployment-name in cloud service cloud-service-name must be within a virtual network to be migrated. | Deployment is not located in an virtual network. Refer [this](in-place-migration-technical-details.md#migration-of-deployments-not-in-a-virtual-network) document for more details. | 
| Migration of deployment deployment-name in cloud service cloud-service-name is not supported because it is in region region-name. Allowed regions: [list of available regions]. | Region is not yet supported for migration. | 
| The Deployment deployment-name in cloud service cloud-service-name can not be migrated because there are no subnets associated with the role(s) role-name. Associate all roles with a subnet, then retry the migration of the cloud service. | Update the cloud service (classic) deployment by placing it in a subnet before migration. |  
| The deployment deployment-name in cloud service cloud-service-name can not be migrated because the deployment requires at least one feature that not registered on the subscription in ARM. Register all required features to migrate this deployment. Missing feature(s): [list of missing features]. | Contact support to get the feature flags registered. | 
| The deployment cannot be migrated because the deployment's cloud service has two occupied slots. Migration of cloud services is only supported for deployments that are the only deployment in their cloud service. Delete the other deployment in the cloud service to proceed with the migration of this deployment. | Refer to the [unsupported scenario](in-place-migration-overview.md#unsupported-configurations--migration-scenarios) list for more details. | 
| Deployment deployment-name in HostedService cloud-service-name is in intermediate state: state. Migration not allowed. | Deployment is either being created, deleted or updated. Wait for the operation to complete and retry. | 
| The deployment deployment-name in hosted service cloud-service-name has reserved IP(s) but no reserved IP name. To resolve this issue, update reserved IP name or contact the Microsoft Azure service desk. | Update cloud service deployment. | 
| The deployment deployment-name in hosted service cloud-service-name has reserved IP(s) reserved-ip-name but no endpoint on the reserved IP. To resolve this issue, add at least one endpoint to the reserved IP. | Add endpoint to reserved ip. | 
| Migration of Deployment {0} in HostedService {1} is in the process of being committed and cannot be changed until it completes successfully.	| Wait or retry operation. | 
| Migration of Deployment {0} in HostedService {1} is in the process of being aborted and cannot be changed until it completes successfully. | Wait or retry operation. |
| One or more VMs in Deployment {0} in HostedService {1} is undergoing an update operation. It can't be migrated until the previous operation completes successfully. Please retry after sometime. | Wait for operation to complete. | 
| Migration is not supported for Deployment {0} in HostedService {1} because it uses following features not yet supported for migration: Non-vnet deployment.| Deployment is not located in an virtual network. Refer [this](in-place-migration-technical-details.md#migration-of-deployments-not-in-a-virtual-network) document for more details. | 
| The virtual network name cannot be null or empty.	Provide virtual network name in the REST request body
The Subnet Name cannot be null or empty. | Provide subnet name in the REST request body. | 
| DestinationVirtualNetwork must be set to one of the following values: Default, New, or Existing. | Provide DestinationVirtualNetwork property in the REST request body. | 
| Default VNet destination option not implemented. | “Default” value is not supported for DestinationVirtualNetwork property in the REST request body. | 
| The deployment {0} cannot be migrated because the CSPKG is not available. Please upgrade the deployment and try again. | | 
| The subnet with ID '{0}' is in a different location than deployment '{1}' in hosted service '{2}'. The location for the subnet is '{3}' and the location for the hosted service is '{4}'.  Please specify a subnet in the same location as the deployment. | Update the cloud service to have both subnet and cloud service in the same location before migration. | 
| Migration of Deployment {0} in HostedService {1} is in the process of being aborted and cannot be changed until it completes successfully. | Wait for abort to complete or retry abort. Use [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html) or Contact support otherwise. | 
| Deployment {0} in HostedService {1} has not been prepared for Migration.	Run prepare on the cloud service before running the commit operation. 
UnknownExceptionInEndExecute: Contract.Assert failed: rgName is null or empty: Exception received in EndExecute that is not an RdfeException. |	Use [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html) or Contact support. | 
| UnknownExceptionInEndExecute: A task was canceled.: Exception received in EndExecute that is not an RdfeException. | Use [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html) or Contact support. | 
| XrpVirtualNetworkMigrationError: Virtual network migration failure. | Use [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-cloud-services-extended-support.html) or Contact support. | 
| Deployment {0} in HostedService {1}  belongs to Virtual Network {2}. Please migrate Virtual Network {2} to migrate this HostedService {1}. | Refer to [Virtual Network migration](in-place-migration-technical-details.md#virtual-network-migration). | 
| The current quota for Resource name in Azure Resource Manager is insufficient to complete migration. Current quota is {0}, additional needed is {1}. Please file a support request to raise the quota and retry migration once the quota has been raised.	| Follow appropriate channels to request quota increase: <br>[Quota increase for networking resources](../azure-portal/supportability/networking-quota-requests.md) <br>[Quota increase for compute resources](../azure-portal/supportability/per-vm-quota-requests.md) | 

## Next Steps
Review [Technical details of migrating to Azure Cloud Services (extended support)](in-place-migration-technical-details.md)
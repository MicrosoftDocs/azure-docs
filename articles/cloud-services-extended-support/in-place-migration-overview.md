---
title: Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)
description: Overview of migration from Cloud Services (classic) to Cloud Service (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
ms.subservice: classic-to-arm-migration
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.date: 2/08/2021
ms.custom: 
---
 
# Migrate Azure Cloud Services (classic) to Azure Cloud Services (extended support)

This document provides an overview for migrating Cloud Services (classic) to Cloud Services (extended support).     

[Cloud Services (extended support)](overview.md) has the primary benefit of providing regional resiliency along with feature parity with Azure Cloud Services deployed using Azure Service Manager. It also offers some Azure Resource Manager capabilities such as role-based access control (RBAC), tags, policy, and supports deployment templates, private link. Both deployment models (extended support and classic) are available with [similar pricing structures](https://azure.microsoft.com/pricing/details/cloud-services/).

Cloud Services (extended support) supports two paths for customers to migrate from Azure Service Manager to Azure Resource Manager: Re-deploy and In-place Migration. 

The below table highlights comparison between these two options.  


| Redeploy | In-place migration | 
|---|---|
| Customers can deploy a new cloud service directly in Azure Resource Manager and then delete the old cloud service in Azure Service Manager thorough validation. | The in-place migration tool enables a seamless, platform orchestrated migration of existing Cloud Services (classic) deployments to Cloud Services (extended support). | 
| Redeploy allows customers to: <br><br> - Define resource names. <br><br> - Organize or reuse resources as preferred. <br><br> - Reuse service configuration and definition files with minimal changes. | For in-place migration, the platform: <br><br> - Defines resource names. <br><br> - Organizes each deployment and related resources in individual Resource Groups. <br><br> - Modifies existing configuration and definition file for Azure Resource Manager. | 
| Customers need to orchestrate traffic to the new deployment. | Migration retains IP address and data path remains the same. | 
| Customers need to delete the old cloud services in Azure Resource Manager. | Platform deletes the Cloud Services (classic) resources after migration. | 
| This is a lift and shift migration which offers more flexibility but requires additional time to migrate. | This is an automated migration which offers quick migration but less flexibility. | 

When evaluating migration plans from Cloud Services (classic) to Cloud Services (extended support) you may want to investigate additional Azure services such as: [Virtual Machine Scale Sets](../virtual-machine-scale-sets/overview.md), [App Service](../app-service/overview.md), [Azure Kubernetes Service](../aks/intro-kubernetes.md), and [Azure Service Fabric](../service-fabric/overview-managed-cluster.md). These services will continue to feature additional capabilities, while Cloud Services (extended support) will primarily maintain feature parity with Cloud Services (classic.)

Depending on the application, Cloud Services (extended support) may require substantially less effort to move to Azure Resource Manager compared to other options. If your application is not evolving, Cloud Services (extended support) is a viable option to consider as it provides a quick migration path. Conversely, if your application is continuously evolving and needs a more modern feature set, do explore other Azure services to better address your current and future requirements.

## Redeploy Overview

Redeploying your services with [Cloud Services (extended support)](overview.md) has the following benefits: 

- Supports web and worker roles, similar to [Cloud Services (classic).
- There are no changes to the design, architecture, or components of web and worker roles. 
- No changes are required to runtime code as the data plane is the same as cloud services. 
- Azure GuestOS releases and associated updates are aligned with Cloud Services (classic). 
- Underlying update process with respect to update domains, how upgrade proceeds, rollback, and allowed service changes during an update will not change.

A new Cloud Service (extended support) can be deployed directly in Azure Resource Manager using the following client tools:

- [Deploy a cloud service – Portal](deploy-portal.md)
- [Deploy a cloud service – PowerShell](deploy-powershell.md)
- [Deploy a cloud service – Template](deploy-template.md)
- [Deploy a cloud service – SDK](deploy-sdk.md)
- [Deploy a cloud service – Visual Studio](/visualstudio/azure/cloud-services-extended-support?context=%2fazure%2fcloud-services-extended-support%2fcontext%2fcontex)


## Migration tool Overview

The platform supported migration provides following key benefits:

- Enables seamless platform orchestrated migration with no downtime for most scenarios. Learn more about [supported scenarios](in-place-migration-technical-details.md).  
- Migrates existing cloud services in three simple steps: validate, prepare, commit (or abort). Learn more about how the [migration tool works](in-place-migration-overview.md#migration-steps).
- Provides the ability to test migrated deployments after successful preparation. Commit and finalize the migration while abort rolls back the migration.

The migration tool utilizes the same APIs and has the same experience as the [Virtual Machine (classic) migration](../virtual-machines/migration-classic-resource-manager-overview.md). 

## Setup access for migration

To perform this migration, you must be added as a coadministrator for the subscription and register the providers needed. 

1. Sign in to the Azure portal.
3. On the Hub menu, select Subscription. If you don't see it, select All services.
3. Find the appropriate subscription entry, and then look at the MY ROLE field. For a coadministrator, the value should be Account admin. If you're not able to add a co-administrator, contact a service administrator or co-administrator for the subscription to get yourself added.

4. Register your subscription for Microsoft.ClassicInfrastructureMigrate namespace using [Portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), [PowerShell](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell) or [CLI](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli)

    ```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate 
    ```
 
5. Check the status of your registration. Registration can take a few minutes to complete. 

    ```powershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.ClassicInfrastructureMigrate 
    ```

## How is migration for Cloud Services (classic) different from Virtual Machines (classic)?
Azure Service Manager supports two different compute products, [Azure Virtual Machines (classic)](/previous-versions/azure/virtual-machines/windows/classic/tutorial-classic) and [Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md) or Web/ Worker roles. The two products differ based on the deployment type that lies within the Cloud Service. Azure Cloud Services (classic) uses Cloud Service containing deployments with Web/Worker roles. Azure Virtual Machines (classic) uses a cloud service containing deployments with IaaS VMs.

The list of supported scenarios differs between Cloud Services (classic) and Virtual Machines (classic) because of differences in the deployment types.

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
- 	Virtual Networks (Azure Batch not supported)
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

## Supported configurations / migration scenarios
These are top scenarios involving combinations of resources, features, and Cloud Services. This list is not exhaustive.

| Service |	Configuration | Comments | 
|---|---|---|
| [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) | Virtual networks that contain Microsoft Entra Domain Services. | Virtual network containing both Cloud Service deployment and Microsoft Entra Domain Services is supported. Customer first needs to separately migrate Microsoft Entra Domain Services and then migrate the virtual network left only with the Cloud Service deployment |
| Cloud Service | Cloud Service with a deployment in a single slot only. | Cloud Services containing a prod slot deployment can be migrated. It is not recommended to migrate staging slot as this can result in issues with retaining service FQDN. To migrate staging slot, first promote staging deployment to production and then migrate to ARM. |
| Cloud Service | Deployment not in a publicly visible virtual network (default virtual network deployment) | A Cloud Service can be in a publicly visible virtual network, in a hidden virtual network or not in any virtual network.  Cloud Services in a hidden virtual network and publicly visible virtual networks are supported for migration. Customer can use the Validate API to tell if a deployment is inside a default virtual network or not and thus determine if it can be migrated. |
|Cloud Service | XML extensions (BGInfo, Visual Studio Debugger, Web Deploy, and Remote Debugging). | All xml extensions are supported for migration 
| Virtual Network | Virtual network containing multiple Cloud Services.	| Virtual network contain multiple cloud services is supported for migration. The virtual network and all the Cloud Services within it will be migrated together to Azure Resource Manager. |
| Virtual Network | Migration of virtual networks created via Portal (Requires using “Group Resource-group-name VNet-Name” in .cscfg file)  | As part of migration, the virtual network name in cscfg will be changed to use Azure Resource Manager ID of the virtual network. (subscription/subscription-id/resource-group/resource-group-name/resource/vnet-name) <br><br>To manage the deployment after migration, update the local copy of .cscfg file to start using Azure Resource Manager ID instead of virtual network name. <br><br>A .cscfg file that uses the old naming scheme will not pass validation. 
| Virtual Network | Migration of deployment with roles in different subnet. | A cloud service with different roles in different subnets is supported for migration. |

## Next steps
- [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../virtual-machines/migration-classic-resource-manager-overview.md)
- Migrate to Cloud Services (extended support) using the [Azure portal](in-place-migration-portal.md)
- Migrate to Cloud Services (extended support) using [PowerShell](in-place-migration-powershell.md)

---
title: Azure permissions for DevOps - Azure RBAC
description: Lists the permissions for the Azure resource providers in the DevOps category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 12/12/2024
ms.custom: generated
---

# Azure permissions for DevOps

This article lists the permissions for the Azure resource providers in the DevOps category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.Chaos

Azure service: [Azure Chaos Studio](/azure/chaos-studio/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Chaos/register/action | Registers the subscription for the Chaos Resource Provider and enables the creation of Chaos resources. |
> | Microsoft.Chaos/unregister/action | Unregisters the subscription for the Chaos Resource Provider and enables the creation of Chaos resources. |
> | Microsoft.Chaos/experiments/write | Creates or updates a Chaos Experiment resource in a resource group. |
> | Microsoft.Chaos/experiments/delete | Deletes a Chaos Experiment resource in a resource group. |
> | Microsoft.Chaos/experiments/read | Gets all Chaos Experiments in a resource group. |
> | Microsoft.Chaos/experiments/start/action | Starts a Chaos Experiment to inject faults. |
> | Microsoft.Chaos/experiments/cancel/action | Cancels a running Chaos Experiment to stop the fault injection. |
> | Microsoft.Chaos/experiments/executions/read | Gets all chaos experiment executions for a given chaos experiment. |
> | Microsoft.Chaos/experiments/executions/getExecutionDetails/action | Gets details of a chaos experiment execution for a given chaos experiment. |
> | Microsoft.Chaos/locations/operationResults/read | Gets an Operation Result. |
> | Microsoft.Chaos/locations/operationStatuses/read | Gets an Operation Status. |
> | Microsoft.Chaos/locations/targetTypes/read | Gets all TargetTypes. |
> | Microsoft.Chaos/locations/targetTypes/capabilityTypes/read | Gets all CapabilityType. |
> | Microsoft.Chaos/operations/read | Read the available Operations for Chaos Studio. |
> | Microsoft.Chaos/skus/read | Read the available SKUs for Chaos Studio. |
> | Microsoft.Chaos/targets/write | Creates or update a Target resource that extends a tracked resource. |
> | Microsoft.Chaos/targets/delete | Deletes a Target resource that extends a tracked resource. |
> | Microsoft.Chaos/targets/read | Gets all Targets that extend a tracked resource. |
> | Microsoft.Chaos/targets/capabilities/write | Creates or update a Capability resource that extends a Target resource. |
> | Microsoft.Chaos/targets/capabilities/delete | Deletes a Capability resource that extends a Target resource. |
> | Microsoft.Chaos/targets/capabilities/read | Gets all Capabilities that extend a Target resource. |

## Microsoft.DevCenter

Azure service: [Azure Deployment Environments](/azure/deployment-environments/overview-what-is-azure-deployment-environments)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DevCenter/checkNameAvailability/action | action checkNameAvailability |
> | Microsoft.DevCenter/checkScopedNameAvailability/action | Check the availability of name for resource |
> | Microsoft.DevCenter/register/action | Register the subscription for Microsoft.DevCenter |
> | Microsoft.DevCenter/unregister/action | Unregister the subscription for Microsoft.DevCenter |
> | Microsoft.DevCenter/devcenters/read | Lists all devcenters in a subscription. |
> | Microsoft.DevCenter/devcenters/read | Lists all devcenters in a resource group. |
> | Microsoft.DevCenter/devcenters/read | Gets a devcenter. |
> | Microsoft.DevCenter/devcenters/write | Creates or updates a devcenter resource |
> | Microsoft.DevCenter/devcenters/delete | Deletes a devcenter |
> | Microsoft.DevCenter/devcenters/write | Partially updates a devcenter. |
> | Microsoft.DevCenter/devcenters/attachednetworks/read | Lists the attached NetworkConnections for a DevCenter. |
> | Microsoft.DevCenter/devcenters/attachednetworks/read | Gets an attached NetworkConnection. |
> | Microsoft.DevCenter/devcenters/attachednetworks/write | Creates or updates an attached NetworkConnection. |
> | Microsoft.DevCenter/devcenters/attachednetworks/delete | Un-attach a NetworkConnection. |
> | Microsoft.DevCenter/devcenters/catalogs/read | Lists catalogs for a devcenter. |
> | Microsoft.DevCenter/devcenters/catalogs/read | Gets a catalog |
> | Microsoft.DevCenter/devcenters/catalogs/write | Creates or updates a catalog. |
> | Microsoft.DevCenter/devcenters/catalogs/delete | Deletes a catalog resource. |
> | Microsoft.DevCenter/devcenters/catalogs/write | Partially updates a catalog. |
> | Microsoft.DevCenter/devcenters/catalogs/getSyncErrorDetails/action | Gets catalog synchronization error details |
> | Microsoft.DevCenter/devcenters/catalogs/sync/action | Syncs templates for a template source. |
> | Microsoft.DevCenter/devcenters/catalogs/connect/action | Connects a catalog to enable syncing. |
> | Microsoft.DevCenter/devcenters/catalogs/environmentDefinitions/read | List environment definitions in the catalog. |
> | Microsoft.DevCenter/devcenters/catalogs/environmentDefinitions/read | Gets an environment definition from the catalog. |
> | Microsoft.DevCenter/devcenters/catalogs/environmentDefinitions/getErrorDetails/action | Gets Environment Definition error details |
> | Microsoft.DevCenter/devcenters/devboxdefinitions/read | List Dev Box definitions for a devcenter. |
> | Microsoft.DevCenter/devcenters/devboxdefinitions/read | Gets a Dev Box definition |
> | Microsoft.DevCenter/devcenters/devboxdefinitions/write | Creates or updates a Dev Box definition. |
> | Microsoft.DevCenter/devcenters/devboxdefinitions/delete | Deletes a Dev Box definition |
> | Microsoft.DevCenter/devcenters/devboxdefinitions/write | Partially updates a Dev Box definition. |
> | Microsoft.DevCenter/devcenters/environmentTypes/read | Lists environment types for the devcenter. |
> | Microsoft.DevCenter/devcenters/environmentTypes/read | Gets an environment type. |
> | Microsoft.DevCenter/devcenters/environmentTypes/write | Creates or updates an environment type. |
> | Microsoft.DevCenter/devcenters/environmentTypes/delete | Deletes an environment type. |
> | Microsoft.DevCenter/devcenters/environmentTypes/write | Partially updates an environment type. |
> | Microsoft.DevCenter/devcenters/galleries/read | Lists galleries for a devcenter. |
> | Microsoft.DevCenter/devcenters/galleries/read | Gets a gallery |
> | Microsoft.DevCenter/devcenters/galleries/write | Creates or updates a gallery. |
> | Microsoft.DevCenter/devcenters/galleries/delete | Deletes a gallery resource. |
> | Microsoft.DevCenter/devcenters/galleries/images/read | Lists images for a gallery. |
> | Microsoft.DevCenter/devcenters/galleries/images/read | Gets a gallery image. |
> | Microsoft.DevCenter/devcenters/galleries/images/versions/read | Lists versions for an image. |
> | Microsoft.DevCenter/devcenters/galleries/images/versions/read | Gets an image version. |
> | Microsoft.DevCenter/devcenters/images/read | Lists images for a devcenter. |
> | Microsoft.DevCenter/Locations/OperationStatuses/read | read OperationStatuses |
> | Microsoft.DevCenter/Locations/OperationStatuses/write | write OperationStatuses |
> | Microsoft.DevCenter/locations/usages/read | Lists the current usages and limits in this location for the provided subscription. |
> | Microsoft.DevCenter/networkConnections/read | Lists network connections in a subscription |
> | Microsoft.DevCenter/networkConnections/read | Lists network connections in a resource group |
> | Microsoft.DevCenter/networkConnections/read | Gets a network connection resource |
> | Microsoft.DevCenter/networkConnections/write | Creates or updates a Network Connections resource |
> | Microsoft.DevCenter/networkConnections/delete | Deletes a Network Connections resource |
> | Microsoft.DevCenter/networkConnections/write | Partially updates a Network Connection |
> | Microsoft.DevCenter/networkConnections/runHealthChecks/action | Triggers a new health check run. The execution and health check result can be tracked via the network Connection health check details |
> | Microsoft.DevCenter/networkConnections/DevCenterJoin/action | Allow a DevCenter to attach this NetworkConnection. |
> | Microsoft.DevCenter/networkConnections/healthChecks/read | Lists health check status details |
> | Microsoft.DevCenter/networkConnections/healthChecks/read | Gets health check status details. |
> | Microsoft.DevCenter/networkConnections/outboundNetworkDependenciesEndpoints/read | Lists the endpoints that agents may call as part of Dev Box service administration. These FQDNs should be allowed for outbound access in order for the Dev Box service to function. |
> | Microsoft.DevCenter/operations/read | read operations |
> | Microsoft.DevCenter/projects/read | Lists all projects in the subscription. |
> | Microsoft.DevCenter/projects/read | Lists all projects in the resource group. |
> | Microsoft.DevCenter/projects/read | Gets a specific project. |
> | Microsoft.DevCenter/projects/write | Creates or updates a project. |
> | Microsoft.DevCenter/projects/delete | Deletes a project resource. |
> | Microsoft.DevCenter/projects/write | Partially updates a project. |
> | Microsoft.DevCenter/projects/allowedEnvironmentTypes/read | Lists allowed environment types for a project. |
> | Microsoft.DevCenter/projects/allowedEnvironmentTypes/read | Gets an allowed environment type. |
> | Microsoft.DevCenter/projects/attachednetworks/read | Lists the attached NetworkConnections for a Project. |
> | Microsoft.DevCenter/projects/attachednetworks/read | Gets an attached NetworkConnection. |
> | Microsoft.DevCenter/projects/catalogs/read | Lists the catalogs associated with a project. |
> | Microsoft.DevCenter/projects/catalogs/read | Gets an associated project catalog. |
> | Microsoft.DevCenter/projects/catalogs/write | Creates or updates a project catalog. |
> | Microsoft.DevCenter/projects/catalogs/delete | Deletes a project catalog resource. |
> | Microsoft.DevCenter/projects/catalogs/write | Partially updates a project catalog. |
> | Microsoft.DevCenter/projects/catalogs/getSyncErrorDetails/action | Gets project catalog synchronization error details |
> | Microsoft.DevCenter/projects/catalogs/sync/action | Syncs templates for a template source. |
> | Microsoft.DevCenter/projects/catalogs/connect/action | Connects a project catalog to enable syncing. |
> | Microsoft.DevCenter/projects/catalogs/environmentDefinitions/read | Lists the environment definitions in this project catalog. |
> | Microsoft.DevCenter/projects/catalogs/environmentDefinitions/read | Gets an environment definition from the catalog. |
> | Microsoft.DevCenter/projects/catalogs/environmentDefinitions/getErrorDetails/action | Gets Environment Definition error details |
> | Microsoft.DevCenter/projects/devboxdefinitions/read | List Dev Box definitions configured for a project. |
> | Microsoft.DevCenter/projects/devboxdefinitions/read | Gets a Dev Box definition configured for a project |
> | Microsoft.DevCenter/projects/environmentTypes/read | Lists environment types for a project. |
> | Microsoft.DevCenter/projects/environmentTypes/read | Gets a project environment type. |
> | Microsoft.DevCenter/projects/environmentTypes/write | Creates or updates a project environment type. |
> | Microsoft.DevCenter/projects/environmentTypes/delete | Deletes a project environment type. |
> | Microsoft.DevCenter/projects/environmentTypes/write | Partially updates a project environment type. |
> | Microsoft.DevCenter/projects/pools/read | Lists pools for a project |
> | Microsoft.DevCenter/projects/pools/read | Gets a machine pool |
> | Microsoft.DevCenter/projects/pools/write | Creates or updates a machine pool |
> | Microsoft.DevCenter/projects/pools/delete | Deletes a machine pool |
> | Microsoft.DevCenter/projects/pools/write | Partially updates a machine pool |
> | Microsoft.DevCenter/projects/pools/runHealthChecks/action | Triggers a refresh of the pool status. |
> | Microsoft.DevCenter/projects/pools/schedules/read | Lists schedules for a pool |
> | Microsoft.DevCenter/projects/pools/schedules/read | Gets a schedule resource. |
> | Microsoft.DevCenter/projects/pools/schedules/write | Creates or updates a Schedule. |
> | Microsoft.DevCenter/projects/pools/schedules/delete | Deletes a Scheduled. |
> | Microsoft.DevCenter/projects/pools/schedules/write | Partially updates a Scheduled. |
> | Microsoft.DevCenter/registeredSubscriptions/read | read registeredSubscriptions |
> | Microsoft.DevCenter/RegisteredSubscriptions/read | Reads registered subscriptions |
> | **DataAction** | **Description** |
> | Microsoft.DevCenter/projects/users/devboxes/adminStart/action | Allows a user to start any Dev Box resource. |
> | Microsoft.DevCenter/projects/users/devboxes/adminStop/action | Allows a user to stop any Dev Box resource. |
> | Microsoft.DevCenter/projects/users/devboxes/adminRead/action | Allows a user read access to any Dev Box resource. |
> | Microsoft.DevCenter/projects/users/devboxes/adminWrite/action | Allows a user write access to any Dev Box resource. |
> | Microsoft.DevCenter/projects/users/devboxes/adminDelete/action | Allows a user to delete any Dev Box resource. |
> | Microsoft.DevCenter/projects/users/devboxes/userStop/action | Allows a user to stop their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/devboxes/userStart/action | Allows a user to start their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/devboxes/userGetRemoteConnection/action | Allows a user to get the RDP connection information for their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/devboxes/userRead/action | Allows a user to read their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/devboxes/userWrite/action | Allows a user to create and update their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/devboxes/userDelete/action | Allows a user to delete their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/devboxes/userUpcomingActionRead/action | Allows a user to read upcoming actions. |
> | Microsoft.DevCenter/projects/users/devboxes/userUpcomingActionManage/action | Allows a user to skip or delay upcoming actions. |
> | Microsoft.DevCenter/projects/users/devboxes/userActionRead/action | Allows a user to read dev box actions. |
> | Microsoft.DevCenter/projects/users/devboxes/userActionManage/action | Allows a user to skip or delay dev box actions. |
> | Microsoft.DevCenter/projects/users/devboxes/userCustomize/action | Allows a user to customize their own Dev Box resources. |
> | Microsoft.DevCenter/projects/users/environments/userRead/action | Allows a user to read the environments they have access to in a project. |
> | Microsoft.DevCenter/projects/users/environments/adminRead/action | Allows a project administrator to read all of the environments in a project. |
> | Microsoft.DevCenter/projects/users/environments/userWrite/action | Allows a user to write the environments they have access to in a project. |
> | Microsoft.DevCenter/projects/users/environments/adminWrite/action | Allows a project administrator to write all of the environments in a project. |
> | Microsoft.DevCenter/projects/users/environments/userDelete/action | Allows a user to delete the environments they have access to in a project. |
> | Microsoft.DevCenter/projects/users/environments/adminDelete/action | Allows a project administrator to delete all of the environments in a project. |
> | Microsoft.DevCenter/projects/users/environments/userAction/action | Allows a user to perform an action on the environments they have access to in a project. |
> | Microsoft.DevCenter/projects/users/environments/adminAction/action | Allows a project administrator to perform an action on all of the environments in a project. |
> | Microsoft.DevCenter/projects/users/environments/userActionRead/action | Allows a user to read environment actions. |
> | Microsoft.DevCenter/projects/users/environments/adminActionRead/action | Allows an admin to read environment actions. |
> | Microsoft.DevCenter/projects/users/environments/userActionManage/action | Allows a user to skip, delay etc. environment actions. |
> | Microsoft.DevCenter/projects/users/environments/adminActionManage/action | Allows an admin to skip, delay etc. environment actions. |
> | Microsoft.DevCenter/projects/users/environments/userOutputsRead/action | Allows a user to read Output values from environment deployment. |
> | Microsoft.DevCenter/projects/users/environments/adminOutputsRead/action | Allows an admin to read Output values from environment deployment. |

## Microsoft.DevTestLab

Quickly create environments using reusable templates and artifacts.

Azure service: [Azure Lab Services](/azure/lab-services/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DevTestLab/register/action | Registers the subscription |
> | Microsoft.DevTestLab/labs/delete | Delete labs. |
> | Microsoft.DevTestLab/labs/read | Read labs. |
> | Microsoft.DevTestLab/labs/write | Add or modify labs. |
> | Microsoft.DevTestLab/labs/ListVhds/action | List disk images available for custom image creation. |
> | Microsoft.DevTestLab/labs/GenerateUploadUri/action | Generate a URI for uploading custom disk images to a Lab. |
> | Microsoft.DevTestLab/labs/CreateEnvironment/action | Create virtual machines in a lab. |
> | Microsoft.DevTestLab/labs/ClaimAnyVm/action | Claim a random claimable virtual machine in the lab. |
> | Microsoft.DevTestLab/labs/ExportResourceUsage/action | Exports the lab resource usage into a storage account |
> | Microsoft.DevTestLab/labs/ImportVirtualMachine/action | Import a virtual machine into a different lab. |
> | Microsoft.DevTestLab/labs/EnsureCurrentUserProfile/action | Ensure the current user has a valid profile in the lab. |
> | Microsoft.DevTestLab/labs/artifactSources/delete | Delete artifact sources. |
> | Microsoft.DevTestLab/labs/artifactSources/read | Read artifact sources. |
> | Microsoft.DevTestLab/labs/artifactSources/write | Add or modify artifact sources. |
> | Microsoft.DevTestLab/labs/artifactSources/armTemplates/read | Read azure resource manager templates. |
> | Microsoft.DevTestLab/labs/artifactSources/artifacts/read | Read artifacts. |
> | Microsoft.DevTestLab/labs/artifactSources/artifacts/GenerateArmTemplate/action | Generates an Azure Resource Manager template for the given artifact, uploads the required files to a storage account, and validates the generated artifact. |
> | Microsoft.DevTestLab/labs/costs/read | Read costs. |
> | Microsoft.DevTestLab/labs/costs/write | Add or modify costs. |
> | Microsoft.DevTestLab/labs/customImages/delete | Delete custom images. |
> | Microsoft.DevTestLab/labs/customImages/read | Read custom images. |
> | Microsoft.DevTestLab/labs/customImages/write | Add or modify custom images. |
> | Microsoft.DevTestLab/labs/formulas/delete | Delete formulas. |
> | Microsoft.DevTestLab/labs/formulas/read | Read formulas. |
> | Microsoft.DevTestLab/labs/formulas/write | Add or modify formulas. |
> | Microsoft.DevTestLab/labs/galleryImages/read | Read gallery images. |
> | Microsoft.DevTestLab/labs/notificationChannels/delete | Delete notification channels. |
> | Microsoft.DevTestLab/labs/notificationChannels/read | Read notification channels. |
> | Microsoft.DevTestLab/labs/notificationChannels/write | Add or modify notification channels. |
> | Microsoft.DevTestLab/labs/notificationChannels/Notify/action | Send notification to provided channel. |
> | Microsoft.DevTestLab/labs/policySets/read | Read policy sets. |
> | Microsoft.DevTestLab/labs/policySets/EvaluatePolicies/action | Evaluates lab policy. |
> | Microsoft.DevTestLab/labs/policySets/policies/delete | Delete policies. |
> | Microsoft.DevTestLab/labs/policySets/policies/read | Read policies. |
> | Microsoft.DevTestLab/labs/policySets/policies/write | Add or modify policies. |
> | Microsoft.DevTestLab/labs/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/labs/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/labs/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/labs/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/labs/schedules/ListApplicable/action | Lists all applicable schedules |
> | Microsoft.DevTestLab/labs/secrets/delete | Delete lab secrets. |
> | Microsoft.DevTestLab/labs/secrets/read | Read lab secrets. |
> | Microsoft.DevTestLab/labs/secrets/write | Add or modify lab secrets. |
> | Microsoft.DevTestLab/labs/serviceRunners/delete | Delete service runners. |
> | Microsoft.DevTestLab/labs/serviceRunners/read | Read service runners. |
> | Microsoft.DevTestLab/labs/serviceRunners/write | Add or modify service runners. |
> | Microsoft.DevTestLab/labs/sharedGalleries/delete | Delete shared galleries. |
> | Microsoft.DevTestLab/labs/sharedGalleries/read | Read shared galleries. |
> | Microsoft.DevTestLab/labs/sharedGalleries/write | Add or modify shared galleries. |
> | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/delete | Delete shared images. |
> | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/read | Read shared images. |
> | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/write | Add or modify shared images. |
> | Microsoft.DevTestLab/labs/users/delete | Delete user profiles. |
> | Microsoft.DevTestLab/labs/users/read | Read user profiles. |
> | Microsoft.DevTestLab/labs/users/write | Add or modify user profiles. |
> | Microsoft.DevTestLab/labs/users/disks/delete | Delete disks. |
> | Microsoft.DevTestLab/labs/users/disks/read | Read disks. |
> | Microsoft.DevTestLab/labs/users/disks/write | Add or modify disks. |
> | Microsoft.DevTestLab/labs/users/disks/Attach/action | Attach and create the lease of the disk to the virtual machine. |
> | Microsoft.DevTestLab/labs/users/disks/Detach/action | Detach and break the lease of the disk attached to the virtual machine. |
> | Microsoft.DevTestLab/labs/users/environments/delete | Delete environments. |
> | Microsoft.DevTestLab/labs/users/environments/read | Read environments. |
> | Microsoft.DevTestLab/labs/users/environments/write | Add or modify environments. |
> | Microsoft.DevTestLab/labs/users/secrets/delete | Delete secrets. |
> | Microsoft.DevTestLab/labs/users/secrets/read | Read secrets. |
> | Microsoft.DevTestLab/labs/users/secrets/write | Add or modify secrets. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/delete | Delete service fabrics. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/read | Read service fabrics. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/write | Add or modify service fabrics. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/Start/action | Start a service fabric. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/Stop/action | Stop a service fabric |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/ListApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/labs/virtualMachines/delete | Delete virtual machines. |
> | Microsoft.DevTestLab/labs/virtualMachines/read | Read virtual machines. |
> | Microsoft.DevTestLab/labs/virtualMachines/write | Add or modify virtual machines. |
> | Microsoft.DevTestLab/labs/virtualMachines/AddDataDisk/action | Attach a new or existing data disk to virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/ApplyArtifacts/action | Apply artifacts to virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Claim/action | Take ownership of an existing virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/ClearArtifactResults/action | Clears the artifact results of the virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/DetachDataDisk/action | Detach the specified disk from the virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/GetRdpFileContents/action | Gets a string that represents the contents of the RDP file for the virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/ListApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Microsoft.DevTestLab/labs/virtualMachines/Redeploy/action | Redeploy a virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/Resize/action | Resize Virtual Machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Restart/action | Restart a virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Start/action | Start a virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Stop/action | Stop a virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/Hibernate/action |  |
> | Microsoft.DevTestLab/labs/virtualMachines/TransferDisks/action | Transfers all data disks attached to the virtual machine to be owned by the current user. |
> | Microsoft.DevTestLab/labs/virtualMachines/UnClaim/action | Release ownership of an existing virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/labs/virtualNetworks/delete | Delete virtual networks. |
> | Microsoft.DevTestLab/labs/virtualNetworks/read | Read virtual networks. |
> | Microsoft.DevTestLab/labs/virtualNetworks/write | Add or modify virtual networks. |
> | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/delete | Delete bastionhosts. |
> | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/read | Read bastionhosts. |
> | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/write | Add or modify bastionhosts. |
> | Microsoft.DevTestLab/labs/vmPools/delete | Delete virtual machine pools. |
> | Microsoft.DevTestLab/labs/vmPools/read | Read virtual machine pools. |
> | Microsoft.DevTestLab/labs/vmPools/write | Add or modify virtual machine pools. |
> | Microsoft.DevTestLab/locations/operations/read | Read operations. |
> | Microsoft.DevTestLab/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/schedules/Retarget/action | Updates a schedule's target resource Id. |

## Microsoft.LabServices

Set up labs for classrooms, trials, development and testing, and other scenarios.

Azure service: [Azure Lab Services](/azure/lab-services/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.LabServices/register/action | Register the subscription with the Lab Services provider and enable the creation of labs. |
> | Microsoft.LabServices/unregister/action | Unregister the subscription with the Lab Services provider. |
> | Microsoft.LabServices/labAccounts/delete | Delete lab accounts. |
> | Microsoft.LabServices/labAccounts/read | Read lab accounts. |
> | Microsoft.LabServices/labAccounts/write | Add or modify lab accounts. |
> | Microsoft.LabServices/labAccounts/CreateLab/action | Create a lab in a lab account. |
> | Microsoft.LabServices/labAccounts/GetRegionalAvailability/action | Get regional availability information for each size category configured under a lab account |
> | Microsoft.LabServices/labAccounts/GetPricingAndAvailability/action | Get the pricing and availability of combinations of sizes, geographies, and operating systems for the lab account. |
> | Microsoft.LabServices/labAccounts/GetRestrictionsAndUsage/action | Get core restrictions and usage for this subscription |
> | Microsoft.LabServices/labAccounts/galleryImages/delete | Delete gallery images. |
> | Microsoft.LabServices/labAccounts/galleryImages/read | Read gallery images. |
> | Microsoft.LabServices/labAccounts/galleryImages/write | Add or modify gallery images. |
> | Microsoft.LabServices/labAccounts/labs/delete | Delete labs. |
> | Microsoft.LabServices/labAccounts/labs/read | Read labs. |
> | Microsoft.LabServices/labAccounts/labs/write | Add or modify labs. |
> | Microsoft.LabServices/labAccounts/labs/AddUsers/action | Add users to a lab |
> | Microsoft.LabServices/labAccounts/labs/SendEmail/action | Send email with registration link to the lab |
> | Microsoft.LabServices/labAccounts/labs/GetLabPricingAndAvailability/action | Get the pricing per lab unit for this lab and the availability which indicates if this lab can scale up. |
> | Microsoft.LabServices/labAccounts/labs/SyncUserList/action | Syncs the changes from the AAD group to the userlist |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/delete | Delete environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/read | Read environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/write | Add or modify environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/Publish/action | Provisions/deprovisions required resources for an environment setting based on current state of the lab/environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/Start/action | Starts a template by starting all resources inside the template. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/Stop/action | Stops a template by stopping all resources inside the template. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/SaveImage/action | Saves current template image to the shared gallery in the lab account |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/ResetPassword/action | Resets password on the template virtual machine. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/delete | Delete environments. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/read | Read environments. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/Start/action | Starts an environment by starting all resources inside the environment. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/Stop/action | Stops an environment by stopping all resources inside the environment |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/ResetPassword/action | Resets the user password on an environment |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/delete | Delete schedules. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/read | Read schedules. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/write | Add or modify schedules. |
> | Microsoft.LabServices/labAccounts/labs/users/delete | Delete users. |
> | Microsoft.LabServices/labAccounts/labs/users/read | Read users. |
> | Microsoft.LabServices/labAccounts/labs/users/write | Add or modify users. |
> | Microsoft.LabServices/labAccounts/sharedGalleries/delete | Delete sharedgalleries. |
> | Microsoft.LabServices/labAccounts/sharedGalleries/read | Read sharedgalleries. |
> | Microsoft.LabServices/labAccounts/sharedGalleries/write | Add or modify sharedgalleries. |
> | Microsoft.LabServices/labAccounts/sharedImages/delete | Delete sharedimages. |
> | Microsoft.LabServices/labAccounts/sharedImages/read | Read sharedimages. |
> | Microsoft.LabServices/labAccounts/sharedImages/write | Add or modify sharedimages. |
> | Microsoft.LabServices/labPlans/read | Get the properties of a lab plan. |
> | Microsoft.LabServices/labPlans/write | Create new or update an existing lab plan. |
> | Microsoft.LabServices/labPlans/delete | Delete the lab plan. |
> | Microsoft.LabServices/labPlans/saveImage/action | Create an image from a virtual machine in the gallery attached to the lab plan. |
> | Microsoft.LabServices/labPlans/images/read | Get the properties of an image. |
> | Microsoft.LabServices/labPlans/images/write | Enable or disable a marketplace or gallery image. |
> | Microsoft.LabServices/labs/read | Get the properties of a lab. |
> | Microsoft.LabServices/labs/write | Create new or update an existing lab. |
> | Microsoft.LabServices/labs/delete | Delete the lab and all its users, schedules and virtual machines. |
> | Microsoft.LabServices/labs/publish/action | Publish a lab by propagating image of the template virtual machine to all virtual machines in the lab. |
> | Microsoft.LabServices/labs/syncGroup/action | Updates the list of users from the Active Directory group assigned to the lab. |
> | Microsoft.LabServices/labs/schedules/read | Get the properties of a schedule. |
> | Microsoft.LabServices/labs/schedules/write | Create new or update an existing schedule. |
> | Microsoft.LabServices/labs/schedules/delete | Delete the schedule. |
> | Microsoft.LabServices/labs/users/read | Get the properties of a user. |
> | Microsoft.LabServices/labs/users/write | Create new or update an existing user. |
> | Microsoft.LabServices/labs/users/delete | Delete the user. |
> | Microsoft.LabServices/labs/users/invite/action | Send email invitation to a user to join the lab. |
> | Microsoft.LabServices/labs/virtualMachines/read | Get the properties of a virtual machine. |
> | Microsoft.LabServices/labs/virtualMachines/start/action | Start a virtual machine. |
> | Microsoft.LabServices/labs/virtualMachines/stop/action | Stop and deallocate a virtual machine. |
> | Microsoft.LabServices/labs/virtualMachines/reimage/action | Reimage a virtual machine to the last published image. |
> | Microsoft.LabServices/labs/virtualMachines/redeploy/action | Redeploy a virtual machine to a different compute node. |
> | Microsoft.LabServices/labs/virtualMachines/resetPassword/action | Reset local user's password on a virtual machine. |
> | Microsoft.LabServices/locations/operationResults/read | Get the properties and status of an asynchronous operation. |
> | Microsoft.LabServices/locations/operations/read | Read operations. |
> | Microsoft.LabServices/locations/usages/read | Get Usage in a location |
> | Microsoft.LabServices/skus/read | Get the properties of a Lab Services SKU. |
> | Microsoft.LabServices/users/Register/action | Register a user to a managed lab |
> | Microsoft.LabServices/users/ListAllEnvironments/action | List all Environments for the user |
> | Microsoft.LabServices/users/StartEnvironment/action | Starts an environment by starting all resources inside the environment. |
> | Microsoft.LabServices/users/StopEnvironment/action | Stops an environment by stopping all resources inside the environment |
> | Microsoft.LabServices/users/ResetPassword/action | Resets the user password on an environment |
> | Microsoft.LabServices/users/UserSettings/action | Updates and returns personal user settings. |
> | **DataAction** | **Description** |
> | Microsoft.LabServices/labPlans/createLab/action | Create a new lab from a lab plan. |

## Microsoft.LoadTestService

Azure service: [Azure Load Testing](/azure/load-testing/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.LoadTestService/checkNameAvailability/action | Checks if a LoadTest resource name is available |
> | Microsoft.LoadTestService/register/action | Register the subscription for Microsoft.LoadTestService |
> | Microsoft.LoadTestService/unregister/action | Unregister the subscription for Microsoft.LoadTestService |
> | Microsoft.LoadTestService/loadTestMappings/read | Get a LoadTest mapping resource, or Lists LoadTest mapping resources in a scope. |
> | Microsoft.LoadTestService/loadTestMappings/write | Create or update LoadTest mapping resource. |
> | Microsoft.LoadTestService/loadTestMappings/delete | Delete a LoadTest mapping resource. |
> | Microsoft.LoadTestService/loadTestProfileMappings/read | Get a LoadTest profile mapping resource, or Lists LoadTest profile mapping resources in a scope. |
> | Microsoft.LoadTestService/loadTestProfileMappings/write | Create or update LoadTest profile mapping resource. |
> | Microsoft.LoadTestService/loadTestProfileMappings/delete | Delete a LoadTest profile mapping resource. |
> | Microsoft.LoadTestService/loadTests/read | Get a LoadTest resource, or Lists loadtest resources in a subscription or resource group. |
> | Microsoft.LoadTestService/loadTests/write | Create or update LoadTest resource. |
> | Microsoft.LoadTestService/loadTests/delete | Delete a LoadTest resource. |
> | Microsoft.LoadTestService/loadTests/outboundNetworkDependenciesEndpoints/read | Lists the endpoints that agents may call as part of load testing. |
> | Microsoft.LoadTestService/Locations/OperationStatuses/read | Read OperationStatuses |
> | Microsoft.LoadTestService/Locations/OperationStatuses/write | Write OperationStatuses |
> | Microsoft.LoadTestService/locations/quotas/read | Get/List the available quotas for quota buckets per region per subscription. |
> | Microsoft.LoadTestService/locations/quotas/checkAvailability/action | Check Quota Availability on quota bucket per region per subscription. |
> | Microsoft.LoadTestService/operations/read | read operations |
> | Microsoft.LoadTestService/registeredSubscriptions/read | read registeredSubscriptions |
> | **DataAction** | **Description** |
> | Microsoft.LoadTestService/loadtests/startTest/action | Start Load Tests |
> | Microsoft.LoadTestService/loadtests/stopTest/action | Stop Load Tests |
> | Microsoft.LoadTestService/loadtests/writeTest/action | Create or Update Load Tests |
> | Microsoft.LoadTestService/loadtests/deleteTest/action | Delete Load Tests |
> | Microsoft.LoadTestService/loadtests/readTest/action | Read Load Tests |
> | Microsoft.LoadTestService/testProfileRuns/write | Write Test Profile Runs |
> | Microsoft.LoadTestService/testProfileRuns/read | Read Test Profile Runs |
> | Microsoft.LoadTestService/testProfileRuns/delete | Delete Test Profile Runs |
> | Microsoft.LoadTestService/testProfileRuns/stop/action | Stop Test Profile Runs |
> | Microsoft.LoadTestService/testProfiles/write | Write Test Profiles |
> | Microsoft.LoadTestService/testProfiles/read | Read Test Profiles |
> | Microsoft.LoadTestService/testProfiles/delete | Delete Test Profiles |

## Microsoft.VisualStudio

The powerful and flexible environment for developing applications in the cloud.

Azure service: [Azure DevOps](/azure/devops/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.VisualStudio/Register/Action | Register Azure Subscription with Microsoft.VisualStudio provider |
> | Microsoft.VisualStudio/Account/Write | Set Account |
> | Microsoft.VisualStudio/Account/Delete | Delete Account |
> | Microsoft.VisualStudio/Account/Read | Read Account |
> | Microsoft.VisualStudio/Account/Extension/Read | Read Account/Extension |
> | Microsoft.VisualStudio/Account/Project/Read | Read Account/Project |
> | Microsoft.VisualStudio/Account/Project/Write | Set Account/Project |
> | Microsoft.VisualStudio/Extension/Write | Set Extension |
> | Microsoft.VisualStudio/Extension/Delete | Delete Extension |
> | Microsoft.VisualStudio/Extension/Read | Read Extension |
> | Microsoft.VisualStudio/Project/Write | Set Project |
> | Microsoft.VisualStudio/Project/Delete | Delete Project |
> | Microsoft.VisualStudio/Project/Read | Read Project |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)
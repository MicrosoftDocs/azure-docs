---
title: DevOps resource provider operations include file
description: DevOps resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.DevTestLab

Azure service: [Azure Lab Services](../../../lab-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DevTestLab/register/action | Registers the subscription |
> | Microsoft.DevTestLab/labCenters/delete | Delete lab centers. |
> | Microsoft.DevTestLab/labCenters/read | Read lab centers. |
> | Microsoft.DevTestLab/labCenters/write | Add or modify lab centers. |
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

### Microsoft.LabServices

Azure service: [Azure Lab Services](../../../lab-services/index.yml)

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

### Microsoft.SecurityDevOps

Azure service: [Microsoft Defender for Cloud](../../../defender-for-cloud/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SecurityDevOps/register/action | Register the subscription for Microsoft.SecurityDevOps |
> | Microsoft.SecurityDevOps/unregister/action | Unregister the subscription for Microsoft.SecurityDevOps |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/read | read azureDevOpsConnectors |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/read | read azureDevOpsConnectors |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/write | write azureDevOpsConnectors |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/delete | delete azureDevOpsConnectors |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/write | write azureDevOpsConnectors |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/read | read azureDevOpsConnectors |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/read | read orgs |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/read | read orgs |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/write | write orgs |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/write | write orgs |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/read | read projects |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/read | read projects |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/write | write projects |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/write | write projects |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/repos/read | read repos |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/repos/read | read repos |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/repos/write | write repos |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/orgs/projects/repos/write | write repos |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/repos/read | read repos |
> | Microsoft.SecurityDevOps/azureDevOpsConnectors/stats/read | read stats |
> | Microsoft.SecurityDevOps/gitHubConnectors/read | read gitHubConnectors |
> | Microsoft.SecurityDevOps/gitHubConnectors/read | read gitHubConnectors |
> | Microsoft.SecurityDevOps/gitHubConnectors/write | write gitHubConnectors |
> | Microsoft.SecurityDevOps/gitHubConnectors/delete | delete gitHubConnectors |
> | Microsoft.SecurityDevOps/gitHubConnectors/write | write gitHubConnectors |
> | Microsoft.SecurityDevOps/gitHubConnectors/read | read gitHubConnectors |
> | Microsoft.SecurityDevOps/gitHubConnectors/gitHubRepos/read | Returns a list of monitored GitHub repositories. |
> | Microsoft.SecurityDevOps/gitHubConnectors/gitHubRepos/read | Returns a monitored GitHub repository resource for a given ID. |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/read | read owners |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/read | read owners |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/write | write owners |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/write | write owners |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/repos/read | read repos |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/repos/read | read repos |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/repos/write | write repos |
> | Microsoft.SecurityDevOps/gitHubConnectors/owners/repos/write | write repos |
> | Microsoft.SecurityDevOps/gitHubConnectors/repos/read | read repos |
> | Microsoft.SecurityDevOps/gitHubConnectors/stats/read | read stats |
> | Microsoft.SecurityDevOps/Locations/OperationStatuses/read | read OperationStatuses |
> | Microsoft.SecurityDevOps/Locations/OperationStatuses/write | write OperationStatuses |
> | Microsoft.SecurityDevOps/Operations/read | read Operations |

### Microsoft.VisualStudio

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

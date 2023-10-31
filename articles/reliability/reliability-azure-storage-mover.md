---
title: Reliability in Azure Storage Mover
description: Find out about reliability in Azure Storage Mover
author: johnmic
ms.author: johnmic
ms.topic: conceptual
ms.custom: subject-reliability, references_regions
ms.service: azure-storage-mover
ms.date: 03/21/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final       

REVIEW Stephen/Fabian: completed
REVIEW Engineering: not reviewed
EDIT PASS: completed

Initial doc score: 70
Current doc score: 100, 1130, 0

!########################################################
-->

# Reliability in Azure Storage Mover

This article describes reliability support in [Azure Storage Mover](/azure/storage-mover/service-overview) and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Storage Mover supports a zone-redundant deployment model.  

When you deploy an Azure Storage Mover resource, you must [select a particular region](/azure/storage-mover/deployment-planning#select-an-azure-region-for-your-deployment) in which the resource's instance metadata is stored. 

If the region supports availability zones, the instance metadata is automatically replicated across multiple availability zones within that region. 

>[!IMPORTANT]
>Azure Storage Mover instance metadata includes projects, endpoints, agents, job definitions, and job run history, but doesn't include the actual data to be migrated. Azure storage accounts that are used as migration targets have their own reliability support.  


### Prerequisites

- To deploy with availability zone support, you must choose a region that supports availability zones. To see which regions supports availability zones, see the [list of supported regions](availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

- (Optional) If your target storage account doesn't support availability zones, and you would like to migrate the account to AZ support, see [Migrate Azure Storage accounts to availability zone support](migrate-storage.md).

### Zone down experience

During a zone-wide outage, no action is required during zone recovery. Azure Storage Mover is designed to self-heal and re-balance itself to take advantage of the healthy zone automatically.

Any migration target storage account may require its own recovery steps. This requirement depends on the redundancy options chosen for each storage account. See the [storage account disaster recovery guide](/azure/storage/common/storage-disaster-recovery-guidance) to determine whether more steps are necessary.

If a local storage was chosen in lieu of redundancy options, you may need to create a new storage account for use in migrations during the outage.


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

When a Storage Mover agent is registered, it connects to the region in which the Storage Mover resource is registered. If an agent's Azure region experiences an outage, the agent itself isn't affected, but management operations that rely on Azure may be unable to complete. In addition, any active data migrations to storage accounts located within the affected region may fail.

Storage Mover supports two forms of disaster recovery: 

- [Azure initiated disaster recovery](#azure-initiated-disaster-recovery)
- [Customer initiated disaster recovery](#customer-initiated-disaster-recovery)

>[!IMPORTANT]
>Disaster recovery for on-premises data sources is the responsibility of the customer.


### Azure initiated disaster recovery

Azure initiated disaster recovery is only applicable to those [regions that have region pairs](./cross-region-replication-azure.md#azure-paired-regions).  When cross-region replication is utilized, instance metadata is replicated to each region, but is never permitted to leave the geography. 

Azure Storage Mover uses Cosmos DB for storing instance metadata. Data loss may occur only with an unrecoverable disaster in the Azure Cosmos DB . For more information, see [Region outages](/azure/cosmos-db/high-availability). Azure initiated recovery is active-passive, and full recovery of a region may be up to 24 hours.


### Customer initiated disaster recovery

Customer initiated disaster recovery isn't restricted to paired regions. 

**Before a regional outage occurs:** 

- Deploy a zone-redundant Storage Mover by creating Storage Mover resources in a region that supports availability zones. 

- Periodically - either on a schedule or after you make substantial changes - take a snapshot of your Storage Mover resources. Storing the snapshots using a version control system is a good way to store and track history of the snapshots. You'll use the last good snapshot in the event of a disaster where you need to recover your resources in a new region.

**During a regional outage:**

You can do one of two things:

- Choose to wait for Azure to recover the region. 
- Minimize downtime by [redeploying your resources to a different region](#deploy-resources-to-a-different-region). Since access to your resources may be impacted during an outage, you'll want to use the last good snapshot of your resources.

>[!TIP]
>Either one of these strategies still may require that you need to take further steps prior to a disaster, so be sure to review and plan accordingly.


#### Deploy resources to a different region

See the documentation on [exporting templates](/azure/azure-resource-manager/templates/export-template-portal) for further instructions on exporting resources as an Azure Resource Manager (ARM) template.

If your Storage Mover and related resources reside in a container with no extra resources, you should perform a **Resource Group** export to capture the current state. However, if your resource group contains unrelated resources, you may need to remove or otherwise exclude the resources from the template.

Existing agents can't be redeployed to a different region. If the region in which they were originally configured experiences an outage, it may not be possible to completely unregister and re-register the agent. This document assumes that new agents are registered within a new region.

To use the exported template for disaster recovery, a few changes to the template are required.

- First, remove any `Microsoft.StorageMover/agents` and `Microsoft.HybridCompute/machines` resources from the template. Be sure to remove any dependency references to these resources as well.
- Next, remove the `agentResourceId` property from all job definitions. You'll need to assign them to a new Agent after deployment.
- After removing all references to agent and Hybrid Compute machine resources, update the location property of the top level Storage Mover resource. Replace the name of the currently deployed region with the name of the new region.
- Finally, determine whether to keep the existing storage account resource ID. If necessary, replace it with a different storage account.

After completing the previous steps and verifying that the template parameters are correct, the template is ready for deployment to a new region. You should deploy the template to a new resource group that has the same default region as the location property in the template.

#### Registering the new agent

Follow the steps within the [deploy an Azure Storage Mover agent](/azure/storage-mover/agent-deploy) article to register a new agent in the new Storage Mover resource.

#### Assigning the agent to job definitions

After the new agent has been registered and reports as online, use the Azure portal or PowerShell to associate the existing job definitions to the new agent. The following PowerShell example is provided for convenience.

See the [define a new migration job](/azure/storage-mover/job-definition-create) for guidance on how to access the job definitions for your project.

```powershell

## Update the agent in a job definition resource
$resourceGroupName  = "[Your resource group name]"
$storageMoverName   = "[Your storage mover name]"
$projectName        = "[Your project name]"
$jobDefName         = "[Your job definition name]"
$agentName          = "[The name of an agent previously registered to the same storage mover resource]"

Update-AzStorageMoverJobDefinition `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -ProjectName $projectName `
    -Name $jobDefName `
    -AgentName $agentName
```

#### Granting agent access to the target storage container

You need to assign the data contributor role to the managed identity to successfully perform a migration job. Assign the Hybrid Compute resource's system managed identity access to the target storage account resource. The [assign a managed identity access to a resource](/azure/active-directory/managed-identities-azure-resources/howto-assign-access-portal) article provides guidance on how to grant access to the target resource.

You're now ready to start migration jobs using the newly deployed Storage Mover resources.

## Next steps

- [Reliability in Azure](./overview.md)
- [Storage account disaster recovery](/azure/storage/common/storage-disaster-recovery-guidance)

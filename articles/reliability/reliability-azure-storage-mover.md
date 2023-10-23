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

When you deploy  an Azure Storage Mover resource, you must [select a particular region](/azure/storage-mover/deployment-planning#select-an-azure-region-for-your-deployment) in which the resource's instance metadata is stored. 
If the region supports availability zones, the instance metadata is replicated across multiple availability zones within that region. 

>[!IMPORTANT]
>Azure Storage Mover instance metadata includes projects, endpoints, agents, job definitions, and job run history, but doesn't include the actual data to be migrated. Azure storage accounts that are used as migration targets have their own reliability support.  


### Prerequisites

- To deploy with availability zone support, you must choose a region that supports availability zones. To see which regions supports availability zones, see the [list of supported regions](availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

- (Optional) If your target storage account doesn't support availability zones, and you would like to migrate the account to AZ support, see [Migrate Azure Storage accounts to availability zone support](migrate-storage.md).

### Create a resource with availability zones enabled

### Zone down experience

During a zone-wide outage, no action is required during zone recovery. Azure Storage Mover is designed to self-heal and re-balance itself to take advantage of the healthy zone automatically.

## Determining reliability for target storage accounts

Any migration target storage account may require its own recovery steps. This requirement depends on the redundancy options chosen for each storage account. See the [storage account disaster recovery](/azure/storage/common/storage-disaster-recovery-guidance) article to determine whether more steps are necessary.

If a local storage was chosen in lieu of redundancy options, you may need to create a new storage account for use in migrations during the outage.


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Azure initiated disaster recovery is only applicable for those [regions that have are paired with a cross-region replication region](./cross-region-replication-azure.md#azure-paired-regions).  When cross-region replication is utilized, instance metadata is replicated to each region, but is never permitted to leave the geography. 

When a Storage Mover agent is registered, it connects to the region in which the Storage Mover resource is registered. If an agent's Azure region experiences an outage, the agent itself isn't affected, but management operations that rely on Azure may be unable to complete. In addition, any active data migrations to storage accounts located within the affected region may fail.

Azure Storage Mover uses Cosmos DB for storing instance metadata. Data loss may occur only with an unrecoverable disaster in the Azure Cosmos DB region. For more information, see [Region outages](/azure/cosmos-db/high-availability). Azure initiated recovery is active-passive, and full recovery of a region may be up to 24 hours.

>[!IMPORTANT]
>Disaster recovery for on-premises data sources is the responsibility of the customer.


### Capacity and proactive disaster recovery resiliency


Before an outage occurs, you can choose to deploy a redundant Storage Mover.

During a regional outage, you can choose to wait for Azure to recover the region. Or, you can minimize downtime [redeploying your resources to a different region](#deploy-resources-to-a-different-region). These strategies may require that further steps be taken prior to a disaster, so be sure to review and plan accordingly.

In the unlikely event of a full region outage, you have the option of either waiting for Azure to recover the region or to [redeploy your resources to a different region](#deploy-resources-to-a-different-region) either before or during a regional outage.

### Customer enabled disaster recovery

#### Deploy resources to a different region

Since access to your resources may be impacted during an outage. To redeploy resources to a different region, you must first have a snapshot of the resources you wish to redeploy. To ensure that you're restoring the most recent data, taking a snapshot should be done periodically, either on a schedule or after you make substantial changes. Storing the snapshots using a version control system is a good way to store and track history of the snapshots.

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

Read more about any of the following features or options.

| Guide | Description |
|---|---|
| [Azure resiliency and reliability](/azure/architecture/framework/resiliency/overview) | A detailed overview of resiliency and reliability in Azure.
| [storage account disaster recovery](/azure/storage/common/storage-disaster-recovery-guidance) | Concepts and processes involved with a storage account failover and recovery. |

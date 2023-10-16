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

This article describes reliability support in Azure Storage Mover and covers cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Regional reliability

When deploying an Azure Storage Mover resource, you must select a location in which the resource's instance metadata is stored. Instance metadata includes projects, endpoints, agents, job definitions, and job run history, but doesn't include the actual data to be migrated. Azure storage accounts to be used as migration targets have their own reliability support. Disaster recovery for on-premises data sources is the responsibility of the customer.

Instance metadata is replicated across multiple availability zones in regions where availability zones are available. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking.

Some regions are paired in order to allow cross-region replication. When cross-region replication is utilized, instance metadata is replicated to each region, but is never permitted to leave the geography.

When a Storage Mover agent is registered, it connects to the region in which the Storage Mover resource is registered. If an agent's Azure region experiences an outage, the agent itself isn't affected, but management operations that rely on Azure may be unable to complete. In addition, any active data migrations to storage accounts located within the affected region may fail.

In the unlikely event of a full region outage, you have the option of using one of the following strategies:

- Wait for Azure to recover the region
- Redeploy your resources to a different region
- Deploy a redundant Storage Mover in advance

The last two options are a matter of timing, since deployment will occur either before or after any future outage.

## Determining reliability for target storage accounts

Any migration target storage account may require its own recovery steps. This requirement depends on the redundancy options chosen for each storage account. See the [storage account disaster recovery](/azure/storage/common/storage-disaster-recovery-guidance) article to determine whether more steps are necessary.

If a local storage was chosen in lieu of redundancy options, you may need to create a new storage account for use in migrations during the outage.

### Zone down experience

During a zone-wide outage, no action is required during zone recovery. Azure Storage Mover is designed to self-heal and rebalance itself to take advantage of the healthy zone automatically.

## Disaster recovery: cross-region failover

Azure can provide disaster recovery protection against a region-wide or large geography disaster by making use of another region. For more information on Azure disaster recovery architecture, see the article on [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

Azure initiated disaster recovery is only applicable for those regions that have are paired with a cross-region replication region. Azure Storage Mover uses Cosmos DB for storing instance metadata. Data loss may occur only with an unrecoverable disaster in the Azure Cosmos DB region. For more information, see [Region outages](/azure/cosmos-db/high-availability). Azure initiated recovery is active-passive, and full recovery of a region may be up to 24 hours.

Customers can minimize downtime by following the customer enabled disaster recovery steps described in this section. These strategies may require that further steps be taken prior to a disaster, so be sure to review and plan accordingly.

## Customer enabled disaster recovery

### Deploy resources to a different region

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

### Registering the new agent

Follow the steps within the [deploy an Azure Storage Mover agent](/azure/storage-mover/agent-deploy) article to register a new agent in the new Storage Mover resource.

### Assigning the agent to job definitions

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

### Granting agent access to the target storage container

You need to assign the data contributor role to the managed identity to successfully perform a migration job. Assign the Hybrid Compute resource's system managed identity access to the target storage account resource. The [assign a managed identity access to a resource](/azure/active-directory/managed-identities-azure-resources/howto-assign-access-portal) article provides guidance on how to grant access to the target resource.

You're now ready to start migration jobs using the newly deployed Storage Mover resources.

## Next steps

Read more about any of the following features or options.

| Guide | Description |
|---|---|
| [Azure resiliency and reliability](/azure/architecture/framework/resiliency/overview) | A detailed overview of resiliency and reliability in Azure.
| [storage account disaster recovery](/azure/storage/common/storage-disaster-recovery-guidance) | Concepts and processes involved with a storage account failover and recovery. |

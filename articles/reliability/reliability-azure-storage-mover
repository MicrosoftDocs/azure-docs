---
title: Reliability in Azure Storage Mover
description: Find out about reliability in Azure Storage Mover
author: johnmic
ms.author: johnmic
ms.topic: conceptual
ms.custom: subject-reliability, references_regions
ms.service: storage-mover
ms.date: 01/26/2023
---

# What is reliability in Azure Storage Mover?

This article describes reliability support in Azure Storage Mover, and covers cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

### Regional reliability

When deploying an Azure Storage Mover resource, you must select a location. Instance metadata about the Storage Mover is stored in the region it is configured. This includes projects, endpoints, agents, job definitions, and job run history. Instance metadata does not include the actual data that is being migrated. For on-premises data sources disaster recovery is the responsiblity of the customer. Azure storage accounts used as a migration target have their own reliability support. 

Instance metadata is replicated across multiple availability zones in regions where they are available. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking.

For regions that are paired for cross-region replication, instance metadata is also replicated to multiple regions, but will never leave the geography. 

When registering a Storage Mover agent, the agent connects to the region of the Storage Mover resource it is registered with. If the Azure region your agent connects to is affected by an outage, the agent itself is not affected, but management operations using Azure may be unable to complete. In addition, any ongoing data migrations to storage accounts located in the affected region may fail.

In the unlikely event of a full region outage, you have the option of using one of the following strategies:

* Wait for Azure to recover the region
* Redeploy your resources to a different region
* Deploy a redundant Storage Mover in advance

The last two options are a matter of timing, deployment occuring either before or after any future outage.

### Determining reliability for target storage accounts

Any migration target storage accounts may need their own recovery steps. This will depend on the redundancy options that were choosen for the storage account. See [storage account disaster recovery](https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance) to determine any additional steps.

If no reduendancy options were choosen (local storage) you may need to create a new storage account for use in migrations during the outage.

### SLA improvements

There are no increased SLAs for Azure Storage Mover. For more information on the Azure Storage Mover SLAs, see [TODO-replace-with-link-to-SLA-documentation-for-service].

### Zone down experience

During a zone-wide outage, no action is required during zone recovery. Azure Storage Mover will self-heal and re-balance itself to take advantage of the healthy zone automatically. 

## Disaster recovery: cross-region failover

In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-architecture).

Azure initiated disaster recovery is only applicable for those regions that have are paried with a cross-region replication region. Azure Storage Mover uses Cosmos DB for storing instance metadata. Data loss may occur only with an unrecoverable disaster in the Azure Cosmos DB region. For more information, see [Region outages](https://learn.microsoft.com/en-us/azure/cosmos-db/high-availability#region-outages). Azure initiated recovery is active-passive, and full recovery of a region may be up to 24 hours.

Customers can minimize downtime by following customer enabled disaster recovery steps described below. This requires additional steps to be inacted before a disaster occurs, so review and plan accordingly.

### Customer enabled disaster recovery

#### Deploy resources to a different region

To redeploy resources to a different region, you must first have a snapshot of the resources you wish to redeploy. Taking a snapshot should be done periodically on a schedule or after you make substantial changes, since by definition, access to your resources may be impacted during an outage. Storing the snapshots using a version control system is a good way to store and track history of the snapshots.

See documentation on [exporting templates](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/export-template-portal) for further instructions on exporting resources as an Arm Resource Manager template.

You should do a "Resource Group" export on the resource group containing the Storage Mover to capture the current state. This document assumes only Storage Mover and related resources are in the resource group. If this is not the case, you may need to remove or otherwise exclude unrelated resources from the template.

The existing agent(s) cannot be reused in a different region. If the region they were configured for is experiencing an outage, it may not be possible to completely unregister and re-register the agent. Because of this, this document assumes you will be registering a new Agent for the new region.

To use the exported template for disaster recovery, a few changes to the template need to be made.

* The first is to remove any `Microsoft.StorageMover/agents` and `Microsoft.HybridCompute/machines` resources from the template. Also be sure to remove any dependency references to these resources as well.
 
* Remove the `agentResourceId` property from all Job Definitions. You will assign them to a new Agent after deployment.
 
* After removing all references to agent and Hybrid Compute machine resources, update the location property on the top level Storage Mover resource to the name of the region you will deploy into.

* Verify if you will keep the existing storage account resource ID, or need to replace it with a different storage account.

The template is now ready to be deployed into a new region. Verify that the template parameters are correct. You should deploy the template to a new resource group that has the same default region as the location property in the template.

#### Registering the new agent

Go through the [deply an Azure Storage Mover agent](https://learn.microsoft.com/en-us/azure/storage-mover/agent-deploy) steps to register a new agent in the new Storage Mover resource.

#### Assigning the agent to job definitions

After the new agent has been registered and reports as online, use the portal or PowerShell to update the job definitions to be associated with the new Agent.

See [define a new migration job](https://learn.microsoft.com/en-us/azure/storage-mover/job-definition-create) for steps on how to navagate to the job definitions for your project.

```powershell

## Update the agent in a job definition resource
$resourceGroupName  = "Your resource group name"
$storageMoverName   = "Your storage mover name"
$projectName        = "Your project name"
$jobDefName         = "Your job definition name"
$agentName          = "The name of an agent previously registered to the same storage mover resource"

Update-AzStorageMoverJobDefinition `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -ProjectName $projectName `
    -Name $jobDefName `
    -AgentName $agentName
```

#### Granting agent access to the target storage container

To successfully perform a migration job, you need to assign the system managed identity of the Hybrid Compute resource created for the agent access to the resource.

 See [assign a managed identity access to a resource](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/howto-assign-access-portal) for steps on how to grant access to the target storage account resource. You need to assign the data contributor role to the managed identity.

You are now ready to start migration jobs using the newly deployed Storage Mover resources.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)

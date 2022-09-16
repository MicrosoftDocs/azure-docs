---
title: How to define and start a migration job
description: To migrate a share, create a job definition in a project and start it.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 09/14/2022
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: Reviewed - Stephen
REVIEW Engineering: not reviewed
EDIT PASS: started

Initial doc score: 100 (413 words and 0 issues)

!########################################################
-->

# How to define and start a migration job

When you migrate a share to Azure, you'll need to describe the source share, the Azure target, and any migration settings you want to apply. These attributes are defined in a job definition within your storage mover resource. This article describes how to create and run such a job definition.

## Prerequisites

Before you begin following the examples in this article, it's important that you have an understanding of the Azure Storage Mover resource hierarchy. Review the [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md) article, to understand the necessity of the job definition prerequisites.

There are three prerequisites to the definition the migration of your source shares:

1. You need to have deployed a storage mover resource.
   Follow the steps in the *[Create a storage mover resource](storage-mover-create.md)* article to deploy a storage mover resource to the desired region within your Azure subscription.
1. You need to deploy and register an Azure Storage Mover agent virtual machine (VM).
   Follow the steps in the [Azure Storage Mover agent VM deployment](agent-deploy.md) and [agent registration](agent-register.md) articles to deploy at least one agent.
1. Finally, to define a migration, you'll need to create a job definition.
   Job definitions are organized in a migration project. You'll need at least one migration project in your storage mover resource. If you haven't already, follow the deployment steps in the [manage projects](project-manage.md) article to create a migration project.

## Create and start a job definition

A job definition is created within a project resource. If you've followed the examples contained in previous articles, you may have an existing project within a previously deployed storage mover resource.

Creating a job definition requires you to decide on a project, a source storage endpoint, a target storage endpoint, and a name. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name. Storage endpoints are separate resources in your storage mover and must be created first, before you can create a job definition that only references them.

You'll need to use several cmdlets to create a new job definition.

Use the `New-AzStorageMoverJobDefinition` cmdlet to create new job definition resource in a project. The following example assumes that you aren't reusing *storage endpoints* you've previously created.

```powershell
      
## Set variables
$subscriptionID     = "Your subscription ID"
$resourceGroupName  = "Your resource group name"
$storageMoverName   = "Your storage mover name"

## Log into Azure with your Azure credentials
Connect-AzAccount -SubscriptionId $subscriptionID

## Define the source endpoint: an NFS share in this example
## There is a separate cmdlet for creating each type of endpoint.
## (Each storage location type has different properties.)
## Run "Get-Command -Module Az.StorageMover" to see a full list.
$sourceEpName        = "Your source endpoint name could be the name of the share"
$sourceEpDescription = "Optional, up to 1024 characters"
$sourceEpHost        = "The IP address or DNS name of the device (NAS / SERVER) that hosts your source share"
$sourceEpExport      = "The name of your source share"
## Note that Host and Export will be concatenated to Host:/Export to form the full path to the source NFS share

New-AzStorageMoverNfsEndpoint `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -Name $sourceEpName `
    -Host $sourceEpHost `
    -Export $sourceEpExport `
    -Description $sourceEpDescription # Description optional

## Define the target endpoint: an Azure blob container in this example
$targetEpName          = "Your target endpoint name could be the name of the target blob container"
$targetEpDescription   = "Optional, up to 1024 characters"
$targetEpContainer     = "The name of the target container in Azure"
$targetEpSaResourceId  = /subscriptions/<GUID>/resourceGroups/<name>/providers/Microsoft.Storage/storageAccounts/<storageAccountName>
## Note: the target storage account can be in a different subscription and region than the storage mover resource.
## Only the storage account resource ID contains a fully qualified reference.

New-AzStorageMoverAzStorageContainerEndpoint `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -Name $targetEpName `
    -BlobContainerName $targetEpContainer `
    -StorageAccountResourceId $targetEpSaResourceId `
    -Description $targetEpDescription # Description optional

## Create a job definition resource
$projectName   = "Your project name"
$jobDefName   = "Your job definition name"
$JobDefDescription  = "Optional, up to 1024 characters"
$jobDefCopyMode = "Additive"
$agentName = "The name of one of your agents previously registered to the same storage mover resource"


New-AzStorageMoverJobDefinition `
    -Name $jobDefName `
    -ProjectName $projectName `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName `
    -CopyMode $jobDefCopyMode `
    -SourceName $sourceEpName `
    -TargetName $targetEpName `
    -AgentName $agentName `
    -Description $sourceEpDescription # Description optional

## When you are ready to start migrating, you can run the job definition
Start-AzStorageMoverJobDefinition `
    -JobDefinitionName $jobDefName `
    -ProjectName $projectName `
    -ResourceGroupName $resourceGroupName `
    -StorageMoverName $storageMoverName

```

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](service-overview.md)

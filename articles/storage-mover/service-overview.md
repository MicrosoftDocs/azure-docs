---
title: What is Azure Storage Mover
description: Learn about the Azure Storage Mover service
author: stevenmatthew

ms.service: storage-mover
ms.topic: overview
ms.date: 08/11/2022
ms.author: shaas

ms.custom: template-overview
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

<!-- 1. H1
##Docs Required##
 
Set expectations for what the content covers, so customers know the content meets their needs.-->
# What is Azure Storage Mover?

<!-- 2. Introductory paragraph 
##Docs Required##

A light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it as short as possible.-->

Azure Storage Mover is a service that enables the migration of unstructured data into Azure Storage. <!--Because it has both could-based and on-premises components, it is considered a hybrid cloud service.-->

These documents will walk you through the process of migrating your unstructured data into Azure using the Azure Storage Mover service. The information is useful for partners, vendors, and end-users/customers.

<!-- 3. H2s
##Docs Required##

Each H2 is used to set expectations for the content that follows. The last sentence of the paragraph should summarize how the individual section contributes to the whole.-->

## Running PowerShell against Canary

When utilizing the Storage Mover public preview, you have the option to use your own Azure subscription, or to use the shared Azure subscription: *XDataMove-Dev - Microsoft Azure*  

If you are using your own Azure subscription, you need the **microsoft.storagemover** feature registered for your subscription. To register your subscription, select the link to file an [IcM ticket](https://portal.microsofticm.com/imp/v3/incidents/create?tmpl=F2JO3X). The IcM ticket will alert the Directly Responsible Individual (DRI) to associate the **Microsoft.StorageMover/EUAPParticipation** feature enabled for your subscription.

The **Microsoft.StorageMover/EUAPParticipation** feature will allow you to access the **eastus2euap** and **centraleuap** regions. These are Azure's Canary Islands regions and are referred to as "Early Updates Access Program" regions. They’re both true Azure regions; one built with Availability Zones and the other without. Both regions form a region pair which can be used to validate data geo-replication capabilities.

> [!IMPORTANT]
> Azure's Canary regions are only open to a few customers within the Early User Access Program (EUAP) and they do not have any service guarantees.

You must also have the latest Azure PowerShell cmdlets installed. You can verify that you have the latest version or install them by opening PowerShell with elevated privileges and running the sample commands provided.

```azurepowershell
   #Verify the latest version
   Get-Command -Module Az.Storage

   #Install the latest version
   Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force -AllowClobber
```

Finally, ensure that you have the latest version of [StorageMover PowerShell cmdlets](\\xstoreself.corp.microsoft.com\scratch\XDataMove\Public Preview\PSCmdlets) installed. If you encounter issues when accessing the share, reach out to [johnmic](mailto:johnmic@microsoft.com).

You can verify that you have the latest version by opening PowerShell with elevated privileges and running the sample command provided.

```azurepowershell
   #Verify the latest version
   Get-Command -Module Az.StorageMover
```

> [!IMPORTANT]
> Although the manifest has rolled out globally in ARM, the feature itself is enabled only in the Canary regions. As a result, all Storage mover resources must be created in the Canary regions. Run the following using PowerShell with elevated permissions.

1. Set your environment.

  ```powershell
  Clear-AzContext
  Login-AzAccount
  ```

1. Set your subscription.

  ```powershell
  Set-AzContext -Subscription XDataMove-Dev #for those of us using the Dev subscription
  ```

1. Confirm the context was configured correctly using `Get-AzStorageMover` to retrieve the list of storage movers already created against that subscription.

  ```powershell
  Get-AzStorageMove -Name XDataMove-Dev #for those of us using the Dev subscription
  ```

1. Create a resource group in a canary region (eastus2euap).

  ```powershell
  $rg = New-AzResourceGroup -Name [resourceGroupName] -Location eastus2euap
  ```

1. Perform agent setup steps
1. Set the following variables with values that will work for you.

  ```azurepowershell
  $arcId              = "/subscriptions/f686d426-8d16-42db-81b7-ab578e110ccd/resourceGroups/rg/providers/Microsoft.HybridCompute/machines/agentname"
  $subscriptionId     = "3c480e71-a914-4bcd-8780-9faf6fefbf08"  
  $arcId              = "/subscriptions/f686d426-8d16-42db-81b7-ab578e110ccd/resourceGroups/rg/providers/Microsoft.HybridCompute/machines/agentname"
  $guid               = "f686d426-8d16-42db-81b7-ab578e110ccd"
  $accountId          = "/subscriptions/3c480e71-a914-4bcd-8780-9faf6fefbf08/resourceGroups/ahhuss/providers/Microsoft.Storage/storageAccounts/ahhuss1234"
  $agentName          = "testAgentName"
  $projectName        = "testProjectName"
  $containerName      = "containername"
  $sourceEndpointName = "testSourceEndpoint"
  $targetEndpointName = "testTargetEndpoint"
  $jobDefinitionName  = "testJobDefinitionName"
  $sourcePath         = "/"
  $targetPath         = "/"
  $location           = "eastus2euap"
  $ResourceGroupName  = "testResourceGroup"
  ```

1. Create a storage mover and verify that it exists in your resource group.

  ```powershell
  New-AzStorageMover -Name $StorageMoverName `
    -ResourceGroupName $ResourceGroupName `
    -Location $location `
    -Tag @{"tag1" = "value1"; "tag2" = "value2"} `
    -Description "storagemover description" #-Debug

  Get-AzStorageMover -ResourceGroupName $ResourceGroupName -Name $StorageMoverName
  ```

1. Perform Agent registration steps or follow these steps just for testing creation of the resource.

  @Ahmed/@akash can we put in the direct REST API calls here instead of the PS cmdlets since those are going to be suppressed

  ```powershell
  # Create an agent
  New-AzStorageMoverAgent -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -Name $agentName `
    -ArcResourceId $arcId `
    -Description "Agent description" `
    -ArcVMUuid $guid #-Debug

  # Verify that the agent exists
  Get-AzStorageMoverAgent -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -Name $agentName
  ```

1. Create a project and verify that it exists.

  ```powershell
  New-AzStorageMoverProject `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -Name $projectName `
    -Description "project description" 

  
  Get-AzStorageMoverProject `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -Name $projectName 
  ```

1. Create the target endpoint and verify that it exists.

  ```powershell
  $containerProperties = New-AzStorageMoverAzureStorageBlobContainerEndpointPropertiesObject `
    -BlobContainerName $containerName  `
    -StorageAccountResourceId $accountid `
    -EndpointType AzureStorageBlobContainer

  New-AzStorageMoverEndpoint `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -Name $targetEndpointName `
    -Property $containerProperties #-debug
  ```

1. Create the source endpoint and verify that it exists.

  ```powershell
  $NFSProperties = New-AzStorageMoverNfsMountEndpointPropertiesObject `
    -Host "10.0.0.1" `
    -NfsVersion NFSv3 `
    -RemoteExport "/" `
    -EndpointType NfsMount

  New-AzStorageMoverEndpoint `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -Name $sourceEndpointName `
    -Property $NFSProperties
  ```

1. Get the endpoints to verify they were created correctly.

  ```powershell
  Get-AzStorageMoverEndpoint `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName
  ```

1. Create a job definition and verify that it exists

  ```powershell
  New-AzStorageMoverJobDefinition 
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -ProjectName $projectName `
    -Name $jobDefinitionName `
    -Description "JobDefinition description" `
    -SourceName $sourceEndpointName `
    -SourceSubPath $sourcePath `
    -TargetName $targetEndpointName `
    -TargetSubPath $targetPath `
    -CopyMode Mirror `
    -AgentName $agentName

  Get-AzStorageMoverJobDefinition `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -ProjectName $projectName `
    -Name $jobDefinitionName 
  ```

1. Start a new job and see if it exists.

  ```powershell
  Start-AzStorageMoverJob `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -ProjectName $projectName `
    -JobDefinitionName $jobDefinitionName

  Get-AzStorageMoverJobRun `
    -ResourceGroupName $ResourceGroupName `
    -StorageMoverName $StorageMoverName `
    -ProjectName $projectName `
    -JobDefinitionName $jobDefinitionName 
  ```

## Section 2 H2

Add some content here.

## [Section n H2]

Add some content here.

<!-- 4. Next steps
##Docs Required##

We must provide at least one next step, but should provide no more than three. This should be relevant to the learning path and provide context so the customer can determine why they would click the link.-->

## Supported sources and targets

## Next steps
<!-- Add a context sentence for the following links -->
- [Step 1](service-overview.md)
- [Step 2](service-overview.md)

---
title: Azure Immutable Blob Storage (WORM) | Microsoft Docs
description: Azure Storage now offers WORM support for Blob object storage that allows you to store data in a non-erasable, non-modifiable state for a user-specified interval of time. This feature enables organizations in many regulated industries, particularly broker-dealer organizations to store data in a manner compliant with SEC 17a-4(f) and other regulations.
services: storage
author: 
manager: jeconnoc

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 04/04/2018
ms.author: sangsinh
---

# Overview

Azure Storage now offers WORM (Write Once Read Many) support for blob object storage that allows you to
store data in a non-erasable, non-modifiable state for a user-specified interval
of time. Blobs can be created and read, but not modified or deleted for the duration of the retention interval. This feature enables organizations in many regulated industries,
particularly broker-dealer organizations to store data in a manner compliant
with SEC 17a-4(f) and other regulations.

Feature characteristics include:

-   **Time-based retention policy support**: Users set policies to store data
    for a specified interval of time.

-   **Legal hold policy support**: When the retention interval is not known,
    users can set legal holds to store data immutably until the legal hold is
    cleared.  When a legal hold is set, blobs can be created and read, but not modified or deleted. Each legal hold is associated with a user-defined alphanumeric tag that is used as an identifier string such as a case ID.

-   **Blob tier independence**: WORM policies are independent of the Azure blob
    storage tier and will apply to all the tiers, hot, cool, and archive. Users
    can move data from one tier to another while keeping the data in an
    immutable state

-   **Regulatory Compliance support:** Users have the ability to lock
    the WORM policies for  SEC 17a-4(f) etc. regulatory compliance. Once
    locked, the policy remains locked forever. This is called the compliance
    mode. In the compliance mode, retention intervals can only be increased, but
    not decreased. Limited audit logging capabilities are provided in the
    compliance mode to store the policy administration logs for the duration of
    the container.
    

-  **Container level configurability:** Immutable Blob Storage allows users to configure time-based retention policies and legal hold tags at the container level.  Users can create time-based retention policies, delete policies, lock policies, extend retention intervals, set legal holds, clear legal holds etc. through simple container level settings.  These policies will apply to all the blobs in the container.
 
## How does it work?

When a time-based retention policy or legal hold is applied on a container, the following operations will be disallowed for existing blobs and new blobs added to the container. When the retention interval expires, and there are no legal holds set on the container, the delete operations will be enabled. However, if only a legal hold is applied and there is no time-based retention policy on a container, all of the following blob operations will be allowed when all the legal holds are cleared. 
**Operation         Resource Type                       Description**
Delete Container    Container                           Deletes the container and any blobs it contains
Put Blob            Block, Append, and page blobs        Replace an existing blob within a container
Set Blob Metadata   Block, Append, and Page blobs        Sets user-defined metadata of an existing blob
Delete Blob         Block, Append, and Page blobs        Marks a blob for deletion
Undelete Blob       Block, Append, and Page blobs        Restores the contents and metadata of soft deleted blob and/or all associated soft deleted snapshots
Put Block           Block blobs                         Creates a new block to be committed as part of a block blob. **Only the first Put block operations for file creation are allowed**
Put Block list      Block blobs                         Commits a blob by specifying the set of block IDs that comprise the block blob. **Only the first Put Block List operation for file creation is allowed**  
Put Page            Page blobs                          Writes a range of pages into a page blob
Append Block        Append blobs                        Writes a block of data to the end of an append blob.

## Note
1. The feature is only available in GPv2 and blob storage accounts. Note that the policy administration is only available through the rSRP/Azure Resource Manager interfaces and so the storage account must be Azure Resource Manager enabled. 
2. Each container contains an audit trail showing up to 5 time-based retention commands for locked time-based retention policies and up to 10 legal hold commands. This log is retained for the lifetime of the container. However, the complete log of all the commands can be found  in the Azure activity log. Refer to the [Azure Activity log documentation](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) for more details
3. Page blobs and Append blobs need to be created outside of a protected container, then copied in.

### Getting Started
**Azure portal**

Step 1: Create a container to store the blobs that need to be kept in the immutable state. Click on Access Policy in the Container settings and then click on **+ Add Policy** under **Immutable Blob Storage** policy as illustrated below.
 
![Container Access](../media/storage-immutable-blob-storage/portal-image-1.jpg)

![Container Access](../media/storage-immutable-blob-storage/portal-image-2.jpg)

Step 2: To enable time-based retention, choose Time-Based Retention from the drop-down menu. Enter the desired retention interval in days (minimum is one day)

![Time-based retention](../media/storage-immutable-blob-storage/portal-image-3-time-based-retention.jpg)

As you can see above, the state of the policy will initially be unlocked. This will allow you to test the feature with a smaller retention interval, and make changes to the policy before locking it.
 
Locking is essential for SEC 17a-4 etc. regulatory compliance.
 Step 3: Lock the policy by right-clicking on the ..., and the following menu will appear:-

![Lock policy](../media/storage-immutable-blob-storage/portal-image-4-lock-policy.jpg)

Click on Lock Policy and the policy state will now show as locked. Once locked, the policy can longer be deleted and only extensions of the retention interval will be allowed.
 
Step 4: To enable legal holds, click on + Add Policy and  choose Legal hold from the drop-down menu

![Hold selection](../media/storage-immutable-blob-storage/portal-image-legal-hold-selection-7.jpg)

 Create a legal hold with one or more tags

 ![Hold tags](../media/storage-immutable-blob-storage/portal-image-set-legal-hold-tags.jpg)

 **CLI**
 Install the CLI [extension](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview) with `az extension add -n storage-preview`

If you already have this extension installed, then to enable the Immutable Blob Storage feature, use the command  the extension and just  `az extension update -n storage-preview`
The feature is included in the following command groups (run “-h” on them to see the commands):
`az storage container immutability-policy`  and `az storage container legal-hold ` 



# Parameter limits
1. The minimum retention interval is 1 day, maximum is 400 years
2. For a given storage account, the maximum number of containers per storage account with locked immutable policies is 1000
3. For a given storage account, the maximum number of containers with a legal hold setting is 1000
4. For a given container, the maximum number of legal hold tags is 10
5. The maximum length of a legal hold tag is 23 alphanumeric characters
6. For a given container, the maximum number of allowable retention interval extensions for locked immutable policies is 5
7. For a given container with a locked immutable policy, there is a maximum of 5 time-based retention  policy logs and a maximum of 10 legal hold policy logs that are retained for the duration of the container. 

### Access 

The feature will be enabled in all Azure public regions. 

### Restrictions 

The following restrictions apply during public preview:

-   **Do not store production or business critical data**

-    All  preview/NDA restrictions apply

### Client Libraries and Tools 

The Immutable Blob Storage feature is supported in the following client libraries:-
[.net](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/7.2.0-preview)
[node.js](https://pypi.org/project/azure-mgmt-storage/2.0.0rc1/)
[Python](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/storageManagement2)

### Powershell 

A sample Powershell script to use this feature is provided below for reference:

```powershell
\$ResourceGroup = "\<Enter your resource group\>”

\$StorageAccount = "\<Enter your storage account name\>"

\$container = "\<Enter your container name\>"

\$container2 = "\<Enter another container name\>”

\$location = "\<Enter the storage account location\>"

\# Login to the Azure Resource Manager Account

Login-AzureRMAccount

Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.Storage"

\# Create your Azure Resource Group

New-AzureRmResourceGroup -Name \$ResourceGroup -Location \$location

\# Create your Azure storage account

New-AzureRmStorageAccount -ResourceGroupName \$ResourceGroup -StorageAccountName
\$StorageAccount -SkuName Standard_LRS -Location \$location -Kind Storage

\# Create a new container

New-AzureRmStorageContainer -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -Name \$container

\# Create Container 2 with Storage Account object

\$accountObject = Get-AzureRmStorageAccount -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount

New-AzureRmStorageContainer -StorageAccount \$accountObject -Name \$container2

\# Get container

Get-AzureRmStorageContainer -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -Name \$container

\# Get Container with Account object

\$containerObject = Get-AzureRmStorageContainer -StorageAccount \$accountObject
-Name \$container

\#list container

Get-AzureRmStorageContainer -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount

\#remove container (Add -Force to dismiss prompt)

Remove-AzureRmStorageContainer -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -Name \$container2

\#with Account object

Remove-AzureRmStorageContainer -StorageAccount \$accountObject -Name
\$container2

\#with Container object

\$containerObject2 = Get-AzureRmStorageContainer -StorageAccount \$accountObject
-Name \$container2

Remove-AzureRmStorageContainer -InputObject \$containerObject2

\#Set LegalHold

Add-AzureRmStorageContainerLegalHold -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -Name \$container -Tag tag1,tag2

\#with Account object

Add-AzureRmStorageContainerLegalHold -StorageAccount \$accountObject -Name
\$container -Tag tag3

\#with Container object

Add-AzureRmStorageContainerLegalHold -Container \$containerObject -Tag tag4,tag5

\#Clear LegalHold

Remove-AzureRmStorageContainerLegalHold -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -Name \$container -Tag tag2

\#with Account object

Remove-AzureRmStorageContainerLegalHold -StorageAccount \$accountObject -Name
\$container -Tag tag3,tag5

\#with Container object

Remove-AzureRmStorageContainerLegalHold -Container \$containerObject -Tag tag4

\# create/update ImmutabilityPolicy

\#\# with account/container name

Set-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -ContainerName \$container
-ImmutabilityPeriod 10

\#with Account object

Set-AzureRmStorageContainerImmutabilityPolicy -StorageAccount \$accountObject
-ContainerName \$container -ImmutabilityPeriod 1 -Etag \$policy.Etag

\#with Container object

\$policy = Set-AzureRmStorageContainerImmutabilityPolicy -Container
\$containerObject -ImmutabilityPeriod 7

\#\# with ImmutabilityPolicy object

Set-AzureRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy \$policy
-ImmutabilityPeriod 5

\#get ImmutabilityPolicy

Get-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName \$ResourceGroup
-StorageAccountName \$StorageAccount -ContainerName \$container

\#with Account object

Get-AzureRmStorageContainerImmutabilityPolicy -StorageAccount \$accountObject
-ContainerName \$container

\#with Container object

Get-AzureRmStorageContainerImmutabilityPolicy -Container \$containerObject

\#Lock ImmutabilityPolicy (Add -Force to dismiss prompt)

\#\# with ImmutabilityPolicy object

\$policy = Get-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName
\$ResourceGroup -StorageAccountName \$StorageAccount -ContainerName \$container

\$policy = Lock-AzureRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy
\$policy -force

\#\# with account/container name

\$policy = Lock-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName
\$ResourceGroup -StorageAccountName \$StorageAccount -ContainerName \$container
-Etag \$policy.Etag

\#with Account object

\$policy = Lock-AzureRmStorageContainerImmutabilityPolicy -StorageAccount
\$accountObject -ContainerName \$container -Etag \$policy.Etag

\#with Container object

\$policy = Lock-AzureRmStorageContainerImmutabilityPolicy -Container
\$containerObject -Etag \$policy.Etag -force

\#Extend ImmutabilityPolicy

\#\# with ImmutabilityPolicy object

\$policy = Get-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName
\$ResourceGroup -StorageAccountName \$StorageAccount -ContainerName \$container

\$policy = Set-AzureRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy
\$policy -ImmutabilityPeriod 11 -ExtendPolicy

\#\# with account/container name

\$policy = Set-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName
\$ResourceGroup -StorageAccountName \$StorageAccount -ContainerName \$container
-ImmutabilityPeriod 11 -Etag \$policy.Etag -ExtendPolicy

\#with Account object

\$policy = Set-AzureRmStorageContainerImmutabilityPolicy -StorageAccount
\$accountObject -ContainerName \$container -ImmutabilityPeriod 12 -Etag
\$policy.Etag -ExtendPolicy

\#with Container object

\$policy = Set-AzureRmStorageContainerImmutabilityPolicy -Container
\$containerObject -ImmutabilityPeriod 13 -Etag \$policy.Etag -ExtendPolicy

\#Remove ImmutabilityPolicy (Add -Force to dismiss prompt)

\#\# with ImmutabilityPolicy object

\$policy = Get-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName
\$ResourceGroup -StorageAccountName \$StorageAccount -ContainerName \$container

Remove-AzureRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy \$policy

\#\# with account/container name

Remove-AzureRmStorageContainerImmutabilityPolicy -ResourceGroupName
\$ResourceGroup -StorageAccountName \$StorageAccount -ContainerName \$container
-Etag \$policy.Etag

\#with Account object

Remove-AzureRmStorageContainerImmutabilityPolicy -StorageAccount \$accountObject
-ContainerName \$container -Etag \$policy.Etag

\#with Container object

Remove-AzureRmStorageContainerImmutabilityPolicy -Container \$containerObject
-Etag \$policy.Etag
```
### Pricing

There is no additional charge for using this feature. You will get billed for
the underlying storage (container, blob) capacity and data access and
transactions, but not incur any additional charges for immutable policy
administration.

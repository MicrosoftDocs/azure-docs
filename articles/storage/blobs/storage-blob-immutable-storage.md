---
title: Immutable Storage feature of Azure Blob storage (Preview) | Microsoft Docs
description: Azure Storage now offers WORM support for Blob object storage that allows you to store data in a non-erasable, non-modifiable state for a user-specified interval of time. This feature enables organizations in many regulated industries, particularly broker-dealer organizations to store data in a manner compliant with SEC 17a-4(f) and other regulations.
services: storage
author: sangsinh
manager: twooley

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 05/29/2018
ms.author: sangsinh
---
# Immutable Storage feature of Azure Blob storage (Preview)

The Immutable Storage feature for Azure Blobs feature allows users to store business-critical data in Azure blob storage in a WORM (Write Once Read Many) state. This state makes it non-erasable, and non-modifiable for a user-specified interval of time. Blobs can be created and read, but not modified or deleted for the duration of the retention interval.

## Overview

The Immutable Storage feature enables organizations in many regulated industries, particularly broker-dealer organizations, to store data in a manner compliant with SEC 17a-4(f) and other regulations.

Typical applications include:

- **Regulatory compliance**: The Immutable Storage for Azure Blobs feature is designed to help financial institutions and related industries address SEC 17a-4(f), CFTC 1.31©-(d), FINRA etc.

- **Secure document retention**: Users receive maximum data protection as the Blob storage service ensures that data cannot be modified or deleted by any user including those with account administrative privileges.

- **Legal hold**: The Immutable Storage for Azure blobs enables users to store sensitive information critical to a litigation or criminal investigation etc. in a tamper-proof state for the desired duration.

The immutable storage feature enables:

- **Time-based retention policy support:** Users set policies to store data for a specified interval of time.

- **Legal hold policy support:** When the retention interval is not known, users can set legal holds to store data immutably until the legal hold is cleared.  When a legal hold is set, blobs can be created and read, but not modified or deleted. Each legal hold is associated with a user-defined alphanumeric tag that is used as an identifier string (such as a case ID).

- **Support for all blob tiers:** WORM policies are independent of the Azure blob storage tier and will apply to all the tiers, hot, cool, and archive. This allows customers to store the data in the most cost optimized tier for their workloads while maintaining the data immutability

- **Container level configuration:** The immutable  Storage feature  allows users to configure time-based retention policies and legal hold tags at the container level.  Users can create, and lock time-based retention policies, extend retention intervals, set, and clear legal holds etc. through simple container level settings.  These policies will apply to all the blobs in the container, both existing and new.

- **Audit Logging support:** Each container contains an audit log showing up to five time-based retention commands for locked time-based retention policies with a maximum of three logs for retention interval extensions.  For time-based retention, the log contains the user ID, command type, timestamps, and the retention interval. For legal holds, the log contains the user ID, command type, timestamps, and the legal hold tags. This log is retained for the life time of the container per the SEC 17a-4(f) regulatory guidelines. A more comprehensive log of all the control plane activities can be found in the [Azure Activity log](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs). It is the user’s responsibility to store those logs persistently as may be required for regulatory or other purposes.

 The feature is enabled in all Azure public regions.

## How it works

The Immutable Storage for Azure Blobs supports two types of WORM or immutable policies: time-based retention and legal holds. See the [Getting Started](#Getting-started) section for details on how to create these immutable policies.
When a time-based retention policy or legal hold is applied on a container, all existing blobs will move to the immutable (write and delete protected) state. All new blobs uploaded to the container will also move to the immutable state.

> [!IMPORTANT]
> A time-based retention policy must be *locked* for the blob to be in an immutable (write and delete-protected) state for SEC 17a-4(f) and other regulatory compliance. It is recommended that the policy be locked within a reasonable amount of time, typically within 24 hours. We do not recommend using the *unlocked* state for any purpose other than short-term feature trials.

 When a time-based retention policy is applied on a container, all blobs in the container will remain in the immutable state for the duration of the *effective* retention period. The effective retention period for existing blobs is equal to the difference between the blob creation time and the user-specified retention interval. For new blobs, the effective retention period is equal to the user-specified retention interval. Since users can change the retention interval, the most recent value of the user-specified retention interval will be used for calculating the effective retention period.

> [!TIP]
> Example:
> User creates a time-based retention policy with a retention interval of five years.
> There is an existing blob, testblob1, in that container that was created one year ago. The effective retention period for testblob1 will be four years.
> A new blob, testblob2, is now uploaded to the container. The effective retention period for this new blob will be five years.

### Legal holds

In case of legal holds, all existing and new blobs will remain in the immutable state until the legal hold is cleared.
For more information on how to set and clear legal holds, please see the [Getting Started](#Getting-started) section for details.

A container may have both a legal hold and a time-based retention policy at the same time. All blobs in that container will remain in the immutable state until all legal holds are cleared even if their effective retention period has expired. Conversely, a blob will remain in an immutable state until the effective retention period expires even though all legal holds have been cleared.
The following table shows the types of blob operations that will be disabled for the different immutable scenarios.
Refer to [Azure Blob Service API](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api) documentation for the Blob REST API details.

|Scenario  |Blob State  |Blob Operations not allowed  |
|---------|---------|---------|
|Effective retention interval on the blob has not yet expired and/or legal hold is set     |Immutable: both delete and write-protected         |Delete Container, Delete Blob, Put Blob1, Put Block, Put Block List, Set Blob Metadata, Put Page, Set Blob Properties,  Snapshot Blob, Incremental Copy Blob, Append Block         |
|Effective retention interval on the blob has expired     |Write-protected only (delete operations are allowed)         |Put Blob, Put Block, Put Block List, Set Blob Metadata, Put Page, Set Blob Properties,  Snapshot Blob, Incremental Copy Blob, Append Block         |
|All legal holds cleared, and no time-based retention policy set on the container     |Mutable         |None         |
|No WORM policy created (time-based retention or legal hold)     |Mutable         |None         |

> [!NOTE]
> The first Put Blob, and the Put Block List and Put Block operations necessary to create a blob are allowed in the first two scenarios from the above table all subsequent operations are disallowed.
> The Immutable Storage feature is only available in GPv2 and blob storage accounts and must be created through the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

## Pricing

There is no additional charge for using this feature and Immutable data is priced in the same way as regular, mutable data. Refer to the [Azure Storage Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) for the related pricing details.

### Restrictions

The following restrictions apply during public preview:

- **Do not store production or business critical data**
- All preview/NDA restrictions apply

## Getting started

Azure Immutable Storage for Azure Blobs is supported on the most recent releases of [Azure Portal](http://portal.azure.com), Azure [CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), and Azure [PowerShell](https://github.com/Azure/azure-powershell/releases/tag/Azure.Storage.v4.4.0-preview-May2018)

### Azure portal

1. Create a new container or select an existing container to store the blobs that need to be kept in the immutable state.
 The container must be in a GPv2 storage account.
2. Click on Access Policy in the Container settings and then click on **+ Add Policy** under **Immutable blob storage** policy as illustrated below.

    ![Portal](media/storage-blob-immutable-storage/portal-image-1.png)

3. To enable time-based retention, choose Time-Based Retention from the drop-down menu.

    ![Retention](media/storage-blob-immutable-storage/portal-image-2.png)

4. Enter the desired retention interval in days (minimum is one day)

    ![Retention Interval](media/storage-blob-immutable-storage/portal-image-5-retention-interval.png)

    As you can see above, the initial state of the policy is unlocked. This will allow you to test the feature with a smaller retention interval, and make changes to the policy before locking it. Locking is essential for SEC 17a-4 etc. regulatory compliance.

5. Lock the policy by right-clicking on the ..., and the following menu will appear:-

    ![Lock Policy](media/storage-blob-immutable-storage/portal-image-4-lock-policy.png)

    Click on Lock Policy and the policy state will now show as locked. Once locked, the policy can longer be deleted and only extensions of the retention interval will be allowed.

6. To enable legal holds, click on + Add Policy and  choose Legal hold from the drop-down menu

    ![Legal Hold](media/storage-blob-immutable-storage/portal-image-legal-hold-selection-7.png)

7. Create a legal hold with one or more tags

    ![Set legal hold tags](media/storage-blob-immutable-storage/portal-image-set-legal-hold-tags.png)

### CLI 2.0

Install the [CLI extension](http://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)  with `az extension add -n storage-preview`

If you already have the extension installed, use the following command to enable the Immutable Storage feature: `az extension update -n storage-preview`

The feature is included in the following command groups (run “-h” on them to see the commands):
`az storage container immutability-policy`  and `az storage container legal-hold`.

### PowerShell

The Immutable  Storage feature is supported on the [PowerShell version 4.4.0-preview](https://github.com/Azure/azure-powershell/releases/tag/Azure.Storage.v4.4.0-preview-May20180).
To enable the feature, please follow the following steps:

1. Ensure that you have the latest version of PowerShellGet installed using `Install-Module PowerShellGet –Repository PSGallery –Force`
2. Remove any previous installation of Azure PowerShell
3. Install AzureRM (Azure can be installed similarly from this repository) `Install-Module AzureRM –Repository PSGallery –AllowClobber`
4. Install the preview version of Storage management  plane cmdlets`Install-Module -Name AzureRM.Storage -AllowPrerelease -Repository PSGallery -AllowClobber`

A sample PowerShell code illustrating the feature usage is provided below.

## Client libraries

The Immutable Storage for Azure blobs feature is supported in the following client library releases

- [.net Client Library (version 7.2.0-preview and higher](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/7.2.0-preview)
- [node.js Client Library (version 4.0.0 and higher)](https://www.npmjs.com/package/azure-arm-storage)
- [Python Client Library (version 2.0.0 Release Candidate 2 and higher)](https://pypi.org/project/azure-mgmt-storage/2.0.0rc1/)

## Supported values

- The minimum retention interval is one day, maximum is 400 years
- For a given storage account, the maximum number of containers per storage account with locked immutable policies is 1000
- For a given storage account, the maximum number of containers with a legal hold setting is 1000
- For a given container, the maximum number of legal hold tags is 10
- The maximum length of a legal hold tag is 23 alphanumeric characters, minimum length is three characters
- For a given container, the maximum number of allowable retention interval extensions for locked immutable policies is three
- For a given container with a locked immutable policy, there is a maximum of five time-based retention policy logs and a maximum of 10 legal hold policy logs that are retained for the duration of the container.

## FAQ

**Does the feature apply to only block blobs, or page and append blobs as well?**

The Immutable Storage feature for blobs can be used with any blob type.  Note however, that it is recommended that the feature be mostly used for block blobs. Unlike block blobs, page blobs and append blobs need to be created outside of a WORM container, then copied in.  Once copied into a WORM container, no further  *appends* to an append blob or changes to a page blob are allowed.

**Do I need to always create a new storage account to use this feature?**

You can use the Immutable Storage feature with any existing GPv2 accounts or on new storage accounts if the account type is GPv2. This feature is only available with blob storage.

**What happens if I try to delete a container with a *locked* time-based retention policy or legal hold?**

The Delete Container operation will fail if it is at least one blob with a locked  time-based retention policy or a legal hold. The Delete Container operation will succeed if there is no blob with an active retention interval and there are no legal holds. You must first delete the blobs before you can delete the container.

**What happens if I try to delete a storage account with a WORM container that has a *locked* time-based retention policy or legal hold?**

The storage account deletion will fail if there is at least one WORM container with a legal hold or a blob with an active retention interval.  All WORM containers must be deleted before the storage account can be deleted.  See question #2 for information on container deletion.

**Can I move the data across different blob tiers (hot, cool, cold) when the blob is in the immutable state?**

Yes, you can use the Set Blob Tier command to move data across the blob tiers while keeping the data in the immutable state. The Immutable Storage feature is supported on hot, cool, and cold blob tiers.

**What happens if I fail to pay and my retention interval has not expired?**

In case of non-payment, normal data retention policies will apply as stipulated grace specified in the terms and conditions of your contract with Microsoft.

**Do you offer a trial or grace period for just trying out the feature?**

Yes, when a time-based retention policy is first created, it will be in an *unlocked* state. In this state, you can make any desired change to the retention interval such as increase or decrease and even delete the policy. Once the policy is locked, it remains locked forever preventing deletion. Also, the retention interval can no longer be decreased when the policy is locked. We strongly recommend that you use the *unlocked* state only for trial purposes and lock the policy within a 24-hour period, so as not to risk noncompliance with SEC 17a-4(f) and other regulations.

**Is the feature available in national and government clouds?**

The Immutable Storage feature is currently available only in Azure public regions. Email azurestoragefeedback@microsoft.com regarding interest in a specific national cloud.

## Sample code

A sample PowerShell script  is given below for reference.
This script creates a new storage account and container; then shows you how to set and clear legal holds, create, and lock a time-based retention policy (aka ImmutabilityPolicy), extend the retention interval etc.

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
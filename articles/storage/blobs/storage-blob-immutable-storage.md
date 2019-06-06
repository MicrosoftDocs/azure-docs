---
title: Immutable storage for Azure Storage Blobs | Microsoft Docs
description: Azure Storage offers WORM (Write Once, Read Many) support for Blob (object) storage that enables users to store data in a non-erasable, non-modifiable state for a specified interval.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/01/2019
ms.author: tamram
ms.reviewer: hux
ms.subservice: blobs
---

# Store business-critical data in Azure Blob storage

Immutable storage for Azure Blob storage enables users to store business-critical data objects in a WORM (Write Once, Read Many) state. This state makes the data non-erasable and non-modifiable for a user-specified interval. Blob Objects can be created and read, but not modified or deleted, for the duration of the retention interval. Immutable storage is enabled for General Purpose v2 and Blob Storage accounts in all Azure regions.

## Overview

Immutable storage helps healthcare organization, financial institutions, and related industries--particularly broker-dealer organizations--to store data securely. It can also be leveraged in any scenario to protect critical data against modification or deletion. 

Typical applications include:

- **Regulatory compliance**: Immutable storage for Azure Blob storage helps organizations address SEC 17a-4(f), CFTC 1.31(d), FINRA, and other regulations. A technical whitepaper by Cohasset Associates details how Immutable storage addresses these regulatory requirements is downloadable via the [Microsoft Service Trust Portal](https://aka.ms/AzureWormStorage). The [Azure Trust Center](https://www.microsoft.com/trustcenter/compliance/compliance-overview) contains detailed information about our compliance certifications.

- **Secure document retention**: Immutable storage for Azure Blob storage ensures that data can't be modified or deleted by any user, including users with account administrative privileges.

- **Legal hold**: Immutable storage for Azure Blob storage enables users to store sensitive information that is critical to litigation or business use in a tamper-proof state for the desired duration until the hold is removed. This feature is not limited only to legal use cases but can also be thought of as an event-based hold or an enterprise lock, where the need to protect data based on event triggers or corporate policy is required.

Immutable storage supports the following:

- **[Time-based retention policy support](#time-based-retention)**: Users can set policies to store data for a specified interval. When a time-based retention policy is set, blobs can be created and read, but not modified or deleted. After the retention period has expired, blobs can be deleted but not overwritten.

- **[Legal hold policy support](#legal-holds)**: If the retention interval is not known, users can set legal holds to store data immutably until the legal hold is cleared.  When a legal hold policy is set, blobs can be created and read, but not modified or deleted. Each legal hold is associated with a user-defined alphanumeric tag (such as a case ID, event name, etc.) that is used as an identifier string. 

- **Support for all blob tiers**: WORM policies are independent of the Azure Blob storage tier and apply to all the tiers: hot, cool, and archive. Users can transition data to the most cost-optimized tier for their workloads while maintaining data immutability.

- **Container-level configuration**: Users can configure time-based retention policies and legal hold tags at the container level. By using simple container-level settings, users can create and lock time-based retention policies, extend retention intervals, set and clear legal holds, and more. These policies apply to all the blobs in the container, both existing and new.

- **Audit logging support**: Each container includes a policy audit log. It shows up to seven time-based retention commands for locked time-based retention policies and contains the user ID, command type, time stamps, and retention interval. For legal holds, the log contains the user ID, command type, time stamps, and legal hold tags. This log is retained for the lifetime of the policy, in accordance with the SEC 17a-4(f) regulatory guidelines. The [Azure Activity Log](../../azure-monitor/platform/activity-logs-overview.md) shows a more comprehensive log of all the control plane activities; while enabling [Azure Diagnostic Logs](../../azure-monitor/platform/diagnostic-logs-overview.md) retains and shows data plane operations. It is the user's responsibility to store those logs persistently, as might be required for regulatory or other purposes.

## How it works

Immutable storage for Azure Blob storage supports two types of WORM or immutable policies: time-based retention and legal holds. When a time-based retention policy or legal hold is applied on a container, all existing blobs move into an immutable WORM state in less than 30 seconds. All new blobs that are uploaded to that container will also move into the immutable state. Once all blobs have moved into the immutable state, the immutable policy is confirmed and all overwrite or delete operations for existing and new objects in the immutable container are not allowed.

Container and Account deletion are also not allowed if there are any blobs protected by an immutable policy. The Delete Container operation will fail if at least one blob exists with a locked time-based retention policy or a legal hold. The storage account deletion will fail if there is at least one WORM container with a legal hold or a blob with an active retention interval. 

### Time-based retention

> [!IMPORTANT]
> A time-based retention policy must be *locked* for the blob to be in a compliant immutable (write and delete protected) state for SEC 17a-4(f) and other regulatory compliance. We recommend that you lock the policy in a reasonable amount of time, typically less than 24 hours. The initial state of an applied time-based retention policy is *unlocked*, allowing you to test the feature and make changes to the policy before you lock it. While the *unlocked* state provides immutability protection, we don't recommend using the *unlocked* state for any purpose other than short-term feature trials. 

When a time-based retention policy is applied on a container, all blobs in the container will stay in the immutable state for the duration of the *effective* retention period. The effective retention period for existing blobs is equal to the difference between the blob modification time and the user-specified retention interval.

For new blobs, the effective retention period is equal to the user-specified retention interval. Because users can extend the retention interval, immutable storage uses the most recent value of the user-specified retention interval to calculate the effective retention period.

> [!TIP]
> **Example:** A user creates a time-based retention policy with a retention interval of five years.
>
> The existing blob in that container, _testblob1_, was created one year ago. The effective retention period for _testblob1_ is four years.
>
> A new blob, _testblob2_, is now uploaded to the container. The effective retention period for this new blob is five years.

An unlocked time-based retention policy is recommended only for feature testing and a policy must be locked in order to be compliant with SEC 17a-4(f) and other regulatory compliance. Once a time-based retention policy is locked, the policy cannot be removed and a maximum of 5 increases to the effective retention period is allowed. For more information on how to set and lock time-based retention policies, see the [Getting started](#getting-started) section.

### Legal holds

When you set a legal hold, all existing and new blobs stay in the immutable state until the legal hold is cleared. For more information on how to set and clear legal holds, see the [Getting started](#getting-started) section.

A container can have both a legal hold and a time-based retention policy at the same time. All blobs in that container stay in the immutable state until all legal holds are cleared, even if their effective retention period has expired. Conversely, a blob stays in an immutable state until the effective retention period expires, even though all legal holds have been cleared.

The following table shows the types of blob operations that are disabled for the different immutable scenarios. For more information, see the [Azure Blob Service API](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api) documentation.

|Scenario  |Blob state  |Blob operations not allowed  |
|---------|---------|---------|
|Effective retention interval on the blob has not yet expired and/or legal hold is set     |Immutable: both delete and write-protected         | Put Blob<sup>1</sup>, Put Block<sup>1</sup>, Put Block List<sup>1</sup>, Delete Container, Delete Blob, Set Blob Metadata, Put Page, Set Blob Properties,  Snapshot Blob, Incremental Copy Blob, Append Block         |
|Effective retention interval on the blob has expired     |Write-protected only (delete operations are allowed)         |Put Blob<sup>1</sup>, Put Block<sup>1</sup>, Put Block List<sup>1</sup>, Set Blob Metadata, Put Page, Set Blob Properties,  Snapshot Blob, Incremental Copy Blob, Append Block         |
|All legal holds cleared, and no time-based retention policy is set on the container     |Mutable         |None         |
|No WORM policy is created (time-based retention or legal hold)     |Mutable         |None         |

<sup>1</sup> The application allows these operations to create a new blob once. All subsequent overwrite operations on an existing blob path in an immutable container are not allowed.

## Supported values

### Time-based retention
- For a storage account, the maximum number of containers with locked time-based immutable policies is 1,000.
- The minimum retention interval is 1 day. The maximum is 146,000 days (400 years).
- For a container, the maximum number of edits to extend a retention interval for locked time-based immutable policies is 5.
- For a container, a maximum of 7 time-based retention policy audit logs are retained for the duration of the policy.

### Legal hold
- For a storage account, the maximum number of containers with a legal hold setting is 1,000.
- For a container, the maximum number of legal hold tags is 10.
- The minimum length of a legal hold tag is 3 alphanumeric characters. The maximum length is 23 alphanumeric characters.
- For a container, a maximum of 10 legal hold policy audit logs are retained for the duration of the policy.

## Pricing

There is no additional charge for using this feature. Immutable data is priced in the same way as regular, mutable data. For pricing details on Azure Blob Storage, see the [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Getting started
Immutable storage is available only for General Purpose v2 and Blob Storage Accounts. These accounts must be managed through [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). For information on upgrading an existing General Purpose v1 storage account, see [Upgrade a storage account](../common/storage-account-upgrade.md).

The most recent releases of the [Azure portal](https://portal.azure.com), [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), and [Azure PowerShell](https://github.com/Azure/azure-powershell/releases) support immutable storage for Azure Blob storage. [Client library support](#client-libraries) is also provided.

### Azure portal

1. Create a new container or select an existing container to store the blobs that need to be kept in the immutable state.
 The container must be in a GPv2 or blob storage account.
2. Select **Access policy** in the container settings. Then select **+ Add policy** under **Immutable blob storage**.

    ![Container settings in the portal](media/storage-blob-immutable-storage/portal-image-1.png)

3. To enable time-based retention, select **Time-based retention** from the drop-down menu.

    !["Time-based retention" selected under "Policy type"](media/storage-blob-immutable-storage/portal-image-2.png)

4. Enter the retention interval in days (acceptable values of 1 to 146000 days).

    !["Update retention period to" box](media/storage-blob-immutable-storage/portal-image-5-retention-interval.png)

    The initial state of the policy is unlocked allowing you to test the feature and make changes to the policy before you lock it. Locking the policy is essential for compliance with regulations like SEC 17a-4.

5. Lock the policy. Right-click the ellipsis (**...**), and the following menu appears with additional actions:

    !["Lock policy" on the menu](media/storage-blob-immutable-storage/portal-image-4-lock-policy.png)

6. Select **Lock Policy** and confirm the lock. The policy is now locked and cannot be deleted, only extensions of the retention interval will be allowed. Blob deletes and overrides are not permitted. 

    ![Confirm "Lock policy" on the menu](media/storage-blob-immutable-storage/portal-image-5-lock-policy.png)

7. To enable legal holds, select **+ Add Policy**. Select **Legal hold** from the drop-down menu.

    !["Legal hold" on the menu under "Policy type"](media/storage-blob-immutable-storage/portal-image-legal-hold-selection-7.png)

8. Create a legal hold with one or more tags.

    !["Tag name" box under the policy type](media/storage-blob-immutable-storage/portal-image-set-legal-hold-tags.png)

9. To clear a legal hold, simply remove the applied legal hold identifier tag.

### Azure CLI

The feature is included in the following command groups:
`az storage container immutability-policy`  and `az storage container legal-hold`. Run `-h` on them to see the commands.

### PowerShell

The Az.Storage module supports immutable storage.  To enable the feature, follow these steps:

1. Ensure that you have the latest version of PowerShellGet installed: `Install-Module PowerShellGet –Repository PSGallery –Force`.
2. Remove any previous installation of Azure PowerShell.
3. Install Azure PowerShell: `Install-Module Az –Repository PSGallery –AllowClobber`.

The [Sample PowerShell code](#sample-powershell-code) section later in this article illustrates the feature usage.

## Client libraries

The following client libraries support immutable storage for Azure Blob storage:

- [.NET Client Library version 7.2.0-preview and later](https://www.nuget.org/packages/Microsoft.Azure.Management.Storage/7.2.0-preview)
- [Node.js Client Library version 4.0.0 and later](https://www.npmjs.com/package/azure-arm-storage)
- [Python Client Library version 2.0.0 Release Candidate 2 and later](https://pypi.org/project/azure-mgmt-storage/2.0.0rc2/)
- [Java Client Library](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/storage/resource-manager/Microsoft.Storage/preview/2018-03-01-preview)

## FAQ

**Can you provide documentation of WORM compliance?**

Yes. To document compliance, Microsoft retained a leading independent assessment firm that specializes in records management and information governance, Cohasset Associates, to evaluate Azure Immutable Blob Storage and its compliance with requirements specific to the financial services industry. Cohasset validated that Azure Immutable Blob Storage, when used to retain time-based Blobs in a WORM state, meets the relevant storage requirements of CFTC Rule 1.31(c)-(d), FINRA Rule 4511, and SEC Rule 17a-4. Microsoft targeted this set of rules, as they represent the most prescriptive guidance globally for records retention for financial institutions. The Cohasset report is available in the [Microsoft Service Trust Center](https://aka.ms/AzureWormStorage). To request a letter of attestation from Microsoft regarding WORM compliance, please contact Azure support.

**Does the feature apply to only block blobs, or to page and append blobs as well?**

Immutable storage can be used with any blob type, but we recommend that you use it mostly for block blobs. Unlike block blobs, page blobs and append blobs need to be created outside a WORM container, and then copied in. After you copy these blobs into a WORM container, no further *appends* to an append blob or changes to a page blob are allowed.

**Do I need to create a new storage account to use this feature?**

No, you can use immutable storage with any existing or newly created General Purpose v2 or Blob storage accounts. This feature is intended for usage with block blobs in GPv2 and Blob Storage accounts. General Purpose v1 storage accounts are not supported but can be easily upgraded to General Purpose v2. For information on upgrading an existing General Purpose v1 storage account, see [Upgrade a storage account](../common/storage-account-upgrade.md).

**Can I apply both a legal hold and time-based retention policy?**

Yes, a container can have both a legal hold and a time-based retention policy at the same time. All blobs in that container stay in the immutable state until all legal holds are cleared, even if their effective retention period has expired. Conversely, a blob stays in an immutable state until the effective retention period expires, even though all legal holds have been cleared.

**Are legal hold policies only for legal proceedings or are there other use scenarios?**

No, Legal Hold is just the general term used for a non time-based retention policy. It does not need to only be used for litigation related proceedings. Legal Hold policies are useful for disabling overwrite and deletes for protecting important enterprise WORM data, where the retention period is unknown. You may use it as an enterprise policy to protect your mission critical WORM workloads or use it as a staging policy before a custom event trigger requires the use of a time-based retention policy. 

**Can I remove a *locked* time-based retention policy or legal hold?**

Only unlocked time-based retention policies can be removed from a container. Once a time-based retention policy is locked, it cannot be removed; only effective retention period extensions are allowed. Legal hold tags can be deleted. When all legal tags are deleted, the legal hold is removed.

**What happens if I try to delete a container with a *locked* time-based retention policy or legal hold?**

The Delete Container operation will fail if at least one blob exists with a locked time-based retention policy or a legal hold. The Delete Container operation will succeed only if no blob with an active retention interval exists and there are no legal holds. You must delete the blobs before you can delete the container.

**What happens if I try to delete a storage account with a WORM container that has a *locked* time-based retention policy or legal hold?**

The storage account deletion will fail if there is at least one WORM container with a legal hold or a blob with an active retention interval. You must delete all WORM containers before you can delete the storage account. For information on container deletion, see the preceding question.

**Can I move the data across different blob tiers (hot, cool, cold) when the blob is in the immutable state?**

Yes, you can use the Set Blob Tier command to move data across the blob tiers while keeping the data in the compliant immutable state. Immutable storage is supported on hot, cool, and archive blob tiers.

**What happens if I fail to pay and my retention interval has not expired?**

In the case of non-payment, normal data retention policies will apply as stipulated in the terms and conditions of your contract with Microsoft.

**Do you offer a trial or grace period for just trying out the feature?**

Yes. When a time-based retention policy is first created, it is in an *unlocked* state. In this state, you can make any desired change to the retention interval, such as increase or decrease and even delete the policy. After the policy is locked, it stays locked until the retention interval expires. This locked policy prevents deletion and modification to the retention interval. We strongly recommend that you use the *unlocked* state only for trial purposes and lock the policy within a 24-hour period. These practices help you comply with SEC 17a-4(f) and other regulations.

**Can I use soft delete alongside Immutable blob policies?**

Yes. [Soft delete for Azure Blob storage](storage-blob-soft-delete.md) applies for all containers within a storage account regardless of a legal hold or time-based retention policy. We recommend enabling soft delete for additional protection before any immutable WORM policies are applied and confirmed. 

**Where is the feature available?**

Immutable storage is available in Azure Public, China, and Government regions. If Immutable storage is not available in your region, please contact support and email azurestoragefeedback@microsoft.com.

## Sample PowerShell code

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

The following sample PowerShell script is for reference. This script creates a new storage account and container. It then shows you how to set and clear legal holds, create and lock a time-based retention policy (also known as an immutability policy), and extend the retention interval.

Set up and test the Azure Storage account:

```powershell
$ResourceGroup = "<Enter your resource group>”
$StorageAccount = "<Enter your storage account name>"
$container = "<Enter your container name>"
$container2 = "<Enter another container name>”
$location = "<Enter the storage account location>"

# Log in to the Azure Resource Manager account
Login-AzAccount
Register-AzResourceProvider -ProviderNamespace "Microsoft.Storage"

# Create your Azure resource group
New-AzResourceGroup -Name $ResourceGroup -Location $location

# Create your Azure storage account
New-AzStorageAccount -ResourceGroupName $ResourceGroup -StorageAccountName `
    $StorageAccount -SkuName Standard_LRS -Location $location -Kind StorageV2

# Create a new container
New-AzStorageContainer -ResourceGroupName $ResourceGroup `
    -StorageAccountName $StorageAccount -Name $container

# Create Container 2 with a storage account object
$accountObject = Get-AzStorageAccount -ResourceGroupName $ResourceGroup `
    -StorageAccountName $StorageAccount
New-AzStorageContainer -StorageAccount $accountObject -Name $container2

# Get a container
Get-AzStorageContainer -ResourceGroupName $ResourceGroup `
    -StorageAccountName $StorageAccount -Name $container

# Get a container with an account object
$containerObject = Get-AzStorageContainer -StorageAccount $accountObject -Name $container

# List containers
Get-AzStorageContainer -ResourceGroupName $ResourceGroup `
    -StorageAccountName $StorageAccount

# Remove a container (add -Force to dismiss the prompt)
Remove-AzStorageContainer -ResourceGroupName $ResourceGroup `
    -StorageAccountName $StorageAccount -Name $container2

# Remove a container with an account object
Remove-AzStorageContainer -StorageAccount $accountObject -Name $container2

# Remove a container with a container object
$containerObject2 = Get-AzStorageContainer -StorageAccount $accountObject -Name $container2
Remove-AzStorageContainer -InputObject $containerObject2
```

Set and clear legal holds:

```powershell
# Set a legal hold
Add-AzRmStorageContainerLegalHold -ResourceGroupName $ResourceGroup `
	-StorageAccountName $StorageAccount -Name $container -Tag <tag1>,<tag2>,...

# with an account object
Add-AzRmStorageContainerLegalHold -StorageAccount $accountObject -Name $container -Tag <tag3>

# with a container object
Add-AzRmStorageContainerLegalHold -Container $containerObject -Tag <tag4>,<tag5>,...

# Clear a legal hold
Remove-AzRmStorageContainerLegalHold -ResourceGroupName $ResourceGroup `
	-StorageAccountName $StorageAccount -Name $container -Tag <tag2>

# with an account object
Remove-AzRmStorageContainerLegalHold -StorageAccount $accountObject -Name $container -Tag <tag3>,<tag5>

# with a container object
Remove-AzRmStorageContainerLegalHold -Container $containerObject -Tag <tag4>
```

Create or update immutability policies:
```powershell
# with an account name or container name
Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName $ResourceGroup `
	-StorageAccountName $StorageAccount -ContainerName $container -ImmutabilityPeriod 10

# with an account object
Set-AzRmStorageContainerImmutabilityPolicy -StorageAccount $accountObject `
	-ContainerName $container -ImmutabilityPeriod 1 -Etag $policy.Etag

# with a container object
$policy = Set-AzRmStorageContainerImmutabilityPolicy -Container `
	$containerObject -ImmutabilityPeriod 7

# with an immutability policy object
Set-AzRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy $policy -ImmutabilityPeriod 5
```

Retrieve immutability policies:
```powershell
# Get an immutability policy
Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName $ResourceGroup `
	-StorageAccountName $StorageAccount -ContainerName $container

# with an account object
Get-AzRmStorageContainerImmutabilityPolicy -StorageAccount $accountObject `
	-ContainerName $container

# with a container object
Get-AzRmStorageContainerImmutabilityPolicy -Container $containerObject
```

Lock immutability policies (add -Force to dismiss the prompt):
```powershell
# with an immutability policy object
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
	$ResourceGroup -StorageAccountName $StorageAccount -ContainerName $container
$policy = Lock-AzRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy $policy -force

# with an account name or container name
$policy = Lock-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
	$ResourceGroup -StorageAccountName $StorageAccount -ContainerName $container `
	-Etag $policy.Etag

# with an account object
$policy = Lock-AzRmStorageContainerImmutabilityPolicy -StorageAccount `
	$accountObject -ContainerName $container -Etag $policy.Etag

# with a container object
$policy = Lock-AzRmStorageContainerImmutabilityPolicy -Container `
	$containerObject -Etag $policy.Etag -force
```

Extend immutability policies:
```powershell

# with an immutability policy object
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
	$ResourceGroup -StorageAccountName $StorageAccount -ContainerName $container

$policy = Set-AzRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy `
	$policy -ImmutabilityPeriod 11 -ExtendPolicy

# with an account name or container name
$policy = Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
	$ResourceGroup -StorageAccountName $StorageAccount -ContainerName $container `
	-ImmutabilityPeriod 11 -Etag $policy.Etag -ExtendPolicy

# with an account object
$policy = Set-AzRmStorageContainerImmutabilityPolicy -StorageAccount `
	$accountObject -ContainerName $container -ImmutabilityPeriod 12 -Etag `
	$policy.Etag -ExtendPolicy

# with a container object
$policy = Set-AzRmStorageContainerImmutabilityPolicy -Container `
	$containerObject -ImmutabilityPeriod 13 -Etag $policy.Etag -ExtendPolicy
```

Remove an unlocked immutability policy (add -Force to dismiss the prompt):
```powershell
# with an immutability policy object
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
	$ResourceGroup -StorageAccountName $StorageAccount -ContainerName $container
Remove-AzRmStorageContainerImmutabilityPolicy -ImmutabilityPolicy $policy

# with an account name or container name
Remove-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName `
	$ResourceGroup -StorageAccountName $StorageAccount -ContainerName $container `
	-Etag $policy.Etag

# with an account object
Remove-AzRmStorageContainerImmutabilityPolicy -StorageAccount $accountObject `
	-ContainerName $container -Etag $policy.Etag

# with a container object
Remove-AzRmStorageContainerImmutabilityPolicy -Container $containerObject `
	-Etag $policy.Etag

```

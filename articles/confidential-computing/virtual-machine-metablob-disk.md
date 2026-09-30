---
title: Virtual Machine Metablob Disk
description: Information on Virtual Machine Metablob Disk (VMMD)
author: linuxelf001
ms.topic: concept-article
ms.service: azure-confidential-computing
ms.date: 09/05/2025
ms.author: raginjup
ms.reviewer: raginjup
---
# Virtual Machine Metablob Disk

This article outlines the changes to be aware when using confidential virtual machines with Virtual Machine Metablob (VMMD) disk.

> [!NOTE]
> The VMMD feature support described here are available in Azure REST API version **2025-01-02** and later, Azure CLI version **2.77.0** and later, Azure PowerShell version **14.4.0** and later.

## Prerequisites

Before you begin, ensure you have the following:

* An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
* A confidential virtual machine with managed disks.
* The appropriate version of the tools you are using:
    * Azure REST API version 2025-01-02 or later.
    * Azure CLI version 2.77.0 or later.
    * Azure PowerShell version 14.4.0 or later.

## Disk Access
The process for granting access to confidential virtual machine disks has been updated to provide a SAS URI for the Virtual Machine Metadata Disk (VMMD) blob. This is in addition to the existing SAS URIs for the OS disk and the VM guest state (VMGS) blob.

### [Azure REST API](#tab/rest-access)

To get the VMMD SAS URI using the Azure REST API, use the `beginGetAccess` endpoint with version `2025-01-02` or later.

Grant access to a confidential virtual machine disk
  * API: beginGetAccess
  * New in response: securityMetadataAccessSAS

**Sample HTTP Request:**

```http
POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myDisk/beginGetAccess?api-version=2025-01-02

{
  "access": "Read",
  "durationInSeconds": 300,
  "fileFormat": "VHD"
}
```

**Sample Response:**

Status code: 200

```json
{
  "accessSAS": "OS disk SAS URI",
  "securityDataAccessSAS": "VM Guest State SAS URI",
  "securityMetadataAccessSAS": "VM Metadata SAS URI"
}
```
Detailed documentation and more examples using Java, Go, JavaScript, or dotnet [are available here.](/rest/api/compute/disks/create-or-update?view=rest-compute-2025-01-02&tabs=HTTP#create-a-managed-disk-from-importsecure-create-option-with-metadata-uri-for-confidential-vm&preserve-view=true)

### [Azure CLI](#tab/cli-access)

When using the `az disk grant-access` command in Azure CLI version 2.77.0 or later, confidential virtual machines with three blobs include the `securityMetadataAccessSAS`.

**Example:**

```shell
diskSas=$(az disk grant-access \
  -n $diskName \
  -g $resourceGroupName \
  --access-level Write \
  --duration-in-seconds 86400 \
  --secure-vm-guest-state-sas)
```

**Returned value schema:**

```json
{
  "accessSAS": "OS disk SAS URI",
  "securityDataAccessSAS": "VM Guest State SAS URI",
  "securityMetadataAccessSAS": "VM Metadata SAS URI"
}
```

### [Azure PowerShell](#tab/powershell-access)

With Azure PowerShell version 14.4.0 or later, the `Grant-AzDiskAccess` cmdlet now returns an object that includes the `securityMetadataAccessSAS`.

**Example:**

```powershell
Grant-AzDiskAccess `
  -ResourceGroupName 'ResourceGroup01' `
  -DiskName 'Disk01' `
  -Access 'Read' `
  -DurationInSecond 60 `
  -SecureVmGuestStateSas
```
> [!NOTE]
> Multiline commands in PowerShell require a trailing backtick (\`) character, which must have a space preceding it. There should NOT be any space or trailing comments after the backtick (\`) either. You may avoid this issue by entering the whole command in a single line.

**Returned value schema:**

```json
{
  "accessSAS": "OS disk SAS URI",
  "securityDataAccessSAS": "VM Guest State SAS URI",
  "securityMetadataAccessSAS": "VM Metadata SAS URI"
}
```

---

## Create

### [Azure REST API](#tab/rest-create)

To create a confidential virtual machine disk with VMMD URI
  * API: createOption ImportSecure
  * Include: securityMetadataUri in the request

**Sample HTTP Request:**

```http
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myDisk?api-version=2025-01-02

{
  "location": "West US",
  "properties": {
    "osType": "Windows",
    "securityProfile": {
      "securityType": "ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey"
    },
    "creationData": {
      "createOption": "ImportSecure",
      "storageAccountId": "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
      "sourceUri": "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
      "securityDataUri": "https://mystorageaccount.blob.core.windows.net/osimages/vmgs.vhd",
      "securityMetadataUri": "https://mystorageaccount.blob.core.windows.net/osimages/vmmd.vhd"
    }
  }
}

```

**Sample Response:**

Status code: 200

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myDisk",
  "name": "myDisk",
  "location": "West US",
  "properties": {
    "provisioningState": "Updating",
    "osType": "Windows",
    "securityProfile": {
      "securityType": "ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey"
    },
    "creationData": {
      "createOption": "ImportSecure",
      "storageAccountId": "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
      "sourceUri": "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
      "securityDataUri": "https://mystorageaccount.blob.core.windows.net/osimages/vmgs.vhd",
      "securityMetadataUri": "https://mystorageaccount.blob.core.windows.net/osimages/vmmd.vhd"
    }
  }
}
```
Detailed documentation and more examples using Java, Go, JavaScript, or dotnet [are available here.](/rest/api/compute/disks/create-or-update?view=rest-compute-2025-01-02&tabs=HTTP#create-a-managed-disk-from-importsecure-create-option-with-metadata-uri-for-confidential-vm&preserve-view=true)

### [Azure CLI](#tab/cli-create)

To create a confidential virtual machine disk with VMMD URI
  * Include the --security-metadata-uri parameter.
  * Requires Azure CLI version 2.77.0 or later.

**Example:**

```shell
az disk create -n $diskName -g $resourceGroup -l $location --os-type Windows --hyper-v-generation V2 --security-type "ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey" --source $sourceDiskVhdUri --security-data-uri $guestStateDiskVhdUri --security-metadata-uri $metadataDiskVhdUri \ --sku standard_lrs 
```

**Returned value schema:**

```json
{
  "accessSAS": "OS disk SAS URI",
  "securityDataAccessSAS": "VM Guest State SAS URI",
  "securityMetadataAccessSAS": "VM Metadata SAS URI"
}
```

### [Azure PowerShell](#tab/powershell-create)

With Azure PowerShell version 14.4.0 or later, the `Grant-AzDiskAccess` cmdlet now returns an object that includes the `securityMetadataAccessSAS`.

**Example:**

```powershell
Grant-AzDiskAccess `
  -ResourceGroupName 'ResourceGroup01' `
  -DiskName 'Disk01' `
  -Access 'Read' `
  -DurationInSecond 60 `
  -SecureVmGuestStateSas
```
> [!NOTE]
> Multiline commands in PowerShell require a trailing backtick (\`) character, which must have a space preceding it. There should NOT be any space or trailing comments after the backtick (\`) either. You may avoid this issue by entering the whole command in a single line.

**Returned value schema:**

```json
{
  "accessSAS": "OS disk SAS URI",
  "securityDataAccessSAS": "VM Guest State SAS URI",
  "securityMetadataAccessSAS": "VM Metadata SAS URI"
}
```
---

When using UploadPreparedSecure, upload the VMMD blob in addition to the OS and VMGS blobs if the source includes VMMD.


## FAQ

1. What is the VMMD blob? <br>
   The VMMD (Virtual Machine Metadata) blob contains metadata for a confidential VM.
          
3. Do we currently have support for incremental snapshots for confidential VM with VMMD <br>
   At this moment, confidential VMs with VMMD blob do not support incremental snapshots yet.

4. Can we convert confidential VMs with VMMD and VMGS blob to confidential VMs with VMGS only <br>
   Unfortunately, this conversion is not supported at the moment.

For more, see our [confidential VM FAQ](/azure/confidential-computing/confidential-vm-faq) and our [managed disk FAQ](/azure/virtual-machines/faq-for-disks)

## Next Steps

* [Deploy a confidential VM from Azure](/azure/confidential-computing/quick-create-confidential-vm-portal)
* [Azure confidential computing documentation](/azure/confidential-computing/)

## Related Articles

* [Azure managed disks overview](/azure/virtual-machines/managed-disks-overview)
* [Managed disk migration guide](/azure/virtual-machines/linux/convert-unmanaged-to-managed-disks) 

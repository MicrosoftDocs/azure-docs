---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 10/17/2023
 ms.author: rogarana
 ms.custom: include file
---
> [!IMPORTANT]
> As of February 15th, the Shared Access Signature (SAS) access time for disks and snapshots will be limited to a maximum of 60 days. Trying to generate a SAS with an expiration longer than 60 days results in an error. Any existing disk or snapshot SAS with expirations longer than 60 days won't be supported after 60 days and may result in a 403 error during authorization. 

Review all your calls that generate a managed disk or snapshot SAS to ensure that they are changed to request access 60 days or less.
Existing SAS generated before February 15th may not be valid after 60 days. You can revoke the existing SAS and re-request a new one with expiry less than or equal to 60 days to be certain.

> To check if a disk has an active SAS, you can either use the [REST API](/rest/api/compute/disks/get?view=rest-compute-2024-03-01&tabs=HTTP#diskstate), the [Azure CLI](/cli/azure/disk?view=azure-cli-latest#az-disk-show), or the [Azure PowerShell module](/powershell/module/az.compute/get-azdisk?view=azps-12.0.0).
> To revoke a SAS, you can use either the [REST API](/rest/api/compute/disks/revoke-access?view=rest-compute-2024-03-01&tabs=HTTP), the [Azure CLI](/cli/azure/disk?view=azure-cli-latest#az-disk-revoke-access), or the [Azure PowerShell module](/powershell/module/az.compute/revoke-azdiskaccess?view=azps-12.0.0).
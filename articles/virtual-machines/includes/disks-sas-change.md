---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 08/15/2024
 ms.author: rogarana
 ms.custom: include file
---
> [!IMPORTANT]
> On February 15th, 2025, the Shared Access Signature (SAS) access time for disks and snapshots will be limited to a maximum of 60 days. Trying to generate a SAS with an expiration longer than 60 days results in an error. Any existing disk or snapshot SAS created with an expiration longer than 60 days may stop working 60 days after the date of creation and will result in a 403 error during authorization.

If a managed disk or snapshot SAS's expiration is longer than 60 days, revoke its access, and generate a new SAS that requests access for 60 days (5,184,000 seconds) or less. Improve your overall security by using SAS with shorter expiration dates. Make these changes before February 15, 2025 to prevent service interruption. The following links can be used to find, revoke, and request a new SAS.

- To check if a disk has an active SAS, you can either use the [REST API](/rest/api/compute/disks/get?view=rest-compute-2024-03-01&tabs=HTTP#diskstate), the [Azure CLI](/cli/azure/disk?view=azure-cli-latest#az-disk-show), or the [Azure PowerShell module](/powershell/module/az.compute/get-azdisk?view=azps-12.0.0), and examine the **DiskState** property.
- To revoke a SAS, you can use either the [REST API](/rest/api/compute/disks/revoke-access?view=rest-compute-2024-03-01&tabs=HTTP), the [Azure CLI](/cli/azure/disk?view=azure-cli-latest#az-disk-revoke-access), or the [Azure PowerShell module](/powershell/module/az.compute/revoke-azdiskaccess?view=azps-12.0.0).
- To create a SAS, you can use either the [REST API](/rest/api/compute/disks/grant-access?view=rest-compute-2024-03-01&tabs=HTTP), the [Azure CLI](/cli/azure/disk?view=azure-cli-latest), or the [Azure PowerShell module](/powershell/module/az.compute/grant-azdiskaccess?view=azps-12.2.0&viewFallbackFrom=azps-12.0.0), and set the access duration to 5,184,000 seconds or less.
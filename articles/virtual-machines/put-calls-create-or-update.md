---
title: PUT calls for create or update operations
description: PUT calls for create or update operations on compute resources 
author: mimckitt
ms.author: mimckitt
ms.reviewer: cynthn
ms.topic: conceptual
ms.service: virtual-machines
ms.date: 08/4/2020
ms.custom: avverma
---

# PUT calls for creation or updates on compute resources

`Microsoft.Compute` resources do not support the conventional definition of *PUT* semantics. Instead, these resources use PATCH semantics.

**Create** operations following PATCH semantics and apply default values when appropriate. For example, the disk `caching` property of a virtual machine defaults to `ReadWrite` if the resource is an OS disk.

```json
    "storageProfile": {
      "osDisk": {
        "name": "myVMosdisk",
        "image": {
          "uri": "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/{existing-generalized-os-image-blob-name}.vhd"
        },
        "osType": "Windows",
        "createOption": "FromImage",
        "caching": "ReadWrite",
        "vhd": {
          "uri": "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/myDisk.vhd"
        }
      }
    },
```

However, for **update** operations when a property is left out or a *null* value is passed, it will remain unchanged and there no defaulting values. 

This is important when sending update operations to a resource with the intention of removing an association. If that resource is a `Microsoft.Compute` resource, the corresponding property you want to remove needs to be explicitly called out and a value assigned. Such as **" "** (empty or blank). This will instruct the platform to remove that association.

## Examples

### Correct payload to remove a Proximity Placement Groups association

`
{ "location": "westus", "properties": { "platformFaultDomainCount": 2, "platformUpdateDomainCount": 20, "proximityPlacementGroup": "" } }
`

### Incorrect payloads to remove a Proximity Placement Groups association

`
{ "location": "westus", "properties": { "platformFaultDomainCount": 2, "platformUpdateDomainCount": 20, "proximityPlacementGroup": null } }
`

`
{ "location": "westus", "properties": { "platformFaultDomainCount": 2, "platformUpdateDomainCount": 20 } }
`

## Next Steps
Learn more about Create or Update calls for [Virtual Machines](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate) and [Virtual Machine Scale Sets](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate)


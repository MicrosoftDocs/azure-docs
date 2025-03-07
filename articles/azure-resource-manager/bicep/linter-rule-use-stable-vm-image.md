---
title: Linter rule - use stable VM image
description: Linter rule - use stable VM image
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 02/12/2025
---

# Linter rule - use stable VM image

Virtual machines shouldn't use preview images. This rule checks the following properties under "imageReference" and fails if any of them contain the string "preview":

- offer
- sku
- version

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-stable-vm-image`

## Solution

The following example fails this test.

```bicep
param location string = resourceGroup().location

resource vm 'Microsoft.Compute/virtualMachines@2024-03-01' = {
  name: 'virtualMachineName'
  location: location
  properties: {
    storageProfile: {
      imageReference: {
        offer: 'WindowsServer-preview'
        sku: '2019-Datacenter-preview'
        version: 'preview'
      }
    }
  }
}
```

You can fix it by using an image that does not contain the string `preview` in the imageReference.

```bicep
param location string = resourceGroup().location

resource vm 'Microsoft.Compute/virtualMachines@2024-03-01' = {
  name: 'virtualMachineName'
  location: location
  properties: {
    storageProfile: {
      imageReference: {
        offer: 'WindowsServer'
        sku: '2019-Datacenter'
        version: 'latest'
      }
    }
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).

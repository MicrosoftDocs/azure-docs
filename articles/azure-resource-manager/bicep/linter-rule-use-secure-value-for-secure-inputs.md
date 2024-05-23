---
title: Linter rule - adminPassword should be assigned a secure value
description: Linter rule - adminPassword should be assigned a secure value.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 05/06/2024
---

# Linter rule - adminPassword should be assigned a secure value.

This rule finds the value of the property path `properties.osProfile.adminPassword` for resources of type `Microsoft.Compute/virtualMachines` or `Microsoft.Compute/virtualMachineScaleSets` that doesn't have a secure value.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-secure-value-for-secure-inputs`

## Solution

Assign a secure value to the property with the property path `properties.osProfile.adminPassword` for resources of type `Microsoft.Compute/virtualMachines` or `Microsoft.Compute/virtualMachineScaleSets`. Don't use a literal value. Instead, create a parameter with the [`@secure()` decorator](./parameters.md#secure-parameters) for the password and assign it to `adminPassword`.

The following examples fail this test because the `adminPassword` is not a secure value.

```bicep
resource ubuntuVM 'Microsoft.Compute/virtualMachineScaleSets@2023-09-01' = {
  name: 'name'
  location: 'West US'
  properties: {
    virtualMachineProfile: {
      osProfile: {
        adminUsername: 'adminUsername'
        adminPassword: 'adminPassword'
      }
    }
  }
}
```

```bicep
resource ubuntuVM 'Microsoft.Compute/virtualMachines@2023-09-01' = {
  name: 'name'
  location: 'West US'
  properties: {
    osProfile: {
      computerName: 'computerName'
      adminUsername: 'adminUsername'
      adminPassword: 'adminPassword'
    }
  }
}
```

```bicep
param adminPassword string

resource ubuntuVM 'Microsoft.Compute/virtualMachines@2023-09-01' = {
  name: 'name'
  location: 'West US'
  properties: {
    osProfile: {
      computerName: 'computerName'
      adminUsername: 'adminUsername'
      adminPassword: adminPassword
    }
  }
}
```

The following example passes this test.

```bicep
@secure()
param adminPassword string
@secure()
param adminUsername string
param location string = resourceGroup().location

resource ubuntuVM 'Microsoft.Compute/virtualMachines@2023-09-01' = {
  name: 'name'
  location: location
  properties: {
    osProfile: {
      computerName: 'computerName'
      adminUsername: adminUsername
      adminPassword: adminPassword
    }
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).

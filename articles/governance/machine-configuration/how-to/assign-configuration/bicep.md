---
title: How to create a machine configuration assignment using Bicep
description: >-
  Learn how to deploy configurations to machines using Bicep
ms.date: 02/01/2024
ms.topic:  how-to
ms.custom: devx-track-bicep
---

# How to create a machine configuration assignment using Bicep

You can use [Azure Bicep][01] to deploy machine configuration assignments. This article shows
examples for deploying both custom and built-in configurations.

In each of the following sections, the example includes a **type** property where the name starts
with `Microsoft.Compute/virtualMachines`. The guest configuration resource provider
`Microsoft.GuestConfiguration` is an [extension resource][02] that must reference a parent type.

To modify the example for other resource types such as [Arc-enabled servers][03], change the parent
type to the name of the resource provider. For Arc-enabled servers, the resource provider is
`Microsoft.HybridCompute/machines`.

Replace the following "<>" fields with values specific to your environment:

- `<vm_name>`: Specify the name of the machine resource to apply the configuration on.
- `<configuration_name>`: Specify the name of the configuration to apply.
- `<vm_location>`: Specify the Azure region to create the  machine configuration assignment in.
- `<Url_to_Package.zip>`: Specify an HTTPS link to the `.zip` file for your custom content package.
- `<SHA256_hash_of_package.zip>`: Specify the SHA256 hash of the `.zip` file for your custom
  content package.

## Assign a custom configuration

The following example assigns a custom configuration.

```Bicep
resource myVM 'Microsoft.Compute/virtualMachines@2021-03-01' existing = {
  name: '<vm_name>'
}

resource myConfiguration 'Microsoft.GuestConfiguration/guestConfigurationAssignments@2020-06-25' = {
  name: '<configuration_name>'
  scope: myVM
  location: resourceGroup().location
  properties: {
    guestConfiguration: {
      name: '<configuration_name>'
      contentUri: '<Url_to_Package.zip>'
      contentHash: '<SHA256_hash_of_package.zip>'
      version: '1.*'
      assignmentType: 'ApplyAndMonitor'
    }
  }
}
```

## Assign a built-in configuration

The following example assigns the `AzureWindowBaseline` built-in configuration.

```Bicep
resource myWindowsVM 'Microsoft.Compute/virtualMachines@2021-03-01' existing = {
  name: '<vm_name>'
}

resource AzureWindowsBaseline 'Microsoft.GuestConfiguration/guestConfigurationAssignments@2020-06-25' = {
  name: 'AzureWindowsBaseline'
  scope: myWindowsVM
  location: resourceGroup().location
  properties: {
    guestConfiguration: {
      name: 'AzureWindowsBaseline'
      version: '1.*'
      assignmentType: 'ApplyAndMonitor'
      configurationParameter: [
        {
          name: 'Minimum Password Length;ExpectedValue'
          value: '16'
        }
        {
          name: 'Minimum Password Length;RemediateValue'
          value: '16'
        }
        {
          name: 'Maximum Password Age;ExpectedValue'
          value: '75'
        }
        {
          name: 'Maximum Password Age;RemediateValue'
          value: '75'
        }
      ]
    }
  }
}
```

<!-- Link reference definitions -->
[01]: /azure/azure-resource-manager/bicep/overview?tabs=bicep
[02]: /azure/azure-resource-manager/management/extension-resource-types
[03]: /azure/azure-arc/servers/overview

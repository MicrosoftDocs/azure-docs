---
title: How to create a machine configuration assignment using templates
description: Learn how to deploy configurations to machines directly from Azure Resource Manager.
ms.date: 04/18/2023
ms.topic: how-to
ms.custom: devx-track-terraform, devx-track-arm-template, devx-track-bicep
---
# How to create a machine configuration assignment using templates

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

The best way to [assign machine configuration packages][01] to multiple machines is using
[Azure Policy][02]. You can also assign machine configuration packages to a single machine.

## Built-in and custom configurations

To assign a machine configuration package to a single machine, modify the following examples. There
are two scenarios.

- Apply a custom configuration to a machine using a link to a package that you [published][03].
- Apply a [built-in][04] configuration to a machine, such as an Azure baseline.

## Extending other resource types, such as Arc-enabled servers

In each of the following sections, the example includes a **type** property where the name starts
with `Microsoft.Compute/virtualMachines`. The guest configuration resource provider
`Microsoft.GuestConfiguration` is an [extension resource][05] that must reference a parent type.

To modify the example for other resource types such as [Arc-enabled servers][06], change the parent
type to the name of the resource provider. For Arc-enabled servers, the resource provider is
`Microsoft.HybridCompute/machines`.

Replace the following "<>" fields with values specific to your environment:

- `<vm_name>`: Specify the name of the machine resource to apply the configuration on.
- `<configuration_name>`: Specify the name of the configuration to apply.
- `<vm_location>`: Specify the Azure region to create the  machine configuration assignment in.
- `<Url_to_Package.zip>`: Specify an HTTPS link to the `.zip` file for your custom content package.
- `<SHA256_hash_of_package.zip>`: Specify the SHA256 hash of the `.zip` file for your custom
  content package.

## Assign a configuration using an Azure Resource Manager template

You can deploy an [Azure Resource Manager template][07] containing machine configuration assignment
resources.

The following example assigns a custom configuration.

```json
{
    "apiVersion": "2020-06-25",
    "type": "Microsoft.Compute/virtualMachines/providers/guestConfigurationAssignments",
    "name": "<vm_name>/Microsoft.GuestConfiguration/<configuration_name>",
    "location": "<vm_location>",
    "dependsOn": [
        "Microsoft.Compute/virtualMachines/<vm_name>"
    ],
    "properties": {
        "guestConfiguration": {
            "name": "<configuration_name>",
            "contentUri": "<Url_to_Package.zip>",
            "contentHash": "<SHA256_hash_of_package.zip>",
            "assignmentType": "ApplyAndMonitor"
        }
    }
}
```

The following example assigns the `AzureWindowBaseline` built-in configuration.

```json
{
    "apiVersion": "2020-06-25",
    "type": "Microsoft.Compute/virtualMachines/providers/guestConfigurationAssignments",
    "name": "<vm_name>/Microsoft.GuestConfiguration/<configuration_name>",
    "location": "<vm_location>",
    "dependsOn": [
        "Microsoft.Compute/virtualMachines/<vm_name>"
    ],
    "properties": {
        "guestConfiguration": {
            "name": "AzureWindowsBaseline",
            "version": "1.*",
            "assignmentType": "ApplyAndMonitor",
            "configurationParameter": [
            {
                "name": "Minimum Password Length;ExpectedValue",
                "value": "16"
            },
            {
                "name": "Minimum Password Length;RemediateValue",
                "value": "16"
            },
            {
                "name": "Maximum Password Age;ExpectedValue",
                "value": "75"
            },
            {
                "name": "Maximum Password Age;RemediateValue",
                "value": "75"
            }
        ]
        }
    }
}
```

## Assign a configuration using Bicep

You can use [Azure Bicep][08] to deploy machine configuration assignments.

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

## Assign a configuration using Terraform

You can use [Terraform][09] to [deploy][10] machine configuration assignments.

> [!IMPORTANT]
> The Terraform provider [azurerm_policy_virtual_machine_configuration_assignment][11] hasn't been
> updated to support the **assignmentType** property so only configurations that perform audits are
> supported.

The following example assigns a custom configuration.

```Terraform
resource "azurerm_virtual_machine_configuration_policy_assignment" "<configuration_name>" {
  name               = "<configuration_name>"
  location           = azurerm_windows_virtual_machine.example.location
  virtual_machine_id = azurerm_windows_virtual_machine.example.id
  configuration {
    name            = "<configuration_name>"
    contentUri      =  '<Url_to_Package.zip>'
    contentHash     =  '<SHA256_hash_of_package.zip>'
    version         = "1.*"
    assignmentType  = "ApplyAndMonitor
  }
}
```

The following example assigns the `AzureWindowBaseline` built-in configuration.

```Terraform
resource "azurerm_virtual_machine_configuration_policy_assignment" "AzureWindowsBaseline" {
  name               = "AzureWindowsBaseline"
  location           = azurerm_windows_virtual_machine.example.location
  virtual_machine_id = azurerm_windows_virtual_machine.example.id
  configuration {
    name    = "AzureWindowsBaseline"
    version = "1.*"
    parameter {
      name  = "Minimum Password Length;ExpectedValue"
      value = "16"
    }
    parameter {
      name  = "Minimum Password Length;RemediateValue"
      value = "16"
    }
    parameter {
      name  = "Minimum Password Age;ExpectedValue"
      value = "75"
    }
    parameter {
      name  = "Minimum Password Age;RemediateValue"
      value = "75"
    }
  }
}
```

## Next steps

- Read the [machine configuration overview][12].
- Set up a custom machine configuration package [development environment][13].
- [Create a package artifact][14] for machine configuration.
- [Test the package artifact][15] from your development environment.
- [Publish the package artifact][03] so it's accessible to your machines.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][02] for at-scale
  management of your environment.
- [Assign your custom policy definition][16] using Azure portal.

<!-- Reference link definitions -->
[01]: ./assignments.md
[02]: ./how-to-create-policy-definition.md
[03]: ./how-to-publish-package.md
[04]: ../policy/samples/built-in-packages.md
[05]: ../../azure-resource-manager/management/extension-resource-types.md
[06]: ../../azure-arc/servers/overview.md
[07]: ../../azure-resource-manager/templates/deployment-tutorial-local-template.md?tabs=azure-powershell
[08]: ../../azure-resource-manager/bicep/overview.md
[09]: https://www.terraform.io/
[10]: /azure/developer/terraform/get-started-windows-powershell
[11]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine_configuration_policy_assignment
[12]: ./overview.md
[13]: ./how-to-set-up-authoring-environment.md
[14]: ./how-to-create-package.md
[15]: ./how-to-test-package.md
[16]: ../policy/assign-policy-portal.md

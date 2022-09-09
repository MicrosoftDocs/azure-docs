---
title: How to create a machine configuration assignment using templates
description: Learn how to deploy configurations to machines directly from Azure Resource Manager.
ms.date: 07/25/2022
ms.topic: how-to
ms.author: timwarner
author: timwarner-msft
ms.service: machine-configuration
---
# How to create a machine configuration assignment using templates

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

The best way to
[assign machine configuration packages](./machine-configuration-assignments.md)
to multiple machines is using
[Azure Policy](./machine-configuration-create-definition.md). You can also
assign machine configuration packages to a single machine.

## Built-in and custom configurations

To assign a machine configuration package to a single machine, modify the following
examples. There are two scenarios.

- Apply a custom configuration to a machine using a link to a package that you
  [published](./machine-configuration-create-publish.md).
- Apply a [built-in](../policy/samples/built-in-packages.md) configuration to a machine,
  such as an Azure baseline.

## Extending other resource types, such as Arc-enabled servers

In each of the following sections, the example includes a **type** property
where the name starts with `Microsoft.Compute/virtualMachines`. The guest
configuration resource provider `Microsoft.GuestConfiguration` is an
[extension resource](../../azure-resource-manager/management/extension-resource-types.md)
that must reference a parent type.

To modify the example for other resource types such as
[Arc-enabled servers](../../azure-arc/servers/overview.md),
change the parent type to the name of the resource provider.
For Arc-enabled servers, the resource provider is
`Microsoft.HybridCompute/machines`.

Replace the following "<>" fields with values specific to you environment:

- **<vm_name>**: Name of the machine resource where the configuration will be applied
- **<configuration_name>**: Name of the configuration to apply
- **<vm_location>**: Azure region where the machine configuration assignment will be created
- **<Url_to_Package.zip>**: For custom content package, an HTTPS link to the .zip file
- **<SHA256_hash_of_package.zip>**: For custom content package, a SHA256 hash of the .zip file

## Assign a configuration using an Azure Resource Manager template

You can deploy an
[Azure Resource Manager template](../../azure-resource-manager/templates/deployment-tutorial-local-template.md?tabs=azure-powershell)
containing machine configuration assignment resources.

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

You can use
[Azure Bicep](../../azure-resource-manager/bicep/overview.md)
to deploy machine configuration assignments.

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

You can use
[Terraform](https://www.terraform.io/)
to
[deploy](/azure/developer/terraform/get-started-windows-powershell)
machine configuration assignments.

> [!IMPORTANT]
> The Terraform provider
> [azurerm_policy_virtual_machine_configuration_assignment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine_configuration_policy_assignment)
> hasn't been updated to support the `assignmentType` property so only
> configurations that perform audits are supported.

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

- Read the [machine configuration overview](./overview.md).
- Setup a custom machine configuration package [development environment](./machine-configuration-create-setup.md).
- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./machine-configuration-create-publish.md)
  so it is accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.

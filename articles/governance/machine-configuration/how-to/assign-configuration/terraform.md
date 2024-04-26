---
title: How to create a machine configuration assignment using Terraform
description: >-
  Learn how to deploy configurations to machines using Terraform
ms.date: 02/01/2024
ms.topic:  how-to
ms.custom: devx-track-terraform
---

# How to create a machine configuration assignment using Terraform

You can use [Terraform][01] to [deploy][02] machine configuration assignments.

> [!IMPORTANT]
> The Terraform provider [azurerm_policy_virtual_machine_configuration_assignment][03] hasn't been
> updated to support the **assignmentType** property so only configurations that perform audits are
> supported.

## Assign a custom configuration

The following example assigns a custom configuration.

Replace the following "<>" fields with values specific to your environment:

- `<configuration_name>`: Specify the name of the configuration to apply.
- `<Url_to_Package.zip>`: Specify an HTTPS link to the `.zip` file for your custom content package.
- `<SHA256_hash_of_package.zip>`: Specify the SHA256 hash of the `.zip` file for your custom
  content package.

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

## Assign a built-in configuration

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

<!-- Link reference definitions -->
[01]: https://www.terraform.io/
[02]: /azure/developer/terraform/get-started-windows-powershell
[03]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine_configuration_policy_assignment

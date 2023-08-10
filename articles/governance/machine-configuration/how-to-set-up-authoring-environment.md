---
title: How to install the machine configuration authoring module
description: Learn how to install the PowerShell module for creating and testing machine configuration policy definitions and assignments.
ms.date: 04/18/2023
ms.topic: how-to
---
# How to set up a machine configuration authoring environment

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

The PowerShell module **GuestConfiguration** automates the process of creating custom content
including:

- Creating a machine configuration content artifact (`.zip`)
- Validating the package meets requirements
- Installing the machine configuration agent locally for testing
- Validating the package can be used to audit settings in a machine
- Validating the package can be used to configure settings in a machine
- Publishing the package to Azure storage
- Creating a policy definition
- Publishing the policy

Support for applying configurations through machine configuration is introduced in version 3.4.2.

### Base requirements

Operating systems where the module can be installed:

- Ubuntu 18
- Windows

The module can be installed on a machine running PowerShell 7.x. Install the versions of PowerShell
listed in the following table for your operating system.

|    OS     |   PowerShell Version   |
| --------- | ---------------------- |
| Windows   | [PowerShell 7.1.3][01] |
| Ubuntu 18 | [PowerShell 7.2.4][02] |

The **GuestConfiguration** module requires the following software:

- Azure PowerShell 5.9.0 or higher. The required Az PowerShell modules are installed automatically
  with the **GuestConfiguration** module, or you can follow [these instructions][03].


### Install the module from the PowerShell Gallery

To install the **GuestConfiguration** module on either Windows or Linux, run the following command
in PowerShell 7.

```powershell
# Install the machine configuration DSC resource module from PowerShell Gallery
Install-Module -Name GuestConfiguration
```

Validate that the module has been imported:

```powershell
# Get a list of commands for the imported GuestConfiguration module
Get-Command -Module 'GuestConfiguration'
```

## Next steps

- [Create a package artifact][04] for machine configuration.
- [Test the package artifact][05] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][06] for at-scale
  management of your environment.
- [Assign your custom policy definition][07] using Azure portal.

<!-- Reference link definitions -->
[01]: https://github.com/PowerShell/PowerShell/releases/tag/v7.1.3
[02]: https://github.com/PowerShell/PowerShell/releases/tag/v7.2.4
[03]: /powershell/azure/install-az-ps
[04]: ./how-to-create-package.md
[05]: ./how-to-test-package.md
[06]: ./how-to-create-policy-definition.md
[07]: ../policy/assign-policy-portal.md

---
title: How to install the machine configuration authoring module
description: Learn how to install the PowerShell module for creating and testing machine configuration policy definitions and assignments.
ms.date: 01/13/2023
ms.topic: how-to
ms.service: machine-configuration
ms.author: timwarner
author: timwarner-msft
---
# How to set up a machine configuration authoring environment

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

The PowerShell module `GuestConfiguration` automates the process of creating
custom content including:

- Creating a machine configuration content artifact (.zip)
- Validating the package meets requirements
- Installing the machine configuration agent locally for testing
- Validating the package can be used to audit settings in a machine
- Validating the package can be used to configure settings in a machine
- Publishing the package to Azure storage
- Creating a policy definition
- Publishing the policy

Support for applying configurations through machine configuration
is introduced in version `3.4.2`.

### Base requirements

Operating systems where the module can be installed:

- Ubuntu 18
- Windows

The module can be installed on a machine running PowerShell 7.x. Install the
versions of PowerShell listed below.

| OS | PowerShell Version |
|-|-|
|Windows|[PowerShell 7.1.3](https://github.com/PowerShell/PowerShell/releases/tag/v7.1.3)|
|Ubuntu 18|[PowerShell 7.2.4](https://github.com/PowerShell/PowerShell/releases/tag/v7.2.4)|

The `GuestConfiguration` module requires the following software:

- Azure PowerShell 5.9.0 or higher. The required Az modules are installed
  automatically with the `GuestConfiguration` module, or you can follow
  [these instructions](/powershell/azure/install-az-ps).


### Install the module from the PowerShell Gallery

To install the `GuestConfiguration` module on either Windows or Linux, run the
following command in PowerShell 7.

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

- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.

---
title: How to install the guest configuration authoring module
description: Learn how to install the PowerShell module for creating and testing guest configuration policy definitions and assignments.
ms.date: 07/22/2021
ms.topic: how-to
---
# How to setup a guest configuration authoring environment

The PowerShell module `GuestConfiguration` automates the process of creating
custom content including:

- Creating a guest configuration content artifact (.zip)
- Validating the package meets requirements
- Installing the guest configuration agent locally for testing
- Validating the package can be used to audit settings in a machine
- Validating the package can be used to configure settings in a machine
- Publishing the package to Azure storage
- Creating a policy definition
- Publishing the policy

Support for applying configurations through guest configuration
is introduced in version `3.4.2`.

> [!IMPORTANT]
> Custom packages that audit the state of an environment are Generally Available,
> but packages that apply configurations are **in preview**. **The following limitations apply:**
> 
> To test creating and applying configurations on Linux, the 
> `GuestConfiguration` module is only available on Ubuntu 18 but the package
> and policy definitions produced by the module can be used on any Linux distro/version
> supported in Azure or Arc.
>
> Testing packages on MacOS isn't available.

### Base requirements

Operating Systems where the module can be installed:

- Ubuntu 18
- Windows

The module can be installed on a machine running PowerShell 7. Install the
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
# Install the guest configuration DSC resource module from PowerShell Gallery
Install-Module -Name GuestConfiguration
```

Validate that the module has been imported:

```powershell
# Get a list of commands for the imported GuestConfiguration module
Get-Command -Module 'GuestConfiguration'
```

## Next steps

- [Create a package artifact](./guest-configuration-create.md)
  for guest configuration.
- [Test the package artifact](./guest-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./guest-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](./determine-non-compliance.md#compliance-details-for-guest-configuration) policy assignments.

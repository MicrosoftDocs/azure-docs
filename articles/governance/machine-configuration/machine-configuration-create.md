---
title: How to create custom machine configuration package artifacts
description: Learn how to create a machine configuration package file.
ms.date: 07/25/2022
ms.topic: how-to
ms.service: machine-configuration
ms.author: timwarner
author: timwarner-msft
---
# How to create custom machine configuration package artifacts

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview page for
[machine configuration](./overview.md).

When auditing / configuring both Windows and Linux, machine configuration uses a
[Desired State Configuration](/powershell/dsc/overview)
(DSC). The DSC configuration defines the condition that the machine should
be in.

> [!IMPORTANT]
> Custom packages that audit the state of an environment are Generally Available,
> but packages that apply configurations are **in preview**. **The following limitations apply:**
>
> To use machine configuration packages that apply configurations, Azure VM guest
> configuration extension version **1.29.24** or later,
> or Arc agent **1.10.0** or later, is required.
>
> To test creating and applying configurations on Linux, the
> `GuestConfiguration` module is only available on Ubuntu 18 but the package
> and policies produced by the module can be used on any Linux distro/version
> supported in Azure or Arc.
>
> Testing packages on MacOS is not available.
>
> Don't use secrets or confidential information in custom content packages.

Use the following steps to create your own configuration for managing the
state of an Azure or non-Azure machine.

## Install PowerShell 7 and required PowerShell modules

First, make sure you've followed all steps on the page
[How to setup a machine configuration authoring environment](./machine-configuration-create-setup.md)
to install the required version of PowerShell for your OS, the
`GuestConfiguration` module, and if needed, the module
`PSDesiredStateConfiguration`.

## Author a configuration

Before creating a configuration package, author and compile a DSC configuration.
If needed, example configurations are available for Windows and Linux.

> [!IMPORTANT]
> When compiling configurations for Windows, use `PSDesiredStateConfiguration`
> version `2.0.5` (the stable release). When compiling configurations for Linux
> install the prerelease version `3.0.0`.

An example is provided in the DSC
[Getting started document](/powershell/dsc/getting-started/wingettingstarted#define-a-configuration-and-generate-the-configuration-document)
for Windows.

For Linux, you'll need to create a custom DSC resource module using
[PowerShell classes](/powershell/dsc/resources/authoringResourceClass).
A full example of a custom resource and configuration is available
(and has been tested with machine configuration) in the PowerShell docs page
[Writing a custom DSC resource with PowerShell classes](/powershell/dsc/resources/authoringResourceClass).

## Create a configuration package artifact

Once the MOF is compiled, the supporting files must be packaged together.
The completed package is used by machine configuration to create the Azure Policy
definitions.

The `New-GuestConfigurationPackage` cmdlet creates the package. Modules that are
needed by the configuration must be in available in `$Env:PSModulePath` for the
development environment so the commands in the module can add them to the
package.

Parameters of the `New-GuestConfigurationPackage` cmdlet when creating Windows
content:

- **Name**: machine configuration package name.
- **Configuration**: Compiled DSC configuration document full path.
- **Path**: Output folder path. This parameter is optional. If not specified,
  the package is created in current directory.
- **Type**: (Audit, AuditandSet) Determines whether the configuration should
  only audit or if the configuration should be applied and change the state of
  the machine. The default is "Audit".

This step doesn't require elevation. The Force cmdlet is used to overwrite
existing packages, if you run the command more than once.

The following commands create a package artifacts:

```powershell
# Create a package that will only audit compliance
New-GuestConfigurationPackage `
  -Name 'MyConfig' `
  -Configuration './Config/MyConfig.mof' `
  -Type Audit `
  -Force
```

```powershell
# Create a package that will audit and apply the configuration (Set)
New-GuestConfigurationPackage `
  -Name 'MyConfig' `
  -Configuration './Config/MyConfig.mof' `
  -Type AuditAndSet `
  -Force
```

An object is returned with the Name and Path of the created package.

```
Name      Path
----      ----
MyConfig  /Users/.../MyConfig/MyConfig.zip
```

### Expected contents of a machine configuration artifact

The completed package is used by machine configuration to create the Azure Policy
definitions. The package consists of:

- The compiled DSC configuration as a MOF
- Modules folder
  - GuestConfiguration module
  - DscNativeResources module
  - DSC resource modules required by the MOF
- A metaconfig file that stores the package `type` and `version`

The PowerShell cmdlet creates the package .zip file. No root level folder or
version folder is required. The package format must be a .zip file and can't
exceed a total size of 100 MB when uncompressed.

## Extending machine configuration with third-party tools

The artifact packages for machine configuration can be extended to include
third-party tools. Extending machine configuration requires development of two
components.

- A Desired State Configuration resource that handles all activity related to
managing the third-party tool
  - Install
  - Invoke
  - Convert output
- Content in the correct format for the tool to natively consume

The DSC resource requires custom development if a community solution doesn't
already exist. Community solutions can be discovered by searching the PowerShell Gallery for tag
[GuestConfiguration](https://www.powershellgallery.com/packages?q=Tags%3A%22GuestConfiguration%22).

> [!NOTE]
> Machine configuration extensibility is a "bring your own
> license" scenario. Ensure you have met the terms and conditions of any third
> party tools before use.

After the DSC resource has been installed in the development environment, use
the **FilesToInclude** parameter for `New-GuestConfigurationPackage` to include
content for the third-party platform in the content artifact.

## Next steps

- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./machine-configuration-create-publish.md)
  so it is accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.


---
title: How to create custom machine configuration package artifacts
description: Learn how to create a machine configuration package file.
ms.date: 08/11/2023
ms.topic: how-to
---
# How to create custom machine configuration package artifacts

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview page for [machine configuration][01].

Machine configuration uses [Desired State Configuration][02] (DSC) when auditing and configuring
both Windows and Linux. The DSC configuration defines the condition that the machine should be in.

> [!IMPORTANT]
> Custom packages that audit the state of an environment and apply configurations are in Generally
> Available (GA) support status. However, the following limitations apply:
>
> To use machine configuration packages that apply configurations, Azure VM guest configuration
> extension version 1.26.24 or later, or Arc agent 1.10.0 or later, is required.
>
> The **GuestConfiguration** module is only available on Ubuntu 18 and later. However, the package
> and policies produced by the module can be used on any Linux distribution and version supported
> in Azure or Arc.
>
> Testing packages on macOS isn't available.
>
> Don't use secrets or confidential information in custom content packages.

Use the following steps to create your own configuration for managing the state of an Azure or
non-Azure machine.

## Install PowerShell 7 and required PowerShell modules

First, follow the steps in [How to set up a machine configuration authoring environment][03]. Those
steps help you to install the required version of PowerShell for your OS, the
**GuestConfiguration** module, and the **PSDesiredStateConfiguration** module.

## Author a configuration

Before you create a configuration package, author and compile a DSC configuration. Example
configurations are available for Windows and Linux.

> [!IMPORTANT]
> When compiling configurations for Windows, use **PSDesiredStateConfiguration** version 2.0.7 (the
> stable release). When compiling configurations for Linux install the prerelease version 3.0.0.

This example configuration is for Windows machines. It configures the machine to create the
`MC_ENV_EXAMPLE` environment variable in the `Process` and `Machine` scopes. The value of the
variable sets to `'This was set by machine configuration'`.

```powershell
Configuration MyConfig {
    Import-DscResource -Name 'Environment' -ModuleName 'PSDscResources'
    Environment MachineConfigurationExample {
        Name   = 'MC_ENV_EXAMPLE'
        Value  = 'This was set by machine configuration'
        Ensure = 'Present'
        Target = @('Process', 'Machine')
    }
}

MyConfig
```

With that definition saved in the `MyConfig.ps1` script file, you can run the script to compile the
configuration.

```powershell
. .\MyConfig.ps1
```

```output
    Directory: C:\dsc\MyConfig

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           5/16/2023 10:39 AM           1080 localhost.mof
```

The configuration is compiled into the `localhost.mof` file in the `MyConfig` folder in the current
working directory. Rename `localhost.mof` to the name you want to use as the package name, such as
`MyConfig.mof`.

```powershell
Rename-Item -Path .\MyConfig\localhost.mof -NewName MyConfig.mof -PassThru
```

```output
    Directory: C:\dsc\MyConfig

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---           5/16/2023 10:40 AM           1080 MyConfig.mof
```

> [!NOTE]
> This example shows how to author and compile a configuration for a Windows machine. For Linux,
> you need to create a custom DSC resource module using [PowerShell classes][05]. The  article
> [Writing a custom DSC resource with PowerShell classes][05] includes a full example of a
> custom resource and configuration, tested with machine configuration.
>
> The rest of this article applies to configurations defined for Linux and Windows machines except
> where it mentions platform-specific considerations.

## Create a configuration package artifact

Once the MOF is compiled, the supporting files must be packaged together. The completed package is
used by machine configuration to create the Azure Policy definitions.

The `New-GuestConfigurationPackage` cmdlet creates the package. Modules required by the
configuration must be in available in `$Env:PSModulePath` for the development environment so the
commands in the module can add them to the package.

Parameters of the `New-GuestConfigurationPackage` cmdlet when creating Windows content:

- **Name**: machine configuration package name.
- **Configuration**: Compiled DSC configuration document full path.
- **Path**: Output folder path. This parameter is optional. If not specified, the package is
  created in current directory.
- **Type**: (`Audit`, `AuditandSet`) Determines whether the configuration should only audit or if
  the configuration should change the state of the machine if it's out of the desired state. The
  default is `Audit`.

This step doesn't require elevation. The **Force** parameter is used to overwrite existing
packages, if you run the command more than once.

The following commands create a package artifact:

```powershell
# Create a package that will only audit compliance
$params = @{
    Name          = 'MyConfig'
    Configuration = './MyConfig/MyConfig.mof'
    Type          = 'Audit'
    Force         = $true
}
New-GuestConfigurationPackage @params
```

```powershell
# Create a package that will audit and apply the configuration (Set)
$params = @{
    Name          = 'MyConfig'
    Configuration = './MyConfig/MyConfig.mof'
    Type          = 'AuditAndSet'
    Force         = $true
}
New-GuestConfigurationPackage @params
```

An object is returned with the **Name** and **Path** of the created package.

```Output
Name     Path
----     ----
MyConfig C:\dsc\MyConfig.zip
```

### Expected contents of a machine configuration artifact

The completed package is used by machine configuration to create the Azure Policy definitions. The
package consists of:

- The compiled DSC configuration as a MOF
- Modules folder
  - **GuestConfiguration** module
  - **DscNativeResources** module
  - DSC resource modules required by the MOF
- A metaconfig file that stores the package `type` and `version`

The PowerShell cmdlet creates the package `.zip` file. No root level folder or version folder is
required. The package format must be a `.zip` file and can't exceed a total size of 100 MB when
uncompressed.

You can expand the archive to inspect it by using the `Expand-Archive` cmdlet.

```powershell
Expand-Archive -Path .\MyConfig.zip -DestinationPath MyConfigZip
```

You can get the total size of the uncompressed package with PowerShell.

```powershell
Get-ChildItem -Recurse -Path .\MyConfigZip |
    Measure-Object -Sum Length |
    ForEach-Object -Process {
        $Size = [math]::Round(($_.Sum / 1MB), 2)
        "$Size MB"
    }
```

## Extending machine configuration with third-party tools

The artifact packages for machine configuration can be extended to include third-party tools.
Extending machine configuration requires development of two components.

- A Desired State Configuration resource that handles all activity related to managing the
  third-party tool
  - Install
  - Invoke
  - Convert output
- Content in the correct format for the tool to natively consume

The DSC resource requires custom development if a community solution doesn't already exist.
Community solutions can be discovered by searching the PowerShell Gallery for tag
[GuestConfiguration][06].

> [!NOTE]
> Machine configuration extensibility is a "bring your own license" scenario. Ensure you have met
> the terms and conditions of any third party tools before use.

After the DSC resource has been installed in the development environment, use the
**FilesToInclude** parameter for `New-GuestConfigurationPackage` to include content for the
third-party platform in the content artifact.

## Next steps

- [Test the package artifact][07] from your development environment.
- [Publish the package artifact][08] so it's accessible to your machines.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][09] for at-scale
  management of your environment.
- [Assign your custom policy definition][10] using Azure portal.

<!-- Reference link definitions -->
[01]: ./overview.md
[02]: /powershell/dsc/overview
[03]: ./how-to-set-up-authoring-environment.md
[04]: /powershell/dsc/getting-started/wingettingstarted#define-a-configuration-and-generate-the-configuration-document
[05]: /powershell/dsc/resources/authoringResourceClass
[06]: https://www.powershellgallery.com/packages?q=Tags%3A%22GuestConfiguration%22
[07]: ./how-to-test-package.md
[08]: ./how-to-publish-package.md
[09]: ./how-to-create-policy-definition.md
[10]: ../policy/assign-policy-portal.md

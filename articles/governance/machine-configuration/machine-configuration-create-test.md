---
title: How to test machine configuration package artifacts
description: The experience creating and testing packages that audit or apply configurations to machines.
ms.date: 07/25/2022
ms.topic: how-to
ms.service: machine-configuration
ms.author: timwarner
author: timwarner-msft
---
# How to test machine configuration package artifacts

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

The PowerShell module `GuestConfiguration` includes tools to automate
testing a configuration package outside of Azure. Use these tools to find issues
and iterate quickly before moving on to test in an Azure or Arc connected
environment.

Before you can begin testing, follow all steps in the page
[How to setup a machine configuration authoring environment](./machine-configuration-create-setup.md)
and then
[How to create custom machine configuration package artifacts](./machine-configuration-create.md)
to create and publish a custom machine configuration package.

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

You can test the package from your workstation or continuous integration and
continuous deployment (CI/CD) environment.  The `GuestConfiguration` module
includes the same agent for your development environment as is used inside Azure
or Arc enabled machines. The agent includes a stand-alone instance of PowerShell
7.1.3 for Windows and 7.2.0-preview.7 for Linux, so the script environment where
the package is tested will be consistent with machines you manage using guest
configuration.

The agent service in Azure and Arc-enabled machines is running as the
"LocalSystem" account in Windows and "Root" in Linux. Run the commands below in
privileged security context for best results.

To run PowerShell as "LocalSystem" in Windows, use the SysInternals tool
[PSExec](/sysinternals/downloads/psexec).

To run PowerShell as "Root" in Linux, use the
[Su command](https://manpages.ubuntu.com/manpages/man1/su.1.html).

## Validate the configuration package meets requirements

First test that the configuration package meets basic requirements using
`Get-GuestConfigurationPackageComplianceStatus `. The command verifies the
following package requirements.

- MOF is present and valid, at the right location
- Required Modules/dependencies are present with the right version, without
  duplicates
- Validate the package is signed (optional)
- Test that `Test` and `Get` return information about the compliance status

Parameters of the `Get-GuestConfigurationPackageComplianceStatus ` cmdlet:

- **Path**: File path or URI of the machine configuration package.
- **Parameter**: Policy parameters provided in hashtable format.

When this command is run for the first time, the machine configuration agent gets
installed on the test machine at the path `c:\programdata\GuestConfig\bin` on
Windows and `/var/lib/GuestConfig/bin` on Linux. This path isn't accessible to
a user account so the command requires elevation.

Run the following command to test the package:

In Windows, from an elevated PowerShell 7 session.

```powershell
# Get the current compliance results for the local machine
Get-GuestConfigurationPackageComplianceStatus -Path ./MyConfig.zip
```

In Linux, by running PowerShell using sudo.

```bash
# Get the current compliance results for the local machine
sudo pwsh -command 'Get-GuestConfigurationPackageComplianceStatus -Path ./MyConfig.zip'
```

The command outputs an object containing the compliance status and details
per resource.

```powershell
  complianceStatus  resources
  ----------------  ---------
  True              @{BuiltInAccount=localSystem; ConfigurationName=MyConfig; Credential=; Dependencies=System.Obje…
```

#### Test the configuration package can apply a configuration

Finally, if the configuration package mode is `AuditandSet` you can test that
the `Set` method can apply settings to a local machine using the command
`Start-GuestConfigurationPackageRemediation`.

> [!IMPORTANT]
> This command attempts to make changes in the local environment where
> it's run.

Parameters of the `Start-GuestConfigurationPackageRemediation` cmdlet:

- **Path**: Full path of the machine configuration package.

In Windows, from an elevated PowerShell 7 session.

```powershell
# Test applying the configuration to local machine
Start-GuestConfigurationPackageRemediation -Path ./MyConfig.zip
```

In Linux, by running PowerShell using sudo.

```bash
# Test applying the configuration to local machine
sudo pwsh -command 'Start-GuestConfigurationPackageRemediation -Path ./MyConfig.zip'
```

The command won't return output unless errors occur. To troubleshoot details
about events occurring during `Set`, use the `-verbose` parameter.

After running the command `Start-GuestConfigurationPackageRemediation`, you can
run the command `Get-GuestConfigurationComplianceStatus` again to confirm the
machine is now in the correct state.

## Next steps

- [Publish the package artifact](./machine-configuration-create-publish.md)
  so it is accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for machine configuration](../policy/how-to/determine-non-compliance.md) policy assignments.

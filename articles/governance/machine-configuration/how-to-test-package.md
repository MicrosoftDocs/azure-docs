---
title: How to test machine configuration package artifacts
description: The experience creating and testing packages that audit or apply configurations to machines.
ms.date: 04/18/2023
ms.topic: how-to
---
# How to test machine configuration package artifacts

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

The PowerShell module **GuestConfiguration** includes tools to automate testing a configuration
package outside of Azure. Use these tools to find issues and iterate quickly before moving on to
test in an Azure or Arc connected environment.

Before you can begin testing, you need to [set up your authoring environment][01] and
[create a custom machine configuration package artifact][02].

> [!IMPORTANT]
> Custom packages that audit the state of an environment and apply configurations are in Generally
> Available (GA) support status. However, the following limitations apply:
>
> To use machine configuration packages that apply configurations, Azure VM guest configuration
> extension version 1.26.24 or later, or Arc agent 1.10.0 or later, is required.
>
> The **GuestConfiguration** module is only available on Ubuntu 18. However, the package and
> policies produced by the module can be used on any Linux distro/version supported in Azure or
> Arc.
>
> Testing packages on macOS isn't available.

You can test the package from your workstation or continuous integration and continuous deployment
(CI/CD) environment. The **GuestConfiguration** module includes the same agent for your development
environment as is used inside Azure or Arc enabled machines. The agent includes a stand-alone
instance of PowerShell 7.1.3 for Windows and 7.2.0-preview.7 for Linux. The stand-alone instance
ensures the script environment where the package is tested is consistent with machines you manage
using machine configuration.

The agent service in Azure and Arc-enabled machines is running as the `LocalSystem` account in
Windows and Root in Linux. Run the commands in this article in a privileged security context for
best results.

To run PowerShell as `LocalSystem` in Windows, use the SysInternals tool [PSExec][03].

To run PowerShell as Root in Linux, use the [sudo command][04].

## Validate the configuration package meets requirements

First test that the configuration package meets basic requirements using
`Get-GuestConfigurationPackageComplianceStatus`. The command verifies the following package
requirements.

- MOF is present and valid, at the right location
- Required Modules/dependencies are present with the right version, without duplicates
- Validate the package is signed (optional)
- Test that `Test` and `Get` return information about the compliance status

Parameters of the `Get-GuestConfigurationPackageComplianceStatus` cmdlet:

- **Path**: File path or URI of the machine configuration package.
- **Parameter**: Policy parameters provided as a  hash table.

When this command is run for the first time, the machine configuration agent gets installed on the
test machine at the path `C:\ProgramData\GuestConfig\bin` on Windows and `/var/lib/GuestConfig/bin`
on Linux. This path isn't accessible to a user account so the command requires elevation.

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

The command outputs an object containing the compliance status and details per resource.

```Output
  complianceStatus  resources
  ----------------  ---------
  True              @{BuiltInAccount=localSystem; ConfigurationName=MyConfig; …
```

#### Test the configuration package can apply a configuration

Finally, if the configuration package mode is `AuditandSet` you can test that the `Set` method can
apply settings to a local machine using the command `Start-GuestConfigurationPackageRemediation`.

> [!IMPORTANT]
> This command attempts to make changes in the local environment where it's run.

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

The command only returns output when errors occur. To troubleshoot details about events occurring
during `Set`, use the `-verbose` parameter.

After running the command `Start-GuestConfigurationPackageRemediation`, you can run the command
`Get-GuestConfigurationComplianceStatus` again to confirm the machine is now in the correct state.

## Next steps

- Use the **GuestConfiguration** module to [create an Azure Policy definition][06] for at-scale
  management of your environment.
- [Assign your custom policy definition][07] using Azure portal.
- Learn how to view [compliance details for machine configuration][08] policy assignments.

<!-- Reference link definitions -->
[01]: ./how-to-set-up-authoring-environment.md
[02]: ./how-to-create-package.md
[03]: /sysinternals/downloads/psexec
[04]: https://www.sudo.ws/docs/man/sudo.man/
[05]: ./how-to-publish-package.md
[06]: ./how-to-create-policy-definition.md
[07]: ../policy/assign-policy-portal.md
[08]: ../policy/how-to/determine-non-compliance.md

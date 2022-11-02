---
title: Changes to behavior in PowerShell Desired State Configuration for machine configuration
description: This article describes the platform used to deliver configuration changes to machines through Azure Policy.
author: timwarner-msft
ms.date: 07/15/2022
ms.topic: how-to
ms.author: timwarner
ms.service: machine-configuration
---
# Changes to behavior in PowerShell Desired State Configuration for machine configuration

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview of
[machine configuration](./overview.md).

[A video walk-through of this document is available](https://youtu.be/nYd55FiKpgs).

Machine configuration uses
[Desired State Configuration (DSC)](/powershell/dsc/overview)
version 3 to audit and configure machines. The DSC configuration defines the
state that the machine should be in. There's many notable differences in how
DSC is implemented in machine configuration.

## Machine configuration uses PowerShell 7 cross platform

Machine configuration is designed so the experience of managing Windows and Linux
can be consistent. Across both operating system environments, someone with
PowerShell DSC knowledge can create and publish configurations using scripting
skills.

Machine configuration only uses PowerShell DSC version 3 and doesn't rely on the
previous implementation of
[DSC for Linux](https://github.com/Microsoft/PowerShell-DSC-for-Linux)
or the "nx" providers included in that repository.

As of version 1.29.33, machine configuration operates in PowerShell 7.1.2 for Windows and PowerShell 7.2
preview 6 for Linux. Starting with version 7.2, the `PSDesiredStateConfiguration`
module moved from being part of the PowerShell installation and is instead
installed as a
[module from the PowerShell Gallery](https://www.powershellgallery.com/packages/PSDesiredStateConfiguration).

## Multiple configurations

Machine configuration supports assigning multiple configurations to
the same machine. There's no special steps required within the
operating system of machine configuration extension. There's no need to configure
[partial configurations](/powershell/dsc/pull-server/partialConfigs).

## Dependencies are managed per-configuration

When a configuration is
[packaged using the available tools](./machine-configuration-create.md),
the required dependencies for the configuration are included in a .zip file.
Machines extract the contents into a unique folder for each configuration.
The agent delivered by the machine configuration extension creates a dedicated
PowerShell session for each configuration, using a `$Env:PSModulePath` that
limits automatic module loading to only the path where the package was
extracted.

Multiple benefits result from this change.

- It's possible to use different module versions for each configuration, on
  the same machine.
- When a configuration is no longer needed on a machine, the entire folder
  where it was extracted is safely deleted by the agent without the need to
  manage shared dependencies across configurations.
- It's not required to manage multiple versions of any module in a central
  service.

## Artifacts are managed as packages

The Azure Automation State Configuration feature includes artifact management
for modules and configuration scripts. Once both are published in to the service,
the script can be compiled to MOF format. Similarly, Windows Pull Server also required
managing configurations and modules at the web service instance. By contrast, the
DSC extension has a simplified model where all artifacts are packaged together
and stored in a location accessible from the target machine using an HTTPS request
(Azure Blob Storage is the popular option).

Machine configuration only uses the simplified model where all artifacts
are packaged together and accessed from the target machine over HTTPS.
There's no need to publish modules, scripts, or compile in the service. One
change is that the package should always include a compiled MOF. It is
not possible to include a script file in the package and compile
on the target machine.

## Maximum size of custom configuration package

In Azure Automation state configuration, DSC configurations were
[limited in size](../../automation/automation-dsc-compile.md#compile-your-dsc-configuration-in-windows-powershell).
Machine configuration supports a total package size of 100 MB (before
compression). There's no specific limit on the size of the MOF file within
the package.

## Configuration mode is set in the package artifact

When creating the configuration package, the mode is set using the following
options:

- _Audit_: Verifies the compliance of a machine. No changes are made.
- _AuditandSet_: Verifies and Remediates the compliance state of the machine.
  Changes are made if the machine isn't compliant.

The mode is set in the package rather than in the
[Local Configuration Manager](/powershell/dsc/managing-nodes/metaConfig#basic-settings)
service because it can be different per configuration, when multiple
configurations are assigned.

## Parameter support through Azure Resource Manager

Parameters set by the `configurationParameter` property array in
[machine configuration assignments](machine-configuration-assignments.md)
overwrite the static text within a configuration MOF file when the file is
stored on a machine. Parameters allow for customization and changes to be controlled
by an operator from the service API without needing to run commands within
the machine.

Parameters in Azure Policy that pass values to machine configuration
assignments must be _string_ type. It isn't possible to pass arrays through
parameters, even if the DSC resource supports arrays.

## Trigger Set from outside machine

A challenge in previous versions of DSC has been correcting drift at scale
without much custom code and reliance on WinRM remote connections. Guest
configuration solves this problem. Users of machine configuration have control
over drift correction through
[Remediation On Demand](./machine-configuration-policy-effects.md#remediation-on-demand-applyandmonitor).

## Sequence includes Get method

When machine configuration audits or configures a machine the same
sequence of events is used for both Windows and Linux. The notable change in
behavior is the `Get` method is called by the service to return details about
the state of the machine.

1. The agent first runs `Test` to determine whether the configuration is in the
   correct state.
1. If the package is set to `Audit`, the Boolean value returned by the function
   determines
   if the Azure Resource Manager status for the Guest Assignment should be
   Compliant/Not-Compliant.
1. If the package is set to `AuditandSet`, the Boolean value determines whether
   to remediate the machine by applying the configuration using the `Set` method.
   If the `Test` method returns False, `Set` is run. If `Test` returns True, then
   `Set` isn't run.
1. Last, the provider runs `Get` to return the current state of each setting so
   details are available both about why a machine isn't compliant and to confirm
   that the current state is compliant.

## Special requirements for Get

The function `Get` method has special requirements for Azure Policy guest
configuration that haven't been needed for Windows PowerShell Desired State
Configuration.

- The hashtable that is returned should include a property named **Reasons**.
- The Reasons property must be an array.
- Each item in the array should be a hashtable with keys named **Code** and
  **Phrase**.
- No other values other than the hashtable should be returned.

The Reasons property is used by the service to standardize how compliance
information is presented. You can think of each item in Reasons as a "reason"
that the resource is or isn't compliant. The property is an array because a
resource could be out of compliance for more than one reason.

The properties **Code** and **Phrase** are expected by the service. When
authoring a custom resource, set the text (typically stdout) you would like to
show as the reason the resource isn't compliant as the value for **Phrase**.
**Code** has specific formatting requirements so reporting can clearly display
information about the resource used to do the audit. This solution makes guest
configuration extensible. Any command could be run as long as the output can be
returned as a string value for the **Phrase** property.

- **Code** (string): The name of the resource, repeated, and then a short name
  with no spaces as an identifier for the reason. These three values should be
  colon-delimited with no spaces.
  - An example would be `registry:registry:keynotpresent`
- **Phrase** (string): Human-readable text to explain why the setting isn't
  compliant.
  - An example would be `The registry key $key isn't present on the machine.`

```powershell
$reasons = @()
$reasons += @{
  Code = 'Name:Name:ReasonIdentifer'
  Phrase = 'Explain why the setting is not compliant'
}
return @{
    reasons = $reasons
}
```

When using commandline tools to get information that will return in Get, you
might find the tool returns output you didn't expect. Even though you capture
the output in PowerShell, output might also have been written to
standard error. To avoid this issue, consider redirecting
output to null.

### The Reasons property embedded class

In script-based resources (Windows only), the Reasons class is included in the
schema MOF file as follows.

```mof
[ClassVersion("1.0.0.0")]
class Reason
{
  [Read] String Phrase;
  [Read] String Code;
};

[ClassVersion("1.0.0.0"), FriendlyName("ResourceName")]
class ResourceName : OMI_BaseResource
{
  [Key, Description("Example description")] String Example;
  [Read, EmbeddedInstance("Reason")] String Reasons[];
};
```

In class-based resources (Windows and Linux), the `Reason` class is included in
the PowerShell module as follows. Linux is case-sensitive, so the "C" in Code
and "P" in Phrase must be capitalized.

```powershell
enum ensure {
  Absent
  Present
}

class Reason {
  [DscProperty()]
  [string] $Code

  [DscProperty()]
  [string] $Phrase
}

[DscResource()]
class Example {

  [DscProperty(Key)]
  [ensure] $ensure

  [DscProperty()]
  [Reason[]] $Reasons

  [Example] Get() {
    # return current current state
  }

  [void] Set() {
    # set the state
  }

  [bool] Test() {
    # check whether state is correct
  }
}

```

If the resource has required properties, those properties should also be
returned by `Get` in parallel with the `Reason` class. If `Reason` isn't
included, the service includes a "catch-all" behavior that compares the values
input to `Get` and the values returned by `Get`, and provides a detailed
comparison as `Reason`.

## Configuration names

The name of the custom configuration must be consistent everywhere. The name of
the `.zip` file for the content package, the configuration name in the MOF file,
and the guest assignment name in the Azure Resource Manager template, must be
the same.

## Running commands in Windows PowerShell

Running Windows modules in PowerShell can be achieved through using the below pattern in your DSC resources. The below pattern temporarily sets the `PSModulePath` to run Windows PowerShell instead of PowerShell core in order to discover required modules available in Windows PowerShell. This sample is a snippet from the DSC resource used in the [Secure Web Server](https://github.com/Azure/azure-policy/blob/master/samples/GuestConfiguration/package-samples/resource-modules/SecureProtocolWebServer/DSCResources/SecureWebServer/SecureWebServer.psm1#L253) built-in DSC resource.

This pattern temporarily sets the PowerShell execution path to run from full PowerShell and discovers the required cmdlet which in this case is `Get-WindowsFeature`. The output of the command is returned and then standardized for compatability requirements. Once the cmdlet has been executed, the `PSModulePath` is set back to the original path.

```powershell

    # This command needs to be run through full PowerShell rather than through PowerShell Core which is what the Policy engine runs
    $null = Invoke-Command -ScriptBlock {
        param ($fileName)
        $fullPowerShellExePath = "$env:SystemRoot\System32\WindowsPowershell\v1.0\powershell.exe"
        $oldPSModulePath = $env:PSModulePath
        try
        {
            # Set env variable to full powershell module path so that powershell can discover Get-WindowsFeature cmdlet.
            $env:PSModulePath = "$env:SystemRoot\System32\WindowsPowershell\v1.0\Modules"
            &$fullPowerShellExePath -command "if (Get-Command 'Get-WindowsFeature' -errorAction SilentlyContinue){Get-WindowsFeature -Name Web-Server | ConvertTo-Json | Out-File $fileName} else { Add-Content -Path $fileName -Value 'NotServer'}"
        }
        finally
        {
            $env:PSModulePath = $oldPSModulePath
        }
    }

```

## Common DSC features not available during machine configuration public preview

During public preview, machine configuration doesn't support
[specifying cross-machine dependencies](/powershell/dsc/configurations/crossnodedependencies)
using "WaitFor*" resources. It isn't possible for one
machine to monitor and wait for another machine to reach a state before
progressing.

[Reboot handling](/powershell/dsc/configurations/reboot-a-node) isn't
available in the public preview release of machine configuration, including,
the `$global:DSCMachineStatus` isn't available. Configurations aren't able to reboot a node during or at the end of a configuration.

## Known compatibility issues with supported modules

The `PsDscResources` module in the PowerShell Gallery and the `PSDesiredStateConfiguration`
module that ships with Windows are supported by Microsoft and have been a commonly used
set of resources for DSC. Until the `PSDscResources` module is updated for DSCv3, be aware of the
following known compatibility issues.

- Don't use resources from the `PSDesiredStateConfiguration` module that ships with Windows. Instead,
  switch to `PSDscResources`.
- Don't use the `WindowsFeature`, `WindowsFeatureSet`, `WindowsOptionalFeature`, and
  `WindowsOptionalFeatureSet` resources in `PsDscResources`. There's a known
  issue loading the `DISM` module in PowerShell 7.1.3 on Windows Server,
  that will require an update.

The "nx" resources for Linux that were included in the
[DSC for Linux](https://github.com/microsoft/PowerShell-DSC-for-Linux/tree/master/Providers)
repo were written in a combination of the languages C and Python. Because the path
forward for DSC on Linux is to use PowerShell, the existing "nx" resources
aren't compatible with DSCv3. Until a new module containing supported resources for Linux
is available, it's required to author custom resources.

## Coexistence with DSC version 3 and previous versions

DSC version 3 in machine configuration can coexist with older versions installed in
[Windows](/powershell/dsc/getting-started/wingettingstarted) and
[Linux](/powershell/dsc/getting-started/lnxgettingstarted).
The implementations are separate. However, there's no conflict detection
across DSC versions, so don't attempt to manage the same settings.

## Next steps

- Read the [machine configuration overview](./overview.md).
- Setup a custom machine configuration package [development environment](./machine-configuration-create-setup.md).
- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for machine configuration](../policy/how-to/determine-non-compliance.md) policy assignments.

---
title: Planning a change from Desired State Configuration extension to guest configuration
description: Guidance for moving from Desired State Configuration extension to the guest configuration feature of Azure Policy.
ms.date: 01/28/2022
ms.topic: how-to
---
# Planning a change from Desired State Configuration extension to guest configuration

Guest configuration is the latest implementation of functionality that has been provided by the
PowerShell Desired State Configuration (DSC) extension for virtual machines in Azure. When possible,
you should plan to move your content and machines to the new service. This article provides guidance
on developing a migration strategy,

New features in guest configuration:

- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs
- Linux and Windows both consume PowerShell-based DSC resources

Before you begin, it's a good idea to read the conceptual overview information at the page
[Azure Policy's guest configuration](../concepts/guest-configuration.md).

## Major differences

Configurations are deployed through DSC extension in a "push" model, where the operation is
completed asynchronously. The deployment doesn't return until the configuration has finished
running inside the virtual machine. After deployment, no further information is returned to ARM.
The monitoring and drift are managed within the machine.

Guest configuration processes configurations in a "pull" model. The extension is
deployed to a virtual machine and then jobs are executed based on guest assignment details. it's
not possible to view the status while the configuration in real time as it's being applied inside
the machine. it's possible to monitor and correct drift from Azure Resource Manager (ARM) after the
configuration is applied.

The .zip packages used by DSC Extension and guest configuration are similar. Both contain a
configuration and required dependencies. However, with DSC extension most content packages contained
the configuration as a PowerShell script. For guest configuration,
**the configuration must be compiled to Managed Object Format (MOF) before the package is created**.
Compiling before packaging means that it isn't possible to perform custom script tasks from a
configuration script. Any logic that changes behavior based on machine state must be implemented in
DSC resources.

Other major differences:

- **Reboots** - while DSC in Windows PowerShell was able to manage reboots,
  reboot management hasn't yet been implemented for guest configuration.
- **Secrets** - The DSC extension included "privateSettings" where secrets
  could be passed to the configuration such as passwords or shared keys.
  Secrets management hasn't yet been implemented for guest configuration.

### Considerations for whether to migrate existing machines or only new machines

Guest configuration uses DSC version 3 with PowerShell version 7. DSC version 3 can coexist with
older versions of DSC in
[Windows](/powershell/dsc/getting-started/wingettingstarted.md) and
[Linux](/powershell/dsc/getting-started/lnxgettingstarted.md).
The implementations are separate. However, there's no conflict detection.

For machines that will only exist for days or weeks, update the deployment templates and switch from
DSC extension to guest configuration. After testing, use the updated templates to build future
machines.

If a machine is planned to exist for months or years, you might choose to change which configuration
features of Azure manage the machine, to take advantage of new features.

it isn't advised to have both platforms manage the same configuration.

## Understand migration

The best approach to migration is to recreate, test, and redeploy content first, and then use the
new solution for new machines.

The expected steps for migration are:

- Download and expand the .zip package used for DSC extension
- Compile the configuration to Managed Object Format (MOF)
- Use the guest configuration authoring module to create, test, and publish a new package
- Use guest configuration for future deployments rather than DSC extension

#### Consider decomposing complex configuration files

Guest configuration can manage multiple configurations per machine. Many configurations written for
DSC extension assumed the limitation of managing a single configuration per
machine. To take advantage of the expanded capabilities offered by guest configuration, large
configuration files can be divided into many smaller configurations where each handles a specific
scenario.

There's no orchestration in guest configuration to control the order of how configurations are
sorted. Keep steps in a configuration together in one package if they're required to happen
sequentially.

### Test content in Azure guest configuration

Read the page
[How to create custom guest configuration package artifacts](./guest-configuration-create.md).
to evaluate whether your content from DSC extension can be used with guest configuration.

When you reach the step
[Author a configuration](./guest-configuration-create.md#author-a-configuration),
use the configuration script from the DSC extension package to compile a new MOF file. You must have
the required PowerShell modules installed before you can compile the configuration and create a
guest configuration package.

#### Update deployment templates

If your deployment templates include the DSC extension
(see [examples](../../virtual-machines/extensions/dsc-template)),
there are two changes required.

First, replace the DSC extension with the
[extension for the guest configuration feature](../../virtual-machines/extensions/guest-configuration).

Then, add 

#### What if a module doesn't work with guest configuration?

Some modules might encounter compatibility issues with guest configuration. The most common problems
are related to .NET framework vs .NET core. Detailed technical information is available on the page,
[Differences between Windows PowerShell 5.1 and PowerShell (core) 7.x](/powershell/scripting/whats-new/differences-from-windows-powershell)

One option to resolve compatibility issues is to run commands in Windows PowerShell from within a
module that is imported in PowerShell 7, by running `powershell.exe`. You can review a sample module
in the Azure-Policy repo that audits
[Windows DSC Configuration](https://github.com/Azure/azure-policy/blob/bbfc60104c2c5b7fa6dd5b784b5d4713ddd55218/samples/GuestConfiguration/package-samples/resource-modules/WindowsDscConfiguration/DscResources/WindowsDscConfiguration/WindowsDscConfiguration.psm1#L97).

The example also illustrates a small proof of concept.

```powershell
# example function that could be loaded from module
function New-TaskResolvedInPWSH7 {
  # runs the fictitious command 'Get-myNotCompatibleCommand' in Windows PowerShell
  $compatObject = & powershell.exe -noprofile -NonInteractive -command { Get-myNotCompatibleCommand }
  # resulting object can be used in PowerShell 7
  return $compatObject
}
```

#### Will I have to add "Reasons" property to Get-TargetResource in all modules I migrate?

Implementing the
["Reasons" property](../concepts/guest-configuration-custom.md#special-requirements-for-get)
provides a better experience when viewing the results of a configuration assignment from the Azure
Portal. If the `Get` method in a module doesn't include "Reasons", generic output is returned with
details from the properties returned by the `Get` method. Therefore, it's optional for migration.

### Removing a configuration the was assigned in Windows/Linux by DSC extension

In previous versions of DSC, the DSC extension assigned a configuration through the Local
Configuration Manager in Windows and Linux. It's recommended to remove the DSC extension and reset
LCM.

> NOTE
> Removing a configuration in Local Configuration Manager doesn't "roll back"
> the settings in Windows or Linux that were set by the configuration. The
> action of removing the configuration only causes the LCM to stop managing
> the assigned configuration. The settings remain in place.

To remove a configuration in Windows, use the `Remove-DscConfigurationDocument` command as
documented in
[Manage Configuration Documents](/powershell/dsc/managing-nodes/apply-get-test?view=dsc-1.1&preserve-view=true#manage-configuration-documents).

For Linux, use the `Remove.py` script as documented in
[Performing DSC Operations from the Linux Computer](https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer)

## Next steps

- [Create a package artifact](./guest-configuration-create.md)
  for guest configuration.
- [Test the package artifact](./guest-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./guest-configuration-create-publish.md)
  so it's accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./guest-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](./determine-non-compliance.md#compliance-details-for-guest-configuration) assignments.

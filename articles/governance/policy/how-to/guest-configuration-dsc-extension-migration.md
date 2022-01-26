---
title: DSC extension to guest configuration migration planning
description: This article provides process and technical guidance for customers interested in moving from DSC extension to the guest configuration feature of Azure Policy.
ms.date: 01/25/2022
ms.topic: how-to
---
# DSC extension to guest configuration migration planning

Guest configuration is the latest implementation of functionality
that has been provided by the PowerShell Desired State Configuration (DSC)
extension for virtual machines in Azure. When possible, you should plan to
move your content and machines to the new service.
This article provides guidance on developing a migration strategy,

New features in guest configuration address top asks from customers:

- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs
- Linux and Windows both consume PowerShell-based DSC resources

Before you begin, it's a good idea to read the conceptual overview
information at the page
[Azure Policy's guest configuration](../concepts/guest-configuration.md).

## Major differences

Configurations are deployed through DSC extension in a "push" model,
where the operation is completed asynchronously. The deployment
does not return until the configuration has finished running inside
the virtual machine. After deployment, no further information is
returned to ARM. The monitoring and drift are managed within the
machine.

By contrast, guest configuration processes configurations in a "pull"
model. The extension is deployed to a virtual machine and then
jobs are executed based on guest assignment details. It is not
possible to view the status of a deployment, but the status
of the configuration is reported so it is possible to monitor
and correct drift from Azure Resource Manager (ARM).

The .zip packages used by DSC Extension and guest configuration are
similar. Both contain a configuration and required dependencies.
However, with DSC extension most content packages contained the configuration
as a PowerShell script. For guest configuration, **the configuration
must be compiled to MOF before the package is created**. Compiling
before packaging means that it is not possible to perform custom
script tasks from a configuration script. Any logic that changes
behavior based on machine state must be implemented in DSC resources.

Other major differences:

- **Reboots** - while DSC in Windows PowerShell was able to manage reboots,
  reboot management has not yet been implemented for guest configuration.
- **Secrets** - The DSC extension included "privateSettings" where secrets
  could be passed to the configuration such as passwords or shared keys.
  Secrets management has not yet been implemented for guest configuration.

### Considerations for whether to migrate existing machines or only new machines

Guest configuration uses DSC version 3 with PowerShell version 7.
DSC version 3 can coexist with older versions of DSC in
[Windows](/powershell/dsc/getting-started/wingettingstarted) and
[Linux](/powershell/dsc/getting-started/lnxgettingstarted).
The implementations are separate. However, there's no conflict detection.

For machines that will only exist for days or weeks, it will usually make more sense
to change the deployment templates used to build future machines than
to attempt migrating between DSC extension and the guest configuration feature.

If a machine is planned to exist for months or years, it could make sense to
shift the configuration from DSC extension to guest configuration. It is not advised
to have both platforms manage the same configuration.

## Understand migration

The best approach to migration is to recreate, test, and redeploy content first,
and then use the new solution for new machines.

The expected steps for migration are:

- Download and expand the .zip package used for DSC extension
- Compile the configuration to MOF
- Use the guest configuration authoring module to create, test, and publish a new package
- Use guest configuration for future deployments rather than DSC extension

#### Consider decomposing complex configuration files

Guest configuration can manage multiple configurations per machine.
Many configurations written for Azure Automation State Configuration assumed the
limitation of managing a single configuration per machine. To take advantage of
the expanded capabilities offered by guest configuration, large
configuration files can be divided into many smaller configurations where each
handles a specific scenario.

There is no orchestration in guest configuration to control the order of how
configurations are sorted, so keep steps in a configuration together in one
package if they are required to happen sequentially.

### Test content in Azure guest configuration

The best way to evaluate whether your content from Azure Automation State
Configuration can be used with guest configuration is to follow
the step-by-step tutorial in the page
[How to create custom guest configuration package artifacts](./guest-configuration-create.md).

When you reach the step
[Author a configuration](./guest-configuration-create.md#author-a-configuration),
the configuration script that generates a MOF file should be one of the scripts
you exported from Azure Automation State Configuration. You must have the
required PowerShell modules installed in your environment before you can compile
the configuration to a MOF file and create a guest configuration package.

#### What if a module does not work with guest configuration?

Some modules might encounter compatibility issues with guest configuration. The
most common problems are related to .NET framework vs .NET core. Detailed
technical information is available on the page,
[Differences between Windows PowerShell 5.1 and PowerShell (core) 7.x](/powershell/scripting/whats-new/differences-from-windows-powershell)

One option to resolve compatibility issues is to run commands in Windows PowerShell
from within a module that is imported in PowerShell 7, by running `powershell.exe`.
You can review a sample module that uses this technique in the Azure-Policy repo
where it is used to audit the state of
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
provides a better experience when viewing
the results of a configuration assignment from the Azure Portal. If the `Get`
method in a module doesn't include "Reasons", generic output is returned
with details from the properties returned by the `Get` method. Therefore,
it's optional for migration.

### Removing a configuration the was assigned in Windows/Linux by DSC extension

In previous versions of DSC, the DSC extension assigned a configuration
through the Local Configuration Manager in Windows and Linux. If you
intend to start managing the configuration use the guest configuration feature,
it is recommended to remove the assigned configuration from DSC extension.

> NOTE
> Removing a configuration in Local Configuration Manager does not "roll back"
> the settings in Windows or Linux that were set by the configuration. The
> action of removing the configuration only causes the LCM to stop managing
> the assigned configuration. The settings remain in place.

To remove a configuration in Windows, use the `Remove-DscConfigurationDocument`
command as documented in
[Manage Configuration Documents](/powershell/dsc/managing-nodes/apply-get-test?view=dsc-1.1&preserve-view=true#manage-configuration-documents).

For Linux, use the `Remove.py` script as documented in
[Performing DSC Operations from the Linux Computer](https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer)

## Next steps

- [Create a package artifact](./guest-configuration-create.md)
  for guest configuration.
- [Test the package artifact](./guest-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./guest-configuration-create-publish.md)
  so it is accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./guest-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](./determine-non-compliance.md#compliance-details-for-guest-configuration) policy assignments.

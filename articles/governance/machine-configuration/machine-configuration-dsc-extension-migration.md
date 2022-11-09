---
title: Planning a change from Desired State Configuration extension for Linux to machine configuration
description: Guidance for moving from Desired State Configuration extension to the machine configuration feature of Azure Policy.
ms.date: 07/25/2022
ms.topic: how-to
ms.service: machine-configuration
ms.author: timwarner
author: timwarner-msft
---
# Planning a change from Desired State Configuration extension for Linux to machine configuration

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Machine configuration is the latest implementation of functionality that has been provided by the
PowerShell Desired State Configuration (DSC) extension for Linux virtual machines in Azure. When possible,
you should plan to move your content and machines to the new service. This article provides guidance
on developing a migration strategy.

New features in machine configuration:

- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs
- Linux machines consume PowerShell-based DSC resources

Before you begin, it's a good idea to read the conceptual overview information at the page
[Azure Policy's machine configuration](./overview.md).

## Major differences

Configurations are deployed through DSC extension for Linux in a "push" model, where the operation
is completed asynchronously. The deployment doesn't return until the configuration has finished
running inside the virtual machine. After deployment, no further information is returned to ARM.
The monitoring and drift are managed within the machine.

Machine configuration processes configurations in a "pull" model. The extension is
deployed to a virtual machine and then jobs are executed based on guest assignment details. it's
not possible to view the status while the configuration in real time as it's being applied inside
the machine. it's possible to monitor and correct drift from Azure Resource Manager (ARM) after the
configuration is applied.

The DSC extension included "privateSettings" where secrets could be passed to the configuration such
as passwords or shared keys. Secrets management hasn't yet been implemented for machine configuration.

### Considerations for whether to migrate existing machines or only new machines

Machine configuration uses DSC version 3 with PowerShell version 7. DSC version 3 can coexist with
older versions of DSC in
[Linux](/powershell/dsc/getting-started/lnxgettingstarted).
The implementations are separate. However, there's no conflict detection.

For machines that will only exist for days or weeks, update the deployment templates and switch from
DSC extension to machine configuration. After testing, use the updated templates to build future
machines.

If a machine is planned to exist for months or years, you might choose to change which configuration
features of Azure manage the machine, to take advantage of new features.

it isn't advised to have both platforms manage the same configuration.

## Understand migration

The best approach to migration is to recreate, test, and redeploy content first, and then use the
new solution for new machines.

The expected steps for migration are:

- Download and expand the .zip package used for DSC extension
- Examine the Managed Object Format (MOF) file and resources to understand the scenario
- Create custom DSC resources in PowerShell classes
- Update the MOF file to use the new resources
- Use the machine configuration authoring module to create, test, and publish a new package
- Use machine configuration for future deployments rather than DSC extension

#### Consider decomposing complex configuration files

Machine configuration can manage multiple configurations per machine. Many configurations written for
DSC extension for Linux assumed the limitation of managing a single configuration per
machine. To take advantage of the expanded capabilities offered by machine configuration, large
configuration files can be divided into many smaller configurations where each handles a specific
scenario.

There's no orchestration in machine configuration to control the order of how configurations are
sorted. Keep steps in a configuration together in one package if they're required to happen
sequentially.

### Test content in Azure machine configuration

Read the page
[How to create custom machine configuration package artifacts](./machine-configuration-create.md).
to evaluate whether your content from DSC extension can be used with machine configuration.

When you reach the step
[Author a configuration](./machine-configuration-create.md#author-a-configuration),
use the MOF file from the DSC extension package as the basis for creating a new MOF file and
custom DSC resources. You must have the custom PowerShell modules available in `PSModulePath`
before you can create a machine configuration package.

#### Update deployment templates

If your deployment templates include the DSC extension
(see [examples](../../virtual-machines/extensions/dsc-template.md)),
there are two changes required.

First, replace the DSC extension with the
[extension for the machine configuration feature](./overview.md).

Then, add a
[machine configuration assignment](./machine-configuration-assignments.md)
that associates the new configuration package (and hash value) with the machine.

#### Older "nx" modules for Linux DSC are not compatible with DSCv3

The modules that shipped with DSC for Linux on GitHub were created in the C programming language.
In the latest version of DSC, which is used by the machine configuration feature, modules
for Linux are written in PowerShell classes. Meaning, none of the original resources are compatible
with the new platform.

As a result, new Linux packages will require custom module development.

#### Will I have to add "Reasons" property to custom resources?

Implementing the
["Reasons" property](./machine-configuration-custom.md#special-requirements-for-get)
provides a better experience when viewing the results of a configuration assignment from the Azure
Portal. If the `Get` method in a module doesn't include "Reasons", generic output is returned with
details from the properties returned by the `Get` method. Therefore, it's optional for migration.

### Removing a configuration the was assigned in Linux by DSC extension

In previous versions of DSC, the DSC extension assigned a configuration through the Local
Configuration Manager. It's recommended to remove the DSC extension and reset
LCM.

> [!IMPORTANT]
> Removing a configuration in Local Configuration Manager doesn't "roll back"
> the settings in Linux that were set by the configuration. The
> action of removing the configuration only causes the LCM to stop managing
> the assigned configuration. The settings remain in place.

Use the `Remove.py` script as documented in
[Performing DSC Operations from the Linux Computer](https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer)

## Next steps

- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./machine-configuration-create-publish.md)
  so it's accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.

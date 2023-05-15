---
title: Planning a change from Desired State Configuration extension for Linux to machine configuration
description: Guidance for moving from Desired State Configuration extension to the machine configuration feature of Azure Policy.
ms.date: 04/18/2023
ms.topic: how-to
---
# Planning a change from Desired State Configuration extension for Linux to machine configuration

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Machine configuration is the latest implementation of functionality that has been provided by the
PowerShell Desired State Configuration (DSC) extension for Linux virtual machines in Azure. When
possible, you should plan to move your content and machines to the new service. This article
provides guidance on developing a migration strategy.

New features in machine configuration:

- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs
- Linux machines consume PowerShell-based DSC resources

Before you begin, it's a good idea to read the conceptual overview information at the page
[Azure Policy's machine configuration][01].

## Major differences

Configurations are deployed through the DSC extension for Linux in a "push" model, where the
operation is completed asynchronously. The deployment doesn't return until the configuration has
finished running inside the virtual machine. After deployment, no further information is returned
to Resource Manager. The monitoring and drift are managed within the machine.

Machine configuration processes configurations in a "pull" model. The extension is deployed to a
virtual machine and then jobs are executed based on machine configuration assignment details. It
isn't possible to view the status while the configuration in real time as it's being applied inside
the machine. It's possible to watch and correct drift from Azure Resource Manager after the
configuration is applied.

The DSC extension included **privateSettings** where secrets could be passed to the configuration,
such as passwords or shared keys. Secrets management hasn't yet been implemented for machine
configuration.

### Considerations for whether to migrate existing machines or only new machines

Machine configuration uses DSC version 3 with PowerShell version 7. DSC version 3 can coexist with
older versions of DSC in [Linux][02]. The implementations are separate. However, there's no
conflict detection.

For machines only intended to exist for days or weeks, update the deployment templates and switch
from the DSC extension to machine configuration. After testing, use the updated templates to build
future machines.

If a machine is planned to exist for months or years, you might choose to change which
configuration features of Azure manage the machine to take advantage of new features.

Using both platforms to manage the same configuration isn't advised.

## Understand migration

The best approach to migration is to recreate, test, and redeploy content first, and then use the
new solution for new machines.

The expected steps for migration are:

1. Download and expand the `.zip` package used for the DSC extension.
1. Examine the Managed Object Format (MOF) file and resources to understand the scenario.
1. Create custom DSC resources in PowerShell classes.
1. Update the MOF file to use the new resources.
1. Use the machine configuration authoring module to create, test, and publish a new package.
1. Use machine configuration for future deployments rather than DSC extension.

#### Consider decomposing complex configuration files

Machine configuration can manage multiple configurations per machine. Many configurations written
for the DSC extension for Linux assumed the limitation of managing a single configuration per
machine. To take advantage of the expanded capabilities offered by machine configuration, large
configuration files can be divided into many smaller configurations where each handles a specific
scenario.

There's no orchestration in machine configuration to control the order of how configurations are
sorted. Keep steps in a configuration together in one package if they must happen sequentially.

### Test content in Azure machine configuration

Read the page [How to create custom machine configuration package artifacts][03] to evaluate
whether your content from the DSC extension can be used with machine configuration.

When you reach the step [Author a configuration][04], use the MOF file from the DSC extension
package as the basis for creating a new MOF file and custom DSC resources. You must have the custom
PowerShell modules available in `$env:PSModulePath` before you can create a machine configuration
package.

#### Update deployment templates

If your deployment templates include the DSC extension (see [examples][05]), there are two changes
required.

First, replace the DSC extension with the [extension for the machine configuration feature][01].

Then, add a [machine configuration assignment][06] that associates the new configuration package
(and hash value) with the machine.

#### Older nx\* modules for Linux DSC aren't compatible with DSCv3

The modules that shipped with DSC for Linux on GitHub were created in the C programming language.
In the latest version of DSC, which is used by the machine configuration feature, modules for Linux
are written in PowerShell classes. None of the original resources are compatible with the new
platform.

As a result, new Linux packages require custom module development.

Linux content authored using Chef Inspec is still supported but should only be used for legacy
configurations.

#### Updated nx\* module functionality

A new open-source [nxtools module][07] has been released to help make managing Linux systems easier
for PowerShell users.

The module helps with managing common tasks such as:

- Managing users and groups
- Performing file system operations
- Managing services
- Performing archive operations
- Managing packages

The module includes class-based DSC resources for Linux and built-in machine configuration
packages.

To give feedback about this functionality, open an issue on the documentation. We currently _don't_
accept PRs for this project, and support is best effort.

#### Do I need to add the Reasons property to custom resources?

Implementing the [Reasons property][08] provides a better experience when viewing the results of
a configuration assignment from the Azure portal. If the `Get` method in a module doesn't include
**Reasons**, generic output is returned with details from the properties returned by the `Get`
method. Therefore, it's optional for migration.

### Removing a configuration the DSC extension assigned in Linux

In previous versions of DSC, the DSC extension assigned a configuration through the Local
Configuration Manager (LCM). It's recommended to remove the DSC extension and reset the LCM.

> [!IMPORTANT]
> Removing a configuration in Local Configuration Manager doesn't "roll back" the settings in Linux
> that were set by the configuration. The action of removing the configuration only causes the LCM
> to stop managing the assigned configuration. The settings remain in place.

Use the `Remove.py` script as documented in
[Performing DSC Operations from the Linux Computer][09]

## Next steps

- [Create a package artifact][03] for machine configuration.
- [Test the package artifact][10] from your development environment.
- [Publish the package artifact][11] so it's accessible to your machines.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][12] for at-scale
  management of your environment.
- [Assign your custom policy definition][13] using Azure portal.

<!-- Reference link definitions -->
[01]: ./overview.md
[02]: /powershell/dsc/getting-started/lnxgettingstarted
[03]: ./how-to-create-package.md
[04]: ./how-to-create-package.md#author-a-configuration
[05]: ../../virtual-machines/extensions/dsc-template.md
[06]: ./assignments.md
[07]: https://github.com/azure/nxtools#getting-started
[08]: ./dsc-in-machine-configuration.md#special-requirements-for-get
[09]: https://github.com/Microsoft/PowerShell-DSC-for-Linux#performing-dsc-operations-from-the-linux-computer
[10]: ./how-to-test-package.md
[11]: ./how-to-publish-package.md
[12]: ./how-to-create-policy-definition.md
[13]: ../policy/assign-policy-portal.md

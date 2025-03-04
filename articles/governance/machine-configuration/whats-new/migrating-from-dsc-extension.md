---
title: Planning a change from Desired State Configuration extension to machine configuration
description: Guidance for moving from Desired State Configuration extension to Azure machine configuration.
ms.date: 01/29/2025
ms.topic: how-to
---
# Planning a change from Desired State Configuration extension to Azure machine configuration

Machine configuration is the latest implementation of functionality that has been provided by the
PowerShell Desired State Configuration (DSC) extension for virtual machines in Azure. When
possible, you should plan to move your content and machines to the new service. This article
provides guidance on developing a migration strategy.

New features in machine configuration:

- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs

Before you begin, it's a good idea to read the conceptual overview information at the page
[Azure Policy's machine configuration][01].

## Major differences

Machine configuration uses DSC version 2. DSC Extension uses
DSC version 1. The implementations are separate. However, there's no
conflict detection. Using both platforms to manage the same configuration isn't advised.

Configurations are deployed through the DSC extension in a "push" model, where the
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

Machine configuration runs in PowerShell version 7.2, while the DSC Extension runs in Windows
PowerShell 5.1. While most resources are expected to work because of [implicit remoting][02]
it is a good idea to test existing resources before use.

Because DSC Extension manages Local Configuration Manager service in Windows, control over whether
reboots are allowed can be set in properties of the extension. As part of the shift to Machine
Configuration, you will want to manage reboots using Azure Resource Manager.

The zip file artifact used by DSC Extension is not compatible with Azure machine configuration.
Plan to use the machine configuration authoring tools to repackage the configuration
and required PowerShell modules and republish to Azure Storage.

## Understand migration

The best approach to migration is to recreate, test, and redeploy content first, and then use the
new solution for new machines.

The expected steps for migration are:

1. Download and expand the `.zip` package used for the DSC extension.
1. Examine the Managed Object Format (MOF) file and resources to understand the scenario.
1. Make any required changes to the configuration or resources.
1. Use the machine configuration authoring module to create, test, and publish a new package.
1. Use machine configuration for future deployments rather than DSC extension.

#### Consider decomposing complex configuration files

Machine configuration can manage multiple configurations per machine. Many configurations written
for the DSC extension assumed the limitation of managing a single configuration per
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

#### Do I need to add the Reasons property to custom resources?

Implementing the [Reasons property][07] provides a better experience when viewing the results of
a configuration assignment from the Azure portal. If the `Get` method in a module doesn't include
**Reasons**, generic output is returned with details from the properties returned by the `Get`
method. Therefore, it's optional for migration.

### Removing a configuration the DSC extension assigned

In previous versions of DSC, the DSC extension assigned a configuration through the Local
Configuration Manager (LCM). It's recommended to remove the DSC extension and reset the LCM.

> [!IMPORTANT]
> Removing a configuration in Local Configuration Manager doesn't "roll back" the settings
> that were set by the configuration. The action of removing the configuration only causes the LCM
> to stop managing the assigned configuration. The settings remain in place.

Use the `Remove-DscConfigurationDocument` command as documented in
[Remove-DscConfigurationDocument][08]

## Next steps

- [Develop a custom machine configuration package][09].
- Use the **GuestConfiguration** module to [create an Azure Policy definition][10] for at-scale
  management of your environment.
- [Assign your custom policy definition][11] using Azure portal.

<!-- Reference link definitions -->
[01]: ../overview.md
[02]: /powershell/module/microsoft.powershell.core/about/about_windows_powershell_compatibility
[03]: ../how-to/develop-custom-package/2-create-package.md
[04]: ../how-to/develop-custom-package/2-create-package.md#author-a-configuration
[05]: /azure/virtual-machines/extensions/dsc-template
[06]: ../concepts/assignments.md
[07]: ./psdsc-in-machine-configuration.md#special-requirements-for-get
[08]: /powershell/module/psdesiredstateconfiguration/remove-dscconfigurationdocument
[09]: ../how-to/develop-custom-package/overview.md
[10]: ../how-to/create-policy-definition.md
[11]: ../../policy/assign-policy-portal.md

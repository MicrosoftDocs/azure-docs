---
title: Azure Automation State Configuration to machine configuration migration planning
description: This article provides process and technical guidance for customers interested in moving from DSC version 2 in Azure Automation to version 3 in Azure Policy.
ms.date: 07/26/2022
ms.topic: how-to
ms.service: machine-configuration
ms.author: timwarner
author: timwarner-msft
---
# Azure Automation state configuration to machine configuration migration planning

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Machine configuration is the latest implementation of functionality
that has been provided by Azure Automation State Configuration (also known as
Azure Automation Desired State Configuration, or AADSC).
When possible, you should plan to move your content and machines to the new service.
This article provides guidance on developing a migration strategy from Azure
Automation to machine configuration.

New features in machine configuration address top asks from customers:

- Increased size limit for configurations ( 100MB )
- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs
- Linux and Windows both consume PowerShell-based DSC resources

Before you begin, it's a good idea to read the conceptual overview
information at the page
[Azure Policy's machine configuration](./overview.md).

## Understand migration

The best approach to migration is to redeploy content first, and then
migrate machines. The expected steps for migration are outlined.

- Export configurations from Azure Automation
- Discover module requirements and load them in your environment
- Compile configurations
- Create and publish machine configuration packages
- Test machine configuration packages
- Onboard hybrid machines to Azure Arc
- Unregister servers from Azure Automation State Configuration
- Assign configurations to servers using machine configuration

Machine configuration uses DSC version 3 with PowerShell version 7.
DSC version 3 can coexist with older versions of DSC in
[Windows](/powershell/dsc/getting-started/wingettingstarted) and
[Linux](/powershell/dsc/getting-started/lnxgettingstarted).
The implementations are separate. However, there's no conflict detection.

Machine configuration doesn't require publishing modules or configurations in to
a service, or compiling in a service. Instead, content is developed and tested
using purpose-built tooling and published anywhere the machine can reach over
HTTPS (typically Azure Blob Storage).

If you decide the right plan for your migration is to have machines in both
services for some period of time, while that could be confusing to manage,
there are no technical barriers. The two services are independent.

## Export content from Azure Automation

Start by discovering and exporting content from Azure Automation State
Configuration in to a development environment where you create, test, and publish
content packages for machine configuration.

### Configurations

Only configuration scripts can be exported from Azure Automation. It isn't
possible to export "Node configurations", or compiled MOF files.
If you published MOF files directly in to the Automation Account and no longer
have access to the original file, you must recompile from your private
configuration scripts, or possibly re-author the configuration if the original
can't be found.

To export configuration scripts from Azure Automation, first identify the Azure
Automation account that contains the configurations and the name of the Resource
Group where the Automation Account is deployed.

Install the PowerShell module "Az.Automation".

```powershell
Install-Module Az.Automation
```

Next, use the "Get-AzAutomationAccount" command to identify your Automation
Accounts and the Resource Group where they're deployed.
The properties "ResourceGroupName" and "AutomationAccountName"
are important for next steps.

```powershell
Get-AzAutomationAccount

SubscriptionId        : <your subscription id>
ResourceGroupName     : <your resource group name>
AutomationAccountName : <your automation account name>
Location              : centralus
State                 :
Plan                  :
CreationTime          : 6/30/2021 11:56:17 AM -05:00
LastModifiedTime      : 6/30/2021 11:56:17 AM -05:00
LastModifiedBy        :
Tags                  : {}
```

Discover the configurations in your Automation Account. The output
contains one entry per configuration. If you have many, store the information
as a variable so it's easier to work with.

```powershell
Get-AzAutomationDscConfiguration -ResourceGroupName <your resource group name> -AutomationAccountName <your automation account name>

ResourceGroupName     : <your resource group name>
AutomationAccountName : <your automation account name>
Location              : centralus
State                 : Published
Name                  : <your configuration name>
Tags                  : {}
CreationTime          : 6/30/2021 12:18:26 PM -05:00
LastModifiedTime      : 6/30/2021 12:18:26 PM -05:00
Description           :
Parameters            : {}
LogVerbose            : False
```

Finally, export each configuration to a local script file using the command
"Export-AzAutomationDscConfiguration". The resulting file name uses the
pattern `\ConfigurationName.ps1`.

```powershell
Export-AzAutomationDscConfiguration -OutputFolder /<location on your machine> -ResourceGroupName <your resource group name> -AutomationAccountName <your automation account name> -name <your configuration name>

UnixMode   User             Group                 LastWriteTime           Size Name
--------   ----             -----                 -------------           ---- ----
                                               12/31/1600 18:09
```

#### Export configurations using the PowerShell pipeline

After you've discovered your accounts and the number of configurations,
you might wish to export all configurations to a local folder on your machine.
To automate this process, pipe the output of each command above to the next.

The example exports 5 configurations. The output pattern is
the only indication of success.

```powershell
Get-AzAutomationAccount | Get-AzAutomationDscConfiguration | Export-AzAutomationDSCConfiguration -OutputFolder /<location on your machine>

UnixMode   User             Group                 LastWriteTime           Size Name
--------   ----             -----                 -------------           ---- ----
                                               12/31/1600 18:09
                                               12/31/1600 18:09
                                               12/31/1600 18:09
                                               12/31/1600 18:09
                                               12/31/1600 18:09
```

#### Consider decomposing complex configuration files

Machine configuration can manage multiple configurations per machine.
Many configurations written for Azure Automation State Configuration assumed the
limitation of managing a single configuration per machine. To take advantage of
the expanded capabilities offered by machine configuration, large
configuration files can be divided into many smaller configurations where each
handles a specific scenario.

There is no orchestration in machine configuration to control the order of how
configurations are sorted, so keep steps in a configuration together in one
package if they are required to happen sequentially.

### Modules

It isn't possible to export modules from Azure Automation or automatically
correlate which configurations require which module/version. You must
have the modules in your local environment to create a new machine configuration
package. To create a list of modules you need for migration, use PowerShell to
query Azure Automation for the name and version of modules.

If you are using modules that are custom authored and only exist in your private
development environment, it isn't possible to export them from Azure
Automation.

If a custom module is required for a configuration and is in the account, but you
can't find it in your environment, you won't be able to compile the
configuration, which means you won't be able to migrate the configuration.

#### List modules imported in Azure Automation

To retrieve a list of all modules that are installed in your automation account,
use the `Get-AzAutomationModule` command. The property "IsGlobal" tells you
if the module is built in to Azure Automation always, or if it was published to
the account.

For example, to create a list of all modules published to any of your accounts.

```powershell
Get-AzAutomationAccount | Get-AzAutomationModule | ? IsGlobal -eq $false
```

You can also use the PowerShell Gallery as an aid in finding details about
modules that are publicly available. For example, the list of modules that are
built in to new Automation Accounts, and that contain DSC resources, is produced
by the following example.

```powershell
Get-AzAutomationAccount | Get-AzAutomationModule | ? IsGlobal -eq $true | Find-Module -erroraction silentlycontinue | ? {'' -ne $_.Includes.DscResource} | Select Name, Version -Unique | format-table -AutoSize

Name                       Version
----                       -------
AuditPolicyDsc             1.4.0
ComputerManagementDsc      8.4.0
PSDscResources             2.12.0
SecurityPolicyDsc          2.10.0
xDSCDomainjoin             1.2.23
xPowerShellExecutionPolicy 3.1.0.0
xRemoteDesktopAdmin        1.1.0.0
```

#### Download modules from PowerShell Gallery or PowerShellGet repository

If the modules were imported from the PowerShell Gallery, you can pipe the output
from `Find-Module` directly in `Install-Module`. Piping the output across commands
provides a solution to load a developer environment with all modules currently in
an Automation Account that are available publicly in the PowerShell Gallery.

The same approach could be used to pull modules from a custom NuGet feed, if
the feed is registered in your local environment as a
[PowerShellGet repository](/powershell/scripting/gallery/how-to/working-with-local-psrepositories).

The `Find-Module` command in the example doesn't suppress errors, meaning
any modules not found in the gallery return an error message.

```powershell
Get-AzAutomationAccount | Get-AzAutomationModule | ? IsGlobal -eq $false | Find-Module | ? {'' -ne $_.Includes.DscResource} | Install-Module

  Installing package xWebAdministration'

    [                                                                                        ]
```

#### Inspecting configuration scripts for module requirements

If you've exported configuration scripts from Azure Automation, you can also
review the contents for details about which modules are required to compile each
configuration to a MOF file. This approach would only be needed if you find
configurations in your Automation Accounts where the modules have been removed.
The configurations would no longer be useful for machines, but they might still
be in the account.

Towards the top of each file, look for a line that includes 'Import-DscResource'.
This command is only applicable inside a configuration, and is used to load modules
at the time of compilation.

For example, the "WindowsIISServerConfig" configuration in the PowerShell Gallery
contains the lines in this example.

```powershell
configuration WindowsIISServerConfig
{

Import-DscResource -ModuleName @{ModuleName = 'xWebAdministration';ModuleVersion = '1.19.0.0'}
Import-DscResource -ModuleName 'PSDesiredStateConfiguration'
```

The configuration requires you to have the "xWebAdministration" module version
"1.19.0.0" and the module "PSDesiredStateConfiguration".

### Test content in Azure machine configuration

The best way to evaluate whether your content from Azure Automation State
Configuration can be used with machine configuration is to follow
the step-by-step tutorial in the page
[How to create custom machine configuration package artifacts](./machine-configuration-create.md).

When you reach the step
[Author a configuration](./machine-configuration-create.md#author-a-configuration),
the configuration script that generates a MOF file should be one of the scripts
you exported from Azure Automation State Configuration. You must have the
required PowerShell modules installed in your environment before you can compile
the configuration to a MOF file and create a machine configuration package.

#### What if a module does not work with machine configuration?

Some modules might encounter compatibility issues with machine configuration. The
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
["Reasons" property](./machine-configuration-custom.md#special-requirements-for-get)
provides a better experience when viewing
the results of a configuration assignment from the Azure Portal. If the `Get`
method in a module doesn't include "Reasons", generic output is returned
with details from the properties returned by the `Get` method. Therefore,
it's optional for migration.

## Machines

After you've finished testing content from Azure Automation State Configuration
in machine configuration, develop a plan for migrating machines.

Azure Automation State Configuration is available for both virtual machines in
Azure and hybrid machines located outside of Azure. You must plan for each of
these scenarios using different steps.

### Azure VMs

Azure virtual machines already have a
[resource](../../azure-resource-manager/management/overview.md#terminology)
in Azure, which means they're ready for machine configuration assignments that
associate them with a configuration. The high-level tasks for migrating Azure
virtual machines are to remove them from Azure Automation State Configuration
and then assign configurations using machine configuration.

To remove a machine from Azure Automation State Configuration, follow the steps
in the page
[How to remove a configuration and node from Automation State Configuration](../../automation/state-configuration/remove-node-and-configuration-package.md).

To assign configurations using machine configuration, follow the steps in the
Azure Policy Quickstarts, such as
[Quickstart: Create a policy assignment to identify non-compliant resources](../policy/assign-policy-portal.md).
In step 6 when selecting a policy definition, pick the definition that applies
a configuration you migrated from Azure Automation State Configuration.

### Hybrid machines

Machines outside of Azure
[can be registered to Azure Automation State Configuration](../../automation/automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines),
but they don't have a machine resource in Azure. The connection
to Azure Automation is handled by Local Configuration Manager service inside
the machine and the record of the node is managed as a resource in the Azure
Automation provider type.

Before removing a machine from Azure Automation State Configuration,
onboard each node as an
[Azure Arc-enabled server](../../azure-arc/servers/overview.md).
Onboard to Azure Arc creates a machine resource in Azure so the machine
can be managed by Azure Policy. The machine can be onboarded to Azure Arc at any
time but you can use Azure Automation State Configuration to automate the process.

You can register a machine to Azure Arc-enabled servers by using PowerShell DSC.
For details, view the page
[How to install the Connected Machine agent using Windows PowerShell DSC](../../azure-arc/servers/onboard-dsc.md).
Remember however, that Azure Automation State Configuration can manage only one
configuration per machine, per Automation Account. This means you have the option
to export, test, and prepare your content for machine configuration, and then
"switch" the node configuration in Azure Automation to onboard to Azure Arc. As
the last step, you remove the node registration from Azure Automation State
Configuration and move forward only managing the machine state through guest
configuration.

## Troubleshooting issues when exporting content

Details about known issues are provided

### Exporting configurations results in "\\" character in file name

When using PowerShell on MacOS/Linux, you encounter issues dealing with the file
names output by `Export-AzAutomationDSCConfiguration`.

As a workaround, a module has been published to the PowerShell Gallery named
[AADSCConfigContent](https://www.powershellgallery.com/packages/AADSCConfigContent/).
The module has only one command, which exports the content
of a configuration stored in Azure Automation by making a REST request to the
service.

## Next steps

- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./machine-configuration-create-publish.md)
  so it is accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for machine configuration](../policy/how-to/determine-non-compliance.md) policy assignments.

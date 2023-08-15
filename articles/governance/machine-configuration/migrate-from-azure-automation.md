---
title: Azure Automation State Configuration to machine configuration migration planning
description: This article provides process and technical guidance for customers interested in moving from DSC version 2 in Azure Automation to version 3 in Azure Policy.
ms.date: 04/18/2023
ms.topic: how-to
ms.custom: devx-track-azurepowershell
---
# Azure Automation state configuration to machine configuration migration planning

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Machine configuration is the latest implementation of functionality that has been provided by Azure
Automation State Configuration (also known as Azure Automation Desired State Configuration, or
AADSC). When possible, you should plan to move your content and machines to the new service. This
article provides guidance on developing a migration strategy from Azure Automation to machine
configuration.

New features in machine configuration address customer requests:

- Increased size limit for configurations to 100 MB
- Advanced reporting through Azure Resource Graph including resource ID and state
- Manage multiple configurations for the same machine
- When machines drift from the desired state, you control when remediation occurs
- Linux and Windows both consume PowerShell-based DSC resources

Before you begin, it's a good idea to read the conceptual overview information at the page
[Azure Policy's machine configuration][01].

## Understand migration

The best approach to migration is to redeploy content first, and then migrate machines. This
section outlines the expected steps for migration.

1. Export configurations from Azure Automation
1. Discover module requirements and load them in your environment
1. Compile configurations
1. Create and publish machine configuration packages
1. Test machine configuration packages
1. Onboard hybrid machines to Azure Arc
1. Unregister servers from Azure Automation State Configuration
1. Assign configurations to servers using machine configuration

Machine configuration uses DSC version 3 with PowerShell version 7. DSC version 3 can coexist with
older versions of DSC in [Windows][02] and [Linux][03]. The implementations are separate. However,
there's no conflict detection.

Machine configuration doesn't require publishing modules or configurations in to a service, or
compiling in a service. Instead, you develop and test content using purpose-built tooling and
publish the content anywhere the machine can reach over HTTPS (typically Azure Blob Storage).

If you decide to have machines in both services for some period of time, there are no technical
barriers. The two services are independent.

## Export content from Azure Automation

Start by discovering and exporting content from Azure Automation State Configuration into a
development environment where you create, test, and publish content packages for machine
configuration.

### Configurations

You can only export configuration scripts from Azure Automation. It isn't possible to export node
configurations, or compiled MOF files. If you published MOF files directly into the Automation
Account and no longer have access to the original file, you need to recompile from your private
configuration scripts. If you can't find the original configuration, you must reauthor it.

To export configuration scripts from Azure Automation, first identify the Azure Automation account
that has the configurations and the name of the Resource Group the Automation Account is deployed
in.

Install the PowerShell module **Az.Automation**.

```powershell
Install-Module -Name Az.Automation
```

Next, use the `Get-AzAutomationAccount` command to identify your Automation Accounts and the
Resource Group where they're deployed. The properties **ResourceGroupName** and
**AutomationAccountName** are important for next steps.

```azurepowershell-interactive
Get-AzAutomationAccount
```

```Output
SubscriptionId        : <your-subscription-id>
ResourceGroupName     : <your-resource-group-name>
AutomationAccountName : <your-automation-account-name>
Location              : centralus
State                 :
Plan                  :
CreationTime          : 6/30/2021 11:56:17 AM -05:00
LastModifiedTime      : 6/30/2021 11:56:17 AM -05:00
LastModifiedBy        :
Tags                  : {}
```

Discover the configurations in your Automation Account. The output has one entry per configuration.
If you have many, store the information as a variable so it's easier to work with.

```azurepowershell-interactive
$getParams = @{
    ResourceGroupName     = '<your-resource-group-name>'
    AutomationAccountName = '<your-automation-account-name>'
}

Get-AzAutomationDscConfiguration @params
```

```Output
ResourceGroupName     : <your-resource-group-name>
AutomationAccountName : <your-automation-account-name>
Location              : centralus
State                 : Published
Name                  : <your-configuration-name>
Tags                  : {}
CreationTime          : 6/30/2021 12:18:26 PM -05:00
LastModifiedTime      : 6/30/2021 12:18:26 PM -05:00
Description           :
Parameters            : {}
LogVerbose            : False
```

Finally, export each configuration to a local script file using the command
`Export-AzAutomationDscConfiguration`. The resulting file name uses the pattern
`\ConfigurationName.ps1`.

```azurepowershell-interactive
$exportParams = @{
    OutputFolder          = '<location-on-your-machine>'
    ResourceGroupName     = '<your-resource-group-name>'
    AutomationAccountName = '<your-automation-account-name>'
    Name                  = '<your-configuration-name>'
}
Export-AzAutomationDscConfiguration @exportParams
```

```Output
UnixMode   User             Group                 LastWriteTime           Size Name
--------   ----             -----                 -------------           ---- ----
                                               12/31/1600 18:09
```

#### Export configurations using the PowerShell pipeline

After you've discovered your accounts and the number of configurations, you might wish to export
all configurations to a local folder on your machine. To automate this process, pipe the output of
each command in the earlier examples to the next command.

The example exports five configurations. The output pattern is the only indicator of success.

```azurepowershell-interactive
Get-AzAutomationAccount |
    Get-AzAutomationDscConfiguration |
    Export-AzAutomationDSCConfiguration -OutputFolder <location on your machine>
```

```Output
UnixMode   User             Group                 LastWriteTime           Size Name
--------   ----             -----                 -------------           ---- ----
                                               12/31/1600 18:09
                                               12/31/1600 18:09
                                               12/31/1600 18:09
                                               12/31/1600 18:09
                                               12/31/1600 18:09
```

#### Consider decomposing complex configuration files

Machine configuration can manage more than one configuration per machine. Many configurations
written for Azure Automation State Configuration assumed the limitation of managing a single
configuration per machine. To take advantage of the expanded capabilities offered by machine
configuration, you can divide large configuration files into many smaller configurations where each
handles a specific scenario.

There's no orchestration in machine configuration to control the order of how configurations are
sorted. Keep steps in a configuration together in one package if they're required to happen
sequentially.

### Modules

It isn't possible to export modules from Azure Automation or automatically correlate which
configurations require which modules and versions. You must have the modules in your local
environment to create a new machine configuration package. To create a list of modules you need for
migration, use PowerShell to query Azure Automation for the name and version of modules.

If you're using modules that are custom authored and only exist in your private development
environment, it isn't possible to export them from Azure Automation.

If you can't find a custom module in your environment that's required for a configuration and in
the account, you can't compile the configuration. Therefore, you can't migrate the configuration.

#### List modules imported in Azure Automation

To retrieve a list of all modules installed in your automation account, use the
`Get-AzAutomationModule` command. The property **IsGlobal** tells you if the module is built into
Azure Automation always, or if it was published to the account.

For example, to create a list of all modules published to any of your accounts.

```azurepowershell-interactive
Get-AzAutomationAccount |
    Get-AzAutomationModule |
    Where-Object IsGlobal -eq $false
```

You can also use the PowerShell Gallery as an aid in finding details about modules that are
publicly available. The following example lists the modules that are built into new Automation
Accounts and contain DSC resources.

```azurepowershell-interactive
Get-AzAutomationAccount |
    Get-AzAutomationModule |
    Where-Object IsGlobal -eq $true |
    Find-Module -ErrorAction SilentlyContinue |
    Where-Object {'' -ne $_.Includes.DscResource} |
    Select-Object -Property Name, Version -Unique |
    Format-Table -AutoSize
```

```Output
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

#### Download modules from PowerShell Gallery or a PowerShellGet repository

If the modules were imported from the PowerShell Gallery, you can pipe the output from
`Find-Module` directly to `Install-Module`. Piping the output across commands provides a solution
to load a developer environment with all modules currently in an Automation Account if they're
available in the PowerShell Gallery.

You can use the same approach to pull modules from a custom NuGet feed if you have registered the
feed in your local environment as a [PowerShellGet repository][04].

The `Find-Module` command in this example doesn't suppress errors, meaning any modules not found in
the gallery return an error message.

```azurepowershell-interactive
Get-AzAutomationAccount |
    Get-AzAutomationModule |
    Where-Object IsGlobal -eq $false |
    Find-Module |
    Where-Object { '' -ne $_.Includes.DscResource } |
    Install-Module
```

#### Inspecting configuration scripts for module requirements

If you've exported configuration scripts from Azure Automation, you can also review the contents
for details about which modules are required to compile each configuration to a MOF file. This
approach is only needed if you find configurations in your Automation Accounts where the modules
have been removed. The configurations would no longer be useful for machines, but they might still
be in the account.

Towards the top of each file, look for a line that includes `Import-DscResource`. This command is
only applicable inside a configuration, and it's used to load modules at the time of compilation.

For example, the `WindowsIISServerConfig` configuration in the PowerShell Gallery has the lines in
this example.

```powershell
configuration WindowsIISServerConfig
{

Import-DscResource -ModuleName @{ModuleName = 'xWebAdministration';ModuleVersion = '1.19.0.0'}
Import-DscResource -ModuleName 'PSDesiredStateConfiguration'
```

The configuration requires you to have the **xWebAdministration** module version 1.19.0.0 and the
module **PSDesiredStateConfiguration**.

### Test content in Azure machine configuration

To evaluate whether you can use your content from Azure Automation State Configuration with machine
configuration, follow the step-by-step tutorial in the page
[How to create custom machine configuration package artifacts][05].

When you reach the step [Author a configuration][06], the configuration script that generates a MOF
file should be one of the scripts you exported from Azure Automation State Configuration. You must
have the required PowerShell modules installed in your environment before you can compile the
configuration to a MOF file and create a machine configuration package.

#### What if a module doesn't work with machine configuration?

Some modules might have compatibility issues with machine configuration. The most common
problems are related to .NET framework vs .NET core. Detailed technical information is available on
the page, [Differences between Windows PowerShell 5.1 and PowerShell 7.x][07].

One option to resolve compatibility issues is to run commands in Windows PowerShell from within a
module that's imported in PowerShell 7, by running `powershell.exe`. You can review a sample module
that uses this technique in the Azure-Policy repository where it's used to audit the state of
[Windows DSC Configuration][08].

The example also illustrates a small proof of concept.

```powershell
# example function that could be loaded from module
function New-TaskResolvedInPWSH7 {
    # runs the fictitious command 'Get-myNotCompatibleCommand' in Windows PowerShell
    $compatObject = & powershell.exe -NoProfile -NonInteractive -Command {
        Get-myNotCompatibleCommand
    }
    # resulting object can be used in PowerShell 7
    return $compatObject
}
```

#### Do I need to add the Reasons property to Get-TargetResource in all modules I migrate?

Implementing the [Reasons property][09] provides a better experience when viewing the results of a
configuration assignment from the Azure portal. If the `Get` method in a module doesn't include
**Reasons**, generic output is returned with details from the properties returned by the `Get`
method. Therefore, it's optional for migration.

## Machines

After you've finished testing content from Azure Automation State Configuration in machine
configuration, develop a plan for migrating machines.

Azure Automation State Configuration is available for both virtual machines in Azure and hybrid
machines located outside of Azure. You must plan for each of these scenarios using different steps.

### Azure VMs

Azure virtual machines already have a [resource][10] in Azure, which means they're ready for
machine configuration assignments that associate them with a configuration. The high-level tasks
for migrating Azure virtual machines are to remove them from Azure Automation State Configuration
and then assign configurations using machine configuration.

To remove a machine from Azure Automation State Configuration, follow the steps in the page
[How to remove a configuration and node from Automation State Configuration][11].

To assign configurations using machine configuration, follow the steps in the Azure Policy
Quickstarts, such as
[Quickstart: Create a policy assignment to identify non-compliant resources][12]. In step 6 when
selecting a policy definition, pick the definition that applies a configuration you migrated from
Azure Automation State Configuration.

### Hybrid machines

Machines outside of Azure [can be registered to Azure Automation State Configuration][13], but they
don't have a machine resource in Azure. The Local Configuration Manager (LCM) service inside the
machine handles the connection to Azure Automation. The record of the node is managed as a resource
in the Azure Automation provider type.

Before removing a machine from Azure Automation State Configuration, onboard each node as an
[Azure Arc-enabled server][14]. Onboarding to Azure Arc creates a machine resource in Azure so
Azure Policy can manage the machine. The machine can be onboarded to Azure Arc at any time, but you
can use Azure Automation State Configuration to automate the process.

You can register a machine to Azure Arc-enabled servers by using PowerShell DSC. For details, view
the page [How to install the Connected Machine agent using Windows PowerShell DSC][15]. Remember
however, that Azure Automation State Configuration can manage only one configuration per machine,
per Automation Account. You can export, test, and prepare your content for machine configuration,
and then switch the node configuration in Azure Automation to onboard to Azure Arc. As the last
step, remove the node registration from Azure Automation State Configuration and move forward only
managing the machine state through machine configuration.

## Troubleshooting issues when exporting content

Details about known issues are provided in this section.

### Exporting configurations results in "\\" character in file name

When using PowerShell on macOS and Linux, you may have issues dealing with the file names output by
`Export-AzAutomationDSCConfiguration`.

As a workaround, a module has been published to the PowerShell Gallery named
[AADSCConfigContent][16]. The module has only one command, which exports the content of a
configuration stored in Azure Automation by making a REST request to the service.

## Next steps

- [Create a package artifact][05] for machine configuration.
- [Test the package artifact][17] from your development environment.
- [Publish the package artifact][18] so it's accessible to your machines.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][19] for at-scale
  management of your environment.
- [Assign your custom policy definition][20] using Azure portal.
- Learn how to view [compliance details for machine configuration][21] policy assignments.

<!-- Reference link definitions -->
[01]: ./overview.md
[02]: /powershell/dsc/getting-started/wingettingstarted
[03]: /powershell/dsc/getting-started/lnxgettingstarted
[04]: /powershell/gallery/how-to/working-with-local-psrepositories
[05]: ./how-to-create-package.md
[06]: ./how-to-create-package.md#author-a-configuration
[07]: /powershell/gallery/how-to/working-with-local-psrepositories
[08]: https://github.com/Azure/azure-policy/blob/bbfc60104c2c5b7fa6dd5b784b5d4713ddd55218/samples/GuestConfiguration/package-samples/resource-modules/WindowsDscConfiguration/DscResources/WindowsDscConfiguration/WindowsDscConfiguration.psm1#L97
[09]: ./dsc-in-machine-configuration.md#special-requirements-for-get
[10]: ../../azure-resource-manager/management/overview.md#terminology
[11]: ../../automation/state-configuration/remove-node-and-configuration-package.md
[12]: ../policy/assign-policy-portal.md
[13]: ../../automation/automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines
[14]: ../../azure-arc/servers/overview.md
[15]: ../../azure-arc/servers/onboard-dsc.md
[16]: https://www.powershellgallery.com/packages/AADSCConfigContent/
[17]: ./how-to-test-package.md
[18]: ./how-to-publish-package.md
[19]: ./how-to-create-policy-definition.md
[20]: ../policy/assign-policy-portal.md
[21]: ../policy/how-to/determine-non-compliance.md

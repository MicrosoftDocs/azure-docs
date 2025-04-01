---
title: Set up Azure Automation continuous deployment with Chocolatey
description: This article tells how to set up continuous deployment with State Configuration and the Chocolatey package manager.
services: automation
ms.subservice: desired-state-config
ms.date: 10/22/2024
ms.topic: how-to
ms.custom: references_regions, devx-track-azurepowershell
ms.service: azure-automation
---

# Set up continuous deployment with Chocolatey

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

In a DevOps world, there are many tools to assist with various points in the continuous integration
pipeline. Azure Automation [State Configuration][09] is a welcome new addition to the options that
DevOps teams can employ.

Azure Automation is a managed service in Microsoft Azure that allows you to automate various tasks
using runbooks, nodes, and shared resources, such as credentials, schedules, and global variables.
Azure Automation State Configuration extends this automation capability to include PowerShell
Desired State Configuration (DSC) tools. Here's a great [overview][09].

This article demonstrates how to set up Continuous Deployment (CD) for a Windows computer. You can
easily extend the technique to include as many Windows computers as necessary in the role, for
example, a website, and go from there to more roles.

![Continuous Deployment for IaaS VMs][02]

## At a high level

There's quite a bit going on here, but fortunately it can be broken down into two main processes:

- Writing code and testing it, then creating and publishing installation packages for major and
  minor versions of the system.
- Creating and managing VMs that install and execute the code in the packages.

Once both of these core processes are in place, it's easy to automatically update the package on
your VMs as new versions are created and deployed.

## Component overview

Package managers such as [apt-get][16] are well known in the Linux world, but not so much in the
Windows world. [Chocolatey][14] is a package manager for Windows. Scott Hanselman's [blog][20] post
about Chocolatey is a great introduction. Chocolatey allows you to use the command line to install
packages from a central repository onto a Windows operating system. You can create and manage your
own repository, and Chocolatey can install packages from any number of repositories that you
designate.

[PowerShell DSC][04] is a PowerShell tool that allows you to declare the configuration that you want
for a machine. For example, if you want Chocolatey installed, IIS installed, port 80 opened, and
version 1.0.0 of your website installed, the DSC Local Configuration Manager (LCM) implements that
configuration. A DSC pull server holds a repository of configurations for your machines. The LCM on
each machine checks in periodically to see if its configuration matches the stored configuration. It
can either report status or attempt to bring the machine back into alignment with the stored
configuration. You can edit the stored configuration on the pull server to cause a machine or set of
machines to come into alignment with the changed configuration.

A DSC resource is a module of code that has specific capabilities, such as managing networking,
Active Directory, or SQL Server. The Chocolatey DSC Resource knows how to access a NuGet Server,
download packages, install packages, and perform other tasks. There are many other DSC Resources in
the [PowerShell Gallery][22]. You install these modules on your Azure Automation State Configuration
pull server for use by your configurations.

Resource Manager templates provide a declarative way of generating resources for your infrastructure
such as:

- networks and subnets
- network security
- routing,
- load balancers,
- NICs, VMs, and others

For a comparison of the Resource Manager deployment model (declarative) with the Azure classic
deployment model (imperative), see [Azure Resource Manager vs. classic deployment][01]. This article
includes a discussion of the core resource providers: compute, storage, and network.

One key feature of a Resource Manager template is its ability to install a VM extension during the
VM provisioning. A VM extension has specific capabilities, such as running a custom script,
installing anti-virus software, and running a DSC configuration script. There are many other types
of VM extensions.

## Quick trip around the diagram

Starting at the top, you write your code, build it, test it, then create an installation package.
Chocolatey can handle various types of installation packages, such as MSI, MSU, ZIP. And you have
the full power of PowerShell to do the actual installation if Chocolatey's native capabilities
aren't up to it. Put the package into some place reachable - a package repository. This usage
example uses a public folder in an Azure blob storage account, but it can be anywhere. Chocolatey
works natively with NuGet servers and a few others for management of package metadata.
[This article][17] describes the options. The usage example uses NuGet. A Nuspec is metadata about
your packages. The Nuspec information is compiled into a NuPkg and stored on a NuGet server. When
your configuration requests a package by name and references a NuGet server, the Chocolatey DSC
resource on the VM grabs the package and installs it. You can also request a specific version of a
package.

In the bottom left of the picture, there's an Azure Resource Manager template. In this usage
example, the VM extension registers the VM with the Azure Automation State Configuration pull server
as a node. The configuration is stored in the pull server twice: once as plain text and once
compiled as a MOF file. In the Azure portal, the MOF represents a node configuration, as opposed to
a simple configuration.

It's relatively simple to create the Nuspec, compile it, and store it in a NuGet server. The next
step to continuous deployment requires the following one-time tasks:

- Set up the pull server
- Register your nodes with the server
- Create the initial configuration on the server

You only have to refresh the configuration and node configuration on the pull server when you
upgrade and deploy packages to the repository.

If you're not starting with a Resource Manager template, there are PowerShell commands to help you
register your VMs with the pull server. For more information, see
[Onboarding machines for management by Azure Automation State Configuration][08].

## About the usage example

The usage example in this article starts with a VM from a generic Windows Server 2012 R2 image from
the Azure gallery. You can start from any stored image and then tweak from there with the DSC
configuration. However, changing configuration that is baked into an image is much harder than
dynamically updating the configuration using DSC.

You don't have to use a Resource Manager template and the VM extension to use this technique with
your VMs. And your VMs don't have to be on Azure to be under CD management. Just install Chocolatey
and configure the LCM on the VM so it knows where the pull server is.

When you update a package on a VM that's in production, you need to take that VM out of rotation
while the update is installed. How you do this varies widely. For example, with a VM behind an Azure
Load Balancer, you can add a Custom Probe. While updating the VM, have the probe endpoint return a
400. The tweak necessary to cause this change can be inside your configuration, as can the tweak to
switch it back to returning a 200 once the update is complete.

Full source for this usage example is in [this Visual Studio project][19] on GitHub.

## Step 1: Set up the pull server and Automation account

Run the following commands in an authenticated (`Connect-AzAccount`) PowerShell session:

```azurepowershell-interactive
New-AzResourceGroup -Name MY-AUTOMATION-RG -Location MY-RG-LOCATION-IN-QUOTES
$newAzAutomationAccountSplat = @{
    ResourceGroupName = 'MY-AUTOMATION-RG'
    Location = 'MY-RG-LOCATION-IN-QUOTES'
    Name = 'MY-AUTOMATION-ACCOUNT'
}
New-AzAutomationAccount @newAzAutomationAccountSplat
```

This step takes a few minutes while the pull server is set up.

You can create your Automation account in any of the following Azure regions:

- East US 2
- South Central US
- US Gov Virginia
- West Europe
- Southeast Asia
- Japan East
- Central India
- Australia Southeast
- Canada Central
- North Europe

## Step 2: Make VM extension tweaks to the Resource Manager template

Details for VM registration (using the PowerShell DSC VM extension) provided in this
[Azure Quickstart Template][12]. This step registers your new VM with the pull server in the list of
State Configuration Nodes. Part of this registration is specifying the node configuration to be
applied to the node. This node configuration doesn't have to exist yet in the pull server, but you
need to choose the name of the node and the name of the configuration. For this example, the node is
`isvbox` and the configuration name is `ISVBoxConfig`. The node configuration name you specify in
`DeploymentTemplate.json` is `ISVBoxConfig.isvbox`.

## Step 3: Add required DSC resources to the pull server

The PowerShell Gallery can install DSC resources into your Azure Automation account. Navigate to the
resource you want and select **Deploy to Azure Automation**.

![PowerShell Gallery example][03]

Another technique recently added to the Azure portal allows you to pull in new modules or update
existing modules. The select the **Browse Gallery** icon to see the list of modules in the gallery,
drill into details, and import into your Automation account. You can use this process to keep your
modules up to date. Also, the import feature checks dependencies with other modules to ensure
nothing gets out of sync.

There's also a manual approach, used only once per resource, unless you want to upgrade it later.
For more information on authoring PowerShell integration modules, see
[Authoring Integration Modules for Azure Automation][11].

>[!NOTE]
> The folder structure of a PowerShell integration module for a Windows computer is a little
> different from the folder structure expected by the Azure Automation.

1. Install [Windows Management Framework v5][10] (not needed for Windows 10).

2. Install the integration module.

    ```azurepowershell-interactive
    Install-Module -Name MODULE-NAME`    <—grabs the module from the PowerShell Gallery
    ```

3. Copy the module folder from `C:\Program Files\WindowsPowerShell\Modules\MODULE-NAME` to a
   temporary folder.

4. Delete samples and documentation from the main folder.

5. Zip the main folder, naming the ZIP file with the name of the folder.

6. Put the ZIP file into a reachable HTTP location, such as blob storage in an Azure Storage account.

7. Run the following command.

   ```azurepowershell-interactive
   $newAzAutomationModuleSplat = @{
       ResourceGroupName = 'MY-AUTOMATION-RG'
       AutomationAccountName = 'MY-AUTOMATION-ACCOUNT'
       Name = 'MODULE-NAME'
       ContentLinkUri = 'https://STORAGE-URI/CONTAINERNAME/MODULE-NAME.zip'
   }
   New-AzAutomationModule @newAzAutomationModuleSplat
   ```

The included example implements these steps for cChoco and xNetworking.

## Step 4: Add the node configuration to the pull server

There's nothing special about the first time you import your configuration into the pull server and
compile. All later imports or compilations of the same configuration look exactly the same. Each
time you update your package and need to push it out to production you do this step after ensuring
the configuration file is correct - including the new version of your package. Here's the
configuration file `ISVBoxConfig.ps1`:

```powershell
Configuration ISVBoxConfig
{
    Import-DscResource -ModuleName cChoco
    Import-DscResource -ModuleName xNetworking

    Node 'isvbox' {

        cChocoInstaller installChoco
        {
            InstallDir = 'C:\choco'
        }

        WindowsFeature installIIS
        {
            Ensure = 'Present'
            Name   = 'Web-Server'
        }

        xFirewall WebFirewallRule
        {
            Direction    = 'Inbound'
            Name         = 'Web-Server-TCP-In'
            DisplayName  = 'Web Server (TCP-In)'
            Description  = 'IIS allow incoming web site traffic.'
            Enabled       = 'True'
            Action       = 'Allow'
            Protocol     = 'TCP'
            LocalPort    = '80'
            Ensure       = 'Present'
        }

        cChocoPackageInstaller trivialWeb
        {
            Name      = 'trivialweb'
            Version   = '1.0.0'
            Source    = 'MY-NUGET-V2-SERVER-ADDRESS'
            DependsOn = '[cChocoInstaller]installChoco','[WindowsFeature]installIIS'
        }
    }
}
```

The following `New-ConfigurationScript.ps1` script was modified to use the Az PowerShell module:

```powershell
$importAzAutomationDscConfigurationSplat = @{
    ResourceGroupName = 'MY-AUTOMATION-RG'
    AutomationAccountName = 'MY-AUTOMATION-ACCOUNT'
    SourcePath = 'C:\temp\AzureAutomationDsc\ISVBoxConfig.ps1'
    Published = -Published
    Force = -Force
}
Import-AzAutomationDscConfiguration @importAzAutomationDscConfigurationSplat

$startAzAutomationDscCompilationJobSplat = @{
    ResourceGroupName = 'MY-AUTOMATION-RG'
    AutomationAccountName = 'MY-AUTOMATION-ACCOUNT'
    ConfigurationName = 'ISVBoxConfig'
}
$jobData = Start-AzAutomationDscCompilationJob @startAzAutomationDscCompilationJobSplat

$compilationJobId = $jobData.Id

$getAzAutomationDscCompilationJobSplat = @{
    ResourceGroupName = 'MY-AUTOMATION-RG'
    AutomationAccountName = 'MY-AUTOMATION-ACCOUNT'
    Id = $compilationJobId
}
Get-AzAutomationDscCompilationJob @getAzAutomationDscCompilationJobSplat
```

## Step 5: Create and maintain package metadata

For each package that you put into the package repository, you need a Nuspec that describes it. It
must be compiled and stored on your NuGet server. For more information, see
[[Create a NuGet package using nuget.exe CLI]][15].

You can use **MyGet.org** as a NuGet server. You can buy this service, but there is a free starter
SKU. For instructions on installing your own NuGet server for your private packages, see the
documentation on [Nuget.org][21].

## Step 6: Tie it all together

Each time a version passes QA and is approved for deployment, the package is created, and nuspec and
nupkg are updated and deployed to the NuGet server. You must update the configuration (step 4) with
the new version number. Then, send it to the pull server and compile it.

From that point on, it's up to the VMs that depend on that configuration to pull the update and
install it. Each of these updates is simple - just a line or two of PowerShell. For Azure DevOps,
some of them are encapsulated in build tasks that you can chain together in a build. This
[article][23] provides more details. This [GitHub repo][18] details the available build tasks.

## Related articles
* [Azure Automation DSC overview][09]
* [Onboarding machines for management by Azure Automation DSC][08]

## Next steps

- For an overview, see [Azure Automation State Configuration overview][09].
- To get started using the feature, see [Get started with Azure Automation State Configuration][07].
- To learn about compiling DSC configurations so that you can assign them to target nodes, see
  [Compile DSC configurations in Azure Automation State Configuration][06].
- For a PowerShell cmdlet reference, see [Az.Automation][05].
- For pricing information, see [Azure Automation State Configuration pricing][13].

<!-- link references -->
[01]: ../azure-resource-manager/management/deployment-models.md
[02]: ./media/automation-dsc-cd-chocolatey/cdforiaasvm.png
[03]: ./media/automation-dsc-cd-chocolatey/xNetworking.PNG
[04]: /powershell/dsc/overview
[05]: /powershell/module/az.automation
[06]: automation-dsc-compile.md
[07]: automation-dsc-getting-started.md
[08]: automation-dsc-onboarding.md
[09]: automation-dsc-overview.md
[10]: https://aka.ms/wmf5latest
[11]: https://azure.microsoft.com/blog/authoring-integration-modules-for-azure-automation/
[12]: https://azure.microsoft.com/blog/automating-vm-configuration-using-powershell-dsc-extension/
[13]: https://azure.microsoft.com/pricing/details/automation/
[14]: https://chocolatey.org/
[15]: /nuget/create-packages/creating-a-package
[16]: https://en.wikipedia.org/wiki/Advanced_Packaging_Tool
[17]: https://docs.chocolatey.org/en-us/guides/organizations/set-up-chocolatey-server/
[18]: https://github.com/Microsoft/vso-agent-tasks
[19]: https://github.com/sebastus/ARM/tree/master/CDIaaSVM
[20]: https://www.hanselman.com/blog/IsTheWindowsUserReadyForAptget.aspx
[21]: https://www.nuget.org/
[22]: https://www.powershellgallery.com/packages?q=dsc+resources&prerelease=&sortOrder=package-title
[23]: https://www.visualstudio.com/docs/alm-devops-feature-index#continuous-delivery

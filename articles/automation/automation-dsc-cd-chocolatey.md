---
title: Set up Azure Automation continuous deployment with Chocolatey
description: This article tells how to set up continuous deployment with State Configuration and the Chocolatey package manager.
services: automation
ms.subservice: dsc
ms.date: 08/08/2018
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurepowershell
---
# Set up continuous deployment with Chocolatey

In a DevOps world, there are many tools to assist with various points in the continuous integration
pipeline. Azure Automation [State Configuration](automation-dsc-overview.md) is a welcome new addition to the options that DevOps teams can employ. 

Azure Automation is a managed service in Microsoft Azure that allows you to automate various tasks using runbooks, nodes, and shared resources, such as credentials, schedules, and global variables. Azure Automation State Configuration extends this automation capability to include PowerShell Desired State Configuration (DSC) tools. Here's a great [overview](automation-dsc-overview.md).

This article demonstrates how to set up Continuous Deployment (CD) for a Windows computer. You can easily extend the technique to include as many Windows computers as necessary in
the role, for example, a website, and go from there to additional roles.

![Continuous Deployment for IaaS VMs](./media/automation-dsc-cd-chocolatey/cdforiaasvm.png)

## At a high level

There's quite a bit going on here, but fortunately it can be broken down into two main processes:

- Writing code and testing it, then creating and publishing installation packages for major and minor versions of the system.
- Creating and managing VMs that install and execute the code in the packages.  

Once both of these core processes are in place, it's easy to automatically update the package on your VMs as new versions are created and deployed.

## Component overview

Package managers such as [apt-get](https://en.wikipedia.org/wiki/Advanced_Packaging_Tool) are well known in the Linux world, but not so much in the Windows world.
[Chocolatey](https://chocolatey.org/) is such a thing, and Scott Hanselman's
[blog](https://www.hanselman.com/blog/IsTheWindowsUserReadyForAptget.aspx) on the topic is a great
introduction. In a nutshell, Chocolatey allows you to use the command line to install packages from a central repository onto a Windows operating system. You can create and manage your own
repository, and Chocolatey can install packages from any number of repositories that you designate.

[PowerShell DSC](/powershell/scripting/dsc/overview/overview) is a PowerShell tool that allows you to declare the configuration that you want for a machine. For example, if you want Chocolatey installed, IIS installed, port 80 opened, and version 1.0.0 of your
website installed, the DSC Local Configuration Manager (LCM) implements that configuration. A DSC
pull server holds a repository of configurations for your machines. The LCM on each machine checks
in periodically to see if its configuration matches the stored configuration. It can either report
status or attempt to bring the machine back into alignment with the stored configuration. You can
edit the stored configuration on the pull server to cause a machine or set of machines to come into
alignment with the changed configuration.

A DSC resource is a module of code that has specific capabilities, such as managing networking,
Active Directory, or SQL Server. The Chocolatey DSC Resource knows how to access a NuGet Server
(among others), download packages, install packages, and so on. There are many other DSC Resources
in the [PowerShell Gallery](https://www.powershellgallery.com/packages?q=dsc+resources&prerelease=&sortOrder=package-title). You install these modules on your Azure Automation State Configuration pull server for use by your configurations.

Resource Manager templates provide a declarative way of generating your infrastructure, for example, networks, subnets, network security and routing, load balancers, NICs, VMs, and so on. Here's
an [article](../azure-resource-manager/management/deployment-models.md) that compares the
Resource Manager deployment model (declarative) with the Azure Service Management (ASM or classic)
deployment model (imperative). This article includes a discussion of the core resource providers: compute, storage, and
network.

One key feature of a Resource Manager template is its ability to install a VM extension into the
VM as it's provisioned. A VM extension has specific capabilities, such as running a custom script,
installing anti-virus software, and running a DSC configuration script. There are many other types
of VM extensions.

## Quick trip around the diagram

Starting at the top, you write your code, build it, test it, then create an installation package. Chocolatey can handle various types of installation packages, such as MSI, MSU, ZIP. And you have the full power of PowerShell to do the actual installation if Chocolatey's native capabilities
aren't up to it. Put the package into some place reachable - a package repository. This usage
example uses a public folder in an Azure blob storage account, but it can be anywhere. Chocolatey
works natively with NuGet servers and a few others for management of package metadata. [This article](https://github.com/chocolatey/choco/wiki/How-To-Host-Feed) describes the options. The usage example uses NuGet. A Nuspec is metadata about your packages. The Nuspec information is compiled into a NuPkg and stored on a NuGet server. When your configuration requests a package by name and references a NuGet server, the Chocolatey DSC resource on the VM grabs the package and installs it. You can also request a specific version of a package.

In the bottom left of the picture, there's an Azure Resource Manager template. In this usage example, the VM extension registers the VM with the Azure Automation State Configuration pull server as a node. The configuration is stored in the pull server twice: once as plain text and once compiled as a MOF file. In the Azure portal, the MOF represents a node configuration, as opposed to a simple configuration. It's the artifact that's associated with a node so the node will know its configuration. Details below show how to assign the node configuration to the node.

Creating the Nuspec, compiling it, and storing it in a NuGet server is a small thing. And you're already managing VMs. 

Taking the next step to continuous deployment requires setting up the pull server one time, registering your nodes
with it one time, and creating and storing the initial configuration on the server. As packages are upgraded and deployed to the repository, you only have to refresh the configuration and node configuration on the pull server as needed.

If you're not starting with a Resource Manager template, that's fine. There are PowerShell commands to help you register your VMs with the pull server. For more information, see [Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

## About the usage example

The usage example in this article starts with a VM from a generic Windows Server 2012 R2 image from the Azure
gallery. You can start from any stored image and then tweak from there with the DSC configuration.
However, changing configuration that is baked into an image is much harder than dynamically
updating the configuration using DSC.

You don't have to use a Resource Manager template and the VM extension to use this technique with
your VMs. And your VMs don't have to be on Azure to be under CD management. All that's necessary is
that Chocolatey be installed and the LCM configured on the VM so it knows where the pull server is.

When you update a package on a VM that's in production, you need to take that VM out of
rotation while the update is installed. How you do this varies widely. For example, with a VM
behind an Azure Load Balancer, you can add a Custom Probe. While updating the VM, have the probe
endpoint return a 400. The tweak necessary to cause this change can be inside your configuration,
as can the tweak to switch it back to returning a 200 once the update is complete.

Full source for this usage example is in [this Visual Studio project](https://github.com/sebastus/ARM/tree/master/CDIaaSVM) on GitHub.

## Step 1: Set up the pull server and Automation account

At an authenticated (`Connect-AzAccount`) PowerShell command line: (can take a few minutes while the pull server is set up)

```azurepowershell-interactive
New-AzResourceGroup -Name MY-AUTOMATION-RG -Location MY-RG-LOCATION-IN-QUOTES
New-AzAutomationAccount -ResourceGroupName MY-AUTOMATION-RG -Location MY-RG-LOCATION-IN-QUOTES -Name MY-AUTOMATION-ACCOUNT
```

You can put your Automation account into any of the following regions (also known as locations): East US 2,
South Central US, US Gov Virginia, West Europe, Southeast Asia, Japan East, Central India and
Australia Southeast, Canada Central, North Europe.

## Step 2: Make VM extension tweaks to the Resource Manager template

Details for VM registration (using the PowerShell DSC VM extension) provided in this [Azure
Quickstart
Template](https://github.com/Azure/azure-quickstart-templates/tree/master/dsc-extension-azure-automation-pullserver).
This step registers your new VM with the pull server in the list of State Configuration Nodes. Part of this
registration is specifying the node configuration to be applied to the node. This node
configuration doesn't have to exist yet in the pull server, so it's fine that step 4 is where this is
done for the first time. But here in Step 2 you do need to have decided the name of the node and
the name of the configuration. In this usage example, the node is 'isvbox' and the configuration is
'ISVBoxConfig'. So the node configuration name (to be specified in DeploymentTemplate.json) is
'ISVBoxConfig.isvbox'.

## Step 3: Add required DSC resources to the pull server

The PowerShell Gallery is instrumented to install DSC resources into your Azure Automation account.
Navigate to the resource you want and click the "Deploy to Azure Automation" button.

![PowerShell Gallery example](./media/automation-dsc-cd-chocolatey/xNetworking.PNG)

Another technique recently added to the Azure portal allows you to pull in new modules or update
existing modules. Click through the Automation account resource, the Assets tile, and finally the
Modules tile. The Browse Gallery icon allows you to see the list of modules in the gallery, drill
down into details and ultimately import into your Automation account. This is a great way to keep
your modules up to date from time to time. And, the import feature checks dependencies with other
modules to ensure nothing gets out of sync.

There's also a manual approach, used only once per resource, unless you want to upgrade it later. For more information on authoring PowerShell integration modules, see [Authoring Integration Modules for Azure Automation](https://azure.microsoft.com/blog/authoring-integration-modules-for-azure-automation/).

>[!NOTE]
>The folder structure of a PowerShell integration module for a Windows computer is a little different from the folder structure expected by the Azure Automation. 

1. Install [Windows Management Framework v5](https://aka.ms/wmf5latest) (not needed for Windows 10).

2. Install the integration module.

    ```azurepowershell-interactive
    Install-Module -Name MODULE-NAME`    <—grabs the module from the PowerShell Gallery
    ```

3. Copy the module folder from **c:\Program Files\WindowsPowerShell\Modules\MODULE-NAME** to a temporary folder.

4. Delete samples and documentation from the main folder.

5. Zip the main folder, naming the ZIP file with the name of the folder.

6. Put the ZIP file into a reachable HTTP location, such as blob storage in an Azure Storage account.

7. Run the following command.

    ```azurepowershell-interactive
    New-AzAutomationModule `
      -ResourceGroupName MY-AUTOMATION-RG -AutomationAccountName MY-AUTOMATION-ACCOUNT `
      -Name MODULE-NAME -ContentLinkUri 'https://STORAGE-URI/CONTAINERNAME/MODULE-NAME.zip'
    ```

The included example implements these steps for cChoco and xNetworking. 

## Step 4: Add the node configuration to the pull server

There's nothing special about the first time you import your configuration into the pull server and
compile. All later imports or compilations of the same configuration look exactly the same. Each time
you update your package and need to push it out to production you do this step after ensuring the
configuration file is correct - including the new version of your package. Here's the configuration file **ISVBoxConfig.ps1**:

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

Here is the **New-ConfigurationScript.ps1** script (modified to use the Az module):

```powershell
Import-AzAutomationDscConfiguration `
    -ResourceGroupName MY-AUTOMATION-RG -AutomationAccountName MY-AUTOMATION-ACCOUNT `
    -SourcePath C:\temp\AzureAutomationDsc\ISVBoxConfig.ps1 `
    -Published -Force

$jobData = Start-AzAutomationDscCompilationJob `
    -ResourceGroupName MY-AUTOMATION-RG -AutomationAccountName MY-AUTOMATION-ACCOUNT `
    -ConfigurationName ISVBoxConfig

$compilationJobId = $jobData.Id

Get-AzAutomationDscCompilationJob `
    -ResourceGroupName MY-AUTOMATION-RG -AutomationAccountName MY-AUTOMATION-ACCOUNT `
    -Id $compilationJobId
```

These steps result in a new node configuration named **ISVBoxConfig.isvbox** being placed on the pull server. The node configuration name is built as `configurationName.nodeName`.

## Step 5: Create and maintain package metadata

For each package that you put into the package repository, you need a Nuspec that describes it. It must be compiled and stored on your NuGet server. This process is described
[here](https://docs.nuget.org/create/creating-and-publishing-a-package). 

You can use **MyGet.org** as a NuGet server. You can buy this service, but thee is a free starter SKU. At [NuGet](https://www.nuget.org/), you'll find instructions on installing your own NuGet server for your private packages.

## Step 6: Tie it all together

Each time a version passes QA and is approved for deployment, the package is created, and nuspec and
nupkg are updated and deployed to the NuGet server. The configuration (step 4) must also
be updated to agree with the new version number. It must then be sent to the pull server and compiled.

From that point on, it's up to the VMs that depend on that configuration to pull the update and
install it. Each of these updates is simple - just a line or two of PowerShell. For Azure DevOps, some of them are encapsulated in build tasks that can be chained
together in a build. This
[article](https://www.visualstudio.com/docs/alm-devops-feature-index#continuous-delivery)
provides more details. This [GitHub repo](https://github.com/Microsoft/vso-agent-tasks) details the available build tasks.

## Related articles
* [Azure Automation DSC overview](automation-dsc-overview.md)
* [Onboarding machines for management by Azure Automation DSC](automation-dsc-onboarding.md)

## Next steps

- For an overview, see [Azure Automation State Configuration overview](automation-dsc-overview.md).
- To get started using the feature, see [Get started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compile DSC configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).

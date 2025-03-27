---
title: Compile DSC configurations in Azure Automation State Configuration
description: This article tells how to compile Desired State Configuration (DSC) configurations for Azure Automation.
services: automation
ms.subservice: desired-state-config
ms.date: 10/22/2024
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.service: azure-automation
---

# Compile DSC configurations in Azure Automation State Configuration

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

You can compile Desired State Configuration (DSC) configurations in Azure Automation State
Configuration in the following ways:

- Azure State Configuration compilation service
  - Beginner method with interactive user interface
   - Easily track job state

- Windows PowerShell
  - Call from Windows PowerShell on local workstation or build service
  - Integrate with development test pipeline
  - Provide complex parameter values
  - Work with node and non-node data at scale
  - Significant performance improvement

You can also use Azure Resource Manager templates with Azure Desired State Configuration (DSC)
extension to push configurations to your Azure VMs. The Azure DSC extension uses the Azure VM Agent
framework to deliver, enact, and report on DSC configurations running on Azure VMs. For compilation
details using Azure Resource Manager templates, see
[Desired State Configuration extension with Azure Resource Manager templates][08].

## Compile a DSC configuration in Azure State Configuration

### Portal

1. In your Automation account, select **State configuration (DSC)**.
1. Select on the **Configurations** tab, then select on the configuration name to compile.
1. Select **Compile**.
1. If the configuration has no parameters, you're prompted to confirm if you want to compile it. If
   the configuration has parameters, the **Compile Configuration** pane opens so that you can
   provide parameter values.
1. The Compilation Job page is opened so that you can track compilation job status. You can also use
   this page to track the node configurations (MOF configuration documents) placed on the Azure
   Automation State Configuration pull server.

### Azure PowerShell

You can use [Start-AzAutomationDscCompilationJob][15] to start compiling with Windows PowerShell.
The following sample code begins compilation of a DSC configuration called **SampleConfig**.

```powershell
Start-AzAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'SampleConfig'
```

`Start-AzAutomationDscCompilationJob` returns a compilation job object that you can use to track job
status. You can then use this compilation job object with [Get-AzAutomationDscCompilationJob][12] to
determine the status of the compilation job, and [Get-AzAutomationDscCompilationJobOutput][13] to
view its streams (output). The following sample starts compilation of the SampleConfig
configuration, waits until it completes, and then displays its streams.

```powershell
$CompilationJob = Start-AzAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'SampleConfig'

while($null -eq $CompilationJob.EndTime -and $null -eq $CompilationJob.Exception)
{
    $CompilationJob = $CompilationJob | Get-AzAutomationDscCompilationJob
    Start-Sleep -Seconds 3
}

$CompilationJob | Get-AzAutomationDscCompilationJobOutput –Stream Any
```

### Declare basic parameters

Parameter declaration in DSC configurations, including parameter types and properties, works the
same as in Azure Automation runbooks. To learn more about runbook parameters, see
[Starting a runbook in Azure Automation][07].

The following example uses `FeatureName` and `IsPresent` parameters to determine the values of
properties in the **ParametersExample.sample** node configuration, generated during compilation.

```powershell
Configuration ParametersExample
{
    param(
        [Parameter(Mandatory=$true)]
        [string] $FeatureName,

        [Parameter(Mandatory=$true)]
        [boolean] $IsPresent
    )

    $EnsureString = 'Present'
    if($IsPresent -eq $false)
    {
        $EnsureString = 'Absent'
    }

    Node 'sample'
    {
        WindowsFeature ($FeatureName + 'Feature')
        {
            Ensure = $EnsureString
            Name   = $FeatureName
        }
    }
}
```

You can compile DSC configurations that use basic parameters in the Azure Automation State
Configuration portal or with Azure PowerShell.

#### Portal

In the portal, you can enter parameter values after clicking **Compile**.

![Configuration compile parameters][01]

#### Azure PowerShell

PowerShell requires parameters in a [hashtable][16], where the key matches the parameter name and
the value equals the parameter value.

```powershell
$Parameters = @{
    'FeatureName' = 'Web-Server'
    'IsPresent' = $False
}

Start-AzAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'ParametersExample' -Parameters $Parameters
```

For information about passing `PSCredential` objects as parameters, see [Credential assets][18].

### Compile configurations containing composite resources in Azure Automation

The **Composite Resources** feature allows you to use DSC configurations as nested resources inside
a configuration. This feature enables the application of multiple configurations to a single
resource. See [Composite resources: Using a DSC configuration as a resource][10] to learn more about
composite resources.

> [!NOTE]
> So that configurations containing composite resources compile correctly, you must first import
> into Azure Automation any DSC resources that the composites rely upon. Adding a DSC composite
> resource is no different from adding any PowerShell module to Azure Automation. This process is
> documented in [Manage Modules in Azure Automation][05].

### Manage ConfigurationData when compiling configurations in Azure Automation

`ConfigurationData` is a built-in DSC parameter that allows you to separate structural configuration
from any environment-specific configuration while using PowerShell DSC. For more information, see
[Separating "What" from "Where" in PowerShell DSC][25].

> [!NOTE]
> When compiling in Azure Automation State Configuration, you can use `ConfigurationData` in Azure
> PowerShell but not in the Azure portal.

The following example DSC configuration uses `ConfigurationData` via the `$ConfigurationData` and
`$AllNodes` keywords. You also need the [xWebAdministration module][26] for this example.

```powershell
Configuration ConfigurationDataSample
{
    Import-DscResource -ModuleName xWebAdministration -Name MSFT_xWebsite

    Write-Verbose $ConfigurationData.NonNodeData.SomeMessage

    Node $AllNodes.Where{$_.Role -eq 'WebServer'}.NodeName
    {
        xWebsite Site
        {
            Name         = $Node.SiteName
            PhysicalPath = $Node.SiteContents
            Ensure       = 'Present'
        }
    }
}
```

You can compile the preceding DSC configuration with Windows PowerShell. The following script adds
two node configurations to the Azure Automation State Configuration pull service:
**ConfigurationDataSample.MyVM1** and **ConfigurationDataSample.MyVM3**.

```powershell
$ConfigData = @{
    AllNodes = @(
        @{
            NodeName = 'MyVM1'
            Role = 'WebServer'
        },
        @{
            NodeName = 'MyVM2'
            Role = 'SQLServer'
        },
        @{
            NodeName = 'MyVM3'
            Role = 'WebServer'
        }
    )

    NonNodeData = @{
        SomeMessage = 'I love Azure Automation State Configuration and DSC!'
    }
}

Start-AzAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'ConfigurationDataSample' -ConfigurationData $ConfigData
```

### Work with assets in Azure Automation during compilation

Asset references are the same in both Azure Automation State Configuration and runbooks. For more
information, see the following articles:

- [Certificates][03]
- [Connections][19]
- [Credentials][04]
- [Variables][06]

#### Credential assets

If a configuration has a parameter that specifies a `PSCredential` object, use
`Get-AutomationPSCredential` by passing the name of an Azure Automation credential asset to the
cmdlet to retrieve the credential. Azure Automation passes the credential to the configuration.

To keep the credentials secure in node configurations, encrypt the credentials in the node
configuration MOF file. You must give PowerShell DSC permission to output credentials in plain text
during node configuration MOF generation. PowerShell DSC isn't aware that Azure Automation encrypts
the entire MOF file after its generated by a compilation job.

You can tell PowerShell DSC that it's okay for credentials to be outputted in plain text in the
generated node configuration MOFs using configuration Data. You should pass
`PSDscAllowPlainTextPassword = $true` via `ConfigurationData` for each node block name that appears
in the DSC configuration and uses credentials.

The following example shows a DSC configuration that uses an Automation credential asset.

```powershell
Configuration CredentialSample
{
    Import-DscResource -ModuleName PSDesiredStateConfiguration
    $Cred = Get-AutomationPSCredential 'SomeCredentialAsset'

    Node $AllNodes.NodeName
    {
        File ExampleFile
        {
            SourcePath      = '\\Server\share\path\file.ext'
            DestinationPath = 'C:\destinationPath'
            Credential      = $Cred
        }
    }
}
```

You can compile the preceding DSC configuration with PowerShell. The following PowerShell code adds
two node configurations to the Azure Automation State Configuration pull server:
**CredentialSample.MyVM1** and **CredentialSample.MyVM2**.

```powershell
$ConfigData = @{
    AllNodes = @(
        @{
            NodeName = '*'
            PSDscAllowPlainTextPassword = $True
        },
        @{
            NodeName = 'MyVM1'
        },
        @{
            NodeName = 'MyVM2'
        }
    )
}

Start-AzAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'CredentialSample' -ConfigurationData $ConfigData
```

> [!NOTE]
> When compilation is complete, you might receive the error message
> `The 'Microsoft.PowerShell.Management' module was not imported because the 'Microsoft.PowerShell.Management' snap-in was already imported.`
> You can safely ignore this message.

## Compile your DSC configuration in Windows PowerShell

The process to compile DSC configurations in Windows PowerShell is included in the PowerShell DSC
documentation [Write, Compile, and Apply a Configuration][09]. You can execute this process from a
developer workstation or within a build service, such as [Azure DevOps][24]. You can then import the
MOF files produced by compiling the configuration into the Azure State Configuration service.

Compiling in Windows PowerShell also provides the option to sign configuration content. The DSC
agent verifies a signed node configuration locally on a managed node. Verification ensures that the
configuration applied to the node comes from an authorized source.

You can also import node configurations that were compiled outside of Azure. The import includes
compilation from a developer workstation or in a service such as [Azure DevOps][24]. This approach
has multiple advantages, including performance and reliability.

> [!NOTE]
> A node configuration file must be no larger than 1 MB to allow Azure Automation to import it.

For more information about signing of node configurations, see
[Improvements in WMF 5.1 - How to sign configuration and module][17].

### Import a node configuration in the Azure portal

1. In your Automation account, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select on the **Configurations** tab, then select **Add**.
1. On the Import page, select the folder icon next to the **Node Configuration File** field to browse
   for a node configuration MOF file on your local computer.

   ![Browse for local file][02]

1. Enter a name in the **Configuration Name** field. This name must match the name of the
   configuration from which the node configuration was compiled.
1. Select **OK**.

### Import a node configuration with Azure PowerShell

You can use the [Import-AzAutomationDscNodeConfiguration][14] cmdlet to import a node configuration
into your Automation account.

```powershell
$importAzAutomationDscNodeConfigurationSplat = @{
    AutomationAccountName = 'MyAutomationAccount'
    ResourceGroupName = 'MyResourceGroup'
    ConfigurationName = 'MyNodeConfiguration'
    Path = 'C:\MyConfigurations\TestVM1.mof'
}
Import-AzAutomationDscNodeConfiguration @importAzAutomationDscNodeConfigurationSplat
```

## Next steps

- To get started, see [Get started with Azure Automation State Configuration][22].
- To learn about compiling DSC configurations so that you can assign them to target nodes, see
  [Compile DSC configurations in Azure Automation State Configuration][21].
- For a PowerShell cmdlet reference, see [Az.Automation][11].
- For pricing information, see [Azure Automation State Configuration pricing][23].
- For an example of using State Configuration in a continuous deployment pipeline, see
  [Setup continuous deployment with Chocolatey][20].

<!-- link references -->
[01]: ./media/automation-dsc-compile/DSC_compiling_1.png
[02]: ./media/automation-dsc-compile/import-browse.png
[03]: ./shared-resources/certificates.md
[04]: ./shared-resources/credentials.md
[05]: ./shared-resources/modules.md
[06]: ./shared-resources/variables.md
[07]: ./start-runbooks.md
[08]: /azure/virtual-machines/extensions/dsc-template#details
[09]: /powershell/dsc/configurations/write-compile-apply-configuration#compile-the-configuration
[10]: /powershell/dsc/resources/authoringresourcecomposite
[11]: /powershell/module/az.automation
[12]: /powershell/module/az.automation/get-azautomationdsccompilationjob
[13]: /powershell/module/az.automation/get-azautomationdscconfiguration
[14]: /powershell/module/az.automation/import-azautomationdscnodeconfiguration
[15]: /powershell/module/az.automation/start-azautomationdsccompilationjob
[16]: /powershell/module/microsoft.powershell.core/about/about_hash_tables
[17]: /powershell/scripting/wmf/whats-new/dsc-improvements#dsc-module-and-configuration-signing-validations
[18]: #credential-assets
[19]: automation-connections.md
[20]: automation-dsc-cd-chocolatey.md
[21]: automation-dsc-compile.md
[22]: automation-dsc-getting-started.md
[23]: https://azure.microsoft.com/pricing/details/automation/
[24]: https://dev.azure.com
[25]: https://devblogs.microsoft.com/powershell/separating-what-from-where-in-powershell-dsc/
[26]: https://www.powershellgallery.com/packages/xWebAdministration/

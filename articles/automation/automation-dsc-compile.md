---
title: Compiling configurations in Azure Automation State Configuration
description: This article describes how to compile Desired State Configuration (DSC) configurations for Azure Automation.
services: automation
ms.service: automation
ms.subservice: dsc
author: bobbytreed
ms.author: robreed
ms.date: 09/10/2018
ms.topic: conceptual
manager: carmonm
---
# Compiling DSC configurations in Azure Automation State Configuration

You can compile Desired State Configuration (DSC) configurations in two ways with Azure Automation
State Configuration: in Azure and in Windows PowerShell. The following table helps you
determine when to use which method based on the characteristics of each:

- Azure State Configuration compilation service
  - Beginner method with interactive user interface
   - Easily track job state

- Windows PowerShell
  - Call from Windows PowerShell on local workstation or build service
  - Integrate with development test pipeline
  - Provide complex parameter values
  - Work with node and non-node data at scale
  - Significant performance improvement

## Compiling a DSC Configuration in Azure State Configuration

### Portal

1. From your Automation account, click **State configuration (DSC)**.
1. Click on the **Configurations** tab, then click on the configuration name to compile.
1. Click **Compile**.
1. If the configuration has no parameters, you are prompted to confirm whether you want to compile it. If the configuration has parameters, the **Compile Configuration** blade opens so you can provide parameter values. See the following [**Basic Parameters**](#basic-parameters) section for further details on parameters.
1. The **Compilation Job** page is opened so that you can track the compilation job's status, and the node configurations (MOF configuration documents) it caused to be placed on the Azure Automation State Configuration Pull Server.

### Azure PowerShell

You can use [`Start-AzureRmAutomationDscCompilationJob`](/powershell/module/azurerm.automation/start-azurermautomationdsccompilationjob)
to start compiling with Windows PowerShell. The following sample code starts compilation of a DSC configuration called **SampleConfig**.

```powershell
Start-AzureRmAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'SampleConfig'
```

`Start-AzureRmAutomationDscCompilationJob` returns a compilation job object that you can use to
track its status. You can then use this compilation job object with
[`Get-AzureRmAutomationDscCompilationJob`](/powershell/module/azurerm.automation/get-azurermautomationdsccompilationjob)
to determine the status of the compilation job, and
[`Get-AzureRmAutomationDscCompilationJobOutput`](/powershell/module/azurerm.automation/get-azurermautomationdsccompilationjoboutput)
to view its streams (output). The following sample code starts compilation of the **SampleConfig**
configuration, waits until it has completed, and then displays its streams.

```powershell
$CompilationJob = Start-AzureRmAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'SampleConfig'

while($CompilationJob.EndTime –eq $null -and $CompilationJob.Exception –eq $null)
{
    $CompilationJob = $CompilationJob | Get-AzureRmAutomationDscCompilationJob
    Start-Sleep -Seconds 3
}

$CompilationJob | Get-AzureRmAutomationDscCompilationJobOutput –Stream Any
```

###  Basic Parameters

Parameter declaration in DSC configurations, including parameter types and properties, works the
same as in Azure Automation runbooks. See [Starting a runbook in Azure Automation](automation-starting-a-runbook.md)
to learn more about runbook parameters.

The following example uses two parameters called **FeatureName** and **IsPresent**, to determine
the values of properties in the **ParametersExample.sample** node configuration, generated during
compilation.

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

You can compile DSC Configurations that use basic parameters in the Azure Automation State
Configuration portal or with Azure PowerShell:

#### Portal

In the portal, you can enter parameter values after clicking **Compile**.

![Configuration compile parameters](./media/automation-dsc-compile/DSC_compiling_1.png)

#### Azure PowerShell

PowerShell requires parameters in a [hashtable](/powershell/module/microsoft.powershell.core/about/about_hash_tables)
where the key matches the parameter name, and the value equals the parameter value.

```powershell
$Parameters = @{
    'FeatureName' = 'Web-Server'
    'IsPresent' = $False
}

Start-AzureRmAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'ParametersExample' -Parameters $Parameters
```

For information about passing PSCredentials as parameters, see [Credential Assets](#credential-assets) below.

### Compiling configurations in Azure Automation that contain Composite Resources

**Composite Resources** allow you to use DSC configurations as nested resources inside of a
configuration. This enables you to apply multiple configurations to a single resource. See
[Composite resources: Using a DSC configuration as a resource](/powershell/dsc/authoringresourcecomposite)
to learn more about **Composite Resources**.

> [!NOTE]
> In order for configurations containing **Composite Resources** to compile correctly, you must first ensure that any DSC Resources that the composite relies on are first imported in to Azure Automation.

Adding a DSC **Composite Resource** is no different than adding any PowerShell module to Azure Automation.
The step by step instruction for this process is documented in the article
[Manage Modules in Azure Automation](/azure/automation/shared-resources/modules).

### Managing ConfigurationData when compiling configuration in Azure Automation

**ConfigurationData** allows you to separate structural configuration from any environment-specific
configuration while using PowerShell DSC. See [Separating "What" from "Where" in PowerShell DSC](https://blogs.msdn.com/b/powershell/archive/2014/01/09/continuous-deployment-using-dsc-with-minimal-change.aspx)
to learn more about **ConfigurationData**.

> [!NOTE]
> You can use **ConfigurationData** when compiling in Azure Automation State Configuration using Azure PowerShell but not in the Azure portal.

The following example DSC configuration uses **ConfigurationData** via the **$ConfigurationData**
and **$AllNodes** keywords. You also need the [**xWebAdministration** module](https://www.powershellgallery.com/packages/xWebAdministration/)
for this example:

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

You can compile the preceding DSC configuration with Windows PowerShell. The following script adds two
node configurations to the Azure Automation State Configuration Pull Service:
**ConfigurationDataSample.MyVM1** and **ConfigurationDataSample.MyVM3**:

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

Start-AzureRmAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'ConfigurationDataSample' -ConfigurationData $ConfigData
```

### Working with Assets in Azure Automation during compilation

Asset references are the same in Azure Automation State Configuration and runbooks. For more information, see the
following:

- [Certificates](automation-certificates.md)
- [Connections](automation-connections.md)
- [Credentials](automation-credentials.md)
- [Variables](automation-variables.md)

#### Credential Assets

DSC configurations in Azure Automation can reference Automation credential assets using the 
`Get-AutomationPSCredential` cmdlet. If a configuration has a parameter that has a **PSCredential**
type, then you can use the `Get-AutomationPSCredential` cmdlet by passing the string name
of an Azure Automation credential asset to the cmdlet to retrieve the credential. You can then use
that object for the parameter requiring the **PSCredential** object. Behind the scenes, the Azure
Automation credential asset with that name is retrieved and passed to the configuration. The
example below shows this in action.

Keeping credentials secure in node configurations (MOF configuration documents) requires encrypting
the credentials in the node configuration MOF file. However, currently you must tell PowerShell DSC
it is okay for credentials to be outputted in plain text during node configuration MOF generation,
because PowerShell DSC doesn’t know that Azure Automation will be encrypting the entire MOF file
after its generation via a compilation job.

You can tell PowerShell DSC that it is okay for credentials to be outputted in plain text in the
generated node configuration MOFs using Configuration Data. You should
pass `PSDscAllowPlainTextPassword = $true` via **ConfigurationData** for each node block’s name
that appears in the DSC configuration and uses credentials.

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

You can compile the preceding DSC configuration with PowerShell. The following PowerShell adds two
node configurations to the Azure Automation State Configuration Pull Server:
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

Start-AzureRmAutomationDscCompilationJob -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'MyAutomationAccount' -ConfigurationName 'CredentialSample' -ConfigurationData $ConfigData
```

> [!NOTE]
> When compilation is complete you may receive an error stating: **The 'Microsoft.PowerShell.Management' module was not imported because the 'Microsoft.PowerShell.Management' snap-in was already imported.** This warning can safely be ignored.

## Compiling configurations in Windows PowerShell and publishing to Azure Automation

You can also import node configurations (MOFs) that have been compiled outside of Azure.
This includes compiling from a developer workstation or in a service such as
[Azure DevOps](https://dev.azure.com).
There are multiple advantages to this approach including performance and reliability.
Compiling in Windows PowerShell also provides the option to sign configuration content.
A signed node configuration is verified locally on a managed node by the DSC agent,
ensuring that the configuration being applied to the node comes from an authorized source.

> [!NOTE]
> A node configuration file must be no larger than 1 MB to allow it to be imported into Azure Automation.

For more information about how to sign node configurations, see [Improvements in WMF 5.1 - How to sign configuration and module](/powershell/wmf/5.1/dsc-improvements#dsc-module-and-configuration-signing-validations).

### Compiling a configuration in Windows PowerShell

The process to compile DSC configurations in Windows PowerShell is included in the PowerShell DSC documentation
[Write, Compile, and Apply a Configuration](/powershell/dsc/configurations/write-compile-apply-configuration#compile-the-configuration).
This can be executed from a developer workstation or within a build service such as
[Azure DevOps](https://dev.azure.com).

The MOF file or files produced by compiling the configuration can then be imported directly
in to the Azure State Configuration service.

### Importing a node configuration in the Azure portal

1. From your Automation account, click **State configuration (DSC)** under **Configuration Management**.
1. In the **State configuration (DSC)** page, click on the **Configurations** tab, then click **+ Add**.
1. In the **Import** page, click the folder icon next to the **Node Configuration File** textbox to browse for a node configuration file (MOF) on your local computer.

   ![Browse for local file](./media/automation-dsc-compile/import-browse.png)

1. Enter a name in the **Configuration Name** textbox. This name must match the name of the configuration from which the node configuration was compiled.
1. Click **OK**.

### Importing a node configuration with Azure PowerShell

You can use the [Import-AzureRmAutomationDscNodeConfiguration](/powershell/module/azurerm.automation/import-azurermautomationdscnodeconfiguration)
cmdlet to import a node configuration into your automation account.

```powershell
Import-AzureRmAutomationDscNodeConfiguration -AutomationAccountName 'MyAutomationAccount' -ResourceGroupName 'MyResourceGroup' -ConfigurationName 'MyNodeConfiguration' -Path 'C:\MyConfigurations\TestVM1.mof'
```

## Next steps

- To get started, see [Getting started with Azure Automation State Configuration](automation-dsc-getting-started.md)
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compiling configurations in Azure Automation State Configuration](automation-dsc-compile.md)
- For PowerShell cmdlet reference, see [Azure Automation State Configuration cmdlets](/powershell/module/azurerm.automation/#automation)
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/)
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous Deployment Using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md)

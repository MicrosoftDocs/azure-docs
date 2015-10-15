<properties 
   pageTitle="Compiling Configurations in Azure Automation DSC | Microsoft Azure" 
   description="Overview of two ways to compile Desired State Configuration (DSC) configurations: In the Azure portal, and with Windows PowerShell. " 
   services="automation" 
   documentationCenter="dev-center-name" 
   authors="coreyp-at-msft" 
   manager="stevenka" 
   editor="tysonn"/>

<tags
   ms.service="automation"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="TBD" 
   ms.date="10/15/2015"
   ms.author="coreyp"/>
   
#Compiling Configurations in Azure Automation DSC#

You can compile Desired State Configuration (DSC) configurations in two ways with Azure Automation: In the Azure portal, and with Windows PowerShell. The following table will help you determine when to use which method based on the characteristics of each: 

<table>
 <tr>
  <td>METHOD</td>
  <td>CHARACTERISTICS</td>
 </tr>
 <tr>           
  <td><a href="#starting-a-runbook-with-the-azure-portal">Azure portal</a></td>
  <td>
   <ul>
    <li>Simplest method with interactive user interface.</li>
    <li>Form to provide simple parameter values.</li>
    <li>Easily track job state.</li>
    <li>Access authenticated with Azure logon.</li>
   </ul>
  </td>
 </tr>
 <tr>
  <td><a href="https://msdn.microsoft.com/library/dn690259.aspx">Windows PowerShell</a></td>
  <td>
   <ul>
     <li>Call from command line with Windows PowerShell cmdlets.</li>
     <li>Can be included in automated solution with multiple steps.</li>
     <li>Request is authenticated with certificate or OAuth user principal / service  principal.</li>
     <li>Provide simple and complex parameter values.</li>
     <li>Track job state.</li>
     <li>Client required to support PowerShell cmdlets.</li>
   </ul>
  </td>
 </tr>

   </ul>
  </td>
 </tr>
</table>
<br>

Once you have decided on a compilation method, you can follow the respective procedures below to start compiling.

##Compiling a DSC Configuration with the Azure preview portal##

1.  From your automation account, click **Configurations**.
2.  Click a configuration to open its blade.
3.  Click **Compile**.
4.  If the configuration has no parameters, you will be prompted to confirm whether you want to compile it. If the configuration has parameters, the **Compile Configuration** blade will open so you can provide parameter values. See the [Basic Parameters](#basic parameters) section below for further details on parameters.
5.  The **Compilation Job** blade is opened so that you can track the compilation job's status, and the node configurations (MOF configuration documents) it caused to be placed on the Azure Automation DSC Pull Server.

##Compiling a DSC Configuration with Windows PowerShell##

You can use [`Start-AzureRmAutomationDscCompilationJob`](https://msdn.microsoft.com/en-us/library/mt244118.aspx) to start compiling with Windows PowerShell. The following sample code starts compilation of a DSC configuration called **SampleConfig**.

    Start-AzureRmAutomationDscCompilationJob -ResourceGroupName "MyResourceGroup" -AutomationAccountName "MyAutomationAccount" -ConfigurationName "SampleConfig" 
 
`Start-AzureRmAutomationDscCompilationJob` returns a compilation job object that you can use to track its status. You can then use this compilation job object with [`Get-AzureRmAutomationDscCompilationJob`](https://msdn.microsoft.com/library/mt244120.aspx) to determine the status of the compilation job, and [`Get-AzureRmAutomationDscCompilationJobOutput`](https://msdn.microsoft.com/en-us/library/mt244103.aspx) to view its streams (output). The following sample code starts compilation of the **SampleConfig** configuration, waits until it has completed, and then displays its streams.
    
    $CompilationJob = Start-AzureRmAutomationDscCompilationJob -ResourceGroupName "MyResourceGroup" -AutomationAccountName "MyAutomationAccount" -ConfigurationName "SampleConfig"
    
    while($CompilationJob.EndTime –eq $null -and $CompilationJob.Exception –eq $null)       	{$CompilationJob = $CompilationJob | Get-AzureRmAutomationDscCompilationJob
    	Start-Sleep -Seconds 3
    
    }
    
    $CompilationJob | Get-AzureRmAutomationDscCompilationJobOutput –Stream Any 


##Basic Parameters##

Parameter declaration in DSC configurations, including parameter types and properties, works the same as in Azure Automation runbooks. See [Starting a runbook in Azure Automation](https://azure.microsoft.com/documentation/articles/automation-starting-a-runbook/#runbook-parameters) to learn more about runbook parameters.

The following example uses two parameters called **FeatureName** and **IsPresent**, to determine the values of properties in the **ParametersExample.sample** node configuration, generated during compilation.

    Configuration ParametersExample {
    	param(
    		[Parameter(Mandatory=$true)]
    
    		[string] $FeatureName,
    
    		[Parameter(Mandatory=$true)]
    		[boolean] $IsPresent
    
    )
    
    $EnsureString = "Present"
    if($IsPresent -eq $false) {
    	$EnsureString = "Absent"
    
    }
    
    Node "sample" {
    
    	WindowsFeature ($FeatureName + "Feature") {
    		Ensure = $EnsureString
    		Name = $FeatureName
    		}
    
    	}
    
    }

You can compile DSC Configurations that use basic parameters in the Azure Automation DSC portal, or Azure PowerShell:

###Portal###

In the portal, you can enter parameter values after clicking **Compile**.

![](./media/automation-dsc-compiling/DSC_compiling_1.png)

###PowerShell###

PowerShell requires parameters in a [hashtable](http://technet.microsoft.com/library/hh847780.aspx) where the key matches the parameter name, and the value equals the parameter value.

    $Parameters = @{
    		"FeatureName" = "Web-Server"
    		"IsPresent" = $False
    }
    
    
    Start-AzureRMAutomationDscCompilationJob -ResourceGroupName "MyResourceGroup" -AutomationAccountName "MyAutomationAccount" -ConfigurationName "ParametersExample" -Parameters $Parameters 
    

For information about passing PSCredentials as parameters, see [Credential Assets](#aredential assets) below.

###ConfigurationData###

**ConfigurationData** allows you to separate structural configuration from any environment specific configuration while using PowerShell DSC. See [Separating "What" from "Where" in PowerShell DSC](http://blogs.msdn.com/b/powershell/archive/2014/01/09/continuous-deployment-using-dsc-with-minimal-change.aspx) to learn more about **ConfigurationData**.

>[AZURE.NOTE] You can use **ConfigurationData** when compiling in Azure Automation DSC using Azure PowerShell, but not in the Azure portal.

The following example DSC configuration uses **ConfigurationData** via the **$ConfigurationData** and **$AllNodes** keywords. You'll also need the [**xWebAdministration** module](https://www.powershellgallery.com/packages/xWebAdministration/)

     Configuration ConfigurationDataSample {
    	Import-DscResource -ModuleName xWebAdministration 
     -Name MSFT_xWebsite
    
    	Write-Verbose $ConfigurationData.NonNodeData.SomeMessage 
    
    	Node $AllNodes.Where{$_.Role -eq "WebServer"}.NodeName
    	{
    
    		xWebsite Site
    		{
    
    			Name = $Node.SiteName
    			PhysicalPath = $Node.SiteContents
    			Ensure   = "Present"
    		}
    
    	}
 
    }

You can compile the DSC configuration above with PowerShell, which adds two node configurations to the Azure Automation DSC Pull Server: **ConfigurationDataSample.MyVM1** and **ConfigurationDataSample.MyVM3**:

    $ConfigData = @{
    	AllNodes = @(
			@{
    			NodeName = "MyVM1"
    			Role = "WebServer"
    		},
    		@{
    			NodeName = "MyVM2"
    			Role = "SQLServer"
    		},
    		@{
    			NodeName = "MyVM3"
    			Role = "WebServer"
    
    		}
    
    	)
    
    	NonNodeData = @{
    		SomeMessage = "I love Azure Automation DSC!"
    
    	}
    
    } 
    
    Start-AzureRmAutomationDscCompilationJob -ResourceGroupName "MyResourceGroup" -AutomationAccountName "MyAutomationAccount" -ConfigurationName "ConfigurationDataSample" -ConfigurationData $ConfigData


##Assets##

Asset references are the same in Azure Automation DSC configurations and runbooks. See the following for more information:

- [Certificates](https://azure.microsoft.com/en-us/documentation/articles/automation-certificates/)
- [Connections](https://azure.microsoft.com/en-us/documentation/articles/automation-connections/)
- [Credentials](https://azure.microsoft.com/en-us/documentation/articles/automation-credentials/)
- [Variables](https://azure.microsoft.com/en-us/documentation/articles/automation-variables/)

##Credential Assets##
While DSC Configurations in Azure Automation can reference credential assets using **Get-AutomationPSCredential**, credential assets can also be passed in via parameters, if desired. If a configuration takes a parameter of **PSCredential** type, then you need to pass the string name of a Azure Automation credential asset as that parameter’s value, rather than a PSCredential object. Behind the scenes, the Azure Automation credential asset with that name will be retrieved and passed to the configuration.

Keeping credentials secure in node configurations (MOF configuration documents) requires encrypting the credentials in the node configuration MOF file. Azure Automation takes this one step further and encrypts the entire MOF file. However, currently you must tell PowerShell DSC it is okay for credentials to be outputted in plain text during node configuration MOF generation, because PowerShell DSC doesn’t know that Azure Automation will be encrypting the entire MOF file after its generation via a compilation job.

You can tell PowerShell DSC that it is okay for credentials to be outputted in plain text in the generated Node Configuration MOFs using [**ConfigurationData**](#configuration data). You should pass `PSDscAllowPlainTextPassword = $true` via **ConfigurationData** for each node block’s name that appears in the DSC Configuration and uses credentials.

The following example shows a DSC configuration that uses an Automation credential asset.

    Configuration CredentialSample {
    
       $Cred = Get-AutomationPSCredential -Name "SomeCredentialAsset"
    
    	Node $AllNodes.NodeName { 
    
    		File ExampleFile { 
    			SourcePath = "\\Server\share\path\file.ext" 
    			DestinationPath = "C:\destinationPath" 
    			Credential = $Cred 
    
       		}
    
    	}
    
    }

You can compile the DSC configuration above with PowerShell, which adds two node configurations to the Azure Automation DSC Pull Server:  **CredentialSample.MyVM1** and **CredentialSample.MyVM2**.


    $ConfigData = @{
    	AllNodes = @(
    		 @{
    			NodeName = "*"
    			PSDscAllowPlainTextPassword = $True
    		},
    
    		@{
    			NodeName = "MyVM1"
    		},
    
    		@{
    			NodeName = "MyVM2"
    		}
    	)
    } 
    
    
    
    Start-AzureRmAutomationDscCompilationJob -ResourceGroupName "MyResourceGroup" -AutomationAccountName "MyAutomationAccount" -ConfigurationName "CredentialSample" -ConfigurationData $ConfigData


##Related Articles##

- [Azure Automation DSC overview](https://azure.microsoft.com/en-us/documentation/articles/automation-dsc-overview/)
- [Azure Automation DSC cmdlets](https://msdn.microsoft.com/library/mt244122.aspx)
- [Azure Automation Runbook parameters](https://azure.microsoft.com/en-us/documentation/articles/automation-starting-a-runbook/#runbook-parameters)
- [ConfigurationData in PowerShell Desired State Configuration](http://blogs.msdn.com/b/powershell/archive/2014/01/09/continuous-deployment-using-dsc-with-minimal-change.aspx)

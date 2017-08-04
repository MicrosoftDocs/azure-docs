---
title: Run runbooks on Azure Automation Hybrid Runbook Worker | Microsoft Docs
description: This article provides information about running runbooks on machines in your local datacenter or cloud provider with the Hybrid Runbook Worker role.
services: automation
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 06227cda-f3d1-47fe-b3f8-436d2b9d81ee
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/22/2017
ms.author: magoedte
---

# Running runbooks on a Hybrid Runbook Worker 
There is no difference in the structure of runbooks that run in Azure Automation and those that run on a Hybrid Runbook Worker. Runbooks that you use with each most likely differ significantly though since runbooks targeting a Hybrid Runbook Worker typically manage resources on the local computer itself or against resources in the local environment where it is deployed, while runbooks in Azure Automation typically manage resources in the Azure cloud.

You can edit a runbook for Hybrid Runbook Worker in Azure Automation, but you may have difficulties if you try to test the runbook in the editor.  The PowerShell modules that access the local resources may not be installed in your Azure Automation environment in which case, the test would fail.  If you do install the required modules, then the runbook will run, but it will not be able to access local resources for a complete test.

## Starting a runbook on Hybrid Runbook Worker
[Starting a Runbook in Azure Automation](automation-starting-a-runbook.md) describes different methods for starting a runbook.  Hybrid Runbook Worker adds a **RunOn** option where you can specify the name of a Hybrid Runbook Worker Group.  If a group is specified, then the runbook is retrieved and run by of the workers in that group.  If this option is not specified, then it is run in Azure Automation as normal.

When you start a runbook in the Azure portal, you are presented with a **Run on** option where you can select **Azure** or **Hybrid Worker**.  If you select **Hybrid Worker**, then you can select the group from a dropdown.

Use the **RunOn** parameter.  You can use the following command to start a runbook named Test-Runbook on a Hybrid Runbook Worker Group named MyHybridGroup using Windows PowerShell.

    Start-AzureRmAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" -RunOn "MyHybridGroup"

> [!NOTE]
> The **RunOn** parameter was added to the **Start-AzureAutomationRunbook** cmdlet in version 0.9.1 of Microsoft Azure PowerShell.  You should [download the latest version](https://azure.microsoft.com/downloads/) if you have an earlier one installed.  You only need to install this version on a workstation where you are starting the runbook from Windows PowerShell.  You do not need to install it on the worker computer unless you intend to start runbooks from that computer.  You cannot currently start a runbook on a Hybrid Runbook Worker from another runbook since this would require the latest version of Azure Powershell to be installed in your Automation account.  The latest version is automatically updated in Azure Automation and automatically pushed down to the workers soon.
>
>

## Runbook permissions
Runbooks running on a Hybrid Runbook Worker cannot use the same method that is typically used for runbooks authenticating to Azure resources, since they are accessing resources outside of Azure.  The runbook can either provide its own authentication to local resources, or you can specify a RunAs account to provide a user context for all runbooks.

### Runbook authentication
By default, runbooks will run in the context of the local System account on the on-premises computer, so they must provide their own authentication to resources that they will access.  

You can use [Credential](http://msdn.microsoft.com/library/dn940015.aspx) and [Certificate](http://msdn.microsoft.com/library/dn940013.aspx) assets in your runbook with cmdlets that allow you to specify credentials so you can authenticate to different resources.  The following example shows a portion of a runbook that restarts a computer.  It retrieves credentials from a credential asset and the name of the computer from a variable asset and then uses these values with the Restart-Computer cmdlet.

    $Cred = Get-AzureRmAutomationCredential -ResourceGroupName "ResourceGroup01" -Name "MyCredential"
    $Computer = Get-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" -Name  "ComputerName"

    Restart-Computer -ComputerName $Computer -Credential $Cred

You can also leverage [InlineScript](automation-powershell-workflow.md#inlinescript), which  allows you to run blocks of code on another computer with credentials specified by the [PSCredential common parameter](http://technet.microsoft.com/library/jj129719.aspx).

### RunAs account
Instead of having runbooks provide their own authentication to local resources, you can specify a **RunAs** account for a Hybrid worker group.  You specify a [credential asset](automation-credentials.md) that has access to local resources, and all runbooks run under these credentials when running on a Hybrid Runbook Worker in the group.  

The user name for the credential must be in one of the following formats:

* domain\username
* username@domain
* username (for accounts local to the on-premises computer)

Use the following procedure to specify a RunAs account for a Hybrid worker group:

1. Create a [credential asset](automation-credentials.md) with access to local resources.
2. Open the Automation account in the Azure portal.
3. Select the **Hybrid Worker Groups** tile, and then select the group.
4. Select **All settings** and then **Hybrid worker group settings**.
5. Change **Run As** from **Default** to **Custom**.
6. Select the credential and click **Save**.

### Automation Run As account
As part of your automated build process for deploying resources in Azure, you may require access to on-premise systems to support a task or set of steps in your deployment sequence.  To support authentication against Azure using the Run As account, you need to install the Run As account certificate.  

The following PowerShell runbook, *Export-RunAsCertificateToHybridWorker*, exports the Run As certificate from your Azure Automation account and downloads and imports it into the local machine certificate store on a Hybrid worker connected to the same account.  Once that step is completed, it verifies the worker can successfully authenticate to Azure using the Run As account.

    <#PSScriptInfo
    .VERSION 1.0
    .GUID 3a796b9a-623d-499d-86c8-c249f10a6986
    .AUTHOR Azure Automation Team
    .COMPANYNAME Microsoft
    .COPYRIGHT 
    .TAGS Azure Automation 
    .LICENSEURI 
    .PROJECTURI 
    .ICONURI 
    .EXTERNALMODULEDEPENDENCIES 
    .REQUIREDSCRIPTS 
    .EXTERNALSCRIPTDEPENDENCIES 
    .RELEASENOTES
    #>

    <#  
    .SYNOPSIS  
    Exports the Run As certificate from an Azure Automation account to a hybrid worker in that account. 
  
    .DESCRIPTION  
    This runbook exports the Run As certificate from an Azure Automation account to a hybrid worker in that account.
    Run this runbook in the hybrid worker where you want the certificate installed.
    This allows the use of the AzureRunAsConnection to authenticate to Azure and manage Azure resources from runbooks running in the hybrid worker.

    .EXAMPLE
    .\Export-RunAsCertificateToHybridWorker

    .NOTES
    AUTHOR: Azure Automation Team 
    LASTEDIT: 2016.10.13
    #>

    [OutputType([string])] 

    # Set the password used for this certificate
    $Password = "YourStrongPasswordForTheCert"

    # Stop on errors
    $ErrorActionPreference = 'stop'

    # Get the management certificate that will be used to make calls into Azure Service Management resources
    $RunAsCert = Get-AutomationCertificate -Name "AzureRunAsCertificate"
       
    # location to store temporary certificate in the Automation service host
    $CertPath = Join-Path $env:temp  "AzureRunAsCertificate.pfx"
   
    # Save the certificate
    $Cert = $RunAsCert.Export("pfx",$Password)
    Set-Content -Value $Cert -Path $CertPath -Force -Encoding Byte | Write-Verbose 

    Write-Output ("Importing certificate into $env:computername local machine root store from " + $CertPath)
    $SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
    Import-PfxCertificate -FilePath $CertPath -CertStoreLocation Cert:\LocalMachine\My -Password $SecurePassword -Exportable | Write-Verbose

    # Test that authentication to Azure Resource Manager is working
    $RunAsConnection = Get-AutomationConnection -Name "AzureRunAsConnection" 
    
    Add-AzureRmAccount `
      -ServicePrincipal `
      -TenantId $RunAsConnection.TenantId `
      -ApplicationId $RunAsConnection.ApplicationId `
      -CertificateThumbprint $RunAsConnection.CertificateThumbprint | Write-Verbose

    Set-AzureRmContext -SubscriptionId $RunAsConnection.SubscriptionID | Write-Verbose

    # List automation accounts to confirm Azure Resource Manager calls are working
    Get-AzureRmAutomationAccount | Select AutomationAccountName

Save the *Export-RunAsCertificateToHybridWorker* runbook to your computer with a `.ps1` extension.  Import it into your Automation account and edit the runbook, changing the value of the variable `$Password` with your own password.  Publish and then run the runbook targeting the Hybrid Worker group that run and authenticate runbooks using the Run As account.  The job stream reports the attempt to import the certificate into the local machine store, and follows with multiple lines depending on how many Automation accounts are defined in your subscription and if authentication is successful.  

## Troubleshooting runbooks on Hybrid Runbook Worker
Logs are stored locally on each hybrid worker at C:\ProgramData\Microsoft\System Center\Orchestrator\7.2\SMA\Sandboxes.  Hybrid worker also records errors and events in the Windows event log under **Application and Services Logs\Microsoft-SMA\Operational**.  Events related to runbooks executed on the worker are written to **Application and Services Logs\Microsoft-Automation\Operational**.  The **Microsoft-SMA** log includes many more events related to the runbook job pushed to the worker and the processing of the runbook.  While the **Microsoft-Automation** event log does not have many events with details assisting with the troubleshooting of runbook execution, you will at least find the results of the runbook job.  

[Runbook output and messages](automation-runbook-output-and-messages.md) are sent to Azure Automation from hybrid workers just like runbook jobs run in the cloud.  You can also enable the Verbose and Progress streams the same way you would for other runbooks.  

If your runbooks are not completing successfully and the job summary shows a status of **Suspended**, please review the troubleshooting article [Hybrid Runbook Worker: A runbook job terminates with a status of Suspended](automation-troubleshooting-hybrid-runbook-worker.md#a-runbook-job-terminates-with-a-status-of-suspended).   

## Next steps
* To learn more about the different methods that can be used to start a runbook, see [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md).  
* To understand the different procedures for working with PowerShell and PowerShell Workflow runbooks in Azure Automation using the textual editor, see [Editing a Runbook in Azure Automation](automation-edit-textual-runbook.md)
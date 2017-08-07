---
title: Validate Azure Automation account configuration | Microsoft Docs
description: This article describes how to confirm the configuration of your Automation account is setup correctly.  
services: automation
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''

ms.assetid: 
ms.service: automation
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/07/2017
ms.author: magoedte
---

# Test Azure Automation Run As account authentication
After an Automation account is successfully created, you can perform a simple test to confirm you are able to successfully authenticate in Azure Resource Manager or Azure classic deployment using your newly created or updated Automation Run As account.    

## Automation Run As authentication
Use the sample code below to [create a PowerShell runbook](automation-creating-importing-runbook.md) to verify authentication using the Run As account and also in your custom runbooks to authenticate and manage Resource Manager resources with your Automation account.   

    $connectionName = "AzureRunAsConnection"
    try
    {
        # Get the connection "AzureRunAsConnection "
        $servicePrincipalConnection=Get-AutomationConnection -Name $connectionName         

        "Logging in to Azure..."
        Add-AzureRmAccount `
           -ServicePrincipal `
           -TenantId $servicePrincipalConnection.TenantId `
           -ApplicationId $servicePrincipalConnection.ApplicationId `
           -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint 
    }
    catch {
       if (!$servicePrincipalConnection)
       {
          $ErrorMessage = "Connection $connectionName not found."
          throw $ErrorMessage
      } else{
          Write-Error -Message $_.Exception
          throw $_.Exception
      }
    }

    #Get all ARM resources from all resource groups
    $ResourceGroups = Get-AzureRmResourceGroup 

    foreach ($ResourceGroup in $ResourceGroups)
    {    
       Write-Output ("Showing resources in resource group " + $ResourceGroup.ResourceGroupName)
       $Resources = Find-AzureRmResource -ResourceGroupNameContains $ResourceGroup.ResourceGroupName | Select ResourceName, ResourceType
       ForEach ($Resource in $Resources)
       {
          Write-Output ($Resource.ResourceName + " of type " +  $Resource.ResourceType)
       }
       Write-Output ("")
    } 

Notice the cmdlet used for authenticating in the runbook - **Add-AzureRmAccount**, uses the *ServicePrincipalCertificate* parameter set.  It authenticates by using service principal certificate, not credentials.  

When you [run the runbook](automation-starting-a-runbook.md#starting-a-runbook-with-the-azure-portal) to validate your Run As account, a [runbook job](automation-runbook-execution.md) is created, the Job blade is displayed, and the job status displayed in the **Job Summary** tile. The job status will start as *Queued* indicating that it is waiting for a runbook worker in the cloud to become available. It will then move to *Starting* when a worker claims the job, and then *Running* when the runbook actually starts running.  When the runbook job completes, we should see a status of **Completed**.

To see the detailed results of the runbook, click on the **Output** tile.  On the **Output** blade, you should see it has successfully authenticated and returns a list of all resources in all resource groups in your subscription.  

Just remember to remove the block of code starting with the comment `#Get all ARM resources from all resource groups` when you reuse the code for your runbooks.

## Classic Run As authentication
Use the sample code below to [create a PowerShell runbook](automation-creating-importing-runbook.md) to verify authentication using the Classic Run As account and also in your custom runbooks to authenticate and manage resources in the classic deployment model.  

    $ConnectionAssetName = "AzureClassicRunAsConnection"
    # Get the connection
    $connection = Get-AutomationConnection -Name $connectionAssetName        

    # Authenticate to Azure with certificate
    Write-Verbose "Get connection asset: $ConnectionAssetName" -Verbose
    $Conn = Get-AutomationConnection -Name $ConnectionAssetName
    if ($Conn -eq $null)
    {
       throw "Could not retrieve connection asset: $ConnectionAssetName. Assure that this asset exists in the Automation account."
    }

    $CertificateAssetName = $Conn.CertificateAssetName
    Write-Verbose "Getting the certificate: $CertificateAssetName" -Verbose
    $AzureCert = Get-AutomationCertificate -Name $CertificateAssetName
    if ($AzureCert -eq $null)
    {
       throw "Could not retrieve certificate asset: $CertificateAssetName. Assure that this asset exists in the Automation account."
    }

    Write-Verbose "Authenticating to Azure with certificate." -Verbose
    Set-AzureSubscription -SubscriptionName $Conn.SubscriptionName -SubscriptionId $Conn.SubscriptionID -Certificate $AzureCert
    Select-AzureSubscription -SubscriptionId $Conn.SubscriptionID
    
    #Get all VMs in the subscription and return list with name of each
    Get-AzureVM | ft Name

When you [run the runbook](automation-starting-a-runbook.md#starting-a-runbook-with-the-azure-portal) to validate your Run As account, a [runbook job](automation-runbook-execution.md) is created, the Job blade is displayed, and the job status displayed in the **Job Summary** tile. The job status will start as *Queued* indicating that it is waiting for a runbook worker in the cloud to become available. It will then move to *Starting* when a worker claims the job, and then *Running* when the runbook actually starts running.  When the runbook job completes, we should see a status of **Completed**.

To see the detailed results of the runbook, click on the **Output** tile.  On the **Output** blade, you should see it has successfully authenticated and returns a list of all Azure VMs by VMName that are deployed in your subscription.  

Just remember to remove the cmdlet **Get-AzureVM** when you reuse the code for your runbooks.

## Next steps
* To get started with PowerShell runbooks, see [My first PowerShell runbook](automation-first-runbook-textual-powershell.md).
* To learn more about Graphical Authoring, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md).

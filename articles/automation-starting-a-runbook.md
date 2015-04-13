<properties 
   pageTitle="Starting a runbook in Azure Automation"
   description="Describes how to start a runbook in Azure Automation using both the Azure Management Portal and using Windows PowerShell.  Includes information on providing parameter values."
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/30/2015"
   ms.author="bwren" />

# Starting a runbook in Azure Automation

Starting a runbook in Azure Automation using the Azure Management Portal and Windows PowerShell are covered in this article. Calling a runbook from another runbook is documented in [Starting a Runbook from Another Runbook](http://msdn.microsoft.com/library/azure/dn857355.aspx).

## Starting a runbook with the Azure Management Portal

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.
1. Select the **Runbooks** tab.
1. Select a runbook, and then click **Start**.
1. If the runbook has parameters, you will be prompted to provide values with a text box for each parameter. The parameter type and its default value, if it has one, is displayed under the text box. Boolean and datetime parameters have special selectors instead of the standard text box. See [Runbook Parameters](#Runbook-parameters) below for further details on parameters.
1. Either select **View Job** next to the **Starting** runbook message or select the **Jobs** tab for the runbook to view the job’s status.

## Starting a runbook with Windows PowerShell

You can use the [Start-AzureAutomationRunbook](http://msdn.microsoft.com/library/azure/dn690259.aspx) to start a runbook with Windows PowerShell. The following sample code starts a runbook called Test-Runbook.

	Start-AzureAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook"

Start-AzureAutomationRunbook returns a job object that you can use to track its status once the runbook is started. You can then use this job object with [Get-AzureAutomationJob](http://msdn.microsoft.com/library/azure/dn690263.aspx) to determine the status of the job and [Get-AzureAutomationJobOutput](http://msdn.microsoft.com/library/azure/dn690268.aspx) to get its output. The following sample code starts a runbook called Test-Runbook, waits until it has completed, and then displays its output.

	$job = Start-AzureAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook"
	
	$doLoop = $true
	While ($doLoop) {
	   $job = Get-AzureAutomationJob –AutomationAccountName "MyAutomationAccount" -Id $job.Id
	   $status = $job.Status
	   $doLoop = (($status -ne "Completed") -and ($status -ne "Failed") -and ($status -ne "Suspended") -and ($status -ne "Stopped") 
	}
	
	Get-AzureAutomationJobOutput –AutomationAccountName "MyAutomationAccount" -Id $job.Id –Stream Output

If the runbook requires parameters, then you must provide them as a [hashtable](http://technet.microsoft.com/library/hh847780.aspx) where the key of the hashtable matches the parameter name and the value is the parameter value. The following example shows how to start a runbook with two string parameters named FirstName and LastName, an integer named RepeatCount, and a boolean parameter named Show. For additional information on parameters, see [Runbook Parameters](#Runbook-parameters) below.

	$params = @{"FirstName"="Joe";"LastName"="Smith";"RepeatCount"=2;"Show"=$true}
	Start-AzureAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" –Parameters $params

## Runbook parameters

When you start a runbook using the Azure Management Portal or Windows PowerShell, the instruction is sent through the Azure Automation web service. This service does not support parameters with complex data types. If you need to provide a value for a complex parameter, then you must call it inline from another runbook as described in [Starting a Runbook from Another Runbook](http://msdn.microsoft.com/library/azure/dn857355.aspx).

The Azure Automation web service will provide special functionality for parameters using certain data types as described in the following sections.

### Named Values

If the parameter is data type [object], then you can use the following JSON format to send it a list of named values: *{"Name1":Value1, "Name2":Value2, "Name3":Value3}*. These values must be simple types. The runbook will receive the parameter as a [PSCustomObject](http://msdn.microsoft.com/library/azure/system.management.automation.pscustomobject(v=vs.85).aspx) with properties that correspond to each named value.

Consider the following test runbook that accepts a parameter called user.

	Workflow Test-Parameters
	{
	   param ( 
	      [Parameter(Mandatory=$true)][object]$user
	   )
	    if ($user.Show) {
	        foreach ($i in 1..$user.RepeatCount) {
	            $user.FirstName
	            $user.LastName
	        }
	    } 
	}

The following text could be used for the user parameter.

	{"FirstName":"Joe","LastName":"Smith","RepeatCount":2,"Show":true}

This results in the following output.

	Joe
	Smith
	Joe
	Smith

### Arrays

If the parameter is an array such as [array] or [string[]], then you can use the following JSON format to send it a list of values: *[Value1,Value2,Value3]*. These values must be simple types.

Consider the following test runbook that accepts a parameter called *user*.

	Workflow Test-Parameters
	{
	   param ( 
	      [Parameter(Mandatory=$true)][array]$user
	   )
	    if ($user[3]) {
	        foreach ($i in 1..$user[2]) {
	            $ user[0]
	            $ user[1]
	        }
	    } 
	}

The following text could be used for the user parameter.

	["Joe","Smith",2,true]

This results in the following output.

	Joe
	Smith
	Joe
	Smith

### Credentials

If the parameter is data type **PSCredential**, then you can provide the name of an Azure Automation [credential asset](http://msdn.microsoft.com/library/azure/dn940015.aspx). The runbook will retrieve the credential with the name that you specify.

Consider the following test runbook that accepts a parameter called credential.

	Workflow Test-Parameters
	{
	   param ( 
	      [Parameter(Mandatory=$true)][PSCredential]$credential
	   )
	   $credential.UserName
	}

The following text could be used for the user parameter assuming that there was a credential asset called *My Credential*.

	My Credential

Assuming the username in the credential was *jsmith*, this results in the following output.

	jsmith

## Related articles

- [Starting a Runbook from Another Runbook](http://msdn.microsoft.com/library/azure/dn857355.aspx)
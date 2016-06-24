<properties
   pageTitle="Starting a runbook in Azure Automation | Microsoft Azure"
   description="Summarizes the different methods that can be used to start a runbook in Azure Automation and provides details on using both the Azure portal and Windows PowerShell."
   services="automation"
   documentationCenter=""
   authors="mgoedtel"
   manager="jwhit"
   editor="tysonn" /><tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/06/2016"
   ms.author="magoedte;bwren"/>

# Starting a runbook in Azure Automation

The following table will help you determine the method to start a runbook in Azure Automation that is most suitable to your particular scenario. This article includes details on starting a runbook with the Azure portal and with Windows PowerShell. Details on the other methods are provided in other documentation that you can access from the links below.

| **METHOD**                                                                    | **CHARACTERISTICS**                                                                                                                                                                                                                                                                                                                                                |
|-------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Azure Portal](#starting-a-runbook-with-the-azure-portal)                     | <li>Simplest method with interactive user interface.<br> <li>Form to provide simple parameter values.<br> <li>Easily track job state.<br> <li>Access authenticated with Azure logon.                                                                                                                                                                               |
| [Windows PowerShell](https://msdn.microsoft.com/library/dn690259.aspx)        | <li>Call from command line with Windows PowerShell cmdlets.<br> <li>Can be included in automated solution with multiple steps.<br> <li>Request is authenticated with certificate or OAuth user principal / service principal.<br> <li>Provide simple and complex parameter values.<br> <li>Track job state.<br> <li>Client required to support PowerShell cmdlets. |
| [Azure Automation API](https://msdn.microsoft.com/library/azure/mt662285.aspx) | <li>Most flexible method but also most complex.<br> <li>Call from any custom code that can make HTTP requests.<br> <li>Request authenticated with certificate, or Oauth user principal / service principal.<br> <li>Provide simple and complex parameter values.<br> <li>Track job state.                                                                          |
| [Webhooks](automation-webhooks.md)                                            | <li>Start runbook from single HTTP request.<br> <li>Authenticated with security token in URL.<br> <li>Client cannot override parameter values specified when webhook created. Runbook can define single parameter that is populated with the HTTP request details.<br> <li>No ability to track job state through webhook URL.                                      |
| [Respond to Azure Alert](../log-analytics/log-analytics-alerts.md)               | <li>Start a runbook in response to Azure alert.<br> <li>Configure webhook for runbook and link to alert.<br> <li>Authenticated with security token in URL.<br> <li>Currently supports alert on Metrics only.                                                                                                                                                       |
| [Schedule](automation-scheduling-a-runbook.md)                                | <li>Automatically start runbook on hourly, daily, or weekly schedule.<br> <li>Manipulate schedule through Azure portal, PowerShell cmdlets, or Azure API.<br> <li>Provide parameter values to be used with schedule.                                                                                                                                               |
| [From Another Runbook](automation-child-runbooks.md)                          | <li>Use a runbook as an activity in another runbook.<br> <li>Useful for functionality used by multiple runbooks.<br> <li>Provide parameter values to child runbook and use output in parent runbook.                                                                                                                                                               |

The following image illustrates detailed step-by-step process in the life cycle of a runbook. It includes different ways a runbook is started in Azure Automation, components required for Hybrid Runbook Worker to execute Azure Automation runbooks and interactions between different components. To learn about executing Automation runbooks in your datacenter, refer to [hybrid runbook workers](automation-hybrid-runbook-worker.md)

![Runbook Architecture](media/automation-starting-runbook/runbooks-architecture.png)

## Starting a runbook with the Azure portal

1.	In the Azure portal, select **Automation** and then then click the name of an automation account.
2.	Select the **Runbooks** tab.
3.	Select a runbook, and then click **Start**.
4.	If the runbook has parameters, you will be prompted to provide values with a text box for each parameter. See [Runbook Parameters](#Runbook-parameters) below for further details on parameters.
5.	Either select **View Job** next to the **Starting** runbook message or select the **Jobs** tab for the runbook to view the runbook job’s status.

## Starting a runbook with the Azure portal

1.	From your automation account, click the **Runbooks** part to open the **Runbooks** blade.
2.	Click a runbook to open its **Runbook** blade.
3.	Click **Start**.
4.	If the runbook has no parameters, you will be prompted to confirm whether you want to start it. If the runbook has parameters, the **Start Runbook** blade will be opened so you can provide parameter values. See [Runbook Parameters](#Runbook-parameters) below for further details on parameters.
5.	The **Job** blade is opened so that you can track the job's status.

## Starting a runbook with Windows PowerShell

You can use the [Start-AzureRmAutomationRunbook](https://msdn.microsoft.com/library/mt603661.aspx) to start a runbook with Windows PowerShell. The following sample code starts a runbook called Test-Runbook.

```
Start-AzureRmAutomationRunbook -AutomationAccountName "MyAutomationAccount" -Name "Test-Runbook" -ResourceGroupName "ResourceGroup01"
```

Start-AzureRmAutomationRunbook returns a job object that you can use to track its status once the runbook is started. You can then use this job object with [Get-AzureRmAutomationJob](https://msdn.microsoft.com/library/mt619440.aspx) to determine the status of the job and [Get-AzureRmAutomationJobOutput](https://msdn.microsoft.com/library/mt603476.aspx) to get its output. The following sample code starts a runbook called Test-Runbook, waits until it has completed, and then displays its output.

```
$runbookName = "Test-Runbook"
$ResourceGroup = "ResourceGroup01"
$AutomationAcct = "MyAutomationAccount"

$job = Start-AzureRmAutomationRunbook –AutomationAccountName $AutomationAcct -Name $runbookName -ResourceGroupName $ResourceGroup

$doLoop = $true
While ($doLoop) {
   $job = Get-AzureRmAutomationJob –AutomationAccountName $AutomationAcct -Id $job.JobId -ResourceGroupName $ResourceGroup
   $status = $job.Status
   $doLoop = (($status -ne "Completed") -and ($status -ne "Failed") -and ($status -ne "Suspended") -and ($status -ne "Stopped"))
}

Get-AzureRmAutomationJobOutput –AutomationAccountName $AutomationAcct -Id $job.JobId -ResourceGroupName $ResourceGroup –Stream Output
```

If the runbook requires parameters, then you must provide them as a [hashtable](http://technet.microsoft.com/library/hh847780.aspx) where the key of the hashtable matches the parameter name and the value is the parameter value. The following example shows how to start a runbook with two string parameters named FirstName and LastName, an integer named RepeatCount, and a boolean parameter named Show. For additional information on parameters, see [Runbook Parameters](#Runbook-parameters) below.

```
$params = @{"FirstName"="Joe";"LastName"="Smith";"RepeatCount"=2;"Show"=$true}
Start-AzureRmAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" -ResourceGroupName "ResourceGroup01" –Parameters $params
```

## Runbook parameters

When you start a runbook from the Azure Portal or Windows PowerShell, the instruction is sent through the Azure Automation web service. This service does not support parameters with complex data types. If you need to provide a value for a complex parameter, then you must call it inline from another runbook as described in [Child runbooks in Azure Automation](automation-child-runbooks.md).

The Azure Automation web service will provide special functionality for parameters using certain data types as described in the following sections.

### Named Values

If the parameter is data type [object], then you can use the following JSON format to send it a list of named values: *{"Name1":Value1, "Name2":Value2, "Name3":Value3}*. These values must be simple types. The runbook will receive the parameter as a [PSCustomObject](https://msdn.microsoft.com/library/system.management.automation.pscustomobject(v=vs.85).aspx) with properties that correspond to each named value.

Consider the following test runbook that accepts a parameter called user.

```
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
```

The following text could be used for the user parameter.

```
{"FirstName":"Joe","LastName":"Smith","RepeatCount":2,"Show":true}
```

This results in the following output.

```
Joe
Smith
Joe
Smith
```

### Arrays

If the parameter is an array such as [array] or [string[]], then you can use the following JSON format to send it a list of values: *[Value1,Value2,Value3]*. These values must be simple types.

Consider the following test runbook that accepts a parameter called *user*.

```
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
```

The following text could be used for the user parameter.

```
["Joe","Smith",2,true]
```

This results in the following output.

```
Joe
Smith
Joe
Smith
```

### Credentials

If the parameter is data type **PSCredential**, then you can provide the name of an Azure Automation [credential asset](automation-credentials.md). The runbook will retrieve the credential with the name that you specify.

Consider the following test runbook that accepts a parameter called credential.

```
Workflow Test-Parameters
{
   param (
      [Parameter(Mandatory=$true)][PSCredential]$credential
   )
   $credential.UserName
}
```

The following text could be used for the user parameter assuming that there was a credential asset called *My Credential*.

```
My Credential
```

Assuming the username in the credential was *jsmith*, this results in the following output.

```
jsmith
```

## Next Steps

-	The runbook architecture in current article provides a high-level description about hybrid runbooks.  To learn more, see [Child runbooks in Azure Automation](automation-child-runbooks.md)

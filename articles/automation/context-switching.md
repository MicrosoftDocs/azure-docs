---
title: Context switching in Azure Automation
description: This article tells how to use a webhook to start a runbook in Azure Automation from an HTTP call.
services: automation
ms.subservice: process-automation
ms.date: 09/21/2021
ms.topic: conceptual 
#Customer intent: As a developer, I want to understand Azure context so that I can avoid error when running multiple runbooks.
---

# Context switching in Azure Automation

Context switching is when the context in one process changes the context in a different process. An Azure context is a set of information that defines the target of Azure PowerShell cmdlets. The context consists of the following properties:

|Property | Description |
|---|---|
|Name | The name of the context.|
|Account | The user name or service principal used to authenticate communications with Azure.|
|Environment | The particular Azure Cloud being targeted, usually the Azure global Cloud. However, the environment setting allows you to target National, Government, and on-premises (Azure Stack) clouds as well.|
|Subscription | The Azure subscription with the resources being acted upon.|
|Tenant | The Azure Active Directory tenant that contains your subscription.|
|Credentials | The information used by Azure to verify your identity and confirm your authorization to access resources in Azure.|

When an account logs on that can access several subscriptions, any of those subscriptions may be added to the user's context. To guarantee the correct subscription, you must declare it when connecting. For example, use `Add-AzAccount -Credential $Cred -subscription 'cd4dxxxx-xxxx-xxxx-xxxx-xxxxxxxx9749'`. However, issues can arise when a runbook managing one subscription runs in the same sandbox process as another runbook that is managing another subscription, since the Azure context is shared with all of the runbooks in that sandbox. Changes to the context made by one runbook can affect other runbooks that are using the default context. As the context includes information, such as the credentials to use and the subscription to target, cmdlets could target the wrong subscription resulting in `not found` or permissions errors. This issue is known as **Context Switching**.

## Context management

To avoid accidentally trying to access the incorrect subscription, follow the guidance below.

1. Disable sandbox context saving within your Automation runbooks with the following code at the start of each runbook: `Disable-AzContextAutosave -Scope Process`.
1. The Azure PowerShell cmdlets support the `-DefaultProfile` switch. This switch was added to all Az and AzureRm cmdlets to support running multiple PowerShell scripts in the same process, allowing you to specify for each cmdlet which context to use. Save your context object in your runbook when it's created and every time it's changed. Then  reference it in every Az/AzureRm cmdlet that you call. For example, `$AzureContext = Set-AzContext -SubscriptionId $subID`.
1. Pass the context object to the PowerShell cmdlet, for example, `Get-AzVM -ResourceGroupName "myGroup" -DefaultProfile $AzureContext`.

Here's an example of how a PowerShell runbook using a system-assigned managed identity may begin:

```powershell
# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process

# Connect to Azure with system-assigned managed identity
Connect-AzAccount -Identity

# set and store context
$subID = (Get-AzContext).Subscription.Id
$AzureContext = Set-AzContext -SubscriptionId $subID

# Pass context object - even though the context had just been set
# This is the step that guarantees the context will not be switched.
Get-AzVM -ResourceGroupName "MAIC-RG-Dev" -DefaultProfile $AzureContext | Select Name
```

## Possible symptoms

Not following the guidance doesn't mean you'll find an issue, rather you create the possibility. This issue is timing, as it depends upon what each runbook is doing at the time the other runbook switches the context. Here are some possible error messages; however, these error messages can also be caused by non-context switching reasons.

`The subscription named <subscription name> cannot be found.`

```error
Get-AzVM : The client '<automation-runas-account-guid>' with object id '<automation-runas-account-guid>' does not have authorization to perform action 'Microsoft.Compute/virtualMachines/read' over scope '/subscriptions/<subcriptionIdOfSubscriptionWichDoesntContainTheVM>/resourceGroups/REsourceGroupName/providers/Microsoft.Compute/virtualMachines/VMName '.
   ErrorCode: AuthorizationFailed
   StatusCode: 403
   ReasonPhrase: Forbidden Operation
   ID : <AGuidRepresentingTheOperation> At line:51 char:7 + $vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $UNBV... +
```

```error
Get-AzureRmResource : Resource group "SomeResourceGroupName" could not be found.
... resources = Get-AzResource -ResourceGroupName $group.ResourceGro ...
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Get-AzResource], CloudException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.ResourceManager.Cmdlets.Implementation.GetAzureResourceCmdlet
```

## Next steps

- [Azure Automation account authentication overview](automation-security-overview.md)
- [Runbook execution in Azure Automation](automation-runbook-execution.md)
- [Manage modules in Azure Automation](./shared-resources/modules.md)


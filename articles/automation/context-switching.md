---
title: Context switching in Azure Automation
description: This article explains context switching and how to avoid runbook issues.
services: automation
ms.subservice: process-automation
ms.custom: devx-track-azurepowershell
ms.date: 08/18/2023
ms.topic: conceptual 
#Customer intent: As a developer, I want to understand Azure context so that I can avoid error when running multiple runbooks.
---

# Context switching in Azure Automation

Context switching is when the context in one process changes the context in a different process. An Azure context is a set of information that defines the target of Azure PowerShell cmdlets. The context consists of the following properties:

|Property | Description |
|---|---|
|Name | The name of the context.|
|Account | The user name or service principal used to authenticate communications with Azure.|
|Environment | Represents the Azure global or one of the national Azure clouds, such as Azure Government. You can also specify a hybrid cloud platform, like Azure Stack.|
|Subscription | Represents the Azure subscription that contains the resources you want to manage.|
|Tenant | A dedicated and trusted instance of Azure Active Directory that represents a single organization.|
|Credentials | The information used by Azure to verify your identity and confirm your authorization to access resources in Azure.|

When an account signs on that can access several subscriptions, any of those subscriptions may be added to the user's context. To guarantee the correct subscription, you must declare it when connecting. For example, use `Add-AzAccount -Credential $Cred -subscription 'cd4dxxxx-xxxx-xxxx-xxxx-xxxxxxxx9749'`. However, issues can arise when your runbooks managing one subscription runs in the same sandbox process as your other runbooks managing resources in another subscription from the same Automation account. Changes to the context made by one runbook can affect your other runbooks using the default context. As the context includes information, such as the credentials to use and the subscription to target, cmdlets could target the wrong subscription resulting in `not found` or permissions errors. This issue is known as **Context Switching**.

## Manage Azure contexts

To avoid your runbooks from running against resources in the wrong subscription, review the following recommendations:

1. Disable sandbox context saving within your Automation runbook by using the following command at the start of each runbook: `Disable-AzContextAutosave -Scope Process`.
1. The Azure PowerShell cmdlets support the `-DefaultProfile` parameter. This parameter was added to all Az and Azure Resource Manager (AzureRM) cmdlets to support running multiple scripts in the same process, allowing you to specify for each cmdlet which context to use. Save your context object in your runbook when it's created and every time it's changed. Then reference it in every call made with the Az or AzureRM cmdlet. For example, `$AzureContext = Set-AzContext -SubscriptionId $subID`.
1. Pass the context object to the PowerShell cmdlet, for example, `Get-AzVM -ResourceGroupName "myGroup" -DefaultProfile $AzureContext`.

Here's a PowerShell runbook code snippet using a system-assigned managed identity following the recommendations to avoid context switching.

```powershell
# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process

# Connect to Azure with system-assigned managed identity
$AzureContext = (Connect-AzAccount -Identity).context

# set and store context
$AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext

# Pass context object - even though the context had just been set
# This is the step that guarantees the context will not be switched.
Get-AzVM -ResourceGroupName "resourceGroupName" -DefaultProfile $AzureContext | Select Name
```

## Possible symptoms

While you may not come across an issue if you don't follow these recommendations, the opportunity does exist. The underlying issue with this situation is timing; it depends on what each runbook is doing at the time the other runbook switches its context. Here are some possible error messages. However, these error messages can be caused by non-context switching conditions.

`The subscription named <subscription name> cannot be found.`

```error
Get-AzVM : The client '<clientid>' with object id '<objectid>' does not have authorization to perform action 'Microsoft.Compute/virtualMachines/read' over scope '/subscriptions/<subcriptionIdOfSubscriptionWichDoesntContainTheVM>/resourceGroups/REsourceGroupName/providers/Microsoft.Compute/virtualMachines/VMName '.
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

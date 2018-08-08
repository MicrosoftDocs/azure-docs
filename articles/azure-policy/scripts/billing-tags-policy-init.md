---
title: Azure Policy json sample - Billing tags policy initiative | Microsoft Docs
description: This json sample policy set requires specified tag values for cost center and product name.
services: azure-policy
documentationcenter:
author: DCtheGeek
manager: carmonm
editor:
ms.assetid:
ms.service: azure-policy
ms.devlang:
ms.topic: sample
ms.tgt_pltfrm:
ms.workload:
ms.date: 10/30/2017
ms.author: dacoulte
ms.custom: mvc
---
# Billing tags policy initiative

This policy set requires specified tag values for cost center and product name. Uses built-in policies to apply and enforce required tags. You specify the required values for the tags.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample template

[!code-json[main](../../../policy-templates/samples/PolicyInitiatives/multiple-billing-tags/azurepolicyset.json "Billing Tags Policy Initiative")]

You can deploy this template using the [Azure portal](#deploy-with-the-portal) or with  [PowerShell](#deploy-with-powershell).

## Deploy with the portal

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://aka.ms/getpolicy)

## Deploy with PowerShell

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

```powershell
$policydefinitions = "https://raw.githubusercontent.com/Azure/azure-policy/master/samples/PolicyInitiatives/multiple-billing-tags/azurepolicyset.definitions.json"
$policysetparameters = "https://raw.githubusercontent.com/Azure/azure-policy/master/samples/PolicyInitiatives/multiple-billing-tags/azurepolicyset.parameters.json"

$policyset= New-AzureRmPolicySetDefinition -Name "multiple-billing-tags" -DisplayName "Billing Tags Policy Initiative" -Description "Specify cost Center tag and product name tag" -PolicyDefinition $policydefinitions -Parameter $policysetparameters

New-AzureRmPolicyAssignment -PolicySetDefinition $policyset -Name <assignmentname> -Scope <scope>  -costCenterValue <required value for Cost Center tag> -productNameValue <required value for product Name tag>
```

### Clean up PowerShell deployment

Run the following command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Apply tags to existing resources

After assigning the policies, you can trigger an update to all existing resources to enforce the tag policies you have added. The following script retains any other tags that existed on the resources:

```powershell
$resources = Get-AzureRmResource -ResourceGroupName 'ExampleGroup'

foreach ($r in $resources) {
    try {
        Set-AzureRmResource -Tags ($a = if ($r.Tags -eq $NULL) { @{} } else {$r.Tags}) -ResourceId $r.ResourceId -Force -UsePatchSemantics
    }
    catch {
        Write-Host $r.ResourceId + "can't be updated"
    }
}
```

## Next steps

- Review more examples at [Azure Policy samples](../json-samples.md).
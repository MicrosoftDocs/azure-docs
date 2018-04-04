---
title: Quickstart - Use PowerShell to create a policy assignment to identify non-compliant resources in your Azure environment | Microsoft Docs
description: In this quickstart, you use PowerShell to create an Azure Policy assignment to identify non-compliant resources.
services: azure-policy
keywords:
author: bandersmsft
ms.author: banders
ms.date: 3/30/2018
ms.topic: quickstart
ms.service: azure-policy
ms.custom: mvc
---

# Quickstart: Create a policy assignment to identify non-compliant resources using the Azure RM PowerShell module

The first step in understanding compliance in Azure is to identify the status of your resources. In this quickstart, you create a policy assignment to identify virtual machines that are not using managed disks. When complete, you'll identify virtual machines that are *non-compliant* with the policy assignment.

The AzureRM PowerShell module is used to create and manage Azure resources from the command line or in scripts. This guide explains how to use AzureRM to create a policy assignment. The policy identifies non-compliant resources in your Azure environment.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

- Before you start, make sure that the latest version of PowerShell is installed. See [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) for detailed information.
- Update your AzureRM PowerShell module to the latest version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).
- Register the Policy Insights resource provider using Azure PowerShell. Registering the resource provider makes sure that your subscription works with it. To register a resource provider, you must have permission to perform the register action operation for the resource provider. This operation is included in the Contributor and Owner roles. Run the following command to register the resource provider:

  ```
  Register-AzureRmResourceProvider -ProviderNamespace Microsoft.PolicyInsights
  ```

  For more information about registering and viewing resource providers, see [Resource Providers and Types](../azure-resource-manager/resource-manager-supported-services.md)

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the *Audit Virtual Machines without Managed Disks* definition. This policy definition identifies resources that don't comply with the conditions set in the policy definition.

Run the following commands to create a new policy assignment:

```powershell
$rg = Get-AzureRmResourceGroup -Name "<resourceGroupName>"

$definition = Get-AzureRmPolicyDefinition -Name "Audit Virtual Machines without Managed Disks"

New-AzureRMPolicyAssignment -Name Audit Virtual Machines without Managed Disks Assignment -Scope $rg.ResourceId -PolicyDefinition $definition -Sku @{Name='A1';Tier='Standard'}

```

The preceding commands use the following information:

- **Name** - Display name for the policy assignment. In this case, you're using *Audit Virtual Machines without Managed Disks Assignment*.
- **Definition** – The policy definition, based on which you're using to create the assignment. In this case, it is the policy definition – *Audit Virtual Machines without Managed Disks*.
- **Scope** - A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a subscription to resource groups. Be sure to replace &lt;scope&gt; with the name of your resource group.
- **Sku** – This command creates a policy assignment with the standard tier. The standard tier enables you to achieve at-scale management, compliance evaluation, and remediation. For additional details about pricing tiers, see [Azure Policy pricing](https://azure.microsoft.com/pricing/details/azure-policy).


You’re now ready to identify non-compliant resources to understand the compliance state of your environment.

## Identify non-compliant resources

Use the following information to identify resources that aren't compliant with the policy assignment you created. Run the following commands:

```powershell
$policyAssignment = Get-AzureRmPolicyAssignment | where {$_.properties.displayName -eq "Audit Virtual Machines without Managed Disks"}
```

```powershell
$policyAssignment.PolicyAssignmentId
```

For more information about policy assignment IDs, see [Get-AzureRMPolicyAssignment](/powershell/module/azurerm.resources/get-azurermpolicyassignment).

Next, run the following command to get the resource IDs of the non-compliant resources that are output into a JSON file:

```powershell
armclient post "/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.PolicyInsights/policyStates/latest/queryResults?api-version=2017-12-12-preview&$filter=IsCompliant eq false and PolicyAssignmentId eq '<policyAssignmentID>'&$apply=groupby((ResourceId))" > <json file to direct the output with the resource IDs into>
```
Your results resemble the following example:


```
{
"@odata.context":"https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest",
"@odata.count": 3,
"value": [
{
    "@odata.id": null,
    "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
      "ResourceId": "/subscriptions/<subscriptionId>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachineId>"
    },
    {
      "@odata.id": null,
      "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
      "ResourceId": "/subscriptions/<subscriptionId>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine2Id>"
   		 },
{
      "@odata.id": null,
      "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
      "ResourceId": "/subscriptions/<subscriptionName>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine3ID>"
   		 }

]
}
```

The results are comparable to what you'd typically see listed under **Non-compliant resources** in the Azure portal view.


## Clean up resources

Subsequent guides in this collection build on this quickstart. If you plan to continue to work with other tutorials, do not clean up the resources created in this quickstart. If you don't plan to continue, you can delete the assignment you created by running this command:

```powershell
Remove-AzureRmPolicyAssignment -Name "Audit Virtual Machines without Managed Disks Assignment" -Scope /subscriptions/<subscriptionID>/<resourceGroupName>
```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about assigning policies and ensure that **future** resources that get created are compliant, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./create-manage-policy.md)

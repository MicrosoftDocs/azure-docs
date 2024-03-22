---
title: "Quickstart: Create policy assignment using ARM template"
description: In this quickstart, you create an Azure Policy assignment to identify non-compliant resources using an Azure Resource Manager template (ARM template).
ms.date: 03/19/2024
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart: Create a policy assignment to identify non-compliant resources by using ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create a policy assignment that validates resource's compliance with an Azure policy. The policy is assigned to a resource group and audits virtual machines that don't use managed disks. After you create the policy assignment, you identify non-compliant virtual machines.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates,
select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Screenshot of the Deploy to Azure button to assign a policy with an Azure Resource Manager template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.authorization%2Fazurepolicy-builtin-vm-managed-disks%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) and the [Azure Resource Manager (ARM) Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).
- `Microsoft.PolicyInsights` must be [registered](../../azure-resource-manager/management/resource-providers-and-types.md) in your Azure subscription. To register a resource provider, you must have permission to register resource providers. That permission is included in the Contributor and Owner roles.
- A resource group with at least one virtual machine that doesn't use managed disks.

## Review the template

The ARM template creates a policy assignment for a resource group scope and assigns the built-in policy definition [Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json).

Create the following ARM template as _policy-assignment.json_.

1. Open Visual Studio Code and select **File** > **New Text File**.
1. Copy and paste the ARM template into Visual Studio Code.
1. Select **File** > **Save** and use the filename _policy-assignment.json_.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "policyAssignmentName": {
      "type": "string",
      "defaultValue": "audit-vm-managed-disks",
      "metadata": {
        "description": "Policy assignment name used in assignment's resource ID"
      }
    },
    "policyDefinitionID": {
      "type": "string",
      "defaultValue": "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
      "metadata": {
        "description": "Policy definition ID"
      }
    },
    "policyDisplayName": {
      "type": "string",
      "defaultValue": "Audit VM managed disks",
      "metadata": {
        "description": "Display name for Azure portal"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/policyAssignments",
      "apiVersion": "2023-04-01",
      "name": "[parameters('policyAssignmentName')]",
      "properties": {
        "policyDefinitionId": "[parameters('policyDefinitionID')]",
        "description": "Policy assignment to resource group scope created with ARM template",
        "displayName": "[parameters('policyDisplayName')]",
        "nonComplianceMessages": [
          {
            "message": "Virtual machines should use managed disks"
          }
        ]
      }
    }
  ],
  "outputs": {
    "assignmentId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Authorization/policyAssignments', parameters('policyAssignmentName'))]"
    }
  }
}
```

The resource type defined in the ARM template is [Microsoft.Authorization/policyAssignments](/azure/templates/microsoft.authorization/policyassignments).

The template uses three parameters to deploy the policy assignment:

- `policyAssignmentName` creates the policy assignment named _audit-vm-managed-disks_.
- `policyDefinitionID` uses the ID of the built-in policy definition. For reference, the commands to get the ID are in the section to deploy the template.
- `policyDisplayName` creates a display name that's visible in Azure portal.

For more information about ARM template files:

- To find more ARM template samples, go to [Browse code samples](/samples/browse/?expanded=azure&products=azure-resource-manager).
- To learn more about template reference's for deployments, go to [Azure template reference](/azure/templates/microsoft.authorization/allversions).
- To learn how to develop ARM templates, go to [ARM template documentation](../../azure-resource-manager/templates/overview.md).
- To learn about subscription-level deployments, go to [Subscription deployments with ARM templates](../../azure-resource-manager//templates/deploy-to-subscription.md).

## Deploy the ARM template

You can deploy the ARM template with Azure PowerShell or Azure CLI.

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

# [PowerShell](#tab/azure-powershell)
```azurepowershell
Connect-AzAccount

# Run these commands if you have multiple subscriptions
Get-AzSubScription
Set-AzContext -Subscription <subscriptionID>
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription <subscriptionID>
```

---

You can verify if `Microsoft.PolicyInsights` is registered. If it isn't, you can run a command to register the resource provider.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights' |
   Select-Object -Property ResourceTypes, RegistrationState

Register-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
```

For more information, go to [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider) and [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider).

# [Azure CLI](#tab/azure-cli)

```azurecli
az provider show \
  --namespace Microsoft.PolicyInsights \
  --query "{Provider:namespace,State:registrationState}" \
  --output table

az provider register --namespace Microsoft.PolicyInsights
```

The Azure CLI commands use a backslash (`\`) for line continuation to improve readability. For more information, go to [az provider](/cli/azure/provider).

---

The following commands display the `policyDefinitionID` parameter's value:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzPolicyDefinition |
  Where-Object { $_.Properties.DisplayName -eq 'Audit VMs that do not use managed disks' }).ResourceId
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az policy definition list \
  --query "[?displayName=='Audit VMs that do not use managed disks']".id \
  --output tsv
```

---

The following commands deploy the policy definition to your resource group. Replace `<resourceGroupName>` with your resource group name:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rg = Get-AzResourceGroup -Name '<resourceGroupName>'

$deployparms = @{
Name = 'PolicyDeployment'
ResourceGroupName = $rg.ResourceGroupName
TemplateFile = 'policy-assignment.json'
}

New-AzResourceGroupDeployment @deployparms
```

The `$rg` variable stores properties for the resource group. The `$deployparms` variable uses [splatting](/powershell/module/microsoft.powershell.core/about/about_splatting) to create parameter values and improve readability. The `New-AzResourceGroupDeployment` command uses the parameter values defined in the `$deployparms` variable.

- `Name` is the deployment name displayed in the output and in Azure for the resource group's deployments.
- `ResourceGroupName` uses the `$rg.ResourceGroupName` property to get the name of your resource group where the policy is assigned.
- `TemplateFile` specifies the ARM template's name and location on your local computer.

# [Azure CLI](#tab/azure-cli)

```azurecli
rgname=$(az group show --resource-group <resourceGroupName> --query name --output tsv)

az deployment group create \
  --name PolicyDeployment \
  --resource-group $rgname \
  --template-file policy-assignment.json
```

The `rgname` variable uses an expression to get your resource group's name used in the deployment command.

- `name` is the deployment name displayed in the output and in Azure for the resource group's deployments.
- `resource-group` is the name of your resource group where the policy is assigned.
- `template-file` specifies the ARM template's name and location on your local computer.

---

You can verify the policy assignment's deployment with the following command:

# [PowerShell](#tab/azure-powershell)

The command uses the `$rg.ResourceId` property to get the resource group's ID.

```azurepowershell
Get-AzPolicyAssignment -Name 'audit-vm-managed-disks' -Scope $rg.ResourceId
```

```output
Name               : audit-vm-managed-disks
ResourceId         : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks
ResourceName       : audit-vm-managed-disks
ResourceGroupName  : {resourceGroupName}
ResourceType       : Microsoft.Authorization/policyAssignments
SubscriptionId     : {subscriptionId}
PolicyAssignmentId : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks
Properties         : Microsoft.Azure.Commands.ResourceManager.Cmdlets.Implementation.Policy.PsPolicyAssignmentProperties
```

For more information, go to [Get-AzPolicyAssignment](/powershell/module/az.resources/get-azpolicyassignment).

# [Azure CLI](#tab/azure-cli)

The `rgid` variable uses an expression to get the resource group's ID used to show the policy assignment.

```azurecli
rgid=$(az group show --resource-group $rgname --query id --output tsv)

az policy assignment show --name "audit-vm-managed-disks" --scope $rgid
```

The output is verbose but resembles the following example:

```output
"description": "Policy assignment to resource group scope created with ARM template",
"displayName": "Audit VM managed disks",
"enforcementMode": "Default",
"id": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks",
"identity": null,
"location": null,
"metadata": {
  "createdBy": "11111111-1111-1111-1111-111111111111",
  "createdOn": "2024-02-26T19:01:23.2777972Z",
  "updatedBy": null,
  "updatedOn": null
},
"name": "audit-vm-managed-disks",
"nonComplianceMessages": [
  {
    "message": "Virtual machines should use managed disks",
    "policyDefinitionReferenceId": null
  }
]
```

For more information, go to [az policy assignment](/cli/azure/policy/assignment).

---

## Identify non-compliant resources

After the policy assignment is deployed, virtual machines that are deployed to the resource group are audited for compliance with the managed disk policy.

The compliance state for a new policy assignment takes a few minutes to become active and provide results about the policy's state.

# [PowerShell](#tab/azure-powershell)
```azurepowershell
$complianceparms = @{
ResourceGroupName = $rg.ResourceGroupName
PolicyAssignmentName = 'audit-vm-managed-disks'
Filter = 'IsCompliant eq false'
}

Get-AzPolicyState @complianceparms
```

The `$complianceparms` variable creates parameter values used in the `Get-AzPolicyState` command.

- `ResourceGroupName` gets the resource group name from the `$rg.ResourceGroupName` property.
- `PolicyAssignmentName` specifies the name used when the policy assignment was created.
- `Filter` uses an expression to find resources that aren't compliant with the policy assignment.

Your results resemble the following example and `ComplianceState` shows `NonCompliant`:

```output
Timestamp                : 2/26/2024 19:02:56
ResourceId               : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.compute/virtualmachines/{vmId}
PolicyAssignmentId       : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.authorization/policyassignments/audit-vm-managed-disks
PolicyDefinitionId       : /providers/microsoft.authorization/policydefinitions/06a78e20-9358-41c9-923c-fb736d382a4d
IsCompliant              : False
SubscriptionId           : {subscriptionId}
ResourceType             : Microsoft.Compute/virtualMachines
ResourceLocation         : {location}
ResourceGroup            : {resourceGroupName}
ResourceTags             : tbd
PolicyAssignmentName     : audit-vm-managed-disks
PolicyAssignmentOwner    : tbd
PolicyAssignmentScope    : /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}
PolicyDefinitionName     : 06a78e20-9358-41c9-923c-fb736d382a4d
PolicyDefinitionAction   : audit
PolicyDefinitionCategory : tbd
ManagementGroupIds       : {managementGroupId}
ComplianceState          : NonCompliant
AdditionalProperties     : {[complianceReasonCode, ]}
```

For more information, go to [Get-AzPolicyState](/powershell/module/az.policyinsights/Get-AzPolicyState).

# [Azure CLI](#tab/azure-cli)

```azurecli
policyid=$(az policy assignment show \
  --name "audit-vm-managed-disks" \
  --scope $rgid \
  --query id \
  --output tsv)

az policy state list --resource $policyid --filter "(isCompliant eq false)"
```

The `policyid` variable uses an expression to get the policy assignment's ID. The `filter` parameter limits the output to non-compliant resources.

The `az policy state list` output is verbose, but for this article the `complianceState` shows `NonCompliant`.

```output
"complianceState": "NonCompliant",
"components": null,
"effectiveParameters": "",
"isCompliant": false,
```

For more information, go to [az policy state](/cli/azure/policy/state).

---

## Clean up resources

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzPolicyAssignment -Name 'audit-vm-managed-disks' -Scope $rg.ResourceId
```

To sign out of your Azure PowerShell session:

```azurepowershell
Disconnect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az policy assignment delete --name "audit-vm-managed-disks" --scope $rgid
```

To sign out of your Azure CLI session:

```azurecli
az logout
```

---

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about how to assign policies that validate resource compliance, continue to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create and manage policies to enforce compliance](./tutorials/create-and-manage.md)

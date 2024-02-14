---
title: Create a policy assignment with Bicep file
description: In this quickstart, you use a Bicep file to create an Azure policy assignment that identifies non-compliant resources.
ms.date: 01/08/2024
ms.topic: quickstart
ms.custom: subject-bicepqs, devx-track-bicep, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart: Create a policy assignment to identify non-compliant resources by using a Bicep file

In this quickstart, you use a Bicep file to create a policy assignment that validates resource's compliance with an Azure policy. The policy is assigned to a resource group scope and audits if virtual machines use managed disks. Virtual machines deployed in the resource group that don't use managed disks are _non-compliant_ with the policy assignment.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

> [!NOTE]
> Azure Policy is a free service. For more information, go to [Overview of Azure Policy](./overview.md).

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Bicep](../../azure-resource-manager/bicep/install.md).
- [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- `Microsoft.PolicyInsights` must be [registered](../../azure-resource-manager/management/resource-providers-and-types.md) in your Azure subscription.

## Review the Bicep file

The Bicep file creates a policy assignment for a resource group scope and assigns the built-in policy definition [Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json). For a list of available built-in policies, see [Azure Policy samples](./samples/index.md).

Create the following Bicep file as _policy-assignment.bicep_.

1. Open Visual Studio Code and select **File** > **New Text File**.
1. Copy and paste the Bicep file into Visual Studio Code.
1. Select **File** > **Save** and use the filename _policy-policy-assignment.bicep_.

```bicep
param policyAssignmentName string = 'audit-vm-managed-disks'
param policyDefinitionID string = '/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d'

resource assignment 'Microsoft.Authorization/policyAssignments@2023-04-01' = {
  name: policyAssignmentName
  scope: resourceGroup()
  properties: {
    policyDefinitionId: policyDefinitionID
    description: 'Policy assignment to resource group scope created with Bicep file'
    displayName: 'audit-vm-managed-disks'
    nonComplianceMessages: [
      {
        message: 'Virtual machines should use managed disks'
      }
    ]
  }
}

output assignmentId string = assignment.id
```

The resource type defined in the Bicep file is [Microsoft.Authorization/policyAssignments](/azure/templates/microsoft.authorization/policyassignments).

For more information about Bicep files:

- To find more Bicep samples, go to [Browse code samples](/samples/browse/?expanded=azure&languages=bicep).
- To learn more about template reference's for deployments, go to [Azure template reference](/azure/templates/microsoft.authorization/allversions).
- To learn how to develop Bicep files, go to [Bicep documentation](../../azure-resource-manager/bicep/overview.md).
- To learn about subscription-level deployments, go to [Subscription deployments with Bicep files](../../azure-resource-manager/bicep/deploy-to-subscription.md).

## Deploy the Bicep file

You can deploy the Bicep file with Azure PowerShell or Azure CLI.

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

The following commands create a resource group and deploy the policy definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name "PolicyGroup" -Location "westus"

New-AzResourceGroupDeployment `
  -Name PolicyDeployment `
  -ResourceGroupName PolicyGroup `
  -TemplateFile policy-assignment.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name "PolicyGroup" --location "westus"

az deployment group create \
  --name PolicyDeployment \
  --resource-group PolicyGroup \
  --template-file policy-assignment.bicep
```

---

The Bicep file outputs the policy `assignmentId`. You create a variable for the policy assignment ID in the commands that validate the deployment.

## Validate the deployment

After the policy assignment is deployed, virtual machines that are deployed to the _PolicyGroup_ resource group are audited for compliance with the managed disk policy.

1. Sign in to [Azure portal](https://portal.azure.com)
1. Go to **Policy** and select **Compliance** on the left side of the page.
1. Search for the _audit-vm-managed-disks_ policy assignment.

The **Compliance state** for a new policy assignment is shown as **Not started** because it takes a few minutes to become active.

:::image type="content" source="./media/assign-policy-bicep/policy-compliance.png" alt-text="Screenshot of compliance details on the Policy Compliance page.":::

For more information, go to [How compliance works](./concepts/compliance-states.md).

You can also get the compliance state with Azure PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)
```azurepowershell
# Verifies policy assignment was deployed
$rg = Get-AzResourceGroup -Name "PolicyGroup"
Get-AzPolicyAssignment -Name "audit-vm-managed-disks" -Scope $rg.ResourceId

# Shows the number of non-compliant resources and policies
$policyid = (Get-AzPolicyAssignment -Name "audit-vm-managed-disks" -Scope $rg.ResourceId)
Get-AzPolicyStateSummary -ResourceId $policyid.ResourceId
```

The `$rg` variable stores the resource group's properties and `Get-AzPolicyAssignment` shows your policy assignment. The `$policyid` variable stores the policy assignment's resource ID, and `Get-AzPolicyStateSummary` shows the number of non-compliant resources and policies.

# [Azure CLI](#tab/azure-cli)

```azurecli
# Verifies policy assignment was deployed
rg=$(az group show --resource-group PolicyGroup --query id --output tsv)
az policy assignment show --name "audit-vm-managed-disks" --scope $rg

# Shows the number of non-compliant resources and policies
policyid=$(az policy assignment show --name "audit-vm-managed-disks" --scope $rg --query id --output tsv)
az policy state summarize --resource $policyid
```

The `$rg` variable stores the resource group's properties and `az policy assignment show` displays your policy assignment. The `$policyid` variable stores the policy assignment's resource ID and `az policy state summarize` shows the number of non-compliant resources and policies.

---

## Clean up resources

To remove the assignment from Azure, follow these steps:

1. Select **Compliance** in the left side of the Azure Policy page.
1. Locate the _audit-vm-managed-disks_ policy assignment.
1. Right-click the _audit-vm-managed-disks_ policy assignment and select **Delete
   assignment**.

   :::image type="content" source="./media/assign-policy-bicep/delete-assignment.png" alt-text="Screenshot of the context menu to delete an assignment from the Policy Compliance page.":::

1. Delete the resource group _PolicyGroup_. Go to the Azure resource group and select **Delete resource group**.
1. Delete the _policy-assignment.bicep_ file.

You can also delete the policy assignment and resource group with Azure PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)
```azurepowershell
Remove-AzPolicyAssignment -Id $policyid.ResourceId
Remove-AzResourceGroup -Name "PolicyGroup"

# Sign out of Azure
Disconnect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az policy assignment delete --name "audit-vm-managed-disks" --scope $rg
az group delete --name PolicyGroup

# Sign out of Azure
az logout
```

---

## Next steps

In this quickstart, you assigned a built-in policy definition to a resource group scope and reviewed its compliance report. The policy definition audits if the virtual machine resources in the resource group are compliant and identifies resources that aren't compliant.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial.

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)

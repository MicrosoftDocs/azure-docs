---
title: "Quickstart: New policy assignment with Bicep file"
description: In this quickstart, you use a Bicep file to create a policy assignment to identify non-compliant resources.
ms.date: 03/24/2022
ms.topic: quickstart
ms.custom: subject-bicepqs, devx-track-bicep
---
# Quickstart: Create a policy assignment to identify non-compliant resources by using a Bicep file

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of using a
[Bicep](https://github.com/Azure/bicep) file compiled to an Azure Resource
Manager (ARM) deployment template to create a policy assignment to identify virtual machines that
aren't using managed disks. At the end of this process, you'll successfully identify virtual
machines that aren't using managed disks. They're _non-compliant_ with the policy assignment.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="../../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template for assigning an Azure Policy to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.authorization%2Fazurepolicy-assign-builtinpolicy-resourcegroup%2Fazuredeploy.json":::

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.
- Bicep version `0.3` or higher installed. If you don't yet have Bicep CLI or need to update, see
  [Install Bicep](../../azure-resource-manager/bicep/install.md).

## Review the Bicep file

In this quickstart, you create a policy assignment and assign a built-in policy definition called [_Audit VMs that do not use managed disks_](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json). For a partial
list of available built-in policies, see [Azure Policy samples](./samples/index.md).

Create the following Bicep file as `assignment.bicep`:

```bicep
param policyAssignmentName string = 'audit-vm-manageddisks'
param policyDefinitionID string = '/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d'

resource assignment 'Microsoft.Authorization/policyAssignments@2021-09-01' = {
    name: policyAssignmentName
    scope: subscriptionResourceId('Microsoft.Resources/resourceGroups', resourceGroup().name)
    properties: {
        policyDefinitionId: policyDefinitionID
    }
}

output assignmentId string = assignment.id
```

The resource defined in the file is:

- [Microsoft.Authorization/policyAssignments](/azure/templates/microsoft.authorization/policyassignments)

## Deploy the template

> [!NOTE]
> Azure Policy service is free. For more information, see
> [Overview of Azure Policy](./overview.md).

After the Bicep CLI is installed and file created, you can deploy the Bicep file with:

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroupDeployment `
  -Name PolicyDeployment `
  -ResourceGroupName PolicyGroup `
  -TemplateFile assignment.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment group create \
  --name PolicyDeployment \
  --resource-group PolicyGroup \
  --template-file assignment.bicep
```

---

Some other resources:

- To find more samples templates, see
  [Azure Quickstart Template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Authorization&pageNumber=1&sort=Popular).
- To see the template reference, go to
  [Azure template reference](/azure/templates/microsoft.authorization/allversions).
- To learn how to develop ARM templates, see
  [Azure Resource Manager documentation](../../azure-resource-manager/management/overview.md).
- To learn subscription-level deployment, see
  [Create resource groups and resources at the subscription level](../../azure-resource-manager/templates/deploy-to-subscription.md).

## Validate the deployment

Select **Compliance** in the left side of the page. Then locate the _Audit VMs that do not use
managed disks_ policy assignment you created.

:::image type="content" source="./media/assign-policy-template/policy-compliance.png" alt-text="Screenshot of compliance details on the Policy Compliance page." border="false":::

If there are any existing resources that aren't compliant with this new assignment, they appear
under **Non-compliant resources**.

For more information, see
[How compliance works](./concepts/compliance-states.md).

## Clean up resources

To remove the assignment created, follow these steps:

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate
   the _Audit VMs that do not use managed disks_ policy assignment you created.

1. Right-click the _Audit VMs that do not use managed disks_ policy assignment and select **Delete
   assignment**.

   :::image type="content" source="./media/assign-policy-template/delete-assignment.png" alt-text="Screenshot of using the context menu to delete an assignment from the Compliance page." border="false":::

1. Delete the `assignment.bicep` file.

## Next steps

In this quickstart, you assigned a built-in policy definition to a scope and evaluated its
compliance report. The policy definition validates that all the resources in the scope are compliant
and identifies which ones aren't.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)

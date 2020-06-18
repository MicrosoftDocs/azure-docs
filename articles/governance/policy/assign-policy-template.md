---
title: "Quickstart: New policy assignment with templates"
description: In this quickstart, you use a Resource Manager template to create a policy assignment to identify non-compliant resources.
ms.date: 05/21/2020
ms.topic: quickstart
ms.custom: subject-armqs
---
# Quickstart: Create a policy assignment to identify non-compliant resources by using a Resource Manager template

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that aren't using managed disks. At the end of this process, you'll successfully identify virtual machines that aren't using managed
disks. They're _non-compliant_ with the policy assignment.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a policy assignment

In this quickstart, you create a policy assignment and assign a built-in policy definition called
_Audit VMs that do not use managed disks_. For a partial list of available built-in policies, see
[Azure Policy samples](./samples/index.md).

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-azurepolicy-assign-builtinpolicy-resourcegroup/).

:::code language="json" source="~/quickstart-templates/101-azurepolicy-assign-builtinpolicy-resourcegroup/azuredeploy.json" range="1-30" highlight="20-28":::

The resource defined in the template is:

- [Microsoft.Authorization/policyAssignments](/azure/templates/microsoft.authorization/policyassignments)

### Deploy the template

> [!NOTE]
> Azure Policy service is free. For more information, see
> [Overview of Azure Policy](./overview.md).

1. Select the following image to sign in to the Azure portal and open the template:

   [![Deploy the Policy template to Azure](../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-azurepolicy-assign-builtinpolicy-resourcegroup%2Fazuredeploy.json)

1. Select or enter the following values:

   | Name | Value |
   |------|-------|
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Create new**, specify a name, and then select **OK**. In the screenshot, the resource group name is _mypolicyquickstart\<Date in MMDD\>rg_. |
   | Location | Select a region. For example, **Central US**. |
   | Policy Assignment Name | Specify a policy assignment name. You can use the policy definition display if you want. For example, **Audit VMs that do not use managed disks**. |
   | Rg Name | Specify a resource group name where you want to assign the policy to. In this quickstart, use the default value **[resourceGroup().name]**. **[resourceGroup()](../../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)** is a template function that retrieves the resource group. |
   | Policy Definition ID | Specify **/providers/Microsoft.Authorization/policyDefinitions/0a914e76-4921-4c19-b460-a2d36003525a**. |
   | I agree to the terms and conditions stated above | (Select) |

1. Select **Purchase**.

Some additional resources:

- To find more samples templates, see
  [Azure Quickstart template](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Authorization&pageNumber=1&sort=Popular).
- To see the template reference, go to
  [Azure template reference](/azure/templates/microsoft.authorization/allversions).
- To learn how to develop Resource Manager templates, see
  [Azure Resource Manager documentation](../../azure-resource-manager/management/overview.md).
- To learn subscription-level deployment, see
  [Create resource groups and resources at the subscription level](../../azure-resource-manager/templates/deploy-to-subscription.md).

## Validate the deployment

Select **Compliance** in the left side of the page. Then locate the **Audit VMs that do not use
managed disks** policy assignment you created.

:::image type="content" source="./media/assign-policy-template/policy-compliance.png" alt-text="Policy compliance overview page" border="false":::

If there are any existing resources that aren't compliant with this new assignment, they appear
under **Non-compliant resources**.

For more information, see
[How compliance works](./how-to/get-compliance-data.md#how-compliance-works).

## Clean up resources

To remove the assignment created, follow these steps:

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate
   the **Audit VMs that do not use managed disks** policy assignment you created.

1. Right-click the **Audit VMs that do not use managed disks** policy assignment and select **Delete
   assignment**.

   :::image type="content" source="./media/assign-policy-template/delete-assignment.png" alt-text="Delete an assignment from the compliance overview page" border="false":::

## Next steps

In this quickstart, you assigned a built-in policy definition to a scope and evaluated its
compliance report. The policy definition validates that all the resources in the scope are compliant
and identifies which ones aren't.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
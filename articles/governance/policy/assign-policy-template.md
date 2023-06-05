---
title: "Quickstart: New policy assignment with templates"
description: In this quickstart, you use an Azure Resource Manager template (ARM template) to create a policy assignment to identify non-compliant resources.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---
# Quickstart: Create a policy assignment to identify non-compliant resources by using an ARM template

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of using an Azure Resource Manager template (ARM
template) to create a policy assignment that identifies virtual machines that aren't using managed
disks, and flags them as  _non-compliant_ to the policy assignment.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="../../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template for assigning an Azure Policy to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.authorization%2Fazurepolicy-assign-builtinpolicy-resourcegroup%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Review the template

In this quickstart, you create a policy assignment and assign a built-in policy definition called
_Audit VMs that do not use managed disks_. For a partial list of available built-in policies, see
[Azure Policy samples](./samples/index.md).

The template used in this quickstart is from
[Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azurepolicy-assign-builtinpolicy-resourcegroup/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.authorization/azurepolicy-assign-builtinpolicy-resourcegroup/azuredeploy.json":::

The resource defined in the template is:

- [Microsoft.Authorization/policyAssignments](/azure/templates/microsoft.authorization/policyassignments)

## Deploy the template

> [!NOTE]
> Azure Policy service is free. For more information, see
> [Overview of Azure Policy](./overview.md).

1. Select the following image to sign in to the Azure portal and open the template:

   :::image type="content" source="../../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template for assigning an Azure Policy to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.authorization%2Fazurepolicy-assign-builtinpolicy-resourcegroup%2Fazuredeploy.json":::

1. Select or enter the following values:

   | Name | Value |
   |------|-------|
   | Subscription | Select your Azure subscription. |
   | Resource group | Select **Create new**, specify a name, and then select **OK**. In the screenshot, the resource group name is _mypolicyquickstart\<Date in MMDD\>rg_. |
   | Location | Select a region. For example, **Central US**. |
   | Policy Assignment Name | Specify a policy assignment name. You can use the policy definition display if you want. For example, _Audit VMs that do not use managed disks_. |
   | Resource Group Name | Specify a resource group name where you want to assign the policy to. In this quickstart, use the default value **[resourceGroup().name]**. **[resourceGroup()](../../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)** is a template function that retrieves the resource group. |
   | Policy Definition ID | Specify **/providers/Microsoft.Authorization/policyDefinitions/0a914e76-4921-4c19-b460-a2d36003525a**. |
   | I agree to the terms and conditions stated above | (Select) |

1. Select **Purchase**.

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

## Next steps

In this quickstart, you assigned a built-in policy definition to a scope and evaluated its
compliance report. The policy definition validates that all the resources in the scope are compliant
and identifies which ones aren't.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)

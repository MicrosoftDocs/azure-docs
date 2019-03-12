---
title: Create a policy assignment for non-compliant resources with a Resource Manager template
description: This article walks you through the steps to use a Resource Manager template to create a policy assignment to identify non-compliant resources.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 03/12/2019
ms.topic: quickstart
ms.service: azure-policy
manager: carmonm
---
# Create a policy assignment to identify non-compliant resources by using a Resource Manager template

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that aren't using managed disks.

At the end of this process, you'll successfully identify virtual machines that aren't using managed
disks. They're *non-compliant* with the policy assignment.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a policy assignment

In this quickstart, you create a policy assignment and assign a built-in policy definition called *Audit VMs that do not use managed disks*. For a partial list of available built-in policies, see [Policy samples](./samples/index).

There are several methods for creating policy assignments. In this quickstart, you use a [quickstart template](https://azure.microsoft.com/resources/templates/101-azurepolicy-assign-buildinpolicy-resourcegroup/). Here is a copy of the template:

[!code-json[policy-assingment](~/quickstart-templates/101-azurepolicy-assign-buildinpolicy-resourcegroup/azuredeploy.json)]

The template defines several parameters, which include the policy assignment name and the policy definition ID. Many people choose to use the policy display name as the policy assignment name. To retrieve the policy definition ID of *Audit VMs that do not use managed disks*, select **Try it** from the following code section to open the Azure Cloud shell. To paste the code, right-click the shell console, and then select **Paste**.

```azurepowershell-interactive
$definition = Get-AzPolicyDefinition | Where-Object { $_.Properties.DisplayName -eq 'Audit resource location matches resource group location' }
$policyAssignmentName = $definition.Properties.displayName
$policyDefinitionID = $definition.PolicyDefinitionId
```

1. Select the following image to sign in to the Azure portal and open the template:

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-azurepolicy-assign-buildinpolicy-resourcegroup%2Fazuredeploy.json"><img src="./media/assign-policy-template/deploy-to-azure.png" alt="deploy to azure"/></a>

2. Select or enter the following values:

    | Name | Value |
    |------|-------|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**, specify a name, and then select **OK**. In the screenshot, the resource group name is *mypolicyquickstart<Date in MMDD>rg*. |
    | Location | Select a region. For exammple, **Central US**. |
    | Policy Assignment Name | Specify a policy assignment name. You can use the policy definition display if you want. For example, **Audit VMs that do not use managed disks**. |
    | Rg Name | Specify a resource group name where you want to assign the policy to. In this quickstart, use the default value **[resourceGroup().name]**. **resourceGroup()** is a template function that retrieve the resource group. |
    | Policy Definition ID | Specify the policy definition ID you retrieved by using the PowerShell script at the beginning of this section. |
    | I agree to the terms and conditions stated above | (Select) |

3. Select **Purchase**.

## Identify non-compliant resources

Select **Compliance** in the left side of the page. Then locate the **Audit VMs that do not use
managed disks** policy assignment you created.

![Policy compliance](./media/assign-policy-template/policy-compliance.png)

If there are any existing resources that aren't compliant with this new assignment, they appear
under **Non-compliant resources**.

## Clean up resources

To remove the assignment created, follow these steps:

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate the **Audit VMs that do not use managed disks** policy assignment you created.

1. Right-click the **Audit VMs that do not use managed disks** policy assignment and select **Delete assignment**.

   ![Delete an assignment](./media/assign-policy-template/delete-assignment.png)

## Next steps

In this quickstart, you assigned a built-in policy definition to a scope and evaluated its compliance
report. The policy definition validates that all the resources in the scope are compliant and
identifies which ones aren't.

To learn more about assigning policies to validate that new resources are compliant, continue to
the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
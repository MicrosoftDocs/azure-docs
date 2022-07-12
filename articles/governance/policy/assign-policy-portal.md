---
title: "Quickstart: New policy assignment with portal"
description: In this quickstart, you use Azure portal to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 08/17/2021
ms.topic: quickstart
---
# Quickstart: Create a policy assignment to identify non-compliant resources

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that aren't using managed disks.

At the end of this process, you'll successfully identify virtual machines that aren't using managed
disks. They're _non-compliant_ with the policy assignment.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the _Audit VMs that do not use managed
disks_ policy definition.

1. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching
   for and selecting **Policy**.

   :::image type="content" source="./media/assign-policy-portal/search-policy.png" alt-text="Screenshot of searching for Policy in All Services." border="false":::

1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that
   has been assigned to take place within a specific scope.

   :::image type="content" source="./media/assign-policy-portal/select-assignments.png" alt-text="Screenshot of selecting the Assignments page from Policy Overview page." border="false":::

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.

   :::image type="content" source="./media/assign-policy-portal/select-assign-policy.png" alt-text="Screenshot of selecting 'Assign policy' from Assignments page." border="false":::

1. On the **Assign Policy** page, set the **Scope** by selecting the ellipsis and then selecting
   either a management group or subscription. Optionally, select a resource group. A scope
   determines what resources or grouping of resources the policy assignment gets enforced on. Then
   use the **Select** button at the bottom of the **Scope** page.

   This example uses the **Contoso** subscription. Your subscription will differ.

1. Resources can be excluded based on the **Scope**. **Exclusions** start at one level lower than
   the level of the **Scope**. **Exclusions** are optional, so leave it blank for now.

1. Select the **Policy definition** ellipsis to open the list of available definitions. Azure Policy
   comes with built-in policy definitions you can use. Many are available, such as:

   - Enforce tag and its value
   - Apply tag and its value
   - Inherit a tag from the resource group if missing

   For a partial list of available built-in policies, see [Azure Policy samples](./samples/index.md).

1. Search through the policy definitions list to find the _Audit VMs that do not use managed disks_
   definition. Select that policy and then use the **Select** button.

   :::image type="content" source="./media/assign-policy-portal/select-available-definition.png" alt-text="Screenshot of filtering the available definitions." border="false":::

1. The **Assignment name** is automatically populated with the policy name you selected, but you can
   change it. For this example, leave _Audit VMs that do not use managed disks_. You can also add an
   optional **Description**. The description provides details about this policy assignment.
   **Assigned by** will automatically fill based on who is logged in. This field is optional, so
   custom values can be entered.

1. Leave policy enforcement _Enabled_. For more information, see
   [Policy assignment - enforcement mode](./concepts/assignment-structure.md#enforcement-mode).

1. Select **Next** at the bottom of the page or the **Parameters** tab at the top of the page to
   move to the next segment of the assignment wizard.

1. If the policy definition selected on the **Basics** tab included parameters, they are configured
   on this tab. Since the _Audit VMs that do not use managed disks_ has no parameters, select
   **Next** at the bottom of the page or the **Remediation** tab at the top of the page to move to
   the next segment of the assignment wizard.

1. Leave **Create a Managed Identity** unchecked. This box _must_ be checked when the policy or
   initiative includes a policy with either the
   [deployIfNotExists](./concepts/effects.md#deployifnotexists) or
   [modify](./concepts/effects.md#modify) effect. As the policy used for this quickstart doesn't,
   leave it blank. For more information, see
   [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) and
   [how remediation access control works](./how-to/remediate-resources.md#how-remediation-access-control-works).

1. Select **Next** at the bottom of the page or the **Non-compliance messages** tab at the top of
   the page to move to the next segment of the assignment wizard.

1. Set the **Non-compliance message** to _Virtual machines should use a managed disk_. This custom
   message is displayed when a resource is denied or for non-compliant resources during regular
   evaluation.

1. Select **Next** at the bottom of the page or the **Review + Create** tab at the top of the page
   to move to the next segment of the assignment wizard.

1. Review the selected options, then select **Create** at the bottom of the page.

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Select **Compliance** in the left side of the page. Then locate the _Audit VMs that do not use
managed disks_ policy assignment you created.

:::image type="content" source="./media/assign-policy-portal/policy-compliance.png" alt-text="Screenshot of compliance details on the Policy Compliance page." border="false":::

If there are any existing resources that aren't compliant with this new assignment, they appear
under **Non-compliant resources**.

When a condition is evaluated against your existing resources and found true, then those resources
are marked as non-compliant with the policy. The following table shows how different policy effects
work with the condition evaluation for the resulting compliance state. Although you don't see the
evaluation logic in the Azure portal, the compliance state results are shown. The compliance state
result is either compliant or non-compliant.

| Resource State | Effect | Policy Evaluation | Compliance State |
| --- | --- | --- | --- |
| New or Updated | Audit, Modify, AuditIfNotExist | True | Non-Compliant |
| New or Updated | Audit, Modify, AuditIfNotExist | False | Compliant |
| Exists | Deny, Audit, Append, Modify, DeployIfNotExist, AuditIfNotExist | True | Non-Compliant |
| Exists | Deny, Audit, Append, Modify, DeployIfNotExist, AuditIfNotExist | False | Compliant |

> [!NOTE]
> The DeployIfNotExist and AuditIfNotExist effects require the IF statement to be TRUE and the
> existence condition to be FALSE to be non-compliant. When TRUE, the IF condition triggers
> evaluation of the existence condition for the related resources.

## Clean up resources

To remove the assignment created, follow these steps:

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate
   the _Audit VMs that do not use managed disks_ policy assignment you created.

1. Right-click the _Audit VMs that do not use managed disks_ policy assignment and select **Delete
   assignment**.

   :::image type="content" source="./media/assign-policy-portal/delete-assignment.png" alt-text="Screenshot of using the context menu to delete an assignment from the Compliance page." border="false":::

## Next steps

In this quickstart, you assigned a policy definition to a scope and evaluated its compliance report.
The policy definition validates that all the resources in the scope are compliant and identifies
which ones aren't.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)

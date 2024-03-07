---
title: "Quickstart: Create policy assignment using Azure portal"
description: In this quickstart, you create an Azure Policy assignment to identify non-compliant resources using Azure portal.
ms.date: 02/29/2024
ms.topic: quickstart
---

# Quickstart: Create a policy assignment to identify non-compliant resources using Azure portal

The first step in understanding compliance in Azure is to identify the status of your resources. In this quickstart, you create a policy assignment to identify non-compliant resources using Azure portal. The policy is assigned to a resource group and audits virtual machines that don't use managed disks. After you create the policy assignment, you identify non-compliant virtual machines.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A resource group with at least one virtual machine that doesn't use managed disks.

## Create a policy assignment

In this quickstart, you create a policy assignment with a built-in policy definition, [Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for _policy_ and select it from the list.

   :::image type="content" source="./media/assign-policy-portal/search-policy.png" alt-text="Screenshot of the Azure portal to search for policy.":::

1. Select **Assignments** on the **Policy** pane.

   :::image type="content" source="./media/assign-policy-portal/select-assignments.png" alt-text="Screenshot of the Assignments pane that highlights the option to Assign policy.":::

1. Select **Assign Policy** from the **Policy Assignments** pane.

1. On the **Assign Policy** pane **Basics** tab configure the following options:

   | Field | Action |
   | ---- | ---- |
   | **Scope** | Use the ellipsis (`...`) and then select a subscription and a resource group. Then choose **Select** to apply the scope. |
   | **Exclusions** | Optional and isn't used in this example. |
   | **Policy definition** | Select the ellipsis to open the list of available definitions. |
   | **Available Definitions** | Search the policy definitions list for _Audit VMs that do not use managed disks_ definition, select the policy, and select **Add**. |
   | **Assignment name** | By default uses the name of the selected policy. You can change it but for this example, use the default name. |
   | **Description** | Optional to provide details about this policy assignment. |
   | **Policy enforcement** | Defaults to _Enabled_. For more information, go to [enforcement mode](./concepts/assignment-structure.md#enforcement-mode). |
   | **Assigned by** | Defaults to who is signed in to Azure. This field is optional and custom values can be entered. |

   :::image type="content" source="./media/assign-policy-portal/select-available-definition.png" alt-text="Screenshot of filtering the available definitions.":::

1. Select **Next** to view each tab for **Advanced**, **Parameters**, and **Remediation**. No changes are needed for this example.

   | Tab name | Options |
   | ---- | ---- |
   | **Advanced** | Includes options for [resource selectors](./concepts/assignment-structure.md#resource-selectors) and [overrides](./concepts/assignment-structure.md#overrides). |
   | **Parameters** | If the policy definition you selected on the **Basics** tab included parameters, they're configured on **Parameters** tab. This example doesn't use parameters. |
   | **Remediation** | You can create a managed identity. For this example, **Create a Managed Identity** is unchecked. <br><br> This box _must_ be checked when a policy or initiative includes a policy with either the [deployIfNotExists](./concepts/effects.md#deployifnotexists) or [modify](./concepts/effects.md#modify) effect. For more information, go to [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) and [how remediation access control works](./how-to/remediate-resources.md#how-remediation-access-control-works). |

1. Select **Next** and on the **Non-compliance messages** tab create a **Non-compliance message** like _Virtual machines should use managed disks_.

   This custom message is displayed when a resource is denied or for non-compliant resources during regular evaluation.

1. Select **Next** and on the **Review + create** tab, review the policy assignment details.

1. Select **Create** to create the policy assignment.

## Identify non-compliant resources

On the **Policy** pane, select **Compliance** and locate the _Audit VMs that do not use managed disks_ policy assignment. The compliance state for a new policy assignment takes a few minutes to become active and provide results about the policy's state.

:::image type="content" source="./media/assign-policy-portal/policy-compliance.png" alt-text="Screenshot of the Policy Compliance that highlights the example's non-compliant policy assignment." lightbox="./media/assign-policy-portal/policy-compliance.png":::

The policy assignment shows resources that aren't compliant with a **Compliance state** of **Non-compliant**. To get more details, select the policy assignment name to view the **Resource Compliance**.

When a condition is evaluated against your existing resources and found true, then those resources are marked as non-compliant with the policy. The following table shows how different policy effects work with the condition evaluation for the resulting compliance state. Although you don't see the evaluation logic in the Azure portal, the compliance state results are shown. The compliance state result is either compliant or non-compliant.

| Resource State | Effect | Policy Evaluation | Compliance State |
| --- | --- | --- | --- |
| New or Updated | Audit, Modify, AuditIfNotExist | True | Non-Compliant |
| New or Updated | Audit, Modify, AuditIfNotExist | False | Compliant |
| Exists | Deny, Audit, Append, Modify, DeployIfNotExist, AuditIfNotExist | True | Non-Compliant |
| Exists | Deny, Audit, Append, Modify, DeployIfNotExist, AuditIfNotExist | False | Compliant |

The `DeployIfNotExist` and `AuditIfNotExist` effects require the `IF` statement to be `TRUE` and the existence condition to be `FALSE` to be non-compliant. When `TRUE`, the `IF` condition triggers evaluation of the existence condition for the related resources.

## Clean up resources

You can delete a policy assignment from **Compliance** or from **Assignments**.

To remove the policy assignment created in this article, follow these steps:

1. On the **Policy** pane, select **Compliance** and locate the _Audit VMs that do not use managed disks_ policy assignment.

1. Select the policy assignment's ellipsis and select **Delete assignment**.

   :::image type="content" source="./media/assign-policy-portal/delete-assignment.png" alt-text="Screenshot of the Compliance pane that highlights the menu to delete a policy assignment." lightbox="./media/assign-policy-portal/delete-assignment.png":::

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about how to assign policies that validate resource compliance, continue to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create and manage policies to enforce compliance](./tutorials/create-and-manage.md)

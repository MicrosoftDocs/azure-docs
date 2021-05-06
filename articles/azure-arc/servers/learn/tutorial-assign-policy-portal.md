---
title: Tutorial - New policy assignment with Azure portal
description: In this tutorial, you use Azure portal to create an Azure Policy assignment to identify non-compliant resources.
ms.topic: tutorial
ms.date: 04/21/2021
---

# Tutorial: Create a policy assignment to identify non-compliant resources

The first step in understanding compliance in Azure is to identify the status of your resources. Azure Policy supports auditing the state of your Arc enabled server with Guest Configuration policies. Guest Configuration policies do not apply configurations, they only audit settings inside the machine. This tutorial steps you through the process of creating and assigning a policy, identifying which of your Arc enabled servers don't have the Log Analytics agent installed.

At the end of this process, you'll successfully identify machines that don't have the Log Analytics agent for Windows or Linux installed. They're _non-compliant_ with the policy assignment.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a policy assignment

In this tutorial, you create a policy assignment and assign the _\[Preview]: Log Analytics agent should be installed on your Linux Azure Arc machines_ policy definition.

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching
   for and selecting **Policy**.

   :::image type="content" source="./media/tutorial-assign-policy-portal/search-policy.png" alt-text="Search for Policy in All Services" border="false":::

1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that
   has been assigned to take place within a specific scope.

   :::image type="content" source="./media/tutorial-assign-policy-portal/select-assignment.png" alt-text="Select Assignments page from Policy Overview page" border="false":::

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.

   :::image type="content" source="./media/tutorial-assign-policy-portal/select-assign-policy.png" alt-text="Assign a policy definition from Assignments page" border="false":::

1. On the **Assign Policy** page, select the **Scope** by clicking the ellipsis and selecting either
   a management group or subscription. Optionally, select a resource group. A scope determines what
   resources or grouping of resources the policy assignment gets enforced on. Then click **Select**
   at the bottom of the **Scope** page.

   This example uses the **Parnell Aerospace** subscription. Your subscription will differ.

1. Resources can be excluded based on the **Scope**. **Exclusions** start at one level lower than
   the level of the **Scope**. **Exclusions** are optional, so leave it blank for now.

1. Select the **Policy definition** ellipsis to open the list of available definitions. Azure Policy
   comes with built-in policy definitions you can use. Many are available, such as:

   - Enforce tag and its value
   - Apply tag and its value
   - Inherit a tag from the resource group if missing

   For a partial list of available built-in policies, see [Azure Policy samples](../../../governance/policy/samples/index.md).

1. Search through the policy definitions list to find the _\[Preview]: Log Analytics agent should be installed on your Windows Azure Arc machines_
   definition if you have enabled the Arc enabled servers agent on a Windows-based machine. For a Linux-based machine, find the corresponding _\[Preview]: Log Analytics agent should be installed on your Linux Azure Arc machines_ policy definition. Click on that policy and click **Select**.

   :::image type="content" source="./media/tutorial-assign-policy-portal/select-available-definition.png" alt-text="Find the correct policy definition" border="false":::

1. The **Assignment name** is automatically populated with the policy name you selected, but you can
   change it. For this example, leave _\[Preview]: Log Analytics agent should be installed on your Windows Azure Arc machines_ or _\[Preview]: Log Analytics agent should be installed on your Linux Azure Arc machines_ depending on which one you selected. You can also add an optional **Description**. The description provides details about this policy assignment.
   **Assigned by** will automatically fill based on who is logged in. This field is optional, so
   custom values can be entered.

1. Leave **Create a Managed Identity** unchecked. This box _must_ be checked when the policy or
   initiative includes a policy with the
   [deployIfNotExists](../../../governance/policy/concepts/effects.md#deployifnotexists) effect. As the policy used for this
   quickstart doesn't, leave it blank. For more information, see
   [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md) and
   [how remediation security works](../../../governance/policy/how-to/remediate-resources.md#how-remediation-security-works).

1. Click **Assign**.

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Select **Compliance** in the left side of the page. Then locate the **\[Preview]: Log Analytics agent should be installed on your Windows Azure Arc machines** or **\[Preview]: Log Analytics agent should be installed on your Linux Azure Arc machines** policy assignment you created.

:::image type="content" source="./media/tutorial-assign-policy-portal/policy-compliance.png" alt-text="Compliance details on the Policy Compliance page" border="false":::

If there are any existing resources that aren't compliant with this new assignment, they appear
under **Non-compliant resources**.

When a condition is evaluated against your existing resources and found true, then those resources
are marked as non-compliant with the policy. The following table shows how different policy effects
work with the condition evaluation for the resulting compliance state. Although you don't see the
evaluation logic in the Azure portal, the compliance state results are shown. The compliance state
result is either compliant or non-compliant.

| **Resource State** | **Effect** | **Policy Evaluation** | **Compliance State** |
| --- | --- | --- | --- |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | True | Non-Compliant |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | False | Compliant |
| New | Audit, AuditIfNotExist\* | True | Non-Compliant |
| New | Audit, AuditIfNotExist\* | False | Compliant |

\* The Append, DeployIfNotExist, and AuditIfNotExist effects require the IF statement to be TRUE.
The effects also require the existence condition to be FALSE to be non-compliant. When TRUE, the IF
condition triggers evaluation of the existence condition for the related resources.

## Clean up resources

To remove the assignment created, follow these steps:

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate
   the **\[Preview]: Log Analytics agent should be installed on your Windows Azure Arc machines** or **\[Preview]: Log Analytics agent should be installed on your Linux Azure Arc machines** policy assignment you created.

1. Right-click the policy assignment and select **Delete assignment**.

   :::image type="content" source="./media/tutorial-assign-policy-portal/delete-assignment.png" alt-text="Delete an assignment from the Compliance page" border="false":::

## Next steps

In this tutorial, you assigned a policy definition to a scope and evaluated its compliance report. The policy definition validates that all the resources in the scope are compliant and identifies which ones aren't. Now you are ready to monitor your Azure Arc enabled servers machine by enabling [VM insights](../../../azure-monitor/vm/vminsights-overview.md).

To learn how to monitor and view the performance, running process and their dependencies from your machine, continue to the tutorial:

> [!div class="nextstepaction"]
> [Enable VM insights](tutorial-enable-vm-insights.md)
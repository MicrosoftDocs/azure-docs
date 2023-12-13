---
title: Tutorial - New policy assignment with Azure portal
description: In this tutorial, you use Azure portal to create an Azure Policy assignment to identify non-compliant resources.
ms.topic: tutorial
ms.date: 04/20/2022
---

# Tutorial: Create a policy assignment to identify non-compliant resources

The first step in understanding compliance in Azure is to identify the status of your resources. Azure Policy supports auditing the state of your Azure Arc-enabled server with guest configuration policies. Azure Policy's guest configuration definitions can audit or apply settings inside the machine. 

This tutorial steps you through the process of creating and assigning a policy in order to identify which of your Azure Arc-enabled servers don't have the Log Analytics agent for Windows or Linux installed. These machines are considered _non-compliant_ with the policy assignment.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Create policy assignment and assign a definition to it
> * Identify resources that aren't compliant with the new policy
> * Remove the policy from non-compliant resources


## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a policy assignment

Follow the steps below to create a policy assignment and assign the policy definition _\[Preview]: Log Analytics extension should be installed on your Linux Azure Arc machines_:

1. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching
   for and selecting **Policy**.

   :::image type="content" source="./media/tutorial-assign-policy-portal/all-services-page.png" alt-text="Screenshot of All services window showing search for policy service." border="true":::

1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that
   has been assigned to take place within a specific scope.

    :::image type="content" source="./media/tutorial-assign-policy-portal/assignments-tab.png" alt-text="Screenshot of All services Policy window showing policy assignments." border="true":::

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.

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

1. Search through the policy definitions list to find the _\[Preview]: Log Analytics extension should be installed on your Windows Azure Arc machines_
   definition (if you have enabled the Azure Connected Machine agent on a Windows-based machine). For a Linux-based machine, find the corresponding _\[Preview]: Log Analytics extension should be installed on your Linux Azure Arc machines_ policy definition. Click on that policy and click **Add**.

1. The **Assignment name** is automatically populated with the policy name you selected, but you can
   change it. For this example, leave the policy name as is, and don't change any of the remaining options on the page.
 
1. For this example, we don't need to change any settings on the other tabs. Select **Review + Create** to review your new policy assignment, then select **Create**.

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Select **Compliance** in the left side of the page. Then locate the **\[Preview]: Log Analytics extension should be installed on your Windows Azure Arc machines** or **\[Preview]: Log Analytics extension should be installed on your Linux Azure Arc machines** policy assignment you created.

:::image type="content" source="./media/tutorial-assign-policy-portal/compliance-policy.png" alt-text="Screenshot of Policy Compliance page showing policy compliance for the selected scope." border="true":::

If there are any existing resources that aren't compliant with this new assignment, they appear
under **Non-compliant resources**.

When a condition is evaluated against your existing resources and found true, then those resources
are marked as non-compligitant with the policy. The following table shows how different policy effects
work with the condition evaluation for the resulting compliance state. Although you don't see the
evaluation logic in the Azure portal, the compliance state results are shown. The compliance state
result is either compliant or non-compliant.

| **Resource state** | **Effect** | **Policy evaluation** | **Compliance state** |
| --- | --- | --- | --- |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | True | Non-compliant |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | False | Compliant |
| New | Audit, AuditIfNotExist\* | True | Non-compliant |
| New | Audit, AuditIfNotExist\* | False | Compliant |

\* The Append, DeployIfNotExist, and AuditIfNotExist effects require the IF statement to be TRUE.
The effects also require the existence condition to be FALSE to be non-compliant. When TRUE, the IF
condition triggers evaluation of the existence condition for the related resources.

## Clean up resources

To remove the assignment created, follow these steps:

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate
   the **\[Preview]: Log Analytics extension should be installed on your Windows Azure Arc machines** or **\[Preview]: Log Analytics extension should be installed on your Linux Azure Arc machines** policy assignment you created.

1. Right-click the policy assignment and select **Delete assignment**.

## Next steps

In this tutorial, you assigned a policy definition to a scope and evaluated its compliance report. The policy definition validates that all the resources in the scope are compliant and identifies which ones aren't. Now you are ready to monitor your Azure Arc-enabled servers machine by enabling [VM insights](../../../azure-monitor/vm/vminsights-overview.md).

To learn how to monitor and view the performance, running process and their dependencies from your machine, continue to the tutorial:

> [!div class="nextstepaction"]
> [Enable VM insights](tutorial-enable-vm-insights.md)

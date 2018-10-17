---
title: Create a policy assignment to identify non-compliant resources in your Azure environment
description: This article walks you through the steps to create a policy definition to identify non-compliant resources.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: quickstart
ms.service: azure-policy
ms.custom: mvc
manager: carmonm
---
# Create a policy assignment to identify non-compliant resources in your Azure environment

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that are not using managed disks.

At the end of this process, you will successfully identify virtual machines that are not using
managed disks. They are *non-compliant* with the policy assignment.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the *Audit Virtual Machines without
Managed Disks* policy definition.

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching for and selecting **Policy**.

   ![Search for policy](./media/assign-policy-portal/search-policy.png)

1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that has been assigned to take place within a specific scope.

   ![Select assignments](./media/assign-policy-portal/select-assignments.png)

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.

   ![Assign a policy definition](./media/assign-policy-portal/select-assign-policy.png)

1. On the **Assign Policy** page, select the **Scope** by clicking the ellipsis and selecting either a management group or subscription. Optionally, select a resource group. A scope determines what resources or grouping of resources the policy assignment gets enforced on.  Then click **Select** at the bottom of the **Scope** page.

   This example uses the **Contoso** subscription. Your subscription will differ.

1. Resources can be excluded based on the **Scope**.  **Exclusions** start at one level lower than the level of the **Scope**. **Exclusions** are optional, so leave it blank for now.

1. Select the **Policy definition** ellipsis to open the list of available definitions. Azure Policy comes with built-in policy definitions you can use. Many are available, such as:

   - Enforce tag and its value
   - Apply tag and its value
   - Require SQL Server version 12.0

   For a complete list of all the available built-in polices, see [Policy samples](./samples/index.md).

1. Search through the policy definitions list to find the *Audit VMs that do not use managed disks* definition. Click on that policy and click **Select**.

   ![Find the correct policy definition](./media/assign-policy-portal/select-available-definition.png)

1. The **Assignment name** is automatically populated with the policy name you selected, but you can change it. For this example, leave *Audit VMs that do not use managed disks*. You can also add an optional **Description**. The description provides details about this policy assignment. **Assigned by** will automatically fill based on who is logged in. This field is optional, so custom values can be entered.

1. Leave **Create a Managed Identity** unchecked. This _must_ be checked when the policy or initiative being assigned includes a policy with the [deployIfNotExists](./concepts/effects.md#deployifnotexists) effect. As the policy used for this quickstart does not, leave it blank. For more information, see [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) and [how remediation security works](./how-to/remediate-resources.md#how-remediation-security-works).

1. Click **Assign**.

You’re now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Select **Compliance** in the left side of the page and locate the **Audit VMs that do not use
managed disks** policy assignment you created.

![Policy compliance](./media/assign-policy-portal/policy-compliance.png)

If there are any existing resources that are not compliant with this new assignment, they appear
under **Non-compliant resources**.

When a condition is evaluated against your existing resources and found true, then those resources
are marked as non-compliant with the policy. The following table shows how different policy effects
work with the condition evaluation for the resulting compliance state. Although you don’t see the
evaluation logic in the Azure portal, the compliance state results are shown. The compliance state
result is either compliant or non-compliant.

| **Resource State** | **Effect** | **Policy Evaluation** | **Compliance State** |
| --- | --- | --- | --- |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | True | Non-Compliant |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | False | Compliant |
| New | Audit, AuditIfNotExist\* | True | Non-Compliant |
| New | Audit, AuditIfNotExist\* | False | Compliant |

\* The Append, DeployIfNotExist, and AuditIfNotExist effects require the IF statement to be TRUE. The effects also require the existence condition to be FALSE to be non-compliant. When TRUE, the IF condition triggers evaluation of the existence condition for the related resources.

## Clean up resources

Other guides in this collection build upon this quickstart. If you plan to continue to work with
subsequent tutorials, do not clean up the resources created in this quickstart. If you do not plan
to continue, use the following steps to delete all resources created by this quickstart in the
Azure portal.

1. Select **Compliance** (or **Assignments**) in the left side of the Azure Policy page and locate the **Audit VMs that do not use managed disks** policy assignment you created.

1. Right-click the **Audit VMs that do not use managed disks** policy assignment and select **Delete assignment**

   ![Delete an assignment](./media/assign-policy-portal/delete-assignment.png)

## Next steps

In this quickstart, you assigned a policy definition to a scope and evaluated its compliance
report. The policy definition ensures that all the resources in the scope are compliant and
identifies which ones aren’t.

To learn more about assigning policies to ensure that **future** resources that get created are
compliant, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
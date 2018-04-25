---
title: Create a policy assignment to identify non-compliant resources in your Azure environment | Microsoft Docs
description: This article walks you through the steps to create a policy definition to identify non-compliant resources.
services: azure-policy
keywords:
author: DCtheGeek
ms.author: dacoulte
ms.date: 04/18/2018
ms.topic: quickstart
ms.service: azure-policy
ms.custom: mvc
---

# Create a policy assignment to identify non-compliant resources in your Azure environment
The first step in understanding compliance in Azure is to identify the status of your resources. This quickstart steps you through the process of creating a policy assignment to identify virtual machines that are not using managed disks.

At the end of this process, you will successfully identify virtual machines that are not using managed disks. They are *non-compliant* with the policy assignment.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the *Audit Virtual Machines without Managed Disks* policy definition.

1. Select **Assignments** on the left pane of the Azure Policy page.
2. Select **Assign Policy** from the top of the **Assignments** pane.

   ![Assign a policy definition](media/assign-policy-definition/select-assign-policy.png)

3. On the **Assign Policy** page, click ![Policy definition button](media/assign-policy-definition/definitions-button.png) next to **Policy** field to open the list of available definitions.

   ![Open available policy definitions](media/assign-policy-definition/open-policy-definitions.png)

   Azure Policy comes with already built-in policy definitions you can use. You see built-in policy definitions such as:

   - Enforce tag and its value
   - Apply tag and its value
   - Require SQL Server Version 12.0

    For a complete list of all the available built-in polices, see [Policy templates](json-samples.md).

4. Search through your policy definitions to find the *Audit VMs that do not use managed disks* definition. Click on that policy and click **Select**.

   ![Find the correct policy definition](media/assign-policy-definition/select-available-definition.png)

5. Provide a display **Name** for the policy assignment. In this case, let’s use *Audit VMs that do not use managed disks*. You can also add an optional **Description**. The description provides details about how the policy assignment identifies all virtual machines that don't use managed disks.
6. Change the pricing tier to **Standard** to ensure that the policy gets applied to existing resources.

   There are two pricing tiers within Azure Policy – *Free* and *Standard*. With the Free tier, you can only enforce policies on future resources, while with Standard, you can also enforce them on existing resources to better understand your compliance state. To read more about pricing, see [Azure Policy pricing](https://azure.microsoft.com/pricing/details/azure-policy/).

7. Select the **Scope** you would like the policy to be applied to.  A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a subscription to resource groups.
8. Select the subscription (or resource group) you previously registered. In this example the **Azure Analytics Capacity Dev** subscription is used, but your options might differ. Click **Select**.

   ![Find the correct policy definition](media/assign-policy-definition/assign-policy.png)

9. Leave **Exclusions** blank for now and then click **Assign**.

You’re now ready to identify non-compliant resources to understand the compliance state of your environment.

## Identify non-compliant resources

Select **Compliance** on the left pane, and search for the policy assignment you created.

![Policy compliance](media/assign-policy-definition/policy-compliance.png)

If there are any existing resources that are not compliant with this new assignment, they appear under **Non-compliant resources**.

When a condition is evaluated against your existing resources and found true, then those resources are marked as non-compliant with the policy. The preceding example image displays non-compliant resources. The following table shows how different policy actions work with the condition evaluation for the resulting compliance state. Although you don’t see the evaluation logic in the Azure portal, the compliance state results are shown. The compliance state result is either compliant or non-compliant.

| **Resource State** | **Action** | **Policy Evaluation** | **Compliance State** |
| --- | --- | --- | --- |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | True | Non-Compliant |
| Exists | Deny, Audit, Append\*, DeployIfNotExist\*, AuditIfNotExist\* | False | Compliant |
| New | Audit, AuditIfNotExist\* | True | Non-Compliant |
| New | Audit, AuditIfNotExist\* | False | Compliant |

\* The Append, DeployIfNotExist, and AuditIfNotExist actions require the IF statement to be TRUE. The actions also require the existence condition to be FALSE to be non-compliant. When TRUE, the IF condition triggers evaluation of the existence condition for the related resources.
## Clean up resources

Other guides in this collection build upon this quickstart. If you plan to continue to work with subsequent tutorials, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart in the Azure portal.
1. Select **Assignments** on the left pane.
2. Search for the assignment you created and then right-click it.

   ![Delete an assignment](media/assign-policy-definition/delete-assignment.png)

3.	Select **Delete Assignment**.

## Next steps

In this quickstart, you assigned a policy definition to a scope. The policy definition ensures that all the resources in the scope are compliant and identifies which ones aren’t.

To learn more about assigning policies to ensure that **future** resources that get created are compliant, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./create-manage-policy.md)

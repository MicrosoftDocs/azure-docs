---
title: Restrict allowed lab VM sizes
description: Learn how to use the Lab Services should restrict allowed virtual machine SKU sizes Azure Policy to restrict educators to specified virtual machine sizes for their labs.  
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 08/28/2023
---

# Restrict allowed virtual machine sizes for labs

In this article, you learn how to restrict the list of allowed lab virtual machine sizes for creating new labs by using an Azure policy. As a platform administrator, you can use policies to lay out guardrails for teams to manage their own resources. [Azure Policy](/azure/governance/policy/) helps audit and govern resource state.

[!INCLUDE [lab plans only note](./includes/lab-services-new-update-focused-article.md)]

## Configure the policy

1.	Sign in to the [Azure portal](https://portal.azure.com), and then go to your subscription.

1.	From the left menu, under **Settings**, select **Policies**.

1.	Under **Compliance**, select **Assign Policy**.

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy.png" alt-text="Screenshot showing the Policy Compliance dashboard with Assign policy highlighted."::: 

1.	Select the **Scope** which you would like to assign the policy to, and then select **Select**. 

    Select the subscription to apply the policy to all resources. You can also select a resource group if you need the policy to apply more granularly.

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-basics-scope.png" alt-text="Screenshot showing the Scope pane with subscription highlighted."::: 

1.	Select **Policy definition**.

1. In **Available Definitions**, search for *Lab Services*, select **Lab Services should restrict allowed virtual machine SKU sizes**, and then select **Add**.

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-basics-definitions.png" alt-text="Screenshot showing the Available definitions pane with Lab Services should restrict allowed virtual machine SKU sizes highlighted. "::: 

1.	On the **Basics** tab, select **Next**.

1.	On the **Parameters** tab, clear **Only show parameters that need input or review** to show all parameters.

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-parameters.png" alt-text="Screenshot showing the Parameters tab with Only show parameters that need input or review highlighted. "::: 

1.	In **Allowed SKU names**, clear the check boxes for any SKU that you don't allow for creating labs.

    By default all the available SKUs are allowed. Use the following table to determine which SKU names you want to allow.

    |SKU Name|VM Size|VM Size Details|
    |-----|-----|-----|
    |CLASSIC_FSV2_2_4GB_128_S_SSD|	Small 	|2vCPUs, 4 GB RAM, 128 GB, Standard SSD
    |CLASSIC_FSV2_4_8GB_128_S_SSD|	Medium |4vCPUs, 8 GB RAM, 128 GB, Standard SSD
    |CLASSIC_FSV2_8_16GB_128_S_SSD|	Large 	|8vCPUs, 16 GB RAM, 128 GB, Standard SSD
    |CLASSIC_DSV4_4_16GB_128_P_SSD|	Medium (Nested virtualization)	|4 vCPUs, 16 GB RAM, 128 GB, Premium SSD
    |CLASSIC_DSV4_8_32GB_128_P_SSD|	Large (Nested virtualization)	|8vCPUs, 32 GB RAM, 128 GB, Premium SSD
    |CLASSIC_NCSV3_6_112GB_128_S_SSD|	Small GPU (Compute)	|6vCPUs, 112 GB RAM, 128 GB, Standard SSD
    |CLASSIC_NVV4_8_28GB_128_S_SSD|	Small GPU (Visualization)	|8vCPUs, 28 GB RAM, 128 GB, Standard SSD
    |CLASSIC_NVV3_12_112GB_128_S_SSD|	Medium GPU (Visualization)	|12vCPUs, 112 GB RAM, 128 GB, Standard SSD

1.	In **Effect**, select **Deny** to prevent a lab from being created when a VM SKU isn't allowed.

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-parameters-effect.png" alt-text="Screenshot showing the effect list.":::

1.	Optionally, on the **Non-compliance messages** tab, enter a noncompliance message.

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-message.png" alt-text="Screenshot showing the Non-compliance tab with an example noncompliance message.":::

1.	On the **Review + Create** tab, select **Create** to create the policy assignment.

You've created a policy assignment to allow only specific virtual machine sizes for creating labs. If a lab creator attempts to create a lab with any other SKU, the creation fails.

> [!NOTE]
> New policy assignments can take up to 30 minutes to take effect.

## Exclude resources

When applying a built-in policy, you can choose to exclude certain resources, except for lab plans.  For example, if the scope of your policy assignment is a subscription, you can exclude resources in a specified resource group.

You can configure exclusions when creating a policy definition by specifying the **Exclusions** property on the **Basics** tab.

:::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-basics-exclusions.png" alt-text="Screenshot showing the Basics tab with Exclusions highlighted.":::


## Exclude a lab plan

You can exclude a lab plan from a policy assignment by specifying the lab plan ID in the policy definition.

1. To get the lab plan ID:

    1. In the [Azure portal](https://portal.azure.com), select your lab plan.
    1. Under **Setting**, select **Properties**, and then copy the **Id**.

        :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/resource-id.png" alt-text="Screenshot showing the lab plan properties with Id highlighted.":::

1. To exclude the lab plan from the policy assignment:

    1. Assign a new policy definition.
    1. On the **Parameters** tab, clear **Only show parameters that need input or review**.
    1. For **Lab Plan Id to exclude**, enter the lab plan ID you copied earlier.

        :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-exclude-lab-plan-id.png" alt-text="Screenshot showing the Parameter tab with Lab Plan ID to exclude highlighted.":::

## Related content

- [Use Azure Policy to audit and manage Azure Lab Services?](./azure-polices-for-lab-services.md)

- [What is Azure policy?](/azure/governance/policy/overview)

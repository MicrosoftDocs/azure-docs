---
title: How to restrict the virtual machine sizes allowed for labs
description: Learn how to use the Lab Services should restrict allowed virtual machine SKU sizes Azure Policy to restrict educators to specified virtual machine sizes for their labs.  
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 08/23/2022
---

# How to restrict the virtual machine sizes allowed for labs

In this how to, you'll learn how to use the *Lab Services should restrict allowed virtual machine SKU sizes* Azure policy to control the SKUs available to educators when they're creating labs.  In this example, you'll see how a lab administrator can allow only non-GPU SKUs, so educators can create only non-GPU SKU labs.

[!INCLUDE [lab plans only note](./includes/lab-services-new-update-focused-article.md)]

## Configure the policy

1.	In the [Azure portal](https://portal.azure.com), go to your subscription.

1.	From the left menu, under **Settings**, select **Policies**.

1.	Under **Authoring**, select **Assignments**.

1.	Select **Assign Policy**.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy.png" alt-text="Screenshot showing the Policy Compliance dashboard with Assign policy highlighted."::: 

1.	Select the **Scope** which you would like to assign the policy to, and then select **Select**. 
    You can also select a resource group if you need the policy to apply more granularly.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-basics-scope.png" alt-text="Screenshot showing the Scope pane with subscription highlighted."::: 

1.	Select Policy Definition. In Available definitions, search for *Lab Services*, select **Lab Services should restrict allowed virtual machine SKU sizes** and then select **Select**.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-basics-definitions.png" alt-text="Screenshot showing the Available definitions pane with Lab Services should restrict allowed virtual machine SKU sizes highlighted. "::: 

1.	On the Basics tab, select **Next**.

1.	On the Parameters tab, clear **Only show parameters that need input or review** to show all parameters.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-parameters.png" alt-text="Screenshot showing the Parameters tab with Only show parameters that need input or review highlighted. "::: 

1.	The **Allowed SKU names** parameter shows the SKUs allowed when the policy is applied. By default all the available SKUs are allowed. You must clear the check boxes for any SKU that you don't wish to allow educators to use to create labs. In this example, only the following non-GPU SKUs are allowed:
    - CLASSIC_FSV2_2_4GB_128_S_SSD 
    - CLASSIC_FSV2_4_8GB_128_S_SSD 
    - CLASSIC_FSV2_8_16GB_128_S_SSD 
    - CLASSIC_DSV4_4_16GB_128_P_SSD 
    - CLASSIC_DSV4_8_32GB_128_P_SSD 

    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-parameters-vms.png" alt-text="Screenshot showing the Allowed SKUs.":::

    Use the table below to determine which SKU names to apply.

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

1.	In **Effect**, select **Deny**. Selecting deny will prevent a lab from being created if an educator tries to use a GPU SKU.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-parameters-effect.png" alt-text="Screenshot showing the effect list.":::

1.	Select **Next**. 
 
1.	On the Remediation tab, select **Next**.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-remediation.png" alt-text="Screenshot showing the Remediation tab with Next highlighted.":::
 
1.	On the Non-compliance tab, in **Non-compliance messages**, enter a non-compliance message of your choice like “Selected SKU is not allowed”, and then select **Next**.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-message.png" alt-text="Screenshot showing the Non-compliance tab with an example non-compliance message.":::

1.	On the Review + Create tab, select **Create** to create the policy assignment.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-review-create.png" alt-text="Screenshot showing the Review and Create tab.":::

You've created a policy assignment for *Lab Services should restrict allowed virtual machine SKU sizes* and allowed only the use of non-GPU SKUs for labs. Attempting to create a lab with any other SKU will fail.

> [!NOTE]
> New policy assignments can take up to 30 minutes to take effect.

## Exclude resources

When applying a built-in policy, you can choose to exclude certain resources, with the exception of lab plans.  For example, if the scope of your policy assignment is a subscription, you can exclude resources in a specified resource group.  Exclusions are configured using the Exclusions property on the Basics tab when creating a policy definition.

:::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-basics-exclusions.png" alt-text="Screenshot showing the Basics tab with Exclusions highlighted.":::


## Exclude a lab plan

Lab plans cannot be excluded using the Exclusions property on the Basics tab. To exclude a lab plan from a policy assignment, you first need to get the lab plan resource ID, and then use it to specify the lab pan you want to exclude on the Parameters tab.

### Locate and copy lab plan resource ID
Use the following steps to locate and copy the resource ID so that you can paste it into the exclusion configuration.   
1.	In the [Azure portal](https://portal.azure.com), go to the lab plan you want to exclude. 

1.	Under Settings, select Properties, and then copy the **Resource ID**.
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/resource-id.png" alt-text="Screenshot showing the lab plan properties with resource ID highlighted.":::

### Enter the lab plan to exclude in the policy
Now you have a lab plan resource ID, you can use it to exclude the lab plan as you assign the policy.
1.	On the Parameters tab, clear **Only show parameters that need input or review**.
1.	For **Lab Plan ID to exclude**, enter the lab plan resource ID you copied earlier. 
    :::image type="content" source="./media/how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy/assign-policy-exclude-lab-plan-id.png" alt-text="Screenshot showing the Parameter tab with Lab Plan ID to exclude highlighted.":::


## Next steps
See the following articles:
- [What’s new with Azure Policy for Lab Services?](azure-polices-for-lab-services.md)
- [Built-in Policies](../governance/policy/samples/built-in-policies.md#lab-services)
- [What is Azure policy?](../governance/policy/overview.md)
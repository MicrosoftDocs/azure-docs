---
title: Set up a lab plan with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab plan with Azure Lab Services, add a lab creator, and specify Marketplace images to be used by labs in the lab plan. 
ms.topic: tutorial
ms.date: 10/25/2021
ms.custom: subject-rbac-steps
---

# Tutorial: Set up a lab plan with Azure Lab Services

In Azure Lab Services, the lab plan serves as a collection of configurations and settings that apply to the labs created from it. In your lab plan, give permission to others to create labs, and set policies that apply to newly created labs. In this tutorial, learn how to create a lab plan.

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Create a lab plan
> * Add a user to the Lab Creator role

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create a lab plan

The following steps illustrate how to use the Azure portal to create a lab plan with Azure Lab Services.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Select **DevOps** from **Categories**. Then, select **Azure Lab Services**. If you select star (`*`) next to **Azure Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Lab Services** under **FAVORITES**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/select-lab-plans-service.png" alt-text="All Services -> Lab Services":::
3. On the **Azure Lab Services** page, select **Lab Plans** on the left.  Select **Create** on the toolbar.

    :::image type="content" source="./media/tutorial-setup-lab-plan/add-lab-plan-button.png" alt-text="Select Add on the Lab Plans page":::
4. On the **Basics** tab of the **Create a lab plan** page, do the following actions:
    1. Select the **Azure subscription** in which you want to create the lab plan.
    2. For **Resource group**, select an existing resource group or select **Create new**, and enter a name for the resource group.
    3. For **Name**, enter a lab plan name.
    4. For **Region**, select a location/region in which you want to create the lab plan.

        :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-basics-page.png" alt-text="Lab plan - basics page":::
    5. If you would like to enable advanced networking, see [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md).
    6. Select **Review + create**.
    7. Review the summary, and select **Create**.

        :::image type="content" source="./media/tutorial-setup-lab-plan/create-button.png" alt-text="Review + create -> Create":::
5. When the deployment is complete, expand **Next steps**, and select **Go to resource**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/go-to-lab-plan.png" alt-text="Go to lab plan page":::
6. Confirm that you see the **Lab Plan** page.

    :::image type="content" source="./media/tutorial-setup-lab-plan/lab-plan-page.png" alt-text="Lab plan page":::

## Add a user to the Lab Creator role

To set up a lab in a lab plan, the user must be a member of the **Lab Creator** role in the lab plan. To provide educators the permission to create labs for their classes, add them to the **Lab Creator** role: For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

> [!NOTE]
> The account you used to create the lab plan is automatically added to this role. If you are planning to use the same user account to create a lab in this tutorial, skip this step.

1. On the **Lab Plan** page, select **Access control (IAM)**

1. Select **Add** > **Add role assignment (Preview)**.

    ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. On the **Role** tab, select the **Lab Creator** role.

    ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

1. On the **Members** tab, select the user you want to add to the Lab Creators role

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Next steps

In this tutorial, you created a lab plan and gave lab creation permissions to an educator. To learn about how to create a lab as an educator, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Set up a lab](tutorial-setup-classroom-lab.md)

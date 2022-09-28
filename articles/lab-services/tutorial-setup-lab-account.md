---
title: Set up a lab account with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab account and add users that can create labs in the lab account. 
ms.topic: tutorial
ms.date: 01/06/2022
ms.custom: subject-rbac-steps
---

# Tutorial: Set up a lab account with Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

In Azure Lab Services, a lab account serves as the central account in which your organization's labs are managed. In your lab account, give permission to others to create labs, and set policies that apply to all labs under the lab account. In this tutorial, learn how to create a lab account.

In this tutorial, you do the following actions:

> [!div class="checklist"]
> - Create a lab account
> - Add a user to the Lab Creator role

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create a lab account

The following steps illustrate how to use the Azure portal to create a lab account with Azure Lab Services.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** on the left menu. Select **DevOps** from **Categories**. Then, select **Lab Services**. If you select star (`*`) next to **Lab Services**, it's added to the **FAVORITES** section on the left menu. From the next time onwards, you select **Lab Services** under **FAVORITES**.

    ![All Services -> Lab Services](./media/tutorial-setup-lab-account/select-lab-accounts-service.png)
3. On the **Lab Services** page, select **Add** on the toolbar or select **Create lab account** button on the page.

    ![Select Add on the Lab Accounts page](./media/tutorial-setup-lab-account/add-lab-account-button.png)
4. On the **Basics** tab of the **Create a lab account** page, do the following actions:
    1. For **Lab account name**, enter a name.
    2. Select the **Azure subscription** in which you want to create the lab account.
    3. For **Resource group**, select an existing resource group or select **Create new**, and enter a name for the resource group.
    4. For **Location**, select a location/region in which you want to create the lab account.

        ![Lab account - basics page](./media/tutorial-setup-lab-account/lab-account-basics-page.png)
    5. Select **Review + create**.
    6. Review the summary, and select **Create**.

        ![Review + create -> Create](./media/tutorial-setup-lab-account/create-button.png)
5. When the deployment is complete, expand **Next steps**, and select **Go to resource**.

    ![Go to lab account page](./media/tutorial-setup-lab-account/go-to-lab-account.png)
6. Confirm that you see the **Lab Account** page.

    ![Lab account page](./media/tutorial-setup-lab-account/lab-account-page.png)

## Add a user to the Lab Creator role

To set up a lab in a lab account, the user must be a member of the **Lab Creator** role in the lab account. To provide educators the permission to create labs for their classes, add them to the **Lab Creator** role: For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

> [!NOTE]
> The account you used to create the lab account is automatically added to this role. If you are planning to use the same user account to create a lab in this tutorial, skip this step.

1. On the **Lab Account** page, select **Access control (IAM)**

1. Select **Add** > **Add role assignment**.

    ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. On the **Role** tab, select the **Lab Creator** role.

    ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

1. On the **Members** tab, select the user you want to add to the Lab Creators role

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Next steps

In this tutorial, you created a lab account. To learn about how to create a lab as an educator, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Set up a lab](tutorial-setup-lab.md)

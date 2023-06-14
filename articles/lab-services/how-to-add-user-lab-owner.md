---
title: How to add additional owners to a lab in Azure Lab Services
description: This article shows you how an administrator can add a user as an owner to a lab in Azure Lab Services. 
ms.topic: how-to
ms.date: 08/03/2021
ms.custom: subject-rbac-steps
---

# How to add additional owners to an existing lab in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-labaccount-focused-article.md)]

This article shows you how you, as an administrator, can add additional owners to an existing lab.

## Add user to the reader role for the lab account
1. Back on the **Lab Account** page, select **All labs** on the left menu.
2. Select the **lab** to which you want to add user as an owner. 

    ![Select the lab ](./media/how-to-add-user-lab-owner/select-lab.png)  
1. In the navigation menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

    ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. On the **Role** tab, select the **Reader** role.

    ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

1. On the **Members** tab, select the user you want to add to the Reader role.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.
## Add user to the owner role for the lab

> [!NOTE]
> If the user has only Reader access on the a lab, the lab isn't shown in labs.azure.com. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).


1. On the **Lab Account** page, select **Access control (IAM)**

1. Select **Add** > **Add role assignment**.

    ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. On the **Role** tab, select the **Owner** role.

    ![Add role assignment page with Role tab selected.](../../includes/role-based-access-control/media/add-role-assignment-role-generic.png)

1. On the **Members** tab, select the user you want to add to the Owner's role

1. On the **Review + assign** tab, select **Review + assign** to assign the role.


## Next steps
Confirm that the user sees the lab upon logging into the [Lab Services portal](https://labs.azure.com).

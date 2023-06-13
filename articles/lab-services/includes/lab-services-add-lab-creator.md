---
ms.service: lab-services
ms.date: 04/04/2023
ms.topic: include
ms.service: lab-services
---

To create or edit a lab in the Azure Lab Services website ([https://labs.azure.com](https://labs.azure.com)), your Azure account must be assigned the [Lab Creator role](../concept-lab-services-role-based-access-control.md#lab-creator-role) in Azure RBAC. If you assign the Lab Creator role on the lab plan's resource group, the user can create labs for all lab plans in the resource group. Learn more about [Azure Lab Services built-in roles](../concept-lab-services-role-based-access-control.md).

> [!NOTE]
> Owners of a lab plan can automatically create labs and do not need to be assigned the Lab Creator role.

1. Select the resource group that contains the lab plan.

1. From the **Access control (IAM)** page, select **Add** > **Add role assignment**.

    :::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the Access control (I A M) page with Add role assignment menu option highlighted.":::

1. On the **Role** tab, select the *Lab Creator* role.

    :::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-role-generic.png" alt-text="Screenshot that shows the Add roll assignment page with Role tab selected.":::

1. On the **Members** tab, select the user you want to add to the *Lab Creators* role.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

> [!WARNING]
> When you create a lab, you are automatically granted Owner permissions of the lab. If you have the Lab Creator role on the lab plan level, you may notice a short delay in being able to access the newly created lab. This delay is because the Owner permissions need to propagate. To overcome this issue, you might assign a role that allows you to view labs, such as Lab Creator, on the resource group that contains the the lab plan.

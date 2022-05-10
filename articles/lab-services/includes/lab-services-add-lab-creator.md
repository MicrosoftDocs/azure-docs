---
author: EMaher
ms.author: enewman
ms.date: 01/21/2022
ms.topic: include
ms.service: lab-services
---

To create or edit a lab in the Lab Services web portal ([https://labs.azure.com](https://labs.azure.com)), the educator must be assigned the **Lab Creator** role.  Assigning **Lab Creator** role on the lab plan's resource group will allow an educator to use all lab plans in that resource group.

> [!NOTE]
> Owners of a lab plan can automatically create labs and do not need to be assigned the **Lab Creator** role.

1. On the **Overview** page for the lab plan, select **Add lab creators**.

    :::image type="content" source="../media/lab-services-add-lab-creator/lab-plan-overview-add-lab-creators-focused.png" alt-text="Screenshot that shows the **Overview** page of the lab plan." lightbox="../media/lab-services-add-lab-creator/lab-plan-overview-add-lab-creators.png":::

1. From the **Access control (IAM)** page, select **Add** > **Add role assignment**.

    :::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot of the Access control (I A M) page with Add role assignment menu option highlighted.":::

1. On the **Role** tab, select the **Lab Creator** role.

    :::image type="content" source="../../../includes/role-based-access-control/media/add-role-assignment-role-generic.png" alt-text="Screenshot of Add roll assignment page with Role tab selected.":::

1. On the **Members** tab, select the user you want to add to the **Lab Creators** role.
1. On the **Review + assign** tab, select **Review + assign** to assign the role.

> [!WARNING]
> Educators are given **Owner** permissions of labs they create.  If the educator is assigned the **Lab Creator** role on the lab plan instead of the resource group, they may notice a short delay in accessing their newly created lab as the **Owner** permissions for the lab propagate. To avoid this issue, assign a role that allows the educator to view labs (like **Lab Creator**) on the lab plan's resource group.

---
title: Configure Canvas to access lab plans
titleSuffix: Azure Lab Services
description: Learn how to configure Canvas to access Azure Lab Services lab plans.
ms.topic: how-to
ms.date: 11/29/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Configure Canvas to access Azure Lab Services lab plans

In this article, you learn how to configure [Canvas](https://www.instructure.com/canvas) to access Azure Lab Services lab plans. Add the Azure Lab Services app to let educators and students access to their labs directly without navigating to the Azure Lab Services portal. Learn more about the [benefits of using Azure Lab Services within Canvas](./lab-services-within-canvas-overview.md).

To use Azure Lab Services in Canvas, two tasks must be completed: 

1. Enable the Azure Lab Services app in your school's Canvas instance. The Azure Lab Services app will be an inherited app in Canvas.
1. Connect the Canvas instance to a lab plan resource in Azure.

For information about creating and managing labs in Canvas, see [Create and manage labs in Canvas](./how-to-manage-labs-within-canvas.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

- Canvas administrator permissions.
- Write access to [lab plan](tutorial-setup-lab-plan.md) to be linked to Canvas.

## Enable Azure Lab Services app in Canvas

To use the  Azure Lab Services Canvas app, first enable the corresponding developer key:

1. Select the **Admin** page in Canvas.
1. Select **Developer Keys** in the menu bar, and then select the **Inherited** view of the developer keys.
1. Change the **Azure Lab Services** entry to **On**. The Azure Lab Services developer key is **170000000000711**.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app.png" alt-text="Screenshot that shows how to turn on the inherited Azure Lab Services app in the Canvas Admin settings.":::

### Link lab plans to Canvas

After enabling the Azure Lab Services app in Canvas, you can link lab plans to Canvas. Only linked lab plans will be available for Canvas educators to use when creating labs.

To link lab plans to Canvas, your account must be a Canvas administrator. The Canvas administrator must have the following permissions on the lab plan.

- Reader role on the subscription.
- Contributor role on the resource group that contains your lab plan.

Perform the following steps to link lab plans to Canvas:

1. [Add Azure Lab Services to a course in Canvas](#add-azure-lab-services-app-to-a-course). A Canvas administrator will need to add Azure Lab Services to the course *only* if there are no other courses with Azure Lab Services. If there's already a course with the Azure Lab Services app, navigate to that course in Canvas and skip this step.
1. [Create a lab plan in Azure](./tutorial-setup-lab-plan.md) if you haven't already.
1. Open the Azure Lab Services app in the course.
1. Select the tool icon in the upper right to see the list all the lab plans.
1. Choose which lab plans to link.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-select-lab-plans.png" alt-text="Screenshot that shows list of lab plans that can be linked to Canvas.":::

1. Select **Save**.

    In the [Azure portal](https://portal.azure.com), the **LMS settings** page for the lab plan shows that the lab plan is successfully linked.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/lab-plan-linked-canvas.png" alt-text="Screenshot of the L M S settings page for a lab plan.":::

### Add Azure Lab Services app to an account

Canvas administrators may choose to enable the Azure Lab Services app for an account. Enabling an app at the account level allows educators to enable or disable navigation to the Azure Lab Services app per course. Educators can avoid adding the app for each individual course.

1. In Canvas, select the **Admin** menu.
1. Select the account that you want to add the Azure Lab Services app to. Alternatively, select **All Accounts** to add the Azure Lab Services app to all accounts for the Canvas LMS instance.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-choose-account.png" alt-text="Screenshot that shows the Admin menu and accounts list in Canvas.":::

1. Choose **Settings**, then select the **Apps** tab.
1. Select **View App Configurations** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-settings.png" alt-text="Screenshot that shows the App tab of the admin settings page in Canvas.":::

1. Select the blue **+ App** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-add-app.png" alt-text="Screenshot that shows Add app button in the admin settings page.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**. Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas admin settings page.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?* select **Install**.

The Azure Lab Services app will now be available for all courses in that account. The app won't show in course navigation by default. Educators must first enable the app in course navigation before it can be used.

### Add Azure Lab Services app to a course

If you already [added the Azure Lab Services app at the account level](#add-azure-lab-services-app-to-an-account), the educator must enable the app in the course navigation.

To enable the Azure Lab Services app in the course navigation:

1. In Canvas, go to the course that will use Azure Lab Services.
1. Choose **Settings**, then select the **Navigation** tab.
1. Find the **Azure Lab Services** entry, select the three vertical dots, then select **Enable**.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app-in-course-navigation.png" alt-text="Screenshot of enabling Lab Services app in course navigation.":::

1. Select **Save**.

If you didn't add the Azure Lab Services app at the account level, use the following instructions to add the app at the course level:

1. In Canvas, go to the course that will use Azure Lab Services.
1. Choose **Settings**, and then select the **Apps** tab.
1. Select **View App Configurations** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-settings-apps.png" alt-text="Screenshot that shows the App tab of the settings page for a course in Canvas.":::

1. Select the blue **+ App** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-add-app.png" alt-text="Screenshot that shows Add app button in Canvas.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**. Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?*, select **Install**.

    The Azure Lab Services app will take a few moments to show in the course navigation list.

## Next steps

See the following articles:

- As an admin, [add educators as lab creators to the lab plan](./add-lab-creator.md) in the Azure portal.
- As an educator, [create and manage labs in Canvas](./how-to-manage-labs-within-canvas.md).
- As an eductor, [manage user lists in Canvas](./how-to-manage-labs-within-canvas.md#manage-lab-user-lists-in-canvas).
- As a student, [access a lab VM within Canvas](./how-to-access-vm-for-students-within-canvas.md).

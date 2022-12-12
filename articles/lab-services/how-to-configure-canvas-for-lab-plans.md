---
title: Configure Canvas to use Azure Lab Services
description: Learn how to configure Canvas to use Azure Lab Services.
ms.topic: how-to
ms.date: 11/29/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Configure Canvas to use Azure Lab Services

In this article, you learn how to add the Azure Lab Services app to [Canvas](https://www.instructure.com/canvas). The Azure Lab Services app lets educators and students access to their labs directly from Canvas without navigating to the Azure Lab Services portal. Learn more about the [benefits of using Azure Lab Services within Canvas](./lab-services-within-canvas-overview.md).

For information about creating and managing labs in Canvas, see [Create and manage labs in Canvas](./how-to-manage-labs-within-canvas.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

- An Azure Lab Services lab plan. Follow these steps to [Create a lab plan in the Azure portal](./tutorial-setup-lab-plan.md), if you don't have one yet.
- To add the Azure Lab Services app, your Canvas user account needs Canvas administrator permissions.
- To link lab plans, your account needs: 
    - Canvas administrator permissions.
    - Reader role on the Azure subscription.
    - Contributor role on the resource group that contains your lab plan.
    - Write access to the lab plan.

## Enable the Azure Lab Services app in Canvas

You can use Canvas for accessing Azure Lab Services by enabling the Azure Lab Services Canvas app. The Azure Lab Services app is an inherited app in Canvas. To use the app, enable the corresponding developer key:

1. In Canvas, select the **Admin** page.
1. Select **Developer Keys** in the left navigation.
1. Select the **Inherited** tab of the developer keys.
1. In the list, change the state of the **Azure Lab Services** entry to **On**.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app.png" alt-text="Screenshot that shows how to turn on the inherited Azure Lab Services app in the Canvas Admin settings.":::

## Add Azure Lab Services app to an account (optional)

After enabling the Azure Lab Services app in Canvas, you might enable the Azure Lab Services app for the entire account. Enabling the app at the account level lets educators quickly enable or disable navigation to Azure Lab Services on a per-course basis.

If you want to add the app to a specific course, skip to [Add the Azure Lab Services app to a course](#add-the-azure-lab-services-app-to-a-course).

To add the app at the account level:

1. In Canvas, select the **Admin** menu.
1. Select the account that you want to add the Azure Lab Services app to. Alternatively, select **All Accounts** to add the Azure Lab Services app to all accounts for the Canvas LMS instance.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-choose-account.png" alt-text="Screenshot that shows the Admin menu and accounts list in Canvas.":::

1. Choose **Settings**, then select the **Apps** tab.
1. Select **View App Configurations** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-settings.png" alt-text="Screenshot that shows the App tab of the admin settings page in Canvas.":::

1. Select the **+ App** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-add-app.png" alt-text="Screenshot that shows Add app button in the admin settings page.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**. Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas admin settings page.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?*, select **Install**.

The Azure Lab Services app is now available for all courses in that account. The app doesn't show up in the course navigation by default. Move to the next step to [enable the app in course navigation](#enable-azure-lab-services-in-course-navigation).

## Add Azure Lab Services to a course

To use Azure Lab Services in a course, you now add the Azure Lab Services app to a course. 

If you previously added the app at the account level, you only need to enable the app in the course navigation. Skip to [enable the app in the course navigation](#enable-azure-lab-services-in-course-navigation).

### Add the Azure Lab Services app to a course

To add the app at the course level:

1. In Canvas, go to the course that uses Azure Lab Services.
1. Choose **Settings**, and then select the **Apps** tab.
1. Select **View App Configurations** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-settings-apps.png" alt-text="Screenshot that shows the App tab of the settings page for a course in Canvas.":::

1. Select the **+ App** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-add-app.png" alt-text="Screenshot that shows Add app button in Canvas.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**. Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?*, select **Install**.

    The Azure Lab Services app takes a few moments to show in the course navigation list.

You can now move to [Link a lab plan to a course](#link-lab-plans-to-canvas) to finalize the configuration of Canvas.

### Enable Azure Lab Services in course navigation

If you added the app at the account level, you should enable the app in the course navigation to use Azure Lab Services in course:

1. In Canvas, go to the course that uses Azure Lab Services.
1. Choose **Settings**, then select the **Navigation** tab.
1. Find the **Azure Lab Services** entry, select the three vertical dots, then select **Enable**.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app-in-course-navigation.png" alt-text="Screenshot of enabling Lab Services app in course navigation.":::

1. Select **Save**.

You can now move to [Link a lab plan to a course](#link-lab-plans-to-canvas) to finalize the configuration of Canvas.

## Link lab plans to Canvas

After enabling the Azure Lab Services app in Canvas, you can link lab plans to Canvas. Only linked lab plans are available for Canvas educators to use when creating labs.

To link lab plans to Canvas, your account must be a Canvas administrator. The Canvas administrator must have the following permissions on the lab plan.

- Reader role on the subscription.
- Contributor role on the resource group that contains your lab plan.

Perform the following steps to link lab plans to Canvas:

1. In Canvas, go to a course for which you previously added the Azure Lab Services app.
1. Open the Azure Lab Services app in the course.
1. Select the tool icon in the upper right to see the list all the lab plans.
1. Choose the lab plans you want to link to Canvas from the list.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-select-lab-plans.png" alt-text="Screenshot that shows the list of lab plans that can be linked to Canvas.":::

1. Select **Save**.

    In the [Azure portal](https://portal.azure.com), the **LMS settings** page for the lab plan shows that you linked the lab plan successfully to Canvas.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/lab-plan-linked-canvas.png" alt-text="Screenshot of the L M S settings page for a lab plan.":::

## Next steps

You've successfully configured Canvas to access Azure Lab Services. You can now continue to create and manage labs for your courses in Canvas.

See the following articles:

- As an admin, [add educators as lab creators to the lab plan](./add-lab-creator.md) in the Azure portal.
- As an educator, [create and manage labs in Canvas](./how-to-manage-labs-within-canvas.md).
- As an educator, [manage user lists in Canvas](./how-to-manage-labs-within-canvas.md#manage-lab-user-lists-in-canvas).
- As a student, [access a lab VM within Canvas](./how-to-access-vm-for-students-within-canvas.md).

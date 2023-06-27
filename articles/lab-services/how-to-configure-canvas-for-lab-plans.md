---
title: Configure Canvas to use Azure Lab Services
description: Learn how to configure Canvas to use Azure Lab Services.
ms.topic: how-to
ms.date: 12/16/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Configure Canvas to use Azure Lab Services

[Canvas Learning Management System](https://canvaslms.com/) (LMS) is a cloud-based learning management system that provides one place for course content, quizzes, and grades for both educators and students. In this article, you learn how to add the Azure Lab Services app to [Canvas](https://www.instructure.com/canvas). Educators can create labs from within Canvas and students will see their lab VMs alongside their other material for a course.

Learn more about the [benefits of using Azure Lab Services within Canvas](./lab-services-within-canvas-overview.md).

To configure Canvas to use Azure Lab Services, go through the one-time step to [enable the Azure Lab Services app in Canvas](#enable-the-azure-lab-services-app-in-canvas). Next, you can then [add the Azure Lab Services app to your course](#add-azure-lab-services-to-a-course).

If you've already configured your course to use Azure Lab Services, learn how you can [Create and manage labs in Canvas](./how-to-manage-labs-within-canvas.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

- Your Canvas account needs [Admin permissions](https://community.canvaslms.com/t5/Canvas-Basics-Guide/What-is-the-Admin-role/ta-p/78) to add the Azure Lab Services app to Canvas.

- To link lab plans, your Azure account needs the following permissions. Learn how to [assign Azure Active Directory roles to users](/azure/active-directory/roles/manage-roles-portal).
    - Reader role on the Azure subscription.
    - Contributor role on the resource group that contains your lab plan.
    - Write access to the lab plan.

## Enable the Azure Lab Services app in Canvas

The first step to let users access their labs and lab plans through Canvas is to enable the Azure Lab Services app in Canvas. To use a third-party application, such as Azure Lab Services, in Canvas, you have to enable the corresponding developer key in Canvas.

The Canvas developer key for the Azure Lab Services app is an *inherited key*, also referred to as a *global developer key*. Learn more about [developer keys in the Canvas Community Hub](https://community.canvaslms.com/t5/Canvas-Admin-Blog/Administrative-guidelines-for-managing-Inherited-Developer-Keys/ba-p/269029).

To enable the developer key for the Azure Lab Services app:

1. In Canvas, select the **Admin** page.

1. Select **Developer Keys** in the left navigation.

1. Select the **Inherited** tab of the developer keys.

1. In the list, change the state of the **Azure Lab Services** entry to **On**.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app.png" alt-text="Screenshot that shows how to turn on the inherited Azure Lab Services app in the Canvas Admin settings." lightbox="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app.png":::

## Add Azure Lab Services app to an account (optional)

You can enable the Azure Lab Services app for a Canvas course in either of two ways:

- Add the Azure Lab Services app at the Canvas account level. 

- [Add the Azure Lab Services app for a specific course](#add-the-azure-lab-services-app-to-a-course) in Canvas.

When you add the app at the Canvas account level, you avoid that you have to add the app for every individual course. If you have multiple courses that use Azure Lab Services, adding the app at the account level might be quicker. After adding the app for the Canvas account, you only have to [enable the Azure Lab Services app in the course navigation](#enable-azure-lab-services-in-course-navigation).

To add the app at the Canvas account level:

1. In Canvas, select the **Admin** menu.

1. Select the account that you want to add the Azure Lab Services app to. Alternatively, select **All Accounts** to add the Azure Lab Services app to all accounts for the Canvas Learning Management System (LMS) instance.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-choose-account.png" alt-text="Screenshot that shows the Admin menu and accounts list in Canvas.":::

1. Choose **Settings**, and then select the **Apps** tab.

1. Select **View App Configurations** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-settings.png" alt-text="Screenshot that shows the App tab of the admin settings page in Canvas." lightbox="./media/how-to-configure-canvas-for-lab-plans/canvas-admin-settings.png":::

1. Select the **+ App** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-add-app.png" alt-text="Screenshot that shows Add app button in the admin settings page.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**. Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas admin settings page.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?*, select **Install**.

The Azure Lab Services app is now available for all courses in that account.

## Add Azure Lab Services to a course

Next, you associate the Azure Lab Services app with a course in Canvas. You have two options to configure a course in Canvas to use Azure Lab Services:

- If you added the Azure Lab Services app at the Canvas account level, [enable the app in the course navigation](#enable-azure-lab-services-in-course-navigation).

- Otherwise, [add the Azure Lab Services app to a course](#add-the-azure-lab-services-app-to-a-course).

### Add the Azure Lab Services app to a course

You now add the Azure Lab Services app to a specific course in Canvas.

1. In Canvas, go to the course that will use Azure Lab Services.

1. Choose **Settings**, and then select the **Apps** tab.

1. Select **View App Configurations** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-settings-apps.png" alt-text="Screenshot that shows the App tab of the settings page for a course in Canvas." lightbox="./media/how-to-configure-canvas-for-lab-plans/canvas-settings-apps.png":::

1. Select the **+ App** button at the top right of the page.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-add-app.png" alt-text="Screenshot that shows Add app button in Canvas.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**. Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?*, select **Install**.

    The Azure Lab Services app takes a few moments to show in the course navigation list.

You can skip to [Link a lab plan to a course](#link-lab-plans-to-canvas) to finalize the configuration of Canvas.

### Enable Azure Lab Services in course navigation

If you previously added the app at the Canvas account level, you don't have to add the app for a specific course. Instead, you enable the app in the Canvas course navigation:

1. In Canvas, go to the course that uses Azure Lab Services.

1. Choose **Settings**, then select the **Navigation** tab.

1. Find the **Azure Lab Services** entry, select the three vertical dots, and then select **Enable**.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-enable-lab-services-app-in-course-navigation.png" alt-text="Screenshot of enabling Lab Services app in course navigation.":::

1. Select **Save**.

## Link lab plans to Canvas

After you enable the Azure Lab Services app in Canvas and associate it with a course, you link specific lab plans to Canvas. You can only use linked lab plans for creating labs in Canvas.

To link lab plans to Canvas, your Canvas account must be a Canvas administrator. In addition, your Azure account must have the following permissions on the lab plan.

- Reader role on the subscription.
- Contributor role on the resource group that contains your lab plan.

Perform the following steps to link lab plans to Canvas:

1. In Canvas, go to a course for which you previously added the Azure Lab Services app.

1. Open the Azure Lab Services app in the course.

1. Select the tool icon in the upper right to see the list all the lab plans.

1. Choose the lab plans you want to link to Canvas from the list.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/canvas-select-lab-plans.png" alt-text="Screenshot that shows the list of lab plans that can be linked to Canvas." lightbox="./media/how-to-configure-canvas-for-lab-plans/canvas-select-lab-plans.png":::

1. Select **Save**.

    In the [Azure portal](https://portal.azure.com), the **LMS settings** page for the lab plan shows that you linked the lab plan successfully to Canvas.

    :::image type="content" source="./media/how-to-configure-canvas-for-lab-plans/lab-plan-linked-canvas.png" alt-text="Screenshot of the L M S settings page for a lab plan." lightbox="./media/how-to-configure-canvas-for-lab-plans/lab-plan-linked-canvas.png":::

## Next steps

You've successfully configured Canvas to access Azure Lab Services. You can now continue to create and manage labs for your courses in Canvas.

See the following articles:

- As an admin, [add educators as lab creators to the lab plan](./add-lab-creator.md) in the Azure portal.
- As an educator, [create and manage labs in Canvas](./how-to-manage-labs-within-canvas.md).
- As an educator, [manage user lists in Canvas](./how-to-manage-labs-within-canvas.md#manage-lab-user-lists-in-canvas).
- As a student, [access a lab VM within Canvas](./how-to-access-vm-for-students-within-canvas.md).

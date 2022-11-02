---
title: Get started and create an Azure Lab Services lab within Canvas
description: Learn how to get started and create an Azure Lab Services lab within Canvas. 
ms.topic: how-to
ms.date: 01/21/2022
---

# Get started and create an Azure Lab Services lab within Canvas

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to add the Azure Lab Services app to [Canvas](https://www.instructure.com/canvas). It will also show how to create a lab within the Canvas environment. The Azure Lab Services app will be an inherited app in Canvas.

To use Azure Lab Services in Canvas, two tasks must be completed. The first is to enable the Azure Lab Services app in your school's Canvas instance.  The second is to connect the Canvas instance to a lab plan resource in Azure.

## Prerequisites

- Canvas administrator permissions.
- Write access to [lab plan](tutorial-setup-lab-plan.md) to be linked to Canvas.

## Enable Azure Lab Services app in Canvas

First, let us turn on Azure Lab Services developer key for Canvas.

1. Select **Admin** page in Canvas.
1. Select **Developer Keys** in the menu bar.
1. When the **Developer Keys** page appears, select **Inherited** view of the developer keys.
1. Change the **Azure Lab Services** entry to **On**.  The Azure Lab Services developer key is **170000000000711**.

:::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-enable-lab-services-app.png" alt-text="Turn on the inherited Azure Lab Services app in the Canvas Admin settings.":::

### Link lab plans to Canvas

Now that Azure Lab Services app is enabled in Canvas, we need to link the lab plans to Canvas.  Linking lab plans to Canvas must be done by a Canvas administrator.  The Canvas administrator must have the following permissions on the lab plan.

- **Reader** role on the subscription.
- **Contributor** role on the resource group that contains your lab plan.

Only linked lab plans will be available for Canvas educators to use when creating labs.

1. [Add Azure Lab Services to a course in Canvas](#add-azure-lab-services-app-to-a-course).  Canvas administrator will need to add Azure Lab Services to the course *only* if there are no other courses with Azure Lab Services.  If there's already a course with the Azure Lab Services app, navigate to that course in Canvas and skip this step.  
2. [Create a lab plan in Azure](./tutorial-setup-lab-plan.md) if you haven't already.
3. Open the Azure Lab Services app in the course.
4. Select the tool icon in the upper right to see the list all the lab plans.
5. Choose which lab plans to link.
:::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-select-lab-plans.png" alt-text="Screenshot that shows list of lab plans that can be liked to Canvas.":::

6. Select **Save**.

If you view the lab plan in the [Azure portal](https://portal.azure.com), the **LMS settings** page will show the lab plan has been successfully linked.
:::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/lab-plan-linked-canvas.png" alt-text="Screenshot of the L M S settings page for a lab plan.":::

### Add Azure Lab Services app to an account

Canvas administrators may choose to enable the Azure Lab Services app for an account.  Enabling an app at the account allows educators to enable or disable navigation to the Azure Lab Services app per course.  Educators can avoid adding the app for each individual course.

1. In Canvas, select the **Admin** menu.
1. Select the account that you want to add the Azure Lab Services app to.  Alternatively, select **All Accounts** to add the Azure Lab Services app to all accounts for the Canvas LMS instance.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-admin-choose-account.png" alt-text="Screenshot that shows the Admin menu and accounts list in Canvas.":::

1. Choose **Settings**, then select the **Apps** tab.
1. Select **View App Configurations** button at the top right of the page.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-admin-settings.png" alt-text="Screenshot that shows the App tab of the admin settings page in Canvas.":::

1. Select the blue **+ App** button at the top right of the page.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-add-app.png" alt-text="Screenshot that shows Add app button in the admin settings page.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**.  Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/enable-lab-services.png" alt-text="Screenshot that shows Add by Client ID dialog in Canvas admin settings page.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?* select **Install**.

The Azure Lab Services app will now be available for all courses in that account.  The app won't show in course navigation by default.  Educators must first enable the app in course navigation before it can be used.

### Add Azure Lab Services app to a course

If the Azure Lab Services app has already been [added at the account level](#add-azure-lab-services-app-to-an-account), the educator must enable the app in the course navigation.

1. In Canvas, go to the course that will use Azure Lab Services.
1. Choose **Settings**, then select the **Navigation** tab.
1. Find the **Azure Lab Services** entry, select the three vertical dots, then select **Enable**.

    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-enable-lab-services-app-in-course-navigation.png" alt-text="Screenshot of enabling Lab Services app in course navigation.":::

1. Select **Save**.

If the Azure Lab Services app hasn't been added at the account level, use the following instructions to add the app at the course level.

1. In Canvas, go to the course that will use Azure Lab Services.
1. Choose **Settings**, then select the **Apps** tab.
1. Select **View App Configurations** button at the top right of the page.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-settings-apps.png" alt-text="Screenshot that shows the App tab of the settings page for a course in Canvas.":::

1. Select the blue **+ App** button at the top right of the page.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-add-app.png" alt-text="Screenshot that shows Add app button in Canvas.":::

1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**.  Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/enable-lab-services.png" alt-text="Screenshot that shows Add by Client I D dialog in Canvas.":::

1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?* select **Install**.
1. The Azure Lab Services app will take a few moments to show in the course navigation list.

## Create labs in Canvas

Once Azure Lab Services is added to your course, you'll see **Azure Lab Services** in the course navigation menu.  If you're authenticated in Canvas as an educator, you'll see this sign in screen before you can use the service. You'll need to sign in here with an Azure AD account or Microsoft account that has been added as a Lab Creator.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/welcome-to-lab-services.png" alt-text="Canvas -> Welcome":::

For instructions to create a lab, see [Create a lab](quick-create-lab-portal.md).  Make sure to verify the resource group to use before creating the lab.

> [!IMPORTANT]
> Labs must be created using the Azure Lab Services app in Canvas.  Labs created from the Azure Lab Services portal aren't visible from Canvas.

The student list for the course is automatically synced with the course roster.  For more information, see [Manage Lab Services user lists from Canvas](how-to-manage-user-lists-within-canvas.md).  A lab VM will also be created for the course educator.

## Troubleshooting

This section outlines common error messages that you may see, along with the steps to resolve them.

- Insufficient permissions to create lab.

  In Canvas, an educator will see a message indicating that they don't have sufficient permission. Educators should contact their Azure admin so they can be [added as a **Lab Creator**](tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role).  For example, educators can be added as a **Lab Creator** to the resource group that contains their lab.

- Message that there isn't enough capacity to create lab VMs.

  [Request a limit increase](capacity-limits.md#request-a-limit-increase) which needs to be done by an Azure Labs Services administrator.

- Student sees warning that the lab isn't available yet.

  In Canvas, you'll see the following message if the educator hasn't published the lab yet.  Educators must [publish the lab](tutorial-setup-lab.md#publish-a-lab) and [sync users](how-to-manage-user-lists-within-canvas.md#sync-users) for students to have access to a lab.

  :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/troubleshooting-lab-isnt-available-yet.png" alt-text="Troubleshooting -> This lab is not available yet":::

- Student or educator is prompted to grant access.

  Before a student or educator can first access their lab, some browsers require that they first grant Azure Lab Services access to the browser's local storage.  To grant access, educators and students should click the **Grant access** button when they are prompted:

  :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-grant-access-prompt.png" alt-text="Screenshot of page to grant Azure Lab Services access to use local storage for the browser.":::

  Educators and students will see the message **Access granted** when access is successfully granted to Azure Lab Services.  The educator or student should then reload the browser window to start using Azure Lab Services.

  :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-access-granted-success.png" alt-text="Screenshot of access granted page in Azure Lab Services.":::

  > [!IMPORTANT]
  > Ensure that students and educators are using an up-to-date version of their browser.  For older browser versions, students and educators may experience issues with being able to successfully grant access to Azure Lab Services.

  - Educator isn't prompted for their credentials after they click sign-in.
  
  When an educator accesses Azure Lab Services within their course, they may be prompted to sign in.  Ensure that the browser's settings allow popups from the url of your Canvas instance, otherwise the popup may be blocked by default.

    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/canvas-sign-in.png" alt-text="Azure Lab Services sign-in screen.":::

## Next steps

See the following articles:

- [Manage user lists from Canvas](how-to-manage-user-lists-within-canvas.md)
- [Create schedules from Canvas](how-to-create-schedules-within-canvas.md)
- [Access a VM (student view) from Canvas](how-to-access-vm-for-students-within-canvas.md)

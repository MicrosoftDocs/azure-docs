---
title: Get started and create an Azure Lab Services lab within Canvas
description: Learn how to get started and create an Azure Lab Services lab within Canvas. 
ms.topic: how-to
ms.date: 10/29/2021
---

# Get started and create an Azure Lab Services lab within Canvas

This article shows how to add the Azure Lab Services app to [Canvas](https://www.instructure.com/canvas). It will also show how to create a lab within the Canvas environment. The Azure Lab Services app will be an inherited app in Canvas.

## Getting started

To use Azure Lab Services in Canvas, two tasks must be completed. The first is to enable the Azure Lab Services app in your school's/organization's Canvas instance.  The second is to connect the Canvas instance to a lab plan resource in Azure.

### Prerequisites

- Canvas administrator permissions.
- Write access to [lab plan](how-to-manage-lab-plans.md) to be linked to Canvas.

### Enable Azure Lab Service app in Canvas

First, let's turn on Azure Lab Services developer key for Canvas.

1. In Canvas, select **Admin** page.
1. Select **Developer Keys** menu item on the left.
1. When the **Developer Keys** page appears, select **Inherited** view of the developer keys.
1. Change the **Azure Lab Services** entry to **On**.  The Azure Lab Services developer key is **170000000000711**.

### Link lab plans to Canvas

Now that Azure Lab Services app is enabled in Canvas, we need to link the lab plans to Canvas.  Only linked lab plans will be available for Canvas educators to use when creating labs.

1. If not already done, [create a lab plan in Azure](./tutorial-setup-lab-plan.md).
1. Verify Canvas administrator has the following permissions on the lab plan.
      - **Reader** role on the subscription.
      - **Contributor** role on the resource group that contains your lab plan.
1. Add Azure Lab Services to a course in Canvas.  Canvas administrator will need to add Azure Lab Services to the course *only* if there are no other courses with Azure Lab Services.  If there's already a course with the Azure Lab Services app, navigate to that course in Canvas and skip this step.  
   1. In Canvas, go to the course that will use Azure Lab Services.
   1. Choose **Settings**, then select the **Apps** tab.
   1. Select **View App Configurations** button at the top right of the page.
   1. Select the blue **+ App** button at the top right of the page.
   1. On the **Add App** dialog, in the **Configuration Type** dropdown, choose **By Client ID**.  Enter the Azure Lab Services client ID, which is **170000000000711**, into the **Client ID** field. Select the **Submit** button.
   1. When the **Add App** dialog asks *Tool "Azure Lab Services" found for client ID 170000000000711. Would you like to install it?* select **Install**.
   1. The Azure Lab Services app will take a few moments to show in the course navigation list.
1. Link lap plan to Canvas.
    1. Open the Azure Lab Services app in the course.
    1. In the Azure Lab Services app, select the resource group that the lab plan is in.
    1. Select the button to finish administrator setup.
    1. If prompted, enter Azure credentials to finish setup.

## Create labs in Canvas

1. Add Azure Lab Services app to the course.
   1. In Canvas, go to the course that will use Azure Lab Services.
   2. Choose **Settings**, then select the **Apps** tab.
   3. Select **View App Configurations** and then the blue **+ App** button at the top right of the page.
   4. In the Configuration Type dropdown, choose **By Client ID** and enter Azure Lab Services client ID, which is **170000000000711**, into the field.
     :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/enable-lab-services.png" alt-text="Canvas -> Add App":::
1. Once Azure Lab Services is added to your course, you’ll see **Azure Lab Services** in the course navigation menu.
1. If you're authenticated in Canvas as an educator, you'll see this sign in screen (shown below) before you can use the service. You'll need to sign in here with an Azure AD account or Microsoft account that has been added as a Lab Creator.
    :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/welcome-to-lab-services.png" alt-text="Canvas -> Welcome":::
1. Create one or more labs for student. See [Tutorial: Set up a lab](tutorial-setup-lab.md) for further instructions. Make sure to verify the resource group in which to create the lab before creating the lab.
1. [Publish the lab](tutorial-setup-lab.md#publish-the-lab).

When you create a lab inside a Course in Canvas, the lab will automatically pull the list of students from Canvas’s course roster and add them as users in the lab’s user list. Virtual machines will be added and deleted automatically based on changes to the course roster. You can create multiple labs for a course.

Instructors can access their labs through Canvas or the [Azure Lab Services portal](https://labs.azure.com).  Students must access their VM through Canvas.

> [!NOTE]
> A lab virtual machine will also be created for the course instructor.  VM can be found in the virtual machine pool or by selecting the **My virtual machines** icon in the upper right of the Azure Lab Services portal.

You'll see that each student is assigned a virtual machine.  The VM is marked as “Unpublished” if the lab isn't yet published. Students don’t have access to the VMs until the lab is published.

:::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/user-list.png" alt-text="Canvas VM pool":::

## Access labs (students)

In Canvas, students can access the labs you set up for a course by clicking on the Azure Lab Services tab. If students are signed into Canvas, they get a single sign-on experience to Azure Lab Services. Students can see and access the virtual machines provided to them. Students will only see virtual machines from labs that were created for this course.

   :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/student-experience.png" alt-text="Canvas student experience":::

## Troubleshooting

This section outlines common error messages that you may see, along with the steps to resolve them.

- Student sees warning that the lab isn’t available yet.

  In Canvas, you'll see the following message if the instructor hasn't published the lab yet.  Instructors must [publish the lab](how-to-manage-labs.md#publish-the-lab) and [sync users](how-to-manage-user-lists-within-canvas.md#sync-users) for students to have access to a lab.

  :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/troubleshooting-lab-isnt-available-yet.png" alt-text="Troubleshooting -> This lab is not available yet":::

- Insufficient permissions to create lab.

  In Canvas, an instructor will see a message indicating that they don’t have sufficient permission. Instructors should contact their Azure admin so they may be assigned the appropriate [Lab Services built-in role](administrator-guide.md#manage-identity).

- Message that there isn't enough capacity to create lab VMs.

  [Request a limit increase](capacity-limits.md#request-a-limit-increase).  To create a support request, you must be an [Owner](/azure/role-based-access-control/built-in-roles), [Contributor](/azure/role-based-access-control/built-in-roles), or be assigned to the [Support Request Contributor](/azure/role-based-access-control/built-in-roles) role at the subscription level. For information about creating support requests in general, see how to create a [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

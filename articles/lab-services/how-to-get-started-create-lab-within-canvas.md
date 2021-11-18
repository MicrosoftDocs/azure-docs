---
title: Get started and create an Azure Lab Services lab within Canvas
description: Learn how to get started and create an Azure Lab Services lab within Canvas. 
ms.topic: how-to
ms.date: 10/29/2021
---

# Get started and create a Lab Services lab within Canvas

This article shows how to add the Azure Lab Services app to a Canvas and then how to create a lab within the Canvas environment. The Azure Lab Services app will be an inherited app in Canvas.

## Prerequisites

A Canvas URL

## Get started

1. Follow steps to [create a lab plan in Azure](./tutorial-setup-lab-plan.md).

   After the lab plan is created, give permission to users so that they can create labs.  Each user needs to be assigned the following roles:

   * On the Resource Group that contains your lab plan, you need to assign the Contributor role so that the user has Write permission.
   * On the Lab Plan, you also need to assign the Reader role.
   * On the subscription, the user will also need the Reader role assigned.

2. Validate that Azure Lab Services app is available in your canvas instance.

   Azure Lab Services is enabled as an inherited app in your canvas tenant, so it should already be turned on. You will be able to see the app when you go to a Course in Canvas to add the Azure Lab Services app to the course.

3. Enable Azure Lab Services for a course in Canvas.

   1. In Canvas, go to the course that will use Azure Lab Services.
   2. Choose **Settings**, then select the **Apps** tab.
   3. Click **View App Configurations** and then the blue **+ App** button at the top right of the page.
   4. In the Configuration Type dropdown, choose **By Client ID** and enter Azure Lab Services client ID, which is **170000000000711**, into the field.

       :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/enable-lab-services.png" alt-text="Canvas -> Add App":::

4. Use Azure Lab Services in your course.

   Once Azure Lab Services is added to your course, you’ll see **Azure Lab Services** in the course navigation menu.

   If you are authenticated in Canvas as an educator, you will see this sign-in screen (shown below) before you can use the service. You will need to sign in here with an AAD account that has been added as a Lab creator to the Lab plan created in step 1 above.

   :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/welcome-to-lab-services.png" alt-text="Canvas -> Welcome":::

   When you create a lab inside a Course in Canvas, the lab will automatically pull the list of students from Canvas’s course roster and add them as users in the lab’s user list. Virtual machines will be added and deleted automatically based on changes to the course roster. You can create multiple labs for a course.

   If a lab is not yet published, you will see that each student is assigned a virtual machine, but the VM is marked as “unpublished.” Students don’t have access to the VMs until the lab is published.

   :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/user-list.png" alt-text="Canvas VM pool":::

5. Access labs (students)

   In Canvas, students can access the labs you set up for a course by clicking on the Azure Lab Services tab. If students are signed into Canvas, they get a single sign-on experience to Azure Lab Services. Students will be able to see and access the virtual machines provided to them. Students will only see virtual machines from labs that were created for this course.

   :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/student-experience.png" alt-text="Canvas student experience":::

## Troubleshoot by redeploying the VM

We’ve added a Redeploy capability for lab VMs. If lab owners or students are facing difficulties troubleshooting Remote Desktop (RDP) connection or accessing a virtual machine, redeploying the VM may provide a quick resolution for the issue.

When you [redeploy a VM](/azure/virtual-machines/redeploy-to-new-node-windows), Azure will shut down the VM, move it to a new Azure host, and restart, retaining any data you saved in the OS disk (usually C: drive) of the VM. You can think of it as a refresh of the underlying VM for the student’s machine, and students don’t need to re-register to the lab or perform any other action. Note that anything saved on the temporary disk (usually D: drive) will be lost when performing Redeploy. Both lab owners and lab users can Redeploy a VM.

## Troubleshooting

This section outlines common error messages that you may see, along with the steps to resolve them.

* This lab isn’t available yet.

  In Canvas, you will see the following message if you haven’t created the lab plan in the Azure portal:

  :::image type="content" source="./media/how-to-get-started-create-labs-within-canvas/troubleshooting-lab-isnt-available-yet.png" alt-text="Troubleshooting -> This lab is not available yet":::

  To fix this, follow the steps in bullet #1 at the beginning of this document, which shows how to create a lab plan in Azure.

* Insufficient permissions to create lab.

  In Canvas, you will see a message indicating that you don’t have sufficient permission if you haven’t assigned the user the appropriate roles to allow them to create a lab.

  To fix this, follow the steps in bullet #1 at the beginning of this document, which shows which roles to assign the user.  Also, ensure that when you’ve updated the user’s roles, that they have signed out and back into Canvas.

* Your admin needs to request a limit increase.

  In Canvas, you will see a message saying that you need to request a limit increase for the VM cores. This message might appear if you haven’t requested the product team increase this for a preview.

  To fix this, follow the steps in bullet #1 at the beginning of this document, which has you email the number of VMs you plan to use and your subscription ID to the product team so that they can increase the limit.

* Subscription not enabled for preview.

  Creating the lab plan will fail with an error:

  ```json
  "status": "Failed",
    "error": {
      "code": "InvalidResourceType",
      "message": "The resource type could not be found in the namespace 'Microsoft.LabServices' for api version '2020-05-01-preview'."
  ```

  To fix this contact the Lab Services to enable the subscription.

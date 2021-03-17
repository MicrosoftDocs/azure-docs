---
title: Azure Certified Device program - Tutorial - Creating your project
description: Step-by-step guide to create a project to certify your device on the Azure Certified Device portal 
author: nikuntjo
ms.author: nikuntjo
ms.service: iot-pnp
ms.topic: tutorial
ms.date: 03/01/2021
ms.custom: template-tutorial 
---

# Tutorial: Create your project

Congratulations on choosing to certify your device through the Azure Certified Device program! Now that you have selected the appropriate certification program for your device, you are now ready to get started with registering your device on the portal.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Sign into the [Azure Certified Device portal](https://certify.azure.com/)
> * Create a new certification project for your device
> * Specify basic device details of your project

## Prerequisites

- You will need a valid work/school [Azure Active Directory account](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis).
- You will need a verified Microsoft Partner Network (MPN) account to proceed. If you don't have an MPN account, [join the partner network](https://partner.microsoft.com/en-US/) before you begin.

## Signing into the Azure Certified Device portal

To get started with the certification program, you must sign-in to the Azure Certified Device portal, where you will be providing your device information, completing certification testing, and managing your device publications to the Azure Certified Device catalog.

1. Go to the [Azure Certified Device portal](https://certify.azure.com).
1. Click on `Company profile` on the left-hand side and update your manufacturer information.
   ![Company profile section](./media/images/company_profile.png)
1. Accept the program agreement to be able to begin your project.

## Creating your project on the portal

Now that you're all set up in the portal, you can begin the certification process. First, you must create a project for the device that you wish to certify. 

1. On the home screen, click `Create new project`. This will open a window to add basic device information in the next section.

 ![Image of the Create new project button](./media/images/create_new_project.png)


## Identifying basic device information

Before moving on to the next stage of certification, you must supply basic device information. You will be able to edit this information later.

1. Complete the fields requested under the `Basics` section. Refer to the table below for clarification regarding the **required** fields:

    | Fields                  | Description                                                                                                                         |
    |------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
    | Project name           | Internal name that will not be visible on the Azure Certified Device catalog                                                        |
    | Device name            | Public name for your device                                                                                                |
    | Device type            | Specification of Finished Product or Solution-Ready Developer Kit.     See [Certification glossary](concepts-glossary.md) for more information.                                                                     |
    | Device class           | Gateway, Sensor, or other.  See [Certification glossary](concepts-glossary.md) for more information.                                                                    |
    | Device source code URL | Required if you are certifying a Solution-Ready Dev Kit, optional otherwise. URL must be to a GitHub location for your device code. |
1. Click the `Next` button to continue to the `Certifications` tab.

    ![Image of the Create new project form, Certifications tab](./media/images/create_new_project_certificationswindow.png)

1. Specify which certification(s) you wish to achieve for your device.
1. Click `Create` and the new project will be saved and visible in the home page of the portal.

    ![Image of project table](./media/images/project_table.png)

1. Click on the Project name in the table. This will launch the project summary page where you can add and view additional details about your device.

    ![Image of the project details page](./media/images/Device_details_section.png)

## Next steps

You are now ready to add device details and test your device for using our certification service. Advance to the next article to learn how to edit your device details.
> [!div class="nextstepaction"]
> [Tutorial: Adding device details](tutorial-02-adding-device-details.md)

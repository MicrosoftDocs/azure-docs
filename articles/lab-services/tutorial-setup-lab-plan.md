---
title: Create a lab for classroom training
titleSuffix: Azure Lab Services
description: Learn how to set up a lab for classroom training with Azure Lab Services. Assign lab creators, customize lab VM image, and invite lab users to register for the lab.
ms.topic: tutorial
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 01/24/2023
ms.custom: subject-rbac-steps
---

# Tutorial: Create a lab for classroom training with Azure Lab Services

Azure Lab Services enables you to create labs, whose infrastructure is managed by Azure. In this tutorial, you create a lab for classroom training with Azure Lab Services. Learn how to set up a customized lab template, and invite students to register for their lab virtual machine (VM). Use Azure Active Directory (Azure AD) role-based access control (RBAC) to assign permissions that match your organization's roles and reponsibilities.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a lab plan
> * Assign a user to the Lab Creator role
> * Create a lab
> * Customize the lab template
> * Publish the lab to create lab VMs
> * Add a recurring lab schedule
> * Invite users to the lab via email

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]

## Create a lab plan

In Azure Lab Services, a lab plan serves as a collection of configurations and settings that apply to all the labs created from it.

Follow these steps to create a lab plan from the Azure portal:

[!INCLUDE [Create a lab plan](./includes/lab-services-tutorial-create-lab-plan.md)]

You've now successfully created a lab plan by using the Azure portal. To let others create labs in the lab plan, you assign them the Lab Creator role.

## Add a user to the Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

## Create a lab

Next, you use the Azure Lab Services website to create a customizable lab (lab template) in the lab plan. In Azure Lab Services, a lab contains the configuration and settings for creating lab VMs. All lab VMs within a lab are identical. In the next section, you'll customize the lab template for the classroom training.

Follow these steps to add a lab to the lab plan you created earlier:

1. Sign in to the [Azure Lab Services website](https://labs.azure.com) by using the credentials for your Azure subscription.

1. Select **New lab**.

    :::image type="content" source="./media/tutorial-setup-lab-plan/new-lab-button.png" alt-text="Screenshot of the Azure Lab Services website, highlighting the New lab button.":::

1. On the **New Lab** page, enter the following information, and then select **Next**:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Name** | Enter *Programming-101*. |
    | **Virtual machine image** | Select *Windows 11 Pro*. |
    | **Virtual machine size** | Select *Small*. |
    | **Location** | Leave the default value. |

1. On the **Virtual machine credentials** page, specify the default **username** and **password**, and then select **Next**.

    By default, all the lab VMs use the same credentials.

    > [!IMPORTANT]
    > Make a note of user name and password. They won't be shown again.

    :::image type="content" source="./media/tutorial-setup-lab-plan/new-lab-credentials.png" alt-text="Screenshot of the Virtual machine credentials page in the Azure Lab Services website.":::

1. On the **Lab policies** page, leave the default values and select **Next**.

1. On the **Template virtual machine settings** page, select **Create a template virtual machine**.

    A *template virtual machine* enables you to make configuration changes or install software on top of the base VM image.

    :::image type="content" source="./media/tutorial-setup-lab-plan/template-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings page, highlighting the option to create a template VM.":::

1. Select **Finish** to start the lab creation. It might take several minutes for the lab creation to finish.

1. When the lab creation finishes, you can see the lab details in the **Template** page.

    :::image type="content" source="./media/tutorial-setup-lab-plan/lab-template.png" alt-text="Screenshot of Template page for a lab.":::

## Customize the lab template

The lab template serves as the basis for the lab VMs. To make sure that lab users have the right configuration and software components, you can customize the lab template.

To customize the lab template, you first starts the template virtual machine. You can then connect to it and configure it for the classroom training.

Use the following steps to update a template VM.  

1. On the **Template** page for the lab, select **Start template** on the toolbar.

    It may take a few minutes for the VM to be running.

1. When the template VM is running, select **Connect to template**, and open the downloaded remote desktop connection file.

    :::image type="content" source="./media/tutorial-setup-lab-plan/connect-template-vm.png" alt-text="Screenshot that shows the Template page for a lab, highlighting Connect to template.":::

1. Sign in to the template VM with the credentials you specified for creating the lab.

1. Install any software that's needed for the classroom training. For example, you might install [Visual Studio Code](https://code.visualstudio.com) for a general programming course.

1. Disconnect (close your remote desktop session) from the template VM.

1. On the **Template** page, select **Stop template**.

You've now customized the lab template for the course. Every VM in the lab will now have the same configuration as the template VM.

## Publish lab


## Add a lab schedule

## Invite users

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

## Next steps

In this tutorial, you created a lab plan and assigned lab creation permissions to another user. To learn about how to create a lab, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Create a lab](./tutorial-setup-lab.md)

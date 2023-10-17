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

Azure Lab Services enables you to create labs, whose infrastructure is managed by Azure. In this tutorial, you create a lab for classroom training with Azure Lab Services. Learn how to set up a customized lab template, and invite students to register for their lab virtual machine (VM).

In this tutorial, you have the Lab Creator Azure RBAC role to let you create labs for a lab plan. Depending on your organization, the responsibilities for creating lab plans and labs might be assigned to different people or teams. Learn more about [mapping permissions across your organization](./classroom-labs-scenarios.md#mapping-organizational-roles-to-permissions).

:::image type="content" source="./media/tutorial-setup-lab/lab-services-process-setup-lab.png" alt-text="Diagram that shows the steps involved in creating a lab with Azure Lab Services.":::

After you complete this tutorial, lab users can register for the lab using their email, and connect to their lab virtual machine with remote desktop (RDP).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a lab
> * Customize the lab template
> * Publish the lab to create lab VMs
> * Add a recurring lab schedule
> * Invite users to the lab via email

## Prerequisites

[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

## Create a lab

You use the Azure Lab Services website to create a customizable lab (lab template) in the lab plan. In Azure Lab Services, a lab contains the configuration and settings for creating lab VMs. All lab VMs within a lab are identical. In the next section, you'll customize the lab template for the classroom training.

Follow these steps to add a lab to the lab plan you created earlier:

1. Sign in to the [Azure Lab Services website](https://labs.azure.com) by using the credentials for your Azure subscription.

1. Select **New lab**.

    :::image type="content" source="./media/tutorial-setup-lab/new-lab-button.png" alt-text="Screenshot of the Azure Lab Services website, highlighting the New lab button.":::

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

    :::image type="content" source="./media/tutorial-setup-lab/new-lab-credentials.png" alt-text="Screenshot of the Virtual machine credentials page in the Azure Lab Services website.":::

1. On the **Lab policies** page, leave the default values and select **Next**.

1. On the **Template virtual machine settings** page, select **Create a template virtual machine**.

    A *template virtual machine* enables you to make configuration changes or install software on top of the base VM image.

    :::image type="content" source="./media/tutorial-setup-lab/template-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings page, highlighting the option to create a template VM.":::

1. Select **Finish** to start the lab creation. It might take several minutes for the lab creation to finish.

1. When the lab creation finishes, you can see the lab details in the **Template** page.

    :::image type="content" source="./media/tutorial-setup-lab/lab-template.png" alt-text="Screenshot of Template page for a lab.":::

## Add a lab schedule

Instead of each lab user starting their lab VM manually, you can optionally create a lab schedule to automatically start and stop the lab VM according to your training calendar. Azure Lab Services supports one-time events or recurring schedules.

Alternately, you can also use [quota](./classroom-labs-concepts.md#quota) to manage the number of hours that lab users can run their lab virtual machine.

Follow these steps to add a recurring schedule to your lab:

1. On the **Schedule** page for the lab, select **Add scheduled event** on the toolbar.

    :::image type="content" source="./media/tutorial-setup-lab/add-schedule-button.png" alt-text="Screenshot of the Add scheduled event button on the Schedule page, highlighting the Schedule menu and Add scheduled event button.":::

1. On the **Add scheduled event** page, enter the following information:

    | Field | Value |
    | ----- | ----- |
    | **Event type** | *Standard* |
    | **Start date** | Enter a start date for the classroom training. |
    | **Start time** | Enter a start time for the classroom training. |
    | **Stop time** | Enter an end time for the classroom training. |
    | **Time zone** | Select your time zone. |
    | **Repeat** | Keep the default value, which is a weekly recurrence for four months. |
    | **Notes** | Optionally enter a description for the schedule. |

1. Select **Save** to confirm the lab schedule.

    :::image type="content" source="./media/tutorial-setup-lab/add-schedule-page-weekly.png" alt-text="Screenshot of the Add scheduled event window.":::

1. In the calendar view, confirm that the scheduled event is present.

    :::image type="content" source="./media/tutorial-setup-lab/schedule-calendar.png" alt-text="Screenshot of the Schedule page for Azure Lab Services.  Repeating schedule, Monday through Friday shown in the calendar.":::

## Customize the lab template

The lab template serves as the basis for the lab VMs. To make sure that lab users have the right configuration and software components, you can customize the lab template.

To customize the lab template, you first start the template virtual machine. You can then connect to it and configure it for the classroom training.

Use the following steps to update a template VM.  

1. On the **Template** page for the lab, select **Start template** on the toolbar.

    It may take a few minutes for the VM to be running.

1. When the template VM is running, select **Connect to template**, and open the downloaded remote desktop connection file.

    :::image type="content" source="./media/tutorial-setup-lab/connect-template-vm.png" alt-text="Screenshot that shows the Template page for a lab, highlighting Connect to template.":::

1. Sign in to the template VM with the credentials you specified for creating the lab.

1. Install any software that's needed for the classroom training. For example, you might install [Visual Studio Code](https://code.visualstudio.com) for a general programming course.

1. Disconnect (close your remote desktop session) from the template VM.

1. On the **Template** page, select **Stop template**.

You've now customized the lab template for the course. Every VM in the lab will have the same configuration as the template VM.

## Publish lab

All VMs in the lab share the same configuration as the lab template. Before Azure Lab Services can create lab VMs for your lab, you first need to publish the lab. When you publish the lab, you can specify the maximum number of lab VMs that Azure Lab Services creates. You can also modify the number of lab virtual machines at a later stage.

To publish the lab and create the lab VMs:

1. On the **Template** page, select **Publish** on the toolbar.

   :::image type="content" source="./media/tutorial-setup-lab/template-page-publish-button.png" alt-text="Screenshot that shows the Template page for the lab, highlighting the Publish template menu button.":::

   > [!WARNING]
   > Publishing is an irreversible action, and can't be undone.

1. On the **Publish template** page, enter *3* for the number of VMs, and then select **Publish**.

    It can take up to 20 minutes for the process to complete. You can track the publishing status on the **Template** page.

1. On the **Virtual machine pool** page, confirm that the labs VMs are created.

    The lab VMs are currently stopped and unassigned, which means that they aren't assigned to specific lab users.

    :::image type="content" source="./media/tutorial-setup-lab/virtual-machines-stopped.png" alt-text="Screenshot that shows the list of virtual machines for the lab. The lab VMs show as unassigned and stopped.":::

> [!CAUTION]
> When you republish a lab, Azure Lab Services recreates all existing lab virtual machines and removes all data from the virtual machines.

## Invite users

By default, Azure Lab Services restricts access to a lab. Only listed users can register for a lab and use a lab VM. Optionally, you can turn off restricted access.

To allow access for users to a lab, perform the following steps:

1. Add the users to the lab
1. Invite the users to lab by providing them with a registration link

### Add users to the lab

Azure Lab Services supports multiple ways to add users to a lab:

- Manually by entering an email address
- Upload a CSV file with student information
- Sync the lab with a Microsoft Entra group

In this quickstart, you manually add the users by providing their email address. Follow these steps to add the users:

1. Select the **Users** page for the lab, and select **Add users manually**.

    :::image type="content" source="./media/tutorial-setup-lab/add-users-manually.png" alt-text="Screenshot that shows the Users page, highlighting Add users manually.":::

1. On the **Add users** page, enter the lab user email addresses on separate lines or on a single line separated by semicolons.

    :::image type="content" source="./media/tutorial-setup-lab/add-users-email-addresses.png" alt-text="Screenshot that shows the Add users page, enabling you to enter user email addresses.":::

1. Select **Add** to add the users and grant them access to the lab.

You've now added users to the lab. On the **Users** page, you can see that their status is **Not registered**. You can now invite these users to the lab by sending them a registration link.

### Send invitation emails

After you add users to the lab, they can register for the lab by using a registration link for the lab. You can either manually provide users with the link, or you can invite users by letting Azure Lab Services send invitation emails.

1. On the **Users** page for the lab, select **Invite all** on the toolbar.

    :::image type="content" source="./media/tutorial-setup-lab/invite-all-button.png" alt-text="Screenshot of the User page in Azure Lab Services, highlighting the Invite all button.":::

1. On the **Send invitation by email** page, enter an optional message, and then select **Send**.

    The email automatically includes the registration link. You can also get this registration link by selecting **... (ellipsis)** > **Registration link** on the toolbar.

    :::image type="content" source="./media/tutorial-setup-lab/send-email.png" alt-text="Screenshot that shows the Send invitation by email page in the Azure Lab Services website.":::

1. You can track the status of the invitation in the **Users** list.

    The status should change to **Sending** and then to **Sent on &lt;date&gt;**.
    
    After a users registers for the lab, their name will also be shown on the **Users** page.

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

[!INCLUDE [Troubleshoot region restriction](./includes/lab-services-troubleshoot-region-restriction.md)]

## Next steps

You've successfully created a customized lab for a classroom training, created a recurring lab schedule, and invited users to register for the lab. Next, lab users can now connect to their lab virtual machine by using remote desktop.

> [!div class="nextstepaction"]
> [Register for the lab and access the lab in the Lab Services website](./tutorial-connect-lab-virtual-machine.md)

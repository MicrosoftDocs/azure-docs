---
title: Get started with Azure Lab Services 
description: This article describes how to get started with Azure Lab Services. 
ms.topic: article
ms.date: 10/02/2020
---

# Get started with Lab Services 

As a student, you can use Azure Lab Services to access industry-standard software required for your programs of study on virtual machines (VM). 

Teachers need to know how to teach students to utilize Azure Lab Services in their instruction through one-to-one student issued hardware.

This article provides information for teaching staff on how to access, manage, and teach students to utilize Azure Lab Services.

## Overview

What is a VM and how do they work?

A Virtual Machine (VM) is a virtual environment that acts as a virtual computer. VMs have their own processor, memory, and storage. VMs provide a substitute for a real machine and can give users access to operating systems and software without the need to have them on their own device. Azure Lab Services provides a tool for students to access and navigate VMs and for staff to manage their virtual computer labs. 

For more information, see [Create and manage classroom labs](how-to-manage-classroom-labs.md).

## Lab dashboards

Dashboards for classroom labs in Azure Lab Services provide a snapshot of different aspects of a particular lab including, VM information, number of assigned and unassigned VMs, number of registered and unregistered users and information about lab schedules. 

> [!NOTE]
> While most administrative aspects of the dashboard and the [Azure Lab Services website](https://labs.azure.com/) will be visible to teachers, permissions specific to your role may impact your ability to modify certain criteria in the dashboard. If you encounter an issue with your particular lab set-up, reach out to your CTE administrator.

:::image type="content" source="./media/use-dashboard/dashboard.png" alt-text="the Azure Lab Services portal":::

1. Navigate and sign in to the [Azure Lab Services website](https://labs.azure.com/).
1. Select your lab.
1. You will see a **Dashboard** on the left-hand side of the window. Click on **Dashboard** and you will see a number of tiles in your dashboard.
1. Below the **Costs & Billing** tile, there are also tiles for Templates, Virtual Machine Pools, Users, and Schedules, which allow you to modify aspects and view more details on the Classroom Lab.

    1. Template - describes the date the template was created, and last published. 
    1. Virtual Machine Pool - number of assigned and unassigned VMs.
    1. Users - number of registered users and users who have been added to the lab, but not registered.
    1. Schedules - displays upcoming scheduled events for the lab and a link to view more events.

For more information, see [Use dashboard](use-dashboard.md).

## Quota hours

Students can access their VMs at any time during scheduled class time without impacting their quota hours. Quota hours are set for the entire semester and determine the number of hours a student can use their VM outside of regularly scheduled class time.

8 Hrs per week, resets on Sunday - not cumulative.

For more information, see [Set quota](how-to-configure-student-usage.md#set-quotas-for-users).

### Automatic shut-down

To help keep down costs and save students' quota hours, automatic shutdowns will be enabled for our labs. Auto-shutdowns will turn VMs off after a period of inactivity (no mouse or keyboard inputs). Auto-shutdowns work in two stages, first a student will be disconnected from the VM after a period of inactivity. At this point, the VM is still **Running** and the students are able to connect. After another period of inactivity once disconnected, the VM will shut itself down.

Auto-shutdowns are an important cost-saving tool, however they do present a challenge for students in regard to saving their work and rendering large project files. If you students are frequently being disconnected or VMs are turning off too quickly. Please reach out to your CTE administrator. 

For more information, see [Configure automatic shutdown of VMs for a lab account](how-to-configure-lab-accounts.md).

## Managing Virtual Machines

Managing the lab allows teachers to control things like lab capacity (the number of VMs available for students) and manually starting, stopping, or resetting VMs. teachers can also connect to VMs to experience student interface, access files and troubleshoot issues with software or the VM itself.

The most important thing to remember when managing our VMs is that anytime a machine is **Running**, we are incurring costs, even if no one is connected to the VM.

### Manually starting VMs

1. From the **Virtual machine pool** page, you can start all VMs in a lab by clicking the **Start all** button at the top of the page.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/start-all-vms-button.png" alt-text="Start your VMs":::
1. Individual VMs can be started by clicking the state toggle. 

    The toggle will read **Starting** as the VM starts up, and then **Running** once the VM has started.
1. You can also select a number of VMs using the checks to the left of the **Name** column. 

    Once you have selected the desired VMs, click the **Start** button at the top of the screen.
1. Once started, you can click the **Stop all** button to stop all of the VMs.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/stop-all-vms-button.png" alt-text="Stop your VMs":::

    * You can stop individual VMs by clicking the state toggle.
    * You can also stop multiple VMs by using the checks and clicking the “Stop” button at the top of the screen.

    If a student is experiencing difficulties connecting to the VM, or the VM needs to be reset for any other reason, you can use the reset function.
1. To reset one or more VMs, select them using the checks, then click the **Reset** button at the top of the page.
1. In the pop-up window, click **Reset**.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/reset-vms-dialog.png" alt-text="Reset your VM":::

    > [!NOTE]
    > Turning on a student VM will not affect the quota for the student. Quotas for users specifies the number of lab hours available to the user outside of the scheduled class time.

## Connect to Virtual Machines

Teachers are able to connect to a student VM as long as it is turned on, and the student is NOT connected to the VM. By connecting to the VM, you will be able to access local files on the VM and help students troubleshoot issues.

1. To connect to the student VM, hover the mouse on the VM in the list and click the **Connect** button. 
1. Then follow the getting started guide for students for either Chromebooks, Macs or PCs

### Add and manage lab users

Teachers are able to add student users to a lab and monitor their hour quotas. 

### Add users by email address

1. From the [Azure Lab services website](https://labs.azure.com/) click **Users** from the left-hand side of the window.
1. At the top of the window, click on **Add users** and select **Add by email address**. 

    :::image type="content" source="./media/how-to-configure-student-usage/add-users-button.png" alt-text="The 'Add users' button":::
1. In the **Add users** pane that appears on the right, enter the students’ email addresses on separate lines or on a single line, separated by semicolons.
1. Click **Save**.
1. Your list of users will now be updated with emails, status, invitation, and quota hours.

    :::image type="content" source="./media/get-started-manage-labs/add-students.png" alt-text="Add students to your lab":::

    After students are registered for a lab, their names will be updated with first and last names from the MPS directory.

    > [!NOTE]
    > Keep the Restrict access option toggle is turned on for users. This means that only users that you list can register with the lab by using the registration link you send.

### Add users using a spreadsheet 

You can also add users by uploading a CSV file that contains their email addresses.

1. In Microsoft Excel, create a CSV file that lists students' email addresses in one column.
1. From the [Azure Lab Services website](https://labs.azure.com/), at the top of the **Users** page, click the **Add Users** button.
1. Select **Upload CSV**.
1. Select the CSV file that contains the students' email addresses and click **Open**.

    :::image type="content" source="./media/get-started-manage-labs/add-users-spreadsheet.png" alt-text="Add users using a spreadsheet":::
1. The emails will now appear in the window on the right. Click **Save**.

### Register users

:::image type="content" source="./media/get-started-manage-labs/register-users.png" alt-text="Register users":::

Once users have been added to the lab, they will need to register in order to access the VMs. This can be done by either inviting users from the Azure Web Services portal, which will send an email containing the registration link for the lab. Or by copying and pasting the registration link into an email, or other form of communication with the students.

1. From the **Users** page, select a student or multiple students in the list.

    1. In the row for the student you've selected, select the envelope icon in the list or, clicking **Invite** at the top of the screen.
    1. In the **Send invitation** by email window, enter an optional message (like a username and password) to students, and then click **Send**. 

    :::image type="content" source="./media/get-started-manage-labs/send-invitation.png" alt-text="Send an invitation":::
    
    :::image type="content" source="./media/get-started-manage-labs/send-invitation-mail.png" alt-text="Send an invitation by mail":::

    Alternatively, from the same **Users** page, you can click the **Registration link** button at the top of the screen. 

    Copy the registration link from the text field and paste it into email or your preferred secure messaging tool.  
    :::image type="content" source="./media/get-started-manage-labs/registration-link.png" alt-text="User registration link":::
    
    :::image type="content" source="./media/get-started-manage-labs/user-registration.png" alt-text="Send user registration":::

After you have invited users through the Azure portal or shared the link, you will be able to monitor which users have registered successfully in the **Users** page in the **Status** column. 

## Clean up resources

If you're not going to continue to use resources that you created in this quickstart, delete the resources.

## Next steps

[Set up a lab account](tutorial-setup-lab-account.md)
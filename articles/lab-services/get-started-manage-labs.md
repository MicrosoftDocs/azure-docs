---
title: Get started with Azure Lab Services 
description: This article describes how to get started with Azure Lab Services. 
ms.topic: how-to
ms.date: 11/24/2021
---

# Get started with Lab Services

Azure Lab Services provides students and teachers with access to virtual computer labs directly from their own computers. As a result, students can access industry-standard software required for their programs of study through one-to-one issued virtual machines (VM).

A VM is a virtual environment that acts as a virtual computer. VMs have their own processor, memory, and storage. VMs provide a substitute for a real machine and can give users access to operating systems and software without the need to have them on their own device. Azure Lab Services provides a tool for students to access and navigate VMs and for staff to manage their virtual computer labs.

This article provides information for teaching staff on how to access, manage, and teach students to use Azure Lab Services.

## Key concepts

### Schedules

Schedules are the time slots that an educator can create for the class so the student VMs are available for class time.  Schedules can be one-time or recurring.  Quota hours aren't used when a schedule is running.

Scheduled time is commonly used when all the students have their own VMs and are following the professor's directions at a set time during the day (like class hours). See [Create and manage schedules for labs in Azure Lab Services](how-to-create-schedules.md) for instructions to add scheduled time to a lab. The downside is that all the student VMs are started and are accruing costs, even if a student doesn't log in to a VM. See [Configure automatic shutdown of VMs for a lab](how-to-enable-shutdown-disconnect.md) to help reduce likelihood of accruing costs when a VM isn't being used.

A lab can use either quota time or scheduled time, or a combination of both. If a class doesn't need scheduled time, then use only quota time for the most effective use of the VMs.

There are three types of schedules: Standard, Start only and Stop only.

- **Standard**.  This schedule will start all student VMs at the specified start time and shutdown all student VMs at the specified stop time.
- **Start only**.   This schedule will start all student VMs at the specified  time.  Student VMs won't be stop until a student stops their VM through the Azure Lab Services portal or a stop only schedule occurs.
- **Stop only**.  This schedule will stop all student VMs at the specified time.

### Quota hours

Students can access their VMs at any time during scheduled class time without impacting their quota hours. Quota hours are set for the entire semester and determine the number of hours a student can use their VM outside of regularly scheduled class time.

For more information, see [Set quota](how-to-configure-student-usage.md#set-quotas-for-users).

### Automatic shut-down

To help keep down costs and save students' quota hours, automatic shutdowns are enabled for the labs. Automatic shutdowns will turn off VMs after a period of inactivity (no mouse or keyboard inputs). Automatic shutdowns work in two stages, first a student will be disconnected from the VM after a period of inactivity. At this point, the VM is still **Running** so the students are able to connect. After another period of inactivity as specified by lab settings, the VM will shut itself down.

For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).

### Managing virtual machines

Managing the lab allows teachers to control things like lab capacity (the number of VMs available for students) and manually starting, stopping, or resetting VMs. Teachers can also connect to student VMs to troubleshoot issues with software or the VM itself.

The most important thing to remember when managing the VMs is that anytime a machine is **Running**, costs are being incurred, even if no one is connected to the VM.  The student's quota time is not used if a teacher starts their VM.

## Lab dashboards

### Overview

Dashboards for labs in Azure Lab Services provide a snapshot of different aspects of a particular lab including, VM information, number of assigned and unassigned VMs, number of registered and unregistered users and information about lab schedules.

> [!NOTE]
> While most administrative aspects of the dashboard and the [Azure Lab Services website](https://labs.azure.com/) will be visible to teachers, permissions specific to your role may impact your ability to modify certain criteria in the dashboard. If you encounter an issue with your particular lab set-up, reach out to your lab plan or lab account administrator.

:::image type="content" source="./media/use-dashboard/dashboard.png" alt-text="the Azure Lab Services portal":::

### Examine a dashboard

1. Navigate and sign in to the [Azure Lab Services website](https://labs.azure.com/).
1. Select your lab.
1. You will see a **Dashboard** on the left-hand side of the window. Select on **Dashboard** and you will see tiles in your dashboard.
1. Below the **Costs & Billing** tile, there are also tiles for Templates, Virtual Machine Pools, Users, and Schedules, which allow you to modify aspects and view more details on the lab.

    - Template - describes the date the template was created, and last published.
    - Virtual Machine Pool - number of assigned and unassigned VMs.
    - Users - number of registered users and users who have been added to the lab, but not registered.
    - Schedules - displays upcoming scheduled events for the lab and a link to view more events.

For more information, see [Use dashboard](use-dashboard.md).

### Manually starting VMs

1. From the **Virtual machine pool** page, you can start all VMs in a lab by selecting the **Start all** button at the top of the page.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/start-all-vms-button.png" alt-text="Start your VMs":::
1. Individual VMs can be started by clicking the state toggle.

    The toggle will read **Starting** as the VM starts up, and then **Running** once the VM has started.
1. You can also select a number of VMs using the checks to the left of the **Name** column.

    Once you have selected the desired VMs, select the **Start** button at the top of the screen.
1. Once started, you can select the **Stop all** button to stop all of the VMs.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/stop-all-vms-button.png" alt-text="Stop your VMs":::

    > [!NOTE]
    > Turning on a student VM will not affect the quota for the student. Quotas for users specifies the number of lab hours available to the user outside of the scheduled class time.

### Stopping VMs

- You can stop individual VMs by clicking the state toggle.
- You can also stop multiple VMs by using the checks and clicking the “Stop” button at the top of the screen.

### Resetting VMs

If a student is experiencing difficulties connecting to the VM, or the VM needs to be reset for any other reason, you can use the reset function.  Note, that any data saved on the OS disk will be lost.

1. To reset one or more VMs, select them using the checks, then s the **Reset** button at the top of the page.
1. In the pop-up window, select **Reset**.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/reset-vms-dialog.png" alt-text="Reset your VM":::

### Redeploy VMs

If students are facing difficulties troubleshooting Remote Desktop (RDP) connection or accessing a virtual machine, redeploying the VM may provide a quick resolution for the issue. Redeploying, unlink resetting, data on the OS disk will not be lost.  When you [redeploy a VM](/azure/virtual-machines/redeploy-to-new-node-windows), Azure Lab Services will shut down the VM, move it to a new Azure host, and restart, retaining any data you saved in the OS disk (usually C: drive) of the VM. You can think of it as a refresh of the underlying VM for the student’s machine, and students doesn’t need to re-register to the lab or perform any other action. Please note that anything saved on the temporary disk (usually D: drive) will be lost when performing redeploy. Both lab owners and lab users can Redeploy a VM.

### Connect to VMs

Teachers can connect to a student VM as long as it is turned on, and the student is NOT connected to the VM. By connecting to the VM, you will be able to access local files on the VM and help students troubleshoot issues.

1. To connect to the student VM, hover the mouse on the VM in the list and select the **Connect** button.
1. Then follow the getting started guide for students for either Chromebooks, Macs or PCs

:::image type="content" source="./media/how-to-set-virtual-machine-passwords/connect-student-vm.png" alt-text="Connect to student VM button":::

## Manage users in a lab

Teachers can add student users to a lab and monitor their hour quotas. For details on how to add users by email address or by using a spreadsheet list and register users, see [Add and manage lab users](how-to-configure-student-usage.md).

After you have invited users or shared the link, you can monitor which users have registered successfully in the **Users** page in the **Status** column.

## Clean up resources

If you're not going to continue to use resources that you created in this article, delete the resources.

## Next steps

[Set up a lab plan](tutorial-setup-lab-plan.md)

---
title: Manage labs in Azure Lab Services | Microsoft Docs
description: Learn how to create a lab, configure a lab, view all the labs, or delete a lab. 
ms.topic: how-to
ms.date: 11/12/2021
---

# Manage labs in Azure Lab Services

This article describes how to create and delete a classroom lab. It also shows you how to view all the labs in a lab plan.

## Prerequisites

To set up a classroom lab in a lab plan, you must have `Microsoft.LabServices/labPlans/CreateLab/action` permission.  Often instructors are given the **Lab Creator** role in the lab plan.  A lab owner can add other users to the Lab Creator role by using steps in the following article: [Add a user to the Lab Creator role](tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role). For more role options, see [Lab Services RBAC roles](administrator-guide.md#manage-identity).

## Create a lab

1. Navigate to [Azure Lab Services website](https://labs.azure.com).
1. Select **Sign in** and enter your credentials. Azure Lab Services supports organizational accounts and Microsoft accounts.
1. Select **New lab**.

    :::image type="content" source="./media/tutorial-setup-classroom-lab/new-lab-button.png" alt-text="Create a classroom lab":::
1. In the **New Lab** window, do the following actions:
    1. Specify a **name** for your lab.
    1. Select the **size of the virtual machines** you need for the class. For the list of sizes available, see the [VM Sizes](administrator-guide.md#vm-sizing).
    1. Select the **virtual machine image** that you want to use for the classroom lab. If you select a Linux image, you see an option to **enable remote desktop connection**. For details, see [Enable remote desktop connection for Linux](how-to-enable-remote-desktop-linux.md).
    1. Select the **location** (region) for the lab.
        If your lab plan is connected to your own virtual network, labs can only be created in the same Azure region as that virtual network.
    1. Review the **total price per hour** displayed on the page.
    1. Select **Save**.

        :::image type="content" source="./media/tutorial-setup-classroom-lab/new-lab-window.png" alt-text="Screenshot that shows the New lab window.":::
1. On the **Virtual machine credentials** page, specify default credentials for all VMs in the lab.
    1. Specify the **name of the user** for all VMs in the lab.
    2. Specify the **password** for the user.

        > [!IMPORTANT]
        > Make a note of user name and password. They won't be shown again.
    3. Select **Give lab users a non-admin account on their virtual machines** if you want to automatically create machine accounts for lab users that aren't administrator accounts.

       When you select this option, you then set the user name and password for the non-admin account. The non-administrator username and password are the credentials students will be prompted for when logging in. The administrator account will still be created and instructors can use that account to sign into student VMs, if needed.
    4. Disable **Use same password for all virtual machines** option if you want students to set their own passwords. This step is **optional**.

        An educator can choose to use the same password for all the VMs in the lab, or allow students to set passwords for their VMs. By default, this setting is enabled for all Windows and Linux images except for Ubuntu. When you select **Ubuntu** VM, this setting is disabled, so the students will be prompted to set a password when they sign in for the first time.  

        ![New lab window](./media/tutorial-setup-classroom-lab/virtual-machine-credentials.png)
    5. Then, select **Next** on the **Virtual machine credentials** page.
1. On the **Lab policies** page, do the following steps:
    1. If needed, adjust the number of hours allotted for each user (**quota for each user**) outside the scheduled time for the lab.
    1. If needed, adjust the timeouts for the auto-shutdown settings.  For more details about auto-shutdown settings, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md).
    1. Then, select **Next**.

        ![Quota for each user](./media/tutorial-setup-classroom-lab/quota-for-each-user.png)

1. On the **Template Virtual Machine Settings** page, select whether to create a template VM or a non-customized VM.
    1. If you choose **Create a template virtual machine**, the lab owner gets a template VM, which can be customized with software, settings, and so on, and each student gets a copy of the template.
    2. If you choose **Use a virtual machine image without customization**, each student gets a VM directly from the source VM image with no customization. (No template VM.)

       If you choose this option, you then select the maximum number of VMs for the lab.
        :::image type="content" source="./media/tutorial-setup-classroom-lab/template-virtual-machine-settings.png" alt-text="Template virtual machine settings":::
    3. Select **Finish**.

1. If you choose to create a template machine, you should see the following screen that shows the status of the template VM creation. The creation of the template in the lab takes up to 15 minutes.

    ![Status of the template VM creation](./media/tutorial-setup-classroom-lab/create-template-vm-progress.png)

If you chose to create a Linux template VM, more setup is required to use a GUI remote desktop. For more information, see [Enable graphical remote desktop for Linux virtual machines](how-to-use-remote-desktop-linux-student.md).

## Publish the lab

The following steps apply for publishing a template VM or a non-customized VM.

1. On the **Template** page, select **Publish** on the toolbar.

    ![Publish template button](./media/tutorial-setup-classroom-lab/template-page-publish-button.png)

    > [!WARNING]
    > Publishing is an irreversible action!
1. On the **Publish template** page, enter the number of virtual machines you want to create in the lab, and then select **Publish**.

    ![Publish template - number of VMs](./media/tutorial-setup-classroom-lab/publish-template-number-vms.png)
1. You see the **status of publishing** the VM on the page.

    ![Publish template - progress](./media/tutorial-setup-classroom-lab/publish-template-progress.png)

## View the student VM pool

Switch to the **Virtual machines pool** page by selecting Virtual machines on the left menu or by selecting Virtual machines tile. Confirm that you see virtual machines that are in **Unassigned** state. These VMs aren't assigned to students yet. They should be in **Stopped** state. You can start a student VM, connect to the VM, stop the VM, and delete the VM on this page. You can start them in this page or let your students start the VMs.

![Virtual machines in stopped state](./media/tutorial-setup-classroom-lab/virtual-machines-stopped.png)

You do the following tasks on this page (don't do these steps for the tutorial. These steps are for your information only.):

1. To change the lab capacity (number of VMs in the lab), select **Lab capacity** on the toolbar.
2. To start all the VMs at once, select **Start all** on the toolbar.
3. To start a specific VM, select the down arrow in the **Status**, and then select **Start**. You can also start a VM by selecting a VM in the first column, and then by selecting **Start** on the toolbar.

## View all labs

1. Navigate to [Azure Lab Services portal](https://labs.azure.com).
1. Select **Sign in**. Select or enter a **user ID** that is a member of the **Lab Creator** role in the lab plan, and enter password. Azure Lab Services supports organizational accounts and Microsoft accounts.

    [!INCLUDE [Select a tenant](./includes/multi-tenant-support.md)]
1. Confirm that you see all the labs in the selected lab plan. On the lab's tile, you see the number of virtual machines in the lab and the quota for each user.

    ![All labs](./media/how-to-manage-classroom-labs-2/all-labs.png)
1. Use the drop-down list at the top to select a different lab plan. You see labs in the selected lab plan.

## Delete a lab

1. On the tile for the lab, select three dots (...) in the corner, and then select **Delete**.

    ![Delete button](./media/how-to-manage-classroom-labs-2/delete-button.png)
1. On the **Delete lab** dialog box, select **Delete** to continue with the deletion.

## Switch to another lab

To switch to another lab from the current, select the drop-down list of labs in the resource group at the top.

![Select the lab from drop-down list at the top](./media/how-to-manage-classroom-labs-2/switch-lab.png)

To switch to a different lab plan, select the left drop-down and choose the resource group that contains the lab plan.  The Azure Lab Services portal organizes labs by resource group, then lab name.

## Next steps

See the following articles:

- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
- [As a lab user, access labs](how-to-use-classroom-lab.md)

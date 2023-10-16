---
title: Accelerated lab setup guide for Azure Lab Services
description: If you're a lab creator, this guide can help you quickly set up a lab plan at your school.
ms.topic: how-to
ms.date: 06/26/2020
---

# Lab setup guide

In this guide, you'll learn how to create a lab for students at your school.

The process for publishing a lab to your students can take up to several hours. The amount of setup time depends on the number of virtual machines (VMs) that you want to create in your lab. Allow at least a day to ensure that the lab is working properly and to allow enough time to publish your students' VMs.

## Understand the lab requirements of your class

Before you set up a new lab, you should consider the following questions.

### What software requirements does the class have?

Refer to your class's learning objectives as you decide which operating system, applications, and tools you need to install on the lab VMs. To set up lab VMs, you have three options:

- **Use an Azure Marketplace image**: Azure Marketplace provides hundreds of images that you can use when you're creating a lab. For some classes, one of these images might already contain everything that you need for your class.

- **Create a new custom image**: You can create your own custom image by using an Azure Marketplace image as a starting point. You can then customize it by installing additional software and making configuration changes.

- **Use an existing custom image**: You can reuse custom images that you previously created, or images that were created by other administrators or faculty at your school. To use custom images, your administrators need to set up an Azure Compute Gallery.  A compute gallery is a repository that is used for saving custom images.

> [!NOTE]
> Your administrators are responsible for enabling Azure Marketplace images and custom images so that you can use them. Coordinate with your IT department to ensure that the images that you need are enabled. Custom images that you create are automatically enabled for use within labs that you own.

### What hardware requirements does the class have?

You can choose from a variety of compute sizes:

- **Nested virtualization sizes**: Lets you give students access to a VM that can host multiple, nested VMs. For example, you might use this compute size for networking or ethical hacking classes.

- **GPU sizes**: Lets your students use computer-intensive types of applications. For example, this choice is often used with artificial intelligence and machine learning.

For guidance on selecting the appropriate VM size, see:

- [VM sizing](./administrator-guide.md#vm-sizing)
- [Move from a physical lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931)

> [!NOTE]
> Because compute size availability varies by region, fewer sizes might be available to your lab. Generally, you should select the smallest compute size that suits your needs. With Azure Lab Services, you can set up a new lab with a greater compute capacity later, if you need to.

### What dependencies does the class have on external Azure or network resources?

Your lab VMs might need access to external resources, such as a database, a file share, or a licensing server.  To allow your lab VMs to use external resources, coordinate with your IT administrators.

> [!NOTE]
> You should consider whether you can reduce your lab's dependency on external resources by providing network resources directly on the VM. For example, to eliminate the need to read data from an external database, you can install the database directly on the VM.  

### How will you control costs?

Lab Services uses a pay-as-you-go pricing model, which means that you pay only for the time that a lab VM is running. To control costs, use any or all of the following options:

- **Schedule**: Use schedules to automatically control when your lab VMs are started and shut down.
- **Quota**: Use quotas to control the number of hours that students have access to a VM outside of the scheduled hours.  When a student is using a VM and reaches a quota, the VM automatically shuts down.  The student can't restart the VM unless you increase the quota.
- **Automatic shutdown**: When you enable the auto-shutdown setting, Windows VMs automatically shut down after a student has disconnected from a Remote Desktop Protocol (RDP) session. By default, this setting is disabled.

For more information about controlling costs, see:

- [Estimate costs](./cost-management-guide.md#estimate-the-lab-costs)
- [Manage costs](./cost-management-guide.md#manage-costs)

### How will students save their work?

Each individual student is assigned a VM for the lifetime of the lab. Students can save their work:

- To the VM.
- To an external location, such as OneDrive or GitHub. It's possible to configure OneDrive automatically for students on their lab VMs.

> [!NOTE]
> To ensure that your students have continued access to their saved work outside of the lab and after the class ends, we recommend that they save their work to an external repository.

### How will students connect to their VMs?

For RDP connections to Windows VMs, we recommend that students use the [Microsoft Remote Desktop client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients). The Remote Desktop client supports Mac, Chromebook, and Windows devices.

For Linux VMs, students can use either the Secure Shell (SSH) or RDP protocol. To have students connect by using RDP, you must install and configure the necessary RDP and graphical user interface (GUI) packages.

### Will students also use Microsoft Teams?

Azure Lab Services integrates with Microsoft Teams so that faculty members can create and manage their labs in Teams.  Similarly, students can access their labs in Teams.

For more information, see [Azure Lab Services in Microsoft Teams](./lab-services-within-teams-overview.md).

## Set up your lab

After you understand the requirements for your class's lab, you're ready to set it up. To learn how, follow the links in this section. Instructions are also provided for setting up labs in Teams.

1. **Create a lab**. See the following tutorials:
    - [Create a lab](./tutorial-setup-lab.md#create-a-lab)
    - [Create a lab in Teams](./how-to-configure-teams-for-lab-plans.md)
    - [Create a lab in Canvas](how-to-configure-canvas-for-lab-plans.md)

1. **Customize images and publish lab VMs**. To connect to a special VM called the template VM, see:
    - [Create and manage a template VM](./tutorial-setup-lab.md#publish-lab)
    - [Use a compute gallery](./how-to-use-shared-image-gallery.md)

    > [!NOTE]
    > If your class requires nested virtualization, see [Enable nested virtualization](./how-to-enable-nested-virtualization-template-vm.md).

    > [!NOTE]
    > If you're using Windows, also see [Set up a Windows template VM](./how-to-prepare-windows-template.md). These instructions include steps for setting up OneDrive and Microsoft Office for your students.

1. **Manage VM pool and capacity**. You can easily scale up or down VM capacity, as needed by your class. Keep in mind that increasing VM capacity might take several hours because new VMs are being set up. See the following articles:
    - [Set up and manage a VM pool](./how-to-set-virtual-machine-passwords.md)
    - [Manage a VM pool in Lab Services in Teams](./how-to-manage-labs-within-teams.md#manage-a-lab-vm-pool-in-teams)

1. **Add and manage lab users**. To add users to your lab, see:
   - [Add users to the lab](./tutorial-setup-lab.md#add-users-to-the-lab)
   - [Send invitations to users](./tutorial-setup-lab.md#send-invitation-emails)
   - [Manage Lab Services user lists in Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams)

    For information about the types of accounts that students can use, see [Student accounts](./how-to-access-lab-virtual-machine.md#user-account-types).
  
1. **Set cost controls**. To set a schedule, establish quotas, and enable automatic shutdown, see the following tutorials:

   - [Set a schedule](./tutorial-setup-lab.md#add-a-lab-schedule)

        > [!NOTE]
        > Depending on the operating system you've installed, a VM might take several minutes to start. To ensure that a lab VM is ready for use during your scheduled hours, we recommend that you start it 30 minutes in advance.

   - [Set quotas for users](./how-to-manage-lab-users.md#set-quotas-for-users) and [set additional quotas for specific users](./how-to-manage-lab-users.md#set-additional-quotas-for-specific-users)
  
   - [Enable automatic shutdown on disconnect](./how-to-enable-shutdown-disconnect.md)

        > [!NOTE]
        > Schedules and quotas don't apply to the template VM, but the automatic shutdown settings do apply.
        >
        > When you create a lab, the template VM is created but not started. You can start the template VM, connect to it, install any prerequisite software for the lab, and then publish it. When you publish the template VM, it is automatically shut down for you if you haven’t done so manually.
        >
        > Template VMs incur *cost* when they're running, so ensure that the template VM is shut down when you don’t need it to be running.

   - [Create and manage Lab Services schedules in Teams](./how-to-manage-labs-within-teams.md#configure-lab-schedules-and-settings-in-teams)

1. **Use the dashboard**. For instructions, see [Use the lab dashboard](./use-dashboard.md).

    > [!NOTE]
    > The estimated cost shown on the dashboard is the maximum cost that you can expect to incur for student lab usage. For example, you will *not* be charged for unused quota hours by your students. The estimated costs do *not* reflect any charges for using the template VM, the compute gallery, or when the lab creator starts a user machine.

## Next steps

As part of managing your labs, see the following articles:

- [Track lab usage](tutorial-track-usage.md)  
- [Access a lab](tutorial-connect-lab-virtual-machine.md)

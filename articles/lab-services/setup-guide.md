---
title: Accelerated lab setup guide for Azure Lab Services
description: This guide helps lab creators quickly set up a lab account for use within their school.
ms.topic: article
ms.date: 06/26/2020
---

# Lab setup guide

The process for publishing a lab to your students can take up to several hours.  The amount of time depends on the number of virtual machines (VMs) that will be created in your lab. Allow at least a day to set up a lab, to ensure it's working properly and to allow enough time to publish students' VMs.

## Understand the lab requirements of your class

Before you set up a new lab, you should consider the following questions.

### What software requirements does the class have?

Based on your class's learning objectives, decide which operating system, applications, and tools need to be installed on the lab's VMs. To set up lab VMs, you have three options:

- **Use an Azure Marketplace image**: Azure Marketplace provides hundreds of images that you can use when you're creating a lab. For some classes, one of these images might already contain everything that you need for your class.

- **Create a new custom image**: You can create your own custom image by using an Azure Marketplace image as a starting point, and customizing it by installing additional software and making configuration changes.

- **Use an existing custom image**: You can reuse existing custom images that you previously created, or that were created by other administrators or faculty at your school. To use custom images, your administrators need to set up a Shared Image Gallery.  A Shared Image Gallery is a repository that is used for saving custom images.

> [!NOTE]
> Your administrators are responsible for enabling Azure Marketplace images and custom images so that you can use them. Coordinate with your IT department to ensure that images that you need are enabled. Custom images that you create are automatically enabled for use within labs that you own.

### What hardware requirements does the class have?

There are different compute sizes that you can choose from:

- Nested virtualization sizes, so that you can give access to students to a VM that can host multiple, nested VMs. For example, you might use this compute size for networking or ethical hacking classes.

- GPU sizes, so that your students can use computer-intensive types of applications. For example, this choice is often used with artificial intelligence and machine learning.

For guidance on selecting the appropriate VM Size, read the following articles:
- [VM sizing](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#vm-sizing)
- [Moving from a Physical Lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931)

> [!NOTE]
> Depending on the region of your lab, you might see fewer compute sizes available, because this varies by region. Generally, you should select the smallest compute size that is closest to your needs. With Azure Lab Services, you can set up a new lab with a different compute capacity later, if needed.

### What dependencies does the class have on external Azure or network resources?
Your lab VMs may need access to external resources, such as access a database, file share, or licensing server.  To allow your lab VMs to use external resources, coordinate with your IT administrators.

> [!NOTE]
> You should consider whether you can reduce your lab's dependencies to external resources by providing the resource directly on the VM. For example, to eliminate the need to read data from an external database, you can install the database directly on the VM.  

### How will costs be controlled?
Lab Services uses a pay-as-you-go pricing model, which means that you only pay for the time that a lab VM is running. To control costs, you have three options that are typically used in together:

- **Schedule**: A schedule allows you to automatically control when your labs' VMs are started and shut down.
- **Quota**: The quota controls the number of hours that students will have access to a VM outside of the scheduled hours.  When a student is using their VM and their quota is reached, the VM automatically shuts down.  The student isn't able to restart the VM unless the quota is increased.
- **Autoshutdown**: When enabled, the autoshutdown setting causes Windows VMs to automatically shut down after a student has disconnected from a Remote Desktop Protocol (RDP) session. By default, this setting is disabled.

Read the following articles for more information:
- [Estimate costs](https://docs.microsoft.com/azure/lab-services/cost-management-guide#estimate-the-lab-costs)
- [Manage costs](https://docs.microsoft.com/azure/lab-services/cost-management-guide#manage-costs)

### How will students save their work?
Students are each assigned their own VM, which is assigned to them for the lifetime of the lab. They can choose to:

- Save directly to the VM.
- Save to an external location, such as OneDrive or GitHub.

It's possible to configure OneDrive automatically for students on their lab VMs.

> [!NOTE]
> To ensure that your students have continued access to their saved work outside of the lab, and after the class ends, we recommend that students save their work to an external repository.

### How will students connect to their VM?
For RDP to Windows VMs, we recommend that students use the [Microsoft Remote Desktop client](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients). Remote Desktop client supports Macs, Chromebooks, and Windows.

For Linux VMs, students can use either SSH or RDP. To have the students connect by using RDP, you must install and configure the necessary RDP and GUI packages.

### Will students also be using Microsoft Teams?
Azure Lab Services integrates with Microsoft teams so that faculty can create and manage their labs within Teams.  Similarly, students can access the lab within Teams.

For more information, see the following article:
- [Azure Lab Services within Microsoft Teams](https://docs.microsoft.com/azure/lab-services/lab-services-within-teams-overview)

## Set up your lab

After you understand the requirements for your class's lab, you're ready to set it up. Follow the links in this section to see how to set up your lab.  Notice that different steps are provided depending on if you're using labs within Teams.

1. **Create a lab.** Refer to the tutorials on creating a lab:
    - [Create a classroom lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#create-a-classroom-lab) for instructions.
    - [Create a lab from Teams](https://docs.microsoft.com/azure/lab-services/how-to-get-started-create-lab-within-teams)

    > [!NOTE]
    > If your class requires nested virtualization, see the steps in [enabling nested virtualization](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-enable-nested-virtualization-template-vm).

1. **Customize images and publish lab VMs.** Connect to a special VM called the template VM. See the steps in the following guides:
    - [Create and manage a template VM](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#publish-the-template-vm)
    - [Use a shared image gallery](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-use-shared-image-gallery)

    > [!NOTE]
    > If you're using Windows, you should also see the instructions in [preparing a Windows template VM](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-prepare-windows-template). These instructions include steps for setting up OneDrive and Office for your students to use.

1. **Manage VM pool and capacity.** You can easily scale up or down VM capacity, as needed by your class. Keep in mind that increasing the VM capacity might take several hours because new VMs are being set up. See the steps in the following articles:
    - [Set up and manage a VM pool](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-set-virtual-machine-passwords)
    - [Manage a VM pool in Lab Services from Teams](https://docs.microsoft.com/azure/lab-services/how-to-manage-vm-pool-within-teams)

1. **Add and manage lab users.** To add users to your lab, refer to steps in the following tutorials:
   - [Add users to the lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#add-users-to-the-lab)
   - [Send invitations to users](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#send-invitation-emails-to-users)
   - [Manage Lab Services user lists from Teams](https://docs.microsoft.com/azure/lab-services/how-to-manage-user-lists-within-teams)

    For information on the types of accounts that students can use, see [Student accounts](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#student-accounts).
  
1. **Set cost controls.** To control the costs of your lab, set schedules, quotas, and autoshutdown. See the following tutorials:

   - [Set a schedule](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#set-a-schedule-for-the-lab)

        > [!NOTE]
        > Depending on the type of operating system you have installed, a VM might take several minutes to start. To ensure that a lab VM is ready for use during your scheduled hours, we recommend that you start VMs 30 minutes in advance.

   - [Set quotas for users](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#set-quotas-for-users) and [set additional quota for a specific user](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#set-additional-quotas-for-specific-users)
  
   - [Enable automatic shutdown on disconnect](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-enable-shutdown-disconnect)

        > [!NOTE]
        > Schedules and quotas don't apply to the template VM, but the auto shutdown settings apply. 
        > 
        > When you create a lab, the template VM is created but it’s not started. You can start it, connect to it, and install any pre-requisite software for the lab, and then publish it. When you publish the template VM, it’s is automatically shut down for you if you haven’t done so. 
        > 
        > Template VMs incur **cost** when running, so ensure that the template VM is shutdown when you don’t need it to be running.

    - [Create and manage Lab Services schedules within Teams](https://docs.microsoft.com/azure/lab-services/how-to-create-schedules-within-teams) 

1. **Use the dashboard.** For instructions, see [using the lab's dashboard](https://docs.microsoft.com/azure/lab-services/classroom-labs/use-dashboard).

    > [!NOTE]
    > The estimated cost shown in the dashboard is the maximum cost that you can expect for students usage of the lab. For example, you will *not* be charged for unused quota hours by your students. The estimated costs do *not* reflect any charges for using the template VM, the shared image gallery, or when the lab creator starts a user machine.

## Next steps

- [Track usage of a classroom lab](tutorial-track-usage.md)
  
- [Access a classroom lab](tutorial-connect-virtual-machine-classroom-lab.md)

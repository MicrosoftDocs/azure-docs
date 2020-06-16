---
title: Accelerated classroom lab setup guide for Azure Lab Services
description: This guide helps lab creators quickly set up a lab account for use within their school.
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/19/2020
ms.author: spelluru

---

# Classroom lab setup guide

The process for publishing a lab to your students can take up to several hours, depending on the number of virtual machines (VMs) that will be created in your lab. Allow at least a day to set up a lab, to ensure that it's working properly and to allow enough time to publish students' VMs.

## Understand the lab requirements of your class

Before you set up a new lab, you should consider the following questions.

### What software requirements does the class have?

Based on your class's learning objectives, decide which operating system, applications, and tools need to be installed on the lab's VMs. To set up lab VMs, you have three options:

- **Use an Azure Marketplace image**: Azure Marketplace provides hundreds of images that you can use when you're creating a lab. For some classes, one of these images might already contain everything that you need for your class.

- **Create a new custom image**: You can create your own custom image by using an Azure Marketplace image as a starting point, and customizing it by installing additional software and making configuration changes.

- **Use an existing custom image**: You can reuse existing custom images that you previously created, or that were created by other administrators or faculty at your school. This requires your administrators to have configured a shared image gallery, which is a repository for saving custom images.

> [!NOTE]
> Your administrators are responsible for enabling Azure Marketplace images and custom images so that you can use them. Coordinate with your IT department to ensure that images that you need are enabled. Custom images that you create are automatically enabled for use within labs that you own.

### What hardware requirements does the class have?

There are a variety of compute sizes that you can choose from:

- Nested virtualization sizes, so that you can give access to students to a VM that is capable of hosting multiple, nested VMs. For example, you might use this compute size for networking courses.

- GPU sizes, so that your students can use computer-intensive types of applications. For example, this choice can be appropriate for artificial intelligence and machine learning.

Refer to the guide on [VM sizing](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#vm-sizing) to see the complete list of available compute sizes.

> [!NOTE]
> Depending on the region of your lab, you might see fewer compute sizes available, because this varies by region. Generally, you should select the smallest compute size that is closest to your needs. With Azure Lab Services, you can set up a new lab with a different compute capacity later, if needed.

### What dependencies does the class have on external Azure or network resources?

If your lab VMs need to use external resources, such as a database, file share, or licensing server, coordinate with your administrators to ensure that your lab has access to these resources.

For access to Azure resources that are *not* secured by a virtual network, you don't need to seek additional configuration by your administrators. You can access these resources through the public internet.

> [!NOTE]
> You should consider whether you can reduce your lab's dependencies to external resources by providing the resource directly on the VM. For example, to eliminate the need to read data from an external database, you can install the database directly on the VM.  

### How will costs be controlled?

Lab Services uses a pay-as-you-go pricing model, which means that you only pay for the time that a lab VM is running. To control costs, you have three options that are typically used in conjunction with one another:

- **Schedule**: A schedule allows you to automatically control when your labs' VMs are started and shut down.
- **Quota**: The quota controls the number of hours that students will have access to a VM outside of the scheduled hours. If the quota is reached while a student is using it, the VM is automatically shut down. The student isn't able to restart the VM unless the quota is increased.
- **Auto-shutdown**: When enabled, the auto-shutdown setting causes Windows VMs to automatically shut down after a certain length of time, after a student has disconnected from a Remote Desktop Protocol (RDP) session. By default, this setting is disabled.  

    > [!NOTE]
    > This setting currently only exists for Windows.

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

## Set up your lab

After you understand the requirements for your class's lab, you're ready to set it up. Follow the links in this section to see how to set up your lab.

1. **Create a lab.** Refer to the tutorial on [creating a classroom lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#create-a-classroom-lab) for instructions.

    > [!NOTE]
    > If your class requires nested virtualization, see the steps in [enabling nested virtualization](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-enable-nested-virtualization-template-vm).

1. **Customize images and publish lab VMs.** Connect to a special VM called the template VM. See the steps in the following guides:
    - [Create and manage a template VM](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#publish-the-template-vm)
    - [Use a shared image gallery](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-use-shared-image-gallery)

    > [!NOTE]
    > If you're using Windows, you should also see the instructions in [preparing a Windows template VM](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-prepare-windows-template). These instructions include steps for setting up OneDrive and Office for your students to use.

1. **Manage VM pool and capacity.** You can easily scale up or down VM capacity, as needed by your class. Keep in mind that increasing the VM capacity might take several hours, because this involves setting up new VMs. See the steps in [setting up and managing a VM pool](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-set-virtual-machine-passwords).

1. **Add and manage lab users.** To add users to your lab, refer to steps in the following tutorials:
   - [Add users to the lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#add-users-to-the-lab)
   - [Send invitations to users](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#send-invitation-emails-to-users)

    For information on the types of accounts that students can use, see [Student accounts](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#student-accounts).
  
1. **Set cost controls.** To control the costs of your lab, set schedules, quotas, and auto-shutdown. See the following tutorials:

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


1. **Use the dashboard.** For instructions, see [using the lab's dashboard](https://docs.microsoft.com/azure/lab-services/classroom-labs/use-dashboard).

    > [!NOTE]
    > The estimated cost shown in the dashboard is the maximum cost that you can expect for students usage of the lab. For example, you will *not* be charged for unused quota hours by your students. The estimated costs do *not* reflect any charges for using the template VM, the shared image gallery, or when the lab creator starts a user machine.

## Next steps

- [Track usage of a classroom lab](tutorial-track-usage.md)
  
- [Access a classroom lab](tutorial-connect-virtual-machine-classroom-lab.md)
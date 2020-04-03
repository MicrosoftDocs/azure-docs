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
ms.date: 3/18/2020
ms.author: spelluru

---

# Classroom lab setup guide

The process for publishing a lab to your students can take up to several hours depending on the number of virtual machines (VMs) that will be created in your lab.  You should give yourself at least a day to set up a lab to ensure that it's working properly and to allow enough time to publish students' VMs.

## Understand your class's lab requirements

Before you set up a new lab, you should consider the following questions:

**What software requirements does the class have?**

Based on your class's learning objectives, you should decide which OS, applications, tools, etc. need to be installed on the lab's VMs.   To set up lab VMs, you have three options:

- **Use an Azure Marketplace image** – The Marketplace provides hundreds of images that you can use when creating a lab.  For some classes, a marketplace image may already contain everything that you need for your class.

- **Create a new custom image** - You may create your own custom image by using a marketplace image as a starting point and customizing it by installing additional software, making configuration changes, etc.

- **Use an existing custom image** - You may reuse existing custom images that you previously created or that were created by other administrators or faculty at your school; this requires your administrators to have configured a Shared Image Gallery which is a repository for saving custom images.

> [!NOTE]
> Your administrators are responsible for enabling Marketplace and custom images so that you can use them; you will need to coordinate with your IT department to ensure that images that you need are enabled.  Custom images that you create are automatically enabled for use within labs that you own.

**What hardware requirements does the class have?**

There are a variety of compute sizes that you can choose from that includes:

- Nested virtualization sizes so that you can give access to students to a VM that is capable of hosting multiple nested VMs; for example, this compute size is often used for Networking courses.

- GPU sizes so that your students can use computer-intensive types of applications, such as for Artificial Intelligence and Machine Learning.

Refer to the guide on [VM sizing](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#vm-sizing) to see the complete list of available compute sizes.

> [!NOTE]
> Depending on the region that your lab will be created in, you may see fewer compute sizes available since this varies by region.  Our general recommendation is to select the smallest compute size that is closest to your needs.  With Azure Lab Services, you can set up a new lab with a different compute capacity later if needed.

**What dependencies does the class have on external Azure or network resources?**

If your lab VMs need to use external resources, such as a database, file share, licensing server, etc. you will need to coordinate with your administrators to ensure that your lab has access to these resources.

For access to Azure resources that are *not* secured by a virtual network, then you can access these resources via the public internet without any additional configuration by your administrators.

> [!NOTE]
> You should consider whether you can reduce your lab's dependencies to external resources by providing the resource directly on the VM.  For example, to eliminate the need to read data from an external database, you could install the database directly on the VM.  

**How will costs be controlled?**

Lab Services uses a pay-as-you go pricing model which means that you only pay for the time that a lab VM is running.  To control costs, you have three options that are typically used in conjunction with one another:

- **Schedule** - A schedule allows you to automatically control when your labs' VMs are started and shut down.
- **Quota** - The quota controls the number of hours that students will have access to a VM outside of the scheduled hours.  If the quota is reached while a student is using it, the VM is automatically shut down and the student is not able to restart the VM unless the quota is increased.
- **Auto-shutdown** - When enabled, the auto-shutdown setting causes Windows VMs to automatically shut down after a certain length of time once a student has disconnected from their RDP session.  By default, this setting is disabled.  

    > [!NOTE]
    > This setting currently only exists for Windows.

**How will students save their work?**

Students are each assigned their own VM that is assigned to them for the lifetime of the lab.  They can choose to:

- Save directly to the VM.
- Save to an external location, such as OneDrive, GitHub, etc.

To use OneDrive, you may choose to configure this automatically for students on their lab VMs.  Additional information on this is provided below.

> [!NOTE]
> To ensure that your students have continued access to their saved work outside of the lab, which includes after the class ends, we recommend that students save their work to an external repository.

**How will students connect to their VM?**

For RDP to Windows VMs, we recommend students use [Microsoft Remote Desktop client](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).  Remote Desktop client supports Macs, Chromebooks, and Windows.

For Linux VMs, students may use either SSH or RDP.   To connect using RDP, you are responsible for installing and configuring the necessary RDP and GUI packages.  More details on this is provided below.

## Set up your lab

Once you understand the requirements for your class's lab, you are ready to set it up.  Follow the links in this section to see how to set up your lab.

1. **Create a lab**

   Refer to the tutorial on [creating a classroom lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#create-a-classroom-lab) for instructions.

    > [!NOTE]
    > If your class requires nested virtualization, refer to steps in the how-to guide that shows [enabling nested virtualization](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-enable-nested-virtualization-template-vm).

1. **Customize images and publish lab VMs**

    To customize images and publish VMs in your lab, you connect to a special VM called the template VM; refer to steps to the following guides:
    - [Create and manage a template VM](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#publish-the-template-vm)
    - [Use a Shared Image Gallery](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-use-shared-image-gallery)

    > [!NOTE]
    > If you are using Windows, you should also refer to instructions in the how-to guide for [preparing a Windows template VM](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-prepare-windows-template).  These instructions include steps for setting up OneDrive and Office for your students to use.

1. **Manage VM pool and capacity**

   You can easily scale up or down VM capacity as needed by your class.  Keep in mind that increasing the VM capacity may take several hours since this involves setting up new VMs.  Refer to steps in the how-to guide for [setting up and managing a VM pool](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-set-virtual-machine-passwords).

1. **Add and manage lab users**

   To add users to your lab, refer to steps in the following tutorials:
   - [Add users to the lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#add-users-to-the-lab)
   - [Send invitations to users](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#send-invitation-emails-to-users)

    Also, refer to the following article for information on the types of accounts that students can use:
    - [Student accounts](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#student-accounts)
  
1. **Set cost controls**

    To control the costs of your lab, set schedules, quotas, and auto-shutdown; refer to instructions in the following tutorials:

   - [Set a schedule](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-classroom-lab#set-a-schedule-for-the-lab)
        > [!NOTE]
        > Depending on the type of OS you have installed, a VM may take several minutes to start.  To ensure that a lab VM is ready for use during your scheduled hours, we recommend that you start VMs 30 minutes in advance to ensure that VMs are running and ready for use.

   - [Set quotas for users](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#set-quotas-for-users) and [set additional quota for a specific user](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-student-usage#set-additional-quotas-for-specific-users)
  
   - [Enable automatic shutdown on disconnect](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-enable-shutdown-disconnect)

        > [!NOTE]
        > Schedules, quotas, and automatic shutdown do *not* apply to the template VM.  As a result, you must ensure that you shut down the template VM when it's not being used otherwise it will continue to incur costs.  Also, by default, when you create a lab, the template VM is automatically started, so you'll want to make sure that you immediately finish setting up the lab and shutdown the template VM.

1. **Use dashboard**

    Refer to the how-to guide on [using the lab's dashboard](https://docs.microsoft.com/azure/lab-services/classroom-labs/use-dashboard) for instructions.

    > [!NOTE]
    > The estimated costs shown in the dashboard is the maximum cost that you can expect for students usage of the lab.  For example, you will *not* be charged for unused quota hours by your students.  The estimated costs do *not* reflect any charges for using the template VM or the Shared Image Gallery.

## Next steps

See the following articles:

- [Track usage of a classroom lab](tutorial-track-usage.md)
  
- [Access a classroom lab](tutorial-connect-virtual-machine-classroom-lab.md)
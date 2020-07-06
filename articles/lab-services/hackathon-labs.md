---
title: Use Azure Lab Services for hackathon
description: This article describes how to use Azure Lab Services for creating labs that you can use for running hackathons.
ms.topic: article
ms.date: 06/26/2020
---

# Use Azure Lab Services for your next hackathon
Azure Lab Services is designed to be lightweight and easy to use so that you can quickly spin up a new lab of virtual machines (VMs) for your hackathon.  Use the following checklist to ensure that your hackathon goes as smoothly as possible. This checklist should be completed by your IT department or faculty who are responsible for creating and managing your hackathon lab. 

To use Lab Services for your hackathon, ensure that both lab account and your lab are created at least a few days before the start of your hackathon. Also, follow the guidance below:

## Guidance

- **Create the lab in a region or location that's closest to participants**. 

    To reduce latency, create your lab in a region that's closest to your hackathon participants.  If your participants are located all over the world, you need to use your best judgment to create a lab that is centrally located.  Or, split the hackathon to use multiple labs based on the locations where your participants are located.
- **Choose a compute size best suited for usage needs**.

    Generally, the larger the compute size, the faster the virtual machine will perform. However, to limit costs, you'll need to select the appropriate compute size based on your participants’ needs. See [VM sizing information in the administrator guide](administrator-guide.md#vm-sizing) for details on the available compute sizes.
- **Configure RDP\SSH for remote desktop connection to Linux VMs**.

    If your hackathon uses Linux VMs, ensure that remote desktop is enabled so that your participants can use either RDP (remote desktop protocol) or SSH (secure shell) to connect to their VMs. This step is only required for Linux VMs and must be enabled when creating the lab. Also, for RDP, you may need to install and configure the RDP server and GUI packages on the template VM before publishing.  For more information, see the [how-to guide on enabling remote desktop for Linux](how-to-enable-remote-desktop-linux.md).

- **Install and stop Windows updates**. 

    If you're using a Windows image, we recommend that you install the latest Windows updates on the lab’s [template VM](how-to-create-manage-template.md) before you publish it to create labs’ VMs. It's for security purposes and to prevent participants from being disrupted during the hackathon to install updates, which can also cause their VMs to restart. You might also consider turning off Windows updates to prevent any future interruptions. See the [how-to guide on installing and configuring Windows updates](how-to-prepare-windows-template.md#install-and-configure-updates).
- **Decide how students will back up their work**. 

    Students are each assigned a virtual machine for the lifetime of the hackathon. They can save their work directly to the machine, but it’s recommended that students back up their work so that they have access to it after the hackathon is over. For example, they should save to an external location, such as OneDrive, GitHub, and so on. To use OneDrive, you may choose to configure it automatically for students on their lab virtual machines. See the [how-to guide to install and configure OneDrive](how-to-prepare-windows-template.md#install-and-configure-onedrive).
- **Set VM capacity according to number of participants**. 

    Ensure that your lab’s virtual machine capacity is set based on the number of participants you expect at your hackathon. When you publish the template virtual machine, it can take several hours to create all of the machines in the lab. That's why we recommend that you do it well in advance to the start of the hackathon. For more information, see the [how-to guide on updating lab capacity](how-to-set-virtual-machine-passwords.md#update-the-lab-capacity).

- **Decide whether to restrict lab access**. 

    When adding users to the lab, there is a restrict access option that's enabled by default. This feature requires you to add all of your hackathon participants’ emails to the list before they can register and access the lab using the registration link. If you have a hackathon where you don’t know who the participants will be before the event, you can choose to disable the restrict access option, which allows anyone to register to the lab using the registration link. For more information, see the [how-to guide on adding users](how-to-configure-student-usage.md#add-users-to-a-lab).

- **Verify schedule, quota, and autoshutdown settings**. 

    Lab Services provides several cost controls to limit usage of VMs. However, if these settings are misconfigured, they can cause your lab’s virtual machines to unexpectedly shut down. To ensure that these settings are configured appropriately for your hackathon, verify the following settings:

    **Schedule**: A [schedule](how-to-create-schedules.md) allows you to automatically control when your labs’ machines are started and shut down. By default, no schedule is configured when you create a new lab. However, you should ensure that your lab’s schedule is set according to what makes sense for your hackathon.  As an example, if your hackathon starts on Saturday at 8:00 AM and ends on Sunday at 5:00 PM – you could create a schedule that automatically starts the machine at 7:30 AM on Saturday (about 30 minutes before the start of the hackathon) and shuts it down at 5:00 PM on Sunday. Instead, you may also decide not to use a schedule at all.

    **Quota**: The [quota](how-to-configure-student-usage.md#set-quotas-for-users) controls the number of hours that participants will have access to a virtual machine outside of the scheduled hours. If the quota is reached while a participant is using it, the machine is automatically shut down and the participant won't be able to restart it unless the quota is increased. By default, when you create a lab, the quota is set to 10 hours. Again, you should be sure to set the quota so that it allows enough time for the hackathon, which is especially important if you haven't created a schedule.

    **Autoshutdown**: When enabled, the [autoshutdown](how-to-enable-shutdown-disconnect.md) setting causes Windows virtual machines to automatically shut down after a certain period of time once a student has disconnected from their RDP session. By default, this setting is disabled.

- **Configure firewall settings to allow connections to lab VMs**. 

    Ensure that your school’s or organization’s firewall settings allow connecting to lab VMs using RDP\SSH. For more information, see the [how-to guide on configuring your network’s firewall settings](how-to-configure-firewall-settings.md).

- **Install RDP\SSH client on participants’ tablets, Macs, PCs, and so on**.

    Hackathon participants must have an RDP and/or SSH client installed on their tablets or laptops that they'll use to connect to lab VMs. You may choose from different RDP or SSH clients, such as:

    - Microsoft’s **Remote Desktop Connection** app for RDP connections. The Remote Desktop Connection app is supported on different kinds of platforms, including Chromebooks and [Mac](https://techcommunity.microsoft.com/t5/azure-lab-services/connecting-to-azure-lab-services-environments-on-your-macos/ba-p/1290162).
    - [Putty](https://techcommunity.microsoft.com/t5/azure-lab-services/connecting-to-azure-lab-services-environments-on-your-macos/ba-p/1290162) for using SSH to connect to a Linux VM.
- **Verify lab virtual machines**. 

    Once you’ve published lab VMs, you should verify they're configured properly. You only need to do this verification for one of the participant’s lab virtual machines:

    1. Connect using RDP and\or SSH.
    2. Open each additional application and tool that you installed to customize the base virtual machine image.
    3. Walk through a few basic scenarios that are representative of the activities that participants will do to ensure VM performance is adequate based on the selected compute size.

## On the day of hackathon
This section outlines the steps to complete the day of your hackathon.

1. **Start lab VMs**.

    Depending on your OS, your lab machine may take up to 30 minutes to start. As a result, it’s important to start machines before the hackathon starts so that your participants don’t have to wait. If you're using a schedule, ensure that the VMs are automatically started at least 30 minutes earlier as well.
2. **Invite students to register and access their lab virtual machine**. 

    Provide your participants with the following information so that participants can access their lab VMs. 

    - The lab’s registration link. 
    - Credentials that should be used to connect to the machine. This step applies only if your lab uses a Windows-based image and you configured all VMs to use the same password.
    - Instructions on how participants SSH and\or RDP to their machines.

        For more information, See [how-to guide on sending invitations to users](how-to-configure-student-usage.md?branch=master#send-invitations-to-users) and [connecting to Linux VMs](how-to-use-remote-desktop-linux-student.md?branch=master). 

## Next steps
Start with creating a lab account in Classroom Labs by following instructions in the article: [Tutorial: Setup a lab account with Azure Lab Services](tutorial-setup-lab-account.md).
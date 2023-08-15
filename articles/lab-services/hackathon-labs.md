---
title: Use Azure Lab Services for hackathon
description: Learn how to use Azure Lab Services for creating labs that you can use for running hackathons.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 05/22/2023
---

# Guidance for using Azure Lab Services for running a hackathon

With Azure Lab Services, hackathon organizers can quickly create preconfigured cloud-based environments for running a hackathon with multiple participants. Each participant can use identical and isolated virtual machine (VM) for the hackathon.

Azure Lab Services is designed to be lightweight and easy to use so that you can quickly spin up a new lab of virtual machines (VMs) for your hackathon. This article provides guidance for configuring your labs in Azure Lab Services for optimally running a hackathon.

Azure Lab Services uses Azure Role-Based Access (Azure RBAC) to manage access to Azure Lab Services. For more information, see the [Azure Lab Services built-in roles](./concept-lab-services-role-based-access-control.md). Using Azure RBAC lets you clearly separate roles and responsibilities for creating and managing labs across different teams and people in your organization. Depending on your organization structure and responsibilities, this guidance might affect different people, such as IT administrators or hackathon organizers.

To use Lab Services for your hackathon, ensure that both lab plan and your lab are created at least a few days before the start of your hackathon.

## Guidance

- **Create the lab in a region or location that's closest to participants**.

    To reduce latency, create your lab in a region that's closest to your hackathon participants.  If your participants are located all over the world, use your best judgment to create a lab that is centrally located.  Alternately, use multiple labs based on the locations where your participants are located.

- **Choose a compute size best suited for usage needs**.

    Generally, the larger the compute size, the faster the virtual machine performs. However, to limit costs, you might select the appropriate compute size based on your participants’ needs. See [VM sizing information in the administrator guide](administrator-guide.md#vm-sizing) for details on the available compute sizes.

- **Configure RDP\SSH for remote desktop connection to Linux VMs**.

    If your hackathon uses Linux VMs, ensure that remote desktop is enabled so that your participants can use either RDP (remote desktop protocol) or SSH (secure shell) to connect to their VMs. This step is only required for Linux VMs and must be enabled when creating the lab. Also, for RDP, you might need to install and configure the RDP server and GUI packages on the template VM before publishing.  For more information, see the [how to enable remote desktop for Linux](how-to-enable-remote-desktop-linux.md).

- **Install and stop Windows updates**.

    If you're using a Windows image, we recommend you install the latest Windows updates on the lab’s [template VM](how-to-create-manage-template.md) before you publish the lab. Install the latest updates for security purposes, and to avoid that hackathon participants are disrupted during the hackathon to install updates, which can also cause their VMs to restart. You might also consider turning off Windows updates to prevent any future interruptions during the hackathon. See the [how-to guide on installing and configuring Windows updates](how-to-prepare-windows-template.md#install-and-configure-windows-updates).

- **Decide how participants back up their work**.

    Hackathon participants are each assigned a virtual machine for the lifetime of the hackathon. Instead of saving their work directly to the virtual machine, participants can back up their work outside of the VM, which also enables them to access the data after the hackathon is over. For example, participants can save to OneDrive, GitHub, and so on. To use OneDrive, you may choose to configure it automatically for participants on their lab virtual machines. See the [how-to guide to install and configure OneDrive](how-to-prepare-windows-template.md#install-and-configure-onedrive).

- **Set VM capacity according to number of participants**.

    Ensure that your lab virtual machine capacity is set based on the number of participants you expect at your hackathon. When you publish the template virtual machine, it can take several hours to create all of the lab virtual machines. It's recommended that you create the lab and lab VMs well in advance of the start of the hackathon. For more information, see [Set lab capacity](how-to-manage-vm-pool.md#change-lab-capacity).

- **Decide whether to restrict lab access**.

    By default, access to the lab is restricted. This feature requires you to add all of your hackathon participants’ emails to the list before they can register and access the lab using the registration link. If you have a hackathon where you don’t know the specific participants, you can choose to disable the restrict access option. In this case, anyone can register directly to the lab by using the registration link. For more information, see the [how-to guide on adding users](how-to-manage-lab-users.md).

- **Verify schedule, quota, and autoshutdown settings**.

    Azure Lab Services provides several cost controls to limit usage of VMs. However, if these settings are misconfigured, they can cause your lab’s virtual machines to shut down unexpectedly. To ensure that these settings are configured appropriately for your hackathon, verify the following settings:

    **Schedule**: A [schedule](how-to-create-schedules.md) allows you to automatically control when your labs’ machines are started and shut down. By default, no schedule is configured when you create a new lab. However, you should ensure that your lab’s schedule is set according to what makes sense for your hackathon.  For example, if your hackathon starts on Saturday at 8:00 AM and ends on Sunday at 5:00 PM, create a schedule that automatically starts the machine at 7:30 AM on Saturday (about 30 minutes before the start of the hackathon) and shuts it down at 5:00 PM on Sunday. You might also decide not to use a schedule at all and rely on quota time.

    **Quota**: The [quota](how-to-manage-lab-users.md#set-quotas-for-users) controls the number of hours that participants have access to a lab virtual machine outside of the scheduled hours. If the quota is reached while a participant is using it, the machine is automatically shut down and the participant is unable to restart it, unless the quota is increased. By default, when you create a lab, the quota is set to 10 hours. Configure the quota to allow enough time for the duration of the hackathon, especially if you haven't created a schedule.

    **Autoshutdown**: When enabled, the [autoshutdown](how-to-enable-shutdown-disconnect.md) setting causes Windows virtual machines to automatically shut down after a certain period of time once a participant has disconnected from their RDP session. By default, this setting is disabled.

- **Configure firewall settings to allow connections to lab VMs**.

    Ensure that the firewall settings of your organization, or the location where you're hosting the hackathon, allow connecting to lab VMs by using RDP or SSH. For more information, see the [how-to guide on configuring your network’s firewall settings](how-to-configure-firewall-settings.md).

- **Install RDP/SSH client on participants’ tablets, Macs, PCs, and so on**.

    Hackathon participants must have an RDP and/or SSH client installed on their tablets or laptops to connect to lab VMs.  For more information about required software and how to connect to lab VMs, see [Connect to a lab VM](connect-virtual-machine.md).

- **Verify lab virtual machines**.

    Once you’ve published lab VMs, verify that they're configured properly. As all lab VMs are identical, you only need to do this verification for one of the lab VMs:

    1. Connect to the lab VM by using RDP and\or SSH.
    1. Open each application and tool that you installed to customize the base virtual machine image.
    1. Walk through a few basic scenarios that are representative of the hackathon activities to ensure that the VM performance is adequate, based on the selected compute size.

## On the day of hackathon

This section outlines the steps to complete the day of your hackathon.

1. **Start lab VMs**.

    Depending on your OS, your lab machine might take up to 30 minutes to start. As a result, it’s important to start machines before the hackathon starts so that your participants don’t have to wait. If you're using a schedule, ensure that the VMs are automatically started at least 30 minutes before the beginning of the hackathon.

1. **Invite hackathon participants to register and access their lab virtual machine**.

    Provide your participants with the following information so that participants can access their lab VMs.

    - The lab’s registration link.  For more information, See [how-to guide on sending invitations to users](how-to-manage-lab-users.md#send-invitations-to-users).
    - Credentials to use for connecting to the machine. This step only applies if the lab was configured with the same credentials for all lab VMs.
    - Instructions on how to connect to the lab VM. For OS-specific instructions, see [Connect to a lab VM](connect-virtual-machine.md).

## Next steps

- Get started by [creating a lab plan](quick-create-resources.md)

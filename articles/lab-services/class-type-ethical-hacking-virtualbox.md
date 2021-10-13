---
title: Set up an ethical hacking lab on VirtualBox with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab using Azure Lab Services to teach ethical hacking with VirtualBox. 
ms.topic: article
ms.date: 06/11/2021
---

# Set up a lab to teach ethical hacking class with VirtualBox

This article shows you how to set up a class that focuses on forensics side of ethical hacking. Penetration testing, a practice used by the ethical hacking community, occurs when someone attempts to gain access to the system or network to demonstrate vulnerabilities that a malicious attacker may exploit.

In an ethical hacking class, students can learn modern techniques for defending against vulnerabilities. Each student gets a host virtual machine that has three nested virtual machines – two virtual machine with [Seed](https://seedsecuritylabs.org/lab_env.html) image and another machine with [Kali Linux](https://www.kali.org/) image. The Seed virtual machine is used for exploiting purposes and Kali virtual machine provides access to the tools needed to execute forensic tasks.

This article has two main sections. The first section covers how to create the classroom lab. The second section covers how to create the template machine with nested virtualization enabled and with the tools and images needed. In this case, two Seed images and a Kali Linux image on a machine that has [VirtualBox](https://www.virtualbox.org/) enabled to host the images.

## Lab configuration

To set up this lab, you need an Azure subscription to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can either create a new lab account in Azure Lab Services or use an existing account. See the following tutorial for creating a new lab account: [Tutorial to setup a lab account](tutorial-setup-lab-account.md).

Follow [this tutorial](tutorial-setup-classroom-lab.md) to create a new lab and then apply the following settings:

| Virtual machine size | Image |
| -------------------- | ----- |
| Medium (Nested Virtualization) | Windows Server 2019 Datacenter |
| Medium (Nested Virtualization) | Windows 10 |

## Template machine

After the template machine is created, start the machine and connect to it to complete the following three major tasks.

1. Set up the machine to use [VirtualBox](https://www.virtualbox.org/) for nested virtual machines.
2. Set up the [Kali](https://www.kali.org/) Linux image. Kali is a Linux distribution that includes tools for penetration testing and security auditing.
3. Set up the Seed image. For this example, the [Seed](https://seedsecuritylabs.org/lab_env.html) image will be used. This image is created specifically for security training.

The rest of this article will cover the manual steps to completing the tasks above.

### Installing VirtualBox

1. Download the [VirtualBox platform packages](https://www.virtualbox.org/wiki/Downloads) by selecting the Windows hosts option.
2. Run the installation executable, and use the default options to complete the installation.

### Set up a nested virtual machine with Kali Linux Image

Kali is a Linux distribution that includes tools for penetration testing and security auditing.

1. Download the ova image from [Kali Linux VM VirtualBox images](https://www.kali.org/get-kali/#kali-virtual-machines).  We recommend the 32bit version, the 64bit version loads with errors.  Remember the default username and password noted on the download page.
2. Open VirtualBox Manager and [import the .ova image.](https://docs.oracle.com/cd/E26217_01/E26796/html/qs-import-vm.html).  The Kali licensing agreement will need to be reviewed and accepted to continue.

>[!Note]
>- The VirtualBox default Ram for the Kali VM is 2 gig (2048), We recommend increasing the Ram to at least 4 gig (4096) or more depending on your needs.  This can be changed by the students on their VMs.  Changing the RAM size within VirtualBox does not change the Lab's VM size.
>- By default the Hard disk is set to an 80 gig limit, but is dynamically allocated.  Lab Service machines are limited to 128 gigs of hard drive space, so be careful not to exceed this disk size.
>- The Kali image has USB 2.0 enable which requires [Oracle VM VirtualBox Extension Pack](https://www.virtualbox.org/wiki/Downloads) or set the USB controller to 1.0 under the USB tab.

### Setup Seed lab images

1. Download and extract the [SEED Labs VM image.](https://seedsecuritylabs.org/labsetup.html).
2. Follow the directions to [create a VM in VirtualBox.](https://github.com/seed-labs/seed-labs/blob/master/manuals/vm/seedvm-manual.md)
   If you need multiple SEED VMs make copies of the .iso for each machine, using the same .iso for different machines will not work properly.

>[!IMPORTANT] 
>Make sure that all the nested virtual machines are powered off before publishing the template.  Leaving them powered on has had unexpected side effects, including damaging the virtual machines.

## Cost  

If you would like to estimate the cost of this lab, you can use the following example:

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be:

25 students \* (20 + 10) hours \* 55 Lab Units \* 0.01 USD per hour = 412.50 USD

>[!IMPORTANT]
>Cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

This article walked you through the steps to create a lab for ethical hacking class. It includes steps to set up nested virtualization for creating two virtual machines inside the host virtual machine for penetrating testing.

## Next steps

Next steps are common to setting up any lab:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users).

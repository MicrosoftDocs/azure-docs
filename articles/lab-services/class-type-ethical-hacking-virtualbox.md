---
title: Set up an ethical hacking lab on VirtualBox with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab using Azure Lab Services to teach ethical hacking with VirtualBox. 
ms.topic: how-to
ms.date: 01/04/2022
---

# Set up a lab to teach ethical hacking class with VirtualBox

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a class that focuses on the forensics side of ethical hacking. Penetration testing, a practice used by the ethical hacking community, occurs when someone attempts to gain access to the system or network to demonstrate vulnerabilities that a malicious attacker may exploit.

In an ethical hacking class, students can learn modern techniques for defending against vulnerabilities. Each student gets a lab VM that acts as host virtual machine.  The host machine has three nested virtual machines – two virtual machines with a [Seed](https://seedsecuritylabs.org/lab_env.html) image and another machine with a [Kali Linux](https://www.kali.org/) image. The Seed virtual machine is used for exploiting purposes and Kali virtual machine provides access to the tools needed to execute forensic tasks.

This article has two main sections. The first section covers how to create the lab. The second section covers how to create the template machine with nested virtualization enabled and with the tools and images needed. In this case, two Seed images and a Kali Linux image on a machine that has [VirtualBox](https://www.virtualbox.org/) enabled to host the images.

## Lab configuration

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

### Lab settings

[!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Use the following settings when creating the lab.

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | Medium (Nested Virtualization) |
| VM image | Windows Server 2019 Datacenter or Windows 10 |

## Template machine configuration

After the template machine is created, start the machine and connect to it to complete the following three major tasks.

1. Set up the machine to use [VirtualBox](https://www.virtualbox.org/) for nested virtual machines.
2. Set up the [Kali](https://www.kali.org/) Linux image. Kali is a Linux distribution that includes tools for penetration testing and security auditing.
3. Set up the Seed image. For this example, the [Seed](https://seedsecuritylabs.org/lab_env.html) image will be used. This image is created specifically for security training.

The rest of this article will cover the manual steps to complete the tasks above.

### Installing VirtualBox

1. Download the [VirtualBox platform packages](https://www.virtualbox.org/wiki/Downloads) by selecting the Windows hosts option.
2. Run the installation executable, and use the default options to complete the installation.

### Set up a nested virtual machine with Kali Linux Image

Kali is a Linux distribution that includes tools for penetration testing and security auditing.

1. Download the ova image from [Kali Linux VM VirtualBox images](https://www.kali.org/get-kali/#kali-virtual-machines).  We recommend the 32-bit version.  The 64-bit version loads with errors.  Remember the default username and password noted on the download page.
2. Open VirtualBox Manager and [import the .ova image](https://docs.oracle.com/cd/E26217_01/E26796/html/qs-import-vm.html). The Kali licensing agreement will need to be reviewed and accepted to continue.
3. Increase the RAM to *at least* 4 GBs (4096). The amount of ram given to a VirtualBox VM can be changed by the students on their lab VMs.  Changing the RAM size within VirtualBox doesn't change the lab VM's size.
4. Install the [Oracle VM VirtualBox Extension Pack](https://www.virtualbox.org/wiki/Downloads) to use USB 2.0 as enabled on the Kali Linux image. If you don't want to install the extension pack, set the USB controller to 1.0 under the USB tab.

> [!Note]
> By default, the hard disk is set to an 80 GB limit, but is dynamically allocated.  Lab Service machines are limited to 128 gigs of hard drive space, so be careful not to exceed this disk size.

### Setup Seed lab images

1. Download and extract the [SEED Labs VM image.](https://seedsecuritylabs.org/labsetup.html).
2. Follow the directions to [create a VM in VirtualBox.](https://github.com/seed-labs/seed-labs/blob/master/manuals/vm/seedvm-manual.md) If you need multiple SEED VMs make copies of the .iso for each machine.  Using the same .iso for different machines won't work properly.

> [!IMPORTANT]
> Make sure that all the nested virtual machines are powered off before publishing the template.  Leaving them powered on has had unexpected side effects, including damaging the virtual machines.

## Cost  

Let's cover a possible cost estimate for this class.  We'll use a class of 25 students.  There are 20 hours of scheduled class time.  Also, each student gets 10 hours quota for homework or assignments outside scheduled class time.  The virtual machine size we chose was Medium (Nested Virtualization), which is 55 lab units.

Here's an example of a possible cost estimate for this class:

25 students \* (20 + 10) hours \* 55 Lab Units \* 0.01 USD per hour = 412.50 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

This article walked you through the steps to create a lab for ethical hacking class. The lab VM is configured for nested virtualization.  We also created two VirtualBox virtual machines inside the host lab VM for penetrating testing.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

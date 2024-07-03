---
title: Set up an ethical hacking lab
titleSuffix: Azure Lab Services
description: Learn how to set up a lab to teach ethical hacking using Azure Lab Services. The lab includes nested VMs for students to use in a standard environment.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 03/04/2024
#customer intent: As an administrator or educator, I want to set up a lab by using Azure Lab Services so that students can practice ethical hacking techniques. 
---

# Set up a lab to teach ethical hacking class by using Azure Lab Services

This article shows you how to set up a class that focuses on the forensics side of ethical hacking with Azure Lab Services. In an ethical hacking class, students can learn modern techniques for defending against vulnerabilities. Penetration testing, a practice that the ethical hacking community uses, occurs when someone attempts to gain access to the system or network to demonstrate vulnerabilities that a malicious attacker might exploit.

Each student gets a Windows host virtual machine (VM) that has two nested virtual machines: one VM with Metasploitable3 image and another VM with the Kali Linux image. Use the Metasploitable VM to try exploitation tasks. The Kali VM provides access to the tools you need to run forensic tasks.

## Prerequisites

- [!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]
- [!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

## Configure your lab

[!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)] Use the following settings when creating the lab.

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | Medium (Nested Virtualization) |
| VM image | Windows 11 |

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Configure your template

[!INCLUDE [configure template vm](./includes/lab-services-class-type-template-vm.md)]

To configure the template VM, complete the following tasks:

- Set up the machine for nested virtualization. Enable all the appropriate windows features, like Hyper-V.
- Set up the [Kali](https://www.kali.org/) Linux image. Kali is a Linux distribution that includes tools for penetration testing and security auditing.
- Set up the Metasploitable image. For this example, use the [Metasploitable3](https://github.com/rapid7/metasploitable3) image. This image is created to purposely have security vulnerabilities.

# [PowerShell](#tab/powershell)

### Prepare template machine for nested virtualization

- Launch **PowerShell** in **Administrator** mode. Run these commands.

  ```powershell
  Invoke-WebRequest 'https://aka.ms/azlabs/scripts/hyperV-powershell' -Outfile SetupForNestedVirtualization.ps1
  .\SetupForNestedVirtualization.ps1
  ```

> [!NOTE]
> The script might require the machine to restart. Follow instructions from the script and re-run the script until you see **Script completed** in the output.

### Set up nested virtual machine images

Kali is a Linux distribution that includes tools for penetration testing and security auditing.

The Rapid7 Metasploitable image is an image purposely configured with security vulnerabilities. Use this image to test and find issues. The following instructions show you how to set up a particular Metasploitable image. If you need a newer version of the Metasploitable, see [https://github.com/rapid7/metasploitable3](https://github.com/rapid7/metasploitable3).

- To install Kali Linux and Metasploitable on the template VM, run the following command:

  ```powershell
  Invoke-WebRequest ' https://aka.ms/azlabs/scripts/EthicalHacking-powershell' -Outfile Setup-EthicalHacking.ps1
  .\Setup-EthicalHacking.ps1 -SwitchName 'Default Switch'
  ```

# [Windows tools](#tab/windows)

### Prepare template machine for nested virtualization

Follow the instructions to [enable nested virtualization](how-to-enable-nested-virtualization-template-vm.md) to prepare your template VM for nested virtualization.

### Set up a nested virtual machine with Kali Linux image

Kali is a Linux distribution that includes tools for penetration testing and security auditing. To install the Kali nested VM on the template VM:

1. Connect to the template VM by using Remote Desktop.

1. Download the image from [Offensive Security Kali Linux VM images](https://www.kali.org/get-kali/#kali-virtual-machines). The default username and password are noted on the download page.

   1. Download the **Kali Linux Hyper-V 64-Bit (7z)** image for Hyper-V.
   1. Extract the .7z file. If you don’t already have 7-zip, download it from [https://www.7-zip.org/download.html](https://www.7-zip.org/download.html).

1. Follow the instructions to [import a premade Kali image](https://www.kali.org/docs/virtualization/import-premade-hyperv/) into Hyper-V.

1. The Kali image is now ready for use. From **Hyper-V Manager**, choose **Action** > **Start**, then choose **Action** > **Connect** to connect to the virtual machine. The default username is `kali` and the password is `kali`.

### Set up a nested VM with Metasploitable image

The Rapid7 Metasploitable image is an image purposely configured with security vulnerabilities. Use this image to test and find issues. The following instructions show you how to set up a particular Metasploitable image. If you need a newer version of the Metasploitable, see [https://github.com/rapid7/metasploitable3](https://github.com/rapid7/metasploitable3).

To install the Metasploitable nested VM on the template VM:

1. Connect to the template VM by using Remote Desktop.

1. Download the Metasploitable image.

   1. Navigate to [https://information.rapid7.com/download-metasploitable-2017.html](https://information.rapid7.com/download-metasploitable-2017.html). Fill out the form to download the image and select the **Submit** button.

      > [!NOTE]
      > You can check for newer versions of the Metasploitable image at [https://github.com/rapid7/metasploitable3](https://github.com/rapid7/metasploitable3).

   1. Select **Download Metasploitable Now**.
   1. When the download finishes, extract the zip file, and remember the location of the *Metasploitable.vmdk* file.

1. Convert the extracted *.vmdk* file to a Hyper-V *.vhdx* file with StarWind V2V Converter.

   1. Download and install [StarWind V2V Converter](https://www.starwindsoftware.com/starwind-v2v-converter#download).
   1. Start **StarWind V2V Converter**.
   1. On the **Select the location of image to convert** page, choose **Local file**. Select **Next**.
   1. On the **Source image** page, navigate to and select *Metasploitable.vmdk* extracted in the previous step for the **File name** setting. Select **Next**.
   1. On the **Select the location of destination image**, choose **Local file**. Select **Next**.
   1. On the **Select destination image format** page, choose **VHD/VHDX**. Select **Next**.
   1. On the **Select option for VHD/VHDX image format** page, choose **VHDX growable image**. Select **Next**.
   1. On the **Select destination file name** page, accept the default file name. Select **Convert**.
   1. On the **Converting** page, wait for the image to be converted. Conversion can take several minutes. Select **Finish** when the conversion is completed.

1. Create a new Hyper-V virtual machine.

   1. Open **Hyper-V Manager**.
   1. Choose **Action** > **New** > **Virtual Machine**.
   1. On the **Before You Begin** page of the **New Virtual Machine Wizard**, select **Next**.
   1. On the **Specify Name and Location** page, enter **Metasploitable** for the **name**, and select **Next**.

      :::image type="content" source="./media/class-type-ethical-hacking/new-vm-wizard-1.png" alt-text="Screenshot of New Virtual Machine Wizard in Hyper-V." lightbox="./media/class-type-ethical-hacking/new-vm-wizard-1.png":::

   1. On the **Specify Generation** page, accept the defaults, and select **Next**.
   1. On the **Assign Memory** page, enter **512 MB** for the **startup memory**, and select **Next**.

      :::image type="content" source="./media/class-type-ethical-hacking/assign-memory-page.png" alt-text="Screenshot of Assign Memory page of New Virtual Machine Wizard in Hyper-V." lightbox="./media/class-type-ethical-hacking/assign-memory-page.png":::

   1. On the **Configure Networking** page, leave the connection as **Not Connected**. Set the network adapter later.
   1. On the **Connect Virtual Hard Disk** page, select **Use an existing virtual hard disk**. Browse to the location for the *Metasploitable.vhdx* file in the previous step, and select **Next**.

      :::image type="content" source="./media/class-type-ethical-hacking/connect-virtual-network-disk.png" alt-text="Screenshot of Connect Virtual Hard Disk page of New Virtual Machine Wizard in Hyper-V." lightbox="./media/class-type-ethical-hacking/connect-virtual-network-disk.png":::

   1. On the **Completing the New Virtual Machine Wizard** page, and select **Finish**.
   1. After the virtual machine is created, select it in the Hyper-V Manager. Don't turn on the VM yet.  
   1. Choose **Action** > **Settings**.
   1. On the **Settings for Metasploitable** page, select **Add Hardware**.
   1. Select **Legacy Network Adapter**, and select **Add**.

      :::image type="content" source="./media/class-type-ethical-hacking/network-adapter-page.png" alt-text="Screenshot of settings dialog for Hyper-V VM." lightbox="./media/class-type-ethical-hacking/network-adapter-page.png":::

   1. On the **Legacy Network Adapter** page, select **Default Switch** for the **Virtual Switch** setting, and select **OK**.

      :::image type="content" source="./media/class-type-ethical-hacking/legacy-network-adapter-page.png" alt-text="Screenshot of Legacy Network adapter settings page for Hyper-V VM." lightbox="./media/class-type-ethical-hacking/legacy-network-adapter-page.png":::

   1. The Metasploitable image is now ready for use. From **Hyper-V Manager**, choose **Action** > **Start**, then choose **Action** > **Connect** to connect to the virtual machine. The default username is `msfadmin` and the password is `msfadmin`.

---

The template is now updated and has the nested VM images needed for an ethical hacking penetration testing class: an image with tools to do the penetration testing, and another image with security vulnerabilities to discover. You can now [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) to the class.

## Estimate cost

If you would like to estimate the cost of this lab, you can use the following example:

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be:

25 students \* (20 + 10) hours \* 55 Lab Units \* 0.01 USD per hour = 412.50 USD

> [!IMPORTANT]
> This cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Related content

In this article, you went through the steps to create a lab for ethical hacking class. The lab VM contains two nested virtual machines to practice penetrating testing.

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

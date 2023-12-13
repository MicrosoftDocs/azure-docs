---
title: Set up an ethical hacking lab
titleSuffix: Azure Lab Services
description: Learn how to set up a lab to teach ethical hacking using Azure Lab Services. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 01/24/2023
---

# Set up a lab to teach ethical hacking class by using Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a class that focuses on the forensics side of ethical hacking with Azure Lab Services. In an ethical hacking class, students can learn modern techniques for defending against vulnerabilities. Penetration testing, a practice that the ethical hacking community uses, occurs when someone attempts to gain access to the system or network to demonstrate vulnerabilities that a malicious attacker may exploit.

Each student gets a Windows Server host virtual machine (VM) that has two nested virtual machines: one VM with [Metasploitable3](https://github.com/rapid7/metasploitable3) image and another VM with the [Kali Linux](https://www.kali.org/) image. You use the Metasploitable VM for exploiting purposes. The Kali VM provides access to the tools you need to execute forensic tasks.

This article has two main sections. The first section covers how to create the lab. The second section covers how to create the template machine with nested virtualization enabled and with the tools and images needed. In this case, a Metasploitable image and a Kali Linux image on a machine that has Hyper-V enabled to host the images.

## Prerequisites

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

## Lab configuration

[!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Use the following settings when creating the lab.

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | Medium (Nested Virtualization) |
| VM image | Windows Server 2019 Datacenter |

## Template machine configuration

[!INCLUDE [configure template vm](./includes/lab-services-class-type-template-vm.md)]

To configure the template VM, complete the following three tasks:

1. Set up the machine for nested virtualization. You enable all the appropriate windows features, like Hyper-V, and set up the networking for the Hyper-V images to be able to communicate with each other and the internet.

2. Set up the [Kali](https://www.kali.org/) Linux image. Kali is a Linux distribution that includes tools for penetration testing and security auditing.

3. Set up the Metasploitable image. For this example, you use the [Metasploitable3](https://github.com/rapid7/metasploitable3) image. This image is created to purposely have security vulnerabilities.

You can complete these tasks in either of two ways:

- Run the following PowerShell scripts on the template machine: [Lab Services Hyper-V Script](https://aka.ms/azlabs/scripts/hyperV) and [Lab Services Ethical Hacking Script](https://aka.ms/azlabs/scripts/EthicalHacking). Once the scripts have completed, continue to the [Next steps](#next-steps).

- Set up the template machine manually by completing the steps outlined below.

### Prepare template machine for nested virtualization

Follow the instructions to [enable nested virtualization](how-to-enable-nested-virtualization-template-vm.md) to prepare your template VM for nested virtualization.

### Set up a nested virtual machine with Kali Linux image

Kali is a Linux distribution that includes tools for penetration testing and security auditing. To install the Kali nested VM on the template VM:

1. Connect to the template VM by using remote desktop.

1. Download the image from [Offensive Security Kali Linux VM images](https://www.offensive-security.com/kali-linux-vm-vmware-virtualbox-image-download/).  Remember the default username and password noted on the download page.
    1. Download the **Kali Linux VMware 64-Bit (7z)** image for VMware.
    1. Extract the .7z file.  If you don’t already have 7 zip, download it from [https://www.7-zip.org/download.html](https://www.7-zip.org/download.html). Remember the location of the extracted folder as you'll need it later.

1. Convert the extracted vmdk file to a Hyper-V vhdx file with StarWind V2V Converter.
    1. Download and install [StarWind V2V Converter](https://www.starwindsoftware.com/starwind-v2v-converter#download).
    1. Start **StarWind V2V Converter**.
    1. On the **Select location of image to convert** page, choose **Local file**.  Select **Next**.
    1. On the **Source image** page, navigate to and select the Kali Linux vmdk file extracted in the previous step for the **File name** setting.  The file will be in the format Kali-Linux-{version}-vmware-amd64.vmdk.  Select **Next**.
    1. On the **Select location of destination image**, choose **Local file**.  Select **Next**.
    1. On the **Select destination image format** page, choose **VHD/VHDX**.  Select **Next**.
    1. On the **Select option for VHD/VHDX image format** page, choose **VHDX growable image**.  Select **Next**.
    1. On the **Select destination file name** page, accept the default file name.  Select **Convert**.
    1. On the **Converting** page, wait for the image to be converted.  Conversion may take several minutes.  Select **Finish** when the conversion is completed.

1. Create a new Hyper-V virtual machine.
    1. Open **Hyper-V Manager**.
    1. Choose **Action** -> **New** -> **Virtual Machine**.
    1. On the **Before You Begin** page of the **New Virtual Machine Wizard**, select **Next**.
    1. On the **Specify Name and Location** page, enter **Kali-Linux** for the **name**, and select **Next**.
    1. On the **Specify Generation** page, accept the defaults, and select **Next**.
    1. On the **Assign Memory** page, enter **2048 MB** for the **startup memory**, and select **Next**.
    1. On the **Configure Networking** page, leave the connection as **Not Connected**. You'll set up the network adapter later.
    1. On the **Connect Virtual Hard Disk** page, select **Use an existing virtual hard disk**. Browse to the location for the **Kali-Linux-{version}-vmware-amd64.vhdk** file created in the previous step, and select **Next**.
    1. On the **Completing the New Virtual Machine Wizard** page, and select **Finish**.
    1. Once the virtual machine is created, select it in the Hyper-V Manager. Don't turn on the machine yet.
    1. Choose **Action** -> **Settings**.
    1. On the **Settings for Kali-Linux** dialog for, select **Add Hardware**.
    1. Select **Legacy Network Adapter**, and select **Add**.
    1. On the **Legacy Network Adapter** page, select **LabServicesSwitch** for the **Virtual Switch** setting, and select **OK**. LabServicesSwitch was created when preparing the template machine for Hyper-V in the **Prepare Template for Nested Virtualization** section.
    1. The Kali-Linux image is now ready for use. From **Hyper-V Manager**, choose **Action** -> **Start**, then choose **Action** -> **Connect** to connect to the virtual machine. The default username is `kali` and the password is `kali`.

### Set up a nested VM with Metasploitable image

The Rapid7 Metasploitable image is an image purposely configured with security vulnerabilities. You use this image to test and find issues. The following instructions show you how to use a pre-created Metasploitable image. However, if a newer version of the Metasploitable image is needed, see [https://github.com/rapid7/metasploitable3](https://github.com/rapid7/metasploitable3).

To install the Metasploitable nested VM on the template VM:

1. Connect to the template VM by using remote desktop.

1. Download the Metasploitable image.
    1. Navigate to [https://information.rapid7.com/download-metasploitable-2017.html](https://information.rapid7.com/download-metasploitable-2017.html). Fill out the form to download the image and select the **Submit** button.
    
        > [!NOTE]
        > You can check for newer versions of the Metasploitable image on [https://github.com/rapid7/metasploitable3](https://github.com/rapid7/metasploitable3).

    2. Select the **Download Metasploitable Now** button.
    3. When the download finishes, extract the zip file, and remember the location of the *Metasploitable.vmdk* file.

1. Convert the extracted vmdk file to a Hyper-V vhdx file with StarWind V2V Converter.
    1. Download and install [StarWind V2V Converter](https://www.starwindsoftware.com/starwind-v2v-converter#download).
    1. Start **StarWind V2V Converter**.
    1. On the **Select location of image to convert** page, choose **Local file**.  Select **Next**.
    1. On the **Source image** page, navigate to and select the Metasploitable.vmdk extracted in the previous step for the **File name** setting.  Select **Next**.
    1. On the **Select location of destination image**, choose **Local file**.  Select **Next**.
    1. On the **Select destination image format** page, choose **VHD/VHDX**.  Select **Next**.
    1. On the **Select option for VHD/VHDX image format** page, choose **VHDX growable image**.  Select **Next**.
    1. On the **Select destination file name** page, accept the default file name.  Select **Convert**.
    1. On the **Converting** page, wait for the image to be converted.  Conversion may take several minutes.  Select **Finish** when the conversion is completed.

1. Create a new Hyper-V virtual machine.
    1. Open **Hyper-V Manager**.
    1. Choose **Action** -> **New** -> **Virtual Machine**.
    1. On the **Before You Begin** page of the **New Virtual Machine Wizard**, select **Next**.
    1. On the **Specify Name and Location** page, enter **Metasploitable** for the **name**, and select **Next**.
        :::image type="content" source="./media/class-type-ethical-hacking/new-vm-wizard-1.png" alt-text="Screenshot of New Virtual Machine Wizard in Hyper V.":::
    1. On the **Specify Generation** page, accept the defaults, and select **Next**.
    1. On the **Assign Memory** page, enter **512 MB** for the **startup memory**, and select **Next**.
        :::image type="content" source="./media/class-type-ethical-hacking/assign-memory-page.png" alt-text="Screenshot of Assign Memory page of New Virtual Machine Wizard in Hyper V.":::
    1. On the **Configure Networking** page, leave the connection as **Not Connected**. You'll set up the network adapter later.
    1. On the **Connect Virtual Hard Disk** page, select **Use an existing virtual hard disk**. Browse to the location for the **metasploitable.vhdx** file created in the previous step, and select **Next**.
        :::image type="content" source="./media/class-type-ethical-hacking/connect-virtual-network-disk.png" alt-text="Screenshot of Connect Virtual Hard Disk  page of New Virtual Machine Wizard in Hyper V.":::
    1. On the **Completing the New Virtual Machine Wizard** page, and select **Finish**.
    1. Once the virtual machine is created, select it in the Hyper-V Manager. Don't turn on the machine yet.  
    1. Choose **Action** -> **Settings**.
    1. On the **Settings for Metasploitable** dialog for, select **Add Hardware**.
    1. Select **Legacy Network Adapter**, and select **Add**.
        :::image type="content" source="./media/class-type-ethical-hacking/network-adapter-page.png" alt-text="Screenshot of settings dialog for Hyper V VM.":::
    1. On the **Legacy Network Adapter** page, select **LabServicesSwitch** for the **Virtual Switch** setting, and select **OK**. LabServicesSwitch was created when preparing the template machine for Hyper-V in the **Prepare Template for Nested Virtualization** section.
        :::image type="content" source="./media/class-type-ethical-hacking/legacy-network-adapter-page.png" alt-text="Screenshot of Legacy Network adapter settings page for Hyper V VM.":::
    1. The Metasploitable image is now ready for use. From **Hyper-V Manager**, choose **Action** -> **Start**, then choose **Action** -> **Connect** to connect to the virtual machine.  The default username is `msfadmin` and the password is `msfadmin`.

The template is now updated and has the nested VM images needed for an ethical hacking penetration testing class: an image with tools to do the penetration testing, and another image with security vulnerabilities to discover. You can now [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) to the class.

## Cost  

If you would like to estimate the cost of this lab, you can use the following example:

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be:

25 students \* (20 + 10) hours \* 55 Lab Units \* 0.01 USD per hour = 412.50 USD

>[!IMPORTANT]
>This cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

In this article, you went through the steps to create a lab for ethical hacking class. The lab VM contains two nested virtual machines to practice penetrating testing.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

---
title: Set up a lab to teach MATLAB with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab to teach MATLAB with Azure Lab Services.
ms.topic: how-to
ms.date: 04/06/2022
ms.custom: devdivchpfy22
ms.service: lab-services
---

# Setup a lab to teach MATLAB

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[MATLAB](https://www.mathworks.com/products/matlab.html) is a programming platform from [MathWorks](https://www.mathworks.com/), which combines computational power and visualization. MATLAB is a popular tool for mathematics, engineering, physics, and chemistry.

If you're using a [campus-wide license](https://www.mathworks.com/academia/tah-support-program/administrators.html), see directions at [download MATLAB installation files](https://www.mathworks.com/matlabcentral/answers/259632-how-can-i-get-matlab-installation-files-for-use-on-an-offline-machine) to download the MATLAB installer files on the template machine.

In this article, we'll show you how to set up a class that uses MATLAB client software with a license server.

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## License server

Before creating the lab plan, you'll need to set up the server to run the [Network License Manager](https://www.mathworks.com/help/install/administer-network-licenses.html) software. These instructions are only applicable for institutions that choose the networking licensing option for MATLAB, which allows users to share a pool of license keys. You'll also need to save the license file and file installation key for later. For detailed instructions on how to download a license file, see the first step in [Install License Manager on License Server](https://www.mathworks.com/help/install/ug/install-license-manager-on-license-server.html).

For detailed instructions on how to install a licensing server, see [Install License Manager on License Server](https://www.mathworks.com/help/install/ug/install-license-manager-on-license-server.html). To enable borrowing, see [Borrow License](https://www.mathworks.com/help/install/license/borrow-licenses.html).

Assuming the license server is located in an on-premises network or a private network within Azure, you’ll need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) when creating your [lab plan](./quick-create-resources.md).

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md) must be enabled during the creation of your lab plan. It can't be added later.

## Lab configuration

Once you have an Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). If you're using a [Network License Manager](https://www.mathworks.com/help/install/administer-network-licenses.html) on a license server, enable [advanced networking](how-to-connect-vnet-injection.md) when creating your lab plan. You can also use an existing lab plan.

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md). Use the following settings when creating the lab:

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | Medium |
| VM image | Windows 10 |

MATLAB is supported on more operating systems than Windows 10. For more information, see [MATLAB system requirements](https://www.mathworks.com/support/requirements/matlab-system-requirements.html).

## Template machine configuration

After the template machine is created, start the machine and connect to the template machine to complete the following major tasks:

1. Download the installation files for the MATLAB client software.
2. Install MATLAB using the file installation key.

Installing MATLAB will be a multi-part process:

1. Download the files for MATLAB and any other products you want to install. Ensure that all the installation files for products to be installed are pre-downloaded before you use a file installation key.
1. Install the MATLAB software on the template VM and activating the software. If the template VM is configured to activate using the license server, the student VMs will do the same.

### Download installation files

You must be a license administrator to get the installation files, license file, and the file installation key. Steps to download the installation files are below:

1. Sign into your MathWorks account at https://www.mathworks.com.
1. Choose **My Account**.
1. Under the **My Software** section of the account page, select the license attached to the Network License Manager setup for the lab.
1. On the license detail page, select **Download Products**.
1. Wait for the installer to self-extract.
1. Start the installer.
1. On the **Sign in to your MathWorks Account** page, enter your MathWorks account details.
1. On the **MathWorks License Agreement** page, accept the terms and select the **Next** button.
1. Select the **Advanced Options** drop-down and choose the **I want to download without installing** option.
1. On the **Select destination folder**, select **Next**.
1. Select **Windows** as the computer platform to install MATLAB.
1. On the **Select product** page, ensure that MATLAB is selected along with any other MathWorks products you want to install.
1. On the **Confirm Selections and Download** page, select **Begin Download**.
1. Wait for the selected products to download, and then select **Finish**.

You can also download an ISO image from the MathWorks website.

1. Sign into your MathWorks account at https://www.mathworks.com.
1. Go to [https://www.mathworks.com/downloads](https://www.mathworks.com/downloads).
1. Select the MATLAB release you want to install.
1. Select the “Get {version}.iso image” link present below the Related links. For example, here the {version} is R2022a.
1. Select the blue **Download Release** link for Windows.

### Run installer

Once the files are downloaded, the second step is to run the installer. Once again, you must be a license administrator to complete this step. Only the license administrators can install MATLAB with a file installation key.

1. Check the downloaded license file and verify that the SERVER line lists the license server correctly. For more information on how to format the license file, see [update network license](https://www.mathworks.com/help/install/ug/network-license-files.html), [license borrowing](https://www.mathworks.com/help/install/license/borrow-licenses.html), and [find host ID](https://www.mathworks.com/matlabcentral/answers/101892-what-is-a-host-id-how-do-i-find-my-host-id-in-order-to-activate-my-license).
1. Launch the MATLAB Installer.
1. On the **Sign in to your MathWorks Account** page, enter your MathWorks account details.
1. On the **MathWorks License Agreement** page, accept the terms and select the **Next** button.
1. Select the **Advanced Options** drop-down and choose **I have a File Installation Key** option.
1. On the **Install using File Installation Key** page, enter the file installation key for the license server, and then select **Next**.
1. On the **Select License File** page, navigate to the license file saved while downloading the installation files earlier.
1. On the **Select Destination Folder** page, select **Next**.
1. On the **Select Products** page, select **Next**.
1. On the **Select Options** page, select **Next**.
1. On the **Confirm Selections and Install** page, select **Begin Install**.
1. On the **Installation Complete** page, verify **Activate MATLAB** is checked, and then select **Finish**.

## Cost estimate

Let's cover a possible cost estimate for this class. This estimate doesn't include the cost of running the license server. The virtual machine size we chose was medium, which is 55 lab units.

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the cost estimate would be:

25 students \* (20 scheduled hours + 10 quota hours) \* 55 lab units \*  0.01 USD per hour  = 412.50 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

---
title: Set up a lab to teach MATLAB with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab to teach MATLAB with Azure Lab Services.
author: emaher
ms.topic: how-to
ms.date: 06/26/2020
ms.author: enewman
---

# Setup a lab to teach MATLAB

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[MATLAB](https://www.mathworks.com/products/matlab.html), which stands for Matrix laboratory, is programming platform from [MathWorks](https://www.mathworks.com/).  It combines computational power and visualization making it popular tool in the fields of math, engineering, physics, and chemistry.

If you're using a [campus-wide license](https://www.mathworks.com/academia/tah-support-program/administrators.html), see directions at [download MATLAB installation files](https://www.mathworks.com/matlabcentral/answers/259632-how-can-i-get-matlab-installation-files-for-use-on-an-offline-machine) to download the MATLAB installer files on the template machine.  

In this article, we'll show how to set up a class that uses MATLAB client software with a license server.

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## License server

Before creating the lab plan, you'll need to set up the server to run the [Network License Manager](https://www.mathworks.com/help/install/administer-network-licenses.html) software.  These instructions are only applicable for institutions that choose the networking licensing option for MATLAB, which allows users to share a pool of license keys.  You'll also need to save the license file and file installation key for later.  For detailed instructions on how to download a license file, see the first step in the [install Network License Manager with internet connection](https://www.mathworks.com/help/install/ug/install-network-license-manager-with-internet-connection.html) article.

Detailed instructions to covering how to install a licensing server are available at [install Network License Manager with Internet Connection](https://www.mathworks.com/help/install/ug/install-network-license-manager-with-internet-connection.html).  To enable borrowing, see the [Borrow License](https://www.mathworks.com/help/install/license/borrow-licenses.html) article.

Assuming the license server is located in an on-premise network or a private network within Azure, you’ll need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) when creating your [lab plan](./tutorial-setup-lab-plan.md).

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md#add-the-virtual-network-at-the-time-of-lab-plan-creation) must be enabled during the creation of your lab plan.  It can not be added later.

## Lab configuration

Once you get have Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./tutorial-setup-lab-plan.md).  If using [Network License Manager](https://www.mathworks.com/help/install/administer-network-licenses.html) on a license server, enable [advanced networking](how-to-connect-vnet-injection.md#add-the-virtual-network-at-the-time-of-lab-plan-creation) when creating your lab plan. You can also use an existing lab plan.

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md).  Use the following settings when creating the lab.

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | Medium |
| VM image | Windows 10 |

MATLAB is supported on more operating systems than Windows 10.  See [MATLAB system requirements](https://www.mathworks.com/support/requirements/matlab-system-requirements.html) for details.

## Template machine configuration

After the template machine is created, start the machine and connect to it to complete the following major tasks.

1. Download the installation files for the MATLAB client software.
2. Install MATLAB using the file installation key.

Installing MATLAB will be a multi-part process.  The first part will download the files for MATLAB and any other products you want installed.  Using a file installation key requires that all the installation files for products to be installed are pre-downloaded.  The second part will be installing the MATLAB software on the template VM and activating the software.  If the template VM is configured to activate using the license server, the student VMs will do the same.

### Download installation files

You must be a license administrator to download the installation files as well as get the license file and file installation key.  Steps to download the installation files are below.

1. Log into your account for [https://www.mathworks.com](https://www.mathworks.com).
2. Choose **My Account**.
3. Under the **My Software** section of the account page, click on the license attached to the Network License Manager setup for the lab.
4. On the license detail page, click **Download Products**.
5. Wait for the installer to self-extract.
6. Start the installer.  
7. On the **Sign in to your MathWorks Account** page, enter your MathWorks account.
8. On the **MathWorks License Agreement** page, accept the term and click the **Next** button.
9. Click the **Advanced Options** drop-down and choose **I want to download without installing**.
10. On the **Select destination folder**, click **Next**.
11. Select **Windows** as the platform of the computer you're going to be installing MATLAB.
12. On the **Select product** page, make sure MATLAB is selected along with any other MathWorks products you would like to install.
13. On the **Confirm Selections and Download** page, click **Begin Download**.  
14. Wait for the selected products to download.  Click **Finish**.

You can also download an ISO image from the MathWorks website.

1. Log into your account for [https://www.mathworks.com](https://www.mathworks.com).
2. Go to [https://www.mathworks.com/downloads](https://www.mathworks.com/downloads).
3. Select the release of MATLAB you wish to install.
4. Click the “Get {version}.iso image” link beneath the Related links where {version} is something like R2020a.
5. Click the blue **download release** link for Windows.

### Run installer

Once the files are downloaded, the second step is to run the installer. Once again, you must be a license administrator to complete this step.  Only license administrators can install MATLAB with a file installation key.

1. Check the downloaded license file and verify the SERVER line lists the license server correctly.  For information regarding how the license file should be formatted, see [update network license](https://www.mathworks.com/help/install/ug/network-license-files.html), [license borrowing](https://www.mathworks.com/help/install/license/borrow-licenses.html), and [find host ID](https://www.mathworks.com/matlabcentral/answers/101892-what-is-a-host-id-how-do-i-find-my-host-id-in-order-to-activate-my-license) articles.
2. Launch the MATLAB Installer.
3. On the **Sign in to your MathWorks Account** page, enter your MathWorks account.
4. On the **MathWorks License Agreement** page, accept the term and click the **Next** button.
5. Click the **Advanced Options** drop-down and choose **I have a File Installation Key**.
6. On the **Install using File Installation Key** page, enter the file installation key for the license server.   Click **Next**.
7. On the **Select License File** page, navigate to the license file saved when downloading the installation files earlier.
8. On the **Select Destination Folder** page, click **Next**.
9. On the **Select Products** page, click **Next**.
10. On the **Select Options** page, click **Next**.
11. On the **Confirm Selections and Install** page, click **Begin Install**.
12. On the **Installation Complete** page, verify **Activate MATLAB** is checked.  Click **Finish**.

## Cost estimate

Let's cover a possible cost estimate for this class.  This estimate does not include the cost of running the license server.  We'll use a class of 25 students.  There are 20 hours of scheduled class time.  Also, each student gets 10 hours quota for homework or assignments outside scheduled class time.  The virtual machine size we chose was medium, which is 55 lab units.

Here is an example of a possible cost estimate for this class:

25 students \* (20 scheduled hours + 10 quota hours) \* 55 lab units \*  0.01 USD per hour  = 412.50 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

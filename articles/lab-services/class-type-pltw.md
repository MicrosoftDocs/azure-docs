---
title: Set up a Project Lead the Way labs with Azure Lab Services | Microsoft Docs
description: Learn how to set up labs to teach Project Lead the Way classes. 
ms.topic: article
ms.date: 10/28/2020
---

# Set up labs for Project Lead the Way classes

[Project Lead the Way (PLTW)](https://www.pltw.org/) is a nonprofit organization that provides PreK-12 curriculum across the United States in computer science, engineering, and biomedical science.  In each PLTW class, students use a variety of software applications as part of their hands-on learning experience.  Many of the software applications require either a fast CPU, or in some cases, a GPU.  This article shows you how to set up labs for teaching the following PLTW classes that are typically offered to students in grades 9-12:

- **Introduction to Engineering Design**

    Students are introduced to the process of engineering design which includes using [Autodesk’s Inventor computer-aided design (CAD)](https://www.autodesk.com/products/inventor/new-features) software for 3D modeling.

- **Principles of Engineering**
    
    Students learn about engineering mechanisms, structural\material strength, and automation.  This class uses software such as [MD Solids](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/MD+Solids/MD+Solids+Software+Installation+Guide.pdf), [West Point Bridge Designer](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/West+Point+Bridge+Builder/Installation+Guide+for+West+Point+Bridge+Designer.pdf), and [America’s Army Simulation](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/America's+Army/Installation+Guide+for+Americas+Army+Simulation+17-18.pdf).

- **Civil Engineering and Architecture**

    Students are taught building and site design and development using [Autodesk’s Revit](https://www.autodesk.com/products/revit/overview) architecture design software for 3D building information modeling (BIM).

- **Computer Integrated Manufacturing**

    Students explore modern manufacturing processes that involves robotics and automation.   In this class, students use [Autodesk’s Inventor CAD](https://www.autodesk.com/products/inventor/new-features) and [Autodesk’s Inventor computer-aided manufacturing (CAM)](https://www.autodesk.com/products/inventor-cam/overview) software. 

- **Digital Electronics**

    Students study electronic logic circuits and devices using [National Instrument’s Multisim](https://www.ni.com/en-us/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim.html) simulation and circuit design software.

- **Engineering Design and Development**

    Students contribute to an end-to-end solution combining research, design, and testing that they present to a panel of engineers.  In this class, students use [Autodesk’s Inventor CAD](https://www.autodesk.com/products/inventor/new-features) software.

- **Computer Science Essentials**

    Students are introduced to computational concepts and tools, starting with block-based programming and then transition to use text-based coding using coding environments such as [VEXcode V5 Blocks](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/VEXcode+V5+Blocks/VexCode+V5+Blocks+Installation+Guide.pdf).

- **Computer Science Principles**
    
    Students grow their programming expertise with [Python](https://www.python.org/) using [Microsoft’s Visual Studio Code development environment](https://code.visualstudio.com/). 

- **Computer Science A**

    Students also grow their programming expertise in this class with [Java](https://www.java.com/) using [Microsoft’s Visual Studio Code development environment](https://code.visualstudio.com/).

Refer to PLTW’s site for the [full list of software](https://www.pltw.org/pltw-software) for each class.

## Lab configuration
To set up labs for PLTW, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see the tutorial on [how to setup a lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account). You can also use an existing lab account.

Once you have a lab account, you should create separate labs for each session of a PLTW class that your school offers.  We also recommend that you create separate images for each type of PLTW class.  For more details on how to structure your labs and images, read the blog post: [Moving from a Physical Lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931).

### Lab account settings
Enable the settings described in the table below for the lab account. For more information about how to enable marketplace images, see the article on [how to specify Marketplace images available to lab creators](https://docs.microsoft.com/azure/lab-services/classroom-labs/specify-marketplace-images).

| Lab account setting | Instructions |
| -------------------- | ----- |
| Marketplace image | Enable the Windows 10 Pro image for use within your lab account. |

### Lab settings
The size of the VM that we recommend using for PLTW classes depends on the types of workloads that your students are doing in the class.  For the above classes, we recommend using Large and Small GPU (Visualization) VM sizes.  Refer to the guidance in the table below when setting up labs for your PLTW classes.

| Lab setting | Value/instructions |
| ------------ | ------------------ |
|Virtual Machine Size| **Small GPU (Visualization)**.  This VM is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX.  We recommend using this for the following PLTW classes: Civil Engineering and Architecture, Digital Electronics, Computer Integrated Manufacturing; and Engineering Design and Development.
|Virtual Machine Size| **Large**.  This size is best suited for applications that need faster CPUs, better local disk performance, large databases, large memory caches.  We recommend using this for the following PLTW classes: Introduction to Engineering Design, Principles of Engineering, Computer Science Essentials, Computer Science Principles, and Computer Science A.

### Licensing server
Most of the software used in the above PLTW classes do not require access to a licensing server; however, Autodesk’s Revit, Inventor, and Inventor CAM software does if you choose to use Autodesk’s network licensing model.

To use network licensing with Autodesk’s software, [PLTW provides detailed steps](https://www.pltw.org/pltw-software) to install Autodesk’s License Manager on your licensing server.  This licensing server is typically located in either your on-premise network or hosted on an Azure virtual machine (VM) within in Azure virtual network (VNet).

After your license server is set up, you'll need to [peer the VNet](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-connect-peer-virtual-network) to your [lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account). The network peering must be done *before* creating the lab so that lab virtual machines can access the license server and the other way around.

Autodesk’s generated license files embed the MAC address of the licensing server.  If you decide to host your licensing server using an Azure VM, it’s important to make sure that your licensing server’s MAC address doesn’t change; otherwise, your licensing files will need to be regenerated.  Follow these tips to prevent your MAC address from changing:

- [Set a static private IP and MAC address](https://docs.microsoft.com/azure/lab-services/how-to-create-a-lab-with-shared-resource#static-private-ip-and-mac-address) for the Azure VM that hosts your licensing server.
- Make sure that you set up both your lab account and licensing server’s VNet in a region\location that has sufficient VM capacity so that you don’t have to move these resources to a new region\location later.

Also, read the article on [how to set up a licensing server as a shared resource](https://docs.microsoft.com/azure/lab-services/how-to-create-a-lab-with-shared-resource) for more information.

### Template machine
Some of the installation files that are needed for PLTW are large and take time to copy when you attempt to download them to a lab’s template machine.

Instead of downloading install files to the template machine and installing everything there, we recommend creating your PLTW images in your physical environment.  Then, you can import the images into Shared Image Gallery so that you can use these custom images to create your labs.  Read the following article for details: [Upload a custom image to Shared Image Gallery](https://docs.microsoft.com/azure/lab-services/upload-custom-image-shared-image-gallery).

Following this recommendation, here are the major tasks for setting up a lab:

1. In your physical environment, create the image for the class.

    a.	Use PLTW’s detailed steps for downloading install files and installing the required software.

    > [!NOTE]    
    > When you install Autodesk’s applications, the computer that you are installing Autodesk on needs to be able to communicate with your licensing server (Autodesk’s install wizard will prompt you to specify the computer name of the machine the license server is hosted on).  If you are hosting your licensing server on an Azure VM, you may need to wait to install Autodesk on the lab’s template machine so that Autodesk’s install wizard can access your licensing server

    b.	[Install and configure OneDrive](https://docs.microsoft.com/azure/lab-services/how-to-prepare-windows-template#install-and-configure-onedrive) (or other back-up options that your school may use).
    
    c.	[Install and configure Windows Updates](https://docs.microsoft.com/azure/lab-services/how-to-prepare-windows-template#install-and-configure-updates).

1.  Upload the custom image to the [Shared Image Gallery that is attached to your lab account](https://docs.microsoft.com/azure/lab-services/how-to-attach-detach-shared-image-gallery).

1.  Create a lab and select the custom image that you uploaded in the previous step.

1.  After the lab is created, start and connect to the template machine to validate the image works as expected.

1.  Finally, publish the template machine to create the students’ VMs.

## Student devices
Your students can connect to their lab VMs from Windows\Mac computers and Chromebooks.  Here are links to instructions for each of these options:

- [Connect from Windows](https://docs.microsoft.com/azure/lab-services/how-to-use-classroom-lab#connect-to-the-vm)
- [Connect from Mac](https://docs.microsoft.com/azure/lab-services/connect-virtual-machine-mac-remote-desktop)
- [Connect from Chromebook](https://docs.microsoft.com/azure/lab-services/connect-virtual-machine-chromebook-remote-desktop)

## Cost
Let’s cover a possible cost estimate for the above PLTW classes.  This estimate doesn’t include the cost of running a licensing server or for using Shared Image Gallery.  We’ll use a class of 25 students.  There are 20 hours of scheduled class time.  Also, each student gets 10 hours quota for homework or assignments outside of scheduled class time.  Refer to the below cost estimates for both the **Large** and **Small GPU (Visualization)** sizes.

- **Large VM**

    25 students x (20 scheduled hours + 10 quota hours) x 70 Lab Unites x 0.01 USD per hour = 525.00 USD

- **Small GPU (Visualization)**

    25 students x (20 scheduled hours + 10 quota hours) x 160 Lab Unites x 0.01 USD per hour = 1200.00 USD

> [!IMPORTANT] 
> The cost estimate is for example purposes only.  For current details on pricing, see Azure Lab Services pricing.    

> [!NOTE] 
> Many of the PLTW classes use applications that are accessed via a browser, such as MIT App Inventor.  These browser-based applications don’t require a fast CPU or GPU and can be accessed from any device that has an internet connection.  When students are using these types of applications, we recommend they use the browser on their physical device instead of using the browser on their lab VMs.  This will help to keep costs down by only using the lab VMs for applications that do require a fast CPU or GPU.

## Next steps
Next steps are common to setting up any lab:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab) 
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users). 
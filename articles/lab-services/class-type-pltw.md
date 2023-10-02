---
title: Set up Project Lead The Way labs with Azure Lab Services
description: Learn how to set up labs to teach Project Lead The Way classes. 
ms.topic: how-to
ms.date: 03/02/2022
ms.custom: devdivchpfy22
---

# Set up labs for Project Lead The Way classes

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[Project Lead The Way (PLTW)](https://www.pltw.org/) is a nonprofit organization that provides PreK&ndash;12 curriculum across the United States in computer science, engineering, and biomedical science. In each PLTW class, students use various software applications as part of their hands-on learning experience. Many of the software applications require either a fast CPU or, in some cases, a GPU. This article shows you how to set up labs for the following PLTW classes. The classes are typically offered to students in grades 9&ndash;12:

- **Introduction to Engineering Design**

    Students are introduced to the process of engineering design, which includes using [Autodesk Inventor computer-aided design (CAD)](https://www.autodesk.com/products/inventor/new-features) software for 3D modeling.

- **Principles of Engineering**

    Students learn about engineering mechanisms, structural and material strength, and automation. This class uses software such as [MD Solids](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/MD+Solids/MD+Solids+Software+Installation+Guide.pdf), [West Point Bridge Designer](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/West+Point+Bridge+Builder/Installation+Guide+for+West+Point+Bridge+Designer.pdf), and [America’s Army simulation](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/America's+Army/Installation+Guide+for+Americas+Army+Simulation+17-18.pdf).

- **Civil Engineering and Architecture**

    Students learn building and site design and development by using [Autodesk Revit](https://www.autodesk.com/products/revit/overview) architecture design software for 3D building information modeling (BIM).

- **Computer Integrated Manufacturing**

    Students explore modern manufacturing processes that involve robotics and automation. In this class, students use [Autodesk Inventor CAD](https://www.autodesk.com/products/inventor/new-features) and [Autodesk Inventor computer-aided manufacturing (CAM)](https://www.autodesk.com/products/inventor-cam/overview) software.

- **Digital Electronics**

    Students study electronic logic circuits and devices by using [National Instrument Multisim](https://www.ni.com/en-us/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim.html) simulation and circuit design software.

- **Engineering Design and Development**

    Students contribute to an end-to-end solution by combining research, design, and testing that they present to a panel of engineers. In this class, students use [Autodesk Inventor CAD](https://www.autodesk.com/products/inventor/new-features) software.

- **Computer Science Essentials**

    Students are introduced to computational concepts and tools. They start with block-based programming and then move to text-based coding by using coding environments such as [VEXcode V5 blocks](https://s3.amazonaws.com/support-downloads.pltw.org/2020-21/VEXcode+V5+Blocks/VexCode+V5+Blocks+Installation+Guide.pdf).

- **Computer Science Principles**

    Students grow their programming expertise with [Python](https://www.python.org/) by using the [Microsoft Visual Studio Code development environment](https://code.visualstudio.com/).

- **Computer Science A**

    Students expand their programming competence in this class by learning mobile app development. In this class, they learn [Java](https://www.java.com/) by using the [Microsoft Visual Studio Code development environment](https://code.visualstudio.com/). Students also use an emulator that allows them to run and test their mobile app code. For information about how to set up an emulator in Azure Lab Services, contact us via the [Azure Lab Services' forums](https://techcommunity.microsoft.com/t5/azure-lab-services/bd-p/AzureLabServices) for more information.

For a full list of class software, go to the [PLTW site](https://www.pltw.org/pltw-software) for each class.

To begin setting up labs for PLTW, you need access to an Azure subscription and a lab plan. Discuss with your organization's admin to see if you can get access to an existing Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## License server

Most of the software that's used in the earlier-mentioned PLTW classes *don't* require access to a license server. However, you'll need to access a license server if you plan to use the Autodesk network licensing model for the following software:

- Revit
- Inventor CAD
- Inventor CAM

To use network licensing with Autodesk software, [PLTW provides detailed steps](https://www.pltw.org/pltw-software) to install Autodesk Network License Manager on your license server. This license server is ordinarily located in either your on-premises network or hosted on an Azure virtual machine (VM) within Azure virtual network.

After your license server is set up, you need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) when creating your [lab plan](./quick-create-resources.md).

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md) must be enabled during the creation of your lab plan. It can't be added later.

Autodesk-generated license files embed the MAC address of the license server. If you decide to host your license server by using an Azure VM, it’s important to ensure that your license server’s MAC address doesn’t change. If the MAC address changes, you'll need to regenerate your licensing files. Following are the steps to prevent your MAC address from changing:

- [Set a static private IP and MAC address](how-to-create-a-lab-with-shared-resource.md#tips) for the Azure VM that hosts your license server.
- Ensure to set up both your lab plan and the license server’s virtual network are in a region or location that has sufficient VM capacity so that you don’t have to move these resources to a new region or location later.

For more information, see [Set up a license server as a shared resource](./how-to-create-a-lab-with-shared-resource.md).

## Lab configuration

Once you have Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md).

After you set up a lab plan, create a separate lab for each PLTW class session that your school offers. We also recommend that you create separate images for each type of PLTW class. For more information about how to structure your labs and images, see [Moving from a Physical Lab to Azure Lab Services](./concept-migrating-physical-labs.md).

### Lab plan settings

Enable your lab plan settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab account setting | Instructions |
| -------------------- | ----- |
| Marketplace image | Enable the Windows 10 Pro image for use within your lab account. |

### Lab settings

The recommended size of the virtual machine (VM) for using PLTW classes depends on the types of workloads that your students are doing in the class. For the earlier-listed classes, we recommend using Small GPU (Visualization) and Large VM sizes. As you set up labs for your PLTW classes, refer to the guidance in the following table:

| Lab setting | Value and description | Class recommendation |
| ------------ | ------------------ | --- |
| Virtual Machine Size | **Small GPU (Visualization)**.  Best suited for remote visualization, streaming, gaming, and encoding with frameworks such as OpenGL and DirectX. | We recommend using this size for the following PLTW classes: Civil Engineering and Architecture, Digital Electronics, Computer Integrated Manufacturing, Engineering Design and Development, and Introduction to Engineering Design.
| Virtual Machine Size | **Large**. Best suited for applications that need faster CPUs, better local disk performance, large databases, and large memory caches. | We recommend using this size for the following PLTW classes: Principles of Engineering, Computer Science Essentials, Computer Science Principles, and Computer Science A. |

### Template machine configuration

Some of the installation files that you need for PLTW are large. When you download the files to a lab template VM, they might take a long time to copy.

Instead of downloading installation files to the template machine and installing everything there, we recommend creating your PLTW images in your physical environment. You can then import the custom images into a compute gallery so that you can use them to create your labs.  For more information, see [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

As you follow this recommendation, note the major tasks for setting up a lab:

1. In your physical environment, create the image for the class.

    a. Use PLTW’s detailed steps for downloading the installation files and installing the required software.

    > [!NOTE]
    > When you install the Autodesk applications, the computer that you're installing them on needs to be able to communicate with your license server. The Autodesk installation wizard will prompt you to specify the computer name of the machine that the license server is hosted on. If you're hosting your license server on an Azure VM, you might need to wait to install Autodesk on the lab template VM so that the installation wizard can access your license server.

    b. [Install and configure OneDrive](./how-to-prepare-windows-template.md#install-and-configure-onedrive) or other backup options that your school might use.

    c. [Install and configure Windows updates](./how-to-prepare-windows-template.md#install-and-configure-windows-updates).

1. Upload the custom image to the [compute gallery that's attached to your lab account](./how-to-attach-detach-shared-image-gallery.md).
1. Create a lab, and then select the custom image that you uploaded in the preceding step.
1. After the lab is created, start and connect to the template VM to validate that the image works as expected.
1. Finally, publish the template VM to create the students’ VMs.

> [!NOTE]
> If your school needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you'll need to use 3rd party software. For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Student devices

Students can connect to their lab VMs from Windows computers, Mac, and Chromebook. For instructions, see:

- [Connect from Windows](./how-to-use-lab.md#connect-to-the-vm)
- [Connect from Mac](./connect-virtual-machine-mac-remote-desktop.md)
- [Connect from Chromebook](./connect-virtual-machine-chromebook-remote-desktop.md)

## Cost

Let’s cover an example cost estimate for the PLTW classes. This estimate doesn’t include the cost of running a license server or using a compute gallery.

Suppose you have a class of 25 students, each of whom has 20 hours of scheduled class time. Each student also has an extra 10 quota hours for homework or assignments outside of scheduled class time. Here are the estimated costs:

- **Large VM**

    25 students &times; (20 scheduled hours + 10 quota hours) &times; 70 Lab Units &times; USD0.01 per hour = USD525.00

- **Small GPU (visualization)**

    25 students &times; (20 scheduled hours + 10 quota hours) &times; 160 Lab Units &times; USD0.01 per hour = USD1200.00

> [!IMPORTANT]
> The cost estimate is for example purposes only. For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

> [!NOTE]
> Many of the PLTW classes use applications that are accessed via a browser, such as MIT App Inventor. These browser-based applications don’t require a fast CPU or GPU, and you can access them from any device that has an internet connection. When students are using these types of applications, we recommend that they use the browser on their physical device instead the browser on their lab VM. Students can help keep costs down by using their lab VM only for applications that require a fast CPU or GPU.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

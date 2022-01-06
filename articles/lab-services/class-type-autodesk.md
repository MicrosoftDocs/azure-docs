---
title: Set up a lab with Autodesk using Azure Lab Services
description: Learn how to set up labs to teach engineering classes with Autodesk. 
author: nicolela
ms.topic: how-to
ms.date: 04/21/2021
ms.author: nicolela
---

# Set up labs for Autodesk

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article describes how to set up Autodesk Inventor and Autodesk Revit software for engineering classes:

- [Inventor computer-aided design (CAD)](https://www.autodesk.com/products/inventor/new-features) and [computer-aided manufacturing (CAM)](https://www.autodesk.com/products/inventor-cam/overview) provide 3D modeling and are used in engineering design.
- [Revit](https://www.autodesk.com/products/revit/overview) is used in architecture design for 3D building information modeling (BIM).

Autodesk is commonly used in both universities and K-12 schools.  For example, in K-12, AutoDesk is included in the [Project Lead the Way (PLTW)](./class-type-pltw.md) curriculum.

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## License server

You will need to access a license server if you plan to use the Autodesk network licensing model.  Read Autodesk's article on [Network License Administration](https://knowledge.autodesk.com/customer-service/network-license-administration/network-deployment/preparing-for-deployment/determining-installation-type) for more information.

To use network licensing with Autodesk software, [AutoDesk provides detailed steps](https://knowledge.autodesk.com/customer-service/network-license-administration/install-and-configure-network-license) to install Autodesk Network License Manager on your license server.  This license server is ordinarily located in either your on-premises network or hosted on an Azure virtual machine (VM) within in Azure virtual network.

After your license server is set up, you'll need to enable [advanced networking](how-to-connect-vnet-injection.md#add-the-virtual-network-at-the-time-of-lab-plan-creation) when creating your lab plan. You need to do the network peering *before* you create the lab so that your lab VMs can access the license server and vice versa.

Autodesk-generated license files embed the MAC address of the license server.  If you decide to host your license server by using an Azure VM, it’s important to make sure that your license server’s MAC address doesn’t change. If the MAC address changes, you'll need to regenerate your licensing files. To prevent your MAC address from changing, do the following:

- [Set a static private IP and MAC address](./how-to-create-a-lab-with-shared-resource.md#static-private-ip-and-mac-address) for the Azure VM that hosts your license server.
- Be sure to set up both your lab plan and the license server’s virtual network in a region or location that has sufficient VM capacity so that you don’t have to move these resources to a new region or location later.

For more information, see [Set up a license server as a shared resource](./how-to-create-a-lab-with-shared-resource.md).

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md#add-the-virtual-network-at-the-time-of-lab-plan-creation) must be enabled during the creation of your lab plan.  It can not be added later.

## Lab configuration

Once you get have Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./tutorial-setup-lab-plan.md).  If using a license server, enable [advanced networking](how-to-connect-vnet-injection.md#add-the-virtual-network-at-the-time-of-lab-plan-creation) when creating your lab plan. You can also use an existing lab plan.

### Lab plan settings

Enable your lab plan settings as described in the following table.  For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the Windows 10 Pro or Windows 10 Pro N image, if not done already.|

### Lab settings

The size of the virtual machine (VM) that we recommend depends on the types of workloads that your students need to do.  We recommend using the Small GPU (Visualization) size.

| Lab setting | Value and description |
| ------------ | ------------------ |
| Virtual Machine Size | **Small GPU (Visualization)**. Best suited for remote visualization, streaming, gaming, and encoding with frameworks such as OpenGL and DirectX. |

> [!WARNING]
> The **Small GPU (Visualization)** virtual machine size is configured to enable a high-performing graphics experience and meets [Adobe’s system requirements for each application](https://helpx.adobe.com/creative-cloud/system-requirements.html).  Make sure to choose Small GPU (Visualization) not Small GPU (Compute).  For more information about this virtual machine size, see the article on [how to set up a lab with GPUs](./how-to-setup-lab-gpu.md).

## Template machine configuration

The steps in this section show how to set up the template VM:

1. Start the template VM and connect to the machine.

1. Download and install Inventor and Revit using [instructions from AutoDesk](https://knowledge.autodesk.com/customer-service/download-install/install-software).  When prompted, specify the computer name of your license server.

1. Finally, publish the template VM to create the students’ VMs.

## Cost

Let’s cover an example cost estimate for this class.  This estimate doesn’t include the cost of running a license server. Suppose you have a class of 25 students, each of whom has 20 hours of scheduled class time.  Each student also has an additional 10 quota hours for homework or assignments outside of scheduled class time.  The virtual machine size we chose was **Small GPU (Visualization)**, which is 160 lab units.

- 25 students &times; (20 scheduled hours + 10 quota hours) &times; 160 Lab Units &times; USD0.01 per hour = USD1200.00

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

The template image can now be published to the lab. See [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) for further instructions.

As you set up your lab, see the following articles:

- [Add users](tutorial-setup-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)

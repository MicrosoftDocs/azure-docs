---
title: Set up a lab with Autodesk
titleSuffix: Azure Lab Services
description: Learn how to set up a lab in Azure Lab Services to teach engineering classes with Autodesk.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/03/2023
---

# Set up a lab to teach engineering classes with Autodesk

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article describes how to set up Autodesk Inventor and Autodesk Revit software for engineering classes in Azure Lab Services.

- [Inventor computer-aided design (CAD)](https://www.autodesk.com/products/inventor/new-features) and [computer-aided manufacturing (CAM)](https://www.autodesk.com/products/inventor-cam/overview) provide 3D modeling and are used in engineering design.
- [Revit](https://www.autodesk.com/products/revit/overview) is used in architecture design for 3D building information modeling (BIM).

Autodesk is commonly used in both universities and K-12 schools.  For example, in K-12, AutoDesk is included in the [Project Lead the Way (PLTW)](./class-type-pltw.md) curriculum.

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

## License server

You need to access a license server if you plan to use the Autodesk network licensing model.  Read Autodesk's article on [Network License Administration](https://knowledge.autodesk.com/customer-service/network-license-administration/network-deployment/preparing-for-deployment/determining-installation-type) for more information.

To use network licensing with Autodesk software, [AutoDesk provides detailed steps](https://knowledge.autodesk.com/customer-service/network-license-administration/install-and-configure-network-license) to install Autodesk Network License Manager on your license server.  You can host the license server in your on-premises network, or on an Azure virtual machine (VM) within in an Azure virtual network.

After setting up your license server, you need to enable [advanced networking](how-to-connect-vnet-injection.md) when you create the lab plan.

Autodesk-generated license files embed the MAC address of the license server.  If you decide to host your license server by using an Azure VM, it’s important to make sure that your license server’s MAC address doesn’t change. If the MAC address changes, you need to regenerate your licensing files. To prevent your MAC address from changing:

- [Set a static private IP and MAC address](how-to-create-a-lab-with-shared-resource.md#tips) for the Azure VM that hosts your license server.
- Create both your lab plan and the license server’s virtual network in the same region. Also, verify that the region has sufficient VM capacity to avoid that you have to move these resources to another region later.

For more information, see [Set up a license server as a shared resource](./how-to-create-a-lab-with-shared-resource.md).

> [!IMPORTANT]
> You must enable [advanced networking](how-to-connect-vnet-injection.md) when creating your lab plan. You can't enable advanced networking for an existing lab plan.

## Lab configuration

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

### Lab plan settings

This lab uses a Windows 10 Pro Azure Marketplace images as the base VM image. You first need to enable this image in your lab plan. This lets lab creators then select the image as a base image for their lab.

Follow these steps to [enable these Azure Marketplace images available to lab creators](specify-marketplace-images.md). Select one of the **Windows 10** Azure Marketplace images.

### Lab settings

1. Create a lab for your lab plan:

    [!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Use the following settings when creating the lab.

    | Lab setting | Value and description |
    | ------------ | ------------------ |
    | Virtual Machine Size | **Small GPU (Visualization)**. Best suited for remote visualization, streaming, gaming, and encoding with frameworks such as OpenGL and DirectX. |
    | Virtual Machine Image | Windows 10 Pro |

1. When you create a lab with the **Small GPU (Visualization)** size, follow these steps to [set up a lab with GPUs](./how-to-setup-lab-gpu.md).

    The **Small GPU (Visualization)** virtual machine size is configured to enable a high-performing graphics experience and meets [Adobe’s system requirements for each application](https://helpx.adobe.com/creative-cloud/system-requirements.html).  Make sure to choose Small GPU (Visualization) not Small GPU (Compute).

## Template machine configuration

[!INCLUDE [configure template vm](./includes/lab-services-class-type-template-vm.md)]

1. Start the template VM and connect using RDP.

1. Download and install Inventor and Revit using [instructions from AutoDesk](https://knowledge.autodesk.com/customer-service/download-install/install-software).

    When prompted, specify the computer name of your license server.

1. Once the template VM is set up, [publish the template VM](how-to-create-manage-template.md). All lab VMs use this template as their base image.

## Cost

This section provides a cost estimate for running this class for 25 users. There are 20 hours of scheduled class time. Also, each user gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Small GPU (Visualization)**, which is 160 lab units. This estimate doesn’t include the cost of running a license server.

- 25 lab users &times; (20 scheduled hours + 10 quota hours) &times; 160 lab units

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

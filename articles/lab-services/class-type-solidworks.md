---
title: Set up a SOLIDWORKS lab for engineering
titleSuffix: Azure Lab Services
description: Learn how to set up a lab in Azure Lab Services to teach engineering courses using SOLIDWORKS.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/07/2023
---

# Set up a lab to teach engineering classes using SOLIDWORKS

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article describes how to set up SOLIDWORKS 2019 and Network Licensing for engineering classes in Azure Lab Services.

[SOLIDWORKS](https://www.solidworks.com/) provides a 3D computer-aided design (CAD) environment for modeling solid objects and is used in different kinds of engineering fields.  With SOLIDWORKS, engineers can easily create, visualize, simulate, and document their designs.

A licensing option commonly used by universities is SOLIDWORKS’ Network Licensing.   With this option, users share a pool of licenses that are managed by a licensing server.  This type of license is sometimes called a “floating” license because you only need to have enough licenses for the number of concurrent users.  When a user is done using SOLIDWORKS, their license goes back into the centrally managed license pool so that it can be reused by another user.

## License server

SOLIDWORKS Network Licensing requires that you have installed and activated SolidNetWork License Manager on your license server.  You typically host this license server in either your on-premises network or in a private network in Azure. 

1. Set up SolidNetWork License Manager on your server, by following the steps in [Installing and Activating a License Manager](https://help.solidworks.com/2019/English/Installation/install_guide/t_installing_snl_lic_mgr.htm) in the SOLIDWORKS install guide.

    During the installation, make sure to note the **port number** and [**serial number**](https://help.solidworks.com/2019/english/installation/install_guide/r_hid_state_serial_number.htm) of the license server, as you use this information in later steps.

1. After you set up the license server, follow these steps to [connect your lab plan to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md).

    > [!IMPORTANT]
    > You need to enable [advanced networking](how-to-connect-vnet-injection.md) during the creation of your lab plan. You can't configure the lab plan's virtual network at a later stage.

1. Verify that the appropriate ports are opened on your firewalls to allow communication between the lab virtual machines and the license server.

    See the instructions on [Modifying License Manager Computer Ports for Windows Firewall](http://help.solidworks.com/2019/english/installation/install_guide/t_mod_ports_on_lic_mgr_for_firewall.htm) that show how to add inbound and outbound rules to the license server's firewall.  You may also need to open up ports to the lab virtual machines.  Follow more information on firewall settings and finding the lab's public IP, see [firewall settings for labs](./how-to-configure-firewall-settings.md).

## Lab configuration

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

### Lab plan settings

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

This lab uses a Windows 10 Pro Azure Marketplace images as the base VM image. You first need to enable this image in your lab plan. This lets lab creators then select the image as a base image for their lab.

Follow these steps to [enable these Azure Marketplace images available to lab creators](specify-marketplace-images.md). Select one of the **Windows 10** Azure Marketplace images.

SOLIDWORKS supports other versions of Windows besides Windows 10.  See [SOLIDWORKS system requirements](https://www.solidworks.com/sw/support/SystemRequirements.html) for details.

### Lab settings

1. Create a lab for your lab plan:

    [!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Use the following settings when creating the lab.

    | Lab setting | Value and description |
    | ------------ | ------------------ |
    | Virtual Machine Size | **Small GPU (Visualization)**. Best suited for remote visualization, streaming, gaming, and encoding with frameworks such as OpenGL and DirectX. |
    | Virtual Machine Image | **Windows 10 Pro** |

1. When you create a lab with the **Small GPU (Visualization)** size, follow these steps to [set up a lab with GPUs](./how-to-setup-lab-gpu.md).

    The **Small GPU (Visualization)** virtual machine size is configured to enable a high-performing graphics experience.

## Template configuration

The steps in this section show how to set up your template virtual machine by downloading the SOLIDWORKS installation files and installing the client software:

1. Start the template virtual machine and connect to the machine using RDP.

1. Download the installation files for SOLIDWORKS client software. You have two options for downloading:

   - Download from [SOLIDWORKS customer portal](https://login.solidworks.com/nidp/idff/sso?id=cpenglish&sid=1&option=credential&sid=1&target=https%3A%2F%2Fcustomerportal.solidworks.com%2F).
   - Download from a directory on a server.  If you used this option, you need to ensure that the server is accessible from the template virtual machine.  For example, this server may be located in the same virtual network that is peered with your lab account.

    For details, see [Installation on Individual Computers in the SOLIDWORKS](http://help.solidworks.com/2019/english/Installation/install_guide/c_installing_on_individual_computers.htm?id=fc149e8a968a422a89e2a943265758d3#Pg0) in SOLIDWORKS install guide.

1. Once the installation files are downloaded, install the client software using SOLIDWORKS Installation Manager.

    See details on [Installing a License Client](http://help.solidworks.com/2019/english/installation/install_guide/t_installing_snl_license_client.htm) in SOLIDWORKS install guide.

    > [!NOTE]
    > In the **Add Server** dialog box, you need to enter the **port number** and name or IP address of your license server.

## Cost

This section provides a cost estimate for running this class for 25 lab users. There are 20 hours of scheduled class time. Also, each user gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Small GPU (Visualization)**, which is 160 lab units. This estimate doesn’t include the cost of running a license server.

- 25 lab users &times; (20 scheduled hours + 10 quota hours) &times; 160 lab units

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

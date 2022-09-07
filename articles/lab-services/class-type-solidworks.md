---
title: Set up a SOLIDWORKS lab for engineering with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab for engineering courses using SOLIDWORKS.
author: nicolela
ms.topic: how-to
ms.date: 01/05/2022
ms.author: nicolela
---

# Set up a lab for engineering classes using SOLIDWORKS

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[SOLIDWORKS](https://www.solidworks.com/) provides a 3D computer-aided design (CAD) environment for modeling solid objects and is used in different kinds of engineering fields.  With SOLIDWORKS, engineers can easily create, visualize, simulate, and document their designs.

A licensing option commonly used by universities is SOLIDWORKS’ Network Licensing.   With this option, users share a pool of licenses that are managed by a licensing server.  This type of license is sometimes called a “floating” license because you only need to have enough licenses for the number of concurrent users.  When a user is done using SOLIDWORKS, their license goes back into the centrally managed license pool so that it can be reused by another user.

In this article, we’ll show how to set up a class that uses SOLIDWORKS 2019 and Network Licensing.

## License server

SOLIDWORKS Network Licensing requires that you have SolidNetWork License Manager installed and activated on your license server.  This license server is typically located in either your on-premises network or a private network within Azure.  For more information on how to set up SolidNetWork License Manager on your server, see [Installing and Activating a License Manager](https://help.solidworks.com/2019/English/Installation/install_guide/t_installing_snl_lic_mgr.htm) in the SOLIDWORKS install guide.  Remember the **port number** and [**serial number**](https://help.solidworks.com/2019/english/installation/install_guide/r_hid_state_serial_number.htm) that are used since they'll be needed in later steps.

After your license server is set up, you’ll need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) in your [lab plan](./tutorial-setup-lab-plan.md)

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md#connect-the-virtual-network-during-lab-plan-creation) must be enabled during the creation of your lab plan.  It can't be added later.

> [!NOTE]
> You should verify that the appropriate ports are opened on your firewalls to allow communication between the lab virtual machines and the license server.

See the instructions on [Modifying License Manager Computer Ports for Windows Firewall](http://help.solidworks.com/2019/english/installation/install_guide/t_mod_ports_on_lic_mgr_for_firewall.htm) that show how to add inbound and outbound rules to the license server's firewall.  You may also need to open up ports to the lab virtual machines.  Follow more information on firewall settings and finding the lab's public IP, see [firewall settings for labs](./how-to-configure-firewall-settings.md).

## Lab configuration

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

### Lab plan settings

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

Enable your lab plan settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the **Windows 10 Pro** image.|

SOLIDWORKS supports other versions of Windows besides Windows 10.  See [SOLIDWORKS system requirements](https://www.solidworks.com/sw/support/SystemRequirements.html) for details.

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md).  Use the following settings when creating the lab.

| Lab settings | Value/instructions |
| ------------ | ------------------ |
| Virtual Machine Size | **Small GPU (Visualization)**.  This VM is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX.|
| Virtual Machine Image | Windows 10 Pro |

> [!NOTE]
> The **Small GPU (Visualization)** virtual machine size is configured to enable a high-performing graphics experience.  For more information about this virtual machine size, see the article on [how to set up a lab with GPUs](./how-to-setup-lab-gpu.md).

## Template configuration

The steps in this section show how to set up your template virtual machine by downloading the SOLIDWORKS installation files and installing the client software:

1. Start the template virtual machine and connect to the machine using RDP.

1. Download the installation files for SOLIDWORKS client software. You have two options for downloading:
   - Download from [SOLIDWORKS customer portal](https://login.solidworks.com/nidp/idff/sso?id=cpenglish&sid=1&option=credential&sid=1&target=https%3A%2F%2Fcustomerportal.solidworks.com%2F).
   - Download from a directory on a server.  If you used this option, you need to ensure that the server is accessible from the template virtual machine.  For example, this server may be located in the same virtual network that is peered with your lab account.

    For details, see [Installation on Individual Computers in the SOLIDWORKS](http://help.solidworks.com/2019/english/Installation/install_guide/c_installing_on_individual_computers.htm?id=fc149e8a968a422a89e2a943265758d3#Pg0) in SOLIDWORKS install guide.

1. Once the installation files are downloaded, install the client software using SOLIDWORKS Installation Manager. See details on [Installing a License Client](http://help.solidworks.com/2019/english/installation/install_guide/t_installing_snl_license_client.htm) in SOLIDWORKS install guide.

    > [!NOTE]
    > In the **Add Server** dialog box, you will be prompted for the **port number** used for your license server and the name or IP address of the license server.

## Cost

Let's cover a possible cost estimate for this class. This estimate doesn't include the cost of running the license server. We'll use a class of 25 students. There are 20 hours of scheduled class time. Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Small GPU (Visualization)**, which is 160 lab units.

25 students \* (20 scheduled hours + 10 quota hours) \* 160 Lab Units * 0.01 USD per hour = 1200.00 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

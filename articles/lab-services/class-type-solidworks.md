---
title: Set up a SolidWorks lab for engineering with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab for engineering courses using SolidWorks. 
author: nicolela
ms.topic: article
ms.date: 06/26/2020
ms.author: nicolela
---

# Set up a lab for engineering classes using SolidWorks

[SolidWorks](https://www.solidworks.com/) provides a 3D computer-aided design (CAD) environment for modeling solid objects and is used in a variety of engineering fields.  With SolidWorks, engineers can easily create, visualize, simulate and document their designs.

A licensing option commonly used by universities is SolidWorks’ Network Licensing.   With this option, users share a pool of licenses that are managed by a licensing server.  This type of license is sometimes called a “floating” license because you only need to have enough licenses for the number of concurrent users.  When a user is done using SolidWorks, their license goes back into the centrally managed license pool so that it can be reused by another user.

In this article, we’ll show how to set up a class that uses SolidWorks 2019 and Network Licensing.

## License server

SolidWorks Network Licensing requires that you have SolidNetWork License Manager installed and activated on your license server.  This license server is typically located in either your on-premise network or a private network within Azure.  For more information on how to set up SolidNetWork License Manager on your server, see [Installing and Activating a License Manager](https://help.solidworks.com/2019/English/Installation/install_guide/t_installing_snl_lic_mgr.htm) in the SolidWorks install guide.  When setting this up, remember the **port number** and [**serial number**](https://help.solidworks.com/2019/english/installation/install_guide/r_hid_state_serial_number.htm) that are used since they will be needed in later steps.

After your license server is set up, you will need to peer the [virtual network (VNet)](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-connect-peer-virtual-network) to your [lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account).  The network peering must be done before creating the lab so that lab virtual machines can access the license server and vice versa.

> [!NOTE]
> You should verify that the appropriate ports are opened on your firewalls to allow communication between the lab virtual machines and the license server.  For example, see the instructions on [Modifying License Manager Computer Ports for Windows Firewall](http://help.solidworks.com/2019/english/installation/install_guide/t_mod_ports_on_lic_mgr_for_firewall.htm) that show how to add inbound and outbound rules to the license server's firewall.  You may also need to open up ports to the lab virtual machines.  Follow the steps in the article on [firewall settings for labs](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-firewall-settings) for more information on this, including how to get the lab's public IP address.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see the tutorial on [how to setup a lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account). You can also use an existing lab account.

### Lab account settings

Enable the settings described in the table below for the lab account. For more information about how to enable marketplace images, see the article on [how to specify Marketplace images available to lab creators](https://docs.microsoft.com/azure/lab-services/classroom-labs/specify-marketplace-images).

| Lab account setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the Windows 10 Pro image for use within your lab account.|

> [!NOTE]
> In addition to Windows 10, SolidWorks supports other versions of Windows.  See [SolidWorks system requirements](https://www.solidworks.com/sw/support/SystemRequirements.html) for details.

### Lab settings

Use the settings in the table below when setting up a classroom lab. For more information on how to create a classroom lab, see set up a classroom lab tutorial.

| Lab settings | Value/instructions |
| ------------ | ------------------ |
|Virtual Machine Size| **Small GPU (Visualization)**.  This VM is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX.|  
|Virtual Machine Image| Windows 10 Pro|

> [!NOTE]
> The **Small GPU (Visualization)** virtual machine size is configured to enable a high-performing graphics experience.  For more information about this virtual machine size, see the article on [how to set up a lab with GPUs](./how-to-setup-lab-gpu.md).

> [!WARNING]
> Don’t forget to [peer the virtual network](https://www.mathworks.com/support/requirements/matlab-system-requirements.html) for the lab account to the virtual network for the license server **before** creating the lab.

## Template virtual machine configuration

The steps in this section show how to set up your template virtual machine by downloading the SolidWorks installation files and installing the client software:

1. Start the template virtual machine and connect to the machine using RDP.

1. Download the installation files for SolidWorks client software. You have two options for downloading:
   - Download from [SolidWorks customer portal](https://login.solidworks.com/nidp/idff/sso?id=cpenglish&sid=1&option=credential&sid=1&target=https%3A%2F%2Fcustomerportal.solidworks.com%2F).
   - Download from a directory on a server.  If you used this option, you need to ensure that the server is accessible from the template virtual machine.  For example, this server may be located in the same virtual network that is peered with your lab account.
  
    For details, see [Installation on Individual Computers in the SolidWorks](http://help.solidworks.com/2019/english/Installation/install_guide/c_installing_on_individual_computers.htm?id=fc149e8a968a422a89e2a943265758d3#Pg0) in SolidWorks install guide.

1. Once the installation files are downloaded, install the client software using SolidWorks Installation Manager. See details on [Installing a License Client](http://help.solidworks.com/2019/english/installation/install_guide/t_installing_snl_license_client.htm) in SolidWorks install guide.

    > [!NOTE]
    > In the **Add Server** dialog box, you will be prompted for the **port number** used for your license server and the name or IP address of the license server.

## Cost

Let's cover a possible cost estimate for this class. This estimate does not include the cost of running the license server. We'll use a class of 25 students. There are 20 hours of scheduled class time. Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Small GPU (Visualization)**, which is 160 lab units.

25 students \* (20 scheduled hours + 10 quota hours) \* 160 Lab Units * 0.01 USD per hour = 1200.00 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Next steps

Next steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)

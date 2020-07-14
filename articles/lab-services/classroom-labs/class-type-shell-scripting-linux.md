---
title: Set up a Linux shell scripting lab with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab to teach shell scripting on Linux. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/30/2019
ms.author: spelluru

---

# Set up a lab to teach shell scripting on Linux
This article shows you how to set up a lab to teach shell scripting on Linux. Scripting is a useful part of system administration that allows administrators to avoid repetitive tasks. In this sample scenario, the class covers traditional bash scripts and enhanced scripts. Enhanced scripts are scripts that combine bash commands and Ruby. This approach allows Ruby to pass data around and bash commands to interact with the shell. 

Students taking these scripting classes get a Linux virtual machine to learn the basics of Linux, and also get familiar with the bash shell scripting. The Linux virtual machine comes with remote desktop access enabled and with [gedit](https://help.gnome.org/users/gedit/stable/) and [Visual Studio Code](https://code.visualstudio.com/) text editors installed.

## Lab configuration
To set up this lab, you need an Azure subscription to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you have an Azure subscription, you can either create a new lab account in Azure Lab Services or use an existing lab account. See the following tutorial for creating a new lab account: [Tutorial to Setup a Lab Account](tutorial-setup-lab-account.md).

After you create the lab account, enable following settings in the lab account: 

| Lab account setting | Instructions |
| ----------- | ------------ |  
| Marketplace images | Enable the Ubuntu Server 18.04 LTS image for use within your lab account. For more information, see [Specify Marketplace images available to lab creators](specify-marketplace-images.md). | 

Follow [this tutorial](tutorial-setup-classroom-lab.md) to create a new lab and apply the following settings:

| Lab settings | Value/instructions | 
| ------------ | ------------------ |
| Virtual machine (VM) size | Small  |
| VM image | Ubuntu Server 18.04 LTS|
| Enable remote desktop connection | Enable. <p>Enabling this setting will allow teachers and students to connect to their VMs using the remote desktop (RDP). For more information, see [Enable remote desktop for Linux virtual machines in a lab in Azure Lab Services](how-to-enable-remote-desktop-linux.md). </p>|

## Install desktop and RDP
The Ubuntu Server 18.04 LTS image doesn't have the RDP remote desktop server installed by default. Follow instructions in the [Install and configure Remote Desktop to connect to a Linux VM in Azure](../../virtual-machines/linux/use-remote-desktop.md) article to install the packages that are needed on the template machine to connect via remote desktop protocol (RDP).

## Install Ruby
Ruby is an open-source dynamic language that can be combined with bash scripts. This section shows how to use `apt-get` to install the latest version of [Ruby](https://www.ruby-lang.org/).

1. Install updates by running the following commands:

    ```bash
    sudo apt-get update 
    sudo apt-get upgrade 
    ```
2.	Install [Ruby](https://www.ruby-lang.org/).  Ruby is an open-source dynamic language that can be combined with bash scripts. 
    
    ```bash
    sudo apt-get install ruby-full
    ```

## Install development tools
This section shows you how to install a couple of text editors. Gedit is the default text editor for the gnome desktop environment. It's designed as a general-purpose text editor. Visual Studio Code is a text editor that includes support for debugging and source control integration.

> [!NOTE]
> There are several different text editors available. Visual Studio Code and gedit are just two examples.

1. Install [gedit](https://help.gnome.org/users/gedit/stable/).

    ```bash
    sudo apt-get install gedit
    ```
1. Install [Visual Studio Code](https://code.visualstudio.com/).  Visual Studio code can be installed using the Snap Store.  For alternate installation options, see [Visual Studio Code alternate downloads](https://code.visualstudio.com/#alt-downloads).

    ```bash
    sudo snap install vscode --classic 
    ```

    The template is now updated and has both the programming language and development tools needed to complete the lab. The template image can now be published to the lab. Select the **Publish** button on template page to publish the template to the lab.  

## Cost 
If you would like to estimate the cost of this lab, you can use the following example:
 
For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be: 

25 students * (20 + 10) hours * 20 Lab Units * 0.01 USD per hour = 150 USD

For more information on the pricing can be found in the following document: [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion
This article walked you through the steps to create a lab for scripting classes. While this article focused on setting up Ruby scripting tools on Linux machine, same setup can be used for other scripting classes like Python on Linux.

## Next steps
Next steps are common to setting up any lab:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab) 
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users). 






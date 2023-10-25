---
title: Set up a Linux shell scripting lab with Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab to teach shell scripting on Linux. 
ms.topic: how-to
ms.date: 03/10/2022
ms.custom: devdivchpfy22
---

# Set up a lab to teach shell scripting on Linux

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a lab to teach shell scripting on Linux. Scripting is a useful part of system administration that allows administrators to avoid repetitive tasks. In this sample scenario, the class covers traditional bash scripts and enhanced scripts. Enhanced scripts are scripts that combine bash commands and Ruby. This approach lets Ruby pass the data around and bash commands to interact with the shell.

Students taking these scripting classes get a Linux virtual machine to learn the basics of Linux, and also get familiar with the bash shell scripting. The Linux virtual machine comes with remote desktop access enabled and with [gedit](https://help.gnome.org/users/gedit/stable/) and [Visual Studio Code](https://code.visualstudio.com/) text editors installed.

## Lab configuration

To set up the lab, you need access to an Azure subscription and a lab account. Discuss with your organization's admin to see if you can get access to an existing Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Lab plan settings

When you have an Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). You can also use an existing lab plan.

Enable your lab plan settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ----------- | ------------ |  
| Marketplace images | Enable the 'Ubuntu Server 18.04 LTS' image. |

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md). Use the following settings when creating the lab.

| Lab settings | Value/instructions |
| ------------ | ------------------ |
| Virtual machine (VM) size | Small  |
| VM image | Ubuntu Server 18.04 LTS|
| Enable remote desktop connection | **Enable**. Enabling this setting will allow teachers and students to connect to their VMs using the remote desktop (RDP). For more information, see [Enable remote desktop for Linux virtual machines in a lab in Azure Lab Services](how-to-enable-remote-desktop-linux.md). </p>|

## Template machine configuration

### Install desktop and RDP

The Ubuntu Server 18.04 LTS image doesn't have the RDP remote desktop server installed by default. To install the packages that are needed on the template machine to connect via remote desktop protocol (RDP), follow instructions in the [Install and configure Remote Desktop to connect to a Linux VM in Azure](../virtual-machines/linux/use-remote-desktop.md) article.

### Install Ruby

Ruby is an open-source dynamic language that can be combined with bash scripts. This section shows how to use `apt-get` to install the latest version of [Ruby](https://www.ruby-lang.org/).

1. Install updates by running the following commands:

    ```bash
    sudo apt-get update 
    sudo apt-get upgrade 
    ```

1. Install [Ruby](https://www.ruby-lang.org/). Ruby is an open-source dynamic language that can be combined with bash scripts.

    ```bash
    sudo apt-get install ruby-full
    ```

1. When prompted, type **Y** and press **Enter** to confirm the installation.

### Install development tools

This section shows you how to install a couple of text editors. Gedit is the default text editor for the gnome desktop environment. It's designed as a general-purpose text editor. Visual Studio Code is a text editor that includes support for debugging and source control integration.

> [!NOTE]
> There are several different text editors available. Visual Studio Code and gedit are just two examples.

1. Install [gedit](https://help.gnome.org/users/gedit/stable/).

    ```bash
    sudo apt-get install gedit
    ```

1. Install [Visual Studio Code](https://code.visualstudio.com/). Visual Studio code can be installed using the Snap Store. For alternate installation options, see [Visual Studio Code alternate downloads](https://code.visualstudio.com/#alt-downloads).

    ```bash
    sudo snap install vscode --classic 
    ```

    The template is now updated and has both the programming language and development tools needed to complete the lab. The template image can now be published to the lab. Select the **Publish** button on template page to publish the template to the lab.  

## Cost

If you would like to estimate the cost of this lab, you can use the following example:

For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be:

25 students \* (20 + 10) hours \* 20 Lab Units \* 0.01 USD per hour = 150 USD

> [!IMPORTANT]
> The cost estimate is for example purposes only. For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

This article walked you through the steps to create a lab for scripting classes. While this article focused on setting up Ruby scripting tools on Linux machine, same setup can be used for other scripting classes like Python on Linux.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

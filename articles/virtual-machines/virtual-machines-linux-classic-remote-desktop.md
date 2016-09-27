<properties
	pageTitle="Remote Desktop to a Linux VM | Microsoft Azure"
	description="Learn how to install and configure Remote Desktop to connect to a Microsoft Azure Linux VM"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="SuperScottz"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/01/2016"
	ms.author="mingzhan"/>


#Using Remote Desktop to connect to a Microsoft Azure Linux VM

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]


##Overview

RDP (Remote Desktop Protocol) is a proprietary protocol used for Windows. How can we use RDP to connect to a Linux VM (virtual machine) remotely?

This guidance will give you the answer! It will help you to install and config xrdp on your Microsoft Azure Linux VM, and you are able to connect it with Remote Desktop from a Windows machine. We will use Linux VM running Ubuntu or OpenSUSE as the example in this guidance.

Xrdp is an open source RDP server, which allows you to connect your Linux server with Remote Desktop from a Windows machine. It performs much nicer than VNC (Virtual Network Computing). VNC has this streak of “JPEG” quality and slow behavior, whereas RDP is fast and crystal clear.


> [AZURE.NOTE] You must already have an Microsoft Azure VM running Linux. To create and set up a Linux VM, see the [Azure Linux VM tutorial](virtual-machines-linux-classic-createportal.md).


##Create endpoint for Remote Desktop
We will use the default endpoint 3389 for Remote Desktop in this doc. So set up 3389 endpoint as Remote Desktop to your Linux VM like below:


![image](./media/virtual-machines-linux-classic-remote-desktop/no1.png)


if you didn't know how to set up endpoint to your VM, see [guidance](virtual-machines-linux-classic-setup-endpoints.md).


##Install Gnome Desktop

Connect to your Linux VM through putty, and install `Gnome Desktop`.

For Ubuntu, use:

	#sudo apt-get update
	#sudo apt-get install ubuntu-desktop


For OpenSUSE, use:

	#sudo zypper install gnome-session

##Install xrdp

For Ubuntu, use:

	#sudo apt-get install xrdp

For OpenSUSE, use:

> [AZURE.NOTE] Update the OpenSUSE version with the version you are using into below command, below is an example command for `OpenSUSE 13.2`.

	#sudo zypper in http://download.opensuse.org/repositories/X11:/RemoteDesktop/openSUSE_13.2/x86_64/xrdp-0.9.0git.1401423964-2.1.x86_64.rpm
    #sudo zypper install tigervnc xorg-x11-Xvnc xterm remmina-plugin-vnc


##Start xrdp and set xdrp service at boot-up

For OpenSUSE, use:

	#sudo systemctl start xrdp
	#sudo systemctl enable xrdp

For Ubuntu, xrdp will be started and eanbled at boot-up automatically after installation.

##Using xfce if you are using Ubuntu version later than Ubuntu 12.04LTS

Because current xrdp could not support the Gnome Desktop from Ubuntu version later than Ubuntu 12.04LTS, we will use `xfce` Desktop instead.

Install `xfce`, use:

    #sudo apt-get install xubuntu-desktop

Then enable `xfce`, use:

    #echo xfce4-session >~/.xsession

Edit the config file `/etc/xrdp/startwm.sh`, use:

    #sudo vi /etc/xrdp/startwm.sh   

Add line `xfce4-session` before the line `/etc/X11/Xsession`.

Restart xrdp service, use:

    #sudo service xrdp restart


##Connect your Linux VM from a Windows machine
In a Windows machine, start the remote desktop client, input your Linux VM DNS name, or go to `Dashboard` of your VM in Azure classic portal and click `Connect` to connect your Linux VM, you will see below login window:

![image](./media/virtual-machines-linux-classic-remote-desktop/no2.png)

Login with the `user` & `password` of your Linux VM, and enjoy the Remote Desktop from your Microsoft Azure Linux VM right now!


##Next
For more information to use xrdp, you could refer [here](http://www.xrdp.org/).

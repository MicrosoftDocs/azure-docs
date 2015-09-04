<properties
	pageTitle="Using Remote Desktop through xrdp to connect a Microsoft Azure Linux VM."
	description="Learn how to Install and Config Remote Desktop on a Microsoft Azure Linux VM."
	services="virtual-machines"
	documentationCenter=""
	authors="SuperScottz"
	manager="timlt"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/31/2015"
	ms.author="mingzhan"/>


#Using Remote Desktop through xrdp to connect a Microsoft Azure Linux VM

##Overview

RDP(Remote Desktop Protocol) is however a proprietary protocol used for Windows, how can we use RDP to connect Linux VM remotely?

This guidance will give you the answer! It will help you to install and config xrdp on your Microsoft Azure Linux VM(virtual machine), and you are able to connect it with Remote Desktop from a Windows machine.

Xrdp is an open source RDP server, which allows you to connect your Linux server with Remote Desktop from a Windows machine. It performs much nicer than VNC (Virtual Network Computing). VNC has this streak of “JPEG” quality and slow behavior, whereas RDP is fast and crystal clear.
 

> [AZURE.NOTE] You must already have an Microsoft Azure VM running Linux. To create and set up a Linux VM, see the [Azure Linux VM tutorial](virtual-machines-linux-tutorial.md).


##Create endpoint for Remote Desktop
We will use the default endpoint 3389 for Remote Desktop in this doc. So set up 3389 endpoint as Remote Desktop to your Linux VM like below:


![image](./media/virtual-machines-linux-remote-desktop/no1.png)


if you didn't know how to set up endpoint to your VM, see [guidance](virtual-machines-set-up-endpoints.md).


##Install Gnome Desktop

Connect to your Linux VM through putty, and install `Gnome Desktop`.

For Red Hat family Linux, use:

	#sudo yum install gnome* "xorg*" -y

For Debian and Ubuntu, use:

	#sudo apt-get update
	#sudo apt-get install ubuntu-desktop


For OpenSUSE, use:

	#sudo zypper -y install gnome-session


##Install xrdp

For Red Hat family Linux, you need add EPEL repository in your Linux VM first in order to install the xrdp package through `yum`, use:

	#sudo rpm -ivh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
	#sudo yum -y install xrdp tigervnc-server tigervnc-server-module xterm

For Debian and Ubuntu Linux, use:

	#sudo apt-get install xrdp


For OpenSUSE, use:

> [AZURE.NOTE] Update the OpenSUSE version with the version you are using into below command, below is an example command for `OpenSUSE 13.2`.

	#sudo zypper in http://download.opensuse.org/repositories/X11:/RemoteDesktop/openSUSE_13.2/x86_64/xrdp-0.9.0git.1401423964-2.1.x86_64.rpm
    #sudo zypper install tigervnc xorg-x11-Xvnc xterm remmina-plugin-vnc


##Start xrdp and set xdrp service at boot-up

For Red Hat family Linux, use:

	#sudo service xrdp start
	#sudo chkconfig xrdp on


For OpenSUSE, use:

	#sudo systemctl start xrdp
	#sudo systemctl enable xrdp
 

##Disable iptables if you are using Red Hat family Linux 

Use:

	#sudo service iptables stop


##Using xfce if you are using Ubuntu version later than Ubuntu 12.04LTS

Because current xrop could not support the Gnome Desktop from Ubuntu version later than Ubuntu 12.04LTS, we will use `xfce` Desktop instead.

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
In a Windows machine, start the remote desktop client, input your Linux VM DNS name or go to `Dashboard` of your VM in Azure portal and click `Connect`, you will see below login window:

![image](./media/virtual-machines-linux-remote-desktop/no2.png)

Login with the `user` & `password` for your Linux VM, and enjoy the Remote Desktop from your Microsoft Azure Linux VM right now!


##Next
For more information to use xrdp, you could refer [here](http://www.xrdp.org/).





 







<properties
	pageTitle="How to update Azure Linux Agent to latest version from Github"
	description="Learn how to update Azure Linux Agent from Github for your Linux VM in Azure."
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
	ms.date="03/23/2015"
	ms.author="mingzhan"/>


# How to update Azure Linux Agent to the latest version from Github

To update your [Azure Linux agent](https://github.com/Azure/WALinuxAgent), you must already have:

1. a running Linux vm in Azure
2. You are connected to that Linux VM using SSH

> [AZURE.NOTE] If you will perform this task from a Windows computer, you can use Putty to SSH into your Linux machine. For more information, see [How to Log on to a Virtual Machine Running Linux](virtual-machines-linux-how-to-log-on.md).

Azure-endorsed Linux distros have put the Azure Linux Agent package in their repositories, so please check and install the latest version from that Distro repository first if possible.  

For Ubuntu, just type:
     
    #sudo apt-get install waagent

and on CentOS and Oracle Linux, type:

    #sudo yum install waagent

Typically this is all you need, but if for some reason you need to install it from https://github.com directly, use the following steps. 


## Install wget

Login to your VM using SSH. 

Install wget (there are some distros that don't install it by default such as Redhat, CentOS, and Oracle Linux versions 6.4 and 6.5) by typing `#sudo yum install wget` on the command line.


## Download latest version

Open [the release of Azure Linux Agent in Github](https://github.com/Azure/WALinuxAgent/releases) in a web page, and find out the latest version number like: 2.0.12. (You can locate your current version by typing `#waagent --version`.)

    #wget https://raw.githubusercontent.com/Azure/WALinuxAgent/WALinuxAgent-[version]/waagent  

The following line uses version 2.0.12 as an example:

    #wget https://raw.githubusercontent.com/Azure/WALinuxAgent/WALinuxAgent-2.0.12/waagent  

## Make waagent executable

    #chmod +x waagent

## Copy new executable to /usr/sbin/
    
    #sudo cp waagent /usr/sbin

For CoreOS, use:

    #sudo cp waagent /usr/share/oem/bin/
 
## Restart waagent service

For most of linux Distros:

    #sudo service waagent restart

For Ubuntu, use:

    #sudo service walinuxagent restart

For CoreOS, use:

    #sudo systemctl restart waagent 

## Confirm the Azure Linux agent version
   
    #waagent -version

For CoreOS, above command may not work.

You will see the Linux Agent version has been updated to new version.

For more information regarding Azure Linux Agent, refer [Azure Linux Agent README](https://github.com/Azure/WALinuxAgent).




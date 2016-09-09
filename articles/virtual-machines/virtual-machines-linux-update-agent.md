<properties
	pageTitle="Update the Azure Linux Agent from GitHub | Microsoft Azure"
	description="Learn how to the update Azure Linux Agent for your Linux VM in Azure to the lateset version from Github"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="SuperScottz"
	manager="timlt"
	editor=""
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/14/2015"
	ms.author="mingzhan"/>


# How to update the Azure Linux Agent on a VM to the latest version from GitHub

To update your [Azure Linux Agent](https://github.com/Azure/WALinuxAgent) on a Linux VM in Azure, you must already have:

1. A running Linux VM in Azure.
2. A connection to that Linux VM using SSH.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

<br>

> [AZURE.NOTE] If you will  be performing this task from a Windows computer, you can use PuTTY to SSH into your Linux machine. For more information, see [How to Log on to a Virtual Machine Running Linux](virtual-machines-linux-classic-log-on.md).

Azure-endorsed Linux distros have put the Azure Linux Agent package in their repositories, so please check and install the latest version from that Distro repository first if possible.  

For Ubuntu, just type:

    #sudo apt-get install walinuxagent

And on CentOS, type:

    #sudo yum install waagent


For Oracle Linux, make sure that the `Addons` repository is enabled. Choose to edit the file `/etc/yum.repos.d/public-yum-ol6.repo`(Oracle Linux 6) or `/etc/yum.repos.d/public-yum-ol7.repo`(Oracle Linux), and change the line `enabled=0` to `enabled=1` under **[ol6_addons]** or **[ol7_addons]** in this file.

Then, to install the latest version of the Azure Linux Agent, type:


    #sudo yum install WALinuxAgent

If you don't find the add-on repository you can simply add these lines at the end of your .repo file according to your Oracle Linux release:

For Oracle Linux 6 virtual machines:

    [ol6_addons]
    name=Add-Ons for Oracle Linux $releasever ($basearch)
    baseurl=http://public-yum.oracle.com/repo/OracleLinux/OL6/addons/x86_64
    gpgkey=http://public-yum.oracle.com/RPM-GPG-KEY-oracle-ol6
    gpgcheck=1
    enabled=1

For Oracle Linux 7 virtual machines:

    [ol7_addons]
    name=Oracle Linux $releasever Add ons ($basearch)
    baseurl=http://public-yum.oracle.com/repo/OracleLinux/OL7/addons/$basearch/
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
    gpgcheck=1
    enabled=0

Then type:

    #sudo yum update WALinuxAgent

Typically this is all you need, but if for some reason you need to install it from https://github.com directly, use the following steps.


## Install wget

Login to your VM using SSH.

Install wget (there are some distros that don't install it by default such as Redhat, CentOS, and Oracle Linux versions 6.4 and 6.5) by typing `#sudo yum install wget` on the command line.


## Download the latest version

Open [the release of Azure Linux Agent in GitHub](https://github.com/Azure/WALinuxAgent/releases) in a web page, and find out the latest version number. (You can locate your current version by typing `#waagent --version`.)

### For version 2.0.x, type:

    #wget https://raw.githubusercontent.com/Azure/WALinuxAgent/WALinuxAgent-[version]/waagent  

   The following line uses version 2.0.14 as an example:

    #wget https://raw.githubusercontent.com/Azure/WALinuxAgent/WALinuxAgent-2.0.14/waagent  

### For version 2.1.x or later, type:

    #wget https://github.com/Azure/WALinuxAgent/archive/WALinuxAgent-[version].zip
    #unzip WALinuxAgent-[version].zip
    #cd WALinuxAgent-[version]

   The following line uses version 2.1.0 as an example:

    #wget https://github.com/Azure/WALinuxAgent/archive/WALinuxAgent-2.1.0.zip
    #unzip WALinuxAgent-2.1.0.zip  
    #cd WALinuxAgent-2.1.0

## Install the Azure Linux Agent

### For version 2.0.x, use:

 Make waagent executable:

    #chmod +x waagent

 Copy new the executable to /usr/sbin/.

  For most of Linux, use:

    #sudo cp waagent /usr/sbin

  For CoreOS, use:

    #sudo cp waagent /usr/share/oem/bin/

  If this is a new installation of the Azure Linux Agent, run:
 
    #sudo /usr/sbin/waagent -install -verbose

### For version 2.1.x, use:

You may need to install the package `setuptools` first--see [here](https://pypi.python.org/pypi/setuptools). Then run:

    #sudo python setup.py install

## Restart the waagent service

For most of linux Distros:

    #sudo service waagent restart

For Ubuntu, use:

    #sudo service walinuxagent restart

For CoreOS, use:

    #sudo systemctl restart waagent

## Confirm the Azure Linux Agent version

    #waagent -version

For CoreOS, the above command may not work.

You will see that the Azure Linux Agent version has been updated to the new version.

For more information regarding the Azure Linux Agent, see [Azure Linux Agent README](https://github.com/Azure/WALinuxAgent).

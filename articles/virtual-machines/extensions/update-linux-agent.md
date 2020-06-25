---
title: Update the Azure Linux Agent from GitHub 
description: Learn how to update Azure Linux Agent for your Linux VM in Azure
services: virtual-machines-linux
documentationcenter: ''
author: mimckitt
manager: gwallace
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: f1f19300-987d-4f29-9393-9aba866f049c
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.date: 08/02/2017
ms.author: mimckitt

---
# How to update the Azure Linux Agent on a VM

To update your [Azure Linux Agent](https://github.com/Azure/WALinuxAgent) on a Linux VM in Azure, you must already have:

- A running Linux VM in Azure.
- A connection to that Linux VM using SSH.

You should always check for a package in the Linux distro repository first. It is possible the package available may not be the latest version, however, enabling autoupdate will ensure the Linux Agent will always get the latest update. Should you have issues installing from the package managers, you should seek support from the distro vendor.

> [!NOTE]
> For more information see [Endorsed Linux distributions on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros)

## Minimum virtual machine agent support in Azure
Verify the [Minimum version support for virtual machine agents in Azure](https://support.microsoft.com/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support) before proceeding.

## Updating the Azure Linux Agent

## Ubuntu

#### Check your current package version

```bash
apt list --installed | grep walinuxagent
```

#### Update package cache

```bash
sudo apt-get -qq update
```

#### Install the latest package version

```bash
sudo apt-get install walinuxagent
```

#### Ensure auto update is enabled

First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
# AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### Restart the waagent service

#### Restart agent for 14.04

```bash
initctl restart walinuxagent
```

#### Restart agent for 16.04 / 17.04

```bash
systemctl restart walinuxagent.service
```

## Red Hat / CentOS

### RHEL/CentOS 6

#### Check your current package version

```bash
sudo yum list WALinuxAgent
```

#### Check available updates

```bash
sudo yum check-update WALinuxAgent
```

#### Install the latest package version

```bash
sudo yum install WALinuxAgent
```

#### Ensure auto update is enabled 

First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
# AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/\# AutoUpdate.Enabled=y/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### Restart the waagent service

```
sudo service waagent restart
```

### RHEL/CentOS 7

#### Check your current package version

```bash
sudo yum list WALinuxAgent
```

#### Check available updates

```bash
sudo yum check-update WALinuxAgent
```

#### Install the latest package version

```bash
sudo yum install WALinuxAgent  
```

#### Ensure auto update is enabled 

First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
# AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### Restart the waagent service

```bash
sudo systemctl restart waagent.service
```

## SUSE SLES

### SUSE SLES 11 SP4

#### Check your current package version

```bash
zypper info python-azure-agent
```

#### Check available updates

The above output will show you if the package is up to date.

#### Install the latest package version

```bash
sudo zypper install python-azure-agent
```

#### Ensure auto update is enabled 

First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
# AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### Restart the waagent service

```bash
sudo /etc/init.d/waagent restart
```

### SUSE SLES 12 SP2

#### Check your current package version

```bash
zypper info python-azure-agent
```

#### Check available updates

In the output from the above, this will show you if the package is up-to-date.

#### Install the latest package version

```bash
sudo zypper install python-azure-agent
```

#### Ensure auto update is enabled 

First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
# AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### Restart the waagent service

```bash
sudo systemctl restart waagent.service
```

## Debian

### Debian 7 “Jesse”/ Debian 7 "Stretch"

#### Check your current package version

```bash
dpkg -l | grep waagent
```

#### Update package cache

```bash
sudo apt-get -qq update
```

#### Install the latest package version

```bash
sudo apt-get install waagent
```

#### Enable agent auto update
This version of Debian does not have a version >= 2.0.16, therefore AutoUpdate is not available for it. The output from the above command will show you if the package is up-to-date.



### Debian 8 “Jessie” / Debian 9 “Stretch”

#### Check your current package version

```bash
apt list --installed | grep waagent
```

#### Update package cache

```bash
sudo apt-get -qq update
```

#### Install the latest package version

```bash
sudo apt-get install waagent
```

#### Ensure auto update is enabled
First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
Restart the waagent service
sudo systemctl restart walinuxagent.service
```

## Oracle Linux 6 and Oracle Linux 7

For Oracle Linux, make sure that the `Addons` repository is enabled. Choose to edit the file `/etc/yum.repos.d/public-yum-ol6.repo`(Oracle Linux 6) or `/etc/yum.repos.d/public-yum-ol7.repo`(Oracle Linux), and change the line `enabled=0` to `enabled=1` under **[ol6_addons]** or **[ol7_addons]** in this file.

Then, to install the latest version of the Azure Linux Agent, type:

```bash
sudo yum install WALinuxAgent
```

If you don't find the add-on repository you can simply add these lines at the end of your .repo file according to your Oracle Linux release:

For Oracle Linux 6 virtual machines:

```sh
[ol6_addons]
name=Add-Ons for Oracle Linux $releasever ($basearch)
baseurl=https://public-yum.oracle.com/repo/OracleLinux/OL6/addons/x86_64
gpgkey=https://public-yum.oracle.com/RPM-GPG-KEY-oracle-ol6
gpgcheck=1
enabled=1
```

For Oracle Linux 7 virtual machines:

```sh
[ol7_addons]
name=Oracle Linux $releasever Add ons ($basearch)
baseurl=http://public-yum.oracle.com/repo/OracleLinux/OL7/addons/$basearch/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
gpgcheck=1
enabled=1
```

Then type:

```bash
sudo yum update WALinuxAgent
```

Typically this is all you need, but if for some reason you need to install it from https://github.com directly, use the following steps.


## Update the Linux Agent when no agent package exists for distribution

Install wget (there are some distros that don't install it by default, such as Red Hat, CentOS, and Oracle Linux versions 6.4 and 6.5) by typing `sudo yum install wget` on the command line.

### 1. Download the latest version
Open [the release of Azure Linux Agent in GitHub](https://github.com/Azure/WALinuxAgent/releases) in a web page, and find out the latest version number. (You can locate your current version by typing `waagent --version`.)

#### For version 2.2.x or later, type:
```bash
wget https://github.com/Azure/WALinuxAgent/archive/v2.2.x.zip
unzip v2.2.x.zip
cd WALinuxAgent-2.2.x
```

The following line uses version 2.2.0 as an example:

```bash
wget https://github.com/Azure/WALinuxAgent/archive/v2.2.14.zip
unzip v2.2.14.zip  
cd WALinuxAgent-2.2.14
```

### 2. Install the Azure Linux Agent

#### For version 2.2.x, use:
You may need to install the package `setuptools` first--see [here](https://pypi.python.org/pypi/setuptools). Then run:

```bash
sudo python setup.py install
```

#### Ensure auto update is enabled

First, check to see if it is enabled:

```bash
cat /etc/waagent.conf
```

Find 'AutoUpdate.Enabled'. If you see this output, it is enabled:

```bash
# AutoUpdate.Enabled=y
AutoUpdate.Enabled=y
```

To enable run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### 3. Restart the waagent service
For most of Linux distros:

```bash
sudo service waagent restart
```

For Ubuntu, use:

```bash
sudo service walinuxagent restart
```

For CoreOS, use:

```bash
sudo systemctl restart waagent
```

### 4. Confirm the Azure Linux Agent version
    
```bash
waagent -version
```

For CoreOS, the above command may not work.

You will see that the Azure Linux Agent version has been updated to the new version.

For more information regarding the Azure Linux Agent, see [Azure Linux Agent README](https://github.com/Azure/WALinuxAgent).

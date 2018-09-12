---
title: Azure CycleCloud Install Jetpack | Microsoft Docs
description: How-to Install Jetpack on a VM.
services: azure cyclecloud
author: mvrequa
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: mirequa
---

# Installing Jetpack

Jetpack is typically downloaded from the **Cloud.Locker** and installed as a 
CycleCloud-managed VM starts up. This initial setup step can be skipped by first
installing jetpack on a VM and capturing as an image, as one would when creating
any other custom VM image.

## Locating the Jetpack Installer

The jetpack installer has specific version for different linux and windows platforms.
The installer also has releases matching the CycleCloud application versions.
The jetpack installers are staged in _/opt/cycle_server/work/staging/jetpack/_

```txt
/opt/cycle_server/work/staging/jetpack/
├── 7.5.1
│   ├── jetpack-7.5.1-centos-6.tar.gz
│   ├── jetpack-7.5.1-centos-7.tar.gz
│   ├── jetpack-7.5.1-ubuntu-14.04.tar.gz
│   ├── jetpack-7.5.1-ubuntu-16.04.tar.gz
│   └── jetpack-7.5.1-windows.zip
└── 7.5.2
    ├── jetpack-7.5.2-centos-6.tar.gz
    ├── jetpack-7.5.2-centos-7.tar.gz
    ├── jetpack-7.5.2-ubuntu-14.04.tar.gz
    ├── jetpack-7.5.2-ubuntu-16.04.tar.gz
    └── jetpack-7.5.2-windows.zip
```

These installers support the platforms identified in the file name.
The **centos** installers are also valid for **Enterprise RedHat Linux**.

_7.5.1._ and _7.5.2_ represent CycleCloud Application releases and in general the 
jetpack installer should match the CycleCloud version.


## Installing Jetpack

Use the following instructions to install Jetpack on the desired system.
After the installer runs, perform a VM image capture according to the
platform-specific Azure instructions.

> [!NOTE]
> Do not use a VM from a VMSS for installing Jetpack and customizing an image. It's not possible to capture a VM image from VMSS.

### On Windows

Copy the installer zip to the VM where you intend to perform installation.

```Powershell
PS> unzip jetpack.zip
PS> cd jetpack
PS> install.cmd
```

### On Linux

Copy the installer archive to the VM where you intend to perform the installation.
Un-tar and decompress the archive and run the installer.

```bash
$ tar -xf jetpack-7.5.2-ubuntu-16.04.tar.gz
$ cd jetpack
$ ./install.sh
```

This command will install jetpack to _/opt/cycle/jetpack_ and will log installation
details to _/var/log/jetpack-install.log_.

#### Change the **cyclecloud** user home directory

Running the installer on a linux OS creates the *cyclecloud*
user with a home directory in _/home_. A somewhat common use-case
is to mount _/home_ as an NFS mount, in which case the local *cyclecloud* user would be impaired.

To work around this, configure the installer to move the *cyclecloud* home directory
to _/opt/cycle/home/cyclecloud_ or another locally available directory.

> [!NOTE]
> The custom cyclecloud home directory must be created before running the installer as shown in example.

```bash
$ tar -xf jetpack-7.5.1-centos-7.tar.gz
$ cd jetpack
$ find . |xargs perl -pi -e 's/\/home\/cyclecloud/\/opt\/cycle\/home\/cyclecloud/'
$ mkdir -p /opt/cycle/home/cyclecloud
$ ./install.sh
Installing to: /opt/cycle/jetpack
Installation complete, see install.log for details.
```


It's safe to ignore _Can't do inplace edit_ errors resulting from perl operating
on a directory.

When using this image, it's important to update any cluster
configuration to relocate the SSH public key to the updated
home directory. This is done by setting the following attribute
on all nodes using this image.

```ini
  [[node node-with-custom-image]]
    ImageId = /subscriptions/ac721984-82f4-4f77-aef6-95d3a95bbccb/resourceGroups/images-rg/providers/Microsoft.Compute/images/ubuntu-16-jetpack-home
    InstallJetpack = false
    AwaitInstallation = true
    AuthorizedKeysPath = /opt/cycle/home/cyclecloud/.ssh/authorized_keys
```

In this case `AuthorizedKeysPath` redirects the public keypair from
the default location to the new *cyclecloud* home directory.

## Capturing the Custom Image and Using with CycleCloud

After installing Jetpack and performing any other custom image configurations the
VM is ready for image capture. Note the instructions differ between [Windows](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/capture-image-resource)
and [Linux](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/capture-image) VMs.

Using these instructions a VM image will be available in the subscription
and location where the image was capture.  To then use the image
in a CycleCloud cluster, refer to our reference on [using custom
vm image](~/cluster-references/nodes-in-cluster-templates.md).

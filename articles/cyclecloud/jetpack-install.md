---
title: Install Jetpack
description: How-to Install Jetpack on a VM.
author: mvrequa
ms.technology: jetpack
ms.date: 08/01/2018
ms.author: mirequa
---

# Jetpack Installation

Jetpack is typically downloaded from the **Cloud.Locker** and installed as a
CycleCloud-managed VM starts up. This initial setup step can be skipped by first
installing Jetpack on a VM and capturing as an image, as one would when creating
any other custom VM image.

## Locate the Jetpack Installer

The Jetpack installer has specific version for different Linux and Windows platforms, as well as releases matching the CycleCloud application versions. The Jetpack installers are staged in _/opt/cycle_server/work/staging/jetpack/_

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

> [!NOTE]
> The **centos** installers are also valid for **Enterprise RedHat Linux**.

_7.5.1._ and _7.5.2_ represent CycleCloud Application releases. In general, the Jetpack installer should match the CycleCloud version.

## Install Jetpack

Use the following instructions to install Jetpack on the desired system.
After the installer runs, perform a VM image capture according to the
platform-specific Azure instructions.

> [!NOTE]
> Do not use a VM from a VMSS for installing Jetpack and customizing an image. It is not possible to capture a VM image from VMSS.

### On Windows

Copy the installer zip to the VM where you intend to perform installation.

```Powershell
unzip jetpack.zip
cd jetpack
install.cmd
```

### On Linux

Copy the installer archive to the VM where you intend to perform the installation.
Un-tar and decompress the archive and run the installer.

```bash
tar -xf jetpack-7.5.2-ubuntu-16.04.tar.gz
cd jetpack
./install.sh
```

This command will install jetpack to _/opt/cycle/jetpack_ and will log installation
details to _/var/log/jetpack-install.log_.

## Capturing the Custom Image and Using it with CycleCloud

After installing Jetpack and performing any other custom image configurations the
VM is ready for image capture. Note the instructions differ between [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image) VMs.

Using these instructions a VM image will be available in the subscription
and location where the image was capture. To use the image
in a CycleCloud cluster, refer to our documentation on [using custom
VM images](~/cluster-references/nodes-in-cluster-templates.md).

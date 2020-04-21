---
title: Install Jetpack
description: How to Install Jetpack on a VM.
author: mvrequa
ms.technology: jetpack
ms.date: 03/01/2020
ms.author: mirequa
---

# How to Manually Install Jetpack

[Jetpack](../jetpack.md) is typically downloaded and installed onto CycleCloud-managed VMs automatically when they start up without any user interaction. This is the preferred method for getting Jetpack on a CycleCloud-managed VM. However, in some cases one may want to manually install Jetpack onto a VM.

## Why Install Jetpack

[Custom images](create-custom-image.md) allow you to have full control over which version of software is installed on your OS. If you have requirements that are met only with a specific version of Jetpack and that Jetpack version isn't installed by default, you will want to manually install that Jetpack version onto a VM and create a custom image.

Creating a custom image with a pre-installed version of Jetpack will also provide a small performance improvement when starting VMs since Jetpack will no longer need to be downloaded and installed every time a VM boots. This performance improvement is negligible (a few seconds) and should not be the primary reason one creates the custom image.

## Locate the Jetpack Installer

The Jetpack installer can be found within your CycleCloud installation at _/opt/cycle_server/work/staging/jetpack_. This directory will contain all the versions available to your installation for both Linux and Windows VMs.

```txt
/opt/cycle_server/work/staging/jetpack/
├── 7.9.0
│   ├── jetpack-7.9.0-linux.tar.gz
│   └── jetpack-7.9.0-windows.zip
├── 7.9.1
│   ├── jetpack-7.9.1-linux.tar.gz
│   └── jetpack-7.9.1-windows.zip
```

> [!NOTE]
> The version numbers you see may differ from the ones listed here based on the version of CycleCloud you are currently using.

## Upload Jetpack to a VM

Once you have located the Jetpack installer you want to install, you will need to upload it to your VM. For this example we will [move the file to Linux using SCP](https://docs.microsoft.com/azure/virtual-machines/linux/copy-files-to-linux-vm-using-scp) into the `azureuser`'s home directory:

```bash
scp /opt/cycle/jetpack/work/staging/jetpack/7.9.0/jetpack-7.9.0-linux.tar.gz azureuser@myserver.eastus.cloudapp.com:/home/azureuser
```

> [!NOTE]
> Do not use a VM from a VMSS for installing Jetpack and customizing an image. It is not possible to capture a VM image from VMSS.

## Install Jetpack

Log into the VM where you uploaded the Jetpack installer, decompress and run the install command. Installation instructions are provided for both Linux and Windows.

### Linux

You will need to be logged in as `azureuser`.

```bash
tar -xf jetpack-7.9.0-linux.tar.gz
cd jetpack
./install.sh
```

### Windows

```Powershell
unzip jetpack-7.9.0-windows.zip
cd jetpack
install.cmd
```

These commands will install jetpack to _/opt/cycle/jetpack_ on Linux or _C:\cycle\jetpack_ on Windows ($JETPACK_HOME). An installation log is available at _$JETPACK_HOME/logs/installation.log_

## Capturing the Custom Image

After installing Jetpack and performing any other custom image configurations the
VM is ready for image capture. Note the instructions differ between [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image) VMs.

## Using the Custom Image with CycleCloud

To use the image with a CycleCloud cluster you can specify the `ImageName` in your cluster template or by specifying it using the custom image option in the UI. If we had named our custom image `MyCustomImage` we would use it as follows in a cluster template:

```ini
[[node custom]]
  ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
  InstallJetpack = False
```

> [!NOTE]
> Specifying `InstallJetpack=False` is completely optional. If not specified, CycleCloud will attempt to download and install Jetpack at runtime and see that Jetpack as already been installed on your image and take no action. By specifying `InstallJetpack=False`a small amount of time is saved that would have been used attempting to automatically install Jetpack.

## Further Reading

* For more details on creating and using custom images please review [Custom Images in a CycleCloud Cluster](create-custom-image.md)
* To learn more about Jetpack you can read about the [Jetpack concepts](../jetpack.md)
---
title: Install Jetpack
description: How to Install Jetpack on a VM.
author: mvrequa
ms.date: 07/01/2025
ms.author: mirequa
---

# How to manually install Jetpack

[Jetpack](../jetpack.md) is typically downloaded and installed onto CycleCloud-managed VMs automatically when they start up without any user interaction. This method is the preferred way to get Jetpack on a CycleCloud-managed VM. However, in some cases, you might want to manually install Jetpack on a VM.

::: moniker range=">=cyclecloud-8"
> [!WARNING]
> We no longer recommend installing Jetpack directly onto a custom image in CycleCloud 8. The Jetpack installation process in CycleCloud 8 takes only a few seconds on average and requires only network access to your storage account. Typically, there's no reason to pre-install Jetpack on custom images. 

::: moniker-end

## Why install Jetpack

[Custom images](create-custom-image.md) give you full control over which software versions are on your OS. If you need a specific version of Jetpack but that version isn't available by default, install the version on a VM and create a custom image.

When you create a custom image with a preinstalled version of Jetpack, you get a small performance boost when starting VMs. Jetpack doesn't need to be downloaded and installed each time a VM boots. This performance boost is small (just a few seconds) and shouldn't be the main reason you create a custom image.


::: moniker range=">=cyclecloud-7"
> [!NOTE]
> At certain phases of installation and configuration management, Jetpack can use 500 MB of memory.
> Consider this memory requirement when choosing a VM size. Burstable `Standard_B1ls` VMs can be unstable.
::: moniker-end

::: moniker range=">=cyclecloud-8"  
## Install Jetpack with YUM or APT

The easiest way to install Jetpack is through the apt or yum repository. First, add the repository to your VM, and then install Jetpack:

With YUM:

```bash
sudo cat > /etc/yum.repos.d/cyclecloud.repo <<EOF
[cyclecloud]
name=cyclecloud
baseurl=https://packages.microsoft.com/yumrepos/cyclecloud
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF
sudo yum install -y jetpack8
```

With APT:

```bash
sudo wget -O /etc/apt/trusted.gpg.d/microsoft.asc https://packages.microsoft.com/keys/microsoft.asc
sudo echo 'deb [signed-by=/etc/apt/trusted.gpg.d/microsoft.asc] https://packages.microsoft.com/repos/cyclecloud stable main' > /etc/apt/sources.list.d/cyclecloud.list
sudo apt update
sudo apt-get install -y jetpack8
```

For cases where APT or YUM aren't good solutions, you can still manually install Jetpack using the Jetpack archive CycleCloud bundles.

::: moniker-end

## Manually install Jetpack

### Locate the Jetpack installer for manual installation

You can find the Jetpack installer in your CycleCloud installation at _/opt/cycle_server/work/staging/jetpack_. This directory contains all the versions available to your installation for both Linux and Windows VMs.

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
> The version numbers you see might differ from the ones shown here, depending on the version of CycleCloud you're using.


### Upload Jetpack archive to a VM

After you find the Jetpack installer you want to use, upload it to your VM. In this example, we [move the file to Linux using SCP](/azure/virtual-machines/linux/copy-files-to-linux-vm-using-scp) into the `azureuser` home directory:

```bash
scp /opt/cycle/jetpack/work/staging/jetpack/7.9.0/jetpack-7.9.0-linux.tar.gz azureuser@myserver.eastus.cloudapp.com:/home/azureuser
```

> [!NOTE]
> Don't use a VM from Virtual Machine Scale Sets for installing Jetpack and customizing an image. You can't capture a VM image from Virtual Machine Scale Sets.

### Install Jetpack

Sign in to the VM where you uploaded the Jetpack installer. Decompress the installer and run the install command. Installation instructions are provided for both Linux and Windows.

#### Linux

You need to be signed in as `azureuser`.

:::moniker range="=cyclecloud-7"

```bash
tar -xf jetpack-7.9.0-linux.tar.gz
cd jetpack
./install.sh
```

:::moniker-end

:::moniker range=">=cyclecloud-8"

```bash
mkdir -p /opt/cycle
tar -xf jetpack-8.0.0-linux.tar.gz -C /opt/cycle
./opt/cycle/jetpack/system/install/install.sh
```

:::moniker-end


#### Windows

:::moniker range="=cyclecloud-7"

```Powershell
unzip jetpack-7.9.0-windows.zip
cd jetpack
install.cmd
```

:::moniker-end


:::moniker range=">=cyclecloud-8"

```powershell
New-Item -Force -ItemType 'directory' -Path 'C:\cycle'
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem')
[System.IO.Compression.ZipFile]::ExtractToDirectory((Get-Item 'jetpack-8.0.0-windows.zip'), (Get-Item 'C:\cycle'))
C:\cycle\jetpack\system\install\install.cmd
```

:::moniker-end

These commands install jetpack to _/opt/cycle/jetpack_ on Linux or _C:\cycle\jetpack_ on Windows ($JETPACK_HOME). You can find an installation log at _$JETPACK_HOME/logs/installation.log_.

## Capture the custom image

After you install Jetpack and make other custom image configurations, the VM is ready for image capture. The instructions for capturing an image differ between [Windows](/azure/virtual-machines/windows/capture-image-resource) and [Linux](/azure/virtual-machines/linux/capture-image) VMs.

## Using the custom image with CycleCloud

To use the image with a CycleCloud cluster, specify the `ImageName` in your cluster template or specify it using the custom image option in the UI. If you name your custom image `MyCustomImage`, use it as follows in a cluster template:

```ini
[[node custom]]
  ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
  DownloadJetpack = false
```

> [!NOTE]
> You don't need to specify `DownloadJetpack=false`, but it can save a small amount of time by not downloading Jetpack on boot. If you don't specify `DownloadJetpack`, CycleCloud attempts to download and install Jetpack at runtime and sees that Jetpack is already installed on your image. 

## Further reading

* For more information on creating and using custom images, see [Custom Images in a CycleCloud Cluster](create-custom-image.md).
* To learn more about Jetpack, see the [Jetpack concepts](../jetpack.md).

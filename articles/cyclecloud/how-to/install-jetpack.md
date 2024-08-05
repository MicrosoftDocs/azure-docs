---
title: Install Jetpack
description: How to Install Jetpack on a VM.
author: mvrequa
ms.date: 03/01/2020
ms.author: mirequa
---

# How to Manually Install Jetpack

[Jetpack](../jetpack.md) is typically downloaded and installed onto CycleCloud-managed VMs automatically when they start up without any user interaction. This is the preferred method for getting Jetpack on a CycleCloud-managed VM. However, in some cases one may want to manually install Jetpack onto a VM.

::: moniker range=">=cyclecloud-8"
> [!WARNING]
> Installing Jetpack directly onto a custom image is no longer recommended in CycleCloud 8. The Jetpack installation process in CycleCloud 8 takes only a few seconds on average and requires only network access to your storage account so there is typically no reason to pre-install Jetpack on custom images. 

::: moniker-end

## Why Install Jetpack

[Custom images](create-custom-image.md) allow you to have full control over which version of software is installed on your OS. If you have requirements that are met only with a specific version of Jetpack and that Jetpack version isn't installed by default, you will want to manually install that Jetpack version onto a VM and create a custom image.

Creating a custom image with a pre-installed version of Jetpack will also provide a small performance improvement when starting VMs since Jetpack will no longer need to be downloaded and installed every time a VM boots. This performance improvement is negligible (a few seconds) and should not be the primary reason one creates the custom image.


::: moniker range=">=cyclecloud-7"
> [!NOTE]
> At certain phases of installation and configuration management, Jetpack can consume 500MB of memory. 
> Consider this when choosing a VM size. Burstable `Standard_B1ls` can be unstable.
::: moniker-end

::: moniker range=">=cyclecloud-8"  
## Install via YUM or APT

The easiest way to install Jetpack is via the apt/yum repository. First add the repository to your VM and then install Jetpack:

via YUM:

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

via APT:

```bash
sudo wget -O /etc/apt/trusted.gpg.d/microsoft.asc https://packages.microsoft.com/keys/microsoft.asc
sudo echo 'deb [signed-by=/etc/apt/trusted.gpg.d/microsoft.asc] https://packages.microsoft.com/repos/cyclecloud stable main' > /etc/apt/sources.list.d/cyclecloud.list
sudo apt update
sudo apt-get install -y jetpack8
```

Alternatively, a manual installation using the Jetpack archive CycleCloud bundles is still available as follows for cases where APT/YUM are not a good solution.

::: moniker-end

## Install Jetpack Manually

### Locate the Jetpack Installer for Manual Installation

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


### Upload Jetpack Archive to a VM

Once you have located the Jetpack installer you want to install, you will need to upload it to your VM. For this example we will [move the file to Linux using SCP](/azure/virtual-machines/linux/copy-files-to-linux-vm-using-scp) into the `azureuser`'s home directory:

```bash
scp /opt/cycle/jetpack/work/staging/jetpack/7.9.0/jetpack-7.9.0-linux.tar.gz azureuser@myserver.eastus.cloudapp.com:/home/azureuser
```

> [!NOTE]
> Do not use a VM from a VMSS for installing Jetpack and customizing an image. It is not possible to capture a VM image from VMSS.

### Install Jetpack

Log into the VM where you uploaded the Jetpack installer, decompress and run the install command. Installation instructions are provided for both Linux and Windows.

#### Linux

You will need to be logged in as `azureuser`.

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

These commands will install jetpack to _/opt/cycle/jetpack_ on Linux or _C:\cycle\jetpack_ on Windows ($JETPACK_HOME). An installation log is available at _$JETPACK_HOME/logs/installation.log_

## Capturing the Custom Image

After installing Jetpack and performing any other custom image configurations the
VM is ready for image capture. Note the instructions differ between [Windows](/azure/virtual-machines/windows/capture-image-resource)
and [Linux](/azure/virtual-machines/linux/capture-image) VMs.

## Using the Custom Image with CycleCloud

To use the image with a CycleCloud cluster you can specify the `ImageName` in your cluster template or by specifying it using the custom image option in the UI. If we had named our custom image `MyCustomImage` we would use it as follows in a cluster template:

```ini
[[node custom]]
  ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
  DownloadJetpack = false
```

> [!NOTE]
> Specifying `DownloadJetpack=false` is not needed, but can save a small amount of time by not downloading Jetpack on boot. If `DownloadJetpack` is not specified, CycleCloud will attempt to download and install Jetpack at runtime and see that Jetpack has already been installed on your image. 

## Further Reading

* For more details on creating and using custom images please review [Custom Images in a CycleCloud Cluster](create-custom-image.md)
* To learn more about Jetpack you can read about the [Jetpack concepts](../jetpack.md)

---
title: Prepare a Debian Linux VHD 
description: Learn how to create Debian VHD images for virtual machine deployments in Azure.
author: srijang
ms.service: azure-virtual-machines
ms.custom: linux-related-content
ms.collection: linux
ms.topic: how-to
ms.date: 06/27/2024
ms.author: maries
ms.reviewer: mattmcinnes
---

# Prepare a Debian VHD for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

## Prerequisites

This section assumes that you've already installed a Debian Linux operating system from an .iso file downloaded from the [Debian website](https://www.debian.org/distrib/) to a virtual hard disk (VHD). Multiple tools exist to create .vhd files. Hyper-V is only one example. For instructions on using Hyper-V, see [Install the Hyper-V role and configure a virtual machine (VM)](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

## Installation notes

* For more tips on preparing Linux for Azure, see [General Linux installation notes](create-upload-generic.md#general-linux-installation-notes).
* The newer VHDX format isn't supported in Azure. You can convert the disk to VHD format by using Hyper-V Manager or the `convert-vhd` cmdlet.
* When you install the Linux system, we recommend that you use standard partitions rather than Logical Volume Manager (LVM), which is often the default for many installations. Using partitions avoids LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) can also be used on data disks.
* Don't configure a swap partition on the OS disk. The Azure Linux agent can be configured to create a swap file on the temporary resource disk. More information is available in the following steps.
* All VHDs on Azure must have a virtual size aligned to 1 MB. When you convert from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1 MB before conversion. For more information, see [Linux installation notes](create-upload-generic.md#general-linux-installation-notes).

## Prepare a Debian image for Azure

You can create the base Azure Debian cloud image with the [fully automatic installation (FAI) cloud image builder](https://salsa.debian.org/cloud-team/debian-cloud-images). To prepare an image without FAI, check out the [generic steps article](./create-upload-generic.md).

The following git clone and apt installation commands were pulled from the Debian cloud images repo. Start by cloning the repo and installing dependencies:

```
$ git clone https://salsa.debian.org/cloud-team/debian-cloud-images.git
$ sudo apt install --no-install-recommends ca-certificates debsums dosfstools \
    fai-server fai-setup-storage make python3 python3-libcloud python3-marshmallow \
    python3-pytest python3-yaml qemu-utils udev
$ cd ./debian-cloud-images
```

Optional: Customize the build by adding scripts (for example, shell scripts) to `./config_space/scripts/AZURE`.

## Script example to customize the image

```
$ mkdir -p ./config_space/scripts/AZURE
$ cat > ./config_space/scripts/AZURE/10-custom <<EOF
#!/bin/bash

\$ROOTCMD bash -c "echo test > /usr/local/share/testing"
EOF
$ sudo chmod 755 ./config_space/scripts/AZURE/10-custom
```

Prefix any commands you want to have customizing the image with `$ROOTCMD`. It's aliased as `chroot $target`.

## Build the Azure Debian image

```
$ make image_[release]_azure_amd64
```

This command outputs a handful of files in the current directory, most notably the `image_[release]_azure_amd64.raw` image file.

Convert the raw image to VHD for Azure:

```
rawdisk="image_[release]_azure_amd64.raw"
vhddisk="image_[release]_azure_amd64.vhd"

MB=$((1024*1024))
size=$(qemu-img info -f raw --output json "$rawdisk" | \
gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

rounded_size=$(((($size+$MB-1)/$MB)*$MB))
rounded_size_adjusted=$(($rounded_size + 512))

echo "Rounded Size Adjusted = $rounded_size_adjusted"

sudo qemu-img resize "$rawdisk" $rounded_size
qemu-img convert -f raw -o subformat=fixed,force_size -O vpc "$rawdisk" "$vhddisk"
```

This process creates a VHD `image_[release]_azure_amd64.vhd` with a rounded size so that it can be copied successfully to an Azure disk.

>[!NOTE]
> Rather than cloning the salsa repository and building images locally, current stable images can be built and downloaded from [FAI](https://fai-project.org/FAIme/cloud/).

After you create a stable Debian VHD image and before you upload, verify that the following packages are installed:

* apt-get install hyperv-daemons
* apt-get install waagent # *(Optional but recommended for password resets and the use of extensions)*
* apt-get install cloud-init

Then perform a full upgrade:

* apt-get full-upgrade

Now the Azure resources must be created for this image. This example uses the `$rounded_size_adjusted` variable, so it should be from within the same shell process from the preceding step.

```
az group create -l $LOCATION -n $RG

az disk create \
    -n $DISK \
    -g $RG \
    -l $LOCATION \
    --for-upload --upload-size-bytes "$rounded_size_adjusted" \
    --sku standard_lrs --hyper-v-generation V1

ACCESS=$(az disk grant-access \
    -n $DISK -g $RG \
    --access-level write \
    --duration-in-seconds 86400 \
    --query accessSas -o tsv)

azcopy copy "$vhddisk" "$ACCESS" --blob-type PageBlob

az disk revoke-access -n $DISK -g $RG
az image create \
    -g $RG \
    -n $IMAGE \
    --os-type linux \
    --source $(az disk show \
        -g $RG \
        -n $DISK \
        --query id -o tsv)
az vm create \
    -g $RG \
    -n $VM \
    --ssh-key-value $SSH_KEY_VALUE \
    --public-ip-address-dns-name $VM \
    --image $(az image show \
        -g $RG \
        -n $IMAGE \
        --query id -o tsv)
```

If the bandwidth from your local machine to the Azure disk is causing a long time to process the upload with `azcopy`, you can use an Azure VM jumpbox to speed up the process. Here's how this process can be done:

1. Create a tarball of the VHD on your local machine: `tar -czvf ./image_buster_azure_amd64.vhd.tar.gz ./image_[release]_azure_amd64.vhd`.
1. Create an Azure Linux VM (distribution of your choice). Make sure that you create it with a large-enough disk to hold the extracted VHD.
1. Download the `azcopy` utility to the Azure Linux VM. You can retrieve it from [Get started with AzCopy](../../storage/common/storage-use-azcopy-v10.md#download-azcopy).
1. Copy the tarball to the VM: `scp ./image_buster_azure_amd64.vhd.tar.gz <vm>:~`.
1. On the VM, extract the VHD: `tar -xf ./image_buster_azure_amd64.vhd.tar.gz`. This step takes a bit of time based on the size of the file.
1. Finally, on the VM, copy the VHD to the Azure disk with `azcopy` (the preceding command).

## Related content

You're now ready to use your Debian Linux VHD to create new VMs in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](./upload-vhd.md#option-1-upload-a-vhd).

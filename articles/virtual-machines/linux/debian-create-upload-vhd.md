---
title: Prepare an Debian Linux VHD 
description: Learn how to create Debian VHD images for VM deployments in Azure.
author: srijang
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 11/10/2021
ms.author: srijangupta
ms.reviewer: mattmcinnes
---
# Prepare a Debian VHD for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

## Prerequisites
This section assumes that you have already installed a Debian Linux operating system from an .iso file downloaded from the [Debian website](https://www.debian.org/distrib/) to a virtual hard disk. Multiple tools exist to create .vhd files; Hyper-V is only one example. For instructions using Hyper-V, see [Install the Hyper-V Role and Configure a Virtual Machine](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).

## Installation notes
* See also [General Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes) for more tips on preparing Linux for Azure.
* The newer VHDX format is not supported in Azure. You can convert the disk to VHD format using Hyper-V Manager or the **convert-vhd** cmdlet.
* When installing the Linux system, it is recommended that you use standard partitions rather than LVM (often the default for many installations). This will avoid LVM name conflicts with cloned VMs, particularly if an OS disk ever needs to be attached to another VM for troubleshooting. [LVM](/previous-versions/azure/virtual-machines/linux/configure-lvm) or [RAID](/previous-versions/azure/virtual-machines/linux/configure-raid) may be used on data disks if preferred.
* Do not configure a swap partition on the OS disk. The Azure Linux agent can be configured to create a swap file on the temporary resource disk. More information can be found in the steps below.
* All VHDs on Azure must have a virtual size aligned to 1MB. When converting from a raw disk to VHD, you must ensure that the raw disk size is a multiple of 1MB before conversion. For more information, see [Linux Installation Notes](create-upload-generic.md#general-linux-installation-notes).

## Use Azure-Manage to create Debian VHDs
There are tools available for generating Debian VHDs for Azure, such as the [azure-manage](https://github.com/credativ/azure-manage) scripts from [Credativ](https://www.credativ.com/). This is the recommended approach versus creating an image from scratch. For example, to create a Debian 8 VHD run the following commands to download the `azure-manage` utility (and dependencies) and run the `azure_build_image` script:

```console
# sudo apt-get update
# sudo apt-get install git qemu-utils mbr kpartx debootstrap

# sudo apt-get install python3-pip python3-dateutil python3-cryptography
# sudo pip3 install azure-storage azure-servicemanagement-legacy azure-common pytest pyyaml
# git clone https://github.com/credativ/azure-manage.git
# cd azure-manage
# sudo pip3 install .

# sudo azure_build_image --option release=jessie --option image_size_gb=30 --option image_prefix=debian-jessie-azure section
```


## Prepare a Debian image for Azure

You can create the base Azure Debian Cloud image with the [FAI cloud image builder](https://salsa.debian.org/cloud-team/debian-cloud-images).

(The following git clone and apt install commands were pulled from the Debian Cloud Images repo) Start by cloning the repo and installing dependencies:

```
$ git clone https://salsa.debian.org/cloud-team/debian-cloud-images.git
$ sudo apt install --no-install-recommends ca-certificates debsums dosfstools \
    fai-server fai-setup-storage make python3 python3-libcloud python3-marshmallow \
    python3-pytest python3-yaml qemu-utils udev
$ cd ./debian-cloud-images
```

(Optional) Customize the build by adding scripts (e.g. shell scripts) to `./config_space/scripts/AZURE`.



## An example of a script to customize the image is:

```
$ mkdir -p ./config_space/scripts/AZURE
$ cat > ./config_space/scripts/AZURE/10-custom <<EOF
#!/bin/bash

\$ROOTCMD bash -c "echo test > /usr/local/share/testing"
EOF
$ sudo chmod 755 ./config_space/scripts/AZURE/10-custom
```

Note that it is important to prefix any commands you want to have customizing the image with `$ROOTCMD` as this is aliased as `chroot $target`.


## Build the Azure Debian 10 image:

```
$ make image_buster_azure_amd64
```


This will output a handful of files in the current directory, most notably the `image_buster_azure_amd64.raw` image file.

To convert the raw image to VHD for Azure, you can do the following:

```
rawdisk="image_buster_azure_amd64.raw"
vhddisk="image_buster_azure_amd64.vhd"

MB=$((1024*1024))
size=$(qemu-img info -f raw --output json "$rawdisk" | \
gawk 'match($0, /"virtual-size": ([0-9]+),/, val) {print val[1]}')

rounded_size=$(((($size+$MB-1)/$MB)*$MB))
rounded_size_adjusted=$(($rounded_size + 512))

echo "Rounded Size Adjusted = $rounded_size_adjusted"

sudo qemu-img resize "$rawdisk" $rounded_size
qemu-img convert -f raw -o subformat=fixed,force_size -O vpc "$rawdisk" "$vhddisk"
```


This creates a VHD `image_buster_azure_amd64.vhd` with a rounded size to be able to copy it successfully to an Azure Disk.

Now we need to create the Azure resources for this image (this uses the `$rounded_size_adjusted` variable, so it should be from within the same shell process from above).

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


>[!Note]
> If the bandwidth from your local machine to the Azure Disk is causing a long time to process the upload with azcopy, you can use an Azure VM jumpbox to speed up the process. Here's how this can be done:
>
>1. Create a tarball of the VHD on your local machine: `tar -czvf ./image_buster_azure_amd64.vhd.tar.gz ./image_buster_azure_amd64.vhd`.
>2. Create an Azure Linux VM (distro of your choice). Make sure that you create it with a large enough disk to hold the extracted VHD!
>3. Download the azcopy utility to the Azure Linux VM. It can be retrieved from [here](../../storage/common/storage-use-azcopy-v10.md#download-azcopy).
>4. Copy the tarball to the VM: `scp ./image_buster_azure_amd64.vhd.tar.gz <vm>:~`.
>5. On the VM, extract the VHD: `tar -xf ./image_buster_azure_amd64.vhd.tar.gz` (this will take a bit of time given the size of the file).
>6. Finally on the VM, copy the VHD to the Azure Disk with `azcopy` (the command from above).


**Next steps:** You're now ready to use your Debian Linux virtual hard disk to create new virtual machines in Azure. If this is the first time that you're uploading the .vhd file to Azure, see [Create a Linux VM from a custom disk](./upload-vhd.md#option-1-upload-a-vhd).
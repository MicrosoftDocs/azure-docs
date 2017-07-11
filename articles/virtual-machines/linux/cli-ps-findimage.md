---
title: Select Linux VM images with the Azure CLI | Microsoft Docs
description: Learn how to use the Azure CLI to determine the publisher, offer, and SKU for Marketplace images when creating a Linux VM with the Resource Manager deployment model.
services: virtual-machines-linux
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 7a858e38-4f17-4e8e-a28a-c7f801101721
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/11/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# How to find Linux VM images in the Azure Marketplace with the Azure CLI
This topic describes how to use the Azure CLI 2.0 to find Linux VM images in the Azure Marketplace. Use this information to specify an image when you create a Linux VM.

Make sure that you installed the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and are logged in to an Azure account (`az login`).

## List popular images

Run the [az vm image list](/cli/azure/vm/image#list) command, without the `--all` option, to see a list of popular VM images in the Azure Marketplace. For example, run the following command to display a cached list of popular images in table format:

```azurecli
az vm image list -o table
```

The output includes the URN, which is of the form *Publisher*:*Offer*:*Sku*:*Version*. You can use this value to specify an image when creating a VM with `az vm create`. For popular VM images, you can also specify the URN alias, such as *UbuntuServer*.

```
You are viewing an offline list of images, use --all to retrieve an up-to-date list
Offer          Publisher               Sku                 Urn                                                             UrnAlias             Version
-------------  ----------------------  ------------------  --------------------------------------------------------------  -------------------  ---------
CentOS         OpenLogic               7.3                 OpenLogic:CentOS:7.3:latest                                     CentOS               latest
CoreOS         CoreOS                  Stable              CoreOS:CoreOS:Stable:latest                                     CoreOS               latest
Debian         credativ                8                   credativ:Debian:8:latest                                        Debian               latest
openSUSE-Leap  SUSE                    42.2                SUSE:openSUSE-Leap:42.2:latest                                  openSUSE-Leap        latest
RHEL           RedHat                  7.3                 RedHat:RHEL:7.3:latest                                          RHEL                 latest
SLES           SUSE                    12-SP2              SUSE:SLES:12-SP2:latest                                         SLES                 latest
UbuntuServer   Canonical               16.04-LTS           Canonical:UbuntuServer:16.04-LTS:latest                         UbuntuLTS            latest
WindowsServer  MicrosoftWindowsServer  2016-Datacenter     MicrosoftWindowsServer:WindowsServer:2016-Datacenter:latest     Win2016Datacenter    latest
WindowsServer  MicrosoftWindowsServer  2012-R2-Datacenter  MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest  Win2012R2Datacenter  latest
WindowsServer  MicrosoftWindowsServer  2012-Datacenter     MicrosoftWindowsServer:WindowsServer:2012-Datacenter:latest     Win2012Datacenter    latest
WindowsServer  MicrosoftWindowsServer  2008-R2-SP1         MicrosoftWindowsServer:WindowsServer:2008-R2-SP1:latest         Win2008R2SP1         latest
```

## List all current images

To obtain the current list of all VM images in Marketplace, use the `az vm image list` command with the `--all` option. This version of the command takes some time to complete:


```azurecli
az vm image list --all
```

If you don't specify a particular location with the `--location` option, the values for `westus` are returned by default. (Set a different default location by running `az configure --defaults location=<location>`)


If you intend to investigate interactively, direct the output to a local file. For example:

```azurecli
az vm image list --all > allImages.json
```




## Find specific images

Use `az vm image list` with additional options to restrict your search to a specific location, offer, publisher, or sku. For example, the following command displays all Debian offers (remember that without the `--all` switch, it only searches the local cache of common images):

```azurecli
az vm image list --offer Debian  --all -o table 
```

The output is similar to: 
```
Offer   Publisher   Sku   Urn                              Version
------  ---------   ---   -------------------------------  -------------
...
Debian  credativ    8     credativ:Debian:8:8.0.201706210  8.0.201706210
...
[list shortened for the example]
```


Apply similar filters with the `--location`, `--publisher`, and `--sku` options. You can even perform partial matches on a filter, such as searching for `--offer Deb` to find all Debian images.

For example, the following command lists all Debian 8 SKUs in `westeurope`:

```azurecli
az vm image list --location westeurope --offer Deb --publisher credativ --sku 8 --all -o table
```



## Navigate the images 
If you want to know the images that are available in a location, you can run the `az vm image list-publishers`, `az vm image list-offers`, and  `az vm image list-skus` commands. For example, the following lists all image publishers in the West US location:

```azurecli
az vm image list-publishers --location westus -o table
```

Output:

```
Location    Name
----------  ----------------------------------------------------
westus      4psa
westus      7isolutions
westus      a10networks
westus      abiquo
westus      accellion
westus      Acronis
westus      Acronis.Backup
westus      actian_matrix
westus      actifio
westus      activeeon
westus      adatao
....
```
These lists can be quite long, so the example output preceding is just a snippet. If you notice that that Canonical is, indeed, an image publisher in the West US location, now find their offers by running `azure vm image list-offers`. Pass the location and the publisher as in the following example:

```azurecli
az vm image list-offers --location westus --publisher Canonical -o table
```

Output:

```
Location    Name
----------  -------------------------
westus      Ubuntu15.04Snappy
westus      Ubuntu15.04SnappyDocker
westus      UbunturollingSnappy
westus      UbuntuServer
westus      Ubuntu_Core
westus      Ubuntu_Snappy_Core
westus      Ubuntu_Snappy_Core_Docker
```
You see that in the West US region, Canonical publishes the **UbuntuServer** offer on Azure. But what SKUs? To get those values, run `azure vm image list-skus` and set the location, publisher, and offer that you have discovered:

```azurecli
az vm image list-skus --location westus --publisher Canonical --offer UbuntuServer -o table
```


## Next steps
Now you can choose precisely the image you want to use. To create a virtual machine quickly by using the URN information, which you just found, or to use a template with that URN information, see [Create a Linux VM using the Azure CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

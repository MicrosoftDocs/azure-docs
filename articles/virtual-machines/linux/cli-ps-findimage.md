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

The output includes the URN (and URN alias, in the case of popular images). You can use this value to specify an image when creating a VM.

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

To obtain the current list of all VM images, use the `az vm image list` command with the `--all` option. This version of the command takes some time to complete:


```azurecli
az vm image list --all
```


If you don't specify a particular location with the `--location` option, the values for `westus` are returned by default. (Set a different default location by running `az configure --defaults location=<location>`)


If you intend to investigate interactively, direct the output to a local file. For example:

```azurecli
az vm image list --all > allImages.json
```




## Find specific images

Use `az vm image list` with additional options to restrict your search to a specific location, offer, publisher, or sku. For example, the following command displays all Debian offers in the default loation (remember that without the `--all` switch, it only searches the local cache of common images):

```azurecli
az vm image list --offer Debian -o table --all
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

Apply similar filters with the `--publisher` and `--sku` options. You can even perform partial matches on a filter, such as searching for `--offer Deb` to find all Debian images.

If you know the location where you are deploying, you can use the general image search results along with the `az vm image list-skus`, `az vm image list-offers`, and `az vm image list-publishers` commands to find exactly what you want and where it can be deployed. For example, if you know that the publisher `credativ` has a Debian offer, you can then use the `--location` and other options to find exactly what you want. The following example looks for a Debian 8 image in `westeurope`:

```azurecli 
az vm image show -l westeurope -f debian -p credativ --sku 8 --version 8.0.201706210
```

Output:

```json
{
  "dataDiskImages": [],
  "id": "/Subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Providers/Microsoft.Compute/Locations/westeurope/Publishers/credativ/ArtifactTypes/VMImage/Offers/debian/Skus/8/Versions/8.0.201706210",
  "location": "westeurope",
  "name": "8.0.201706210",
  "osDiskImage": {
    "operatingSystem": "Linux"
  },
  "plan": null,
  "tags": null
}
```


## Next steps
Now you can choose precisely the image you want to use. To create a virtual machine quickly by using the URN information, which you just found, or to use a template with that URN information, see [Create a Linux VM using the Azure CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

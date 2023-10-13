---
title: Find and use marketplace purchase plan information using the CLI    
description: Learn how to use the Azure CLI to find image URNs and purchase plan parameters, like the publisher, offer, SKU, and version, for Marketplace VM images.
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.date: 02/09/2023
author: ebolton-cyber
ms.author: mattmcinnes
ms.collection: linux
ms.custom: contperf-fy21q3-portal, devx-track-azurecli, GGAL-freshness922, devx-track-linux
---
# Find Azure Marketplace image information using the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This topic describes how to use the Azure CLI to find VM images in the Azure Marketplace. Use this information to specify a Marketplace image when you create a VM programmatically with the CLI, Resource Manager templates, or other tools.

You can also browse available images and offers using the [Azure Marketplace](https://azuremarketplace.microsoft.com/) or  [Azure PowerShell](../windows/cli-ps-findimage.md). 

## Terminology

A Marketplace image in Azure has the following attributes:

* **Publisher**: The organization that created the image. Examples: Canonical, RedHat, SUSE.
* **Offer**: The name of a group of related images created by a publisher. Examples: 0001-com-ubuntu-server-jammy, RHEL, sles-15-sp3.
* **SKU**: An instance of an offer, such as a major release of a distribution. Examples: 22_04-lts-gen2, 8-lvm-gen2,  gen2.
* **Version**: The version number of an image SKU. 

These values can be passed individually or as an image *URN*, combining the values separated by the colon (:). For example: *Publisher*:*Offer*:*Sku*:*Version*. You can replace the version number in the URN with `latest` to use the latest version of the image.

If the image publisher provides extra license and purchase terms, then you must accept those terms before you can use the image.  For more information, see [Check the purchase plan information](#check-the-purchase-plan-information).



## List popular images

You can run the [az vm image list --all](/cli/azure/vm/image) to see all of the images available to you, but it can take several minutes to produce the entire list. A faster option is the use `az vm image list`, without the `--all` option, to see a list of popular VM images in the Azure Marketplace. For example, run the following command to display a cached list of popular images in table format:

```azurecli
az vm image list --output table
```

The output includes the image URN. If you omit the `--all` option, you can see the *UrnAlias* for each image, if available. *UrnAlias* is a shortened version created for popular images like *Ubuntu2204*.
The Linux image alias names and their details outputted by this command are:

```output
Architecture    Offer                         Publisher               Sku                                 Urn                                                                             UrnAlias                 Version
--------------  ----------------------------  ----------------------  ----------------------------------  ------------------------------------------------------------------------------  -----------------------  ---------
x64             CentOS                        OpenLogic               7.5                                 OpenLogic:CentOS:7.5:latest                                                     CentOS                   latest
x64             CentOS                        OpenLogic               8_5-gen2                            OpenLogic:CentOS:8_5-gen2:latest                                                CentOS85Gen2             latest
x64             debian-10                     Debian                  10                                  Debian:debian-10:10:latest                                                      Debian                   latest
x64             Debian11                      Debian                  11-backports-gen2                   Debian:debian-11:11-backports-gen2:latest                                       Debian-11                latest
x64             flatcar-container-linux-free  kinvolk                 stable                              kinvolk:flatcar-container-linux-free:stable:latest                              Flatcar                  latest
x64             flatcar-container-linux-free  kinvolk                 stable-gen2                         kinvolk:flatcar-container-linux-free:stable-gen2:latest                         FlatcarLinuxFreeGen2     latest
x64             opensuse-leap-15-3            SUSE                    gen2                                SUSE:opensuse-leap-15-3:gen2:latest                                             openSUSE-Leap            latest
x64             opensuse-leap-15-4            SUSE                    gen2                                SUSE:opensuse-leap-15-4:gen2:latest                                             OpenSuseLeap154Gen2      latest
x64             RHEL                          RedHat                  7-LVM                               RedHat:RHEL:7-LVM:latest                                                        RHEL                     latest
x64             RHEL                          RedHat                  8-lvm-gen2                          RedHat:RHEL:8-lvm-gen2:latest                                                   RHELRaw8LVMGen2          latest
x64             sles-15-sp3                   SUSE                    gen2                                SUSE:sles-15-sp3:gen2:latest                                                    SLES                     latest
x64             UbuntuServer                  Canonical               18.04-LTS                           Canonical:UbuntuServer:18.04-LTS:latest                                         UbuntuLTS                latest
x64             0001-com-ubuntu-server-jammy  Canonical               22_04-lts-gen2                      Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest                    Ubuntu2204               latest
```

The Windows image alias names and their details outputted by this command are:

```output
Architecture    Offer                         Publisher               Sku                                 Urn                                                                            Alias                    Version
--------------  ----------------------------  ----------------------  ----------------------------------  ------------------------------------------------------------------------------ -----------------------  ---------
x64             WindowsServer                 MicrosoftWindowsServer  2022-Datacenter                     MicrosoftWindowsServer:WindowsServer:2022-Datacenter:latest                    Win2022Datacenter         latest
x64             WindowsServer                 MicrosoftWindowsServer  2022-datacenter-azure-edition-core  MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition-core:latest Win2022AzureEditionCore   latest
x64             WindowsServer                 MicrosoftWindowsServer  2019-Datacenter                     MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest                    Win2019Datacenter         latest
x64             WindowsServer                 MicrosoftWindowsServer  2016-Datacenter                     MicrosoftWindowsServer:WindowsServer:2016-Datacenter:latest                    Win2016Datacenter         latest
x64             WindowsServer                 MicrosoftWindowsServer  2012-R2-Datacenter                  MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest                 Win2012R2Datacenter       latest
x64             WindowsServer                 MicrosoftWindowsServer  2012-Datacenter                     MicrosoftWindowsServer:WindowsServer:2012-Datacenter:latest                    Win2012Datacenter         latest
```


## Find specific images

You can filter the list of images by `--publisher` or another parameter to limit the results.

For example, the following command displays all Debian offers:

```azurecli-interactive
az vm image list --offer Debian --all --output table 
```

You can limit your results to a single architecture by adding the `--architecture` parameter. For example, to display all Arm64 images available from Canonical:

```azurecli-interactive
az vm image list --architecture Arm64 --publisher Canonical --all --output table
```

## Look at all available images
 
Another way to find an image in a location is to run the [az vm image list-publishers](/cli/azure/vm/image), [az vm image list-offers](/cli/azure/vm/image), and [az vm image list-skus](/cli/azure/vm/image) commands in sequence. With these commands, you determine these values:

1. List the image publishers for a location. In this example, we're looking at the *West US* region.
    
    ```azurecli-interactive
    az vm image list-publishers --location westus --output table
    ```

1. For a given publisher, list their offers. In this example, we add *RedHat* as the publisher.
    
    ```azurecli-interactive
    az vm image list-offers --location westus --publisher RedHat --output table
    ```

1. For a given offer, list their SKUs. In this example, we add *RHEL* as the offer.
    ```azurecli-interactive
    az vm image list-skus --location westus --publisher RedHat --offer RHEL --output table
    ```

> [!NOTE]
> Canonical has changed the **Offer** names they use for the most recent versions. Before Ubuntu 20.04, the **Offer** name is UbuntuServer. For Ubuntu 20.04 the **Offer** name is `0001-com-ubuntu-server-focal` and for Ubuntu 22.04 it's `0001-com-ubuntu-server-jammy`.


1. For a given publisher, offer, and SKU, show all of the versions of the image. In this example, we add *9_1* as the SKU.

    ```azurecli-interactive
    az vm image list \
        --location westus \
        --publisher RedHat \
        --offer RHEL \
        --sku 9_1 \
        --all --output table
    ```

Pass this value of the URN column with the `--image` parameter when you create a VM with the [az vm create](/cli/azure/vm) command. You can also replace the version number in the URN with "latest", to use the latest version of the image.

If you deploy a VM with a Resource Manager template, you set the image parameters individually in the `imageReference` properties. See the [template reference](/azure/templates/microsoft.compute/virtualmachines).


## Check the purchase plan information

Some VM images in the Azure Marketplace have extra license and purchase terms that you must accept before you can deploy them programmatically.  

To deploy a VM from such an image, you'll need to accept the image's terms the first time you use it, once per subscription. You'll also need to specify *purchase plan* parameters to deploy a VM from that image

To view an image's purchase plan information, run the [az vm image show](/cli/azure/image) command with the URN of the image. If the `plan` property in the output isn't `null`, the image has terms you need to accept before programmatic deployment.

For example, the Canonical Ubuntu Server 18.04 LTS image doesn't have extra terms, because the `plan` information is `null`:

```azurecli-interactive
az vm image show --location westus --urn Canonical:UbuntuServer:18.04-LTS:latest
```

Output:

```output
{
  "dataDiskImages": [],
  "id": "/Subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Providers/Microsoft.Compute/Locations/westus/Publishers/Canonical/ArtifactTypes/VMImage/Offers/UbuntuServer/Skus/18.04-LTS/Versions/18.04.201901220",
  "location": "westus",
  "name": "18.04.201901220",
  "osDiskImage": {
    "operatingSystem": "Linux"
  },
  "plan": null,
  "tags": null
}
```

Running a similar command for the RabbitMQ Certified by Bitnami image shows the following `plan` properties: `name`, `product`, and `publisher`. (Some images also have a `promotion code` property.) 

```azurecli-interactive
az vm image show --location westus --urn bitnami:rabbitmq:rabbitmq:latest
```
Output:

```output
{
  "dataDiskImages": [],
  "id": "/Subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Providers/Microsoft.Compute/Locations/westus/Publishers/bitnami/ArtifactTypes/VMImage/Offers/rabbitmq/Skus/rabbitmq/Versions/3.7.1901151016",
  "location": "westus",
  "name": "3.7.1901151016",
  "osDiskImage": {
    "operatingSystem": "Linux"
  },
  "plan": {
    "name": "rabbitmq",
    "product": "rabbitmq",
    "publisher": "bitnami"
  },
  "tags": null
}
```

To deploy this image, you need to accept the terms and provide the purchase plan parameters when you deploy a VM using that image.

## Accept the terms

To view and accept the license terms, use the [az vm image terms](/cli/azure/vm/image/terms) command. When you accept the terms, you enable programmatic deployment in your subscription. You only need to accept terms once per subscription for the image. For example:

```azurecli-interactive
az vm image terms show --urn bitnami:rabbitmq:rabbitmq:latest
``` 

The output includes a `licenseTextLink` to the license terms, and indicates that the value of `accepted` is `true`:

```output
{
  "accepted": true,
  "additionalProperties": {},
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/providers/Microsoft.MarketplaceOrdering/offertypes/bitnami/offers/rabbitmq/plans/rabbitmq",
  "licenseTextLink": "https://storelegalterms.blob.core.windows.net/legalterms/3E5ED_legalterms_BITNAMI%253a24RABBITMQ%253a24RABBITMQ%253a24IGRT7HHPIFOBV3IQYJHEN2O2FGUVXXZ3WUYIMEIVF3KCUNJ7GTVXNNM23I567GBMNDWRFOY4WXJPN5PUYXNKB2QLAKCHP4IE5GO3B2I.txt",
  "name": "rabbitmq",
  "plan": "rabbitmq",
  "privacyPolicyLink": "https://bitnami.com/privacy",
  "product": "rabbitmq",
  "publisher": "bitnami",
  "retrieveDatetime": "2019-01-25T20:37:49.937096Z",
  "signature": "XXXXXXLAZIK7ZL2YRV5JYQXONPV76NQJW3FKMKDZYCRGXZYVDGX6BVY45JO3BXVMNA2COBOEYG2NO76ONORU7ITTRHGZDYNJNXXXXXX",
  "type": "Microsoft.MarketplaceOrdering/offertypes"
}
```

To accept the terms, type:

```azurecli-interactive
az vm image terms accept --urn bitnami:rabbitmq:rabbitmq:latest
``` 

## Deploy a new VM using the image parameters

With information about the image, you can deploy it using the `az vm create` command. 

To deploy an image that doesn't have plan information, like the latest Ubuntu Server 18.04 image from Canonical, pass the URN for `--image`:

```azurecli-interactive
az group create --name myURNVM --location westus
az vm create \
   --resource-group myURNVM \
   --name myVM \
   --admin-username azureuser \
   --generate-ssh-keys \
   --image Canonical:UbuntuServer:18.04-LTS:latest 
```


For an image with purchase plan parameters, like the RabbitMQ Certified by Bitnami image, you pass the URN for `--image` and also provide the purchase plan parameters:

```azurecli-interactive
az group create --name myPurchasePlanRG --location westus

az vm create \
   --resource-group myPurchasePlanRG \
   --name myVM \
   --admin-username azureuser \
   --generate-ssh-keys \
   --image bitnami:rabbitmq:rabbitmq:latest \
   --plan-name rabbitmq \
   --plan-product rabbitmq \
   --plan-publisher bitnami
```

If you get a message about accepting the terms of the image, review section [Accept the terms](#accept-the-terms). Make sure the output of `az vm image accept-terms` returns the value `"accepted": true,` showing that you've accepted the terms of the image.


## Using an existing VHD with purchase plan information

If you have an existing VHD from a VM that was created using a paid Azure Marketplace image, you might need to give the purchase plan information when creating a new VM from that VHD. 

If you still have the original VM, or another VM created using the same marketplace image, you can get the plan name, publisher, and product information from it using [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view). This example gets a VM named *myVM* in the *myResourceGroup* resource group and then displays the purchase plan information.

```azurecli-interactive
az vm get-instance-view -g myResourceGroup -n myVM --query plan
```

If you didn't get the plan information before the original VM was deleted, you can file a [support request](https://portal.azure.com/#create/Microsoft.Support). They'll need the VM name, subscription ID and the time stamp of the delete operation.

Once you have the plan information, you can create the new VM using the `--attach-os-disk` parameter to specify the VHD.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myNewVM \
  --nics myNic \
  --size Standard_DS1_v2 --os-type Linux \
  --attach-os-disk myVHD \
  --plan-name planName \
  --plan-publisher planPublisher \
  --plan-product planProduct 
```


## Next steps
To create a virtual machine quickly by using the image information, see [Create and Manage Linux VMs with the Azure CLI](tutorial-manage-vm.md).

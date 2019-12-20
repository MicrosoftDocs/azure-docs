---
title: Red Hat Enterprise Linux BYOS images | Microsoft Docs
description: Learn about bring-your-own-subscription images for RHEL on Azure
services: virtual-machines-linux
documentationcenter: ''
author: asinn826
manager: BorisB2015
editor: ''

ms.assetid: f495f1b4-ae24-46b9-8d26-c617ce3daf3a
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 6/6/2019
ms.author: alsin

---

# Red Hat Enterprise Linux bring-your-own-subscription images in Azure
Red Hat Enterprise Linux (RHEL) images are available in Azure via a pay-as-you-go (PAYG) or bring-your-own-subscription (BYOS) model. This document provides an overview of the BYOS images in Azure.

## Important points to consider

- The RHEL BYOS images provided in this program are production-ready RHEL images similar the RHEL PAYG images in the Azure Gallery/Marketplace. The registration process to obtain the images is in preview.

- The images follow our current policies described in [Red Hat Enterprise Linux images on Azure](./rhel-images.md)

- Standard support policies apply to VMs created from these images

- The VMs provisioned from RHEL BYOS images do not carry RHEL fees associated with RHEL PAYG images

- The images are unentitled, i.e. you must use subscription-manager to register and subscribe the VMs to get updates from Red Hat directly

- It is currently not possible to dynamically switch between BYOS and PAYG billing models for Linux images. Redeploying the VM from the respective image is required to switch the billing model

- Azure Disk Encryption (ADE) is supported on these RHEL BYOS images. ADE support is currently in preview. You must register with Red Hat subscription-manager before configuring ADE. Once registered, to configure ADE refer to: Enable Azure Disk Encryption for Linux IaaS VMs

- While the images won’t change (beyond standard updates and patches), the registration process is in preview and the flow will be further improved to streamline the process

- You have full control of the VMs already provisioned from these images or its snapshots regardless of the final implementation

## Requirements and conditions to access the RHEL BYOS images

1. Get familiar with the [Red Hat Cloud Access program](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) terms and register at [Red Hat's Cloud Access registration page](https://access.redhat.com/cloude/manager/image_imports/new)

1. Complete the [RHEL BYOS access request form](http://aka.ms/rhel-byos). You will need to have on hand your Red Hat account number as well as your Azure subscription(s) that you with to access the RHEL BYOS images with.

1. Upon review and approval by both Red Hat and Microsoft, your Azure subscription(s) will be enabled for image access.

### Expected time for image access

Upon completing the RHEL BYOS form and accepting terms, Red Hat will validate your eligibility for the BYOS images within 3 business days and, if valid, you will receive access to the BYOS images within 1 business day afterward.

## Use the RHEL BYOS images from the Azure Portal

After your subscription is enabled for RHEL BYOS images, you can locate it in the [Azure portal](http://portal.azure.com) by navigating to **Create a Resource** and then **See all**.

At the top of the page, you will see that you have private offers.

![Marketplace private offers](./media/rhel-byos-privateoffers.png)

You can click on the purple link or scroll down to the bottom of the page to see your private offers.

The rest of provisioning in the UI will be no different to any other existing Red Hat image. Choose your RHEL version and follow the prompts to provision your VM. This will also let you accept the terms of the image at the final step.

>[!NOTE]
>These steps so far will not enable your RHEL BYOS image for programmatic deployment – an additional step will be required as described in the “Additional Information” section below.

The rest of this document focuses on the CLI method to provision and accept terms on the image. The UI and CLI are fully interchangeable as far as the final result (a provisioned RHEL BYOS VM) is concerned.

## Use the RHEL BYOS images from the Azure CLI
The following set of instructions will walk you through the initial deployment process for a RHEL VM using the Azure CLI. These instructions assume that you have the [Azure CLI installed](https://docs.microsoft.com/cli/azure/install-azure-cli).

>[!IMPORTANT]
>Make sure you use all lowercase letters in the publisher, offer, plan, and image references for all the following commands

1. Check that you are in your desired subscription:
    ```azurecli
    az account show -o=json
    ```

1. Create a resource group for your RHEL BYOS VM:
    ```azurecli
    az group create --name <name> --location <location>
    ```

1. Accept the image terms:
    ```azurecli
    az vm image terms accept --publisher redhat --offer rhel-byos --plan <SKU value here> -o=jsonc

    # Example:
    az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm75 -o=jsonc

    OR

    az vm image terms acept --urn RedHat:rhel-byos:rhel-lvm8:8.0.20190620
    ```
    >[!NOTE]
    >These terms need to be accepted *once per Azure subscription, per image SKU*.

1. (Optional) Validate your VM deployment with the following command :
    ```azurecli
    az vm create -n <VM name> -g <resource group name> --image <image urn> --validate

    # Example:
    az vm create -n rhel-byos-vm -g rhel-byos-group --image redhat:rhel-byos:rhel-lvm75:latest --validate
    ```

1. Provision your VM by running the same command as above without the `--validate` argument:
    ```azurecli
    az vm create -n <VM name> -g <resource group name> --image <image urn> --validate
    ```

1. SSH into your VM and verify that you have an unentitled image. TO do this, run `sudo yum repolist`. The output will ask you to use subscription-manager to register the VM with Red Hat.

## Additional Information
- If you attempt to provision a VM on a subscription that is not enabled for this offer you will get the following error and you should contact Microsoft or Red Hat to enable your subscription.
```
"Offer with PublisherId: redhat, OfferId: rhel-byos, PlanId: rhel-lvm75 is private and can not be purchased by subscriptionId: GUID"
```

- If you create a snapshot from the RHEL BYOS image AND publish the image in [Shared Image Gallery](https://docs.microsoft.com/azure/virtual-machines/linux/shared-image-galleries), you will need to provide plan information that matches the original source of the snapshot. For example, the command might look like (note the plan parameters in the final line):
```azurecli
az vm create –image \
"/subscriptions/GUID/resourceGroups/GroupName/providers/Microsoft.Compute/galleries/GalleryName/images/ImageName/versions/1.0.0" \
-g AnotherGroupName --location EastUS2 -n VMName \
--plan-publisher redhat --plan-product rhel-byos --plan-name rhel-lvm75
```

- If you are using automation to provision VMs from the RHEL BYOS images, you will need to provide plan parameters similar to what was shown above. For example, if you are using Terraform, you would provide the plan information in a [plan block](https://www.terraform.io/docs/providers/azurerm/r/virtual_machine.html#plan).

## Next steps
* Learn more about the [Azure Red Hat Update Infrastructure](./update-infrastructure-redhat.md).
* To learn more about the Red Hat images in Azure, go to the [documentation page](./rhel-images.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
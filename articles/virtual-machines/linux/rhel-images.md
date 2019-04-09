---
title: Red Hat Enterprise Linux images in Azure | Microsoft Docs
description: Learn about Red Hat Enterprise Linux images in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
manager: jeconnoc
editor: ''

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 01/18/2019
ms.author: borisb

---

# Red Hat Enterprise Linux images in Azure
This article describes available Red Hat Enterprise Linux (RHEL) images in the Azure Marketplace along with policies around their naming and retention.

Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.

>[!Important]
> RHEL images currently available in the Azure marketplace support either Bring-Your-Own-Subscription (BYOS) or Pay-As-You-Go (PAYG) licensing models. The [Azure Hybrid Use Benefit](../windows/hybrid-use-benefit-licensing.md) and dynamic switching between BYOS and PAYG is not supported. Switching licensing mode requires redeploying the VM from the corresponding image.

>[!Note]
> For any issue related to RHEL images in the Azure marketplace gallery please file a support ticket with Microsoft.

## Images available in the UI
When you search for “Red Hat” in the Marketplace or when you create a resource in Azure portal UI, you'll see a subset of available RHEL images and related Red Hat products. You can always obtain the full set of available VM images using the Azure CLI/PowerShell/API.

To see the full set of available Red Hat images in Azure, run the following command

```azurecli-interactive
az vm image list --publisher RedHat --all
```

## Naming convention
VM images in Azure are organized by Publisher, Offer, SKU, and Version. The combination of Publisher:Offer:SKU:Version is the image URN and uniquely identifies the image to be used.

For example, `RedHat:RHEL:7-RAW:7.6.2018103108` refers to a RHEL 7.6 raw-partitioned image built on October 31, 2018.

A sample of how to create a RHEL 7.6 VM is shown below.
```azurecli-interactive
az vm create --name RhelVM --resource-group TestRG --image RedHat:RHEL:7-RAW:7.6.2018103108 --no-wait
```

### The "latest" moniker
Azure REST API allows use of moniker "latest" for version instead of the specific version. Using "latest" will provision the latest available image for the given Publisher, Offer, and SKU.

For example, `RedHat:RHEL:7-RAW:latest` refers to the latest RHEL 7 family raw-partitioned image available.

```azurecli-interactive
az vm create --name RhelVM --resource-group TestRG --image RedHat:RHEL:7-RAW:latest --no-wait
```

>[!NOTE]
> In general, the comparison of versions to determine the latest follows the rules of the [CompareTo method](https://msdn.microsoft.com/library/a5ts8tb6.aspx).

### Current naming convention
All currently published RHEL images use the Pay-As-You-Go model and are connected to [Red Hat Update Infrastructure (RHUI) in Azure](https://aka.ms/rhui-update). Due to a design limitation of RHUI, a new naming convention has been adopted for RHEL 7 family images. The RHEL 6 family naming hasn't been changed at this time.

The limitation is in the fact that when a non-selective `yum update` is run against a VM connected to RHUI, the RHEL version gets updated to the latest in the current family. For more information, see [this link](https://aka.ms/rhui-update). This may result in confusion when a provisioned RHEL 7.2 image becomes RHEL 7.6 after an update. You can still provision from an older image as illustrated in the examples above by specifying the required version explicitly. If the required version is not specified while provisioning a new RHEL 7 image, then the latest image will be provisioned.

>[!NOTE]
> In the RHEL for SAP set of images, the RHEL version remains fixed. As such, their naming convention includes a particular version in the SKU.

>[!NOTE]
> RHEL 6 set of images were not moved to the new naming convention.

The following offers are SKUs are currently available for general use:

Offer| SKU | Partitioning | Provisioning | Notes
:----|:----|:-------------|:-------------|:-----
RHEL | 7-RAW | RAW | Linux Agent | RHEL 7 family of images
| | 7-LVM | LVM | Linux Agent | RHEL 7 family of images
| | 7-RAW-CI | RAW-CI | Cloud-init | RHEL 7 family of images
| | 6.7 | RAW | Linux Agent | RHEL 6.7 images, old naming convention
| | 6.8 | RAW | Linux Agent | Same as above for RHEL 6.8
| | 6.9 | RAW | Linux Agent | Same as above for RHEL 6.9
| | 6.10 | RAW | Linux Agent | Same as above for RHEL 6.10
| | 7.2 | RAW | Linux Agent | Same as above for RHEL 7.2
| | 7.3 | RAW | Linux Agent | Same as above for RHEL 7.3
| | 7.4 | RAW | Linux Agent | Same as above for RHEL 7.4
| | 7.5 | RAW | Linux Agent | Same as above for RHEL 7.5
RHEL-SAP | 7.4 | LVM | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps
| | 7.5 | LVM | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps
RHEL-SAP-HANA | 6.7 | RAW | Linux Agent | RHEL 6.7 for SAP HANA
| | 7.2 | LVM | Linux Agent | RHEL 7.2 for SAP HANA
| | 7.3 | LVM | Linux Agent | RHEL 7.3 for SAP HANA
RHEL-SAP-APPS | 6.8 | RAW | Linux Agent | RHEL 6.8 for SAP Business Applications
| | 7.3 | LVM | Linux Agent | RHEL 7.3 for SAP Business Applications

### Old naming convention
The RHEL 7 family of images and the RHEL 6 family of images used specific versions in their SKUs up until the naming convention change explained above.

You will find numeric SKUs in the full image list. Microsoft and Red Hat will create new numeric SKUs when a new minor release comes out.

### Other available Offers and SKUs
The full list of available offers and SKUs may include additional images beyond what is listed in the above table, for example, `RedHat:rhel-ocp-marketplace:rhel74:7.4.1`. These offers may be used for providing support of specific marketplace solutions, or they could be published for previews and testing purposes. They may be changed or removed at any time without warning. Do not use them unless their presence has been publicly documented by either Microsoft or Red Hat.

## Publishing policy
Microsoft and Red Hat update images as new minor versions are released, as required to address specific CVEs, or for occasional configuration changes/updates. We strive to provide updated images as soon as possible -  within three business days following a release or availability of a CVE fix.

We only update the current minor release in a given image family. With the release of a newer minor version, we stop updating the older minor version. For example, with the release of RHEL 7.6, RHEL 7.5 images are no longer going to be updated.

>[!NOTE]
> Active Azure VMs provisioned from RHEL Pay-As-You-Go images are connected to the Azure RHUI and can receive updates and fixes as soon as they are released by Red Hat and replicated to the Azure RHUI (usually in less than 24 hours following the official release by Red Hat). These VMs do not require a new published image for getting the updates and customers have full control over when to initiate the update.

## Image retention policy
Our current policy is to keep all previously published images. We reserve the right to remove images that are known to cause problems of any kind. For example, images with incorrect configurations due to subsequent platform or component updates may be removed. Images that may be removed will follow the current Marketplace policy to provide notifications up to 30 days before image removal.

## Next steps
* Learn more about the Azure Red Hat Update Infrastructure [here](https://aka.ms/rhui-update).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.

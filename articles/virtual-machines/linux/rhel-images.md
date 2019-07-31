---
title: Red Hat Enterprise Linux images in Azure | Microsoft Docs
description: Learn about Red Hat Enterprise Linux images in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 6/6/2019
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
All currently published RHEL images use the Pay-As-You-Go model and are connected to [Red Hat Update Infrastructure (RHUI) in Azure](https://aka.ms/rhui-update). A new naming convention has been adopted for RHEL 7 family images in which the disk partitioning scheme (raw, LVM) is specified in the SKU instead of the version. The RHEL image version will contain either 7-RAW or 7-LVM. The RHEL 6 family naming hasn't been changed at this time.

There will be 2 types of RHEL 7 image SKUs in this naming convention: SKUs that list the minor version, and SKUs that don't. If you want to use a 7-RAW or 7-LVM SKU, you can specify the RHEL minor version you want to deploy in the version. If you choose the "latest" version, you will be provisioned the latest minor release of RHEL.

>[!NOTE]
> In the RHEL for SAP set of images, the RHEL version remains fixed. As such, their naming convention includes a particular version in the SKU.

>[!NOTE]
> RHEL 6 set of images were not moved to the new naming convention.

## Extended Update Support (EUS)
As of April 2019, RHEL images are available that are attached to the Extended Update Support (EUS) repositories by default. More details on RHEL EUS are available in [Red Hat's documentation](https://access.redhat.com/articles/rhel-eus).

Instructions on how to switch your VM to EUS and more details about EUS support end-of-life dates are available [here](https://aka.ms/rhui-update#rhel-eus-and-version-locking-rhel-vms).

>[!NOTE]
> EUS is not supported on RHEL Extras. This means that if you are installing a package that is usually available from the RHEL Extras channel, you will not be able to do so while on EUS. The Red Hat Extras Product Life Cycle is detailed [here](https://access.redhat.com/support/policy/updates/extras/).

### For customers that want to use EUS images:
Customers that want to use images that are attached to EUS repositories should use the RHEL image that contains a RHEL minor version number in the SKU. These images will be raw-partitioned (i.e. not LVM).

For example, you may see the following 2 RHEL 7.4 images available:
```bash
RedHat:RHEL:7-RAW:7.4.2018010506
RedHat:RHEL:7.4:7.4.2019041718
```
In this case, `RedHat:RHEL:7.4:7.4.2019041718` will be attached to EUS repositories by default, and `RedHat:RHEL:7-RAW:7.4.2018010506` will be attached to non-EUS repositories by default.

### For customers that don't want to use EUS images:
If you don't want to use an image that is connected to EUS by default, deploy using an image that does not contain a minor version number in the SKU.

#### RHEL images with EUS
The following table will apply for RHEL images that contain a minor version in the SKU.

>[!NOTE]
> At the time of writing, only RHEL 7.4 and later minor versions have EUS support. EUS is no longer supported for RHEL <= 7.3.

Minor version |EUS Image example              |EUS status                                                   |
:-------------|:------------------------------|:------------------------------------------------------------|
RHEL 7.4      |RedHat:RHEL:7.4:7.4.2019041718 | Images published April 2019 and later will be EUS by default|
RHEL 7.5      |RedHat:RHEL:7.5:7.5.2019060305 | Images published June 2019 and later will be EUS by default |
RHEL 7.6      |RedHat:RHEL:7.6:7.6.2019052206 | Images published May 2019 and later will be EUS by default  |
RHEL 8.0      |N/A                            | No EUS currently images currently available                 |


## List of RHEL images available
The following offers are SKUs are currently available for general use:

Offer| SKU | Partitioning | Provisioning | Notes
:----|:----|:-------------|:-------------|:-----
RHEL          | 7-RAW    | RAW    | Linux Agent | RHEL 7 family of images. <br> Not attached to EUS repositories by default.
|             | 7-LVM    | LVM    | Linux Agent | RHEL 7 family of images. <br> Not attached to EUS repositories by default.
|             | 7-RAW-CI | RAW-CI | Cloud-init  | RHEL 7 family of images. <br> Not attached to EUS repositories by default.
|             | 6.7      | RAW    | Linux Agent | RHEL 6.7 images, old naming convention
|             | 6.8      | RAW    | Linux Agent | Same as above for RHEL 6.8
|             | 6.9      | RAW    | Linux Agent | Same as above for RHEL 6.9
|             | 6.10     | RAW    | Linux Agent | Same as above for RHEL 6.10
|             | 7.2      | RAW    | Linux Agent | Same as above for RHEL 7.2
|             | 7.3      | RAW    | Linux Agent | Same as above for RHEL 7.3
|             | 7.4      | RAW    | Linux Agent | Same as above for RHEL 7.4. <br> Attached to EUS repositories by default as of April 2019
|             | 7.5      | RAW    | Linux Agent | Same as above for RHEL 7.5. <br> Attached to EUS repositories by default as of June 2019
|             | 7.6      | RAW    | Linux Agent | Same as above for RHEL 7.6. <br> Attached to EUS repositories by default as of May 2019
RHEL-SAP      | 7.4      | LVM    | Linux Agent | RHEL 7.4 for SAP HANA and Business Apps
|             | 7.5      | LVM    | Linux Agent | RHEL 7.5 for SAP HANA and Business Apps
RHEL-SAP-HANA | 6.7      | RAW    | Linux Agent | RHEL 6.7 for SAP HANA
|             | 7.2      | LVM    | Linux Agent | RHEL 7.2 for SAP HANA
|             | 7.3      | LVM    | Linux Agent | RHEL 7.3 for SAP HANA
RHEL-SAP-APPS | 6.8      | RAW    | Linux Agent | RHEL 6.8 for SAP Business Applications
|             | 7.3      | LVM    | Linux Agent | RHEL 7.3 for SAP Business Applications

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

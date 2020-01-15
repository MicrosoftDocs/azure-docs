---
title: Red Hat Enterprise Linux images in Azure | Microsoft Docs
description: Learn about Red Hat Enterprise Linux images in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: asinn826
manager: BorisB2015
editor: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 12/18/2019
ms.author: alsin

---

# Overview of Red Hat Enterprise Linux images
This article describes available Red Hat Enterprise Linux (RHEL) images in the Azure Marketplace along with policies around their naming and retention.

Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page. For pricing details, visit the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

>[!IMPORTANT]
> RHEL images currently available in the Azure marketplace support either Bring-Your-Own-Subscription (BYOS) or Pay-As-You-Go (PAYG) licensing models. The [Azure Hybrid Use Benefit](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing) and dynamic switching between BYOS and PAYG is not supported. Switching licensing mode requires redeploying the VM from the corresponding image.

>[!NOTE]
> For any issue related to RHEL images in the Azure marketplace please file a support ticket with Microsoft.

## Images available in Azure
When you search for “Red Hat” in the Marketplace or when you create a resource in Azure portal UI, you'll see only a subset of all available RHEL images. You can always obtain the full set of available VM images using the Azure CLI/PowerShell/API.

To see the full set of available Red Hat images in Azure, run the following command

```azurecli-interactive
az vm image list --publisher RedHat --all
```

### Naming convention
VM images in Azure are organized by Publisher, Offer, SKU, and Version. The combination of Publisher:Offer:SKU:Version is the image URN and uniquely identifies the image to be used.

For example, `RedHat:RHEL:7-LVM:7.6.2018103108` refers to a RHEL 7.6 LVM-partitioned image built on October 31, 2018.

A sample of how to create a RHEL 7.6 VM is shown below.
```azurecli-interactive
az vm create --name RhelVM --resource-group TestRG --image RedHat:RHEL:7-LVM:7.6.2018103108 --no-wait
```

### The "latest" moniker
The Azure REST API allows use of moniker "latest" for version instead of the specific version. Using "latest" will provision the latest available image for the given Publisher, Offer, and SKU.

For example, `RedHat:RHEL:7-LVM:latest` refers to the latest RHEL 7 family LVM-partitioned image available.

```azurecli-interactive
az vm create --name RhelVM --resource-group TestRG --image RedHat:RHEL:7-LVM:latest --no-wait
```

>[!NOTE]
> In general, the comparison of versions to determine the latest follows the rules of the [CompareTo method](https://msdn.microsoft.com/library/a5ts8tb6.aspx).

### RHEL 6 image types
For RHEL 6.x images, the image types are as follows:

|Publisher | Offer | SKU value | Version | Details
|----------|-------|-----------|---------|--------
|RedHat | RHEL | Minor version (e.g. 6.9) | Concatenated values of the RHEL minor version and the date published (e.g. 6.9.2018010506) | All standard RHEL 6.x images follow this convention
|RedHat | rhel-byos | rhel-raw69 | Concatenated values of the RHEL minor version and the date published (e.g. 6.9.20181023) | This image is a RHEL 6.9 BYOS image.
|RedHat | RHEL | RHEL-SAP-APPS | Concatenated values of the RHEL minor version and the date published (e.g. 6.8.2017053118) | This is a RHEL 6.8 for SAP Applications image. It is entitled to access SAP Applications repositories as well as base RHEL repositories.
|RedHat | RHEL | RHEL-SAP-HANA | Concatenated values of the RHEL minor version and the date published (e.g. 6.7.2017053121) | This is a RHEL 6.7 for SAP HANA image. It is entitled to access SAP HANA repositories as well as base RHEL repositories.

### RHEL 7 image types
For RHEL 7.x images, there are a few different image types. The following table shows the different sets of images we offer. A full list can be viewed with the Az CLI command `az vm image list --publisher redhat --all`.

>[!NOTE]
> Unless otherwise indicated, all images are LVM-partitioned and will connect to regular RHEL repositories (i.e. not EUS, not E4S). Going forward, we are moving to publishing only LVM-partitioned images but are open to feedback on this decision. Details on Extended Update Support and Update Services for SAP are available at the [Red Hat Enterprise Linux Life Cycle page](https://access.redhat.com/support/policy/updates/errata).

|Publisher | Offer | SKU value | Version | Details
|----------|-------|------------|---------|--------
|RedHat | RHEL | Minor version (e.g. 7.6) | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019102813) | Images published before April 2019 will be attached to standard RHEL repositories. Images published after April 2019 will be attached to Red Hat's Extended Update Support (EUS) repositories to allow version-locking of a specific minor version. Customers wanting regular repositories should use the images containing 7-LVM or 7-RAW in the SKU value (details below). RHEL 7.7 and later images will be LVM-partitioned. All other images in this category are raw-partitioned.
|RedHat | RHEL | 7-RAW | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019102813) | These images are raw-partitioned (i.e. no logical volumes have been added).
|RedHat | RHEL | 7-RAW-CI | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019072418) | These images are raw-partitioned (i.e. no logical volumes have been added), and will use cloud-init for provisioning.
|RedHat | RHEL | 7-LVM | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019062414) | These images are LVM-partitioned.
|RedHat | rhel-byos | rhel-{lvm,raw} | Concatenated values of the RHEL minor version and the date published (e.g. 7.7.20190819) | These images are the RHEL 7 BYOS images. THey are not attached to any repositories and will not charge the RHEL premium fee. If you are interested in the RHEL BYOS images, [request access](https://aka.ms/rhel-byos). SKU values end with the minor version and denote whether the image is raw or LVM-partitioned. For example, a SKU value of rhel-lvm77 indicates an LVM-partitioned RHEL 7.7 image.
|RedHat | RHEL | RHEL-SAP | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019071300) | These images are RHEL for SAP images. They are entitled to access the SAP HANA and Applications repositories as well as RHEL E4S repositories. Billing includes the RHEL premium and the SAP premium on top of the base compute fee.
|RedHat | RHEL | RHEL-SAP-HA | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019062320) | These images are RHEL for SAP with High Availability and Update Services images. They are entitled to access the SAP HANA and Applications repositories and the High Availability repositories as well as RHEL E4S repositories. Billing includes the RHEL premium, SAP premium, and HA premium on top of the base compute fee.
|RedHat | RHEL | RHEL-HA | Concatenated values of the RHEL minor version and the date published (e.g. 7.6.2019062019) | These are RHEL images that are also entitled to access the High Availability add-on. They will charge slightly extra on top of the RHEL and base compute fee due to the HA add-on premium.
|RedHat | RHEL | RHEL-SAP-APPS | Concatenated values of the RHEL minor version and the date published (e.g. 7.3.2017053118) | These images are out of date as the SAP Applications and SAP HANA repositories have been combined into the SAP repositories. These are RHEL for SAP Applications images. They are entitled to access SAP Applications repositories as well as base RHEL repositories.
|RedHat | RHEL | RHEL-SAP-HANA | Concatenated values of the RHEL minor version and the date published (e.g. 7.3.2018051421) | These images are out of date as the SAP Applications and SAP HANA repositories have been combined into the SAP repositories. These are RHEL for SAP HANA images. They are entitled to access SAP HANA repositories as well as base RHEL repositories.

### RHEL 8 image types
Details for RHEL 8 image types are below.

|Publisher | Offer | SKU value | Version | Details
|----------|-------|------------|---------|--------
|RedHat | RHEL | 8 | Concatenated values of the RHEL minor version and the date published (e.g. 8.0.20191023) | These images are RHEL 8.0 LVM-partitioned images connected to standard Red Hat repositories.
|RedHat | RHEL | 8-gen2 | Concatenated values of the RHEL minor version and the date published (e.g. 8.0.20191024) | These images are Hyper-V Generation 2 RHEL 8.0 LVM-partitioned images connected to standard Red Hat repositories. More information about Generation 2 VMs in Azure is available [here](https://docs.microsoft.com/azure/virtual-machines/linux/generation-2).

## Extended Update Support (EUS)
As of April 2019, RHEL images are available that are attached to the Extended Update Support (EUS) repositories by default. More details on RHEL EUS are available in [Red Hat's documentation](https://access.redhat.com/articles/rhel-eus).

Switching to EUS repositories is possible and is supported. Instructions on how to switch your VM to EUS and more details about EUS support end-of-life dates are available [here](https://aka.ms/rhui-update#rhel-eus-and-version-locking-rhel-vms).

>[!NOTE]
> EUS is not supported on RHEL Extras. This means that if you are installing a package that is usually available from the RHEL Extras channel, you will not be able to do so while on EUS. The Red Hat Extras Product Life Cycle is detailed [here](https://access.redhat.com/support/policy/updates/extras/).

### Differentiating between regular and EUS images.
Customers that want to use images that are attached to EUS repositories should use the RHEL image that contains a RHEL minor version number in the SKU.

For example, you may see the following two RHEL 7.4 images available:
```bash
RedHat:RHEL:7-LVM:7.6.2019062414
RedHat:RHEL:7.6:7.6.2019102813
```
In this case, `RedHat:RHEL:7.6:7.6.2019102813` will be attached to EUS repositories by default (SKU value of 7.4), and `RedHat:RHEL:7-LVM:7.6.2019062414` will be attached to non-EUS repositories by default (SKU value of 7-LVM).

If you want to use regular (non-EUS) repositories, deploy using an image that does not contain a minor version number in the SKU.

#### RHEL images with EUS
The following table will apply for RHEL images that are connected to EUS repositories.

>[!NOTE]
> At the time of writing, only RHEL 7.4 and later minor versions have EUS support. EUS is no longer supported for RHEL <= 7.3.
>
> More details about RHEL EUS availability can be found [here](https://access.redhat.com/support/policy/updates/errata).

Minor version |EUS Image example              |EUS status                                                   |
:-------------|:------------------------------|:------------------------------------------------------------|
RHEL 7.4      |RedHat:RHEL:7.4:7.4.2019041718 | Images published April 2019 and later will be EUS by default|
RHEL 7.5      |RedHat:RHEL:7.5:7.5.2019060305 | Images published June 2019 and later will be EUS by default |
RHEL 7.6      |RedHat:RHEL:7.6:7.6.2019052206 | Images published May 2019 and later will be EUS by default  |
RHEL 8.0      |N/A                            | No EUS available from Red Hat                               |





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
* View the full list of [RHEL images in Azure](./redhat-imagelist.md).
* Learn more about the Azure Red Hat Update Infrastructure [here](https://aka.ms/rhui-update).
* Learn more about the [RHEL BYOS offer](./byos.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.

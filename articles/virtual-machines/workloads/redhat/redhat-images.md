---
title: Overview of Red Hat Enterprise Linux images in Azure
description: Learn about available Red Hat Enterprise Linux images in Azure Marketplace and policies around their naming and retention in Microsoft Azure.
author: mathapli
ms.service: virtual-machines
ms.subservice: redhat
ms.collection: linux
ms.topic: article
ms.date: 04/07/2023
ms.author: mathapli
ms.reviewer: cynthn
---

# Overview of Red Hat Enterprise Linux images

**Applies to:** :heavy_check_mark: Linux VMs

This article describes available Red Hat Enterprise Linux (RHEL) images in Azure Marketplace and policies around their naming and retention.

For information on Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata). For pricing details, see [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

> [!IMPORTANT]
> RHEL images currently available in Azure Marketplace support either bring your own subscription (BYOS) or pay-as-you-go licensing models. You can dynamically switch between BYOS and pay-as-you-go licensing through [Azure Hybrid Benefit](../../linux/azure-hybrid-benefit-linux.md).
> Note: BYOS images are based on private plans and currently not supported in CSP subscriptions (see [https://learn.microsoft.com/en-us/partner-center/marketplace/private-plans#unlock-enterprise-deals-with-private-plans](/partner-center/marketplace/private-plans))

>[!NOTE]
> For any problem related to RHEL images in Azure Marketplace, file a support ticket with Microsoft.

## View images available in Azure

When you search for *Red Hat* in Azure Marketplace or when you create a resource in the Azure portal, you see only some of the available RHEL images. You can get the full set of available VM images by using the Azure CLI, PowerShell, and API. To see the full set of available Red Hat images in Azure, use the [az vm image list](/cli/azure/vm/image#az-vm-image-list) command:

```azurecli-interactive
az vm image list --publisher RedHat --all --output table
```

### Naming convention

Azure organizes VM images by publisher, offer, SKU, and version. The combination of `Publisher:Offer:SKU:Version` is the image URN and uniquely identifies the image to be used.

For example, `RedHat:RHEL:8-LVM:8.1.20200318` refers to a RHEL 8.1 LVM-partitioned image built on March 18, 2020.

This command uses [az vm create](/cli/azure/vm#az-vm-create) to create a RHEL 8.1 VM.

```azurecli-interactive
az vm create --name RhelVM --resource-group TestRG --image RedHat:RHEL:8-LVM:8.1.20200318
```

### The latest moniker

The Azure REST API allows use of the moniker `latest` for the version instead of the specific version. Using `latest` provisions the latest available image for the given publisher, offer, and SKU.

For example, `RedHat:RHEL:8-LVM:latest` refers to the latest RHEL 8 family LVM-partitioned image available. The `--no-wait` parameter returns control to the command line while the create operation proceeds.

```azurecli-interactive
az vm create --name RhelVM --resource-group TestRG --image RedHat:RHEL:8-LVM:latest --no-wait
```

> [!NOTE]
> In general, the comparison of versions to determine the latest follows the rules of the [Version.CompareTo Method](/dotnet/api/system.version.compareto#system_version_compareto_system_version_). This image version comparison is done by comparing the values as a [Version](/dotnet/api/system.version.-ctor) object, not as a string.

## RHEL 6 image types

> [!NOTE]
> As of December 30 2020, RHEL 6.10 entered end of life. For continued support, enable ELS as part of the Extended Life-cycle Support phase. See [RHEL Extended Lifecycle Support](./redhat-extended-lifecycle-support.md).

For RHEL 6.x images, the image types are shown in the following table.

|Publisher | Offer | SKU value | Version | Details
|----------|-------|-----------|---------|--------
|RedHat | RHEL | Minor version, for example, 6.9 | Concatenated values of the RHEL minor version and the date published, for example, 6.9.2018010506 | All standard RHEL 6.x images follow this convention.
|RedHat | rhel-byos | rhel-raw69 | Concatenated values of the RHEL minor version and the date published, for example, 6.9.20181023 | This image is a RHEL 6.9 BYOS image.
|RedHat | RHEL | RHEL-SAP-APPS | Concatenated values of the RHEL minor version and the date published, for example, 6.8.2017053118 | This image is a RHEL 6.8 for SAP Applications image. It's entitled to access SAP Applications repositories and base RHEL repositories.
|RedHat | RHEL | RHEL-SAP-HANA | Concatenated values of the RHEL minor version and the date published, for example, 6.7.2017053121 | This image is a RHEL 6.7 for SAP HANA image. It's entitled to access SAP HANA repositories and base RHEL repositories.

## RHEL 7 image types

For RHEL 7.x images, there are a few different image types. The following table shows the different sets of images we offer. To see a full list, use the Azure CLI command `az vm image list --publisher redhat --all`.

> [!NOTE]
> Unless otherwise indicated, all images are LVM partitioned and connect to regular RHEL repositories. That is, the repositories aren't Extended Update Support (EUS) and aren't Update Services for SAP (E4S). Going forward, we're moving to publishing only LVM-partitioned images but are open to feedback on this decision. For more information on Extended Update Support and Update Services for SAP, see [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata).

|Publisher | Offer | SKU value | Version | Details
|----------|-------|------------|---------|--------
|RedHat | RHEL | Minor version. for example, 7.6 | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019102813 | Images published before April 2019 are attached to standard RHEL repositories. Images published after April 2019 are attached to Red Hat's EUS repositories to allow version-locking of a specific minor version. Customers who want regular repositories should use the images that contain 7-LVM or 7-RAW in the SKU value. RHEL 7.7 and later images are LVM partitioned. All other images in this category are raw partitioned.
|RedHat | RHEL | 7-RAW | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019102813 | These images are raw partitioned, for example, no logical volumes were added.
|RedHat | RHEL | 7-RAW-CI | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019072418 | These images are raw partitioned, for example, no logical volumes were added, and use cloud-init for provisioning.
|RedHat | RHEL | 7-LVM | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019062414 | These images are LVM partitioned.
|RedHat | rhel-byos | rhel-{lvm,raw} | Concatenated values of the RHEL minor version and the date published, for example, 7.7.20190819 | These images are the RHEL 7 BYOS images. They're not attached to any repositories and don't charge the RHEL premium fee. If you're interested in the RHEL BYOS images, [request access](https://aka.ms/rhel-byos). SKU values end with the minor version and denote whether the image is raw or LVM partitioned. For example, an SKU value of rhel-lvm77 indicates an LVM-partitioned RHEL 7.7 image.
|RedHat | RHEL | RHEL-SAP | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019071300 | These images are RHEL for SAP images. They're entitled to access the SAP HANA and Applications repositories and RHEL E4S repositories. Billing includes the RHEL premium and the SAP premium on top of the base compute fee.
|RedHat | RHEL | RHEL-SAP-HA | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019062320 | These images are RHEL for SAP with High Availability and Update Services images. They're entitled to access the SAP HANA and Applications repositories and the High Availability repositories as well as RHEL E4S repositories. Billing includes the RHEL premium, SAP premium, and High Availability premium on top of the base compute fee.
|RedHat | RHEL | RHEL-HA | Concatenated values of the RHEL minor version and the date published, for example, 7.6.2019062019 | These images are RHEL images that are also entitled to access the High Availability add-on. They charge slightly extra on top of the RHEL and base compute fee due to the High Availability add-on premium.
|RedHat | RHEL | RHEL-SAP-APPS | Concatenated values of the RHEL minor version and the date published, for example, 7.3.2017053118 | These images are out of date because the SAP Applications and SAP HANA repositories were combined into the SAP repositories. These images are RHEL for SAP Applications images. They're entitled to access SAP Applications repositories and base RHEL repositories.
|RedHat | RHEL | RHEL-SAP-HANA | Concatenated values of the RHEL minor version and the date published, for example, 7.3.2018051421 | These images are out of date because the SAP Applications and SAP HANA repositories were combined into the SAP repositories. These images are RHEL for SAP HANA images. They're entitled to access SAP HANA repositories and base RHEL repositories.

## RHEL 8 image types

> [!NOTE]
> Red Hat recommends using Grubby to configure kernel command line parameters in RHEL 8+. For more information, see [Configuring kernel command-line parameters](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/configuring-kernel-command-line-parameters_managing-monitoring-and-updating-the-kernel).

Details for RHEL 8 image types:

|Publisher | Offer | SKU value | Version | Details
|----------|-------|------------|---------|--------
|RedHat | RHEL | 8 | Concatenated values of the RHEL minor version and the date published, for example, 8.0.20191023 | These images are RHEL 8 LVM-partitioned images connected to standard Red Hat repositories.
|RedHat | RHEL | 8-gen2 | Concatenated values of the RHEL minor version and the date published, for example, 8.0.20191024 | These images are Hyper-V Generation 2 RHEL 8 LVM-partitioned images connected to standard Red Hat repositories. For more information about Generation 2 VMs in Azure, see [Support for generation 2 VMs](../../generation-2.md).
|RedHat | RHEL | RHEL-SAP-APPS | Concatenated values of the RHEL minor version and the date published, for example, 8.1.2021012201 | These images are RHEL for SAP Applications images. They're entitled to access SAP Applications repositories and base RHEL repositories.
|RedHat | RHEL | RHEL-SAP-HA | Concatenated values of the RHEL minor version and the date published, for example, 8.1.2021010602 | These images are RHEL for SAP with High Availability and Update Services images. They're entitled to access the SAP Solutions and Applications repositories and the High Availability repositories as well as RHEL E4S repositories. Billing includes the RHEL premium, SAP premium, and High Availability premium on top of the base compute fee.

## RHEL 9 image types

Details for RHEL 9 image types:

|Publisher | Offer | SKU value | Version | Details
|----------|-------|-----------|---------|--------
|RedHat | RHEL | 9 | Concatenated values of the RHEL minor version and the date published, for example, 9.0.2022090613 | These images are RHEL 9 LVM-partitioned images connected to standard Red Hat repositories.
|RedHat | RHEL | 9-gen2 | Concatenated values of the RHEL minor version and the date published (for example, 9.0.2022090613) | These images are Hyper-V Generation 2 RHEL 9 LVM-partitioned images connected to standard Red Hat repositories. For more information about Generation 2 VMs in Azure, see [Support for Generation 2 VMs on Azure](../../generation-2.md).
|RedHat | RHEL | RHEL-SAP-APPS (Not yet published) | Concatenated values of the RHEL minor version and the date published | These images are RHEL for SAP Applications images. They're entitled to access SAP Applications repositories and base RHEL repositories.
|RedHat | RHEL | RHEL-SAP-HA (Not yet published) | Concatenated values of the RHEL minor version and the date published | These images are RHEL for SAP with High Availability and Update Services images. They're entitled to access the SAP Solutions and Applications repositories and the High Availability repositories as well as RHEL E4S repositories. Billing includes the RHEL premium, SAP premium, and High Availability premium on top of the base compute fee.

## RHEL Extended Support add-ons

### Extended Life-cycle Support

The Extended Life-cycle Support (ELS) add-on is an optional subscription that enables critical and important security fixes for releases that have reached end of life. For more information, see [Extended Life-cycle Support Add-On](https://access.redhat.com/support/policy/updates/errata#Extended_Life_Cycle_Support).

ELS is currently only available for RHEL 6.10. For pay-as-you-go images, enable ELS by following the steps in [RHEL Extended Lifecycle Support](./redhat-extended-lifecycle-support.md).

If you're running on an older version, an upgrade to RHEL 6.10 is required before you can enable ELS.

### Extended Update Support

As of April 2019, RHEL images are available that are attached to the EUS repositories by default. For more information, see [RHEL Extended Update Support Overview](https://access.redhat.com/articles/rhel-eus).

Switching to EUS repositories is possible and is supported. For instructions on how to switch your VM to EUS and more information about EUS support end-of-life dates, see [RHEL EUS and version-locking RHEL VMs](./redhat-rhui.md#rhel-eus-and-version-locking-rhel-vms).

> [!NOTE]
> EUS isn't supported on RHEL Extras. If you install a package that's usually available from the RHEL Extras channel, you can't do so while on EUS. For more information on the Red Hat Extras product life cycle, see [Red Hat Enterprise Linux Extras Product Life Cycle](https://access.redhat.com/support/policy/updates/extras/).

#### Differentiate between regular and EUS images

If you want to use images that are attached to EUS repositories, you should use the RHEL image that contains a RHEL minor version number in the SKU.

For example, you might see the following two RHEL 7.4 images available.

```bash
RedHat:RHEL:7-LVM:7.6.2019062414
RedHat:RHEL:7.6:7.6.2019102813
```

In this case, `RedHat:RHEL:7.6:7.6.2019102813` is attached to EUS repositories by default. The SKU value is 7.4. And `RedHat:RHEL:7-LVM:7.6.2019062414` is attached to non-EUS repositories by default. The SKU value is 7-LVM.

To use regular (non-EUS) repositories, use an image that doesn't contain a minor version number in the SKU.

#### RHEL images with EUS

Information in the following table applies to RHEL images that are connected to EUS repositories.

> [!NOTE]
> Currently, only RHEL 7.4 and later minor versions have EUS support. EUS is no longer supported for RHEL <=7.3.
>
> For more information about RHEL EUS availability, see [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata).

Minor version |EUS image example              |EUS status                                                   |
:-------------|:------------------------------|:------------------------------------------------------------|
RHEL 7.4      |RedHat:RHEL:7.4:7.4.2019041718 | Images published April 2019 and later are EUS by default.|
RHEL 7.5      |RedHat:RHEL:7.5:7.5.2019060305 | Images published June 2019 and later are EUS by default. |
RHEL 7.6      |RedHat:RHEL:7.6:7.6.2019052206 | Images published May 2019 and later are EUS by default. |
RHEL 8.0      |N/A                            | No EUS is available from Red Hat.                               |

### Update Services for SAP

The latest RHEL for SAP images are connected to the Update Services for SAP Solutions subscriptions (E4S). For more information about E4S, see [Update Services for SAP Solutions](https://access.redhat.com/support/policy/updates/errata#Update_Services_for_SAP_Solutions).

> [!NOTE]
> If you intend to update OS connected to E4S repositories to the latest version, you can enforce the latest available EUS minor-release in the `/etc/yum/vars/releasever` file without switching to non-EUS.
>
> For information on RedHat EUS availability, see [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata).
>
> For steps on how to enforce a minor version, see [How to set a specific release version on RHUI](https://access.redhat.com/solutions/4251981). Steps outlined in that article also apply to RHEL8.* versions.

#### RHEL images with E4S

Images from the following offers created after December 2019 are connected to E4S repositories:

- RHEL-SAP (RHEL for SAP)
- RHEL-SAP-HA (RHEL for SAP with High Availability and Update Services)

## Other available offers and SKUs

The full list of available offers and SKUs might include more images beyond what is listed in the previous table. An example is `RedHat:rhel-ocp-marketplace:rhel74:7.4.1`. These offers might be used to provide support for specific marketplace solutions, or they could be published for previews and testing purposes. They might be changed or removed at any time without warning. Don't use them unless either Microsoft or Red Hat publicly presents them.

## Publishing policy

Microsoft and Red Hat update images as new minor versions are released, as required to address specific common vulnerabilities and exposures (CVEs) or for occasional configuration changes or updates. We strive to provide updated images as soon as possible within three business days following a release or availability of a CVE fix.

We update only the current minor release in a given image family. With the release of a newer minor version, we stop updating the older minor version. For example, with the release of RHEL 7.6, RHEL 7.5 images are no longer updated.

> [!NOTE]
> Active Azure VMs provisioned from RHEL pay-as-you-go images are connected to the Azure RHUI and can receive updates and fixes as soon as they're released by Red Hat and replicated to the Azure RHUI. The timing is usually less than 24 hours following the official release by Red Hat. These VMs don't require a new published image for getting the updates. Customers have full control over when to initiate the update.

## Image retention policy

Current policy is to keep all previously published images. We reserve the right to remove images that are known to cause problems of any kind. For example, images with incorrect configurations due to subsequent platform or component updates might be removed. Images that might be removed follow the current Azure Marketplace policy to provide notifications up to 30 days before image removal.

## Next steps

- To view the full list of RHEL images in Azure, see [Red Hat Enterprise Linux (RHEL) images available in Azure](./redhat-imagelist.md).
- To learn more about the Azure Red Hat Update Infrastructure, see [Red Hat Update Infrastructure for on-demand RHEL VMs in Azure](./redhat-rhui.md).
- To learn more about the RHEL BYOS offer, see [Red Hat Enterprise Linux bring-your-own-subscription Gold Images in Azure](./byos.md).
- For information on Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata).



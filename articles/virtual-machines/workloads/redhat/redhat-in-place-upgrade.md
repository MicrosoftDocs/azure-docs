---
title: In-place upgrade of Red Hat Enterprise Linux images on Azure
description: Learn how to do an in-place upgrade from Red Hat Enterprise 7.x images to the latest 8.x version.
author: mamccrea
ms.service: virtual-machines
ms.subservice: redhat
ms.collection: linux
ms.topic: article
ms.date: 04/16/2020
ms.author: mamccrea
---

# Red Hat Enterprise Linux in-place upgrades

**Applies to:** :heavy_check_mark: Linux VMs 


>[!Note] 
> Offerings of SQL Server on Red Hat Enterprise Linux don't support in-place upgrades on Azure.

>[!Important] 
> Take a snapshot of the image before you start the upgrade as a precaution.

## What is RHEL in-place upgrade?
During an in-place upgrade, the earlier RHEL OS major version will be replaced with the new RHEL OS major version without removing the earlier version first. The installed applications and utilities, along with the configurations and preferences, are incorporated into the new version.


## Upgrade from RHEL 7 VMs to RHEL 8 VMs
Instructions for an in-place upgrade from Red Hat Enterprise Linux 7 VMs to Red Hat Enterprise Linux 8 VMs on Azure is provided at the [Red Hat upgrading from RHEL 7 to RHEL 8 documentation here.](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/upgrading_from_rhel_7_to_rhel_8/index)


## Upgrade SAP environments from RHEL 7 VMs to RHEL 8 VMs
Instructions for an in-place upgrade from Red Hat Enterprise Linux 7 SAP VMs to Red Hat Enterprise Linux 8 SAP VMs on Azure is provided at the [Red Hat upgrading from RHEL 7 SAP to RHEL 8 SAP documentation here.](https://access.redhat.com/solutions/5154031)


## Next steps
* Learn more about [Red Hat images in Azure](./redhat-images.md).
* Learn more about [Red Hat update infrastructure](./redhat-rhui.md).
* Learn more about the [RHEL BYOS offer](./byos.md).
* To learn more about the Red Hat in-place upgrade processes, see [Upgrading from RHEL 7 TO RHEL 8](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/upgrading_from_rhel_7_to_rhel_8/index) in the Red Hat documentation.
* To learn more about Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux life cycle](https://access.redhat.com/support/policy/updates/errata) in the Red Hat documentation.
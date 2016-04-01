<properties
   pageTitle="An update infrastructure for Red Hat Enterprise Linux images | Microsoft Azure"
   description="Introduces the yum update service for an on-demand Red Hat Enterprise Linux instance in Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="KylieLiang"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="03/18/2016"
   ms.author="kyliel"/>

# An update infrastructure for Red Hat Enterprise Linux images

By using Red Hat Update Infrastructure (RHUI) in Azure, you can manage yum repository content for Azure Red Hat Enterprise Linux (RHEL) images. The on-demand RHEL instances that you created from Azure Marketplace will then have access to the regional yum repository. This allows RHEL instances to receive incremental updates.

The yum repository list, which is managed by RHUI, is configured in your RHEL instance during provisioning. So you don't need to do any additional configuration--just run `yum update` after your RHEL instance is running.

## RHUI overview
[Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) offers a highly scalable solution to manage yum repository content for Red Hat Enterprise Linux cloud instances that are hosted by Red Hat-certified cloud providers. Based on the upstream Pulp project, RHUI allows cloud providers to locally mirror Red Hat-hosted repository content, create custom repositories with their own content, and make those repositories available to a large group of end users through a load-balanced content delivery system.

## Regions where RHUI is available
RHUI is available in all public regions that are listed on the [Azure status dashboard](https://azure.microsoft.com/status/). This means that you can get the yum update service without any additional charge in these regions. This information will be updated in the future.

## Get updates from the other update repository (like Red Hat Network Satellite)

To get updates from the other update repository, you need to have a Red Hat Cloud Access license and an existing Red Hat subscription to Azure.

Then, you need to unregister RHUI and reregister to your update infrastructure. Below are detailed steps.

1.	Edit /etc/yum.repos.d/rh-cloud.repo and change all `enabled=1` to `enabled=0`. For example:

        # sed -i 's/enabled=1/enabled=0/g' /etc/yum.repos.d/rh-cloud.repo

2.	Edit /etc/yum/pluginconf.d/rhnplugin.conf and change `enabled=0` to `enabled=1`.
3.	Then, register with Red Hat Network (RHN).

        rhn_register

    or

        rhnreg_ks


> [AZURE.NOTE] Outbound data transfers will be charged (see the [pricing details](http://azure.microsoft.com/pricing/details/data-transfers/)). We recommend using default RHUI to get incremental updates without incurring additional charges.

## Next steps
Now that you understand RHUI in Azure, you can create a RHEL image from [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/) and use `yum update` in your RHEL instance.

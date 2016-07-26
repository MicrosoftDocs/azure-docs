<properties
   pageTitle="Red Hat Update Infrastructure (RHUI) | Microsoft Azure"
   description="Learn about Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux instances in Microsoft Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="BorisB2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="07/11/2016"
   ms.author="borisb"/>

# Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux VMs in Azure

Virtual machines created from the on-demand Red Hat Enterprise Linux (RHEL) images available in Azure Marketplace are registered to access the Red Hat Update Infrastructure (RHUI) deployed in Azure.  The on-demand RHEL instances will have access to a regional yum repository and able to receive incremental updates.

The yum repository list, which is managed by RHUI, is configured in your RHEL instance during provisioning. You don't need to do any additional configuration - just run `yum update` after your RHEL instance is running to get the latest updates.

## RHUI overview
[Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) offers a highly scalable solution to manage yum repository content for Red Hat Enterprise Linux cloud instances that are hosted by Red Hat-certified cloud providers. Based on the upstream Pulp project, RHUI allows cloud providers to locally mirror Red Hat-hosted repository content, create custom repositories with their own content, and make those repositories available to a large group of end users through a load-balanced content delivery system.

## Regions where RHUI is available
RHUI is available in all regions where RHEL on-demand images are available. It currently includes all public regions listed on the [Azure status dashboard](https://azure.microsoft.com/status/) page. RHUI access for VMs provisioned from RHEL on-demand images is included in their price. Regional/national cloud availability will be updated as we expand RHEL on-demand availability in the future.

> [AZURE.NOTE] Access to Azure-hosted RHUI is limited to the VMs within [Microsoft Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

## Get updates from another update repository

If you need to get updates from a different update repository (instead of Azure-hosted RHUI) you will need to unregister your instances from RHUI and re-register them with the desired update infrastructure (such as Red Hat Satellite or Red Hat Customer Portal CDN). You will need appropriate Red Hat subscriptions for these services and registration for [Red Hat Cloud Access in Azure](https://access.redhat.com/ecosystem/partners/ccsp/microsoft-azure).

To unregister RHUI and reregister to your update infrastructure follow the below steps.

1.	Edit /etc/yum.repos.d/rh-cloud.repo and change all `enabled=1` to `enabled=0`. For example:

        # sed -i 's/enabled=1/enabled=0/g' /etc/yum.repos.d/rh-cloud.repo

2.	Edit /etc/yum/pluginconf.d/rhnplugin.conf and change `enabled=0` to `enabled=1`.
3.	Then register with the desired infrastructure, such as Red Hat Customer Portal. Follow Red Hat solution guide on [how to register and subscribe a system to the Red Hat Customer Portal](https://access.redhat.com/solutions/253273).

> [AZURE.NOTE] Access to the Azure-hosted RHUI is included in the RHEL Pay-As-You-Go (PAYG) image price. Unregistering a PAYG RHEL VM from the Azure-hosted RHUI does not convert the virtual machine into Bring-Your-Own-License (BYOL) type VM and hence you may be incurring double charges if you register the same VM with another source of updates. 
> 
> If you consistently need to use an update infrastructure other than Azure-hosted RHUI consider creating and deploying your own (BYOL-type) images as described in [Create and Upload Red Hat-based virtual machine for Azure](virtual-machines-linux-redhat-create-upload-vhd.md) article.

## Next steps
To create a Red Hat Enterprise Linux VM from Azure Marketplace Pay-As-You-Go image and leverage Azure-hosted RHUI go to [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/). You will be able to use `yum update` in your RHEL instance without any additional setup.
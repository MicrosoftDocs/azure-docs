<properties
   pageTitle="Update Infrastructure for Red Hat Enterprise Linux images | Microsoft Azure"
   description="Introduce yum update service for on-demand Red Hat Enterprise Linux instance in Azure"
   services="virtual-machines"
   documentationCenter=""
   authors="KylieLiang"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="01/13/2016"
   ms.author="kyliel"/>

# Update Infrastructure for Red Hat Enterprise Linux images

Red Hat Update Infrastructure (RHUI) in Azure is to manage yum repository content for Azure Red Hat Enterprise Linux (RHEL) images. Then on-demand RHEL instances created from Azure Marketplace will have access to the regional yum repository to receive incremental updates and is included in all prices.

Yum repository list managed by Red Hat Update Infrastructure (RHUI) is configured in your Red Hat Enterprise Linux (RHEL) instance during provisioning. So you need not to do any additional configuration but just run "yum update" once your RHEL is running.

## What is RHUI?
[Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) offers a highly scalable solution to manage yum repository content for Red Hat Enterprise Linux cloud instances, hosted by Red Hat Certified Cloud Providers. Based on the upstream Pulp project, Red Hat Update Infrastructure allows cloud providers to locally mirror Red Hat-hosted repository content, create custom repositories with their own content, and make those repositories available to a large group of end users via a load-balanced content delivery system.

## Which regions RHUI is deployed in?
Now RHUI is deployed in all public regions listed on [Azure Status Dashboard](https://azure.microsoft.com/status/). It means you could get yum update service without any additional charge in these regions.

Following supported region information will be updated in the future.

## Could I get updates from an on-premises update repository, like Red Hat Network Satellite?
You need to have Red Hat Cloud Access license and bring your existing Red Hat subscription to Azure.

Then you need to de-register Red Hat Update Infrastructure (RHUI) and re-register to your on-premises update Infrastructure. Below are detailed steps.

1.	Edit /etc/yum.repos.d/rh-cloud.repo and change all 'enabled=1' to 'enabled=0’, one command line could be like the following:

        # sed -i 's/enabled=1/enabled=0/g' /etc/yum.repos.d/rh-cloud.repo

2.	Edit /etc/yum/pluginconf.d/rhnplugin.conf and change 'enabled=0' to 'enabled=1'
3.	RHN register with

        rhn_register

    or

        rhnreg_ks


> [AZURE.NOTE] Outbound data transfers will be charged, refer [here](http://azure.microsoft.com/pricing/details/data-transfers/). Recommend to use default RHUI to get incremental updates without additional charge.

## Next Steps
Now you understand what is Red Hat Update Infrastrcture in Azure. Create RHEL image from [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/) and enjoy the experience of yum update in your RHEL instance.

<properties
	pageTitle="Planned maintenance for Windows VMs | Microsoft Azure"
	description="Understand what Azure planned maintenance is and how it affects your Windows virtual machines running in Azure"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="drewm"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/05/2016"
	ms.author="drewm"/>

# Planned maintenance for Windows virtual machines in Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

Understand what Azure planned maintenance is and how it can affect the availability of your Windows virtual machines. You can also read about [planned maintenance for Linux virtual machines](virtual-machines-linux-planned-maintenance.md). 

## Why Azure performs planned maintenance

Microsoft Azure periodically performs updates across the globe to improve the reliability, performance, and security of the host infrastructure that underlies virtual machines. Many of these updates are performed without any impact to your virtual machines or Cloud Services, including memory-preserving updates.

However, some updates do require a reboot to your virtual machines to apply the required updates to the infrastructure. The virtual machines are shut down while we patch the infrastructure, and then the virtual machines are restarted.

Please note that there are two types of maintenance that can impact the availability of your virtual machines: planned and unplanned. This page describes how Microsoft Azure performs planned maintenance. For more information about unplanned maintenance, see [Understand planned versus unplanned maintenance](virtual-machines-windows-manage-availability.md).

[AZURE.INCLUDE [virtual-machines-common-planned-maintenance](../../includes/virtual-machines-common-planned-maintenance.md)]

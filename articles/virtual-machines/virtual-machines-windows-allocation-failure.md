<properties
	pageTitle="Troubleshooting Windows VM allocation failures | Microsoft Azure"
	description="Troubleshoot allocation failures when you create, restart, or resize a Windows VM in Azure"
	services="virtual-machines-windows, azure-resource-manager"
	documentationCenter=""
	authors="jiangchen79"
	manager="felixwu"
	editor=""
	tags="top-support-issue,azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/02/2016"
	ms.author="cjiang"/>

# Troubleshoot allocation failures when you create, restart, or resize Windows VMs in Azure

When you create a VM, restart stopped (deallocated) VMs, or resize a VM, Microsoft Azure allocates compute resources to your subscription. You may occasionally receive errors when performing these operations -- even before you reach the Azure subscription limits. This article explains the causes of some of the common allocation failures and suggests possible remediation. The information may also be useful when you plan the deployment of your services.

The "General troubleshooting steps" section lists steps to address common issues. The "Detailed troubleshooting steps" section provides resolution steps by specific error message. Before you get started, here is some background information to understand how allocation works and why allocation failure happens. You can also [troubleshoot allocation failures when you create, restart, or resize Linux VMs in Azure](virtual-machines-linux-allocation-failure.md).

[AZURE.INCLUDE [virtual-machines-common-allocation-failure](../../includes/virtual-machines-common-allocation-failure.md)]

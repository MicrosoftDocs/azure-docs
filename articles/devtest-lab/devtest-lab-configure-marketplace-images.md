<properties
	pageTitle="Configure a Marketplace image in a DevTest Lab | Microsoft Azure"
	description="Learn the different Marketplace image settings and how to customize them."
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/06/2016"
	ms.author="tarcher"/>

# Configure a Marketplace image in a DevTest Lab

## Overview

DevTest Labs supports creating new VMs based on Azure Marketplace images depending
on how you have configured Azure Marketplace images to be used in your lab. This article
will show you how to specify which, if any, Azure Marketplace images can be used when
creating new VMs in a DevTest Lab.

## Allow or disallow Azure Marketplace images:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, select a lab.

1.  


		Go to the lab, open the Settings blade, then choose "Marketplace images".
		In the toggle option "Allow all Azure Marketplace images to create VMs":
		If all the images are allowed in the lab, choose Yes.
		Otherwise, choose No.
	
## Whitelist the images allowed in the lab:
		When "Allowed all Azure Marketplace images to create VMs" is set to No, a list of Azure Marketplace images is enabled for you to select.
		Select the ones you want to allow for VM creation by checking the corresponding checkboxes.
		Select nothing from the list if you don't allow any Azure Marketplace images to be used in the lab.

## Next steps

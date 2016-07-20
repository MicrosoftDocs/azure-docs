<properties
   pageTitle="Select Linux VM images with the Azure  CLI | Microsoft Azure"
   description="Learn how to determine the publisher, offer, and SKU for images when creating a Linux virtual machine with the Resource Manager deployment model."
   services="virtual-machines-linux"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"
   />

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="06/06/2016"
   ms.author="rasquill"/>

# Select Linux VM images with the Azure CLI

This topic describes how to find publishers, offers, skus, and versions for each location into which you might deploy. To give an example, some commonly used Linux VM images are:

**Table of commonly used Linux images**


| PublisherName                        | Offer                                 | Sku                         |
|:---------------------------------|:-------------------------------------------|:---------------------------------|:--------------------|
| RedHat                           | RHEL                                       | 7.2                              |
| credativ                         | Debian                                     | 8                                | 
| SUSE                             | openSUSE                                   | 13.2                             |
| SUSE                             | SLES                                       | 12-SP1                           |
| OpenLogic                        | CentOS                                     | 7.1                              |
| Canonical                        | UbuntuServer                               | 14.04.4-LTS                      |
| CoreOS                           | CoreOS                                     | Stable                           |


[AZURE.INCLUDE [virtual-machines-common-cli-ps-findimage](../../includes/virtual-machines-common-cli-ps-findimage.md)]

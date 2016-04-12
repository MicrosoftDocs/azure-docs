<properties
   pageTitle="Navigate and select Linux VM images | Microsoft Azure"
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
   ms.date="03/14/2016"
   ms.author="rasquill"/>

# Navigate and select Linux virtual machine images in Azure with CLI or Powershell

This topic describes how to find publishers, offers, skus, and versions for each location into which you might deploy. To give an example, some commonly used Linux VM images are:

**Table of commonly used Linux images**


| PublisherName                        | Offer                                 | Sku                         |
|:---------------------------------|:-------------------------------------------|:---------------------------------|:--------------------|
| OpenLogic                        | CentOS                                     | 7                                |
| OpenLogic                        | CentOS                                     | 7.1                              |
| Canonical                        | UbuntuServer                               | 12.04.5-LTS                      |
| Canonical                        | UbuntuServer                               | 14.04.2-LTS                      |


[AZURE.INCLUDE [virtual-machines-common-cli-ps-findimage](../../includes/virtual-machines-common-cli-ps-findimage.md)]

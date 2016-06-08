<properties
   pageTitle="Navigate and select Windows VM images | Microsoft Azure"
   description="Learn how to determine the publisher, offer, and SKU for images when creating a Windows virtual machine with the Resource Manager deployment model."
   services="virtual-machines-windows"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"
   />

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure"
   ms.date="06/06/2016"
   ms.author="rasquill"/>

# Navigate and select Windows virtual machine images in Azure with PowerShell or the CLI

This topic describes how to find VM image publishers, offers, skus, and versions for each location into which you might deploy. To give an example, some commonly used Windows VM images are:

## Table of commonly used Windows images


| PublisherName                        | Offer                                 | Sku                         |
|:---------------------------------|:-------------------------------------------|:---------------------------------|:--------------------|
| MicrosoftDynamicsNAV             | DynamicsNAV                                | 2015                             |
| MicrosoftSharePoint              | MicrosoftSharePointServer                  | 2013                             |
| MicrosoftSQLServer               | SQL2014-WS2012R2                           | Enterprise-Optimized-for-DW      |
| MicrosoftSQLServer               | SQL2014-WS2012R2                           | Enterprise-Optimized-for-OLTP    |
| MicrosoftWindowsServer           | WindowsServer                              | 2012-R2-Datacenter                  |
| MicrosoftWindowsServer           | WindowsServer                              | 2012-Datacenter               |
| MicrosoftWindowsServer           | WindowsServer                              | 2008-R2-SP1 |
| MicrosoftWindowsServer           | WindowsServer                              | Windows-Server-Technical-Preview |
| MicrosoftWindowsServerEssentials | WindowsServerEssentials                    | WindowsServerEssentials          |
| MicrosoftWindowsServerHPCPack    | WindowsServerHPCPack                       | 2012R2                           |


[AZURE.INCLUDE [virtual-machines-common-cli-ps-findimage](../../includes/virtual-machines-common-cli-ps-findimage.md)]

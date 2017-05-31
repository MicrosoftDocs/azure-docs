---
title: How to troubleshoot common issues during VHD creation | Microsoft Docs
description: Answers to common troubleshooting questions and issues during VHD creation.
services: Azure Marketplace
documentationcenter: ''
author: HannibalSII
manager: ''
editor: ''

ms.assetid: e39563d8-8646-4cb7-b078-8b10ac35b494
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: Azure
ms.workload: na
ms.date: 09/26/2016
ms.author: hascipio; v-divte

---
# How to troubleshoot common issues encountered during VHD creation
This article is provided to help an Azure Marketplace publisher and/or co-administrator that may experience an issue or have common questions while publishing or managing their virtual machine solution(s).

1. How do I change the name of the host?
   
    Once VM is created, users can’t update the name of the host.
2. How to reset the Remote Desktop service or its login password?
   
   * [Reference for Windows VM](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-reset-rdp/)
   * [Reference for Linux VM](https://azure.microsoft.com/documentation/articles/virtual-machines-linux-classic-reset-access/)
3. How to generate new ssh certificates?
   
   Please refer to the link: [https://azure.microsoft.com/documentation/articles/virtual-machines-linux-classic-reset-access/](https://azure.microsoft.com/documentation/articles/virtual-machines-linux-classic-reset-access/)
4. How to configure an open VPN certificate?
   
   Please refer to the link: [https://azure.microsoft.com/documentation/articles/vpn-gateway-point-to-site-create/](https://azure.microsoft.com/documentation/articles/vpn-gateway-point-to-site-create/)
5. What is the support policy for running Microsoft server software in the Microsoft Azure virtual machine environment (infrastructure-as-a-service)?
   
   Please refer to the link: [https://support.microsoft.com/kb/2721672](https://support.microsoft.com/kb/2721672)
6. Do Virtual Machines have any unique identifier?
   
   Azure encodes Azure VM Unique ID in every VM. See details in this blog and documentation.
7. In a VM how can I manage the custom script extension in the startup task?
   
   Please refer to the link: [https://azure.microsoft.com/documentation/articles/virtual-machines-windows-extensions-customscript/](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-extensions-customscript/)
8. How to create a VM from the Azure portal using the VHD that is uploaded to premium storage?
   
   We do not support this feature yet.
9. Is a 32-bit app supported in the Azure Marketplace?
   
   Please refer to the link for details on the support policy: [https://support.microsoft.com/kb/2721672](https://support.microsoft.com/kb/2721672)
10. Every time I am trying to create an image from my VHDs, I get the error “.VHD is already registered with image repository as the resource” in PowerShell. I did not create any image before nor did I find any image with this name in Azure. How do I resolve this?
    
    This usually happen if the user provisioned a VM from this VHD and there is a lock on that VHD. Please check that there is no VM allocated from this VHD. If the error still persist , then please raise a support ticket using this link or from the Publishing portal regarding this (details are given in the answer of question 11).
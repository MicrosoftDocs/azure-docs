---
title: Configure reverse lookup zones for SMTP banner check| Microsoft Docs
description: Shows how to configure reverse lookup zones for SMTP banner check
services: virtual-network
documentationcenter: virtual-network
author: genli
manager: WillChen
editor: ''
tags: azure-resource-manager


ms.service: virtual-network
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 01/25/2018
ms.author: genli
ms.custom: 
---

#  Configure reverse lookup zones for SMTP banner check

This article shows how to use a reverse zone in Azure DNS and create Reverse DNS (PTR) record for SMTP Banner Check. 

## Symptom

If you host a SMTP server in Azure, you may receive the following error when send or receive message from remote mail services:
554: No PTR Record 

## Solution

For virtual IP address in Azure, the reverse records are created in Microsoft owned domain zones, not custom domain zones.

To configure PTR records in Microsoft owned zones, use the -ReverseFqdn property on the PublicIpAddress resource. For more information, see Configure reverse DNS for services hosted in Azure. 

When you configure the PTR records, make sure that the IP address and ReverseFqdn is owned by the subscription. If you try to set ReverseFqdn that does not belong to the subscription, the error message will be received:

    Set-AzureRmPublicIpAddress : ReverseFqdn mail.contoso.com that PublicIPAddress ip01 is trying to use does not belong to subscription <Subscription ID>. One of the following conditions need to be met to establish ownership: 
                        
    1) ReverseFqdn matches fqdn of any public ip resource under the subscription; 
    2) ReverseFqdn resolves to the fqdn (through CName records chain) of any public ip resource under the subcription; 
    3) It resolves to the ip address (through CName and A records chain) of a static public ip resource under the subscription. 

If you manually modify your SMTP banner to match our default reverse FQDN, the remote mail server may still fail since they may expect the SMTP banner host to match the MX record for the domain.
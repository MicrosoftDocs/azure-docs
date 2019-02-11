---
title: Configure reverse lookup zones for an SMTP banner check in Azure
titlesuffix: Azure Virtual Network
description: Describes how to configure reverse lookup zones for an SMTP banner check in Azure
services: virtual-network
documentationcenter: virtual-network
author: genlin
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 10/31/2018
ms.author: genli
---

# Configure reverse lookup zones for an SMTP banner check

This article describes how to use a reverse zone in Azure DNS and create a Reverse DNS (PTR) record for SMTP Banner Check.

## Symptom

If you host an SMTP server in Microsoft Azure, you may receive the following error message when send or receive a message from remote mail servers:

**554: No PTR Record**

## Solution

For a virtual IP address in Azure, the reverse records are created in Microsoft owned domain zones, not custom domain zones.

To configure PTR records in Microsoft owned zones, use the -ReverseFqdn property on the PublicIpAddress resource. For more information, see [Configure reverse DNS for services hosted in Azure](../dns/dns-reverse-dns-for-azure-services.md).

When you configure the PTR records, make sure that the IP address and the reverse FQDN are owned by the subscription. If you try to set a reverse FQDN that does not belong to the subscription, you receive the following error message:

    Set-AzPublicIpAddress : ReverseFqdn mail.contoso.com that PublicIPAddress ip01 is trying to use does not belong to subscription <Subscription ID>. One of the following conditions need to be met to establish ownership:
                        
    1) ReverseFqdn matches fqdn of any public ip resource under the subscription;
    2) ReverseFqdn resolves to the fqdn (through CName records chain) of any public ip resource under the subscription;
    3) It resolves to the ip address (through CName and A records chain) of a static public ip resource under the subscription.

If you manually change your SMTP banner to match our default reverse FQDN, the remote mail server can still fail because it may expect the SMTP banner host to match the MX record for the domain.

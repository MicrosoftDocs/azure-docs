---
title: Troubleshoot outbound SMTP connectivity in Azure | Microsoft Docs
description: Learn how to troubleshoot issues of outbound SMTP connectivity in Azure.
services: virtual-network
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/20/2018
ms.author: genli
---


# Troubleshoot outbound SMTP connectivity issues in Azure

Starting on November 15, 2017, outbound email messages that are sent directly to external domains (such as outlook.com and gmail.com) from a virtual machine (VM) are made available only to certain subscription types in Microsoft Azure. Outbound SMTP connections that use TCP port 25 were blocked. (Port 25 is primarily used for unauthenticated email delivery.)

This change in behavior applies only to new subscriptions and new deployments since November 15, 2017.

## Recommended method of sending email
We recommend you use authenticated SMTP relay services (that typically connect through TCP port 587 or 443 but support other ports, too) to send email from Azure VMs or from Azure App Services. These services are used to maintain IP or domain reputation to minimize the possibility that third-party email providers will reject the message. Such SMTP relay services include but aren't limited to [SendGrid](https://sendgrid.com/partners/azure/). It's also possible you have a secure SMTP relay service that's running on-premises that you can use.

Using these email delivery services isn't restricted in Azure, regardless of the subscription type.

## Enterprise Agreement
For Enterprise Agreement Azure users, there's no change in the technical ability to send email without using an authenticated relay. Both new and existing Enterprise Agreement users can try outbound email delivery from Azure VMs directly to external email providers without any restrictions from the Azure platform. Although it's not guaranteed that email providers will accept incoming email from any given user, delivery attempts won't be blocked by the Azure platform for VMs within Enterprise Agreement subscriptions. You'll have to work directly with email providers to fix any message delivery or SPAM filtering issues that involve specific providers.

## Pay-As-You-Go
If you signed up before November 15, 2017 for the Pay-As-You-Go or Microsoft Partner Network subscription offers, there will be no change in the technical ability to try outbound email delivery. You'll continue to be able to try outbound email delivery from Azure VMs within these subscriptions directly to external email providers without any restrictions from the Azure platform. Again, it's not guaranteed that email providers will accept incoming email from any given user, and users will have to work directly with email providers to fix any message delivery or SPAM filtering issues that involve specific providers.

For Pay-As-You-Go or Microsoft Partner Network subscriptions that were created after November 15, 2017, there will be technical restrictions that block email that's sent directly from VMs within these subscriptions. If you want the ability to send email from Azure VMs directly to external email providers (not using an authenticated SMTP relay), you can make a request to remove the restriction. Requests will be reviewed and approved at Microsoft's discretion, and they'll be granted only after additional anti-fraud checks are made. To make a request, open a support case by using the following issue type: **Technical** > **Virtual Network** > **Connectivity** > **Cannot send email (SMTP/Port 25)**. Make sure that you add details about why your deployment has to send mail directly to mail providers instead of using an authenticated relay.

After a Pay-As-You-Go or Microsoft Partner Network subscription is exempted and the VMs have been 'Stopped' & 'Started' from the Azure portal, all VMs within that subscription will be exempted going forward. The exemption is only applicable to the subscription requested and only applies to Virtual Machine traffic routed directly to the internet. Routing port 25 traffic via Azure PaaS services such as [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/) is unsupported.

> [!NOTE]
> Microsoft reserves the right to revoke this exemption if it's determined that a violation of terms of service has occurred.

## MSDN, Azure Pass, Azure in Open, Education, BizSpark, and Free Trial
If you created an MSDN, Azure Pass, Azure in Open, Education, BizSpark, Azure Sponsorship, Azure Student, Free Trial, or any Visual Studio subscription after November 15, 2017, you'll have technical restrictions that block email that's sent from VMs within these subscriptions directly to email providers. The restrictions are done to prevent abuse. No requests to remove this restriction will be granted.

If you're using these subscription types, you're encouraged to use SMTP relay services, as outlined earlier in this article or change your subscription type.

## Cloud Service Provider (CSP)

If you're using Azure resources through CSP, you can request the CSP to create an unblock exemption request with Microsoft on your behalf if a secure SMTP relay can't be used.

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly by using the following issue type: **Subscription Management** Problem type: **Request to enable Port 25 email flow**.

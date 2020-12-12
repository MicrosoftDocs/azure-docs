---
title: Troubleshoot outbound SMTP connectivity in Azure | Microsoft Docs
description: Learn the recommended method for sending email and how to troubleshoot problems with outbound SMTP connectivity in Azure.
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


# Troubleshoot outbound SMTP connectivity problems in Azure

Starting on November 15, 2017, outbound email messages that are sent directly to external domains (like outlook.com and gmail.com) from a virtual machine (VM) are made available only to certain subscription types in Azure. Outbound SMTP connections that use TCP port 25 were blocked. (Port 25 is used mainly for unauthenticated email delivery.)

This change in behavior applies only to subscriptions and deployments that were created after November 15, 2017.

## Recommended method of sending email

We recommend you use authenticated SMTP relay services to send email from Azure VMs or from Azure App Service. (These relay services typically connect through TCP port 587 or 443 but support other ports.) These services are used to maintain IP or domain reputation to minimize the possibility that third-party email providers will reject messages. Such SMTP relay services include but aren't limited to [SendGrid](https://sendgrid.com/partners/azure/). You might also have a secure SMTP relay service running on-premises that you can use.

Using these email delivery services isn't restricted in Azure, regardless of the subscription type.

## Enterprise Agreement

For Enterprise Agreement Azure users, there's no change in the technical ability to send email without using an authenticated relay. Both new and existing Enterprise Agreement users can try outbound email delivery from Azure VMs directly to external email providers without any restrictions from the Azure platform. It's not guaranteed that email providers will accept incoming email from any given user. But the Azure platform won't block delivery attempts for VMs within Enterprise Agreement subscriptions. You'll have to work directly with email providers to fix any message delivery or SPAM filtering issues that involve specific providers.

## Pay-as-you-go

If you signed up before November 15, 2017, for a pay-as-you-go subscription, there will be no change in your technical ability to try outbound email delivery. You'll still be able to try outbound email delivery from Azure VMs within these subscriptions directly to external email providers without any restrictions from the Azure platform. Again, it's not guaranteed that email providers will accept incoming email from any given user. Users will have to work directly with email providers to fix any message delivery or SPAM filtering issues that involve specific providers.

For pay-as-you-go subscriptions that were created after November 15, 2017, there will be technical restrictions that block email that's sent directly from VMs within these subscriptions. If you want to be able to send email from Azure VMs directly to external email providers (without using an authenticated SMTP relay) and you have an account in good standing with a payment history, you can request to remove the restriction. You can do so in the **Connectivity** section of the **Diagnose and Solve** blade for an Azure Virtual Network resource in the Azure portal. If your request is accepted, your subscription will be enabled or you'll receive instructions for next steps. 

After a pay-as-you-go subscription is exempted and the VMs are stopped and started in the Azure portal, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that's routed directly to the internet.

> [!NOTE]
> Microsoft reserves the right to revoke these exemptions if it's determined that a violation of terms of service has occurred.

## MSDN, Azure Pass, Azure in Open, Education, Azure for Students, Visual Studio, and Free Trial

If you created one of the following subscription types after November 15, 2017, you'll have technical restrictions that block email that's sent from VMs within the subscription directly to email providers:
- MSDN
- Azure Pass
- Azure in Open
- Education
- Azure for Students
- Free Trial
- Any Visual Studio subscription  

The restrictions are in place to prevent abuse. Requests to remove this restriction won't be granted.

If you're using these subscription types, we encourage you to use SMTP relay services, as outlined earlier in this article, or to change your subscription type.

## Cloud service providers (CSP)

If you're using Azure resources through a CSP, you can make a request to remove the restriction in the **Connectivity** section of the **Diagnose and Solve** blade for a virtual network resource in the Azure portal. If your request is accepted, your subscription will be enabled or you'll receive instructions for next steps.

## Microsoft Partner Network (MPN), BizSpark Plus, or Azure Sponsorship

For subscriptions of the following types that were created after November 15, 2017, there will be technical restrictions that block email that's sent directly from VMs within the subscriptions:

- Microsoft Partner Network (MPN)
- BizSpark Plus
- Azure Sponsorship

If you want to be able to send email from Azure VMs directly to external email providers (without using an authenticated SMTP relay), you can make a request by opening a support case by using the following issue type: **Technical** > **Virtual Network** > **Connectivity** > **Cannot send email (SMTP/Port 25)**. Be sure to add details about why your deployment has to send mail directly to mail providers instead of using an authenticated relay. Requests will be reviewed and approved at the discretion of Microsoft. Requests will be granted only after additional antifraud checks are completed. 

After a subscription is exempted and the VMs have been stopped and started in the Azure portal, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that's routed directly to the internet.

## Restrictions and limitations

- Routing port 25 traffic via Azure PaaS services like [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/) isn't supported.

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly. Use this issue type: **Technical** > **Virtual Network** > **Connectivity** > **Cannot send email (SMTP/Port 25)**.

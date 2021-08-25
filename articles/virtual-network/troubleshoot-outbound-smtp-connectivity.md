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
ms.date: 04/28/2021
ms.author: genli
---


# Troubleshoot outbound SMTP connectivity problems in Azure

Outbound email messages that are sent directly to external domains (like outlook.com and gmail.com) on TCP port 25 from a virtual machine (VM) is possible only when the VM is deployed in certain subscription types.

## Recommended method of sending email

We recommend you use authenticated SMTP relay services to send email from Azure VMs or from Azure App Service. (These relay services typically connect through TCP port 587, but they support other ports.) These services are used to maintain IP and domain reputation to minimize the possibility that external domains reject your messages or put them to the SPAM folder. [SendGrid](https://sendgrid.com/partners/azure/) is one such SMTP relay service, but there are others. You might also have an authenticated SMTP relay service on your on-premises servers.

Using these email delivery services isn't restricted in Azure, regardless of the subscription type.

## Enterprise Agreement

For VMs that are deployed in Enterprise Agreement subscriptions, the outbound SMTP connections on TCP port 25 will not be blocked. However, there is no guarantee that external domains will accept the incoming emails from the VMs. If your emails are rejected or filtered by the external domains, you should contact the email service providers of the external domains to resolve the problems. These problems are not covered by Azure support.

## Pay-as-you-go

The Azure platform will block outbound SMTP connections on TCP port 25 for VMs that are deployed in Pay-as-you-go subscriptions. It is possible to have this block removed if your Azure subscription is in good standing and has a sufficient payment history. you can request to have the restriction removed by going to the **Cannot send email (SMTP-Port 25)** section of the **Diagnose and Solve** blade for an Azure Virtual Network resource in the [Azure portal](https://portal.azure.com). 

After a pay-as-you-go subscription is exempted from this block and the VMs are stopped and restarted in the Azure portal, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that's routed directly to the internet.

> [!NOTE]
> Microsoft reserves the right to revoke these exemptions if it's determined that a violation of terms of service has occurred.

## MSDN, Azure Pass, Azure in Open, Education, Azure for Students, Visual Studio, and Free Trial

The Azure platform will block outbound SMTP connections on TCP port 25 for VMs deployed in the following subscription types:

- MSDN
- Azure Pass
- Azure in Open
- Education
- Azure for Students
- Free Trial
- Any Visual Studio subscription  

The restrictions are in place to prevent abuse. Requests to remove these restrictions won't be granted.

If you're using these subscription types, we encourage you to use an authenticated SMTP relay service, as outlined earlier in this article, or to change your subscription type.

## Cloud Solution Provider

The Azure platform will block outbound SMTP connections on TCP port 25 for VMs deployed in Cloud Solution Provider subscriptions. It is possible to have this block removed. To request to have the block removed, go to the **Cannot send email (SMTP-Port 25)** section of the **Diagnose and Solve** blade in the Azure Virtual Network resource in the Azure portal and open a support request.

## Microsoft Partner Network, BizSpark Plus, or Azure Sponsorship

The Azure platform will block outbound SMTP delivery attempts on TCP port 25 for VMs deployed in the following subscriptions:

- Microsoft Partner Network (MPN)
- BizSpark Plus
- Azure Sponsorship

It is possible to have this block removed. To request to have the block removed, go to the **Cannot send email (SMTP-Port 25)** section of the **Diagnose and Solve** blade in the Azure Virtual Network resource in the Azure portal and open a support request.

After the subscription is exempted from this block and the VMs are stopped and restarted, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that is routed directly to the internet.

> [!NOTE]
> Microsoft reserves the right to revoke these exemptions if it is determined that a violation of terms of service has occurred.

## Changing subscription type

If you change your subscription type from Enterprise Agreement to another type of subscription, changes to your deployments may result in outbound SMTP being blocked. If you plan to change your subscription type from Enterprise Agreement to another type of subscription and require outbound SMTP on TCP port 25, be sure to work with support to unblock your subscription prior to changing your subscription type.

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly. Use this issue type: **Technical** > **Virtual Network** > **Cannot send email (SMTP/Port 25)**.

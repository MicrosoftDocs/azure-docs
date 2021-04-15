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
ms.date: 01/04/2021
ms.author: genli
---


# Troubleshoot outbound SMTP connectivity problems in Azure

Outbound email messages that are sent directly to external domains (like outlook.com and gmail.com) on TCP port 25 from a virtual machine (VM) is possible only when the VM is deployed in certain subscription types. 

## Recommended method of sending email

We recommend the use of authenticated SMTP relay services to send email from Azure VMs or from Azure App Service. These relay services typically connect through TCP port 587, but many support other ports as well. These services are used to maintain IP and domain reputation to minimize the possibility that email providers will reject your messages or send them to the spam folder. Typically, they also work with e-mail providers to solve delivery issues on your behalf. [SendGrid](https://sendgrid.com/partners/azure/) is one such SMTP relay service. You might also have an authenticated SMTP relay service running on-premises that you can use.

Using authenticated email delivery services on ports other than 25 is not restricted in Azure, regardless of the subscription type.

## Enterprise Agreement

The Azure platform will not block outbound SMTP delivery attempts on TCP port 25 for VMs deployed in Enterprise Agreement subscriptions. There is no guarantee that email providers will accept incoming email from the VM however. You will have to work directly with email providers to resolve any message delivery or SPAM filtering problems. Azure support will not help with these issues.

## Pay-as-you-go

The Azure platform will block outbound SMTP delivery attempts on TCP port 25 for VMs deployed in Pay-as-you-go subscriptions. It is possible to have this block removed if your Azure subscription is in good standing and has a sufficient payment history. To request to have the block removed, go to the **Connectivity** section of the **Diagnose and Solve** blade in the Azure Virtual Network resource in the Azure portal and open a support request.

After a pay-as-you-go subscription is exempted from this block and the VMs are stopped and restarted, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that is routed directly to the internet.

> [!NOTE]
> Microsoft reserves the right to revoke these exemptions if it is determined that a violation of terms of service has occurred.

## MSDN, Azure Pass, Azure in Open, Education, Azure for Students, Visual Studio, and Free Trial

The Azure platform will block outbound SMTP delivery attempts on TCP port 25 for VMs deployed in the following subscription types:
- MSDN
- Azure Pass
- Azure in Open
- Education
- Azure for Students
- Free Trial
- Any Visual Studio subscription  

This block is in place to prevent abuse. Requests to remove the block on these subscription types will not be granted.

If you are using these subscription types, we encourage you to use an authenticated SMTP relay service as outlined earlier in this article or change to pay-as-you-go.

## Cloud Solution Provider

The Azure platform will block outbound SMTP delivery attempts on TCP port 25 for VMs deployed in Cloud Solution Provider subscriptions. It is possible to have this block removed. To request to have the block removed, go to the **Connectivity** section of the **Diagnose and Solve** blade in the Azure Virtual Network resource in the Azure portal and open a support request.

## Microsoft Partner Network, BizSpark Plus, or Azure Sponsorship

The Azure platform will block outbound SMTP delivery attempts on TCP port 25 for VMs deployed in the following subscriptions:

- Microsoft Partner Network (MPN)
- BizSpark Plus
- Azure Sponsorship

It is possible to have this block removed if your Azure subscription is in good standing and has a sufficient payment history. To request to have the block removed, go to the **Connectivity** section of the **Diagnose and Solve** blade in the Azure Virtual Network resource in the Azure portal and open a support request.

After the subscription is exempted from this block and the VMs are stopped and restarted, all VMs in that subscription are exempted going forward. The exemption applies only to the subscription requested and only to VM traffic that is routed directly to the internet.

> [!NOTE]
> Microsoft reserves the right to revoke these exemptions if it is determined that a violation of terms of service has occurred.

## Changing subscription type

If you change your subscription type from Enterprise Agreement to another type of subscription, changes to your deployments may result in outbound SMTP being blocked. If you plan to change your subscription type from Enterprise Agreement to another type of subscription and require outbound SMTP on TCP port 25, be sure to work with support to unblock your subscription prior to changing your subscription type.

## Need help? Contact support

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly. Use this issue type: **Technical** > **Virtual Network** > **Connectivity** > **Cannot send email (SMTP/Port 25)**.

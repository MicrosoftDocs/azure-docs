---
title: Troubleshoot outbound SMTP connectivity in Azure
description: Learn the recommended method for sending email and how to troubleshoot problems with outbound SMTP connectivity in Azure.
services: virtual-network
author: asudbring
manager: dcscontentpm
ms.service: azure-virtual-network
ms.topic: troubleshooting
ms.date: 12/20/2023
ms.author: allensu
---

# Troubleshoot outbound SMTP connectivity problems in Azure

Outbound email messages that are sent directly to external domains (such as outlook.com and gmail.com) from a virtual machine (VM) are made available only to certain subscription types in Microsoft Azure. 

> [!IMPORTANT]
> For the following examples, the process applies mainly to Virtual Machines & VM Scale Sets resources (`Microsoft.Compute/virtualMachines` & `Microsoft.Compute/virtualMachineScaleSets`). It's possible to use port 25 for outbound communication on [Azure App Service](https://azure.microsoft.com/services/app-service) and [Azure Functions](https://azure.microsoft.com/services/functions) through the [virtual network integration feature](/azure/app-service/overview-vnet-integration#application-routing) or when using [App Service Environment v3](../app-service/environment/networking.md#network-routing). It's also possible to send port 25 outbound communication through Azure Firewall. However, the following subscription limitations described still apply. Sending email on Port 25 is unsupported for all other Azure Platform-as-a-Service (PaaS) resources. 

## Recommended method of sending email

We recommend you use authenticated SMTP relay services to send email from Azure VMs or from Azure App Service. Connections to authenticated SMTP relay services are typically on TCP port 587 which is not blocked. These services are used in part to maintain IP reputation which is critical for delivery reliability. [Azure Communication Services](/azure/communication-services/overview) offers an [authenticated SMTP relay service](/azure/communication-services/quickstarts/email/send-email-smtp/smtp-authentication). Ensure that the [default rate limits](/azure/communication-services/concepts/service-limits#rate-limits) are appropriate for your application and open a support case to raise them if needed.

Using these email delivery services on authenticated SMTP port 587 isn't restricted in Azure, regardless of the subscription type.

## Enterprise and MCA-E

For VMs and Azure Firewall that are deployed in standard Enterprise Agreement or Microsoft Customer Agreement for enterprise (MCA-E) subscriptions, the outbound SMTP connections on TCP port 25 aren't blocked. However, there's no guarantee that external domains accept the incoming emails from the VMs and Azure Firewall. For emails rejected or filtered by the external domains, contact the email service providers of the external domains to resolve the problems. These problems aren't covered by Azure support.

For Enterprise Dev/Test subscriptions, port 25 is blocked by default. It's possible to have this block removed. To request to have the block removed, go to the **Cannot send email (SMTP-Port 25)** section of the **Diagnose and Solve** section in the Azure Virtual Network resource in the Azure portal and run the diagnostic. This process exempts the qualified enterprise dev/test subscriptions automatically.

After the subscription is exempted from this block, the VMs must be are stopped, de-allocated, and then restarted to get the new network policy, all VMs in that subscription are exempted going forward. If the a Virtual Ntwork owned by the exempted subscription has a delegated subnet (to an App Service Environment for example), you must add and remove a new temporary subnet in the Virtual Network. The exemption applies only to the subscription requested and only to VM traffic that is routed directly to the internet. 

## All Other Subscription Types 

The Azure platform blocks outbound SMTP connections on TCP port 25 for deployed VMs. This block is to ensure better security for Microsoft partners and customers, protect Microsoft's Azure platform, and conform to industry standards. 

If you're using a subscription type that isn't an Enterprise Agreement or MCA-E, we encourage you to use an authenticated SMTP relay service, as outlined earlier in this article.

## Changing subscription type

If you change your subscription type from Enterprise Agreement or MCA-E to another type of subscription, changes to your deployments might result in outbound SMTP being blocked.  

## Need help? Contact support

If you're using an Enterprise Agreement or MCA-E subscription and still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly. Use this issue type: **Technical** > **Virtual Network** > **Cannot send email (SMTP/Port 25)**.

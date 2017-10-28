---
title: Connectivity and networking issues for Microsoft Azure Cloud Services FAQ| Microsoft Docs
description: This article lists the frequently asked questions about connectivity and networking for Microsoft Azure Cloud Services.
services: cloud-services
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 84985660-2cfd-483a-8378-50eef6a0151d
ms.service: cloud-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 6/9/2017
ms.author: v-six

---
# Connectivity and networking issues for Azure Cloud Services: Frequently asked questions (FAQs)

This article includes frequently asked questions about connectivity and networking issues for [Microsoft Azure Cloud Services](https://azure.microsoft.com/services/cloud-services). You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## I can't reserve an IP in a multi-VIP cloud service
First, make sure that the virtual machine instance that you're trying to reserve the IP for is turned on. Second, make sure that you're using Reserved IPs for both the staging and production deployments. **Do not** change the settings while the deployment is upgrading.

## How do I remote desktop when I have an NSG?
Add rules to the NSG that allow traffic on ports **3389** and **20000**.  Remote Desktop uses port **3389**.  Cloud Service instances are load balanced, so you can't directly control which instance to connect to.  The *RemoteForwarder* and *RemoteAccess* agents manage RDP traffic and allow the client to send an RDP cookie and specify an individual instance to connect to.  The *RemoteForwarder* and *RemoteAccess* agents require that port **20000** be opened, which may be blocked if you have an NSG.

## Can I ping a cloud service?

No, not by using the normal "ping"/ICMP protocol. The ICMP protocol is not permitted through the Azure load balancer.

To test connectivity, we recommend that you do a port ping. While Ping.exe uses ICMP, other tools, such as PSPing, Nmap, and telnet allow you to test connectivity to a specific TCP port.

For more information, see [Use port pings instead of ICMP to test Azure VM connectivity](https://blogs.msdn.microsoft.com/mast/2014/06/22/use-port-pings-instead-of-icmp-to-test-azure-vm-connectivity/).

## How do I prevent receiving thousands of hits from unknown IP addresses that indicate some sort of malicious attack to the cloud service?
Azure implements a multilayer network security to protect its platform services against distributed denial-of-service (DDoS) attacks. The Azure DDoS defense system is part of Azure’s continuous monitoring process, which is continually improved through penetration-testing. This DDoS defense system is designed to withstand not only attacks from the outside but also from other Azure tenants. For more detail, see [Microsoft Azure Network Security](http://download.microsoft.com/download/C/A/3/CA3FC5C0-ECE0-4F87-BF4B-D74064A00846/AzureNetworkSecurity_v3_Feb2015.pdf).

You can also create a startup task to selectively block some specific IP addresses. For more information, see [Block a specific IP address](cloud-services-startup-tasks-common.md#block-a-specific-ip-address).

## When I try to RDP to my cloud service instance, I get the message, "The user account has expired."
You may get the error message "This user account has expired" when you bypass the expiration date that is configured in your RDP settings. You can change the expiration date from the portal by following these steps:
1. Log in to the Azure Management Console (https://manage.windowsazure.com), navigate to your cloud service, and select the **Configure** tab.
2. Select **Remote**.
3. Change the "Expires On" date, and then save the configuration.

You now should be able to RDP to your machine.

## Why is LoadBalancer not balancing traffic equally?
For information about how internal load balancer works, see [Azure Load Balancer new distribution mode](https://azure.microsoft.com/blog/azure-load-balancer-new-distribution-mode/).

The distribution algorithm used is a 5-tuple (source IP, source port, destination IP, destination port, protocol type) hash to map traffic to available servers. It provides stickiness only within a transport session. Packets in the same TCP or UDP session will be directed to the same datacenter IP (DIP) instance behind the load balanced endpoint. When the client closes and re-opens the connection or starts a new session from the same source IP, the source port changes and causes the traffic to go to a different DIP endpoint.

---
title: Check Point CloudGuard Connect with Azure Firewall Manager overview
description: Learn using Check Point CloudGuard Connect with Azure Firewall Manager
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: conceptual
ms.date: 10/30/2020
ms.author: victorh
---

# Check Point CloudGuard Connect with Azure Firewall Manager overview

Check Point CloudGuard Connect is a Trusted Security Partner in Azure Firewall Manager. It protects globally distributed branch office to Internet (B2I) or virtual network to Internet (V2I) connections with advanced threat prevention. 

With a simple configuration in Azure Firewall Manager, you can route branch hub and virtual network connections to the Internet through the CloudGuard Connect security as a service (SECaaS). Traffic is protected in transit from your hub to the Check Point cloud service in IPsec VPN tunnels.

When you enable auto-sync in the Check Point portal, any resource marked as *secured* in the Azure portal is automatically secured. This means that you do not have to manage your assets twice. You simply choose to secure them once in the Azure portal.

Check Point unifies multiple security services under one umbrella. Integrated security traffic is decrypted once and inspected in a single pass. Application Control, URL Filtering, and Content Awareness (DLP) enforce safe web use and protect your data. IPS and Antivirus protect users from known network exploits. Anti-Bot blocks connections to Command and Control servers and alerts you if a host is infected.

Threat Emulation (sandboxing) protects users from unknown and zero-day threats. Check Point SandBlast Zero-Day Protection is a cloud-hosted sand-boxing technology where files are quickly quarantined and inspected. It runs in a virtual sandbox to discover malicious behavior before it enters your network. It prevents threats before the damage is done to save staff valuable time responding to threats. 

## Deployment example

Watch the following video to see how to deploy Check Point CloudGuard Connect as a trusted Azure security partner.


> [!VIDEO https://youtu.be/C8AuN76DEmU]

## Next steps

- [Deploy a security partner provider](deploy-trusted-security-partner.md)
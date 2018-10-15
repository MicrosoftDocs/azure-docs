---
title: Azure Stack firewall planning for Azure Stack integrated systems | Microsoft Docs
description: Describes the Azure Stack firewall considerations for multi-node Azure Stack Azure-connected deployments.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: wfayed

---
# Azure Stack firewall integration
It's recommended that you use a firewall device to help secure Azure Stack. Although firewalls can help with things like distributed denial-of-service (DDOS) attacks, intrusion detection and content inspection, they can also become a throughput bottleneck for Azure storage services like blobs, tables, and queues.

Based on the identity model Azure Active Directory (Azure AD) or Windows Server Active Directory Federation Services (AD FS), you might be required to publish the AD FS endpoint. If a disconnected deployment mode is used, you must publish the AD FS endpoint. For more information, see the [datacenter integration identity article](azure-stack-integrate-identity.md).

The Azure Resource Manager (administrator), administrator portal, and Key Vault (administrator) endpoints do not necessarily require external publishing. For example, as a service provider, you might want to limit the attack surface and only administer Azure Stack from inside your network, and not from the internet.

For enterprise organizations, the external network can be the existing corporate network. In such a scenario, you must publish those endpoints to operate Azure Stack from the corporate network.

### Network Address Translation
Network Address Translation (NAT) is the recommended method to allow the deployment virtual machine (DVM) to access the external resources and the internet during deployment as well as the Emergency Recovery Console (ERCS) VMs or Privileged End Point (PEP) during registration and troubleshooting.

NAT can also be an alternative to Public IP addresses on the external network or public VIPs. However, it is not recommended to do so because it limits the tenant user experience and increases complexity. The two options would be a 1:1 NAT that still requires one public IP per user IP on the pool or many: 1 NAT that requires a NAT rule per user VIP that contains associations to all ports a user might use.

Some of the downsides of using NAT for Public VIP are:
- NAT adds overhead when managing firewall rules because users control their own endpoints and their own publishing rules in the software-defined networking (SDN) stack. Users must contact the Azure Stack operator to get their VIPs published, and to update the port list.
- While NAT usage limits the user experience, it gives full control to the operator over publishing requests.
- For hybrid cloud scenarios with Azure, consider that Azure does not support setting up a VPN tunnel to an endpoint using NAT.

### SSL decryption
It is currently recommended to disable SSL decryption on all Azure Stack traffic. If it is supported in future updates, guidance will be provided about how to enable SSL decryption for Azure Stack.

## Edge firewall scenario
In an edge deployment, Azure Stack is deployed directly behind the edge router or the firewall. In these scenarios, it is supported for the firewall to be above the border (Scenario 1) where it supports both active-active and active-passive firewall configurations or acting as the border device (Scenario 2) where it only supports active-active firewall configuration relying on Equal Cost Multi Path (ECMP) with either BGP or static routing for failover.

Typically, public routable IP addresses are specified for the public VIP pool from the external network at deployment time. In an edge scenario, it is not recommended to use public routable IPs on any other network for security purposes. This scenario enables a user to experience the full self-controlled cloud experience as in a public cloud like Azure.  

![Azure Stack edge firewall example](.\media\azure-stack-firewall\firewallScenarios.png)

## Enterprise intranet or perimeter network firewall scenario
In an enterprise intranet or perimeter deployment, Azure Stack is deployed on a multi-zoned firewall or in between the edge firewall and the internal, corporate network firewall. Its traffic is then distributed between the secure, perimeter network (or DMZ), and unsecure zones as described below:

- **Secure zone**: This is the internal network that uses internal or corporate routable IP addresses. The secure network can be divided, have internet outbound access through NAT on the Firewall, and is usually accessible from anywhere inside your datacenter via the internal network. All Azure Stack networks should reside in the secure zone except for the external network's public VIP pool.
- **Perimeter zone**. The perimeter network is where external or internet facing applications like Web servers are typically deployed. It is usually monitored by a firewall to avoid attacks like DDoS and intrusion (hacking) while still allowing specified inbound traffic from the internet. Only the external network public VIP pool of Azure Stack should reside in the DMZ zone.
- **Unsecure zone**. This is the external network, the internet. It **is not** recommended to deploy Azure Stack in the unsecure zone.

![Azure Stack perimeter network example](.\media\azure-stack-firewall\perimeter-network-scenario.png)

## Learn more
Learn more about [ports and protocols used by Azure Stack endpoints](azure-stack-integrate-endpoints.md).

## Next steps
[Azure Stack PKI requirements](azure-stack-pki-certs.md)


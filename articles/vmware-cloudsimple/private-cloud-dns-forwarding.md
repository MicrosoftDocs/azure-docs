--- 
title: Azure VMware Solution - DNS forwarding from private cloud to on-premises
description: Describes how to enable your CloudSimple Private Cloud DNS server to forward lookup of on-premises resources
author: sharaths-cs
ms.author: b-shsury 
ms.date: 02/29/2020 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Enable CloudSimple Private Cloud DNS servers to forward DNS lookup of on-premises resources to your DNS servers

Private Cloud DNS servers can forward DNS lookup for any on-premises resources to your DNS servers.  Enabling the lookup allows Private Cloud vSphere components to look up any services running in your on-premises environment and communicate with them using fully qualified domain names (FQDN).

## Scenarios 

Forwarding DNS lookup for your on-premises DNS server allows you to use your Private Cloud for the following scenarios:

* Use Private Cloud as a disaster recovery setup for your on-premises VMware solution
* Use on-premises Active Directory as an identity source for your Private Cloud vSphere
* Use HCX for migrating virtual machines from on-premises to Private Cloud

## Before you begin

A network connection must be present from your Private Cloud network to your on-premises network for DNS forwarding to work.  You can set up network connection using:

* [Connect from on-premises to CloudSimple using ExpressRoute](on-premises-connection.md)
* [Set up a Site-to-Site VPN gateway](https://docs.microsoft.com/azure/vmware-cloudsimple/vpn-gateway#set-up-a-site-to-site-vpn-gateway)

Firewall ports must be opened on this connection for DNS forwarding to work.  Ports used are TCP port 53 or UDP port 53.

> [!NOTE]
> If you are using Site-to-Site VPN, your on-premises DNS server subnet must be added as a part of on-premises prefixes.

## Request DNS forwarding from Private Cloud to on-premises

To enable DNS forwarding from Private Cloud to on-premises, submit a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest), providing the following information.

* Issue type: **Technical**
* Subscription: **Subscription where CloudSimple service is deployed**
* Service: **VMware Solution by CloudSimple**
* Problem type: **Advisory or How do I...**
* Problem subtype: **Need help with NW**
* Provide the domain name of your on-premises domain in the details pane.
* Provide the list of your on-premises DNS servers to which the lookup will be forwarded from your private cloud in the details pane.

## Next steps

* [Learn more about on-premises firewall configuration](on-premises-firewall-configuration.md)
* [On-premises DNS server configuration](on-premises-dns-setup.md)

--- 
title: Azure VMware Solution by CloudSimple - Set up workload DNS and DHCP for Private Cloud
description: Describes how to set up DNS and DHCP for applications and workloads running in your CloudSimple Private Cloud environment
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/16/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Set up DNS and DHCP applications and workloads in your CloudSimple Private Cloud

Applications and workloads running in a Private Cloud environment require name resolution and DHCP services for lookup and IP address assignment.  A proper DHCP and DNS infrastructure is required to provide these services.  You can configure a virtual machine to provide these services in your Private Cloud environment.  

## Prerequisites

* A distributed port group with VLAN configured
* Route setup to on-premises or Internet-based DNS servers
* Virtual machine template or ISO to create a virtual machine

## Linux-based DNS server setup

Linux offers various packages for setting up DNS servers.  Here is an [example setup from DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-configure-bind-as-a-private-network-dns-server-on-ubuntu-18-04) with instructions for setting up an open-source BIND DNS server.

## Windows-based setup

These Microsoft topics describe how to set up a Windows server as a DNS server and as a DHCP server.

* [Windows Server as DNS Server](https://docs.microsoft.com/windows-server/networking/dns/dns-top)
* [Windows Server as DHCP Server](https://docs.microsoft.com/windows-server/networking/technologies/dhcp/dhcp-top)

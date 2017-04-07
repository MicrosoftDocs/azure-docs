---
title: Understanding DNS in Azure Stack | Microsoft Docs
description: Understanding DNS features and capabilities in Azure Stack
services: azure-stack
documentationcenter: ''
author: ScottNapolitan
manager: darmour
editor: ''

ms.assetid: 60f5ac85-be19-49ac-a7c1-f290d682b5de
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 4/6/2017
ms.author: scottnap

---
# Introducing iDNS for Azure Stack
================================

iDNS is a new feature in Technology Preview 2 for Azure Stack that
allows you to resolve external DNS names (such as http://www.bing.com).
It also allows you to register internal virtual network names. By doing so,
you can resolve VMs on the same virtual network by name rather than IP address,
without having to provide custom DNS server entries.

It’s something that’s always been there in Azure, but now it's available in Windows Server 2016 and Azure Stack, too.

## What does iDNS do?
With iDNS in Azure Stack, you get the following capabilities, without
having to specify custom DNS server entries.

* Shared DNS name resolution services for tenant workloads.
* Authoritative DNS service for name resolution and DNS registration within the tenant virtual network.
* Recursive DNS service for resolution of Internet names from tenant VMs. Tenants no longer need to specify custom DNS entries to resolve Internet names (for example, www.bing.com).

You can still bring your own DNS and use custom DNS servers
if you want. But now, if you just want to be able to resolve Internet DNS
names and be able to connect to other virtual machines in the same
virtual network, you don’t need to specify anything and it will just
work.

## What does iDNS not do?
What iDNS does not allow you to do is create a
DNS record for a name that can be resolved from outside the virtual
network.

In Azure, you have the option of specifying a DNS name label that
can be associated with a public IP address. You can choose the label
(prefix), but Azure chooses the suffix, which is based on the region in
which you create the public IP address.

![Screenshot of DNS name label](media/azure-stack-understanding-dns-in-tp2/image3.png)

In the image above, Azure will create an “A” record in DNS for the DNS
name label specified under the zone **westus.cloudapp.azure.com**. The
prefix and the suffix together compose a Fully Qualified Domain Name
(FQDN) that can be resolved from anywhere on the public Internet.

In TP2, Azure Stack only supports iDNS for internal name
registration, so it cannot do the following.

* Create a DNS record under an existing hosted DNS zone (for example,
  local.azurestack.external).
* Create a DNS zone (such as Contoso.com).
* Create a record under your own custom DNS zone.
* Support the purchase of domain names.

## Changes in DNS from Azure Stack TP1
In the Technology Preview 1 (TP1) release of Azure Stack, you had to
provide custom DNS servers if you wanted to be able to resolve hosts by
name rather than by IP address. This means that if you were creating a
virtual network or a VM, you had to provide at least one DNS server
entry. For the TP1 POC environment, this meant entering the IP of
the POC Fabric DNS server, namely 192.168.200.2.

If you created a VM via the portal, you had to select **Custom
DNS** in the virtual network or ethernet adapter settings.

![Screenshot of specifying a custom DNS server](media/azure-stack-understanding-dns-in-tp2/image1.png)

In TP2, you can select Azure DNS and do not need to specify custom DNS
server entries.

If you created a VM via a template with your own image, you
had to add the **DHCPOptions** property and the DNS server in order to
get the DNS name resolution to work. The following image shows what this looked like.

![Screenshot of DHCPOptions property](media/azure-stack-understanding-dns-in-tp2/image2.png)

In TP2, you no longer need to make these changes to your VM templates to
allow your VMs to resolve Internet names. They should just work.


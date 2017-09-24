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
ms.date: 7/10/2017
ms.author: scottnap

---
# Introducing iDNS for Azure Stack
================================

iDNS is a feature in Azure Stack that
allows you to resolve external DNS names (such as http://www.bing.com).
It also allows you to register internal virtual network names. By doing so,
you can resolve VMs on the same virtual network by name rather than IP address,
without having to provide custom DNS server entries.

It’s something that’s always been there in Azure, but it's available in Windows Server 2016 and Azure Stack too.

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

Azure Stack only supports iDNS for internal name
registration, so it cannot do the following.

* Create a DNS record under an existing hosted DNS zone (for example,
  local.azurestack.external).
* Create a DNS zone (such as Contoso.com).
* Create a record under your own custom DNS zone.
* Support the purchase of domain names.


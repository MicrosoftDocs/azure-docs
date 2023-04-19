---
title: Delegate a subdomain - Azure DNS
description: With this learning path, get started delegating an Azure DNS subdomain.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 09/27/2022
ms.author: greglin
---

# Delegate an Azure DNS subdomain

You can use the Azure portal to delegate a DNS subdomain. For example, if you own the contoso.com domain, you may delegate a subdomain called *engineering* to another separate zone that you can administer separately from the contoso.com zone.

If you prefer, you can also delegate a subdomain using [Azure PowerShell](delegate-subdomain-ps.md).

## Prerequisites

To delegate an Azure DNS subdomain, you must first delegate your public domain to Azure DNS. See [Delegate a domain to Azure DNS](./dns-delegate-domain-azure-dns.md) for instructions on how to configure your name servers for delegation. Once your domain is delegated to your Azure DNS zone, you can delegate your subdomain.

> [!NOTE]
> Contoso.com is used as an example throughout this article. Substitute your own domain name for contoso.com.

## Create a zone for your subdomain

First, create the zone for the **engineering** subdomain.

1. From the Azure portal, select **+ Create a resource**.

1. Search for **DNS zone** and then select **Create**.

1. On the **Create DNS zone** page, select the resource group for your zone. You may want to use the same resource group as the parent zone to keep similar resources together.

1.  Enter `engineering.contoso.com` for the **Name** and then select **Create**.

1. After the deployment succeeds, go to the new zone.

## Note the name servers

Next, note the four name servers for the engineering subdomain.

On the **engineering** zone overview page, note the four name servers for the zone. You'll need these name servers at a later time.

## Create a test record

Create an **A** record to use for testing. For example, create a **www** A record and configure it with a **10.10.10.10** IP address.

## Create an NS record

Next, create a name server (NS) record  for the **engineering** zone.

1. Navigate to the zone for the parent domain.

1. Select **+ Record set** at the top of the overview page.

1. On the **Add record set** page, type **engineering** in the **Name** text box.

1. For **Type**, select **NS**.

1. Under **Name server**, enter the four name servers that you noted previously from the **engineering** zone.

1. Select **OK** to save the record.

## Test the delegation

Use nslookup to test the delegation.

1. Open a PowerShell window.

1. At command prompt, type `nslookup www.engineering.contoso.com.`

1. You should receive a non-authoritative answer showing the address **10.10.10.10**.

## Next steps

Learn how to [configure reverse DNS for services hosted in Azure](dns-reverse-dns-for-azure-services.md).

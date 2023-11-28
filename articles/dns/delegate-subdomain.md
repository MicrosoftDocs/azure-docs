---
title: Delegate a subdomain - Azure DNS
description: With this learning path, get started delegating an Azure DNS subdomain.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 11/27/2023
ms.author: greglin
---

# Delegate an Azure DNS subdomain

You can use the Azure portal to delegate a DNS subdomain. For example, if you own the adatum.com domain, you may delegate a subdomain called *engineering* to another separate zone that you can administer separately from the adatum.com zone.

If you prefer, you can also delegate a subdomain using [Azure PowerShell](delegate-subdomain-ps.md).

## Prerequisites

To delegate an Azure DNS subdomain, you must first delegate your parent public domain to Azure DNS. See [Delegate a domain to Azure DNS](./dns-delegate-domain-azure-dns.md) for instructions on how to configure your name servers for delegation. Once your domain is delegated to Azure DNS, you can delegate your subdomain.

> [!NOTE]
> Adatum.com is used as an example of a parent DNS zone. Substitute your own domain name for adatum.com.

## Create a zone for your subdomain

First, create the zone for the **engineering** subdomain.

1. From the Azure portal, select **+ Create a resource**.
2. Search for **DNS zone** and then select **Create**.
3. On the **Create DNS zone** page, select the resource group for your zone. to keep similar resources together, use the same resource group as the parent zone . You can also choose a different resource group if desired.
4. Under **Instance details**, select **This zohne is a child of an existing zone already hosted in Azure DNS**. 
5. Select the parent zone subscription and name.
6. Enter `engineering` next to **Name**, select **Review create** and then select **Create**.
7. After the deployment succeeds, go to the new zone.

## Note the name servers

Next, note the four name servers for the engineering subdomain.

On the **engineering** zone overview page, note the four name servers for the zone. You'll need these name servers at a later time.

## Create a test record

Create an **A** record to use for testing. For example, create a **www** A record and configure it with a **10.10.10.10** IP address.

## Create an NS record

Next, create a name server (NS) record  for the **engineering** zone.

1. Navigate to the zone for the parent domain.
2. Select **+ Record set** at the top of the overview page.
3. On the **Add record set** page, type **engineering** in the **Name** text box.
4. For **Type**, select **NS**.
5. Under **Name server**, enter the four name servers that you noted previously from the **engineering** zone.
6. Select **OK** to save the record.

## Test the delegation

Use nslookup to test the delegation.

1. Open a command prompt.
2. At command prompt, type `nslookup www.engineering.contoso.com.`
3. You should receive a non-authoritative answer showing the address **10.10.10.10**.

## Next steps

Learn how to [configure reverse DNS for services hosted in Azure](dns-reverse-dns-for-azure-services.md).

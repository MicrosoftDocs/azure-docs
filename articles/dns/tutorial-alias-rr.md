---
title: Tutorial - Create an Azure DNS alias record to refer to an resource record in the zone.
description: This tutorial shows you how to configure an Azure DNS alias record to reference a resource record within the zone.
services: dns
author: vhorne
ms.service: dns
ms.topic: tutorial
ms.date: 9/25/2018
ms.author: victorh
#Customer intent: As an experienced network administrator I want to configure Azure an DNS alias record to refer to a resource record within the zone.
---

# Tutorial: Configure an alias record to refer to an Azure Public IP address

Alias records referenced to other record sets of the same type. For example, you can have a DNS CNAME record set be an alias to another CNAME recordset of the same type. This is useful if you want to have some record sets be aliases and some as non-aliases in terms of behavior.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an alias record
> * Test the alias record


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain, including the ability to set the name server (NS) records for the domain.

For instructions to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).


## Create an alias record

Create an alias record that points to a resource record in the zone.

### Create the target resource record
1. Click your Azure DNS zone to open the zone.
2. Click **Record set**.
3. In the **Name** text box **note**.
4. For the **Type** select **TXT**.
5. Type **This is an alias record test** for the TXT record data.
7. Need UI for the next step.

### Create the alias record
1. Click your Azure DNS zone to open the zone.
2. Click **Record set**.
3. In the **Name** text box **test**.
4. For the **Type** select **TXT**.
5. Click the **Alias Record Set** check box.
6. Need UI for the next step.

## Test the alias record

1. Go to NSlookup site.
2. look up the TXT record and alias record.
3. Change the TXT record data.
4. Lookup th alias record and note the change.

## Clean up resources

When no longer needed, you can delete the **note** and **test** resource records in your zone.


## Next steps

In this tutorial, you've created an alias record to refer to a resource record within the zone. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

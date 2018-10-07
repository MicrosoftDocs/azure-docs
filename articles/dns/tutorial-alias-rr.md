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

# Tutorial: Create an alias record to refer to a zone resource record

Alias records can reference other record sets of the same type. For example, you can have a DNS CNAME record set be an alias to another CNAME record set of the same type. This is useful if you want to have some record sets as aliases and some as non-aliases in terms of behavior.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an alias record for a resource record in the zone
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
3. In the **Name** text box type **server**.
4. For the **Type**, select **A**.
5. In the **IP ADDRESS** text box, type **10.10.10.10**.
6. Click **OK**.

### Create the alias record
1. Click your Azure DNS zone to open the zone.
2. Click **Record set**.
3. In the **Name** text box type **test**.
4. For the **Type**, select **A**.
5. Click **Yes** in the **Alias Record Set** check box and select the **Zone record set** option.
6. For the **Zone record set**, select the **server** record.
7. Click **OK**.

## Test the alias record

1. Start you favorite nslookup tool. One option is to browse to [https://network-tools.com/nslook](https://network-tools.com/nslook).
2. Set the query type for A records and lookup **test.\<your domain name\>**. You should get **10.10.10.10** for the answer.
3. In the Azure portal, change the **server** A record to **10.11.11.11**.
4. Wait a few minutes, and then use nslookup again for **test** record.
5. You should get **10.11.11.11** for the answer.

## Clean up resources

When no longer needed, you can delete the **server** and **test** resource records in your zone.


## Next steps

In this tutorial, you've created an alias record to refer to a resource record within the zone. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

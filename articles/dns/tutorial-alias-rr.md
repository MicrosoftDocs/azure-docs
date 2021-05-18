---
title: 'Tutorial: Create an alias record to refer to a resource record in a zone'
titleSuffix: Azure DNS
description: This tutorial shows you how to configure an Azure DNS alias record to reference a resource record within the zone.
services: dns
author: rohinkoul
ms.service: dns
ms.topic: tutorial
ms.date: 04/19/2021
ms.author: rohink
#Customer intent: As an experienced network administrator, I want to configure Azure an DNS alias record to refer to a resource record within the zone.
---

# Tutorial: Create an alias record to refer to a zone resource record

Alias records can reference other record sets of the same type. For example, you can have a DNS CNAME record set be an alias to another CNAME record set of the same type. This capability is useful if you want to have some record sets as aliases and some as non-aliases in terms of behavior.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an alias record for a resource record in the zone.
> * Test the alias record.


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

For instructions to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).


## Create an alias record

Create an alias record that points to a resource record in the zone.

### Create the target resource record
1. Select your Azure DNS zone to open the zone.
2. Select **Record set**.
3. In the **Name** text box, enter **server**.
4. For the **Type**, select **A**.
5. In the **IP ADDRESS** text box, enter **10.10.10.10**.
6. Select **OK**.

### Create the alias record
1. Select your Azure DNS zone to open the zone.
2. Select **Record set**.
3. In the **Name** text box, enter **test**.
4. For the **Type**, select **A**.
5. Select **Yes** in the **Alias Record Set** check box. Then select the **Zone record set** option.
6. For the **Zone record set**, select the **server** record.
7. Select **OK**.

## Test the alias record

1. Start your favorite nslookup tool. One option is to browse to [https://network-tools.com/nslook](https://network-tools.com/nslook).
2. Set the query type for A records, and look up **test.\<your domain name\>**. The answer is **10.10.10.10**.
3. In the Azure portal, change the **server** A record to **10.11.11.11**.
4. Wait a few minutes, and then use nslookup again for the **test** record. The answer is **10.11.11.11**.

## Clean up resources

When you no longer need the resources created for this tutorial, delete the **server** and **test** resource records in your zone.


## Next steps

In this tutorial, you created an alias record to refer to a resource record within the zone. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)

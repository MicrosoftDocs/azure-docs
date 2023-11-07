---
title: 'Tutorial: Create an alias record to refer to a resource record in a zone'
titleSuffix: Azure DNS
description: In this tutorial, you learn how to configure an alias record to reference a resource record within the zone.
author: greg-lindsay
ms.author: greglin
ms.service: dns
services: dns
ms.topic: tutorial
ms.date: 09/27/2022
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
#Customer intent: As an experienced network administrator, I want to configure Azure an DNS alias record to refer to a resource record within the zone.
---

# Tutorial: Create an alias record to refer to a zone resource record

Alias records can reference other record sets of the same type. For example, you can have a DNS CNAME record set be an alias to another CNAME record set of the same type. This capability is useful if you want to have some record sets as aliases and some as non-aliases in terms of behavior.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource record in the zone.
> * Create an alias record for the resource record.
> * Test the alias record.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure account with an active subscription.
* A domain name hosted in Azure DNS. If you don't have an Azure DNS zone, you can [create a DNS zone](./dns-delegate-domain-azure-dns.md#create-a-dns-zone), then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an alias record

Create an alias record that points to a resource record in the zone.

### Create the target resource record
1. In the Azure portal, enter *contoso.com* in the search box at the top of the portal, and then select **contoso.com** DNS zone from the search results.
1. In the **Overview** page, select the **+ Record set** button.
1. In the **Add record set**, enter *server* in the **Name**.
1. Select **A** for the **Type**.
1. Enter *10.10.10.10* in the **IP address**.
1. Select **OK**.

    :::image type="content" source="./media/tutorial-alias-rr/add-record-set-inline.png" alt-text="Screenshot of adding the target record set in the Add record set page." lightbox="./media/tutorial-alias-rr/add-record-set-expanded.png":::

### Create the alias record
1. In the **Overview** page of **contoso.com** DNS zone, select the **+ Record set** button.
1. In the **Add record set**, enter *test* in the **Name**.
1. Select **A** for the **Type**.
1. Select **Yes** for the **Alias record set**, and then select the **Zone record set** for the **Alias type**.
1. Select the **server** record for the **Zone record set**.
1. Select **OK**.

    :::image type="content" source="./media/tutorial-alias-rr/add-alias-record-set-inline.png" alt-text="Screentshot of adding the alias record set in the Add record set page." lightbox="./media/tutorial-alias-rr/add-alias-record-set-expanded.png":::

## Test the alias record

After adding the alias record, you can verify that it's working by using a tool such as *nslookup* to query the `test` A record. 

> [!TIP]
> You may need to wait at least 10 minutes after you add a record to successfully verify that it's working. It can take a while for changes to propagate through the DNS system.

1. From a command prompt, enter the `nslookup` command:

   ```
   nslookup test.contoso.com
   ```

1. Verify that the response looks similar to the following output:

    ```
    Server:  UnKnown
    Address:  40.90.4.1

    Name:    test.contoso.com
    Address:  10.10.10.10
    ```

1. In the **Overview** page of **contoso.com** DNS zone, select the **server** record, and then enter *10.11.11.11* in the **IP address**.

1. Select **Save**.

1. Wait a few minutes, and then use the `nslookup` command again. Verify the response changed to reflect the new IP address:


    ```
    Server:  UnKnown
    Address:  40.90.4.1

    Name:    test.contoso.com
    Address:  10.11.11.11
    ```

## Clean up resources

When no longer needed, you can delete all records created in this tutorial by following these steps:

1. On the Azure portal menu, select **All resources**.
1. Select **contoso.com** DNS zone.
1. On the **Overview** page, select the **server** record.
1. Select **Delete** and then **Yes**.
1. Repeat last two steps with **test** record.

## Next steps

In this tutorial, you learned the basic steps to create an alias record to refer to a resource record within the Azure DNS zone. To learn how to create an alias record that references an Azure public IP address resource, continue with the next tutorial:

> [!div class="nextstepaction"]
> [Create alias record for public IP address](tutorial-alias-pip.md)

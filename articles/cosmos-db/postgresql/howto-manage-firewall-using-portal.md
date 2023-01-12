---
title: Manage firewall rules - Azure Cosmos DB for PostgreSQL
description: Create and manage firewall rules for Azure Cosmos DB for PostgreSQL using the Azure portal.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/24/2022
---
# Manage public access for Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Server-level firewall rules can be used to manage [public
access](concepts-firewall-rules.md) to a
coordinator node from a specified IP address (or range of IP addresses) in the
public internet.

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Cosmos DB for PostgreSQL cluster](quickstart-create-portal.md).

## Create a server-level firewall rule in the Azure portal

1. On the PostgreSQL cluster page, under **Settings**, select **Networking**.

   :::image type="content" source="media/howto-manage-firewall-using-portal/1-connection-security.png" alt-text="Screenshot of selecting Networking.":::

1. On the **Networking** page, select **Allow public access from Azure services and resources within Azure to this cluster**.

1. If desired, select **Enable access to the worker nodes**. With this option, the firewall rules allow access to all worker nodes as well as the coordinator node.

1. Select **Add current client IP address** to create a firewall rule with the public IP address of your computer, as perceived by the Azure system.

   Verify your IP address before saving this configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the internet and Azure servers. Thus, you may need to change the start IP and end IP to make the rule function as expected. Use a search engine or other online tool to check your own IP address. For example, search for *what is my IP*.

   :::image type="content" source="media/howto-manage-firewall-using-portal/3-what-is-my-ip.png" alt-text="Screenshot of Bing search for What is my IP.":::

   You can also select **Add 0.0.0.0 - 255.255.255.255** to allow not just your IP, but the whole internet to access the coordinator node's port 5432 (and 6432 for connection pooling). In this situation, clients still must log in with the correct username and password to use the cluster. Nevertheless, it's best to allow worldwide access for only short periods of time and for only non-production databases.

1. To add firewall rules, type in the **Firewall rule name**, **Start IP address**, and **End IP address**. Opening the firewall enables administrators, users, and applications to access the coordinator node on ports 5432 and 6432. You can specify a single IP address or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the **Start IP address** and **End IP address** fields.

1. Select **Save** on the toolbar to save the settings and server-level firewall rules. Wait for the confirmation that the update was successful.

> [!NOTE]
> These settings are also accessible during the creation of an Azure Cosmos DB for PostgreSQL cluster. On the **Networking** tab, for **Connectivity method**, select **Public access (allowed IP address)**.
>
> :::image type="content" source="media/howto-manage-firewall-using-portal/0-create-public-access.png" alt-text="Screenshot of selecting Public access on the Networking tab.":::

## Connect from Azure

There's an easy way to grant cluster access to applications hosted on Azure, such as an Azure Web Apps application or those running in an Azure VM. On the portal page for your cluster, under **Networking**, select the checkbox **Allow Azure services and resources to access this cluster**, and then select **Save**.

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure, including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.

## Manage existing server-level firewall rules through the Azure portal
Repeat the steps to manage the firewall rules.
* To add the current computer, select **Add current client IP address**. Select **Save** to save the changes.
* To add more IP addresses, type in the **Firewall rule name**, **Start IP address**, and **End IP address**. Select **Save** to save the changes.
* To modify an existing rule, select any of the fields in the rule and modify. Select **Save** to save the changes.
* To delete an existing rule, select the ellipsis **...** and then select **Delete** to remove the rule. Select **Save** to save the changes.

## Next steps

For more about firewall rules, including how to troubleshoot connection problems, see [Public access in Azure Cosmos DB for PostgreSQL](concepts-firewall-rules.md).

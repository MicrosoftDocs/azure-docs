---
title: Manage firewall rules - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Create and manage firewall rules for Azure Database for PostgreSQL - Hyperscale (Citus) using the Azure portal
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 11/16/2021
---
# Manage public access for Azure Database for PostgreSQL - Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

Server-level firewall rules can be used to manage [public
access](concepts-firewall-rules.md) to a Hyperscale (Citus)
coordinator node from a specified IP address (or range of IP addresses) in the
public internet.

## Prerequisites
To step through this how-to guide, you need:
- A server group [Create an Azure Database for PostgreSQL – Hyperscale (Citus) server group](quickstart-create-portal.md).

## Create a server-level firewall rule in the Azure portal

> [!NOTE]
> These settings are also accessible during the creation of an Azure Database for PostgreSQL - Hyperscale (Citus) server group. Under the **Networking** tab, select **Public access (allowed IP address)**.
>
> :::image type="content" source="../media/howto-hyperscale-manage-firewall-using-portal/0-create-public-access.png" alt-text="Azure portal - networking tab":::

1. On the PostgreSQL server group page, under the Security heading, click **Networking** to open the Firewall rules.

   :::image type="content" source="../media/howto-hyperscale-manage-firewall-using-portal/1-connection-security.png" alt-text="Azure portal - click Networking":::

2. Select **Allow public access from Azure services and resources within Azure to this server group**.

3. If desired, select **Enable access to the worker nodes**. With this option, the firewall rules will allow access to all worker nodes as well as the coordinator node.

4. Click **Add current client IP address** to create a firewall rule with the public IP address of your computer, as perceived by the Azure system.

Alternately, clicking **+Add 0.0.0.0 - 255.255.255.255** (to the right of option B) allows not just your IP, but the whole internet to access the coordinator node's port 5432 (and 6432 for connection pooling). In this situation, clients still must log in with the correct username and password to use the cluster. Nevertheless, we recommend allowing worldwide access for only short periods of time and for only non-production databases.

5. Verify your IP address before saving the configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the internet and Azure servers. Thus, you may need to change the Start IP and End IP to make the rule function as expected.
   Use a search engine or other online tool to check your own IP address. For example, search for "what is my IP."

   :::image type="content" source="../media/howto-hyperscale-manage-firewall-using-portal/3-what-is-my-ip.png" alt-text="Bing search for What is my IP":::

6. Add more address ranges. In the firewall rules, you can specify a single IP address or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for Start IP and End IP. Opening the firewall enables administrators, users, and applications to access the coordinator node on ports 5432 and 6432.

7. Click **Save** on the toolbar to save this server-level firewall rule. Wait for the confirmation that the update to the firewall rules was successful.

## Connecting from Azure

There is an easy way to grant Hyperscale (Citus) database access to applications hosted on Azure (such as an Azure Web Apps application, or those running in an Azure VM). Select the checkbox **Allow Azure services and resources to access this server group** in the portal from the **Networking** pane and hit **Save**.

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.

## Manage existing server-level firewall rules through the Azure portal
Repeat the steps to manage the firewall rules.
* To add the current computer, click the button to + **Add current client IP address**. Click **Save** to save the changes.
* To add more IP addresses, type in the Rule Name, Start IP Address, and End IP Address. Click **Save** to save the changes.
* To modify an existing rule, click any of the fields in the rule and modify. Click **Save** to save the changes.
* To delete an existing rule, click the ellipsis […] and click **Delete** to remove the rule. Click **Save** to save the changes.

## Next steps
- Learn more about [Concept of firewall rules](concepts-firewall-rules.md), including how to troubleshoot connection problems.

---
title: Manage firewall rules - Azure portal - Azure Database for PostgreSQL - Single Server
description: Create and manage firewall rules for Azure Database for PostgreSQL - Single Server using the Azure portal
ms.service: postgresql
ms.subservice: single-server
ms.author: nlarin
ms.topic: how-to
author: niklarin
ms.date: 06/24/2022
---

# Create and manage firewall rules for Azure Database for PostgreSQL - Single Server using the Azure portal

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]


Server-level firewall rules can be used to manage access to an Azure Database for PostgreSQL Server from a specified IP address or range of IP addresses.

Virtual Network (VNet) rules can also be used to secure access to your server. Learn more about [creating and managing Virtual Network service endpoints and rules using the Azure portal](how-to-manage-vnet-using-portal.md).

## Prerequisites

To step through this how-to guide, you need:
- A server [Create an Azure Database for PostgreSQL](quickstart-create-server-database-portal.md)

## Create a server-level firewall rule in the Azure portal

1. On the PostgreSQL server page, under Settings heading, select **Connection security** to open the Connection security page for the Azure Database for PostgreSQL.

   :::image type="content" source="./media/how-to-manage-firewall-using-portal/1-connection-security.png" alt-text="Azure portal - select Connection Security":::

2. Select **Add client IP** on the toolbar. This automatically creates a firewall rule with the public IP address of your computer, as perceived by the Azure system.

   :::image type="content" source="./media/how-to-manage-firewall-using-portal/2-add-my-ip.png" alt-text="Azure portal - select Add My IP":::

3. Verify your IP address before saving the configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the internet and Azure servers. Therefore, you may need to change the Start IP and End IP to make the rule function as expected.
   Use a search engine or other online tool to check your own IP address. For example, search for "what is my IP."

   :::image type="content" source="./media/how-to-manage-firewall-using-portal/3-what-is-my-ip.png" alt-text="Bing search for What is my IP":::

4. Add additional address ranges. In the firewall rules for the Azure Database for PostgreSQL, you can specify a single IP address, or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for Start IP and End IP. Opening the firewall enables administrators, users, and applications to access any database on the PostgreSQL server to which they have valid credentials.

   :::image type="content" source="./media/how-to-manage-firewall-using-portal/4-specify-addresses.png" alt-text="Azure portal - firewall rules":::

5. Select **Save** on the toolbar to save this server-level firewall rule. Wait for the confirmation that the update to the firewall rules was successful.

   :::image type="content" source="./media/how-to-manage-firewall-using-portal/5-save-firewall-rule.png" alt-text="Azure portal - select Save":::

## Connecting from Azure

To allow applications from Azure to connect to your Azure Database for PostgreSQL server, Azure connections must be enabled. For example, to host an Azure Web Apps application, or an application that runs in an Azure VM, or to connect from an Azure Data Factory data management gateway. The resources do not need to be in the same Virtual Network (VNet) or Resource Group for the firewall rule to enable those connections. When an application from Azure attempts to connect to your database server, the firewall verifies that Azure connections are allowed. There are a couple of methods to enable these types of connections. A firewall setting with starting and ending address equal to 0.0.0.0 indicates these connections are allowed. Alternatively, you can set the **Allow access to Azure services** option to **ON** in the portal from the **Connection security** pane and hit **Save**. If the connection attempt is not allowed, the request does not reach the Azure Database for PostgreSQL server.

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
>

## Manage existing server-level firewall rules through the Azure portal

Repeat the steps to manage the firewall rules.
* To add the current computer, select the button to + **Add My IP**. Select **Save** to save the changes.
* To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address. Select **Save** to save the changes.
* To modify an existing rule, select any of the fields in the rule and modify. Select **Save** to save the changes.
* To delete an existing rule, select the ellipsis […] and select **Delete** to remove the rule. Select **Save** to save the changes.

## Next steps

- Similarly, you can script to [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](quickstart-create-server-database-azure-cli.md#configure-a-server-based-firewall-rule).
- Further secure access to your server by [creating and managing Virtual Network service endpoints and rules using the Azure portal](how-to-manage-vnet-using-portal.md).
- For help in connecting to an Azure Database for PostgreSQL server, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).

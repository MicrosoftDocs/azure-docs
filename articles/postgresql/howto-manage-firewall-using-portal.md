---
title: Create and manage firewall rules in Azure Database for PostgreSQL - Single Server
description: Create and manage firewall rules for Azure Database for PostgreSQL - Single Server using the Azure portal
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---
# Create and manage firewall rules for Azure Database for PostgreSQL - Single Server using the Azure portal
Server-level firewall rules can be used to manage access to an Azure Database for PostgreSQL Server from a specified IP address or range of IP addresses.

Virtual Network (VNet) rules can also be used to secure access to your server. Learn more about [creating and managing Virtual Network service endpoints and rules using the Azure portal](howto-manage-vnet-using-portal.md).

## Prerequisites
To step through this how-to guide, you need:
- A server [Create an Azure Database for PostgreSQL](quickstart-create-server-database-portal.md)

## Create a server-level firewall rule in the Azure portal
1. On the PostgreSQL server page, under Settings heading, click **Connection security** to open the Connection security page for the Azure Database for PostgreSQL.

   ![Azure portal - click Connection Security](./media/howto-manage-firewall-using-portal/1-connection-security.png)

2. Click **Add My IP** on the toolbar. This automatically creates a firewall rule with the public IP address of your computer, as perceived by the Azure system.

   ![Azure portal - click Add My IP](./media/howto-manage-firewall-using-portal/2-add-my-ip.png)

3. Verify your IP address before saving the configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the internet and Azure servers. Therefore, you may need to change the Start IP and End IP to make the rule function as expected.
   Use a search engine or other online tool to check your own IP address. For example, search for "what is my IP."

   ![Bing search for What is my IP](./media/howto-manage-firewall-using-portal/3-what-is-my-ip.png)

4. Add additional address ranges. In the firewall rules for the Azure Database for PostgreSQL, you can specify a single IP address, or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for Start IP and End IP. Opening the firewall enables administrators, users, and applications to access any database on the PostgreSQL server to which they have valid credentials.

   ![Azure portal - firewall rules](./media/howto-manage-firewall-using-portal/4-specify-addresses.png)

5. Click **Save** on the toolbar to save this server-level firewall rule. Wait for the confirmation that the update to the firewall rules was successful.

   ![Azure portal - click Save](./media/howto-manage-firewall-using-portal/5-save-firewall-rule.png)

## Connecting from Azure
To allow applications from Azure to connect to your Azure Database for PostgreSQL server, Azure connections must be enabled. For example, to host an Azure Web Apps application, or an application that runs in an Azure VM, or to connect from an Azure Data Factory data management gateway. The resources do not need to be in the same Virtual Network (VNet) or Resource Group for the firewall rule to enable those connections. When an application from Azure attempts to connect to your database server, the firewall verifies that Azure connections are allowed. There are a couple of methods to enable these types of connections. A firewall setting with starting and ending address equal to 0.0.0.0 indicates these connections are allowed. Alternatively, you can set the **Allow access to Azure services** option to **ON** in the portal from the **Connection security** pane and hit **Save**. If the connection attempt is not allowed, the request does not reach the Azure Database for PostgreSQL server.

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
> 

## Manage existing server-level firewall rules through the Azure portal
Repeat the steps to manage the firewall rules.
* To add the current computer, click the button to + **Add My IP**. Click **Save** to save the changes.
* To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address. Click **Save** to save the changes.
* To modify an existing rule, click any of the fields in the rule and modify. Click **Save** to save the changes.
* To delete an existing rule, click the ellipsis […] and click **Delete** to remove the rule. Click **Save** to save the changes.

## Next steps
- Similarly, you can script to [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](howto-manage-firewall-using-cli.md).
- Further secure access to your server by [creating and managing Virtual Network service endpoints and rules using the Azure portal](howto-manage-vnet-using-portal.md).
- For help in connecting to an Azure Database for PostgreSQL server, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).

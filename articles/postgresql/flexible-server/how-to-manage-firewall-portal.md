---
title: Manage firewall rules - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: Create and manage firewall rules for Azure Database for PostgreSQL - Flexible Server using the Azure portal
author: sunilagarwal 
ms.author: sunila
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 11/30/2021
---

# Create and manage firewall rules for Azure Database for PostgreSQL - Flexible Server using the Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

* Public access (allowed IP addresses)
* Private access (VNet Integration)

In this article, we will focus on creation of PostgreSQL server with **Public access (allowed IP addresses)** using Azure portal and will provide an overview of managing firewall rules after creation of Flexible Server. With *Public access (allowed IP addresses)*, the connections to the PostgreSQL server are restricted to allowed IP addresses only. The client IP addresses need to be allowed in firewall rules. To learn more about it, refer to [Public access (allowed IP addresses)](./concepts-networking.md#public-access-allowed-ip-addresses). The firewall rules can be defined at the time of server creation (recommended) but can be added later as well. In this article, we will provide an overview on how to create and manage firewall rules using public access (allowed IP addresses).

## Create a firewall rule when creating a server

1. Select **Create a resource** (+) in the upper-left corner of the  portal.
2. Select **Databases** > **Azure Database for PostgreSQL**. You can also enter **PostgreSQL** in the search box to find the service.
3. Select **Flexible Server** as the deployment option.
4. Fill out the **Basics** form.
5. Go to the **Networking** tab to configure how you want to connect to your server.
6. In the **Connectivity method**, select *Public access (allowed IP addresses)*. To create the **Firewall rules**, specify the Firewall rule name and single IP address, or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for Start IP address and End IP address. Opening the firewall enables administrators, users, and applications to access any database on the PostgreSQL server to which they have valid credentials.
   > [!Note]
   > Azure Database for PostgreSQL - Flexible Server creates a firewall at the server level. It prevents external applications and tools from connecting to the server and any databases on the server, unless you create a rule to open the firewall for specific IP addresses.
7. Select **Review + create** to review your flexible server configuration.
8.  Select **Create** to provision the server. Provisioning can take a few minutes.

## Create a firewall rule after server is created

1. In the [Azure portal](https://portal.azure.com/), select the Azure Database for PostgreSQL - Flexible Server on which you want to add firewall rules.
2. On the Flexible Server page, under **Settings** heading, click **Networking** to open the Networking page for Flexible Server.

   <!--![Azure portal - click Connection Security](./media/howto-manage-firewall-portal/1-connection-security.png)-->

3. Click **Add current client IP address** in the firewall rules. This automatically creates a firewall rule with the public IP address of your computer, as perceived by the Azure system.

   <!--![Azure portal - click Add My IP](./media/howto-manage-firewall-portal/2-add-my-ip.png)-->

4. Verify your IP address before saving the configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the internet and Azure servers. Therefore, you may need to change the Start IP address and End IP address to make the rule function as expected.

   You can use a search engine or other online tool to check your own IP address. For example, search for "what is my IP."

   <!--![Bing search for What is my IP](./media/howto-manage-firewall-portal/3-what-is-my-ip.png)-->

5. Add additional address ranges. In the firewall rules for the Azure Database for PostgreSQL - Flexible Server, you can specify a single IP address, or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for Start IP address and End IP address. Opening the firewall enables administrators, users, and applications to access any database on the PostgreSQL server to which they have valid credentials.

   <!--![Azure portal - firewall rules](./media/howto-manage-firewall-portal/4-specify-addresses.png)-->

6. Click **Save** on the toolbar to save this firewall rule. Wait for the confirmation that the update to the firewall rules was successful.

   <!--![Azure portal - click Save](./media/howto-manage-firewall-portal/5-save-firewall-rule.png)-->

## Connecting from Azure

You may want to enable resources or applications deployed in Azure to connect to your flexible server. This includes web applications hosted in Azure App Service, running on an Azure VM, an Azure Data Factory data management gateway and many more. 

When an application within Azure attempts to connect to your server, the firewall verifies that Azure connections are allowed. You can enable this setting by selecting the **Allow public access from Azure services and resources within Azure to this server** option in the portal from the **Networking** tab and hit **Save**.

The resources do not need to be in the same virtual network (VNet) or resource group for the firewall rule to enable those connections. If the connection attempt is not allowed, the request does not reach the Azure Database for PostgreSQL - Flexible Server.

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
>
> We recommend choosing the **Private access (VNet Integration)** to securely access Flexible Server.
>
## Manage existing firewall rules through the Azure portal

Repeat the following steps to manage the firewall rules.

- To add the current computer, click + **Add current client IP address** in the firewall rules. Click **Save** to save the changes.
- To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address. Click **Save** to save the changes.
- To modify an existing rule, click any of the fields in the rule and modify. Click **Save** to save the changes.
- To delete an existing rule, click the ellipsis […] and click **Delete** to remove the rule. Click **Save** to save the changes.

## Next steps
- Learn more about [Networking in Azure Database for PostgreSQL - Flexible Server](./concepts-networking.md)
- Understand more about [Azure Database for PostgreSQL - Flexible Server firewall rules](./concepts-networking.md#public-access-allowed-ip-addresses)
- [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](./how-to-manage-firewall-cli.md).

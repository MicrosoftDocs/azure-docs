---
title: Manage firewall rules - Azure portal - Azure Database for MySQL - Flexible Server
description: Create and manage firewall rules for Azure Database for MySQL - Flexible Server using the Azure portal
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Manage firewall rules for Azure Database for MySQL - Flexible Server using the Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides an overview of managing firewall rules after creating a flexible server. With *Public access (allowed IP addresses)*, the connections to the MySQL server are restricted to allowed IP addresses only. The client IP addresses need to be allowed in firewall rules.

This article focuses on creating a MySQL server with **Public access (allowed IP addresses)** using the Azure portal.

To learn more about it, refer to [Public access (allowed IP addresses)](./concepts-networking-public.md#public-access-allowed-ip-addresses). The firewall rules can be defined at the time of server creation (recommended) but can be added later.

Azure Database for MySQL - Flexible Server supports two mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

1. Public access (allowed IP addresses)
1. Private access (VNet Integration)

## Create a firewall rule when creating a server

1. Select **Create a resource** (+) in the upper-left corner of the  portal.
1. Select **Databases** > **Azure Database for MySQL**. You can also enter **MySQL** in the search box to find the service.
1. Select **Flexible server** as the deployment option.
1. Fill out the **Basics** form.
1. Go to the **Networking** tab to configure how you want to connect to your server.
1. In the **Connectivity method**, select *Public access (allowed IP addresses)*. To create the **Firewall rules**, specify the Firewall rule name and a single IP address or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for the Start IP address and End IP address. Opening the firewall enables administrators, users, and applications to access any database on the MySQL server to which they have valid credentials.

   > [!NOTE]  
   > Azure Database for MySQL - Flexible Server creates a firewall at the server level. It prevents external applications and tools from connecting to the server and any databases on the server unless you create a rule to open the firewall for specific IP addresses.

1. Select **Review + create** to review your flexible server configuration.
1. Select **Create** to provision the server. Provisioning can take a few minutes.

## Create a firewall rule after the server is created

1. In the [Azure portal](https://portal.azure.com/), select the Azure Database for MySQL - Flexible Server on which you want to add firewall rules.

1. On the flexible server page, under **Settings** heading, select **Networking** to open the Networking page for the flexible server.

   :::image type="content" source="./media/how-to-manage-firewall-portal/1-connection-security.png" alt-text="Azure portal - select Connection Security":::

1. Select **Add current client IP address** in the firewall rules. This automatically creates a firewall rule with the public IP address of your computer, as perceived by the Azure system.

   :::image type="content" source="./media/how-to-manage-firewall-portal/2-add-my-ip.png" alt-text="Azure portal - select Add My IP":::

1. Verify your IP address before saving the configuration. In some situations, the IP address observed by the Azure portal differs from the IP address used when accessing the internet and Azure servers. Therefore, you may need to change the Start and End IP addresses to make the rule function as expected.

   You can use a search engine or other online tool to check your own IP address. For example, search for "what is my IP."

   :::image type="content" source="./media/how-to-manage-firewall-portal/3-what-is-my-ip.png" alt-text="Bing search for What is my IP":::

1. Add more address ranges. In the firewall rules for the Azure Database for MySQL - Flexible Server, you can specify a single IP address or a range of addresses. If you want to limit the rule to a single IP address, type the same address in the field for the Start IP address and End IP address. Opening the firewall enables administrators, users, and applications to access any database on the MySQL server to which they have valid credentials.

   :::image type="content" source="./media/how-to-manage-firewall-portal/4-specify-addresses.png" alt-text="Azure portal - firewall rules":::

1. Select **Save** on the toolbar to save this firewall rule. Wait for the confirmation that the update to the firewall rules was successful.

   :::image type="content" source="./media/how-to-manage-firewall-portal/5-save-firewall-rule.png" alt-text="Azure portal - select Save":::

## Connect from Azure

You can enable resources or applications deployed in Azure to connect to your flexible server. This includes web applications hosted in Azure App Service, running on an Azure VM, an Azure Data Factory data management gateway, and many more.

When an application within Azure attempts to connect to your server, the firewall verifies that Azure connections are allowed. You can enable this setting by selecting the **Allow public access from Azure services and resources within Azure to this server** option in the portal from the **Networking** tab and selecting **Save**.

The resources can be in a different virtual network (VNet) or resource group for the firewall rule to enable those connections. The request doesn't reach the Azure Database for MySQL - Flexible Server if the connection attempt isn't allowed.

> [!IMPORTANT]  
> This option configures the firewall to allow all connections from Azure, including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
> 
> We recommend choosing the **Private access (VNet Integration)** to securely access flexible server.

## Manage existing firewall rules through the Azure portal

Repeat the following steps to manage the firewall rules.

- To add the current computer, select + **Add current client IP address** in the firewall rules. Select **Save** to save the changes.
- To add more IP addresses, type in the Rule Name, Start IP Address and End IP Address. Select **Save** to save the changes.
- To modify an existing rule, select any fields in the rule and modify. Select **Save** to save the changes.
- To delete an existing rule, select the ellipsis […] and select **Delete** to remove the rule. Select **Save** to save the changes.

## Next steps

- Learn more about [Networking in Azure Database for MySQL - Flexible Server](./concepts-networking.md)
- Understand more about [Azure Database for MySQL - Flexible Server firewall rules](./concepts-networking-public.md#public-access-allowed-ip-addresses)
- [Create and manage Azure Database for MySQL firewall rules using Azure CLI](./how-to-manage-firewall-cli.md)

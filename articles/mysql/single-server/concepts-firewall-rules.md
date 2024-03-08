---
title: Firewall rules - Azure Database for MySQL
description: Learn about using firewall rules to enable connections to your Azure Database for MySQL server.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Azure Database for MySQL server firewall rules

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Firewalls prevent all access to your database server until you specify which computers have permission. The firewall grants access to the server based on the originating IP address of each request.

To configure a firewall, create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

**Firewall rules:** These rules enable clients to access your entire Azure Database for MySQL server, that is, all the databases within the same logical server. Server-level firewall rules can be configured by using the Azure portal or Azure CLI commands. To create server-level firewall rules, you must be the subscription owner or a subscription contributor.

## Firewall overview
All database access to your Azure Database for MySQL server is by default blocked by the firewall. To begin using your server from another computer, you need to specify one or more server-level firewall rules to enable access to your server. Use the firewall rules to specify which IP address ranges from the Internet to allow. Access to the Azure portal website itself is not impacted by the firewall rules.

Connection attempts from the Internet and Azure must first pass through the firewall before they can reach your Azure Database for MySQL database, as shown in the following diagram:

:::image type="content" source="./media/concepts-firewall-rules/1-firewall-concept.png" alt-text="Example flow of how the firewall works":::

## Connecting from the Internet
Server-level firewall rules apply to all databases on the Azure Database for MySQL server.

If the IP address of the request is within one of the ranges specified in the server-level firewall rules, then the connection is granted.

If the IP address of the request is outside the ranges specified in any of the database-level or server-level firewall rules, then the connection request fails.

## Connecting from Azure
It is recommended that you find the outgoing IP address of any application or service and explicitly allow access to those individual IP addresses or ranges. For example, you can find the outgoing IP address of an Azure App Service or use a public IP tied to a virtual machine or other resource (see below for info on connecting with a virtual machine's private IP over service endpoints). 

If a fixed outgoing IP address isn't available for your Azure service, you can consider enabling connections from all Azure datacenter IP addresses. This setting can be enabled from the Azure portal by setting the **Allow access to Azure services** option to **ON** from the **Connection security** pane and hitting **Save**. From the Azure CLI, a firewall rule setting with starting and ending address equal to 0.0.0.0 does the equivalent. If the connection attempt is not allowed, the request does not reach the Azure Database for MySQL server.

> [!IMPORTANT]
> The **Allow access to Azure services** option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
> 

:::image type="content" source="./media/concepts-firewall-rules/allow-azure-services.png" alt-text="Configure Allow access to Azure services in the portal":::

### Connecting from a VNet
To connect securely to your Azure Database for MySQL server from a VNet, consider using [VNet service endpoints](./concepts-data-access-and-security-vnet.md). 

## Programmatically managing firewall rules
In addition to the Azure portal, firewall rules can be managed programmatically by using the Azure CLI. See also [Create and manage Azure Database for MySQL firewall rules using Azure CLI](./how-to-manage-firewall-using-cli.md)

## Troubleshooting firewall issues
Consider the following points when access to the Microsoft Azure Database for MySQL server service does not behave as expected:

* **Changes to the allow list have not taken effect yet:** There may be as much as a five-minute delay for changes to the Azure Database for MySQL Server firewall configuration to take effect.

* **The login is not authorized or an incorrect password was used:** If a login does not have permissions on the Azure Database for MySQL server or the password used is incorrect, the connection to the Azure Database for MySQL server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must provide the necessary security credentials.

* **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you can try one of the following solutions:

   * Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for MySQL server, and then add the IP address range as a firewall rule.

   * Get static IP addressing instead for your client computers, and then add the IP addresses as firewall rules.

* **Server's IP appears to be public:** Connections to the Azure Database for MySQL server are routed through a publicly accessible Azure gateway. However, the actual server IP is protected by the firewall. For more information, visit the [connectivity architecture article](concepts-connectivity-architecture.md). 

* **Cannot connect from Azure resource with allowed IP:** Check whether the **Microsoft.Sql** service endpoint is enabled for the subnet you are connecting from. If **Microsoft.Sql** is enabled, it indicates that you only want to use [VNet service endpoint rules](concepts-data-access-and-security-vnet.md) on that subnet.

   For example, you may see the following error if you are connecting from an Azure VM in a subnet that has **Microsoft.Sql** enabled but has no corresponding VNet rule:
   `FATAL: Client from Azure Virtual Networks is not allowed to access the server`

* **Firewall rule is not available for IPv6 format:** The firewall rules must be in IPv4 format. If you specify firewall rules in IPv6 format, it will show the validation error.

## Next steps

* [Create and manage Azure Database for MySQL firewall rules using the Azure portal](./how-to-manage-firewall-using-portal.md)
* [Create and manage Azure Database for MySQL firewall rules using Azure CLI](./how-to-manage-firewall-using-cli.md)
* [VNet service endpoints in Azure Database for MySQL](./concepts-data-access-and-security-vnet.md)

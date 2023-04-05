---
title: Firewall rules - Azure Database for PostgreSQL - Single Server
description: This article describes how to use firewall rules to connect to Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
---

# Firewall rules in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL server is secure by default preventing all access to your database server until you specify which IP hosts are allowed to access it. The firewall grants access to the server based on the originating IP address of each request.
To configure your firewall, you create firewall rules that specify ranges of acceptable IP addresses. You can create firewall rules at the server level.

**Firewall rules:** These rules enable clients to access your entire Azure Database for PostgreSQL Server, that is, all the databases within the same logical server. Server-level firewall rules can be configured by using the Azure portal or using Azure CLI commands. To create server-level firewall rules, you must be the subscription owner or a subscription contributor.

## Firewall overview

All access to your Azure Database for PostgreSQL server is blocked by the firewall by default. To access your server from another computer/client or application, you need to specify one or more server-level firewall rules to enable access to your server. Use the firewall rules to specify allowed public IP address ranges. Access to the Azure portal website itself is not impacted by the firewall rules.
Connection attempts from the internet and Azure must first pass through the firewall before they can reach your PostgreSQL Database, as shown in the following diagram:

:::image type="content" source="../media/concepts-firewall-rules/1-firewall-concept.png" alt-text="Example flow of how the firewall works":::

## Connecting from the Internet

Server-level firewall rules apply to all databases on the same Azure Database for PostgreSQL server. 
If the source IP address of the request is within one of the ranges specified in the server-level firewall rules, the connection is granted otherwise it is rejected. For example, if your application connects with JDBC driver for PostgreSQL, you may encounter this error attempting to connect when the firewall is blocking the connection.
> java.util.concurrent.ExecutionException: java.lang.RuntimeException:
> org.postgresql.util.PSQLException: FATAL: no pg\_hba.conf entry for host "123.45.67.890", user "adminuser", database "postgresql", SSL

> [!NOTE]
> To access Azure Database for PostgreSQL from your local computer, ensure that the firewall on your network and local computer allow outgoing communication on TCP port 5432.

## Connecting from Azure

It is recommended that you find the outgoing IP address of any application or service and explicitly allow access to those individual IP addresses or ranges. For example, you can find the outgoing IP address of an Azure App Service or use a public IP tied to a virtual machine or other resource (see below for info on connecting with a virtual machine's private IP over service endpoints).

If a fixed outgoing IP address isn't available for your Azure service, you can consider enabling connections from all Azure datacenter IP addresses. This setting can be enabled from the Azure portal by setting the **Allow access to Azure services** option to **ON** from the **Connection security** pane and hitting **Save**. From the Azure CLI, a firewall rule setting with starting and ending address equal to 0.0.0.0 does the equivalent. If the connection attempt is rejected by firewall rules, it does not reach the Azure Database for PostgreSQL server.

> [!IMPORTANT]
> The **Allow access to Azure services** option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
>

:::image type="content" source="../media/concepts-firewall-rules/allow-azure-services.png" alt-text="Configure Allow access to Azure services in the portal":::

## Connecting from a VNet

To connect securely to your Azure Database for PostgreSQL server from a VNet, consider using [VNet service endpoints](./concepts-data-access-and-security-vnet.md).

## Programmatically managing firewall rules

In addition to the Azure portal, firewall rules can be managed programmatically using Azure CLI.
See also [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](quickstart-create-server-database-azure-cli.md#configure-a-server-based-firewall-rule)

## Troubleshooting firewall issues

Consider the following points when access to the Microsoft Azure Database for PostgreSQL Server service does not behave as you expect:

* **Changes to the allow list have not taken effect yet:** There may be as much as a five-minute delay for changes to the Azure Database for PostgreSQL Server firewall configuration to take effect.

* **The login is not authorized or an incorrect password was used:** If a login does not have permissions on the Azure Database for PostgreSQL server or the password used is incorrect, the connection to the Azure Database for PostgreSQL server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must still provide the necessary security credentials.

   For example, using a JDBC client, the following error may appear.
   > java.util.concurrent.ExecutionException: java.lang.RuntimeException: org.postgresql.util.PSQLException: FATAL: password authentication failed for user "yourusername"

* **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

   * Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for PostgreSQL Server, and then add the IP address range as a firewall rule.

   * Get static IP addressing instead for your client computers, and then add the static IP address as a firewall rule.

* **Server's IP appears to be public:** Connections to the Azure Database for PostgreSQL server are routed through a publicly accessible Azure gateway. However, the actual server IP is protected by the firewall. For more information, visit the [connectivity architecture article](concepts-connectivity-architecture.md).

* **Cannot connect from Azure resource with allowed IP:** Check whether the **Microsoft.Sql** service endpoint is enabled for the subnet you are connecting from. If **Microsoft.Sql** is enabled, it indicates that you only want to use [VNet service endpoint rules](concepts-data-access-and-security-vnet.md) on that subnet.

   For example, you may see the following error if you are connecting from an Azure VM in a subnet that has **Microsoft.Sql** enabled but has no corresponding VNet rule:
   `FATAL: Client from Azure Virtual Networks is not allowed to access the server`

* **Firewall rule is not available for IPv6 format:** The firewall rules must be in IPv4 format. If you specify firewall rules in IPv6 format, it will show the validation error.

## Next steps

* [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](how-to-manage-firewall-using-portal.md)
* [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](quickstart-create-server-database-azure-cli.md#configure-a-server-based-firewall-rule)
* [VNet service endpoints in Azure Database for PostgreSQL](./concepts-data-access-and-security-vnet.md)

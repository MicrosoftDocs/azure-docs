---
title: Public Network Access overview - Azure Database for MySQL Flexible Server
description: Learn about public access networking option in the Flexible Server deployment option for Azure Database for MySQL
author: Madhusoodanan
ms.author: dimadhus
ms.service: mysql
ms.topic: conceptual
ms.date: 8/6/2021
---

## Public Network Access for Azure Database for MySQL - Flexible Server (Preview)

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes public connectivity option for your server. You will learn in detail the concepts to create Azure Database for MySQL Flexible server accessible securely through internet.

> [!IMPORTANT]
> Azure Database for MySQL - Flexible server is in preview.

## Public access (allowed IP addresses)

Configuring public access on your flexible server will allow the server to be accessed through a public endpoint that is the server will be accessible through the internet. The public endpoint is a publicly resolvable DNS address. The phrase “allowed IP addresses” refers to a range of IPs you choose to give permission to access your server. These permissions are called firewall rules.

Characteristics of the public access method include:

* Only the IP addresses you allow have permission to access your MySQL flexible server. By default no IP addresses are allowed. You can add IP addresses during server creation or afterwards.
* Your MySQL server has a publicly resolvable DNS name
* Your flexible server is not in one of your Azure virtual networks
* Network traffic to and from your server does not go over a private network. The traffic uses the general internet pathways.

### Firewall rules

Granting permission to an IP address is called a firewall rule. If a connection attempt comes from an IP address you have not allowed, the originating client will see an error.

### Allowing all Azure IP addresses

If a fixed outgoing IP address isn't available for your Azure service, you can consider enabling connections from all Azure datacenter IP addresses.

> [!IMPORTANT]
> The **Allow public access from Azure services and resources within Azure** option configures the firewall to allow all connections from Azure, including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.

Learn how to enable and manage public access (allowed IP addresses) using the [Azure portal](how-to-manage-firewall-portal.md) or [Azure CLI](how-to-manage-firewall-cli.md).

### Troubleshooting public access issues

Consider the following points when access to the Microsoft Azure Database for MySQL Server service does not behave as you expect:

* **Changes to the allowlist have not taken effect yet:** There may be as much as a five-minute delay for changes to the Azure Database for MySQL Server firewall configuration to take effect.

* **Authentication failed:** If a user does not have permissions on the Azure Database for MySQL server or the password used is incorrect, the connection to the Azure Database for MySQL server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server. Each client must still provide the necessary security credentials.

* **Dynamic client IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

  * Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for MySQL Server, and then add the IP address range as a firewall rule.
  * Get static IP addressing instead for your client computers, and then add the static IP address as a firewall rule.
  
* **Firewall rule is not available for IPv6 format:** The firewall rules must be in IPv4 format. If you specify firewall rules in IPv6 format, it will show the validation error.

## Next steps

* Learn how to enable public access (allowed IP addresses) using the [Azure portal](how-to-manage-firewall-portal.md) or [Azure CLI](how-to-manage-firewall-cli.md)
* Learn how to [use TLS](how-to-connect-tls-ssl.md)

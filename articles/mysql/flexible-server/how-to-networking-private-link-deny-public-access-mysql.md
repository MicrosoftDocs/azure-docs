---
title: Deny Public Network Access - Azure portal - Azure Database for MySQL - 
description: Learn how to configure Deny Public Network Access using Azure portal for your Azure Database for MySQL - Flexible server
author: vivgk
ms.author: vivgk
ms.reviewer: maghan
ms.date: 05/23/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Deny Public Network Access in Azure Database for MySQL - Flexible Server using Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes how you can configure an Azure Database for MySQL flexible server to deny all public configurations and allow only connections through private endpoints to enhance network security further.

## Deny public access during the creation of MySQL flexible server

1. When creating an [Azure Database for MySQL flexible server](quickstart-create-server-portal.md) in the Networking tab, choose *Public access (allowed IP addresses) and Private endpoint* as the connectivity method.

2. To disable public access on the MySQL flexible server you are creating, uncheck Allow public access to this resource through the internet using a public IP address under *Public access*.

:::image type="content" source="media/how-to-networking-private-link-deny-public-access-mysql/deny-public-access-networking-page-mysql.png" alt-text="Screenshot of denying public access from the portal.":::

3. After entering the remaining information in the other tabs, click on *Review + Create* to deploy the MySQL flexible server without public access.

## Deny public access to an existing MySQL flexible server

> [!NOTE]
> The MySQL flexible server must have been deployed with **Public access (allowed IP addresses) and Private endpoint** as the connectivity method to implement this.

1. On the MySQL flexible server page, under **Settings**, click **Networking**.

2. To disable public access on the MySQL flexible server, uncheck Allow public access to this resource through the internet using a public IP address under **Public access**.

:::image type="content" source="media/how-to-networking-private-link-deny-public-access-mysql/deny-public-access-networking-page-mysql-2.png" alt-text="Screenshot of denying public access from the portal next screen.":::

3. Click **Save** to save the changes.

4. A notification will confirm that the connection security setting was successfully enabled.

## Next steps

- Learn how to [configure private link for Azure Database for MySQL flexible server from Azure portal](Flex - Tutorials - Networking - Configure private link using Azure portal.md)
- Learn how to manage connectivity to your Azure Database for MySQL flexible Server (Flex - Concepts - Networking - Networking Concepts.md)
- Learn how to [add another layer of encryption to your Azure Database for MySQL flexible server using Customer Managed Keys](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/concepts-customer-managed-key.md)
- Learn how to [configure and use Azure AD authentication on your Azure Database for MySQL flexible server](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/concepts-azure-ad-authentication.md)
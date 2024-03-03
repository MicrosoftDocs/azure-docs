---
title: Deny public network by using the Azure portal
description: Learn how to configure public network access for Azure Database for MySQL - Flexible Server by using the Azure portal.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 05/11/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Deny Public Network Access in Azure Database for MySQL - Flexible Server by using the Azure portal 

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes how you can configure an Azure Database for MySQL flexible server instance to deny all public configurations and allow only connections through private endpoints to enhance network security further.

## Deny public access during the creation of MySQL flexible server

1. When creating an [Azure Database for MySQL flexible server instance](quickstart-create-server-portal.md) in the Networking tab, choose *Public access (allowed IP addresses) and Private endpoint* as the connectivity method.

1. To disable public access on the Azure Database for MySQL flexible server instance you are creating, uncheck Allow public access to this resource through the internet using a public IP address under *Public access*.

   :::image type="content" source="media/how-to-networking-private-link-deny-public-access-mysql/deny-public-access-networking-page-mysql.png" alt-text="Screenshot of denying public access from the portal." lightbox="media/how-to-networking-private-link-deny-public-access-mysql/deny-public-access-networking-page-mysql.png":::

1. After entering the remaining information in the other tabs, select on *Review + Create* to deploy the Azure Database for MySQL flexible server instance without public access.

## Deny public access to an existing MySQL flexible server

> [!NOTE]  
> The Azure Database for MySQL flexible server instance must have been deployed with **Public access (allowed IP addresses) and Private endpoint** as the connectivity method to implement this.

1. On the Azure Database for MySQL flexible server page, under **Settings**, select **Networking**.

1. To disable public access on the Azure Database for MySQL flexible server instance, uncheck Allow public access to this resource through the internet using a public IP address under **Public access**.

   :::image type="content" source="media/how-to-networking-private-link-deny-public-access-mysql/deny-public-access-networking-page-mysql-2.png" alt-text="Screenshot of denying public access from the portal next screen." lightbox="media/how-to-networking-private-link-deny-public-access-mysql/deny-public-access-networking-page-mysql-2.png":::

1. Select **Save** to save the changes.

1. A notification will confirm that the connection security setting was successfully enabled.

## Next steps

- Learn how to [configure private link for Azure Database for MySQL flexible server from the Azure portal](how-to-networking-private-link-portal.md).
- Learn how to [manage connectivity](concepts-networking.md) to your Azure Database for MySQL flexible server instance.
- Learn how to [add another layer of encryption to your Azure Database for MySQL flexible server instance using Customer Managed Keys](concepts-customer-managed-key.md).
- Learn how to configure and use [Microsoft Entra authentication](concepts-azure-ad-authentication.md) on your Azure Database for MySQL flexible server instance.

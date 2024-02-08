---
author: haiche
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 02/09/2024
ms.author: haiche
---

Use the following steps to create an Azure SQL Database single database for use with your app:

1. Create a single database in Azure SQL Database by following the steps in [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart), carefully noting the differences in the following note. Return to this article after creating and configuring the database server.

   > [!NOTE]
   > At the **Basics** step, write down **Resource group**, **Database name**, **_\<server-name>_.database.windows.net**, **Server admin login**, and **Password**. This article refers to the database **Resource group** as `<db-resource-group>`.
   >
   > At the **Networking** step, set **Connectivity method** to **Public endpoint**, **Allow Azure services and resources to access this server** to **Yes**, and **Add current client IP address** to **Yes**.
   >
   > :::image type="content" source="media/create-azure-sql-database/create-sql-database-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking tab of the Create SQL Database page with the Connectivity method and Firewall rules settings highlighted." lightbox="media/create-azure-sql-database/create-sql-database-networking.png":::

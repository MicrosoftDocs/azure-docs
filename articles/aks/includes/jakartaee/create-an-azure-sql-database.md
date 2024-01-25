---
author: haiche
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 25/01/2024
ms.author: haiche
---

The following steps guide you through creating an Azure SQL Database single database for use with your app.

1. Create a single database in Azure SQL Database by following the steps in [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart), carefully noting the differences in the box below. Return to this article after creating and configuring the database server.

   > [!NOTE]
   > At the **Basics** step, write down **Resource group**, **Database name**, **_\<server-name>_.database.windows.net**, **Server admin login**, and **Password**. The database **Resource group** will be referred to as `<db-resource-group>` later in this article.
   >
   > At the **Networking** step, set **Connectivity method** to **Public endpoint**, **Allow Azure services and resources to access this server** to **Yes**, and **Add current client IP address** to **Yes**.
   >
   > :::image type="content" source="media/howto-deploy-java-liberty-app/create-sql-database-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking tab of the Create SQL Database page with the Connectivity method and Firewall rules settings highlighted." lightbox="media/howto-deploy-java-liberty-app/create-sql-database-networking.png":::
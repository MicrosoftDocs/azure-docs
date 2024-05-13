---
author: haiche
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 02/09/2024
ms.author: haiche
---

To create an Azure SQL Database single database for use with your app, follow the steps in [Quickstart: Create a single database in Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart). Carefully note the following differences:

* At the **Basics** step, write down the values for **Resource group**, **Database name**, **_\<server-name>_.database.windows.net**, **Server admin login**, and **Password**. This article refers to the database **Resource group** value as `<db-resource-group>`.

* At the **Networking** step, set **Connectivity method** to **Public endpoint**, set **Allow Azure services and resources to access this server** to **Yes**, and set **Add current client IP address** to **Yes**.

  :::image type="content" source="media/create-azure-sql-database/create-sql-database-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking tab of the Create SQL Database page with the Connectivity method and Firewall rules settings highlighted." lightbox="media/create-azure-sql-database/create-sql-database-networking.png":::

> [!NOTE]
> The [serverless compute tier](/azure/azure-sql/database/serverless-tier-overview) that you selected for this database saves money by putting the database to sleep during periods of inactivity. The sample app will fail if the database is asleep when the app starts up.
>
> To force the database to wake up, you can run a query by using the query editor. Follow the steps in [Query the database](/azure/azure-sql/database/serverless-tier-overview). Here's an example query: `SELECT * FROM COFFEE;`.
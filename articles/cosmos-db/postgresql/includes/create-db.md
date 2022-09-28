---
 title: include file
 description: include file
 author: jonels-msft
 ms.service: cosmos-db
 ms.subservice: postgresql
 ms.topic: include
 ms.date: 06/29/2022
 ms.author: jonels
 ms.custom: include file
---

If you don't have an Azure subscription, create a
[free](https://azure.microsoft.com/free/) account before you begin.

Sign in to the [Azure portal](https://portal.azure.com) and follow these steps
to create an Azure Cosmos DB for PostgreSQL cluster:

# [Direct link](#tab/direct)

Visit [Create cluster](https://portal.azure.com/#view/Microsoft_Azure_DocumentDB/CreatePostgreSQL.ReactView) in the Azure portal.

# [Via portal search](#tab/portal-search)

1. Visit the [Azure portal](https://portal.azure.com/) and search for
   **citus**. Select **Azure Cosmos DB for PostgreSQL**.
   ![search for citus](media/quickstart-create-portal/portal-search.png)
2. Select **+ Create**.
   ![create button](media/quickstart-create-portal/create-button.png)
3. Select the **cluster** deployment option.
   ![deployment options](media/quickstart-create-portal/deployment-option.png)

---

1. Fill out the **Basics** form.
   ![basic info form](media/quickstart-create-portal/basics.png)

   Most options are self-explanatory, but keep in mind:

   * The cluster name will determine the DNS name your
     applications use to connect, in the form
     `cluster-name.postgres.database.azure.com`.
   * The admin username is required to be the value `citus`.
   * You can choose a database version. Azure Cosmos DB for PostgreSQL always supports the
     latest PostgreSQL version, within one day of release.

2. Select **Configure cluster**.

   ![compute and storage](media/quickstart-create-portal/compute.png)

3. Select **Save**.

4. Select **Next : Networking >** at the bottom of the screen.
5. In the **Networking** tab, select **Allow public access from Azure services
   and resources within Azure to this cluster**.

   ![networking configuration](media/quickstart-create-portal/networking.png)

6. Select **Review + create** and then **Create** to create the server.
   Provisioning takes a few minutes.
7. The page will redirect to monitor deployment. When the live status changes
   from **Deployment is in progress** to **Your deployment is complete**.
   After this transition, select **Go to resource**.

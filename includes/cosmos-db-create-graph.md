---
 title: include file
 description: include file
 services: cosmos-db
 author: SnehaGunda
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: sngun
 ms.custom: include file
---

You can now use the Data Explorer tool in the Azure portal to create a graph database. 

1. Click **Data Explorer** > **New Graph**.

    The **Add Graph** area is displayed on the far right, you may need to scroll right to see it.

    ![The Azure portal Data Explorer, Add Graph page](./media/cosmos-db-create-graph/azure-cosmosdb-data-explorer-graph.png)

2. In the **Add graph** page, enter the settings for the new graph.

    Setting|Suggested value|Description
    ---|---|---
    Database ID|sample-database|Enter *sample-database* as the name for the new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    Graph ID|sample-graph|Enter *sample-graph* as the name for your new collection. Graph names have the same character requirements as database IDs.
    Storage Capacity|Fixed (10 GB)|Leave the default value of **Fixed (10 GB)**. This value is the storage capacity of the database.
    Throughput|400 RUs|Change the throughput to 400 request units per second (RU/s). If you want to reduce latency, you can scale up the throughput later.

3. Once the form is filled out, click **OK**.

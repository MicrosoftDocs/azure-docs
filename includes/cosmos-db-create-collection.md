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

You can now use the Data Explorer tool in the Azure portal to create a database and collection. 

1. Click **Data Explorer** > **New Collection**. 
    
    The **Add Collection** area is displayed on the far right, you may need to scroll right to see it.

    ![The Azure portal Data Explorer, Add Collection blade](./media/cosmos-db-create-collection/azure-cosmosdb-data-explorer.png)

2. In the **Add collection** page, enter the settings for the new collection.

    Setting|Suggested value|Description
    ---|---|---
    Database id|Tasks|Enter *Tasks* as the name for the new database. Database names must contain from 1 through 255 characters, and they cannot contain /, \\, #, ?, or a trailing space.
    Collection id|Items|Enter *Items* as the name for your new collection. Collection ids have the same character requirements as database names.
    Storage capacity| Fixed (10 GB)|Use the default value of **Fixed (10 GB)**. This value is the storage capacity of the database.
    Throughput|400 RU|Change the throughput to 400 request units per second (RU/s). Storage capacity must be set to **Fixed (10 GB)** in order to set throughput to 400 RU/s. If you want to reduce latency, you can scale up the throughput later. 
    
    In addition to the preceding settings, you can optionally add **Unique keys** for the collection. Let's leave the field empty in this example. Unique keys provide developers with the ability to add a layer of data integrity to the database. By creating a unique key policy while creating a collection, you ensure the uniqueness of one or more values per partition key. To learn more, refer to the [Unique keys in Azure Cosmos DB](../articles/cosmos-db/unique-keys.md) article.
    
    Click **OK**.

    Data Explorer displays the new database and collection.

    ![The Azure portal Data Explorer, showing the new database and collection](./media/cosmos-db-create-collection/azure-cosmos-db-new-collection.png)
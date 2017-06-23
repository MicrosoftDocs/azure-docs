You can now use Data Explorer to create a collection and add data to your database. 

1. In the Azure portal, in the left pane, click **Data Explorer**. 

2. On the **Data Explorer** blade, click **New Collection**, and then provide the following information:

    ![The Azure portal Data Explorer blade](./media/cosmos-db-create-collection/azure-cosmosdb-data-explorer.png)

    Setting|Suggested value|Description
    ---|---|---
    Database id|Tasks|The ID for your new database. Database names must contain from 1 through 255 characters, and they cannot contain /, \\, #, ?, or a trailing space.
    Collection id|Items|The ID for your new collection. Collection names have the same character requirements as database IDs.
    Storage capacity| Fixed (10 GB)|Use the default value. This is the storage capacity of the database.
    Throughput|400 RU|Use the default value. If you want to reduce latency, you can scale up the throughput later.
    RU/m|Off|Leave the default value. If you need to handle spiky workloads later, you can turn on the [RU/m](../articles/cosmos-db/request-units-per-minute.md) feature at that time.
    Partition key|/category|A partition key that distributes data evenly to each partition. Selecting the correct partition key is important in creating a performant collection. To learn more, see [Designing for partitioning](../articles/cosmos-db/partition-data.md#designing-for-partitioning).    
3. After you've completed the form, click **OK**.
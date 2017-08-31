You can now use the Data Explorer tool in the Azure portal to create a graph database. 

1. In the Azure portal, in the menu on the left, select **Data Explorer (Preview)**.

2. Under **Data Explorer (Preview)**, select **New Graph**. Then fill in the page by using the following information:

    ![Data Explorer in the Azure portal](./media/cosmos-db-create-graph/azure-cosmosdb-data-explorer.png)

    Setting|Suggested value|Description
    ---|---|---
    Database id|sample-database|The ID for your new database. Database names must be between 1 and 255 characters and can't contain `/ \ # ?` or a trailing space.
    Graph id|sample-graph|The ID for your new graph. Graph names have the same character requirements as database IDs.
    Storage capacity| 10 GB|Leave the default value. This is the storage capacity of the database.
    Throughput|400 RUs|Leave the default value. You can scale up the throughput later if you want to reduce latency.
    Partition key|/userid|A partition key that distributes data evenly to each partition. Selecting the correct partition key is important in creating a performant graph. For more information, see [Designing for partitioning](../articles/cosmos-db/partition-data.md#designing-for-partitioning).

3. After the form is filled out, select **OK**.
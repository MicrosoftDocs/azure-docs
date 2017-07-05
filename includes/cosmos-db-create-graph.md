You can now use Data Explorer to create a graph container and add data to your database. 

1. In the Azure portal, in the navigation menu, click **Data Explorer**. 
2. In the Data Explorer blade, click **New Graph**, then fill in the page using the following information.

    ![Data Explorer in the Azure portal](./media/cosmos-db-create-graph/azure-cosmosdb-data-explorer.png)

    Setting|Suggested value|Description
    ---|---|---
    Database id|sample-database|The ID for your new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    Graph id|sample-graph|The ID for your new graph. Graph names have the same character requirements as database ids.
    Storage Capacity| 10 GB|Leave the default value. This is the storage capacity of the database.
    Throughput|400 RUs|Leave the default value. You can scale up the throughput later if you want to reduce latency.
    Partition key|/userid|A partition key that will distribute data evenly to each partition. Selecting the correct partition key is important in creating a performant graph, read more about it in [Designing for partitioning](../articles/cosmos-db/partition-data.md#designing-for-partitioning).

3. Once the form is filled out, click **OK**.
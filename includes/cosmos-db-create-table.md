You can now use Data Explorer to create a table and add data to your database. 

1. In the Azure portal, in the navigation menu, click **Data Explorer (Preview)**. 
2. In the Data Explorer blade, click **New Table**, then fill in the page using the following information.

    ![Data Explorer in the Azure portal](./media/cosmos-db-create-table/azure-cosmosdb-data-explorer.png)

    Setting|Suggested value|Description
    ---|---|---
    Table Id|sample-table|The ID for your new table. Table names have the same character requirements as database ids. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    Storage capacity| 10 GB|Leave the default value. This is the storage capacity of the database.
    Throughput|400 RUs|Leave the default value. You can scale up the [throughput](../articles/cosmos-db/request-units.md) later if you want to reduce latency.
    RU/m|Off|Leave the default value. You can turn on the [RU/m](../articles/cosmos-db/request-units-per-minute.md) feature later if you need to handle spiky workloads.

3. Once the form is filled out, click **OK**.
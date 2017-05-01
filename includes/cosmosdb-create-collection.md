You can now use Data Explorer to create a collection and add data to your database. 

1. In the Azure portal, in the navigation menu, under **Collections**, click **Data Explorer (Preview)**. 
2. In the Data Explorer blade, click **New Collection**, then fill in the page using the following information.
    * In the **Database id** box, enter *Items* as ID for your new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    * In the **Collection id** box, enter *ToDoList* as the ID for your new collection. Collection names have the same character requirements as database IDs.
    * In the **Storage Capacity** box, leave the default 10 GB selected.
    * In the **Throughput** box, leave the default 400 RUs selected. You can scale up the throughput later if you want to reduce latency.
    * In the **Partition key** box, for the purpose of this sample, enter the value */category*, so that tasks in the todo app you create can be partitioned by category. Selecting the correct partition key is important in creating a performant collection, read more about it in [Designing for partitioning](./articles/documentdb/documentdb-partition-data.md#designing-for-partitioning).

   ![Data Explorer in the Azure portal](./media/cosmosdb-create-collection/azure-cosmosdb-data-explorer.png)

3. Once the form is filled out, click **OK**.
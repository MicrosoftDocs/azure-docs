---
 title: include file
 description: include file
 services: cosmos-db
 author: seesharprun
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: sidandrews
ms.reviewer: mjbrown
 ms.custom: include file
---

You can now use the Data Explorer tool in the Azure portal to create a database and container. 

1. Select **Data Explorer** > **New Container**. 
    
    The **Add Container** area is displayed on the far right, you may need to scroll right to see it.

    :::image type="content" source="./media/cosmos-db-create-collection/azure-cosmosdb-data-explorer.png" alt-text="The Azure portal Data Explorer, Add Container pane":::

2. In the **Add container** page, enter the settings for the new container.

    |Setting|Suggested value|Description
    |---|---|---|
    |**Database ID**|ToDoList|Enter *Tasks* as the name for the new database. Database names must contain from 1 through 255 characters, and they cannot contain `/, \\, #, ?`, or a trailing space. Check the **Share throughput across containers** option, it allows you to share the throughput provisioned on the database across all the containers within the database. This option also helps with cost savings. |
    | **Database throughput**| You can provision **Autoscale** or **Manual** throughput. Manual throughput allows you to scale RU/s yourself whereas  autoscale throughput allows the system to scale RU/s based on usage. Select **Manual** for this example. <br><br> Leave the throughput at 400 request units per second (RU/s). If you want to reduce latency, you can scale up the throughput later by estimating the required RU/s with the [capacity calculator](../estimate-ru-with-capacity-planner.md).<br><br>**Note**: This setting is not available when creating a new container in a serverless account. |
    |**Container ID**|Items|Enter *Items* as the name for your new container. Container IDs have the same character requirements as database names.|
    |**Partition key**| /category| The sample described in this article uses */category* as the partition key.|

    Don't add **Unique keys** or turn on **Analytical store** for this example. Unique keys let you add a layer of data integrity to the database by ensuring the uniqueness of one or more values per partition key. For more information, see [Unique keys in Azure Cosmos DB.](../unique-keys.md) [Analytical store](../analytical-store-introduction.md) is used to enable large-scale analytics against operational data without any impact to your transactional workloads.
    
    Select **OK**. The Data Explorer displays the new database and container.
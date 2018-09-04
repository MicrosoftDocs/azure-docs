---
title: 'Quickstart: Create a Kusto cluster and database'
description: 'In this quickstart, you learn how to create a cluster and database, and ingest (load) data.'
author: mgblythe
ms.author: mblythe
ms.reviewer: mblythe
ms.service: kusto
ms.topic: quickstart
ms.date: 09/24/2018

#Customer intent: As a database administrator, I want to create a Kusto cluster and database so that I can understand whether Kusto is suitable for my analytics projects.
---

# Quickstart: Create a Kusto cluster and database

Kusto is a log analytics platform that is optimized for ad-hoc big data queries. To use Kusto, you first create a *cluster*, and create one or more *databases* in that cluster. Then you *ingest* (load) data into a database so that you can run queries against it. In this quickstart, you create a cluster and a database; then you ingest sample data into the database. This gives you a basic understanding of how Kusto works. 

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).


## Create a cluster

You create a Kusto cluster in an Azure resource group, with a defined set of compute and storage resources.

1. Select the **Create a resource** button (+) in the upper-left corner of the  portal.

1. Select **Databases** > **KustoDB**.

   ![Kusto cluster option](./media/quickstart-create-mysql-server-database-using-azure-portal/2_navigate-to-mysql.png)

1. Fill out the new cluster details form with the following information:
   
   ![Create cluster form](./media/quickstart-create-mysql-server-database-using-azure-portal/4-create-form.png)

    **Setting** | **Suggested value** | **Field description** 
    ---|---|---
    Server name | Unique server name | Choose a unique name that identifies your Azure Database for MySQL server. For example, mydemoserver. The domain name *.mysql.database.azure.com* is appended to the server name you provide. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
    Subscription | Your subscription | Select the Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you get billed for the resource.
    Resource group | *myresourcegroup* | Provide a new or existing resource group name.    Resource group|*myresourcegroup*| A new resource group name or an existing one from your subscription.

1. Select **Create** to provision the cluster. Provisioning typically takes ten minutes.
   
1.	Select **Notifications** on the toolbar (the bell icon) to monitor the provisioning process.

1. When the process is complete, select the **Overview** tab to see the step-by-step process.  

    ![Three-step process]()

## Create a database

Create a database within the cluster to hold sample data:

1. 
1. 

## Ingest sample data

You now ingest the **StormEvents** sample data into the database. This is weather-related data made available by the [National Centers for Environmental Information](https://www.ncdc.noaa.gov/stormevents/).

1. `This series of steps is waiting on UI updates to use Event Hub. In the meantime, ingest the data in Query Explorer`:

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)

    .ingest into table StormEvents h'https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (ignoreFirstRecord=true)

    ```

1. On the **Overview** tab, select **Query Explorer**.

1. In Query Explorer, paste in the following command, and select **Run**:

    ```Kusto
    StormEvents
    | sort by StartTime asc
    | take 5
    ```
    The query returns the following results from the ingested sample data:

    ![Query results](media/create-cluster-database-portal/query-results.png)

## Stop and restart the cluster

When cluster is not used, in order to reduce cost the service can be stopped.
To do so, you need to select the stop (currently deactivate) option in the top menu of the Overview blade.
This means that the compute is being destroyed and the data is kept in storage (Blob).
This means the data will not be available for queries and no more data will be ingested to the cluster.
To start the cluster you need to go to the overview blade and select that option. 
It takes about 10 minutes to start the cluster (like cluster creation) and then it take some more time to load the data to hot cache.


## Clean up resources

If you plan to follow our other quickstarts and tutorials, keep the resources you created (you can stop the cluster as described in the last section). If not, clean up the **kustotest** resource group you created:  

1. ssss

1. 


## Next steps

> [!div class="nextstepaction"]
> [What is Kusto?](https://docs.microsoft.com/azure)
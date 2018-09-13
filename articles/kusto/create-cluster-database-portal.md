---
title: 'Quickstart: Create an Azure Data Explorer cluster and database'
description: 'In this quickstart, you learn how to create an Azure Data Explorer cluster and database, and ingest (load) data.'
services: kusto
author: mgblythe
ms.author: mblythe
ms.reviewer: mblythe
ms.service: kusto
ms.topic: quickstart
ms.date: 09/24/2018

#Customer intent: As a database administrator, I want to create a Data Explorer cluster and database so that I can understand whether Data Explorer is suitable for my analytics projects.
---

# Quickstart: Create an Azure Data Explorer cluster and database

Azure Data Explorer is a log analytics platform that is optimized for ad-hoc big data queries. To use Data Explorer, you first create a *cluster*, and create one or more *databases* in that cluster. Then you *ingest* (load) data into a database so that you can run queries against it. In this quickstart, you create a cluster and a database, then you ingest sample data into the database. This gives you a basic understanding of how Data Explorer works.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a cluster

You create a Data Explorer cluster in an Azure resource group, with a defined set of compute and storage resources.

1. Select the **Create a resource** button (+) in the upper-left corner of the  portal.

1. Select **Databases** > **Data Explorer**.

   ![Create cluster option](media/create-cluster-database-portal/create-cluster.png)

1. Fill out the form with the following information.

   ![Create cluster form](media/create-cluster-database-portal/create-cluster-form.png)

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Cluster name | A unique cluster name | Choose a unique name that identifies your cluster. For example, *mytestcluster*. The domain name *[region].kusto.windows.net* is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 3 to 22 characters.
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | *test-resource-group* | Create a new resource group. |
    | Location | *West US* | Select *West US* for this quickstart. For a production system, select the region that best meets your needs.
    | Compute specification | *D13 v2* | Select the lowest price specification for this quickstart. For a production system, select the specification that best meets your needs.
    | | |

1. Select **Create** to provision the cluster. Provisioning typically takes about ten minutes.

1. Select **Notifications** on the toolbar (the bell icon) to monitor the provisioning process.

1. When the process is complete, select the **Overview** tab. You're now ready for the second step in the process: database creation.  

    ![Step two: create a database](media/create-cluster-database-portal/database-creation.png)

## Create a database

Create a database within the cluster to hold sample data.

1. On the **Overview** tab, select **Create database**.

1. Fill out the form with the following information.

    ![Create database form](media/create-cluster-database-portal/create-database.png)

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Database name | *TestDatabase* | The database name must be unique within the cluster.
    | Retention period | *3650* | The time span for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested.
    | Cache period | *31* | The time span for which to keep frequently-queried data available in SSD storage or RAM, rather than in longer-term storage.
    | | | |

1. Select **Save** to create the database. Creation typically takes less than a minute.

1. When the process is complete, select the **Overview** tab. You're now ready for the third step in the process: data ingestion.  

    ![Step three: ingest data](media/create-cluster-database-portal/data-ingestion.png)

## Ingest sample data

You now ingest data into the database. The **StormEvents** sample data set contains weather-related data from the [National Centers for Environmental Information](https://www.ncdc.noaa.gov/stormevents/).

1. On the **Overview** tab, select **Query Explorer**.

1. In Query Explorer, paste the following command, and select **Run**.

    ```Data Explorer
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)

    .ingest into table StormEvents h'https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D' with (ignoreFirstRecord=true)

    ```

1. After ingestion completes, paste the following query, select the query in Query Explorer, and select **Run**.

    ```Data Explorer
    StormEvents
    | sort by StartTime asc
    | take 5
    ```
    The query returns the following results from the ingested sample data:

    ![Query results](media/create-cluster-database-portal/query-results.png)

## Stop and restart the cluster

You can stop and restart a cluster depending on business needs.

1. To stop the cluster, at the top of the **Overview** tab, select **Stop**.

    When the cluster is stopped, data is not available for queries, and you can't ingest new data.

1. To restart the cluster, at the top of the **Overview** tab, select **Start**.

    When the cluster is restarted, it takes about ten minutes for it to become available (like when it was originally provisioned). It takes additional time for data to load into the hot cache.  

## Clean up resources

If you plan to follow our other quickstarts and tutorials, keep the resources you created. If not, clean up **test-resource-group**, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created.  

    If the left menu is collapsed, select ![Expand button](../../includes/media/cosmos-db-delete-resource-group/expand.png) to expand it.

   ![Select resource group to delete](../../includes/media/cosmos-db-delete-resource-group/delete-resources-select.png)

1. In the new window, select the resource group, and then select **Delete resource group**.

   ![Delete resource group](../../includes/media/cosmos-db-delete-resource-group/delete-resources.png)

1. In the new window, type the name of the resource group to delete (*test-resource-group*), and then select **Delete**.

## Next steps

[Ingest streaming data](ingest-data-event-hub)

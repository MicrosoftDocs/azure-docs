---
title: 'Quickstart: Ingest data from Event Hub into Azure Data Explorer'
description: 'In this quickstart, you learn how to ingest (load) data into Azure Data Explorer from Event Hub.'
services: kusto
author: mgblythe
ms.author: mblythe
ms.reviewer: mblythe
ms.service: kusto
ms.topic: quickstart
ms.date: 09/24/2018

#Customer intent: As a database administrator, I want to ingest data into Data Explorer for Event Hub so I can analyze patterns in streaming data.
---

# Quickstart: Ingest data from Event Hub into Azure Data Explorer

Azure Data Explorer is a log analytics platform that is optimized for ad-hoc big data queries. Data Explorer offers ingestion (data loading) from Event Hubs, a big data streaming platform and event ingestion service. Event Hubs can handle the processing of millions of events per second in near real-time. In this quickstart, you create an event hub, connect to it from Data Explorer, then see data flow through the system.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* To complete this quickstart, you must first [provision a cluster and database](create-cluster-database-portal.md).

* To run sample code requires [Visual studio 2017 Version 15.3.2 or greater](https://www.visualstudio.com/vs/).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create an event hub

In this quickstart, you generate sample data and send it to an event hub. The first step is to create an event hub. You do this by using an Azure Resource Manager (ARM) template in the Azure portal.

1. Select the following button to start the deployment.

    [![Deploy to Azure](media/ingest-data-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-event-hubs-create-event-hub-and-consumer-group%2Fazuredeploy.json)

    The **Deploy to Azure** button takes you to the Azure portal to fill out a deployment form.

    ![Deploy to Azure](media/ingest-data-event-hub/deploy-to-azure.png)

1. Select the subscription where you want to create the event hub, and create a resource group named *test-hub-rg*.

    ![Create a resource group](media/ingest-data-event-hub/create-resource-group.png)

1. Fill out the form with the following information.

    ![Deployment form](media/ingest-data-event-hub/deployment-form.png)

    Use defaults for any settings not listed in the following table.

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your event hub.|
    | Resource group | *test-hub-rg* | Create a new resource group. |
    | Location | *West US* | Select *West US* for this quickstart. For a production system, select the region that best meets your needs.
    | Namespace name | A unique namespace name | Choose a unique name that identifies your namespace. For example, *mytestnamespace*. The domain name *servicebus.windows.net* is appended to the name you provide. The name can contain only letters, numbers, and hyphens. The name must start with a letter, and it must end with a letter or number. The value must be between 6 and 50 characters long.
    | Event hub name | *test-hub* | The event hub sits under the namespace, which provides a unique scoping container. The event hub name must be unique within the namespace. |
    | Consumer group name | *test-group* | Consumer groups enable multiple consuming applications to each have a separate view of the event stream. |
    | | |

1. Select **Purchase**, which acknowledges that you're creating resources in your subscription.

1. Select **Notifications** on the toolbar (the bell icon) to monitor the provisioning process.

    It might take several minutes for the deployment to succeed, but you can move on to the next step.

## Add a target table to Data Explorer

You now add a table in Data Explorer, which Event Hubs will send data to. You create the table in the cluster and database you created in the prerequisites.

1. In the Azure portal, under the cluster you created, select **Query Explorer**.

    ![Query Explorer link](media/ingest-data-event-hub/query-explorer-link.png)

1. Copy the following command into the window and select **Run**.

    ```Kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    ![Run create query](media/ingest-data-event-hub/run-create-query.png)

1. Copy the following command into the window and select **Run**.

    ```Kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"TimeStamp","path":"$.timeStamp","datatype":"datetime"},{"column":"Name","path":"$.name","datatype":"string"},{"column":"Metric","path":"$.metric","datatype":"int"},{"column":"Source","path":"$.source","datatype":"string"}]'
    ```
    This command maps incoming JSON to the column names and data types you used when creating the table.

## Connect to the event hub

Now you connect to the event hub from Data Explorer, so that data flowing into the event hub is streamed to the test table.

1. Select **Notifications** on the toolbar to verify that the event hub deployment succeeded.

1. Under the event hub namespace you created, select **Shared access policies**, then **RootManageSharedAccessKey**.

    ![Shared access policies](media/ingest-data-event-hub/shared-access-policies.png)

1. Copy **Connection string - primary key**. You need this shortly.

    ![Connection string](media/ingest-data-event-hub/connection-string.png)

1. Under the cluster you created, select **Databases** then **TestDatabase**.

    ![Select test database](media/ingest-data-event-hub/select-test-database.png)

1. Select **Data ingestion** then **Create**.

    ![Data ingestion](media/ingest-data-event-hub/data-ingestion-create.png)

1. Fill out the form with the following information.

    ![Event hub connection](media/ingest-data-event-hub/event-hub-connection.png)

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Data connection name | *test-hub-connection* | The name of the connection you want to create in Data Explorer.|
    | Event hub namespace | A unique namespace name | The name you chose earlier that identifies your namespace. |
    | Event hub | *test-hub* | The event hub you created. |
    | Consumer group | *test-group* | The consumer group defined in the event hub you created. |
    | Event hub namespace connection string | A unique string from your namespace | The string you copied earlier from **Connection string - primary key**. |
    | Table | *TestTable* | The table you created in **TestDatabase**. |
    | File format | *JSON* | JSON and CSV formats are supported. |
    | Table | *TestMapping* | The mapping you created in **TestDatabase**. |

### Event Hub ingestion can be set up for either static or dynamic events routing:

* Dynamic routing means that events read from a single Event Hub can land in different tables in your Kusto cluster. This requires the following properties to be added to the [EventData.Properties](https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.eventdata.properties?view=azure-dotnet#Microsoft_ServiceBus_Messaging_EventData_Properties) bag:

  * Table - name (case sensitive) of the target Kusto table

  * Format - payload format ("csv" or "json")

  * IngestionMappingReference - name of the ingestion mapping object (pre-created on the table) to be used
    Kusto provides a control command to [create / edit / delete an ingestion mapping](../controlCommands/tables.md#create-ingestion-mapping).

* Static routing means that there is a 1:1 mapping from an Event Hub to the ingestion properties {Table, Format, IngestionMappingReference}, that need to be specified during onboarding.

## Generate sample data

## Review sample data flow

## Clean up resources

Drop table and EH resource group.

## Next steps

## Next steps

> [!div class="nextstepaction"]
> [Explore data](explore-data)
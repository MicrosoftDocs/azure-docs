---
title: Use the Microsoft Flow connector to run Kusto queries and commands automatically as part of a scheduled or triggered task 
description: Learn some common Microsoft Flow connector usage examples.
author: orspod
ms.author: orspodek
ms.reviewer: dorcohen
ms.service: data-explorer
ms.topic: example-scenario
ms.date: 03/15/2020
---

# Microsoft Flow connector (Preview) usage examples

The Microsoft Flow connector enables you to run Kusto queries and commands automatically as part of a scheduled or triggered task, using [Microsoft Flow](https://flow.microsoft.com/). This document contains several common Microsoft Flow connector usage examples.

For more information, see [Microsoft Flow connector (Preview)](flow.md).

## Usage examples

1. [Microsoft Flow connector and SQL](#example-1-microsoft-flow-connector-and-sql)
1. [Push data to Power BI dataset](#example-2-push-data-to-power-bi-dataset)
1. [Conditional queries](#example-3-conditional-queries)
1. [Email multiple Azure Data Explorer Flow charts](#example-4-email-multiple-azure-data-explorer-flow-charts)
1. [Send a different email to different contacts](#example-5-send-a-different-email-to-different-contacts)
1. [Create a custom HTML table](#example-6-create-a-custom-html-table)

## Example 1: Microsoft Flow connector and SQL

Use the Microsoft Flow connector to query your data and  aggregate it in an SQL database.

> [!Note]
> SQL insert is done separately for each row. Only use the Microsoft Flow connector for small amounts of output data. 

![alt text](./Media/flow/flow-sqlexample.png "flow-sqlexample")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

## Example 2: Push data to Power BI dataset

The Microsoft Flow connector can be used together with the Power BI connector to push data from Kusto queries to Power BI streaming datasets.

1. Create a new *Run query and list results* action.
1. Select **New step**.
1. Select **Add an action** and search for *Power BI*.
1. Select **Power BI**.
1. Select **Add rows to a dataset**. 

    ![alt text](./Media/flow/flow-powerbiconnector.png "flow-powerbiconnector")
1. Enter the *Workspace*, *Dataset*, and *Table* to which data will be pushed.
1. From the dynamic content dialog, add a *Payload* containing your dataset schema and the relevant Kusto query results.

    ![alt text](./Media/flow/flow-powerbifields.png "flow-powerbifields")

Flow automatically applies the Power BI action for each row of the Kusto query result table. 

![alt text](./Media/flow/flow-powerbiforeach.png "flow-powerbiforeach")

## Example 3: Conditional queries

The results of Kusto queries can be used as input or conditions for the next flow actions.

In the following example, we query Kusto for incidents that occurred during the last day. For each resolved incident, a slack message is posted and a push notification is created.
For each incident that is still active, Kusto is queried for more information about similar incidents. It sends that information as an email, and opens a related TFS task.

Follow these instructions to create a similar Flow:

1. Create a new *Run query and list results* action.
1. Select **New step**.
1. Select **Condition control**.
1. From the dynamic content window, select the parameter you want to use as a condition for next actions.
1. Select the type of *Relationship* and *Value* to set a specific condition on the given parameter.

    ![alt text](./Media/flow/flow-condition.png "flow-condition")

    Flow applies this condition on each row of the query result table.
1. Add actions for when the condition is true and false.

    ![alt text](./Media/flow/flow-conditionactions.png "flow-conditionactions")

You can use the result values from the Kusto query as input for the next actions. Select the result values from the dynamic content window.
In the example below, a *Slack - Post Message* action and *Visual Studio - Create a new work item* action containing data from the Kusto query were added.

![alt text](./Media/flow/flow-slack.png "flow-slack")

![alt text](./Media/flow/flow-visualstudio.png "flow-visualstudio")

In this example, if an incident is still active, query Kusto again to get information on how incidents from the same source were solved in the past.

![alt text](./Media/flow/flow-conditionquery.png "flow-conditionquery")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

Visualize this information as a pie chart and email it to the team.

![alt text](./Media/flow/flow-conditionemail.png "flow-conditionemail")

## Example 4: Email multiple Azure Data Explorer Flow charts

1. Create a new Flow with "Recurrence" trigger, and define the interval of the Flow and the frequency. 
1. Add a new step, with one or more *Kusto - Run query and visualize results* actions. 

    ![alt text](./Media/flow/flow-severalqueries.png "flow-severalqueries")
1. For each *Kusto - Run query and visualize result*, define the following fields:
    * Cluster URL (in the *Cluster Name* field)
    * Database Name
    * Query and Chart Type (HTML Table/ Pie Chart/ Time Chart/ Bar Chart/ Enter Custom Value).

    ![alt text](./Media/flow/flow-visualizeresultsmultipleattachments.png "flow-visualizeresultsmultipleattachments")

> [!IMPORTANT]
> In the *Cluster Name* fields, enter the cluster URL.

1. Add a *Send an email* action. 
    * In the *Body* field, insert the required *body* so that the visualized result of the query is included in the body of the email.
    * To add an attachment to the email, add *Attachment Name* and *Attachment Content*.
    ![alt text](./Media/flow/flow-emailmultipleattachments.png "flow-emailmultipleattachments")

Results:

![alt text](./Media/flow/flow-resultsmultipleattachments.png "flow-resultsmultipleattachments")

![alt text](./Media/flow/flow-resultsmultipleattachments2.png "flow-resultsmultipleattachments2")

## Example 5: Send a different email to different contacts

You can leverage Microsoft Flow to send different customized emails to different contacts. The email addresses and the email contents are a result of a Kusto query.

Example:

![alt text](./Media/flow/flow-dynamicemailkusto.png "flow-dynamicemailkusto")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

![alt text](./Media/flow/flow-dynamicemail.png "flow-dynamicemail")

## Example 6: Create a custom HTML table

You can leverage Microsoft Flow to create and use custom HTML elements, such as a custom HTML table.

The following example demonstrates how to create a custom HTML table. The HTML table will have its rows colored by log level (the same as in Azure Data Explorer).

Follow these instructions to create a similar Flow:

1. Create a new *Kusto - Run query and list results* action.

    ![alt text](./Media/flow/flow-listresultforhtmltable.png "flow-listresultforhtmltable")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

1. Loop over the query results and create the HTML table body: 
    1. To create a variable to hold the HTML string, select **New step**
    1. Select **Add an action** and search for *Variables*. 
    1. Select **Variables - Initialize variable**. 
    1. Initialize a string variable as follows:

    ![alt text](./Media/flow/flow-initializevariable.png "flow-initializevariable")

1. Loop over the results:
    1. Select **New step**.
    1. Select **Add an action**.
    1. Search for *Variables*. 
    1. Select **Variables - Append to string variable**. 
    1. Select the variable name that you initialized before, and create the HTML table rows using the query results. 
    When selecting the query results, *Apply to each* is automatically added.

    In the example below, the `if` expression is used to define the style of each row:

    ```if(equals(items('Apply_to_each')?['Level'], 'Warning'), 'Yellow', if(equals(items('Apply_to_each')?['Level'], 'Error'), 'red', 'white'))```

    ![alt text](./Media/flow/flow-createhtmltableloopcontent.png "flow-createhtmltableloopcontent")

1. Create the full HTML content: 
    1. Add a new action outside *Apply to each*. 
    In the following example the action used is *Send an email*.
    1. Define your HTML table using the variable from the previous steps. 
    1. If you're sending an email, select **Show advanced options** and, under *Is HTML*, select **Yes**.

    ![alt text](./Media/flow/flow-customhtmltablemail.png "flow-customhtmltablemail")

Result:

![alt text](./Media/flow/flow-customhtmltableresult.png "flow-customhtmltableresult")


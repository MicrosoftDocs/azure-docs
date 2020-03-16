---
title: Use the Microsoft Flow connector to run Kusto queries and commands automatically as part of a scheduled or triggered task 
description: Learn some common Microsoft Flow connector usage examples.
author: orspod
ms.author: orspodek
ms.reviewer: dorcohen
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/15/2020
---

# Microsoft Flow connector (Preview) usage examples

The Microsoft Flow connector enables you to run Kusto queries and commands automatically as part of a scheduled or triggered task, using [Microsoft Flow](https://flow.microsoft.com/). This document contains several common Microsoft Flow connector usage examples.

For more information, see [Microsoft Flow connector (Preview)](flow.md).

* [Microsoft Flow connector and SQL](#microsoft-flow-connector-and-sql)
* [Push data to Power BI dataset](#push-data-to-power-bi-dataset)
* [Conditional queries](#conditional-queries)
* [Email multiple Azure Data Explorer Flow charts](#email-multiple-azure-data-explorer-flow-charts)
* [Send a different email to different contacts](#send-a-different-email-to-different-contacts)
* [Create a custom HTML table](#create-a-custom-html-table)

## Microsoft Flow connector and SQL

Use the Microsoft Flow connector to query your data and  aggregate it in an SQL database.

> [!Note]
> SQL insert is done separately for each row. Only use the Microsoft Flow connector for small amounts of output data. 

![Flow SQL example](./Media/flow-usage/flow-sqlexample.png "Flow SQL example")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

## Push data to Power BI dataset

The Microsoft Flow connector can be used together with the Power BI connector to push data from Kusto queries to Power BI streaming datasets.

1. Create a new Run query and list results action.
1. Select **New step**.
1. Select **Add an action** and search for Power BI.
1. Select **Power BI**.
1. Select **Add rows to a dataset**. 

    ![Flow Power BI connector](./Media/flow-usage/flow-powerbiconnector.png "Flow Power BI connector")
1. Enter the Workspace, Dataset, and Table to which data will be pushed.
1. From the dynamic content dialog, add a Payload containing your dataset schema and the relevant Kusto query results.

    ![Flow Power BI fields](./Media/flow-usage/flow-powerbifields.png "Flow Power BI fields")

Flow automatically applies the Power BI action for each row of the Kusto query result table. 

![Flow Power BI action for each row](./Media/flow-usage/flow-powerbiforeach.png "Flow Power BI action for each row")

## Conditional queries

The results of Kusto queries can be used as input or conditions for the next flow actions.

In the following example, we query Kusto for incidents that occurred during the last day. For each resolved incident, a slack message is posted and a push notification is created.
For each incident that is still active, Kusto is queried for more information about similar incidents. It sends that information as an email, and opens a related TFS task.

Follow these instructions to create a similar Flow:

1. Create a new Run query and list results action.
1. Select **New step**.
1. Select **Condition control**.
1. From the dynamic content window, select the parameter you want to use as a condition for next actions.
1. Select the type of *Relationship* and *Value* to set a specific condition on the given parameter.

    ![Flow conditions](./Media/flow-usage/flow-condition.png "Flow conditions")(./Media/flow-usage/flow-condition.png#lightbox)

    Flow applies this condition on each row of the query result table.
1. Add actions for when the condition is true and false.

    ![Flow condition actions](./Media/flow-usage/flow-conditionactions.png "Flow condition actions")(./Media/flow-usage/flow-conditionactions.png#lightbox)

You can use the result values from the Kusto query as input for the next actions. Select the result values from the dynamic content window.
In the example below, a Slack - Post Message action and Visual Studio - Create a new work item action containing data from the Kusto query were added.

![Slack - Post Message action](./Media/flow-usage/flow-slack.png "Slack - Post Message action")

![Visual Studio action](./Media/flow-usage/flow-visualstudio.png "Visual Studio action")

In this example, if an incident is still active, query Kusto again to get information on how incidents from the same source were solved in the past.

![Flow condition query](./Media/flow-usage/flow-conditionquery.png "Flow condition query")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

Visualize this information as a pie chart and email it to the team.

![Flow condition email](./Media/flow-usage/flow-conditionemail.png "Flow condition email")

## Email multiple Azure Data Explorer Flow charts

1. Create a new Flow with "Recurrence" trigger, and define the interval of the Flow and the frequency. 
1. Add a new step, with one or more Kusto - Run query and visualize results actions. 

    ![Run several queries in a flow](./Media/flow-usage/flow-severalqueries.png "Run several queries in a flow")
1. For each*Kusto - Run query and visualize result, define the following fields:
    * Cluster URL (in the *Cluster Name* field)
    * Database Name
    * Query and Chart Type (HTML Table/ Pie Chart/ Time Chart/ Bar Chart/ Enter Custom Value).

    ![Visualize results with multiple attachments](./Media/flow-usage/flow-visualizeresultsmultipleattachments.png "Visualize results with multiple attachments")

> [!IMPORTANT]
> In the *Cluster Name* fields, enter the cluster URL.

1. Add a Send an email action. 
    * In the *Body* field, insert the required body so that the visualized result of the query is included in the body of the email.
    * To add an attachment to the email, add Attachment Name and Attachment Content.
    ![Email multiple attachments](./Media/flow-usage/flow-emailmultipleattachments.png "Email multiple attachments")

Results:

![Results of multiple attachments](./Media/flow-usage/flow-resultsmultipleattachments.png "Results of multiple attachments")(./Media/flow-usage/flow-resultsmultipleattachments.png#lightbox)

![Results of multiple attachments](./Media/flow-usage/flow-resultsmultipleattachments2.png "Results of multiple attachments")(./Media/flow-usage/flow-resultsmultipleattachments2.png#lightbox)

## Send a different email to different contacts

You can leverage Microsoft Flow to send different customized emails to different contacts. The email addresses and the email contents are a result of a Kusto query.

Example:

![Dynamic email using a Kusto query](./Media/flow-usage/flow-dynamicemailkusto.png "Dynamic email using a Kusto query")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

![Dynamic email in the flow action](./Media/flow-usage/flow-dynamicemail.png "Dynamic email in the flow action")

## Create a custom HTML table

You can leverage Microsoft Flow to create and use custom HTML elements, such as a custom HTML table.

The following example demonstrates how to create a custom HTML table. The HTML table will have its rows colored by log level (the same as in Azure Data Explorer).

Follow these instructions to create a similar Flow:

1. Create a new Kusto - Run query and list results action.

    ![List results for an HTML table](./Media/flow-usage/flow-listresultforhtmltable.png "List results for an HTML table")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

1. Loop over the query results and create the HTML table body: 
    1. To create a variable to hold the HTML string, select **New step**
    1. Select **Add an action** and search for Variables. 
    1. Select **Variables - Initialize variable**. 
    1. Initialize a string variable as follows:

    ![Initialize a variable](./Media/flow-usage/flow-initializevariable.png "Initialize a variable")

1. Loop over the results:
    1. Select **New step**.
    1. Select **Add an action**.
    1. Search for Variables. 
    1. Select **Variables - Append to string variable**. 
    1. Select the variable name that you initialized before, and create the HTML table rows using the query results. 
    When selecting the query results, Apply to each is automatically added.

    In the example below, the `if` expression is used to define the style of each row:

    ```if(equals(items('Apply_to_each')?['Level'], 'Warning'), 'Yellow', if(equals(items('Apply_to_each')?['Level'], 'Error'), 'red', 'white'))```

    ![Create HTML table loop content](./Media/flow-usage/flow-createhtmltableloopcontent.png "Create HTML table loop content")(./Media/flow-usage/flow-createhtmltableloopcontent.png#lightbox)

1. Create the full HTML content: 
    1. Add a new action outside Apply to each. 
    In the following example the action used is Send an email.
    1. Define your HTML table using the variable from the previous steps. 
    1. If you're sending an email, select **Show advanced options** and, under Is HTML, select **Yes**.

    ![Custom HTML table email](./Media/flow-usage/flow-customhtmltablemail.png "Custom HTML table email")

Result:

![Custom HTML table email result](./Media/flow-usage/flow-customhtmltableresult.png "Custom HTML table email result")

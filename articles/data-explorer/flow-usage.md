---
title: Microsoft Azure Data Explorer Flow connector (Preview) usage examples 
description: Learn some common Microsoft Flow connector usage examples.
author: orspod
ms.author: orspodek
ms.reviewer: dorcohen
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/15/2020
---

# Microsoft Flow connector (Preview) usage examples

The Azure Data Explorer flow connector allows Azure Data Explorer to use [Microsoft Power Automate's Flow capabilities](https://flow.microsoft.com/) to run Kusto queries and commands automatically as part of a scheduled or triggered task. This document contains several common Microsoft Flow connector usage examples.

For more information, see [Microsoft Flow connector (Preview)](flow.md).

* [Microsoft Flow connector and SQL](#microsoft-flow-connector-and-sql)
* [Push data to Power BI dataset](#push-data-to-power-bi-dataset)
* [Conditional queries](#conditional-queries)
* [Email multiple Azure Data Explorer Flow charts](#email-multiple-azure-data-explorer-flow-charts)
* [Send a different email to different contacts](#send-a-different-email-to-different-contacts)
* [Create a custom HTML table](#create-a-custom-html-table)

## Microsoft Flow connector and SQL

Use the Microsoft Flow connector to query your data and aggregate it in an SQL database.

> [!Note]
> SQL insert is done separately for each row. Only use the Microsoft Flow connector for small amounts of output data. 

![](./media/flow-usage/flow-sqlexample.png)

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

## Push data to Power BI dataset

The Microsoft Flow connector can be used together with the Power BI connector to push data from Kusto queries to Power BI streaming datasets.

1. Create a new Run query and list results action.
1. Select **New step**.
1. Select **Add an action** and search for Power BI.
1. Select **Power BI**.
1. Select **Add rows to a dataset**. 

    ![Flow Power BI connector](./media/flow-usage/flow-powerbiconnector.png)
1. Enter the **Workspace**, **Dataset**, and **Table** to which data will be pushed.
1. From the dynamic content dialog, add a Payload containing your dataset schema and the relevant Kusto query results.

    ![Flow Power BI fields](./media/flow-usage/flow-powerbifields.png)

Flow automatically applies the Power BI action for each row of the Kusto query result table. 

![Flow Power BI action for each row](./media/flow-usage/flow-powerbiforeach.png)

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

    [![](./media/flow-usage/flow-condition.png "Flow conditions")](./media/flow-usage/flow-condition.png#lightbox)

    Flow applies this condition on each row of the query result table.
1. Add actions for when the condition is true and false.

    [![](./media/flow-usage/flow-conditionactions.png "Flow condition actions")](./media/flow-usage/flow-conditionactions.png#lightbox)

You can use the result values from the Kusto query as input for the next actions. Select the result values from the dynamic content window.
In the example below, a Slack - Post Message action and Visual Studio - Create a new work item action containing data from the Kusto query were added.

![Slack - Post Message action](./media/flow-usage/flow-slack.png)

![Visual Studio action](./media/flow-usage/flow-visualstudio.png)

In this example, if an incident is still active, query Kusto again to get information on how incidents from the same source were solved in the past.

![Flow condition query](./media/flow-usage/flow-conditionquery.png)

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

Visualize this information as a pie chart and email it to the team.

![Flow condition email](./media/flow-usage/flow-conditionemail.png)

## Email multiple Azure Data Explorer Flow charts

1. Create a new Flow with "Recurrence" trigger, and define the interval of the Flow and the frequency. 
1. Add a new step, with one or more Kusto - Run query and visualize results actions. 

    ![Run several queries in a flow](./media/flow-usage/flow-severalqueries.png)
1. For each Kusto - Run query and visualize result, define the following fields:
    * Cluster URL (in the *Cluster Name* field)
    * Database Name
    * Query and Chart Type (HTML Table/ Pie Chart/ Time Chart/ Bar Chart/ Enter Custom Value).

    ![Visualize results with multiple attachments](./media/flow-usage/flow-visualizeresultsmultipleattachments.png)

    > [!IMPORTANT]
    > In the *Cluster Name* fields, enter the cluster URL.

1. Add a Send an email action. 
    * In the *Body* field, insert the required body so that the visualized result of the query is included in the body of the email.
    * To add an attachment to the email, add Attachment Name and Attachment Content.
    
    ![Email multiple attachments](./media/flow-usage/flow-emailmultipleattachments.png)

Results:

[![](./media/flow-usage/flow-resultsmultipleattachments.png "Results of multiple attachments")](./media/flow-usage/flow-resultsmultipleattachments.png#lightbox)

[![](./media/flow-usage/flow-resultsmultipleattachments2.png "Results of multiple attachments")](./media/flow-usage/flow-resultsmultipleattachments2.png#lightbox)

## Send a different email to different contacts

You can leverage Microsoft Flow to send different customized emails to different contacts. The email addresses and the email contents are a result of a Kusto query.

Example:

![Dynamic email using a Kusto query](./media/flow-usage/flow-dynamicemailkusto.png)

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

![Dynamic email in the flow action](./media/flow-usage/flow-dynamicemail.png)

## Create a custom HTML table

You can leverage Microsoft Flow to create and use custom HTML elements, such as a custom HTML table.

The following example demonstrates how to create a custom HTML table. The HTML table will have its rows colored by log level (the same as in Azure Data Explorer).

Follow these instructions to create a similar Flow:

1. Create a new Kusto - Run query and list results action.

    ![List results for an HTML table](./media/flow-usage/flow-listresultforhtmltable.png)

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

1. Loop over the query results and create the HTML table body: 
    1. To create a variable to hold the HTML string, select **New step**
    1. Select **Add an action** and search for Variables. 
    1. Select **Variables - Initialize variable**. 
    1. Initialize a string variable as follows:

    ![Initialize a variable](./media/flow-usage/flow-initializevariable.png)

1. Loop over the results:
    1. Select **New step**.
    1. Select **Add an action**.
    1. Search for Variables. 
    1. Select **Variables - Append to string variable**. 
    1. Select the variable name that you initialized before, and create the HTML table rows using the query results. 
    When selecting the query results, Apply to each is automatically added.

    In the example below, the `if` expression is used to define the style of each row:

    ```if(equals(items('Apply_to_each')?['Level'], 'Warning'), 'Yellow', if(equals(items('Apply_to_each')?['Level'], 'Error'), 'red', 'white'))```

    [![](./media/flow-usage/flow-createhtmltableloopcontent.png "Create HTML table loop content")](./media/flow-usage/flow-createhtmltableloopcontent.png#lightbox)

1. Create the full HTML content: 
    1. Add a new action outside Apply to each. 
    In the following example the action used is Send an email.
    1. Define your HTML table using the variable from the previous steps. 
    1. If you're sending an email, select **Show advanced options** and, under Is HTML, select **Yes**.

    ![Custom HTML table email](./media/flow-usage/flow-customhtmltablemail.png)

Result:

![Custom HTML table email result](./media/flow-usage/flow-customhtmltableresult.png)

## Next steps

Learn about the [Microsoft Azure Explorer Logic App connector](https://docs.microsoft.com/azure/kusto/tools/logicapps) which is another way to run Kusto queries and commands automatically as part of a scheduled or triggered task.

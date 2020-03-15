---
title: Use the Microsoft Azure Kusto connector to run Kusto queries and commands automatically as part of a scheduled or triggered task 
description: Learn about using the Microsoft Azure Kusto connector to create flows of automatically scheduled or triggered tasks.
author: orspod
ms.author: orspodek
ms.reviewer: dorcohen
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/15/2020
---

# Microsoft Flow Azure Kusto Connector (Preview)

The Microsoft Flow Azure Kusto connector enables you to run Kusto queries and commands automatically as part of a scheduled or triggered task, using [Microsoft Flow](https://flow.microsoft.com/).

Common usage scenarios include:

* Sending daily reports containing tables and charts
* Setting notifications based on query results
* Scheduling control commands on clusters
* Exporting and importing data between Azure Data Explorer and other databases 

##  Log in 

1. Log in to [Microsoft Flow](https://flow.microsoft.com/).

1. When connecting to the Azure Kusto connector for the first time, you'll be prompted to sign in.

1. Select **Sign in** and enter your credentials.

![alt text](./Media/kusto-flow/flow-signin.png "flow-signin")

## Authentication

You can authenticate to Azure Kusto Flow using user credentials or an AAD application.

### AAD Application Authentication

You can authenticate to Azure Kusto Flow with an AAD application using the following steps:

> [!Note]
> Make sure your application is an [AAD application](https://docs.microsoft.com/azure/kusto/management/access-control/how-to-provision-aad-app) and is authorized to execute queries on your cluster.

1. Select the three dots at the top right of the Azure Data Explorer (Kusto) connector:
![alt text](./Media/kusto-flow/flow-addconnection.png "flow-addconnection")

1. Select **Add new connection** and then select **Connect with Service Principal**.
![alt text](./Media/kusto-flow//flow-signin.png "flow-signin")

1. Enter the required information:
    * Connection Name: A descriptive and meaningful name for the new connection
    * Client ID: Your application ID
    * Client Secret: Your application key
    * Tenant: The ID of the AAD directory in which you created the application. For example, the Microsoft tenant ID is: 72f988bf-86f1-41af-91ab-2d7cd011db47

![alt text](./Media/kusto-flow/flow-appauth.png "flow-appauth")

When authentication is complete, you'll see that your flow uses the newly added connection.

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

![alt text](./Media/kusto-flow/flow-appauthcomplete.png "flow-appauthcomplete")

From now on, this flow will run using these application credentials.

## Find the Azure Kusto connector

To use the Azure Data Explorer (Kusto) connector, you need to first add a trigger. 
A trigger can be defined based on a recurring time period, or as response to a previous flow action.

1. [Create a new flow.](https://flow.microsoft.com/manage/flows/new)
1. Add **Scheduled-from blank**.

    ![alt text](./Media/kusto-flow/scheduled-from-blank.png "Scheduled-from blank")

1. Enter the required information on the *Build a scheduled flow* page.
    ![alt text](./Media/kusto-flow/build-scheduled-flow.png "Build scheduled flow")
1. Select **Create**.
1. Select **+ New step**.
1. In the search box, enter "Kusto".

    ![alt text](./Media/kusto-flow/flow-actions.png "flow-actions")

1. Select **Azure Data Explorer**.

## Flow Actions

When you open the Azure Data Explorer connector, there are three possible actions you can add to your flow.

This section describes the capabilities and parameters for each Azure Kusto Flow action.

![alt text](./Media/kusto-flow/flow-adx-actions.png "Flow Azure Data Explorer actions")

### Run control command and visualize results

Use the *Run control command and visualize results* action to run a [control command](https://docs.microsoft.com/azure/kusto/management/index).

1. Specify the cluster URL. For example, https://clusterName.eastus.kusto.windows.net
1. Enter the name of the database.
1. Specify the control command:
    * Select dynamic content from the apps and connectors used in the flow
    * Add an expression to access, convert, and compare values
1. To send the results of this action by email as a table or a chart, specify the chart type, which can be:
    * An HTML table
    * A pie chart
    * A time chart
    * A bar chart

![alt text](./Media/kusto-flow/flow-runcontrolcommand.png "flow-runcontrolcommand")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

### Run query and list results

> [!Note]
> If your query starts with a dot (meaning it's a [control command](https://docs.microsoft.com/azure/kusto/management/index)), use [Run control command and visualize results](#run-control-command-and-visualize-results)

This action sends a query to Kusto cluster. The actions that are added afterwards iterate over each line of the results of the query.

The following example triggers a query every minute and sends an email based on the query results. The query checks the number of lines in the database, and then sends an email only if the number of lines is greater than 0. 

![alt text](./Media/kusto-flow/flow-runquerylistresults-2.png "flow-runquerylistresults")

> [!Note]
> If the column has several lines, the connector will run for each line in the column.

### Run query and visualize results
        
> [!Note]
> If your query starts with a dot (meaning it's a [control command]((https://docs.microsoft.com/azure/kusto/management/index)), use [Run control command and visualize results](#run-control-command-and-visualize-results)
        
Use the *Run query and visualize results* action to visualize Kusto query result as a table or chart. For example, use this flow to receive daily ICM reports by email. 
    
In this example, the results of the query are returned as an HTML table.
            
![alt text](./Media/kusto-flow/flow-runquery.png "flow-runquery")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

## Email Kusto query results

You can include a step in any flow to send reports by email to any email address. 

1. Select **+ New Step** to add a new step to your flow.
1. In the search field, enter *Office 365* and select **Office 365 Outlook**.
1. Select **Send an email**.
1. Enter the email address to where you want the email report sent.
1. Enter the subject of the email.
1. In the *Body* field, from the Dynamic content field, select **Body**.
1. Select **Show advanced options**.
1. In the *Attachments Name -1* field, select **Attachment Name**.
1. In the *Attachments Content* field, select **Attachment Content**.
1. If necessary, set the importance level.
1. Select **Save**.

![alt text](./Media/kusto-flow/flow-sendemail.png "flow-sendemail")

## How to check if your flow succeeded

To check if your flow succeeded, see the flow's run history:
1. Go to the [Microsoft Flow Home Page](https://flow.microsoft.com/).
1. From the main menu, select [My flows](https://flow.microsoft.com/manage/flows).
    ![alt text](./Media/kusto-flow/flow-myflows.png "flow-myflows")
1. On the row of the flow you want to investigate, select the more commands icon, and then **Run history**.
    ![alt text](./Media/kusto-flow//flow-runhistory.png "flow-runhistory")
    All flow runs are listed with start time, duration, and status.
    ![alt text](./Media/kusto-flow/flow-runhistoryresults.png "flow-runhistoryresults")
    For full details about the flow, on the [My flows](https://flow.microsoft.com/manage/flows) page, select the flow you want to investigate.
    ![alt text](./Media/kusto-flow/flows-fulldetails.png "flow-runhistoryresults") 

To see why a run failed, select the run start time. The flow appears and the step of the flow that failed is indicated by a red exclamation point. Expand the failed step to view its details. The right-hand pane contains information about the failure so that you can troubleshoot it.
![alt text](./Media/kusto-flow/flow-error.png "flow-error")

## Timeout Exceptions

Your flow can fail and return a "RequestTimeout" exception if it runs for more than seven minutes.

Learn more about [Microsoft Flow limitations](#limitations).
    
The same query may run successfully in Azure Data Explorer (Kusto) where the time isn't limited and can be changed.
            
The "RequestTimeout" exception is shown in the image below:
    
![alt text](./Media/kusto-flow/flow-requesttimeout.png "flow-requesttimeout")
    
To fix a timeout issue, try to make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query.

For more information, read about [Query best practices]((https://docs.microsoft.com/azure/kusto/query/best-practices).

## Usage Examples

This section contains several common examples of using the Azure Data Explorer (Kusto) flow connector.

### Example 1 - Azure Data Explorer (Kusto) flow and SQL

Use the Azure Data Explorer (Kusto) flow connector to query your data and  aggregate it in an SQL database.

> [!Note]
> SQL insert is done separately for each row. Only use the Azure Data Explorer flow connector for small amounts of output data. 

![alt text](./Media/kusto-flow/flow-sqlexample.png "flow-sqlexample")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

### Example 2 - Push data to Power BI dataset

The Azure Data Explorer (Kusto) Flow connector can be used together with the Power BI connector to push data from Kusto queries to Power BI streaming datasets.

1. Create a new *Run query and list results* action.
1. Select **New step**.
1. Select **Add an action** and search for *Power BI*.
1. Select **Power BI**.
1. Select **Add rows to a dataset**. 

    ![alt text](./Media/kusto-flow/flow-powerbiconnector.png "flow-powerbiconnector")
1. Enter the *Workspace*, *Dataset*, and *Table* to which data will be pushed.
1. From the dynamic content dialog, add a *Payload* containing your dataset schema and the relevant Kusto query results.

    ![alt text](./Media/kusto-flow/flow-powerbifields.png "flow-powerbifields")

Flow automatically applies the Power BI action for each row of the Kusto query result table. 

![alt text](./Media/kusto-flow/flow-powerbiforeach.png "flow-powerbiforeach")

### Example 3 - Conditional queries

The results of Kusto queries can be used as input or conditions for the next flow actions.

In the following example, we query Kusto for incidents that occurred during the last day. For each resolved incident, a slack message is posted and a push notification is created.
For each incident that is still active, Kusto is queried for more information about similar incidents. It sends that information as an email, and opens a related TFS task.

Follow these instructions to create a similar Flow:

1. Create a new *Run query and list results* action.
1. Select **New step**.
1. Select **Condition control**.
1. From the dynamic content window, select the parameter you want to use as a condition for next actions.
1. Select the type of *Relationship* and *Value* to set a specific condition on the given parameter.

    ![alt text](./Media/kusto-flow/flow-condition.png "flow-condition")

    Flow applies this condition on each row of the query result table.
1. Add actions for when the condition is true and false.

    ![alt text](./Media/kusto-flow/flow-conditionactions.png "flow-conditionactions")

You can use the result values from the Kusto query as input for the next actions. Select the result values from the dynamic content window.
In the example below, a *Slack - Post Message* action and *Visual Studio - Create a new work item* action containing data from the Kusto query were added.

![alt text](./Media/kusto-flow/flow-slack.png "flow-slack")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

![alt text](./Media/kusto-flow/flow-visualstudio.png "flow-visualstudio")

In this example, if an incident is still active, query Kusto again to get information on how incidents from the same source were solved in the past.

![alt text](./Media/kusto-flow/flow-conditionquery.png "flow-conditionquery")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

Visualize this information as a pie chart and email it to the team.

![alt text](./Media/kusto-flow/flow-conditionemail.png "flow-conditionemail")

### Example 4 - Email multiple Azure Data Explorer (Kusto) Flow charts

1. Create a new Flow with "Recurrence" trigger, and define the interval of the Flow and the frequency. 
1. Add a new step, with one or more *Kusto - Run query and visualize results* actions. 

    ![alt text](./Media/kusto-flow/flow-severalqueries.png "flow-severalqueries")
1. For each *Kusto - Run query and visualize result*, define the following fields:
    * Cluster URL (in the *Cluster Name* field)
    * Database Name
    * Query and Chart Type (HTML Table/ Pie Chart/ Time Chart/ Bar Chart/ Enter Custom Value).

    ![alt text](./Media/kusto-flow/flow-visualizeresultsmultipleattachments.png "flow-visualizeresultsmultipleattachments")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

1. Add a *Send an email* action. 
    * In the *Body* field, insert the required *body* so that the visualized result of the query is included in the body of the email.
    * To add an attachment to the email, add *Attachment Name* and *Attachment Content*.
    ![alt text](./Media/kusto-flow/flow-emailmultipleattachments.png "flow-emailmultipleattachments")

Results:

![alt text](./Media/kusto-flow/flow-resultsmultipleattachments.png "flow-resultsmultipleattachments")

![alt text](./Media/kusto-flow/flow-resultsmultipleattachments2.png "flow-resultsmultipleattachments2")

### Example 5 - Send a different email to different contacts

You can leverage Azure Data Explorer (Kusto) Flow to send different customized emails to different contacts. The email addresses and the email contents are a result of a Kusto query.

Example:

![alt text](./Media/kusto-flow/flow-dynamicemailkusto.png "flow-dynamicemailkusto")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

![alt text](./Media/kusto-flow/flow-dynamicemail.png "flow-dynamicemail")

### Example 6 - Create Custom HTML Table

You can leverage Azure Data Explorer (Kusto) Flow to create and use custom HTML elements, such as a custom HTML table.

The following example demonstrates how to create a custom HTML table. The HTML table will have its rows colored by log level (the same as in Kusto Explorer).

Follow these instructions to create a similar Flow:

1. Create a new *Kusto - Run query and list results* action.

    ![alt text](./Media/kusto-flow/flow-listresultforhtmltable.png "flow-listresultforhtmltable")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

1. Loop over the query results and create the HTML table body: 
    1. To create a variable to hold the HTML string, select **New step**
    1. Select **Add an action** and search for *Variables*. 
    1. Select **Variables - Initialize variable**. 
    1. Initialize a string variable as follows:

    ![alt text](./Media/kusto-flow/flow-initializevariable.png "flow-initializevariable")

1. Loop over the results:
    1. Select **New step**.
    1. Select **Add an action**.
    1. Search for *Variables*. 
    1. Select **Variables - Append to string variable**. 
    1. Select the variable name that you initialized before, and create the HTML table rows using the query results. 
    When selecting the query results, *Apply to each* is automatically added.

    In the example below, the `if` expression is used to define the style of each row:

    ```if(equals(items('Apply_to_each')?['Level'], 'Warning'), 'Yellow', if(equals(items('Apply_to_each')?['Level'], 'Error'), 'red', 'white'))```

    ![alt text](./Media/kusto-flow/flow-createhtmltableloopcontent.png "flow-createhtmltableloopcontent")

1. Create the full HTML content: 
    1. Add a new action outside *Apply to each*. 
    In the following example the action used is *Send an email*.
    1. Define your HTML table using the variable from the previous steps. 
    1. If you're sending an email, select **Show advanced options** and, under *Is HTML*, select **Yes**.

    ![alt text](./Media/kusto-flow/flow-customhtmltablemail.png "flow-customhtmltablemail")

Result:

![alt text](./Media/kusto-flow/flow-customhtmltableresult.png "flow-customhtmltableresult")

## Limitations

1. Results returned to the client are limited to 500,000 records. The overall memory for those records can't exceed 64 MB and seven-minutes execution time.
1. The connector does not support the [fork](https://docs.microsoft.com/azure/kusto/query/forkoperator) and [facet](https://docs.microsoft.com/azure/kusto/query/facetoperator) operators.
1. Flow works best on Microsoft Edge and Chrome.

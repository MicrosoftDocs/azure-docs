---
title: Use the Microsoft Flow connector to run Kusto queries and commands automatically as part of a scheduled or triggered task 
description: Learn about using the Microsoft Flow connector to create flows of automatically scheduled or triggered tasks.
author: orspod
ms.author: orspodek
ms.reviewer: dorcohen
ms.service: data-explorer
ms.topic: conceptual
ms.date: 03/15/2020
---

# Microsoft Flow connector (Preview)

The Microsoft Flow connector enables you to run Kusto queries and commands automatically as part of a scheduled or triggered task, using [Microsoft Flow](https://flow.microsoft.com/).

Common usage scenarios include:

* Sending daily reports containing tables and charts
* Setting notifications based on query results
* Scheduling control commands on clusters
* Exporting and importing data between Azure Data Explorer and other databases 

For more information, see [Microsoft Flow connector usage examples](flow-usage.md).

##  Log in 

1. Log in to [Microsoft Flow](https://flow.microsoft.com/).

1. When connecting to the Microsoft Flow connector for the first time, you'll be prompted to sign in.

1. Select **Sign in** and enter your credentials.

![alt text](./Media/flow/flow-signin.png "flow-signin")

## Authentication

You can authenticate to Microsoft Flow using user credentials or an AAD application.

### AAD Application Authentication

You can authenticate to Microsoft Flow with an AAD application using the following steps:

> [!Note]
> Make sure your application is an [AAD application](https://docs.microsoft.com/azure/kusto/management/access-control/how-to-provision-aad-app) and is authorized to execute queries on your cluster.

1. Select the three dots at the top right of the Microsoft Flow connector:
![alt text](./Media/flow/flow-addconnection.png "flow-addconnection")

1. Select **Add new connection** and then select **Connect with Service Principal**.
![alt text](./Media/flow/flow-signin.png "flow-signin")

1. Enter the required information:
    * Connection Name: A descriptive and meaningful name for the new connection
    * Client ID: Your application ID
    * Client Secret: Your application key
    * Tenant: The ID of the AAD directory in which you created the application. For example, the Microsoft tenant ID is: 72f988bf-86f1-41af-91ab-2d7cd011db47

![alt text](./Media/flow/flow-appauth.png "flow-appauth")

When authentication is complete, you'll see that your flow uses the newly added connection.

![alt text](./Media/flow/flow-appauthcomplete.png "flow-appauthcomplete")

From now on, this flow will run using these application credentials.

## Find the Azure Kusto connector

To use the Microsoft Flow connector, you need to first add a trigger. 
A trigger can be defined based on a recurring time period, or as response to a previous flow action.

1. [Create a new flow.](https://flow.microsoft.com/manage/flows/new)
1. Add **Scheduled-from blank**.

    ![alt text](./Media/flow/scheduled-from-blank.png "Scheduled-from blank")

1. Enter the required information on the *Build a scheduled flow* page.
    ![alt text](./Media/flow/build-scheduled-flow.png "Build scheduled flow")
1. Select **Create**.
1. Select **+ New step**.
1. In the search box, enter "Kusto".

    ![alt text](./Media/flow/flow-actions.png "flow-actions")

1. Select **Azure Data Explorer**.

## Flow Actions

When you open the Azure Data Explorer connector, there are three possible actions you can add to your flow.

This section describes the capabilities and parameters for each Microsoft Flow action.

![alt text](./Media/flow/flow-adx-actions.png "Flow Azure Data Explorer actions")

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

![alt text](./Media/flow/flow-runcontrolcommand.png "flow-runcontrolcommand")

> [!IMPORTANT]
> In the *Cluster Name* field, enter the cluster URL.

### Run query and list results

> [!Note]
> If your query starts with a dot (meaning it's a [control command](https://docs.microsoft.com/azure/kusto/management/index)), use [Run control command and visualize results](#run-control-command-and-visualize-results)

This action sends a query to Kusto cluster. The actions that are added afterwards iterate over each line of the results of the query.

The following example triggers a query every minute and sends an email based on the query results. The query checks the number of lines in the database, and then sends an email only if the number of lines is greater than 0. 

![alt text](./Media/flow/flow-runquerylistresults-2.png "flow-runquerylistresults")

> [!Note]
> If the column has several lines, the connector will run for each line in the column.

### Run query and visualize results
        
> [!Note]
> If your query starts with a dot (meaning it's a [control command]((https://docs.microsoft.com/azure/kusto/management/index)), use [Run control command and visualize results](#run-control-command-and-visualize-results)
        
Use the *Run query and visualize results* action to visualize Kusto query result as a table or chart. For example, use this flow to receive daily ICM reports by email. 
    
In this example, the results of the query are returned as an HTML table.
            
![alt text](./Media/flow/flow-runquery.png "flow-runquery")

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

![alt text](./Media/flow/flow-sendemail.png "flow-sendemail")

## How to check if your flow succeeded

To check if your flow succeeded, see the flow's run history:
1. Go to the [Microsoft Flow home page](https://flow.microsoft.com/).
1. From the main menu, select [My flows](https://flow.microsoft.com/manage/flows).
    ![alt text](./Media/flow/flow-myflows.png "flow-myflows")
1. On the row of the flow you want to investigate, select the more commands icon, and then **Run history**.
    ![alt text](./Media/flow//flow-runhistory.png "flow-runhistory")
    All flow runs are listed with start time, duration, and status.
    ![alt text](./Media/flow/flow-runhistoryresults.png "flow-runhistoryresults")
    For full details about the flow, on the [My flows](https://flow.microsoft.com/manage/flows) page, select the flow you want to investigate.
    ![alt text](./Media/flow/flows-fulldetails.png "flow-runhistoryresults") 

To see why a run failed, select the run start time. The flow appears and the step of the flow that failed is indicated by a red exclamation point. Expand the failed step to view its details. The right-hand pane contains information about the failure so that you can troubleshoot it.
![alt text](./Media/flow/flow-error.png "flow-error")

## Timeout Exceptions

Your flow can fail and return a "RequestTimeout" exception if it runs for more than seven minutes.

Learn more about [Microsoft Flow limitations](#limitations).
    
The same query may run successfully in Azure Data Explorer where the time isn't limited and can be changed.
            
The "RequestTimeout" exception is shown in the image below:
    
![alt text](./Media/flow/flow-requesttimeout.png "flow-requesttimeout")
    
To fix a timeout issue, try to make your query more efficient so that it runs faster, or separate it into chunks. Each chunk can run on a different part of the query.

For more information, read about [Query best practices]((https://docs.microsoft.com/azure/kusto/query/best-practices).

## Limitations

1. Results returned to the client are limited to 500,000 records. The overall memory for those records can't exceed 64 MB and seven-minutes execution time.
1. The connector does not support the [fork](https://docs.microsoft.com/azure/kusto/query/forkoperator) and [facet](https://docs.microsoft.com/azure/kusto/query/facetoperator) operators.
1. Flow works best on Microsoft Edge and Chrome.

---
title: Tutorial - Send custom logs to Azure Monitor Logs
description: Tutorial on how to send custom logs to a Log Analytics workspace in Azure Monitor using the Azure portal.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Tutorial: Add ingestion-time transformation to Azure Monitor Logs (preview)
[Custom logs](custom-logs-ovewrview.md) in Azure Monitor allow you to send custom data to any table in a Log Analytics workspace with a REST API. This tutorial walks through configuration of a new table and a sample application to send custom logs to Azure Monitor using the Azure portal.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a custom table in a Log Analytics workspace
> * Create a data collection endpoint to receive data over HTTP
> * Create a data collection rule that transforms incoming data to match the schema of the target table
> * Create a sample application to send custom data to Azure Monitor


## Prerequisites
To complete this tutorial, you need the following: 

- Log Analytics workspace where you have at least contributor rights. 
- Permissions in your subscription to create Data Collection Rule objects.


## Overview of tutorial
In this tutorial, we'll use a PowerShell script to send Apache access logs over HTTP to the API endpoint. This will require a script to convert this data to JSON format that's required for the Azure Monitor custom logs API. The data will further be converted with a data collection rule that filters out records that shouldn't be ingested and create the columns required for the table that the table will be sent to. Once the configuration is complete, you'll send sample data from the command line and then inspect the results in Log Analytics.


## Configure application
You need to start by registering an Azure Active Directory application to authenticate against the API. Any ARM authentication scheme is supported, but we'll follow the [Client Credential Grant Flow scheme](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow) for this tutorial.

From the **Azure Active Directory** menu in the Azure portal, select **App registrations** and then **New registration**.

:::image type="content" source="media/tutorial-custom-logs/new-app-registration.png" lightbox="media/tutorial-custom-logs/new-app-registration.png" alt-text="Screenshot for app registration":::

Give the application a name and change the tenancy scope if the default is not appropriate for your environment. A **Redirect URI** isn't required.

:::image type="content" source="media/tutorial-custom-logs/new-app-name.png" lightbox="media/tutorial-custom-logs/new-app-name.png" alt-text="Screenshot for app details":::

Once registered, you can view the details of the application. Note the **Application (client) ID** and the **Directory (tenant) ID**. You'll need these values later in the process.

:::image type="content" source="media/tutorial-custom-logs/new-app-id.png" lightbox="media/tutorial-custom-logs/new-app-id.png" alt-text="Screenshot for app id":::

You now need to generate an application client secret, which is similar to creating a password to use with a username. Select **Certificates & secrets** and then **New client secret**. Give the secret a name to identify its purpose and select an **Expires** duration. *1 year* is selected here although for a production implementation, you would follow best practices for a secret rotation procedure or use a more secure authentication mode such a certificate.

:::image type="content" source="media/tutorial-custom-logs/new-app-secret.png" lightbox="media/tutorial-custom-logs/new-app-secret.png" alt-text="Screenshot for new app secret":::

Click **Add** to save the secret and then note the **Value**. Ensure that you record this value since You can't recover it once you navigate away from this page. Use the same security measures as you would for safekeeping a password as it's the functional equivalent.

:::image type="content" source="media/tutorial-custom-logs/new-app-secret-value.png" lightbox="media/tutorial-custom-logs/new-app-secret-value.png" alt-text="Screenshot for new app secret value":::

## Prepare PowerShell script
Copy the following PowerShell script to a new file. Update the values of `$tenantId`, `$appId`, and `$appSecret` with the values you noted for **Directory (tenant) ID**, **Application (client) ID**, and secret **Value**. Save your script with file name *LogGenerator.ps1*.

``` PowerShell
param ([Parameter(Mandatory=$true)] $Log, $Type="file", $Output, $DcrImmutableId, $DceURI, $Table)
################
##### Usage
################
# LogGenerator.ps1
#   -Log <String>              - log file to be forwarded
#   [-Type "file|API"]         - whether the script should generate sample JSON file or send data via
#                                API call. Data will be written to a file by default
#   [-Output <String>]         - path to resulting JSON sample
#   [-DcrImmutableId <string>] - DCR immutable ID
#   [-DceURI]                  - Data collection endpoint URI
#   [-Table]                   - The name of the custom log table, including "_CL" suffix


##### >>>> PUT YOUR VALUES HERE <<<<<
# information needed to authenticate to AAD and obtain a bearer token
$tenantId = "<put tenant ID here>"; #the tenant ID in which the Data Collection Endpoint resides
$appId = "<put application ID here>"; #the app ID created and granted permissions
$appSecret = "<put secret value here>"; #the secret created for the above app - never store your secrets in the source code
##### >>>> END <<<<<


$file_data = Get-Content $Log
if ("file" -eq $Type) {
    ############
    ## Convert plain log to JSON format and output to .json file
    ############
    # If not provided, get output file name
    if ($null -eq $Output) {
        $Output = Read-Host "Enter output file name" 
    };

    # Form file payload
    $payload = @();
    $records_to_generate = [math]::min($file_data.count, 500)
    for ($i=0; $i -lt $records_to_generate; $i++) {
        $log_entry = @{
            # Define the structure of log entry, as it will be sent
            Time = Get-Date ([datetime]::UtcNow) -Format O
            Application = "LogGenerator"
            RawData = $file_data[$i]
        }
        $payload += $log_entry
    }
    # Write resulting payload to file
    New-Item -Path $Output -ItemType "file" -Value ($payload | ConvertTo-Json) -Force

} else {
    ############
    ## Send the content to the data collection endpoint
    ############
    if ($null -eq $DcrImmutableId) {
        $DcrImmutableId = Read-Host "Enter DCR Immutable ID" 
    };

    if ($null -eq $DceURI) {
        $DceURI = Read-Host "Enter data collection endpoint URI" 
    }

    if ($null -eq $Table) {
        $Table = Read-Host "Enter the name of custom log table" 
    }

    ## Let's obtain a bearer token that we'll use to authenticate against the data collection endpoint
    $scope = [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
    $body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
    $headers = @{"Content-Type" = "application/x-www-form-urlencoded" };
    $uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"
    $bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token
    ## If the above line throws an 'Unable to find type [System.Web.HttpUtility].' error, execute the line below separately from the rest of the code
    # Add-Type -AssemblyName System.Web

    ## Now let's generate and send some data
    foreach ($line in $file_data) {
        # We are going to send log entries one by one with a small delay
        $log_entry = @{
            # Define the structure of log entry, as it will be sent
            Time = Get-Date ([datetime]::UtcNow) -Format O
            Application = "LogGenerator"
            RawData = $line
        }
        # Sending the data to Log Analytics via the DCR!
        $body = $log_entry | ConvertTo-Json -AsArray;
        $headers = @{"Authorization" = "Bearer $bearerToken"; "Content-Type" = "application/json" };
        $uri = "$DceURI/dataCollectionRules/$DcrImmutableId/streams/Custom-$Table"+"?api-version=2021-11-01-preview";
        $uploadResponse = Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers;

        # Let's see how the response looks like
        Write-Output $uploadResponse
        Write-Output "---------------------"

        # Pausing for 1 second before processing the next entry
        Start-Sleep -Seconds 1
    }
}
```

## Upload the script to CloudShell environment
You could run this script from your local machine, but to simplify the authentication process for the tutorial, we'll use Azure CloudShell.

Click on the **Cloud Shell** button and then select **PowerShell** if it isn't already selected. Click on **Upload/Download Files** button and then **Upload**. upload the script we created above and log files we are going to ingest. You can generate your own logs, or utilize this sample of Apache access log.


## Generate sample data 


## Create data collection endpoint
A [data collection endpoint (DCE)]() is required to accept the data from the script. Once you configure the DCE and link it to a data collection rule, you can send data over HTTP from your application. The DCE must be located in the same region as the Log Analytics Workspace where the data will be sent. 

To create a new DCE, go to the **Monitor** menu in the Azure portal. Select **Data Collection Endpoints** and then **Create**.

:::image type="content" source="media/tutorial-custom-logs/new-data-collection-endpoint.png" lightbox="media/tutorial-custom-logs/new-data-collection-endpoint.png" alt-text="Screenshot for new data collection endpoint":::

Provide a name for the DCE and ensure that it's in the same region as your workspace. Click **Create** to create the DCE.

:::image type="content" source="media/tutorial-custom-logs/data-collection-endpoint-details.png" lightbox="media/tutorial-custom-logs/data-collection-endpoint-details.png" alt-text="Screenshot for data collection endpoint details":::

Once the DCE is created, select it so you can view its properties. Note the **Logs ingestion** URI since you'll need this in a later step.

:::image type="content" source="media/tutorial-custom-logs/data-collection-endpoint-uri.png" lightbox="media/tutorial-custom-logs/data-collection-endpoint-uri.png" alt-text="Screenshot for data collection endpoint uri":::

## Add custom log
To create the table that the script will send its data to, go to the **Log Analytics workspaces** menu in the Azure portal and select **Tables (preview)**. The tables in the workspace will be displayed. Select **Add custom log** and then **Add DCR-based custom log**.

:::image type="content" source="media/tutorial-custom-logs/new-custom-log.png" lightbox="media/tutorial-custom-logs/new-custom-log.png" alt-text="Screenshot for new DCR-based custom log":::

Click **Create new data collection rule** to create the DCR that will be used to send data to this table. Specify the **Subscription**, **Resource group**, and **Name** for the data collection rule that will contain the custom log configuration. If you have an existing data collection rule, you can choose to use it instead.

:::image type="content" source="media/tutorial-custom-logs/new-data-collection-rule.png" lightbox="media/tutorial-custom-logs/new-data-collection-rule.png" alt-text="Screenshot for new data collection rule":::

Specify a name for the table. This must end in **_CL** and will be the name of the table in the Log Analytics workspace. Click **Next**.

:::image type="content" source="media/tutorial-custom-logs/custom-log-table-name.png" lightbox="media/tutorial-custom-logs/custom-log-table-name.png" alt-text="Screenshot for custom log table name":::

## Parse and filter sample data
Instead of directly configuring the schema of the table, we'll upload sample data so that Azure Monitor can determine the schema. The sample is expected to be a JSON file containing one or multiple log records structured in the same way they will be sent in the body of HTTP request of the custom logs API call.

Click **Browse for files** and locate the sample data file. 

:::image type="content" source="media/tutorial-custom-logs/custom-log-browse-files.png" lightbox="media/tutorial-custom-logs/custom-log-browse-files.png" alt-text="Screenshot for custom log browse for files":::

Data from the sample file is displayed with a warning that a `TimeGenerated` is not in the data. All log tables within Azure Monitor Logs are required to have a `TimeGenerated` column populated with the timestamp of logged event. In this sample the timestamp of event is stored in field called `Time`. Open the transformation editor to add this column.

:::image type="content" source="media/tutorial-custom-logs/custom-log-data-preview.png" lightbox="media/tutorial-custom-logs/custom-log-data-preview.png" alt-text="Screenshot for custom log data preview":::

The transformation editor lets you create a transformation for the incoming data stream. This is a [KQL query]() that is run against each incoming record. The results of the query, or in our case transformation, will be stored in the destination table. Since the data is processed against each individual row, a limited number of KQL operators are support. See [Adding Ingestion-time Transformation to Azure Monitor Logs](ingestion-time-transformations.md) for details on writing transformation queries.

Add the following query to the transformation editor to add the `TimeGenerated` column to the output and then click **Run**. to views the results.

```kusto
source
| extend TimeGenerated = todatetime(Time)
```

:::image type="content" source="media/tutorial-custom-logs/custom-log-query-01.png" lightbox="media/tutorial-custom-logs/custom-log-query-01.png" alt-text="Screenshot for custom log data query 01":::

You can see that the `TimeGenerated` column is now added to the other columns. Most of the interesting data is contained in the `RawData` column though, so we can add to the query to parse this data to make it more useful in the resulting table. The following query extracts the client IP address, HTTP method, address of the page being access, and the response code from each log entry. 

```kusto
source
| extend TimeGenerated = todatetime(Time)
| parse RawData with 
  ClientIP:string
  ' ' *
  ' ' *
  ' [' * '] "' RequestType:string
  " " Resource:string
  " " *
  '" ' ResponseCode:int
  " " *
  ```

  :::image type="content" source="media/tutorial-custom-logs/custom-log-query-02.png" lightbox="media/tutorial-custom-logs/custom-log-query-02.png" alt-text="Screenshot for custom log data query 02":::

This extracts the contents of `RawData` into separate columns  `ClientIP`, `RequestType`, `Resource`, and `ResponseCode`. The query can be optimized more though by removing the `RawData` and `Time` columns since they aren't needed anymore. We can also filter out any records with `ResponseCode` of 200 since we're only interested in collecting data for requests that were not successful. This reduces the volume of data being ingested which reduces its overall cost.


```kusto
source
| extend TimeGenerated = todatetime(Time)
| parse RawData.value with 
  ClientIP:string
  ' ' *
  ' ' *
  ' [' * '] "' RequestType:string
  " " Resource:string
  " " *
  '" ' ResponseCode:int
  " " *
| where ResponseCode != 200
| project-away Time, RawData
  ```

  :::image type="content" source="media/tutorial-custom-logs/custom-log-query-03.png" lightbox="media/tutorial-custom-logs/custom-log-query-03.png" alt-text="Screenshot for custom log data query 03":::


Click **Apply** to save the transformation and view the schema of the table that's about to be created. Click **Next** to proceed.

  :::image type="content" source="media/tutorial-custom-logs/custom-log-final-schema.png" lightbox="media/tutorial-custom-logs/custom-log-final-schema.png" alt-text="Screenshot for custom log final schema":::

Verify the final details and click **Create** to save the custom log.

:::image type="content" source="media/tutorial-custom-logs/custom-log-create.png" lightbox="media/tutorial-custom-logs/custom-log-create.png" alt-text="Screenshot for custom log create":::

## Collect information from data collection rule
Now that the data collection rule is created, you can collect the immutable ID from it which you'll need for your API call. From **Overview** for the data collection rule, select the **JSON View**.

:::image type="content" source="media/tutorial-custom-logs/data-collection-rule-json-view.png" lightbox="media/tutorial-custom-logs/data-collection-rule-json-view.png" alt-text="Screenshot for data collection rule JSON view":::

Copy the **immutableId** value. 

:::image type="content" source="media/tutorial-custom-logs/data-collection-rule-immutable-id.png" lightbox="media/tutorial-custom-logs/data-collection-rule-immutable-id.png" alt-text="Screenshot for collecting immutable ID from JSON view":::




## Assign permissions to data collection rule
Now that the data collection rule has been created, the application needs to be given permission to it. This will allow any application using the correct application ID and application key to send data to the new data collection endpoint, have that data processed with the nee data collection rule, and then stored in the Log Analytics workspace.

From the data collection rule in the Azure portal, select **Access Control (IAM)** amd then **Add role assignment**. 

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment.png" lightbox="media/tutorial-custom-logs/custom-log-create.png" alt-text="Screenshot for adding custom role assignment to DCR":::

Select **Monitoring Metrics Publisher** and click **Next**.  You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action. 

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment-select-role.png" lightbox="media/tutorial-custom-logs/add-role-assignment-select-role.png" alt-text="Screenshot for selecting role for DCR role assignment":::

Select **User, group, or service principal** for **Assign access to** and click **Select members**. Select the application that you created and click **Select**.

:::image type="content" source="media/tutorial-custom-logs/s.png" lightbox="media/tutorial-custom-logs/custom-log-create-select-member.png" alt-text="Screenshot for selecting members for DCR role assignment":::


Click **Review + assign** and verify the details before saving your role assignment.

:::image type="content" source="media/tutorial-custom-logs/add-role-assignment-save.png" lightbox="media/tutorial-custom-logs/add-role-assignment-save.png" alt-text="Screenshot for saving DCR role assignment":::



## Test custom log ingestion
Allow at least 30 minutes for the configuration to take effect. You may also experience increased latency for the first few entries, but this should normalize.

Run the following command providing the values that you collected for your data collection rule and data collection endpoint. The script will start ingesting data by placing calls to the API at pace of approximately 1 record per second.

```PowerShell
.\LogGenerator.ps1 -Log "sample_access.log" -Type "API" -Table "ApacheAccess_CL" -DcrImmutableId <immutable ID> -DceUrl <data collection endpoint URL> 
```

From Log Analytics, query your newly created table to verify that data arrived and if it is transformed properly.


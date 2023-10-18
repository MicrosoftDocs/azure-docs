---
title: 'Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)'
description: Tutorial on how sending data to a Log Analytics workspace in Azure Monitor using the Logs ingestion API. Supporting components configured using the Azure portal.
ms.topic: tutorial
ms.date: 09/14/2023
author: bwren
ms.author: bwren

ms.reviewer: ivkhrul 
ms.service: azure-monitor
---

# Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)
The [Logs Ingestion API](logs-ingestion-api-overview.md) in Azure Monitor allows you to send external data to a Log Analytics workspace with a REST API. This tutorial uses the Azure portal to walk through configuration of a new table and a sample application to send log data to Azure Monitor. The sample application collects entries from a text file and either converts the plain log to JSON format generating a resulting .json file, or sends the content to the data collection endpoint.

> [!NOTE]
> This tutorial uses the Azure portal to configure the components to support the Logs ingestion API. See [Tutorial: Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)](tutorial-logs-ingestion-api.md) for a similar tutorial that uses Azure Resource Manager templates to configure these components and that has sample code for client libraries for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), and [Python](/python/api/overview/azure/monitor-ingestion-readme).


The steps required to configure the Logs ingestion API are as follows:

1. [Create an Azure AD application](#create-azure-ad-application) to authenticate against the API.
3. [Create a data collection endpoint (DCE)](#create-data-collection-endpoint) to receive data.
2. [Create a custom table in a Log Analytics workspace](#create-new-table-in-log-analytics-workspace). This is the table you'll be sending data to. As part of this process, you will create a data collection rule (DCR) to direct the data to the target table.
5. [Give the AD application access to the DCR](#assign-permissions-to-the-dcr).
6. [Use sample code to send data to using the Logs ingestion API](#send-sample-data).


## Prerequisites
To complete this tutorial, you need:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create DCR objects](../essentials/data-collection-rule-overview.md#permissions) in the workspace.
- PowerShell 7.2 or later.

## Overview of the tutorial
In this tutorial, you'll use a PowerShell script to send sample Apache access logs over HTTP to the API endpoint. This approach requires a script to convert this data to the JSON format that's required for the Azure Monitor Logs Ingestion API. The data will further be converted with a transformation in a DCR that filters out records that shouldn't be ingested. It also creates the columns required for the table where the data will be sent. 

After the configuration is finished, you'll send sample data from the command line, and then inspect the results in Log Analytics.

## Create Azure AD application
Start by registering an Azure Active Directory application to authenticate against the API. Any Resource Manager authentication scheme is supported, but this tutorial will follow the [Client Credential Grant Flow scheme](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

1. On the **Azure Active Directory** menu in the Azure portal, select **App registrations** > **New registration**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-registration.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-registration.png" alt-text="Screenshot that shows the app registration screen.":::

1. Give the application a name and change the tenancy scope if the default isn't appropriate for your environment. A **Redirect URI** isn't required.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-name.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-name.png" alt-text="Screenshot that shows app details.":::

1. After registration, you can view the details of the application. Note the **Application (client) ID** and the **Directory (tenant) ID**. You'll need these values later in the process.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-id.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-id.png" alt-text="Screenshot that shows the app ID.":::

1. You now need to generate an application client secret, which is similar to creating a password to use with a username. Select **Certificates & secrets** > **New client secret**. Give the secret a name to identify its purpose and select an **Expires** duration. The value **1 year** is selected here. For a production implementation, you would follow best practices for a secret rotation procedure or use a more secure authentication mode, such as a certificate.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-secret.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-secret.png" alt-text="Screenshot that shows a secret for a new app.":::

1. Select **Add** to save the secret and then note the **Value**. Ensure that you record this value because you can't recover it after you move away from this page. Use the same security measures as you would for safekeeping a password because it's the functional equivalent.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-secret-value.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-secret-value.png" alt-text="Screenshot that shows the secret value for the new app.":::

## Create data collection endpoint
A [data collection endpoint](../essentials/data-collection-endpoint-overview.md) is required to accept the data from the script. After you configure the DCE and link it to a DCR, you can send data over HTTP from your application. The DCE needs to be in the same region as the Log Analytics workspace where the data will be sent or the data collection rule being used.

1. To create a new DCE, go to the **Monitor** menu in the Azure portal. Select **Data Collection Endpoints** and then select **Create**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-data-collection-endpoint.png" lightbox="media/tutorial-logs-ingestion-portal/new-data-collection-endpoint.png" alt-text="Screenshot that shows new DCE.":::

1. Provide a name for the DCE and ensure that it's in the same region as your workspace. Select **Create** to create the DCE.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-endpoint-details.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-endpoint-details.png" alt-text="Screenshot that shows DCE details.":::

1. After the DCE is created, select it so that you can view its properties. Note the **Logs ingestion** URI because you'll need it in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-endpoint-uri.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-endpoint-uri.png" alt-text="Screenshot that shows DCE URI.":::


## Create new table in Log Analytics workspace
Before you can send data to the workspace, you need to create the custom table where the data will be sent.

> [!NOTE]
> The table creation for a log ingestion API custom log below can't be used to create a [agent custom log table](../agents/data-collection-text-log.md). You must use the CLI or custom template process to create the table. If you do not have sufficent rights to run CLI or custom tempate you must ask your adminitrator to add the table for you.

1. Go to the **Log Analytics workspaces** menu in the Azure portal and select **Tables**. The tables in the workspace will appear. Select **Create** > **New custom log (DCR based)**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-custom-log.png" lightbox="media/tutorial-logs-ingestion-portal/new-custom-log.png" alt-text="Screenshot that shows the new DCR-based custom log.":::

1. Specify a name for the table. You don't need to add the *_CL* suffix required for a custom table because it will be automatically added to the name you specify.

1. Select **Create a new data collection rule** to create the DCR that will be used to send data to this table. If you have an existing DCR, you can choose to use it instead. Specify the **Subscription**, **Resource group**, and **Name** for the DCR that will contain the custom log configuration.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" lightbox="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" alt-text="Screenshot that shows the new DCR.":::

1. Select the DCR that you created, and then select **Next**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" alt-text="Screenshot that shows the custom log table name.":::

## Parse and filter sample data
Instead of directly configuring the schema of the table, you can upload a file with a sample JSON array of data through the portal, and Azure Monitor will set the schema automatically. The sample JSON file must contain one or more log records structured as an array, in the same way the data is sent in the body of an HTTP request of the logs ingestion API call.

1. Follow the instructions in [generate sample data](#generate-sample-data) to create the *data_sample.json* file.

1. Select **Browse for files** and locate the *data_sample.json* file that you previously created.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" alt-text="Screenshot that shows custom log browse for files.":::

1. Data from the sample file is displayed with a warning that `TimeGenerated` isn't in the data. All log tables within Azure Monitor Logs are required to have a `TimeGenerated` column populated with the timestamp of the logged event. In this sample, the timestamp of the event is stored in the field called `Time`. You'll add a transformation that will rename this column in the output.

1. Select **Transformation editor** to open the transformation editor to add this column. You'll add a transformation that will rename this column in the output. The transformation editor lets you create a transformation for the incoming data stream. This is a KQL query that's run against each incoming record. The results of the query will be stored in the destination table. For more information on transformation queries, see [Data collection rule transformations in Azure Monitor](../essentials//data-collection-transformations.md).

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" alt-text="Screenshot that shows the custom log data preview.":::

1. Add the following query to the transformation editor to add the `TimeGenerated` column to the output:

    ```kusto
    source
    | extend TimeGenerated = todatetime(Time)
    ```

1. Select **Run** to view the results. You can see that the `TimeGenerated` column is now added to the other columns. Most of the interesting data is contained in the `RawData` column, though.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" alt-text="Screenshot that shows the initial custom log data query.":::

1. Modify the query to the following example, which extracts the client IP address, the HTTP method, the address of the page being accessed, and the response code from each log entry.

    ```kusto
    source
    | extend TimeGenerated = todatetime(Time)
    | parse RawData with 
    ClientIP:string
    ' ' *
    ' ' *
    ' [' * '] "' RequestType:string
    ' ' Resource:string
    ' ' *
    '" ' ResponseCode:int
    ' ' *
    ```

1. Select **Run** to view the results. This action extracts the contents of `RawData` into the separate columns `ClientIP`, `RequestType`, `Resource`, and `ResponseCode`.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-02.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-02.png" alt-text="Screenshot that shows the custom log data query with parse command.":::

1. The query can be optimized more though by removing the `RawData` and `Time` columns because they aren't needed anymore. You can also filter out any records with `ResponseCode` of 200 because you're only interested in collecting data for requests that weren't successful. This step reduces the volume of data being ingested, which reduces its overall cost.

    ```kusto
    source
    | extend TimeGenerated = todatetime(Time)
    | parse RawData with 
    ClientIP:string
    ' ' *
    ' ' *
    ' [' * '] "' RequestType:string
    ' ' Resource:string
    ' ' *
    '" ' ResponseCode:int
    ' ' *
    | project-away Time, RawData
    | where ResponseCode != 200
    ```

1. Select **Run** to view the results.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-03.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-03.png" alt-text="Screenshot that shows a custom log data query with a filter.":::

1. Select **Apply** to save the transformation and view the schema of the table that's about to be created. Select **Next** to proceed.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" alt-text="Screenshot that shows a custom log final schema.":::

1. Verify the final details and select **Create** to save the custom log.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-create.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot that shows custom log create.":::

## Collect information from the DCR
With the DCR created, you need to collect its ID, which is needed in the API call.

1. On the **Monitor** menu in the Azure portal, select **Data collection rules** and select the DCR you created. From **Overview** for the DCR, select **JSON View**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-rule-json-view.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-rule-json-view.png" alt-text="Screenshot that shows the DCR JSON view.":::

1. Copy the **immutableId** value.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-rule-immutable-id.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-rule-immutable-id.png" alt-text="Screenshot that shows collecting the immutable ID from the JSON view.":::

## Assign permissions to the DCR
The final step is to give the application permission to use the DCR. Any application that uses the correct application ID and application key can now send data to the new DCE and DCR.

1. Select **Access Control (IAM)** for the DCR and then select **Add role assignment**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot that shows adding the custom role assignment to the DCR.":::

1. Select **Monitoring Metrics Publisher** > **Next**. You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" alt-text="Screenshot that shows selecting the role for the DCR role assignment.":::

1. Select **User, group, or service principal** for **Assign access to** and choose **Select members**. Select the application that you created and then choose **Select**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" alt-text="Screenshot that shows selecting members for the DCR role assignment.":::

1. Select **Review + assign** and verify the details before you save your role assignment.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" alt-text="Screenshot that shows saving the DCR role assignment.":::

## Generate sample data

The following PowerShell script generates sample data to configure the custom table and sends sample data to the logs ingestion API to test the configuration.

1. Run the following PowerShell command, which adds a required assembly for the script:

    ```powershell
    Add-Type -AssemblyName System.Web
    ```

1. Update the values of `$tenantId`, `$appId`, and `$appSecret` with the values you noted for **Directory (tenant) ID**, **Application (client) ID**, and secret **Value**. Then save it with the file name *LogGenerator.ps1*.

    ``` PowerShell
    param ([Parameter(Mandatory=$true)] $Log, $Type="file", $Output, $DcrImmutableId, $DceURI, $Table)
    ################
    ##### Usage
    ################
    # LogGenerator.ps1
    #   -Log <String>              - Log file to be forwarded
    #   [-Type "file|API"]         - Whether the script should generate sample JSON file or send data via
    #                                API call. Data will be written to a file by default.
    #   [-Output <String>]         - Path to resulting JSON sample
    #   [-DcrImmutableId <string>] - DCR immutable ID
    #   [-DceURI]                  - Data collection endpoint URI
    #   [-Table]                   - The name of the custom log table, including "_CL" suffix


    ##### >>>> PUT YOUR VALUES HERE <<<<<
    # Information needed to authenticate to Azure Active Directory and obtain a bearer token
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
        New-Item -Path $Output -ItemType "file" -Value ($payload | ConvertTo-Json -AsArray) -Force

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

        ## Obtain a bearer token used to authenticate against the data collection endpoint
        $scope = [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
        $body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
        $headers = @{"Content-Type" = "application/x-www-form-urlencoded" };
        $uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"
        $bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token

        ## Generate and send some data
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

            # Let's see how the response looks
            Write-Output $uploadResponse
            Write-Output "---------------------"

            # Pausing for 1 second before processing the next entry
            Start-Sleep -Seconds 1
        }
    }
    ```

1. Copy the sample log data from [sample data](#sample-data) or copy your own Apache log data into a file called `sample_access.log`.

1. To read the data in the file and create a JSON file called `data_sample.json` that you can send to the logs ingestion API, run:

    ```PowerShell
    .\LogGenerator.ps1 -Log "sample_access.log" -Type "file" -Output "data_sample.json"
    ```


## Send sample data
Allow at least 30 minutes for the configuration to take effect. You might also experience increased latency for the first few entries, but this activity should normalize.

1. Run the following command providing the values that you collected for your DCR and DCE. The script will start ingesting data by placing calls to the API at the pace of approximately one record per second.

    ```PowerShell
    .\LogGenerator.ps1 -Log "sample_access.log" -Type "API" -Table "ApacheAccess_CL" -DcrImmutableId <immutable ID> -DceUri <data collection endpoint URL> 
    ```

1. From Log Analytics, query your newly created table to verify that data arrived and that it's transformed properly.

## Troubleshooting
See the [Troubleshooting](tutorial-logs-ingestion-code.md#troubleshooting) section of the sample code article if your code doesn't work as expected.

## Sample data
You can use the following sample data for the tutorial. Alternatively, you can use your own data if you have your own Apache access logs.

```
0.0.139.0 - - [19/Dec/2020:13:57:26 +0100] "GET /index.php?option=com_phocagallery&view=category&id=1:almhuette-raith&Itemid=53 HTTP/1.1" 200 32653 "-" "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" "-"
0.0.153.185 - - [19/Dec/2020:14:08:06 +0100] "GET /apache-log/access.log HTTP/1.1" 200 233 "-" "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.153.185 - - [19/Dec/2020:14:08:08 +0100] "GET /favicon.ico HTTP/1.1" 404 217 "http://www.almhuette-raith.at/apache-log/access.log" "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.66.230 - - [19/Dec/2020:14:14:26 +0100] "GET /robots.txt HTTP/1.1" 200 304 "-" "Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)" "-"
0.0.148.92 - - [19/Dec/2020:14:16:44 +0100] "GET /index.php?option=com_phocagallery&view=category&id=2%3Awinterfotos&Itemid=53 HTTP/1.1" 200 30662 "-" "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" "-"
0.0.35.224 - - [19/Dec/2020:14:29:21 +0100] "GET /administrator/index.php HTTP/1.1" 200 4263 "" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)" "-"
0.0.162.225 - - [19/Dec/2020:14:58:59 +0100] "GET /apache-log/access.log HTTP/1.1" 200 1299 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36" "-"
0.0.162.225 - - [19/Dec/2020:14:58:59 +0100] "GET /favicon.ico HTTP/1.1" 404 217 "http://www.almhuette-raith.at/apache-log/access.log" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36" "-"
0.0.148.108 - - [19/Dec/2020:15:09:30 +0100] "GET /robots.txt HTTP/1.1" 200 304 "-" "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" "-"
0.0.148.1 - - [19/Dec/2020:15:09:31 +0100] "GET /index.php?option=com_phocagallery&view=category&id=2%3Awinterfotos&Itemid=53 HTTP/1.1" 200 30618 "-" "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" "-"
0.0.203.24 - - [19/Dec/2020:15:16:50 +0100] "GET /apache-log/access.log HTTP/1.1" 200 2164 "-" "-" "-"
0.0.4.214 - - [19/Dec/2020:15:22:40 +0100] "GET /administrator/%22 HTTP/1.1" 404 226 "-" "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)" "-"
0.0.10.125 - - [19/Dec/2020:15:23:10 +0100] "GET / HTTP/1.1" 200 10479 "http://baidu.com/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:11 +0100] "GET /modules/mod_bowslideshow/tmpl/css/bowslideshow.css HTTP/1.1" 200 1725 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:11 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:11 +0100] "GET /templates/jp_hotel/css/template.css HTTP/1.1" 200 10004 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:11 +0100] "GET /templates/jp_hotel/css/layout.css HTTP/1.1" 200 1801 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:11 +0100] "GET /templates/jp_hotel/css/menu.css HTTP/1.1" 200 1457 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:11 +0100] "GET /templates/jp_hotel/css/suckerfish.css HTTP/1.1" 200 3465 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:12 +0100] "GET /media/system/js/caption.js HTTP/1.1" 200 1963 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:12 +0100] "GET /media/system/js/mootools.js HTTP/1.1" 200 74434 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:12 +0100] "GET /templates/jp_hotel/js/moomenu.js HTTP/1.1" 200 4890 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:12 +0100] "GET /modules/mod_bowslideshow/tmpl/js/sliderman.1.3.0.js HTTP/1.1" 200 33472 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:12 +0100] "GET /images/stories/slideshow/almhuette_raith_02.jpg HTTP/1.1" 200 62918 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:12 +0100] "GET /images/stories/slideshow/almhuette_raith_01.jpg HTTP/1.1" 200 88161 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:12 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:12 +0100] "GET /images/stories/slideshow/almhuette_raith_03.jpg HTTP/1.1" 200 87782 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:12 +0100] "GET /images/stories/slideshow/almhuette_raith_06.jpg HTTP/1.1" 200 68977 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:13 +0100] "GET /images/stories/slideshow/almhuette_raith_04.jpg HTTP/1.1" 200 80637 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:13 +0100] "GET /images/stories/slideshow/almhuette_raith_05.jpg HTTP/1.1" 200 77796 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:13 +0100] "GET /images/stories/slideshow/almhuette_raith_07.jpg HTTP/1.1" 200 94861 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:13 +0100] "GET /templates/jp_hotel/images/logo.jpg HTTP/1.1" 200 369 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:13 +0100] "GET /images/stories/raith/almhuette_raith.jpg HTTP/1.1" 200 43300 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:13 +0100] "GET /images/stories/raith/grillplatz.jpg HTTP/1.1" 200 55303 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:13 +0100] "GET /images/stories/raith/wohnraum.jpg HTTP/1.1" 200 43586 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:14 +0100] "GET /images/stories/raith/garage.jpg HTTP/1.1" 200 57339 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:17 +0100] "GET /images/stories/raith/almenland_logo.jpg HTTP/1.1" 200 21490 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:17 +0100] "GET /images/stories/raith/oststeiermark.png HTTP/1.1" 200 65225 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:18 +0100] "GET /images/stories/raith/steiermark_herz.png HTTP/1.1" 200 39683 "http://www.almhuette-raith.at/" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:20 +0100] "GET /images/bg_raith.jpg HTTP/1.1" 200 329961 "http://www.almhuette-raith.at/templates/jp_hotel/css/template.css" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.125 - - [19/Dec/2020:15:23:23 +0100] "GET /modules/mod_bowslideshow/tmpl/images/image_shadow.png HTTP/1.1" 200 5017 "http://www.almhuette-raith.at/modules/mod_bowslideshow/tmpl/css/bowslideshow.css" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.114 - - [19/Dec/2020:15:23:23 +0100] "GET /templates/jp_hotel/images/content_heading.gif HTTP/1.1" 200 69 "http://www.almhuette-raith.at/templates/jp_hotel/css/template.css" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.10.117 - - [19/Dec/2020:15:23:23 +0100] "GET /templates/jp_hotel/images/module_heading.gif HTTP/1.1" 200 83 "http://www.almhuette-raith.at/templates/jp_hotel/css/template.css" "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-CN; EML-AL00 Build/HUAWEIEML-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 baidu.sogo.uc.UCBrowser/11.9.4.974 UWS/2.13.1.48 Mobile Safari/537.36 AliApp(DingTalk/4.5.11) com.alibaba.android.rimet/10487439 Channel/227200 language/zh-CN" "-"
0.0.167.138 - - [19/Dec/2020:15:51:58 +0100] "GET / HTTP/1.0" 200 10466 "http://www.almhuette-raith.at" "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36" "-"
0.0.149.55 - - [19/Dec/2020:16:06:42 +0100] "GET /index.php?option=com_content&view=article&id=46&Itemid=54 HTTP/1.1" 200 8938 "-" "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" "-"
0.0.229.86 - - [19/Dec/2020:16:10:38 +0100] "GET /apache-log/access.log HTTP/1.1" 200 17171 "-" "Mozilla/5.0 (compatible; Seekport Crawler; http://seekport.com/" "-"
0.0.117.249 - - [19/Dec/2020:16:13:33 +0100] "GET /apache-log/access.log HTTP/1.1" 200 17340 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" "-"
0.0.117.249 - - [19/Dec/2020:16:13:33 +0100] "GET /favicon.ico HTTP/1.1" 404 217 "http://www.almhuette-raith.at/apache-log/access.log" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" "-"
0.0.117.249 - - [19/Dec/2020:16:13:54 +0100] "GET /apache-log/access.log HTTP/1.1" 200 17822 "-" "Wget/1.20.3 (linux-gnu)" "-"
0.0.64.41 - - [19/Dec/2020:16:39:10 +0100] "GET / HTTP/1.1" 200 10479 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "-"
0.0.208.79 - - [19/Dec/2020:16:39:36 +0100] "GET /apache-log/access.log HTTP/1.1" 200 18109 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.208.79 - - [19/Dec/2020:16:39:36 +0100] "GET /favicon.ico HTTP/1.1" 404 217 "http://www.almhuette-raith.at/apache-log/access.log" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.208.79 - - [19/Dec/2020:16:40:36 +0100] "GET /apache-log/access.log HTTP/1.1" 200 18587 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.208.79 - - [19/Dec/2020:16:43:22 +0100] "GET /apache-log/access.log HTTP/1.1" 200 18807 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.196.129 - - [19/Dec/2020:16:46:10 +0100] "GET /robots.txt HTTP/1.1" 200 304 "-" "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)" "-"
0.0.196.129 - - [19/Dec/2020:16:46:12 +0100] "GET / HTTP/1.1" 200 10479 "-" "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)" "-"
0.0.66.158 - - [19/Dec/2020:17:11:04 +0100] "GET / HTTP/1.1" 200 10479 "-" "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.90 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "-"
0.0.161.12 - - [19/Dec/2020:17:35:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-A505FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/71.0.3578.99MobileSafari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:17:35:43 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-A505FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/71.0.3578.99MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:36:18 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-G955F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:36:18 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-G955F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:17:36:54 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPad;CPUOS13_6likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)GSA/114.0.318129667Mobile/15E148Safari/604.1" "-"
0.0.145.131 - - [19/Dec/2020:17:36:55 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPad;CPUOS13_6likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)GSA/114.0.318129667Mobile/15E148Safari/604.1" "-"
0.0.0.179 - - [19/Dec/2020:17:37:27 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android4.2.1;en-us;Nexus5Build/JOP40D)AppleWebKit/535.19(KHTML,likeGecko;googleweblight)Chrome/38.0.1025.166MobileSafari/535.19" "-"
0.0.0.179 - - [19/Dec/2020:17:37:28 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android4.2.1;en-us;Nexus5Build/JOP40D)AppleWebKit/535.19(KHTML,likeGecko;googleweblight)Chrome/38.0.1025.166MobileSafari/535.19" "-"
0.0.145.131 - - [19/Dec/2020:17:37:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_13_6)AppleWebKit/537.36(KHTML,likeGecko)Chrome/68.0.3440.106Safari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:17:37:43 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_13_6)AppleWebKit/537.36(KHTML,likeGecko)Chrome/68.0.3440.106Safari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:17:38:04 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36OPR/70.0.3728.106" "-"
0.0.95.52 - - [19/Dec/2020:17:38:05 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36OPR/70.0.3728.106" "-"
0.0.51.36 - - [19/Dec/2020:17:38:10 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G965F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.117MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:38:11 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G965F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.117MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:39:22 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/51.0.2683.0Safari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:39:22 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/51.0.2683.0Safari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:39:57 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;W-K510-BYT)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:39:57 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;W-K510-BYT)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:40:20 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A505FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:40:20 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A505FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.4.22 - - [19/Dec/2020:17:40:26 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A3050)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.4.22 - - [19/Dec/2020:17:40:27 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A3050)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:17:40:31 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;STK-LX1Build/HUAWEISTK-LX1;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/79.0.3945.116MobileSafari/537.36EdgW/1.0" "-"
0.0.143.24 - - [19/Dec/2020:17:40:31 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;STK-LX1Build/HUAWEISTK-LX1;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/79.0.3945.116MobileSafari/537.36EdgW/1.0" "-"
0.0.0.98 - - [19/Dec/2020:17:41:31 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A705FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:17:41:31 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A705FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:17:41:32 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_3_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.0.5Mobile/15E148Safari/604.1" "-"
0.0.51.62 - - [19/Dec/2020:17:41:32 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_3_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.0.5Mobile/15E148Safari/604.1" "-"
0.0.51.36 - - [19/Dec/2020:17:41:37 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G980F/G980FXXU4BTH5)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:41:38 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G980F/G980FXXU4BTH5)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:17:41:45 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android9;fr-fr;Redmi7Build/PKQ1.181021.001)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.0.98 - - [19/Dec/2020:17:41:46 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android9;fr-fr;Redmi7Build/PKQ1.181021.001)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.58.254 - - [19/Dec/2020:17:41:50 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_7_5)AppleWebKit/537.36(KHTML,likeGecko)Chrome/49.0.2623.112Safari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:17:41:51 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_7_5)AppleWebKit/537.36(KHTML,likeGecko)Chrome/49.0.2623.112Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:17:42:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.116Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:17:42:44 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.116Safari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:44:54 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android5.0.1;SAMSUNGGT-I9505)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:44:54 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android5.0.1;SAMSUNGGT-I9505)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.0.179 - - [19/Dec/2020:17:45:02 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;G3311Build/43.0.A.7.106;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:17:45:03 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;G3311Build/43.0.A.7.106;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.58.254 - - [19/Dec/2020:17:46:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;Nokia7plus)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.111MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:17:46:29 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;Nokia7plus)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.111MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:17:46:51 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.0.0;SAMSUNGSM-G930F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.0Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:17:46:53 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.0.0;SAMSUNGSM-G930F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.0Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:17:47:49 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;Nokia1.3)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:17:47:49 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;Nokia1.3)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:17:47:58 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android5.0.1;YOGATablet2-1050L)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81Safari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:17:47:59 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android5.0.1;YOGATablet2-1050L)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81Safari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:17:48:11 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/64.0.3282.140Safari/537.36Edge/18.17763" "-"
0.0.51.36 - - [19/Dec/2020:17:48:11 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/64.0.3282.140Safari/537.36Edge/18.17763" "-"
0.0.207.154 - - [19/Dec/2020:17:48:12 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:17:48:12 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:17:48:51 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;LM-K410)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:17:48:51 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;LM-K410)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:17:49:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS12_4_8likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/12.1.2Mobile/15E148Safari/604.1" "-"
0.0.51.62 - - [19/Dec/2020:17:49:29 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS12_4_8likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/12.1.2Mobile/15E148Safari/604.1" "-"
0.0.145.131 - - [19/Dec/2020:17:51:01 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.116Safari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:17:51:01 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.116Safari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:17:51:02 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;W-P611-EEA)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:17:51:03 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;W-P611-EEA)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:17:52:48 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/77.0.3865.116MobileSafari/537.36EdgA/45.07.2.5059" "-"
0.0.227.55 - - [19/Dec/2020:17:52:48 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/77.0.3865.116MobileSafari/537.36EdgA/45.07.2.5059" "-"
0.0.95.52 - - [19/Dec/2020:17:52:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-T510)AppleWebKit/537.36(KHTML,likeGecko)Chrome/77.0.3865.116Safari/537.36EdgA/45.07.2.5059" "-"
0.0.95.52 - - [19/Dec/2020:17:52:52 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-T510)AppleWebKit/537.36(KHTML,likeGecko)Chrome/77.0.3865.116Safari/537.36EdgA/45.07.2.5059" "-"
0.0.161.12 - - [19/Dec/2020:17:53:51 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A505FN/A505FNXXU5BTF5)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:17:53:54 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A505FN/A505FNXXU5BTF5)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:17:54:09 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:17:54:10 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.30 - - [19/Dec/2020:17:55:01 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.2;Win64;x64;rv:80.0)Gecko/20100101Firefox/80.0" "-"
0.0.143.30 - - [19/Dec/2020:17:55:03 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT6.2;Win64;x64;rv:80.0)Gecko/20100101Firefox/80.0" "-"
0.0.227.31 - - [19/Dec/2020:17:55:04 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_7likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)CriOS/85.0.4183.92Mobile/15E148Safari/604.1" "-"
0.0.227.31 - - [19/Dec/2020:17:55:04 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_7likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)CriOS/85.0.4183.92Mobile/15E148Safari/604.1" "-"
0.0.161.6 - - [19/Dec/2020:17:55:19 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-J600FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.6 - - [19/Dec/2020:17:55:23 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-J600FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.6 - - [19/Dec/2020:17:55:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;ASUS_Z01RD)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:55:57 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SAMSUNGSM-G955F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:55:57 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SAMSUNGSM-G955F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:17:56:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Linuxx86_64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.116Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:17:56:52 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(X11;Linuxx86_64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.116Safari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:57:49 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;ZTEBladeV1000)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:17:57:49 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;ZTEBladeV1000)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.20 - - [19/Dec/2020:17:58:08 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;J9110)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.20 - - [19/Dec/2020:17:58:09 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;J9110)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:17:58:54 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS11_2_5likeMacOSX)AppleWebKit/604.5.6(KHTML,likeGecko)Version/11.0Mobile/15D60Safari/604.1" "-"
0.0.207.154 - - [19/Dec/2020:17:58:54 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS11_2_5likeMacOSX)AppleWebKit/604.5.6(KHTML,likeGecko)Version/11.0Mobile/15D60Safari/604.1" "-"
0.0.0.98 - - [19/Dec/2020:17:59:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;WOW64;rv:50.0)Gecko/20100101Firefox/50.0" "-"
0.0.0.98 - - [19/Dec/2020:17:59:52 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT10.0;WOW64;rv:50.0)Gecko/20100101Firefox/50.0" "-"
0.0.51.36 - - [19/Dec/2020:18:00:07 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;LM-K410)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:00:08 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;LM-K410)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:18:02:24 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;Redmi7A)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:18:02:24 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;Redmi7A)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:18:02:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;HTCU12+)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:18:02:42 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;HTCU12+)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:04:24 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:04:24 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:04:29 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G970F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.106MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:04:29 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G970F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/83.0.4103.106MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:04:40 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.1.0;GS370)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:04:40 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.1.0;GS370)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.0.179 - - [19/Dec/2020:18:05:12 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36OPR/70.0.3728.133" "-"
0.0.0.179 - - [19/Dec/2020:18:05:12 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36OPR/70.0.3728.133" "-"
0.0.161.12 - - [19/Dec/2020:18:05:17 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_14_6)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:18:05:20 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_14_6)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:18:05:40 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;Pixel4)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:18:05:40 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;Pixel4)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:06:00 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.0.0;AGS2-W09)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:06:00 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.0.0;AGS2-W09)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:06:25 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-N960FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.145.106 - - [19/Dec/2020:18:06:26 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-N960FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:18:06:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J730FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.125MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:18:06:28 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J730FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.125MobileSafari/537.36EdgW/1.0" "-"
0.0.149.8 - - [19/Dec/2020:18:07:36 +0100] "GET /index.php?option=com_phocagallery&view=category&id=1%3Aalmhuette-raith&Itemid=53&limitstart=20 HTTP/1.1" 200 15462 "-" "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" "-"
0.0.207.154 - - [19/Dec/2020:18:07:50 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android8.1.0;zh-CN;EML-AL00Build/HUAWEIEML-AL00)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/57.0.2987.108baidu.sogo.uc.UCBrowser/11.9.4.974UWS/2.13.1.48MobileSafari/537.36AliApp(DingTalk/4.5.11)com.alibaba.a" "-"
0.0.207.154 - - [19/Dec/2020:18:07:50 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android8.1.0;zh-CN;EML-AL00Build/HUAWEIEML-AL00)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/57.0.2987.108baidu.sogo.uc.UCBrowser/11.9.4.974UWS/2.13.1.48MobileSafari/537.36AliApp(DingTalk/4.5.11)com.alibaba.a" "-"
0.0.227.31 - - [19/Dec/2020:18:09:02 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SAMSUNGSM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:18:09:03 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SAMSUNGSM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:18:09:05 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G975F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:18:09:06 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G975F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:18:10:24 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_13_6)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.1.1Safari/605.1.15" "-"
0.0.227.55 - - [19/Dec/2020:18:10:25 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_13_6)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.1.1Safari/605.1.15" "-"
0.0.143.30 - - [19/Dec/2020:18:11:54 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J730FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.125MobileSafari/537.36EdgW/1.0" "-"
0.0.143.30 - - [19/Dec/2020:18:11:58 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J730FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.125MobileSafari/537.36EdgW/1.0" "-"
0.0.95.52 - - [19/Dec/2020:18:13:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;HRY-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:18:13:37 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;HRY-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:18:13:48 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/70.0.3538.102Safari/537.36Edge/18.18363" "-"
0.0.145.131 - - [19/Dec/2020:18:13:48 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/70.0.3538.102Safari/537.36Edge/18.18363" "-"
0.0.51.62 - - [19/Dec/2020:18:16:30 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-N960FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.62 - - [19/Dec/2020:18:16:30 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-N960FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.98 - - [19/Dec/2020:18:17:23 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;G8341)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:18:17:23 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;G8341)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:17:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;CPH1931)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:18:17:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.102Safari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:17:44 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;CPH1931)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:18:17:44 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.102Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:18:18:46 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/63.0.3235.0Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:18:18:47 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/63.0.3235.0Safari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:19:06 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android8.1.0;zh-CN;EML-AL00Build/HUAWEIEML-AL00)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/57.0.2987.108baidu.sogo.uc.UCBrowser/11.9.4.974UWS/2.13.1.48MobileSafari/537.36AliApp(DingTalk/4.5.11)com.alibaba.a" "-"
0.0.51.36 - - [19/Dec/2020:18:19:06 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android8.1.0;zh-CN;EML-AL00Build/HUAWEIEML-AL00)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/57.0.2987.108baidu.sogo.uc.UCBrowser/11.9.4.974UWS/2.13.1.48MobileSafari/537.36AliApp(DingTalk/4.5.11)com.alibaba.a" "-"
0.0.145.131 - - [19/Dec/2020:18:19:15 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;MAR-LX1A;HMSCore5.0.1.313;GMSCore20.33.14)AppleWebKit/537.36(KHTML,likeGecko)Chrome/78.0.3904.108HuaweiBrowser/10.1.4.303MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:18:19:16 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;MAR-LX1A;HMSCore5.0.1.313;GMSCore20.33.14)AppleWebKit/537.36(KHTML,likeGecko)Chrome/78.0.3904.108HuaweiBrowser/10.1.4.303MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:18:19:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.0.0;SAMSUNGSM-G930F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.0Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:18:19:28 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.0.0;SAMSUNGSM-G930F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.0Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:19:32 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G981B)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:19:32 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G981B)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:21:56 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.3;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.83Safari/537.36Edg/85.0.564.41" "-"
0.0.207.221 - - [19/Dec/2020:18:21:56 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.3;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.83Safari/537.36Edg/85.0.564.41" "-"
0.0.227.31 - - [19/Dec/2020:18:22:12 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64;rv:79.0)Gecko/20100101Firefox/79.0" "-"
0.0.227.31 - - [19/Dec/2020:18:22:12 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64;rv:79.0)Gecko/20100101Firefox/79.0" "-"
0.0.145.106 - - [19/Dec/2020:18:23:00 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A015F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:23:01 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A015F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:18:24:00 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;MHA-L29Build/HUAWEIMHA-L29;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.145.131 - - [19/Dec/2020:18:24:01 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;MHA-L29Build/HUAWEIMHA-L29;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:18:25:10 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Linuxx86_64)AppleWebKit/534.24(KHTML,likeGecko)Chrome/71.0.3578.141Safari/534.24XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.0.179 - - [19/Dec/2020:18:25:11 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(X11;Linuxx86_64)AppleWebKit/534.24(KHTML,likeGecko)Chrome/71.0.3578.141Safari/534.24XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.227.31 - - [19/Dec/2020:18:25:17 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36Edg/84.0.522.59" "-"
0.0.227.31 - - [19/Dec/2020:18:25:17 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125Safari/537.36Edg/84.0.522.59" "-"
0.0.227.55 - - [19/Dec/2020:18:27:08 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android4.4.4;SM-T113)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:18:27:08 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android4.4.4;SM-T113)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:18:27:18 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;PCT-L29)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:18:27:20 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;PCT-L29)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:18:27:23 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:18:27:23 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:18:28:19 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;JERRY2)AppleWebKit/537.36(KHTML,likeGecko)Chrome/72.0.3626.105MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:18:28:19 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;JERRY2)AppleWebKit/537.36(KHTML,likeGecko)Chrome/72.0.3626.105MobileSafari/537.36" "-"
0.0.4.22 - - [19/Dec/2020:18:28:44 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SAMSUNGSM-T825)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136Safari/537.36" "-"
0.0.4.22 - - [19/Dec/2020:18:28:44 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SAMSUNGSM-T825)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136Safari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:18:28:58 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Ubuntu;Linuxx86_64;rv:78.0)Gecko/20100101Firefox/78.0" "-"
0.0.58.90 - - [19/Dec/2020:18:28:59 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(X11;Ubuntu;Linuxx86_64;rv:78.0)Gecko/20100101Firefox/78.0" "-"
0.0.145.106 - - [19/Dec/2020:18:30:24 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;H8324)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:18:30:25 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;H8324)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:18:30:45 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;BTV-W09)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:18:30:56 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;BTV-W09)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:18:33:18 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A600FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:18:33:18 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A600FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:18:34:18 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/70.0.3538.102Safari/537.36Edge/18.18363" "-"
0.0.207.154 - - [19/Dec/2020:18:34:18 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/70.0.3538.102Safari/537.36Edge/18.18363" "-"
0.0.143.30 - - [19/Dec/2020:18:34:27 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Ubuntu;Linuxi686;rv:78.0)Gecko/20100101Firefox/78.0" "-"
0.0.143.30 - - [19/Dec/2020:18:34:28 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(X11;Ubuntu;Linuxi686;rv:78.0)Gecko/20100101Firefox/78.0" "-"
0.0.227.31 - - [19/Dec/2020:18:34:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G965F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/11.2Chrome/75.0.3770.143MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:18:34:53 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G965F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/11.2Chrome/75.0.3770.143MobileSafari/537.36" "-"
0.0.0.179 - - [19/Dec/2020:18:35:23 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;ZTEBladeL8Build/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:18:35:24 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;ZTEBladeL8Build/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.98 - - [19/Dec/2020:18:35:34 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;COL-L29)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:18:35:34 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;COL-L29)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:35:38 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Ubuntu;Linuxx86_64;rv:75.0)Gecko/20100101Firefox/75.0" "-"
0.0.207.221 - - [19/Dec/2020:18:35:38 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(X11;Ubuntu;Linuxx86_64;rv:75.0)Gecko/20100101Firefox/75.0" "-"
0.0.0.179 - - [19/Dec/2020:18:35:49 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G973F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.0.179 - - [19/Dec/2020:18:35:49 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G973F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:18:35:57 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G960FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.89MobileSafari/537.36EdgW/1.0" "-"
0.0.0.98 - - [19/Dec/2020:18:35:58 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G960FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.89MobileSafari/537.36EdgW/1.0" "-"
0.0.207.221 - - [19/Dec/2020:18:36:46 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Android8.0.0;Mobile;rv:68.0)Gecko/68.0Firefox/68.0" "-"
0.0.207.221 - - [19/Dec/2020:18:36:47 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(Android8.0.0;Mobile;rv:68.0)Gecko/68.0Firefox/68.0" "-"
0.0.207.154 - - [19/Dec/2020:18:37:17 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android5.1.1;SM-J320F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.89MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:18:37:17 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android5.1.1;SM-J320F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.89MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:18:38:11 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Android6.0;Mobile;rv:80.0)Gecko/80.0Firefox/80.0" "-"
0.0.58.254 - - [19/Dec/2020:18:38:11 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(Android6.0;Mobile;rv:80.0)Gecko/80.0Firefox/80.0" "-"
0.0.51.36 - - [19/Dec/2020:18:39:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;Nokia1.3)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:39:43 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;Nokia1.3)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:40:01 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;W-P311-EEA)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:40:01 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;W-P311-EEA)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:18:40:10 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Android9;Mobile;rv:80.0)Gecko/80.0Firefox/80.0" "-"
0.0.207.154 - - [19/Dec/2020:18:40:10 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(Android9;Mobile;rv:80.0)Gecko/80.0Firefox/80.0" "-"
0.0.161.6 - - [19/Dec/2020:18:42:48 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.1.0;5033F_EEA)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:18:43:09 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_15_6)AppleWebKit/605.1.15(KHTML,likeGecko)QuickLook/5.0" "-"
0.0.145.131 - - [19/Dec/2020:18:43:10 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_15_6)AppleWebKit/605.1.15(KHTML,likeGecko)QuickLook/5.0" "-"
0.0.207.221 - - [19/Dec/2020:18:44:03 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:18:44:03 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.1;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36" "-"
0.0.95.20 - - [19/Dec/2020:18:44:11 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.20 - - [19/Dec/2020:18:44:20 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.183.233 - - [19/Dec/2020:18:44:41 +0100] "GET /apache-log/access.log HTTP/1.1" 200 71289 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.183.233 - - [19/Dec/2020:18:44:42 +0100] "GET /favicon.ico HTTP/1.1" 404 217 "http://www.almhuette-raith.at/apache-log/access.log" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.51.36 - - [19/Dec/2020:18:46:09 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10.14;rv:80.0)Gecko/20100101Firefox/80.0" "-"
0.0.51.36 - - [19/Dec/2020:18:46:10 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10.14;rv:80.0)Gecko/20100101Firefox/80.0" "-"
0.0.95.52 - - [19/Dec/2020:18:47:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;CPH2005)AppleWebKit/537.36(KHTML,likeGecko)Chrome/79.0.3945.116MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:18:47:46 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;CPH2005)AppleWebKit/537.36(KHTML,likeGecko)Chrome/79.0.3945.116MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:18:48:53 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;LM-X120)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:18:48:54 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;LM-X120)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:18:48:59 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;PGN528Build/NRD90M;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.62 - - [19/Dec/2020:18:48:59 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;PGN528Build/NRD90M;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.95.52 - - [19/Dec/2020:18:50:19 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;vivo1920Build/PKQ1.190626.001;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.95.52 - - [19/Dec/2020:18:50:20 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;vivo1920Build/PKQ1.190626.001;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.207.154 - - [19/Dec/2020:18:52:49 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;M2003J15SCBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.207.154 - - [19/Dec/2020:18:52:49 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;M2003J15SCBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.36 - - [19/Dec/2020:18:54:12 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android10;fr-fr;POCOF2ProBuild/QKQ1.191117.002)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.6.0-gn" "-"
0.0.51.36 - - [19/Dec/2020:18:54:12 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android10;fr-fr;POCOF2ProBuild/QKQ1.191117.002)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.6.0-gn" "-"
0.0.58.90 - - [19/Dec/2020:18:54:29 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-G960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:18:54:29 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-G960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:18:54:54 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.1.0;GS100)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:18:54:55 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.1.0;GS100)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:18:55:00 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android6.0.1;SM-N910F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.89MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:18:55:03 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android6.0.1;SM-N910F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.89MobileSafari/537.36" "-"
0.0.167.138 - - [19/Dec/2020:18:55:08 +0100] "GET / HTTP/1.0" 200 10466 "http://www.almhuette-raith.at" "Mozilla/5.0 (Windows NT 10.0; rv:60.0) Gecko/20100101 Firefox/60.0" "-"
0.0.51.36 - - [19/Dec/2020:18:55:46 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android9;fr-fr;Redmi7Build/PKQ1.181021.001)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.4.3-g" "-"
0.0.51.36 - - [19/Dec/2020:18:55:46 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android9;fr-fr;Redmi7Build/PKQ1.181021.001)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.4.3-g" "-"
0.0.161.6 - - [19/Dec/2020:18:56:39 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android10;fr-fr;RedmiNote7Build/QKQ1.190910.002)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.161.6 - - [19/Dec/2020:18:56:42 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android10;fr-fr;RedmiNote7Build/QKQ1.190910.002)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.58.254 - - [19/Dec/2020:18:57:45 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;SAMSUNGSM-G920F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:18:57:45 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;SAMSUNGSM-G920F)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:19:00:20 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-N950FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.207.154 - - [19/Dec/2020:19:00:20 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-N950FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.58.90 - - [19/Dec/2020:19:01:10 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.1.0;DUB-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.90 - - [19/Dec/2020:19:01:10 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.1.0;DUB-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:19:01:14 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Linuxx86_64;rv:79.0)Gecko/20100101Firefox/79.0" "-"
0.0.51.62 - - [19/Dec/2020:19:01:14 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(X11;Linuxx86_64;rv:79.0)Gecko/20100101Firefox/79.0" "-"
0.0.58.90 - - [19/Dec/2020:19:01:48 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_6likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)CriOS/85.0.4183.92Mobile/15E148Safari/604.1" "-"
0.0.58.90 - - [19/Dec/2020:19:01:49 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_6likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)CriOS/85.0.4183.92Mobile/15E148Safari/604.1" "-"
0.0.81.164 - - [19/Dec/2020:19:03:36 +0100] "GET / HTTP/1.1" 200 10479 "http://www.almhuette-raith.at" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36" "-"
0.0.81.164 - - [19/Dec/2020:19:03:39 +0100] "GET /index.php?option=com_easyblog&view=dashboard&layout=write HTTP/1.1" 404 1397 "http://www.almhuette-raith.at" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:03:53 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36OPR/70.0.3728.119" "-"
0.0.207.221 - - [19/Dec/2020:19:03:54 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36OPR/70.0.3728.119" "-"
0.0.227.55 - - [19/Dec/2020:19:04:17 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;VOG-L29Build/HUAWEIVOG-L29;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.101MobileSafari/537.36EdgW/1.0" "-"
0.0.227.55 - - [19/Dec/2020:19:04:17 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;VOG-L29Build/HUAWEIVOG-L29;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.101MobileSafari/537.36EdgW/1.0" "-"
0.0.227.55 - - [19/Dec/2020:19:07:36 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A705FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/11.1Chrome/75.0.3770.143MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:19:07:36 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A705FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/11.1Chrome/75.0.3770.143MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:07:46 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;ASUS_X00TD)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:19:07:46 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPodtouch;CPUiPhoneOS12_4_8likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/12.1.2Mobile/15E148Safari/604.1" "-"
0.0.207.154 - - [19/Dec/2020:19:07:46 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPodtouch;CPUiPhoneOS12_4_8likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/12.1.2Mobile/15E148Safari/604.1" "-"
0.0.207.221 - - [19/Dec/2020:19:07:47 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;ASUS_X00TD)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.30 - - [19/Dec/2020:19:07:59 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_12_6)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.83Safari/537.36" "-"
0.0.143.30 - - [19/Dec/2020:19:08:02 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX10_12_6)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.83Safari/537.36" "-"
0.0.0.179 - - [19/Dec/2020:19:08:51 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A217FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:19:08:51 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A217FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.62 - - [19/Dec/2020:19:09:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-G950FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.62 - - [19/Dec/2020:19:09:42 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-G950FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.4.35 - - [19/Dec/2020:19:10:56 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;ZTEBladeV1000)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:19:10:56 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;ZTEBladeV1000)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:11:17 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;CPH1823Build/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.207.221 - - [19/Dec/2020:19:11:18 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;CPH1823Build/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.62 - - [19/Dec/2020:19:12:26 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:19:12:27 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:19:12:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A415FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.62 - - [19/Dec/2020:19:12:43 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A415FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.95.20 - - [19/Dec/2020:19:13:03 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-G973F/G973FXXU7CTF1)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:19:15:08 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.1.0;DUB-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:19:15:09 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.1.0;DUB-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:19:15:22 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G970FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.58.254 - - [19/Dec/2020:19:15:23 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G970FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.145.106 - - [19/Dec/2020:19:17:00 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.3;Win64;x64;Trident/7.0;rv:11.0)likeGecko" "-"
0.0.145.106 - - [19/Dec/2020:19:17:01 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT6.3;Win64;x64;Trident/7.0;rv:11.0)likeGecko" "-"
0.0.0.98 - - [19/Dec/2020:19:17:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.102Safari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:19:17:42 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.1;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.102Safari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:19:18:34 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A105FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:19:18:35 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A105FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.125MobileSafari/537.36" "-"
0.0.51.62 - - [19/Dec/2020:19:19:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Macintosh;IntelMacOSX11_0)AppleWebKit/605.1.15(KHTML,likeGecko)Version/14.0Safari/605.1.15" "-"
0.0.51.62 - - [19/Dec/2020:19:19:52 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Macintosh;IntelMacOSX11_0)AppleWebKit/605.1.15(KHTML,likeGecko)Version/14.0Safari/605.1.15" "-"
0.0.207.221 - - [19/Dec/2020:19:20:38 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;VOG-L29Build/HUAWEIVOG-L29;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.207.221 - - [19/Dec/2020:19:20:39 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;VOG-L29Build/HUAWEIVOG-L29;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.143.30 - - [19/Dec/2020:19:21:03 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SNE-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.30 - - [19/Dec/2020:19:21:12 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SNE-LX1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:19:21:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.0;SM-G925F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.154 - - [19/Dec/2020:19:21:52 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.0;SM-G925F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.30 - - [19/Dec/2020:19:23:31 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A105G)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.20 - - [19/Dec/2020:19:24:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36OPR/68.0.3618.206" "-"
0.0.95.20 - - [19/Dec/2020:19:24:29 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36OPR/68.0.3618.206" "-"
0.0.0.98 - - [19/Dec/2020:19:24:32 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A705FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.0.98 - - [19/Dec/2020:19:24:32 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SAMSUNGSM-A705FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:19:24:44 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;LM-X520)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:19:24:44 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;LM-X520)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:19:25:41 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;U;Android10;de-de;Mi9TProBuild/QKQ1.190825.002)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.161.12 - - [19/Dec/2020:19:25:58 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;U;Android10;de-de;Mi9TProBuild/QKQ1.190825.002)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/71.0.3578.141MobileSafari/537.36XiaoMi/MiuiBrowser/12.5.2-gn" "-"
0.0.95.52 - - [19/Dec/2020:19:26:13 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-A530F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:19:26:16 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-A530F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:19:26:27 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G975FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.125MobileSafari/537.36EdgW/1.0" "-"
0.0.161.12 - - [19/Dec/2020:19:26:30 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G975FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/84.0.4147.125MobileSafari/537.36EdgW/1.0" "-"
0.0.0.179 - - [19/Dec/2020:19:27:07 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.3;WOW64;Trident/7.0;tb-gmx/2.7.7;rv:11.0)likeGecko" "-"
0.0.0.179 - - [19/Dec/2020:19:27:08 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT6.3;WOW64;Trident/7.0;tb-gmx/2.7.7;rv:11.0)likeGecko" "-"
0.0.4.35 - - [19/Dec/2020:19:27:10 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_6_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.1.2Mobile/15E148Safari/604.1" "-"
0.0.4.35 - - [19/Dec/2020:19:27:10 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_6_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.1.2Mobile/15E148Safari/604.1" "-"
0.0.164.246 - - [19/Dec/2020:19:29:09 +0100] "GET / HTTP/1.0" 200 10466 "http://www.almhuette-raith.at" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15" "-"
0.0.161.12 - - [19/Dec/2020:19:31:14 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Linuxx86_64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:19:31:17 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(X11;Linuxx86_64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:19:31:55 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(X11;Linuxx86_64;rv:52.0)Gecko/20100101Firefox/52.0" "-"
0.0.161.12 - - [19/Dec/2020:19:31:56 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(X11;Linuxx86_64;rv:52.0)Gecko/20100101Firefox/52.0" "-"
0.0.207.221 - - [19/Dec/2020:19:33:23 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.3;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:33:24 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.3;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.105Safari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:19:33:56 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android7.1.1;SAMSUNGSM-J510FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:19:33:57 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android7.1.1;SAMSUNGSM-J510FN)AppleWebKit/537.36(KHTML,likeGecko)SamsungBrowser/12.1Chrome/79.0.3945.136MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:34:32 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;rv:43.0)Gecko/20100101Firefox/43.0anonymizedbyAbelssoft1600746919" "-"
0.0.207.221 - - [19/Dec/2020:19:34:33 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT10.0;rv:43.0)Gecko/20100101Firefox/43.0anonymizedbyAbelssoft1600746919" "-"
0.0.145.106 - - [19/Dec/2020:19:34:54 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.102Safari/537.36" "-"
0.0.145.106 - - [19/Dec/2020:19:34:55 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.1)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.102Safari/537.36" "-"
0.0.4.22 - - [19/Dec/2020:19:35:13 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/77.0.3865.116MobileSafari/537.36EdgA/45.07.2.5057" "-"
0.0.4.22 - - [19/Dec/2020:19:35:14 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J415FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/77.0.3865.116MobileSafari/537.36EdgA/45.07.2.5057" "-"
0.0.161.12 - - [19/Dec/2020:19:35:49 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Mobile;WindowsPhone8.1;Android4.0;ARM;Trident/7.0;Touch;rv:11.0;IEMobile/11.0;NOKIA;Lumia520)likeiPhoneOS7_0_3MacOSXAppleWebKit/537(KHTML,likeGecko)MobileSafari/537" "-"
0.0.161.12 - - [19/Dec/2020:19:35:53 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Mobile;WindowsPhone8.1;Android4.0;ARM;Trident/7.0;Touch;rv:11.0;IEMobile/11.0;NOKIA;Lumia520)likeiPhoneOS7_0_3MacOSXAppleWebKit/537(KHTML,likeGecko)MobileSafari/537" "-"
0.0.58.254 - - [19/Dec/2020:19:37:14 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;rv:67.0)Gecko/20100101Firefox/67.0anonymizedbyAbelssoft509110158" "-"
0.0.58.254 - - [19/Dec/2020:19:37:14 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT10.0;rv:67.0)Gecko/20100101Firefox/67.0anonymizedbyAbelssoft509110158" "-"
0.0.161.12 - - [19/Dec/2020:19:37:45 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.3;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36OPR/70.0.3728.178" "-"
0.0.161.12 - - [19/Dec/2020:19:37:47 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT6.3;WOW64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/84.0.4147.135Safari/537.36OPR/70.0.3728.178" "-"
0.0.66.216 - - [19/Dec/2020:19:39:07 +0100] "GET /libraries/joomla/template/mark.php HTTP/1.1" 404 240 "http://google.com" "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.99 Safari/533.4" "-"
0.0.0.179 - - [19/Dec/2020:19:39:58 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36" "-"
0.0.0.179 - - [19/Dec/2020:19:39:58 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36" "-"
0.0.145.131 - - [19/Dec/2020:19:41:22 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPad;CPUOS13_6likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)GSA/123.4.330040034Mobile/15E148Safari/604.1" "-"
0.0.145.131 - - [19/Dec/2020:19:41:22 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPad;CPUOS13_6likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)GSA/123.4.330040034Mobile/15E148Safari/604.1" "-"
0.0.4.35 - - [19/Dec/2020:19:41:25 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT6.1;WOW64;rv:68.0)Gecko/20100101Firefox/68.0" "-"
0.0.4.35 - - [19/Dec/2020:19:41:26 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT6.1;WOW64;rv:68.0)Gecko/20100101Firefox/68.0" "-"
0.0.58.254 - - [19/Dec/2020:19:41:52 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;ONEPLUSA3010)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:19:41:52 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;ONEPLUSA3010)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:19:42:33 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-N960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:19:42:33 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-N960F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:19:42:42 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A405FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.101MobileSafari/537.36" "-"
0.0.143.24 - - [19/Dec/2020:19:42:42 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A405FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.101MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:43:45 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android5.1;HUAWEILYO-L21)AppleWebKit/537.36(KHTML,likeGecko)Chrome/80.0.3987.99MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:43:45 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android5.1;HUAWEILYO-L21)AppleWebKit/537.36(KHTML,likeGecko)Chrome/80.0.3987.99MobileSafari/537.36" "-"
0.0.58.254 - - [19/Dec/2020:19:44:15 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Mobile;WindowsPhone8.1;Android4.0;ARM;Trident/7.0;Touch;rv:11.0;IEMobile/11.0;NOKIA;Lumia520)likeiPhoneOS7_0_3MacOSXAppleWebKit/537(KHTML,likeGecko)MobileSafari/537" "-"
0.0.58.254 - - [19/Dec/2020:19:44:16 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Mobile;WindowsPhone8.1;Android4.0;ARM;Trident/7.0;Touch;rv:11.0;IEMobile/11.0;NOKIA;Lumia520)likeiPhoneOS7_0_3MacOSXAppleWebKit/537(KHTML,likeGecko)MobileSafari/537" "-"
0.0.145.131 - - [19/Dec/2020:19:45:11 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-N950FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.145.131 - - [19/Dec/2020:19:45:11 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-N950FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.51.36 - - [19/Dec/2020:19:45:17 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64;rv:60.0)Gecko/20100101Firefox/60.0" "-"
0.0.51.36 - - [19/Dec/2020:19:45:18 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 303 5 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64;rv:60.0)Gecko/20100101Firefox/60.0" "-"
0.0.227.31 - - [19/Dec/2020:19:46:29 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;ONEPLUSA6013)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:19:46:29 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPad;CPUOS11_2_5likeMacOSX)AppleWebKit/604.5.6(KHTML,likeGecko)Version/11.0Mobile/15D60Safari/604.1" "-"
0.0.227.31 - - [19/Dec/2020:19:46:29 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;ONEPLUSA6013)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.6 - - [19/Dec/2020:19:46:30 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;A3)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.6 - - [19/Dec/2020:19:46:33 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;A3)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:46:43 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-G973F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.207.221 - - [19/Dec/2020:19:46:44 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-G973F)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.161.12 - - [19/Dec/2020:19:46:46 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPad;CPUOS11_2_5likeMacOSX)AppleWebKit/604.5.6(KHTML,likeGecko)Version/11.0Mobile/15D60Safari/604.1" "-"
0.0.145.106 - - [19/Dec/2020:19:47:18 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android10;SM-A107FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.145.106 - - [19/Dec/2020:19:47:18 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android10;SM-A107FBuild/QP1A.190711.020;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.161.6 - - [19/Dec/2020:19:47:26 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36" "-"
0.0.161.6 - - [19/Dec/2020:19:47:28 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/81.0.4044.138Safari/537.36" "-"
0.0.95.20 - - [19/Dec/2020:19:47:36 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_1_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.0.1Mobile/15E148Safari/604.1" "-"
0.0.95.20 - - [19/Dec/2020:19:47:38 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(iPhone;CPUiPhoneOS13_1_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/13.0.1Mobile/15E148Safari/604.1" "-"
0.0.4.35 - - [19/Dec/2020:19:47:39 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.0.0;ANE-LX2)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.4.35 - - [19/Dec/2020:19:47:40 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.0.0;ANE-LX2)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:19:49:05 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.0.0;motoe5)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.95.52 - - [19/Dec/2020:19:49:09 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.0.0;motoe5)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.128.50 - - [19/Dec/2020:19:49:31 +0100] "GET /wp-login.php HTTP/1.1" 404 218 "-" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0" "-"
0.0.227.31 - - [19/Dec/2020:19:50:25 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J610FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:19:50:25 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J610FN)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.31 - - [19/Dec/2020:19:52:09 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android9;SM-J530FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.227.31 - - [19/Dec/2020:19:52:09 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android9;SM-J530FBuild/PPR1.180610.011;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/85.0.4183.81MobileSafari/537.36EdgW/1.0" "-"
0.0.227.55 - - [19/Dec/2020:19:53:28 +0100] "GET /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 9873 "-" "Mozilla/5.0(Linux;Android8.1.0;GS100)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.227.55 - - [19/Dec/2020:19:53:28 +0100] "POST /index.php?option=com_contact&view=contact&id=1 HTTP/1.1" 200 188 "-" "Mozilla/5.0(Linux;Android8.1.0;GS100)AppleWebKit/537.36(KHTML,likeGecko)Chrome/85.0.4183.81MobileSafari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:54 +0100] "GET /administrator/ HTTP/1.1" 200 4263 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/system/css/system.css HTTP/1.1" 200 1131 "http://almhuette-raith.at/administrator/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/css/login.css HTTP/1.1" 200 1952 "http://almhuette-raith.at/administrator/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/css/rounded.css HTTP/1.1" 200 2495 "http://almhuette-raith.at/administrator/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/css/general.css HTTP/1.1" 200 15582 "http://almhuette-raith.at/administrator/templates/khepri/css/login.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/h_green/j_header_right.png HTTP/1.1" 200 366 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/h_green/j_header_middle.png HTTP/1.1" 200 385 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/h_green/j_header_left.png HTTP/1.1" 200 5148 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_corner_br.png HTTP/1.1" 200 314 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_crn_br_light.png HTTP/1.1" 200 253 "http://almhuette-raith.at/administrator/templates/khepri/css/rounded.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_button1_next.png HTTP/1.1" 200 1507 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_bottom.png HTTP/1.1" 200 232 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_corner_bl.png HTTP/1.1" 200 303 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_login_lock.jpg HTTP/1.1" 200 2536 "http://almhuette-raith.at/administrator/templates/khepri/css/login.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_button1_left.png HTTP/1.1" 200 483 "http://almhuette-raith.at/administrator/templates/khepri/css/general.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_crn_bl_light.png HTTP/1.1" 200 246 "http://almhuette-raith.at/administrator/templates/khepri/css/rounded.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_border.png HTTP/1.1" 200 213 "http://almhuette-raith.at/administrator/templates/khepri/css/rounded.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_crn_tr_light.png HTTP/1.1" 200 252 "http://almhuette-raith.at/administrator/templates/khepri/css/rounded.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/images/j_crn_tl_light.png HTTP/1.1" 200 247 "http://almhuette-raith.at/administrator/templates/khepri/css/rounded.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:55 +0100] "GET /administrator/templates/khepri/favicon.ico HTTP/1.1" 200 1150 "http://almhuette-raith.at/administrator/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:58 +0100] "GET / HTTP/1.1" 200 10439 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:53:58 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://almhuette-raith.at/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:04 +0100] "GET /index.php?option=com_content&view=article&id=49&Itemid=55 HTTP/1.1" 200 7896 "http://almhuette-raith.at/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:04 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://almhuette-raith.at/index.php?option=com_content&view=article&id=49&Itemid=55" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:04 +0100] "GET /images/stories/raith/wohnung_1_web.jpg HTTP/1.1" 200 80510 "http://almhuette-raith.at/index.php?option=com_content&view=article&id=49&Itemid=55" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:07 +0100] "GET /index.php?option=com_content&view=article&id=50&Itemid=56 HTTP/1.1" 200 7951 "http://almhuette-raith.at/index.php?option=com_content&view=article&id=49&Itemid=55" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:08 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://almhuette-raith.at/index.php?option=com_content&view=article&id=50&Itemid=56" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:08 +0100] "GET /images/stories/raith/wohnung_2_web.jpg HTTP/1.1" 200 87352 "http://almhuette-raith.at/index.php?option=com_content&view=article&id=50&Itemid=56" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:09 +0100] "GET /index.php?option=com_phocagallery&view=category&id=1&Itemid=53 HTTP/1.1" 200 32539 "http://almhuette-raith.at/index.php?option=com_content&view=article&id=50&Itemid=56" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:09 +0100] "GET /components/com_phocagallery/assets/phocagallery.css HTTP/1.1" 200 15063 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:09 +0100] "GET /media/system/css/modal.css HTTP/1.1" 200 1159 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:09 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:09 +0100] "GET /media/system/js/modal.js HTTP/1.1" 200 10588 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/shadowbox.js HTTP/1.1" 200 27272 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/images/icon-up-images.gif HTTP/1.1" 200 1552 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.css HTTP/1.1" 200 5236 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/lang/shadowbox-en.js HTTP/1.1" 200 2337 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.js HTTP/1.1" 200 3495 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/images/icon-folder-medium.gif HTTP/1.1" 200 2901 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/player/shadowbox-img.js HTTP/1.1" 200 8324 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /templates/_system/css/general.css HTTP/1.1" 404 239 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith.jpg HTTP/1.1" 200 4431 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/images/icon-view.gif HTTP/1.1" 200 605 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_jaegerzaun_gr.jpg HTTP/1.1" 200 5649 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_aussicht.jpg HTTP/1.1" 200 3555 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_garage.jpg HTTP/1.1" 200 5401 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_grillplatz.jpg HTTP/1.1" 200 5537 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_terasse.jpg HTTP/1.1" 200 5126 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_003.jpg HTTP/1.1" 200 4758 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_wohnraum.jpg HTTP/1.1" 200 4726 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_009.jpg HTTP/1.1" 200 4264 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_011.jpg HTTP/1.1" 200 4064 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_zimmer.jpg HTTP/1.1" 200 4320 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_008.jpg HTTP/1.1" 200 3875 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/images/shadow1.gif HTTP/1.1" 200 174 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_006.jpg HTTP/1.1" 200 4265 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_005.jpg HTTP/1.1" 200 5062 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_012.jpg HTTP/1.1" 200 4268 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_007.jpg HTTP/1.1" 200 5095 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_001.jpg HTTP/1.1" 200 4451 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_010.jpg HTTP/1.1" 200 3830 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_002.jpg HTTP/1.1" 200 4084 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /images/phocagallery/almhuette/thumbs/phoca_thumb_m_almhuette_raith_004.jpg HTTP/1.1" 200 5840 "http://almhuette-raith.at/index.php?option=com_phocagallery&view=category&id=1&Itemid=53" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/icons/next.png HTTP/1.1" 200 248 "http://almhuette-raith.at/components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/icons/close.png HTTP/1.1" 200 255 "http://almhuette-raith.at/components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/icons/pause.png HTTP/1.1" 200 155 "http://almhuette-raith.at/components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/icons/play.png HTTP/1.1" 200 211 "http://almhuette-raith.at/components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
0.0.29.211 - - [19/Dec/2020:19:54:10 +0100] "GET /components/com_phocagallery/assets/js/shadowbox/src/skin/classic/icons/previous.png HTTP/1.1" 200 237 "http://almhuette-raith.at/components/com_phocagallery/assets/js/shadowbox/src/skin/classic/skin.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36" "-"
```

## Next steps

- [Complete a similar tutorial by using ARM templates](tutorial-logs-ingestion-api.md)
- [Read more about custom logs](logs-ingestion-api-overview.md)
- [Learn more about writing transformation queries](../essentials//data-collection-transformations.md)

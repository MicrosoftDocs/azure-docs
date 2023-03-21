---
title: 'Tutorial: Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)'
description: Tutorial on how to send custom data to a Log Analytics workspace in Azure Monitor by using the Logs ingestion API. Required configuration performed with Azure Resource Manager templates.
ms.topic: tutorial
ms.date: 02/01/2023
---

# Sample code to send data to Azure Monitor using Logs ingestion API
This article provides sample code using the [Logs ingestion API](logs-ingestion-api-overview.md). Each sample requires the following to be created before the code is run. See [Tutorial: Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)](tutorial-logs-ingestion-api.md) for a complete walkthrough of creating these components configured to support each of these samples.


- Custom table in a Log Analytics workspace
- Data collection endpoint (DCE) to receive data
- Data collection rule (DCR) to direct the data to the target table
- AD application with access to the DCR

## Sample code

## [PowerShell](#tab/powershell)

The following PowerShell code sends data to the endpoint by using HTTP REST fundamentals.

> [!NOTE]
> This sample requires PowerShell v7.0 or later.

1. Run the following PowerShell command, which adds a required assembly for the script.

    ```powershell
    Add-Type -AssemblyName System.Web
    ```

1. Replace the parameters in the **Step 0** section with values from the resources that you created. You might also want to replace the sample data in the **Step 2** section with your own.

    ```powershell
    ### Step 0: Set variables required for the rest of the script.
    
    # information needed to authenticate to AAD and obtain a bearer token
    $tenantId = "00000000-0000-0000-00000000000000000" #Tenant ID the data collection endpoint resides in
    $appId = " 100000000-0000-0000-00000000000000000" #Application ID created and granted permissions
    $appSecret = "0000000000000000000000000000000000000000" #Secret created for the application
    
    # information needed to send data to the DCR endpoint
    $dceEndpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com" #the endpoint property of the Data Collection Endpoint object
    $dcrImmutableId = "dcr-00000000000000000000000000000000" #the immutableId property of the DCR object
    $streamName = "Custom-MyTableRawData" #name of the stream in the DCR that represents the destination table
    
    
    ### Step 1: Obtain a bearer token used later to authenticate against the DCE.
    
    $scope= [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
    $body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
    $headers = @{"Content-Type"="application/x-www-form-urlencoded"};
    $uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"
    
    $bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token
    
    
    ### Step 2: Create some sample data. 
    
    $currentTime = Get-Date ([datetime]::UtcNow) -Format O
    $staticData = @"
    [
    {
        "Time": "$currentTime",
        "Computer": "Computer1",
        "AdditionalContext": {
            "InstanceName": "user1",
            "TimeZone": "Pacific Time",
            "Level": 4,
            "CounterName": "AppMetric1",
            "CounterValue": 15.3    
        }
    },
    {
        "Time": "$currentTime",
        "Computer": "Computer2",
        "AdditionalContext": {
            "InstanceName": "user2",
            "TimeZone": "Central Time",
            "Level": 3,
            "CounterName": "AppMetric1",
            "CounterValue": 23.5     
        }
    }
    ]
    "@;
    
    
    ### Step 3: Send the data to the Log Analytics workspace via the DCE.
    
    $body = $staticData;
    $headers = @{"Authorization"="Bearer $bearerToken";"Content-Type"="application/json"};
    $uri = "$dceEndpoint/dataCollectionRules/$dcrImmutableId/streams/$($streamName)?api-version=2021-11-01-preview"
    
    $uploadResponse = Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers
    ```

    > [!NOTE]
    > If you receive an `Unable to find type [System.Web.HttpUtility].` error, run the last line in section 1 of the script for a fix and execute it. Executing it uncommented as part of the script won't resolve the issue. The command must be executed separately.

1. After you execute this script, you should see an `HTTP - 204` response. In a few minutes, the data arrives to your Log Analytics workspace.

## [Python](#tab/python)

The following script uses the [Azure Monitor Ingestion client library for Python](/python/api/overview/azure/monitor-ingestion-readme).

> [!NOTE]
> This sample requires Python 3.7 or later.


1. Use [pip](https://pypi.org/project/pip/) to install the Azure Monitor Ingestion client library for Python and the Azure Identify library, which is required for the authentication used in this sample.

    ```bash
    pip install azure-monitor-ingestion
    pip install azure-identity
    ```


2. Replace the parameters in the **Step 0** section with values from the resources that you created. You might also want to replace the sample data in the **Step 2** section with your own.


    ```python
    ### Step 0: Set variables and get modules required for the rest of the script.
    
    # information needed to authenticate to AAD and obtain a bearer token
    tenant_id = "00000000-0000-0000-00000000000000000" # tenant ID the data collection endpoint resides in
    client_id = "00000000-0000-0000-00000000000000000" # application ID created and granted permission to the DCR
    secret_value = "0000000000000000000000000000000000000000" # value of the secret created for the application
    
    # information needed to send data to the DCR endpoint
    dce_endpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com" # ingestion endpoint of the Data Collection Endpoint object
    dcr_immutableid = "dcr-00000000000000000000000000000000" # immutableId property of the Data Collection Rule
    stream_name = "Custom-MyTableRawData" #name of the stream in the DCR that represents the destination table
    
    # Import required modules
    import os
    from azure.identity import DefaultAzureCredential
    from azure.monitor.ingestion import LogsIngestionClient
    from azure.core.exceptions import HttpResponseError
    
    ### Step 1: Create credential and client 
    
    # Set environment variables for the application used by DefaultAzureCredential
    os.environ["AZURE_TENANT_ID"] = tenant_id
    os.environ["AZURE_CLIENT_ID"] = client_id
    os.environ["AZURE_CLIENT_SECRET"] = secret_value
    
    credential = DefaultAzureCredential()
    client = LogsIngestionClient(endpoint=dce_endpoint, credential=credential, logging_enable=True)
    
    ### Step 2: Create some sample data. 
    
    body = [
            {
            "Time": "2023-03-12T15:04:48.423211Z",
            "Computer": "Computer3",
                "AdditionalContext": {
                    "InstanceName": "user3",
                    "TimeZone": "Pacific Time",
                    "Level": 4,
                    "CounterName": "AppMetric2",
                    "CounterValue": 35.3    
                }
            },
            {
                "Time": "2023-03-12T15:04:48.794972Z",
                "Computer": "Computer4",
                "AdditionalContext": {
                    "InstanceName": "user4",
                    "TimeZone": "Central Time",
                    "Level": 3,
                    "CounterName": "AppMetric2",
                    "CounterValue": 43.5     
                }
            }
        ]
    

### Step 3: Send the data to the Log Analytics workspace via the DCE.

try:
    client.upload(rule_id=dcr_immutableid, stream_name=stream_name, logs=body)
except HttpResponseError as e:
    print(f"Upload failed: {e}")
```


## [JavaScript](#tab/javascript)


1. Use [npm](https://www.npmjs.com/) to install the Azure Monitor Ingestion client library for JavaScript and the Azure Identify library which is required for the authentication used in this sample.

    ```bash
    npm install --save @azure/monitor-ingestion
    npm install --save @azure/identity
    ```

3. Replace the parameters in the **Step 0** section with values from the resources that you created. You might also want to replace the sample data in the **Step 2** section with your own.

    ```javascript
    const { isAggregateLogsUploadError, DefaultAzureCredential } = require("@azure/identity");
    const { LogsIngestionClient } = require("@azure/monitor-ingestion");
    
    require("dotenv").config();
    
    async function main() {
      const logsIngestionEndpoint = process.env.LOGS_INGESTION_ENDPOINT || "logs_ingestion_endpoint";
      const ruleId = process.env.DATA_COLLECTION_RULE_ID || "data_collection_rule_id";
      const streamName = process.env.STREAM_NAME || "data_stream_name";
      const credential = new DefaultAzureCredential();
      const client = new LogsIngestionClient(logsIngestionEndpoint, credential);
      const logs = [
        {
          Time: "2021-12-08T23:51:14.1104269Z",
          Computer: "Computer1",
          AdditionalContext: "context-2",
        },
        {
          Time: "2021-12-08T23:51:14.1104269Z",
          Computer: "Computer2",
          AdditionalContext: "context",
        },
      ];
      try{
        await client.upload(ruleId, streamName, logs);
      }
      catch(e){
        let aggregateErrors = isAggregateLogsUploadError(e) ? e.errors : [];
        if (aggregateErrors.length > 0) {
          console.log("Some logs have failed to complete ingestion");
          for (const error of aggregateErrors) {
            console.log(`Error - ${JSON.stringify(error.cause)}`);
            console.log(`Log - ${JSON.stringify(error.failedLogs)}`);
          }
        } else {
          console.log(e);
        }
      }
    }
    
    main().catch((err) => {
      console.error("The sample encountered an error:", err);
      process.exit(1);
    });
    ```

1. Use NuGet to install the Azure Monitor Ingestion client library and the Azure Identify library which is required for the authentication used in this sample..
 
    ```bash
    dotnet add package Azure.Identity
    dotnet add package Azure.Monitor.Ingestion
    ```

## [Java](#tab/java)



## [.Net](#tab/net)
The following script uses the [Azure Monitor Ingestion client library for .NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme).

1. Use NuGet to install the Azure Monitor Ingestion client library for .NET.

    ```dotnetcli
    dotnet add package Azure.Monitor.Ingestion
    ```


2. Replace the parameters in the **Step 0** section with values from the resources that you created. You might also want to replace the sample data in the **Step 2** section with your own.

    ```dotnetcli
    // Initialize variables
    var endpoint = new Uri("<data_collection_endpoint_uri>");
    var ruleId = "<data_collection_rule_id>";
    var streamName = "<stream_name>";
    
    // Create credential and client
    var credential = new DefaultAzureCredential();
    LogsIngestionClient client = new(endpoint, credential);
    
    DateTimeOffset currentTime = DateTimeOffset.UtcNow;
    
    // Use BinaryData to serialize instances of an anonymous type into JSON
    BinaryData data = BinaryData.FromObjectAsJson(
        new[] {
            new
            {
                Time = currentTime,
                Computer = "Computer1",
                AdditionalContext = new
                {
                    InstanceName = "user1",
                    TimeZone = "Pacific Time",
                    Level = 4,
                    CounterName = "AppMetric1",
                    CounterValue = 15.3
                }
            },
            new
            {
                Time = currentTime,
                Computer = "Computer2",
                AdditionalContext = new
                {
                    InstanceName = "user2",
                    TimeZone = "Central Time",
                    Level = 3,
                    CounterName = "AppMetric1",
                    CounterValue = 23.5
                }
            },
        });
    
    // Upload logs
    Response response = client.Upload(ruleId, streamName, RequestContent.Create(data));
    ```


---

## Next steps

- [Complete a similar tutorial using the Azure portal](tutorial-logs-ingestion-portal.md)
- [Read more about custom logs](logs-ingestion-api-overview.md)
- [Learn more about writing transformation queries](../essentials//data-collection-transformations.md)


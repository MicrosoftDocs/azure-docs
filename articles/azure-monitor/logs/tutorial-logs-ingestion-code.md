---
title: 'Sample code to send data to Azure Monitor using Logs ingestion API'
description: Sample code using REST API and client libraries for Logs ingestion API in Azure Monitor.
ms.topic: tutorial
ms.date: 09/14/2023
---

# Sample code to send data to Azure Monitor using Logs ingestion API

This article provides sample code using the [Logs ingestion API](logs-ingestion-api-overview.md). Each sample requires the following components to be created before the code is run. See [Tutorial: Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)](tutorial-logs-ingestion-api.md) for a complete walkthrough of creating these components configured to support each of these samples.

- Custom table in a Log Analytics workspace
- Data collection endpoint (DCE) to receive data
- Data collection rule (DCR) to direct the data to the target table
- AD application with access to the DCR

## Sample code

## [.NET](#tab/net)

The following script uses the [Azure Monitor Ingestion client library for .NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme).

1. Install the Azure Monitor Ingestion client library and the Azure Identity library. The Azure Identity library is required for the authentication used in this sample.
 
    ```dotnetcli
    dotnet add package Azure.Identity
    dotnet add package Azure.Monitor.Ingestion
    ```

3. Create the following environment variables with values for your Microsoft Entra ID application. These values are used by `DefaultAzureCredential` in the Azure Identity library.

   - `AZURE_TENANT_ID`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`

2. Replace the variables in the following sample code with values from your DCE and DCR. You may also want to replace the sample data with your own.

    ```csharp
    using Azure;
    using Azure.Core;
    using Azure.Identity;
    using Azure.Monitor.Ingestion;

    // Initialize variables
    var endpoint = new Uri("https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com");
    var ruleId = "dcr-00000000000000000000000000000000";
    var streamName = "Custom-MyTableRawData";
    
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
    try
    {
        Response response = client.Upload(ruleId, streamName, RequestContent.Create(data));
    }
    catch (Exception ex)
    {
        Console.WriteLine("Upload failed with Exception " + ex.Message);
    }
    
    // Logs can also be uploaded in a List
    var entries = new List<Object>();
    for (int i = 0; i < 10; i++)
    {
        entries.Add(
            new {
                Time = recordingNow,
                Computer = "Computer" + i.ToString(),
                AdditionalContext = i
            }
        );
    }
    
    // Make the request
    LogsUploadOptions options = new LogsUploadOptions();
    bool isTriggered = false;
    options.UploadFailed += Options_UploadFailed;
    await client.UploadAsync(TestEnvironment.DCRImmutableId, TestEnvironment.StreamName, entries, options).ConfigureAwait(false);
    
    Task Options_UploadFailed(LogsUploadFailedEventArgs e)
    {
        isTriggered = true;
        Console.WriteLine(e.Exception);
        foreach (var log in e.FailedLogs)
        {
            Console.WriteLine(log);
        }
        return Task.CompletedTask;
    }
    ```

3. Execute the code, and the data should arrive in your Log Analytics workspace within a few minutes.

## [Go](#tab/go)

The following sample code uses the [Azure Monitor Ingestion client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest).

1. Use [go get] to install the Azure Monitor Ingestion and Azure Identity client modules for Go. The Azure Identity module is required for the authentication used in this sample.

    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    ```

1. Create the following environment variables with values for your Microsoft Entra ID application. These values are used by `DefaultAzureCredential` in the Azure Identity module.

   - `AZURE_TENANT_ID`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`

1. Replace the variables in the following sample code with values from your DCE and DCR. You might also want to replace the sample data with your own.

    ```go
    package main
    
    import (
        "context"
        "encoding/json"
        "strconv"
        "time" 
    
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
        "github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest"
    )
    
    // data collection endpoint (DCE)
    const endpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com"
    // data collection rule (DCR) immutable ID
    const ruleID = "dcr-00000000000000000000000000000000"
    // stream name in the DCR that represents the destination table
    const streamName = "Custom-MyTableRawData"                 
    
    type Computer struct {
        Time              time.Time
        Computer          string
        AdditionalContext string
    }
    
    func main() {
        // creating the client using DefaultAzureCredential
        cred, err := azidentity.NewDefaultAzureCredential(nil)
    
        if err != nil {
            //TODO: handle error
        }
    
        client, err := azingest.NewClient(endpoint, cred, nil)
    
        if err != nil {
            //TODO: handle error
        }
    
        // generating logs
        // logs should match the schema defined by the provided stream
        var data []Computer
    
        for i := 0; i < 10; i++ {
            data = append(data, Computer{
                Time:              time.Now().UTC(),
                Computer:          "Computer" + strconv.Itoa(i),
                AdditionalContext: "context",
            })
        }
    
        // marshal data into []byte
        logs, err := json.Marshal(data)
    
        if err != nil {
            panic(err)
        }
    
        // upload logs
        _, err = client.Upload(context.TODO(), ruleID, streamName, logs, nil)
    
        if err != nil {
            //TODO: handle error
        }
    }
    ```

1. Execute the code, and the data should arrive in your Log Analytics workspace within a few minutes.

## [Java](#tab/java)

The following sample code uses the [Azure Monitor Ingestion client library for Java](/java/api/overview/azure/monitor-ingestion-readme).

1. Include the Logs ingestion package and the `azure-identity` package from the [Azure Identity library](https://github.com/Azure/azure-sdk-for-java/tree/azure-monitor-ingestion_1.0.1/sdk/identity/azure-identity). The Azure Identity library is required for the authentication used in this sample.

    > [!NOTE]
    > See the Maven repositories for [Microsoft Azure Client Library For Identity](https://mvnrepository.com/artifact/com.azure/azure-identity) and [Microsoft Azure SDK For Azure Monitor Data Ingestion](https://mvnrepository.com/artifact/com.azure/azure-monitor-ingestion) for the latest versions.

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-monitor-ingestion</artifactId>
        <version>{get-latest-version}</version>    
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>{get-latest-version}</version>
    </dependency>
    ```

1. Create the following environment variables with values for your Microsoft Entra ID application. These values are used by `DefaultAzureCredential` in the Azure Identity library.

   - `AZURE_TENANT_ID`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`

1. Replace the variables in the following sample code with values from your DCE and DCR. You may also want to replace the sample data with your own.

    ```java
    import com.azure.identity.DefaultAzureCredentialBuilder; 
    import com.azure.monitor.ingestion.models.LogsUploadException;

    import java.time.OffsetDateTime; 
    import java.util.Arrays; 
    import java.util.List; 

    public class LogsUploadSample {
        public static void main(String[] args) { 
            
            LogsIngestionClient client = new LogsIngestionClientBuilder()
                .endpoint("https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com") 
                .credential(new DefaultAzureCredentialBuilder().build()) 
                .buildClient(); 
                
            List<Object> dataList = Arrays.asList( 
                new Object() { 
                    OffsetDateTime time = OffsetDateTime.now(); 
                    String computer = "Computer1"; 
                    Object additionalContext = new Object() { 
                        String instanceName = "user4"; 
                        String timeZone = "Pacific Time"; 
                        int level = 4; 
                        String counterName = "AppMetric1"; 
                        double counterValue = 15.3; 
                    }; 
                }, 
                new Object() { 
                    OffsetDateTime time = OffsetDateTime.now(); 
                    String computer = "Computer2"; 
                    Object additionalContext = new Object() { 
                        String instanceName = "user2"; 
                        String timeZone = "Central Time"; 
                        int level = 3; 
                        String counterName = "AppMetric2"; 
                        double counterValue = 43.5; 
                    }; 
                }); 
                
            try { 
                client.upload("dcr-00000000000000000000000000000000", "Custom-MyTableRawData", dataList);  
                System.out.println("Logs uploaded successfully"); 
            } catch (LogsUploadException exception) { 
                System.out.println("Failed to upload logs "); 
                exception.getLogsUploadErrors() 
                    .forEach(httpError -> System.out.println(httpError.getMessage())); 
            } 
        }
    }
    ```

1. Execute the code, and the data should arrive in your Log Analytics workspace within a few minutes.

## [JavaScript](#tab/javascript)

The following sample code uses the [Azure Monitor Ingestion client library for JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme).

1. Use [npm](https://www.npmjs.com/) to install the Azure Monitor Ingestion and Azure Identity client libraries for JavaScript. The Azure Identity library is required for the authentication used in this sample.

    ```bash
    npm install --save @azure/monitor-ingestion
    npm install --save @azure/identity
    ```

1. Create the following environment variables with values for your Microsoft Entra ID application. These values are used by `DefaultAzureCredential` in the Azure Identity library.

   - `AZURE_TENANT_ID`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`

1. Replace the variables in the following sample code with values from your DCE and DCR. You might also want to replace the sample data with your own.

    ```javascript
    const { DefaultAzureCredential } = require("@azure/identity");
    const { LogsIngestionClient, isAggregateLogsUploadError } = require("@azure/monitor-ingestion");
    
    require("dotenv").config();
    
    async function main() {
      const logsIngestionEndpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com";
      const ruleId = "dcr-00000000000000000000000000000000";
      const streamName = "Custom-MyTableRawData";
      const credential = new DefaultAzureCredential();
      const client = new LogsIngestionClient(logsIngestionEndpoint, credential);
      const logs = [
        {
          Time: "2021-12-08T23:51:14.1104269Z",
          Computer: "Computer1",
          AdditionalContext: {
              "InstanceName": "user1",
              "TimeZone": "Pacific Time",
              "Level": 4,
              "CounterName": "AppMetric2",
              "CounterValue": 35.3    
          }
        },
        {
          Time: "2021-12-08T23:51:14.1104269Z",
          Computer: "Computer2",
          AdditionalContext: {
              "InstanceName": "user2",
              "TimeZone": "Pacific Time",
              "Level": 4,
              "CounterName": "AppMetric2",
              "CounterValue": 43.5    
          }
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

1. Execute the code, and the data should arrive in your Log Analytics workspace within a few minutes.

## [PowerShell](#tab/powershell)

The following PowerShell code sends data to the endpoint by using HTTP REST fundamentals.

> [!NOTE]
> This sample requires PowerShell v7.0 or later.

1. Run the following sample PowerShell command, which adds a required assembly for the script.

    ```powershell
    Add-Type -AssemblyName System.Web
    ```

1. Replace the parameters in the **Step 0** section with values from your application, DCE, and DCR. You might also want to replace the sample data in the **Step 2** section with your own.

    ```powershell
    ### Step 0: Set variables required for the rest of the script.
    
    # information needed to authenticate to AAD and obtain a bearer token
    $tenantId = "00000000-0000-0000-00000000000000000" #Tenant ID the data collection endpoint resides in
    $appId = " 000000000-0000-0000-00000000000000000" #Application ID created and granted permissions
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

1. Execute the script, and you should see an `HTTP - 204` response. The data should arrive in your Log Analytics workspace within a few minutes.

## [Python](#tab/python)

The following sample code uses the [Azure Monitor Ingestion client library for Python](/python/api/overview/azure/monitor-ingestion-readme).

1. Use [pip](https://pypi.org/project/pip/) to install the Azure Monitor Ingestion and Azure Identity client libraries for Python. The Azure Identity library is required for the authentication used in this sample.

    ```bash
    pip install azure-monitor-ingestion
    pip install azure-identity
    ```

1. Create the following environment variables with values for your Microsoft Entra ID application. These values are used by `DefaultAzureCredential` in the Azure Identity library.

   - `AZURE_TENANT_ID`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`

1. Replace the variables in the following sample code with values from your DCE and DCR. You might also want to replace the sample data in the **Step 2** section with your own.

    ```python
    # information needed to send data to the DCR endpoint
    dce_endpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com" # ingestion endpoint of the Data Collection Endpoint object
    dcr_immutableid = "dcr-00000000000000000000000000000000" # immutableId property of the Data Collection Rule
    stream_name = "Custom-MyTableRawData" #name of the stream in the DCR that represents the destination table
    
    # Import required modules
    import os
    from azure.identity import DefaultAzureCredential
    from azure.monitor.ingestion import LogsIngestionClient
    from azure.core.exceptions import HttpResponseError
    
    credential = DefaultAzureCredential()
    client = LogsIngestionClient(endpoint=dce_endpoint, credential=credential, logging_enable=True)
    
    body = [
            {
            "Time": "2023-03-12T15:04:48.423211Z",
            "Computer": "Computer1",
                "AdditionalContext": {
                    "InstanceName": "user1",
                    "TimeZone": "Pacific Time",
                    "Level": 4,
                    "CounterName": "AppMetric2",
                    "CounterValue": 35.3    
                }
            },
            {
                "Time": "2023-03-12T15:04:48.794972Z",
                "Computer": "Computer2",
                "AdditionalContext": {
                    "InstanceName": "user2",
                    "TimeZone": "Central Time",
                    "Level": 3,
                    "CounterName": "AppMetric2",
                    "CounterValue": 43.5     
                }
            }
        ]
    
    try:
        client.upload(rule_id=dcr_immutableid, stream_name=stream_name, logs=body)
    except HttpResponseError as e:
        print(f"Upload failed: {e}")
    ```

1. Execute the code, and the data should arrive in your Log Analytics workspace within a few minutes.

---

## Troubleshooting
This section describes different error conditions you might receive and how to correct them.

### Script returns error code 403
Ensure that you have the correct permissions for your application to the DCR. You might also need to wait up to 30 minutes for permissions to propagate.

### Script returns error code 413 or warning of TimeoutExpired with the message ReadyBody_ClientConnectionAbort in the response
The message is too large. The maximum message size is currently 1 MB per call.

### Script returns error code 429
API limits have been exceeded. The limits are currently set to 500 MB of data per minute for both compressed and uncompressed data and 300,000 requests per minute. Retry after the duration listed in the `Retry-After` header in the response.

### Script returns error code 503
Ensure that you have the correct permissions for your application to the DCR. You might also need to wait up to 30 minutes for permissions to propagate.

### You don't receive an error, but data doesn't appear in the workspace
The data might take some time to be ingested, especially the first time data is being sent to a particular table. It shouldn't take longer than 15 minutes.

### IntelliSense in Log Analytics doesn't recognize the new table
The cache that drives IntelliSense might take up to 24 hours to update.

## Next steps

- [Learn more about data collection rules](../essentials/data-collection-rule-overview.md)
- [Learn more about writing transformation queries](../essentials//data-collection-transformations.md)


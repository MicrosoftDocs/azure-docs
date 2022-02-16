---
title: Send custom logs to Azure Monitor Logs with REST API
description: Sending log data to Azure Monitor using custom logs API.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/06/2022

---

# Send custom logs to Azure Monitor Logs with REST API
With the DCR based custom logs API in Azure Monitor, you can send data to a Log Analytics workspace from any REST API client. This allows you to send data from virtually any source to either custom tables that you create or to extend built-in tables.

> [!NOTE]
> Custom logs API replaces the [data collector API](data-collector-api.md).


## Basic operation
Your application sends data to a [data collection endpoint](../essentials/data-collection-endpoint-overview.md) which is a unique connection point for your subscription. The payload of your API call includes the source data formatted in JSON. The call specifies a [data collection rule](../essentials/data-collection-rule-overview.md) that understands the format of the source data, potentially filters it and transforms it for the target table, and then sends it to a specific table in a specific workspace. You can modify the target table and workspace by modifying the data collection rule without any change to the REST API call or source data.

:::image type="content" source="media/direct-ingestion/direct-ingestion-overview.png" alt-text="Overview diagram for direct ingestion" lightbox="media/direct-ingestion/direct-ingestion-overview.png":::

## Authentication
Authentication for direct log ingestion is performed at the data collection endpoint which uses standard Azure Resource Manager authentication. A common strategy is to use an Application ID and Application Key as described in [Tutorial: Add ingestion-time transformation to Azure Monitor Logs (preview)](tutorial-custom-logs.md).

## Tables
Custom logs can send data to any custom table taat you create and to certain built-in tables in your Log Analytics workspace. The target table must exist before you can send data to it. If the table doesn't already exist, you can create it and edit its columns in the Azure portal from **Tables (preview)** in the **Log Analytics workspaces menu**. You can also a REST API call to send the configuration of the table.

## Source data
The source data is formatted in JSON and must match the structure expected by the data collection rule. It doesn't necessarily need to match the structure of the target table since the DCR can include a transformation to convert the data to match the table's structure.

## Data collection rule
[Data collection rules](../essentials/data-collection-rule-overview.md) define data collected by Azure Monitor and specify how and where that data should be sent or stored. The REST API call must specify a DCR to use. A single DCE can support multiple DCRs, so you can specify a different DCR for different sources and target tables.

The DCR must understand the structure of the input data and the structure of the target table. If the two don't match, it can use a transform to convert the source data to match the target table. You may also use the transform to filter source data and perform any other calculations or conversions.

## Send data to the data collection endpoint
Ingestion is a straightforward POST call to the Data Collection Endpoint via HTTP. Details are as follows:

#### Endpoint URI
The endpoint URI follows the shape below, where both the `Data Collection Endpoint` and `DCR Immutable ID` are ones we noted earlier:
```
{Data Collection Endpoint URI}/dataCollectionRules/{DCR Immutable ID}/streams/{Stream Name}?api-version=2021-11-01-preview
```

#### Headers
Two headers are required at a minimum:  
```
Authorization:  Bearer {Bearer token obtained through the Client Credentials Flow} 
Content-Type:   application/json
```

Optionally, for performance optimization, the GZip compression scheme is supported. To use it, you can specify a `Content-Encoding: gzip` header after GZip-encoding your body. Also optionally, but very useful, you can include a `x-ms-client-request-id` header set to a string-formatted GUID; this request ID can then be looked up by Microsoft for any troubleshooting purposes.  

#### Body
 The custom data be sent will be in the body of a POST call to the Data Collection we noted earlier. The shape of the data that we send will be a JSON array with the following three fields - the ones matching the _columns_ section in the DCR we provisioned:  

| Field name | Type |
| --- | --- |
| Time | DateTime |
| Computer | String |
| AdditionalContext | String |  

#### Sample code
The following PowerShell code demonstrates how to send data to the endpoint using HTTP REST fundamentals. Simply replace the parameters in the "step 0" section with those you noted earlier, and if desired, replacing the sample data in the "step 2" section with your own.  

```powershell
##################
### Step 0: set parameters required for the rest of the script
##################
#information needed to authenticate to AAD and obtain a bearer token
$tenantId = "19caa212-0847-..."; #the tenant ID in which the Data Collection Endpoint resides
$appId = "b7f0e67a-..."; #the app ID created and granted permissions
$appSecret = "74dJ..."; #the secret created for the above app

#information needed to send data to the DCR endpoint
$dcrImmutableId = "dcr-10f6..."; #the immutableId property of the DCR object
$dceEndpoint = "https://[...].westus2-1.ingest.monitor.azure.com"; #the endpoint property of the Data Collection Endpoint object

##################
### Step 1: obtain a bearer token that we'll later use to authenticate against the DCR endpoint
##################
$scope= [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
$body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
$headers = @{"Content-Type"="application/x-www-form-urlencoded"};
$uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"

$bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token
### If the above line throws an 'Unable to find type [System.Web.HttpUtility].' error, execute the line below separately from the rest of the code
# Add-Type -AssemblyName System.Web

##################
### Step 2: load up some data... in this case, generate some static data to send
##################
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

##################
### Step 3: send the data to Log Analytics via the DCR!
##################
$body = $staticData;
$headers = @{"Authorization"="Bearer $bearerToken";"Content-Type"="application/json"};
$uri = "$dceEndpoint/dataCollectionRules/$dcrImmutableId/streams/Custom-MyTableRawData?api-version=2021-11-01-preview"

$uploadResponse = Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers -TransferEncoding "GZip"
```

If you receive an `Unable to find type [System.Web.HttpUtility].` error, run the last line in section 1 of the script for a fix and execute it directly. Executing it uncommented as part of the script will not resolve the issue - the command must be executed separately.   

After executing this script, you should see a `HTTP - 200 OK` response, and in just a few minutes, the data arrive to your Log Analytics workspace.


## Limits and restrictions
The system has several rate limits and protections in place. They are as follows:

### API limits

* 1GB of data/minute per DCR, for both compressed and uncompressed data. Please retry after the duration listed in the `Retry-After` header in the response.  
* 1MB maximum per API call, for both compressed and uncompressed data.
* 6,000 requests/minute per DCR. Please retry after the duration listed in the `Retry-After` header in the response. 
* TLS1.2  

### DCR and transformation definition limits

* 100 maximum stream declarations in a single DCR.  
* Stream names in the `StreamDeclarations` section of the DCR for data sent through the API must have a `Custom-` prefix.  
* Only the following built-in tables support ingesting custom data into them: `CommonSecurityLog`, `SecurityEvents`, `Syslog`, `WindowsEvents`.  
* Built-in tables can only be routed to themselves post-transformation (eg, data originally for Table A after a transformation can only flow back into Table A).  
* The `columns` section supports the following data types: `string`, `int`, `long`, `real`, `boolean`, `datetime`.  
* The transformations can only use a [subset](../essentials/data-collection-rule-transformations.md#supported-kql-features) of KQL.  
* Only one transformation is allowed per stream.  
* Only one destination is allowed per stream, _except_ data originating through the [Azure Monitoring agent (AMA)](../agents/azure-monitor-agent-overview.md). Data collected by AMA can have multiple destinations for the multi-homing scenario.  

### Table limits

* Custom tables must have the `_CL` suffix.
* 500 maximum columns per custom table.
* Column names can consist of alphanumeric characters as well as the characters `_` and `-`. They must start with a letter.  
* Column names can be at most 45 characters long.  
* Columns extended on top of built-in tables must have the suffix `_CF`. Columns in a custom table do not need this suffix.  

## Next steps

- [Walk through a tutorial sending custom logs using the Azure portal.](tutorial-custom-logs.md)
- [Walk through a tutorial sending custom logs using resource manager templates and REST API.](tutorial-custom-logs-api.md)
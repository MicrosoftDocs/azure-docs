---
title: Use REST APIs to do CI/CD for Azure Stream Analytics on IoT Edge
description: Learn how to implement a continuous integration and deployment pipeline for Azure Stream Analytics using REST APIs.
author: su-jie
ms.author: sujie
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 06/24/2022
---

# Implement CI/CD for Stream Analytics on IoT Edge using APIs

You can enable continuous integration and deployment for Azure Stream Analytics jobs using REST APIs. This article provides examples on which APIs to use and how to use them. REST APIs aren't supported on Azure Cloud Shell.

## Call APIs from different environments

REST APIs can be called from both Linux and Windows. The following commands demonstrate proper syntax for the API call. Specific API usage will be outlined in later sections of this article.

### Linux

For Linux, you can use `Curl` or `Wget` commands:

```bash
curl -u { <username:password> }  -H "Content-Type: application/json" -X { <method> } -d "{ <request body> }" { <url> }   
```

```bash
wget -q -O- --{ <method> } -data="<request body>" --header=Content-Type:application/json --auth-no-challenge --http-user="<Admin>" --http-password="<password>" <url>
```

### Windows

For Windows, use PowerShell:

```powershell
$user = "<username>" 
$pass = "<password>" 
$encodedCreds = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $user,$pass))) 
$basicAuthValue = "Basic $encodedCreds" 
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$headers.Add("Content-Type", 'application/json') 
$headers.Add("Authorization", $basicAuthValue) 
$content = "<request body>" 
$response = Invoke-RestMethod <url> -Method <method> -Body $content -Headers $Headers 
echo $response 
```

## Create an ASA job on IoT Edge

To create Stream Analytics job, call the PUT method using the Stream Analytics API.

|Method|Request URL|
|------|-----------|
|PUT|`https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/Microsoft.StreamAnalytics/streamingjobs/{job-name}?api-version=2017-04-01-preview`|

Example of command using **curl**:

```curl
curl -u { <username:password> } -H "Content-Type: application/json" -X { <method> } -d "{ <request body> }" https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/Microsoft.StreamAnalytics/streamingjobs/{jobname}?api-version=2017-04-01-preview  
```

Example of request body in JSON:

```json
{ 
  "location": "West US", 
  "tags": { "key": "value", "ms-suppressjobstatusmetrics": "true" }, 
  "sku": {  
      "name": "Standard" 
    }, 
  "properties": { 
    "sku": {  
      "name": "standard" 
    }, 
       "eventsLateArrivalMaxDelayInSeconds": 1, 
       "jobType": "edge", 
    "inputs": [ 
      { 
        "name": "{inputname}", 
        "properties": { 
         "type": "stream", 
          "serialization": { 
            "type": "JSON", 
            "properties": { 
              "fieldDelimiter": ",", 
              "encoding": "UTF8" 
            } 
          }, 
          "datasource": { 
            "type": "GatewayMessageBus", 
            "properties": { 
            } 
          } 
        } 
      } 
    ], 
    "transformation": { 
      "name": "{queryName}", 
      "properties": { 
        "query": "{query}" 
      } 
    }, 
    "package": { 
      "storageAccount" : { 
        "accountName": "{blobstorageaccountname}", 
        "accountKey": "{blobstorageaccountkey}" 
      }, 
      "container": "{blobcontaine}]" 
    }, 
    "outputs": [ 
      { 
        "name": "{outputname}", 
        "properties": { 
          "serialization": { 
            "type": "JSON", 
            "properties": { 
              "fieldDelimiter": ",", 
              "encoding": "UTF8" 
            } 
          }, 
          "datasource": { 
            "type": "GatewayMessageBus", 
            "properties": { 
            } 
          } 
        } 
      } 
    ] 
  } 
} 
```

For more information, see the [API documentation](/rest/api/streamanalytics/).  

## Publish IoT Edge package

To publish a Stream Analytics job on IoT Edge, call the POST method using the IoT Edge Package Publish API.

|Method|Request URL|
|------|-----------|
|POST|`https://management.azure.com/subscriptions/{subscriptionid}/resourceGroups/{resourcegroupname}/providers/Microsoft.StreamAnalytics/streamingjobs/{jobname}/publishedgepackage?api-version=2017-04-01-preview`|

The previous call to the IoT Edge Package Publish API triggers an asynchronous operation and returns a status of 202. The **location** response header contains the URI used to get the status of that asynchronous operation. A call to the URI in the **location** header returns a status of 202 to indicate the asynchronous operation is still in progress. When the operation is completed, the call to the URI in the **location** header returns a status of 200.

Example of an IoT Edge package publish call using **curl**:

```bash
curl -d -X POST https://management.azure.com/subscriptions/{subscriptionid}/resourceGroups/{resourcegroupname}/providers/Microsoft.StreamAnalytics/streamingjobs/{jobname}/publishedgepackage?api-version=2017-04-01-preview
```

After making the POST call, you should expect a response with an empty body. Look for the URI in the **location** header of the response, and record it for further use.

Example of the URI from the **location** header of response:

```rest
https://management.azure.com/subscriptions/{subscriptionid}/resourcegroups/{resourcegroupname}/providers/Microsoft.StreamAnalytics/StreamingJobs/{resourcename}/OperationResults/{guidAssignedToTheAsynchronousOperation}?api-version=2017-04-01-preview
```

Wait from a few seconds to a couple of minutes before making a call to the API whose URI you found in the **location** header of the response to the IoT Edge Package Publish API, and repeat the cycle of waiting and retrying until you get a 200 response.

Example of making API call with returned URL with **curl**:

```bash
curl -d –X GET https://management.azure.com/subscriptions/{subscriptionid}/resourcegroups/{resourcegroupname}/providers/Microsoft.StreamAnalytics/StreamingJobs/{resourcename}/OperationResults/{guidAssignedToTheAsynchronousOperation}?api-version=2017-04-01-preview
```

The response includes the information you need to add to the IoT Edge deployment script. The examples below show what information you need to collect and where to add it in the deployment manifest.

Sample response body after publishing successfully:

```json
{ 
  edgePackageUrl : null 
  error : null 
  manifest : "{"supportedPlatforms":[{"os":"linux","arch":"amd64","features":[]},{"os":"linux","arch":"arm","features":[]},{"os":"windows","arch":"amd64","features":[]}],"schemaVersion":"2","name":"{jobname}","version":"1.0.0.0","type":"docker","settings":{"image":"{imageurl}","createOptions":null},"endpoints":{"inputs":["\],"outputs":["{outputnames}"]},"twin":{"contentType":"assignments","content":{"properties.desired":{"ASAJobInfo":"{asajobsasurl}","ASAJobResourceId":"{asajobresourceid}","ASAJobEtag":"{etag}","PublishTimeStamp":"{publishtimestamp}"}}}}" 
  status : "Succeeded" 
} 
```

Sample of Deployment Manifest:

```json
{ 
  "modulesContent": { 
    "$edgeAgent": { 
      "properties.desired": { 
        "schemaVersion": "1.0", 
        "runtime": { 
          "type": "docker", 
          "settings": { 
            "minDockerVersion": "v1.25", 
            "loggingOptions": "", 
            "registryCredentials": {} 
          } 
        }, 
        "systemModules": { 
          "edgeAgent": { 
            "type": "docker", 
            "settings": { 
              "image": "mcr.microsoft.com/azureiotedge-agent:1.0", 
              "createOptions": "{}" 
            } 
          }, 
          "edgeHub": { 
            "type": "docker", 
            "status": "running", 
            "restartPolicy": "always", 
            "settings": { 
              "image": "mcr.microsoft.com/azureiotedge-hub:1.0", 
              "createOptions": "{}" 
            } 
          } 
        }, 
        "modules": { 
          "<asajobname>": { 
            "version": "1.0", 
            "type": "docker", 
            "status": "running", 
            "restartPolicy": "always", 
            "settings": { 
              "image": "<settings.image>", 
              "createOptions": "<settings.createOptions>" 
            } 
            "version": "<version>", 
             "env": { 
              "PlanId": { 
               "value": "stream-analytics-on-iot-edge" 
          } 
        } 
      } 
    }, 
    "$edgeHub": { 
      "properties.desired": { 
        "schemaVersion": "1.0", 
        "routes": { 
            "route": "FROM /* INTO $upstream" 
        }, 
        "storeAndForwardConfiguration": { 
          "timeToLiveSecs": 7200 
        } 
      } 
    }, 
    "<asajobname>": { 
      "properties.desired": {<twin.content.properties.desired>} 
    } 
  } 
} 
```

After you configure the deployment manifest, refer to [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md) for deployment.

## Next steps

* [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md)
* [ASA on IoT Edge tutorial](../iot-edge/tutorial-deploy-stream-analytics.md)
* [Develop Stream Analytics IoT Edge jobs using Visual Studio tools](stream-analytics-tools-for-visual-studio-edge-jobs.md)

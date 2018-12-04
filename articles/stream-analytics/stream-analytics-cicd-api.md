---
title: Implement CI/CD for Stream Analytics using APIs
description: Learn how to implement a continuous integration and deployment pipeline for Azure Stream Analytics using API.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 12/04/2018
---

# Implement CI/CD for Stream Analytics using APIs

You can implement continuous integration and deployment for Azure Stream Analytics jobs. This article provides examples on which APIs to use and how to use them. The use of REST API is not supported on Azure Cloud Shell.

## Call APIs from different environments

REST APIs can be called from both Linux and Windows. The following commands demonstrate proper syntax for the call. For specific API usage, refer to desired section of this article.
 
For Linux, you can use `Curl` or `Wget` commands:
 
### Curl

```bash
curl -u <Admin:password> -H "Content-Type: application/json" -X <PUT> -d "<request body>” <url>   
```

### Wget:

```bash
wget -q -O- --<put>-data="<request body>”--header=Content-Type:application/json --auth-no-challenge --http-user="<Admin>" --http-password="<password>" <url>
```
 
For Windows, use Powershell: 

```powershell 
$user = '<Admin>' 
$pass = '<password>' 
$encodedCreds = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $user,$pass))) 
$basicAuthValue = "Basic $encodedCreds" 
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]" 
$headers.Add("Content-Type", 'application/json') 
$headers.Add("Authorization", $basicAuthValue) 
$content = "<request body>" 
$response = Invoke-RestMethod <url>-Method <Put> -Body $content -Headers $Headers 
echo $response 
```
 
## Create an ASA job on Edge 
 
To create Stream Analytics job, call the PUT method from the Stream Analytics API.

|Method|Request URL|
|PUT|https://management.azure.com/subscriptions/{**subscription-id**}/resourcegroups/{**resource-group-name**}/providers/Microsoft.StreamAnalytics/streamingjobs/{**job-name**}?api-version=2017-04-01-preview|
 
Example of command using **curl**:

```bash
Curl -u admin:password -H "Content-Type: application/json" -X PUT -d “<Request body>” https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/Microsoft.StreamAnalytics/streamingjobs/{jobname}?api-version=2017-04-01-preview 
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
 
For more details, see the [API documentation](rest/api/streamanalytics/stream-analytics-job).  
 
## Publish Edge Package 
 
To publish a Stream Analytics job on IoT Edge package, call the POST method using the Edge Package Publish API: 
 
|Method|Request URL|
|POST|https://management.azure.com/subscriptions/{**subscriptionid**}/resourceGroups/{**resourcegroupname**}/providers/Microsoft.StreamAnalytics/streamingjobs/{**jobname**}/publishedgepackage?api-version=2017-04-01-preview|

This is an asynchronous operation that returns a status of 202 until the job has been successfully published. The location response header contains the URI used to obtain the status of the process. While the process is running, a call to the URI in the location header returns a status of 202. When the process finishes, the URI in the location header returns a status of 200. 

Example of package publish call using **curl**: 

```bash
curl -d -X POST https://management.azure.com/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupname>/providers/Microsoft.StreamAnalytics/streamingjobs/<resourcename>/publishedgepackage?api-version=2017-04-01-preview 
```
 
After making the POST call, you should expect a response with an empty body. Look for the URL located in the HEAD of the response for further use.
 
Example of the URL from the HEAD of response:

https://management.azure.com/subscriptions/<**subscriptionid**>/resourcegroups/<**resourcegroupname**>/providers/Microsoft.StreamAnalytics/StreamingJobs/<**resourcename**>/OperationResults/023a4d68-ffaf-4e16-8414-cb6f2e14fe23?api-version=2017-04-01-preview 
 
Wait for one to two minutes before making the API call with the URL you found in the HEAD of the response. Run the following command. Retry the command if you do not get a 200 response.
 
Example of making API call with returned URL with **curl**:

```bash
Curl -d –X GET  https://management.azure.com/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupname>/providers/Microsoft.StreamAnalytics/streamingjobs/<resourcename>/publishedgepackage?api-version=2017-04-01-preview 
```

The response includes the information you need to add to the Edge deployment script. The examples provided below show what information you need to collect and where to add it in the deployment manifest.
 
Sample response body after publishing successfully:

```json
{ 
  edgePackageUrl : null 
  error : null 
  manifest : "{"supportedPlatforms":[{"os":"linux","arch":"amd64","features":[]},{"os":"linux","arch":"arm","features":[]},{"os":"windows","arch":"amd64","features":[]}],"schemaVersion":"2","name":"{jobname}","version":"1.0.0.0","type":"docker","settings":{"image":"{imageurl}","createOptions":null},"endpoints":{"inputs":["],"outputs":["{outputnames}"]},"twin":{"contentType":"assignments","content":{"properties.desired":{"ASAJobInfo":"{asajobsasurl}","ASAJobResourceId":"{asajobresourceid}","ASAJobEtag":"{etag}",”PublishTimeStamp”:”{publishtimestamp}”}}}}" 
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

After the configuration of the deployment manifest, refer to [Deploy Azure IoT Edge modules with Azure CLI](./iot-edge/how-to-deploy-modules-cli) for deployment.


## Next steps 
 
 
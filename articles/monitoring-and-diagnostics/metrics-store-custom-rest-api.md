---
title: Send custom metrics for an Azure resource to the Azure Monitor metric store using a REST API
description: Send custom metrics for an Azure resource to the Azure Monitor metric store using a REST API
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: howto
ms.date: 09/24/2018
ms.author: ancav
ms.component: metrics
---
# Send custom metrics for an Azure resource to the Azure Monitor metric store using a REST API

This article shows you how to send custom metrics for Azure resources to the Azure Monitor metrics store via a REST API.  Once the metrics are in Azure Monitor, you can do all the things with them you do with standard metrics, such as charting, alerting, routing them to other external tools, etc.  

>[!NOTE] 
>The REST API only permits sending custom metrics for Azure resources. To send metrics for resources in different environments or on-premises, you can use [Application Insights](../application-insights/app-insights-api-custom-events-metrics.md).    


## Create and authorize a service principal to emit metrics 

Create a service principle in your Azure Active Directory tenant using the instructions found at [Create a service principal](../azure-resource-manager/resource-group-create-service-principal-portal.md). 

Note the following while going through this process: 

- You can put in any URL for the sign-on URL.  
- Create new client secret for this app  
- Save the Key and the client ID for use in later steps.  

Give the app created as part of step 1 “Monitoring Metrics Publisher” permissions to the resource you wish to emit metrics against. If you plan to use the app to emit custom metrics against many resources, you can grant these permissions at the resource group or subscription level. 

## Get an authorization token
Open a Command Prompt and run the following command
```shell
curl -X POST https://login.microsoftonline.com/<yourtenantid>/oauth2/token -F "grant_type=client_credentials" -F "client_id=<insert clientId from earlier step> " -F "client_secret=<insert client secret from earlier step>" -F "resource=https://monitoring.azure.com/"
```
Save the access token from the response

![Access Token](./media/metrics-store-custom-rest-api/accesstoken.png)

## Emit the metric via the REST API 

1. Paste the following JSON into a file, and save it as custommetric.json on your local computer. Update the time parameter in the JSON file. 
    
    ```json
    { 
        "time": "2018-09-13T16:34:20”, 
        "data": { 
            "baseData": { 
                "metric": "QueueDepth", 
                "namespace": "QueueProcessing", 
                "dimNames": [ 
                  "QueueName", 
                  "MessageType" 
                ], 
                "series": [ 
                  { 
                    "dimValues": [ 
                      "ImagesToProcess", 
                      "JPEG" 
                    ], 
                    "min": 3, 
                    "max": 20, 
                    "sum": 28, 
                    "count": 3 
                  } 
                ] 
            } 
        } 
    } 
    ``` 

1. In your command prompt window, post the metric data 
    - Azure Region – Must match the deployment region of the resource you are emitting metrics for. 
    - ResourceID –  Resource ID of the Azure resource you are tracking the metric against.  
    - Access Token – Paste the token acquired earlier

    ```Shell 
    curl -X POST curl -X POST https://<azureRegion>.monitoring.azure.com/<resourceId> /metrics -H "Content-Type: application/json" -H "Authorization: Bearer <AccessToken>" -d @custommetric.json 
    ```
1. Change the timestamp and values in the JSON file. 
1. Repeat previous two steps a few times so you have data for multiple minutes.

## Troubleshooting 
If you receive an error with some part of the process, considering the following

1. You cannot issue metrics against a subscription or resource group as your Azure resource. 
1. You can't put a metric into the store that is over 20 minutes old. The metric store is optimized for alerting and real-time charting. 
2. The number of dimension names should match the values and vice-versa. Check the values. 
2. You may be emitting metrics against region that doesn’t support custom metrics. See [supported custom metric (preview) regions](metrics-custom-overview.md#supported-regions) 



## View your metrics 

1. Log in to the Azure portal 

1. In the left-hand menu, click **Monitor** 

1. On the Monitor page, click **Metrics**. 

   ![Access Token](./media/metrics-store-custom-rest-api/metrics.png) 

1. Change the aggregation period to **Last 30 minutes**.  

1. In the *resource* drop-down, select the resource you emitted the metric against.  

1. In the *namespaces* drop-down, select **QueueProcessing** 

1. In the *metrics* drop down, select **QueueDepth**.  

 
## Next steps
- Learn more about [custom metrics](metrics-custom-overview.md).
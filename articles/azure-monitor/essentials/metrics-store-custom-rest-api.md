---
title: Send metrics to the Azure Monitor metric database using REST API
description: Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API
author: EdB-MSFT
services: azure-monitor
ms.reviewer: priyamishra
ms.topic: conceptual
ms.date: 01/04/2023
ms.author: edbaynash
---
# Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API

This article shows you how to send custom metrics for Azure resources to the Azure Monitor metrics store via a REST API. When the metrics are in Azure Monitor, you can do all the things with them that you do with standard metrics. For example, charting, alerting, and routing them to other external tools.  

>[!NOTE]  
>The REST API only permits sending custom metrics for Azure resources.  
To send metrics for resources in other environments or on-premises, use [Application Insights](../app/api-custom-events-metrics.md).  

## Create and authorize a service principal to emit metrics  

A service principal is an application whose tokens can be used to authenticate and grant access to specific Azure resources using Azure Active Directory. This includes user-apps, services or automation tools.

1. [Register an application with Azure Active Directory](../logs/api/register-app-for-token.md) to create a service principal.

1. Save the tenant ID, new client ID, and client secret value for your app to use when requesting a token.

1. Give the app created as part of the previous step **Monitoring Metrics Publisher** permissions to the resource you wish to emit metrics against. If you plan to use the app to emit custom metrics against many resources, you can grant these permissions at the resource group or subscription level.  
 
    On your resource's overview page, select **Access Control (IAM)**
1. Select **Add**, then **Add role assignment** from the dropdown.
    :::image type="content" source="./media/metrics-store-custom-rest-api/access-contol-add-role-assignment.png" alt-text="A screenshot showing the Access control(IAM) page for a virtual machine.":::
1. Search for *Monitoring Metrics* in the search field.
1. Select **Monitoring Metrics Publisher** from the list.
1. Select **Members**.
    :::image type="content" source="./media/metrics-store-custom-rest-api/add-role-assignment.png" alt-text="A screenshot showing the add role assignment page.":::

1. Search for your app  in the **Select** field.
1. Select your app from the list.
1. Click **Select**.
1. Select **Review + assign**.
    :::image type="content" source="./media/metrics-store-custom-rest-api/select-members.png" alt-text="A screenshot showing the members tab of the role assignment page.":::

## Get an authorization token

Send the following request in the command prompt or using a client like Postman.

```shell
curl -X POST 'https://login.microsoftonline.com/<tennant ID>/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=<your apps client ID>' \
--data-urlencode 'client_secret=<your apps client secret' \
--data-urlencode 'resource=https://monitor.azure.com'
```

The response body appears as follows:  

```JSON
{
    "token_type": "Bearer",
    "expires_in": "86399",
    "ext_expires_in": "86399",
    "expires_on": "1672826207",
    "not_before": "1672739507",
    "resource": "https://monitoring.azure.com",
    "access_token": "eyJ0eXAiOiJKV1Qi....gpHWoRzeDdVQd2OE3dNsLIvUIxQ"
}
```

Save the access token from the response for use in the following HTTP requests.

## Send a metric via the REST API

1. Paste the following JSON into a file, and save it as **custommetric.json** on your local computer. Update the time parameter so that it is within the last 20 minutes.  You can't put a metric into the store that's over 20 minutes old. The metric store is optimized for alerting and real-time charting.
    
    ```JSON
    { 
        "time": "2023-01-03T11:00:20", 
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

1. Submit the following HTTP POST request using the following variables:
   - **location**: Deployment region of the resource you're emitting metrics for.
   - **resourceId**:   Resource ID of the Azure resource you're tracking the metric against.  
   - **accessToken**:  The authorization token acquired from the previous step.
    
    ```Shell
    curl -X POST 'https://<location>.monitoring.azure.com/<resourceId>/metrics' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer <accessToken>' \
    -d @custommetric.json 
    ```

1. Change the timestamp and values in the JSON file. 
1. Repeat the previous two steps a number of times, to create data for several minutes.

## Troubleshooting

If you receive an error message with some part of the process, consider the following troubleshooting information:

- If you can't issue metrics against a subscription or resource group, or resource, check that your application or Service Principal has the **Monitoring Metrics Publisher** role assigned in Access control (IAM).
- Check that the number of dimension names matches the number values.
- Check that you are not emitting metrics against a region that doesn’t support custom metrics. See [supported regions](./metrics-custom-overview.md#supported-regions).

## View your metrics

1. Sign in to the Azure portal.

1. In the left-hand menu, select **Monitor**.

1. On the **Monitor** page, select **Metrics**.

   ![Select Metrics](./media/metrics-store-custom-rest-api/metrics.png)

1. Change the aggregation period to **Last hour**.  

1. In the **Scope** drop-down menu, select the resource you send the metric for.  

1. In the **Metric namespace** drop-down menu, select **QueueProcessing**.

1. In the **Metric** drop-down menu, select **QueueDepth**.  

## Next steps

- Learn more about [custom metrics](./metrics-custom-overview.md).

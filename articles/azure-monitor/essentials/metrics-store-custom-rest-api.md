---
title: Send metrics to the Azure Monitor metric database by using a REST API
description: Learn how to send custom metrics for an Azure resource to the Azure Monitor metrics store by using a REST API.
author: EdB-MSFT
services: azure-monitor
ms.reviewer: priyamishra
ms.topic: how-to
ms.date: 10/18/2023
ms.author: edbaynash
---
# Send custom metrics for an Azure resource to the Azure Monitor metrics store by using a REST API

This article shows you how to send custom metrics for Azure resources to the Azure Monitor metrics store via a REST API. When the metrics are in Azure Monitor, you can do all the things with them that you do with standard metrics. For example, you can generate charts and alerts and route the metrics to other external tools.

> [!NOTE]
> The REST API only permits sending custom metrics for Azure resources. To send metrics for resources in other environments or on-premises, use [Application Insights](../app/api-custom-events-metrics.md).

## Create and authorize a service principal to emit metrics

A service principal is an application whose tokens can be used to authenticate and grant access to specific Azure resources by using Microsoft Entra ID (formerly _Azure Active Directory_). Resources include user apps, services, or automation tools.

1. [Create a Microsoft Entra application and service principal](../../active-directory/develop/howto-create-service-principal-portal.md) that can access resources.

1. Save the tenant ID, new client ID, and client secret value for your app for use in token requests.

1. The app must be assigned the **Monitoring Metrics Publisher** role for the resources you want to emit metrics against. If you plan to use the app to emit custom metrics against many resources, you can assign the role at the resource group or subscription level. For more information, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Get an authorization token

Send the following request in the command prompt or by using a client like Postman.

```console
curl -X POST 'https://login.microsoftonline.com/<tennant ID>/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=<your apps client ID>' \
--data-urlencode 'client_secret=<your apps client secret' \
--data-urlencode 'resource=https://monitor.azure.com'
```

The response body appears:

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

1. Paste the following JSON into a file. Save it as *custommetric.json* on your local computer. Update the time parameter so that it's within the last 20 minutes. You can't put a metric into the store that's more than 20 minutes old. The metrics store is optimized for alerting and real-time charting.
    
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

1. Submit the following HTTP POST request by using the following variables:
   - **location**: Deployment region of the resource you're emitting metrics for.
   - **resourceId**: Resource ID of the Azure resource you're tracking the metric against.
   - **accessToken**: The authorization token acquired from the previous step.
    
    ```console
    curl -X POST 'https://<location>/.monitoring.azure.com<resourceId>/metrics' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer <accessToken>' \
    -d @custommetric.json 
    ```

1. Change the timestamp and values in the JSON file. The 'time' value in the JSON file is expected to be in UTC.

1. Repeat the previous two steps a few times to create data for several minutes.

## Troubleshooting

If you receive an error message with some part of the process, consider the following troubleshooting information:

- If you can't issue metrics against a subscription or resource group, or resource, check that your application or service principal has the **Monitoring Metrics Publisher** role assigned in **Access control (IAM)**.
- Check that the number of dimension names matches the number of values.
- Check that you aren't emitting metrics against a region that doesn't support custom metrics. For more information, see [supported regions](./metrics-custom-overview.md#supported-regions).

## View your metrics

1. Sign in to the Azure portal.

1. In the menu on the left, select **Monitor**.

1. On the **Monitor** page, select **Metrics**.

   :::image type="content" source="./media/metrics-store-custom-rest-api/metrics.png" alt-text="Screenshot that shows how to select Metrics in the Azure portal.":::

1. Change the aggregation period to **Last hour**.

1. In the **Scope** dropdown list, select the resource you send the metric for.

1. In the **Metric Namespace** dropdown list, select **queueprocessing**.

1. In the **Metric** dropdown list, select **QueueDepth**.

## Next steps

Learn more about [custom metrics](./metrics-custom-overview.md).

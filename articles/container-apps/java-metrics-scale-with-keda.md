---
title: "Tutorial: Scale a container app with Java metrics"
description: Scale a container app with Java metrics.
services: azure-container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: tutorial
ms.date: 12/23/2024
ms.author: cshoe
#customer intent: As a developer, I want to set up auto scale using Java metrics exposed from Azure Container Apps
---

# Tutorial: Scale a container app with Java metrics

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. You can create your own scale rules with [customized event sources](./scale-app.md#custom).

In this tutorial, you add a custom scale rule to scale your container app with Java metrics and observe how your application scales.

## Prerequisites

* An Azure account with an active subscription. If you don't already have one, you can [create one for free](https://azure.microsoft.com/free/).
* [Azure CLI](/cli/azure/install-azure-cli).
* [A Java application deployed in Azure Container Apps](java-get-started.md).

## Set up the environment

Use the following steps to define environment variables and set up the environment.

1. Create variables to support your scale configuration. 

    ```bash
    export LOCATION=eastus
    export TENANT_ID={tenant-id}
    export SUBSCRIPTION_ID={subscription-id}
    export RESOURCE_GROUP=my-resource-group
    export APP_NAME=my-aca-app
    export IDENTITY_NAME=my-identity
    ```

   | Variable                | Description                                                                        |
   |-------------------------|------------------------------------------------------------------------------------|
   | `LOCATION`              | The Azure region location where you create your Azure Container Apps.              |
   | `TENANT_ID`             | Your tenant's ID.                                                                  |
   | `SUBSCRIPTION_ID`       | The subscription ID which you use to create your Azure Container Apps.             |
   | `RESOURCE_GROUP`        | The Azure resource group name for your Azure Container Apps.                       |
   | `APP_NAME`              | The app name for your Azure Container Apps.                                        |
   | `IDENTITY_NAME`         | The name for your managed identity, which is assigned to your Azure Container Apps.|

1. Sign in to Azure with the Azure CLI.

   ```azurecli
   az login
   ```

## Set up a managed identity for your Azure Container Apps
To scale with Azure Container Apps platform metrics, you need a managed identity to access metrics from Azure Monitor.

1. Create a user-assigned identity and assign it to your Azure Container Apps. You can follow the doc [add a user-assigned identity](./managed-identity.md#add-a-user-assigned-identity). After you create the identity, run the CLI command to set the identity ID.

    ```azurecli
    USER_ASSIGNED_IDENTITY_ID=$(az identity show --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME --query "id" --output tsv)
    ```

2. Grant the `Monitoring Reader` role for your managed identity to read data from Azure Monitor. You can find more details about the roles for Azure Monitor in [Azure built-in roles for Monitor](../role-based-access-control/built-in-roles/monitor.md#monitoring-reader).

    ```azurecli
    # Get the principal ID for your managed identity
    PRINCIPAL_ID=$(az identity show --resource-group $RESOURCE_GROUP --name $IDENTITY_NAME --query "principalId" --output tsv)
   
    az role assignment create --assignee $PRINCIPAL_ID --role "Monitoring Reader" --scope /subscriptions/$SUBSCRIPTION_ID
    ```

## Add a scale rule with Azure Monitor metrics
To scale with Azure Monitor metrics, you can refer to [Azure Monitor KEDA scaler](https://keda.sh/docs/2.16/scalers/azure-monitor/) to define your Container Apps scale rule. 

Here's a list of core metadata to set up the scale rule.

| Metadata key                       | Description                                                                                           |
|------------------------------------|-------------------------------------------------------------------------------------------------------|
| tenantId                           | ID of the tenant that contains the Azure resource.                                                    |
| subscriptionId                     | ID of the Azure subscription that contains the Azure resource.                                         |
| resourceGroupName                  | Name of the resource group for the Azure resource.                                                    |
| resourceURI                        | Shortened URI to the Azure resource with format `<resourceProviderNamespace>/<resourceType>/<resourceName>`. |
| metricName                         | Name of the metric to query.                                                                          |
| metricAggregationType              | Aggregation method of the Azure Monitor metric. Options include Average, Total, Maximum.              |
| metricFilter                       | Name of the filter to be more specific by using dimensions listed in the official documentation. (Optional) |
| metricAggregationInterval          | Collection time of the metric in format "hh:mm:ss" (Default: "0:5:0", Optional)                       |
| targetValue                        | Target value to trigger scaling actions. (This value can be a float)                                  |



Add a scale rule with [Azure Monitor metrics for Azure Container Apps](./metrics.md) for your application.

### [Azure CLI](#tab/azurecli)

```azurecli
az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --min-replicas 1 \
        --max-replicas 10 \
        --scale-rule-name scale-with-azure-monitor-metrics \
        --scale-rule-type azure-monitor \
        --scale-rule-metadata "tenantId=${TENANT_ID}" \
                            "subscriptionId=${SUBSCRIPTION_ID}" \
                            "resourceGroupName=${RESOURCE_GROUP}" \
                            "resourceURI=Microsoft.App/containerapps/${APP_NAME}" \
                            "metricName=JvmGcCount" \
                            "metricAggregationType=Total" \
                            "metricAggregationInterval=0:1:0" \
                            "targetValue=30" \
        --scale-rule-identity $USER_ASSIGNED_IDENTITY_ID
```

### [ARM Template](#tab/arm-template)

```json
{
    "resources": {
        "properties": {
            "template": {
                "scale": {
                    "minReplicas": 1,
                    "maxReplicas": 10,
                    "rules": [
                        {
                            "name": "scale-with-azure-monitor-metrics",
                            "custom": {
                                "type": "azure-monitor",
                                "metadata": {
                                    "metricAggregationInterval": "0:1:0",
                                    "metricAggregationType": "Total",
                                    "metricName": "JvmGcCount",
                                    "resourceGroupName": "<your-resource-group>",
                                    "resourceURI": "Microsoft.App/containerapps/<your-app>",
                                    "subscriptionId": "<your-subscription-id>",
                                    "targetValue": "30",
                                    "tenantId": "<your-tenant-id>"
                                },
                                "identity": "<your-managed-identity-id>"
                            }
                        }
                    ]
                }
            }
        }
    }
}
```

---

This command adds a scale rule to your container app with the name `scale-with-azure-monitor-metrics`
- The scale type is set to `azure-monitor`.
- KEDA uses the managed identity with resource ID `USER_ASSIGNED_IDENTITY_ID` to authenticate with Azure Monitor and query metrics for your container app. 
- KEDA queries the metric `JvmGcCount`, and aggregates the metric values within 1 minute with aggregation type `Total`. 
- The target value is set to `30`, which means KEDA calculates the `desiredReplicas` using `ceil(AggregatedMetricValue(JvmGcCount)/30)`.  

> [!NOTE]
> The metric `JvmGcCount` is only used as an example. You can use any metric from Azure Monitor. Before setting up the scale rule, view the metrics in the Azure portal to determine the appropriate metric, aggregation interval, and target value based on your application's requirements. Additionally, consider using the built-in [HTTP/TCP scale rules](./scale-app.md#http), which can meet most common scaling scenarios, before opting for a custom metric.

## View scaling in Azure portal (optional)
Once your new revision is ready, [send requests](./tutorial-scaling.md#send-requests) to your container app to trigger auto scale with your Java metrics. 
1. Go to the `Metrics` blade in the Azure portal for your Azure Container Apps.
1. Add a chart, use the metric `jvm.gc.count`, with filter `Revision=<your-revision>`, aggregation using `Sum`, and split by `Replica`. You can see the `JvmGcCount` metric value for each replica in this chat.
1. Add a chart, use the metric `jvm.gc.count`, with filter `Revision=<your-revision>` and aggregation using `Sum`. You can see the total aggregated `JvmGcCount` metric value for the revision in this chat.
1. Add a chart, use the metric `Replica Count`, with filter `Revision=<your-revision>` and aggregation using `Max`. You can see the replica count for the revision in this chat.


Here's a sample metric snapshot for the example scale rule.

:::image type="content" source="media/java-metrics-keda/keda-auto-scale-java-gc-portal.png" alt-text="Screenshot of KEDA scale with JVM metrics." lightbox="media/java-metrics-keda/keda-auto-scale-java-gc-portal.png":::

1. Initially, there's one replica (the `minReplicas`) for the app.
1. A spike in requests causes the Java app to experience frequent JVM garbage collection (GC).
1. KEDA observes the aggregated metric value for `jvm.gc.count` is increased to `256`, and calculates the `desiredReplicas` value as `ceil(256/30)=9`.
1. KEDA scales out the container app's replica count to 9.
1. The http traffic is distributed across more replicas, reducing the average GC count.
1. The GC count further decreases when no requests are coming in.
1. After a cooldown period, KEDA scales the replica count down to `minReplicas=1`.

## Scale Log

To view the KEDA scale logs, you can run the query in `Logs` blade.

```kusto
ContainerAppSystemLogs
| where RevisionName == "<your-revision>"
| where EventSource == "KEDA"
| project TimeGenerated, Type, Reason, ContainerAppName, Log
```

:::image type="content" source="media/java-metrics-keda/keda-auto-scale-java-log.png" alt-text="Screenshot of KEDA scale log query." lightbox="media/java-metrics-keda/keda-auto-scale-java-log.png":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

> [!div class="nextstepaction"]
- [Set scaling rules in Azure Container Apps](./scale-app.md)
- [Java metrics for Azure Container Apps](./java-metrics.md)
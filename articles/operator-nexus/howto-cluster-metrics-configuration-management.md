---
title: "Azure Operator Nexus: How to configure cluster metrics configuration management"
description: This docuemnt provides instructions on how to create, list, update, retrieve, and delete cluster metrics configurations.
author: bryan-strassner
ms.author: bstrassner
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/09/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Cluster metrics configuration

When the user deploys a Cluster, a standard set of metrics gets enabled for collection. For the list of metrics, see
[List of Metrics Collected](List-of-metrics-collected.md).

Users can't control the behavior (enable or disable) for collection of these included standard metrics. Though, users can control the collection of some optional metrics that aren't part of the link to the list. To enable this experience, users have to create and update a MetricsConfiguration resource for a cluster. By default, creation of this MetricsConfiguration resource doesn't change the collection of metrics. User has to update the resource to enable or disable these optional metrics collection.  

> [!NOTE] 
> * For a cluster, at max, only one MetricsConfiguration resource can be created.
> * Users need to create a MetricsConfiguration resource to check a list of optional metrics that can be controlled. 
> * Deletion of the MetricsConfiguration resource results in the standard set of metrics being restored.

## How to manage cluster metrics configuration

To support the lifecycle of cluster metrics configurations, the following interactions allow for the creation and management of a cluster's metrics configurations.

### Creating a metrics configuration

Use the `az network cluster metricsconfiguration create` command to create metrics configuration for cluster. If you have multiple Azure subscriptions, user must pass subscription ID either using a flag `--subscription <SUBSCRIPTION_ID>` to the CLI command or select the appropriate subscription ID using the [az account set](/cli/azure/account#az-account-set) command.

```azurecli
az networkcloud cluster metricsconfiguration create \
 --cluster-name "<CLUSTER>" \
 --extended-location name="<CLUSTER_EXTENDED_LOCATION_ID>" type="CustomLocation" \
 --location "<LOCATION>" \
 --collection-interval <COLLECTION_INTERVAL (1-1440)> \
 --enabled-metrics "<METRIC_TO_ENABLE_1>" "<METRIC_TO_ENABLE_2>" \
 --tags <TAG_KEY1>="<TAG_VALUE1>" <TAG_KEY2>="<TAG_VALUE2>" \
 --resource-group "<RESOURCE_GROUP>"
```

* Replace values within `<` `>` with your specific information.
* Query the cluster resource and find the value of `<CLUSTER-EXTENDED-LOCATION-ID>` in the `properties.clusterExtendedLocation`
* The `collection-interval` field is a mandatory field, and `enabled-metrics` is an optional field.

Alternatively, operators can provide the list of enabled metrics via json or yaml file.

Example: enabled-metrics.json file
```json
[
   "metric_1",
   "metric_2"
]
```

Example: enabled-metrics.yaml file
```yaml
- "metric_1"
- "metric_2"
```

Example command to use enabled-metrics json/yaml file:
```azurecli
az networkcloud cluster metricsconfiguration create \
 --cluster-name "<CLUSTER>" \
 --extended-location name="<CLUSTER_EXTENDED_LOCATION_ID>" type="CustomLocation" \
 --location "<LOCATION>" \
 --collection-interval <COLLECTION_INTERVAL (1-1440)> \
 --enabled-metrics <path-to-yaml-or-json-file> \
 --tags <TAG_KEY1>="<TAG_VALUE1>" <TAG_KEY2>="<TAG_VALUE2>" \
 --resource-group "<RESOURCE_GROUP>"
```

Here, \<path-to-yaml-or-json-file\> can be ./enabled-metrics.json or ./enabled-metrics.yaml (place the file under current working directory) before performing the action.

To see all available parameters and their description run the command:
```azurecli
az networkcloud cluster metricsconfiguration create --help
```

#### Metrics configuration elements

| Parameter name                        | Description                                                                                        |
| --------------------------------------| -------------------------------------------------------------------------------------------------- |
| CLUSTER                               | Resource Name of Cluster                                                                           |
| LOCATION                              | The Azure Region where the Cluster is deployed                                                     | 
| CLUSTER_EXTENDED_LOCATION_ID          | The Cluster extended Location from Azure portal                                                    |
| COLLECTION_INTERVAL                   | The collection frequency for default standard metrics                                              |
| RESOURCE_GROUP                        | The Cluster resource group name                                                                    |
| TAG_KEY1                              | Optional tag1 to pass to MetricsConfiguration create                                                            |
| TAG_VALUE1                            | Optional tag1 value to pass to MetricsConfiguration create                                                      |
| TAG_KEY2                              | Optional tag2 to pass to MetricsConfiguration create                                                            |
| TAG_VALUE2                            | Optional tag2 value to pass to MetricsConfiguration create                                                      |
| METRIC_TO_ENABLE_1                    | Optional metric "METRIC_TO_ENABLE_1" enabled in addition to the default metrics                    |
| METRIC_TO_ENABLE_2                    | Optional metric "METRIC_TO_ENABLE_2" enabled in addition to the default metrics                    |

Specifying `--no-wait --debug` options in az command results in the execution of this command asynchronously. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

> [!NOTE] 
> * The default metrics collection interval for standard set of metrics is set to every 5 minutes. Changing the `collectionInterval` will also impact the collection frequency for default standard metrics.
> * There can be only one set of metrics configuration defined per cluster. The resource is created with the name `default`.

### List the metrics configuration

You can check the metrics configuration resource for a specific cluster by using `az networkcloud cluster metricsconfiguration list` command:

```azurecli
az networkcloud cluster metricsconfiguration list \
 --cluster-name "<CLUSTER>" \
 --resource-group "<RESOURCE_GROUP>"
```

### Retrieving a metrics configuration

After a metrics configuration gets created, Operators can check the details for resource using `az networkcloud cluster metricsconfiguration show` command:

```azurecli
az networkcloud cluster metricsconfiguration show \
 --cluster-name "<CLUSTER>" \
 --resource-group "<RESOURCE_GROUP>"
```

This command returns a JSON representation of the metrics configuration. You can observe the list of enabled and disabled metrics in addition to the collection frequency as an output for this command.

### Updating a metrics configuration

Much like the creation of a metrics configuration, Operators can perform an update action to change the configuration or update the tags assigned to the metrics configuration. 

```azurecli
az networkcloud cluster metricsconfiguration update \
 --cluster-name "<CLUSTER>" \
 --collection-interval <COLLECTION_INTERVAL (1-1440)> \
 --enabled-metrics "<METRIC_TO_ENABLE_1>" "<METRIC_TO_ENABLE_2>" \
 --tags <TAG_KEY1>="<TAG_VALUE1>" <TAG_KEY2>="<TAG_VALUE2>" \
 --resource-group "<RESOURCE_GROUP>"
```

Operators can update `collection-interval` independent of `enabled-metrics` list. Omit fields that aren't getting changed.

Specifying `--no-wait --debug` options in az command results in the execution of this command asynchronously. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

### Deleting a metrics configuration

Deletion of the metrics configuration returns the cluster to an unaltered configuration. To delete a metrics configuration, use the command:

```azurecli
az networkcloud cluster metricsconfiguration delete \
 --cluster-name "<CLUSTER>" \
 --resource-group "<RESOURCE_GROUP>"
```

Specifying `--no-wait --debug` options in az command results in the execution of this command asynchronously. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

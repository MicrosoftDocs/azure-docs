---
title: "Azure Operator Nexus: How to configure cluster metrics configuration management"
description: Instructional for the inputs and methods for creating, updating, retrieving, and deleting cluster metrics configurations.
author: bryan-strassner
ms.author: bstrassner
ms.service: azure
ms.topic: how-to
ms.date: 02/09/2023
ms.custom: template-how-to
---

# Cluster metrics configuration

When the user deploys a Cluster, a standard set of metrics are enabled for collection. For the list of metrics, see
[List of Metrics Collected](List-of-metrics-collected.md).

Users can't control the behavior (enable or disable) for collection of these included standard metrics. Though, users can control the collection of some optional metrics that aren't part of the link to the list. To enable this experience, users will have to create and update a MetricsConfiguration resource for a cluster. By default, creation of this MetricsConfiguration resource doesn't change the collection of metrics. User will have to update the resource to enable or disable these optional metrics collection.  

> [!NOTE] 
> * For a cluster, at max, only one MetricsConfiguration resource can be created.
> * Users need to create a MetricsConfiguration resource to check a list of optional metrics that can be controlled. 
> * Deletion of the MetricsConfiguration resource will result in the standard set of metrics being restored.

## How to manage cluster metrics configuration

To support the lifecycle of cluster metrics configurations, the following `az rest` interactions allow for the creation and management of a cluster's metrics configurations.

### Creating a metrics configuration

Use of the `az rest` command requires that the request input is defined, and then a `PUT` request is made to the `Microsoft.NetworkCloud` resource provider.

Define a file with the desired metrics configuration.

* Replace values within `<` `>` with your specific information.
* Query the cluster resource and find the value of `<CLUSTER-EXTENDED-LOCATION-ID>` in the `properties.clusterExtendedLocation`
* The `collectionInterval` field is required, `enabledMetrics` is optional and may be omitted.

Example filename: create_metrics_configuration.json

```json
{
    "location": "<REGION (example: eastus)>",
    "extendedLocation": {
        "name": "<CLUSTER-EXTENDED-LOCATION-ID>",
        "type": "CustomLocation"
    },
    "properties": {
        "collectionInterval": <COLLECTION-INTERVAL (1-1440)>,
        "enabledMetrics": [
            "<METRIC-TO-ENABLE-1>",
            "<METRIC-TO-ENABLE-2>"
        ]
    }
}
```

> [!NOTE] 
> * The default metrics collection interval for standard set of metrics is set to every 5 minutes. Changing the `collectionInterval` will also impact the collection frequency for default standard metrics.

The following commands will create the metrics configuration. The only name allowed for the metricsConfiguration is `default`.

```sh
export SUBSCRIPTION=<the subscription id for the cluster>
export RESOURCE_GROUP=<the resource group for the cluster>
export CLUSTER=<the cluter name>

az rest -m put -u "https://management.azure.com/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.NetworkCloud/clusters/${CLUSTER}/metricsConfigurations/default?api-version=2022-12-12-preview" -b @create_metrics_configuration.json --debug
```

Specifying `--debug` in REST API will result in the tracking operation status in the returned command output. This operation status can be queried to monitor the progress of the operation. See: [How-to track asynchronous operations](howto-track-async-operations-cli.md).

## Retrieving a metrics configuration

After a metrics configuration is created, it can be retrieved using a `az rest` command:

```sh
export SUBSCRIPTION=<the subscription id for the cluster>
export RESOURCE_GROUP=<the resource group for the cluster>
export CLUSTER=<the cluter name>

az rest -m get -u "https://management.azure.com/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.NetworkCloud/clusters/${CLUSTER}/metricsConfigurations/default?api-version=2022-12-12-preview"
```

This command will return a JSON representation of the metrics configuration.

## Updating a metrics configuration

Much like the creation of a metrics configuration, an update can be performed to change the configuration. A file, containing the metrics to be updated, is consumed as an input.

Example filename: update_metrics_configuration.json

```json
{
    "properties": {
        "collectionInterval": <COLLECTION-INTERVAL (1-1440)>,
        "enabledMetrics": [
            "<METRIC-TO-ENABLE-1>",
            "<METRIC-TO-ENABLE-2>"
        ]
    }
}
```

This file is used as input to an `az rest` command. The change may include either or both of the updatable fields, `collectionInterval` or `enabledMetrics`. The `collectionInterval` can be updated independently of `enabledMetrics`. Omit fields that aren't being changed.

```sh
export SUBSCRIPTION=<the subscription id for the cluster>
export RESOURCE_GROUP=<the resource group for the cluster>
export CLUSTER=<the cluter name>

az rest -m put -u "https://management.azure.com/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.NetworkCloud/clusters/${CLUSTER}/metricsConfigurations/default?api-version=2022-12-12-preview" -b @update_metrics_configuration.json --debug
```

Specifying `--debug` in REST API will result in the tracking operation status in the returned command output. This operation status can be queried to monitor the progress of the operation. See: [How-to track asynchronous operations](howto-track-async-operations-cli.md).

## Deleting a metrics configuration

Deletion of the metrics configuration will return the cluster to an unaltered configuration. To delete a metrics configuration, `az rest` API is used.

```sh
export SUBSCRIPTION=<the subscription id for the cluster>
export RESOURCE_GROUP=<the resource group for the cluster>
export CLUSTER=<the cluter name>

az rest -m delete -u "https://management.azure.com/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.NetworkCloud/clusters/${CLUSTER}/metricsConfigurations/default?api-version=2022-12-12-preview" --debug
```

Specifying `--debug` in REST API will result in the tracking operation status in the returned command output. This operation status can be queried to monitor the progress of the operation. See: [How-to track asynchronous operations](howto-track-async-operations-cli.md).

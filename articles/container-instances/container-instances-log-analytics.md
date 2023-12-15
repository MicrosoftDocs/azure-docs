---
title: Collect & analyze resource logs
description: Learn how to send resource logs and event data from container groups in Azure Container Instances to Azure Monitor logs
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
---
# Container group and instance logging with Azure Monitor logs

Log Analytics workspaces provide a centralized location for storing and querying log data not only from Azure resources, but also on-premises resources and resources in other clouds. Azure Container Instances includes built-in support for sending logs and event data to Azure Monitor logs.

To send container group log and event data to Azure Monitor logs, specify an existing Log Analytics workspace ID and workspace key when configuring a container group. 

The following sections describe how to create a logging-enabled container group and how to query logs. You can also [update a container group](container-instances-update.md) with a workspace ID and workspace key to enable logging.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

To enable logging in your container instances, you need the following:

* [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md)
* [Azure CLI](/cli/azure/install-azure-cli) (or [Cloud Shell](../cloud-shell/overview.md))

## Get Log Analytics credentials

Azure Container Instances needs permission to send data to your Log Analytics workspace. To grant this permission and enable logging, you must provide the Log Analytics workspace ID and one of its keys (either primary or secondary) when you create the container group.

To obtain the log analytics workspace ID and primary key:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **Settings**, select **Agents management**
1. Take note of:
   * **Workspace ID**
   * **Primary key**

## Create container group

Now that you have the log analytics workspace ID and primary key, you're ready to create a logging-enabled container group.

The following examples demonstrate two ways to create a container group that consists of a single [fluentd][fluentd] container: Azure CLI, and Azure CLI with a YAML template. The fluentd container produces several lines of output in its default configuration. Because this output is sent to your Log Analytics workspace, it works well for demonstrating the viewing and querying of logs.

### Deploy with Azure CLI

To deploy with the Azure CLI, specify the `--log-analytics-workspace` and `--log-analytics-workspace-key` parameters in the [az container create][az-container-create] command. Replace the two workspace values with the values you obtained in the previous step (and update the resource group name) before running the following command.

> [!NOTE]
> The following example pulls a public container image from Docker Hub. We recommend that you set up a pull secret to authenticate using a Docker Hub account instead of making an anonymous pull request. To improve reliability when working with public content, import and manage the image in a private Azure container registry. [Learn more about working with public images.](../container-registry/buffer-gate-public-content.md)

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainergroup001 \
    --image fluent/fluentd \
    --log-analytics-workspace <WORKSPACE_ID> \
    --log-analytics-workspace-key <WORKSPACE_KEY>
```

### Deploy with YAML

Use this method if you prefer to deploy container groups with YAML. The following YAML defines a container group with a single container. Copy the YAML into a new file, then replace `LOG_ANALYTICS_WORKSPACE_ID` and `LOG_ANALYTICS_WORKSPACE_KEY` with the values you obtained in the previous step. Save the file as **deploy-aci.yaml**.

> [!NOTE]
> The following example pulls a public container image from Docker Hub. We recommend that you set up a pull secret to authenticate using a Docker Hub account instead of making an anonymous pull request. To improve reliability when working with public content, import and manage the image in a private Azure container registry. [Learn more about working with public images.](../container-registry/buffer-gate-public-content.md)

```yaml
apiVersion: 2019-12-01
location: eastus
name: mycontainergroup001
properties:
  containers:
  - name: mycontainer001
    properties:
      environmentVariables: []
      image: fluent/fluentd
      ports: []
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
  osType: Linux
  restartPolicy: Always
  diagnostics:
    logAnalytics:
      workspaceId: LOG_ANALYTICS_WORKSPACE_ID
      workspaceKey: LOG_ANALYTICS_WORKSPACE_KEY
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

Next, execute the following command to deploy the container group. Replace `myResourceGroup` with a resource group in your subscription (or first create a resource group named "myResourceGroup"):

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainergroup001 --file deploy-aci.yaml
```

You should receive a response from Azure containing deployment details shortly after issuing the command.

## View logs

After you've deployed the container group, it can take several minutes (up to 10) for the first log entries to appear in the Azure portal. 

To view the container group's logs in the `ContainerInstanceLog_CL` table:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **General**, select **Logs**  
1. Type the following query: `ContainerInstanceLog_CL | limit 50`
1. Select **Run**

You should see several results displayed by the query. If at first you don't see any results, wait a few minutes, then select the **Run** button to execute the query again. By default, log entries are displayed in **Table** format. You can then expand a row to see the contents of an individual log entry.

![Log Search results in the Azure portal][log-search-01]

## View events

You can also view events for container instances in the Azure portal. Events include the time the instance is created and when it is started. To view the event data in the `ContainerEvent_CL` table:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **General**, select **Logs**  
1. Type the following query: `ContainerEvent_CL | limit 50`
1. Select **Run**

You should see several results displayed by the query. If at first you don't see any results, wait a few minutes, then select the **Run** button to execute the query again. By default, entries are displayed in **Table** format. You can then expand a row to see the contents of an individual entry.

![Event Search results in the Azure portal][log-search-02]

## Query container logs

Azure Monitor logs includes an extensive [query language][query_lang] for pulling information from potentially thousands of lines of log output.

The basic structure of a query is the source table (in this article, `ContainerInstanceLog_CL` or `ContainerEvent_CL`) followed by a series of operators separated by the pipe character (`|`). You can chain several operators to refine the results and perform advanced functions.

To see example query results, paste the following query into the query text box, and select the **Run** button to execute the query. This query displays all log entries whose "Message" field contains the word "warn":

```query
ContainerInstanceLog_CL
| where Message contains "warn"
```

More complex queries are also supported. For example, this query displays only those log entries for the "mycontainergroup001" container group generated within the last hour:

```query
ContainerInstanceLog_CL
| where (ContainerGroup_s == "mycontainergroup001")
| where (TimeGenerated > ago(1h))
```

## Log schema

> [!NOTE]
> Some of the columns listed below only exist as part of the schema, and won't have any data emitted in logs. These columns are denoted below with a description of 'Empty'.

### ContainerInstanceLog_CL

|Column|Type|Description|
|-|-|-|
|Computer|string|Empty|
|ContainerGroup_s|string|The name of the container group associated with the record|
|ContainerID_s|string|A unique identifier for the container associated with the record|
|ContainerImage_s|string|The name of the container image associated with the record|
|Location_s|string|The location of the resource associated with the record|
|Message|string|If applicable, the message from the container|
|OSType_s|string|The name of the operating system the container is based on|
|RawData|string|Empty|
|ResourceGroup|string|Name of the resource group that the record is associated with|
|Source_s|string|Name of the logging component, "LoggingAgent"|
|SubscriptionId|string|A unique identifier for the subscription that the record is associated with|
|TimeGenerated|datetime|Timestamp when the event was generated by the Azure service processing the request corresponding the event|
|Type|string|The name of the table|
|_ResourceId|string|A unique identifier for the resource that the record is associated with|
|_SubscriptionId|string|A unique identifier for the subscription that the record is associated with|

### ContainerEvent_CL

|Column|Type|Description|
|-|-|-|
|Computer|string|Empty|
|ContainerGroupInstanceId_g|string|A unique identifier for the container group associated with the record|
|ContainerGroup_s|string|The name of the container group associated with the record|
|ContainerName_s|string|The name of the container associated with the record|
|Count_d|real|How many times the event has occurred since the last poll|
|FirstTimestamp_t|datetime|The timestamp of the first time the event occurred|
|Location_s|string|The location of the resource associated with the record|
|Message|string|If applicable, the message from the container|
|OSType_s|string|The name of the operating system the container is based on|
|RawData|string|Empty|
|Reason_s|string|The current status of the container group|
|ResourceGroup|string|The name of the resource group that the record is associated with|
|SubscriptionId|string|A unique identifier for the subscription that the record is associated with|
|TimeGenerated|datetime|Timestamp when the event was generated by the Azure service processing the request corresponding the event|
|Type|string|The name of the table|
|_ResourceId|string|A unique identifier for the resource that the record is associated with|
|_SubscriptionId|string|A unique identifier for the subscription that the record is associated with|

## Next steps

### Azure Monitor logs

For more information about querying logs and configuring alerts in Azure Monitor logs, see:

* [Understanding log searches in Azure Monitor logs](../azure-monitor/logs/log-query-overview.md)
* [Unified alerts in Azure Monitor](../azure-monitor/alerts/alerts-overview.md)


### Monitor container CPU and memory

For information about monitoring container instance CPU and memory resources, see:

* [Monitor container resources in Azure Container Instances](container-instances-monitor.md).

<!-- IMAGES -->
[log-search-01]: ./media/container-instances-log-analytics/portal-query-01.png
[log-search-02]: ./media/container-instances-log-analytics/portal-query-02.png

<!-- LINKS - External -->
[fluentd]: https://hub.docker.com/r/fluent/fluentd/
[query_lang]: /azure/data-explorer/

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create

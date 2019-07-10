---
title: Container instance logging with Azure Monitor logs
description: Learn how to send logs from Azure container instances to Azure Monitor logs.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: overview
ms.date: 07/09/2019
ms.author: danlep
---
# Container instance logging with Azure Monitor logs

Log Analytics workspaces provide a centralized location for storing and querying log data from not only Azure resources, but also on-premises resources and resources in other clouds. Azure Container Instances includes built-in support for sending data to Azure Monitor logs.

To send container instance data to Azure Monitor logs, you must specify a Log Analytics workspace ID and workspace key when creating a container group. The following sections describe creating a logging-enabled container group and querying logs.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

To enable logging in your container instances, you need the following:

* [Log Analytics workspace](../azure-monitor/learn/quick-create-workspace.md)
* [Azure CLI](/cli/azure/install-azure-cli) (or [Cloud Shell](/azure/cloud-shell/overview))

## Get Log Analytics credentials

Azure Container Instances needs permission to send data to your Log Analytics workspace. To grant this permission and enable logging, you must provide the Log Analytics workspace ID and one of its keys (either primary or secondary) when you create the container group.

To obtain the log analytics workspace ID and primary key:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **Settings**, select **Advanced settings**
1. Select **Connected Sources** > **Windows Servers** (or **Linux Servers**--the ID and keys are the same for both)
1. Take note of:
   * **WORKSPACE ID**
   * **PRIMARY KEY**

## Create container group

Now that you have the log analytics workspace ID and primary key, you're ready to create a logging-enabled container group.

The following examples demonstrate two ways to create a container group with a single [fluentd][fluentd] container: Azure CLI, and Azure CLI with a YAML template. The Fluentd container produces several lines of output in its default configuration. Because this output is sent to your Log Analytics workspace, it works well for demonstrating the viewing and querying of logs.

### Deploy with Azure CLI

To deploy with the Azure CLI, specify the `--log-analytics-workspace` and `--log-analytics-workspace-key` parameters in the [az container create][az-container-create] command. Replace the two workspace values with the values you obtained in the previous step (and update the resource group name) before running the following command.

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

```yaml
apiVersion: 2018-10-01
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

## View logs in Azure Monitor logs

After you've deployed the container group, it can take several minutes (up to 10) for the first log entries to appear in the Azure portal. To view the container group's logs:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **General**, select **Logs**  
1. Type the following query: `search *`
1. Select **Run**

You should see several results displayed by the `search *` query. If at first you don't see any results, wait a few minutes, then select the **Run** button to execute the query again. By default, log entries are displayed in **Table** format. You can then expand a row to see the contents of an individual log entry.

![Log Search results in the Azure portal][log-search-01]

## Query container logs

Azure Monitor logs includes an extensive [query language][query_lang] for pulling information from potentially thousands of lines of log output.

The Azure Container Instances logging agent sends entries to the `ContainerInstanceLog_CL` table in your Log Analytics workspace. The basic structure of a query is the source table (`ContainerInstanceLog_CL`) followed by a series of operators separated by the pipe character (`|`). You can chain several operators to refine the results and perform advanced functions.

To see example query results, paste the following query into the query text box (under "Show legacy language converter"), and select the **RUN** button to execute the query. This query displays all log entries whose "Message" field contains the word "warn":

```query
ContainerInstanceLog_CL
| where Message contains("warn")
```

More complex queries are also supported. For example, this query displays only those log entries for the "mycontainergroup001" container group generated within the last hour:

```query
ContainerInstanceLog_CL
| where (ContainerGroup_s == "mycontainergroup001")
| where (TimeGenerated > ago(1h))
```

## Next steps

### Azure Monitor logs

For more information about querying logs and configuring alerts in Azure Monitor logs, see:

* [Understanding log searches in Azure Monitor logs](../log-analytics/log-analytics-log-search.md)
* [Unified alerts in Azure Monitor](../azure-monitor/platform/alerts-overview.md)


### Monitor container CPU and memory

For information about monitoring container instance CPU and memory resources, see:

* [Monitor container resources in Azure Container Instances](container-instances-monitor.md).

<!-- IMAGES -->
[log-search-01]: ./media/container-instances-log-analytics/portal-query-01.png

<!-- LINKS - External -->
[fluentd]: https://hub.docker.com/r/fluent/fluentd/
[query_lang]: https://aka.ms/LogAnalyticsLanguage

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az-container-create
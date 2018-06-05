---
title: Container instance logging with Azure Log Analytics
description: Learn how container instance output logs to Azure Log Analytics.
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: overview
ms.date: 06/06/2018
ms.author: marsma
---
# Container instance logging with Azure Log Analytics

Log Analytics workspaces provide a centralized location for storing and querying log and telemetry data from not only Azure resources, but also on premises resources and those in other clouds. Azure Container Instances includes built-in support for sending data to Log Analytics.

To send container instance data to Log Analytics, you must create a container group by using the Azure CLI (or Cloud Shell) and a YAML file; the following sections describe how.

## Prerequisites

* [Log Analytics workspace](../log-analytics/log-analytics-quick-create-workspace.md)
* [Azure CLI](/cli/azure/install-azure-cli) (or [Cloud Shell](/azure/cloud-shell/overview))

## Get Log Analytics credentials

To enable your container instances to send data to Log Analytics, you must provide the Log Analytics workspace ID and primary or secondary auth key when you create the container group.

To obtain the Log Analytics workspace ID and primary key:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **SETTINGS**, select **Advanced settings**
1. Select **Connected Sources** > **Windows Servers** (or **Linux Servers**--the keys are identical for both)
1. Take note of:
   * **WORKSPACE ID**
   * **PRIMARY KEY**

## Create container group

Now that you have the Log Analytics workspace ID and primary key, you're ready to create the container group. The following example creates a container group with a single [fluentd][fluentd] container. The Fluentd container produces several lines of output in its default configuration. Because this output is sent to your Log Analytics workspace, it works well for demonstrating viewing and querying logs in the following sections.

First, copy the following YAML, which defines a container group with a single container, into a new file. Replace `LOG_ANALYTICS_WORKSPACE_ID` and `LOG_ANALYTICS_WORKSPACE_KEY` with the values you obtained in the previous step, then save the file as **deploy-aci.yaml**.

```yaml
apiVersion: 2018-06-01
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

Next, execute the following command to deploy the container group; replace `myResourceGroup` with a resource group in your subscription (or first create a resource group named "myResourceGroup"):

```azurecli-interactive
az container create -g myResourceGroup -n mycontainergroup001 -f deploy-aci.yaml
```

You should receive a response from Azure containing deployment details shortly after issuing the command.

## View logs in Log Analytics

After you've deployed the container group, it can take a few minutes for the first log entries to appear in the Azure portal. To view the container group's logs, open your Log Analytics workspace, then:

1. In the **OMS Workspace** overview, select **Log Search**
1. Under **A few more queries to try**, select the **All collected data** link

You should see several results displayed by the `search *` query. If at first you don't see any results, wait a few minutes, then select the **RUN** button to execute the query again. By default, log entries are displayed in "List" view--select **Table** to see the log entries in a more condensed format. You can then expand a row to see the contents of an individual log entry.

![Log Search results in the Azure Portal][log-search-01]

## Query container logs

Logs are valuable only when viewed, and more importantly, can be easily queried for specific types of information. Log Analytics includes an extensive [query language][query_lang] useful for pulling information from potentially thousands of lines of log output that would otherwise be nearly impossible to parse.

The Azure Container Instances logging agent sends log entries to the `ContainerInstanceLog_CL` table in the Log Analytics workspace. The basic structure of a query is the source table followed by a series of operators separated by a pipe character `|`. You can chain together multiple operators to refine the data and perform advanced functions.

To test a few example queries, paste one of the following into the query text box (under "Show legacy language converter") and select the **RUN** button to execute the query.

```query
ContainerInstanceLog_CL
| where Message contains("warn")
```

```query
ContainerInstanceLog_CL
| where Message contains("info")
```

## Configure alerts

TODO

## Next steps

For more details about querying logs and configuring alerts in Azure Log Analytics, see:

* [Understanding log searches in Log Analytics](../log-analytics/log-analytics-log-search.md)
* [Unified alerts in Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-unified-alerts.md)

<!-- IMAGES -->
[log-search-01]: ./media/container-instances-log-analytics/portal-query-01.png

<!-- LINKS - External -->
[fluentd]: https://hub.docker.com/r/fluent/fluentd/
[query_lang]: https://docs.loganalytics.io/

<!-- LINKS - Internal -->
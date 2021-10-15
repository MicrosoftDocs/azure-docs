---
title: Monitor an app in Azure Container Apps
description: Learn how applications are monitored and logged in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Monitor an app in Azure Container Apps

Azure Container Apps gathers a broad set of data about yoru apps and stores it using [Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md). This article describes the available logs, and how to write and view logs.

## Writing to a log

When you write to the [Standard output (stdout) or standard error (stderr) streams](https://wikipedia.org/wiki/Standard_streams), the Container Apps logging agents write logs for each message.

As a message is logged, the following information is gathered.

| Property | Description |
|---|---|
|ClusterName| Identifies the cluster from where the log originates.|
|AppName| Identifies the app revision emitting the log line. |
|PodName| Identifies the specific instance of the revision emitting the log line. |
|TimeGenerated|Date and time at which the logging agent received the log.|
|Stream|Shows whether `stdout` or `stderr` is used for logging.|
|Location|Location where the container app is hosted.|
|ContainerId|The container's unique identifier. You can use this value to help identify container crashes. |





### Simple text vs structured data

You can log a single text string or line of serialized JSON data. Information is displayed differently depending on what type of data you log.

|Data type | Description |
|---|---|
| A single line of text | Text appears in the `Log_s` column. |
| Serialized JSON | Data is parsed by the logging agent and displayed in columns that match the JSON object property names. |

## Viewing Logs

Data logged via a container app are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or with the CLI.

Use the following CLI command to view logs on the command line.

```azurecli
$ az monitor log-analytics query -w <workspace-d> --analytics-query "ContainerAppConsoleLogs_CL | where AppName_s contains 'myapp' | project AppName_s, Log_s, TimeGenerated | take 3" -o table
```

The following output demonstrates the type of response to expect from the CLI command.

```console
AppName_s      Log_s                                                       TableName      TimeGenerated
-------------  ----------------------------------------------------------  -------------  ------------------------
myapp-igsvt3p  INFO:     127.0.0.1:34504 - "GET /healthz HTTP/1.1" 200 OK  PrimaryResult  2021-07-26T11:33:01.079Z
myapp-ad07o77  INFO:     127.0.0.1:51410 - "GET /healthz HTTP/1.1" 200 OK  PrimaryResult  2021-07-26T11:33:42.084Z
myapp-ad07o77  INFO:     127.0.0.1:38612 - "GET /healthz HTTP/1.1" 200 OK  PrimaryResult  2021-07-26T11:34:26.564Z
```

## Next steps

> [!div class="nextstepaction"]
> [Secure your container app](secure-app.md)

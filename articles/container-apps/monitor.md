---
title: Write and view application logs in Azure Container Apps
description: Learn write and view logs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Monitor an app in Azure Container Apps

Azure Container Apps gathers a broad set of data about your container app and stores it using [Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md). This article describes the available logs, and how to write and view logs.

## Writing to a log

When you write to the [Standard output (stdout) or standard error (stderr) streams](https://wikipedia.org/wiki/Standard_streams), the Container Apps logging agents write logs for each message.

As a message is logged, the following information is gathered in the log table:

| Property | Remarks |
|---|---|
| `RevisionName` | |
| `ContainerAppName` | |
| `ContainerGroupID` | |
| `ContainerGroupName` | |
| `ContainerImage` | |
| `ContainerID` | The container's unique identifier. You can use this value to help identify container crashes. |
| `Stream` | Shows whether `stdout` or `stderr` is used for logging. |
| `EnvironmentName` | |

### Simple text vs structured data

You can log a single text string or line of serialized JSON data. Information is displayed differently depending on what type of data you log.

| Data type | Description |
|---|---|
| A single line of text | Text appears in the `Log_s` column. |
| Serialized JSON | Data is parsed by the logging agent and displayed in columns that match the JSON object property names. |

## Viewing Logs

Data logged via a container app are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or with the CLI.

Set the name of your resource group and Log Analytics workspace, and then retrieve the `LOG_ANALYTICS_WORKSPACE_CLIENT_ID` with the following commands.

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="my-containerapps"
LOG_ANALYTICS_WORKSPACE="containerapps-logs"
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE --out tsv`
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="my-containerapps"
$LOG_ANALYTICS_WORKSPACE="containerapps-logs"
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID = (Get-AzOperationalInsightsWorkspace -ResourceGroupName $RESOURCE_GROUP -Name $LOG_ANALYTICS_WORKSPACE).CustomerId
```

---

Use the following CLI command to view logs on the command line.

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated | take 3" \
  --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $LOG_ANALYTICS_WORKSPACE_CLIENT_ID -Query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated | take 3"
$queryResults.Results
```

---

The following output demonstrates the type of response to expect from the CLI command.

```console
ContainerAppName_s    Log_s                 TableName      TimeGenerated
--------------------  --------------------  -------------  ------------------------
my-container-app      listening on port 80  PrimaryResult  2021-10-23T02:09:00.168Z
my-container-app      listening on port 80  PrimaryResult  2021-10-23T02:11:36.197Z
my-container-app      listening on port 80  PrimaryResult  2021-10-23T02:11:43.171Z
```

## Next steps

> [!div class="nextstepaction"]
> [Monitor logs in Azure Container Apps with Log Analytics](log-monitoring.md)
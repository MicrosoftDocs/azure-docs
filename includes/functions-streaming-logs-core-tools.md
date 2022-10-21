---
author: ggailey777
ms.author: glenga
ms.date: 7/24/2019
ms.topic: include
ms.service: azure-functions
---

#### Built-in log streaming

Use the [`func azure functionapp logstream` command](../articles/azure-functions/functions-core-tools-reference.md#func-azure-functionapp-list-functions) to start receiving streaming logs of a specific function app running in Azure, as in the following example:

```bash
func azure functionapp logstream <FunctionAppName>
```

>[!NOTE]
>Built-in log streaming isn't yet enabled in Core Tools for function apps running on Linux in a Consumption plan. For these hosting plans, you instead need to use Live Metrics Stream to view the logs in near-real time.

#### Live Metrics Stream

You can view the [Live Metrics Stream](../articles/azure-monitor/app/live-stream.md) for your function app in a new browser window by including the `--browser` option, as in the following example:

```bash
func azure functionapp logstream <FunctionAppName> --browser
```

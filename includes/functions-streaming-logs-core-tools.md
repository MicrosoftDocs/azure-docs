---
author: ggailey777
ms.author: glenga
ms.date: 7/24/2019
ms.topic: include
ms.service: azure-functions
---

#### Built-in log streaming

Use the `logstream` option to start receiving streaming logs of a specific function app running in Azure, as in the following example:

```bash
func azure functionapp logstream <FunctionAppName>
```

#### Live Metrics Stream

You can also view the [Live Metrics Stream](../articles/azure-monitor/app/live-stream.md) for your function app in a new browser window by including the `--browser` option, as in the following example:

```bash
func azure functionapp logstream <FunctionAppName> --browser
```

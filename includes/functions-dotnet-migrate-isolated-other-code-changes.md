---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 03/28/2024
ms.author: mahender
---

#### JSON serialization

By default, the isolated worker model uses `System.Text.Json` for JSON serialization. To customize serializer options or switch to JSON.NET (`Newtonsoft.Json`), see [these instructions](../articles/azure-functions/dotnet-isolated-process-guide.md#customizing-json-serialization).

#### Application Insights log levels and filtering

Logs can be sent to Application Insights from both the Functions host runtime and code in your project. The `host.json` allows you to configure rules for host logging, but to control logs coming from your code, you'll need to configure filtering rules as part of your `Program.cs`. See [Managing log levels in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#managing-log-levels) for details on how to filter these logs.
